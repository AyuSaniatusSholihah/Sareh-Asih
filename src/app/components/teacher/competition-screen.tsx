import { useState } from "react";
import {
  Calendar, LayoutGrid, Palette, GraduationCap,
  Lightbulb, MapPin, Tag, Users, ChevronRight, ChevronDown, User, UserCheck, Sparkles,
  Wrench, Microscope, Heart, TrendingUp, BookOpen, ChevronLeft,
} from "lucide-react";
import {
  CARD, TEXT, MUTED, BDR, PJS, IPS, DMM, BG, DEEP, A,
} from "../ui-kit";
import {
  useStudents, LOMBA, studentCompDetail, type Student, type Screen,
} from "../data";

// ─── Custom Card Icons matching Mockup ───────────────────────────────
function PaletteMintIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 5C10.82 5 5 10.82 5 18C5 21.8 6.64 25.22 9.25 27.61C10 28.3 11 28.66 12 28.59C13.59 28.49 14.78 27.08 14.61 25.49C14.49 24.37 14.93 23.27 15.76 22.55C16.58 21.83 17.69 21.57 18.76 21.83C21.2 22.45 23.74 20.91 24.29 18.47C24.58 17.19 25.63 16.22 26.93 16.04C28.77 15.79 30.36 17.19 30.44 19.04C30.79 18.7 31 18.36 31 18C31 10.82 25.18 5 18 5Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.2"/>
      <circle cx="11.5" cy="18" r="2.2" fill="#E6F4F1" stroke="#F59E0B" strokeWidth="0.8"/>
      <circle cx="11.5" cy="11.5" r="2" fill="#EF4444" />
      <circle cx="17.5" cy="8.5" r="2" fill="#3B82F6" />
      <circle cx="23.5" cy="10.5" r="2" fill="#10B981" />
      <circle cx="26" cy="15" r="2" fill="#F97316" />
      <path d="M22 28L30 18" stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M30 18L32.2 15.2C32.5 14.8 32.3 14.2 31.8 14.1C31.2 14 30.6 14.4 30.3 14.8L28 17.5" fill="#3B82F6" stroke="#2563EB" strokeWidth="1"/>
      <circle cx="21" cy="29" r="1.4" fill="#3B82F6" />
    </svg>
  );
}

function RunnerBlueIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19H12" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M7 23H14" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="23" cy="8.5" r="3.2" fill="#0284C7" />
      <path d="M19 14.5L23.5 12L28 16" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 13.5L18 20L13 21" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 20L21.5 25L24 30" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 20L15 26" stroke="#84CC16" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GradPurpleIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 7L4 14L18 21L32 14L18 7Z" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M9 16.8V22.5C9 25.5 13 28 18 28C23 28 27 25.5 27 22.5V16.8" fill="#7C3AED" fillOpacity="0.85" stroke="#6D28D9" strokeWidth="1"/>
      <path d="M26 14.5V23" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="26" cy="24" r="1.6" fill="#F59E0B"/>
    </svg>
  );
}

function PalettePeachIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 5C10.82 5 5 10.82 5 18C5 21.8 6.64 25.22 9.25 27.61C10 28.3 11 28.66 12 28.59C13.59 28.49 14.78 27.08 14.61 25.49C14.49 24.37 14.93 23.27 15.76 22.55C16.58 21.83 17.69 21.57 18.76 21.83C21.2 22.45 23.74 20.91 24.29 18.47C24.58 17.19 25.63 16.22 26.93 16.04C28.77 15.79 30.36 17.19 30.44 19.04C30.79 18.7 31 18.36 31 18C31 10.82 25.18 5 18 5Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.2"/>
      <circle cx="11.5" cy="18" r="2.2" fill="#FEF0E6" stroke="#F59E0B" strokeWidth="0.8"/>
      <circle cx="11.5" cy="11.5" r="2" fill="#EF4444" />
      <circle cx="17.5" cy="8.5" r="2" fill="#EC4899" />
      <circle cx="23.5" cy="10.5" r="2" fill="#8B5CF6" />
      <circle cx="26" cy="15" r="2" fill="#F59E0B" />
      <path d="M22 28L30 18" stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M30 18L32.2 15.2C32.5 14.8 32.3 14.2 31.8 14.1C31.2 14 30.6 14.4 30.3 14.8L28 17.5" fill="#EC4899" stroke="#DB2777" strokeWidth="1"/>
      <circle cx="21" cy="29" r="1.4" fill="#EC4899" />
    </svg>
  );
}

function RunningManIcon({ size = 15, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="17" cy="4" r="2" fill={color} stroke="none" />
      <path d="M15 8l-3 4-3-1-3 4" />
      <path d="M12 12l2 4 4 1" />
      <path d="M12 12V8l3-1" />
      <path d="M8 15l-2 5" />
    </svg>
  );
}

