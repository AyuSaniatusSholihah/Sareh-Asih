import React, { useState } from "react";
import {
  Laptop, ArrowUpRight, Globe, X, Check, Copy, FileSpreadsheet,
  Printer, QrCode, Sparkles, ShieldCheck, ExternalLink, RefreshCw,
} from "lucide-react";
import {
  CARD, BG, TEXT, MUTED, DEEP, BDR, SEC, PJS, IPS, DMM,
} from "../ui-kit";

export function WebDashboardCard({
  onOpenWebDashboard,
  onClick,
  onOpenModal,
  className = "",
  style = {},
}: {
  onOpenWebDashboard?: () => void;
  onClick?: () => void;
  onOpenModal?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionCode] = useState("SA-8942");

  const handleOpen = () => {
    if (onOpenWebDashboard) {
      onOpenWebDashboard();
    } else if (onClick) {
      onClick();
    } else if (onOpenModal) {
      onOpenModal();
    } else {
      setShowModal(true);
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard?.writeText("https://sareh_asih.id/portal-guru");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* ── Banner Card: Gunakan Sareh Asih di Web ── */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 18,
          border: "1.5px solid rgba(91,122,104,0.22)",
          padding: "16px",
          boxShadow: "0 2px 10px rgba(91,122,104,0.06)",
          ...style,
        }}
        className={className}
      >
        {/* Header: Icon Laptop + Judul */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
          <Laptop size={19} strokeWidth={2.3} style={{ color: DEEP, flexShrink: 0 }} />
          <p
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: TEXT,
              fontFamily: PJS,
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: "-0.2px",
            }}
          >
            Gunakan Sareh Asih di Web
          </p>
        </div>

        {/* Deskripsi Subtitle */}
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.5,
            color: MUTED,
            fontFamily: IPS,
            margin: "0 0 14px",
          }}
        >
          Buka dashboard melalui browser untuk mengakses fitur yang tersedia di versi web.
        </p>

        {/* Tombol Utama: Buka Web Dashboard ↗ */}
        <button
          type="button"
          onClick={handleOpen}
          style={{
            width: "100%",
            padding: "11px 16px",
            borderRadius: 12,
            border: "none",
            background: DEEP,
            color: "#FFFFFF",
            fontFamily: PJS,
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            cursor: "pointer",
            boxShadow: "0 3px 10px rgba(91,122,104,0.22)",
          }}
          className="active:scale-[0.98] transition-all hover:brightness-105"
        >
          <span>Buka Web Dashboard</span>
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </button>
      </div>

      {/* ── Modal Pratinjau Portal Web Sareh Asih ── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30, 41, 35, 0.60)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 22,
              width: "100%",
              maxWidth: 390,
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mockup Browser Top Bar */}
            <div
              style={{
                background: "#1E293B",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
              </div>
              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 6,
                  padding: "4px 10px",
                  color: "#CBD5E1",
                  fontSize: 10.5,
                  fontFamily: IPS,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Globe size={11} />
                <span>sareh_asih.id/portal-guru</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                }}
                title="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body Content */}
            <div style={{ padding: "18px 18px 14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Header Info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: PJS,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: "#E8F4EC",
                      color: "#1E4A31",
                    }}
                  >
                    Portal Desktop / Web
                  </span>
                  <span style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>· Versi Guru & Sekolah</span>
                </div>
                <h3 style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: 0 }}>
                  Dashboard Guru Sareh Asih
                </h3>
                <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "4px 0 0", lineHeight: 1.45 }}>
                  Buka di peramban komputer untuk menikmati fitur manajemen kelas dan pencetakan layar lebar.
                </p>
              </div>

              {/* Fitur Utama di Versi Web */}
              <div
                style={{
                  background: "#F8FAF9",
                  borderRadius: 14,
                  padding: "12px 14px",
                  border: "1px solid rgba(91,122,104,0.14)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: DEEP, margin: 0 }}>
                  Fitur Eksklusif di Versi Web:
                </p>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "#EFF6FF", color: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileSpreadsheet size={15} />
                  </div>
                  <div>
                    <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>Ekspor Dapodik & Excel</p>
                    <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "1px 0 0" }}>Unduh format resmi nilai & profil asesmen rombel sekaligus.</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Printer size={15} />
                  </div>
                  <div>
                    <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>Cetak Rapor Massal 1-Klik</p>
                    <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "1px 0 0" }}>Cetak lembar rapor komprehensif lengkap tanda tangan & barcode.</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>Peta Radar Bakat Layar Lebar</p>
                    <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "1px 0 0" }}>Tampilan matriks kelas beresolusi tinggi untuk rapat dewan guru.</p>
                  </div>
                </div>
              </div>

              {/* Tautan URL & Salin */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontFamily: PJS, fontSize: 11, fontWeight: 700, color: MUTED, margin: 0 }}>
                  ALAMAT WEB DASHBOARD
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#F1F5F9",
                    padding: "9px 12px",
                    borderRadius: 12,
                    border: "1px solid #CBD5E1",
                  }}
                >
                  <Globe size={15} style={{ color: DEEP }} />
                  <span style={{ flex: 1, fontFamily: DMM, fontSize: 12, fontWeight: 600, color: TEXT }}>
                    sareh_asih.id/portal-guru
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: copied ? "#059669" : DEEP,
                      fontFamily: PJS,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 6px",
                      borderRadius: 6,
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={14} strokeWidth={2.5} />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* QR / Kode Sesi Sinkronisasi */}
              <div
                style={{
                  background: "#F4F8F5",
                  borderRadius: 12,
                  padding: "10px 12px",
                  border: "1px dashed rgba(91,122,104,0.30)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ fontFamily: PJS, fontSize: 11, fontWeight: 700, color: TEXT, margin: 0 }}>
                    Kode Sesi Cepat:
                  </p>
                  <p style={{ fontFamily: DMM, fontSize: 14, fontWeight: 800, color: DEEP, margin: "2px 0 0" }}>
                    {sessionCode}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#059669", fontSize: 11, fontWeight: 600, fontFamily: IPS }}>
                  <ShieldCheck size={15} />
                  <span>Siap Ditautkan</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div
              style={{
                padding: "12px 18px 16px",
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1px solid ${BDR}`,
                  background: "#FFFFFF",
                  color: TEXT,
                  fontFamily: PJS,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                className="active:scale-95 transition-transform"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCopyLink();
                  setIsConnecting(true);
                  setTimeout(() => {
                    setIsConnecting(false);
                    setShowModal(false);
                  }, 1200);
                }}
                style={{
                  flex: 1.4,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "none",
                  background: DEEP,
                  color: "#FFFFFF",
                  fontFamily: PJS,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  boxShadow: "0 3px 10px rgba(91,122,104,0.22)",
                }}
                className="active:scale-95 transition-transform"
              >
                <ExternalLink size={14} />
                <span>{isConnecting ? "Menghubungkan..." : "Buka Portal Web"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
