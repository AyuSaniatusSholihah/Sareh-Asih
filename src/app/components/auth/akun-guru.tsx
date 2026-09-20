import { useState } from "react";
import { Briefcase, Phone, CheckCircle, ArrowLeft } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, Field } from "../ui-kit";
import { ModalShell } from "./modal-shell";
import { GoogleMark } from "./illustrations";

// ─── GURU: POP-UP 1 — Konfirmasi akun Google ──────────────────────────
export interface GuruProfile {
  nama: string;
  email: string;
  sekolah: string;
  jabatan: string;           // SRS-F-002: posisi/jabatan guru
  noHp: string;              // SRS-F-002: nomor HP (opsional)
  kelas: string[];           // derived from kelasAbkMap keys
  abk: string[];             // derived from kelasAbkMap values (unique)
  kelasAbkMap: Record<string, string>; // "VII A" → "Tunanetra"
}

// SRS-F-002: Profil guru lengkap — nama, email, jabatan, noHp
export function AkunGuruModal({
  profile,
  onNext,
  onClose,
}: {
  profile: GuruProfile;
  onNext: (p: { nama: string; email: string; jabatan: string; noHp: string }) => void;
  onClose?: () => void;
}) {
  const [nama, setNama] = useState(profile.nama);
  const [email, setEmail] = useState(profile.email);
  const [jabatan, setJabatan] = useState(profile.jabatan || "");
  const [noHp, setNoHp] = useState(profile.noHp || "");
  const [edit, setEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const valid = nama.trim() !== "" && email.trim() !== "" && jabatan.trim() !== "";

  const JABATAN_OPTIONS = [
    "Guru Kelas", "Guru Mata Pelajaran", "Guru Pendamping Khusus (GPK)",
    "Kepala Sekolah", "Wali Kelas", "Terapis", "Konselor",
  ];

  return (
    <ModalShell
      step={1}
      total={3}
      title="Konfirmasi Profil Anda"
      desc="Data diambil dari akun Google. Lengkapi jabatan untuk melanjutkan."
      onClose={onClose}
    >
      {/* Google badge */}
      <div style={{ background: SEC, border: `1px solid rgba(91,122,104,0.2)` }} className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
        <GoogleMark size={18} />
        <p className="text-xs leading-relaxed" style={{ color: DEEP, fontFamily: IPS }}>Terhubung dengan Google — Anda tidak perlu mengingat kata sandi baru.</p>
      </div>

      <div className="space-y-3">
        {/* Nama & email — tampil/edit */}
        {edit ? (
          <>
            <Field label="Nama Lengkap" placeholder="Sari Dewi, S.Pd." value={nama} onChange={setNama} required />
            <Field label="Email" placeholder="nama@gmail.com" value={email} onChange={setEmail} type="email" required />
          </>
        ) : (
          <div className="space-y-2">
            {([["Nama Lengkap", nama], ["Email", email]] as [string, string][]).map(([l, v]) => (
              <div key={l} style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.35)`, borderRadius: 16, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }} className="px-4 py-3">
                <p style={{ fontSize: 11, fontWeight: 800, color: DEEP, fontFamily: PJS, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: PJS, marginTop: 3 }}>{v || "—"}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setEdit(!edit)} className="text-xs font-semibold" style={{ color: T, fontFamily: IPS, minHeight: 36 }}>
          {edit ? "✓ Selesai mengubah" : "✎ Ubah nama atau email"}
        </button>

        {/* Jabatan — wajib (SRS-F-002) */}
        <div>
          <label className="text-xs font-semibold block mb-1.5" style={{ color: TEXT, fontFamily: IPS }}>
            <Briefcase size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
            Jabatan / Peran <span style={{ color: "#B91C1C" }}>*</span>
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {JABATAN_OPTIONS.map(j => (
              <button key={j} onClick={() => setJabatan(j)}
                style={{
                  padding: "6px 12px", borderRadius: 14, fontSize: 12, fontWeight: 600, fontFamily: IPS,
                  background: jabatan === j ? SEC : CARD,
                  border: `1.5px solid ${jabatan === j ? T : BDR}`,
                  color: jabatan === j ? DEEP : MUTED, cursor: "pointer", transition: "all 0.15s"
                }}>
                {j}
              </button>
            ))}
          </div>
        </div>

        {/* No HP — opsional (SRS-F-002) */}
        <div>
          <label className="text-xs font-semibold block mb-1" style={{ color: TEXT, fontFamily: IPS }}>
            <Phone size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
            Nomor HP <span style={{ color: MUTED, fontWeight: 400 }}>(opsional)</span>
          </label>
          <input
            type="tel" value={noHp} onChange={e => setNoHp(e.target.value)}
            placeholder="08xxxxxxxxxx"
            style={{ width: "100%", border: `1.5px solid ${BDR}`, borderRadius: 12, padding: "10px 12px", fontSize: 14, color: TEXT, fontFamily: IPS, background: BG, outline: "none", minHeight: 44 }}
          />
        </div>
      </div>

      <div className="flex gap-2.5 mt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              border: `2px solid ${DEEP}`,
              color: DEEP,
              fontFamily: PJS,
              fontWeight: 700,
              fontSize: 14,
              minHeight: 52,
              background: CARD,
              borderRadius: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            className="active:scale-[0.98] transition-all"
          >
            <ArrowLeft size={15} />
            <span>Kembali</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (!valid || isSaving || isSaved) return;
            setIsSaving(true);
            setTimeout(() => {
              setIsSaving(false);
              setIsSaved(true);
              setTimeout(() => {
                onNext({ nama: nama.trim(), email: email.trim(), jabatan, noHp: noHp.trim() });
              }, 700);
            }, 600);
          }}
          disabled={!valid || isSaving || isSaved}
          style={{
            flex: onClose ? 2 : 1,
            background: isSaved ? "#10B981" : isSaving ? DEEP : valid ? A : "#D1D5DB",
            color: "#fff",
            fontFamily: PJS,
            fontWeight: 700,
            fontSize: 15,
            minHeight: 52,
            borderRadius: 16,
            border: "none",
            cursor: valid && !isSaving && !isSaved ? "pointer" : "not-allowed",
            boxShadow: isSaved ? "0 6px 20px rgba(16,185,129,0.42)" : valid ? "0 6px 20px rgba(210,125,107,0.42)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.25s ease",
          }}
          className="active:scale-[0.98] transition-all"
        >
          {isSaving ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              Menyimpan Akun…
            </>
          ) : isSaved ? (
            <>
              <CheckCircle size={18} strokeWidth={2.6} />
              Data Akun Disimpan!
            </>
          ) : (
            "Lanjut ke Profil Sekolah →"
          )}
        </button>
      </div>
    </ModalShell>
  );
}
