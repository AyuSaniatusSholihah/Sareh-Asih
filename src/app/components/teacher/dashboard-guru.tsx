import {
  Percent, Star, Calendar, FileText, Search, Bell, Settings,
  ChevronRight, Activity, ClipboardCheck, User, Users, PlayCircle, Sparkles,
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
  const { openSearch, openSettings, openProfile } = useUI();
  const pendingObs = students.filter(s => !s.hasObs);
  const firstName = guru.nama.split(" ")[0];
  const completedObsCount = students.filter(s => s.hasObs).length;
  const progressPercent = students.length > 0 ? Math.round((completedObsCount / students.length) * 100) : 0;


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
              Selamat pagi, {firstName} 👋{guru.sekolah?.trim() ? ` · ${guru.sekolah}` : ""}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            <button onClick={openSearch}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="active:scale-95 transition-transform"
              title="Cari">
              <Search size={17} style={{ color: "#1B2E24" }} />
            </button>
            <button onClick={openProfile}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="active:scale-95 transition-transform"
              title="Profil Akun">
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
        {/* ── Alert Banner (Clean White Card with Muted Terracotta Attention Accent) ── */}
        {pendingObs.length > 0 && (
          <div
            onClick={() => go("asesmen-pending")}
            style={{
              background: "#FFFFFF",
              borderRadius: 22,
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              border: "1px solid rgba(210, 125, 107, 0.25)",
              boxShadow: "0 3px 12px rgba(91, 122, 104, 0.06)",
              cursor: "pointer",
            }}
            className="active:scale-[0.98] transition-transform"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#2E3E35", fontFamily: PJS, lineHeight: 1.2, margin: 0 }}>
                  {pendingObs.length} asesmen perlu diperiksa
                </p>
                <p style={{ fontSize: 12, color: "#5B7A68", margin: "4px 0 0", lineHeight: 1.3, fontWeight: 500 }}>
                  {completedObsCount} dari {students.length} siswa sudah selesai
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go("asesmen-pending");
                }}
                style={{
                  background: "#D27D6B",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 12,
                  padding: "8px 18px",
                  fontFamily: PJS,
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 3px 10px rgba(210,125,107,0.28)",
                  letterSpacing: "0.02em",
                }}
                className="active:scale-95 transition-transform"
              >
                Lihat
              </button>
            </div>

            {/* Progress bar (clean visible track on white) */}
            <div style={{ width: "100%", height: 7, background: "rgba(91, 122, 104, 0.12)", borderRadius: 9999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.max(7, progressPercent)}%`,
                  height: "100%",
                  background: "#D27D6B",
                  borderRadius: 9999,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* ── Akses Cepat (4 Kotak Grid 2x2) ── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: 0 }}>Akses Cepat</p>
            <span style={{ fontFamily: IPS, fontSize: 11, color: MUTED, fontWeight: 600 }}>4 menu</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* 1. Siswa (Kelas & Siswa) */}
            <button
              onClick={() => go("students")}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(91, 122, 104, 0.14)",
                borderRadius: 22,
                padding: "14px 14px 13px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 148,
                boxShadow: "0 3px 10px rgba(91, 122, 104, 0.06)",
              }}
              className="active:scale-[0.97] transition-all hover:shadow-md"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    background: "#D4E8DA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Users size={19} strokeWidth={2.2} style={{ color: "#2E3E35" }} />
                </div>
                <ArrowUpRight size={17} strokeWidth={2.4} style={{ color: "#5B7A68", marginTop: 2 }} />
              </div>

              <div style={{ margin: "10px 0 8px" }}>
                <p
                  style={{
                    fontFamily: PJS,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#5B7A68",
                    margin: 0,
                  }}
                >
                  KELAS & SISWA
                </p>
                <p
                  style={{
                    fontFamily: PJS,
                    fontSize: 16.5,
                    fontWeight: 800,
                    color: "#2E3E35",
                    margin: "3px 0 0",
                    lineHeight: 1.2,
                  }}
                >
                  {students.length} Siswa
                </p>
                <p
                  style={{
                    fontFamily: IPS,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#5B7A68",
                    margin: "2px 0 0",
                  }}
                >
                  Kelas saya
                </p>
              </div>

              <div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#D4E8DA",
                    color: "#2E3E35",
                    fontFamily: PJS,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 9999,
                    lineHeight: 1.2,
                  }}
                >
                  Kelas VII-A
                </span>
              </div>
            </button>

            {/* 2. Minat (Pemetaan Bakat) */}
            <button
              onClick={() => go("talent-map")}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(91, 122, 104, 0.14)",
                borderRadius: 22,
                padding: "14px 14px 13px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 148,
                boxShadow: "0 3px 10px rgba(91, 122, 104, 0.06)",
              }}
              className="active:scale-[0.97] transition-all hover:shadow-md"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    background: "#5B7A68",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 6px rgba(91,122,104,0.20)",
                  }}
                >
                  <Star size={19} strokeWidth={2.2} style={{ color: "#FFFFFF" }} />
                </div>
                <ArrowUpRight size={17} strokeWidth={2.4} style={{ color: "#5B7A68", marginTop: 2 }} />
              </div>

              <div style={{ margin: "10px 0 8px" }}>
                <p
                  style={{
                    fontFamily: PJS,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#5B7A68",
                    margin: 0,
                  }}
                >
                  PEMETAAN BAKAT
                </p>
                <p
                  style={{
                    fontFamily: PJS,
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#2E3E35",
                    margin: "3px 0 0",
                    lineHeight: 1.2,
                  }}
                >
                  Minat & Potensi
                </p>
                <p
                  style={{
                    fontFamily: IPS,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#5B7A68",
                    margin: "2px 0 0",
                  }}
                >
                  Bakat anak
                </p>
              </div>

              <div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#D4E8DA",
                    color: "#2E3E35",
                    fontFamily: PJS,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 9999,
                    lineHeight: 1.2,
                  }}
                >
                  Peta RIASEC
                </span>
              </div>
            </button>

            {/* 3. Agenda (Agenda Lomba) */}
            <button
              onClick={() => go("competition")}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(91, 122, 104, 0.14)",
                borderRadius: 22,
                padding: "14px 14px 13px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 148,
                boxShadow: "0 3px 10px rgba(91, 122, 104, 0.06)",
              }}
              className="active:scale-[0.97] transition-all hover:shadow-md"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    background: "rgba(210,125,107,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={19} strokeWidth={2.2} style={{ color: "#D27D6B" }} />
                </div>
                <ArrowUpRight size={17} strokeWidth={2.4} style={{ color: "#5B7A68", marginTop: 2 }} />
              </div>

              <div style={{ margin: "10px 0 8px" }}>
                <p
                  style={{
                    fontFamily: PJS,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#5B7A68",
                    margin: 0,
                  }}
                >
                  AGENDA LOMBA
                </p>
                <p
                  style={{
                    fontFamily: PJS,
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#2E3E35",
                    margin: "3px 0 0",
                    lineHeight: 1.2,
                  }}
                >
                  Jadwal Diksus
                </p>
                <p
                  style={{
                    fontFamily: IPS,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#5B7A68",
                    margin: "2px 0 0",
                  }}
                >
                  Agenda
                </p>
              </div>

              <div>
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(210,125,107,0.14)",
                    color: "#D27D6B",
                    fontFamily: PJS,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 9999,
                    lineHeight: 1.2,
                  }}
                >
                  FLS3N & O2SN
                </span>
              </div>
            </button>

            {/* 4. Laporan (Laporan Siswa) */}
            <button
              onClick={() => go("report")}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(91, 122, 104, 0.14)",
                borderRadius: 22,
                padding: "14px 14px 13px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 148,
                boxShadow: "0 3px 10px rgba(91, 122, 104, 0.06)",
              }}
              className="active:scale-[0.97] transition-all hover:shadow-md"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    background: "#D4E8DA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={19} strokeWidth={2.2} style={{ color: "#5B7A68" }} />
                </div>
                <ArrowUpRight size={17} strokeWidth={2.4} style={{ color: "#5B7A68", marginTop: 2 }} />
              </div>

              <div style={{ margin: "10px 0 8px" }}>
                <p
                  style={{
                    fontFamily: PJS,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#5B7A68",
                    margin: 0,
                  }}
                >
                  LAPORAN SISWA
                </p>
                <p
                  style={{
                    fontFamily: PJS,
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#2E3E35",
                    margin: "3px 0 0",
                    lineHeight: 1.2,
                  }}
                >
                  Kemajuan Belajar
                </p>
                <p
                  style={{
                    fontFamily: IPS,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#5B7A68",
                    margin: "2px 0 0",
                  }}
                >
                  Laporan
                </p>
              </div>

              <div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#D4E8DA",
                    color: "#2E3E35",
                    fontFamily: PJS,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 9999,
                    lineHeight: 1.2,
                  }}
                >
                  Siap dikirim
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ── Aktivitas Terbaru ── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <Activity size={16} style={{ color: DEEP }} />
            <p style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT }}>Aktivitas Terbaru</p>
          </div>
          <div style={{ background: CARD, border: "1px solid rgba(91, 122, 104, 0.12)", borderRadius: 20, padding: "4px 14px", boxShadow: "0 3px 10px -2px rgba(91, 122, 104, 0.06)" }}>
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