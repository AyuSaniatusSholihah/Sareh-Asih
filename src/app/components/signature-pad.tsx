import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { PenLine, Trash2 } from "lucide-react";
import { DEEP, MUTED, PJS, IPS } from "./ui-kit";

interface SignaturePadProps {
  /** Data URL PNG hasil goresan; "" bila belum ada tanda tangan. */
  value: string;
  onChange: (dataUrl: string) => void;
  tinggi?: number;
}

/**
 * Kanvas tanda tangan (tangan bebas) berbasis pointer events — mouse & sentuh.
 * Hasil goresan dikirim sebagai data URL PNG pada saat pena diangkat.
 */
export function SignaturePad({ value, onChange, tinggi = 128 }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const terakhirKirim = useRef<string>("");
  const sedangGambar = useRef(false);
  const [kosong, setKosong] = useState(!value);

  const bersihkan = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
  }, []);

  const ukurUlang = useCallback(() => {
    const c = canvasRef.current;
    if (!c || c.clientWidth === 0) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.max(1, Math.round(c.clientWidth * dpr));
    c.height = Math.max(1, Math.round(c.clientHeight * dpr));
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2E3E35";
    ctx.lineWidth = 2.2;
  }, []);

  /** Gambar ulang dari data URL (dipakai saat muat awal / perubahan ukuran layar). */
  const gambarUlang = useCallback((src: string) => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const lebar = c.width / dpr;
    const tinggiC = c.height / dpr;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const skala = Math.min(lebar / img.width, tinggiC / img.height);
      const w = img.width * skala;
      const h = img.height * skala;
      ctx.drawImage(img, (lebar - w) / 2, (tinggiC - h) / 2, w, h);
    };
    img.src = src;
  }, []);

  // Ukur kanvas saat pertama kali tampil
  useEffect(() => {
    ukurUlang();
    const onResize = () => {
      ukurUlang();
      gambarUlang(terakhirKirim.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ukurUlang, gambarUlang]);

  // Sinkronkan kanvas dengan nilai dari luar (mis. data tersimpan di perangkat)
  useEffect(() => {
    setKosong(!value);
    if (value === terakhirKirim.current) return;
    terakhirKirim.current = value;
    ukurUlang();
    gambarUlang(value);
  }, [value, ukurUlang, gambarUlang]);

  const koordinat = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const mulaiGores = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    try { c.setPointerCapture(e.pointerId); } catch { /* abaikan */ }
    sedangGambar.current = true;
    const { x, y } = koordinat(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.01, y + 0.01);
    ctx.stroke();
    e.preventDefault();
  };

  const lanjutGores = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!sedangGambar.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = koordinat(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    e.preventDefault();
  };

  const akhiriGores = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!sedangGambar.current) return;
    sedangGambar.current = false;
    try { canvasRef.current?.releasePointerCapture(e.pointerId); } catch { /* abaikan */ }
    const c = canvasRef.current;
    if (!c) return;
    const src = c.toDataURL("image/png");
    terakhirKirim.current = src;
    setKosong(false);
    onChange(src);
  };

  const hapus = () => {
    sedangGambar.current = false;
    bersihkan();
    terakhirKirim.current = "";
    setKosong(true);
    onChange("");
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          border: "1.5px dashed #C7D6CC",
          borderRadius: 14,
          background: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={mulaiGores}
          onPointerMove={lanjutGores}
          onPointerUp={akhiriGores}
          onPointerCancel={akhiriGores}
          style={{
            display: "block",
            width: "100%",
            height: tinggi,
            touchAction: "none",
            cursor: "crosshair",
            background:
              "linear-gradient(transparent calc(100% - 30px), #E2E8F0 calc(100% - 30px), #E2E8F0 calc(100% - 29px), transparent calc(100% - 29px))",
          }}
        />
        {kosong && (
          <p
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              margin: 0,
              pointerEvents: "none",
              color: MUTED,
              fontFamily: IPS,
              fontSize: 11.5,
            }}
          >
            <PenLine size={14} />
            Tanda tangan di sini
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 7 }}>
        <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: 0 }}>
          {kosong ? "Gambar tanda tangan dengan jari atau stylus." : "Tanda tangan tersimpan otomatis."}
        </p>
        <button
          type="button"
          onClick={hapus}
          disabled={kosong}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            border: "1.5px solid #E2E8F0",
            background: "#F8FAFC",
            color: kosong ? "#94A3B8" : "#DC2626",
            borderRadius: 9,
            padding: "5px 10px",
            fontFamily: PJS,
            fontSize: 11,
            fontWeight: 700,
            cursor: kosong ? "default" : "pointer",
            opacity: kosong ? 0.65 : 1,
          }}
          className={kosong ? "" : "active:scale-95 transition-transform"}
        >
          <Trash2 size={12} />
          {kosong ? "Belum ada tanda tangan" : "Hapus / Gambar Ulang"}
        </button>
      </div>
      <p style={{ fontFamily: PJS, fontSize: 10.5, color: DEEP, margin: "6px 2px 0", fontWeight: 700 }}>
        Tanda tangan ini ikut tercetak di kolom “Paraf Guru” tiap halaman laporan.
      </p>
    </div>
  );
}
