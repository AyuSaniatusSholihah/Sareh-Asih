import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CARD, PJS, IPS } from "../ui-kit";
import { type Role, type Screen } from "../data";

export type CoachDef = {
  id: string;
  role: Role;
  screen: Screen;
  target: string; // nilai atribut data-cm pada elemen yang disorot
  radius: number; // radius ring mengikuti radius elemen target
  text: string;   // maksimal satu baris, diawali kata kerja
  entry?: boolean; // true: tampil saat pengguna awal masuk layar (tanpa perlu klik tab dulu)
};

export const COACH_MARKS: CoachDef[] = [
  {
    id: "guru_asesmen",
    role: "guru",
    screen: "dashboard",
    target: "guru-periksa-asesmen",
    radius: 24,
    text: "Mulai dari sini: periksa asesmen yang menunggu.",
    entry: true,
  },
  {
    id: "guru_tambah_siswa",
    role: "guru",
    screen: "students",
    target: "guru-tambah-siswa",
    radius: 26,
    text: "Tambah siswa untuk memulai.",
  },
  {
    id: "guru_bakat",
    role: "guru",
    screen: "talent-map",
    target: "guru-bakat-kelompok",
    radius: 14,
    text: "Lihat hasil asesmen",
  },
  {
    id: "guru_agenda",
    role: "guru",
    screen: "competition",
    target: "guru-agenda-lomba",
    radius: 22,
    text: "Lomba disarankan sesuai bakat siswa.",
  },
  {
    id: "guru_petunjuk_asesmen",
    role: "guru",
    screen: "observation",
    target: "guru-asesmen-petunjuk",
    radius: 999,
    text: "Ketuk untuk lihat arti skala penilaian.",
  },
  {
    id: "guru_laporan",
    role: "guru",
    screen: "report",
    target: "guru-laporan-periksa",
    radius: 30,
    text: "Periksa laporan sebelum dikirim.",
  },
  {
    id: "ortu_laporan",
    role: "ortu",
    screen: "parent-dashboard",
    target: "ortu-baca-laporan",
    radius: 14,
    text: "Laporan dari guru muncul di sini.",
    entry: true,
  },
  {
    id: "ortu_saran_rumah",
    role: "ortu",
    screen: "parent-dashboard",
    target: "ortu-saran-guru",
    radius: 18,
    text: "Saran harian dari guru pendamping.",
    entry: true,
  },
  {
    id: "ortu_minat_bakat",
    role: "ortu",
    screen: "parent-detail",
    target: "ortu-minat-bakat",
    radius: 20,
    text: "Lihat minat, bakat, dan asesmen anak.",
  },
];

const CM_PREFIX = "sareh_asih_cm_v2_";

export function isCoachSeen(id: string): boolean {
  try {
    return sessionStorage.getItem(CM_PREFIX + id) === "1";
  } catch {
    return false;
  }
}

export function markCoachSeen(id: string): void {
  try {
    sessionStorage.setItem(CM_PREFIX + id, "1");
  } catch {
    /* sessionStorage tidak tersedia — abaikan */
  }
}

export type CoachRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  frameW: number;
  frameH: number;
};

const PANEL = "rgba(0,0,0,0.65)";

export function CoachMark({
  def,
  rect,
  onClose,
}: {
  def: CoachDef;
  rect: CoachRect;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [bubble, setBubble] = useState<{ w: number; h: number } | null>(null);

  // Ukur bubble agar posisi & panah presisi dan tidak menutupi target
  useLayoutEffect(() => {
    const el = bubbleRef.current;
    if (el) setBubble({ w: el.offsetWidth, h: el.offsetHeight });
  }, [def.id, rect.x, rect.y]);

  // Mengetuk target (menembus lubang) atau area gelap → tutup coach mark.
  // Klik pada bubble diabaikan.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (t && bubbleRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [onClose]);

  const { x, y, w, h, frameW, frameH } = rect;
  const bw = bubble?.w ?? 260;
  const bh = bubble?.h ?? 40;
  const pad = 4;
  const xc = x + w / 2;

  const placeBelow = y + h + 14 + bh + 16 <= frameH - 12;
  const top = placeBelow ? y + h + 14 : y - 14 - bh;
  const left = Math.min(Math.max(xc - bw / 2, 12), Math.max(12, frameW - bw - 12));
  const arrowX = Math.min(Math.max(xc - left, 16), Math.max(16, bw - 16));

  return (
    <div
      ref={rootRef}
      style={{ position: "absolute", inset: 0, zIndex: 70, pointerEvents: "none" }}
    >
      <style>{`@keyframes cm-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.65;transform:scale(1.02)}}`}</style>

      {/* Empat panel gelap mengelilingi target — lubang tetap tembus ketuk */}
      <div
        onClick={onClose}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: y, background: PANEL, pointerEvents: "auto" }}
      />
      <div
        onClick={onClose}
        style={{ position: "absolute", top: y + h, left: 0, right: 0, bottom: 0, background: PANEL, pointerEvents: "auto" }}
      />
      <div
        onClick={onClose}
        style={{ position: "absolute", top: y, left: 0, width: x, height: h, background: PANEL, pointerEvents: "auto" }}
      />
      <div
        onClick={onClose}
        style={{ position: "absolute", top: y, left: x + w, right: 0, height: h, background: PANEL, pointerEvents: "auto" }}
      />

      {/* Ring putih penyorot target */}
      <div
        style={{
          position: "absolute",
          top: y - pad,
          left: x - pad,
          width: w + pad * 2,
          height: h + pad * 2,
          borderRadius: def.radius + pad,
          border: "2.5px solid #FFFFFF",
          boxShadow: "0 0 0 3px rgba(255,255,255,0.22), 0 0 14px rgba(255,255,255,0.35)",
          animation: "cm-pulse 1.7s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Bubble + panah menunjuk target */}
      <div
        ref={bubbleRef}
        style={{
          position: "absolute",
          top,
          left,
          maxWidth: frameW - 24,
          background: CARD,
          borderRadius: 14,
          padding: "9px 13px",
          boxShadow: "0 10px 28px rgba(0,0,0,0.30)",
          pointerEvents: "auto",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: PJS,
            fontSize: 12,
            fontWeight: 700,
            color: "#2E3E35",
            whiteSpace: "nowrap",
          }}
        >
          {def.text}
        </p>
        <div
          style={{
            position: "absolute",
            left: arrowX,
            transform: "translateX(-50%)",
            ...(placeBelow
              ? { top: -7, width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: `8px solid ${CARD}` }
              : { bottom: -7, width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: `8px solid ${CARD}` }),
          }}
        />
      </div>

      {/* Teks bantu di bawah layar */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 22,
          textAlign: "center",
          pointerEvents: "auto",
        }}
      >
        <span
          style={{
            fontFamily: IPS,
            fontSize: 10.5,
            fontWeight: 500,
            color: "rgba(255,255,255,0.88)",
            background: "rgba(0,0,0,0.35)",
            borderRadius: 99,
            padding: "5px 12px",
          }}
        >
          Ketuk bagian yang disorot, atau ketuk di luar untuk menutup
        </span>
      </div>
    </div>
  );
}
