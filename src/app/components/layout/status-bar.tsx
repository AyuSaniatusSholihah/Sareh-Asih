import React from "react";
import { TEXT, IPS } from "../ui-kit";

export function StatusBar() {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Status bar row — jam & ikon lebih kecil dan rapat sesuai referensi */}
      <div className="flex items-center justify-between px-6" style={{ height: 20 }}>
        {/* Jam — kiri (ukuran lebih kecil: 12px) */}
        <span style={{ fontFamily: IPS, fontSize: 12, fontWeight: 700, color: TEXT, letterSpacing: 0.1 }}>9:41</span>

        {/* Ikon — kanan: Baterai kemudian 4 Signal Bars (proporsional tanpa terpotong) */}
        <div className="flex items-center" style={{ gap: 5.5 }}>
          {/* Battery: pill outline with inner solid pill fill */}
          <svg width="21" height="11" viewBox="0 0 21 11" fill="none" style={{ display: "block", overflow: "visible" }}>
            <rect
              x="0.8"
              y="0.8"
              width="19.4"
              height="9.4"
              rx="4.7"
              stroke={TEXT}
              strokeWidth="1.3"
            />
            <rect
              x="3.6"
              y="2.8"
              width="13.8"
              height="5.4"
              rx="2.7"
              fill={TEXT}
            />
          </svg>

          {/* 4 Signal bars ascending */}
          <svg width="13" height="11" viewBox="0 0 13 11" fill="none" style={{ display: "block", overflow: "visible" }}>
            <rect x="0" y="7.4" width="2.2" height="3.6" rx="0.8" fill={TEXT} />
            <rect x="3.6" y="5" width="2.2" height="6" rx="0.8" fill={TEXT} />
            <rect x="7.2" y="2.5" width="2.2" height="8.5" rx="0.8" fill={TEXT} />
            <rect x="10.8" y="0" width="2.2" height="11" rx="0.8" fill={TEXT} />
          </svg>
        </div>
      </div>
    </div>
  );
}
