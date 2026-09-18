import { ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { T, A, TEXT, MUTED, DEEP, PJS, IPS } from "../ui-kit";
import { type Role } from "../data";
import guruIcon from "@/imports/guru-icon.png";
import ortuIcon from "@/imports/ortu-icon.png";

export function RoleSelectScreen({ onPick, onBack }: { onPick: (r: Role) => void; onBack: () => void }) {
  const ROLES = [
    {
      r: "guru" as Role,
      icon: guruIcon,
      title: "Guru Pendamping",
      tagline: "Kelola siswa & pantau perkembangan ABK",
      accent: T,
      accentLight: "#E8F0E9",
      accentShadow: "rgba(139,176,152,0.3)",
    },
    {
      r: "ortu" as Role,
      icon: ortuIcon,
      title: "Orang Tua",
      tagline: "Ikuti perkembangan & terima laporan anak",
      accent: A,
      accentLight: "#FFF0EC",
      accentShadow: "rgba(210,125,107,0.3)",
    },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{ fontFamily: IPS, background: "#FDFBF7" }}>
      <div className="px-4 pt-4 pb-2">
        <button onClick={onBack} style={{ minWidth: 40, minHeight: 40, background: "#FFF", border: "1px solid #E5E7EB" }} className="flex items-center justify-center rounded-2xl shadow-sm">
          <ArrowLeft size={18} style={{ color: TEXT }} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-10 gap-4" style={{ paddingTop: 20 }}>
        <div className="mb-2">
          <h1 style={{ fontFamily: PJS, fontSize: 24, fontWeight: 800, color: TEXT, marginBottom: 4 }}>Masuk sebagai?</h1>
          <p style={{ fontSize: 14, color: MUTED }}>Pilih peran Anda untuk melanjutkan.</p>
        </div>

        {ROLES.map(x => (
          <button key={x.r} onClick={() => onPick(x.r)}
            style={{
              background: "#FFF",
              border: `2px solid ${x.accentLight}`,
              width: "100%", textAlign: "left",
              boxShadow: `0 6px 24px ${x.accentShadow}`,
              borderRadius: 20, overflow: "hidden",
            }}
            className="transition-all active:scale-[0.98]">
            <div style={{ background: x.accent, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 54, height: 54, background: "rgba(255,255,255,0.22)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={x.icon} alt={x.title} className="w-9 h-9 object-contain" />
              </div>
              <div className="flex-1">
                <div style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: "#fff" }}>{x.title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>{x.tagline}</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ChevronRight size={22} strokeWidth={2.5} color="#fff" />
              </div>
            </div>
          </button>
        ))}

        <div style={{ background: "#E8F0E9", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4 }}>
          <ShieldCheck size={15} style={{ color: DEEP, flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: DEEP, lineHeight: 1.5, margin: 0 }}>
            Data anak dijaga kerahasiaannya. Orang tua butuh kode akses dari guru.
          </p>
        </div>
      </div>
    </div>
  );
}
