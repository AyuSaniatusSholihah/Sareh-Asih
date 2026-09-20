import React from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell
} from "recharts";
import {
  FUNGSIONAL_KATEGORI, FUNGSIONAL_META,
  RIASEC_KATEGORI, RIASEC_META,
  PROFIL_FUNGSIONAL, PROFIL_KECENDERUNGAN,
  FungsionalKategori, RiasecKategori
} from "./data";
import { CARD, BDR, TEXT, DEEP, PJS, DMM, MUTED } from "./ui-kit";
import { Activity, Sparkles } from "lucide-react";

// --- Utility Functions for Scoring ---
export function skorDomain(jawaban: Record<number, number|"TDD">, domain: FungsionalKategori): number | null {
  const items = PROFIL_FUNGSIONAL.filter(i => i.kategori === domain);
  const validAnswers = items.map(i => jawaban[i.id]).filter(v => typeof v === "number" && v >= 0) as number[];
  if (validAnswers.length === 0) return null;
  const sum = validAnswers.reduce((a, b) => a + b, 0);
  return Math.round((sum / (validAnswers.length * 3)) * 100);
}

export function skorTipe(jawaban: Record<number, number|"TDD">, tipe: RiasecKategori): number | null {
  const items = PROFIL_KECENDERUNGAN.filter(i => i.kategori === tipe);
  const validAnswers = items.map(i => jawaban[i.id]).filter(v => typeof v === "number" && v >= 0) as number[];
  if (validAnswers.length === 0) return null;
  const sum = validAnswers.reduce((a, b) => a + b, 0);
  return Math.round((sum / (validAnswers.length * 3)) * 100);
}

export function kodeTigaHuruf(jawaban: Record<number, number|"TDD">): string {
  const scores = RIASEC_KATEGORI.map(tipe => ({
    tipe,
    letter: RIASEC_META[tipe].letter,
    score: skorTipe(jawaban, tipe) ?? 0
  })).sort((a, b) => b.score - a.score);

  // Get top 3 or top 4 if there's a tie for the 3rd spot
  let topCount = 3;
  if (scores.length >= 4 && scores[2].score === scores[3].score && scores[2].score > 0) {
    topCount = 4;
  }
  
  return scores.slice(0, topCount).map(s => s.letter).join("");
}

export function skorKetekunan(jawaban: Record<number, number|"TDD">): string {
  // Mock ketekunan score based on Fungsional Partisipasi & Kognisi
  const partisipasi = skorDomain(jawaban, "Partisipasi") ?? 0;
  const kognisi = skorDomain(jawaban, "Kognisi") ?? 0;
  const avg = (partisipasi + kognisi) / 2;
  
  if (avg >= 80) return "Sangat Tekun (Mandiri & Berinisiatif)";
  if (avg >= 60) return "Tekun (Dengan arahan minimal)";
  return "Perlu Bantuan (Membutuhkan dorongan konsisten)";
}

export function getMockJawaban(studentId: number): Record<number, number> {
  const ans: Record<number, number> = {};
  
  if (studentId === 1) { // Rafi (Tunanetra)
    // Fungsional
    PROFIL_FUNGSIONAL.forEach(p => {
      if (p.kategori === "Perawatan Diri") ans[p.id] = 2; // 2/2 -> 100% (or mostly 2s)
      else if (p.kategori === "Mobilitas") ans[p.id] = 2;
      else if (p.kategori === "Kognisi") ans[p.id] = 1; // 1/2 -> 50%
      else ans[p.id] = 1;
    });
    // RIASEC
    PROFIL_KECENDERUNGAN.forEach(p => {
      if (p.kategori === "Artistic") ans[p.id] = 3;
      else if (p.kategori === "Investigative") ans[p.id] = 2;
      else ans[p.id] = 1;
    });
  } else if (studentId === 2) { // Nisa (Tunarungu)
    PROFIL_FUNGSIONAL.forEach(p => {
      if (p.kategori === "Kognisi") ans[p.id] = 2;
      else if (p.kategori === "Interaksi dengan Orang Lain") ans[p.id] = 2;
      else ans[p.id] = 1;
    });
    PROFIL_KECENDERUNGAN.forEach(p => {
      if (p.kategori === "Realistic") ans[p.id] = 3;
      else if (p.kategori === "Artistic") ans[p.id] = 3;
      else ans[p.id] = 1;
    });
  } else if (studentId === 3) { // Arga (Tunadaksa)
    PROFIL_FUNGSIONAL.forEach(p => {
      if (p.kategori === "Kognisi") ans[p.id] = 2;
      else if (p.kategori === "Mobilitas") ans[p.id] = 0;
      else ans[p.id] = 1;
    });
    PROFIL_KECENDERUNGAN.forEach(p => {
      if (p.kategori === "Investigative") ans[p.id] = 3;
      else if (p.kategori === "Conventional") ans[p.id] = 2;
      else ans[p.id] = 0;
    });
  } else {
    // Default
    PROFIL_FUNGSIONAL.forEach(p => ans[p.id] = 1);
    PROFIL_KECENDERUNGAN.forEach(p => ans[p.id] = 1);
  }
  
  return ans;
}

