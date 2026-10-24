import { useRef, useState } from "react";
import {
  CloudUpload, FileSpreadsheet, FileText, ChevronRight,
  CheckCircle, XCircle, Download, Info,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  A, CARD, TEXT, MUTED, SEC, BDR, DEEP, BG, PJS, IPS, TBar,
} from "../ui-kit";
import { useStudents } from "../data";

type InstrumenRow = {
  no: number;
  aspek: string;
  indikator: string;
  pilihan: string;
  catatan?: string;
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const NAMA_TEMPLATE = "Template_Asesmen_Custom_SarehAsih.xlsx";

const KOLOM_WAJIB = ["Aspek", "Indikator", "Pilihan Jawaban"];

/** Template resmi: 2 sheet (Petunjuk + Instrumen) sesuai spesifikasi Sareh Asih. */
function unduhTemplate() {
  const petunjuk: (string | number)[][] = [
    ["Template Asesmen Custom — Sareh Asih"],
    [],
    ["Kolom", "Keterangan", "Wajib"],
    ["Aspek", "Aspek yang dinilai", "Ya"],
    ["Indikator", "Kemampuan yang diamati", "Ya"],
    ["Pilihan Jawaban", "Opsi penilaian", "Ya"],
    ["Catatan", "Keterangan tambahan", "Opsional"],
    [],
    ["Catatan:"],
    ["• Jangan mengubah nama kolom."],
    ["• Gunakan pilihan jawaban yang tersedia di template."],
    ["• Simpan file dengan format .xlsx."],
  ];

  const pilihan = "Belum; Dibantu; Sebagian; Mandiri";
  const instrumen: (string | number)[][] = [
    ["No", "Aspek", "Indikator", "Pilihan Jawaban"],
    [1, "Kognisi", "Memahami instruksi sederhana", pilihan],
    [2, "Kognisi", "Mengikuti instruksi bertahap", pilihan],
    [3, "Mobilitas", "Berpindah tempat secara mandiri", pilihan],
    [4, "Perawatan Diri", "Menggunakan alat makan", pilihan],
    [5, "Aktivitas Harian", "Menyelesaikan tugas sederhana", pilihan],
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(petunjuk), "Petunjuk");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(instrumen), "Instrumen");
  XLSX.writeFile(wb, NAMA_TEMPLATE);
}

