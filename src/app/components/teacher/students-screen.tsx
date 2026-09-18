import { useState } from "react";
import {
  Search, User, Settings, Plus, ArrowLeft, ChevronRight, CheckCircle, UserPlus, Check,
  Calendar, Users, SlidersHorizontal, X,
} from "lucide-react";
import {
  A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, useUI, TBar,
} from "../ui-kit";
import { useStudents, type Screen } from "../data";
import { type GuruProfile } from "../auth";

import classDrawingImg from "@/imports/class_drawing.jpg";
import classGroupImg from "@/imports/class_group.jpg";
import classActivityImg from "@/imports/class_activity.jpg";

export interface KelasCardData {
  id: string;
  nama: string;
  abk: string;
  img: string;
  count?: number;
  jenjang?: "SDLB" | "SMPLB" | "SMALB";
}

export const JENJANG_OPTIONS = [
  { id: "Semua", label: "Semua Jenjang" },
  { id: "SDLB", label: "SDLB" },
  { id: "SMPLB", label: "SMPLB" },
  { id: "SMALB", label: "SMALB" },
];

export function getKelasJenjang(k: KelasCardData): "SDLB" | "SMPLB" | "SMALB" {
  if (k.jenjang) return k.jenjang;
  const upper = k.nama.toUpperCase();
  if (upper.includes("SMALB") || /\b(X|XI|XII)\b/.test(upper) || /\b(10|11|12)\b/.test(upper)) {
    return "SMALB";
  }
  if (upper.includes("SMPLB") || /\b(VII|VIII|IX)\b/.test(upper) || /\b([7-9])\b/.test(upper)) {
    return "SMPLB";
  }
  if (upper.includes("SDLB") || /\b(I|II|III|IV|V|VI)\b/.test(upper) || /\b([1-6])\b/.test(upper)) {
    return "SDLB";
  }
  return "SMPLB";
}

