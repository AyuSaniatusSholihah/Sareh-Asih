import React, { useState, useEffect } from "react";
import {
  Bell, FileText, CheckCircle, CheckCircle2, Star, Lightbulb, MessageCircle, X, ChevronRight, CheckCheck,
  Heart, Sparkles, User, ThumbsUp, ArrowRight,
} from "lucide-react";
import {
  CARD, BG, TEXT, MUTED, DEEP, T, A, BDR, PJS, IPS, DMM,
} from "../ui-kit";
import { type LaporanKirim, type Student, type Screen, type Role } from "../data";

export interface ParentNotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  laporan?: LaporanKirim[];
  child?: Student | null;
  students?: Student[];
  onBaca?: (id: number) => void;
  onGo: (s: Screen) => void;
  onSelectStudent?: (id: number) => void;
}

interface TanggapanOrtu {
  id: string;
  studentId: number;
  studentName: string;
  studentClass: string;
  parentName: string;
  terkirimKe: string;
  reaksiList: string[];
  keselarasan: string;
  keselarasanIcon: string;
  catatan: string;
  waktu: string;
  read: boolean;
}

const INITIAL_TANGGAPAN_ORTU: TanggapanOrtu[] = [
  {
    id: "tanggapan-rafi-1",
    studentId: 1,
    studentName: "Rafi Pratama",
    studentClass: "Kelas VI A (Tunanetra)",
    parentName: "Ibu Ani Rahmawati",
    terkirimKe: "Bu Sari",
    reaksiList: [
      "🌟 Sangat Membanggakan",
      "🏡 Sesuai di Rumah",
      "💡 Butuh Tips Guru",
      "🗨️ Ingin Diskusi",
    ],
    keselarasan: "Sangat Sesuai",
    keselarasanIcon: "✨",
    catatan: "Di rumah Rafi sudah bisa mandiri saat merapikan alat musik dan perlengkapan keyboard-nya. Masih butuh bantuan atau sering lupa saat merapikan seragam dan menyiapkan buku besok harinya.",
    waktu: "16 Okt 2026 · 14.13 WIB",
    read: false,
  },
  {
    id: "tanggapan-dimas-2",
    studentId: 2,
    studentName: "Dimas Bagas",
    studentClass: "Kelas VI A (Tunagrahita)",
    parentName: "Bapak Hendra Saputra",
    terkirimKe: "Bu Sari",
    reaksiList: [
      "🌟 Sangat Membanggakan",
      "🏡 Sesuai di Rumah",
      "💪 Perlu Latihan Lagi",
    ],
    keselarasan: "Cukup Sesuai",
    keselarasanIcon: "👍",
    catatan: "Di rumah Dimas sudah bisa mandiri saat makan sendiri dan merapikan sendok piring. Masih butuh bantuan atau sering lupa saat mencuci tangan setelah beraktivitas.",
    waktu: "15 Okt 2026 · 10.25 WIB",
    read: false,
  },
  {
    id: "tanggapan-aisyah-3",
    studentId: 3,
    studentName: "Siti Aisyah",
    studentClass: "Kelas VI A (Tunarungu)",
    parentName: "Ibu Siti Maryam",
    terkirimKe: "Bu Sari",
    reaksiList: [
      "🌟 Sangat Membanggakan",
      "🏡 Sesuai di Rumah",
    ],
    keselarasan: "Sangat Sesuai",
    keselarasanIcon: "✨",
    catatan: "Hasil pemetaan minat kriya dan boga sangat tepat. Di rumah Aisyah sangat antusias saat praktik merangkai manik-manik dan membantu di dapur.",
    waktu: "14 Okt 2026 · 15.50 WIB",
    read: true,
  },
  {
    id: "tanggapan-budi-4",
    studentId: 4,
    studentName: "Budi Santoso",
    studentClass: "Kelas VI A (Tunanetra)",
    parentName: "Bapak Joko Susilo",
    terkirimKe: "Bu Sari",
    reaksiList: [
      "🏡 Sesuai di Rumah",
      "💡 Butuh Tips Guru",
    ],
    keselarasan: "Cukup Sesuai",
    keselarasanIcon: "👍",
    catatan: "Masih butuh bantuan atau sering ragu saat orientasi jalan di halaman rumah. Kami memohon tips stimulasi tambahan dari Bu Sari.",
    waktu: "13 Okt 2026 · 08.40 WIB",
    read: true,
  },
  {
    id: "tanggapan-putri-5",
    studentId: 5,
    studentName: "Putri Ayu",
    studentClass: "Kelas VI A (Autisme)",
    parentName: "Ibu Dewi Lestari",
    terkirimKe: "Bu Sari",
    reaksiList: [
      "🏡 Sesuai di Rumah",
      "🗨️ Ingin Diskusi",
    ],
    keselarasan: "Ada Perbedaan",
    keselarasanIcon: "🌱",
    catatan: "Panduan rutinitas visual di rumah cukup membantu. Namun ada perbedaan saat suara bising muncul, Putri masih sering cemas. Kami ingin berdiskusi di waktu luang Bu Guru.",
    waktu: "12 Okt 2026 · 15.10 WIB",
    read: true,
  },
];