export function AsesmenCustomScreen({
  onBack,
  studentId,
}: {
  onBack: () => void;
  studentId: number;
}) {
  const students = useStudents();
  const s = students.find(x => x.id === studentId) ?? students[0];

  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState<InstrumenRow[] | null>(null);

  const terimaFile = (f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx") {
      setFile(null);
      setErr("Format file harus .xlsx. Gunakan template Sareh Asih lalu isi instrumen Anda.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setFile(null);
      setErr("Ukuran file melebihi 5 MB. Kompres atau hapus sheet yang tidak diperlukan.");
      return;
    }
    setErr("");
    setFile(f);
    setPreview(null);
  };

  /** Parse file .xlsx yang dipilih — hanya membaca, tidak menyimpan ke data siswa. */
  const handleSimpan = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target?.result, { type: "array" });
        const sheetName =
          wb.SheetNames.find(n => n.toLowerCase().includes("instrumen")) || wb.SheetNames[0];
        const ws = sheetName ? wb.Sheets[sheetName] : undefined;
        if (!ws) {
          setErr("File tidak berisi sheet yang dapat dibaca.");
          return;
        }

        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
        if (json.length === 0) {
          setErr("Sheet tidak berisi data instrumen. Isi baris sesuai format template.");
          return;
        }

        // Cocokkan header wajib (case-insensitive, toleran spasi)
        const headers = Object.keys(json[0]).map(h => h.trim().toLowerCase());
        const ada = (kolom: string) => headers.includes(kolom.toLowerCase());
        const kurang = KOLOM_WAJIB.filter(k => !ada(k));
        if (kurang.length > 0) {
          setErr(`Kolom wajib belum ada di template: ${kurang.join(", ")}. Jangan mengubah nama kolom.`);
          return;
        }

        const pick = (row: Record<string, unknown>, kolom: string) => {
          const key = Object.keys(row).find(k => k.trim().toLowerCase() === kolom.toLowerCase());
          return key ? String(row[key] ?? "").trim() : "";
        };

        const rows: InstrumenRow[] = json
          .map((row, i) => ({
            no: Number(pick(row, "No")) || i + 1,
            aspek: pick(row, "Aspek"),
            indikator: pick(row, "Indikator"),
            pilihan: pick(row, "Pilihan Jawaban"),
            catatan: pick(row, "Catatan") || undefined,
          }))
          .filter(r => r.aspek || r.indikator);

        if (rows.length === 0) {
          setErr("Tidak ada instrumen yang terbaca. Pastikan baris sudah diisi dengan benar.");
          return;
        }

        setErr("");
        setPreview(rows);
      } catch {
        setErr("File gagal dibaca. Pastikan file .xlsx tidak rusak atau terkunci.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const reset = () => {
    setFile(null);
    setErr("");
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <TBar title="Asesmen Mandiri / Kustom" sub={s?.name ?? ""} onBack={onBack} />
      <div className="px-4 pt-4 pb-8 space-y-3">
        {/* ── Hero: ilustrasi upload instrumen ── */}
        <div
          style={{
            background: `linear-gradient(160deg, ${SEC} 0%, #EAF4EE 60%, #F3F9F5 100%)`,
            border: `1px solid rgba(91,122,104,0.15)`,
            borderRadius: 22,
            padding: "26px 16px",
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
            <div style={{ background: CARD, borderRadius: 12, padding: "8px 6px", boxShadow: "0 3px 10px rgba(45,84,62,0.10)", border: `1px solid rgba(91,122,104,0.12)`, transform: "rotate(-6deg)" }}>
              <FileSpreadsheet size={20} style={{ color: DEEP }} />
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CloudUpload size={78} strokeWidth={1.4} style={{ color: "#3D6B52" }} />
            </div>
            <div style={{ background: CARD, borderRadius: 12, padding: "8px 6px", boxShadow: "0 3px 10px rgba(45,84,62,0.10)", border: `1px solid rgba(91,122,104,0.12)`, transform: "rotate(6deg)" }}>
              <FileText size={20} style={{ color: DEEP }} />
            </div>
          </div>
        </div>

        {/* ── Judul & deskripsi ── */}
        <div>
          <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 17, color: TEXT, margin: 0 }}>
            Upload Instrumen Asesmen
          </p>
          <p style={{ fontSize: 12.5, color: MUTED, margin: "5px 0 0", lineHeight: 1.55 }}>
            Gunakan template Sareh Asih agar asesmen dapat diproses oleh sistem.
          </p>
        </div>

        {/* ── Info format ── */}
        <div style={{ background: SEC, border: `1px solid rgba(91,122,104,0.18)`, borderRadius: 16, padding: "11px 13px" }} className="flex items-start gap-2.5">
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: DEEP, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            <Info size={13} style={{ color: "#FFFFFF" }} />
          </div>
          <div>
            <p style={{ fontSize: 12, color: "#2E3E35", margin: 0, lineHeight: 1.5 }}>
              Format file yang didukung: <strong style={{ fontFamily: PJS }}>.xlsx</strong>
            </p>
            <p style={{ fontSize: 12, color: "#2E3E35", margin: "2px 0 0", lineHeight: 1.5 }}>
              Ukuran maksimal: <strong style={{ fontFamily: PJS }}>5 MB</strong>
            </p>
          </div>
        </div>

        {preview ? (
          /* ═══ PREVIEW: hasil parse (tidak disimpan) ═══ */
          <>
            <div style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.3)`, borderRadius: 18, overflow: "hidden" }}>
              <div style={{ background: SEC, padding: "11px 14px" }} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} style={{ color: DEEP }} />
                  <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: TEXT, margin: 0 }}>
                    {preview.length} instrumen terbaca
                  </p>
                </div>
                <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: 0, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {file?.name}
                </p>
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {preview.map((r, i) => (
                  <div key={i} style={{ padding: "10px 14px", borderTop: i === 0 ? "none" : `1px solid rgba(91,122,104,0.10)` }}>
                    <div className="flex items-start gap-2.5">
                      <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 10.5, color: DEEP, background: SEC, borderRadius: 8, padding: "2px 7px", flexShrink: 0 }}>
                        {r.no}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12.5, color: TEXT, margin: 0 }}>
                          {r.aspek || "—"}
                        </p>
                        <p style={{ fontSize: 11.5, color: TEXT, margin: "2px 0 0", lineHeight: 1.45 }}>{r.indikator}</p>
                        <p style={{ fontSize: 10.5, color: MUTED, margin: "3px 0 0", lineHeight: 1.4 }}>
                          Jawaban: {r.pilihan || "—"}
                        </p>
                        {r.catatan && (
                          <p style={{ fontSize: 10.5, color: MUTED, margin: "2px 0 0", fontStyle: "italic" }}>
                            Catatan: {r.catatan}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={reset}
                style={{ flex: 1, background: CARD, border: `1.5px solid ${DEEP}`, color: DEEP, fontFamily: PJS, fontWeight: 800, fontSize: 13, minHeight: 48, borderRadius: 14, cursor: "pointer" }}
                className="active:scale-95 transition-transform"
              >
                Upload Ulang
              </button>
              <button
                type="button"
                onClick={onBack}
                style={{ flex: 1, background: DEEP, border: "none", color: "#FFFFFF", fontFamily: PJS, fontWeight: 800, fontSize: 13, minHeight: 48, borderRadius: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(91,122,104,0.3)" }}
                className="active:scale-95 transition-transform"
              >
                Selesai
              </button>
            </div>

            <button
              type="button"
              onClick={unduhTemplate}
              style={{ width: "100%", background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: "13px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              className="active:scale-[0.99] transition-transform"
            >
              <span className="flex items-center gap-2.5">
                <Download size={16} style={{ color: DEEP }} />
                <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: TEXT }}>Unduh Template</span>
              </span>
              <ChevronRight size={16} style={{ color: MUTED }} />
            </button>
          </>
        ) : (
          /* ═══ FORM UPLOAD ═══ */
          <>
            {/* Dropzone */}
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx"
              style={{ display: "none" }}
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) terimaFile(f);
              }}
            />
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) terimaFile(f);
              }}
              style={{
                background: file ? SEC : "rgba(255,255,255,0.6)",
                border: `2px dashed ${file ? DEEP : "rgba(91,122,104,0.4)"}`,
                borderRadius: 18,
                padding: "26px 16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              className="active:scale-[0.99]"
            >
              {file ? (
                <>
                  <FileSpreadsheet size={34} style={{ color: DEEP }} />
                  <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: TEXT, margin: "8px 0 0" }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: 11, color: MUTED, margin: "3px 0 0" }}>
                    {(file.size / 1024).toFixed(0)} KB · Ketuk untuk mengganti file
                  </p>
                </>
              ) : (
                <>
                  <CloudUpload size={34} strokeWidth={1.6} style={{ color: DEEP }} />
                  <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: TEXT, margin: "8px 0 0" }}>
                    Tap untuk memilih file
                  </p>
                  <p style={{ fontSize: 11.5, color: MUTED, margin: "3px 0 0" }}>
                    atau seret file ke sini
                  </p>
                </>
              )}
            </div>

            {/* Pesan error */}
            {err && (
              <div style={{ background: "#FBF1EF", border: "1px solid rgba(210,110,91,0.3)", borderRadius: 14, padding: "10px 12px" }} className="flex items-start gap-2">
                <XCircle size={14} style={{ color: A, flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11.5, color: "#9A4A38", margin: 0, lineHeight: 1.5 }}>{err}</p>
              </div>
            )}

            {/* Format label */}
            <div className="flex items-center gap-2">
              <FileText size={13} style={{ color: MUTED }} />
              <p style={{ fontSize: 11.5, color: MUTED, margin: 0 }}>
                Format: <strong style={{ fontFamily: PJS, color: TEXT }}>.xlsx</strong>
              </p>
            </div>

            {/* Unduh Template */}
            <button
              type="button"
              onClick={unduhTemplate}
              style={{ width: "100%", background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: "13px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
              className="active:scale-[0.99] transition-transform"
            >
              <span className="flex items-center gap-2.5">
                <Download size={16} style={{ color: DEEP }} />
                <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: TEXT }}>Unduh Template</span>
              </span>
              <ChevronRight size={16} style={{ color: MUTED }} />
            </button>

            {/* Simpan */}
            <button
              type="button"
              onClick={handleSimpan}
              disabled={!file}
              style={{
                width: "100%",
                background: file ? DEEP : "#C9D4CD",
                border: "none",
                color: "#FFFFFF",
                fontFamily: PJS,
                fontWeight: 800,
                fontSize: 14,
                minHeight: 50,
                borderRadius: 14,
                cursor: file ? "pointer" : "default",
                boxShadow: file ? "0 4px 14px rgba(91,122,104,0.3)" : "none",
              }}
              className="active:scale-[0.98] transition-transform"
            >
              Simpan
            </button>

            <p style={{ fontSize: 11, color: MUTED, textAlign: "center", margin: "2px 0 0", lineHeight: 1.5 }}>
              Hasil upload hanya dipreview di sini dan tidak mengubah data siswa.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
