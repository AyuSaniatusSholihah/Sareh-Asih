import { useState } from "react";
import { ArrowLeft, Phone, X } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM } from "../ui-kit";
import { type Role } from "../data";
import { GoogleMark } from "./illustrations";
import guruIcon from "@/imports/guru-icon.png";
import ortuIcon from "@/imports/ortu-icon.png";

export function GoogleLoginScreen({ role, onBack, onSuccess }: { role: Role; onBack: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const isGuru = role === "guru";

  const masuk = () => { setLoading(true); setTimeout(onSuccess, 900); };
  const masukFb = () => { setLoadingFb(true); setTimeout(onSuccess, 900); };

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneOk = phoneDigits.replace(/^0/, "").length >= 9 && phoneDigits.length <= 13;
  const masukPhone = () => {
    if (!phoneOk || loadingPhone || loading || loadingFb) return;
    setLoadingPhone(true); setTimeout(onSuccess, 900);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <div className="px-4 pt-2 pb-1">
        <button
          onClick={onBack}
          style={{
            minWidth: 40,
            minHeight: 40,
            background: CARD,
            border: `1.5px solid ${BDR}`,
            borderRadius: 14,
            boxShadow: "0 2px 8px rgba(91,122,104,0.12)",
          }}
          className="flex items-center justify-center transition-transform active:scale-95"
        >
          <ArrowLeft size={18} style={{ color: TEXT }} />
        </button>
      </div>

      <div className="px-5 pt-4 pb-8 flex flex-col items-center text-center">
        {/* Avatar */}
        <div
          style={{
            width: 76,
            height: 76,
            background: SEC,
            borderRadius: 24,
            border: `2px solid ${BDR}`,
            boxShadow: "0 6px 18px rgba(91,122,104,0.16)",
          }}
          className="flex items-center justify-center mb-4"
        >
          <img src={isGuru ? guruIcon : ortuIcon} alt={isGuru ? "Guru" : "Orang Tua"} className="w-12 h-12 object-contain" />
        </div>

        {/* Badge peran */}
        <p
          className="text-xs font-bold px-3.5 py-1 rounded-full mb-3"
          style={{
            background: SEC,
            color: DEEP,
            border: `1.5px solid ${BDR}`,
            boxShadow: "0 2px 6px rgba(91,122,104,0.10)",
            fontFamily: IPS,
          }}
        >
          {isGuru ? "Masuk sebagai Guru" : "Masuk sebagai Orang Tua"}
        </p>

        {/* Heading */}
        <h1 className="font-bold" style={{ fontFamily: PJS, fontSize: 22, color: TEXT, marginBottom: 6, lineHeight: 1.25 }}>
          Selamat Datang di<br />SarehAsih 👋
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: MUTED }}>
          {isGuru ? "Masuk untuk mengelola kelas dan pantau perkembangan siswa." : "Masuk untuk mendampingi perkembangan anak Anda."}
        </p>

        {/* ── Masuk dengan Nomor Telepon ── */}
        <div
          style={{
            width: "100%",
            background: CARD,
            border: `1.5px solid ${BDR}`,
            borderRadius: 20,
            padding: 16,
            boxShadow: "0 8px 24px rgba(91,122,104,0.12), 0 2px 6px rgba(0,0,0,0.04)",
            textAlign: "left",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: IPS, marginBottom: 8 }}>
            <Phone size={14} style={{ color: T }} /> Masuk dengan Nomor Telepon
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: `1.5px solid ${phoneOk ? "#10B981" : BDR}`,
              borderRadius: 14,
              padding: "0 10px",
              background: BG,
              minHeight: 50,
              boxShadow: "0 2px 6px rgba(91,122,104,0.06)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, fontFamily: IPS, borderRight: `1.5px solid ${BDR}`, paddingRight: 10, flexShrink: 0 }}>+62</span>
            <input value={phone} onChange={e => setPhone(e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric" autoComplete="tel" placeholder="8xx xxxx xxxx"
              style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", fontSize: 15, color: TEXT, fontFamily: DMM, letterSpacing: 0.5, minHeight: 48 }} />
            {phone.length > 0 && (
              <button onClick={() => setPhone("")} style={{ background: SEC, border: `1px solid ${BDR}`, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                <X size={12} style={{ color: DEEP }} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: MUTED, marginTop: 8, lineHeight: 1.45 }}>
            Kode verifikasi memakai WhatsApp/SMS ke nomor ini. Lanjutkan untuk membuat atau menautkan akun {isGuru ? "guru" : "orang tua"}.
            {phoneDigits && !phoneOk && (
              <span style={{ color: A, fontWeight: 600, display: "block", marginTop: 2 }}>Nomor belum valid — minimal 9 digit setelah kode negara.</span>
            )}
          </p>
          <button onClick={masukPhone} disabled={!phoneOk || loading || loadingFb || loadingPhone}
            style={{
              width: "100%", border: "none", minHeight: 50, borderRadius: 14, fontFamily: IPS, fontWeight: 800, fontSize: 14,
              marginTop: 10,
              background: phoneOk ? `linear-gradient(135deg, ${A} 0%, #C46F5F 100%)` : "#D9D6CE",
              color: phoneOk ? "#FFFFFF" : MUTED,
              boxShadow: phoneOk ? "0 6px 18px rgba(210,125,107,0.38)" : "none",
              cursor: phoneOk ? "pointer" : "not-allowed"
            }}
            className="flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
            {loadingPhone
              ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Mengirim kode…</>
              : <><Phone size={16} />Masuk dengan Nomor Telepon</>}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full my-5">
          <div style={{ flex: 1, height: 1, background: BDR }} />
          <span style={{ fontSize: 12, color: MUTED, fontFamily: IPS }}>atau lanjutkan dengan</span>
          <div style={{ flex: 1, height: 1, background: BDR }} />
        </div>

        {/* Tombol Google */}
        <button onClick={masuk} disabled={loading || loadingFb || loadingPhone}
          style={{
            width: "100%",
            background: CARD,
            border: `1.5px solid ${BDR}`,
            minHeight: 54,
            borderRadius: 16,
            color: TEXT,
            fontFamily: IPS,
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 12,
            boxShadow: "0 4px 14px rgba(91,122,104,0.10), 0 1px 3px rgba(0,0,0,0.04)"
          }}
          className="flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.99]">
          {loading
            ? <><span style={{ width: 16, height: 16, border: `2px solid ${BDR}`, borderTopColor: T, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Menghubungkan…</>
            : <><GoogleMark size={20} />Lanjutkan dengan Google</>}
        </button>

        {/* Tombol Facebook */}
        <button onClick={masukFb} disabled={loading || loadingFb || loadingPhone}
          style={{
            width: "100%",
            background: "#1877F2",
            border: "none",
            minHeight: 54,
            borderRadius: 16,
            color: "#fff",
            fontFamily: IPS,
            fontWeight: 700,
            fontSize: 15,
            boxShadow: "0 4px 14px rgba(24,119,242,0.28)"
          }}
          className="flex items-center justify-center gap-3 transition-all hover:opacity-90 active:scale-[0.99]">
          {loadingFb
            ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />Menghubungkan…</>
            : <>
              {/* Facebook icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Lanjutkan dengan Facebook
            </>}
        </button>

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

        <p className="text-xs leading-relaxed mt-5" style={{ color: MUTED }}>
          Dengan melanjutkan, Anda menyetujui{" "}
          <span style={{ color: T, fontWeight: 600 }}>Kebijakan Privasi</span> &{" "}
          <span style={{ color: T, fontWeight: 600 }}>Ketentuan Layanan</span>.
        </p>
      </div>
    </div>
  );
}
