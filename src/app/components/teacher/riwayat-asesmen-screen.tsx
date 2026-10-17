import { useState } from "react";
import {
  FileText, ChevronRight, ChevronLeft, Calendar, CheckCircle2,
  Clock, Sparkles, Info,
} from "lucide-react";
import {
  BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
} from "../ui-kit";
import { useStudents, type Screen } from "../data";

export function RiwayatAsesmenScreen({
  onBack,
  go,
  studentId,
  onStartObs,
}: {
  onBack: () => void;
  go: (s: Screen) => void;
  studentId: number;
  onStartObs?: (id: number) => void;
}) {
  const students = useStudents();
  const s = students.find((x) => x.id === studentId) ?? students[0];

  const RIWAYAT_DATA = [
    {
      id: "sem-1-2026",
      semester: "Semester 1 2026",
      tipe: "Asesmen Akademik & Fungsional",
      tanggal: "5 Jul 2026",
      status: "Selesai" as const,
      isCompleted: true,
    },
    {
      id: "sem-2-2025",
      semester: "Semester 2 2025",
      tipe: "Asesmen Akademik & Fungsional",
      tanggal: "10 Jan 2026",
      status: "Selesai" as const,
      isCompleted: true,
    },
    {
      id: "sem-1-2025",
      semester: "Semester 1 2025",
      tipe: "Asesmen Akademik & Fungsional",
      tanggal: "-",
      status: "Belum dikerjakan" as const,
      isCompleted: false,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* ── Top Bar ── */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "14px 16px 12px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: `1px solid ${BDR}`,
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="active:scale-95 transition-transform"
          title="Kembali"
        >
          <ChevronLeft size={22} style={{ color: TEXT }} />
        </button>
        <div>
          <h2 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
            Riwayat Asesmen
          </h2>
          {s && (
            <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "2px 0 0" }}>
              {s.name} • Kelas {s.kelas}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-3.5">
        {/* ── List Kartu Riwayat Asesmen ── */}
        <div className="space-y-3">
          {RIWAYAT_DATA.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (item.isCompleted) {
                    go("talent-map-detail");
                  } else if (onStartObs && s) {
                    onStartObs(s.id);
                  }
                }}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  padding: "16px",
                  border: "1.5px solid rgba(91,122,104,0.14)",
                  boxShadow: "0 2px 8px rgba(91,122,104,0.04)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
                className="active:scale-[0.99] hover:border-[#3D5A49] transition-all group"
              >
                {/* Icon Circle */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: item.isCompleted ? "#EAF4EE" : "#F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText
                    size={22}
                    style={{ color: item.isCompleted ? "#2E3E35" : "#64748B" }}
                  />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 14, color: TEXT, margin: 0 }}>
                      {item.semester}
                    </p>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        fontFamily: PJS,
                        padding: "2px 9px",
                        borderRadius: 20,
                        background: item.isCompleted ? "#E8F5EC" : "#E0F2FE",
                        color: item.isCompleted ? "#15803D" : "#0369A1",
                        border: `1px solid ${item.isCompleted ? "#BBF7D0" : "#BAE6FD"}`,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p style={{ fontFamily: IPS, fontSize: 12, color: "#64748B", margin: 0 }}>
                    {item.tipe}
                  </p>
                  <p style={{ fontFamily: DMM, fontSize: 11, color: "#94A3B8", margin: "4px 0 0" }}>
                    {item.tanggal}
                  </p>
                </div>

                <ChevronRight size={18} style={{ color: "#94A3B8" }} strokeWidth={2.4} />
              </div>
            );
          })}
        </div>

        {/* ── Info Box di Bagian Bawah (Sesuai Mockup 2) ── */}
        <div
          style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: 18,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={20} style={{ color: "#15803D" }} />
          </div>
          <p style={{ fontFamily: IPS, fontSize: 12, color: "#166534", margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
            Lihat laporan lengkap setiap asesmen untuk memahami perkembangan siswa secara lebih detail.
          </p>
        </div>
      </div>
    </div>
  );
}
