import React from "react";
import { T, CARD, TEXT, MUTED, BDR, PJS, IPS, DMM } from "../ui-kit";

export interface ModalShellProps {
  step: number;
  total: number;
  title: string;
  desc: string;
  children: React.ReactNode;
}

export function ModalShell({ step, total, title, desc, children }: ModalShellProps) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 70, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.5)" }} />
      <div style={{ position: "relative", background: CARD, borderRadius: "26px 26px 0 0", maxHeight: "93%", display: "flex", flexDirection: "column" }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>
        <div className="px-5 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${BDR}` }}>
          <div className="flex items-center gap-1.5 mb-2">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: step >= i + 1 ? T : "#E5E7EB" }} />
            ))}
            <span className="text-xs ml-1" style={{ color: MUTED, fontFamily: DMM }}>{step}/{total}</span>
          </div>
          <p className="font-bold" style={{ fontFamily: PJS, fontSize: 18, color: TEXT }}>{title}</p>
          <p className="text-xs mt-0.5" style={{ color: MUTED, fontFamily: IPS }}>{desc}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-6">{children}</div>
      </div>
    </div>
  );
}
