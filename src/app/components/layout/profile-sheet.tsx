import React from "react";
import {
  User, Mail, Phone, Building2, Briefcase, ShieldCheck, X,
  ChevronRight, Edit3, LogOut, Settings, Users,
} from "lucide-react";
import {
  A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
} from "../ui-kit";
import { type Role } from "../data";
import { type GuruProfile } from "../auth";
import { WebDashboardCard } from "./web-dashboard-card";

export function ProfileSheet({
  isOpen,
  onClose,
  role,
  guru,
  namaOrtu,
  childName,
  onEditProfile,
  onOpenSettings,
  onOpenWebDashboard,
  onLogout,
  onGoStudents,
}: {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  guru: GuruProfile;
  namaOrtu?: string;
  childName?: string;
  onEditProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenWebDashboard?: () => void;
  onLogout?: () => void;
  onGoStudents?: () => void;
}) {
  if (!isOpen) return null;

  const isGuru = role === "guru";
  const nama = isGuru ? guru.nama : (namaOrtu || "Orang Tua");
  const initial = (nama || "U").charAt(0).toUpperCase();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(30,45,38,0.5)",
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
          background: CARD,
          borderRadius: "26px 26px 0 0",
          padding: "16px 20px 28px",
          maxHeight: "90%",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top drag handle + Close Button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
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
            }}
            className="active:scale-90 transition-transform"
            title="Tutup"
          >
            <X size={17} strokeWidth={2.4} />
          </button>
        </div>

        {/* Profile Header Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #5B7A68 0%, #3B5345 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontFamily: PJS,
                fontSize: 24,
                fontWeight: 800,
                boxShadow: "0 4px 12px rgba(91,122,104,0.25)",
              }}
            >
              {initial}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
              }}
            >
              <ShieldCheck size={16} style={{ color: "#2E7D32" }} strokeWidth={2.5} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <p
                style={{
                  fontFamily: PJS,
                  fontSize: 16.5,
                  fontWeight: 800,
                  color: TEXT,
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                {nama}
              </p>
            </div>
            <span
              style={{
                display: "inline-block",
                marginTop: 4,
                padding: "2px 8px",
                borderRadius: 9999,
                background: "#E8F4EC",
                color: "#1E4A31",
                fontFamily: PJS,
                fontSize: 10.5,
                fontWeight: 700,
              }}
            >
              {isGuru ? "Guru Pendamping Khusus" : "Orang Tua / Wali Murid"}
            </span>
          </div>
        </div>

        {/* Detail Information Box */}
        <div
          style={{
            background: BG,
            borderRadius: 18,
            border: `1px solid rgba(91,122,104,0.14)`,
            padding: "12px 14px",
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {isGuru ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Building2 size={16} style={{ color: DEEP, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Sekolah</p>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {guru.sekolah || "SLB Negeri 1 Surakarta"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Briefcase size={16} style={{ color: DEEP, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Jabatan / Peran</p>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                    {guru.jabatan || "Guru Kelas / Wali Kelas"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail size={16} style={{ color: DEEP, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Email Terdaftar</p>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                    {guru.email || "sari.dewi@gmail.com"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Phone size={16} style={{ color: DEEP, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>No. WhatsApp / HP</p>
                  <p style={{ fontFamily: DMM, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                    {guru.noHp || "081234567890"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Users size={16} style={{ color: DEEP, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Kelas & Kekhususan</p>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                    {guru.kelas && guru.kelas.length > 0 ? guru.kelas.join(", ") : "Kelas VI A"}
                    {guru.abk && guru.abk.length > 0 ? ` (${guru.abk.join(", ")})` : " (Tunanetra)"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <User size={16} style={{ color: DEEP, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Anak Terhubung</p>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                    {childName || "Rafi Pratama"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Building2 size={16} style={{ color: DEEP, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Sekolah Anak</p>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                    {guru.sekolah || "SLB Negeri 1 Surakarta"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action List Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {isGuru && onEditProfile && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditProfile();
              }}
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid rgba(91,122,104,0.18)",
                borderRadius: 14,
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              className="active:scale-[0.98] transition-transform hover:bg-[#F8FAF9]"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Edit3 size={16} style={{ color: DEEP }} />
                <span style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT }}>
                  Ubah Data Akun
                </span>
              </div>
              <ChevronRight size={16} style={{ color: MUTED }} />
            </button>
          )}

          {isGuru && onGoStudents && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoStudents();
              }}
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid rgba(91,122,104,0.18)",
                borderRadius: 14,
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              className="active:scale-[0.98] transition-transform hover:bg-[#F8FAF9]"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Users size={16} style={{ color: DEEP }} />
                <span style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT }}>
                  Kelola Daftar Siswa
                </span>
              </div>
              <ChevronRight size={16} style={{ color: MUTED }} />
            </button>
          )}

          {onOpenSettings && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid rgba(91,122,104,0.18)",
                borderRadius: 14,
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              className="active:scale-[0.98] transition-transform hover:bg-[#F8FAF9]"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Settings size={16} style={{ color: DEEP }} />
                <span style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT }}>
                  Pengaturan & Bantuan
                </span>
              </div>
              <ChevronRight size={16} style={{ color: MUTED }} />
            </button>
          )}
        </div>

        {/* Gunakan Sareh Asih di Web (Khusus Pengaturan User Guru) */}
        {isGuru && (
          <WebDashboardCard
            style={{ marginBottom: 14 }}
            onOpenWebDashboard={onOpenWebDashboard ? () => { onClose(); onOpenWebDashboard(); } : undefined}
          />
        )}

        {/* Logout Button */}
        {onLogout && (
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            style={{
              width: "100%",
              background: "rgba(210,125,107,0.12)",
              color: "#973926",
              border: "1px solid rgba(210,125,107,0.30)",
              borderRadius: 16,
              padding: "12px",
              fontFamily: PJS,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            className="active:scale-[0.98] transition-transform hover:bg-[rgba(210,125,107,0.18)]"
          >
            <LogOut size={16} /> Keluar dari Akun
          </button>
        )}
      </div>
    </div>
  );
}
