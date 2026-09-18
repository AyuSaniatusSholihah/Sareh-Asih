import React from "react";
import { X } from "lucide-react";
import { T, CARD, TEXT, MUTED, BDR, PJS, IPS, DMM } from "../ui-kit";

export interface ModalShellProps {
  step: number;
  total: number;
  title: string;
  desc: string;
  children: React.ReactNode;
  onSkip?: () => void;
  skipLabel?: string;
  onClose?: () => void;
}

export function ModalShell({ step, total, title, desc, children, onSkip, skipLabel, onClose }: ModalShellProps) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 70, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.5)", cursor: onClose ? "pointer" : "default" }} />
      <div style={{ position: "relative", background: CARD, borderRadius: "26px 26px 0 0", maxHeight: "93%", display: "flex", flexDirection: "column" }}>
        {/* Top Handle and Close Button */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 12, paddingBottom: 6, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                position: "absolute",
                right: 16,
                top: 8,
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
              className="active:scale-90 transition-transform"
              title="Tutup"
            >
              <X size={16} strokeWidth={2.4} />
            </button>
          )}
        </div>
        <div className="px-5 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${BDR}` }}>
          <div className="flex items-center gap-1.5 mb-2">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: step >= i + 1 ? T : "#E5E7EB" }} />
            ))}
            <span className="text-xs ml-1" style={{ color: MUTED, fontFamily: DMM }}>{step}/{total}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="font-bold" style={{ fontFamily: PJS, fontSize: 18, color: TEXT, margin: 0 }}>{title}</p>
              <p className="text-xs mt-0.5" style={{ color: MUTED, fontFamily: IPS, margin: 0 }}>{desc}</p>
            </div>
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer border-none shrink-0"
                style={{ background: "#EAF2EC", color: T, fontFamily: PJS }}
              >
                {skipLabel || "Upload Nanti →"}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-6">{children}</div>
      </div>
    </div>
  );
}
