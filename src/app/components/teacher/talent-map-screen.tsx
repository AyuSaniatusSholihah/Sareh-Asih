import { useState } from "react";
import { Star, ChevronRight, ClipboardList, Search, User, Settings } from "lucide-react";
import {
  T, A, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, useUI, BG,
} from "../ui-kit";
import { useStudents, type Screen } from "../data";

export function TalentMapScreen({
  go,
  onStartObs,
  onSelect,
}: {
  go: (s: Screen) => void;
  onStartObs: (id: number) => void;
  onSelect: (id: number) => void;
}) {
  const students = useStudents();
  const { openSearch, openSettings } = useUI();
  const [selectedClass, setSelectedClass] = useState<string>("Semua");

  // Get unique list of classes
  const classes = Array.from(new Set(students.map(s => s.kelas))).sort();

  const filteredStudents = selectedClass === "Semua"
    ? students
    : students.filter(s => s.kelas === selectedClass);

  // Group filtered students by class
  const groupedByClass = classes.reduce((acc, k) => {
    const list = filteredStudents.filter(s => s.kelas === k);
    if (list.length > 0) acc[k] = list;
    return acc;
  }, {} as Record<string, typeof students>);

  const withObsCount = filteredStudents.filter(s => s.hasObs).length;
  const noObsCount = filteredStudents.filter(s => !s.hasObs).length;

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* ── Top Header ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>
              Peta Bakat Siswa
            </h1>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: "#5A6E63", margin: "4px 0 0", fontWeight: 500 }}>
              Semua siswa · Berdasarkan observasi AI
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            <button
              onClick={openSearch}
              style={{
                width: 38,
                height: 38,
                background: "rgba(139,176,152,0.14)",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="active:scale-95 transition-transform"
              title="Cari"
            >
              <Search size={17} style={{ color: "#1B2E24" }} />
            </button>
            <button
              onClick={() => {
                if (students.length > 0) {
                  onSelect(students[0].id);
                  go("profile");
                }
              }}
              style={{
                width: 38,
                height: 38,
                background: "rgba(139,176,152,0.14)",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="active:scale-95 transition-transform"
              title="Profil Siswa"
            >
              <User size={17} style={{ color: "#1B2E24" }} />
            </button>
            <button
              onClick={openSettings}
              style={{
                width: 38,
                height: 38,
                background: "rgba(139,176,152,0.14)",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="active:scale-95 transition-transform"
              title="Pengaturan"
            >
              <Settings size={17} style={{ color: "#1B2E24" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Sticky Class Filter Chips ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "#FFFFFF",
          padding: "6px 20px 14px",
          borderBottom: "1px solid rgba(91, 122, 104, 0.08)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
        }}
      >
        <div className="flex gap-2 overflow-x-auto no-scrollbar" style={{ paddingBottom: 2 }}>
          <button
            onClick={() => setSelectedClass("Semua")}
            style={{
              padding: "7px 18px",
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: IPS,
              background: selectedClass === "Semua" ? "#749680" : "#DCE8E0",
              color: selectedClass === "Semua" ? "#FFFFFF" : "#234230",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.15s ease",
            }}
            className="active:scale-95"
          >
            Semua Kelas
          </button>
          {classes.map(k => {
            const isSelected = selectedClass === k;
            const label = k.startsWith("Kelas") ? k : `Kelas ${k}`;
            return (
              <button
                key={k}
                onClick={() => setSelectedClass(k)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 24,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: IPS,
                  background: isSelected ? "#749680" : "#DCE8E0",
                  color: isSelected ? "#FFFFFF" : "#234230",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
                className="active:scale-95"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="px-4 pt-4 pb-6 space-y-4" style={{ background: BG }}>
        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Sudah dipetakan */}
          <div
            style={{
              background: "#749680",
              borderRadius: 20,
              padding: "16px 8px",
              textAlign: "center",
              boxShadow: "0 4px 14px rgba(116, 150, 128, 0.25)",
            }}
          >
            <p style={{ fontFamily: PJS, fontSize: 28, fontWeight: 800, color: "#FFFFFF", margin: 0, lineHeight: 1 }}>
              {withObsCount}
            </p>
            <p style={{ fontFamily: IPS, fontSize: 12, fontWeight: 600, color: "#FFFFFF", marginTop: 6, margin: "6px 0 0", lineHeight: 1.25 }}>
              Sudah dipetakan
            </p>
          </div>

          {/* Card 2: Belum observasi */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              padding: "16px 8px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(91, 122, 104, 0.08)",
            }}
          >
            <p style={{ fontFamily: PJS, fontSize: 28, fontWeight: 800, color: "#D26E5B", margin: 0, lineHeight: 1 }}>
              {noObsCount}
            </p>
            <p style={{ fontFamily: IPS, fontSize: 12, fontWeight: 500, color: "#5A6E63", marginTop: 6, margin: "6px 0 0", lineHeight: 1.25 }}>
              Belum observasi
            </p>
          </div>

          {/* Card 3: Total siswa */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              padding: "16px 8px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(91, 122, 104, 0.08)",
            }}
          >
            <p style={{ fontFamily: PJS, fontSize: 28, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1 }}>
              {filteredStudents.length}
            </p>
            <p style={{ fontFamily: IPS, fontSize: 12, fontWeight: 500, color: "#5A6E63", marginTop: 6, margin: "6px 0 0", lineHeight: 1.25 }}>
              Total siswa
            </p>
          </div>
        </div>

        {/* Grouped Student List per Class */}
        {Object.keys(groupedByClass).length === 0 ? (
          <div style={{ background: "#FFFFFF", border: "1.5px dashed rgba(91, 122, 104, 0.25)" }} className="rounded-2xl px-4 py-8 text-center">
            <p className="text-sm font-semibold" style={{ color: "#5A6E63" }}>Tidak ada siswa di kelas ini.</p>
          </div>
        ) : (
          Object.entries(groupedByClass).map(([kelasName, classStudents]) => {
            const mappedInClass = classStudents.filter(s => s.hasObs);
            const labelKelas = kelasName.startsWith("Kelas") ? kelasName : `Kelas ${kelasName}`;
            return (
              <div key={kelasName} className="space-y-2">
                {/* Class Section Header */}
                <div className="flex items-center justify-between px-1 pt-1">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 26, height: 26, background: "#DCE8E0", borderRadius: 8 }} className="flex items-center justify-center text-xs font-bold text-[#2D543E]">
                      🏫
                    </div>
                    <p className="font-bold text-sm" style={{ fontFamily: PJS, color: "#1B2E24" }}>{labelKelas}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#DCE8E0", color: "#2D543E" }}>
                    {mappedInClass.length}/{classStudents.length} Dipetakan
                  </span>
                </div>

                {/* Students in this class */}
                <div className="space-y-2">
                  {classStudents.map(s => (
                    s.hasObs ? (
                      <button
                        key={s.id}
                        onClick={() => { onSelect(s.id); go("talent-map-detail"); }}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid rgba(91, 122, 104, 0.12)",
                          width: "100%",
                          textAlign: "left",
                          boxShadow: "0 2px 8px rgba(91, 122, 104, 0.05)",
                          borderRadius: 20,
                        }}
                        className="p-3.5 flex items-center gap-3 hover:bg-[#F0F6F2] transition-colors"
                      >
                        <div style={{ width: 44, height: 44, background: "#EEF4F0", flexShrink: 0, borderRadius: 16 }} className="flex items-center justify-center text-xl">
                          {s.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ fontFamily: PJS, color: "#1B2E24" }}>{s.name}</p>
                          <p className="text-xs" style={{ color: "#5A6E63" }}>{s.abk}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#E4EFE7", color: "#2D543E" }}>
                              {s.talent || "Menunggu analisis"}
                            </span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={10} style={{ color: i < s.stars ? "#E5A83B" : "#E2E8F0", fill: i < s.stars ? "#E5A83B" : "#E2E8F0" }} />
                              ))}
                            </div>
                            <span className="text-xs font-bold" style={{ color: "#2D543E", fontFamily: DMM }}>{s.talentScore}</span>
                          </div>
                          <div className="mt-1.5 h-1.5 rounded-full" style={{ background: "#E8EFEA" }}>
                            <div className="h-full rounded-full" style={{ width: `${s.talentScore}%`, background: "#749680" }} />
                          </div>
                        </div>
                        <ChevronRight size={15} style={{ color: "#94A3B8", flexShrink: 0 }} />
                      </button>
                    ) : (
                      <div
                        key={s.id}
                        style={{
                          background: "#FFFFFF",
                          border: "1.5px dashed rgba(91, 122, 104, 0.28)",
                          boxShadow: "0 2px 8px rgba(91, 122, 104, 0.04)",
                          borderRadius: 20,
                        }}
                        className="p-3.5 flex items-center gap-3"
                      >
                        <div style={{ width: 44, height: 44, background: "#F1F5F2", flexShrink: 0, borderRadius: 16 }} className="flex items-center justify-center text-xl opacity-60">
                          {s.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color: "#5A6E63" }}>{s.name}</p>
                          <p className="text-xs" style={{ color: "#8E9E94" }}>{s.abk}</p>
                          <p className="text-xs mt-1" style={{ color: "#8E9E94" }}>Belum ada data observasi</p>
                        </div>
                        <button
                          onClick={() => onStartObs(s.id)}
                          style={{
                            background: "#D26E5B",
                            color: "#fff",
                            fontFamily: PJS,
                            fontWeight: 700,
                            fontSize: 12,
                            minHeight: 36,
                            padding: "0 12px",
                            borderRadius: 12,
                            border: "none",
                            flexShrink: 0,
                            boxShadow: "0 3px 10px rgba(210, 110, 91, 0.35)",
                            cursor: "pointer",
                          }}
                          className="flex items-center gap-1.5 active:scale-95 transition-all"
                        >
                          <ClipboardList size={13} /> Mulai
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
