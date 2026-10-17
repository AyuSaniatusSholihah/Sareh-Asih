import {
  FileText, FileSpreadsheet, ChevronRight, ChevronLeft, LayoutGrid,
} from "lucide-react";
import { PJS, IPS } from "../ui-kit";
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
        background: "#F5F8F5",
        minHeight: "100%",
      }}
    >
      {/* ── Header with decorative plant graphic ── */}
      <div
        style={{
          position: "relative",
          background: "#F5F8F5",
          padding: "24px 20px 20px",
          borderBottom: "1px solid #E3ECE6",
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
          {/* Organic wave background */}
          <path
            d="M130 0H20C35 32 65 68 130 78V0Z"
            fill="#E5EFE8"
          />

          {/* Plant stem */}
          <path
            d="M96 74C92 56 89 40 86 28"
            stroke="#5D8369"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Leaves */}
          <path
            d="M90 54C80 50 75 39 82 36C87 34 91 43 90 54Z"
            fill="#759A81"
          />
          <path
            d="M91 62C101 62 108 52 103 46C97 42 92 50 91 62Z"
            fill="#759A81"
          />
          <path
            d="M88 40C98 37 102 26 96 23C90 21 87 31 88 40Z"
            fill="#759A81"
          />

          {/* Coral Heart at tip */}
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
              Asesmen
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
              Kelas {s?.kelas || "7"} • {s?.name || "Dinda Sari"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-5 pt-6 pb-8 space-y-4">
        {/* ── Section Title: Pilih Jenis Asesmen ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#E2ECE5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LayoutGrid size={22} style={{ color: "#1B4332" }} strokeWidth={2.2} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: PJS,
                fontSize: 16,
                fontWeight: 700,
                color: "#163828",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              Pilih Jenis Asesmen
            </h2>
            <p
              style={{
                fontFamily: IPS,
                fontSize: 13,
                color: "#617A6D",
                margin: "3px 0 0",
                lineHeight: 1.3,
              }}
            >
              Pilih instrumen yang ingin digunakan.
            </p>
          </div>
        </div>

        {/* ── Card 1: Asesmen Bawaan ── */}
        <button
          type="button"
          onClick={() => {
            if (s) onStartObs(s.id);
          }}
          style={{
            width: "100%",
            background: "#F2F8F4",
            border: "1.5px solid #DDEEE3",
            borderRadius: 22,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            cursor: "pointer",
            textAlign: "left",
            boxShadow: "0 1px 3px rgba(30, 60, 40, 0.03)",
          }}
          className="active:scale-[0.98] transition-all hover:border-[#BFDDC9] hover:shadow-sm"
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "#DCEDE2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={26} style={{ color: "#1D4E37" }} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: PJS,
                fontWeight: 700,
                fontSize: 16,
                color: "#163828",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              Asesmen Bawaan
            </h3>
            <p
              style={{
                fontFamily: IPS,
                fontSize: 13,
                color: "#5C7667",
                margin: "4px 0 0",
                lineHeight: 1.35,
              }}
            >
              Instrumen akademik dan fungsional.
            </p>
          </div>
          <ChevronRight size={20} style={{ color: "#5C7667" }} strokeWidth={2.4} />
        </button>

        {/* ── Card 2: Asesmen Custom ── */}
        <button
          type="button"
          onClick={() => go("asesmen-custom")}
          style={{
            width: "100%",
            background: "#FCF5EF",
            border: "1.5px solid #F6E6DA",
            borderRadius: 22,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            cursor: "pointer",
            textAlign: "left",
            boxShadow: "0 1px 3px rgba(60, 40, 30, 0.03)",
          }}
          className="active:scale-[0.98] transition-all hover:border-[#E9CFBE] hover:shadow-sm"
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "#FCE9DC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileSpreadsheet size={26} style={{ color: "#A25736" }} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontFamily: PJS,
                fontWeight: 700,
                fontSize: 16,
                color: "#163828",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              Asesmen Custom
            </h3>
            <p
              style={{
                fontFamily: IPS,
                fontSize: 13,
                color: "#5C7667",
                margin: "4px 0 0",
                lineHeight: 1.35,
              }}
            >
              Gunakan template XLSX sendiri.
            </p>
          </div>
          <ChevronRight size={20} style={{ color: "#5C7667" }} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