export function CompetitionScreen({
  onStartObs,
  onBack,
  go,
}: {
  onStartObs: (id: number) => void;
  onBack?: () => void;
  go?: (s: Screen) => void;
}) {
  const students = useStudents();
  const [lombaCategory, setLombaCategory] = useState<"Semua" | "Realistic" | "Investigative" | "Artistic" | "Social" | "Enterprising" | "Conventional">("Semua");
  const [expandedLomba, setExpandedLomba] = useState<string | null>(null);

  const filteredLomba = LOMBA.filter(l => {
    if (lombaCategory === "Semua") return true;
    return l.category === lombaCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* ── Header dengan tombol kembali ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 12px", flexShrink: 0, borderBottom: `1px solid ${BDR}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {(onBack || go) && (
            <button
              onClick={() => {
                if (onBack) onBack();
                else if (go) go("dashboard");
              }}
              style={{
                width: 36, height: 36, borderRadius: 12,
                background: "rgba(139,176,152,0.14)",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
              className="active:scale-95 transition-transform"
              title="Kembali"
            >
              <ChevronLeft size={18} style={{ color: DEEP }} strokeWidth={2.5} />
            </button>
          )}
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>Agenda Lomba</h1>
            <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "2px 0 0" }}>O2SN · FLS3N · LKSN Diksus</p>
          </div>
        </div>
      </div>
      <div className="px-4 pt-4 pb-6 space-y-4">
        <div className="space-y-3.5">
          {/* ── Filter Kategori Pills (Sticky terkunci saat scroll) ── */}
          <div style={{ position: "sticky", top: 0, zIndex: 20, background: BG, paddingTop: 12, paddingBottom: 10, marginTop: -16, marginBottom: 8, borderBottom: `1px solid ${BDR}40` }}>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar px-1">
              {[
                { id: "Semua",        label: "Semua",        icon: <LayoutGrid    size={14} strokeWidth={2.2} /> },
                { id: "Realistic",    label: "Realistic",    icon: <Wrench        size={14} strokeWidth={2.2} /> },
                { id: "Investigative",label: "Investigasi",  icon: <Microscope    size={14} strokeWidth={2.2} /> },
                { id: "Artistic",     label: "Artistic",     icon: <Palette       size={14} strokeWidth={2.2} /> },
                { id: "Social",       label: "Social",       icon: <Heart         size={14} strokeWidth={2.2} /> },
                { id: "Enterprising", label: "Enterprising", icon: <TrendingUp    size={14} strokeWidth={2.2} /> },
                { id: "Conventional", label: "Conventional", icon: <BookOpen      size={14} strokeWidth={2.2} /> },
              ].map(f => {
                const isActive = lombaCategory === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setLombaCategory(f.id as any)}
                    style={{
                      background: isActive ? "#5B7A68" : "#FFFFFF",
                      color: isActive ? "#FFFFFF" : "#334155",
                      border: isActive ? "none" : "1.5px solid #E2E8F0",
                      borderRadius: 16,
                      boxShadow: isActive ? "0 2px 8px rgba(91,122,104,0.3)" : "0 1px 3px rgba(0,0,0,0.02)",
                      fontFamily: PJS,
                      fontWeight: isActive ? 700 : 600,
                      fontSize: 12.5,
                      padding: "8px 14px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Subtitle / Tip Bar ── */}
          <div className="flex items-center gap-2 px-1 text-[11.5px]" style={{ color: "#5B7A68" }}>
            <Lightbulb size={14} className="text-[#5B7A68] flex-shrink-0" strokeWidth={2.2} />
            <span style={{ fontWeight: 500 }}>Ketuk agenda untuk melihat siswa yang direkomendasikan</span>
          </div>

          {/* ── List Lomba Cards ── */}
          <div className="space-y-3">
            {filteredLomba.map(lomba => {
              const matched = studentCompDetail[lomba.k] ?? [];
              const matchedStudents = matched
                .map(m => ({ ...m, student: students.find(s => s.id === m.id) }))
                .filter((m): m is typeof m & { student: Student } => !!m.student);

              const isExpanded = expandedLomba === lomba.k;

              return (
                <div
                  key={lomba.k}
                  style={{
                    background: "#FFFFFF",
                    border: "1.5px solid #E6ECE8",
                    borderRadius: 22,
                    boxShadow: "0 2px 10px rgba(91,122,104,0.06)",
                    overflow: "hidden",
                  }}
                  className="transition-all hover:shadow-md"
                >
                  {/* Clickable Header */}
                  <div
                    className="p-3.5 cursor-pointer select-none"
                    onClick={() => setExpandedLomba(isExpanded ? null : lomba.k)}
                  >
                    {/* Top Row: Icon + Title/Sub + Badge + Chevron */}
                    <div className="flex items-center gap-3">
                      {/* Illustration Squircle */}
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 18,
                          background: lomba.iconBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {lomba.iconType === "palette-mint" && <PaletteMintIcon />}
                        {lomba.iconType === "runner-blue" && <RunnerBlueIcon />}
                        {lomba.iconType === "grad-purple" && <GradPurpleIcon />}
                        {lomba.iconType === "palette-peach" && <PalettePeachIcon />}
                      </div>

                      {/* Title & Subtitle */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h4
                          style={{
                            fontFamily: PJS,
                            fontWeight: 800,
                            fontSize: 14,
                            color: "#1B2E24",
                            lineHeight: 1.25,
                            marginBottom: 2,
                          }}
                          className="truncate"
                        >
                          {lomba.k}
                        </h4>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#64748B",
                            lineHeight: 1.3,
                            fontWeight: 500,
                          }}
                          className="line-clamp-2"
                        >
                          {lomba.full}
                        </p>
                      </div>

                      {/* Terracotta Badge + Chevron */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div
                          style={{
                            background: "#D27D6B",
                            color: "#FFFFFF",
                            fontFamily: PJS,
                            fontWeight: 700,
                            fontSize: 11,
                            padding: "5px 9px",
                            borderRadius: 9999,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            boxShadow: "0 2px 6px rgba(210,125,107,0.32)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Users size={12} strokeWidth={2.4} />
                          <span>{matchedStudents.length} siswa cocok</span>
                        </div>
                        <div style={{ color: "#374151" }}>
                          {isExpanded ? (
                            <ChevronDown size={17} strokeWidth={2.5} />
                          ) : (
                            <ChevronRight size={17} strokeWidth={2.5} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Meta Row (Date | Level | Category) */}
                    <div
                      className="flex items-center gap-2 mt-3 pt-2.5 text-[11px] font-medium"
                      style={{
                        borderTop: "1px solid #F1F5F3",
                        color: "#4B5563",
                        fontFamily: DMM,
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#5B7A68] stroke-[2.2]" />
                        <span>{lomba.date}</span>
                      </div>

                      <span style={{ color: "#D1D5DB" }}>|</span>

                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#5B7A68] stroke-[2.2]" />
                        <span>{lomba.level}</span>
                      </div>

                      <span style={{ color: "#D1D5DB" }}>|</span>

                      <div className="flex items-center gap-1">
                        <Tag size={12} className="text-[#5B7A68] stroke-[2.2]" />
                        <span>{lomba.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content: Matched Students List */}
                  {isExpanded && (
                    <div
                      style={{
                        borderTop: "1.5px dashed #E2E8F0",
                        background: "#F8FAF9",
                        padding: "12px 14px 14px",
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background: "#E8F2EC",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UserCheck size={15} style={{ color: DEEP }} />
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "#1B2E24",
                            fontFamily: PJS,
                            margin: 0,
                          }}
                        >
                          Siswa yang Direkomendasikan:
                        </p>
                      </div>

                      {matchedStudents.length === 0 ? (
                        <p className="text-sm" style={{ color: MUTED }}>
                          Belum ada siswa yang cocok dengan kriteria agenda ini.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {matchedStudents.map((m) => (
                            <div
                              key={m.id}
                              style={{
                                background: "#FFFFFF",
                                border: "1.5px solid #E2ECE5",
                                borderRadius: 16,
                                padding: "12px 14px",
                              }}
                              className="shadow-xs"
                            >
                              {/* Header: Profile Icon + Nama + Kelas */}
                              <div className="flex items-center gap-2.5 mb-1.5">
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: m.student.gender === "L" ? "#EBF4EE" : "#FBF1EF",
                                    border: `1.5px solid ${m.student.gender === "L" ? "rgba(45,84,62,0.22)" : "rgba(210,110,91,0.28)"}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <User size={16} style={{ color: m.student.gender === "L" ? "#3D7A5E" : "#C0603A" }} />
                                </div>
                                <p
                                  style={{
                                    color: TEXT,
                                    fontFamily: PJS,
                                    fontSize: 14,
                                    fontWeight: 800,
                                  }}
                                  className="truncate flex-1"
                                >
                                  {m.student.name}
                                </p>
                                <span className="text-[12px] font-semibold text-[#64748B]">
                                  {m.student.kelas}
                                </span>
                              </div>

                              <p className="text-[12.5px] mb-2" style={{ color: "#475569" }}>
                                Cabang: <span className="font-bold text-[#1E293B]">{m.cabang}</span>
                              </p>

                              {/* Bilah Kecocokan Full Width ke Kiri */}
                              <div className="flex items-center gap-2.5 mb-2.5">
                                <div className="h-2 flex-1 rounded-full" style={{ background: "#E2E8F0" }}>
                                  <div className="h-full rounded-full" style={{ width: `${m.match}%`, background: "#5B7A68" }} />
                                </div>
                                <span className="text-[12px] font-extrabold flex-shrink-0" style={{ color: "#2E3E35", fontFamily: DMM }}>
                                  {m.match}% cocok
                                </span>
                              </div>

                              {/* Kotak Alasan Full Width */}
                              <p
                                style={{
                                  fontSize: 12,
                                  lineHeight: 1.5,
                                  color: "#334155",
                                  background: "#F4F8F5",
                                  borderRadius: 10,
                                  padding: "9px 12px",
                                  margin: 0,
                                }}
                              >
                                💡 {m.alasan}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
