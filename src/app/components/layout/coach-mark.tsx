import { useState, useEffect } from "react";
import { T, A, CARD, TEXT, MUTED, BDR, PJS, IPS, DMM, DEEP } from "../ui-kit";
import { type Screen } from "../data";

// ─── Coach Mark Steps ─────────────────────────────────────────────────
export interface CoachStep {
  id: string;              // unique key for localStorage flag
  targetScreen: Screen;
  spotlightStyle: React.CSSProperties; // position & size of the spotlight hole
  cardPlacement: "top" | "bottom" | "center";
  text: string;
  badge: string;
}

export const COACH_STEPS: CoachStep[] = [
  {
    id: "cm_tab_siswa",
    targetScreen: "dashboard",
    spotlightStyle: { left: "20%", bottom: 0, width: "20%", height: 56 },
    cardPlacement: "top",
    text: "Mulai dari sini: atur peranmu dan tambahkan kelas atau anak didikmu.",
    badge: "Tab Siswa",
  },
  {
    id: "cm_mulai_setup",
    targetScreen: "students",
    spotlightStyle: { left: "50%", top: "55%", width: 200, height: 52, transform: "translateX(-50%)" },
    cardPlacement: "top",
    text: "Pilih peranmu dulu supaya aplikasi menyesuaikan diri dengan cara mengajarmu.",
    badge: "Mulai Setup",
  },
  {
    id: "cm_pilih_peran",
    targetScreen: "setup-ruang-belajar",
    spotlightStyle: { left: 16, top: 160, width: "calc(100% - 32px)", height: 280 },
    cardPlacement: "bottom",
    text: "Pilih yang paling sesuai. Kamu bisa mengubahnya nanti di Pengaturan.",
    badge: "Pilih Peran",
  },
  {
    id: "cm_tambah_siswa",
    targetScreen: "students",
    spotlightStyle: { right: 16, bottom: 76, width: 160, height: 48 },
    cardPlacement: "top",
    text: "Tambahkan anak didik berikutnya di sini.",
    badge: "Tambah Anak",
  },
];

// ─── Utility: localStorage flags ──────────────────────────────────────
const CM_PREFIX = "sareh_asih_cm_";

export function isCoachStepSeen(stepId: string): boolean {
  try { return localStorage.getItem(CM_PREFIX + stepId) === "1"; } catch { return false; }
}

export function markCoachStepSeen(stepId: string): void {
  try { localStorage.setItem(CM_PREFIX + stepId, "1"); } catch {}
}

export function resetAllCoachMarks(): void {
  COACH_STEPS.forEach(s => {
    try { localStorage.removeItem(CM_PREFIX + s.id); } catch {}
  });
}

/** Find the next unseen coach step for a given screen. Returns null if none. */
export function getNextCoachStep(currentScreen: Screen): CoachStep | null {
  for (const step of COACH_STEPS) {
    if (step.targetScreen === currentScreen && !isCoachStepSeen(step.id)) {
      return step;
    }
  }
  return null;
}

// ─── Coach Mark Overlay Component ─────────────────────────────────────
export function CoachMarkOverlay({
  step,
  onNext,
  onSkip,
}: {
  step: CoachStep;
  onNext: () => void;
  onSkip: () => void;
}) {
  // Animate in
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const handleNext = () => {
    markCoachStepSeen(step.id);
    onNext();
  };

  const handleSkip = () => {
    // Mark all remaining steps as seen
    COACH_STEPS.forEach(s => markCoachStepSeen(s.id));
    onSkip();
  };

  // Build the spotlight mask
  const spotStyle = step.spotlightStyle;

  return (
    <>
      <style>{`@keyframes cm-pulse{0%,100%{box-shadow:0 0 0 3px rgba(91,122,104,0.4),0 0 16px rgba(91,122,104,0.25)}50%{box-shadow:0 0 0 6px rgba(91,122,104,0.25),0 0 24px rgba(91,122,104,0.35)}}`}</style>

      <div
        style={{
          position: "absolute", inset: 0, zIndex: 70,
          opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
          pointerEvents: "auto",
        }}
      >
        {/* Dark overlay */}
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }}
          onClick={handleNext}
        />

        {/* Spotlight ring */}
        <div
          style={{
            position: "absolute",
            ...spotStyle,
            borderRadius: 16,
            border: `2.5px solid ${T}`,
            animation: "cm-pulse 1.8s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 71,
          }}
        />

        {/* Tooltip card */}
        <div
          style={{
            position: "absolute",
            left: 16, right: 16,
            ...(step.cardPlacement === "top" ? { top: 100 } : step.cardPlacement === "bottom" ? { bottom: 80 } : { top: "40%" }),
            zIndex: 72,
          }}
        >
          <div style={{
            background: CARD, borderRadius: 20, padding: "16px 18px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            border: `1.5px solid ${BDR}`,
          }}>
            {/* Badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: DEEP, fontFamily: DMM, letterSpacing: "0.08em" }}>
                PANDUAN
              </span>
              <span style={{
                fontSize: 10, fontWeight: 600, color: MUTED, fontFamily: IPS,
                background: "#F3F4F6", padding: "2px 8px", borderRadius: 6
              }}>
                {step.badge}
              </span>
            </div>

            {/* Text */}
            <p style={{ fontFamily: IPS, fontSize: 13, color: TEXT, lineHeight: 1.65, marginBottom: 14 }}>
              {step.text}
            </p>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleSkip}
                style={{
                  flex: 1, border: `1.5px solid ${BDR}`, color: MUTED,
                  fontFamily: IPS, minHeight: 40, borderRadius: 12,
                  fontSize: 12, fontWeight: 600, background: CARD, cursor: "pointer",
                }}
                className="active:scale-[0.98] transition-transform"
              >
                Lewati
              </button>
              <button
                onClick={handleNext}
                style={{
                  flex: 2, background: T, color: "#fff",
                  fontFamily: IPS, minHeight: 40, borderRadius: 12,
                  fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(91,122,104,0.35)",
                }}
                className="active:scale-[0.98] transition-transform"
              >
                Lanjut →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
