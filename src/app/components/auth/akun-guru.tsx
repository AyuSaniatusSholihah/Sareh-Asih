import { useState } from "react";
import { CheckCircle, Pencil, User, Mail, Lock, Info, ChevronLeft, ArrowRight } from "lucide-react";
import { PJS, IPS } from "../ui-kit";
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

function ShieldCheckBadge({ size = 46 }: { size?: number }) {
  return (
    <div className="relative inline-flex items-center" style={{ width: size + 24, height: size + 4 }}>
      {/* Burst marks left */}
      <svg
        className="absolute"
        style={{ left: -10, top: 8 }}
        width="12"
        height="18"
        viewBox="0 0 12 18"
        fill="none"
      >
        <path d="M10 5L2 2" stroke="#244D3B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M11 12L3 14" stroke="#244D3B" strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      {/* Shield container */}
      <div
        style={{
          width: size,
          height: size,
          background: "#244D3B",
          borderRadius: "14px 14px 20px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(36, 77, 59, 0.22)",
        }}
      >
        <svg
          width={size * 0.52}
          height={size * 0.52}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Burst marks right */}
      <svg
        className="absolute"
        style={{ right: -8, top: 4 }}
        width="14"
        height="22"
        viewBox="0 0 14 22"
        fill="none"
      >
        <path d="M3 4L11 2" stroke="#244D3B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M3 11L12 11" stroke="#244D3B" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M3 18L11 20" stroke="#244D3B" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function KonfirmasiAkunScreen({
  profile,
  onNext,
  onBack,
}: {
  profile: GuruProfile;
  onNext: (p: { nama: string; email: string; jabatan: string; noHp: string }) => void;
  onBack?: () => void;
}) {
  const [nama, setNama] = useState(profile.nama);
  const [tempNama, setTempNama] = useState(profile.nama);
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
        onNext({
          nama: nama.trim(),
          email: profile.email,
          jabatan: profile.jabatan || "Guru Pendamping Khusus (GPK)",
          noHp: profile.noHp || "",
        });
      }, 600);
    }, 750);
  };

  const handleStartEdit = () => {
    setTempNama(nama);
    setEditNama(true);
  };

  const handleSaveEdit = () => {
    if (tempNama.trim()) {
      setNama(tempNama.trim());
      setEditNama(false);
    }
  };

  const handleCancelEdit = () => {
    setTempNama(nama);
    setEditNama(false);
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-y-auto"
      style={{
        fontFamily: IPS,
        background: "#F4F8F5",
        minHeight: "100%",
        position: "relative",
      }}
    >
      {/* ── Soft organic background shape top-right ── */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -30,
          width: 230,
          height: 220,
          borderRadius: "45% 55% 65% 35% / 40% 45% 55% 60%",
          background: "#E2ECE5",
          opacity: 0.65,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Top Bar with Circular Back Button ── */}
      <div
        style={{
          padding: "16px 20px 8px 20px",
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (onBack) onBack();
            else window.history.back();
          }}
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "1px solid #E1ECE5",
            boxShadow: "0 2px 8px rgba(36, 77, 59, 0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          className="active:scale-95 transition-transform"
          title="Kembali"
        >
          <ChevronLeft size={20} color="#244D3B" strokeWidth={2.4} />
        </button>
      </div>

      {/* ── Header Section ── */}
      <div
        style={{
          padding: "12px 24px 20px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: 14 }}
        >
          <ShieldCheckBadge size={46} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h1
            style={{
              fontFamily: PJS,
              fontSize: 28,
              fontWeight: 800,
              color: "#162C22",
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              margin: "0 0 8px 0",
            }}
          >
            Konfirmasi<br />Data Akun
          </h1>
          <p
            style={{
              fontFamily: IPS,
              fontSize: 14,
              color: "#5D7568",
              lineHeight: 1.45,
              margin: 0,
              maxWidth: 300,
            }}
          >
            Pastikan data berikut sudah benar sebelum melanjutkan.
          </p>
        </motion.div>
      </div>

      {/* ── Konten Form & Cards ── */}
      <div
        style={{
          padding: "4px 20px 32px 20px",
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Card 1: Nama Lengkap ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.28 }}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5ECE7",
            borderRadius: 20,
            padding: "16px 18px",
            marginBottom: 12,
            boxShadow: "0 2px 10px rgba(35, 77, 58, 0.04)",
          }}
        >
          {editNama ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#EFF5F1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <User size={19} color="#244D3B" strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: "#7D9285",
                      fontFamily: PJS,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    Edit Nama Lengkap
                  </span>
                  <input
                    autoFocus
                    value={tempNama}
                    onChange={e => setTempNama(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    placeholder="Nama lengkap Anda"
                    style={{
                      width: "100%",
                      border: "1.5px solid #244D3B",
                      borderRadius: 12,
                      padding: "8px 12px",
                      fontSize: 15.5,
                      fontFamily: PJS,
                      fontWeight: 700,
                      color: "#162C22",
                      background: "#F8FAF8",
                      outline: "none",
                      boxSizing: "border-box",
                      boxShadow: "0 0 0 3px rgba(36, 77, 59, 0.12)",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    background: "#F1F5F2",
                    border: "1px solid #D6E4DA",
                    color: "#6B8070",
                    borderRadius: 9999,
                    padding: "6px 14px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    fontFamily: IPS,
                    cursor: "pointer",
                  }}
                  className="active:scale-95 transition-transform"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!tempNama.trim()}
                  style={{
                    background: "#244D3B",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 9999,
                    padding: "6px 16px",
                    fontSize: 12.5,
                    fontWeight: 700,
                    fontFamily: IPS,
                    cursor: tempNama.trim() ? "pointer" : "not-allowed",
                    opacity: tempNama.trim() ? 1 : 0.6,
                  }}
                  className="active:scale-95 transition-transform"
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#EFF5F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <User size={19} color="#244D3B" strokeWidth={2.2} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: "#7D9285",
                    fontFamily: PJS,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    display: "block",
                    marginBottom: 3,
                  }}
                >
                  Nama Lengkap
                </span>
                <span
                  style={{
                    fontSize: 16.5,
                    fontWeight: 700,
                    color: "#162C22",
                    fontFamily: PJS,
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {nama || "—"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleStartEdit}
                style={{
                  background: "#E5EFE7",
                  border: "1px solid #D6E4DA",
                  borderRadius: 9999,
                  padding: "6px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                className="active:scale-95 transition-transform"
              >
                <Pencil size={13} color="#244D3B" strokeWidth={2.2} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#244D3B",
                    fontFamily: IPS,
                  }}
                >
                  Ubah
                </span>
              </button>
            </div>
          )}
        </motion.div>

        {/* ── Card 2: Alamat Email (Tidak dapat diubah) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.28 }}
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5ECE7",
            borderRadius: 20,
            padding: "16px 18px",
            marginBottom: 14,
            boxShadow: "0 2px 10px rgba(35, 77, 58, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#EFF5F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Mail size={19} color="#244D3B" strokeWidth={2.2} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: "#7D9285",
                  fontFamily: PJS,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "block",
                  marginBottom: 3,
                }}
              >
                Alamat Email
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#162C22",
                  fontFamily: PJS,
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {profile.email}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "#EFF4F1",
                borderRadius: 9999,
                padding: "5px 11px",
                border: "1px solid #E2EAE5",
                flexShrink: 0,
              }}
            >
              <Lock size={11} color="#788C80" strokeWidth={2.2} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#788C80",
                  fontFamily: IPS,
                  whiteSpace: "nowrap",
                }}
              >
                Tidak dapat diubah
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Info Box / Callout Alert ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.28 }}
          style={{
            background: "#EEF4F0",
            border: "1px solid rgba(139, 176, 152, 0.32)",
            borderRadius: 18,
            padding: "13px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <Info size={19} color="#244D3B" strokeWidth={2.2} />
          </div>
          <div
            style={{
              width: 1,
              height: 32,
              background: "#D1E1D7",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: 12.5,
              color: "#304D3F",
              lineHeight: 1.5,
              fontFamily: IPS,
              margin: 0,
              fontWeight: 500,
            }}
          >
            Alamat email digunakan untuk masuk dan menerima pemberitahuan. Email tidak dapat diubah setelah akun dibuat.
          </p>
        </motion.div>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Tombol CTA Utama ── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.28 }}
          type="button"
          onClick={handleConfirm}
          disabled={!valid || isSaving || isSaved}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 9999,
            background: isSaved
              ? "#10B981"
              : isSaving
              ? "#1E4233"
              : valid
              ? "#244D3B"
              : "#CBD5E1",
            color: "#FFFFFF",
            border: "none",
            cursor: valid && !isSaving && !isSaved ? "pointer" : "not-allowed",
            boxShadow: isSaved
              ? "0 8px 24px rgba(16, 185, 129, 0.35)"
              : valid
              ? "0 8px 24px rgba(36, 77, 59, 0.28)"
              : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: isSaving ? "center" : "space-between",
            padding: "0 22px",
            transition: "all 0.3s ease",
          }}
          className="active:scale-[0.98]"
        >
          {isSaving ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  border: "2.5px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15.5 }}>
                Menyimpan…
              </span>
            </div>
          ) : isSaved ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", gap: 8 }}>
              <CheckCircle size={20} color="#fff" strokeWidth={2.4} />
              <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15.5 }}>
                Data Tersimpan!
              </span>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle size={22} color="#FFFFFF" strokeWidth={2.4} />
                <span
                  style={{
                    fontFamily: PJS,
                    fontWeight: 700,
                    fontSize: 15.5,
                    color: "#FFFFFF",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Ya, Data Sudah Benar
                </span>
              </div>
              <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.4} />
            </>
          )}
        </motion.button>

        {/* ── Subtext Footer ── */}
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#748A7E",
            marginTop: 14,
            marginBottom: 0,
            fontFamily: IPS,
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
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

