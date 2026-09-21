import React, { useState } from "react";
import {
  Trophy, ChevronRight, FileText, Share2, CheckCircle, Brain
} from "lucide-react";
import {
  A, CARD, TEXT, MUTED, PJS, IPS, DMM, TBar, BDR, DEEP
} from "../ui-kit";
import { useStudents, type Screen } from "../data";
import { ProfilFungsionalRadar, ProfilKecenderunganBar, getMockJawaban, kodeTigaHuruf, skorKetekunan } from "../shared-charts";
import { exportLaporanPemetaan } from "../export";

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
  const jawaban = getMockJawaban(studentId);
  const firstName = s.name.split(" ")[0];

  const handleShareLaporan = async () => {
    const riasec = s.hasObs ? kodeTigaHuruf(jawaban) : "—";
    const kemandirian = s.hasObs ? skorKetekunan(jawaban) : "—";
    const textShare = `*Laporan Pemetaan Bakat Siswa (AI Talent Mapping)*\n\n👤 *Nama Siswa:* ${s.name}\n🏫 *Kelas:* ${s.kelas} (${s.abk})\n🏫 *Sekolah:* ${namaSekolah}\n\n✨ *Hasil Analisis AI:*\n• Potensi Dominan (RIASEC): *${riasec}*\n• Skor Kemandirian: *${kemandirian}*\n• Gaya Belajar: *${s.caraBelajar || "Visual & Kinestetik"}*\n• Rekomendasi Lomba: *${s.comps && s.comps.length ? s.comps.join(", ") : "LKSN Kriya Kayu"}*\n\nDokumen resmi laporan pemetaan bakat dapat diunduh melalui aplikasi Sareh Asih.`;

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
        <div className="flex gap-2">
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
              minHeight: 48,
              borderRadius: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(91,122,104,0.08)",
            }}
            className="text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <FileText size={15} />
            <span>Unduh Laporan Pemetaan {firstName}</span>
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
              minHeight: 48,
              borderRadius: 16,
              cursor: "pointer",
              boxShadow: "0 3px 10px rgba(91,122,104,0.22)",
            }}
            className="text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <Share2 size={14} />
            <span>Bagikan</span>
          </button>
        </div>

        <ProfilFungsionalRadar jawaban={jawaban} studentName={firstName} studentId={studentId} />
        <ProfilKecenderunganBar jawaban={jawaban} studentName={firstName} studentId={studentId} />
        <SuggestedCompetitions studentId={studentId} go={go} />

        {/* Rekomendasi Pembelajaran */}
        <button
          type="button"
          onClick={() => go("learning-rec")}
          style={{
            width: "100%",
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
      </div>

      {toast && (
        <div style={{ position: "fixed", left: 20, right: 20, bottom: 20, zIndex: 75, background: "#2E3E35", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 9, boxShaodw: "0 10px 28px rgba(0,0,0,0.28)" }}>
          <CheckCircle size={15} style={{ color: "#8BB098", flexShrink: 0 }} />
          <p className="text-xs font-semibold" style={{ color: "#fff", fontFamily: IPS }}>{toast}</p>
        </div>
      )}
    </div>
  );
}
