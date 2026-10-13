import { useState } from "react";
import { T, A, CARD, TEXT, MUTED, BDR, PJS, IPS, DMM } from "../ui-kit";
import { type Screen, type Role } from "../data";

export type OStep = {
  targetScreen: Screen;
  ring: { x: number | string; y: number | string; w: number | string; h: number | string; r: number };
  cardPlacement: "top" | "bottom";
  icon: string; title: string; desc: string; badge: string;
};

export const OBS_STEPS: OStep[] = [
  {
    targetScreen: "dashboard", ring: { x: 16, y: 128, w: "calc(100% - 32px)", h: 108, r: 18 }, cardPlacement: "top",
    icon: "⚠️", title: "Pengingat Asesmen Hari Ini",
    desc: "Banner ini menampilkan jumlah siswa yang belum didampingi. Tap 'Lihat Jadwal' untuk langsung ke daftar siswa yang perlu ditangani.",
    badge: "Banner Beranda",
  },
  {
    targetScreen: "dashboard", ring: { x: "calc(100% - 235px)", y: 252, w: 219, h: 52, r: 0 }, cardPlacement: "top",
    icon: "👆", title: "Asesmen Pending",
    desc: "Tap baris ini untuk membuka daftar siswa yang belum didampingi — AI sudah menyiapkan indikator sesuai profil ABK masing-masing siswa.",
    badge: "Stats Card",
  },
  {
    targetScreen: "students", ring: { x: "20%", y: 788, w: "20%", h: 56, r: 0 }, cardPlacement: "top",
    icon: "➕", title: "Menu Siswa",
    desc: "Semua siswa yang Anda input ada di sini. Tambah siswa baru cukup 3 kolom wajib, dan AI langsung mengelompokkan mereka per gaya belajar.",
    badge: "Nav Siswa",
  },
  {
    targetScreen: "talent-map", ring: { x: "40%", y: 788, w: "20%", h: 56, r: 0 }, cardPlacement: "top",
    icon: "✨", title: "Menu Bakat",
    desc: "AI mengelompokkan seluruh siswa berdasarkan gaya belajar dan domain bakat dari hasil asesmen. Guru langsung tahu siapa bisa diajar bersama.",
    badge: "Nav Bakat",
  },
  {
    targetScreen: "competition", ring: { x: "60%", y: 788, w: "20%", h: 56, r: 0 }, cardPlacement: "top",
    icon: "📅", title: "Menu Agenda",
    desc: "AI mencocokkan bakat PDBK ke 3 ajang resmi: O2SN Diksus, FLS3N PDBK, dan LKSN Diksus. Muncul alasan kecocokannya, bukan sekadar daftar nama.",
    badge: "Nav Agenda",
  },
  {
    targetScreen: "report", ring: { x: "80%", y: 788, w: "20%", h: 56, r: 0 }, cardPlacement: "top",
    icon: "📄", title: "Menu Laporan",
    desc: "Guru bisa generate laporan perkembangan untuk orang tua. Ada langkah konfirmasi sebelum dikirim — laporan tidak pernah terkirim otomatis.",
    badge: "Nav Laporan",
  },
];

export const P_OBS_STEPS: OStep[] = [
  {
    targetScreen: "parent-dashboard", ring: { x: 16, y: 150, w: "calc(100% - 32px)", h: 180, r: 20 }, cardPlacement: "bottom",
    icon: "👤", title: "Beranda Orang Tua",
    desc: "Pantau ringkasan perkembangan anak, agenda terdekat, dan rekomendasi pelatihan. Masukkan kode akses dari guru untuk terhubung dengan data anak.",
    badge: "Beranda",
  },
  {
    targetScreen: "parent-detail", ring: { x: "25%", y: 788, w: "25%", h: 56, r: 0 }, cardPlacement: "top",
    icon: "📈", title: "Menu Anak",
    desc: "Lihat detail peta bakat, profil fungsional, dan baca laporan perkembangan rutin yang dikirimkan oleh guru pendamping anak Anda.",
    badge: "Nav Anak",
  },
  {
    targetScreen: "parent-calendar", ring: { x: "50%", y: 788, w: "25%", h: 56, r: 0 }, cardPlacement: "top",
    icon: "📅", title: "Menu Kalender",
    desc: "Temukan jadwal kegiatan inklusif seperti O2SN, FLS3N, atau acara komunitas yang bisa diikuti oleh PDBK.",
    badge: "Nav Kalender",
  },
  {
    targetScreen: "parent-training", ring: { x: "75%", y: 788, w: "25%", h: 56, r: 0 }, cardPlacement: "top",
    icon: "💡", title: "Menu Pelatihan",
    desc: "Cari referensi tempat pelatihan, terapi, dan layanan profesional terdekat yang sesuai dengan minat serta kebutuhan spesifik anak Anda.",
    badge: "Nav Pelatihan",
  },
];

