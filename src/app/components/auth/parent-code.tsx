import { useState } from "react";
import { ArrowLeft, CheckCircle, Hash, XCircle, Key, Info, X } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, PJS, IPS, DMM } from "../ui-kit";
import { KODE_ORTU_REGEX } from "../data";

// ─── ORANG TUA: Kode akses (dengan opsi lewati) ───────────────────────
export function ParentCodeScreen({
  onBack,
  onLinked,
  onEnter,
  onSkip,
  namaOrtu,
}: {
  onBack: () => void;
  onLinked: (kode: string) => { id: number; nama: string } | null;
  onEnter: (id: number) => void;
  onSkip: () => void;
  namaOrtu: string;
}) {
  const [kode, setKode] = useState("");
  const [err, setErr] = useState("");
  const [sukses, setSukses] = useState<{ id: number; nama: string } | null>(null);

  const submit = () => {
    const k = kode.trim().toUpperCase();
    if (k === "") {
      setErr("Kode akses belum diisi.");
      return;
    }
    if (!KODE_ORTU_REGEX.test(k)) {
      setErr("Kode tidak valid atau sudah kedaluwarsa. Hubungi guru kelas atau pendamping anak Anda.");
      return;
    }
    const hasil = onLinked(k);
    if (!hasil) {
      setErr("Kode tidak dikenali. Pastikan kode sesuai yang diberikan guru kelas atau pendamping.");
      return;
    }
    setSukses(hasil);
  };

  return (
    <div className="relative flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* Pop-up Notifikasi Berhasil */}
      {sukses && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => {
            setSukses(null);
            setKode("");
          }}
        >
          {/* Backdrop Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(46, 62, 53, 0.5)",
              backdropFilter: "blur(3px)",
            }}
          />

          {/* Modal Pop-up Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 360,
              background: CARD,
              borderRadius: 24,
              border: `1px solid ${BDR}`,
              boxShadow: "0 20px 40px -10px rgba(46, 62, 53, 0.25)",
              padding: "24px 20px 20px",
              textAlign: "center",
            }}
          >
            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={() => {
                setSukses(null);
                setKode("");
              }}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#F1F5F9",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
              }}
              className="active:scale-95 transition-transform"
              title="Tutup"
            >
              <X size={16} strokeWidth={2.4} />
            </button>

            {/* Ikon Sukses */}
            <div
              style={{
                width: 68,
                height: 68,
                background: SEC,
                borderRadius: "50%",
                margin: "4px auto 14px",
              }}
              className="flex items-center justify-center"
            >
              <CheckCircle size={34} style={{ color: T }} strokeWidth={2.2} />
            </div>

            {/* Judul Notifikasi */}
            <h2
              className="font-bold mb-2"
              style={{ fontFamily: PJS, fontSize: 19, color: TEXT }}
            >
              {sukses.nama} berhasil ditambahkan!
            </h2>

            {/* Deskripsi */}
            <p
              className="text-xs leading-relaxed mb-6"
              style={{ color: MUTED, fontFamily: IPS }}
            >
              Anda dapat menambahkan anak lain setelah masuk ke Beranda.
            </p>

            {/* Tombol Masuk ke Beranda */}
            <button
              type="button"
              onClick={() => onEnter(sukses.id)}
              style={{
                width: "100%",
                background: A,
                color: "#fff",
                fontFamily: IPS,
                minHeight: 48,
              }}
              className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-sm"
            >
              Masuk ke Beranda
            </button>

            {/* Tombol Tambah Anak Lain */}
            <button
              type="button"
              onClick={() => {
                setSukses(null);
                setKode("");
              }}
              style={{
                width: "100%",
                color: T,
                fontFamily: IPS,
                minHeight: 38,
                background: "transparent",
              }}
              className="text-xs font-semibold mt-1.5 active:opacity-80 transition-opacity"
            >
              Tambah Anak Lain
            </button>
          </div>
        </div>
      )}
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
            <p className="text-xs" style={{ color: MUTED }}>Berhasil masuk</p>
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
                placeholder="Masukkan kode akses"
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
            Anda dapat <strong>menambahkan anak lain</strong> setelah masuk ke Beranda. Satu akun orang tua bisa terhubung ke banyak anak sekaligus.
          </p>
        </div>
      </div>
    </div>
  );
}
