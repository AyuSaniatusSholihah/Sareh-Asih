import React from "react";
import {
  Home, Users, User, ChartSpline, Calendar, FileText, CalendarDays, HeartPulse,
} from "lucide-react";
import { CARD, BDR, DEEP, MUTED, PJS, IPS } from "../ui-kit";
import { type Role, type Screen } from "../data";

export const GURU_NAV = [
  { k: "dashboard", l: "Beranda", I: Home },
  { k: "students", l: "Siswa", I: Users },
  { k: "talent-map", l: "Asesmen", I: ChartSpline },
  { k: "competition", l: "Agenda", I: Calendar },
  { k: "report", l: "Laporan", I: FileText },
];

export const ORTU_NAV = [
  { k: "parent-dashboard", l: "Beranda", I: Home },
  { k: "parent-detail", l: "Anak", I: User },
  { k: "parent-calendar", l: "Kalender", I: CalendarDays },
  { k: "parent-training", l: "Pelatihan", I: HeartPulse },
];

export function BotNav({ role, screen, go }: { role: Role; screen: Screen; go: (s: Screen) => void }) {
  const nav = role === "guru" ? GURU_NAV : ORTU_NAV;
  const isOrtu = role === "ortu";

  return (
    <div style={{ background: "#FFFFFF", borderTop: "1px solid #D5E3D9", flexShrink: 0, padding: "2px 8px 0" }}>
      <div className="flex px-2 py-0.5">
        {nav.map(({ k, l, I }) => {
          const active = screen === k;
          return (
            <button
              key={k}
              onClick={() => go(k as Screen)}
              style={{
                fontFamily: active ? PJS : IPS,
                minHeight: 48,
                color: active ? (isOrtu ? "#24352C" : DEEP) : (isOrtu ? "#55675C" : MUTED),
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all"
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: active ? (isOrtu ? "4px 18px" : "3px 14px") : "4px 0",
                borderRadius: isOrtu ? 14 : 16,
                background: active ? (isOrtu ? "#D4E5DA" : "rgba(91,122,104,0.16)") : "transparent",
                transition: "all 0.2s ease",
              }}>
                <I size={20} strokeWidth={active ? 2.2 : 1.8} style={{ color: active ? (isOrtu ? "#24352C" : DEEP) : (isOrtu ? "#55675C" : MUTED) }} />
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: active ? (isOrtu ? 800 : 700) : (isOrtu ? 600 : 500),
                color: active ? (isOrtu ? "#24352C" : DEEP) : (isOrtu ? "#55675C" : MUTED),
                fontFamily: PJS,
              }}>
                {l}
              </span>
            </button>
          );
        })}
      </div>
      {/* iPhone 16 Home Indicator */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 2, paddingBottom: 7 }}>
        <div style={{
          width: 134, height: 5,
          background: "#1A1A1A",
          borderRadius: 100,
          opacity: 0.22,
        }} />
      </div>
    </div>
  );
}
