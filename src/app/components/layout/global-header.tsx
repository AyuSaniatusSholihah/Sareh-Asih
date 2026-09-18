import React from "react";
import { Search, Volume2, VolumeX, Settings } from "lucide-react";
import { CARD, BDR, TEXT, MUTED, SEC, T, PJS, IPS, useUI } from "../ui-kit";

export function GlobalHeader({ title, sub }: { title: string; sub?: string }) {
  const { tts, setTts, openSearch, openSettings } = useUI();
  return (
    <div style={{ background: CARD, borderBottom: `1px solid ${BDR}`, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px" }}>
        <div style={{ minWidth: 4 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: PJS, fontSize: 17, fontWeight: 700, color: TEXT, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</p>
          {sub && <p style={{ fontSize: 11, color: MUTED, fontFamily: IPS, margin: 0 }}>{sub}</p>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button onClick={openSearch} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer" }} title="Cari">
            <Search size={18} style={{ color: MUTED }} />
          </button>
          <button onClick={() => setTts(!tts)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "none", background: tts ? SEC : "transparent", cursor: "pointer" }} title={tts ? "Matikan TTS" : "Aktifkan TTS"}>
            {tts ? <Volume2 size={18} style={{ color: T }} /> : <VolumeX size={18} style={{ color: MUTED }} />}
          </button>
          <button onClick={openSettings} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer" }} title="Pengaturan">
            <Settings size={18} style={{ color: MUTED }} />
          </button>
        </div>
      </div>
    </div>
  );
}
