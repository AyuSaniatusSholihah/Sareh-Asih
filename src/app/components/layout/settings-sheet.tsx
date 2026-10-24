import React, { useState } from "react";
import {
  HelpCircle, Heart, Shield, LogOut, Volume2, VolumeX, ChevronRight, ChevronLeft,
  X, Sparkles, User, Mail, Phone, Building2, Briefcase, ShieldCheck, Edit3, Users, Settings,
} from "lucide-react";
import {
  T, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, useUI,
} from "../ui-kit";
import { type Role } from "../data";
import { type TeacherRole, TEACHER_ROLE_OPTIONS } from "../role-labels";
import { type GuruProfile } from "../auth";
import { WebDashboardCard } from "./web-dashboard-card";

export const INFO_PANELS = [
  {
    icon: <HelpCircle size={16} />,
    label: "Panduan Penggunaan",
    body: [
      "Tambah siswa lewat tombol oranye “Tambah Siswa” yang selalu ada di pojok kanan bawah. Cukup 3 kolom wajib: nama, kelas, dan kekhususan siswa.",
      "Buka Asesmen dari kartu siswa. Indikator dikelompokkan per kategori — Interaksi Sosial, Komunikasi, Motorik & Sensorik, Fokus & Kognitif, Minat & Bakat.",
      "Tahap Asesmen berisi dua kategori tes: Kemandirian dan Akademik & Bakat, dinilai dengan 4 tingkat.",
      "Catatan dan laporan bisa diisi dengan suara — tekan tombol mikrofon lalu bicara, tidak perlu mengetik.",
      "Kode akses orang tua dibuat guru di tab “Kode Ortu” pada profil siswa, lalu dibagikan ke orang tua.",
    ],
  },
  {
    icon: <Heart size={16} />,
    label: "Tentang Sareh Asih",
    body: [
      "Sareh Asih adalah pendamping belajar harian untuk guru dan orang tua. Guru mencatat asesmen sehari-hari, menilai kemampuan tiap anak, lalu hasilnya disatukan menjadi laporan sederhana yang mudah dibaca orang tua.",
      "Setiap anak tumbuh dengan caranya sendiri — AI di sini bekerja sebagai rekan guru: membantu menenggarai potensi, tetapi keputusan tetap sepenuhnya di tangan guru.",
      "Alur utamanya singkat: amati keseharian anak, nilai sesuai kemampuannya, lalu bagikan perkembangannya ke orang tua.",
      "Dibuat untuk GEMASTIK XVII kategori UX Design.",
    ],
  },
  {
    icon: <Shield size={16} />,
    label: "Kebijakan Privasi",
    body: [
      "Data siswa hanya dapat diakses guru pengampu dan orang tua yang memegang kode akses yang sah.",
      "Laporan tidak pernah terkirim otomatis — selalu ada langkah konfirmasi oleh guru sebelum orang tua bisa melihatnya.",
      "Dikte suara diproses di perangkat melalui peramban; rekaman tidak disimpan aplikasi.",
      "Guru dapat membuat ulang kode akses kapan saja, dan kode lama langsung berhenti berlaku.",
    ],
  },
];