export function OnboardingModal({ role, onClose, goTab }: { role: Role; onClose: () => void; goTab: (s: Screen) => void }) {
  const [step, setStep] = useState(0);
  const steps = role === "guru" ? OBS_STEPS : P_OBS_STEPS;
  const s = steps[step];
  const isLast = step === steps.length - 1;
  const { ring } = s;

  const handleFinish = () => {
    goTab(role === "guru" ? "dashboard" : "parent-dashboard");
    onClose();
  };

  const advance = () => {
    if (isLast) {
      handleFinish();
      return;
    }
    const next = steps[step + 1];
    if (next.targetScreen !== s.targetScreen) goTab(next.targetScreen);
    setStep(st => st + 1);
  };

  const arrowFromCardBottom = s.cardPlacement === "top";
  const arrowTipX = typeof ring.x === "number" && typeof ring.w === "number" ? ring.x + ring.w / 2 : "50%";

  return (
    <>
      <style>{`@keyframes ob-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.04)}}`}</style>

      <div style={{ position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <mask id="ob-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect style={{ x: ring.x, y: ring.y, width: ring.w, height: ring.h }} rx={ring.r} fill="black" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(0,0,0,0.62)" mask="url(#ob-mask)" />
        </svg>

        <div style={{
          position: "absolute",
          top: typeof ring.y === "number" ? ring.y - 3 : `calc(${ring.y} - 3px)`,
          left: typeof ring.x === "number" ? ring.x - 3 : `calc(${ring.x} - 3px)`,
          width: typeof ring.w === "number" ? ring.w + 6 : `calc(${ring.w} + 6px)`,
          height: typeof ring.h === "number" ? ring.h + 6 : `calc(${ring.h} + 6px)`,
          borderRadius: ring.r + 3,
          border: `2.5px solid ${A}`,
          boxShadow: `0 0 0 4px rgba(210,125,107,0.25), 0 0 16px rgba(210,125,107,0.3)`,
          animation: "ob-pulse 1.6s ease-in-out infinite",
        }} />

        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <marker id="ob-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill={A} />
            </marker>
          </defs>
          <line
            x1="50%" y1={s.cardPlacement === "top" ? 272 : 664}
            x2={arrowTipX} y2={arrowFromCardBottom ? (typeof ring.y === "number" ? ring.y - 3 : `calc(${ring.y} - 3px)`) : (typeof ring.y === "number" && typeof ring.h === "number" ? ring.y + ring.h + 3 : `calc(${ring.y} + ${ring.h} + 3px)`)}
            stroke={A} strokeWidth="2" strokeDasharray="5,4"
            markerEnd="url(#ob-arrow)" opacity="0.9"
          />
        </svg>
      </div>

      <div style={{
        position: "absolute", left: 16, right: 16,
        ...(s.cardPlacement === "top" ? { top: 100 } : { bottom: 8 }),
        zIndex: 61, pointerEvents: "auto",
      }}>
        <div style={{ background: CARD, borderRadius: 20, padding: "14px 16px", boxShadow: "0 12px 40px rgba(0,0,0,0.32)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: A, fontFamily: DMM, letterSpacing: "0.08em" }}>
                {step + 1} / {steps.length}
              </span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, fontFamily: IPS, background: "#F3F4F6", padding: "2px 8px", borderRadius: 6 }}>
              {s.badge}
            </span>
          </div>

          <div style={{ height: 3, background: "#EDE9E3", borderRadius: 2, marginBottom: 10 }}>
            <div style={{ height: "100%", borderRadius: 2, background: T, width: `${(step + 1) / steps.length * 100}%`, transition: "width 0.35s" }} />
          </div>

          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 4 }}>{s.title}</p>
          <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, lineHeight: 1.65, marginBottom: 12 }}>{s.desc}</p>

          <div style={{ display: "flex", gap: 8 }}>
            {!isLast && (
              <button onClick={handleFinish}
                style={{ flex: 1, border: `1.5px solid ${BDR}`, color: MUTED, fontFamily: IPS, minHeight: 40, borderRadius: 12, fontSize: 12, fontWeight: 600, background: CARD }}>
                Lewati
              </button>
            )}
            <button onClick={advance}
              style={{ flex: 2, background: isLast ? T : A, color: "#fff", fontFamily: IPS, minHeight: 40, borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", boxShadow: isLast ? "0 4px 12px rgba(139,176,152,0.35)" : "0 4px 12px rgba(210,125,107,0.35)" }}>
              {isLast ? "Mulai Gunakan App ✓" : "Selanjutnya →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
