import React, { useState } from "react";
import {
  Trophy, ChevronRight, FileText, Share2, CheckCircle, Brain, Briefcase, Users, Lightbulb
} from "lucide-react";
import {
  A, CARD, TEXT, MUTED, PJS, IPS, DMM, TBar, BDR, DEEP
} from "../ui-kit";
import { useStudents, type Screen } from "../data";
import { ProfilFungsionalRadar, ProfilKecenderunganBar, getMockJawaban, kodeTigaHuruf, skorKetekunan } from "../shared-charts";
import { exportLaporanPemetaan } from "../export";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function SuggestedCompetitions({ studentId, go }: { studentId: number; go?: (s: Screen) => void }) {
  const comps = studentId === 2 ? [
    { title: "FLS3N Menyanyi Solo", type: "Seni & Suara", level: "Kabupaten", match: 95 },
    { title: "FLS3N Cipta Puisi", type: "Literasi", level: "Provinsi", match: 88 },
    { title: "O2SN Bocce", type: "Olahraga", level: "Nasional", match: 75 },
  ] : [
    { title: "LKSN Diksus Kriya Kayu", type: "Keterampilan", level: "Provinsi", match: 92 },
    { title: "LKSN Diksus Merangkai Bunga", type: "Keterampilan", level: "Kabupaten", match: 85 },
    { title: "O2SN Lari 100m", type: "Olahraga", level: "Nasional", match: 78 },
  ];

  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 24, padding: "20px 14px", boxShadow: "0 2px 12px rgba(91,122,104,0.06)" }}>
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Trophy size={18} style={{ color: "#F59E0B" }} />
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT }}>
            Agenda yang Disarankan
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
        Lihat Semua Agenda <ChevronRight size={14} />
      </button>
    </div>
  );
}

