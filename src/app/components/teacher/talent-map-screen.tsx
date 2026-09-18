import { useState } from "react";
import { Star, ChevronRight, ClipboardList } from "lucide-react";
import {
  T, A, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
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
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS }}>
      {/* Header */}
      <div style={{ background: CARD }} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{ fontFamily: PJS, color: TEXT }}>Peta Bakat Siswa Per Kelas</p>
        <p className="text-xs" style={{ color: MUTED }}>Hasil pemetaan potensi & bakat siswa dikelompokkan per kelas</p>

        {/* Class Filter Chips */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedClass("Semua")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: IPS,
              background: selectedClass === "Semua" ? T : SEC,
              color: selectedClass === "Semua" ? "#fff" : DEEP,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
            Semua Kelas
          </button>
          {classes.map(k => (
            <button
              key={k}
              onClick={() => setSelectedClass(k)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: IPS,
                background: selectedClass === k ? T : SEC,
                color: selectedClass === k ? "#fff" : DEEP,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
              Kelas {k}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Metric Cards */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: T, boxShadow: "0 4px 12px rgba(139,176,152,0.3)" }}>
            <p className="font-bold text-2xl text-white" style={{ fontFamily: PJS }}>{withObsCount}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>Sudah dipetakan</p>
          </div>
          <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: CARD, border: `1.5px solid ${BDR}`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
            <p className="font-bold text-2xl" style={{ fontFamily: PJS, color: A }}>{noObsCount}</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>Belum pengamatan</p>
          </div>
          <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: CARD, border: `1.5px solid ${BDR}`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
            <p className="font-bold text-2xl" style={{ fontFamily: PJS, color: TEXT }}>{filteredStudents.length}</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>Total siswa</p>
          </div>
        </div>

        {/* Quick Link to Rekomendasi Lomba */}
        <div style={{
          background: `linear-gradient(135deg, ${A} 0%, #C46F5F 100%)`,
          borderRadius: 20,
          padding: "14px 16px",
          color: "#FFFFFF",
          boxShadow: "0 6px 18px rgba(210,125,107,0.30)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "rgba(255,255,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0
            }}>
              🏆
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2 }}>
                Rekomendasi Lomba & Agenda
              </p>
              <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.88)", marginTop: 1 }}>
                Lihat ajang lomba FLS2N, O2SN & LKSN sesuai minat siswa
              </p>
            </div>
          </div>
          <button onClick={() => go("competition")}
            style={{
              background: "#FFFFFF",
              color: A,
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 11.5,
              padding: "8px 12px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexShrink: 0,
              boxShadow: "0 4px 10px rgba(0,0,0,0.10)"
            }}
            className="active:scale-95 transition-transform">
            Buka <ChevronRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Grouped Student List per Class */}
        {Object.keys(groupedByClass).length === 0 ? (
          <div style={{ background: CARD, border: `1.5px dashed ${BDR}` }} className="rounded-2xl px-4 py-8 text-center">
            <p className="text-sm font-semibold" style={{ color: MUTED }}>Tidak ada siswa di kelas ini.</p>
          </div>
        ) : (
          Object.entries(groupedByClass).map(([kelasName, classStudents]) => {
            const mappedInClass = classStudents.filter(s => s.hasObs);
            return (
              <div key={kelasName} className="space-y-2">
                {/* Class Section Header */}
                <div className="flex items-center justify-between px-1 pt-2">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 26, height: 26, background: SEC, borderRadius: 8 }} className="flex items-center justify-center text-xs font-bold text-[#5B7A68]">
                      🏫
                    </div>
                    <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>Kelas {kelasName}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: SEC, color: DEEP }}>
                    {mappedInClass.length}/{classStudents.length} Dipetakan
                  </span>
                </div>

                {/* Students in this class */}
                <div className="space-y-2">
                  {classStudents.map(s => (
                    s.hasObs ? (
                      <button key={s.id} onClick={() => { onSelect(s.id); go("talent-map-detail"); }}
                        style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.22)`, width: "100%", textAlign: "left", boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}
                        className="rounded-2xl p-3.5 flex items-center gap-3 hover:bg-[#D4E8DA] transition-colors">
                        <div style={{ width: 44, height: 44, background: SEC, flexShrink: 0 }} className="rounded-2xl flex items-center justify-center text-xl">{s.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>{s.name}</p>
                          <p className="text-xs" style={{ color: MUTED }}>{s.abk}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: SEC, color: T }}>{s.talent || "Menunggu analisis"}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} style={{ color: i < s.stars ? A : "#E5E7EB", fill: i < s.stars ? A : "#E5E7EB" }} />)}
                            </div>
                            <span className="text-xs font-bold" style={{ color: T, fontFamily: DMM }}>{s.talentScore}</span>
                          </div>
                          <div className="mt-1.5 h-1.5 rounded-full" style={{ background: "#EDE9E3" }}>
                            <div className="h-full rounded-full" style={{ width: `${s.talentScore}%`, background: T }} />
                          </div>
                        </div>
                        <ChevronRight size={15} style={{ color: MUTED, flexShrink: 0 }} />
                      </button>
                    ) : (
                      <div key={s.id} style={{ background: CARD, border: `1.5px dashed rgba(91,122,104,0.40)`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }} className="rounded-2xl p-3.5 flex items-center gap-3">
                        <div style={{ width: 44, height: 44, background: "#EDE9E3", flexShrink: 0 }} className="rounded-2xl flex items-center justify-center text-xl opacity-50">{s.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color: MUTED }}>{s.name}</p>
                          <p className="text-xs" style={{ color: MUTED }}>{s.abk}</p>
                          <p className="text-xs mt-1" style={{ color: MUTED }}>Belum ada data pengamatan</p>
                        </div>
                        <button onClick={() => onStartObs(s.id)}
                          style={{
                            background: A,
                            color: "#fff",
                            fontFamily: PJS,
                            fontWeight: 700,
                            fontSize: 12,
                            minHeight: 36,
                            padding: "0 12px",
                            borderRadius: 12,
                            border: "none",
                            flexShrink: 0,
                            boxShadow: "0 3px 10px rgba(210,125,107,0.38)",
                            cursor: "pointer"
                          }}
                          className="flex items-center gap-1.5 active:scale-95 transition-all">
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
