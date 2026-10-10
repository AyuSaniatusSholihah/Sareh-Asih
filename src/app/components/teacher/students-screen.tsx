import { useState } from "react";
import { Search, User, Settings, Plus, ArrowLeft, ChevronRight, CheckCircle, Clock, X, Users, BookOpen, Sparkles } from "lucide-react";
import { BG, MUTED, PJS, IPS, CARD, SEC, DEEP, T, useUI } from "../ui-kit";
import { useStudents, fotoSiswa, type Screen } from "../data";
import { type GuruProfile } from "../auth";
import { cleanClassName } from "../auth/profil-sekolah";
import { getStudentAsesmenStatus } from "./student-profile-screen";
import { getLabel } from "../role-labels";

export function StudentsScreen({
  go,
  onAddStudent,
  onSelect,
  guru,
}: {
  go: (s: Screen) => void;
  onAddStudent: () => void;
  onSelect: (id: number) => void;
  guru?: GuruProfile;
}) {
  const students = useStudents();
  const { openSearch, openSettings } = useUI();
  const [q, setQ] = useState("");

  const isSetupDone = guru?.setupDone ?? (!!guru?.sekolah || !!guru?.namaRuangBelajar || (guru?.kelas && guru.kelas.length > 0));
  const role = guru?.teacherRole || "guru_slb";

  const filteredInClass = students.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.abk.toLowerCase().includes(q.toLowerCase())
  );

  const getAbkPillStyle = (abk: string) => {
    const lower = abk.toLowerCase();
    if (lower.includes("autis") || lower.includes("asd")) return { bg: "#F3E8FF", color: "#7E22CE" };
    if (lower.includes("rungu") || lower.includes("wicara")) return { bg: "#EFF6FF", color: "#2563EB" };
    if (lower.includes("daksa")) return { bg: "#FFF7ED", color: "#C2410C" };
    if (lower.includes("grahita")) return { bg: "#FDF2F8", color: "#BE185D" };
    if (lower.includes("netra")) return { bg: "#FEF3C7", color: "#D97706" };
    if (lower.includes("laras")) return { bg: "#F1F5F9", color: "#475569" };
    return { bg: "#F3E8FF", color: "#7E22CE" };
  };

  const rawClass = guru?.kelas?.[0] || "Kelas VI A";
  const className = cleanClassName(rawClass) || "Kelas VI A";

  const headerTitle = role === "homeschool"
    ? (guru?.namaRuangBelajar || "Ruang Belajar Saya")
    : role === "gpk"
    ? (guru?.sekolah || "Sekolah Dampingan")
    : className;

  const headerSubLabel = role === "homeschool"
    ? `${students.length} Anak`
    : role === "gpk"
    ? `${students.length} Anak Dampingan`
    : `${students.length} Siswa`;

  const addBtnLabel = getLabel(role, "tambahSiswa");

  return (
    <div className="flex-1 overflow-y-auto relative flex flex-col" style={{ fontFamily: IPS, background: BG }}>
      {/* ── Header ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 14px", flexShrink: 0, borderBottom: "1px solid rgba(91,122,104,0.10)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <button
              onClick={() => go("dashboard")}
              style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(139,176,152,0.14)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1B2E24", flexShrink: 0 }}
              title="Kembali"
              className="active:scale-95 transition-transform"
            >
              <ArrowLeft size={18} />
            </button>

            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>
                {isSetupDone ? headerTitle : getLabel(role, "tabSiswa")}
              </h1>
              {isSetupDone && (
                <p style={{ fontFamily: IPS, fontSize: 12.5, color: "#5A6E63", margin: "3px 0 0", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                  <User size={13} style={{ color: "#5A6E63" }} />
                  {headerSubLabel}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            {isSetupDone && (
              <>
                <button
                  onClick={openSearch}
                  style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  className="active:scale-95 transition-transform"
                  title="Cari"
                >
                  <Search size={17} style={{ color: "#1B2E24" }} />
                </button>
                <button
                  onClick={() => { if (students.length > 0) onSelect(students[0].id); }}
                  style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  className="active:scale-95 transition-transform"
                  title="Profil Siswa"
                >
                  <User size={17} style={{ color: "#1B2E24" }} />
                </button>
              </>
            )}
            <button
              onClick={openSettings}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="active:scale-95 transition-transform"
              title="Pengaturan"
            >
              <Settings size={17} style={{ color: "#1B2E24" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── STATE A: TAB SISWA KOSONG / BELUM SETUP ── */}
      {!isSetupDone ? (
        <div style={{ flex: 1, padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ background: CARD, borderRadius: 24, padding: "28px 20px", border: "1.5px solid rgba(91,122,104,0.16)", boxShadow: "0 4px 20px rgba(91,122,104,0.08)", width: "100%", maxWidth: 360 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: SEC, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: DEEP }}>
              <BookOpen size={32} />
            </div>
            <h2 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: "#1B2E24", marginBottom: 8, lineHeight: 1.3 }}>
              Mulai dengan menyiapkan ruang belajarmu
            </h2>
            <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 24, lineHeight: 1.5 }}>
              Pilih peran mengajar, tentukan tempat atau ruang belajar, dan tambahkan data anak untuk memulai asesmen harian.
            </p>
            <button
              onClick={() => go("setup-ruang-belajar")}
              style={{
                width: "100%", background: T, color: "#FFFFFF", fontFamily: PJS, fontWeight: 800, fontSize: 14.5,
                padding: "14px 20px", borderRadius: 16, border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 6px 18px rgba(91,122,104,0.35)", minHeight: 48,
              }}
              className="active:scale-95 transition-transform"
            >
              <Sparkles size={18} />
              <span>Mulai Setup</span>
            </button>
          </div>
        </div>
      ) : (
        /* ── STATE C: TAB SISWA SETELAH SETUP ── */
        <>
          {/* Search Bar */}
          <div style={{ padding: "14px 16px 8px" }}>
            <div style={{ position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Cari nama atau jenis kekhususan..."
                style={{ width: "100%", background: "#FFFFFF", border: "1px solid rgba(91,122,104,0.12)", borderRadius: 24, padding: "12px 18px 12px 44px", fontSize: 13.5, color: "#1B2E24", fontFamily: IPS, outline: "none", boxShadow: "0 2px 8px rgba(91,122,104,0.04)", boxSizing: "border-box" }}
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "#E2E8F0", border: "none", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* List of Student Cards */}
          <div style={{ padding: "8px 16px 96px", display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredInClass.map(s => {
              const abkPill = getAbkPillStyle(s.abk);
              return (
                <div
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  style={{ background: "#FFFFFF", borderRadius: 20, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 10px rgba(91,122,104,0.06)", border: "1px solid rgba(91,122,104,0.10)", cursor: "pointer", position: "relative" }}
                  className="active:scale-[0.99] transition-all hover:shadow-md"
                >
                  {fotoSiswa(s) ? (
                    <img
                      src={fotoSiswa(s)}
                      alt={`Foto profil ${s.name}`}
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `1.5px solid ${s.gender === "L" ? "rgba(45,84,62,0.22)" : "rgba(210,110,91,0.28)"}` }}
                    />
                  ) : (
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: s.gender === "L" ? "#EBF4EE" : "#FBF1EF", border: `1.5px solid ${s.gender === "L" ? "rgba(45,84,62,0.22)" : "rgba(210,110,91,0.28)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={21} style={{ color: s.gender === "L" ? "#3D7A5E" : "#C0603A" }} />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: PJS, fontSize: 15.5, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.25 }}>
                      {s.name}
                    </h3>

                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 5 }}>
                      <span style={{ background: abkPill.bg, color: abkPill.color, fontSize: 10.5, fontWeight: 700, fontFamily: PJS, padding: "3px 9px", borderRadius: 12, display: "inline-block", whiteSpace: "nowrap" }}>
                        {s.abk}
                      </span>
                      {(() => {
                        const st = getStudentAsesmenStatus(s);
                        if (st === "completed") {
                          return (
                            <span style={{ background: "#ECFDF5", color: "#059669", fontSize: 10.5, fontWeight: 700, fontFamily: PJS, padding: "3px 9px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 3.5, whiteSpace: "nowrap" }}>
                              <CheckCircle size={11} strokeWidth={2.5} />
                              <span>Selesai</span>
                            </span>
                          );
                        }
                        if (st === "in_progress") {
                          return (
                            <span style={{ background: "#EFF6FF", color: "#2563EB", fontSize: 10.5, fontWeight: 700, fontFamily: PJS, padding: "3px 9px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 3.5, whiteSpace: "nowrap" }}>
                              <Clock size={11} strokeWidth={2.5} />
                              <span>Berjalan</span>
                            </span>
                          );
                        }
                        return (
                          <span style={{ background: "#FFFBEB", color: "#B45309", fontSize: 10.5, fontWeight: 700, fontFamily: PJS, padding: "3px 9px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 3.5, whiteSpace: "nowrap" }}>
                            <Clock size={11} strokeWidth={2.5} />
                            <span>Belum asesmen</span>
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <ChevronRight size={18} style={{ color: "#94A3B8", flexShrink: 0 }} />
                </div>
              );
            })}

            {filteredInClass.length === 0 && (
              <div style={{ textAlign: "center", padding: "36px 16px", color: MUTED, fontSize: 13 }}>
                Tidak ada data yang cocok dengan pencarian "{q}".
              </div>
            )}
          </div>

          {/* ── Sticky Floating Button "+ Tambah Siswa / Anak" ── */}
          <div style={{ position: "sticky", bottom: 20, display: "flex", justifyContent: "flex-end", paddingRight: 16, pointerEvents: "none", marginTop: -70, zIndex: 40 }}>
            <button
              onClick={onAddStudent}
              style={{ background: "#5B7A68", color: "#FFFFFF", fontFamily: PJS, fontWeight: 800, fontSize: 13, padding: "12px 20px", borderRadius: 24, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 6px 18px rgba(91,122,104,0.35)", pointerEvents: "auto" }}
              className="active:scale-95 transition-transform"
            >
              <Plus size={16} strokeWidth={2.6} /> {addBtnLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

