import { useState } from "react";
import {
  Plus, Calendar, CheckSquare, LayoutGrid, Palette, GraduationCap,
  Lightbulb, MapPin, Tag, Users, ChevronRight, ChevronDown,
} from "lucide-react";
import {
  A, T, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, SBadge, BG,
} from "../ui-kit";
import {
  useStudents, LOMBA, studentCompDetail, type Student,
} from "../data";

import classActivityImg from "@/imports/class_activity.jpg";
import classDrawingImg from "@/imports/class_drawing.jpg";
import classGroupImg from "@/imports/class_group.jpg";

export const AGENDA_PRESETS = [
  { id: "group", label: "Pentas Seni", img: classGroupImg },
  { id: "activity", label: "Olahraga", img: classActivityImg },
  { id: "drawing", label: "Karya Seni", img: classDrawingImg },
];

function formatAgendaDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

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
  agendas,
  onAddAgenda,
}: {
  onStartObs: (id: number) => void;
  agendas: any[];
  onAddAgenda: (a: any) => void;
}) {
  const students = useStudents();
  const withObs = students.filter(s => s.hasObs);
  const [mainTab, setMainTab] = useState<"agenda" | "lomba">("agenda");
  const [lombaCategory, setLombaCategory] = useState<"Semua" | "Seni" | "Olahraga" | "Akademik">("Semua");
  const [expandedLomba, setExpandedLomba] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    type: "sekolah",
    title: "",
    date: "",
    desc: "",
    img: classGroupImg
  });

  const handleSubmit = () => {
    if (!form.title || !form.date) return;
    onAddAgenda({ ...form, id: Date.now() });
    setShowAdd(false);
    setForm({ type: "sekolah", title: "", date: "", desc: "", img: classGroupImg });
  };

  const filteredLomba = LOMBA.filter(l => {
    if (lombaCategory === "Semua") return true;
    return l.category === lombaCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Main Tabs */}
        <div className="flex rounded-2xl p-1.5" style={{ background: "#E5ECE7" }}>
          {(["agenda", "lomba"] as const).map(m => (
            <button key={m} onClick={() => setMainTab(m)}
              style={{
                background: mainTab === m ? "#FFFFFF" : "transparent",
                color: mainTab === m ? "#1B2E24" : "#4D6B58",
                fontFamily: mainTab === m ? PJS : IPS,
                fontWeight: mainTab === m ? 800 : 700,
                fontSize: 13,
                minHeight: 42,
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                boxShadow: mainTab === m ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
              className="flex-1 capitalize">
              {m === "agenda" ? "Agenda Sekolah" : "Rekomendasi Lomba"}
            </button>
          ))}
        </div>

        {mainTab === "agenda" && (
          <div className="space-y-4">
            <button onClick={() => setShowAdd(true)} className="w-full flex items-center justify-center gap-1.5 text-white rounded-2xl py-3.5 text-sm font-bold active:scale-[0.98] transition-transform" style={{ background: A, fontFamily: PJS, boxShadow: "0 6px 20px rgba(210,125,107,0.42)", border: "none", cursor: "pointer" }}>
              <Plus size={16} strokeWidth={2.5} /> Tambah Agenda
            </button>

            {/* ── 2 Kolom Grid Agenda Sekolah dengan Gambar ── */}
            <div className="grid grid-cols-2 gap-3">
              {agendas.length === 0 ? (
                <div className="col-span-2" style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 20, padding: 24, textAlign: "center" }}>
                  <Calendar size={28} style={{ color: MUTED, margin: "0 auto 8px" }} />
                  <p className="text-sm font-semibold" style={{ color: MUTED }}>Belum ada agenda aktif.</p>
                </div>
              ) : (
                agendas.map((a, i) => {
                  const cardImg = a.img || AGENDA_PRESETS[i % AGENDA_PRESETS.length].img;
                  return (
                    <div
                      key={a.id}
                      style={{
                        background: CARD,
                        border: `1.5px solid ${BDR}`,
                        borderRadius: 20,
                        overflow: "hidden",
                        boxShadow: "0 2px 10px rgba(91,122,104,0.06)",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="hover:shadow-md transition-shadow"
                    >
                      {/* Image with Category Badge */}
                      <div style={{ position: "relative", width: "100%", height: 100, background: "#E2E8F0" }}>
                        <img
                          src={cardImg}
                          alt={a.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            background: a.type === "sekolah" ? "#2563EB" : "#EA580C",
                            color: "#FFFFFF",
                            fontSize: 9,
                            fontWeight: 800,
                            fontFamily: PJS,
                            padding: "3px 8px",
                            borderRadius: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                          }}
                        >
                          {a.type === "sekolah" ? "Sekolah" : "Lomba"}
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: "11px 11px 13px", display: "flex", flexDirection: "column", flex: 1 }}>
                        <div className="flex items-center gap-1 mb-1" style={{ color: "#5B7A68" }}>
                          <Calendar size={11} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: 10.5, fontWeight: 700, fontFamily: DMM, color: "#475569" }}>
                            {formatAgendaDate(a.date)}
                          </span>
                        </div>

                        <p
                          style={{
                            fontFamily: PJS,
                            fontWeight: 800,
                            fontSize: 12.5,
                            color: TEXT,
                            lineHeight: 1.3,
                            marginBottom: 4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                          title={a.title}
                        >
                          {a.title}
                        </p>

                        {a.desc && (
                          <p
                            style={{
                              fontSize: 10.5,
                              color: MUTED,
                              lineHeight: 1.35,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              marginTop: "auto",
                              paddingTop: 3,
                            }}
                          >
                            {a.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {mainTab === "lomba" && (
          <div className="space-y-3.5">
            {/* ── Filter Kategori Pills (Semua, Seni, Olahraga, Akademik) ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: "Semua", label: "Semua", icon: <LayoutGrid size={15} strokeWidth={2.2} /> },
                { id: "Seni", label: "Seni", icon: <Palette size={15} strokeWidth={2.2} /> },
                { id: "Olahraga", label: "Olahraga", icon: <RunningManIcon size={15} /> },
                { id: "Akademik", label: "Akademik", icon: <GraduationCap size={15} strokeWidth={2.2} /> },
              ].map(f => {
                const isActive = lombaCategory === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setLombaCategory(f.id as any)}
                    style={{
                      background: isActive ? "#4D6B58" : "#FFFFFF",
                      color: isActive ? "#FFFFFF" : "#334155",
                      border: isActive ? "none" : "1.5px solid #E2E8F0",
                      borderRadius: 16,
                      boxShadow: isActive ? "0 2px 8px rgba(77,107,88,0.22)" : "0 1px 3px rgba(0,0,0,0.02)",
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

            {/* ── Subtitle / Tip Bar ── */}
            <div className="flex items-center gap-2 px-1 text-[11.5px]" style={{ color: "#5B7A68" }}>
              <Lightbulb size={14} className="text-[#5B7A68] flex-shrink-0" strokeWidth={2.2} />
              <span style={{ fontWeight: 500 }}>Ketuk lomba untuk melihat siswa yang direkomendasikan</span>
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
                        <p
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: "#2E3E35",
                            fontFamily: PJS,
                            marginBottom: 8,
                          }}
                        >
                          Siswa yang Direkomendasikan:
                        </p>

                        {matchedStudents.length === 0 ? (
                          <p className="text-xs" style={{ color: MUTED }}>
                            Belum ada siswa yang cocok dengan kriteria lomba ini.
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            {matchedStudents.map((m) => (
                              <div
                                key={m.id}
                                style={{
                                  background: "#FFFFFF",
                                  border: "1px solid #E2ECE5",
                                  borderRadius: 14,
                                  padding: "10px 12px",
                                }}
                                className="flex items-start gap-2.5"
                              >
                                <span className="text-xl leading-none mt-0.5">{m.student.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="font-bold text-xs truncate" style={{ color: TEXT, fontFamily: PJS }}>
                                      {m.student.name}
                                    </p>
                                    <SBadge s={m.status} />
                                  </div>
                                  <p className="text-[10.5px] mt-0.5" style={{ color: MUTED }}>
                                    Cabang: <span className="font-semibold text-[#1F2937]">{m.cabang}</span> · {m.student.kelas}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <div className="h-1.5 flex-1 rounded-full" style={{ background: "#E2E8F0" }}>
                                      <div className="h-full rounded-full" style={{ width: `${m.match}%`, background: "#5B7A68" }} />
                                    </div>
                                    <span className="text-[10px] font-bold" style={{ color: "#5B7A68", fontFamily: DMM }}>{m.match}% cocok</span>
                                  </div>
                                  <p className="text-[10.5px] leading-relaxed mt-1 text-[#475569] bg-[#F4F8F5] rounded-lg p-1.5">
                                    💡 {m.alasan}
                                  </p>
                                </div>
                                {m.status !== "Didaftarkan" && (
                                  <button
                                    type="button"
                                    style={{ background: "#D27D6B", color: "#fff", fontFamily: IPS, minHeight: 28 }}
                                    className="px-2 py-1 rounded-lg text-[10.5px] font-semibold flex items-center gap-1 shrink-0 mt-0.5 active:scale-95"
                                    onClick={() => alert(`Siswa ${m.student.name} berhasil didaftarkan ke ${lomba.k}!`)}
                                  >
                                    <CheckSquare size={11} /> Daftarkan
                                  </button>
                                )}
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
        )}
      </div>

      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg">Tambah Agenda</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Pilih Foto Kegiatan</label>
                <div className="grid grid-cols-3 gap-2">
                  {AGENDA_PRESETS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm({ ...form, img: p.img })}
                      style={{
                        border: form.img === p.img ? `2px solid ${T}` : "1.5px solid #E2E8F0",
                        borderRadius: 12,
                        overflow: "hidden",
                        padding: 2,
                        background: form.img === p.img ? SEC : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <img src={p.img} alt={p.label} style={{ width: "100%", height: 48, objectFit: "cover", borderRadius: 8 }} />
                      <p style={{ fontSize: 9.5, fontWeight: 700, marginTop: 4, marginBottom: 2, color: form.img === p.img ? DEEP : MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Jenis</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none">
                  <option value="sekolah">Agenda Sekolah</option>
                  <option value="lomba">Lomba</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Judul Agenda/Lomba</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Contoh: Lomba FLS2N" className="w-full border rounded-xl px-3 py-2 text-sm outline-none" />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Tanggal</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm outline-none" />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Deskripsi (Opsional)</label>
                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={2} placeholder="Keterangan singkat..." className="w-full border rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm font-semibold border bg-gray-50">Batal</button>
              <button onClick={handleSubmit} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: T }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