export function ParentNotificationSheet({
  isOpen,
  onClose,
  role,
  laporan = [],
  child,
  students = [],
  onBaca,
  onGo,
  onSelectStudent,
}: ParentNotificationSheetProps) {
  const isGuru = role === "guru";

  // Filter state for Guru
  const [filterGuru, setFilterGuru] = useState<"semua" | "unread" | "diskusi" | "catatan">("semua");
  const [tanggapanList, setTanggapanList] = useState<TanggapanOrtu[]>(INITIAL_TANGGAPAN_ORTU);

  // Filter state for Ortu
  const [filterOrtu, setFilterOrtu] = useState<"semua" | "feedback" | "asesmen">("semua");

  // Dynamic check for feedback saved in localStorage by parent
  useEffect(() => {
    if (!isGuru) return;
    try {
      const dynamicItems: TanggapanOrtu[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("sareh_parent_feedback_")) {
          const val = localStorage.getItem(key);
          if (val) {
            const parsed = JSON.parse(val);
            const parts = key.split("_");
            const cId = parseInt(parts[3] || "1", 10);
            const std = students.find((s) => s.id === cId) || {
              name: "Rafi Pratama",
              kelas: "Kelas VI A (Tunanetra)",
            };
            dynamicItems.push({
              id: key,
              studentId: cId,
              studentName: std.name,
              studentClass: std.kelas || "Kelas VI A",
              parentName: "Ibu Ani Rahmawati",
              terkirimKe: "Bu Sari",
              reaksiList: Array.isArray(parsed.reaksi) && parsed.reaksi.length > 0
                ? parsed.reaksi
                : ["🌟 Sangat Membanggakan", "🏡 Sesuai di Rumah"],
              keselarasan: parsed.keselarasan || "Sangat Sesuai",
              keselarasanIcon: parsed.keselarasan === "Sangat Sesuai" ? "✨" : parsed.keselarasan === "Cukup Sesuai" ? "👍" : "🌱",
              catatan: parsed.catatan || "",
              waktu: parsed.waktu || "Baru saja",
              read: false,
            });
          }
        }
      }
      if (dynamicItems.length > 0) {
        setTanggapanList((prev) => {
          const nonDynamic = prev.filter((p) => !p.id.startsWith("sareh_parent_feedback_"));
          return [...dynamicItems, ...nonDynamic];
        });
      }
    } catch (e) {
      // ignore
    }
  }, [isGuru, students]);

  if (!isOpen) return null;

  // ─────────────────────────────────────────────────────────────
  // GURU VIEW: TANGGAPAN DARI ORANG TUA
  // ─────────────────────────────────────────────────────────────
  if (isGuru) {
    const unreadCount = tanggapanList.filter((item) => !item.read).length;

    const filteredTanggapan = tanggapanList.filter((item) => {
      if (filterGuru === "semua") return true;
      if (filterGuru === "unread") return !item.read;
      if (filterGuru === "diskusi") {
        return item.reaksiList.some(r => r.includes("Diskusi") || r.includes("Tips"));
      }
      if (filterGuru === "catatan") {
        return !!item.catatan && item.catatan.trim().length > 0;
      }
      return true;
    });

    const handleMarkAllReadGuru = () => {
      setTanggapanList((prev) => prev.map((item) => ({ ...item, read: true })));
    };

    const handleItemClick = (item: TanggapanOrtu) => {
      setTanggapanList((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, read: true } : i))
      );
      onClose();
      if (onSelectStudent) {
        onSelectStudent(item.studentId);
      }
      onGo("profile");
    };

    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(22, 38, 29, 0.48)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 85,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "26px 26px 0 0",
            padding: "16px 20px 24px",
            maxHeight: "90%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.16)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Drag Handle */}
          <div style={{ width: 38, height: 4, borderRadius: 2, background: "#CBD5E1", margin: "0 auto 12px" }} />

          {/* Modal Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: TEXT, margin: 0 }}>
                  Tanggapan Orang Tua
                </h2>
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: "#FFE4E6",
                      color: "#E11D48",
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 999,
                      border: "1px solid rgba(225, 29, 72, 0.25)",
                      fontFamily: PJS,
                    }}
                  >
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "3px 0 0" }}>
                Umpan balik, reaksi, &amp; pengamatan orang tua dari rumah
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#F1F5F9",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
                flexShrink: 0,
              }}
              className="active:scale-90 transition-transform"
              title="Tutup"
            >
              <X size={17} strokeWidth={2.4} />
            </button>
          </div>

          {/* Filter Tabs & Mark All Read */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }} className="no-scrollbar">
              {(
                [
                  { id: "semua", label: "Semua" },
                  { id: "unread", label: "Belum Dibaca" },
                  { id: "catatan", label: "Catatan Rumah" },
                  { id: "diskusi", label: "Diskusi & Tips" },
                ] as const
              ).map((t) => {
                const active = filterGuru === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFilterGuru(t.id)}
                    style={{
                      padding: "5px 11px",
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 700,
                      fontFamily: PJS,
                      whiteSpace: "nowrap",
                      border: active ? "1.5px solid #5B7A68" : "1.5px solid #E2E8F0",
                      background: active ? "#5B7A68" : "#FFFFFF",
                      color: active ? "#FFFFFF" : "#64748B",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    className="active:scale-95"
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllReadGuru}
                style={{
                  background: "none",
                  border: "none",
                  color: DEEP,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: PJS,
                  cursor: "pointer",
                  padding: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <CheckCheck size={13} strokeWidth={2.4} /> Baca Semua
              </button>
            )}
          </div>

          {/* Tanggapan List (Scrollable) */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 2 }} className="no-scrollbar">
            {filteredTanggapan.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: MUTED }}>
                <Heart size={32} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, margin: 0 }}>Belum ada tanggapan</p>
                <p style={{ fontFamily: IPS, fontSize: 11.5, margin: "2px 0 0" }}>Tanggapan orang tua murid akan muncul di sini.</p>
              </div>
            ) : (
              filteredTanggapan.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    width: "100%",
                    background: item.read ? "#FFFFFF" : "#FAFCFA",
                    border: item.read ? "1.5px solid #E2E8F0" : "1.5px solid #A8CBB5",
                    borderRadius: 20,
                    padding: "16px 15px",
                    boxShadow: item.read ? "0 2px 8px rgba(0,0,0,0.03)" : "0 4px 16px rgba(46,94,67,0.09)",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  className="active:scale-[0.99] hover:border-[#5B7A68]"
                >
                  {/* Top Gradient Stripe */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: item.read
                        ? "linear-gradient(90deg, #94A3B8, #CBD5E1)"
                        : "linear-gradient(90deg, #5B7A68, #2E5E43, #8BB098)",
                    }}
                  />

                  {/* Header Box inside Card */}
                  <div className="flex items-start justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: item.read ? "#F1F5F9" : "#E8F4EC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle size={19} style={{ color: item.read ? "#64748B" : "#2E5E43" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                            {item.parentName}
                          </p>
                          {!item.read && (
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "#E11D48",
                                display: "inline-block",
                                flexShrink: 0,
                              }}
                              title="Belum dibaca"
                            />
                          )}
                        </div>
                        <p style={{ fontFamily: IPS, fontSize: 11, color: item.read ? MUTED : "#2E5E43", margin: "2px 0 0", fontWeight: 600 }}>
                          ✓ Terkirim ke {item.terkirimKe} · Siswa: {item.studentName}
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        background: item.read ? "#F1F5F9" : "#E8F4EC",
                        color: item.read ? "#64748B" : "#2E5E43",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 999,
                        border: `1px solid ${item.read ? "#E2E8F0" : "rgba(46,94,67,0.2)"}`,
                        whiteSpace: "nowrap",
                        fontFamily: PJS,
                        flexShrink: 0,
                      }}
                    >
                      Feedback Orang Tua
                    </span>
                  </div>

                  {/* 1. REAKSI ANDA (Reaksi Orang Tua) */}
                  <div className="mb-2.5">
                    <p style={{ fontFamily: PJS, fontSize: 10.5, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 5px" }}>
                      Reaksi Orang Tua:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.reaksiList.map((r, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#F4F8F5",
                            border: "1px solid #CBE0D3",
                            color: "#1E3E2E",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 10,
                            fontFamily: PJS,
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2. Kesesuaian dengan Kebiasaan di Rumah */}
                  <div className="mb-2.5 flex items-center gap-2 p-2 rounded-xl" style={{ background: "#F8FAF8", border: `1px solid ${BDR}` }}>
                    <span style={{ fontSize: 16 }}>
                      {item.keselarasanIcon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, display: "block" }}>
                        Kesesuaian dengan Kebiasaan di Rumah
                      </span>
                      <span style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT }}>
                        {item.keselarasan}
                      </span>
                    </div>
                  </div>

                  {/* 3. Catatan Pengamatan Orang Tua */}
                  {item.catatan && (
                    <div className="mb-3 p-2.5 rounded-xl" style={{ background: "#F9FBF9", borderLeft: "3.5px solid #5B7A68" }}>
                      <p style={{ fontFamily: PJS, fontSize: 10.5, fontWeight: 700, color: MUTED, margin: "0 0 3px" }}>
                        Catatan Pengamatan Orang Tua:
                      </p>
                      <p style={{ fontFamily: IPS, fontSize: 12, color: TEXT, lineHeight: 1.45, margin: 0, fontStyle: "italic" }}>
                        "{item.catatan}"
                      </p>
                    </div>
                  )}

                  {/* Bottom: Waktu Terkirim & Action Link */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                    <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: 0 }}>
                      Terkirim: {item.waktu}
                    </p>
                    <span
                      style={{
                        fontFamily: PJS,
                        fontSize: 11,
                        fontWeight: 700,
                        color: DEEP,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      Buka Profil Siswa <ArrowRight size={13} strokeWidth={2.4} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ORANG TUA VIEW: FEEDBACK & LAPORAN DARI GURU
  // ─────────────────────────────────────────────────────────────
  const childName = child ? child.name.split(" ")[0] : "Anak";
  const teacherName = child?.teacher || "Ibu Sari";

  // Build notification items for parent
  const items = [
    // 1. Laporan / Catatan Perkembangan dari Guru
    ...laporan.map((l) => ({
      id: `laporan-${l.id}`,
      type: "feedback" as const,
      tag: "Catatan Guru",
      title: l.judul,
      desc: l.isi,
      date: l.dikirimPada,
      read: l.dibaca,
      icon: FileText,
      iconBg: "#E8F4EC",
      iconColor: "#246E44",
      action: () => {
        if (onBaca) onBaca(l.id);
        onClose();
        onGo("riwayat-laporan");
      },
    })),

    // 2. Notifikasi Hasil Asesmen
    {
      id: "notif-asesmen-1",
      type: "asesmen" as const,
      tag: "Asesmen Selesai",
      title: `Pemetaan Bakat & Minat ${childName}`,
      desc: `${teacherName} telah menyelesaikan observasi minat (RIASEC) dan tingkat kemandirian fungsional periode Semester 1.`,
      date: "12 Agu 2026",
      read: true,
      icon: Star,
      iconBg: "#FDF8E8",
      iconColor: "#B78A14",
      action: () => {
        onClose();
        onGo("parent-detail");
      },
    },

    // 3. Notifikasi Saran Pendampingan Rumah
    {
      id: "notif-saran-1",
      type: "feedback" as const,
      tag: "Saran Pendampingan",
      title: `Stimulasi Mandiri di Rumah untuk ${childName}`,
      desc: `Rekomendasi aktivitas dari guru: Latih komunikasi dua arah dan beri waktu mandiri saat merapikan peralatan gambar.`,
      date: "Hari ini",
      read: false,
      icon: Lightbulb,
      iconBg: "#FFF3EB",
      iconColor: "#B8583B",
      action: () => {
        onClose();
        onGo("saran-rumah");
      },
    },
  ];

  const filteredItems = items.filter((item) => {
    if (filterOrtu === "semua") return true;
    return item.type === filterOrtu;
  });

  const unreadCount = items.filter((i) => !i.read).length;

  const handleMarkAllRead = () => {
    if (onBaca) {
      laporan.forEach((l) => {
        if (!l.dibaca) onBaca(l.id);
      });
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(22, 38, 29, 0.48)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 85,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "26px 26px 0 0",
          padding: "16px 20px 24px",
          maxHeight: "88%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.16)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drag Handle */}
        <div style={{ width: 38, height: 4, borderRadius: 2, background: "#CBD5E1", margin: "0 auto 12px" }} />

        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: TEXT, margin: 0 }}>
                Notifikasi Feedback Guru
              </h2>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "#FCE7E4",
                    color: "#B54A3B",
                    fontSize: 10.5,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid rgba(181, 74, 59, 0.25)",
                    fontFamily: PJS,
                  }}
                >
                  {unreadCount} Baru
                </span>
              )}
            </div>
            <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "3px 0 0" }}>
              Pembaruan perkembangan, laporan, &amp; saran dari {teacherName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#F1F5F9",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748B",
              flexShrink: 0,
            }}
            className="active:scale-90 transition-transform"
            title="Tutup"
          >
            <X size={17} strokeWidth={2.4} />
          </button>
        </div>

        {/* Filter Tabs & Mark All Read */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(
              [
                { id: "semua", label: "Semua" },
                { id: "feedback", label: "Feedback & Catatan" },
                { id: "asesmen", label: "Asesmen" },
              ] as const
            ).map((t) => {
              const active = filterOrtu === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFilterOrtu(t.id)}
                  style={{
                    padding: "5px 11px",
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 700,
                    fontFamily: PJS,
                    border: active ? "1.5px solid #5B7A68" : "1.5px solid #E2E8F0",
                    background: active ? "#5B7A68" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#64748B",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  className="active:scale-95"
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              style={{
                background: "none",
                border: "none",
                color: DEEP,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: PJS,
                cursor: "pointer",
                padding: "2px 4px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <CheckCheck size={13} strokeWidth={2.4} /> Baca Semua
            </button>
          )}
        </div>

        {/* Notification List (Scrollable) */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 2 }} className="no-scrollbar">
          {filteredItems.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: MUTED }}>
              <Bell size={32} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
              <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, margin: 0 }}>Belum ada notifikasi</p>
              <p style={{ fontFamily: IPS, fontSize: 11.5, margin: "2px 0 0" }}>Feedback baru dari guru akan muncul di sini.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: item.read ? "#F9FBF9" : "#FFFFFF",
                    border: item.read ? "1px solid #E6EEE8" : "1.5px solid #BCDBC7",
                    borderRadius: 16,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    cursor: "pointer",
                    position: "relative",
                    boxShadow: item.read ? "none" : "0 3px 12px rgba(91, 122, 104, 0.08)",
                    transition: "all 0.15s ease",
                  }}
                  className="active:scale-[0.99] hover:border-[#5B7A68]"
                >
                  {/* Icon Box */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: item.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <IconComp size={20} style={{ color: item.iconColor }} strokeWidth={2.2} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: 6,
                          background: item.iconBg,
                          color: item.iconColor,
                          fontFamily: PJS,
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {item.tag}
                      </span>
                      <span style={{ fontSize: 10.5, color: MUTED, fontFamily: IPS }}>{item.date}</span>
                    </div>

                    <p
                      style={{
                        fontFamily: PJS,
                        fontSize: 13.5,
                        fontWeight: item.read ? 700 : 800,
                        color: TEXT,
                        margin: "0 0 3px",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </p>

                    <p
                      style={{
                        fontFamily: IPS,
                        fontSize: 12,
                        color: "#5C7667",
                        margin: 0,
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  {/* Unread dot or chevron */}
                  <div style={{ display: "flex", alignItems: "center", alignSelf: "center", marginLeft: 4 }}>
                    {!item.read ? (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#B54A3B",
                          display: "inline-block",
                        }}
                        title="Belum dibaca"
                      />
                    ) : (
                      <ChevronRight size={16} style={{ color: "#94A3B8" }} />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
