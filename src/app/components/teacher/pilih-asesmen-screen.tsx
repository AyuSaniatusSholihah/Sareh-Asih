import {
  FileText, FileSpreadsheet, ChevronRight, ChevronLeft, LayoutGrid, Sparkles, Check,
} from "lucide-react";
import { BG, PJS, IPS, TEXT, MUTED } from "../ui-kit";
import { useStudents, type Screen } from "../data";

export function PilihAsesmenScreen({
  onBack,
  go,
  studentId,
  onStartObs,
}: {
  onBack: () => void;
  go: (s: Screen) => void;
  studentId: number;
  onStartObs: (id: number) => void;
}) {
  const students = useStudents();
  const s = students.find((x) => x.id === studentId) ?? students[0];

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{
        fontFamily: IPS,
        background: BG,
        minHeight: "100%",
      }}
    >
      {/* ── Header with decorative plant graphic ── */}
      <div
        style={{
          position: "relative",
          background: BG,
          padding: "24px 20px 20px",
          borderBottom: "1px solid #E1ECE5",
          overflow: "hidden",
        }}
      >
        {/* Top Right Plant & Heart Decorative Graphic */}
        <svg
          width="130"
          height="100"
          viewBox="0 0 130 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <path d="M130 0H20C35 32 65 68 130 78V0Z" fill="#E2EFE7" />
          <path d="M96 74C92 56 89 40 86 28" stroke="#5D8369" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M90 54C80 50 75 39 82 36C87 34 91 43 90 54Z" fill="#759A81" />
          <path d="M91 62C101 62 108 52 103 46C97 42 92 50 91 62Z" fill="#759A81" />
          <path d="M88 40C98 37 102 26 96 23C90 21 87 31 88 40Z" fill="#759A81" />
          <g transform="translate(73, 8) scale(0.7) rotate(-8 12 12)">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#F49D83"
            />
          </g>
        </svg>

        {/* Header content: Back button + Title & Subtitle */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, position: "relative", zIndex: 1 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              padding: "2px 4px",
              margin: "-2px 0 0 -4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#163828",
            }}
            className="active:scale-90 transition-transform"
            title="Kembali"
          >
            <ChevronLeft size={28} strokeWidth={2.6} />
          </button>
          <div>
            <h1
              style={{
                fontFamily: PJS,
                fontSize: 24,
                fontWeight: 800,
                color: "#163828",
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              Pilih Asesmen
            </h1>
            <p
              style={{
                fontFamily: IPS,
                fontSize: 13.5,
                color: "#5C7667",
                margin: "4px 0 0",
                fontWeight: 500,
              }}
            >
              Kelas {s?.kelas || "VII A"} • {s?.name || "Dinda Sari"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-5 pt-6 pb-12 space-y-4">
        {/* ── Section Title: Pilih Jenis Asesmen ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#E2ECE5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LayoutGrid size={20} style={{ color: "#1B4332" }} strokeWidth={2.2} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: PJS,
                fontSize: 15.5,
                fontWeight: 800,
                color: "#163828",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              Pilihan Paket Instrumen
            </h2>
            <p
              style={{
                fontFamily: IPS,
                fontSize: 12.5,
                color: "#5C7667",
                margin: "2px 0 0",
                lineHeight: 1.3,
              }}
            >
              Pilih instrumen yang ingin digunakan untuk observasi.
            </p>
          </div>
        </div>

        {/* ── Card 1: Asesmen Standar Minat & Bakat (Kotakan putih tegas dengan border & badge) ── */}
        <button
          type="button"
          onClick={() => {
            if (s) onStartObs(s.id);
          }}
          style={{
            width: "100%",
            background: "#FFFFFF",
            border: "1.5px solid #D5E5DA",
            borderRadius: 20,
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            cursor: "pointer",
            textAlign: "left",
            boxShadow: "0 4px 16px rgba(36, 68, 50, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)",
          }}
          className="active:scale-[0.98] transition-all hover:border-[#4B795D] hover:shadow-md"
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "#E8F4EC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(46,110,68,0.15)",
              }}
            >
              <FileText size={24} style={{ color: "#246E44" }} strokeWidth={2.2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    background: "#E8F4EC",
                    color: "#236B42",
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid rgba(35,107,66,0.22)",
                    fontFamily: PJS,
                    letterSpacing: "0.2px",
                  }}
                >
                  Rekomendasi Sareh Asih
                </span>
                <ChevronRight size={18} style={{ color: "#5C7667" }} strokeWidth={2.4} />
              </div>
              <h3
                style={{
                  fontFamily: PJS,
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#163828",
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Asesmen Standar Minat &amp; Bakat
              </h3>
              <p
                style={{
                  fontFamily: IPS,
                  fontSize: 12.5,
                  color: "#5C7667",
                  margin: "5px 0 0",
                  lineHeight: 1.45,
                }}
              >
                Instrumen observasi baku untuk mengenali kecenderungan minat (RIASEC) dan tingkat kemandirian anak.
              </p>
            </div>
          </div>

          {/* Sub-fitur pembatas info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingTop: 10,
              borderTop: "1px solid #EDF4EE",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#3E5D4B", fontFamily: IPS }}>
              <Check size={13} strokeWidth={2.8} style={{ color: "#246E44" }} /> Siap Langsung Pakai
            </span>
            <span style={{ color: "#CBD5E1", fontSize: 10 }}>•</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#3E5D4B", fontFamily: IPS }}>
              <Check size={13} strokeWidth={2.8} style={{ color: "#246E44" }} /> Minat &amp; Bakat (RIASEC)
            </span>
            <span style={{ color: "#CBD5E1", fontSize: 10 }}>•</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#3E5D4B", fontFamily: IPS }}>
              <Check size={13} strokeWidth={2.8} style={{ color: "#246E44" }} /> Kemandirian Fungsional
            </span>
          </div>
        </button>

        {/* ── Card 2: Asesmen Mandiri / Kustom (Kotakan putih tegas dengan border & badge) ── */}
        <button
          type="button"
          onClick={() => go("asesmen-custom")}
          style={{
            width: "100%",
            background: "#FFFFFF",
            border: "1.5px solid #EADBCE",
            borderRadius: 20,
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            cursor: "pointer",
            textAlign: "left",
            boxShadow: "0 4px 16px rgba(60, 40, 30, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)",
          }}
          className="active:scale-[0.98] transition-all hover:border-[#BA6B4E] hover:shadow-md"
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "#FDF0EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(184,88,59,0.18)",
              }}
            >
              <FileSpreadsheet size={24} style={{ color: "#B8583B" }} strokeWidth={2.2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    background: "#FDF0EB",
                    color: "#B8583B",
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid rgba(184,88,59,0.22)",
                    fontFamily: PJS,
                    letterSpacing: "0.2px",
                  }}
                >
                  Fleksibel &amp; Mandiri
                </span>
                <ChevronRight size={18} style={{ color: "#5C7667" }} strokeWidth={2.4} />
              </div>
              <h3
                style={{
                  fontFamily: PJS,
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#163828",
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Asesmen Mandiri / Kustom
              </h3>
              <p
                style={{
                  fontFamily: IPS,
                  fontSize: 12.5,
                  color: "#5C7667",
                  margin: "5px 0 0",
                  lineHeight: 1.45,
                }}
              >
                Gunakan template observasi khusus atau impor instrumen dari format spreadsheet (Google Drive / XLSX) Anda.
              </p>
            </div>
          </div>

          {/* Sub-fitur pembatas info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingTop: 10,
              borderTop: "1px solid #F8ECE7",
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#8C4A35", fontFamily: IPS }}>
              <Check size={13} strokeWidth={2.8} style={{ color: "#B8583B" }} /> Impor Spreadsheet XLSX
            </span>
            <span style={{ color: "#CBD5E1", fontSize: 10 }}>•</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: "#8C4A35", fontFamily: IPS }}>
              <Check size={13} strokeWidth={2.8} style={{ color: "#B8583B" }} /> Template Kustom Guru
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
