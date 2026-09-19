import React from "react";
import {
  Sparkles, Star, Trophy, ChevronRight, Info, ExternalLink, Activity, Target
} from "lucide-react";
import {
  A, CARD, TEXT, MUTED, DEEP, PJS, IPS, DMM, TBar, BDR
} from "../ui-kit";
import { useStudents, studentTalentDetail, type Screen } from "../data";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList
} from "recharts";

export function FungsionalRadarChart({ studentId }: { studentId: number }) {
  // Mock data for WHODAS fungsional profile
  const data = studentId === 2 ? [
    { subject: 'Kognisi', A: 90, fullMark: 100 },
    { subject: 'Mobilitas', A: 40, fullMark: 100 },
    { subject: 'Perawatan Diri', A: 50, fullMark: 100 },
    { subject: 'Interaksi', A: 85, fullMark: 100 },
    { subject: 'Aktivitas', A: 70, fullMark: 100 },
    { subject: 'Partisipasi', A: 65, fullMark: 100 },
  ] : [
    { subject: 'Kognisi', A: 60, fullMark: 100 },
    { subject: 'Mobilitas', A: 80, fullMark: 100 },
    { subject: 'Perawatan Diri', A: 90, fullMark: 100 },
    { subject: 'Interaksi', A: 40, fullMark: 100 },
    { subject: 'Aktivitas', A: 50, fullMark: 100 },
    { subject: 'Partisipasi', A: 50, fullMark: 100 },
  ];

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 24, padding: "20px 14px", boxShadow: "0 2px 12px rgba(91,122,104,0.06)" }}>
      <div className="flex items-center gap-2 mb-2 px-2">
        <Activity size={18} style={{ color: DEEP }} />
        <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT }}>
          Profil Fungsional
        </h3>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, paddingLeft: 8, lineHeight: 1.4 }}>
        Kapasitas fungsional anak di berbagai domain kehidupan sehari-hari (Skala 0-100).
      </p>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: TEXT, fontSize: 11, fontFamily: DMM, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Profil" dataKey="A" stroke={DEEP} fill={DEEP} fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RiasecBarChart({ studentId }: { studentId: number }) {
  // Mock data for RIASEC profile
  const data = studentId === 2 ? [
    { name: 'R', label: 'Realistic', value: 30, color: '#94A3B8' },
    { name: 'I', label: 'Investigative', value: 45, color: '#94A3B8' },
    { name: 'A', label: 'Artistic', value: 85, color: '#FF5B8A' },
    { name: 'S', label: 'Social', value: 90, color: '#F59E0B' },
    { name: 'E', label: 'Enterprising', value: 75, color: '#10B981' },
    { name: 'C', label: 'Conventional', value: 40, color: '#94A3B8' },
  ] : [
    { name: 'R', label: 'Realistic', value: 85, color: '#3B82F6' },
    { name: 'I', label: 'Investigative', value: 70, color: '#10B981' },
    { name: 'A', label: 'Artistic', value: 40, color: '#94A3B8' },
    { name: 'S', label: 'Social', value: 35, color: '#94A3B8' },
    { name: 'E', label: 'Enterprising', value: 50, color: '#94A3B8' },
    { name: 'C', label: 'Conventional', value: 90, color: '#8B5CF6' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: CARD, border: `1px solid ${BDR}`, padding: "8px 12px", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12, color: TEXT }}>{data.label}</p>
          <p style={{ fontFamily: DMM, fontWeight: 700, fontSize: 14, color: data.color }}>{data.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 24, padding: "20px 14px", boxShadow: "0 2px 12px rgba(91,122,104,0.06)" }}>
      <div className="flex items-center gap-2 mb-2 px-2">
        <Target size={18} style={{ color: A }} />
        <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT }}>
          Profil Kecenderungan Aktivitas
        </h3>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, paddingLeft: 8, lineHeight: 1.4 }}>
        Tingkat ketertarikan anak berdasarkan model RIASEC. Nilai dominan menandai bakat utama.
      </p>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fill: MUTED, fontSize: 12, fontFamily: DMM, fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 10, fontFamily: DMM }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(91,122,104,0.05)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="value" position="top" fill={TEXT} fontSize={10} fontFamily={DMM} fontWeight={700} formatter={(v: number) => `${v}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SuggestedCompetitions({ studentId }: { studentId: number }) {
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
      <button style={{ width: '100%', marginTop: 12, padding: "10px 0", background: A, color: "#fff", borderRadius: 12, fontFamily: PJS, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }} className="flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
        Lihat Semua Lomba <ChevronRight size={14} />
      </button>
    </div>
  );
}

export function TalentMapDetailScreen({
  onBack,
  studentId,
  go,
}: {
  onBack: () => void;
  studentId: number;
  go: (s: Screen) => void;
}) {
  const students = useStudents();
  const s = students.find(x => x.id === studentId);
  const data = studentTalentDetail[studentId];
  if (!s) return null;

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, backgroundColor: "#F7F5F0" }}>
      <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack} />
      
      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* Profil Fungsional (Radar Chart) */}
        <FungsionalRadarChart studentId={studentId} />

        {/* Profil Kecenderungan (Bar Chart) */}
        <RiasecBarChart studentId={studentId} />

        {/* Lomba yang disarankan */}
        <SuggestedCompetitions studentId={studentId} />

      </div>
    </div>
  );
}
