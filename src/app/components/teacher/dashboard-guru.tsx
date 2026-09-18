import React from "react";
import {
  Percent, Star, Calendar, FileText, Search, Bell, Settings,
  ChevronRight, Users, UserPlus, User,
} from "lucide-react";
import {
  A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, useUI, PBtn,
} from "../ui-kit";
import { useStudents, type Screen } from "../data";
import { type GuruProfile } from "../auth";

export function DashboardGuru({
  go,
  onStartObs,
  guru,
  onAddStudent,
}: {
  go: (s: Screen) => void;
  onStartObs: (id: number) => void;
  guru: GuruProfile;
  onAddStudent: () => void;
}) {
  const students = useStudents();
  const { openSearch, openSettings } = useUI();
  const pendingObs = students.filter(s => !s.hasObs);
  const firstName = guru.nama.split(" ")[0];
  const sudahDiamati = students.length - pendingObs.length;
  const pctDiamati = students.length ? Math.round((sudahDiamati / students.length) * 100) : 0;
  const rataBakat = students.length
    ? Math.round(students.reduce((a, s) => a + (s.talentScore || 0), 0) / students.length)
    : 0;
  const donutC = 2 * Math.PI * 34;

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

  // Group students by kelas
  const kelasList = Object.entries(
    students.reduce((acc, s) => {
      (acc[s.kelas] ||= []).push(s);
      return acc;
    }, {} as Record<string, typeof students>)
  );

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
          <div onClick={() => go("pengamatan-pending")}
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
                <p style={{ fontSize: 13.5, fontWeight: 800, color: "#FFFFFF", fontFamily: PJS, lineHeight: 1.2 }}>{pendingObs.length} pengamatan perlu diperiksa</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.88)", marginTop: 2, lineHeight: 1.3 }}>Tap untuk lengkapi pengamatan siswa</p>
              </div>
            </div>
            <button onClick={() => go("pengamatan-pending")}
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

        {/* ── Aksi Cepat ── */}
        <div>
          <p style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 10 }}>Aksi Cepat</p>
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

        {/* ── Ikhtisar Perkembangan Siswa ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT }}>Ikhtisar Perkembangan</p>
            <button onClick={() => go("students")} style={{ fontSize: 12, fontWeight: 700, color: DEEP, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
              Lihat semua <ChevronRight size={12} strokeWidth={2.2} />
            </button>
          </div>

          {students.length === 0 ? (
            <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 22, padding: 24, textAlign: "center" }}>
              <div style={{ width: 52, height: 52, background: SEC, borderRadius: 16, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={24} style={{ color: DEEP }} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, fontFamily: PJS, color: TEXT, marginBottom: 6 }}>Belum ada siswa</p>
              <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, marginBottom: 16 }}>Tambahkan siswa untuk mulai pengamatan dan pemetaan bakat.</p>
              <PBtn full label="Tambah Siswa" icon={<UserPlus size={15} />} onClick={onAddStudent} />
            </div>
          ) : (
            <>
              <div style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 22, padding: 16, boxShadow: "0 2px 10px rgba(91,122,104,0.08)", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}>
                  <svg width={84} height={84} viewBox="0 0 84 84">
                    <circle cx={42} cy={42} r={34} fill="none" stroke="#EDE9E3" strokeWidth={9} />
                    <circle cx={42} cy={42} r={34} fill="none" stroke="#059669" strokeWidth={9} strokeLinecap="round"
                      strokeDasharray={`${(pctDiamati / 100) * donutC} ${donutC}`} transform="rotate(-90 42 42)" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ fontFamily: DMM, fontWeight: 800, fontSize: 17, color: TEXT, lineHeight: 1, margin: 0 }}>{pctDiamati}%</p>
                    <p style={{ fontSize: 9, color: MUTED, fontWeight: 700, marginTop: 2 }}>diamati</p>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: TEXT, margin: 0 }}>{sudahDiamati} dari {students.length} siswa sudah diamati</p>
                  <p style={{ fontSize: 11, color: MUTED, marginTop: 2, lineHeight: 1.4 }}>Rata-rata skor bakat <strong style={{ color: DEEP }}>{rataBakat}/100</strong></p>
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    {[
                      { l: "Total", v: students.length, c: TEXT, b: BG },
                      { l: "Sudah", v: sudahDiamati, c: "#059669", b: "#ECFDF5" },
                      { l: "Belum", v: pendingObs.length, c: A, b: "rgba(210,125,107,0.12)" },
                    ].map((s) => (
                      <span key={s.l} style={{ flex: 1, textAlign: "center", background: s.b, border: `1.5px solid ${s.c}30`, borderRadius: 12, padding: "7px 4px" }}>
                        <p style={{ fontFamily: DMM, fontWeight: 800, fontSize: 14, color: s.c, lineHeight: 1, margin: 0 }}>{s.v}</p>
                        <p style={{ fontSize: 9, color: MUTED, fontWeight: 600, marginTop: 2 }}>{s.l}</p>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress per kelas */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {kelasList.map(([kelas, siswaList]) => {
                  const sudah = siswaList.filter(s => s.hasObs).length;
                  const pr = siswaList.length ? Math.round((sudah / siswaList.length) * 100) : 0;
                  return (
                    <div key={kelas} style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 16, padding: "11px 13px", boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 15 }}>🏫</span>
                          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: TEXT, margin: 0 }}>{kelas}</p>
                        </div>
                        <span style={{ fontFamily: DMM, fontWeight: 800, fontSize: 11, color: pr === 100 ? "#059669" : pr > 0 ? DEEP : MUTED }}>
                          {sudah}/{siswaList.length} · {pr}%
                        </span>
                      </div>
                      <div style={{ height: 7, borderRadius: 99, background: "#EDE9E3" }}>
                        <div style={{ height: "100%", borderRadius: 99, background: pr === 100 ? "#10B981" : "#8BB098", width: `${pr}%`, transition: "width 0.4s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
