import React from "react";
import {
  Home, Users, Star, Calendar, FileText, CalendarDays, HeartPulse,
} from "lucide-react";
import { CARD, BDR, DEEP, MUTED, PJS, IPS } from "../ui-kit";
import { type Role, type Screen } from "../data";

export const GURU_NAV = [
  { k: "dashboard", l: "Beranda", I: Home },
  { k: "students", l: "Kelas", I: Users },
  { k: "talent-map", l: "Bakat", I: Star },
  { k: "competition", l: "Agenda", I: Calendar },
  { k: "report", l: "Laporan", I: FileText },
];

export const ORTU_NAV = [
  { k: "parent-dashboard", l: "Beranda", I: Home },
  { k: "parent-detail", l: "Anak", I: Users },
  { k: "parent-calendar", l: "Kalender", I: CalendarDays },
  { k: "parent-training", l: "Pelatihan", I: HeartPulse },
];

export function BotNav({ role, screen, go }: { role: Role; screen: Screen; go: (s: Screen) => void }) {
  const nav = role === "guru" ? GURU_NAV : ORTU_NAV;
  return (
    <div style={{ background: CARD, borderTop: `1px solid ${BDR}`, flexShrink: 0 }}>
      <div className="flex px-2 py-1">
        {nav.map(({ k, l, I }) => {
          const active = screen === k;
          return (
            <button key={k} onClick={() => go(k as Screen)} style={{ fontFamily: IPS, minHeight: 52 }} className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all">
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: active ? "3px 14px" : "3px 0",
                borderRadius: 16,
                background: active ? "rgba(91,122,104,0.16)" : "transparent",
                transition: "all 0.2s ease"
              }}>
                <I size={20} strokeWidth={active ? 2.5 : 1.8} style={{ color: active ? DEEP : MUTED }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? DEEP : MUTED, fontFamily: active ? PJS : IPS }}>{l}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
