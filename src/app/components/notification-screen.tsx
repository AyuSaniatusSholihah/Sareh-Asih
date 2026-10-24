import React, { useState } from "react";
import {
  ChevronLeft, Clock, Crosshair, CheckCheck, MessageCircle, FileText,
  Star, Lightbulb, X, ArrowUpRight,
} from "lucide-react";
import {
  BG, CARD, TEXT, MUTED, DEEP, T, A, BDR, PJS, IPS,
} from "./ui-kit";
import { type LaporanKirim, type Student, type Screen } from "./data";

export interface NotificationScreenProps {
  onBack: () => void;
  laporan: LaporanKirim[];
  child: Student | null;
  onBaca: (id: number) => void;
  onGo: (s: Screen) => void;
  teacherName?: string;
}

interface NotifItem {
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

export function NotificationScreen({
  onBack,
  laporan = [],
  child,
  onBaca,
  onGo,
  teacherName = "Bu Sari",
}: NotificationScreenProps) {
  const [filter, setFilter] = useState<"semua" | "unread">("semua");
  const [activeDetail, setActiveDetail] = useState<NotifItem | null>(null);

  const childName = child ? child.name.split(" ")[0] : "adik Nisa";
  const tName = child?.teacher || teacherName;

  // Build notifications list
  const initialItems: NotifItem[] = [
    // 1. Catatan / Laporan dari guru (dinamis dari state laporan)
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

    // 2. Catatan guru untuk pendampingan rumah
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

    // 3. Pemetaan asesmen selesai
    {
      id: "asesmen-selesai-1",
      type: "asesmen",
      title: `Hasil Asesmen Minat & Bakat`,
      desc: `${tName} telah menyelesaikan observasi minat kejuruan dan kemandirian fungsional.`,
      timeAgo: "Kemarin",
      dateSection: "Sebelumnya",
      read: true,
      actionScreen: "parent-detail",
    },

    // 4. Rekomendasi stimulasi kemandirian
    {
      id: "saran-stimulasi-1",
      type: "saran",
      title: "Rekomendasi Latihan di Rumah",
      desc: `Latihan kemandirian merapikan alat menggambar setelah beraktivitas untuk melatih fokus.`,
      timeAgo: "3 hari yang lalu",
      dateSection: "Sebelumnya",
      read: true,
      actionScreen: "saran-rumah",
    },
  ];

  const unreadTotal = initialItems.filter(i => !i.read).length;

  const displayItems = initialItems.filter(item => {
    if (filter === "unread") return !item.read;
    return true;
  });

  const hariIniItems = displayItems.filter(i => i.dateSection === "Hari Ini");
  const sebelumnyaItems = displayItems.filter(i => i.dateSection === "Sebelumnya");

  const handleItemClick = (item: NotifItem) => {
    if (item.laporanId) {
      onBaca(item.laporanId);
    }
    setActiveDetail(item);
  };

  const handleMarkAllRead = () => {
    laporan.forEach(l => {
      if (!l.dibaca) onBaca(l.id);
    });
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
      </div>

      {/* ── Main Body Card Container (Matching User's Mockup) ── */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "18px 18px 24px",
            border: "1.5px solid #E2EDE5",
            boxShadow: "0 2px 14px rgba(91,122,104,0.06)",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Filter Chips (Semua | Belum dibaca) ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Chip: Semua */}
              <button
                type="button"
                onClick={() => setFilter("semua")}
                style={{
                  padding: "6px 18px",
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 700,
                  fontFamily: IPS,
                  border: filter === "semua" ? "1.5px solid #2F5C43" : "1.5px solid #D5E2D9",
                  background: filter === "semua" ? "#D8EADB" : "#FFFFFF",
                  color: filter === "semua" ? "#1E4430" : "#4A6153",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="active:scale-95"
              >
                Semua
              </button>

              {/* Chip: Belum dibaca */}
              <button
                type="button"
                onClick={() => setFilter("unread")}
                style={{
                  padding: "6px 18px",
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 700,
                  fontFamily: IPS,
                  border: filter === "unread" ? "1.5px solid #2F5C43" : "1.5px solid #D5E2D9",
                  background: filter === "unread" ? "#D8EADB" : "#FFFFFF",
                  color: filter === "unread" ? "#1E4430" : "#4A6153",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                className="active:scale-95"
              >
                <span>Belum dibaca</span>
                {unreadTotal > 0 && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: A,
                    }}
                  />
                )}
              </button>
            </div>

            {unreadTotal > 0 && filter === "semua" && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: "transparent",
                  border: "none",
                  color: DEEP,
                  fontSize: 11.5,
                  fontWeight: 700,
                  fontFamily: IPS,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px",
                }}
                title="Tandai semua pesan sudah dibaca"
              >
                <CheckCheck size={14} strokeWidth={2.4} />
                <span>Baca Semua</span>
              </button>
            )}
          </div>

          {/* ── Empty State ── */}
          {displayItems.length === 0 && (
            <div style={{ padding: "40px 16px", textAlign: "center", color: MUTED }}>
              <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 700, margin: "0 0 4px", color: TEXT }}>
                {filter === "unread" ? "Tidak ada notifikasi belum dibaca" : "Belum ada notifikasi"}
              </p>
              <p style={{ fontFamily: IPS, fontSize: 12, margin: 0 }}>
                {filter === "unread" ? "Semua feedback dari guru sudah Anda tinjau." : "Feedback dan catatan dari guru akan tampil di sini."}
              </p>
            </div>
          )}

          {/* ── Section: Hari Ini ── */}
          {hariIniItems.length > 0 && (
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
                {hariIniItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
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
                      {/* Stylized Crosshair Icon Box (Exact match with user's mockup) */}
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

                      {/* Content */}
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

                    {index < hariIniItems.length - 1 && (
                      <div style={{ height: 1, background: "#EEF4F0", margin: "2px 0" }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* ── Section: Sebelumnya ── */}
          {sebelumnyaItems.length > 0 && (
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
                {sebelumnyaItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
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
                      {/* Stylized Crosshair Icon Box */}
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          background: item.read ? "#F1F5F2" : "#E8F4EC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: item.read ? "#5A7364" : "#246E44",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <Crosshair size={20} strokeWidth={2.2} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                          <p
                            style={{
                              fontFamily: PJS,
                              fontSize: 14,
                              fontWeight: item.read ? 700 : 800,
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

                    {index < sebelumnyaItems.length - 1 && (
                      <div style={{ height: 1, background: "#EEF4F0", margin: "2px 0" }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal Pop-up (Saat Pesan Diklik) ── */}
      {activeDetail && (
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
          onClick={() => setActiveDetail(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "24px 24px 0 0",
              padding: "16px 20px 24px",
              maxHeight: "85%",
              overflowY: "auto",
            }}
            onClick={e => e.stopPropagation()}
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
                    {activeDetail.title}
                  </h3>
                  <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "2px 0 0" }}>
                    Dari {tName} · {activeDetail.timeAgo}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDetail(null)}
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
                {activeDetail.desc}
              </p>
            </div>

            {/* Aksi Pintasan */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activeDetail.actionScreen && (
                <button
                  type="button"
                  onClick={() => {
                    const target = activeDetail.actionScreen!;
                    setActiveDetail(null);
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
                onClick={() => setActiveDetail(null)}
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