// --- Shared Chart Components ---

export function ProfilFungsionalRadar({ jawaban, readOnly = false }: { jawaban: Record<number, number|"TDD">; readOnly?: boolean }) {
  const data = FUNGSIONAL_KATEGORI.map(domain => ({
    subject: domain,
    icon: FUNGSIONAL_META[domain].icon,
    A: skorDomain(jawaban, domain)
  }));

  const validDataCount = data.filter(d => d.A !== null).length;
  if (validDataCount === 0) {
    return (
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 24, padding: "30px 16px", textAlign: "center", boxShadow: "0 2px 12px rgba(91,122,104,0.06)" }}>
        <p style={{ color: MUTED, fontFamily: IPS, fontSize: 13 }}>Data asesmen belum memadai.</p>
      </div>
    );
  }

  // Use 0 for chart display if null, but keep original value for logic
  const chartData = data.map(d => ({ ...d, A: d.A ?? 0 }));

  const RadarCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, padding: "8px 12px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12, color: TEXT }}>{p.icon} {p.subject}</p>
          <p style={{ fontFamily: DMM, fontWeight: 700, fontSize: 14, color: DEEP }}>{p.A}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 24, padding: "20px 16px", boxShadow: "0 2px 12px rgba(91,122,104,0.06)" }}>
      <div className="flex items-start justify-between gap-2 mb-1 px-1">
        <div className="flex items-center gap-2">
          <Activity size={18} style={{ color: DEEP }} />
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT }}>
            Profil Fungsional
          </h3>
        </div>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 14, paddingLeft: 4, lineHeight: 1.4 }}>
        Kapasitas fungsional di 6 domain kehidupan.
      </p>

      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={chartData}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: TEXT, fontSize: 11, fontFamily: DMM, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<RadarCustomTooltip />} />
            <Radar name="Kemandirian" dataKey="A" stroke={DEEP} fill={DEEP} fillOpacity={0.25} strokeWidth={2.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProfilKecenderunganBar({ jawaban, readOnly = false }: { jawaban: Record<number, number|"TDD">; readOnly?: boolean }) {
  const data = RIASEC_KATEGORI.map(tipe => ({
    tipe,
    label: RIASEC_META[tipe].letter,
    skor: skorTipe(jawaban, tipe),
    color: RIASEC_META[tipe].color,
    icon: RIASEC_META[tipe].icon,
    fullName: tipe
  }));

  const validDataCount = data.filter(d => d.skor !== null).length;
  if (validDataCount === 0) {
    return (
      <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 24, padding: "30px 16px", textAlign: "center", boxShadow: "0 2px 12px rgba(91,122,104,0.06)" }}>
        <p style={{ color: MUTED, fontFamily: IPS, fontSize: 13 }}>Data asesmen belum memadai.</p>
      </div>
    );
  }

  const chartData = data.map(d => ({ ...d, skor: d.skor ?? 0 }));

  const BarCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, padding: "8px 12px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12, color: TEXT }}>
            {p.icon} {p.fullName} ({p.label})
          </p>
          <p style={{ fontFamily: DMM, fontWeight: 700, fontSize: 14, color: p.color }}>{p.skor}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 24, padding: "20px 16px", boxShadow: "0 2px 12px rgba(91,122,104,0.06)" }}>
      <div className="flex items-center gap-2 mb-2 px-1">
        <Sparkles size={18} style={{ color: "#7C3AED" }} />
        <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT }}>
          Kecenderungan Aktivitas (RIASEC)
        </h3>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 14, paddingLeft: 4, lineHeight: 1.4 }}>
        Minat dan preferensi berbasis aktivitas.
      </p>

      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontFamily: DMM, fontSize: 12, fontWeight: 700, fill: TEXT }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontFamily: DMM, fontSize: 10, fill: MUTED }} domain={[0, 100]} />
            <Tooltip cursor={{ fill: 'rgba(91,122,104,0.04)' }} content={<BarCustomTooltip />} />
            <Bar dataKey="skor" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
