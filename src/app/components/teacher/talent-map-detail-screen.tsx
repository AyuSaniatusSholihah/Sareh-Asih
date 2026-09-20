import React from "react";
import {
  Sparkles, Star, Trophy, ChevronRight, Info, ExternalLink, Activity, Target
} from "lucide-react";
import {
  A, CARD, TEXT, MUTED, DEEP, PJS, IPS, DMM, TBar, BDR
} from "../ui-kit";
import { useStudents, type Screen } from "../data";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList
} from "recharts";

interface FungsionalDomainItem {
  subject: string;
  icon: string;
  A: number;
  fullMark: number;
}

export function getStudentFungsionalData(studentId: number, studentName = "Siswa"): {
  data: FungsionalDomainItem[];
  avg: number;
  statusLabel: string;
  keterangan: string;
} {
  let domains: FungsionalDomainItem[] = [];
  let customKeterangan = "";

  if (studentId === 2) {
    // Nisa Aulia (Tunarungu)
    domains = [
      { subject: 'Kognisi', icon: '🧠', A: 90, fullMark: 100 },
      { subject: 'Interaksi', icon: '🤝', A: 85, fullMark: 100 },
      { subject: 'Aktivitas', icon: '📅', A: 70, fullMark: 100 },
      { subject: 'Partisipasi', icon: '🙋', A: 65, fullMark: 100 },
      { subject: 'Perawatan Diri', icon: '🧍', A: 50, fullMark: 100 },
      { subject: 'Mobilitas', icon: '🏃', A: 40, fullMark: 100 },
    ];
    customKeterangan = `${studentName} memiliki kemandirian tinggi dalam Kognisi (90%) dan Interaksi (85%). Memerlukan pendampingan bertahap pada orientasi Mobilitas (40%) dan Perawatan Diri (50%).`;
  } else if (studentId === 3) {
    // Arga Saputra (Tunadaksa)
    domains = [
      { subject: 'Kognisi', icon: '🧠', A: 85, fullMark: 100 },
      { subject: 'Interaksi', icon: '🤝', A: 80, fullMark: 100 },
      { subject: 'Partisipasi', icon: '🙋', A: 70, fullMark: 100 },
      { subject: 'Aktivitas', icon: '📅', A: 65, fullMark: 100 },
      { subject: 'Perawatan Diri', icon: '🧍', A: 55, fullMark: 100 },
      { subject: 'Mobilitas', icon: '🏃', A: 40, fullMark: 100 },
    ];
    customKeterangan = `${studentName} mandiri dan berinisiatif dalam Kognisi (85%) serta Interaksi (80%). Memerlukan akomodasi fisik berkala pada Mobilitas (40%) dan Perawatan Diri (55%).`;
  } else {
    // Rafi Pratama (Tunanetra) & default
    domains = [
      { subject: 'Perawatan Diri', icon: '🧍', A: 90, fullMark: 100 },
      { subject: 'Mobilitas', icon: '🏃', A: 80, fullMark: 100 },
      { subject: 'Kognisi', icon: '🧠', A: 60, fullMark: 100 },
      { subject: 'Aktivitas', icon: '📅', A: 50, fullMark: 100 },
      { subject: 'Partisipasi', icon: '🙋', A: 50, fullMark: 100 },
      { subject: 'Interaksi', icon: '🤝', A: 40, fullMark: 100 },
    ];
    customKeterangan = `${studentName} sangat mandiri dalam Perawatan Diri (90%) dan Mobilitas (80%). Butuh stimulasi terarah pada Interaksi Sosial (40%) dan Aktivitas Mandiri (50%).`;
  }

  const avg = Math.round(domains.reduce((sum, d) => sum + d.A, 0) / domains.length);
  const statusLabel = avg >= 80 ? "Mandiri Penuh" : avg >= 65 ? "Mandiri Baik" : avg >= 50 ? "Mandiri Sebagian" : "Perlu Bantuan";

  return {
    data: domains,
    avg,
    statusLabel,
    keterangan: customKeterangan,
  };
}

