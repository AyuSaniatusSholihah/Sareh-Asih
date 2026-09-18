import { useState, useMemo } from "react";
import {
  CheckCircle, FileSpreadsheet, FileText, Download, Users, User,
  School, ChevronDown, Check, Sparkles, Filter, Info, Search, X,
} from "lucide-react";
import {
  CARD, TEXT, MUTED, SEC, T, A, DEEP, PJS, IPS, BG, BDR, DMM,
} from "../ui-kit";
import { useStudents, type Student } from "../data";
import { exportSpreadsheet, exportLaporanPemetaan } from "../export";

type FilterScope = "semua" | "kelas" | "anak";

export function ReportScreen({ namaSekolah }: { namaSekolah: string }) {
  const students = useStudents();
  const [scope, setScope] = useState<FilterScope>("semua");
  const [selectedClass, setSelectedClass] = useState<string>("Semua");
  const [selectedStudentId, setSelectedStudentId] = useState<number | "semua">("semua");
  const [toastEkspor, setToastEkspor] = useState("");
  const [searchAnak, setSearchAnak] = useState("");

  // Extract all unique classes
  const classes = useMemo(() => {
    return Array.from(new Set(students.map(s => s.kelas))).sort();
  }, [students]);

  // Filtered student list specifically for the "Per Anak" selector
  const searchedAnakList = useMemo(() => {
    if (!searchAnak.trim()) return students;
    const q = searchAnak.toLowerCase().trim();
    return students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.abk.toLowerCase().includes(q) ||
      s.kelas.toLowerCase().includes(q)
    );
  }, [students, searchAnak]);

  // Compute filtered students based on active scope
  const filteredList = useMemo(() => {
    if (scope === "semua") {
      return students;
    }
    if (scope === "kelas") {
      if (selectedClass === "Semua") return students;
      return students.filter(s =>
        s.kelas.toLowerCase().replace(/\s+/g, '') === selectedClass.toLowerCase().replace(/\s+/g, '')
      );
    }
    if (scope === "anak") {
      if (selectedStudentId === "semua") return students;
      return students.filter(s => s.id === selectedStudentId);
    }
    return students;
  }, [students, scope, selectedClass, selectedStudentId]);

  const handleDownloadExcel = () => {
    if (filteredList.length === 0) return;
    exportSpreadsheet(filteredList, namaSekolah);
    const msg = scope === "anak" && selectedStudentId !== "semua"
      ? `Rekap Excel ${filteredList[0]?.name} berhasil diunduh!`
      : `Rekap Excel untuk ${filteredList.length} siswa berhasil diunduh!`;
    setToastEkspor(msg);
    setTimeout(() => setToastEkspor(""), 3200);
  };

  const handleDownloadWord = () => {
    if (filteredList.length === 0) return;
    exportLaporanPemetaan(filteredList, namaSekolah);
    const msg = scope === "anak" && selectedStudentId !== "semua"
      ? `Laporan Word ${filteredList[0]?.name} berhasil diunduh!`
      : `Laporan Word untuk ${filteredList.length} siswa berhasil diunduh!`;
    setToastEkspor(msg);
    setTimeout(() => setToastEkspor(""), 3200);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <div className="px-4 pt-3 pb-8 space-y-4">
        {/* Toast Notifikasi */}
        {toastEkspor && (
          <div
            style={{
              background: "#ECFDF5",
              border: "1.5px solid #A7F3D0",
              boxShadow: "0 4px 14px rgba(5, 150, 105, 0.15)",
              borderRadius: 16,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "fadeIn 0.2s ease",
            }}
          >
            <CheckCircle size={18} style={{ color: "#059669", flexShrink: 0 }} />
            <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: "#065F46", margin: 0 }}>
              {toastEkspor}
            </p>
          </div>
        )}

        {/* ── CARD 1: FILTER CAKUPAN UNDUH ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px", border: "1px solid rgba(91,122,104,0.12)", boxShadow: "0 2px 8px rgba(91,122,104,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Filter size={16} style={{ color: DEEP }} />
            <h2 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, margin: 0 }}>
              Pilih Cakupan Siswa
            </h2>
          </div>
          <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "0 0 12px", lineHeight: 1.4 }}>
            Secara default mengunduh seluruh siswa dari semua kelas. Anda dapat memfilter per kelas atau per anak.
          </p>

          {/* Segmented Control Filter Tabs */}
          <div
            style={{
              display: "flex",
              background: "#F1F5F9",
              borderRadius: 14,
              padding: 4,
              gap: 4,
            }}
          >
            {[
              { id: "semua" as FilterScope, label: "Semua Siswa", icon: <Users size={14} /> },
              { id: "kelas" as FilterScope, label: "Per Kelas", icon: <School size={14} /> },
              { id: "anak" as FilterScope, label: "Per Anak", icon: <User size={14} /> },
            ].map(tab => {
              const active = scope === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScope(tab.id)}
                  style={{
                    flex: 1,
                    minHeight: 38,
                    borderRadius: 10,
                    border: "none",
                    background: active ? "#FFFFFF" : "transparent",
                    color: active ? DEEP : MUTED,
                    fontFamily: PJS,
                    fontWeight: active ? 800 : 600,
                    fontSize: 12.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow: active ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.15s ease",
                  }}
                  className="active:scale-[0.98]"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Options: PER KELAS */}
          {scope === "kelas" && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed rgba(91,122,104,0.18)" }}>
              <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: DEEP, margin: "0 0 8px" }}>
                Pilih Kelas:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setSelectedClass("Semua")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 12,
                    border: selectedClass === "Semua" ? `1.5px solid ${DEEP}` : "1px solid #E2E8F0",
                    background: selectedClass === "Semua" ? DEEP : "#F8FAFC",
                    color: selectedClass === "Semua" ? "#FFFFFF" : TEXT,
                    fontFamily: PJS,
                    fontSize: 12,
                    fontWeight: selectedClass === "Semua" ? 700 : 500,
                    cursor: "pointer",
                  }}
                  className="active:scale-95 transition-all"
                >
                  Semua Kelas ({students.length})
                </button>
                {classes.map(k => {
                  const count = students.filter(s => s.kelas === k).length;
                  const active = selectedClass === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSelectedClass(k)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 12,
                        border: active ? `1.5px solid ${DEEP}` : "1px solid #E2E8F0",
                        background: active ? DEEP : "#F8FAFC",
                        color: active ? "#FFFFFF" : TEXT,
                        fontFamily: PJS,
                        fontSize: 12,
                        fontWeight: active ? 700 : 500,
                        cursor: "pointer",
                      }}
                      className="active:scale-95 transition-all"
                    >
                      Kelas {k} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter Options: PER ANAK */}
          {scope === "anak" && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed rgba(91,122,104,0.18)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: DEEP, margin: 0 }}>
                  Pilih Siswa Spesifik:
                </p>
                <span
                  style={{
                    fontFamily: DMM,
                    fontSize: 11,
                    fontWeight: 700,
                    color: searchAnak ? DEEP : MUTED,
                    background: searchAnak ? "rgba(45,84,62,0.10)" : "#F1F5F9",
                    padding: "2px 8px",
                    borderRadius: 8,
                  }}
                >
                  {searchedAnakList.length} siswa{searchAnak ? " cocok" : ""}
                </span>
              </div>

              {/* Tombol & Input Pencarian Siswa */}
              <div style={{ position: "relative", marginBottom: 10 }}>
                <Search
                  size={15}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  value={searchAnak}
                  onChange={(e) => setSearchAnak(e.target.value)}
                  placeholder="Cari nama, kelas, atau jenis ABK..."
                  style={{
                    width: "100%",
                    border: searchAnak ? `1.5px solid ${DEEP}` : "1.5px solid #E2E8F0",
                    borderRadius: 14,
                    padding: "9px 34px 9px 36px",
                    fontSize: 12.5,
                    color: TEXT,
                    fontFamily: IPS,
                    background: "#F8FAFC",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease",
                  }}
                />
                {searchAnak && (
                  <button
                    type="button"
                    onClick={() => setSearchAnak("")}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "#E2E8F0",
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#64748B",
                    }}
                    title="Hapus pencarian"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* Daftar Siswa yang difilter */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 190, overflowY: "auto", paddingRight: 4 }}>
                {/* Option: Semua Siswa (hanya tampil jika tidak sedang mencari atau kata kunci cocok) */}
                {(!searchAnak || "semua siswa".includes(searchAnak.toLowerCase())) && (
                  <div
                    onClick={() => setSelectedStudentId("semua")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: 12,
                      border: selectedStudentId === "semua" ? `1.5px solid ${DEEP}` : "1px solid #E2E8F0",
                      background: selectedStudentId === "semua" ? "rgba(45,84,62,0.08)" : "#FFFFFF",
                      cursor: "pointer",
                    }}
                    className="active:scale-[0.99] transition-all hover:bg-slate-50"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "#E2E8F0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#475569",
                        }}
                      >
                        <Users size={15} />
                      </div>
                      <div>
                        <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>
                          Semua Siswa
                        </p>
                        <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>
                          Total {students.length} siswa terdaftar
                        </p>
                      </div>
                    </div>
                    {selectedStudentId === "semua" && <Check size={16} style={{ color: DEEP }} />}
                  </div>
                )}

                {searchedAnakList.map(s => {
                  const active = selectedStudentId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        borderRadius: 12,
                        border: active ? `1.5px solid ${DEEP}` : "1px solid #E2E8F0",
                        background: active ? "rgba(45,84,62,0.08)" : "#FFFFFF",
                        cursor: "pointer",
                      }}
                      className="active:scale-[0.99] transition-all hover:bg-slate-50"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{s.emoji}</span>
                        <div>
                          <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>
                            {s.name}
                          </p>
                          <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>
                            Kelas {s.kelas} · {s.abk}
                          </p>
                        </div>
                      </div>
                      {active && <Check size={16} style={{ color: DEEP }} />}
                    </div>
                  );
                })}

                {/* Empty State jika pencarian tidak menemukan siswa */}
                {searchedAnakList.length === 0 && (
                  <div
                    style={{
                      padding: "16px 12px",
                      textAlign: "center",
                      background: "#F8FAFC",
                      borderRadius: 12,
                      border: "1px dashed #CBD5E1",
                    }}
                  >
                    <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: "#64748B", margin: "0 0 6px" }}>
                      Tidak ada siswa yang cocok dengan "{searchAnak}"
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchAnak("")}
                      style={{
                        border: "none",
                        background: "transparent",
                        color: DEEP,
                        fontFamily: PJS,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Reset pencarian
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Target Status Banner */}
          <div
            style={{
              marginTop: 14,
              background: "rgba(139,176,152,0.14)",
              borderRadius: 12,
              padding: "9px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} style={{ color: DEEP }} />
              <span style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: DEEP }}>
                {filteredList.length} Siswa Siap Diekspor
              </span>
            </div>
            <span style={{ fontFamily: IPS, fontSize: 11, color: MUTED, fontWeight: 600 }}>
              {scope === "semua" ? "Semua Kelas" : scope === "kelas" ? `Kelas ${selectedClass}` : "Siswa Terpilih"}
            </span>
          </div>
        </div>

        {/* ── CARD 2: DOKUMEN EXCEL (REKAPAN GURU) ── */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 22,
            padding: "18px 16px",
            border: "1.5px solid rgba(16, 124, 65, 0.20)",
            boxShadow: "0 4px 16px rgba(16, 124, 65, 0.06)",
            position: "relative",
          }}
        >
          {/* Badge Rekapan Guru */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span
              style={{
                background: "rgba(16, 124, 65, 0.10)",
                color: "#107C41",
                fontFamily: PJS,
                fontWeight: 800,
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <FileSpreadsheet size={13} />
              Untuk Rekapan & Arsip Guru
            </span>
            <span
              style={{
                background: "#F1F5F9",
                color: "#475569",
                fontFamily: DMM,
                fontWeight: 700,
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 8,
              }}
            >
              .CSV / EXCEL
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "rgba(16, 124, 65, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#107C41",
                flexShrink: 0,
              }}
            >
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                Rekapitulasi Data Guru
              </h3>
              <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "4px 0 0", lineHeight: 1.45 }}>
                Format tabel spreadsheet untuk kebutuhan administrasi & pemantauan internal guru pendamping.
              </p>
            </div>
          </div>

          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "10px 12px", marginBottom: 14, border: "1px solid #EDF2F7" }}>
            <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: "#334155", margin: "0 0 4px" }}>
              Isi Dokumen Excel:
            </p>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "#64748B", lineHeight: 1.5 }}>
              <li>Data lengkap identitas siswa & guru pendamping</li>
              <li>Status pengamatan, asesmen kemandirian & bakat</li>
              <li>Gaya belajar dominan & rekomendasi lomba</li>
              <li>Daftar kode akses orang tua setiap siswa</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleDownloadExcel}
            style={{
              width: "100%",
              minHeight: 46,
              background: "#107C41",
              color: "#FFFFFF",
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 14,
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(16, 124, 65, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            className="hover:brightness-105 active:scale-95 transition-all"
          >
            <Download size={16} />
            <span>Unduh Rekap Guru (Excel)</span>
          </button>
        </div>

        {/* ── CARD 3: DOKUMEN WORD (LAMPIRAN RAPOR ORANG TUA) ── */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 22,
            padding: "18px 16px",
            border: "1.5px solid rgba(24, 90, 189, 0.22)",
            boxShadow: "0 4px 16px rgba(24, 90, 189, 0.06)",
            position: "relative",
          }}
        >
          {/* Badge Rapor Anak */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span
              style={{
                background: "rgba(24, 90, 189, 0.10)",
                color: "#185ABD",
                fontFamily: PJS,
                fontWeight: 800,
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <FileText size={13} />
              Untuk Lampiran Rapor Anak & Ortu
            </span>
            <span
              style={{
                background: "#F1F5F9",
                color: "#475569",
                fontFamily: DMM,
                fontWeight: 700,
                fontSize: 11,
                padding: "3px 8px",
                borderRadius: 8,
              }}
            >
              .DOC / WORD
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "rgba(24, 90, 189, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#185ABD",
                flexShrink: 0,
              }}
            >
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                Laporan Pemetaan Rapor Anak
              </h3>
              <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "4px 0 0", lineHeight: 1.45 }}>
                Dokumen formal rapi dengan kop sekolah untuk dilampirkan langsung di buku rapor siswa ke orang tua.
              </p>
            </div>
          </div>

          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "10px 12px", marginBottom: 14, border: "1px solid #EDF2F7" }}>
            <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: "#334155", margin: "0 0 4px" }}>
              Isi Dokumen Word (Rapor):
            </p>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "#64748B", lineHeight: 1.5 }}>
              <li>Kop formal sekolah & data siswa per halaman</li>
              <li>Profil kebutuhan khusus & hasil pemetaan bakat AI</li>
              <li>Rekomendasi strategi belajar adaptif di kelas & rumah</li>
              <li>Rekomendasi ajang lomba serta kolom tanda tangan guru</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleDownloadWord}
            style={{
              width: "100%",
              minHeight: 46,
              background: "#185ABD",
              color: "#FFFFFF",
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 14,
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(24, 90, 189, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            className="hover:brightness-105 active:scale-95 transition-all"
          >
            <Download size={16} />
            <span>Unduh Lampiran Rapor (Word)</span>
          </button>
        </div>

        {/* ── CARD 4: PREVIEW SISWA TERPILIH ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px", border: "1px solid rgba(91,122,104,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <h4 style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>
              Daftar Siswa dalam Berkas ({filteredList.length})
            </h4>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>
              {filteredList.filter(s => s.hasObs).length} sudah diamati
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
            {filteredList.map(s => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  borderRadius: 12,
                  background: "#F8FAFC",
                  border: "1px solid #EDF2F7",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 18 }}>{s.emoji}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.name}
                    </p>
                    <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>
                      Kelas {s.kelas} · {s.abk}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {s.hasObs ? (
                    <span style={{ background: "#ECFDF5", color: "#059669", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, fontFamily: PJS }}>
                      {s.talent || "Terpetakan"}
                    </span>
                  ) : (
                    <span style={{ background: "#FFFBEB", color: "#B45309", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, fontFamily: PJS }}>
                      Belum Diamati
                    </span>
                  )}
                </div>
              </div>
            ))}
            {filteredList.length === 0 && (
              <p style={{ textAlign: "center", color: MUTED, fontSize: 12, padding: "16px 0", margin: 0 }}>
                Tidak ada siswa yang cocok dengan filter.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
