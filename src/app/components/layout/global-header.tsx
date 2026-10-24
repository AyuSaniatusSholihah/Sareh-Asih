import React from "react";
import { Search, User, Settings, Bell, ChevronLeft } from "lucide-react";
import { PJS, IPS, TEXT, MUTED, DEEP, useUI } from "../ui-kit";

export function GlobalHeader({
  title,
  sub,
  onBack,
  onProfile,
  greeting,
  useBell,
}: {
  title: string;
  sub?: string;
  onBack?: () => void;
  onProfile?: () => void;
  greeting?: string;
  useBell?: boolean;
}) {
  const { openSearch, openSettings, openNotifications } = useUI();

  return (
    <div style={{ background: "#FFFFFF", padding: "12px 20px 12px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: "rgba(139,176,152,0.14)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              className="active:scale-95 transition-transform"
              title="Kembali"
            >
              <ChevronLeft size={18} style={{ color: DEEP }} strokeWidth={2.5} />
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            {greeting && (
              <p style={{ fontFamily: IPS, fontSize: 12.5, color: MUTED, margin: "0 0 2px", fontWeight: 500 }}>
                {greeting}
              </p>
            )}
            <h1 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
              {title}
            </h1>
            {sub && (
              <p style={{ fontFamily: IPS, fontSize: 12.5, color: MUTED, margin: "4px 0 0", fontWeight: 500 }}>
                {sub}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
          <button
            type="button"
            onClick={openSearch}
            style={{
              width: 38,
              height: 38,
              background: "rgba(139,176,152,0.16)",
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
            <Search size={17} style={{ color: TEXT }} />
          </button>

          <button
            type="button"
            onClick={useBell ? openNotifications : onProfile}
            style={{
              width: 38,
              height: 38,
              background: "rgba(139,176,152,0.16)",
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
              ? <Bell size={17} style={{ color: TEXT }} />
              : <User size={17} style={{ color: TEXT }} />
            }
          </button>

          <button
            type="button"
            onClick={openSettings}
            style={{
              width: 38,
              height: 38,
              background: "rgba(139,176,152,0.16)",
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
            <Settings size={17} style={{ color: TEXT }} />
          </button>
        </div>
      </div>
    </div>
  );
}
