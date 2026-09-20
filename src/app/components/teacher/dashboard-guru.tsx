import React, { useMemo } from "react";
import {
  Percent, Star, Calendar, FileText, Search, Bell, Settings,
  ChevronRight, Activity, ClipboardCheck, User,
} from "lucide-react";
import {
  A, BG, CARD, TEXT, MUTED, BDR, DEEP, PJS, IPS, DMM, useUI,
} from "../ui-kit";
import {
  useStudents, type Screen, type LaporanKirim,
} from "../data";
import { type GuruProfile } from "../auth";
import { KodeAksesCard } from "../kode-manager";
import { TalentConstellation, type ConstellationStudent } from "./talent-constellation";

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

  // ── Data untuk TalentConstellation ──
  const constellationStudents: ConstellationStudent[] = useMemo(
    () =>
      students
        .filter(s => !!s.talent)
        .map(s => ({
          id: String(s.id),
          name: s.name,
          domain: s.talent,
          progress: s.talentScore || 0,
          needsAttention: !s.hasObs,
        })),
    [students],
  );

  // ── Aktivitas terbaru (feed guru: asesmen + laporan terkirim) ──
  const aktivitas = [
    ...pendingObs.slice(0, 1).map(s => ({
      id: `p${s.id}`,
      I: <ClipboardCheck size={16} strokeWidth={2.3} style={{ color: A }} />,
      bg: "rgba(210,125,107,0.12)",
      judul: "Asesmen belum tuntas",
      ket: `${s.name.split(" ")[0]} · ${s.talent}`,
      waktu: "Perlu aksi", tint: A,
    })),
    ...students.filter(s => s.hasObs).slice(0, 2).map((s, i) => ({
      id: `o${s.id}`,
      I: <ClipboardCheck size={16} strokeWidth={2.3} style={{ color: "#059669" }} />,
      bg: "#ECFDF5",
      judul: "Asesmen selesai",
      ket: `${s.name.split(" ")[0]} · ${s.talent}`,
      waktu: ["Baru saja", "Hari ini"][i] ?? "Hari ini", tint: "#059669",
    })),
    ...laporan.slice().reverse().slice(0, 3).map(l => {
      const s = students.find(x => x.id === l.studentId);
      return {
        id: `l${l.id}`,
        I: <FileText size={16} strokeWidth={2.3} style={{ color: DEEP }} />,
        bg: "rgba(91,122,104,0.12)",
        judul: "Laporan dikirim ke orang tua",
        ket: `${s?.name.split(" ")[0] ?? "Siswa"} · ${l.judul}`,
        waktu: l.dikirimPada, tint: DEEP,
      };
    }),
  ].slice(0, 5);

  const quickActions = [
    {
      icon: <Percent size={21} strokeWidth={2.6} />,
      label: "Kelas Saya",
      sub: "Lihat perkembangan siswa di kelas.",
      iconBg: "rgba(255,255,255,0.22)",
      iconColor: "#FFFFFF",
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&auto=format&fit=crop",
      overlay: "linear-gradient(160deg, rgba(30,70,50,0.72) 0%, rgba(15,40,30,0.88) 100%)",
      onClick: () => go("students"),
    },
    {
      icon: <Star size={20} strokeWidth={2.4} />,
      label: "Bakat Anak",
      sub: "Lihat potensi & minat bakat anak.",
      iconBg: "rgba(255,255,255,0.22)",
      iconColor: "#FFFFFF",
      img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80&auto=format&fit=crop",
      overlay: "linear-gradient(160deg, rgba(140,50,30,0.72) 0%, rgba(80,20,10,0.88) 100%)",
      onClick: () => go("talent-map"),
    },
    {
      icon: <Calendar size={20} strokeWidth={2.4} />,
      label: "Agenda",
      sub: "Jadwal kegiatan & agenda lomba.",
      iconBg: "rgba(255,255,255,0.22)",
      iconColor: "#FFFFFF",
      img: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&q=80&auto=format&fit=crop",
      overlay: "linear-gradient(160deg, rgba(20,60,90,0.72) 0%, rgba(10,30,60,0.88) 100%)",
      onClick: () => go("competition"),
    },
    {
      icon: <FileText size={20} strokeWidth={2.4} />,
      label: "Laporan",
      sub: "Unduh laporan kemajuan siswa.",
      iconBg: "rgba(255,255,255,0.22)",
      iconColor: "#FFFFFF",
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80&auto=format&fit=crop",
      overlay: "linear-gradient(160deg, rgba(50,40,90,0.72) 0%, rgba(25,20,60,0.88) 100%)",
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
              background: `linear-gradient(135deg, ${A} 0%, #C46F5F 100%)`,
              borderRadius: 22,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              boxShadow: "0 8px 24px rgba(210,125,107,0.38)",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
            className="active:scale-[0.98] transition-transform">
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, backdropFilter: "blur(4px)" }}>
                <Bell size={20} style={{ color: "#FFFFFF" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 800, color: "#FFFFFF", fontFamily: PJS, lineHeight: 1.2 }}>{pendingObs.length} asesmen perlu diperiksa</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.88)", marginTop: 2, lineHeight: 1.3 }}>Tap untuk lengkapi asesmen siswa</p>
              </div>
            </div>
            <button onClick={() => go("asesmen-pending")}
              style={{
                background: "#FFFFFF",
                color: A,
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
              <button key={i} onClick={a.onClick}
                style={{
                  position: "relative",
                  borderRadius: 22,
                  overflow: "hidden",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 138,
                  border: "none",
                  padding: 0,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                }}
                className="active:scale-[0.97] transition-all hover:shadow-xl">

                {/* Foto Unsplash */}
                <img
                  src={a.img}
                  alt={a.label}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: "center",
                  }}
                />

                {/* Gradient overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: a.overlay,
                }} />

                {/* Konten */}
                <div style={{ position: "relative", zIndex: 1, padding: "14px 14px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                  {/* Top row: icon + arrow */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: a.iconBg,
                      backdropFilter: "blur(6px)",
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: a.iconColor,
                    }}>
                      {a.icon}
                    </div>
                    <ChevronRight size={17} style={{ color: "rgba(255,255,255,0.75)", marginTop: 4 }} strokeWidth={2.5} />
                  </div>

                  {/* Bottom: label + sub */}
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 15, color: "#FFFFFF", marginBottom: 2, lineHeight: 1.2, textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{a.label}</p>
                    <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.82)", lineHeight: 1.35, fontWeight: 500 }}>{a.sub}</p>
                  </div>
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
              <div key={a.id}
                style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", borderTop: i === 0 ? "none" : `1px solid ${BDR}` }}>
                <div style={{ width: 38, height: 38, borderRadius: 13, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {a.I}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12.5, color: TEXT, margin: 0, lineHeight: 1.25 }}>{a.judul}</p>
                  <p style={{ fontSize: 10.5, color: MUTED, margin: "2px 0 0", lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.ket}</p>
                </div>
                <span style={{ fontSize: 9.5, color: a.tint, fontWeight: 800, fontFamily: DMM, flexShrink: 0 }}>{a.waktu}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sorotan Bakat (Konstelasi) ── */}
        <TalentConstellation
          students={constellationStudents}
          onSelectStudent={() => go("talent-map")}
        />

        {/* ── Kartu kode akses orang tua (dipakai ulang dari KodeAksesCard) ── */}
        {students.length > 0 && <KodeAksesCard onOpen={() => go("kode-akses")} />}
      </div>
    </div>
  );
}