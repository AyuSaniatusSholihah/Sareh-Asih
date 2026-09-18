import { useState } from "react";
import { ArrowLeft, CheckCircle, Hash, XCircle, Key, Info } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, PJS, IPS, DMM } from "../ui-kit";

// ─── ORANG TUA: Kode akses (dengan opsi lewati) ───────────────────────
export function ParentCodeScreen({
  onBack,
  onLinked,
  onSkip,
  namaOrtu,
}: {
  onBack: () => void;
  onLinked: (kode: string) => void;
  onSkip: () => void;
  namaOrtu: string;
}) {
  const [kode, setKode] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    const k = kode.trim().toUpperCase();
    if (k === "") {
      setErr("Kode akses belum diisi.");
      return;
    }
    if (!/^ABK-\d{4}-[A-Z]+$/.test(k)) {
      setErr("Kode tidak valid atau sudah kedaluwarsa. Hubungi guru pendamping anak Anda.");
      return;
    }
    onLinked(k);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <div className="px-4 pt-2 pb-1">
        <button onClick={onBack} style={{ minWidth: 44, minHeight: 44 }} className="flex items-center justify-center rounded-2xl">
          <ArrowLeft size={20} style={{ color: TEXT }} />
        </button>
      </div>

      <div className="px-5 pb-8">
        <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-5">
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: A, color: "#fff", fontFamily: PJS, fontWeight: 700, flexShrink: 0 }} className="flex items-center justify-center text-sm">
            {namaOrtu[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: TEXT }}>Halo, {namaOrtu.split(" ")[0]} 👋</p>
            <p className="text-xs" style={{ color: MUTED }}>Berhasil masuk dengan Google</p>
          </div>
          <CheckCircle size={18} style={{ color: T, flexShrink: 0 }} />
        </div>

        <h1 className="font-bold" style={{ fontFamily: PJS, fontSize: 23, color: TEXT, marginBottom: 6 }}>Hubungkan dengan Anak Anda</h1>
        <p className="text-sm leading-relaxed mb-5" style={{ color: MUTED }}>
          Masukkan kode akses dari guru pendamping untuk melihat perkembangan anak.
        </p>

        <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: TEXT }}>Kode Akses Anak</label>
            <div className="relative">
              <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
              <input value={kode} onChange={e => { setKode(e.target.value); setErr(""); }}
                placeholder="ABK-2025-RAFI"
                style={{ width: "100%", border: `1.5px solid ${err ? "#B91C1C" : BDR}`, borderRadius: 12, padding: "12px 12px 12px 36px", fontSize: 15, color: TEXT, fontFamily: DMM, background: BG, outline: "none", minHeight: 50, letterSpacing: "0.08em", textTransform: "uppercase" }} />
            </div>
            {err && (
              <div className="mt-2 rounded-xl p-3 flex items-start gap-2" style={{ background: "#FEF2F2" }}>
                <XCircle size={13} style={{ color: "#B91C1C", flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs leading-relaxed" style={{ color: "#B91C1C" }}>{err}</p>
              </div>
            )}
          </div>

          <button onClick={submit}
            style={{ width: "100%", background: A, color: "#fff", fontFamily: IPS, minHeight: 50 }}
            className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
            <Key size={15} />Hubungkan Sekarang
          </button>

          <p className="text-xs text-center" style={{ color: MUTED }}>Contoh kode aktif: <strong style={{ fontFamily: DMM, color: T }}>ABK-2025-RAFI</strong></p>
        </div>

        {/* Opsi masuk tanpa kode */}
        <div className="flex items-center gap-3 my-5">
          <div style={{ height: 1, flex: 1, background: BDR }} />
          <span className="text-xs" style={{ color: MUTED }}>atau</span>
          <div style={{ height: 1, flex: 1, background: BDR }} />
        </div>

        <button onClick={onSkip}
          style={{ width: "100%", background: CARD, border: `1.5px solid ${T}`, color: T, fontFamily: IPS, minHeight: 50 }}
          className="rounded-2xl text-sm font-bold">
          Masuk Tanpa Kode Akses
        </button>

        <div style={{ background: SEC, border: `1px solid rgba(91,122,104,0.2)` }} className="rounded-2xl p-3.5 flex items-start gap-2.5 mt-3">
          <Info size={14} style={{ color: T, flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: T }}>
            Tanpa kode, Anda tetap bisa membuka <strong>kalender event & lomba ABK</strong> serta <strong>info pelatihan dan terapi terdekat</strong>. Kode bisa dimasukkan kapan saja dari halaman Beranda.
          </p>
        </div>
      </div>
    </div>
  );
}
