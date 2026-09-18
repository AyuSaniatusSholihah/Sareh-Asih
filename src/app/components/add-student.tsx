import { useState, useRef } from "react";
import {
  CheckCircle, Info, XCircle, UserPlus, Sparkles, Plus, ArrowLeft,
  Upload, Download, Lightbulb, FileText, AlertCircle, Trash2, Database,
  ChevronRight, Users, School
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
  Field, SelectField,
} from "./ui-kit";
import { ABK_OPTIONS, CARA_BELAJAR_OPTIONS, type Student } from "./data";
import { MOCK_DB_SEKOLAH } from "./auth/tambah-siswa";

type Step = "choice" | "db-sekolah" | "upload" | "identitas" | "abk" | "success";

const EMPTY = {
  nama: "", kelas: "", umur: "", emoji: "👦",
  jenis_abk: "", extra_abk: [] as string[],
  tingkat_dukungan: "", komunikasi: "", motorik: "",
  cara_belajar: "", rentang: "", minat: "", terapi: "",
};

const GENDER_OPTIONS = [
  { label: "Laki-laki", emoji: "👦" },
  { label: "Perempuan", emoji: "👧" },
];

export interface AddStudentSheetProps {
  onClose: () => void;
  onBack?: () => void;
  onSave: (s: Omit<Student, "id">) => void;
  teacher: string;
  kelasAbkMap: Record<string, string>;
  firstTime?: boolean;
  savedCount?: number;
}

type SiswaCSVRow = { nama: string; abk: string; ttl: string; kelas?: string; valid: boolean };

/**
 * Screen & Flow Tambah Siswa — 3 Pilihan Gateway:
 * 1. Input dari Database Sekolah (Dapodik / Sistem Sekolah)
 * 2. Upload File (CSV / Excel / Dokumen)
 * 3. Input Manual (Formulir Multi-step)
 */