export function SettingsSheet({
  onClose,
  onLogout,
  onEditSetup,
  onOpenWebDashboard,
  role,
  teacherRole,
  guru,
  guruName = "Sari Dewi, S.Pd.",
  parentName = "Ani Rahmawati",
  childName,
  childKelas,
  onEditProfile,
  onGoStudents,
}: {
  onClose: () => void;
  onLogout?: () => void;
  onEditSetup?: () => void;
  onOpenWebDashboard?: () => void;
  role?: Role | null;
  teacherRole?: TeacherRole;
  guru?: GuruProfile;
  guruName?: string;
  parentName?: string;
  childName?: string;
  childKelas?: string;
  onEditProfile?: () => void;
  onGoStudents?: () => void;
}) {
  const { fontSize, setFontSize, tts, setTts } = useUI();
  const [view, setView] = useState<"settings" | "profile">("settings");
  const [info, setInfo] = useState<string | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const roleLabel = teacherRole
    ? TEACHER_ROLE_OPTIONS.find(t => t.value === teacherRole)?.label || "Guru SLB"
    : "Guru SLB";

  const isGuru = role === "guru";
  const namaAktif = isGuru ? (guru?.nama || guruName) : parentName;
  const initialAktif = (namaAktif || "G").charAt(0).toUpperCase();

  // If view is "profile", display the full Teacher Profile detail view
  if (view === "profile" && isGuru) {
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
          {/* Top drag handle + Navigation Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setView("settings")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(91,122,104,0.12)",
                border: "none",
                borderRadius: 10,
                padding: "6px 10px",
                color: DEEP,
                fontFamily: PJS,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
              className="active:scale-95 transition-transform"
            >
              <ChevronLeft size={16} strokeWidth={2.4} />
              Pengaturan &amp; Bantuan
            </button>

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
                {initialAktif}
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
                  {guru?.nama || guruName}
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
                Guru Pendamping Khusus
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Building2 size={16} style={{ color: DEEP, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Sekolah</p>
                <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {guru?.sekolah || "SLB Negeri 1 Surakarta"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Briefcase size={16} style={{ color: DEEP, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Jabatan / Peran</p>
                <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                  {guru?.jabatan || "Guru Kelas / Wali Kelas"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mail size={16} style={{ color: DEEP, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Email Terdaftar</p>
                <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                  {guru?.email || "sari.dewi@gmail.com"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Phone size={16} style={{ color: DEEP, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>No. WhatsApp / HP</p>
                <p style={{ fontFamily: DMM, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                  {guru?.noHp || "081234567890"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Users size={16} style={{ color: DEEP, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: IPS, fontSize: 10, color: MUTED, margin: 0 }}>Kelas &amp; Kekhususan</p>
                <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>
                  {guru?.kelas && guru.kelas.length > 0 ? guru.kelas.join(", ") : "Kelas VI A"}
                  {guru?.abk && guru.abk.length > 0 ? ` (${guru.abk.join(", ")})` : " (Tunanetra)"}
                </p>
              </div>
            </div>
          </div>

          {/* Action List Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {onEditProfile && (
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

            {onGoStudents && (
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

            <button
              type="button"
              onClick={() => setView("settings")}
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
                  Pengaturan &amp; Bantuan
                </span>
              </div>
              <ChevronRight size={16} style={{ color: MUTED }} />
            </button>
          </div>

          {/* Web Dashboard Card */}
          <WebDashboardCard
            style={{ marginBottom: 12 }}
            onOpenWebDashboard={onOpenWebDashboard ? () => { onClose(); onOpenWebDashboard(); } : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(30,45,38,0.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: CARD, borderRadius: "24px 24px 0 0", padding: "16px 20px 28px", maxHeight: "90%", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        {/* Top Handle Bar */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#CBD5E1", margin: "0 auto 14px" }} />

        {/* Modal Header with Close 'X' Button on Right */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: PJS, margin: 0 }}>
            {role === "ortu" ? "Pengaturan & Akun Saya" : "Pengaturan & Bantuan"}
          </p>
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

        {/* Akun & Logout */}
        {role && (
          <div style={{ marginBottom: 18, padding: "14px 16px", background: BG, borderRadius: 16, border: `1.5px solid ${BDR}`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: SEC, display: "flex", alignItems: "center", justifyContent: "center", color: DEEP, fontWeight: 800, fontSize: 16 }}>
                  {initialAktif}
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, fontFamily: DMM, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 2px" }}>
                    {role === "guru" ? "Akun Guru Aktif" : "Akun Orang Tua (Wali Murid)"}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: PJS, margin: 0 }}>
                    {role === "guru" ? `Guru SLB (${guru?.nama || guruName})` : parentName}
                  </p>
                  {role === "ortu" && (
                    <p style={{ fontSize: 11.5, color: DEEP, fontFamily: IPS, margin: "2px 0 0", fontWeight: 600 }}>
                      {childName ? `Anak: ${childName}${childKelas ? ` (${childKelas})` : ""}` : "Belum terhubung ke data anak"}
                    </p>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: SEC, color: DEEP, fontFamily: IPS, border: `1px solid ${BDR}` }}>
                {role === "guru" ? "Guru" : "Orang Tua"}
              </span>
            </div>

            {/* Tombol Profil Guru (Membuka Tampilan Lengkap Profil Guru) */}
            {role === "guru" && (
              <button
                type="button"
                onClick={() => setView("profile")}
                style={{
                  width: "100%",
                  padding: "10px 13px",
                  borderRadius: 12,
                  border: `1.5px solid ${BDR}`,
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
                className="active:scale-[0.98] transition-all hover:border-[#5B7A68] hover:bg-[#F8FAF9]"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(91,122,104,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: DEEP }}>
                    <User size={17} strokeWidth={2.3} />
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ margin: 0, fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT }}>
                      Profil Guru
                    </p>
                    <p style={{ margin: "1px 0 0", fontFamily: IPS, fontSize: 11, color: MUTED }}>
                      Lihat rincian biodata, sekolah &amp; kontak
                    </p>
                  </div>
                </div>
                <ChevronRight size={17} style={{ color: MUTED }} />
              </button>
            )}

            {role === "guru" && onEditSetup && (
              <button
                type="button"
                onClick={() => { onClose(); onEditSetup(); }}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: `1px solid ${BDR}`, background: CARD, color: DEEP, fontFamily: IPS, fontSize: 12, fontWeight: 700, marginBottom: 10, cursor: "pointer", textAlign: "center" }}
              >
                ⚙ Ubah Peran &amp; Setup Ruang Belajar
              </button>
            )}

            {onLogout && !confirmLogout ? (
              <button
                type="button"
                onClick={() => setConfirmLogout(true)}
                style={{ width: "100%", padding: "10px", borderRadius: 12, border: "1.5px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", fontFamily: IPS, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
                className="active:scale-[0.98] transition-transform"
              >
                <LogOut size={16} strokeWidth={2.2} /> Keluar Akun
              </button>
            ) : onLogout ? (
              <div style={{ background: CARD, padding: 12, borderRadius: 12, border: "1.5px solid #FCA5A5", textAlign: "center" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 10, fontFamily: IPS }}>Apakah Anda yakin ingin keluar dari akun ini?</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => setConfirmLogout(false)} style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1px solid ${BDR}`, background: BG, fontSize: 12, fontWeight: 600, fontFamily: IPS, color: TEXT, cursor: "pointer" }}>
                    Batal
                  </button>
                  <button type="button" onClick={() => { onLogout(); onClose(); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: "#DC2626", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: IPS, cursor: "pointer" }}>
                    Ya, Keluar
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Gunakan Sareh Asih di Web (Khusus Pengaturan User Guru) */}
        {role === "guru" && (
          <WebDashboardCard
            style={{ marginBottom: 18 }}
            onOpenWebDashboard={onOpenWebDashboard ? () => { onClose(); onOpenWebDashboard(); } : undefined}
          />
        )}

        {/* Slider Pengatur Ukuran Teks */}
        <div style={{ marginBottom: 18, padding: "16px", background: BG, borderRadius: 18, border: `1.5px solid ${BDR}`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: DEEP, fontFamily: PJS, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ukuran Teks</p>
            <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: DMM, background: CARD, padding: "2px 8px", borderRadius: 8, border: `1px solid ${BDR}` }}>
              {Math.round(fontSize * 100)}%
            </span>
          </div>

          {/* Range Slider Geser Kiri Kanan */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 14px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: MUTED, fontFamily: PJS, minWidth: 16, textAlign: "center" }}>A</span>
            <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
              <input
                type="range"
                min="0.85"
                max="1.35"
                step="0.05"
                value={fontSize}
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 4,
                  accentColor: T,
                  cursor: "pointer",
                  outline: "none",
                  WebkitAppearance: "none",
                  background: `linear-gradient(to right, ${T} 0%, ${T} ${((fontSize - 0.85) / (1.35 - 0.85)) * 100}%, #D4E8DA ${((fontSize - 0.85) / (1.35 - 0.85)) * 100}%, #D4E8DA 100%)`
                }}
              />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: DEEP, fontFamily: PJS, minWidth: 20, textAlign: "center" }}>A</span>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            {([
              { v: 0.85, l: "Kecil" },
              { v: 1.0, l: "Normal" },
              { v: 1.15, l: "Besar" },
              { v: 1.30, l: "Sangat Besar" }
            ]).map(sz => (
              <button
                key={sz.v}
                onClick={() => setFontSize(sz.v)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: 12,
                  border: `1.5px solid ${Math.abs(fontSize - sz.v) < 0.03 ? T : BDR}`,
                  background: Math.abs(fontSize - sz.v) < 0.03 ? SEC : CARD,
                  color: Math.abs(fontSize - sz.v) < 0.03 ? DEEP : MUTED,
                  fontFamily: IPS,
                  fontSize: 11.5,
                  fontWeight: 700,
                  transition: "all 0.15s",
                  cursor: "pointer"
                }}
              >
                {sz.l}
              </button>
            ))}
          </div>

          {/* Live Preview Box */}
          <div style={{ marginTop: 12, padding: "10px 12px", background: CARD, borderRadius: 12, border: `1.5px solid ${BDR}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, fontFamily: DMM, textTransform: "uppercase", marginBottom: 3 }}>Pratinjau Teks</p>
            <p style={{ fontSize: `${13 * fontSize}px`, fontWeight: 600, color: TEXT, fontFamily: PJS, lineHeight: 1.4 }}>
              Sareh Asih: Mengenali & Mengembangkan Potensi Anak
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: `1px solid ${BDR}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tts ? <Volume2 size={20} style={{ color: T }} /> : <VolumeX size={20} style={{ color: MUTED }} />}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: IPS }}>Baca Layar (TTS)</p>
              <p style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>Bacakan konten layar dengan suara</p>
            </div>
          </div>
          <button onClick={() => setTts(!tts)}
            style={{ width: 48, height: 28, borderRadius: 14, background: tts ? T : BDR, transition: "background 0.2s", position: "relative", cursor: "pointer", border: "none", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: tts ? 22 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.18)", transition: "left 0.2s" }} />
          </button>
        </div>

        <div style={{ borderTop: `1px solid ${BDR}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: IPS, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Informasi</p>
          {INFO_PANELS.map(item => {
            const open = info === item.label;
            return (
              <div key={item.label}>
                <button onClick={() => setInfo(open ? null : item.label)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", width: "100%", minHeight: 44 }}>
                  <span style={{ color: T }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: TEXT, fontFamily: IPS }}>{item.label}</span>
                  <ChevronRight size={14} style={{ color: MUTED, marginLeft: "auto", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {open && (
                  <div style={{ background: BG, border: `1.5px solid ${BDR}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                    {item.body.map(b => (
                      <div key={b} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: T, fontSize: 12, lineHeight: 1.7 }}>•</span>
                        <p style={{ fontSize: 12, lineHeight: 1.7, color: TEXT, fontFamily: IPS, margin: 0 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
