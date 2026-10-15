import { useState } from "react";
import { CheckCircle, Edit3, User, Mail, Lock, Info, ShieldCheck } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS } from "../ui-kit";
import { motion } from "motion/react";

// ─── GURU: Full Page — Konfirmasi nama & email setelah login ───────────────
export interface GuruProfile {
  nama: string;
  email: string;
  sekolah: string;
  jabatan: string;
  noHp: string;
  kelas: string[];
  abk: string[];
  kelasAbkMap: Record<string, string>;
  teacherRole?: import("../role-labels").TeacherRole;
  namaRuangBelajar?: string;
  setupDone?: boolean;
  kelasKekhususan?: string[];
}

export function KonfirmasiAkunScreen({
  profile,
  onNext,
}: {
  profile: GuruProfile;
  onNext: (p: { nama: string; email: string; jabatan: string; noHp: string }) => void;
}) {
  const [nama, setNama] = useState(profile.nama);
  const [editNama, setEditNama] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const valid = nama.trim() !== "";

  const handleConfirm = () => {
    if (!valid || isSaving || isSaved) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        onNext({ nama: nama.trim(), email: profile.email, jabatan: "Guru Pendamping Khusus (GPK)", noHp: "" });
      }, 700);
    }, 800);
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ fontFamily: IPS, background: BG, minHeight: "100%" }}
    >
      {/* ── Header Hijau ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #1F3A2B 0%, #2E5537 100%)",
          paddingTop: 72,
          paddingBottom: 36,
          paddingLeft: 24,
          paddingRight: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dekorasi */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", top: 10, right: 60, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            width: 54, height: 54,
            borderRadius: 18,
            background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <ShieldCheck size={28} color="#fff" strokeWidth={1.8} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.32 }}
        >
          <h1 style={{
            fontFamily: PJS, fontSize: 26, fontWeight: 800,
            color: "#fff", lineHeight: 1.2, letterSpacing: "-0.4px", margin: 0,
          }}>
            Konfirmasi Data Akun
          </h1>
          <p style={{
            fontFamily: IPS, fontSize: 13.5, color: "rgba(255,255,255,0.72)",
            marginTop: 8, lineHeight: 1.5, margin: "8px 0 0",
          }}>
            Pastikan data berikut sudah benar sebelum melanjutkan.
          </p>
        </motion.div>
      </div>

      {/* ── Konten ── */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "24px 20px 40px" }}>

        {/* ── Card Nama ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{
            background: CARD,
            border: `1.5px solid ${BDR}`,
            borderRadius: 20,
            padding: "16px 18px",
            marginBottom: 12,
            boxShadow: "0 2px 10px rgba(91,122,104,0.07)",
          }}
        >
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <User size={13} color={MUTED} strokeWidth={2} />
            <span style={{ fontSize: 10.5, fontWeight: 800, color: MUTED, fontFamily: PJS, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Nama Lengkap
            </span>
          </div>

          {editNama ? (
            <div>
              <input
                autoFocus
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Nama lengkap Anda"
                style={{
                  width: "100%",
                  border: `2px solid ${T}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 16,
                  fontFamily: PJS,
                  fontWeight: 700,
                  color: TEXT,
                  background: BG,
                  outline: "none",
                  boxSizing: "border-box",
                  boxShadow: `0 0 0 3px ${T}18`,
                  marginBottom: 10,
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setEditNama(false)}
                  style={{
                    background: "#F1F5F2", border: `1.5px solid ${BDR}`,
                    color: MUTED, borderRadius: 10,
                    padding: "7px 14px", fontSize: 12.5,
                    fontWeight: 700, fontFamily: IPS, cursor: "pointer",
                  }}
                  className="active:scale-95 transition-transform"
                >
                  Batal
                </button>
                <button
                  onClick={() => setEditNama(false)}
                  style={{
                    background: T, color: "#fff",
                    border: "none", borderRadius: 10,
                    padding: "7px 18px", fontSize: 12.5,
                    fontWeight: 700, fontFamily: IPS, cursor: "pointer",
                  }}
                  className="active:scale-95 transition-transform"
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: TEXT, fontFamily: PJS }}>
                {nama || "—"}
              </span>
              <button
                onClick={() => setEditNama(true)}
                style={{
                  background: SEC, border: `1.5px solid ${BDR}`,
                  borderRadius: 10, padding: "6px 13px",
                  display: "flex", alignItems: "center", gap: 5,
                  cursor: "pointer", flexShrink: 0,
                }}
                className="active:scale-95 transition-transform"
              >
                <Edit3 size={12} color={DEEP} strokeWidth={2.2} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: DEEP, fontFamily: IPS }}>Ubah</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Card Email (tidak dapat diubah) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27, duration: 0.3 }}
          style={{
            background: CARD,
            border: `1.5px solid ${BDR}`,
            borderRadius: 20,
            padding: "16px 18px",
            marginBottom: 14,
            boxShadow: "0 2px 10px rgba(91,122,104,0.07)",
          }}
        >
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Mail size={13} color={MUTED} strokeWidth={2} />
            <span style={{ fontSize: 10.5, fontWeight: 800, color: MUTED, fontFamily: PJS, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Alamat Email
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15.5, fontWeight: 600, color: TEXT, fontFamily: IPS }}>
              {profile.email}
            </span>
            {/* Badge tidak dapat diubah */}
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "#F1F5F2", borderRadius: 10,
              padding: "5px 10px", flexShrink: 0,
              border: `1px solid ${BDR}`,
            }}>
              <Lock size={11} color={MUTED} strokeWidth={2.2} />
              <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, fontFamily: IPS, whiteSpace: "nowrap" }}>
                Tidak dapat diubah
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Info email ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34, duration: 0.3 }}
          style={{
            background: "#EDF3F0",
            border: `1px solid rgba(91,122,104,0.2)`,
            borderRadius: 14,
            padding: "11px 14px",
            display: "flex", alignItems: "flex-start", gap: 9,
            marginBottom: 32,
          }}
        >
          <Info size={15} color={T} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12.5, color: T, lineHeight: 1.55, fontFamily: IPS, margin: 0, fontWeight: 500 }}>
            Alamat email digunakan untuk masuk dan menerima pemberitahuan. Email tidak dapat diubah setelah akun dibuat.
          </p>
        </motion.div>

        {/* ── Tombol Konfirmasi ── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          type="button"
          onClick={handleConfirm}
          disabled={!valid || isSaving || isSaved}
          style={{
            width: "100%",
            background: isSaved
              ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
              : isSaving
              ? "#2E5537"
              : valid
              ? "linear-gradient(135deg, #2E5537 0%, #3D6B4A 100%)"
              : "#D1D5DB",
            color: "#fff",
            fontFamily: PJS,
            fontWeight: 800,
            fontSize: 16,
            minHeight: 58,
            borderRadius: 20,
            border: "none",
            cursor: valid && !isSaving && !isSaved ? "pointer" : "not-allowed",
            boxShadow: isSaved
              ? "0 8px 24px rgba(16,185,129,0.40)"
              : valid
              ? "0 8px 24px rgba(46,85,55,0.30)"
              : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.3s ease",
            letterSpacing: "-0.2px",
          }}
          className="active:scale-[0.98]"
        >
          {isSaving ? (
            <>
              <span style={{
                width: 18, height: 18,
                border: "2.5px solid rgba(255,255,255,0.35)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }} />
              Menyimpan…
            </>
          ) : isSaved ? (
            <>
              <CheckCircle size={20} strokeWidth={2.5} />
              Data Tersimpan!
            </>
          ) : (
            <>
              <CheckCircle size={20} strokeWidth={2.2} />
              Ya, Data Sudah Benar
            </>
          )}
        </motion.button>

        <p style={{
          textAlign: "center", fontSize: 12, color: MUTED,
          marginTop: 14, fontFamily: IPS, lineHeight: 1.5,
        }}>
          Nama dapat diubah melalui pengaturan profil.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

// Alias backward-compat
export function AkunGuruModal({
  profile,
  onNext,
  onClose: _onClose,
}: {
  profile: GuruProfile;
  onNext: (p: { nama: string; email: string; jabatan: string; noHp: string }) => void;
  onClose?: () => void;
}) {
  return <KonfirmasiAkunScreen profile={profile} onNext={onNext} />;
}
