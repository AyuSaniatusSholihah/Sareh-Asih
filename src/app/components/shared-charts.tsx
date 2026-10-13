import React, { useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList
} from "recharts";
import {
  FUNGSIONAL_KATEGORI, FUNGSIONAL_META, PENJELASAN_FUNGSIONAL_ORTU,
  RIASEC_KATEGORI, RIASEC_META, RIASEC_PENJELASAN, RIASEC_KODE,
  PROFIL_FUNGSIONAL, PROFIL_KECENDERUNGAN,
  FungsionalKategori, RiasecKategori
} from "./data";
import { CARD, BDR, TEXT, DEEP, PJS, IPS, DMM, MUTED, A } from "./ui-kit";
import { Activity, Sparkles, Target, Brain, Info, X, Lightbulb, ChevronRight, ListChecks } from "lucide-react";
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
  return Math.round((sum / (validAnswers.length * 2)) * 100);
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
  
  if (studentId === 1) { // Rafi (Tunadaksa)
    // Fungsional (0=Tidak/Belum Bisa, 1=Banyak Bantuan, 2=Sedikit Bantuan, 3=Sudah Mandiri)
    PROFIL_FUNGSIONAL.forEach(p => {
      if (p.kategori === "Perawatan Diri") ans[p.id] = 3;
      else if (p.kategori === "Mobilitas") ans[p.id] = 2;
      else if (p.kategori === "Kognisi") ans[p.id] = 2;
      else ans[p.id] = 1;
    });
    // RIASEC (0=Tidak Pernah, 1=Kadang, 2=Sering / Selalu)
    PROFIL_KECENDERUNGAN.forEach(p => {
      if (p.kategori === "Artistic") ans[p.id] = 2;
      else if (p.kategori === "Investigative") ans[p.id] = 1;
      else ans[p.id] = 1;
    });
  } else if (studentId === 2) { // Nisa (Tunadaksa Ringan)
    PROFIL_FUNGSIONAL.forEach(p => {
      if (p.kategori === "Kognisi") ans[p.id] = 3;
      else if (p.kategori === "Interaksi dengan Orang Lain") ans[p.id] = 3;
      else ans[p.id] = 2;
    });
    PROFIL_KECENDERUNGAN.forEach(p => {
      if (p.kategori === "Realistic") ans[p.id] = 2;
      else if (p.kategori === "Artistic") ans[p.id] = 2;
      else ans[p.id] = 1;
    });
  } else if (studentId === 3) { // Arga (Tunadaksa Ringan)
    PROFIL_FUNGSIONAL.forEach(p => {
      if (p.kategori === "Kognisi") ans[p.id] = 2;
      else if (p.kategori === "Mobilitas") ans[p.id] = 1;
      else ans[p.id] = 1;
    });
    PROFIL_KECENDERUNGAN.forEach(p => {
      if (p.kategori === "Investigative") ans[p.id] = 2;
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
  const [activeDomain, setActiveDomain] = useState<FungsionalKategori | null>(null);

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

  // Nama dan teks kesimpulan kemandirian
  const name = studentName || (studentId === 1 ? "Rafi" : studentId === 2 ? "Nisa" : studentId === 3 ? "Arga" : "Siswa");
  const tersedia = data.filter((d): d is typeof d & {A: number} => d.A !== null);
  let keteranganKemandirian = "";
  
  if (tersedia.length === 0) {
    keteranganKemandirian = "Data belum cukup untuk menyimpulkan profil fungsional siswa.";
  } else {
    const terurut = [...tersedia].sort((a, b) => b.A - a.A);
    const tertinggi = terurut[0];
    const terendah = terurut[terurut.length - 1];
    const selisih = tertinggi.A - terendah.A;

    if (selisih < 15 || tersedia.length < 2) {
      keteranganKemandirian = `${name} menunjukkan kapasitas fungsional yang cukup merata di seluruh domain yang teramati, dengan ${tertinggi.subject} (${tertinggi.A}%) sedikit paling menonjol.`;
    } else {
      keteranganKemandirian = `${name} menunjukkan kapasitas fungsional paling menonjol pada aspek ${tertinggi.subject} (${tertinggi.A}%). Aspek ${terendah.subject} (${terendah.A}%) masih bisa terus didampingi lewat pembiasaan bertahap di sekolah dan di rumah.`;
    }
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
            Profil Fungsional &amp; Kemandirian
          </h3>
        </div>
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 12, paddingLeft: 4, lineHeight: 1.4 }}>
        Tingkat kemandirian anak pada 6 domain kehidupan sehari-hari (Skala 0–100%).
      </p>

      {/* Panduan Membaca Diagram untuk Orang Tua */}
      <div style={{
        background: "#F0FDF4",
        border: "1px solid #BBF7D0",
        borderRadius: 14,
        padding: "10px 12px",
        marginBottom: 12,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
      }}>
        <Info size={15} style={{ color: "#15803D", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#166534", margin: 0, lineHeight: 1.45 }}>
          <strong>Cara membaca:</strong> Semakin luas area hijau mendekati tepi luar (100%), semakin mandiri {name}. Ketuk salah satu chip kategori di bawah diagram untuk melihat arti dan contohnya di rumah.
        </p>
      </div>

      {/* Radar Chart */}
      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="55%" data={chartData} margin={{ top: 10, right: 35, bottom: 10, left: 35 }}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: TEXT, fontSize: 11, fontFamily: DMM, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<RadarCustomTooltip />} />
            <Radar name="Fungsional" dataKey="A" stroke={DEEP} fill={DEEP} fillOpacity={0.25} strokeWidth={2.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Chip Interaktif Tap-to-Inspect (Sangat ramah mobile) */}
      <div style={{ marginTop: 10 }}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span style={{ fontFamily: PJS, fontSize: 11, fontWeight: 700, color: MUTED }}>
            Ketuk kategori untuk info lengkap:
          </span>
          {activeDomain && (
            <button
              onClick={() => setActiveDomain(null)}
              style={{ background: "none", border: "none", color: A, fontSize: 11, fontFamily: PJS, fontWeight: 700, cursor: "pointer", padding: 0 }}
            >
              Tutup detail ×
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chartData.map((d) => {
            const domainKey = d.subject as FungsionalKategori;
            const meta = FUNGSIONAL_META[domainKey];
            const isActive = activeDomain === domainKey;
            return (
              <button
                key={d.subject}
                type="button"
                onClick={() => setActiveDomain(isActive ? null : domainKey)}
                style={{
                  background: isActive ? DEEP : meta.bg,
                  color: isActive ? "#FFFFFF" : TEXT,
                  border: `1.5px solid ${isActive ? DEEP : meta.color}40`,
                  borderRadius: 12,
                  padding: "5px 9px",
                  fontSize: 11,
                  fontFamily: PJS,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="active:scale-95"
              >
                <span>{meta.icon}</span>
                <span>{d.subject}</span>
                <span
                  style={{
                    fontFamily: DMM,
                    fontSize: 10.5,
                    opacity: isActive ? 0.9 : 0.7,
                    padding: "1px 5px",
                    borderRadius: 8,
                    background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                  }}
                >
                  {d.A}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Penjelasan Kategori yang Diketuk (Tap-to-Inspect Card) */}
      {activeDomain && (() => {
        const info = PENJELASAN_FUNGSIONAL_ORTU[activeDomain];
        const meta = FUNGSIONAL_META[activeDomain];
        const skor = chartData.find(c => c.subject === activeDomain)?.A ?? 0;
        return (
          <div
            style={{
              marginTop: 12,
              background: "#FFFFFF",
              border: `1.5px solid ${meta.color}60`,
              borderRadius: 16,
              padding: "14px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 18 }}>{meta.icon}</span>
                <div>
                  <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: TEXT, margin: 0 }}>
                    {activeDomain}
                  </p>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: meta.color, fontWeight: 600, margin: 0 }}>
                    {info.istilahOrtu}
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontFamily: DMM,
                  fontWeight: 800,
                  fontSize: 12,
                  color: meta.color,
                  background: meta.bg,
                  padding: "3px 8px",
                  borderRadius: 99,
                }}
              >
                Kemandirian: {skor}%
              </span>
            </div>

            <p style={{ fontFamily: IPS, fontSize: 11.5, color: TEXT, lineHeight: 1.5, margin: "0 0 10px" }}>
              {info.artinyaUntukAnak}
            </p>

            <div style={{ background: BG, borderRadius: 12, padding: "10px 12px", border: `1px solid ${BDR}`, display: "flex", flexDirection: "column", gap: 6 }}>
              <div className="flex items-start gap-2">
                <span style={{ fontSize: 12 }}>🏫</span>
                <p style={{ fontSize: 11, color: MUTED, margin: 0, lineHeight: 1.4 }}>
                  <strong style={{ color: TEXT }}>Di Sekolah:</strong> {info.contohSekolah}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span style={{ fontSize: 12 }}>🏡</span>
                <p style={{ fontSize: 11, color: MUTED, margin: 0, lineHeight: 1.4 }}>
                  <strong style={{ color: TEXT }}>Di Rumah:</strong> {info.contohRumah}
                </p>
              </div>
            </div>

            <div style={{ marginTop: 8, padding: "8px 10px", background: "#FEFCE8", borderRadius: 10, border: "1px solid #FEF08A" }} className="flex items-start gap-2">
              <Lightbulb size={13} style={{ color: "#CA8A04", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 10.5, color: "#854D0E", margin: 0, lineHeight: 1.4 }}>
                <strong>Tips Pendampingan:</strong> {info.tipsPendampingan}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Keterangan Kesimpulan Ringkas */}
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
            Kesimpulan Profil Fungsional:
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
  onLearningRec,
}: {
  jawaban: Record<number, number|"TDD">;
  readOnly?: boolean;
  studentName?: string;
  studentId?: number;
  onLearningRec?: () => void;
}) {
  const [openTipe, setOpenTipe] = useState<RiasecKategori | null>(null);
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
  const top1 = sortedRiasec[0];
  const top2 = sortedRiasec[1] || sortedRiasec[0];
  let kalimatAkhir = "";
  if (name === "Rafi") {
    kalimatAkhir = `${name} dapat diberikan kesempatan untuk mengeksplorasi aktivitas kreatif dan kegiatan yang melibatkan pengamatan atau pemecahan masalah.`;
  } else if (name === "Nisa") {
    kalimatAkhir = `${name} unggul dalam kepekaan visual, seni rupa, keterampilan tangan, dan tugas yang membutuhkan ketelitian motorik tinggi.`;
  } else if (name === "Arga") {
    kalimatAkhir = `${name} memiliki daya nalar logis tajam, menyukai sains, teknologi, serta pemecahan masalah sistematis.`;
  } else {
    kalimatAkhir = `${name} dapat diberikan kesempatan untuk mengeksplorasi ruang belajar dan pembinaan proyek yang selaras dengan bakat ini.`;
  }
  const kesimpulanMinat = `${name} menunjukkan kecenderungan minat tertinggi pada aktivitas ${top1.fullName} (${top1.skor}%) dan ${top2.fullName} (${top2.skor}%). ${kalimatAkhir}`;
  const top4 = sortedRiasec.slice(0, 4);

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
      </div>
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 12, paddingLeft: 4, lineHeight: 1.4 }}>
        Tingkat ketertarikan anak berdasarkan model 6 tipe minat RIASEC. Nilai dominan menandai potensi bakat utama.
      </p>

      {/* Panduan Membaca Diagram untuk Orang Tua */}
      <div style={{
        background: "#FFF7ED",
        border: "1px solid #FFEDD5",
        borderRadius: 14,
        padding: "10px 12px",
        marginBottom: 12,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
      }}>
        <Target size={15} style={{ color: "#C2410C", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#9A3412", margin: 0, lineHeight: 1.45 }}>
          <strong>Cara membaca:</strong> Batang dengan persentase paling tinggi menunjukkan aktivitas yang paling disenangi dan membangkitkan rasa ingin tahu ananda. Ketuk batang atau chip di bawah untuk membaca arti tiap tipe minat.
        </p>
      </div>

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
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  cursor="pointer"
                  onClick={() => setOpenTipe(entry.tipe)}
                />
              ))}
              <LabelList dataKey="skor" position="top" fill={TEXT} fontSize={10} fontFamily={DMM} fontWeight={700} formatter={(v: any) => (v != null ? `${v}%` : "")} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Category Chips with Tap Action */}
      <div className="flex flex-wrap items-center justify-between gap-1 mt-3 pt-3 border-t border-slate-100">
        {chartData.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setOpenTipe(item.tipe)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] active:scale-95 transition-transform"
            style={{
              background: item.label === dominant.label ? "#FFF7ED" : "#F8FAFC",
              border: item.label === dominant.label ? "1px solid #FDBA74" : `1px solid ${BDR}`,
              fontWeight: item.label === dominant.label ? 800 : 600,
              color: item.label === dominant.label ? "#C2410C" : TEXT,
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: DMM, fontWeight: 800 }}>{item.label}:</span>
            <span style={{ color: item.color, fontWeight: 700 }}>{item.skor}%</span>
          </button>
        ))}
      </div>

      {/* Panduan Visual 6 Tipe RIASEC — kartu interaktif, ketuk untuk penjelasan */}
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
        <div style={{ padding: "10px 14px 8px", background: "#FFF9F5", borderBottom: "1px solid rgba(210, 110, 91, 0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span className="flex items-center gap-1" style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12, color: "#C2410C", minWidth: 0 }}>
            🎨 Panduan Visual 6 Tipe RIASEC
            <Info size={11} style={{ color: "#C2410C", opacity: 0.7, flexShrink: 0 }} />
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, background: "#FFEDD5", color: "#C2410C", padding: "2px 7px", borderRadius: 8, fontFamily: PJS, flexShrink: 0 }}>
            Model Minat
          </span>
        </div>
        <div style={{ padding: "10px 12px 4px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {chartData.map((item, i) => {
              const meta = RIASEC_META[item.tipe];
              const col = i % 3;
              const row = Math.floor(i / 3);
              return (
                <button
                  key={item.tipe}
                  type="button"
                  onClick={() => setOpenTipe(item.tipe)}
                  title={`Lihat penjelasan ${item.tipe}`}
                  className="active:scale-95 transition-transform"
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1",
                    padding: 0,
                    cursor: "pointer",
                    borderRadius: 14,
                    border: `1.5px solid ${meta.color}45`,
                    overflow: "hidden",
                    backgroundColor: meta.bg,
                    backgroundImage: `url(${riasecInfographicImg})`,
                    backgroundSize: "300% 200%",
                    backgroundPosition: `${col * 50}% ${row * 100}%`,
                    backgroundRepeat: "no-repeat",
                    boxShadow: "0 2px 6px rgba(91,122,104,0.08)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      right: 5,
                      bottom: 5,
                      background: "#FFFFFF",
                      border: `1px solid ${meta.color}45`,
                      color: meta.color,
                      fontFamily: DMM,
                      fontWeight: 700,
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: 8,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                    }}
                  >
                    {item.skor}%
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 8, marginBottom: 6 }}>
            <Info size={11} style={{ color: MUTED }} />
            <span style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED }}>Ketuk tipe untuk melihat penjelasan</span>
          </div>
        </div>
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
      >
        <div className="flex items-start gap-2.5">
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
              Kesimpulan Minat &amp; Kecenderungan:
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
        <div style={{ marginTop: 10, paddingTop: 9, borderTop: "1px solid rgba(210,110,91,0.16)" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 7 }}>
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 11.5, color: "#C2410C", margin: 0 }}>
              Kecenderungan utama {name}
            </p>
            <button
              type="button"
              onClick={() => setOpenTipe(top1.tipe)}
              title="Lihat penjelasan"
              className="flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
              style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(210,110,91,0.12)", border: "none", cursor: "pointer", color: "#C2410C" }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {top4.map(c => {
              const m = RIASEC_META[c.tipe];
              return (
                <button
                  key={c.tipe}
                  type="button"
                  onClick={() => setOpenTipe(c.tipe)}
                  title={`Lihat penjelasan ${c.tipe}`}
                  className="flex items-center gap-1 flex-shrink-0 active:scale-95 transition-transform"
                  style={{
                    background: m.bg,
                    border: `1px solid ${m.color}35`,
                    borderRadius: 9,
                    padding: "3px 6px 3px 3px",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ width: 14, height: 14, borderRadius: "50%", background: m.color, color: "#fff", fontFamily: PJS, fontWeight: 800, fontSize: 8.5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {m.letter}
                  </span>
                  <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 9, color: m.color, whiteSpace: "nowrap" }}>
                    {c.tipe}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {onLearningRec && (
        <button
          type="button"
          onClick={onLearningRec}
          style={{
            width: "100%",
            marginTop: 16,
            background: `linear-gradient(135deg, ${A} 0%, #c96b55 100%)`,
            border: "none",
            color: "#FFFFFF",
            fontFamily: PJS,
            fontWeight: 800,
            minHeight: 50,
            borderRadius: 16,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(210,125,107,0.35)",
          }}
          className="text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Brain size={16} />
          Rekomendasi Pembelajaran
        </button>
      )}

      {openTipe && (
        <RiasecTipeSheet
          tipe={openTipe}
          skor={skorTipe(jawaban, openTipe) ?? 0}
          dominant={top1.tipe === openTipe}
          nama={name}
          onClose={() => setOpenTipe(null)}
        />
      )}
    </div>
  );
}

