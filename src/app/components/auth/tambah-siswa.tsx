import { useState, useRef } from "react";
import { Users, Database, Upload, UserPlus, ChevronRight, AlertCircle, Trash2, CheckCircle } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS } from "../ui-kit";
import { ModalShell } from "./modal-shell";

export type SiswaImportData = { nama: string; abk: string; ttl: string; kelas?: string };

// ─── GURU: POP-UP 3 — Tambah Siswa (Database, Upload, Manual) ──
export function TambahSiswaPromptModal({
  sekolah,
  jumlahKelas,
  kelasAbkMap = {},
  teacher = "Guru",
  onBack,
  onSaveManual,
  onImportSiswa,
  onDone,
}: {
  sekolah: string;
  jumlahKelas: number;
  kelasAbkMap?: Record<string, string>;
  teacher?: string;
  onBack?: () => void;
  onSaveManual: (s: { name: string; abk: string; kelas: string; age: number; emoji: string }) => void;
  onImportSiswa: (siswa: SiswaImportData[]) => void;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"choice" | "upload" | "db-sekolah" | "manual">("choice");

  // Tracking siswa yang sudah disimpan di sesi ini
  const [savedStudents, setSavedStudents] = useState<string[]>([]);

  // Form state untuk manual
  const kelasOptions = Object.keys(kelasAbkMap).length ? Object.keys(kelasAbkMap) : ["VII A", "VII B", "VIII A"];
  const [manualNama, setManualNama] = useState("");
  const [manualKelas, setManualKelas] = useState(kelasOptions[0] || "VII A");
  const [manualAbk, setManualAbk] = useState(kelasAbkMap[kelasOptions[0]] || "Autism Spectrum Disorder");
  const [manualEmoji, setManualEmoji] = useState("👦");

  const resetManualForm = () => {
    setManualNama("");
    setManualKelas(kelasOptions[0] || "VII A");
    setManualAbk(kelasAbkMap[kelasOptions[0]] || "Autism Spectrum Disorder");
    setManualEmoji("👦");
  };

  const handleDownloadSample = (e: React.MouseEvent) => {
    e.preventDefault();
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(
      "Nama Lengkap,Jenis Hambatan,TTL\n" +
      "Rafi Pratama,Autism Spectrum Disorder,Bandung 12 Maret 2014\n" +
      "Nisa Aulia,Tunarungu,Jakarta 05 Juli 2013\n" +
      "Arga Saputra,Tunadaksa,Depok 20 Nov 2015\n" +
      "Siti Nurhaliza,Tunagrahita Ringan,Surakarta 18 Agu 2014\n"
    );
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "contoh_format_siswa_sareh_asih.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (mode === "upload")
    return (
      <UploadSiswaModal
        kelasOptions={kelasOptions}
        kelasAbkMap={kelasAbkMap}
        onBack={() => setMode("choice")}
        onSkip={onDone}
        onImport={imported => {
          onImportSiswa(imported);
          setSavedStudents(prev => [...prev, ...imported.map(s => s.nama)]);
          setMode("choice");
        }}
      />
    );
  if (mode === "db-sekolah")
    return (
      <PilihKelasDBModal
        sekolah={sekolah}
        onBack={() => setMode("choice")}
        onSkip={onDone}
        onImport={imported => {
          onImportSiswa(imported);
          setSavedStudents(prev => [...prev, ...imported.map(s => s.nama)]);
          setMode("choice");
        }}
      />
    );

  if (mode === "manual") {
    const canSave = manualNama.trim() !== "";
    return (
      <ModalShell step={3} total={3} title="Tambah Siswa Manual" desc="Masukkan data siswa satu per satu" onSkip={onDone} skipLabel="Lewati, Nanti Saja →">
        <div className="space-y-3.5 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1" style={{ fontFamily: PJS }}>
              Nama Lengkap Siswa <span className="text-red-500">*</span>
            </label>
            <input
              value={manualNama}
              onChange={e => setManualNama(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              style={{
                width: "100%", border: `1.5px solid ${BDR}`, borderRadius: 14,
                padding: "11px 14px", fontSize: 13, color: TEXT, outline: "none",
                background: CARD, fontFamily: IPS, boxSizing: "border-box"
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1" style={{ fontFamily: PJS }}>
                Kelompok/Kelas
              </label>
              <select
                value={manualKelas}
                onChange={e => {
                  const k = e.target.value;
                  setManualKelas(k);
                  if (kelasAbkMap[k]) setManualAbk(kelasAbkMap[k]);
                }}
                style={{
                  width: "100%", border: `1.5px solid ${BDR}`, borderRadius: 14,
                  padding: "11px 12px", fontSize: 13, color: TEXT, outline: "none",
                  background: CARD, fontFamily: IPS, boxSizing: "border-box"
                }}
              >
                {kelasOptions.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1" style={{ fontFamily: PJS }}>
                Jenis Kelamin
              </label>
              <div className="flex gap-2">
                {[
                  { label: "L", emoji: "👦" },
                  { label: "P", emoji: "👧" }
                ].map(g => (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => setManualEmoji(g.emoji)}
                    style={{
                      flex: 1, padding: "8px 0", borderRadius: 12, border: `1.5px solid ${manualEmoji === g.emoji ? T : BDR}`,
                      background: manualEmoji === g.emoji ? SEC : CARD, color: manualEmoji === g.emoji ? DEEP : MUTED,
                      fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer"
                    }}
                  >
                    <span className="text-base mr-1">{g.emoji}</span> {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1" style={{ fontFamily: PJS }}>
              Jenis Kekhususan (ABK)
            </label>
            <input
              value={manualAbk}
              onChange={e => setManualAbk(e.target.value)}
              placeholder="Contoh: Autism Spectrum Disorder"
              style={{
                width: "100%", border: `1.5px solid ${BDR}`, borderRadius: 14,
                padding: "11px 14px", fontSize: 13, color: TEXT, outline: "none",
                background: CARD, fontFamily: IPS, boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMode("choice")}
            style={{
              flex: 1, border: `1.5px solid ${DEEP}`, color: DEEP, fontFamily: PJS,
              fontWeight: 700, fontSize: 13, padding: "12px 0", background: CARD,
              borderRadius: 14, cursor: "pointer"
            }}
          >
            Kembali
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (canSave) {
                onSaveManual({
                  name: manualNama.trim(),
                  abk: manualAbk.trim() || "Autism Spectrum Disorder",
                  kelas: manualKelas,
                  age: 13,
                  emoji: manualEmoji,
                });
                setSavedStudents(prev => [...prev, manualNama.trim()]);
                resetManualForm();
                setMode("choice");
              }
            }}
            style={{
              flex: 2, background: canSave ? A : "#CBD5E1", color: "#FFFFFF",
              fontFamily: PJS, fontWeight: 800, fontSize: 14, padding: "12px 0",
              border: "none", borderRadius: 14, cursor: canSave ? "pointer" : "not-allowed",
              boxShadow: canSave ? "0 4px 14px rgba(210,125,107,0.3)" : "none"
            }}
          >
            Simpan Siswa
          </button>
        </div>
        <button
          type="button"
          onClick={onDone}
          style={{
            width: "100%", background: "transparent", border: "none",
            color: MUTED, fontFamily: IPS, fontSize: 12, fontWeight: 600,
            cursor: "pointer", marginTop: 10, textAlign: "center"
          }}
        >
          Lewati langkah ini, upload nanti →
        </button>
      </ModalShell>
    );
  }

  return (
    <ModalShell step={3} total={3} title="Tambah Siswa" desc="Lengkapi informasi siswa Anda" onSkip={onDone} skipLabel="Upload Nanti →">

      {/* Banner sukses setelah simpan manual */}
      {savedStudents.length > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, #EDFAF3 0%, #D4F5E5 100%)",
            border: "1.5px solid #6ECA9E",
            borderRadius: 16,
            padding: "10px 14px",
            marginBottom: 14,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>✅</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: "#1A7A47", marginBottom: 2 }}>
              {savedStudents[savedStudents.length - 1]} berhasil ditambahkan!
            </p>
            <p style={{ fontFamily: IPS, fontSize: 11, color: "#2E7D50" }}>
              {savedStudents.length} siswa telah disimpan · Tambahkan lebih banyak atau klik Selesai
            </p>
          </div>
        </div>
      )}

      <h2 className="text-center text-sm font-bold text-[#2C3531] mb-3" style={{ fontFamily: PJS }}>
        Pilih cara menambahkan siswa
      </h2>

      <div className="flex flex-col gap-3 mb-4">
        {/* Kartu 1: Input dari Database Sekolah (Biru Elegan) */}
        <div className="bg-white rounded-3xl p-4 border border-[#C5D8E8] shadow-sm flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-full bg-[#EBF3FB] flex items-center justify-center mb-2.5 text-[#2563EB]">
            <Database size={20} strokeWidth={2.2} />
          </div>

          <h3 className="font-bold text-[15px] text-[#1E3A8A] mb-1" style={{ fontFamily: PJS }}>
            Input dari Database Sekolah
          </h3>
          <p className="text-[11.5px] text-gray-500 mb-3 leading-relaxed px-2">
            Import data siswa & kelas langsung dari sistem dapodik sekolah
          </p>

          <button
            type="button"
            onClick={() => setMode("db-sekolah")}
            className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            style={{ fontFamily: PJS }}
          >
            <Database size={15} />
            Pilih dari Database Sekolah
          </button>
        </div>

        {/* Kartu 2: Upload Daftar Siswa (Hijau) */}
        <div className="bg-white rounded-3xl p-4 border border-[#D5E0D5] shadow-sm flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-full bg-[#EAF2EC] flex items-center justify-center mb-2.5 text-[#738B7B]">
            <Upload size={20} strokeWidth={2.2} />
          </div>

          <h3 className="font-bold text-[15px] text-[#2C3531] mb-1" style={{ fontFamily: PJS }}>
            Upload Daftar Siswa
          </h3>
          <p className="text-[11.5px] text-gray-500 mb-3 leading-relaxed">
            Tambahkan banyak siswa sekaligus<br />
            Format: CSV, Excel, JPG, PNG
          </p>

          <button
            type="button"
            onClick={() => setMode("upload")}
            className="w-full py-2.5 bg-[#738B7B] hover:bg-[#62776A] active:scale-[0.98] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all mb-2 cursor-pointer"
            style={{ fontFamily: PJS }}
          >
            <Upload size={15} />
            Upload Daftar Siswa
          </button>

          <div className="text-[10.5px] text-gray-500 flex items-center justify-center gap-1.5">
            <span className="text-gray-600">📥</span>
            <span>Belum punya format?</span>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="text-[#738B7B] font-semibold underline hover:text-[#5B6E61] bg-transparent border-none p-0 cursor-pointer text-[10.5px]"
            >
              Download contoh format
            </button>
          </div>
        </div>

        {/* Kartu 3: Tambah Siswa Manual (Oranye/Merah Bata) */}
        <div className="bg-[#FFFBFB] rounded-3xl p-4 border border-[#E9C3BC] shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#FCECE8] flex items-center justify-center mb-2.5 text-[#D07B64]">
            <UserPlus size={20} strokeWidth={2.2} />
          </div>

          <h3 className="font-bold text-[15px] text-[#D07B64] mb-1" style={{ fontFamily: PJS }}>
            Tambah Siswa Manual
          </h3>
          <p className="text-[11.5px] text-gray-500 mb-3">
            Masukkan data siswa satu per satu
          </p>

          <button
            type="button"
            onClick={() => setMode("manual")}
            className="w-full py-2.5 bg-[#D07B64] hover:bg-[#B96A55] active:scale-[0.98] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            style={{ fontFamily: PJS }}
          >
            <UserPlus size={15} />
            Tambah Siswa Manual
          </button>
        </div>

        {/* Tips Box */}
        <div className="bg-white rounded-2xl p-3 border border-[#D5E0D5] flex items-start gap-2.5 shadow-sm mt-1">
          <div className="w-7 h-7 rounded-lg bg-[#F0EEF8] flex items-center justify-center shrink-0 text-[#8B78D1] mt-0.5">
            💡
          </div>
          <p className="text-[11px] text-gray-600 leading-tight">
            <strong className="text-gray-800">Tips:</strong> Pilih Database Sekolah jika data sekolah sudah ada di sistem, Upload file jika sudah punya berkas siswa, atau Tambah manual jika hanya beberapa siswa.
          </p>
        </div>
      </div>

      {/* Tombol Selesai — muncul jika ada siswa tersimpan */}
      {savedStudents.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={onDone}
            style={{
              width: "100%", background: `linear-gradient(135deg, #5B7A68 0%, #3E5E4C 100%)`,
              color: "#fff", fontFamily: PJS, fontWeight: 800, fontSize: 14,
              padding: "13px 0", border: "none", borderRadius: 16, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(91,122,104,0.35)"
            }}
          >
            ✓ Selesai — Masuk Aplikasi ({savedStudents.length} siswa)
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{ width: "100%", color: MUTED, fontFamily: IPS, minHeight: 36, background: "transparent", border: "none", cursor: "pointer" }}
              className="text-xs font-semibold"
            >
              ← Kembali ke Profil Sekolah
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={onDone}
            style={{
              width: "100%",
              background: "#fff",
              color: T,
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 13,
              padding: "12px 0",
              borderRadius: 16,
              border: `1.5px solid ${T}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(115,139,123,0.12)"
            }}
          >
            <span>Lewati, Upload Nanti →</span>
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{ width: "100%", color: MUTED, fontFamily: IPS, minHeight: 36, background: "transparent", border: "none", cursor: "pointer" }}
              className="text-xs font-semibold"
            >
              ← Kembali ke Profil Sekolah
            </button>
          )}
        </div>
      )}
    </ModalShell>
  );
}

// ─── UPLOAD SISWA MODAL — CSV parser functional (SRS-F-003) ──────────
type SiswaCSV = { nama: string; abk: string; ttl: string; valid: boolean };

export function UploadSiswaModal({
  kelasOptions = [],
  kelasAbkMap = {},
  onBack,
  onSkip,
  onImport,
}: {
  kelasOptions?: string[];
  kelasAbkMap?: Record<string, string>;
  onBack: () => void;
  onSkip?: () => void;
  onImport: (s: SiswaImportData[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<SiswaCSV[]>([]);
  const [err, setErr] = useState("");
  const [fileName, setFileName] = useState("");
  const [step, setStep] = useState<"upload" | "preview">("upload");

  // Kelas yang dipilih dari kelas-kelas awal
  const [selectedKelas, setSelectedKelas] = useState<string>(
    kelasOptions.length === 1 ? kelasOptions[0] : ""
  );

  const parseCSV = (text: string): SiswaCSV[] => {
    const lines = text.trim().split(/\r?\n/);
    const start = /nama|name|siswa/i.test(lines[0]) ? 1 : 0;
    return lines.slice(start).filter(l => l.trim()).map(line => {
      const cols = line.split(/[,;\t]/).map(c => c.trim().replace(/^"|"$/g, ""));
      const nama = cols[0] || ""; const abk = cols[1] || ""; const ttl = cols[2] || "";
      return { nama, abk, ttl, valid: nama.trim() !== "" };
    });
  };

  const handleFile = (file: File) => {
    if (!file) return;
    if (!selectedKelas) {
      setErr("Silakan pilih salah satu kelas di dropdown atas terlebih dahulu.");
      return;
    }
    setFileName(file.name);
    setErr("");
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "txt"].includes(ext || "csv")) {
      setErr("File Excel (.xlsx) belum didukung langsung. Ekspor ke CSV dulu dari Excel (File → Save As → CSV).");
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) { setErr("File kosong atau formatnya tidak sesuai."); return; }
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file, "UTF-8");
  };

  const validRows = rows.filter(r => r.valid);

  return (
    <ModalShell step={3} total={3} title="Upload Daftar Siswa" desc="Pilih kelas tujuan terlebih dahulu, kemudian unggah berkas siswa" onSkip={onSkip} skipLabel="Upload Nanti →">
      {step === "upload" ? (
        <>
          {/* ── STEP 1: PILIH KELAS DARI KELAS AWAL ── */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: PJS }}>
                1. Pilih Kelas Tujuan <span style={{ color: "#B91C1C" }}>*</span>
              </label>
              {kelasOptions.length > 1 && (
                <span style={{ fontSize: 10, color: MUTED, fontFamily: IPS }}>
                  ({kelasOptions.length} kelas terdaftar)
                </span>
              )}
            </div>

            {kelasOptions.length > 1 ? (
              <div style={{ position: "relative" }}>
                <select
                  value={selectedKelas}
                  onChange={e => {
                    setSelectedKelas(e.target.value);
                    if (err.includes("pilih salah satu kelas")) setErr("");
                  }}
                  style={{
                    width: "100%",
                    background: selectedKelas ? "#F4F8F5" : CARD,
                    border: `1.5px solid ${selectedKelas ? T : BDR}`,
                    borderRadius: 14,
                    padding: "11px 36px 11px 14px",
                    fontSize: 13,
                    color: selectedKelas ? DEEP : MUTED,
                    fontWeight: selectedKelas ? 700 : 500,
                    fontFamily: IPS,
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    transition: "all 0.15s"
                  }}
                >
                  <option value="" disabled>-- Pilih salah satu kelas yang didaftarkan --</option>
                  {kelasOptions.map(k => (
                    <option key={k} value={k}>
                      {k} {kelasAbkMap[k] ? `— (${kelasAbkMap[k]})` : ""}
                    </option>
                  ))}
                </select>
                <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 11, color: selectedKelas ? T : MUTED }}>
                  ▼
                </div>
              </div>
            ) : (
              <div style={{
                background: "#F4F8F5",
                border: `1.5px solid ${T}`,
                borderRadius: 14,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div>
                  <p style={{ fontSize: 10, color: MUTED, fontFamily: IPS }}>Kelas Tujuan (Otomatis):</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: DEEP, fontFamily: PJS, margin: 0 }}>
                    {kelasOptions[0] || "VII A"} {kelasAbkMap[kelasOptions[0]] ? `— ${kelasAbkMap[kelasOptions[0]]}` : ""}
                  </p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, background: SEC, color: T, padding: "3px 8px", borderRadius: 20 }}>
                  ✓ Terpilih
                </span>
              </div>
            )}

            {kelasOptions.length > 1 && !selectedKelas && (
              <p style={{ fontSize: 11, color: "#B91C1C", marginTop: 5, fontFamily: IPS, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertCircle size={12} /> Silakan pilih kelas tujuan di dropdown sebelum mengunggah file.
              </p>
            )}
          </div>

          {/* ── STEP 2: UPLOAD BERKAS SISWA ── */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: PJS, marginBottom: 6 }}>
              2. Upload File Berkas Siswa <span style={{ color: "#B91C1C" }}>*</span>
            </label>
          </div>

          {/* Drop zone */}
          <div
            onClick={() => {
              if (!selectedKelas) {
                setErr("Silakan pilih salah satu kelas di dropdown atas terlebih dahulu.");
                return;
              }
              fileRef.current?.click();
            }}
            onDragOver={e => { e.preventDefault(); }}
            onDrop={e => {
              e.preventDefault();
              if (!selectedKelas) {
                setErr("Silakan pilih salah satu kelas di dropdown atas terlebih dahulu.");
                return;
              }
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            style={{
              border: `2px dashed ${!selectedKelas ? "#D1D5DB" : err ? "#B91C1C" : T}`,
              borderRadius: 18,
              padding: "24px 20px",
              textAlign: "center",
              cursor: !selectedKelas ? "not-allowed" : "pointer",
              background: !selectedKelas ? "#F9FAFB" : err ? "#FEF2F2" : SEC,
              opacity: !selectedKelas ? 0.7 : 1,
              marginBottom: 16,
              transition: "all 0.2s ease"
            }}>
            <div style={{ width: 50, height: 50, borderRadius: 16, background: CARD, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={24} style={{ color: !selectedKelas ? MUTED : err ? "#B91C1C" : T }} />
            </div>
            <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: !selectedKelas ? MUTED : err ? "#B91C1C" : TEXT, marginBottom: 3 }}>
              {!selectedKelas
                ? "Pilih kelas di atas untuk membuka upload file"
                : fileName
                ? fileName
                : `Ketuk untuk pilih file siswa Kelas ${selectedKelas}`}
            </p>
            <p style={{ fontSize: 11, color: MUTED }}>
              {!selectedKelas
                ? "Upload file terkunci sampai kelas dipilih"
                : "atau seret & lepas berkas di sini"}
            </p>
          </div>
          <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: "none" }}
            disabled={!selectedKelas}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {err && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "10px 12px", display: "flex", gap: 8, marginBottom: 12 }}>
              <AlertCircle size={14} style={{ color: "#B91C1C", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "#B91C1C", lineHeight: 1.5, fontFamily: IPS }}>{err}</p>
            </div>
          )}

          {/* Format guide */}
          <div style={{ background: BG, border: `1px solid ${BDR}`, borderRadius: 14, padding: "12px 14px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: PJS, marginBottom: 8 }}>📋 Format CSV yang benar</p>
            <div style={{ background: CARD, borderRadius: 10, padding: "8px 12px", fontFamily: "monospace", fontSize: 11, color: DEEP, lineHeight: 1.8, overflowX: "auto" }}>
              <div style={{ color: MUTED, fontWeight: 600 }}>Nama Lengkap,Jenis Hambatan,TTL</div>
              <div>Rafi Pratama,Autisme,Bandung 12 Maret 2014</div>
              <div>Nisa Aulia,Tunarungu,Jakarta 05 Juli 2013</div>
              <div>Arga Saputra,Tunadaksa,Depok 20 Nov 2015</div>
            </div>
            <p style={{ fontSize: 11, color: MUTED, marginTop: 8, fontFamily: IPS }}>💡 Buka Excel → File → Save As → CSV (Comma delimited)</p>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={onBack}
              style={{ flex: 1, background: "transparent", border: `1px solid ${BDR}`, color: MUTED, fontFamily: IPS, minHeight: 44, borderRadius: 14, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ← Kembali
            </button>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                style={{ flex: 1, background: "#F4F8F5", border: `1.5px solid ${T}`, color: T, fontFamily: IPS, minHeight: 44, borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Lewati, Upload Nanti →
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Preview tabel */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: TEXT }}>{fileName}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 11, background: SEC, color: T, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>
                  Kelas {selectedKelas}
                </span>
                <p style={{ fontSize: 11, color: MUTED }}>
                  {validRows.length} siswa siap diimpor{rows.length !== validRows.length ? ` · ${rows.length - validRows.length} tidak valid` : ""}
                </p>
              </div>
            </div>
            <button onClick={() => { setStep("upload"); setRows([]); setFileName(""); setErr(""); }}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: MUTED, background: "transparent", border: "none", cursor: "pointer" }}>
              <Trash2 size={12} /> Ganti file
            </button>
          </div>

          <div style={{ border: `1px solid ${BDR}`, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.5fr 2.3fr", background: SEC, padding: "8px 12px", gap: 8 }}>
              {["Nama Lengkap", "Kelas", "Hambatan / ABK"].map(h => (
                <p key={h} style={{ fontSize: 10, fontWeight: 700, color: DEEP, fontFamily: IPS, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</p>
              ))}
            </div>
            {/* Rows */}
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {rows.map((r, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "2.2fr 1.5fr 2.3fr",
                  padding: "9px 12px", gap: 8,
                  borderTop: `1px solid ${BDR}`,
                  background: r.valid ? "transparent" : "#FEF2F2"
                }}>
                  <p style={{ fontSize: 12, color: r.valid ? TEXT : "#B91C1C", fontWeight: r.valid ? 600 : 400, fontFamily: IPS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.nama || "(kosong)"}
                  </p>
                  <p style={{ fontSize: 11, color: DEEP, fontWeight: 600, fontFamily: IPS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {selectedKelas}
                  </p>
                  <p style={{ fontSize: 12, color: MUTED, fontFamily: IPS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.abk || kelasAbkMap[selectedKelas] || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setStep("upload"); setRows([]); setFileName(""); }}
              style={{ flex: 1, border: `1.5px solid ${T}`, color: T, fontFamily: IPS, minHeight: 48, borderRadius: 14, fontSize: 13, fontWeight: 700, background: CARD, cursor: "pointer" }}>
              Kembali
            </button>
            <button
              onClick={() => {
                const defaultAbk = kelasAbkMap[selectedKelas] || "Autism Spectrum Disorder";
                const mappedSiswa: SiswaImportData[] = validRows.map(r => ({
                  nama: r.nama,
                  abk: r.abk || defaultAbk,
                  ttl: r.ttl,
                  kelas: selectedKelas,
                }));
                onImport(mappedSiswa);
              }}
              disabled={validRows.length === 0}
              style={{
                flex: 2,
                background: validRows.length ? A : "#D1D5DB",
                color: "#fff",
                fontFamily: IPS,
                minHeight: 48,
                borderRadius: 14,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: validRows.length ? "pointer" : "default"
              }}
            >
              Import {validRows.length} Siswa ke {selectedKelas} →
            </button>
          </div>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              style={{ width: "100%", background: "transparent", border: "none", color: MUTED, fontFamily: IPS, fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 8 }}
            >
              Lewati langkah ini, upload nanti →
            </button>
          )}
        </>
      )}
    </ModalShell>
  );
}

// ─── PILIH KELAS DB SEKOLAH — SRS-F-003 jalur 1 ──────────────────────
export const MOCK_DB_SEKOLAH: Record<string, { nama: string; abk: string; ttl: string }[]> = {
  "VII A – Autisme": [
    { nama: "Rafi Pratama", abk: "Autisme", ttl: "Bandung, 12 Mar 2014" },
    { nama: "Dinda Sari", abk: "Autisme", ttl: "Depok, 07 Jun 2014" },
    { nama: "Farhan Maulana", abk: "Autisme", ttl: "Bogor, 21 Sep 2013" },
  ],
  "VII B – Tunarungu": [
    { nama: "Nisa Aulia", abk: "Tunarungu", ttl: "Jakarta, 05 Jul 2013" },
    { nama: "Ilham Nugraha", abk: "Tunarungu", ttl: "Bekasi, 14 Apr 2014" },
  ],
  "VIII A – Tunadaksa": [
    { nama: "Arga Saputra", abk: "Tunadaksa", ttl: "Depok, 20 Nov 2013" },
    { nama: "Putri Rahayu", abk: "Tunadaksa", ttl: "Jakarta, 03 Feb 2014" },
    { nama: "Toni Hermawan", abk: "Tunadaksa", ttl: "Tangerang, 17 Aug 2013" },
  ],
  "VIII B – Tunagrahita": [
    { nama: "Budi Santoso", abk: "Tunagrahita Ringan", ttl: "Bandung, 29 Jan 2014" },
    { nama: "Siti Nurhaliza", abk: "Tunagrahita Sedang", ttl: "Jakarta, 11 Okt 2013" },
  ],
  "IX A – Kesulitan Belajar": [
    { nama: "Kevin Alvaro", abk: "Disleksia", ttl: "Depok, 08 Des 2012" },
    { nama: "Maya Puspita", abk: "ADHD", ttl: "Jakarta, 22 Mar 2012" },
  ],
};

export function PilihKelasDBModal({ sekolah, onBack, onSkip, onImport }: { sekolah: string; onBack: () => void; onSkip?: () => void; onImport: (s: SiswaImportData[]) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleKelas = (k: string) => setSelected(s => {
    const n = new Set(s);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  });

  const siswaSelected = [...selected].flatMap(k => {
    const list = MOCK_DB_SEKOLAH[k] || [];
    const kelasName = k.split(" – ")[0] || k;
    return list.map(s => ({ ...s, kelas: kelasName }));
  });

  return (
    <ModalShell step={3} total={3} title="Database Sekolah" desc={`${sekolah} · Pilih kelas yang ingin diimpor`} onSkip={onSkip} skipLabel="Lewati →">
      {/* Info banner */}
      <div style={{ background: SEC, border: `1px solid rgba(91,122,104,0.2)`, borderRadius: 14, padding: "10px 12px", display: "flex", gap: 8, marginBottom: 12 }}>
        <Database size={13} style={{ color: T, flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: DEEP, fontFamily: IPS, lineHeight: 1.5 }}>
          Data kelas di bawah tersedia dari sistem dapodik / basis data sekolah. Centang kelas yang ingin Anda ajar.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
        {Object.entries(MOCK_DB_SEKOLAH).map(([kelas, siswas]) => {
          const isSelected = selected.has(kelas);
          const isExpanded = expanded === kelas;
          const [namaKelas, jenisAbk] = kelas.includes(" – ") ? kelas.split(" – ") : [kelas, ""];

          return (
            <div
              key={kelas}
              style={{
                border: `1.5px solid ${isSelected ? T : BDR}`,
                borderRadius: 16,
                padding: "10px",
                background: isSelected ? SEC : CARD,
                transition: "all 0.15s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minWidth: 0
              }}
              onClick={() => toggleKelas(kelas)}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 18, height: 18, borderRadius: 6, border: `2px solid ${isSelected ? T : BDR}`,
                    background: isSelected ? T : "transparent", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {isSelected && <CheckCircle size={12} style={{ color: "#fff" }} />}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: DEEP, background: "rgba(91,122,104,0.12)", padding: "2px 6px", borderRadius: 10 }}>
                    {siswas.length} siswa
                  </span>
                </div>

                <p style={{ fontSize: 12.5, fontWeight: 700, color: isSelected ? DEEP : TEXT, fontFamily: IPS, lineHeight: 1.2 }}>
                  {namaKelas}
                </p>
                {jenisAbk && (
                  <p style={{ fontSize: 10.5, color: MUTED, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {jenisAbk}
                  </p>
                )}
              </div>

              {/* Expand toggle */}
              <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${BDR}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setExpanded(p => p === kelas ? null : kelas); }}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: MUTED, fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}
                >
                  <span>{isExpanded ? "Tutup" : "Lihat Siswa"}</span>
                  <ChevronRight size={11} style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </button>
              </div>

              {/* Expanded: preview siswa */}
              {isExpanded && (
                <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${BDR}` }} onClick={e => e.stopPropagation()}>
                  {siswas.map(s => (
                    <div key={s.nama} style={{ padding: "3px 0", borderBottom: `1px solid rgba(91,122,104,0.1)` }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: TEXT, fontFamily: IPS, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.nama}</p>
                      <p style={{ fontSize: 9.5, color: T, fontWeight: 600 }}>{s.abk}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected.size > 0 && (
        <div style={{ background: SEC, borderRadius: 12, padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Users size={13} style={{ color: T }} />
          <p style={{ fontSize: 12, color: DEEP, fontFamily: IPS, fontWeight: 600 }}>
            {selected.size} kelas · {siswaSelected.length} siswa akan diimpor
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onBack}
          style={{ flex: 1, border: `1.5px solid ${T}`, color: T, fontFamily: IPS, minHeight: 48, borderRadius: 14, fontSize: 13, fontWeight: 700, background: CARD, cursor: "pointer" }}>
          Kembali
        </button>
        <button onClick={() => onImport(siswaSelected)}
          disabled={selected.size === 0}
          style={{ flex: 2, background: selected.size ? A : "#D1D5DB", color: "#fff", fontFamily: IPS, minHeight: 48, borderRadius: 14, fontSize: 13, fontWeight: 700, border: "none", cursor: selected.size ? "pointer" : "default" }}>
          Import {siswaSelected.length > 0 ? `${siswaSelected.length} Siswa` : "Siswa"} →
        </button>
      </div>
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          style={{ width: "100%", background: "transparent", border: "none", color: MUTED, fontFamily: IPS, fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 8 }}
        >
          Lewati langkah ini, upload nanti →
        </button>
      )}
    </ModalShell>
  );
}
