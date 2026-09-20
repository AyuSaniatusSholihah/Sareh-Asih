import React from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList
} from "recharts";
import {
  FUNGSIONAL_KATEGORI, FUNGSIONAL_META,
  RIASEC_KATEGORI, RIASEC_META,
  PROFIL_FUNGSIONAL, PROFIL_KECENDERUNGAN,
  FungsionalKategori, RiasecKategori
} from "./data";
import { CARD, BDR, TEXT, DEEP, PJS, IPS, DMM, MUTED, A } from "./ui-kit";
import { Activity, Sparkles, Target } from "lucide-react";
import riasecInfographicImg from "@/imports/riasec-infographic.jpg";

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

export function ProfilFungsionalRadar({
  jawaban,
  readOnly = false,
  studentName,
  studentId,
}: {
  jawaban: Record<number, number|"TDD">;
  readOnly?: boolean;
  studentName?: string;
  studentId?: number;
}) {
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

  // Hitung rata-rata kemandirian
  const validScores = chartData.map(d => d.A);
  const avgKemandirian = validScores.length > 0
    ? Math.round(validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length)
    : 0;

  // Nama dan teks kesimpulan kemandirian
  const name = studentName || (studentId === 1 ? "Rafi" : studentId === 2 ? "Nisa" : studentId === 3 ? "Arga" : "Siswa");
  let keteranganKemandirian = "";
  if (studentId === 1 || name === "Rafi") {
    keteranganKemandirian = `${name} memiliki tingkat kemandirian sangat baik pada Perawatan Diri & Mobilitas, namun memerlukan pendampingan berkala pada tugas kognisi dan pemahaman instruksi bertahap.`;
  } else if (studentId === 2 || name === "Nisa") {
    keteranganKemandirian = `${name} menunjukkan kemandirian dan fokus yang tinggi dalam Kognisi dan Interaksi Sosial, dengan dukungan arahan visual yang konsisten untuk aktivitas harian.`;
  } else if (studentId === 3 || name === "Arga") {
    keteranganKemandirian = `${name} memiliki kemampuan kognisi dan penalaran yang sangat unggul, namun membutuhkan penyesuaian lingkungan dan alat bantu pada mobilitas fisik.`;
  } else {
    const sorted = [...chartData].sort((a, b) => b.A - a.A);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];
    keteranganKemandirian = `${name} menunjukkan kemandirian optimal pada aspek ${highest.subject} (${highest.A}%), serta memerlukan pendampingan berkelanjutan pada aspek ${lowest.subject} (${lowest.A}%).`;
  }

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
      {/* Header with Title & Average Badge */}
      <div className="flex items-center justify-between gap-2 mb-1 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <Activity size={18} style={{ color: DEEP }} className="flex-shrink-0" />
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, whiteSpace: "nowrap" }}>
            Profil Kemandirian
          </h3>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            background: "#EBF4EE",
            border: "1px solid rgba(45,84,62,0.22)",
          }}
        >
          <span style={{ color: DEEP, fontFamily: PJS, fontWeight: 800, fontSize: 11, whiteSpace: "nowrap" }}>
            Rata-rata: {avgKemandirian}%
          </span>
        </div>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 14, paddingLeft: 4, lineHeight: 1.4 }}>
        Kapasitas fungsional & kemandirian harian di 6 domain kehidupan (Skala 0–100%).
      </p>

      {/* Radar Chart */}
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

      {/* Breakdown Persentase Setiap Domain */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 8, paddingLeft: 2 }}>
          Rincian Persentase Kemandirian:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {chartData.map((item) => {
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
            Kesimpulan Kemandirian:
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
            {keteranganKemandirian}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProfilKecenderunganBar({
  jawaban,
  readOnly = false,
  studentName,
  studentId,
}: {
  jawaban: Record<number, number|"TDD">;
  readOnly?: boolean;
  studentName?: string;
  studentId?: number;
}) {
  const data = RIASEC_KATEGORI.map(tipe => ({
    tipe,
    label: RIASEC_META[tipe].letter,
    skor: skorTipe(jawaban, tipe),
    color: RIASEC_META[tipe].color,
    icon: RIASEC_META[tipe].icon,
    fullName: tipe,
    desc: RIASEC_META[tipe].desc,
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

  // Temukan kategori dominan
  const sortedRiasec = [...chartData].sort((a, b) => b.skor - a.skor);
  const dominant = sortedRiasec[0] || { label: "A", fullName: "Artistic", skor: 85, color: "#9D174D", desc: "Mengekspresikan diri lewat seni" };

  // Nama dan teks kesimpulan minat
  const name = studentName || (studentId === 1 ? "Rafi" : studentId === 2 ? "Nisa" : studentId === 3 ? "Arga" : "Siswa");
  let kesimpulanMinat = "";
  if (studentId === 1 || name === "Rafi") {
    kesimpulanMinat = `Menunjukkan minat tertinggi pada tipe Artistic (Seni & Kreativitas) dan Investigative (Eksplorasi). ${name} sangat antusias mengekspresikan ide melalui bunyi audio, musik ritmik, dan kreasi taktil.`;
  } else if (studentId === 2 || name === "Nisa") {
    kesimpulanMinat = `Memiliki potensi dan minat kuat pada tipe Artistic dan Realistic. ${name} unggul dalam kepekaan visual, seni rupa, keterampilan tangan, dan tugas yang membutuhkan ketelitian motorik tinggi.`;
  } else if (studentId === 3 || name === "Arga") {
    kesimpulanMinat = `Sangat unggul pada tipe Investigative (Analitis) dan Conventional (Keteraturan). ${name} memiliki daya nalar logis tajam, menyukai sains, teknologi, serta pemecahan masalah sistematis.`;
  } else {
    const top1 = sortedRiasec[0];
    const top2 = sortedRiasec[1] || sortedRiasec[0];
    kesimpulanMinat = `${name} memiliki kecenderungan minat tertinggi pada aktivitas bertipe ${top1.fullName} (${top1.skor}%) dan ${top2.fullName} (${top2.skor}%). Disarankan diberikan ruang eksplorasi dan pembinaan proyek yang selaras dengan bakat ini.`;
  }

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
      {/* Header with Title & Dominant Talent Badge */}
      <div className="flex items-center justify-between gap-2 mb-1 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <Target size={18} style={{ color: A }} className="flex-shrink-0" />
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, whiteSpace: "nowrap" }}>
            Kecenderungan Minat
          </h3>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
          style={{
            background: "#FFF7ED",
            border: "1px solid #FFEDD5",
          }}
        >
          <span style={{ color: "#C2410C", fontFamily: PJS, fontWeight: 800, fontSize: 11, whiteSpace: "nowrap" }}>
            Dominan: {dominant.label} ({dominant.skor}%)
          </span>
        </div>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 16, paddingLeft: 4, lineHeight: 1.4 }}>
        Tingkat ketertarikan anak berdasarkan model RIASEC. Nilai dominan menandai bakat utama.
      </p>

      {/* Bar Chart */}
      <div style={{ width: '100%', height: 210 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontFamily: DMM, fontSize: 12, fontWeight: 700, fill: TEXT }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontFamily: DMM, fontSize: 10, fill: MUTED }} domain={[0, 100]} />
            <Tooltip cursor={{ fill: 'rgba(91,122,104,0.04)' }} content={<BarCustomTooltip />} />
            <Bar dataKey="skor" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="skor" position="top" fill={TEXT} fontSize={10} fontFamily={DMM} fontWeight={700} formatter={(v: any) => (v != null ? `${v}%` : "")} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Category Chips */}
      <div className="flex flex-wrap items-center justify-between gap-1 mt-3 pt-3 border-t border-slate-100">
        {chartData.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px]"
            style={{
              background: item.label === dominant.label ? "#FFF7ED" : "#F8FAFC",
              border: item.label === dominant.label ? "1px solid #FDBA74" : `1px solid ${BDR}`,
              fontWeight: item.label === dominant.label ? 800 : 600,
              color: item.label === dominant.label ? "#C2410C" : MUTED,
            }}
          >
            <span style={{ fontFamily: DMM }}>{item.label}:</span>
            <span style={{ color: item.color }}>{item.skor}%</span>
          </div>
        ))}
      </div>

      {/* Panduan Visual 6 Tipe RIASEC (Gambar Ilustrasi) */}
      <div
        style={{
          marginTop: 14,
          borderRadius: 16,
          overflow: "hidden",
          border: "1.5px solid rgba(210, 110, 91, 0.22)",
          boxShadow: "0 4px 14px rgba(210, 110, 91, 0.08)",
          background: "#FFFFFF",
        }}
      >
        <div style={{ padding: "10px 14px 8px", background: "#FFF9F5", borderBottom: "1px solid rgba(210, 110, 91, 0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12, color: "#C2410C" }}>
            🎨 Panduan Visual 6 Tipe RIASEC
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, background: "#FFEDD5", color: "#C2410C", padding: "2px 7px", borderRadius: 8, fontFamily: PJS }}>
            Model Minat
          </span>
        </div>
        <img
          src={riasecInfographicImg}
          alt="Panduan Visual 6 Tipe RIASEC"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Keterangan Kesimpulan Ringkas Minat */}
      <div
        style={{
          marginTop: 12,
          background: "#FFF9F5",
          border: `1.5px solid rgba(210, 110, 91, 0.22)`,
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
            background: "rgba(210, 110, 91, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          <Target size={15} style={{ color: A }} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 12,
              color: "#C2410C",
              marginBottom: 3,
            }}
          >
            Kesimpulan Minat & Bakat:
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
            {kesimpulanMinat}
          </p>
        </div>
      </div>
    </div>
  );
}
