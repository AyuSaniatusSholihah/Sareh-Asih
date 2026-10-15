import {
  Percent, Star, Calendar, FileText, Search, Bell, Settings,
  ChevronRight, Activity, ClipboardCheck, User, PlayCircle, Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  A, BG, CARD, TEXT, MUTED, BDR, DEEP, PJS, IPS, DMM, useUI,
} from "../ui-kit";
import {
  useStudents, fotoSiswa, type Screen, type LaporanKirim,
} from "../data";
import { type GuruProfile } from "../auth";
import { KodeAksesCard } from "../kode-manager";

import { getMockJawaban, kodeTigaHuruf } from "../shared-charts";

export function DashboardGuru({
  go,
  onStartObs,
  guru,
  onAddStudent,
  laporan = [],
}: {
  go: (s: Screen) => void;
  onStartObs: (id: number) => void;
  guru: GuruProfile;
  onAddStudent: () => void;
  laporan: LaporanKirim[];
}) {
  const students = useStudents();
  const { openSearch, openSettings } = useUI();
  const pendingObs = students.filter(s => !s.hasObs);
  const firstName = guru.nama.split(" ")[0];



  // ── Aktivitas terbaru (feed guru: asesmen + laporan terkirim) ──
  const aktivitas = [
    ...pendingObs.slice(0, 1).map(s => ({
      id: `p${s.id}`,
      studentId: s.id,
      I: <ClipboardCheck size={16} strokeWidth={2.3} style={{ color: A }} />,
      bg: "rgba(210,125,107,0.12)",
      foto: fotoSiswa(s),
      tipe: "Asesmen",
      judul: "Asesmen belum tuntas",
      ket: `${s.name.split(" ")[0]} · Belum dipetakan`,
      waktu: "Perlu aksi",
      tint: A,
      isPending: true,
      action: () => onStartObs(s.id),
    })),
    ...students.filter(s => s.hasObs).slice(0, 2).map((s, i) => ({
      id: `o${s.id}`,
      studentId: s.id,
      I: <ClipboardCheck size={16} strokeWidth={2.3} style={{ color: "#059669" }} />,
      bg: "#ECFDF5",
      foto: fotoSiswa(s),
      tipe: "Asesmen",
      judul: "Asesmen selesai",
      ket: `${s.name.split(" ")[0]} · ${s.hasObs ? kodeTigaHuruf(getMockJawaban(s.id)) : ""}`,
      waktu: ["Baru saja", "Hari ini"][i] ?? "Hari ini",
      tint: "#059669",
      isPending: false,
      action: () => go("observation"),
    })),
    ...laporan.slice().reverse().slice(0, 3).map(l => {
      const s = students.find(x => x.id === l.studentId);
      return {
        id: `l${l.id}`,
        studentId: l.studentId,
        I: <FileText size={16} strokeWidth={2.3} style={{ color: DEEP }} />,
        bg: "rgba(91,122,104,0.12)",
        foto: s ? fotoSiswa(s) : undefined,
        tipe: "Laporan",
        judul: "Laporan dikirim ke orang tua",
        ket: `${s?.name.split(" ")[0] ?? "Siswa"} · ${l.isi.substring(0, 30)}...`,
        waktu: l.dikirimPada,
        tint: DEEP,
        isPending: false,
        action: () => go("report"),
      };
    }),
  ].slice(0, 5);

  const quickActions = [
    {
      kategori: "Kelas & Siswa",
      label: "Kelas Saya",
      stat: `${students.length} Siswa`,
      badge: "Kelas VII-A ↗",
      bg: "#CDE7D5", // Light Sage dari palette
      border: "#A6D5B4",
      labelColor: "#1B3E28",
      statColor: "#112F1D",
      badgeBg: "#FFFFFF",
      badgeColor: "#112F1D",
      btnBg: "#112F1D",
      btnColor: "#FFFFFF",
      waveColor: "#7AAFA0",
      isDark: false,
      onClick: () => go("students"),
    },
    {
      kategori: "Pemetaan Bakat",
      label: "Bakat Anak",
      stat: "Minat & Potensi",
      badge: "Peta RIASEC ↗",
      bg: "#D8EEDF", // Mint Light Sage dari palette
      border: "#B2DEC1",
      labelColor: "#1B3E28",
      statColor: "#112F1D",
      badgeBg: "#FFFFFF",
      badgeColor: "#112F1D",
      btnBg: "#112F1D",
      btnColor: "#FFFFFF",
      waveColor: "#6FA585",
      isDark: false,
      onClick: () => go("talent-map"),
    },
    {
      kategori: "Agenda Lomba",
      label: "Agenda",
      stat: "Jadwal Diksus",
      badge: "FLS3N & O2SN ↗",
      bg: "#FCEBE7", // Soft Terracotta Tint dari palette #D27D6B
      border: "#F5C9C0",
      labelColor: "#893724",
      statColor: "#6B2414",
      badgeBg: "#FFFFFF",
      badgeColor: "#6B2414",
      btnBg: "#6B2414",
      btnColor: "#FFFFFF",
      waveColor: "#E09787",
      isDark: false,
      onClick: () => go("competition"),
    },
    {
      kategori: "Laporan Siswa",
      label: "Laporan",
      stat: "Kemajuan Belajar",
      badge: "Siap Dikirim ↗",
      bg: "#143522", // Deep Forest Green (kartu gelap kontras tinggi dari referensi)
      border: "#0E2818",
      labelColor: "#A6D6B6",
      statColor: "#FFFFFF",
      badgeBg: "#224A32",
      badgeColor: "#CDE7D5",
      btnBg: "#CDE7D5",
      btnColor: "#143522",
      waveColor: "#2A6140",
      isDark: true,
      onClick: () => go("report"),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* ── Header ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 10px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>
              Beranda
            </h1>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: "#5A6E63", margin: "4px 0 0", fontWeight: 500 }}>
              Selamat pagi, {firstName} 👋 · {guru.sekolah}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            <button onClick={openSearch}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="active:scale-95 transition-transform"
              title="Cari">
              <Search size={17} style={{ color: "#1B2E24" }} />
            </button>
            <button onClick={() => go("students")}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="active:scale-95 transition-transform"
              title="Profil Siswa">
              <User size={17} style={{ color: "#1B2E24" }} />
            </button>
            <button onClick={openSettings}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="active:scale-95 transition-transform"
              title="Pengaturan">
              <Settings size={17} style={{ color: "#1B2E24" }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 90px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* ── Alert Banner ── */}
        {pendingObs.length > 0 && (
          <div onClick={() => go("asesmen-pending")}
            style={{
              background: "#D27D6B",
              borderRadius: 22,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              boxShadow: "0 6px 18px rgba(210,125,107,0.30)",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
            className="active:scale-[0.98] transition-transform">
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>
                <Bell size={20} style={{ color: "#D27D6B" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 800, color: "#FFFFFF", fontFamily: PJS, lineHeight: 1.2 }}>{pendingObs.length} asesmen perlu diperiksa</p>
                <p style={{ fontSize: 11, color: "#FDEEEB", marginTop: 2, lineHeight: 1.3, fontWeight: 500 }}>Tap untuk lengkapi asesmen siswa</p>
              </div>
            </div>
            <button onClick={() => go("asesmen-pending")}
              style={{
                background: "#FFFFFF",
                color: "#D27D6B",
                border: "none",
                borderRadius: 14,
                padding: "9px 13px",
                fontFamily: PJS,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
              className="active:scale-95 transition-transform">
              Lihat <ChevronRight size={13} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* ── Akses Cepat ── */}
        <div>
          <p style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 10 }}>Akses Cepat</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {quickActions.map((a, i) => (
              <button
                key={i}
                onClick={a.onClick}
                style={{
                  position: "relative",
                  borderRadius: 22,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 148,
                  background: a.bg,
                  border: `1.5px solid ${a.border}`,
                  padding: "16px 14px 14px",
                  overflow: "hidden",
                  boxShadow: a.isDark ? "0 8px 22px rgba(20,53,34,0.22)" : "0 4px 14px rgba(91,122,104,0.10)",
                }}
                className="active:scale-[0.97] transition-all hover:brightness-105"
              >
                {/* Wave decorative line seperti mockup */}
                <svg
                  style={{
                    position: "absolute",
                    right: -10,
                    top: 15,
                    width: 130,
                    height: 75,
                    pointerEvents: "none",
                  }}
                  viewBox="0 0 130 75"
                  fill="none"
                >
                  <path
                    d="M 0 48 Q 32 10 65 42 T 130 18"
                    stroke={a.waveColor}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity={a.isDark ? "0.6" : "0.5"}
                  />
                </svg>

                {/* Top row: category label + circular arrow button */}
                <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                  <span
                    style={{
                      fontFamily: PJS,
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                      color: a.labelColor,
                      lineHeight: 1.25,
                      maxWidth: "68%",
                    }}
                  >
                    {a.kategori}
                  </span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: a.btnBg,
                      color: a.btnColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.14)",
                    }}
                  >
                    <ArrowUpRight size={17} strokeWidth={2.6} />
                  </div>
                </div>

                {/* Middle: big bold title */}
                <div style={{ position: "relative", zIndex: 1, margin: "10px 0 12px" }}>
                  <p
                    style={{
                      fontFamily: PJS,
                      fontWeight: 800,
                      fontSize: 17,
                      color: a.statColor,
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {a.stat}
                  </p>
                  <p
                    style={{
                      fontFamily: IPS,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: a.labelColor,
                      margin: "3px 0 0",
                      lineHeight: 1.25,
                      opacity: a.isDark ? 0.9 : 0.85,
                    }}
                  >
                    {a.label}
                  </p>
                </div>

                {/* Bottom: pill badge with arrow */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      background: a.badgeBg,
                      color: a.badgeColor,
                      borderRadius: 20,
                      padding: "4px 9px",
                      fontFamily: PJS,
                      fontSize: 10.5,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      border: a.isDark ? `1px solid ${a.border}` : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: a.isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    {a.badge}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Aktivitas Terbaru ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Activity size={16} style={{ color: DEEP }} />
            <p style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT }}>Aktivitas Terbaru</p>
          </div>
          <div style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 22, padding: "4px 14px", boxShadow: "0 2px 10px rgba(91,122,104,0.08)" }}>
            {aktivitas.map((a, i) => (
              <button
                key={a.id}
                onClick={a.action}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "11px 0",
                  width: "100%",
                  background: "none",
                  border: "none",
                  borderTop: i === 0 ? "none" : `1px solid ${BDR}`,
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: 0,
                  transition: "background 0.15s",
                }}
                className="active:scale-[0.98] transition-all"
              >
                {/* Avatar / ikon */}
                {a.foto ? (
                  <img
                    src={a.foto}
                    alt=""
                    style={{
                      width: 38, height: 38, borderRadius: 13,
                      objectFit: "cover", flexShrink: 0,
                      border: `1.5px solid ${a.tint}40`,
                      ...(a.isPending ? { boxShadow: `0 0 0 2.5px ${a.tint}55` } : {}),
                    }}
                  />
                ) : (
                  <div style={{ width: 38, height: 38, borderRadius: 13, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {a.I}
                  </div>
                )}

                {/* Teks */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 800,
                      fontFamily: PJS,
                      color: a.tint,
                      background: `${a.tint}18`,
                      borderRadius: 5,
                      padding: "1.5px 6px",
                      letterSpacing: 0.3,
                      flexShrink: 0,
                    }}>
                      {a.tipe}
                    </span>
                  </div>
                  <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12.5, color: TEXT, margin: 0, lineHeight: 1.25 }}>{a.judul}</p>
                  <p style={{ fontSize: 10.5, color: MUTED, margin: "2px 0 0", lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.ket}</p>
                </div>

                {/* Badge / aksi kanan */}
                {a.isPending ? (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: A,
                    color: "#fff",
                    borderRadius: 20,
                    padding: "5px 9px 5px 7px",
                    flexShrink: 0,
                    boxShadow: `0 3px 10px ${A}55`,
                  }}>
                    <PlayCircle size={12} strokeWidth={2.5} />
                    <span style={{ fontSize: 10, fontWeight: 800, fontFamily: PJS, letterSpacing: 0.2 }}>Lanjutkan</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                    <span style={{ fontSize: 9.5, color: a.tint, fontWeight: 800, fontFamily: DMM }}>{a.waktu}</span>
                    <ChevronRight size={13} strokeWidth={2.5} style={{ color: a.tint, opacity: 0.7 }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>



        {/* ── Kartu kode akses orang tua (dipakai ulang dari KodeAksesCard) ── */}
        {students.length > 0 && <KodeAksesCard onOpen={() => go("kode-akses")} />}
      </div>
    </div>
  );
}