/** Bottom sheet penjelasan satu tipe RIASEC (dipanggil dari kartu Panduan Visual). */
function RiasecTipeSheet({ tipe, skor, dominant, nama, onClose }: {
  tipe: RiasecKategori; skor: number; dominant: boolean; nama: string; onClose: () => void;
}) {
  const meta = RIASEC_META[tipe];
  const penj = RIASEC_PENJELASAN[tipe];
  const i = RIASEC_KATEGORI.indexOf(tipe);
  const col = i % 3;
  const row = Math.floor(i / 3);

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.5)" }} />
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          background: CARD,
          borderRadius: "26px 26px 0 0",
          padding: "14px 20px 28px",
          maxHeight: "88%",
          overflowY: "auto",
        }}
      >
        {/* Drag handle + tombol tutup */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
          <button
            type="button"
            onClick={onClose}
            title="Tutup"
            className="active:scale-90 transition-transform"
            style={{
              position: "absolute", right: 0, top: -4,
              width: 30, height: 30, borderRadius: "50%",
              background: "#F1F5F9", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#64748B",
            }}
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        {/* Judul: lingkaran huruf + nama tipe + kode */}
        <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
          <div
            style={{
              width: 46, height: 46, borderRadius: "50%",
              background: meta.color, color: "#fff",
              fontFamily: PJS, fontWeight: 800, fontSize: 21,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {meta.letter}
          </div>
          <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 19, color: meta.color, margin: 0, flex: 1, minWidth: 0 }}>
            {tipe}
          </p>
          <span
            style={{
              fontFamily: DMM, fontWeight: 700, fontSize: 10,
              color: meta.color, background: meta.bg,
              border: `1px solid ${meta.color}35`, borderRadius: 8,
              padding: "3px 8px", flexShrink: 0,
            }}
          >
            {RIASEC_KODE[tipe]}
          </span>
        </div>

        {/* Ilustrasi tipe + badge persentase anak */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1.55",
            borderRadius: 16,
            overflow: "hidden",
            border: `1.5px solid ${meta.color}35`,
            background: meta.bg,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${riasecInfographicImg})`,
              backgroundSize: "300% auto",
              backgroundPosition: `${3.5 + col * 48.45}% ${27 + row * 70}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 10, bottom: 10,
              background: "#FFFFFF",
              border: `1px solid ${meta.color}45`,
              color: meta.color,
              fontFamily: DMM, fontWeight: 700, fontSize: 12,
              padding: "3px 10px", borderRadius: 9,
              boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
            }}
          >
            {skor}%
          </span>
        </div>

        {/* Penjelasan */}
        <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13.5, color: TEXT, margin: "16px 0 6px" }}>
          Apa itu {tipe}?
        </p>
        <p style={{ fontFamily: IPS, fontSize: 12, color: TEXT, lineHeight: 1.55, margin: 0 }}>
          {penj.apa}
        </p>

        {/* Contoh aktivitas */}
        <div className="flex items-center gap-1.5" style={{ marginTop: 14, marginBottom: 4 }}>
          <ListChecks size={14} style={{ color: meta.color }} />
          <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: meta.color, margin: 0 }}>
            Contoh aktivitas
          </p>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {penj.contoh.map(c => (
            <li
              key={c}
              className="flex items-start gap-2"
              style={{ fontFamily: IPS, fontSize: 12, color: TEXT, lineHeight: 1.45, marginTop: 6 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color, flexShrink: 0, marginTop: 6 }} />
              {c}
            </li>
          ))}
        </ul>

        {/* Hasil spesifik untuk anak */}
        <div
          style={{
            marginTop: 16,
            background: meta.bg,
            border: `1.5px solid ${meta.color}30`,
            borderRadius: 14,
            padding: "11px 13px",
          }}
          className="flex items-start gap-2.5"
        >
          <div
            style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "#fff", border: `1px solid ${meta.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginTop: 1,
            }}
          >
            <Lightbulb size={13} style={{ color: meta.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12, color: meta.color, marginBottom: 2 }}>
              Pada {nama}
            </p>
            <p style={{ fontFamily: IPS, fontSize: 11.5, color: TEXT, lineHeight: 1.45, margin: 0 }}>
              Kecenderungan {tipe} {dominant ? `cukup tinggi (${skor}%)` : `sebesar ${skor}%`}.
            </p>
          </div>
        </div>

        {/* Tombol tutup */}
        <button
          type="button"
          onClick={onClose}
          className="active:scale-95 transition-transform"
          style={{
            width: "100%",
            marginTop: 18,
            minHeight: 48,
            borderRadius: 16,
            border: `1.5px solid ${meta.color}40`,
            background: meta.bg,
            color: meta.color,
            fontFamily: PJS,
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

/** Bottom sheet penjelasan kategori fungsional untuk orang tua */
export function ModalPenjelasanFungsional({
  kategori,
  skor,
  namaAnak,
  onClose,
}: {
  kategori: FungsionalKategori;
  skor?: number | null;
  namaAnak?: string;
  onClose: () => void;
}) {
  const info = PENJELASAN_FUNGSIONAL_ORTU[kategori];
  const meta = FUNGSIONAL_META[kategori];
  const nama = namaAnak || "Anak";

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.5)" }} />
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          background: CARD,
          borderRadius: "26px 26px 0 0",
          padding: "14px 20px 28px",
          maxHeight: "88%",
          overflowY: "auto",
        }}
      >
        {/* Drag handle + tombol tutup */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
          <button
            type="button"
            onClick={onClose}
            title="Tutup"
            className="active:scale-90 transition-transform"
            style={{
              position: "absolute", right: 0, top: -4,
              width: 30, height: 30, borderRadius: "50%",
              background: "#F1F5F9", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#64748B",
            }}
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        {/* Header kategori */}
        <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 16,
              background: meta.bg, border: `1.5px solid ${meta.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}
          >
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 17, color: TEXT, margin: 0 }}>
              {kategori}
            </h3>
            <p style={{ fontFamily: IPS, fontSize: 12, color: meta.color, fontWeight: 600, margin: "2px 0 0" }}>
              {info.istilahOrtu}
            </p>
          </div>
          {typeof skor === "number" && (
            <span
              style={{
                fontFamily: DMM, fontWeight: 800, fontSize: 13,
                color: meta.color, background: meta.bg,
                border: `1px solid ${meta.color}35`, borderRadius: 10,
                padding: "4px 10px", flexShrink: 0,
              }}
            >
              {skor}%
            </span>
          )}
        </div>

        <p style={{ fontFamily: IPS, fontSize: 13, color: TEXT, lineHeight: 1.55, margin: "0 0 14px" }}>
          {info.artinyaUntukAnak}
        </p>

        {/* Contoh konkret */}
        <div style={{ background: BG, borderRadius: 16, padding: "12px 14px", border: `1px solid ${BDR}`, display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          <div className="flex items-start gap-2.5">
            <span style={{ fontSize: 16 }}>🏫</span>
            <div className="min-w-0">
              <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: 0 }}>
                Contoh di Sekolah:
              </p>
              <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "2px 0 0", lineHeight: 1.45 }}>
                {info.contohSekolah}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span style={{ fontSize: 16 }}>🏡</span>
            <div className="min-w-0">
              <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: 0 }}>
                Contoh di Rumah:
              </p>
              <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "2px 0 0", lineHeight: 1.45 }}>
                {info.contohRumah}
              </p>
            </div>
          </div>
        </div>

        {/* Tips Pendampingan */}
        <div
          style={{
            background: "#FEFCE8",
            border: "1.5px solid #FEF08A",
            borderRadius: 14,
            padding: "12px 14px",
            marginBottom: 16,
          }}
          className="flex items-start gap-2.5"
        >
          <div
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#FEF08A",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginTop: 1,
            }}
          >
            <Lightbulb size={14} style={{ color: "#854D0E" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12, color: "#854D0E", margin: "0 0 2px" }}>
              Tips Pendampingan untuk Orang Tua di Rumah:
            </p>
            <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#713F12", lineHeight: 1.45, margin: 0 }}>
              {info.tipsPendampingan}
            </p>
          </div>
        </div>

        {/* Tombol tutup */}
        <button
          type="button"
          onClick={onClose}
          className="active:scale-95 transition-transform"
          style={{
            width: "100%",
            minHeight: 48,
            borderRadius: 16,
            border: "none",
            background: DEEP,
            color: "#FFFFFF",
            fontFamily: PJS,
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}

