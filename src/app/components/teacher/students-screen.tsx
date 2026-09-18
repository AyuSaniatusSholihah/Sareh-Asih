import { useState } from "react";
import {
  Search, User, Settings, Plus, ArrowLeft, ChevronRight, CheckCircle, UserPlus, Check,
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
}

export const DEFAULT_KELAS_CARDS: KelasCardData[] = [
  { id: "vii", nama: "Kelas VII", abk: "Tunalaras", img: classDrawingImg, count: 10 },
  { id: "vi-a", nama: "Kelas VI A", abk: "Tunarungu", img: classGroupImg, count: 10 },
  { id: "ix-a", nama: "IX A", abk: "Tunadaksa", img: classActivityImg, count: 10 },
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
  const [selectedAbk, setSelectedAbk] = useState("Autism Spectrum Disorder");
  const [customAbk, setCustomAbk] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [justAddedKelasNama, setJustAddedKelasNama] = useState("");
  const [q, setQ] = useState("");
  const [selectedTA, setSelectedTA] = useState("2025/2026");
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
            <div className="space-y-2.5">
              {filteredInClass.map(s => (
                <button
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  style={{
                    background: CARD,
                    border: `1.5px solid rgba(91,122,104,0.18)`,
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 20,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    boxShadow: "0 2px 8px rgba(91,122,104,0.06)",
                    cursor: "pointer"
                  }}
                  className="active:scale-[0.99] transition-transform"
                >
                  <div style={{ width: 46, height: 46, background: SEC, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {s.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: PJS, fontSize: 14.5, fontWeight: 800, color: TEXT }}>{s.name}</p>
                    <p style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{s.abk}{s.age ? ` · ${s.age} th` : ""}</p>
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <span style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 12,
                        background: s.hasObs ? "#ECFDF5" : "rgba(210,125,107,0.14)",
                        color: s.hasObs ? "#059669" : A,
                        border: `1px solid ${s.hasObs ? "#A7F3D0" : "rgba(210,125,107,0.35)"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 3
                      }}>
                        {s.hasObs ? <CheckCircle size={10} /> : null}
                        {s.hasObs ? "Sudah Diamati" : "Belum Diamati"}
                      </span>
                      {s.talent && (
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 12, background: SEC, color: DEEP }}>
                          {s.talent}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: MUTED, flexShrink: 0 }} strokeWidth={2.2} />
                </button>
              ))}
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
  const filteredClasses = kelasList.filter(k =>
    k.nama.toLowerCase().includes(q.toLowerCase()) ||
    k.abk.toLowerCase().includes(q.toLowerCase())
  );

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

      {/* ── Search Bar ── */}
      <div style={{ padding: "14px 16px 6px" }}>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cari nama atau jenis ABK..."
            style={{
              width: "100%",
              border: "1.5px solid rgba(91,122,104,0.20)",
              borderRadius: 18,
              padding: "12px 14px 12px 42px",
              fontSize: 14,
              color: TEXT,
              fontFamily: IPS,
              background: CARD,
              outline: "none",
              minHeight: 48,
              boxShadow: "0 2px 6px rgba(91,122,104,0.04)"
            }}
          />
        </div>
      </div>

      {/* ── Tahun Ajaran Filter ── */}
      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: MUTED, fontFamily: PJS }}>TA:</span>
          {tahunAjaranList.map(ta => (
            <button
              key={ta}
              type="button"
              onClick={() => setSelectedTA(ta)}
              style={{
                flexShrink: 0,
                padding: "6px 14px",
                borderRadius: 20,
                border: selectedTA === ta ? `1.5px solid ${DEEP}` : `1.5px solid ${BDR}`,
                background: selectedTA === ta ? DEEP : CARD,
                color: selectedTA === ta ? "#fff" : TEXT,
                fontFamily: PJS, fontWeight: 700, fontSize: 12,
                cursor: "pointer", transition: "all 0.15s",
                boxShadow: selectedTA === ta ? "0 2px 8px rgba(46,62,53,0.2)" : "none",
              }}
            >
              {ta}
            </button>
          ))}
        </div>
      </div>

      {/* ── Class Cards List ── */}
      <div style={{ padding: "10px 16px 90px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredClasses.map(k => {
          const abkStyle = getAbkBadge(k.abk);
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
                borderRadius: 22,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(91,122,104,0.06)",
              }}
              className="active:scale-[0.99] transition-all hover:shadow-md"
            >
              {/* Left: Illustration Image */}
              <img
                src={k.img}
                alt={k.nama}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid rgba(0,0,0,0.06)"
                }}
              />

              {/* Middle: Class Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                  <p style={{ fontFamily: PJS, fontSize: 16.5, fontWeight: 800, color: "#1B2E24", lineHeight: 1.2 }}>
                    {k.nama}
                  </p>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#5B7A68", fontFamily: PJS }}>
                    {guru?.sekolah || "SLB N Surakarta"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                  {/* ABK badge */}
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3.5px 10px",
                    borderRadius: 20,
                    background: abkStyle.bg,
                    color: abkStyle.color,
                    border: abkStyle.border,
                    fontFamily: PJS
                  }}>
                    {k.abk}
                  </span>

                  {/* Student count badge */}
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3.5px 10px",
                    borderRadius: 20,
                    background: "#ECFDF5",
                    color: "#059669",
                    border: "1px solid #A7F3D0",
                    display: "flex",
                    alignItems: "center",
                    gap: 3.5,
                    fontFamily: PJS
                  }}>
                    <CheckCircle size={11} strokeWidth={2.5} /> {studentCount} Siswa
                  </span>
                </div>
              </div>

              {/* Right: Chevron arrow */}
              <ChevronRight size={18} style={{ color: "#2E3E35", flexShrink: 0, marginLeft: 2 }} strokeWidth={2.2} />
            </button>
          );
        })}

        {filteredClasses.length === 0 && (
          <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 22, padding: "36px 20px", textAlign: "center" }}>
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