export function SuggestedVocation({ studentId }: { studentId: number }) {
  const vocations = studentId === 2 ? [
    { title: "Batik", desc: "Melatih ketelitian dan kreativitas seni.", match: "Tinggi", tags: ["Kreatif", "Praktis"], img: "https://images.unsplash.com/photo-1762111908782-fabda1a1fe1e?w=160&auto=format&fit=crop&q=80" },
    { title: "Tata Busana", desc: "Keterampilan menjahit dan mendesain.", match: "Cukup", tags: ["Realistis", "Mandiri"], img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=160&auto=format&fit=crop&q=80" },
  ] : [
    { title: "Kriya Kayu", desc: "Melatih kreativitas, ketelitian, dan kemampuan motorik halus.", match: "Tinggi", tags: ["Kreatif", "Praktis"], img: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=160&auto=format&fit=crop&q=80" },
    { title: "Otomotif", desc: "Mengembangkan keterampilan dasar mekanik dan problem solving.", match: "Cukup", tags: ["Realistis", "Mandiri"], img: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=160&auto=format&fit=crop&q=80" },
  ];

  return (
    <div style={{ background: "#F0FDF4", borderRadius: 24, padding: "20px 14px", border: "1px solid #DCFCE7", boxShadow: "0 2px 12px rgba(91,122,104,0.04)" }}>
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(5,150,105,0.2)" }}>
            <Briefcase size={16} style={{ color: "#FFFFFF" }} />
          </div>
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: "#166534" }}>
            Rekomendasi Vokasi
          </h3>
        </div>
        <button className="flex items-center gap-1 active:scale-95 transition-transform" style={{ background: "none", border: "none", color: "#15803D", fontFamily: PJS, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          Lihat semua <ChevronRight size={14} />
        </button>
      </div>
      <div className="space-y-3">
        {vocations.map((v, i) => (
          <div key={i} className="flex p-3 rounded-2xl" style={{ border: `1px solid ${BDR}`, background: "#FFFFFF", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
            <ImageWithFallback src={v.img} alt={v.title} style={{ width: 72, height: 72, borderRadius: 14, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(0,0,0,0.05)" }} />
            <div className="min-w-0 flex-1 ml-3 flex flex-col justify-center">
              <div className="flex items-start justify-between">
                <p className="font-bold text-[14.5px] truncate leading-tight" style={{ color: TEXT }}>{v.title}</p>
                <div className="flex flex-col items-end ml-2 flex-shrink-0">
                  <span className="text-[10px] font-bold" style={{ color: v.match === "Tinggi" ? "#059669" : "#D97706" }}>Kesesuaian</span>
                  <span className="font-black text-[13px] flex items-center gap-0.5" style={{ color: v.match === "Tinggi" ? "#059669" : "#D97706", fontFamily: DMM }}>{v.match} <ChevronRight size={12} strokeWidth={3} /></span>
                </div>
              </div>
              <p className="text-[11px] mt-1" style={{ color: MUTED, lineHeight: 1.3 }}>{v.desc}</p>
              <div className="flex gap-2 mt-2">
                {v.tags.map((t, ti) => (
                  <span key={ti} className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: ti === 0 ? "#F3E8FF" : "#ECFCCB", color: ti === 0 ? "#7E22CE" : "#4D7C0F" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SuggestedExtracurricular({ studentId }: { studentId: number }) {
  const exkul = studentId === 2 ? [
    { title: "Seni Suara", desc: "Meningkatkan ekspresi diri.", match: "Tinggi", tags: ["Aktif", "Ekspresif"], img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&auto=format&fit=crop&q=80" },
    { title: "Sastra", desc: "Melatih imajinasi dan literasi.", match: "Cukup", tags: ["Kreatif", "Fokus"], img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=160&auto=format&fit=crop&q=80" },
  ] : [
    { title: "Olahraga", desc: "Melatih fisik, stamina, dan kerja sama tim.", match: "Tinggi", tags: ["Aktif", "Disiplin"], img: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=160&auto=format&fit=crop&q=80" },
    { title: "Seni (Lukis)", desc: "Meningkatkan kreativitas visual dan ekspresi diri.", match: "Cukup", tags: ["Kreatif", "Ekspresif"], img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=160&auto=format&fit=crop&q=80" },
  ];

  return (
    <div style={{ background: "#EFF6FF", borderRadius: 24, padding: "20px 14px", border: "1px solid #DBEAFE", boxShadow: "0 2px 12px rgba(91,122,104,0.04)" }}>
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(37,99,235,0.2)" }}>
            <Users size={16} style={{ color: "#FFFFFF" }} />
          </div>
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: "#1E3A8A" }}>
            Rekomendasi Ekstrakurikuler
          </h3>
        </div>
        <button className="flex items-center gap-1 active:scale-95 transition-transform" style={{ background: "none", border: "none", color: "#1D4ED8", fontFamily: PJS, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          Lihat semua <ChevronRight size={14} />
        </button>
      </div>
      <div className="space-y-3">
        {exkul.map((v, i) => (
          <div key={i} className="flex p-3 rounded-2xl" style={{ border: `1px solid ${BDR}`, background: "#FFFFFF", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
            <ImageWithFallback src={v.img} alt={v.title} style={{ width: 72, height: 72, borderRadius: 14, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(0,0,0,0.05)" }} />
            <div className="min-w-0 flex-1 ml-3 flex flex-col justify-center">
              <div className="flex items-start justify-between">
                <p className="font-bold text-[14.5px] truncate leading-tight" style={{ color: TEXT }}>{v.title}</p>
                <div className="flex flex-col items-end ml-2 flex-shrink-0">
                  <span className="text-[10px] font-bold" style={{ color: v.match === "Tinggi" ? "#059669" : "#D97706" }}>Kesesuaian</span>
                  <span className="font-black text-[13px] flex items-center gap-0.5" style={{ color: v.match === "Tinggi" ? "#059669" : "#D97706", fontFamily: DMM }}>{v.match} <ChevronRight size={12} strokeWidth={3} /></span>
                </div>
              </div>
              <p className="text-[11px] mt-1" style={{ color: MUTED, lineHeight: 1.3 }}>{v.desc}</p>
              <div className="flex gap-2 mt-2">
                {v.tags.map((t, ti) => (
                  <span key={ti} className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: ti === 0 ? "#E0F2FE" : "#DCFCE7", color: ti === 0 ? "#0369A1" : "#166534" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TalentMapDetailScreen({
  onBack,
  studentId,
  go,
  namaSekolah = "SLB Negeri 1 Surabaya",
}: {
  onBack: () => void;
  studentId: number;
  go: (s: Screen) => void;
  namaSekolah?: string;
}) {
  const students = useStudents();
  const s = students.find(x => x.id === Number(studentId)) || students.find(x => x.hasObs) || students[0];
  const [toast, setToast] = useState("");
  if (!s) return null;

  const beritahu = (t: string) => { setToast(t); setTimeout(() => setToast(""), 2400); };
  const jawaban = getMockJawaban(s ? s.id : studentId);
  const firstName = s.name.split(" ")[0];

  const handleShareLaporan = async () => {
    const riasec = s.hasObs ? kodeTigaHuruf(jawaban) : "—";
    const kemandirian = s.hasObs ? skorKetekunan(jawaban) : "—";
    const textShare = `*Laporan Pemetaan Bakat PDBK (AI Talent Mapping)*\n\n👤 *Nama PDBK:* ${s.name}\n🏫 *Kelas:* ${s.kelas} (${s.abk})\n🏫 *Sekolah:* ${namaSekolah}\n\n✨ *Hasil Analisis AI:*\n• Potensi Dominan (RIASEC): *${riasec}*\n• Skor Kemandirian: *${kemandirian}*\n• Gaya Belajar: *${s.caraBelajar || "Visual & Kinestetik"}*\n• Rekomendasi Ajang Talenta: *${s.comps && s.comps.length ? s.comps.join(", ") : "LKSN Diksus Kriya Kayu"}*\n\nDokumen resmi laporan pemetaan bakat dapat diunduh melalui aplikasi Sareh Asih.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Laporan Pemetaan Bakat - ${s.name}`,
          text: textShare,
        });
        beritahu("Laporan pemetaan berhasil dibagikan.");
      } catch {
        // dibatalkan
      }
    } else {
      const urlWA = `https://api.whatsapp.com/send?text=${encodeURIComponent(textShare)}`;
      window.open(urlWA, "_blank");
      beritahu("Membuka WhatsApp untuk membagikan laporan...");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative" style={{ fontFamily: IPS, backgroundColor: "#F7F5F0" }}>
      <TBar
        title="AI Talent Mapping"
        sub={`${s.name} · ${s.abk}`}
        onBack={onBack}
        right={
          <button
            type="button"
            onClick={handleShareLaporan}
            style={{
              background: "transparent",
              border: "none",
              color: DEEP,
              padding: "6px",
              cursor: "pointer",
            }}
            className="flex items-center justify-center active:scale-90"
            title="Bagikan Hasil Pemetaan"
          >
            <Share2 size={18} />
          </button>
        }
      />
      
      <div className="px-4 pt-4 pb-8 space-y-4">
        {/* Tombol Unduh & Bagikan Laporan Pemetaan Siswa */}
        <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
          <button
            type="button"
            onClick={() => {
              exportLaporanPemetaan([s], namaSekolah);
              beritahu(`Laporan pemetaan ${firstName} berhasil diunduh.`);
            }}
            style={{
              flex: 1.3,
              background: CARD,
              border: `1.5px solid ${DEEP}`,
              color: DEEP,
              fontFamily: PJS,
              fontWeight: 800,
              minHeight: 52,
              borderRadius: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(91,122,104,0.08)",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
            }}
            className="active:scale-95 transition-transform"
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(91,122,104,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: DEEP,
              }}
            >
              <FileText size={16} strokeWidth={2.4} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", minWidth: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.25, color: DEEP }}>
                Unduh Laporan
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.75, lineHeight: 1.15, color: DEEP }} className="truncate max-w-full">
                Pemetaan {firstName}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleShareLaporan}
            style={{
              flex: 0.85,
              background: `linear-gradient(135deg, ${DEEP} 0%, #466253 100%)`,
              border: "none",
              color: "#FFFFFF",
              fontFamily: PJS,
              fontWeight: 800,
              minHeight: 52,
              borderRadius: 16,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(91,122,104,0.22)",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            className="active:scale-95 transition-transform"
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255, 255, 255, 0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#FFFFFF",
              }}
            >
              <Share2 size={15} strokeWidth={2.4} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
              <span style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.25, color: "#FFFFFF" }}>
                Bagikan
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.85, lineHeight: 1.15, color: "#FFFFFF" }}>
                Laporan
              </span>
            </div>
          </button>
        </div>

        <ProfilFungsionalRadar jawaban={jawaban} studentName={firstName} studentId={studentId} />
        <ProfilKecenderunganBar jawaban={jawaban} studentName={firstName} studentId={studentId} onLearningRec={() => go("learning-rec")} />
        <SuggestedVocation studentId={studentId} />
        <SuggestedExtracurricular studentId={studentId} />
        <SuggestedCompetitions studentId={studentId} go={go} />
        
        <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFCCB 100%)", border: "1px solid #DCFCE7", marginTop: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Lightbulb size={18} style={{ color: "#D97706" }} />
          </div>
          <p className="text-xs font-medium leading-relaxed" style={{ color: "#064E3B", fontFamily: IPS }}>
            Rekomendasi ini berdasarkan hasil asesmen minat dan potensi {firstName}. Aktivitas dapat disesuaikan dengan ketersediaan di sekolah dan minat anak.
          </p>
        </div>
      </div>
      {toast && (
        <div style={{ position: "fixed", left: 20, right: 20, bottom: 20, zIndex: 75, background: "#2E3E35", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 10px 28px rgba(0,0,0,0.28)" }}>
          <CheckCircle size={15} style={{ color: "#8BB098", flexShrink: 0 }} />
          <p className="text-xs font-semibold" style={{ color: "#fff", fontFamily: IPS }}>{toast}</p>
        </div>
      )}
    </div>
  );
}
