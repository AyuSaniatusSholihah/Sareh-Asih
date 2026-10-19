import { useState } from "react";
import {
  ClipboardCheck, Sparkles, Trophy, FileText, Bell, Home, Compass,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { A, CARD, TEXT, MUTED, BDR, PJS, IPS } from "../ui-kit";
import { type Role } from "../data";

export type OnbSlide = { icon: LucideIcon; title: string; desc: string };

export const GURU_SLIDES: OnbSlide[] = [
  {
    icon: ClipboardCheck,
    title: "Input siswa & asesmen",
    desc: "Catat asesmen siswa, AI langsung memetakan gaya belajar dan bakatnya.",
  },
  {
    icon: Sparkles,
    title: "Bakat terkelompok otomatis",
    desc: "Siswa dikelompokkan menurut bakat, jadi mudah ditindaklanjuti.",
  },
  {
    icon: Trophy,
    title: "Agenda lomba sesuai bakat",
    desc: "Rekomendasi O2SN, FLS3N, dan LKSN Diksus untuk tiap siswa.",
  },
  {
    icon: FileText,
    title: "Laporan untuk orang tua",
    desc: "Kamu memeriksa dulu. Laporan baru terkirim setelah dikonfirmasi.",
  },
];

export const ORTU_SLIDES: OnbSlide[] = [
  {
    icon: Bell,
    title: "Pantau laporan guru",
    desc: "Laporan belajar anak dari guru muncul langsung di beranda.",
  },
  {
    icon: Home,
    title: "Saran untuk di rumah",
    desc: "Terima saran dan panduan stimulasi harian dari guru pendamping.",
  },
  {
    icon: Compass,
    title: "Kenali minat & bakat",
    desc: "Lihat peta potensi dan rekomendasi pelatihan yang sesuai.",
  },
];

const onbKey = (role: Role) => `sareh_asih_onb_${role}`;

export function isOnboardingSeen(role: Role): boolean {
  try {
    return sessionStorage.getItem(onbKey(role)) === "1";
  } catch {
    return false;
  }
}

export function setOnboardingSeen(role: Role): void {
  try {
    sessionStorage.setItem(onbKey(role), "1");
  } catch {
    /* sessionStorage tidak tersedia — abaikan */
  }
}

export function OnboardingSlides({ role, onClose }: { role: Role; onClose: () => void }) {
  const slides = role === "guru" ? GURU_SLIDES : ORTU_SLIDES;
  const [i, setI] = useState(0);
  const isLast = i === slides.length - 1;
  const s = slides[i];
  const Icon = s.icon;

  const finish = () => {
    setOnboardingSeen(role);
    onClose();
  };

  const next = () => {
    if (isLast) finish();
    else setI(v => v + 1);
  };

  return (
    <>
      <style>{`@keyframes onb-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 90,
          background: "rgba(235,243,237,0.94)",
          display: "flex",
          flexDirection: "column",
          fontFamily: PJS,
          pointerEvents: "auto",
        }}
      >
        {/* Tautan Lewati — kanan atas, tidak ada di slide terakhir */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "46px 22px 0" }}>
          {!isLast && (
            <button
              onClick={finish}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: IPS,
                fontSize: 13,
                fontWeight: 600,
                color: MUTED,
                padding: "6px 4px",
              }}
              className="active:opacity-70 transition-opacity"
            >
              Lewati
            </button>
          )}
        </div>

        {/* Isi slide */}
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 34px",
            animation: "onb-in 0.35s ease",
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: CARD,
              border: `1px solid ${BDR}`,
              boxShadow: "0 10px 28px rgba(91,122,104,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            <Icon size={40} strokeWidth={2} style={{ color: A }} />
          </div>

          <h2 style={{ fontSize: 21, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
            {s.title}
          </h2>
          <p
            style={{
              fontFamily: IPS,
              fontSize: 14,
              color: MUTED,
              lineHeight: 1.65,
              margin: "12px 0 0",
              maxWidth: 300,
            }}
          >
            {s.desc}
          </p>

          {/* Indikator titik */}
          <div style={{ display: "flex", gap: 7, marginTop: 34, alignItems: "center" }}>
            {slides.map((_, d) => (
              <span
                key={d}
                style={{
                  width: d === i ? 22 : 8,
                  height: 8,
                  borderRadius: 99,
                  background: d === i ? A : "rgba(91,122,104,0.25)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Tombol Lanjut / Mulai */}
        <div style={{ padding: "0 24px 46px" }}>
          <button
            onClick={next}
            style={{
              width: "100%",
              background: A,
              color: "#FFFFFF",
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 15,
              minHeight: 50,
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(91,122,104,0.30)",
            }}
            className="active:scale-[0.98] transition-all"
          >
            {isLast ? "Mulai" : "Lanjut"}
          </button>
        </div>
      </div>
    </>
  );
}
