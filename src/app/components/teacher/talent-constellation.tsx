import React, { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { List, Eye } from "lucide-react";
import { PJS } from "../ui-kit";

// ─── Types ──────────────────────────────────────────────────────────
export interface ConstellationStudent {
  id: string;
  name: string;
  domain: string;
  progress: number;
  needsAttention?: boolean;
}

interface Star {
  s: ConstellationStudent;
  x: number;
  y: number;
  r: number;
  color: string;
}

// ─── Seeded PRNG (mulberry32) ───────────────────────────────────────
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ─── Constants ──────────────────────────────────────────────────────
const VB_W = 300;
const VB_H = 160;
const PAD = 16;
const MIN_DIST = 34;
const R_MIN = 4;
const R_MAX = 9;

const CARD_BG = "#2E3E35";
const LABEL_CLR = "#EAF3DE";
const SUB_CLR = "#A9C4B5";
const TERRACOTTA_LIGHT = "#E8B4A0";

const DEFAULT_COLORS: Record<string, string> = {
  "Seni Visual": "#E59A88",
  "Desain Spasial": "#8BB098",
  "Motorik Halus": "#E6C27A",
  "Musik Perkusi": "#7BAFD4",
  "Tari": "#C490D1",
  "Desain Digital": "#A8C4B0",
  "Bahasa": "#B8A9D4",
};

const BG_STARS = [
  { x: 28, y: 22 }, { x: 142, y: 18 }, { x: 268, y: 30 },
  { x: 80, y: 128 }, { x: 210, y: 138 }, { x: 175, y: 72 },
];

// ─── Helpers ────────────────────────────────────────────────────────
function getColor(domain: string, colors: Record<string, string>): string {
  return colors[domain] ?? DEFAULT_COLORS[domain] ?? "#A0C4A8";
}

function progressToRadius(progress: number): number {
  const t = Math.max(0, Math.min(100, progress)) / 100;
  return R_MIN + t * (R_MAX - R_MIN);
}

/** Distribute domains into anchor regions across the viewBox. */
function domainAnchors(domains: string[]): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>();
  const count = domains.length;
  if (count === 0) return map;

  // 2-column grid layout, up to 6 cells
  const cols = count <= 2 ? count : count <= 4 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const cellW = (VB_W - PAD * 2) / cols;
  const cellH = (VB_H - PAD * 2) / rows;

  domains.forEach((d, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    map.set(d, {
      x: PAD + cellW * col + cellW / 2,
      y: PAD + cellH * row + cellH / 2,
    });
  });
  return map;
}

/** Place stars with seeded jitter around domain anchors. */
function placeStars(
  students: ConstellationStudent[],
  colors: Record<string, string>,
): Star[] {
  const domains = [...new Set(students.map((s) => s.domain))];
  const anchors = domainAnchors(domains);

  const stars: Star[] = students.map((s) => {
    const rng = mulberry32(hashId(s.id));
    const anchor = anchors.get(s.domain) ?? { x: VB_W / 2, y: VB_H / 2 };
    const jitterX = (rng() - 0.5) * 60;
    const jitterY = (rng() - 0.5) * 40;
    return {
      s,
      x: anchor.x + jitterX,
      y: anchor.y + jitterY,
      r: progressToRadius(s.progress),
      color: getColor(s.domain, colors),
    };
  });

  // Clamp inside viewBox
  for (const st of stars) {
    st.x = Math.max(PAD + st.r, Math.min(VB_W - PAD - st.r, st.x));
    st.y = Math.max(PAD + st.r, Math.min(VB_H - PAD - st.r, st.y));
  }

  return stars;
}

/** Simple relaxation to separate overlapping stars. */
function relax(stars: Star[], iterations = 60): Star[] {
  const out = stars.map((s) => ({ ...s }));
  for (let iter = 0; iter < iterations; iter++) {
    let moved = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const dx = out[j].x - out[i].x;
        const dy = out[j].y - out[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minD = MIN_DIST + out[i].r + out[j].r;
        if (dist < minD && dist > 0.01) {
          const push = (minD - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          out[i].x -= nx * push;
          out[i].y -= ny * push;
          out[j].x += nx * push;
          out[j].y += ny * push;
          moved = true;
        }
      }
      // Keep inside viewBox
      out[i].x = Math.max(PAD + out[i].r, Math.min(VB_W - PAD - out[i].r, out[i].x));
      out[i].y = Math.max(PAD + out[i].r, Math.min(VB_H - PAD - out[i].r, out[i].y));
    }
    if (!moved) break;
  }
  return out;
}