export function FungsionalRadarChart({ studentId, studentName = "Siswa" }: { studentId: number; studentName?: string }) {
  const { data, avg, statusLabel, keterangan } = getStudentFungsionalData(studentId, studentName);

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
      {/* Header with Title & Overall Percentage Badge */}
      <div className="flex items-start justify-between gap-2 mb-1 px-1">
        <div className="flex items-center gap-2">
          <Activity size={18} style={{ color: DEEP }} />
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT }}>
            Kemandirian Siswa
          </h3>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            background: avg >= 65 ? "#ECFDF5" : "#FFFBEB",
            border: `1px solid ${avg >= 65 ? "#A7F3D0" : "#FDE68A"}`,
          }}
        >
          <span style={{ color: avg >= 65 ? "#065F46" : "#92400E", fontFamily: DMM, fontWeight: 800, fontSize: 12 }}>
            {avg}%
          </span>
          <span style={{ color: avg >= 65 ? "#059669" : "#B45309", fontFamily: PJS, fontWeight: 700, fontSize: 10 }}>
            · {statusLabel}
          </span>
        </div>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 14, paddingLeft: 4, lineHeight: 1.4 }}>
        Kapasitas fungsional & kemandirian harian di 6 domain kehidupan (Skala 0–100%).
      </p>

      {/* Radar Chart */}
      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: TEXT, fontSize: 11, fontFamily: DMM, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<RadarCustomTooltip />} />
            <Radar name="Kemandirian" dataKey="A" stroke={DEEP} fill={DEEP} fillOpacity={0.25} strokeWidth={2.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown Persentase Setiap Domain */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 8, paddingLeft: 2 }}>
          Rincian Persentase Kemandirian:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {data.map((item) => {
            const isHigh = item.A >= 70;
            const isMid = item.A >= 50;
            const badgeBg = isHigh ? "#ECFDF5" : isMid ? "#FEF3C7" : "#FEE2E2";
            const badgeColor = isHigh ? "#065F46" : isMid ? "#92400E" : "#991B1B";
            const barColor = isHigh ? "#10B981" : isMid ? "#F59E0B" : "#EF4444";
            const statusText = isHigh ? "Mandiri" : isMid ? "Sebagian" : "Perlu Bantuan";

            return (
              <div
                key={item.subject}
                style={{
                  background: "#F8FAFC",
                  border: `1px solid ${BDR}`,
                  borderRadius: 14,
                  padding: "8px 10px",
                }}
                className="flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-xs flex-shrink-0">{item.icon}</span>
                    <span
                      className="text-[11px] font-bold truncate"
                      style={{ color: TEXT, fontFamily: PJS }}
                    >
                      {item.subject}
                    </span>
                  </div>
                  <span
                    className="text-xs font-extrabold flex-shrink-0"
                    style={{ color: barColor, fontFamily: DMM }}
                  >
                    {item.A}%
                  </span>
                </div>

                {/* Progress bar visual */}
                <div
                  className="w-full rounded-full overflow-hidden mb-1"
                  style={{ height: 5, background: "#E2E8F0" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.A}%`, background: barColor }}
                  />
                </div>

                <div className="flex justify-between items-center text-[9.5px]">
                  <span
                    className="font-bold px-1.5 py-0.2 rounded"
                    style={{ background: badgeBg, color: badgeColor }}
                  >
                    {statusText}
                  </span>
                  <span style={{ color: MUTED }}>
                    {item.A}/100
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keterangan Tulisannya Singkat di Bawahnya */}
      <div
        style={{
          marginTop: 14,
          background: "#F0F7F4",
          border: `1.5px solid rgba(45, 84, 62, 0.20)`,
          borderRadius: 16,
          padding: "12px 14px",
        }}
        className="flex items-start gap-2.5"
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "rgba(45, 84, 62, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          <Sparkles size={15} style={{ color: DEEP }} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 12,
              color: DEEP,
              marginBottom: 3,
            }}
          >
            Keterangan Kemandirian:
          </p>
          <p
            style={{
              fontFamily: IPS,
              fontSize: 11.5,
              color: TEXT,
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            {keterangan}
          </p>
        </div>
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
}: {
  onBack: () => void;
  studentId: number;
  go: (s: Screen) => void;
}) {
  const students = useStudents();
  const s = students.find(x => x.id === studentId);
  if (!s) return null;

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, backgroundColor: "#F7F5F0" }}>
      <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack} />
      
      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* Profil Kemandirian & Fungsional (Radar Chart + Persentase Domain + Keterangan Singkat) */}
        <FungsionalRadarChart studentId={studentId} studentName={s.name.split(" ")[0]} />

        {/* Profil Kecenderungan (Bar Chart) */}
        <RiasecBarChart studentId={studentId} />

        {/* Lomba yang disarankan */}
        <SuggestedCompetitions studentId={studentId} go={go} />

      </div>
    </div>
  );
}
