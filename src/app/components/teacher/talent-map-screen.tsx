import { useState, useMemo } from "react";
import {
  Users, CheckCircle2, AlertCircle, ChevronRight,
  Search, User, Settings, BarChart2,
} from "lucide-react";
import {
  TEXT, MUTED, BDR, DEEP, A, PJS, IPS, useUI, BG,
} from "../ui-kit";
import { useStudents, fotoSiswa, type Screen } from "../data";
import { exportSpreadsheet } from "../export";

type FilterStatus = "semua" | "perlu" | "terpetakan";

export function TalentMapScreen({
  go,
  onStartObs,
  onSelect,
  namaSekolah,
  onGoAsesmenPending,
}: {
  go: (s: Screen) => void;
  onStartObs: (id: number) => void;
  onSelect: (id: number) => void;
  namaSekolah?: string;
  onGoAsesmenPending?: () => void;
}) {
  const students = useStudents();
  const { openSearch, openSettings } = useUI();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua");
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const totalCount = students.length;
  const mappedCount = students.filter(s => s.hasObs).length;
  const unmappedCount = students.filter(s => !s.hasObs).length;
  const unassessedInScope = students.filter(s => !s.hasObs);
  const allAssessed = unassessedInScope.length === 0;

  const classList = useMemo(() => Array.from(new Set(students.map(s => s.kelas))), [students]);
  const filterLabel = classList.length === 1
    ? (classList[0].startsWith("Kelas") ? classList[0] : "Kelas " + classList[0])
    : "Semua Siswa";

  const statusFiltered = useMemo(() => {
    if (filterStatus === "terpetakan") return students.filter(s => s.hasObs);
    if (filterStatus === "perlu") return students.filter(s => !s.hasObs);
    return students;
  }, [students, filterStatus]);

  const doDownload = () => {
    exportSpreadsheet(students, namaSekolah || "SLB");
    setShowDownloadModal(false);
  };

  const handleDownloadClick = () => {
    if (allAssessed) {
      doDownload();
    } else {
      setShowDownloadModal(true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <div style={{ background: "#FFFFFF", padding: "14px 20px 8px", borderBottom: "1px solid rgba(91,122,104,0.08)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>Hasil Asesmen Siswa</h1>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: MUTED, margin: "4px 0 0", fontWeight: 500 }}>Semua siswa</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            <button onClick={openSearch} style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} className="active:scale-95 transition-transform" title="Cari"><Search size={17} style={{ color: TEXT }} /></button>
            <button onClick={() => { if (students.length > 0) { onSelect(students[0].id); go("profile"); } }} style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} className="active:scale-95 transition-transform" title="Profil Siswa"><User size={17} style={{ color: TEXT }} /></button>
            <button type="button" onClick={openSettings} style={{ width: 38, height: 38, background: "rgba(139,176,152,0.14)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} className="active:scale-95 transition-transform" title="Pengaturan"><Settings size={17} style={{ color: TEXT }} /></button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">
        {/* Metric Filter Cards (Berfungsi langsung sebagai filter status) */}
        <div className="grid grid-cols-3 gap-2">
          {/* 1. Total Siswa */}
          <div
            onClick={() => setFilterStatus("semua")}
            style={{
              background: filterStatus === "semua" ? "#FFFFFF" : "rgba(255,255,255,0.7)",
              borderRadius: 16,
              padding: "11px 10px 10px",
              border: filterStatus === "semua" ? `2px solid ${DEEP}` : `1px solid ${BDR}`,
              cursor: "pointer",
              boxShadow: filterStatus === "semua" ? "0 4px 12px rgba(45,84,62,0.12)" : "0 1px 4px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
            className="active:scale-95 flex flex-col justify-between"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(91,122,104,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={14} style={{ color: DEEP }} />
              </div>
              {filterStatus === "semua" && (
                <span style={{ fontSize: 9.5, fontWeight: 800, color: DEEP, background: "rgba(45,84,62,0.10)", padding: "1px 6px", borderRadius: 6, fontFamily: PJS }}>
                  Aktif
                </span>
              )}
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1 }}>{totalCount}</p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, fontWeight: filterStatus === "semua" ? 700 : 600, color: filterStatus === "semua" ? DEEP : MUTED, margin: "4px 0 0", lineHeight: 1.2 }}>Total siswa</p>
            </div>
          </div>

          {/* 2. Terpetakan */}
          <div
            onClick={() => setFilterStatus("terpetakan")}
            style={{
              background: filterStatus === "terpetakan" ? "#E2EFE7" : "#EBF4EE",
              borderRadius: 16,
              padding: "11px 10px 10px",
              border: filterStatus === "terpetakan" ? `2px solid ${DEEP}` : "1px solid rgba(45,84,62,0.18)",
              cursor: "pointer",
              boxShadow: filterStatus === "terpetakan" ? "0 4px 12px rgba(45,84,62,0.15)" : "0 1px 4px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
            className="active:scale-95 flex flex-col justify-between relative"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#D5E7DC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={14} style={{ color: DEEP }} />
              </div>
              {filterStatus === "terpetakan" ? (
                <span style={{ fontSize: 9.5, fontWeight: 800, color: DEEP, background: "rgba(45,84,62,0.15)", padding: "1px 6px", borderRadius: 6, fontFamily: PJS }}>
                  Aktif
                </span>
              ) : (
                <ChevronRight size={12} style={{ color: DEEP, opacity: 0.6 }} />
              )}
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, color: DEEP, margin: 0, lineHeight: 1 }}>{mappedCount}</p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, fontWeight: 700, color: DEEP, margin: "4px 0 0", lineHeight: 1.2 }}>Terpetakan</p>
            </div>
          </div>

          {/* 3. Perlu Asesmen */}
          <div
            onClick={() => setFilterStatus("perlu")}
            style={{
              background: filterStatus === "perlu" ? "#F8E6E2" : "#FBF1EF",
              borderRadius: 16,
              padding: "11px 10px 10px",
              border: filterStatus === "perlu" ? `2px solid ${A}` : "1px solid rgba(210,110,91,0.22)",
              cursor: "pointer",
              boxShadow: filterStatus === "perlu" ? "0 4px 12px rgba(210,110,91,0.15)" : "0 1px 4px rgba(0,0,0,0.03)",
              transition: "all 0.15s ease",
            }}
            className="active:scale-95 flex flex-col justify-between relative"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#F5DAD5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertCircle size={14} style={{ color: A }} />
              </div>
              {filterStatus === "perlu" ? (
                <span style={{ fontSize: 9.5, fontWeight: 800, color: A, background: "rgba(210,110,91,0.15)", padding: "1px 6px", borderRadius: 6, fontFamily: PJS }}>
                  Aktif
                </span>
              ) : (
                <ChevronRight size={12} style={{ color: A, opacity: 0.6 }} />
              )}
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, color: A, margin: 0, lineHeight: 1 }}>{unmappedCount}</p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, fontWeight: 700, color: A, margin: "4px 0 0", lineHeight: 1.2 }}>Perlu asesmen</p>
            </div>
          </div>
        </div>

        {/* ── Tombol Unduh Rekapan Excel ── */}
        <button onClick={handleDownloadClick} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderRadius: 18, background: "linear-gradient(135deg, #2D543E 0%, #3F6851 100%)", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(45,84,62,0.25)", transition: "all 0.15s ease" }} className="active:scale-[0.98] hover:brightness-110">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" fill="#107C41"/>
                <path d="M3 9h18M9 9v12" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                <path d="M6 6h.01M6 12h3M6 15h3M6 18h3M12 12h6M12 15h6M12 18h6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#FFFFFF", margin: 0, lineHeight: 1.2 }}>Unduh Rekapan Excel</p>
              <p style={{ fontFamily: IPS, fontSize: 11, color: "rgba(255,255,255,0.75)", margin: "3px 0 0" }}>
                {filterLabel} · {students.length} siswa{unmappedCount > 0 ? (" · ") : ""}
                {unmappedCount > 0 && <span style={{ color: "#FFD87A", fontWeight: 600 }}>{unmappedCount} belum asesmen</span>}
              </p>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "6px 11px", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: "#FFFFFF" }}>Unduh</span>
          </div>
        </button>

        {/* Daftar Siswa (rata, satu kelas) */}
        {statusFiltered.length === 0 ? (
          <div style={{ background: "#FFFFFF", border: "1.5px dashed rgba(91,122,104,0.25)", borderRadius: 20, padding: 32, textAlign: "center" }}>
            <p className="text-sm font-semibold" style={{ color: MUTED }}>Tidak ada siswa yang sesuai dengan filter ini.</p>
            <button onClick={() => setFilterStatus("semua")} style={{ marginTop: 12, background: DEEP, color: "#FFFFFF", padding: "8px 16px", borderRadius: 12, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Reset Filter</button>
          </div>
        ) : (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: ("1px solid " + BDR), boxShadow: "0 2px 8px rgba(91,122,104,0.05)", overflow: "hidden" }}>
            <div className="divide-y divide-[rgba(91,122,104,0.08)]">
              {statusFiltered.map((s, iRow) => (
                <div key={s.id} data-cm={iRow === 0 ? "guru-bakat-kelompok" : undefined} style={{ padding: "14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: s.hasObs ? "#FFFFFF" : "rgba(251,241,239,0.35)" }}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {fotoSiswa(s) ? (
                      <img
                        src={fotoSiswa(s)}
                        alt={`Foto profil ${s.name}`}
                        style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: ("1.5px solid " + (s.gender === "L" ? "rgba(45,84,62,0.22)" : "rgba(210,110,91,0.28)")) }}
                      />
                    ) : (
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: s.gender === "L" ? "#EBF4EE" : "#FBF1EF", border: ("1.5px solid " + (s.gender === "L" ? "rgba(45,84,62,0.22)" : "rgba(210,110,91,0.28)")), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <User size={20} style={{ color: s.gender === "L" ? "#3D7A5E" : "#C0603A" }} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13.5, color: TEXT, margin: 0, lineHeight: 1.25 }} className="truncate">{s.name}</p>
                      <p style={{ color: MUTED, fontSize: 11, margin: "2px 0 0", fontFamily: IPS, fontWeight: 500 }} className="truncate">{s.abk}</p>
                      <div className="mt-1.5 flex items-center">
                        {s.hasObs ? (
                          <span style={{ background: "#EBF4EE", color: DEEP, border: "1px solid rgba(45,84,62,0.18)", fontSize: 10.5, fontWeight: 700, fontFamily: PJS, padding: "2.5px 8px", borderRadius: 8, display: "inline-block" }}>{(s as any).talent || "Artistic"}</span>
                        ) : (
                          <span style={{ background: "#FBF1EF", color: A, border: "1px solid rgba(210,110,91,0.25)", fontSize: 10, fontWeight: 700, fontFamily: PJS, padding: "2.5px 8px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 3.5 }}><AlertCircle size={11} style={{ color: A }} />Belum ada asesmen</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {s.hasObs ? (
                    <button type="button" onClick={() => { onSelect(s.id); go("talent-map-detail"); }} style={{ background: "#EBF4EE", border: "1px solid rgba(45,84,62,0.22)", borderRadius: 16, padding: "7px 11px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 6px rgba(45,84,62,0.08)", transition: "all 0.15s ease" }} className="active:scale-95 hover:bg-[#DEECE2]">
                        <BarChart2 size={16} style={{ color: DEEP, flexShrink: 0 }} />
                        <div className="text-left leading-[1.12]"><p style={{ fontSize: 10.5, fontWeight: 700, color: DEEP, fontFamily: PJS, margin: 0 }}>Lihat hasil</p><p style={{ fontSize: 10.5, fontWeight: 700, color: DEEP, fontFamily: PJS, margin: 0 }}>asesmen</p></div>
                        <ChevronRight size={13} style={{ color: DEEP, flexShrink: 0 }} strokeWidth={2.5} />
                      </button>
                    ) : (
                      <button type="button" onClick={() => onStartObs(s.id)} style={{ background: "#D27D6B", border: "none", borderRadius: 16, padding: "9px 13px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0, boxShadow: "0 3px 10px rgba(210,125,107,0.30)", transition: "all 0.15s ease" }} className="active:scale-95 hover:brightness-105">
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: "#FFFFFF", fontFamily: PJS, whiteSpace: "nowrap" }}>Mulai asesmen</span>
                        <ChevronRight size={13} style={{ color: "#FFFFFF", flexShrink: 0 }} strokeWidth={2.5} />
                      </button>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Konfirmasi Download (Center Modal) ── */}
      {showDownloadModal && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(3px)" }} onClick={() => setShowDownloadModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#FFFFFF", borderRadius: 24, padding: "22px 20px", width: "100%", maxWidth: 380, boxShadow: "0 12px 36px rgba(0,0,0,0.22)", animation: "fadeIn 0.2s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><AlertCircle size={22} style={{ color: "#D97706" }} /></div>
              <div>
                <p style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, margin: 0 }}>Ada siswa belum diasesmen</p>
                <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "2px 0 0" }}>{filterLabel} · <span style={{ color: "#B45309", fontWeight: 700 }}>{unassessedInScope.length} siswa</span> belum dinilai</p>
              </div>
            </div>
            <div style={{ background: "#FFFBEB", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 14, padding: "10px 12px", margin: "12px 0 16px", maxHeight: 120, overflowY: "auto" }}>
              {unassessedInScope.slice(0, 5).map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", borderBottom: "1px solid rgba(217,119,6,0.08)" }}>
                  {fotoSiswa(s) ? (
                    <img src={fotoSiswa(s)} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.gender === "L" ? "#EBF4EE" : "#FBF1EF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><User size={12} style={{ color: s.gender === "L" ? "#3D7A5E" : "#C0603A" }} /></div>
                  )}
                  <span style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: "#92400E", flex: 1 }}>{s.name}</span>
                  <span style={{ fontFamily: IPS, fontSize: 10.5, color: "#B45309", flexShrink: 0 }}>{s.kelas}</span>
                </div>
              ))}
              {unassessedInScope.length > 5 && <p style={{ fontFamily: IPS, fontSize: 11, color: "#B45309", margin: "6px 0 0", fontWeight: 600 }}>+{unassessedInScope.length - 5} siswa lainnya belum diasesmen</p>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {onGoAsesmenPending && (
                <button onClick={() => { setShowDownloadModal(false); onGoAsesmenPending(); }} style={{ width: "100%", padding: "12px 14px", borderRadius: 14, background: "#FEF3C7", border: "1.5px solid rgba(217,119,6,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} className="active:scale-[0.98]">
                  <AlertCircle size={15} style={{ color: "#D97706" }} />
                  <span style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: "#92400E" }}>Lihat yang Belum Asesmen</span>
                  <ChevronRight size={14} style={{ color: "#D97706" }} />
                </button>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowDownloadModal(false)} style={{ flex: 1, padding: "12px 8px", borderRadius: 14, background: "#F8FAFC", border: ("1.5px solid " + BDR), cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} className="active:scale-[0.98]">
                  <span style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: MUTED }}>Kembali</span>
                </button>
                <button onClick={doDownload} style={{ flex: 1, padding: "12px 8px", borderRadius: 14, background: "linear-gradient(135deg, #2D543E, #3F6851)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 12px rgba(45,84,62,0.22)" }} className="active:scale-[0.98]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: "#FFFFFF", whiteSpace: "nowrap" }}>Tetap Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
