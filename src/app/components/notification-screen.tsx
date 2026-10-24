import React, { useState, useEffect } from "react";
import {
  ChevronLeft, Clock, Crosshair, CheckCheck, MessageCircle, FileText,
  Star, Lightbulb, X, ArrowUpRight, CheckCircle, ArrowRight, Heart,
  ChevronDown, ChevronUp, Key, AlertCircle, ClipboardList,
} from "lucide-react";
import {
  BG, CARD, TEXT, MUTED, DEEP, T, A, BDR, PJS, IPS,
} from "./ui-kit";
import { type LaporanKirim, type Student, type Screen, type Role } from "./data";

export interface NotificationScreenProps {
  onBack: () => void;
  role?: Role | null;
  students?: Student[];
  laporan?: LaporanKirim[];
  child?: Student | null;
  onBaca: (id: number) => void;
  onGo: (s: Screen) => void;
  onSelectStudent?: (id: number) => void;
  teacherName?: string;
}

export type TeacherNotifType = "tanggapan" | "asesmen_pending" | "kode_ortu" | "laporan_draft";

export interface TeacherNotifItem {
  id: string;
  type: TeacherNotifType;
  studentId?: number;
  studentName?: string;
  studentClass?: string;
  parentName?: string;
  terkirimKe?: string;
  title: string;
  subtitle: string;
  primaryBadge: string;
  extraBadgeCount?: number;
  reaksiList?: string[];
  keselarasan?: string;
  keselarasanIcon?: string;
  catatan?: string;
  summary: string;
  fullDesc?: string;
  waktu: string;
  timeAgo: string;
  dateSection: "Hari Ini" | "Sebelumnya";
  read: boolean;
  actionText?: string;
  actionScreen?: Screen;
}

interface ParentNotifItem {
  id: string;
  laporanId?: number;
  type: "laporan" | "catatan" | "asesmen" | "saran";
  title: string;
  desc: string;
  timeAgo: string;
  dateSection: "Hari Ini" | "Sebelumnya";
  read: boolean;
  actionScreen?: Screen;
}

