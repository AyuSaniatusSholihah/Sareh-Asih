import { useState } from "react";
import {
  Plus, Calendar, CheckSquare,
} from "lucide-react";
import {
  A, T, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, SBadge, BG,
} from "../ui-kit";
import {
  useStudents, LOMBA, studentCompDetail, type Student,
} from "../data";

export function CompetitionScreen({
  onStartObs,
  agendas,
  onAddAgenda,
}: {
  onStartObs: (id: number) => void;
  agendas: any[];
  onAddAgenda: (a: any) => void;
}) {
  const students = useStudents();
  const withObs = students.filter(s => s.hasObs);
  const [mainTab, setMainTab] = useState<"agenda" | "lomba">("agenda");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: "sekolah", title: "", date: "", desc: "" });

  const handleSubmit = () => {
    if (!form.title || !form.date) return;
    onAddAgenda({ ...form, id: Date.now() });
    setShowAdd(false);
    setForm({ type: "sekolah", title: "", date: "", desc: "" });
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Main Tabs */}
        <div className="flex rounded-2xl p-1.5" style={{ background: "#E5ECE7" }}>
          {(["agenda", "lomba"] as const).map(m => (
            <button key={m} onClick={() => setMainTab(m)}
              style={{
                background: mainTab === m ? "#FFFFFF" : "transparent",
                color: mainTab === m ? "#1B2E24" : "#4D6B58",
                fontFamily: mainTab === m ? PJS : IPS,
                fontWeight: mainTab === m ? 800 : 700,
                fontSize: 13,
                minHeight: 42,
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                boxShadow: mainTab === m ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
              className="flex-1 capitalize">
              {m === "agenda" ? "Agenda Sekolah" : "Rekomendasi Lomba"}
            </button>
          ))}
        </div>

        {mainTab === "agenda" && (
          <div className="space-y-4">
            <button onClick={() => setShowAdd(true)} className="w-full flex items-center justify-center gap-1.5 text-white rounded-2xl py-3.5 text-sm font-bold active:scale-[0.98] transition-transform" style={{ background: A, fontFamily: PJS, boxShadow: "0 6px 20px rgba(210,125,107,0.42)", border: "none", cursor: "pointer" }}>
              <Plus size={16} strokeWidth={2.5} /> Tambah Agenda
            </button>

            <div className="space-y-3">
              {agendas.length === 0 ? (
                <div style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 20, padding: 24, textAlign: "center" }}>
                  <Calendar size={28} style={{ color: MUTED, margin: "0 auto 8px" }} />
                  <p className="text-sm font-semibold" style={{ color: MUTED }}>Belum ada agenda aktif.</p>
                </div>
              ) : (
                agendas.map(a => (
                  <div key={a.id} style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 20, padding: 16, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" style={{ background: a.type === "sekolah" ? "#E3F2FD" : "#FFF3E0", color: a.type === "sekolah" ? "#1565C0" : "#E65100" }}>{a.type}</span>
                      <span className="text-xs font-semibold text-gray-500">{a.date}</span>
                    </div>
                    <p className="font-bold text-sm leading-snug">{a.title}</p>
                    {a.desc && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{a.desc}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {mainTab === "lomba" && (
          <div className="space-y-4">
            {LOMBA.map(lomba => {
              const matched = studentCompDetail[lomba.k] ?? [];
              const matchedStudents = matched
                .map(m => ({ ...m, student: students.find(s => s.id === m.id) }))
                .filter((m): m is typeof m & { student: Student } => !!m.student);
              return (
                <div key={lomba.k} style={{ background: CARD, border: `1.5px solid ${BDR}`, boxShadow: "0 2px 10px rgba(91,122,104,0.08)" }} className="rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${BDR}`, background: DEEP, color: "#FFFFFF" }}>
                    <span className="text-xl">{lomba.icon}</span>
                    <div>
                      <p className="font-bold text-sm" style={{ fontFamily: PJS, color: "#FFFFFF" }}>{lomba.k}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>{lomba.full}</p>
                    </div>
                    <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: A, color: "#fff", fontFamily: PJS }}>{matchedStudents.length} siswa</span>
                  </div>
                  {matchedStudents.length === 0
                    ? <p className="px-4 py-3 text-xs" style={{ color: MUTED }}>Belum ada siswa yang cocok dengan lomba ini.</p>
                    : matchedStudents.map((m, i) => (
                      <div key={m.id} className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: i < matchedStudents.length - 1 ? `1px solid ${BDR}` : "none" }}>
                        <span className="text-lg flex-shrink-0">{m.student.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: TEXT }}>{m.student.name}</p>
                          <p className="text-xs" style={{ color: MUTED }}>Cabang: {m.cabang}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 flex-1 rounded-full" style={{ background: "#EDE9E3" }}><div className="h-full rounded-full" style={{ width: `${m.match}%`, background: DEEP }} /></div>
                            <span className="text-xs font-bold flex-shrink-0" style={{ color: DEEP, fontFamily: DMM }}>{m.match}%</span>
                          </div>
                          <p className="text-xs leading-relaxed mt-1.5" style={{ color: MUTED }}>💡 {m.alasan}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <SBadge s={m.status} />
                          {m.status !== "Didaftarkan" &&
                            <button style={{ background: A, color: "#fff", fontFamily: IPS, minHeight: 32 }} className="px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                              <CheckSquare size={11} />Daftarkan
                            </button>
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg">Tambah Agenda</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Jenis</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none">
                  <option value="sekolah">Agenda Sekolah</option>
                  <option value="lomba">Lomba</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Judul Agenda/Lomba</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Contoh: Lomba FLS2N" className="w-full border rounded-xl px-3 py-2 text-sm outline-none" />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Tanggal</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm outline-none" />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Deskripsi (Opsional)</label>
                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={2} placeholder="Keterangan singkat..." className="w-full border rounded-xl px-3 py-2 text-sm outline-none" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm font-semibold border bg-gray-50">Batal</button>
              <button onClick={handleSubmit} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: T }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
