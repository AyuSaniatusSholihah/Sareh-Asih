import { useState } from "react";
import {
  Sparkles, CheckCircle, ChevronRight, Info, ClipboardList, Gauge, X, ArrowLeft,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, PBtn, TBar,
} from "./ui-kit";
import {
  FUNGSIONAL_KATEGORI, FUNGSIONAL_META, SKALA_FUNGSIONAL, PROFIL_FUNGSIONAL,
  RIASEC_KATEGORI, RIASEC_META, SKALA_RIASEC, PROFIL_KECENDERUNGAN,
  useStudents, type FungsionalKategori, type RiasecKategori,
} from "./data";
import { VoiceTextarea } from "./voice-input";

type Tahap = "fungsional" | "kecenderungan" | "catatan";

export function ObservationScreen({
  onBack,
  onDone,
  onSave,
  studentId,
}: {
  onBack: () => void;
  onDone: (id: number) => void;
  onSave?: (id: number) => void;
  studentId: number;
}) {
  const students = useStudents();
  const student = students.find(s => s.id === studentId) ?? students[0];

  const [tahap, setTahap] = useState<Tahap>("fungsional");
  const [skorFungsional, setSkorFungsional] = useState<Record<number, number>>({});
  const [skorRiasec, setSkorRiasec] = useState<Record<number, number>>({});
  const [catatan, setCatatan] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!student) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS }}>
        <TBar title="Asesmen & Asesmen" sub="Pilih Siswa" onBack={onBack} />
        <div className="p-8 text-center">
          <p className="text-sm font-semibold mb-4" style={{ color: MUTED }}>Belum ada siswa yang dipilih atau tersedia untuk diamati.</p>
          <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-xs font-bold" style={{ background: A, color: "#fff", fontFamily: PJS }}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const totalFungsional = PROFIL_FUNGSIONAL.length;
  const terisiFungsional = Object.keys(skorFungsional).length;
  const fungsionalPct = Math.round((terisiFungsional / totalFungsional) * 100);

  const totalRiasec = PROFIL_KECENDERUNGAN.length;
  const terisiRiasec = Object.keys(skorRiasec).length;
  const riasecPct = Math.round((terisiRiasec / totalRiasec) * 100);

  const rataFungsional = (k: FungsionalKategori) => {
    const list = PROFIL_FUNGSIONAL.filter(a => a.kategori === k).filter(a => skorFungsional[a.id] !== undefined);
    if (!list.length) return null;
    return Math.round(list.reduce((s, a) => s + skorFungsional[a.id], 0) / list.length * 100 / 3);
  };

  const rataRiasec = (k: RiasecKategori) => {
    const list = PROFIL_KECENDERUNGAN.filter(a => a.kategori === k).filter(a => skorRiasec[a.id] !== undefined);
    if (!list.length) return null;
    return Math.round(list.reduce((s, a) => s + skorRiasec[a.id], 0) / list.length * 100 / 3);
  };

  const bisaSimpan = terisiFungsional > 0 || terisiRiasec > 0;

  const handleSimpan = () => {
    if (!bisaSimpan) return;
    setIsSaved(true);
    if (onSave) {
      onSave(student.id);
    }
    setShowResultModal(true);
  };

  const handleLihatHasil = () => {
    setShowResultModal(false);
    onDone(student.id);
  };

  const handleKembali = () => {
    setShowResultModal(false);
    setTahap("catatan");
  };

  const TAHAP_TABS: { k: Tahap; l: string; n: string }[] = [
    { k: "fungsional", l: "Fungsional", n: `${terisiFungsional}/${totalFungsional}` },
    { k: "kecenderungan", l: "Aktivitas", n: `${terisiRiasec}/${totalRiasec}` },
    { k: "catatan", l: "Catatan", n: catatan.trim() ? "✓" : "—" },
  ];
  const curIdx = TAHAP_TABS.findIndex(t => t.k === tahap);

  return (
    <div
      className="flex-1 relative flex flex-col"
      style={{
        fontFamily: IPS,
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Scrollable page body (terkunci saat modal aktif) */}
      <div
        className="flex-1"
        style={{
          overflowY: showResultModal ? "hidden" : "auto",
          overscrollBehavior: "contain",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <TBar title="Asesmen & Asesmen" sub={student.name} onBack={onBack} />

        {/* Identitas + stepper + progress (terkunci saat scroll) */}
        <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#F7F5F0", boxShadow: "0 4px 12px rgba(91,122,104,0.08)" }}>
          <div style={{ background: CARD }} className="px-4 pt-2 pb-3">
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: 28 }}>{student.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>{student.name}</p>
                <div className="flex gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#F3EFFF", color: "#6D28D9" }}>{student.abk}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: SEC, color: T }}>Kelas {student.kelas}</span>
                </div>
              </div>
            </div>

            <div className="flex" style={{ marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16 }}>
              {TAHAP_TABS.map((t, i) => {
                const active = tahap === t.k;
                const stageNum = i + 1;
                return (
                  <button key={t.k} onClick={() => setTahap(t.k)}
                    style={{
                      flex: 1, minHeight: 44, position: "relative",
                      color: active ? DEEP : MUTED,
                      fontFamily: PJS,
                      fontWeight: active ? 800 : 600
                    }}
                    className="text-xs flex flex-col items-center justify-center gap-1">
                    <div aria-hidden style={{ position: "absolute", top: 12, left: 0, height: 2, width: "calc(50% - 11px)", zIndex: 0, background: curIdx >= i ? DEEP : "#E5E1DB", transition: "background 0.3s" }} />
                    <div aria-hidden style={{ position: "absolute", top: 12, right: 0, height: 2, width: "calc(50% - 11px)", zIndex: 0, background: curIdx >= i + 1 ? DEEP : "#E5E1DB", transition: "background 0.3s" }} />
                    <span style={{
                      width: 22, height: 22, borderRadius: 11, position: "relative", zIndex: 1,
                      background: active ? DEEP : "#E5E1DB",
                      color: active ? "#FFFFFF" : MUTED,
                      fontFamily: DMM, fontWeight: 800, fontSize: 11,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0
                    }}>{stageNum}</span>
                    <span style={{ fontSize: 11, lineHeight: 1.1, color: active ? DEEP : MUTED }}>{t.l}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── PROGRESS ── */}
          <div style={{ background: "#F7F5F0", borderBottom: `1px solid ${BDR}` }} className="px-4 py-2.5">
            {tahap === "fungsional" && (
              <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: "10px 14px", boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: TEXT, fontWeight: 600 }}>Profil Fungsional Terisi</span>
                  <span className="font-bold" style={{ color: "#059669", fontFamily: DMM, fontSize: 13 }}>{terisiFungsional}/{totalFungsional} · {fungsionalPct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#EDE9E3" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${fungsionalPct}%`, background: fungsionalPct > 0 ? `linear-gradient(90deg, #10B981 0%, #059669 100%)` : "transparent" }} />
                </div>
              </div>
            )}
            {tahap === "kecenderungan" && (
              <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: "10px 14px", boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: TEXT, fontWeight: 600 }}>Profil Aktivitas Terisi</span>
                  <span className="font-bold" style={{ color: A, fontFamily: DMM, fontSize: 13 }}>{terisiRiasec}/{totalRiasec} · {riasecPct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#EDE9E3" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${riasecPct}%`, background: riasecPct > 0 ? A : "transparent" }} />
                </div>
              </div>
            )}
            {tahap === "catatan" && (
              <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, padding: "10px 14px", boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: TEXT, fontWeight: 600 }}>Ringkasan sesi</span>
                  <span className="font-bold" style={{ color: DEEP, fontFamily: DMM, fontSize: 13 }}>
                    {terisiFungsional + terisiRiasec + (catatan.trim() ? 1 : 0)} item terisi
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#EDE9E3" }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${Math.round((terisiFungsional + terisiRiasec + (catatan.trim() ? 1 : 0)) / (totalFungsional + totalRiasec + 1) * 100)}%`,
                    background: `linear-gradient(90deg, #10B981 0%, ${DEEP} 100%)`
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── TAHAP 1: PROFIL FUNGSIONAL ── */}
        {tahap === "fungsional" && (
          <div className="px-4 pt-4 pb-6 space-y-3">
            {/* Legenda skala */}
            <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl px-4 py-3 mb-2">
              <p className="text-xs font-bold mb-2" style={{ color: TEXT, fontFamily: PJS }}>Arti tingkat kemampuan</p>
              <div className="space-y-1.5">
                {SKALA_FUNGSIONAL.map(s => (
                  <div key={s.v} className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`, minWidth: 66, textAlign: "center" }}>{s.l}</span>
                    <span className="text-xs" style={{ color: MUTED }}>{s.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {FUNGSIONAL_KATEGORI.map(kat => {
              const meta = FUNGSIONAL_META[kat];
              const list = PROFIL_FUNGSIONAL.filter(a => a.kategori === kat);
              const rata = rataFungsional(kat);
              const isi = list.filter(a => skorFungsional[a.id] !== undefined).length;
              return (
                <div key={kat} style={{ background: CARD, border: `1.5px solid ${meta.color}35`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }} className="rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div style={{ width: 42, height: 42, background: meta.bg, borderRadius: 12, border: `1px solid ${meta.color}40`, flexShrink: 0, fontSize: 20 }} className="flex items-center justify-center">{meta.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>{kat}</p>
                      <p className="text-xs" style={{ color: MUTED }}>{meta.desc}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: isi > 0 ? meta.bg : BG, color: isi > 0 ? meta.color : MUTED, border: `1px solid ${isi > 0 ? meta.color + "50" : BDR}`, fontFamily: DMM }}>{isi}/{list.length}</span>
                  </div>

                  <div className="space-y-3 mt-3" style={{ borderTop: `1px solid ${BDR}`, paddingTop: 12 }}>
                    {list.map(a => (
                      <div key={a.id}>
                        <p className="text-sm leading-snug mb-2 font-medium" style={{ color: TEXT }}>{a.text}</p>
                        <div className="flex gap-1.5">
                          {SKALA_FUNGSIONAL.filter(s => s.v !== -1).map(s => {
                            const on = skorFungsional[a.id] === s.v;
                            return (
                              <button key={s.v} onClick={() => setSkorFungsional(p => ({ ...p, [a.id]: s.v }))}
                                style={{
                                  flex: 1,
                                  minHeight: 42,
                                  background: on ? s.color : CARD,
                                  border: on ? `2px solid ${s.color}` : `1.5px solid ${BDR}`,
                                  color: on ? "#FFFFFF" : TEXT,
                                  fontFamily: PJS,
                                  fontWeight: on ? 800 : 600,
                                  boxShadow: on ? `0 3px 10px ${s.color}40` : "none"
                                }}
                                className="rounded-xl text-xs transition-all active:scale-95">
                                {s.l}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-2 flex">
                          <button onClick={() => setSkorFungsional(p => ({ ...p, [a.id]: -1 }))}
                            className="text-[11px] px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
                            style={{
                              background: skorFungsional[a.id] === -1 ? "#F1F5F9" : "transparent",
                              color: skorFungsional[a.id] === -1 ? "#475569" : MUTED,
                              border: skorFungsional[a.id] === -1 ? "1px solid #CBD5E1" : `1px dashed #CBD5E1`,
                              fontWeight: skorFungsional[a.id] === -1 ? 700 : 500,
                              fontFamily: PJS
                            }}>
                            Tidak dapat dijawab
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={onBack}
                style={{
                  flex: 1,
                  border: `1.5px solid ${BDR}`,
                  color: DEEP,
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 13.5,
                  minHeight: 46,
                  background: CARD,
                  borderRadius: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                className="active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={15} />
                <span>Kembali</span>
              </button>
              <div style={{ flex: 2 }}>
                <PBtn
                  full
                  label="Lanjut ke Aktivitas"
                  icon={<Gauge size={17} />}
                  onClick={() => setTahap("kecenderungan")}
                  size="md"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAHAP 2: KECENDERUNGAN AKTIVITAS ── */}
        {tahap === "kecenderungan" && (
          <div className="px-4 pt-4 pb-6 space-y-3">
            {/* Legenda skala */}
            <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl px-4 py-3 mb-2">
              <p className="text-xs font-bold mb-2" style={{ color: TEXT, fontFamily: PJS }}>Frekuensi ketertarikan</p>
              <div className="space-y-1.5">
                {SKALA_RIASEC.map(s => (
                  <div key={s.v} className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`, minWidth: 80, textAlign: "center" }}>{s.l}</span>
                    <span className="text-xs" style={{ color: MUTED }}>{s.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {RIASEC_KATEGORI.map(kat => {
              const meta = RIASEC_META[kat];
              const list = PROFIL_KECENDERUNGAN.filter(a => a.kategori === kat);
              const rata = rataRiasec(kat);
              const isi = list.filter(a => skorRiasec[a.id] !== undefined).length;
              return (
                <div key={kat} style={{ background: CARD, border: `1.5px solid ${meta.color}35`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }} className="rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div style={{ width: 42, height: 42, background: meta.bg, borderRadius: 12, border: `1px solid ${meta.color}40`, flexShrink: 0, fontSize: 20 }} className="flex items-center justify-center">{meta.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>{kat}</p>
                      <p className="text-xs" style={{ color: MUTED }}>{meta.desc}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: isi > 0 ? meta.bg : BG, color: isi > 0 ? meta.color : MUTED, border: `1px solid ${isi > 0 ? meta.color + "50" : BDR}`, fontFamily: DMM }}>{isi}/{list.length}</span>
                  </div>

                  <div className="space-y-3 mt-3" style={{ borderTop: `1px solid ${BDR}`, paddingTop: 12 }}>
                    {list.map(a => (
                      <div key={a.id}>
                        <p className="text-sm leading-snug mb-2 font-medium" style={{ color: TEXT }}>{a.text}</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {SKALA_RIASEC.filter(s => s.v !== -1).map(s => {
                            const on = skorRiasec[a.id] === s.v;
                            return (
                              <button key={s.v} onClick={() => setSkorRiasec(p => ({ ...p, [a.id]: s.v }))}
                                style={{
                                  flex: 1,
                                  minWidth: "40%",
                                  minHeight: 42,
                                  background: on ? s.color : CARD,
                                  border: on ? `2px solid ${s.color}` : `1.5px solid ${BDR}`,
                                  color: on ? "#FFFFFF" : TEXT,
                                  fontFamily: PJS,
                                  fontWeight: on ? 800 : 600,
                                  boxShadow: on ? `0 3px 10px ${s.color}40` : "none"
                                }}
                                className="rounded-xl text-xs transition-all active:scale-95">
                                {s.l}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-2 flex">
                          <button onClick={() => setSkorRiasec(p => ({ ...p, [a.id]: -1 }))}
                            className="text-[11px] px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
                            style={{
                              background: skorRiasec[a.id] === -1 ? "#F1F5F9" : "transparent",
                              color: skorRiasec[a.id] === -1 ? "#475569" : MUTED,
                              border: skorRiasec[a.id] === -1 ? "1px solid #CBD5E1" : `1px dashed #CBD5E1`,
                              fontWeight: skorRiasec[a.id] === -1 ? 700 : 500,
                              fontFamily: PJS
                            }}>
                            Tidak dapat dijawab
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setTahap("fungsional")}
                style={{
                  flex: 1,
                  border: `1.5px solid ${BDR}`,
                  color: DEEP,
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 13.5,
                  minHeight: 46,
                  background: CARD,
                  borderRadius: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                className="active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={15} />
                <span>Kembali</span>
              </button>
              <div style={{ flex: 2 }}>
                <PBtn
                  full
                  label="Lanjut ke Catatan"
                  icon={<ClipboardList size={17} />}
                  onClick={() => setTahap("catatan")}
                  size="md"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAHAP 3: CATATAN SUARA ── */}
        {tahap === "catatan" && (
          <div className="px-4 pt-4 pb-6 space-y-3">
            <div style={{ background: DEEP, borderRadius: 18, padding: "14px", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(91,122,104,0.25)" }} className="flex items-start gap-2.5">
              <Info size={16} style={{ color: "#D4E8DA", flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs leading-relaxed" style={{ color: "#FFFFFF" }}>
                Catatan ini menjadi bahan tambahan pemetaan potensi jika ditemukan indikator yang tidak tercantum di checklist sebelumnya. Tekan tombol mikrofon lalu ceritakan langsung atau ketik manual.
              </p>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl p-4">
              <VoiceTextarea
                label="Catatan Tambahan Siswa"
                value={catatan} onChange={setCatatan} rows={6}
                placeholder={`Ceritakan apa yang Anda amati pada ${student.name.split(" ")[0]}`}
              />
            </div>

            <div style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.35)`, borderRadius: 18, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }} className="px-4 py-3">
              <p className="text-xs font-bold mb-2" style={{ color: DEEP, fontFamily: PJS }}>Ringkasan sesi ini</p>
              {[
                { l: "Profil Fungsional", v: `${terisiFungsional} dari ${totalFungsional}` },
                { l: "Kecenderungan (RIASEC)", v: `${terisiRiasec} dari ${totalRiasec}` },
                { l: "Catatan suara", v: catatan.trim() ? `${catatan.trim().split(/\s+/).length} kata` : "kosong" },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between py-1">
                  <span className="text-xs" style={{ color: MUTED }}>{r.l}</span>
                  <span className="text-xs font-bold" style={{ color: TEXT, fontFamily: DMM }}>{r.v}</span>
                </div>
              ))}
            </div>

            {isSaved && (
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: 14,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={15} style={{ color: "#059669" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", fontFamily: PJS }}>
                    Asesmen berhasil disimpan
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResultModal(true)}
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#059669",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontFamily: PJS,
                  }}
                >
                  Lihat Opsi
                </button>
              </div>
            )}

            <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl px-4 py-3 text-center">
              <p className="text-xs mb-2.5" style={{ color: MUTED }}>
                {!bisaSimpan ? "Isi minimal satu indikator atau butir asesmen sebelum menyimpan."
                  : "Data siap diproses AI untuk pemetaan bakat dan rekomendasi belajar."}
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setTahap("asesmen")}
                  style={{
                    flex: 1,
                    border: `1.5px solid ${BDR}`,
                    color: DEEP,
                    fontFamily: PJS,
                    fontWeight: 700,
                    fontSize: 13.5,
                    minHeight: 46,
                    background: CARD,
                    borderRadius: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  className="active:scale-[0.98] transition-all"
                >
                  <ArrowLeft size={15} />
                  <span>Kembali</span>
                </button>
                <div style={{ flex: 2 }}>
                  <PBtn
                    full
                    label={isSaved ? "Tersimpan ✓ — Simpan Ulang" : "Simpan & Proses AI"}
                    icon={<Sparkles size={15} />}
                    onClick={handleSimpan}
                    disabled={!bisaSimpan}
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── POP UP MODAL SETELAH SIMPAN (Lihat Hasil Asesmen / Kembali ke Catatan) — Terkunci Penuh di Frame HP ── */}
      {showResultModal && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            touchAction: "none",
            overscrollBehavior: "contain",
          }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#FFFFFF",
              borderRadius: 24,
              padding: "24px 20px 20px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.20)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Close 'X' button in top-right */}
            <button
              type="button"
              onClick={handleKembali}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#F1F5F9",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
              }}
              className="hover:bg-slate-200 active:scale-95 transition-all"
              title="Tutup"
            >
              <X size={16} />
            </button>

            {/* Success Icon */}
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 20,
                background: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                boxShadow: "0 4px 14px rgba(5, 150, 105, 0.18)",
              }}
            >
              <CheckCircle size={32} style={{ color: "#059669" }} />
            </div>

            {/* Title & Description */}
            <h3
              style={{
                fontFamily: PJS,
                fontSize: 18,
                fontWeight: 800,
                color: "#1B2E24",
                margin: "0 0 8px",
                lineHeight: 1.3,
              }}
            >
              Asesmen Tersimpan!
            </h3>
            <p
              style={{
                fontFamily: IPS,
                fontSize: 13,
                color: "#5A6E63",
                margin: "0 0 20px",
                lineHeight: 1.5,
              }}
            >
              Data asesmen untuk <strong>{student.name}</strong> telah berhasil disimpan. Silakan pilih langkah selanjutnya:
            </p>

            {/* Actions */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Button 1: Lihat Hasil Asesmen */}
              <button
                type="button"
                onClick={handleLihatHasil}
                style={{
                  width: "100%",
                  minHeight: 46,
                  background: "#2D543E",
                  color: "#FFFFFF",
                  fontFamily: PJS,
                  fontWeight: 800,
                  fontSize: 14,
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(45, 84, 62, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                className="hover:brightness-105 active:scale-95 transition-all"
              >
                <Sparkles size={16} />
                <span>Lihat Hasil Asesmen</span>
              </button>

              {/* Button 2: Kembali (Redirects to Catatan) */}
              <button
                type="button"
                onClick={handleKembali}
                style={{
                  width: "100%",
                  minHeight: 44,
                  background: "#F8FAFC",
                  color: "#475569",
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 13.5,
                  borderRadius: 14,
                  border: "1.5px solid #E2E8F0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                className="hover:bg-slate-100 active:scale-95 transition-all"
              >
                <ArrowLeft size={15} />
                <span>Kembali</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