const DEFAULT_TEACHER_NOTIFS: TeacherNotifItem[] = [
  // 1. Tanggapan Masuk dari Ibu Ani (Rafi) - Match screenshot
  {
    id: "tanggapan-rafi-1",
    type: "tanggapan",
    studentId: 1,
    studentName: "Rafi",
    studentClass: "Kelas VII A",
    parentName: "Ibu Ani Rahmawati",
    terkirimKe: "Bu Sari",
    title: "Ibu Ani Rahmawati",
    subtitle: "Terkirim ke Bu Sari · Siswa: Rafi",
    primaryBadge: "✨ Sangat Membanggakan",
    extraBadgeCount: 3,
    reaksiList: [
      "✨ Sangat Membanggakan",
      "🏡 Sesuai di Rumah",
      "💡 Butuh Tips Guru",
      "🗨️ Ingin Diskusi",
    ],
    keselarasan: "Sangat Sesuai",
    keselarasanIcon: "✨",
    catatan: "Di rumah Rafi sudah bisa mandiri saat merapikan alat musik dan perlengkapan keyboard-nya. Masih butuh bantuan atau sering lupa saat merapikan seragam dan menyiapkan buku besok harinya.",
    summary: "“Di rumah Rafi sudah bisa mandiri saat...”",
    waktu: "16 Okt 2026 · 14.13 WIB",
    timeAgo: "10 menit yang lalu",
    dateSection: "Hari Ini",
    read: false,
    actionText: "Buka Profil Rafi",
  },
  // 2. Kode akses orang tua belum dibuat (Aktivitas Guru)
  {
    id: "notif-kode-dina-2",
    type: "kode_ortu",
    studentId: 4,
    studentName: "Dina Maharani",
    studentClass: "Kelas VII B",
    parentName: "Ibu Dewi",
    title: "Kode Akses Orang Tua Belum Dibuat",
    subtitle: "Siswa: Dina Maharani · Orang tua belum terhubung",
    primaryBadge: "🔑 Kode Akses Belum Ada",
    summary: "Kode akses untuk wali murid Dina Maharani (Ibu Dewi) belum dibuat.",
    fullDesc: "Wali murid Dina Maharani (Ibu Dewi) belum dapat terhubung ke ruang pantau perkembangan anak. Buat kode akses di tab profil siswa agar orang tua dapat melihat laporan berkala.",
    waktu: "16 Okt 2026 · 11.20 WIB",
    timeAgo: "3 jam yang lalu",
    dateSection: "Hari Ini",
    read: false,
    actionText: "Buat Kode Akses",
  },
  // 3. Asesmen belum selesai (Aktivitas Guru)
  {
    id: "notif-asesmen-arga-3",
    type: "asesmen_pending",
    studentId: 3,
    studentName: "Arga Saputra",
    studentClass: "Kelas VII A",
    title: "Asesmen Minat & Fungsional Belum Selesai",
    subtitle: "Siswa: Arga Saputra · Observasi belum dimulai",
    primaryBadge: "⚠️ Perlu Asesmen",
    summary: "Observasi Tahap 1 (Fungsional) & Minat RIASEC belum dinilai untuk Arga.",
    fullDesc: "Siswa Arga Saputra belum memiliki catatan pemetaan minat dan kemandirian fungsional. Mulai observasi agar grafik potensi dan rekomendasi lomba/kejuruan dapat terbentuk.",
    waktu: "16 Okt 2026 · 08.45 WIB",
    timeAgo: "5 jam yang lalu",
    dateSection: "Hari Ini",
    read: false,
    actionText: "Mulai Asesmen Arga",
    actionScreen: "observation",
  },
  // 4. Tanggapan Masuk dari Bapak Hendra (Dimas)
  {
    id: "tanggapan-dimas-4",
    type: "tanggapan",
    studentId: 2,
    studentName: "Nisa Aulia",
    studentClass: "Kelas VII A",
    parentName: "Bapak Haris (Wali Nisa)",
    terkirimKe: "Bu Sari",
    title: "Bapak Haris",
    subtitle: "Terkirim ke Bu Sari · Siswa: Nisa Aulia",
    primaryBadge: "🏡 Sesuai di Rumah",
    extraBadgeCount: 2,
    reaksiList: [
      "🏡 Sesuai di Rumah",
      "🌟 Sangat Membanggakan",
      "💪 Perlu Latihan Lagi",
    ],
    keselarasan: "Cukup Sesuai",
    keselarasanIcon: "👍",
    catatan: "Di rumah Nisa sudah mulai mandiri saat merapikan perlengkapan menggambar dan kuas cat airnya. Masih butuh latihan saat menyiapkan palet warna.",
    summary: "“Di rumah Nisa sudah mulai mandiri saat merapikan...”",
    waktu: "15 Okt 2026 · 16.30 WIB",
    timeAgo: "Kemarin",
    dateSection: "Sebelumnya",
    read: true,
    actionText: "Buka Profil Nisa",
  },
  // 5. Laporan Draf Siap Dikirim (Aktivitas Guru)
  {
    id: "notif-laporan-budi-5",
    type: "laporan_draft",
    studentId: 5,
    studentName: "Budi Santoso",
    studentClass: "Kelas VII B",
    title: "Laporan Semester 1 Siap Dikirim",
    subtitle: "Siswa: Budi Santoso · Draf selesai",
    primaryBadge: "📄 Draf Laporan Siap",
    summary: "Rangkuman hasil observasi dan kemandirian Budi Santoso siap ditinjau.",
    fullDesc: "Laporan hasil pemetaan potensi dan catatan observasi bulanan untuk Budi Santoso telah rampung disusun. Tinjau kembali dan kirimkan kepada wali murid (Bapak Joko).",
    waktu: "14 Okt 2026 · 10.15 WIB",
    timeAgo: "2 hari yang lalu",
    dateSection: "Sebelumnya",
    read: true,
    actionText: "Tinjau & Kirim Laporan",
    actionScreen: "report",
  },
];

