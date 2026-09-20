import { useState, useMemo } from "react";
import {
  Users, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ChevronRight,
  Search, User, Settings, BarChart2, Play, School
} from "lucide-react";
import {
  TEXT, MUTED, BDR, DEEP, A, PJS, IPS, DMM, useUI, BG,
} from "../ui-kit";
import { useStudents, type Screen, type Student } from "../data";

type FilterStatus = "semua" | "perlu" | "terpetakan";

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
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua");
  const [collapsedClasses, setCollapsedClasses] = useState<Record<string, boolean>>({});

  // Unique list of classes
  const classes = useMemo(() => Array.from(new Set(students.map(s => s.kelas))).sort(), [students]);

  // Filter students by selected class
  const classFiltered = useMemo(() => {
    if (selectedClass === "Semua") return students;
    return students.filter(s => s.kelas === selectedClass);
  }, [students, selectedClass]);

  // Counts based on class selection
  const totalCount = classFiltered.length;
  const mappedCount = classFiltered.filter(s => s.hasObs).length;
  const unmappedCount = classFiltered.filter(s => !s.hasObs).length;

  // Filter students by status
  const statusFiltered = useMemo(() => {
    if (filterStatus === "terpetakan") return classFiltered.filter(s => s.hasObs);
    if (filterStatus === "perlu") return classFiltered.filter(s => !s.hasObs);
    return classFiltered;
  }, [classFiltered, filterStatus]);

  // Group by class
  const groupedByClass = useMemo(() => {
    return classes.reduce((acc, k) => {
      const list = statusFiltered.filter(s => s.kelas === k);
      if (list.length > 0) acc[k] = list;
      return acc;
    }, {} as Record<string, Student[]>);
  }, [classes, statusFiltered]);

  const toggleClassCollapse = (k: string) => {
    setCollapsedClasses(prev => ({ ...prev, [k]: !prev[k] }));
  };

  // Avatar helper
  const getAvatarUrl = (s: Student) => {
    const avatarMap: Record<number, string> = {
      1: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=160&auto=format&fit=crop&q=80",
      2: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=160&auto=format&fit=crop&q=80",
      3: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&auto=format&fit=crop&q=80",
      4: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=160&auto=format&fit=crop&q=80",
      5: "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?w=160&auto=format&fit=crop&q=80",
      6: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=160&auto=format&fit=crop&q=80",
      7: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
      8: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80",
    };
    return avatarMap[s.id] || `https://api.dicebear.com/7.x/open-peeps/svg?seed=${s.name}`;
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* ── Top Header Bar (Dikembalikan ke Desain Asli Tanpa Icon Bunga) ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 8px", borderBottom: "1px solid rgba(91, 122, 104, 0.08)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
              Peta Bakat Siswa
            </h1>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: MUTED, margin: "4px 0 0", fontWeight: 500 }}>
              Semua siswa · Berdasarkan asesmen AI
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
              <Search size={17} style={{ color: TEXT }} />
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
              <User size={17} style={{ color: TEXT }} />
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
              <Settings size={17} style={{ color: TEXT }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Body ── */}
      <div className="px-4 pt-4 pb-8 space-y-4">
        {/* ── 3 Metric Cards (Konsisten Warna Sareh Asih - Versi Lebih Ramping & Kompak) ── */}
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1: Total Siswa */}
          <div
            onClick={() => setFilterStatus("semua")}
            style={{
              background: filterStatus === "semua" ? "#FFFFFF" : "rgba(255,255,255,0.7)",
              borderRadius: 14,
              padding: "10px 9px 9px",
              border: filterStatus === "semua" ? `1.5px solid ${DEEP}` : `1px solid ${BDR}`,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(91,122,104,0.05)",
              transition: "all 0.15s ease",
            }}
            className="active:scale-95 flex flex-col justify-between"
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: "rgba(91, 122, 104, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Users size={14} style={{ color: DEEP }} />
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1 }}>
                {totalCount}
              </p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, fontWeight: 600, color: MUTED, margin: "3px 0 0", lineHeight: 1.2 }}>
                Total siswa
              </p>
            </div>
          </div>

          {/* Card 2: Terpetakan */}
          <div
            onClick={() => setFilterStatus("terpetakan")}
            style={{
              background: filterStatus === "terpetakan" ? "#E2EFE7" : "#EBF4EE",
              borderRadius: 14,
              padding: "10px 9px 9px",
              border: filterStatus === "terpetakan" ? `1.5px solid ${DEEP}` : "1px solid rgba(45, 84, 62, 0.18)",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(45, 84, 62, 0.06)",
              transition: "all 0.15s ease",
            }}
            className="active:scale-95 flex flex-col justify-between relative"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: "#D5E7DC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle2 size={14} style={{ color: DEEP }} />
              </div>
              <ChevronRight size={12} style={{ color: DEEP }} />
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, color: DEEP, margin: 0, lineHeight: 1 }}>
                {mappedCount}
              </p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, fontWeight: 700, color: DEEP, margin: "3px 0 0", lineHeight: 1.2 }}>
                Terpetakan
              </p>
            </div>
          </div>

          {/* Card 3: Perlu Asesmen */}
          <div
            onClick={() => setFilterStatus("perlu")}
            style={{
              background: filterStatus === "perlu" ? "#F8E6E2" : "#FBF1EF",
              borderRadius: 14,
              padding: "10px 9px 9px",
              border: filterStatus === "perlu" ? `1.5px solid ${A}` : "1px solid rgba(210, 110, 91, 0.22)",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(210, 110, 91, 0.06)",
              transition: "all 0.15s ease",
            }}
            className="active:scale-95 flex flex-col justify-between relative"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: "#F5DAD5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertCircle size={14} style={{ color: A }} />
              </div>
              <ChevronRight size={12} style={{ color: A }} />
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, color: A, margin: 0, lineHeight: 1 }}>
                {unmappedCount}
              </p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, fontWeight: 700, color: A, margin: "3px 0 0", lineHeight: 1.2 }}>
                Perlu asesmen
              </p>
            </div>
          </div>
        </div>

        {/* ── Filter Row: Dropdown Kelas & Status Chips (Konsisten Palet Warna) ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Class Dropdown */}
          <div className="relative flex-shrink-0">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                background: "#FFFFFF",
                border: `1px solid ${BDR}`,
                borderRadius: 16,
                padding: "8px 30px 8px 34px",
                fontFamily: PJS,
                fontWeight: 700,
                fontSize: 12,
                color: TEXT,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(91,122,104,0.05)",
              }}
            >
              <option value="Semua">Semua Kelas</option>
              {classes.map(k => (
                <option key={k} value={k}>
                  {k.startsWith("Kelas") ? k : `Kelas ${k}`}
                </option>
              ))}
            </select>
            <School
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: DEEP,
                pointerEvents: "none",
              }}
            />
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: MUTED,
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Filter Status Chips */}
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            {/* Semua */}
            <button
              onClick={() => setFilterStatus("semua")}
              style={{
                padding: "8px 14px",
                borderRadius: 16,
                fontSize: 11.5,
                fontWeight: 700,
                fontFamily: PJS,
                background: filterStatus === "semua" ? DEEP : "#FFFFFF",
                color: filterStatus === "semua" ? "#FFFFFF" : MUTED,
                border: filterStatus === "semua" ? "none" : `1px solid ${BDR}`,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
              className="active:scale-95"
            >
              Semua ({totalCount})
            </button>

            {/* Perlu Asesmen */}
            <button
              onClick={() => setFilterStatus("perlu")}
              style={{
                padding: "8px 14px",
                borderRadius: 16,
                fontSize: 11.5,
                fontWeight: 700,
                fontFamily: PJS,
                background: filterStatus === "perlu" ? A : "#FBF1EF",
                color: filterStatus === "perlu" ? "#FFFFFF" : A,
                border: filterStatus === "perlu" ? "none" : "1px solid rgba(210,110,91,0.3)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
              className="active:scale-95"
            >
              Perlu asesmen ({unmappedCount})
            </button>

            {/* Terpetakan */}
            <button
              onClick={() => setFilterStatus("terpetakan")}
              style={{
                padding: "8px 14px",
                borderRadius: 16,
                fontSize: 11.5,
                fontWeight: 700,
                fontFamily: PJS,
                background: filterStatus === "terpetakan" ? DEEP : "#EBF4EE",
                color: filterStatus === "terpetakan" ? "#FFFFFF" : DEEP,
                border: filterStatus === "terpetakan" ? "none" : "1px solid rgba(45,84,62,0.22)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
              className="active:scale-95"
            >
              Terpetakan ({mappedCount})
            </button>
          </div>
        </div>

        {/* ── Class Accordion Grouping (Struktur Mockup dengan Warna Sareh Asih) ── */}
        {Object.keys(groupedByClass).length === 0 ? (
          <div
            style={{
              background: "#FFFFFF",
              border: "1.5px dashed rgba(91, 122, 104, 0.25)",
              borderRadius: 20,
              padding: 32,
              textAlign: "center",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: MUTED }}>
              Tidak ada siswa yang sesuai dengan filter ini.
            </p>
            <button
              onClick={() => {
                setSelectedClass("Semua");
                setFilterStatus("semua");
              }}
              style={{
                marginTop: 12,
                background: DEEP,
                color: "#FFFFFF",
                padding: "8px 16px",
                borderRadius: 12,
                border: "none",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          Object.entries(groupedByClass).map(([kelasName, classStudents]) => {
            const mappedInClass = classStudents.filter(s => s.hasObs);
            const labelKelas = kelasName.startsWith("Kelas") ? kelasName : `Kelas ${kelasName}`;
            const isCollapsed = !!collapsedClasses[kelasName];

            return (
              <div
                key={kelasName}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  border: `1px solid ${BDR}`,
                  boxShadow: "0 2px 8px rgba(91,122,104,0.05)",
                  overflow: "hidden",
                }}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleClassCollapse(kelasName)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    cursor: "pointer",
                    background: "#FAFCFA",
                    borderBottom: isCollapsed ? "none" : `1px solid ${BDR}`,
                  }}
                  className="hover:bg-[#F2F6F3] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        background: "rgba(91, 122, 104, 0.12)",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: DEEP,
                      }}
                    >
                      <School size={16} />
                    </div>
                    <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13.5, color: TEXT }}>
                      {labelKelas}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        background: mappedInClass.length === classStudents.length ? "#EBF4EE" : "#FBF1EF",
                        color: mappedInClass.length === classStudents.length ? DEEP : A,
                        border: mappedInClass.length === classStudents.length ? "1px solid rgba(45,84,62,0.18)" : "1px solid rgba(210,110,91,0.25)",
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: PJS,
                        padding: "3px 10px",
                        borderRadius: 12,
                      }}
                    >
                      {mappedInClass.length}/{classStudents.length} terpetakan
                    </span>
                    {isCollapsed ? (
                      <ChevronDown size={17} style={{ color: MUTED }} />
                    ) : (
                      <ChevronUp size={17} style={{ color: MUTED }} />
                    )}
                  </div>
                </div>

                {/* Students inside class (when expanded) */}
                {!isCollapsed && (
                  <div className="divide-y divide-[rgba(91,122,104,0.08)]">
                    {classStudents.map(s => (
                      <div
                        key={s.id}
                        style={{
                          padding: "14px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          background: s.hasObs ? "#FFFFFF" : "rgba(251, 241, 239, 0.35)",
                        }}
                      >
                        {/* Left: Avatar + Details */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: "50%",
                              overflow: "hidden",
                              background: s.hasObs ? "#EBF4EE" : "#FBF1EF",
                              border: `1.5px solid ${s.hasObs ? "rgba(45,84,62,0.22)" : "rgba(210,110,91,0.28)"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={getAvatarUrl(s)}
                              alt={s.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = "none";
                                if (e.currentTarget.parentElement) {
                                  e.currentTarget.parentElement.innerText = s.name.charAt(0);
                                  e.currentTarget.parentElement.style.fontWeight = "800";
                                  e.currentTarget.parentElement.style.fontSize = "16px";
                                  e.currentTarget.parentElement.style.color = TEXT;
                                }
                              }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              style={{
                                fontFamily: PJS,
                                fontWeight: 800,
                                fontSize: 13.5,
                                color: TEXT,
                                margin: 0,
                                lineHeight: 1.25,
                              }}
                              className="truncate"
                            >
                              {s.name}
                            </p>

                            <p style={{ color: MUTED, fontSize: 11, margin: "2px 0 0", fontFamily: IPS, fontWeight: 500 }} className="truncate">
                              {s.abk}
                            </p>

                            <div className="mt-1.5 flex items-center">
                              {s.hasObs ? (
                                <span
                                  style={{
                                    background: "#EBF4EE",
                                    color: DEEP,
                                    border: "1px solid rgba(45,84,62,0.18)",
                                    fontSize: 10.5,
                                    fontWeight: 700,
                                    fontFamily: PJS,
                                    padding: "2.5px 8px",
                                    borderRadius: 8,
                                    display: "inline-block",
                                  }}
                                >
                                  {s.talent || "Artistic"}
                                </span>
                              ) : (
                                <span
                                  style={{
                                    background: "#FBF1EF",
                                    color: A,
                                    border: "1px solid rgba(210,110,91,0.25)",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    fontFamily: PJS,
                                    padding: "2.5px 8px",
                                    borderRadius: 8,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 3.5,
                                  }}
                                >
                                  <AlertCircle size={11} style={{ color: A }} />
                                  Belum ada asesmen
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Action Buttons (Konsisten Palet Warna Sareh Asih) */}
                        {s.hasObs ? (
                          <button
                            type="button"
                            onClick={() => {
                              onSelect(s.id);
                              go("talent-map-detail");
                            }}
                            style={{
                              background: "#EBF4EE",
                              border: "1px solid rgba(45, 84, 62, 0.22)",
                              borderRadius: 16,
                              padding: "7px 11px",
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                              cursor: "pointer",
                              flexShrink: 0,
                              boxShadow: "0 2px 6px rgba(45, 84, 62, 0.08)",
                              transition: "all 0.15s ease",
                            }}
                            className="active:scale-95 hover:bg-[#DEECE2]"
                          >
                            <BarChart2 size={16} style={{ color: DEEP, flexShrink: 0 }} />
                            <div className="text-left leading-[1.12]">
                              <p style={{ fontSize: 10.5, fontWeight: 700, color: DEEP, fontFamily: PJS, margin: 0 }}>
                                Lihat hasil
                              </p>
                              <p style={{ fontSize: 10.5, fontWeight: 700, color: DEEP, fontFamily: PJS, margin: 0 }}>
                                asesmen
                              </p>
                            </div>
                            <ChevronRight size={13} style={{ color: DEEP, flexShrink: 0 }} strokeWidth={2.5} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onStartObs(s.id)}
                            style={{
                              background: `linear-gradient(135deg, ${A} 0%, #C45F4B 100%)`,
                              border: "none",
                              borderRadius: 16,
                              padding: "9px 13px",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              cursor: "pointer",
                              flexShrink: 0,
                              boxShadow: "0 3px 12px rgba(210, 110, 91, 0.32)",
                              transition: "all 0.15s ease",
                            }}
                            className="active:scale-95 hover:brightness-105"
                          >
                            <Play size={12} style={{ color: "#FFFFFF", fill: "#FFFFFF", flexShrink: 0 }} />
                            <span style={{ fontSize: 11.5, fontWeight: 800, color: "#FFFFFF", fontFamily: PJS, whiteSpace: "nowrap" }}>
                              Mulai asesmen
                            </span>
                            <ChevronRight size={13} style={{ color: "#FFFFFF", flexShrink: 0 }} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
