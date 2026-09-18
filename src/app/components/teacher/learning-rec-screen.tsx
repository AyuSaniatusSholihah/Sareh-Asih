import { CheckSquare, CheckCircle, Target, XCircle } from "lucide-react";
import {
  A, CARD, TEXT, DEEP, BDR, PJS, IPS, TBar,
} from "../ui-kit";
import { useStudents, GAYA_META } from "../data";

export function LearningRecScreen({
  onBack,
  studentId,
}: {
  onBack: () => void;
  studentId: number;
}) {
  const students = useStudents();
  const s = students.find(x => x.id === studentId);
  const nama = s?.name.split(" ")[0] ?? "Siswa";
  const gaya = s?.caraBelajar || "Visual";
  const meta = GAYA_META[gaya] ?? GAYA_META["Visual"];

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS }}>
      <TBar title="Rekomendasi Pembelajaran" sub={`${nama} · Gaya ${gaya}`} onBack={onBack} />
      <div className="px-4 pt-4 pb-6 space-y-3">
        <div style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 20, padding: 16 }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={16} style={{ color: DEEP }} />
            <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>Strategi yang Disarankan</p>
          </div>
          {meta.strategi.map(t => (
            <div key={t} style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.32)`, borderRadius: 14, boxShadow: "0 2px 6px rgba(91,122,104,0.06)" }} className="p-3 mb-2 last:mb-0">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} style={{ color: DEEP, flexShrink: 0, marginTop: 2 }} />
                <p className="text-sm font-semibold" style={{ color: TEXT }}>{t}</p>
              </div>
            </div>
          ))}
          <div style={{ background: DEEP, borderRadius: 14, color: "#FFFFFF", boxShadow: "0 3px 10px rgba(91,122,104,0.22)" }} className="px-3.5 py-3 mt-2 flex items-start gap-2">
            <Target size={15} style={{ color: "#D4E8DA", flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-relaxed" style={{ color: "#FFFFFF" }}>
              Strategi ini dipilih AI karena gaya belajar dominan {nama} adalah <strong style={{ color: "#D4E8DA" }}>{gaya}</strong>.
            </p>
          </div>
        </div>

        <div style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 20, padding: 16 }}>
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={16} style={{ color: A }} />
            <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>Strategi yang Dihindari</p>
          </div>
          {meta.hindari.map(t => (
            <div key={t} style={{ background: "rgba(210,125,107,0.10)", border: `1.5px solid rgba(210,125,107,0.35)`, borderRadius: 14 }} className="p-3 mb-2 last:mb-0">
              <div className="flex items-start gap-2">
                <XCircle size={16} style={{ color: A, flexShrink: 0, marginTop: 2 }} />
                <p className="text-sm font-semibold" style={{ color: TEXT }}>{t}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