export function NotificationScreen({
  onBack,
  role = "guru",
  students = [],
  laporan = [],
  child,
  onBaca,
  onGo,
  onSelectStudent,
  teacherName = "Bu Sari",
}: NotificationScreenProps) {
  const isGuru = role === "guru";

  const [filter, setFilter] = useState<"semua" | "unread" | "tanggapan" | "tugas">("semua");

  // Expanded card state (card IDs that are open)
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // State for Teacher Notifications
  const [teacherNotifs, setTeacherNotifs] = useState<TeacherNotifItem[]>(DEFAULT_TEACHER_NOTIFS);

  // State for Parent Notifications
  const [parentNotifs, setParentNotifs] = useState<ParentNotifItem[]>([]);
  const [activeParentDetail, setActiveParentDetail] = useState<ParentNotifItem | null>(null);

  // Read dynamic submissions from localStorage for teacher
  useEffect(() => {
    if (!isGuru) return;
    try {
      const dynamicItems: TeacherNotifItem[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("sareh_parent_feedback_")) {
          const val = localStorage.getItem(key);
          if (val) {
            const parsed = JSON.parse(val);
            const parts = key.split("_");
            const cId = parseInt(parts[3] || "1", 10);
            const std = students.find((s) => s.id === cId) || {
              name: "Rafi",
              kelas: "Kelas VII A",
            };
            const rList = Array.isArray(parsed.reaksi) && parsed.reaksi.length > 0
              ? parsed.reaksi
              : ["✨ Sangat Membanggakan", "🏡 Sesuai di Rumah"];
            dynamicItems.push({
              id: key,
              type: "tanggapan",
              studentId: cId,
              studentName: std.name,
              studentClass: std.kelas || "Kelas VII A",
              parentName: "Ibu Ani Rahmawati",
              terkirimKe: "Bu Sari",
              title: "Ibu Ani Rahmawati",
              subtitle: `Terkirim ke Bu Sari · Siswa: ${std.name}`,
              primaryBadge: rList[0] || "✨ Sangat Membanggakan",
              extraBadgeCount: rList.length > 1 ? rList.length - 1 : 0,
              reaksiList: rList,
              keselarasan: parsed.keselarasan || "Sangat Sesuai",
              keselarasanIcon: parsed.keselarasan === "Sangat Sesuai" ? "✨" : parsed.keselarasan === "Cukup Sesuai" ? "👍" : "🌱",
              catatan: parsed.catatan || "",
              summary: parsed.catatan
                ? `“${parsed.catatan.substring(0, 36)}...”`
                : "“Tanggapan orang tua baru saja dikirimkan...”",
              waktu: parsed.waktu || "16 Okt 2026 · Baru saja",
              timeAgo: "Baru saja",
              dateSection: "Hari Ini",
              read: false,
              actionText: `Buka Profil ${std.name}`,
            });
          }
        }
      }
      if (dynamicItems.length > 0) {
        setTeacherNotifs((prev) => {
          const nonDynamic = prev.filter((p) => !p.id.startsWith("sareh_parent_feedback_"));
          return [...dynamicItems, ...nonDynamic];
        });
      }
    } catch (e) {
      // ignore
    }
  }, [isGuru, students]);

  // Initial parent items
  useEffect(() => {
    if (isGuru) return;
    const childName = child ? child.name.split(" ")[0] : "adik Nisa";
    const tName = child?.teacher || teacherName;
    const items: ParentNotifItem[] = [
      ...laporan.map((l, idx) => ({
        id: `lap-${l.id}`,
        laporanId: l.id,
        type: "laporan" as const,
        title: l.judul || "Laporan perkembangan",
        desc: l.isi || `${tName} membagikan perkembangan belajar ${childName}`,
        timeAgo: idx === 0 ? "10 menit yang lalu" : l.dikirimPada,
        dateSection: idx === 0 ? ("Hari Ini" as const) : ("Sebelumnya" as const),
        read: l.dibaca,
        actionScreen: "riwayat-laporan" as Screen,
      })),
      {
        id: "catatan-guru-1",
        type: "catatan",
        title: "Catatan dari guru",
        desc: `${tName} membagikan catatan untuk dipelajari dan diterapkan di rumah`,
        timeAgo: "1 jam yang lalu",
        dateSection: "Hari Ini",
        read: false,
        actionScreen: "saran-rumah",
      },
      {
        id: "asesmen-selesai-1",
        type: "asesmen",
        title: "Hasil Asesmen Minat & Bakat",
        desc: `${tName} telah menyelesaikan observasi minat kejuruan dan kemandirian fungsional.`,
        timeAgo: "Kemarin",
        dateSection: "Sebelumnya",
        read: true,
        actionScreen: "parent-detail",
      },
      {
        id: "saran-stimulasi-1",
        type: "saran",
        title: "Rekomendasi Latihan di Rumah",
        desc: "Latihan kemandirian merapikan alat menggambar setelah beraktivitas untuk melatih fokus.",
        timeAgo: "3 hari yang lalu",
        dateSection: "Sebelumnya",
        read: true,
        actionScreen: "saran-rumah",
      },
    ];
    setParentNotifs(items);
  }, [isGuru, child, teacherName, laporan]);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS FOR GURU VIEW
  // ─────────────────────────────────────────────────────────────
  const unreadTeacherCount = teacherNotifs.filter((i) => !i.read).length;

  const filteredTeacherNotifs = teacherNotifs.filter((i) => {
    if (filter === "unread") return !i.read;
    if (filter === "tanggapan") return i.type === "tanggapan";
    if (filter === "tugas") return i.type !== "tanggapan";
    return true;
  });

  const hariIniTeacher = filteredTeacherNotifs.filter((i) => i.dateSection === "Hari Ini");
  const sebelumnyaTeacher = filteredTeacherNotifs.filter((i) => i.dateSection === "Sebelumnya");

  const handleMarkAllReadTeacher = () => {
    setTeacherNotifs((prev) => prev.map((i) => ({ ...i, read: true })));
  };

  const markTeacherItemRead = (id: string) => {
    setTeacherNotifs((prev) =>
      prev.map((i) => (i.id === id ? { ...i, read: true } : i))
    );
  };

  const handleItemAction = (item: TeacherNotifItem) => {
    markTeacherItemRead(item.id);
    if (item.actionScreen) {
      onGo(item.actionScreen);
      return;
    }
    if (item.studentId) {
      if (onSelectStudent) {
        onSelectStudent(item.studentId);
      }
      onGo("profile");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS FOR PARENT VIEW
  // ─────────────────────────────────────────────────────────────
  const unreadParentCount = parentNotifs.filter((i) => !i.read).length;
  const filteredParentNotifs = parentNotifs.filter((i) => (filter === "unread" ? !i.read : true));
  const hariIniParent = filteredParentNotifs.filter((i) => i.dateSection === "Hari Ini");
  const sebelumnyaParent = filteredParentNotifs.filter((i) => i.dateSection === "Sebelumnya");

  const handleParentItemClick = (item: ParentNotifItem) => {
    if (item.laporanId) {
      onBaca(item.laporanId);
    }
    setActiveParentDetail(item);
  };

  const handleMarkAllReadParent = () => {
    laporan.forEach((l) => {
      if (!l.dibaca) onBaca(l.id);
    });
  };

  const unreadTotal = isGuru ? unreadTeacherCount : unreadParentCount;

  // Icon selector for teacher notification item
  const renderTeacherIcon = (item: TeacherNotifItem) => {
    if (item.type === "tanggapan") {
      return (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#E8F4EC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckCircle size={19} style={{ color: "#2E5E43" }} />
        </div>
      );
    }
    if (item.type === "kode_ortu") {
      return (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#F5F3FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Key size={18} style={{ color: "#7C3AED" }} />
        </div>
      );
    }
    if (item.type === "asesmen_pending") {
      return (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#FEF3C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ClipboardList size={18} style={{ color: "#D97706" }} />
        </div>
      );
    }
    // laporan_draft
    return (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#ECFDF5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <FileText size={18} style={{ color: "#059669" }} />
      </div>
    );
  };

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{
        fontFamily: IPS,
        background: BG,
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
    >
      {/* ── Header Full Page: < Notifikasi ── */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 30,
          borderBottom: "1px solid rgba(91,122,104,0.10)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: TEXT,
          }}
          className="active:scale-95 transition-transform"
          title="Kembali"
        >
          <ChevronLeft size={24} strokeWidth={2.4} />
        </button>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#1E2D26",
              fontFamily: PJS,
              lineHeight: 1.2,
            }}
          >
            Notifikasi
          </h1>
          {isGuru && (
            <p style={{ margin: "2px 0 0", fontFamily: IPS, fontSize: 11, color: MUTED }}>
              Tanggapan orang tua &amp; pembaruan aktivitas sekolah
            </p>
          )}
        </div>
      </div>

      {/* ── Main Body Card Container ── */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "18px 16px 24px",
            border: "1.5px solid #E2EDE5",
            boxShadow: "0 2px 14px rgba(91,122,104,0.06)",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Filter Chips (Semua | Belum dibaca | Tanggapan | Tugas) ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }} className="no-scrollbar">
              {(
                isGuru
                  ? [
                      { id: "semua", label: "Semua" },
                      { id: "unread", label: "Belum dibaca" },
                      { id: "tanggapan", label: "Tanggapan Ortu" },
                      { id: "tugas", label: "Tugas & Aktivitas" },
                    ]
                  : [
                      { id: "semua", label: "Semua" },
                      { id: "unread", label: "Belum dibaca" },
                    ]
              ).map((t) => {
                const active = filter === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFilter(t.id as any)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: IPS,
                      whiteSpace: "nowrap",
                      border: active ? "1.5px solid #2F5C43" : "1.5px solid #D5E2D9",
                      background: active ? "#D8EADB" : "#FFFFFF",
                      color: active ? "#1E4430" : "#4A6153",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                    className="active:scale-95"
                  >
                    <span>{t.label}</span>
                    {t.id === "unread" && unreadTotal > 0 && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#E11D48",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {unreadTotal > 0 && (
              <button
                type="button"
                onClick={isGuru ? handleMarkAllReadTeacher : handleMarkAllReadParent}
                style={{
                  background: "transparent",
                  border: "none",
                  color: DEEP,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: IPS,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  padding: "4px",
                }}
                title="Tandai semua pesan sudah dibaca"
              >
                <CheckCheck size={13} strokeWidth={2.4} />
                <span>Baca Semua</span>
              </button>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* GURU NOTIFICATIONS: RINGKAS DEFAULT + BISA DI-EXPAND   */}
          {/* ═══════════════════════════════════════════════════════ */}
          {isGuru && (
            <>
              {filteredTeacherNotifs.length === 0 && (
                <div style={{ padding: "40px 16px", textAlign: "center", color: MUTED }}>
                  <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: TEXT }}>
                    {filter === "unread" ? "Tidak ada notifikasi belum dibaca" : "Belum ada notifikasi"}
                  </p>
                  <p style={{ fontFamily: IPS, fontSize: 12, margin: 0 }}>
                    Tanggapan orang tua dan pengingat aktivitas guru akan muncul di sini.
                  </p>
                </div>
              )}

              {/* Section: Hari Ini */}
              {hariIniTeacher.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <h2
                    style={{
                      fontFamily: PJS,
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#1E4631",
                      margin: "0 0 10px",
                    }}
                  >
                    Hari Ini
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {hariIniTeacher.map((item) => {
                      const isExpanded = expandedIds.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          style={{
                            background: "#FFFFFF",
                            border: item.read ? "1px solid #E2EDE5" : "1.5px solid #BCDBC7",
                            borderRadius: 18,
                            padding: "14px 15px",
                            boxShadow: isExpanded
                              ? "0 4px 16px rgba(46,94,67,0.10)"
                              : item.read
                              ? "none"
                              : "0 2px 8px rgba(46,94,67,0.05)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {/* Top Row: Icon + Title/Subtitle + Chevron */}
                          <div
                            style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, cursor: "pointer" }}
                            onClick={() => toggleExpand(item.id)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                              {renderTeacherIcon(item)}
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>
                                    {item.title}
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
                                    />
                                  )}
                                </div>
                                <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "2px 0 0" }}>
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => toggleExpand(item.id, e)}
                              style={{
                                background: "none",
                                border: "none",
                                padding: "4px",
                                cursor: "pointer",
                                color: "#2E5E43",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title={isExpanded ? "Tutup rincian" : "Lihat rincian"}
                            >
                              {isExpanded ? <ChevronUp size={20} strokeWidth={2.3} /> : <ChevronDown size={20} strokeWidth={2.3} />}
                            </button>
                          </div>

                          {/* Primary Badge + Extra Count */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 0 6px 46px", flexWrap: "wrap" }}>
                            <span
                              style={{
                                background: item.type === "tanggapan" ? "#F4F8F5" : "#FEF3C7",
                                border: `1px solid ${item.type === "tanggapan" ? "#CBE0D3" : "#FDE68A"}`,
                                color: item.type === "tanggapan" ? "#1E3E2E" : "#92400E",
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: 8,
                                fontFamily: PJS,
                              }}
                            >
                              {item.primaryBadge}
                            </span>
                            {item.extraBadgeCount && item.extraBadgeCount > 0 && !isExpanded && (
                              <span style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>
                                +{item.extraBadgeCount} reaksi
                              </span>
                            )}
                          </div>

                          {/* Summary text (Visible in collapsed state) */}
                          {!isExpanded && (
                            <p
                              style={{
                                fontFamily: IPS,
                                fontSize: 12,
                                color: "#475569",
                                margin: "0 0 10px 46px",
                                fontStyle: item.type === "tanggapan" ? "italic" : "normal",
                                lineHeight: 1.4,
                              }}
                            >
                              {item.summary}
                            </p>
                          )}

                          {/* ── EXPANDED DETAILED VIEW ── */}
                          {isExpanded && (
                            <div style={{ marginTop: 10, paddingLeft: 46 }}>
                              {/* Tanggapan Type: All Reactions, Keselarasan, Catatan */}
                              {item.type === "tanggapan" && (
                                <>
                                  {/* All reactions pills */}
                                  {item.reaksiList && item.reaksiList.length > 1 && (
                                    <div className="mb-2">
                                      <p style={{ fontFamily: PJS, fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>
                                        Semua Reaksi Orang Tua:
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {item.reaksiList.map((r, idx) => (
                                          <span
                                            key={idx}
                                            style={{
                                              background: "#F4F8F5",
                                              border: "1px solid #CBE0D3",
                                              color: "#1E3E2E",
                                              fontSize: 10.5,
                                              fontWeight: 700,
                                              padding: "2px 7px",
                                              borderRadius: 8,
                                              fontFamily: PJS,
                                            }}
                                          >
                                            {r}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Keselarasan */}
                                  {item.keselarasan && (
                                    <div className="mb-2 flex items-center gap-2 p-2 rounded-xl" style={{ background: "#F8FAF8", border: `1px solid ${BDR}` }}>
                                      <span style={{ fontSize: 15 }}>{item.keselarasanIcon || "✨"}</span>
                                      <div className="min-w-0 flex-1">
                                        <span style={{ fontFamily: IPS, fontSize: 10, color: MUTED, display: "block" }}>
                                          Kesesuaian dengan Kebiasaan di Rumah
                                        </span>
                                        <span style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: TEXT }}>
                                          {item.keselarasan}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Full Catatan */}
                                  {item.catatan && (
                                    <div className="mb-2.5 p-2.5 rounded-xl" style={{ background: "#F9FBF9", borderLeft: "3.5px solid #5B7A68" }}>
                                      <p style={{ fontFamily: PJS, fontSize: 10, fontWeight: 700, color: MUTED, margin: "0 0 2px" }}>
                                        Catatan Pengamatan Lengkap:
                                      </p>
                                      <p style={{ fontFamily: IPS, fontSize: 11.5, color: TEXT, lineHeight: 1.45, margin: 0, fontStyle: "italic" }}>
                                        "{item.catatan}"
                                      </p>
                                    </div>
                                  )}
                                </>
                              )}

                              {/* Non-tanggapan types: Full description */}
                              {item.type !== "tanggapan" && item.fullDesc && (
                                <div className="mb-2.5 p-2.5 rounded-xl" style={{ background: "#F9FBF9", borderLeft: "3.5px solid #2F5C43" }}>
                                  <p style={{ fontFamily: IPS, fontSize: 12, color: TEXT, lineHeight: 1.5, margin: 0 }}>
                                    {item.fullDesc}
                                  </p>
                                </div>
                              )}

                              {/* Action Button */}
                              {item.actionText && (
                                <button
                                  type="button"
                                  onClick={() => handleItemAction(item)}
                                  style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    background: T,
                                    color: "#FFFFFF",
                                    borderRadius: 10,
                                    border: "none",
                                    fontFamily: PJS,
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 5,
                                    marginBottom: 6,
                                  }}
                                  className="active:scale-[0.98] transition-transform"
                                >
                                  <span>{item.actionText}</span>
                                  <ArrowRight size={13} strokeWidth={2.4} />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Subtle Divider */}
                          <div style={{ height: 1, background: "#F1F5F9", margin: "8px 0" }} />

                          {/* Bottom Row: Timestamp + "Lihat tanggapan" Link */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>
                              {item.waktu}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                markTeacherItemRead(item.id);
                                toggleExpand(item.id);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#2E5E43",
                                fontSize: 12,
                                fontWeight: 700,
                                fontFamily: PJS,
                                cursor: "pointer",
                                padding: "2px 4px",
                              }}
                              className="hover:underline active:opacity-75"
                            >
                              {isExpanded ? "Tutup rincian" : "Lihat tanggapan"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section: Sebelumnya */}
              {sebelumnyaTeacher.length > 0 && (
                <div>
                  <h2
                    style={{
                      fontFamily: PJS,
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#1E4631",
                      margin: "4px 0 10px",
                    }}
                  >
                    Sebelumnya
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {sebelumnyaTeacher.map((item) => {
                      const isExpanded = expandedIds.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          style={{
                            background: "#FFFFFF",
                            border: item.read ? "1px solid #E2EDE5" : "1.5px solid #BCDBC7",
                            borderRadius: 18,
                            padding: "14px 15px",
                            boxShadow: isExpanded
                              ? "0 4px 16px rgba(46,94,67,0.10)"
                              : item.read
                              ? "none"
                              : "0 2px 8px rgba(46,94,67,0.05)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {/* Top Row: Icon + Title/Subtitle + Chevron */}
                          <div
                            style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, cursor: "pointer" }}
                            onClick={() => toggleExpand(item.id)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                              {renderTeacherIcon(item)}
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>
                                    {item.title}
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
                                    />
                                  )}
                                </div>
                                <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "2px 0 0" }}>
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => toggleExpand(item.id, e)}
                              style={{
                                background: "none",
                                border: "none",
                                padding: "4px",
                                cursor: "pointer",
                                color: "#2E5E43",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title={isExpanded ? "Tutup rincian" : "Lihat rincian"}
                            >
                              {isExpanded ? <ChevronUp size={20} strokeWidth={2.3} /> : <ChevronDown size={20} strokeWidth={2.3} />}
                            </button>
                          </div>

                          {/* Primary Badge + Extra Count */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 0 6px 46px", flexWrap: "wrap" }}>
                            <span
                              style={{
                                background: item.type === "tanggapan" ? "#F4F8F5" : "#FEF3C7",
                                border: `1px solid ${item.type === "tanggapan" ? "#CBE0D3" : "#FDE68A"}`,
                                color: item.type === "tanggapan" ? "#1E3E2E" : "#92400E",
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: 8,
                                fontFamily: PJS,
                              }}
                            >
                              {item.primaryBadge}
                            </span>
                            {item.extraBadgeCount && item.extraBadgeCount > 0 && !isExpanded && (
                              <span style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>
                                +{item.extraBadgeCount} reaksi
                              </span>
                            )}
                          </div>

                          {/* Summary text (Visible in collapsed state) */}
                          {!isExpanded && (
                            <p
                              style={{
                                fontFamily: IPS,
                                fontSize: 12,
                                color: "#475569",
                                margin: "0 0 10px 46px",
                                fontStyle: item.type === "tanggapan" ? "italic" : "normal",
                                lineHeight: 1.4,
                              }}
                            >
                              {item.summary}
                            </p>
                          )}

                          {/* ── EXPANDED DETAILED VIEW ── */}
                          {isExpanded && (
                            <div style={{ marginTop: 10, paddingLeft: 46 }}>
                              {/* Tanggapan Type: All Reactions, Keselarasan, Catatan */}
                              {item.type === "tanggapan" && (
                                <>
                                  {item.reaksiList && item.reaksiList.length > 1 && (
                                    <div className="mb-2">
                                      <p style={{ fontFamily: PJS, fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" }}>
                                        Semua Reaksi Orang Tua:
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {item.reaksiList.map((r, idx) => (
                                          <span
                                            key={idx}
                                            style={{
                                              background: "#F4F8F5",
                                              border: "1px solid #CBE0D3",
                                              color: "#1E3E2E",
                                              fontSize: 10.5,
                                              fontWeight: 700,
                                              padding: "2px 7px",
                                              borderRadius: 8,
                                              fontFamily: PJS,
                                            }}
                                          >
                                            {r}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {item.keselarasan && (
                                    <div className="mb-2 flex items-center gap-2 p-2 rounded-xl" style={{ background: "#F8FAF8", border: `1px solid ${BDR}` }}>
                                      <span style={{ fontSize: 15 }}>{item.keselarasanIcon || "✨"}</span>
                                      <div className="min-w-0 flex-1">
                                        <span style={{ fontFamily: IPS, fontSize: 10, color: MUTED, display: "block" }}>
                                          Kesesuaian dengan Kebiasaan di Rumah
                                        </span>
                                        <span style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: TEXT }}>
                                          {item.keselarasan}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {item.catatan && (
                                    <div className="mb-2.5 p-2.5 rounded-xl" style={{ background: "#F9FBF9", borderLeft: "3.5px solid #5B7A68" }}>
                                      <p style={{ fontFamily: PJS, fontSize: 10, fontWeight: 700, color: MUTED, margin: "0 0 2px" }}>
                                        Catatan Pengamatan Lengkap:
                                      </p>
                                      <p style={{ fontFamily: IPS, fontSize: 11.5, color: TEXT, lineHeight: 1.45, margin: 0, fontStyle: "italic" }}>
                                        "{item.catatan}"
                                      </p>
                                    </div>
                                  )}
                                </>
                              )}

                              {item.type !== "tanggapan" && item.fullDesc && (
                                <div className="mb-2.5 p-2.5 rounded-xl" style={{ background: "#F9FBF9", borderLeft: "3.5px solid #2F5C43" }}>
                                  <p style={{ fontFamily: IPS, fontSize: 12, color: TEXT, lineHeight: 1.5, margin: 0 }}>
                                    {item.fullDesc}
                                  </p>
                                </div>
                              )}

                              {item.actionText && (
                                <button
                                  type="button"
                                  onClick={() => handleItemAction(item)}
                                  style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    background: T,
                                    color: "#FFFFFF",
                                    borderRadius: 10,
                                    border: "none",
                                    fontFamily: PJS,
                                    fontSize: 11.5,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 5,
                                    marginBottom: 6,
                                  }}
                                  className="active:scale-[0.98] transition-transform"
                                >
                                  <span>{item.actionText}</span>
                                  <ArrowRight size={13} strokeWidth={2.4} />
                                </button>
                              )}
                            </div>
                          )}

                          {/* Subtle Divider */}
                          <div style={{ height: 1, background: "#F1F5F9", margin: "8px 0" }} />

                          {/* Bottom Row: Timestamp + "Lihat tanggapan" Link */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>
                              {item.waktu}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                markTeacherItemRead(item.id);
                                toggleExpand(item.id);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#2E5E43",
                                fontSize: 12,
                                fontWeight: 700,
                                fontFamily: PJS,
                                cursor: "pointer",
                                padding: "2px 4px",
                              }}
                              className="hover:underline active:opacity-75"
                            >
                              {isExpanded ? "Tutup rincian" : "Lihat tanggapan"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* PARENT NOTIFICATIONS: LAPORAN DARI GURU (ROLE ORTU)  */}
          {/* ═══════════════════════════════════════════════════════ */}
          {!isGuru && (
            <>
              {filteredParentNotifs.length === 0 && (
                <div style={{ padding: "40px 16px", textAlign: "center", color: MUTED }}>
                  <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: TEXT }}>
                    {filter === "unread" ? "Tidak ada notifikasi belum dibaca" : "Belum ada notifikasi"}
                  </p>
                  <p style={{ fontFamily: IPS, fontSize: 12, margin: 0 }}>
                    {filter === "unread" ? "Semua feedback dari guru sudah Anda tinjau." : "Feedback dan catatan dari guru akan tampil di sini."}
                  </p>
                </div>
              )}

              {/* Section: Hari Ini */}
              {hariIniParent.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <h2
                    style={{
                      fontFamily: PJS,
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#1E4631",
                      margin: "0 0 14px",
                    }}
                  >
                    Hari Ini
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {hariIniParent.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleParentItemClick(item)}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: "12px 0",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            textAlign: "left",
                            cursor: "pointer",
                            width: "100%",
                          }}
                          className="active:opacity-80 transition-opacity"
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background: "#E8F4EC",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#246E44",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            <Crosshair size={20} strokeWidth={2.2} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                              <p
                                style={{
                                  fontFamily: PJS,
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: "#1E2D26",
                                  margin: "0 0 3px",
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.title}
                              </p>
                              {!item.read && (
                                <span
                                  style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    background: A,
                                    flexShrink: 0,
                                  }}
                                  title="Belum dibaca"
                                />
                              )}
                            </div>

                            <p
                              style={{
                                fontFamily: IPS,
                                fontSize: 12,
                                color: "#5A6F62",
                                margin: "0 0 5px",
                                lineHeight: 1.45,
                              }}
                            >
                              {item.desc}
                            </p>

                            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#7C9285", fontSize: 11.5 }}>
                              <Clock size={13} strokeWidth={2} />
                              <span>{item.timeAgo}</span>
                            </div>
                          </div>
                        </button>

                        {index < hariIniParent.length - 1 && (
                          <div style={{ height: 1, background: "#EEF4F0", margin: "2px 0" }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Section: Sebelumnya */}
              {sebelumnyaParent.length > 0 && (
                <div>
                  <div style={{ height: 1, background: "#EEF4F0", margin: "4px 0 14px" }} />
                  <h2
                    style={{
                      fontFamily: PJS,
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#1E4631",
                      margin: "0 0 14px",
                    }}
                  >
                    Sebelumnya
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {sebelumnyaParent.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleParentItemClick(item)}
                          style={{
                            background: "transparent",
                            border: "none",
                            padding: "12px 0",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            textAlign: "left",
                            cursor: "pointer",
                            width: "100%",
                          }}
                          className="active:opacity-80 transition-opacity"
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 10,
                              background: item.read ? "#F1F5F2" : "#E8F4EC",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#246E44",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            <Crosshair size={20} strokeWidth={2.2} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                              <p
                                style={{
                                  fontFamily: PJS,
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: "#1E2D26",
                                  margin: "0 0 3px",
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.title}
                              </p>
                              {!item.read && (
                                <span
                                  style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    background: A,
                                    flexShrink: 0,
                                  }}
                                  title="Belum dibaca"
                                />
                              )}
                            </div>

                            <p
                              style={{
                                fontFamily: IPS,
                                fontSize: 12,
                                color: "#5A6F62",
                                margin: "0 0 5px",
                                lineHeight: 1.45,
                              }}
                            >
                              {item.desc}
                            </p>

                            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#7C9285", fontSize: 11.5 }}>
                              <Clock size={13} strokeWidth={2} />
                              <span>{item.timeAgo}</span>
                            </div>
                          </div>
                        </button>

                        {index < sebelumnyaParent.length - 1 && (
                          <div style={{ height: 1, background: "#EEF4F0", margin: "2px 0" }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Detail Modal Pop-up untuk ORANG TUA (Saat Laporan Diklik) ── */}
      {activeParentDetail && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(22, 38, 29, 0.48)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          onClick={() => setActiveParentDetail(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "24px 24px 0 0",
              padding: "16px 20px 24px",
              maxHeight: "85%",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ width: 38, height: 4, borderRadius: 2, background: "#CBD5E1", margin: "0 auto 14px" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "#E8F4EC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#246E44",
                  }}
                >
                  <Crosshair size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: 0 }}>
                    {activeParentDetail.title}
                  </h3>
                  <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "2px 0 0" }}>
                    Dari {teacherName} · {activeParentDetail.timeAgo}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveParentDetail(null)}
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
                }}
              >
                <X size={16} strokeWidth={2.4} />
              </button>
            </div>

            {/* Isi Pesan */}
            <div
              style={{
                background: BG,
                borderRadius: 16,
                padding: "14px 16px",
                border: "1px solid #E2EDE5",
                marginBottom: 16,
              }}
            >
              <p style={{ fontFamily: IPS, fontSize: 13, color: TEXT, lineHeight: 1.6, margin: 0 }}>
                {activeParentDetail.desc}
              </p>
            </div>

            {/* Aksi Pintasan */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activeParentDetail.actionScreen && (
                <button
                  type="button"
                  onClick={() => {
                    const target = activeParentDetail.actionScreen!;
                    setActiveParentDetail(null);
                    onGo(target);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: T,
                    color: "#FFFFFF",
                    borderRadius: 14,
                    border: "none",
                    fontFamily: PJS,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  className="active:scale-[0.98] transition-transform"
                >
                  <span>Buka Halaman Terkait</span>
                  <ArrowUpRight size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveParentDetail(null)}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: "#F1F5F2",
                  color: "#4A6153",
                  borderRadius: 14,
                  border: "1px solid #D5E2D9",
                  fontFamily: PJS,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="active:scale-[0.98] transition-transform"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
