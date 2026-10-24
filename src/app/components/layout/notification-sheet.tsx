import React, { useState } from "react";
import {
  Bell, FileText, CheckCircle2, Star, Lightbulb, MessageCircle, X, ChevronRight, CheckCheck,
} from "lucide-react";
import {
  CARD, BG, TEXT, MUTED, DEEP, T, A, BDR, PJS, IPS, DMM,
} from "../ui-kit";
import { type LaporanKirim, type Student, type Screen } from "../data";

export interface ParentNotificationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  laporan: LaporanKirim[];
  child: Student | null;
  onBaca: (id: number) => void;
  onGo: (s: Screen) => void;
}

export function ParentNotificationSheet({
  isOpen,
  onClose,
  laporan,
  child,
  onBaca,
  onGo,
}: ParentNotificationSheetProps) {
  const [filter, setFilter] = useState<"semua" | "feedback" | "asesmen">("semua");

  if (!isOpen) return null;

  const childName = child ? child.name.split(" ")[0] : "Anak";
  const teacherName = child?.teacher || "Ibu Sari";

  // Build notification items
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
        onBaca(l.id);
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
    if (filter === "semua") return true;
    return item.type === filter;
  });

  const unreadCount = items.filter((i) => !i.read).length;

  const handleMarkAllRead = () => {
    laporan.forEach((l) => {
      if (!l.dibaca) onBaca(l.id);
    });
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
              const active = filter === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFilter(t.id)}
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
