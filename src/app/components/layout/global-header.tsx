import React from "react";
import { Search, User, Settings, Bell } from "lucide-react";
import { PJS, IPS, useUI } from "../ui-kit";

export function GlobalHeader({
  title,
  sub,
  onProfile,
  greeting,
  useBell,
}: {
  title: string;
  sub?: string;
  onProfile?: () => void;
  greeting?: string;
  useBell?: boolean;
}) {
  const { openSearch, openSettings } = useUI();

  return (
    <div style={{ background: "#FFFFFF", padding: "14px 20px 10px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {greeting && (
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: "#5A6E63", margin: "0 0 2px", fontWeight: 500 }}>
              {greeting}
            </p>
          )}
          <h1 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>
            {title}
          </h1>
          {sub && (
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: "#5A6E63", margin: "4px 0 0", fontWeight: 500 }}>
              {sub}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
          <button
            type="button"
            onClick={openSearch}
            style={{
              width: 38,
              height: 38,
              background: "rgba(139,176,152,0.14)",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="active:scale-95 transition-transform"
            title="Cari"
          >
            <Search size={17} style={{ color: "#1B2E24" }} />
          </button>

          <button
            type="button"
            onClick={useBell ? openSettings : onProfile}
            style={{
              width: 38,
              height: 38,
              background: "rgba(139,176,152,0.14)",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="active:scale-95 transition-transform"
            title={useBell ? "Notifikasi" : "Profil"}
          >
            {useBell
              ? <Bell size={17} style={{ color: "#1B2E24" }} />
              : <User size={17} style={{ color: "#1B2E24" }} />
            }
          </button>

          <button
            type="button"
            onClick={openSettings}
            style={{
              width: 38,
              height: 38,
              background: "rgba(139,176,152,0.14)",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="active:scale-95 transition-transform"
            title="Pengaturan"
          >
            <Settings size={17} style={{ color: "#1B2E24" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