// ─── Tooltip ────────────────────────────────────────────────────────
function StarTooltip({ star }: { star: Star }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
    >
      <rect
        x={star.x - 40}
        y={star.y - star.r - 42}
        width={80}
        height={30}
        rx={6}
        fill="#1B2A22"
        stroke={star.color}
        strokeWidth={1}
        opacity={0.95}
      />
      <text
        x={star.x}
        y={star.y - star.r - 28}
        textAnchor="middle"
        fill={LABEL_CLR}
        fontSize={9}
        fontWeight={700}
        fontFamily={PJS}
      >
        {star.s.name}
      </text>
      <text
        x={star.x}
        y={star.y - star.r - 17}
        textAnchor="middle"
        fill={SUB_CLR}
        fontSize={8}
        fontFamily={PJS}
      >
        {star.s.domain} · {star.s.progress}%
      </text>
    </motion.g>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div
      style={{ background: CARD_BG, borderRadius: 14, padding: 12 }}
      className="animate-pulse"
    >
      <div style={{ height: 13, width: 140, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginBottom: 6 }} />
      <div style={{ height: 11, width: 180, background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 12 }} />
      <div style={{ height: 100, background: "rgba(255,255,255,0.04)", borderRadius: 10 }} />
    </div>
  );
}

// ─── Empty state ────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ background: CARD_BG, borderRadius: 14, padding: 20, textAlign: "center" }}>
      <svg width={60} height={60} viewBox="0 0 60 60" style={{ margin: "0 auto 10px", opacity: 0.3 }}>
        <circle cx={20} cy={20} r={3} fill="#A9C4B5" />
        <circle cx={40} cy={15} r={2} fill="#A9C4B5" />
        <circle cx={30} cy={38} r={2.5} fill="#A9C4B5" />
        <circle cx={15} cy={42} r={1.5} fill="#A9C4B5" />
        <circle cx={48} cy={40} r={2} fill="#A9C4B5" />
      </svg>
      <p style={{ fontFamily: PJS, fontSize: 12, color: SUB_CLR, margin: 0, lineHeight: 1.5 }}>
        Belum ada pemetaan bakat. Mulai dari pengamatan pertama.
      </p>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export function TalentConstellation({
  students,
  domainColors = {},
  onSelectStudent,
  loading = false,
}: {
  students: ConstellationStudent[];
  domainColors?: Record<string, string>;
  onSelectStudent: (id: string) => void;
  loading?: boolean;
}) {
  const [view, setView] = useState<"constellation" | "list">("constellation");
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileTap, setMobileTap] = useState<string | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Compute constellation layout
  const stars = useMemo(() => {
    if (students.length === 0) return [];
    return relax(placeStars(students, domainColors));
  }, [students, domainColors]);

  // Domain → color map for legend
  const domains = useMemo(() => {
    const map = new Map<string, string>();
    for (const st of students) {
      if (!map.has(st.domain)) map.set(st.domain, getColor(st.domain, domainColors));
    }
    return map;
  }, [students, domainColors]);

  // Group students by domain for list view
  const grouped = useMemo(() => {
    const map = new Map<string, ConstellationStudent[]>();
    for (const st of students) {
      const arr = map.get(st.domain) ?? [];
      arr.push(st);
      map.set(st.domain, arr);
    }
    return map;
  }, [students]);

  const handleStarClick = useCallback(
    (id: string) => {
      // Mobile: first tap shows tooltip, second tap opens detail
      if ("ontouchstart" in window) {
        if (mobileTap === id) {
          onSelectStudent(id);
          setMobileTap(null);
        } else {
          setMobileTap(id);
        }
      } else {
        onSelectStudent(id);
      }
    },
    [mobileTap, onSelectStudent],
  );

  const handleKey = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectStudent(id);
      }
    },
    [onSelectStudent],
  );

  if (loading) return <Skeleton />;
  if (students.length === 0) return <EmptyState />;

  const showLabels = students.length <= 15;
  const noteFew = students.length > 0 && students.length < 3;

  return (
    <div style={{ background: CARD_BG, borderRadius: 14, padding: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 500, color: LABEL_CLR, margin: 0 }}>
            Konstelasi bakat kelas
          </p>
          <p style={{ fontFamily: PJS, fontSize: 11, color: SUB_CLR, margin: "1px 0 0" }}>
            Warna: bakat dominan. Ukuran: kemajuan.
          </p>
        </div>
        <button
          onClick={() => setView(view === "constellation" ? "list" : "constellation")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: 6,
            padding: "4px 8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: SUB_CLR,
            fontSize: 10,
            fontFamily: PJS,
            fontWeight: 600,
          }}
          title={view === "constellation" ? "Lihat sebagai daftar" : "Lihat peta bintang"}
          aria-label={view === "constellation" ? "Alihkan ke tampilan daftar" : "Alihkan ke tampilan konstelasi"}
        >
          {view === "constellation" ? <List size={12} /> : <Eye size={12} />}
          {view === "constellation" ? "Daftar" : "Peta"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === "constellation" ? (
          <motion.div
            key="constellation"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* SVG constellation */}
            <svg
              width="100%"
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              style={{ display: "block" }}
              role="img"
              aria-label="Peta konstelasi bakat siswa"
            >
              <title>Konstelasi bakat kelas</title>
              <desc>Peta bintang yang menunjukkan sebaran bakat siswa berdasarkan domain kemampuan dominan.</desc>

              {/* Background stars */}
              {BG_STARS.map((bs, i) => (
                <circle key={`bg-${i}`} cx={bs.x} cy={bs.y} r={1.2} fill="#A9C4B5" opacity={0.5} />
              ))}

              {/* Lines connecting same-domain stars */}
              {Array.from(domains.entries()).map(([domain]) => {
                const domainStars = stars
                  .filter((st) => st.s.domain === domain)
                  .sort((a, b) => a.x - b.x);
                if (domainStars.length < 2) return null;
                const color = domainStars[0].color;
                const points = domainStars.map((st) => `${st.x},${st.y}`).join(" ");
                return (
                  <motion.polyline
                    key={`line-${domain}`}
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    strokeOpacity={0.4}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    initial={prefersReduced ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={prefersReduced ? undefined : { duration: 0.6, delay: 0.2 }}
                  />
                );
              })}

              {/* Stars */}
              {stars.map((st, i) => {
                const isHovered = hovered === st.s.id;
                const isMobileTapped = mobileTap === st.s.id;
                const showTooltip = isHovered || isMobileTapped;
                const ariaLabel = `${st.s.name}, ${st.s.domain}, kemajuan ${st.s.progress} persen${st.s.needsAttention ? ", perlu perhatian" : ""}`;

                return (
                  <motion.g
                    key={st.s.id}
                    initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={
                      prefersReduced
                        ? undefined
                        : { duration: 0.25, delay: i * 0.04, type: "spring", stiffness: 300, damping: 20 }
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => handleStarClick(st.s.id)}
                    onKeyDown={(e) => handleKey(e, st.s.id)}
                    onMouseEnter={() => setHovered(st.s.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(st.s.id)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={ariaLabel}
                  >
                    {/* Halo */}
                    <circle cx={st.x} cy={st.y} r={st.r * 1.5} fill={st.color} opacity={0.2} />

                    {/* Dashed ring for needsAttention */}
                    {st.s.needsAttention && (
                      <circle
                        cx={st.x}
                        cy={st.y}
                        r={st.r + 8}
                        fill="none"
                        stroke={TERRACOTTA_LIGHT}
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        opacity={0.7}
                      />
                    )}

                    {/* Star dot */}
                    <circle cx={st.x} cy={st.y} r={st.r} fill={st.color} />

                    {/* Label */}
                    {showLabels && (
                      <text
                        x={st.x}
                        y={st.y + st.r + 11}
                        textAnchor="middle"
                        fill={LABEL_CLR}
                        fontSize={11}
                        fontFamily={PJS}
                        style={{ pointerEvents: "none" }}
                      >
                        {st.s.name.split(" ")[0]}
                      </text>
                    )}

                    {/* Tooltip */}
                    {showTooltip && <StarTooltip star={st} />}
                  </motion.g>
                );
              })}
            </svg>

            {/* Note for few students */}
            {noteFew && (
              <p style={{ fontFamily: PJS, fontSize: 10, color: SUB_CLR, margin: "8px 0 0", textAlign: "center", lineHeight: 1.4 }}>
                Hasil akan lebih lengkap seiring bertambahnya pengamatan.
              </p>
            )}
          </motion.div>
        ) : (
          /* ── List View ── */
          <motion.div
            key="list"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Array.from(grouped.entries()).map(([domain, list]) => (
              <div key={domain} style={{ marginBottom: 10 }}>
                <p style={{ fontFamily: PJS, fontSize: 11, fontWeight: 700, color: getColor(domain, domainColors), margin: "0 0 4px" }}>
                  {domain} ({list.length})
                </p>
                {list.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onSelectStudent(st.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 8px",
                      marginBottom: 3,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    className="active:opacity-70 transition-opacity"
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: getColor(st.domain, domainColors),
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1, fontFamily: PJS, fontSize: 11, color: LABEL_CLR, fontWeight: 600 }}>
                      {st.name}
                    </span>
                    <span style={{ fontFamily: PJS, fontSize: 10, color: SUB_CLR }}>
                      {st.progress}%
                    </span>
                    {st.needsAttention && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: TERRACOTTA_LIGHT,
                          flexShrink: 0,
                        }}
                        title="Perlu perhatian"
                      />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        {Array.from(domains.entries()).map(([domain, color]) => (
          <span
            key={domain}
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: SUB_CLR, fontFamily: PJS, fontWeight: 600 }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {domain}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 9.5, color: "rgba(169,196,181,0.6)", marginTop: 4, fontFamily: PJS }}>
        Cincin putus-putus: perlu perhatian
      </p>
    </div>
  );
}