export const DEFAULT_KELAS_CARDS: KelasCardData[] = [
  { id: "vi-a", nama: "Kelas VI A", abk: "Tunarungu", img: classGroupImg, count: 10, jenjang: "SDLB" },
  { id: "vii", nama: "Kelas VII", abk: "Tunalaras", img: classDrawingImg, count: 10, jenjang: "SMPLB" },
  { id: "ix-a", nama: "IX A", abk: "Tunadaksa", img: classActivityImg, count: 10, jenjang: "SMPLB" },
  { id: "x-b", nama: "Kelas X B", abk: "Autism Spectrum", img: classDrawingImg, count: 8, jenjang: "SMALB" },
];

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
  const [kelasList, setKelasList] = useState<KelasCardData[]>(DEFAULT_KELAS_CARDS);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isAddingKelas, setIsAddingKelas] = useState(false);
  const [schoolName, setSchoolName] = useState(guru?.sekolah || "SLB N Surakarta");
  const [newNama, setNewNama] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState<string>("Semua");
  const [selectedNewJenjang, setSelectedNewJenjang] = useState<"SDLB" | "SMPLB" | "SMALB">("SMPLB");
  const [selectedAbk, setSelectedAbk] = useState("Autism Spectrum Disorder");
  const [customAbk, setCustomAbk] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [justAddedKelasNama, setJustAddedKelasNama] = useState("");
  const [q, setQ] = useState("");
  const [selectedTA, setSelectedTA] = useState("2025/2026");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const tahunAjaranList = ["2023/2024", "2024/2025", "2025/2026"];

  const selectedClass = kelasList.find(k => k.id === selectedClassId);

  const getAbkBadge = (abk: string) => {
    if (abk.includes("Laras") || abk.includes("Ganda") || abk.includes("Autis")) {
      return { bg: "#F3E8FF", color: "#7C3AED", border: "1px solid #E9D5FF" };
    }
    if (abk.includes("Rungu") || abk.includes("Wicara")) {
      return { bg: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" };
    }
    if (abk.includes("Daksa") || abk.includes("Netra")) {
      return { bg: "#FFF7ED", color: "#EA580C", border: "1px solid #FFEDD5" };
    }
    return { bg: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" };
  };

  const handleSaveKelas = () => {
    if (!newNama.trim()) return;
    const abkFinal = selectedAbk === "Lainnya" && customAbk.trim() ? customAbk.trim() : selectedAbk;
    const imgs = [classDrawingImg, classGroupImg, classActivityImg];
    const namaAdded = newNama.trim();
    const newK: KelasCardData = {
      id: Date.now().toString(),
      nama: namaAdded,
      abk: abkFinal,
      jenjang: selectedNewJenjang,
      img: imgs[kelasList.length % imgs.length],
      count: 0,
    };
    setKelasList(prev => [...prev, newK]);
    setJustAddedKelasNama(namaAdded);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setNewNama("");
    setCustomAbk("");
    setIsAddingKelas(false);
  };

  // ─── DEDICATED VIEW: TAMBAH KELAS (Exact Match to Mockup) ─────────────
  if (isAddingKelas) {
    const abkOptions = [
      "Autism Spectrum Disorder",
      "Tunarungu",
      "Tunadaksa",
      "Tunagrahita Ringan",
      "Tunagrahita Sedang",
      "Tunanetra",
      "Tunalaras",
      "Lainnya"
    ];

    return (
      <div className="flex-1 flex flex-col relative overflow-hidden" style={{ fontFamily: IPS, background: "#EEF4F0", height: "100%" }}>
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {/* Top Header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px 14px", background: "#EEF4F0" }}>
            <button
              onClick={() => setIsAddingKelas(false)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 0 0", display: "flex", alignItems: "center", color: "#1B2E24" }}
              title="Kembali"
            >
              <ArrowLeft size={22} strokeWidth={2.4} />
            </button>
            <div>
              <h1 style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>
                Tambah Kelas
              </h1>
              <p style={{ fontFamily: IPS, fontSize: 12.5, color: "#6B7280", margin: 0, marginTop: 3, fontWeight: 500 }}>
                Lengkapi informasi kelas yang akan ditambahkan
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div style={{
            margin: "8px 16px 36px",
            background: "#FFFFFF",
            border: `1.5px solid ${BDR}`,
            borderRadius: 24,
            padding: "22px 18px 24px",
            boxShadow: "0 4px 16px rgba(91,122,104,0.06)"
          }}>
            {/* Field 1: Nama Sekolah */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#1B2E24", marginBottom: 8 }}>
                Nama Sekolah
              </label>
              <input
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                placeholder="Nama sekolah . contoh: SLB N Surakarta"
                style={{
                  width: "100%",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: 14,
                  padding: "13px 16px",
                  fontSize: 13.5,
                  fontFamily: IPS,
                  color: "#1B2E24",
                  background: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Field 2: Kelompok Kelas/Ekskul/Mapel * */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#1B2E24", marginBottom: 8 }}>
                Kelompok Kelas/Ekskul/Mapel <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                value={newNama}
                onChange={e => setNewNama(e.target.value)}
                placeholder="Nama kelas · contoh: VII A"
                style={{
                  width: "100%",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: 14,
                  padding: "13px 16px",
                  fontSize: 13.5,
                  fontFamily: IPS,
                  color: "#1B2E24",
                  background: "#FFFFFF",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Field 3: Jenjang Pendidikan * */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#1B2E24", marginBottom: 8 }}>
                Jenjang Pendidikan <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {(["SDLB", "SMPLB", "SMALB"] as const).map(j => {
                  const isSel = selectedNewJenjang === j;
                  const labelMap = {
                    SDLB: "SDLB (I - VI)",
                    SMPLB: "SMPLB (VII - IX)",
                    SMALB: "SMALB (X - XII)"
                  };
                  return (
                    <button
                      key={j}
                      type="button"
                      onClick={() => setSelectedNewJenjang(j)}
                      style={{
                        padding: "9px 6px",
                        borderRadius: 14,
                        border: isSel ? `1.5px solid ${DEEP}` : `1.5px solid #E2E8F0`,
                        background: isSel ? SEC : "#FFFFFF",
                        color: isSel ? DEEP : "#475569",
                        fontFamily: PJS,
                        fontSize: 11.5,
                        fontWeight: isSel ? 800 : 700,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.15s"
                      }}
                    >
                      {labelMap[j]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ABK Options Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {abkOptions.map(opt => {
                const isSelected = selectedAbk === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedAbk(opt)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 9999,
                      background: isSelected ? "#5B7A68" : "#EBF3ED",
                      border: isSelected ? "1.5px solid #5B7A68" : `1.5px solid ${BDR}`,
                      color: isSelected ? "#FFFFFF" : "#2E4737",
                      fontFamily: PJS,
                      fontSize: 12.5,
                      fontWeight: isSelected ? 800 : 700,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "inline-flex",
                      alignItems: "center"
                    }}
                    className="active:scale-95"
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Custom ABK Input if Lainnya is selected */}
            {selectedAbk === "Lainnya" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontFamily: PJS, fontSize: 12, fontWeight: 700, color: "#5B7A68", marginBottom: 6 }}>
                  Ketik Jenis Kekhususan:
                </label>
                <input
                  value={customAbk}
                  onChange={e => setCustomAbk(e.target.value)}
                  placeholder="Contoh: Lamban Belajar / ADHD"
                  style={{
                    width: "100%",
                    border: "1.5px solid #5B7A68",
                    borderRadius: 12,
                    padding: "11px 14px",
                    fontSize: 13,
                    fontFamily: IPS,
                    color: "#1B2E24",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              disabled={!newNama.trim()}
              onClick={handleSaveKelas}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                background: newNama.trim() ? "#5B7A68" : "#CBD5E1",
                color: "#FFFFFF",
                border: "none",
                fontFamily: PJS,
                fontSize: 14,
                fontWeight: 800,
                cursor: newNama.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.2s ease",
                boxShadow: newNama.trim() ? "0 4px 14px rgba(91,122,104,0.25)" : "none"
              }}
              className={newNama.trim() ? "active:scale-[0.98]" : ""}
            >
              <Plus size={16} strokeWidth={2.8} /> Tambah Kelas
            </button>

            {/* Helper Caption */}
            <p style={{
              fontFamily: IPS,
              fontSize: 11.5,
              color: "#64748B",
              marginTop: 14,
              marginBottom: 0,
              lineHeight: 1.4
            }}>
              Isi nama kelas + tekan jenis ABK, lalu tekan <strong style={{ color: "#334155" }}>Tambah Kelas</strong>
            </p>
          </div>
        </div>

        {/* Modal Sukses (Selalu tepat di dalam Frame HP) */}
        {showSuccessModal && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 100,
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                width: "100%",
                maxWidth: 320,
                borderRadius: 28,
                padding: "26px 20px 22px",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.22), 0 4px 12px rgba(91,122,104,0.15)",
                border: "1.5px solid rgba(91,122,104,0.25)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Icon Centang Hijau */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "#8EA194",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  boxShadow: "0 6px 16px rgba(142,161,148,0.4)",
                  color: "#FFFFFF",
                }}
              >
                <Check size={36} strokeWidth={3} />
              </div>

              {/* Teks Pesan */}
              <h3
                style={{
                  fontFamily: PJS,
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#1F2937",
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}
              >
                Kelas berhasil ditambahkan!
              </h3>
              <p
                style={{
                  fontFamily: IPS,
                  fontSize: 13,
                  color: "#4B5563",
                  marginBottom: 20,
                  lineHeight: 1.45,
                  padding: "0 4px",
                }}
              >
                Kelas <span style={{ fontWeight: 700, color: "#111827" }}>{justAddedKelasNama || "VII A"}</span> telah berhasil ditambahkan ke daftar kelas Anda
              </p>

              {/* Tombol Aksi Modal */}
              <button
                type="button"
                onClick={handleCloseSuccessModal}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  background: "#D9826B",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 16,
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: "0 6px 16px rgba(217,130,107,0.35)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="hover:opacity-95 active:scale-[0.98]"
              >
                Oke, Mengerti
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If viewing a specific class detail (students in this class)
  if (selectedClass) {
    const classStudents = students.filter(s =>
      s.kelas.toLowerCase().replace(/\s+/g, '').includes(selectedClass.nama.toLowerCase().replace(/\s+/g, '')) ||
      selectedClass.nama.toLowerCase().replace(/\s+/g, '').includes(s.kelas.toLowerCase().replace(/\s+/g, ''))
    );
    const filteredInClass = classStudents.filter(s =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.abk.toLowerCase().includes(q.toLowerCase())
    );

    return (
      <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: "#F7F9F8" }}>
        <TBar
          title={selectedClass.nama}
          sub={`${selectedClass.abk} · ${classStudents.length} Siswa`}
          onBack={() => { setSelectedClassId(null); setQ(""); }}
          right={
            <button
              onClick={onAddStudent}
              style={{
                background: A,
                color: "#fff",
                fontFamily: PJS,
                minHeight: 38,
                borderRadius: 12,
                padding: "0 12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(210,125,107,0.35)"
              }}
              className="flex items-center gap-1.5 text-xs active:scale-95 transition-transform"
            >
              <UserPlus size={14} /> Tambah Siswa
            </button>
          }
        />

        <div style={{ padding: "14px 16px 80px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Search bar inside class */}
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={`Cari siswa di ${selectedClass.nama}...`}
              style={{
                width: "100%",
                border: "1.5px solid rgba(91,122,104,0.20)",
                borderRadius: 16,
                padding: "11px 14px 11px 40px",
                fontSize: 14,
                color: TEXT,
                fontFamily: IPS,
                background: CARD,
                outline: "none",
                minHeight: 46
              }}
            />
          </div>

          {classStudents.length === 0 ? (
            <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 22, padding: "32px 20px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, background: SEC, borderRadius: 16, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                🏫
              </div>
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 15, color: TEXT, marginBottom: 4 }}>Belum ada siswa di {selectedClass.nama}</p>
              <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, marginBottom: 16 }}>Tambahkan siswa pertama ke kelas ini untuk mulai memantau perkembangan dan bakatnya.</p>
              <button onClick={onAddStudent} style={{ background: A, color: "#fff", fontFamily: PJS, fontWeight: 800, fontSize: 12, padding: "10px 18px", borderRadius: 14, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <UserPlus size={15} /> Tambah Siswa ke {selectedClass.nama}
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 10
            }}>
              {filteredInClass.map(s => (
                <button
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  style={{
                    background: CARD,
                    border: `1.5px solid rgba(91,122,104,0.18)`,
                    borderRadius: 20,
                    padding: "14px 10px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(91,122,104,0.06)",
                    cursor: "pointer",
                    position: "relative",
                    width: "100%",
                    minWidth: 0,
                  }}
                  className="active:scale-[0.98] transition-all hover:shadow-md group"
                >
                  {/* Emoji Avatar */}
                  <div style={{
                    width: 48,
                    height: 48,
                    background: SEC,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    marginBottom: 8,
                    boxShadow: "inset 0 0 0 1px rgba(91,122,104,0.14)"
                  }}>
                    {s.emoji}
                  </div>

                  {/* Name */}
                  <p style={{
                    fontFamily: PJS,
                    fontSize: 13.5,
                    fontWeight: 800,
                    color: TEXT,
                    lineHeight: 1.25,
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }} title={s.name}>
                    {s.name}
                  </p>

                  {/* ABK & Age */}
                  <p style={{
                    fontSize: 11,
                    color: MUTED,
                    marginTop: 2,
                    marginBottom: 8,
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {s.abk}{s.age ? ` · ${s.age} th` : ""}
                  </p>

                  {/* Observation Status Badge */}
                  <span style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 12,
                    background: s.hasObs ? "#ECFDF5" : "rgba(210,125,107,0.14)",
                    color: s.hasObs ? "#059669" : A,
                    border: `1px solid ${s.hasObs ? "#A7F3D0" : "rgba(210,125,107,0.35)"}`,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    maxWidth: "100%",
                    whiteSpace: "nowrap"
                  }}>
                    {s.hasObs ? <CheckCircle size={10} /> : null}
                    {s.hasObs ? "Sudah Diamati" : "Belum Diamati"}
                  </span>

                  {/* Talent Badge */}
                  {s.talent && (
                    <span style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 10,
                      background: SEC,
                      color: DEEP,
                      marginTop: 5,
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {s.talent}
                    </span>
                  )}
                </button>
              ))}

              {filteredInClass.length === 0 && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "24px 10px", color: MUTED, fontSize: 12 }}>
                  Tidak ada siswa yang cocok dengan pencarian.
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setSelectedClassId(null)}
            style={{
              marginTop: 12,
              background: "transparent",
              color: DEEP,
              border: `1.5px solid ${BDR}`,
              borderRadius: 14,
              padding: "10px",
              fontFamily: PJS,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            ← Kembali ke Semua Kelas
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN VIEW: KELAS SAYA SCREEN (Exact Match to Mockup) ─────────────
  const filteredClasses = kelasList.filter(k => {
    const matchesQ = k.nama.toLowerCase().includes(q.toLowerCase()) ||
      k.abk.toLowerCase().includes(q.toLowerCase());
    const matchesJenjang = selectedJenjang === "Semua" || getKelasJenjang(k) === selectedJenjang;
    return matchesQ && matchesJenjang;
  });

  return (
    <div className="flex-1 overflow-y-auto relative" style={{ fontFamily: IPS, background: "#F7F9F8" }}>
      {/* ── Header ── */}
      <div style={{ background: CARD, paddingTop: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "8px 20px 10px" }}>
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 24, fontWeight: 800, color: "#1B2E24", lineHeight: 1.15 }}>
              Kelas Saya
            </h1>
            <p style={{ fontSize: 13, color: MUTED, marginTop: 4, fontWeight: 500 }}>
              Kelola Kelas dengan Mudah
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 4 }}>
            <button onClick={openSearch}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.12)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Cari">
              <Search size={16} style={{ color: TEXT }} />
            </button>
            <button onClick={() => {
              if (students.length > 0) onSelect(students[0].id);
            }}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.12)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Profil Siswa">
              <User size={16} style={{ color: TEXT }} />
            </button>
            <button onClick={openSettings}
              style={{ width: 38, height: 38, background: "rgba(139,176,152,0.12)", borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Pengaturan">
              <Settings size={16} style={{ color: TEXT }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Bar & Filter Button ── */}
      {(() => {
        const isFilterActive = selectedJenjang !== "Semua" || selectedTA !== "2025/2026";
        return (
          <>
            <div style={{ padding: "14px 16px 6px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Cari nama atau jenis ABK..."
                  style={{
                    width: "100%",
                    border: "1.5px solid rgba(91,122,104,0.20)",
                    borderRadius: 18,
                    padding: "12px 36px 12px 42px",
                    fontSize: 13.5,
                    color: TEXT,
                    fontFamily: IPS,
                    background: CARD,
                    outline: "none",
                    minHeight: 46,
                    boxShadow: "0 2px 6px rgba(91,122,104,0.04)",
                    boxSizing: "border-box"
                  }}
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    style={{
                      position: "absolute",
                      right: 12,
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
                      color: "#64748B"
                    }}
                    title="Hapus pencarian"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setShowFilterSheet(true)}
                style={{
                  height: 46,
                  padding: "0 13px",
                  borderRadius: 18,
                  border: isFilterActive ? "1.5px solid #3F6851" : "1.5px solid rgba(91,122,104,0.20)",
                  background: isFilterActive ? "#3F6851" : CARD,
                  color: isFilterActive ? "#FFFFFF" : "#1B2E24",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                  boxShadow: isFilterActive ? "0 3px 10px rgba(63,104,81,0.25)" : "0 2px 6px rgba(91,122,104,0.04)",
                  position: "relative",
                  transition: "all 0.15s ease"
                }}
                className="active:scale-95"
                title="Filter Kelas"
              >
                <SlidersHorizontal size={17} strokeWidth={2.4} />
                <span>Filter</span>
                {isFilterActive && (
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#4ADE80",
                    border: "2px solid #3F6851",
                    position: "absolute",
                    top: 6,
                    right: 6
                  }} />
                )}
              </button>
            </div>

            {/* Active Filter Chips (if any filter is active) */}
            {isFilterActive && (
              <div style={{ padding: "2px 16px 8px", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontFamily: IPS, color: "#64748B", fontWeight: 600 }}>Filter aktif:</span>
                {selectedJenjang !== "Semua" && (
                  <span style={{
                    fontSize: 11,
                    fontFamily: PJS,
                    fontWeight: 700,
                    background: "#E8F3ED",
                    color: "#2C543E",
                    padding: "3px 8px 3px 10px",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    border: "1px solid #B8DCC6"
                  }}>
                    Jenjang: {selectedJenjang}
                    <button
                      type="button"
                      onClick={() => setSelectedJenjang("Semua")}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#2C543E" }}
                      title="Hapus filter jenjang"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </span>
                )}
                {selectedTA !== "2025/2026" && (
                  <span style={{
                    fontSize: 11,
                    fontFamily: PJS,
                    fontWeight: 700,
                    background: "#E8F3ED",
                    color: "#2C543E",
                    padding: "3px 8px 3px 10px",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    border: "1px solid #B8DCC6"
                  }}>
                    TA: {selectedTA}
                    <button
                      type="button"
                      onClick={() => setSelectedTA("2025/2026")}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#2C543E" }}
                      title="Hapus filter tahun ajaran"
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJenjang("Semua");
                    setSelectedTA("2025/2026");
                  }}
                  style={{
                    fontSize: 11,
                    fontFamily: IPS,
                    color: "#DC2626",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                    fontWeight: 600,
                    textDecoration: "underline"
                  }}
                >
                  Reset
                </button>
              </div>
            )}

            {/* ── Filter Bottom Sheet Modal ── */}
            {showFilterSheet && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(3px)",
                  WebkitBackdropFilter: "blur(3px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  zIndex: 100
                }}
                onClick={() => setShowFilterSheet(false)}
              >
                <div
                  onClick={e => e.stopPropagation()}
                  style={{
                    background: "#FFFFFF",
                    borderTopLeftRadius: 26,
                    borderTopRightRadius: 26,
                    padding: "16px 20px 24px",
                    boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
                    borderTop: "1.5px solid rgba(91,122,104,0.15)",
                    maxHeight: "85%",
                    overflowY: "auto"
                  }}
                >
                  {/* Drag Handle Indicator */}
                  <div style={{ width: 38, height: 4, background: "#CBD5E1", borderRadius: 999, margin: "0 auto 14px" }} />

                  {/* Modal Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        background: "#E8F3ED",
                        color: "#2C543E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <SlidersHorizontal size={16} strokeWidth={2.4} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: "#1B2E24", margin: 0 }}>
                          Filter Kelas
                        </h3>
                        <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#64748B", margin: 0, marginTop: 1 }}>
                          Saring daftar kelas sesuai kebutuhan
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFilterSheet(false)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#F1F5F9",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748B"
                      }}
                      title="Tutup"
                    >
                      <X size={16} strokeWidth={2.4} />
                    </button>
                  </div>

                  {/* 1. Tahun Ajaran */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
                      <Calendar size={15} strokeWidth={2.3} style={{ color: "#3F6851" }} />
                      <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: "#1B2E24" }}>
                        Tahun Ajaran
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {tahunAjaranList.map(ta => {
                        const isSel = selectedTA === ta;
                        return (
                          <button
                            key={ta}
                            type="button"
                            onClick={() => setSelectedTA(ta)}
                            style={{
                              padding: "7px 16px",
                              borderRadius: 9999,
                              border: isSel ? "1.5px solid #3F6851" : "1.5px solid #CBD5E1",
                              background: isSel ? "#3F6851" : "#F8FAFC",
                              color: isSel ? "#FFFFFF" : "#334155",
                              fontFamily: PJS,
                              fontWeight: 700,
                              fontSize: 12.5,
                              cursor: "pointer",
                              transition: "all 0.15s",
                              boxShadow: isSel ? "0 2px 6px rgba(63,104,81,0.25)" : "none"
                            }}
                            className="active:scale-95"
                          >
                            {ta}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Jenjang Kelas */}
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
                      <Users size={15} strokeWidth={2.3} style={{ color: "#3F6851" }} />
                      <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: "#1B2E24" }}>
                        Jenjang Kelas
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                      {(["Semua", "SDLB", "SMPLB", "SMALB"] as const).map(j => {
                        const isSel = selectedJenjang === j;
                        return (
                          <button
                            key={j}
                            type="button"
                            onClick={() => setSelectedJenjang(j)}
                            style={{
                              padding: "10px 12px",
                              borderRadius: 14,
                              border: isSel ? "1.5px solid #3F6851" : "1.5px solid #E2E8F0",
                              background: isSel ? "#EBF3ED" : "#FFFFFF",
                              color: isSel ? "#1E3E2B" : "#475569",
                              fontFamily: PJS,
                              fontWeight: isSel ? 800 : 700,
                              fontSize: 12.5,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              transition: "all 0.15s"
                            }}
                            className="active:scale-95"
                          >
                            <span>{j === "Semua" ? "Semua Jenjang" : j}</span>
                            {isSel && (
                              <div style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: "#3F6851",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}>
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10, paddingTop: 6 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJenjang("Semua");
                        setSelectedTA("2025/2026");
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: 14,
                        border: "1.5px solid #CBD5E1",
                        background: "#FFFFFF",
                        color: "#475569",
                        fontFamily: PJS,
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer"
                      }}
                      className="active:scale-95"
                    >
                      Reset Filter
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFilterSheet(false)}
                      style={{
                        flex: 1.5,
                        padding: "12px",
                        borderRadius: 14,
                        border: "none",
                        background: "#3F6851",
                        color: "#FFFFFF",
                        fontFamily: PJS,
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(63,104,81,0.25)"
                      }}
                      className="active:scale-95"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* ── Class Cards List ── */}
      <div style={{
        padding: "10px 16px 90px",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 12
      }}>
        {filteredClasses.map(k => {
          const abkStyle = getAbkBadge(k.abk);
          const jenjangLabel = getKelasJenjang(k);
          const studentCount = students.filter(s =>
            s.kelas.toLowerCase().replace(/\s+/g, '').includes(k.nama.toLowerCase().replace(/\s+/g, '')) ||
            k.nama.toLowerCase().replace(/\s+/g, '').includes(s.kelas.toLowerCase().replace(/\s+/g, ''))
          ).length || k.count || 10;

          return (
            <button
              key={k.id}
              onClick={() => setSelectedClassId(k.id)}
              style={{
                background: CARD,
                border: `1.5px solid rgba(91,122,104,0.18)`,
                borderRadius: 20,
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(91,122,104,0.06)",
                minWidth: 0,
              }}
              className="active:scale-[0.98] transition-all hover:shadow-md"
            >
              {/* Image Banner */}
              <div style={{
                position: "relative",
                width: "100%",
                height: 94,
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 10,
                border: "1px solid rgba(0,0,0,0.06)"
              }}>
                <img
                  src={k.img}
                  alt={k.nama}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                <span style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2.5px 7px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.92)",
                  color: "#059669",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontFamily: PJS,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}>
                  <CheckCircle size={10} strokeWidth={2.5} /> {studentCount} Siswa
                </span>
              </div>

              {/* Class Details */}
              <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
                <p style={{
                  fontFamily: PJS,
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#1B2E24",
                  lineHeight: 1.2,
                  marginBottom: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }} title={k.nama}>
                  {k.nama}
                </p>

                <p style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#5B7A68",
                  fontFamily: PJS,
                  marginBottom: 8,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  {guru?.sekolah || "SLB N Surakarta"}
                </p>

                <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: 12,
                    background: "#EEF2F6",
                    color: "#334155",
                    border: "1px solid #CBD5E1",
                    fontFamily: PJS
                  }}>
                    {jenjangLabel}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2.5px 8px",
                    borderRadius: 14,
                    background: abkStyle.bg,
                    color: abkStyle.color,
                    border: abkStyle.border,
                    fontFamily: PJS,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {k.abk}
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {filteredClasses.length === 0 && (
          <div style={{
            gridColumn: "1 / -1",
            background: CARD,
            border: `1.5px dashed ${BDR}`,
            borderRadius: 22,
            padding: "36px 20px",
            textAlign: "center"
          }}>
            <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 4 }}>Tidak ada kelas yang cocok</p>
            <p style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>Gunakan kata kunci lain atau tambahkan kelas baru.</p>
            <button onClick={() => setIsAddingKelas(true)} style={{ background: A, color: "#fff", fontFamily: PJS, fontWeight: 800, fontSize: 12, padding: "10px 16px", borderRadius: 14, border: "none", cursor: "pointer" }}>
              + Tambah Kelas Baru
            </button>
          </div>
        )}
      </div>

      {/* ── Sticky Floating Button "+ Tambah Kelas" ── */}
      <div style={{
        position: "sticky",
        bottom: 20,
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: 16,
        pointerEvents: "none",
        marginTop: -70,
        zIndex: 10
      }}>
        <button
          onClick={() => setIsAddingKelas(true)}
          style={{
            background: "#D27D6B",
            color: "#FFFFFF",
            fontFamily: PJS,
            fontWeight: 800,
            fontSize: 13,
            padding: "12px 20px",
            borderRadius: 24,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 6px 20px rgba(210,125,107,0.40)",
            pointerEvents: "auto"
          }}
          className="active:scale-95 transition-transform"
        >
          <Plus size={16} strokeWidth={2.6} /> Tambah Kelas
        </button>
      </div>
    </div>
  );
}
