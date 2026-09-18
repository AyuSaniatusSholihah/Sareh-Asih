import React from "react";
import {
  Sparkles, Star, Trophy, ChevronRight, Info,
} from "lucide-react";
import {
  A, CARD, TEXT, MUTED, DEEP, PJS, IPS, DMM, TBar,
} from "../ui-kit";
import { useStudents, studentTalentDetail, type Screen } from "../data";

export interface BarItem {
  id: string;
  label: string;
  pct: number;
  color: string;
  icon: string;
}

export function TalentBarChart({ studentId }: { studentId: number }) {
  const items: BarItem[] = studentId === 2 ? [
    { id: "seni", label: "Seni &\nKreativitas", pct: 75, color: "#FF5B8A", icon: "🎨" },
    { id: "teknologi", label: "Teknologi &\nDigital", pct: 50, color: "#3B82F6", icon: "💻" },
    { id: "komunikasi", label: "Komunikasi", pct: 70, color: "#F59E0B", icon: "💬" },
    { id: "sains", label: "Sains &\nRiset", pct: 40, color: "#8B5CF6", icon: "🧪" },
    { id: "olahraga", label: "Olahraga", pct: 88, color: "#10B981", icon: "🏃" },
  ] : [
    { id: "seni", label: "Seni &\nKreativitas", pct: 85, color: "#FF5B8A", icon: "🎨" },
    { id: "teknologi", label: "Teknologi &\nDigital", pct: 72, color: "#3B82F6", icon: "💻" },
    { id: "komunikasi", label: "Komunikasi", pct: 60, color: "#F59E0B", icon: "💬" },
    { id: "sains", label: "Sains &\nRiset", pct: 45, color: "#8B5CF6", icon: "🧪" },
    { id: "olahraga", label: "Olahraga", pct: 30, color: "#10B981", icon: "🏃" },
  ];

  return (
    <div style={{
      background: CARD,
      border: `1.5px solid rgba(91,122,104,0.30)`,
      borderRadius: 24,
      padding: "20px 14px 18px",
      boxShadow: "0 4px 16px rgba(91,122,104,0.08)"
    }}>
      <h3 style={{
        fontFamily: PJS,
        fontSize: 16,
        fontWeight: 800,
        color: "#1E293B",
        marginBottom: 16,
        paddingLeft: 4
      }}>
        Persentase Bakat dan Minat Anak
      </h3>

      {/* Chart container with Y-Axis */}
      <div style={{ display: "flex", gap: 8, height: 200 }}>
        {/* Y-axis labels */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingBottom: 2,
          paddingRight: 4,
          fontFamily: DMM,
          fontSize: 10,
          color: "#94A3B8",
          fontWeight: 700,
          width: 32,
          flexShrink: 0
        }}>
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Bars and grid lines container */}
        <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
          {/* Horizontal grid lines */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none"
          }}>
            {[100, 75, 50, 25, 0].map(val => (
              <div key={val} style={{
                borderBottom: val === 0 ? "1.5px solid #CBD5E1" : "1px dashed #E2E8F0",
                width: "100%"
              }} />
            ))}
          </div>

          {/* Bars columns */}
          <div style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around"
          }}>
            {items.map(b => (
              <div key={b.id} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
                width: 44
              }}>
                {/* Percentage label above bar */}
                <span style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: b.color,
                  fontFamily: PJS,
                  marginBottom: 6,
                  lineHeight: 1
                }}>
                  {b.pct}%
                </span>

                {/* Vertical bar */}
                <div style={{
                  width: 36,
                  height: `${(b.pct / 100) * 82}%`,
                  background: b.color,
                  borderRadius: "12px 12px 3px 3px",
                  boxShadow: `0 4px 12px ${b.color}45`,
                  transition: "height 0.5s ease"
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories below chart */}
      <div style={{ display: "flex", paddingLeft: 40, marginTop: 12, justifyContent: "space-around" }}>
        {items.map(b => (
          <div key={b.id} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 52
          }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: `${b.color}15`,
              border: `1.5px solid ${b.color}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16
            }}>
              {b.icon}
            </div>
            <p style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "#1E293B",
              fontFamily: PJS,
              textAlign: "center",
              lineHeight: 1.25,
              marginTop: 6,
              whiteSpace: "pre-line"
            }}>
              {b.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TalentMapDetailScreen({
  onBack,
  studentId,
  go,
}: {
  onBack: () => void;
  studentId: number;
  go: (s: Screen) => void;
}) {
  const students = useStudents();
  const s = students.find(x => x.id === studentId);
  const data = studentTalentDetail[studentId];
  if (!s) return null;

  const getDomainStyle = (title: string) => {
    if (title.includes("Seni") || title.includes("Kreatif") || title.includes("Visual")) {
      return { color: "#FF5B8A", bg: "#FFF1F5", border: "#FECDD3", icon: "🎨" };
    }
    if (title.includes("Spasial") || title.includes("Digital") || title.includes("Teknologi")) {
      return { color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE", icon: "💻" };
    }
    if (title.includes("Musik") || title.includes("Komunikasi") || title.includes("Perkusi")) {
      return { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", icon: "💬" };
    }
    if (title.includes("Sains") || title.includes("Verbal") || title.includes("Kognitif")) {
      return { color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE", icon: "🧪" };
    }
    return { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", icon: "🏃" };
  };

  const competitionBanner = (
    <div style={{
      background: `linear-gradient(135deg, ${A} 0%, #C46F5F 100%)`,
      borderRadius: 22,
      padding: "16px 18px",
      color: "#FFFFFF",
      boxShadow: "0 8px 24px rgba(210,125,107,0.32)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: "rgba(255,255,255,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0, backdropFilter: "blur(4px)"
        }}>
          🏆
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2 }}>
            Rekomendasi Lomba & Agenda
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.92)", marginTop: 2, lineHeight: 1.3 }}>
            Lihat ajang lomba FLS2N, O2SN & LKSN yang cocok untuk {s.name.split(" ")[0]}
          </p>
        </div>
      </div>
      <button onClick={() => go("competition")}
        style={{
          background: "#FFFFFF",
          color: A,
          fontFamily: PJS,
          fontWeight: 800,
          fontSize: 12,
          padding: "9px 14px",
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexShrink: 0
        }}
        className="active:scale-95 transition-transform">
        Lihat <ChevronRight size={13} strokeWidth={2.5} />
      </button>
    </div>
  );

  if (!data) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS }}>
        <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack}
          right={<button onClick={() => go("competition")} style={{ background: A, color: "#FFFFFF", fontFamily: PJS, fontWeight: 800, minHeight: 38, borderRadius: 12, padding: "0 12px", boxShadow: "0 3px 10px rgba(210,125,107,0.35)", border: "none", cursor: "pointer" }} className="flex items-center gap-1.5 text-xs active:scale-95 transition-transform"><Trophy size={14} strokeWidth={2.2} />Lomba</button>} />
        <div className="px-4 pt-4 pb-6 space-y-4">
          <TalentBarChart studentId={studentId} />
          {competitionBanner}
          <div style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.30)`, borderRadius: 24, padding: 18, boxShadow: "0 4px 16px rgba(91,122,104,0.08)" }}>
            <div className="flex items-center gap-2 mb-3"><Sparkles size={16} style={{ color: A }} /><p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>Ringkasan Bakat</p></div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-bold text-sm" style={{ color: TEXT }}>{s.talent || "Belum teridentifikasi"}</p>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} style={{ color: i < s.stars ? A : "#E5E7EB", fill: i < s.stars ? A : "#E5E7EB" }} />)}</div>
                <span className="text-xs font-bold" style={{ color: DEEP, fontFamily: DMM }}>{s.talentScore}</span>
              </div>
            </div>
            <div className="h-2 rounded-full mb-2" style={{ background: "#EDE9E3" }}><div className="h-full rounded-full" style={{ width: `${s.talentScore}%`, background: A }} /></div>
            <div style={{ background: "#F5F9F7", border: `1.5px solid rgba(91,122,104,0.25)`, borderRadius: 16, padding: "12px 14px" }} className="flex items-start gap-2">
              <Info size={14} style={{ color: DEEP, flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs leading-relaxed" style={{ color: TEXT }}>
                Analisis mendalam akan tersedia setelah beberapa sesi pengamatan. Gaya belajar sementara: <strong>{s.caraBelajar || "belum terdeteksi"}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS }}>
      <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack}
        right={<button onClick={() => go("competition")} style={{ background: A, color: "#FFFFFF", fontFamily: PJS, fontWeight: 800, minHeight: 38, borderRadius: 12, padding: "0 12px", boxShadow: "0 3px 10px rgba(210,125,107,0.35)", border: "none", cursor: "pointer" }} className="flex items-center gap-1.5 text-xs active:scale-95 transition-transform"><Trophy size={14} strokeWidth={2.2} />Lomba</button>} />
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Diagram Batang: Persentase Bakat dan Minat Anak */}
        <TalentBarChart studentId={studentId} />

        {/* Link Menuju Rekomendasi Lomba */}
        {competitionBanner}

        {/* Hasil Talent Mapping List */}
        <div style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.30)`, borderRadius: 24, padding: 18, boxShadow: "0 4px 16px rgba(91,122,104,0.08)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} style={{ color: A }} />
            <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>Hasil Talent Mapping</p>
          </div>
          {data.domains.map((x, idx) => {
            const ds = getDomainStyle(x.t);
            return (
              <div key={x.t} className="mb-4 last:mb-0 pb-4 last:pb-0" style={{ borderBottom: idx < data.domains.length - 1 ? `1px solid rgba(91,122,104,0.18)` : "none" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>{ds.icon}</span>
                    <p className="font-bold text-sm" style={{ color: TEXT, fontFamily: PJS }}>{x.t}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} style={{ color: i < x.st ? ds.color : "#CBD5E1", fill: i < x.st ? ds.color : "#CBD5E1" }} />)}</div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, fontFamily: DMM }}>{x.sc}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full mb-2.5" style={{ background: "#EDE9E3" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${x.sc}%`, background: ds.color }} />
                </div>
                <div style={{ background: ds.bg, border: `1.5px solid ${ds.border}`, borderRadius: 14, padding: "10px 12px" }} className="flex items-start gap-2">
                  <Info size={13} style={{ color: ds.color, flexShrink: 0, marginTop: 2 }} />
                  <p className="text-xs leading-relaxed" style={{ color: TEXT }}><strong>Mengapa:</strong> {x.r}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
