import React from "react";
import {
  Trophy, ChevronRight
} from "lucide-react";
import {
  A, CARD, TEXT, MUTED, PJS, IPS, DMM, TBar, BDR
} from "../ui-kit";
import { useStudents, type Screen, useRiwayatAsesmen, type FungsionalKategori, type RiasecKategori } from "../data";
import { ProfilFungsionalRadar, ProfilKecenderunganBar } from "../shared-charts";

export function SuggestedCompetitions({ studentId, go }: { studentId: number; go?: (s: Screen) => void }) {
  const comps = studentId === 2 ? [
    { title: "FLS2N Menyanyi Solo", type: "Seni & Suara", level: "Kabupaten", match: 95 },
    { title: "Lomba Cipta Puisi", type: "Literasi", level: "Provinsi", match: 88 },
    { title: "O2SN Bocce", type: "Olahraga", level: "Nasional", match: 75 },
  ] : [
    { title: "LKSN Kriya Kayu", type: "Keterampilan", level: "Provinsi", match: 92 },
    { title: "LKSN Merangkai Bunga", type: "Keterampilan", level: "Kabupaten", match: 85 },
    { title: "O2SN Lari 100m", type: "Olahraga", level: "Nasional", match: 78 },
  ];

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 24, padding: "20px 14px", boxShadow: "0 2px 12px rgba(91,122,104,0.06)" }}>
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Trophy size={18} style={{ color: "#F59E0B" }} />
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT }}>
            Lomba yang Disarankan
          </h3>
        </div>
      </div>
      <div className="space-y-3">
        {comps.map((c, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ border: `1px solid ${BDR}`, background: "#F8FAFC" }}>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm truncate" style={{ color: TEXT }}>{c.title}</p>
              <div className="flex gap-1.5 mt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "#E0E7FF", color: "#4338CA" }}>{c.type}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "#ECFCCB", color: "#4D7C0F" }}>{c.level}</span>
              </div>
            </div>
            <div className="flex flex-col items-end ml-3 flex-shrink-0">
              <span className="text-xs" style={{ color: MUTED }}>Kecocokan</span>
              <span className="font-bold text-sm" style={{ color: "#059669", fontFamily: DMM }}>{c.match}%</span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => go?.("competition")}
        style={{ width: '100%', marginTop: 12, padding: "10px 0", background: A, color: "#fff", borderRadius: 12, fontFamily: PJS, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}
        className="flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
      >
        Lihat Semua Lomba <ChevronRight size={14} />
      </button>
    </div>
  );
}

export function TalentMapDetailScreen({
  onBack,
  studentId,
  go,
  onStartObs
}: {
  onBack: () => void;
  studentId: number;
  go: (s: Screen) => void;
  onStartObs?: (id: number) => void;
}) {
  const students = useStudents();
  const { riwayat } = useRiwayatAsesmen();
  const s = students.find(x => x.id === Number(studentId)) || students.find(x => x.hasObs) || students[0];
  if (!s) return null;

  const r = riwayat[s.id] || [];
  const latest = r[r.length - 1];

  if (!latest || !latest.lengkap) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, backgroundColor: "#F7F5F0" }}>
        <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack} />
        <div className="p-8 text-center flex flex-col items-center justify-center" style={{ minHeight: "60vh" }}>
          <div style={{ width: 64, height: 64, background: "#FFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Trophy size={32} style={{ color: MUTED }} />
          </div>
          <h3 style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 8 }}>Asesmen Belum Lengkap</h3>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.5, marginBottom: 24, maxWidth: 280 }}>
            Asesmen {s.name.split(" ")[0]} belum lengkap. Lengkapi asesmen terlebih dahulu untuk melihat hasil pemetaan bakat.
          </p>
          {onStartObs && (
            <button
              onClick={() => onStartObs(s.id)}
              style={{ background: "#2D543E", color: "#FFF", fontFamily: PJS, fontWeight: 700, fontSize: 13, padding: "12px 24px", borderRadius: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(45,84,62,0.3)" }}
              className="active:scale-95 transition-all"
            >
              Lanjutkan Asesmen
            </button>
          )}
        </div>
      </div>
    );
  }
  
  const skorFungsional = latest.skorFungsional || ({} as Record<FungsionalKategori, number | null>);
  const skorRiasec = latest.skorRiasec || ({} as Record<RiasecKategori, number | null>);

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, backgroundColor: "#F7F5F0" }}>
      <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack} />
      
      <div className="px-4 pt-4 pb-8 space-y-5">
        <ProfilFungsionalRadar scores={skorFungsional} studentName={s.name.split(" ")[0]} studentId={s.id} />
        <ProfilKecenderunganBar scores={skorRiasec} studentName={s.name.split(" ")[0]} studentId={s.id} />
        <SuggestedCompetitions studentId={s.id} go={go} />
      </div>
    </div>
  );
}
