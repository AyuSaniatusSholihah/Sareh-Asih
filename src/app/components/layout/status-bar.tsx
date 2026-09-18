import React from "react";
import { TEXT, IPS } from "../ui-kit";

export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-2.5 pb-1">
      <span style={{ fontFamily: IPS, fontSize: 12, fontWeight: 600, color: TEXT }}>9:41</span>
      <div className="flex gap-1 items-center">
        <div className="w-4 h-2.5 border border-gray-800 rounded-sm relative">
          <div className="absolute inset-0.5 bg-gray-800 rounded-[1px]" style={{ width: "75%" }} />
        </div>
        <svg width="14" height="10">
          <rect x="0" y="3" width="2.5" height="7" rx="0.5" fill={TEXT} />
          <rect x="3.5" y="2" width="2.5" height="8" rx="0.5" fill={TEXT} />
          <rect x="7" y="1" width="2.5" height="9" rx="0.5" fill={TEXT} />
          <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill={TEXT} />
        </svg>
      </div>
    </div>
  );
}