export function AddStudentSheet({
  onClose,
  onBack,
  onSave,
  teacher,
  kelasAbkMap,
  firstTime,
  savedCount,
}: AddStudentSheetProps) {
  const [step, setStep] = useState<Step>("choice");
  const [form, setForm] = useState(EMPTY);
  const [lastName, setLastName] = useState("");
  const [extraInput, setExtraInput] = useState("");

  // State untuk Database Sekolah
  const [selectedDBKelas, setSelectedDBKelas] = useState<Set<string>>(new Set(["VII A – Autisme"]));
  const [expandedDBKelas, setExpandedDBKelas] = useState<string | null>("VII A – Autisme");

  // State untuk Upload File
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedRows, setUploadedRows] = useState<SiswaCSVRow[]>([]);
  const [uploadErr, setUploadErr] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");

  const set = (k: keyof typeof EMPTY) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  // Ketika kelas dipilih, auto-fill jenis_abk dari map
  const onKelasChange = (k: string) => {
    const abk = kelasAbkMap[k] ?? "";
    setForm(f => ({ ...f, kelas: k, jenis_abk: abk, extra_abk: [] }));
  };

  // Tambah ABK tambahan (opsional)
  const addExtra = () => {
    const v = extraInput.trim();
    if (!v || form.extra_abk.includes(v) || v === form.jenis_abk) return;
    setForm(f => ({ ...f, extra_abk: [...f.extra_abk, v] }));
    setExtraInput("");
  };
  const removeExtra = (v: string) => setForm(f => ({ ...f, extra_abk: f.extra_abk.filter(x => x !== v) }));

  const extraOptions = ABK_OPTIONS.filter(o => o !== form.jenis_abk && !form.extra_abk.includes(o));
  const kelasOptions = Object.keys(kelasAbkMap).length ? Object.keys(kelasAbkMap) : ["VII A", "VII B", "VIII A"];
  const [selectedUploadKelas, setSelectedUploadKelas] = useState<string>(
    kelasOptions.length === 1 ? kelasOptions[0] : ""
  );
  const canNext = form.nama.trim() !== "" && form.kelas !== "";

  const save = () => {
    const allAbk = form.extra_abk.length
      ? `${form.jenis_abk} · ${form.extra_abk.join(" · ")}`
      : form.jenis_abk;
    onSave({
      name: form.nama.trim(),
      abk: allAbk || "Autism Spectrum Disorder",
      kelas: form.kelas || kelasOptions[0],
      age: Number(form.umur) || 0,
      emoji: form.emoji,
      talent: "",
      talentScore: 0,
      stars: 0,
      teacher,
      hasObs: false,
      comps: [],
      caraBelajar: form.cara_belajar || "",
      tingkatDukungan: form.tingkat_dukungan,
      komunikasi: form.komunikasi,
      motorik: form.motorik,
      rentang: form.rentang,
      minat: form.minat,
      terapi: form.terapi,
      kodeOrtu: `ABK-2026-${form.nama.trim().split(" ")[0].toUpperCase()}`,
    });
    setLastName(form.nama.trim());
    setStep("success");
  };

  const tambahLagi = () => {
    setForm(EMPTY);
    setUploadedRows([]);
    setStep("choice");
  };

  // Download contoh CSV format
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

  // Handle CSV / Image upload parsing
  const parseCSV = (text: string): SiswaCSVRow[] => {
    const lines = text.trim().split(/\r?\n/);
    const start = /nama|name|siswa/i.test(lines[0]) ? 1 : 0;
    return lines.slice(start).filter(l => l.trim()).map(line => {
      const cols = line.split(/[,;\t]/).map(c => c.trim().replace(/^"|"$/g, ""));
      const nama = cols[0] || "";
      const abk = cols[1] || "Autism Spectrum Disorder";
      const ttl = cols[2] || "";
      return { nama, abk, ttl, valid: nama.trim() !== "" };
    });
  };

  const handleFileChange = (file: File) => {
    if (!file) return;
    if (!selectedUploadKelas) {
      setUploadErr("Silakan pilih salah satu kelas tujuan di dropdown atas terlebih dahulu.");
      return;
    }
    setUploadFileName(file.name);
    setUploadErr("");
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv" || ext === "txt") {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setUploadErr("File kosong atau formatnya tidak sesuai.");
          return;
        }
        setUploadedRows(parsed);
      };
      reader.readAsText(file, "UTF-8");
    } else {
      // Mock parsing for Excel/Image
      const sampleMockRows: SiswaCSVRow[] = [
        { nama: "Rafi Pratama", abk: "Autism Spectrum Disorder", ttl: "Bandung, 12 Maret 2014", valid: true },
        { nama: "Nisa Aulia", abk: "Tunarungu", ttl: "Jakarta, 05 Juli 2013", valid: true },
        { nama: "Arga Saputra", abk: "Tunadaksa", ttl: "Depok, 20 Nov 2015", valid: true },
        { nama: "Siti Nurhaliza", abk: "Tunagrahita Ringan", ttl: "Surakarta, 18 Agu 2014", valid: true },
      ];
      setUploadedRows(sampleMockRows);
    }
  };

  const handleCommitUpload = () => {
    const valid = uploadedRows.filter(r => r.valid);
    if (!valid.length || !selectedUploadKelas) return;
    const targetKelas = selectedUploadKelas;
    const defaultAbk = kelasAbkMap[targetKelas] || "Autism Spectrum Disorder";
    valid.forEach((s, idx) => {
      const emoji = ["👦", "👧", "🧑"][idx % 3];
      onSave({
        name: s.nama,
        abk: s.abk || defaultAbk,
        kelas: targetKelas,
        age: 13,
        emoji,
        talent: "",
        talentScore: 0,
        stars: 0,
        teacher,
        hasObs: false,
        comps: [],
        caraBelajar: "Visual",
        tingkatDukungan: "Dukungan Sedang",
        komunikasi: "Verbal terbatas",
        motorik: "Motorik halus baik",
        rentang: "15 menit",
        minat: "Menggambar",
        terapi: "",
        kodeOrtu: `ABK-2026-${s.nama.trim().split(" ")[0].toUpperCase()}`,
      });
    });
    setLastName(`${valid.length} Siswa (Kelas ${targetKelas})`);
    setStep("success");
  };

  // Toggle DB selection
  const toggleDBKelas = (k: string) => {
    setSelectedDBKelas(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const handleCommitDB = () => {
    const selectedSiswaList = [...selectedDBKelas].flatMap(k => {
      const list = MOCK_DB_SEKOLAH[k] || [];
      const kelasName = k.split(" – ")[0] || "VII A";
      return list.map(s => ({ ...s, kelasName }));
    });

    if (!selectedSiswaList.length) return;

    selectedSiswaList.forEach((s, idx) => {
      const emoji = ["👦", "👧", "🧑"][idx % 3];
      onSave({
        name: s.nama,
        abk: s.abk || "Autism Spectrum Disorder",
        kelas: s.kelasName,
        age: 13,
        emoji,
        talent: "",
        talentScore: 0,
        stars: 0,
        teacher,
        hasObs: false,
        comps: [],
        caraBelajar: "Visual",
        tingkatDukungan: "Dukungan Sedang",
        komunikasi: "Verbal terbatas",
        motorik: "Motorik halus baik",
        rentang: "15 menit",
        minat: "Menggambar",
        terapi: "",
        kodeOrtu: `ABK-2026-${s.nama.trim().split(" ")[0].toUpperCase()}`,
      });
    });

    setLastName(`${selectedSiswaList.length} Siswa (${selectedDBKelas.size} Kelas)`);
    setStep("success");
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 1. GATEWAY SCREEN (3 PILIHAN CARA MENAMBAHKAN SISWA)
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "choice") {
    return (
      <div
        className="absolute inset-0 z-50 flex flex-col overflow-y-auto"
        style={{ fontFamily: IPS, background: "#EAEFEA" }}
      >
        <div className="p-5 flex flex-col min-h-full">
          {/* Header Halaman */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack || onClose}
                className="text-gray-900 hover:opacity-75 transition-opacity cursor-pointer p-1 -ml-1"
                title="Kembali"
              >
                <ArrowLeft size={22} strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#2C3531]" style={{ fontFamily: PJS, margin: 0 }}>
                  Tambah Siswa
                </h1>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Lengkapi informasi kelas yang akan ditambahkan
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-[#738B7B] hover:text-[#5B6E61] bg-[#EAF2EC] px-3 py-1.5 rounded-xl transition-colors cursor-pointer border-none shrink-0"
              style={{ fontFamily: PJS }}
            >
              Upload Nanti →
            </button>
          </div>

          {/* Judul Subseksi */}
          <h2 className="text-center text-sm font-bold text-[#2C3531] mb-4" style={{ fontFamily: PJS }}>
            Pilih cara menambahkan siswa
          </h2>

          {/* Wrapper 3 Kartu Pilihan */}
          <div className="space-y-3 flex-1 flex flex-col justify-start">
            
            {/* ── KARTU 1: Input dari Database Sekolah (Biru/Teal Elegan) ── */}
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
                onClick={() => setStep("db-sekolah")}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                style={{ fontFamily: PJS }}
              >
                <Database size={15} />
                Pilih dari Database Sekolah
              </button>
            </div>

            {/* ── KARTU 2: Upload Daftar Siswa (Hijau) ── */}
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
                onClick={() => setStep("upload")}
                className="w-full py-2.5 bg-[#738B7B] hover:bg-[#62776A] active:scale-[0.98] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all mb-2 cursor-pointer"
                style={{ fontFamily: PJS }}
              >
                <Upload size={15} />
                Upload Daftar Siswa
              </button>

              <div className="text-[10.5px] text-gray-500 flex items-center justify-center gap-1.5">
                <Download size={12} className="text-gray-600" />
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

            {/* ── KARTU 3: Tambah Siswa Manual (Terracotta) ── */}
            <div className="bg-[#FFFBFB] rounded-3xl p-4 border border-[#E9C3BC] shadow-sm flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-[#FCECE8] flex items-center justify-center mb-2.5 text-[#D07B64]">
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
                onClick={() => setStep("identitas")}
                className="w-full py-2.5 bg-[#D07B64] hover:bg-[#B96A55] active:scale-[0.98] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                style={{ fontFamily: PJS }}
              >
                <UserPlus size={15} />
                Tambah Siswa Manual
              </button>
            </div>

            {/* Tips Box */}
            <div className="relative pt-2 mt-auto">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-1">
                <span className="w-1 h-1 rounded-full bg-[#C4C4C4]"></span>
                <span className="w-1 h-1 rounded-full bg-[#C4C4C4]"></span>
                <span className="w-1 h-1 rounded-full bg-[#C4C4C4]"></span>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-[#D5E0D5] flex items-start gap-2.5 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-[#F0EEF8] flex items-center justify-center shrink-0 text-[#8B78D1] mt-0.5">
                  <Lightbulb size={16} />
                </div>
                <p className="text-[11px] text-gray-600 leading-tight">
                  <strong className="text-gray-800">Tips:</strong> Pilih Database Sekolah jika data sekolah sudah ada di sistem, Upload file jika sudah punya berkas siswa, atau Tambah manual jika hanya beberapa siswa.
                </p>
              </div>

              <div className="pt-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 bg-white border-2 border-[#738B7B] hover:bg-[#F4F8F5] active:scale-[0.98] text-[#738B7B] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  style={{ fontFamily: PJS }}
                >
                  <span>Lewati, Upload Nanti</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2. VIEW: DATABASE SEKOLAH SELECTOR
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "db-sekolah") {
    const totalSiswaCount = [...selectedDBKelas].reduce((sum, k) => sum + (MOCK_DB_SEKOLAH[k]?.length || 0), 0);

    return (
      <div
        className="absolute inset-0 z-50 flex flex-col overflow-y-auto"
        style={{ fontFamily: IPS, background: "#EAEFEA" }}
      >
        <div className="p-5 flex flex-col min-h-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("choice")}
                className="text-gray-900 hover:opacity-75 transition-opacity cursor-pointer p-1 -ml-1"
                title="Kembali"
              >
                <ArrowLeft size={22} strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#2C3531]" style={{ fontFamily: PJS, margin: 0 }}>
                  Database Sekolah
                </h1>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Pilih kelas & siswa yang ingin Anda import
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EBF3FB] px-3 py-1.5 rounded-xl transition-colors cursor-pointer border-none shrink-0"
              style={{ fontFamily: PJS }}
            >
              Upload Nanti →
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-[#EBF3FB] border border-[#BFDBFE] rounded-2xl p-3 mb-3 flex items-start gap-2.5">
            <School size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1E3A8A] leading-relaxed">
              Centang kelas di bawah untuk mengimpor seluruh siswa di kelas tersebut ke akun Anda.
            </p>
          </div>

          {/* Daftar Kelas */}
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="grid grid-cols-2 gap-2.5">
              {Object.entries(MOCK_DB_SEKOLAH).map(([kelas, siswas]) => {
                const isSelected = selectedDBKelas.has(kelas);
                const isExpanded = expandedDBKelas === kelas;
                const [namaKelas, jenisAbk] = kelas.includes(" – ") ? kelas.split(" – ") : [kelas, ""];

                return (
                  <div
                    key={kelas}
                    className={`border-2 rounded-2xl p-3 flex flex-col justify-between transition-all bg-white cursor-pointer select-none ${
                      isSelected ? "border-[#2563EB] bg-[#EFF6FF] shadow-sm ring-1 ring-[#2563EB]" : "border-[#D5E0D5] hover:border-gray-400"
                    }`}
                    onClick={() => toggleDBKelas(kelas)}
                  >
                    <div>
                      {/* Checkbox & Count */}
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected ? "bg-[#2563EB] border-[#2563EB] text-white" : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <CheckCircle size={14} strokeWidth={3} />}
                        </div>
                        <span className="text-[10px] font-bold text-[#2563EB] bg-[#DBEAFE] px-2 py-0.5 rounded-full">
                          {siswas.length} Siswa
                        </span>
                      </div>

                      <p className="font-bold text-xs text-gray-900 leading-snug" style={{ fontFamily: PJS }}>
                        {namaKelas}
                      </p>
                      {jenisAbk && (
                        <p className="text-[10.5px] text-gray-500 mt-0.5 font-medium truncate">
                          {jenisAbk}
                        </p>
                      )}
                    </div>

                    {/* Preview siswa toggle */}
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedDBKelas(prev => prev === kelas ? null : kelas);
                        }}
                        className="hover:text-[#2563EB] font-semibold flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-gray-600"
                      >
                        {isExpanded ? "Tutup" : `Lihat Siswa`}
                        <ChevronRight size={12} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </button>
                    </div>

                    {/* Expanded list inside card */}
                    {isExpanded && (
                      <div className="mt-2 pt-2 border-t border-gray-200 space-y-1.5 text-[10px]" onClick={e => e.stopPropagation()}>
                        {siswas.map((s, idx) => (
                          <div key={idx} className="bg-white/80 rounded-lg p-1.5 border border-gray-100">
                            <p className="font-bold text-gray-800 truncate">{s.nama}</p>
                            <p className="text-[9px] text-gray-500 truncate">{s.abk}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2 mt-auto">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("choice")}
                className="flex-1 py-3 bg-white border border-[#D5E0D5] text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={selectedDBKelas.size === 0}
                onClick={handleCommitDB}
                className={`flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                  selectedDBKelas.size > 0
                    ? "bg-[#2563EB] hover:bg-[#1D4ED8] cursor-pointer active:scale-[0.98]"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
                style={{ fontFamily: PJS }}
              >
                Import {totalSiswaCount > 0 ? `(${totalSiswaCount}) Siswa` : ""}
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-gray-500 hover:text-[#2563EB] font-semibold bg-transparent border-none cursor-pointer flex items-center justify-center gap-1 transition-colors"
              style={{ fontFamily: PJS }}
            >
              <span>Lewati langkah ini, upload nanti</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 3. VIEW: UPLOAD FILE (CSV / EXCEL / GAMBAR)
  // ══════════════════════════════════════════════════════════════════════════
  if (step === "upload") {
    return (
      <div
        className="absolute inset-0 z-50 flex flex-col overflow-y-auto"
        style={{ fontFamily: IPS, background: "#EAEFEA" }}
      >
        <div className="p-5 flex flex-col min-h-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("choice")}
                className="text-gray-900 hover:opacity-75 transition-opacity cursor-pointer p-1 -ml-1"
                title="Kembali"
              >
                <ArrowLeft size={22} strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#2C3531]" style={{ fontFamily: PJS, margin: 0 }}>
                  Upload Daftar Siswa
                </h1>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Pilih file CSV, Excel, atau Foto Dokumen
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-[#738B7B] hover:text-[#5B6E61] bg-[#EAF2EC] px-3 py-1.5 rounded-xl transition-colors cursor-pointer border-none shrink-0"
              style={{ fontFamily: PJS }}
            >
              Upload Nanti →
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {/* ── STEP 1: PILIH KELAS DARI KELAS AWAL ── */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#D5E0D5] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#2C3531]" style={{ fontFamily: PJS }}>
                  1. Pilih Kelas Tujuan Siswa <span className="text-red-500">*</span>
                </label>
                {kelasOptions.length > 1 && (
                  <span className="text-[10px] text-gray-500">
                    {kelasOptions.length} kelas terdaftar
                  </span>
                )}
              </div>

              {kelasOptions.length > 1 ? (
                <div className="relative">
                  <select
                    value={selectedUploadKelas}
                    onChange={e => {
                      setSelectedUploadKelas(e.target.value);
                      if (uploadErr.includes("pilih")) setUploadErr("");
                    }}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold appearance-none outline-none transition-all cursor-pointer border ${
                      selectedUploadKelas
                        ? "bg-[#F4F8F5] border-[#738B7B] text-[#2C3531]"
                        : "bg-white border-[#D5E0D5] text-gray-500"
                    }`}
                    style={{ fontFamily: PJS }}
                  >
                    <option value="" disabled>-- Pilih salah satu kelas yang didaftarkan --</option>
                    {kelasOptions.map(k => (
                      <option key={k} value={k}>
                        {k} {kelasAbkMap[k] ? `— (${kelasAbkMap[k]})` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-500">
                    ▼
                  </div>
                </div>
              ) : (
                <div className="bg-[#F4F8F5] border border-[#738B7B] rounded-xl p-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium">Kelas Tujuan (Otomatis):</p>
                    <p className="text-xs font-bold text-[#2C3531]" style={{ fontFamily: PJS }}>
                      {kelasOptions[0] || "VII A"} {kelasAbkMap[kelasOptions[0]] ? `— (${kelasAbkMap[kelasOptions[0]]})` : ""}
                    </p>
                  </div>
                  <span className="text-[10px] bg-[#EAF2EC] text-[#738B7B] px-2.5 py-0.5 rounded-full font-bold">
                    ✓ Terpilih
                  </span>
                </div>
              )}

              {kelasOptions.length > 1 && !selectedUploadKelas && (
                <p className="text-[11px] text-red-600 mt-2 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={13} className="shrink-0" />
                  Pilih salah satu kelas di atas sebelum mengunggah file.
                </p>
              )}
            </div>

            {/* ── STEP 2: UPLOAD BERKAS SISWA ── */}
            <div className="mt-1">
              <label className="block text-xs font-bold text-[#2C3531] mb-1.5" style={{ fontFamily: PJS }}>
                2. Upload File Berkas Siswa <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Drop Zone Box */}
            <div
              onClick={() => {
                if (!selectedUploadKelas) {
                  setUploadErr("Silakan pilih salah satu kelas di dropdown atas terlebih dahulu.");
                  return;
                }
                fileInputRef.current?.click();
              }}
              onDragOver={e => { e.preventDefault(); }}
              onDrop={e => {
                e.preventDefault();
                if (!selectedUploadKelas) {
                  setUploadErr("Silakan pilih salah satu kelas di dropdown atas terlebih dahulu.");
                  return;
                }
                const f = e.dataTransfer.files[0];
                if (f) handleFileChange(f);
              }}
              className={`rounded-3xl p-5 border-2 border-dashed text-center flex flex-col items-center justify-center transition-all ${
                !selectedUploadKelas
                  ? "bg-gray-100/70 border-gray-300 opacity-60 cursor-not-allowed"
                  : "bg-white border-[#738B7B] cursor-pointer hover:bg-[#F4F8F5]"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2.5 ${
                !selectedUploadKelas ? "bg-gray-200 text-gray-400" : "bg-[#EAF2EC] text-[#738B7B]"
              }`}>
                <Upload size={22} strokeWidth={2.2} />
              </div>
              <p className="font-bold text-sm text-[#2C3531] mb-1" style={{ fontFamily: PJS }}>
                {!selectedUploadKelas
                  ? "Pilih kelas di atas untuk membuka upload"
                  : (uploadFileName || `Ketuk untuk memilih file siswa Kelas ${selectedUploadKelas}`)}
              </p>
              <p className="text-xs text-gray-500">
                {!selectedUploadKelas
                  ? "Upload file terkunci sampai kelas dipilih"
                  : "Mendukung CSV, Excel, Foto JPG / PNG"}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.xlsx,.xls,.png,.jpg,.jpeg"
              style={{ display: "none" }}
              disabled={!selectedUploadKelas}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFileChange(f);
              }}
            />

            {uploadErr && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2 text-xs text-red-700">
                <AlertCircle size={16} className="shrink-0" />
                <span>{uploadErr}</span>
              </div>
            )}

            {/* Preview Tabel jika ada baris data */}
            {uploadedRows.length > 0 && (
              <div className="bg-white rounded-2xl p-3.5 border border-[#D5E0D5] shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <span className="text-xs font-bold text-[#2C3531]" style={{ fontFamily: PJS }}>
                      Preview Data ({uploadedRows.length} Siswa Terdeteksi)
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] bg-[#EAF2EC] text-[#738B7B] px-2 py-0.5 rounded-full font-bold">
                        Kelas {selectedUploadKelas}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                    Siap Diimpor
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5">
                  {uploadedRows.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 text-xs border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-800">{r.nama}</p>
                        <p className="text-[10px] text-gray-500">{r.abk || kelasAbkMap[selectedUploadKelas] || "—"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#738B7B] font-bold block">Kelas {selectedUploadKelas}</span>
                        <CheckCircle size={14} className="text-green-600 inline-block mt-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Template Card */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#D5E0D5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EAF2EC] flex items-center justify-center text-[#738B7B]">
                  <FileText size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800" style={{ fontFamily: PJS, margin: 0 }}>Format Template CSV</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Kolom: Nama, Jenis Hambatan, TTL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="px-3 py-1.5 bg-[#EAF2EC] hover:bg-[#D8E6DB] text-[#738B7B] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border-none cursor-pointer"
              >
                <Download size={13} /> Unduh
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-2 flex flex-col gap-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("choice")}
                  className="flex-1 py-3 bg-white border border-[#D5E0D5] text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={uploadedRows.length === 0 || !selectedUploadKelas}
                  onClick={handleCommitUpload}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                    uploadedRows.length > 0 && selectedUploadKelas
                      ? "bg-[#738B7B] hover:bg-[#62776A] cursor-pointer active:scale-[0.98]"
                      : "bg-gray-300 text-gray-400 cursor-not-allowed"
                  }`}
                  style={{ fontFamily: PJS }}
                >
                  Impor {uploadedRows.length > 0 ? `(${uploadedRows.length}) Siswa ke ${selectedUploadKelas}` : ""}
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs text-gray-500 hover:text-[#738B7B] font-semibold bg-transparent border-none cursor-pointer flex items-center justify-center gap-1 transition-colors"
                style={{ fontFamily: PJS }}
              >
                <span>Lewati langkah ini, upload nanti</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 4. MANUAL INPUT FORM (identitas & abk)
  // ══════════════════════════════════════════════════════════════════════════
  const stepNum = step === "identitas" ? 1 : 2;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 70, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={firstTime ? undefined : onClose} style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.5)" }} />

      <div style={{ position: "relative", background: CARD, borderRadius: "24px 24px 0 0", maxHeight: "92%", display: "flex", flexDirection: "column" }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>

        {step !== "success" && (
          <>
            {/* Header */}
            <div className="px-5 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${BDR}` }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold text-base" style={{ fontFamily: PJS, color: TEXT }}>
                    {step === "identitas" ? "Tambah Siswa Manual" : "Profil Kebutuhan Siswa"}
                  </p>
                  {step === "abk" && (
                    <p className="text-xs" style={{ color: MUTED, fontFamily: IPS }}>
                      Semua opsional, bisa dilengkapi nanti
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("choice")}
                    title="Kembali ke Pilihan Cara"
                    style={{ height: 32, padding: "0 10px", color: T, background: SEC, fontSize: 11, fontWeight: 700, fontFamily: IPS, border: "none" }}
                    className="flex items-center justify-center gap-1 rounded-xl cursor-pointer"
                  >
                    Ganti Cara
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{ minWidth: 32, minHeight: 32, color: MUTED, background: "transparent", border: "none" }}
                    className="flex items-center justify-center rounded-xl cursor-pointer"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2].map(n => (
                  <div key={n} style={{ height: 4, flex: 1, borderRadius: 2, background: stepNum >= n ? T : "#E5E7EB" }} />
                ))}
                <span className="text-xs ml-1" style={{ color: MUTED, fontFamily: DMM }}>{stepNum}/2</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {step === "identitas" && (
                <>
                  <Field label="Nama Lengkap" placeholder="Contoh: Budi Santoso" value={form.nama} onChange={set("nama")} required />

                  <div className="grid grid-cols-2 gap-3">
                    <SelectField label="Kelompok/Kelas" options={kelasOptions} value={form.kelas} onChange={onKelasChange} required />
                    <Field label="Umur" placeholder="13" value={form.umur} onChange={set("umur")} type="number" />
                  </div>

                  {form.jenis_abk && (
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: IPS, marginBottom: 6 }}>
                        Jenis ABK <span style={{ fontSize: 11, fontWeight: 400, color: MUTED }}>(default kelas, bisa diubah)</span>
                      </p>
                      <select
                        value={form.jenis_abk}
                        onChange={e => setForm(f => ({ ...f, jenis_abk: e.target.value }))}
                        style={{ width: "100%", border: `1.5px solid ${BDR}`, borderRadius: 12, padding: "9px 12px", fontSize: 13, color: TEXT, fontFamily: IPS, background: CARD, outline: "none", marginBottom: 8 }}
                      >
                        {ABK_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        {!ABK_OPTIONS.includes(form.jenis_abk) && <option value={form.jenis_abk}>{form.jenis_abk}</option>}
                      </select>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                        {form.extra_abk.map(e => (
                          <div key={e} style={{ display: "flex", alignItems: "center", gap: 5, background: BG, border: `1px solid ${BDR}`, borderRadius: 20, padding: "5px 10px 5px 12px" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: IPS }}>{e}</span>
                            <button type="button" onClick={() => removeExtra(e)} style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                              <XCircle size={13} style={{ color: MUTED }} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {extraOptions.length > 0 && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <select
                            value={extraInput}
                            onChange={e => setExtraInput(e.target.value)}
                            style={{ flex: 1, border: `1px solid ${BDR}`, borderRadius: 11, padding: "8px 10px", fontSize: 12, color: extraInput ? TEXT : MUTED, fontFamily: IPS, background: BG, outline: "none", minHeight: 38 }}
                          >
                            <option value="">+ Tambah jenis ABK lain (opsional)</option>
                            {extraOptions.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                          <button type="button" onClick={addExtra} disabled={!extraInput}
                            style={{ width: 38, height: 38, borderRadius: 11, background: extraInput ? T : "#D1D5DB", border: "none", cursor: extraInput ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Plus size={15} style={{ color: "#fff" }} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: IPS, display: "block", marginBottom: 8 }}>Jenis Kelamin</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {GENDER_OPTIONS.map(g => (
                        <button key={g.label} type="button" onClick={() => set("emoji")(g.emoji)}
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 0", borderRadius: 14, fontSize: 13, fontWeight: 600, fontFamily: IPS, cursor: "pointer", transition: "all 0.15s", background: form.emoji === g.emoji ? SEC : BG, border: `1.5px solid ${form.emoji === g.emoji ? T : BDR}`, color: form.emoji === g.emoji ? DEEP : MUTED }}>
                          <span style={{ fontSize: 22 }}>{g.emoji}</span>
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!form.jenis_abk && (
                    <div style={{ background: SEC, border: `1px solid rgba(91,122,104,0.2)` }} className="rounded-xl px-3 py-2.5 flex items-start gap-2">
                      <Sparkles size={13} style={{ color: T, flexShrink: 0, marginTop: 1 }} />
                      <p className="text-xs leading-relaxed" style={{ color: T, fontFamily: IPS }}>
                        Pilih kelompok/kelas — jenis ABK akan terisi otomatis sesuai kelas yang sudah Anda buat.
                      </p>
                    </div>
                  )}
                </>
              )}

              {step === "abk" && (
                <>
                  <div style={{ background: "#FEF9EC", border: `1px solid rgba(217,142,30,0.2)` }} className="rounded-xl px-3 py-2.5 flex items-start gap-2">
                    <Info size={13} style={{ color: A, flexShrink: 0, marginTop: 1 }} />
                    <p className="text-xs leading-relaxed" style={{ color: A, fontFamily: IPS }}>
                      Bagian ini boleh dilewati. Semakin lengkap, semakin akurat rekomendasi AI-nya.
                    </p>
                  </div>
                  <SelectField label="Tingkat Dukungan" options={["Dukungan Minimal", "Dukungan Sedang", "Dukungan Intensif"]} value={form.tingkat_dukungan} onChange={set("tingkat_dukungan")} />
                  <SelectField label="Kemampuan Komunikasi" options={["Verbal baik", "Verbal terbatas", "Non-verbal", "Menggunakan BISINDO/SIBI"]} value={form.komunikasi} onChange={set("komunikasi")} />
                  <SelectField label="Kemampuan Motorik" options={["Motorik halus baik", "Motorik kasar baik", "Keduanya baik", "Perlu dukungan alat bantu"]} value={form.motorik} onChange={set("motorik")} />
                  <SelectField label="Cara Belajar Dominan" options={CARA_BELAJAR_OPTIONS} value={form.cara_belajar} onChange={set("cara_belajar")} />
                  <Field label="Rentang Konsentrasi" placeholder="Contoh: 10–15 menit" value={form.rentang} onChange={set("rentang")} />
                  <Field label="Minat Awal" placeholder="Contoh: Menggambar, musik" value={form.minat} onChange={set("minat")} />
                  <Field label="Riwayat Terapi" placeholder="Contoh: Terapi wicara 2021–2023" value={form.terapi} onChange={set("terapi")} />
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 flex gap-3 flex-shrink-0" style={{ borderTop: `1px solid ${BDR}` }}>
              <button
                type="button"
                onClick={() => {
                  if (step === "identitas") setStep("choice");
                  else setStep("identitas");
                }}
                style={{ flex: 1, border: `2px solid ${DEEP}`, color: DEEP, fontFamily: PJS, fontWeight: 700, fontSize: 14, minHeight: 50, background: CARD, borderRadius: 16 }}
                className="active:scale-[0.98] transition-all cursor-pointer"
              >
                ← Kembali
              </button>
              <button
                type="button"
                onClick={() => {
                  if (step === "identitas") {
                    if (canNext) setStep("abk");
                  } else save();
                }}
                disabled={step === "identitas" && !canNext}
                style={{
                  flex: 2,
                  background: (step === "identitas" && !canNext) ? "#D1D5DB" : A,
                  color: "#fff",
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 15,
                  minHeight: 50,
                  borderRadius: 16,
                  border: "none",
                  boxShadow: (step === "identitas" && !canNext) ? "none" : "0 6px 20px rgba(210,125,107,0.42)",
                  cursor: (step === "identitas" && !canNext) ? "not-allowed" : "pointer"
                }}
                className="active:scale-[0.98] transition-all"
              >
                {step === "identitas" ? "Lanjut →" : "Simpan Siswa"}
              </button>
            </div>
            {step === "identitas" && (
              <div className="px-5 pb-4 -mt-2 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => canNext && save()}
                  disabled={!canNext}
                  style={{ width: "100%", color: canNext ? DEEP : "#9CA3AF", fontFamily: PJS, fontWeight: 600, minHeight: 32, background: "transparent", border: "none", cursor: canNext ? "pointer" : "default" }}
                  className="text-xs"
                >
                  Simpan cepat tanpa profil detail
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ width: "100%", color: MUTED, fontFamily: IPS, minHeight: 28, background: "transparent", border: "none", cursor: "pointer" }}
                  className="text-xs hover:text-[#738B7B] transition-colors"
                >
                  Lewati langkah ini, upload nanti →
                </button>
              </div>
            )}
          </>
        )}

        {/* 5. SUCCESS VIEW */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
            <div style={{ width: 72, height: 72, background: SEC }} className="rounded-3xl flex items-center justify-center mb-4">
              <CheckCircle size={36} style={{ color: DEEP }} />
            </div>
            <p className="font-bold text-xl mb-1" style={{ fontFamily: PJS, color: TEXT }}>Siswa Ditambahkan!</p>
            <p className="text-sm leading-relaxed mb-1" style={{ color: MUTED, fontFamily: IPS }}>
              <strong style={{ color: TEXT }}>{lastName}</strong> sudah masuk daftar kelas Anda dan siap didampingi.
            </p>
            <p className="text-xs mb-5" style={{ color: MUTED, fontFamily: IPS }}>
              Kode akses orang tua otomatis dibuat — bisa dilihat di halaman profil siswa.
            </p>
            <button
              type="button"
              onClick={tambahLagi}
              style={{
                width: "100%",
                border: `2px solid ${DEEP}`,
                color: DEEP,
                fontFamily: PJS,
                fontWeight: 700,
                fontSize: 14,
                minHeight: 50,
                background: CARD,
                borderRadius: 16,
                cursor: "pointer"
              }}
              className="flex items-center justify-center gap-2 mb-3 active:scale-[0.98] transition-all"
            >
              <UserPlus size={16} /> Tambah Siswa Lain
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "100%",
                background: A,
                color: "#fff",
                fontFamily: PJS,
                fontWeight: 700,
                fontSize: 15,
                minHeight: 52,
                borderRadius: 16,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(210,125,107,0.42)"
              }}
              className="active:scale-[0.98] transition-all"
            >
              {firstTime ? `Selesai${savedCount ? ` · ${savedCount} siswa` : ""} → Masuk Aplikasi` : "Selesai"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
