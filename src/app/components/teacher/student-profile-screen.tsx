import React, { useState, useRef, useEffect } from "react";
import {
  Key, Copy, RefreshCw, CheckCircle, Mic, MicOff, Send,
  ClipboardList, Edit3, FileText, Sparkles, Brain, CalendarClock, RotateCcw,
  CloudUpload, FileSpreadsheet, ChevronRight, ArrowLeft, User, Users, Heart,
  Sprout, Info, Play, Clock, AlertCircle, Calendar, ChevronDown, Check, Save,
} from "lucide-react";
import {
  T, A, CARD, TEXT, MUTED, SEC, BDR, DEEP, BG, PJS, IPS, DMM, TBar, Chip, SBadge,
} from "../ui-kit";
import {
  useStudents, useUpdateStudent, fotoSiswa, type Student, type LaporanKirim, type Screen,
  ABK_OPTIONS, CARA_BELAJAR_OPTIONS, loadAiKnowledge, simpanMemoriSiswaAI, muatMemoriSiswaAI,
} from "../data";
import { exportLaporanPemetaan } from "../export";
import { getMockJawaban, kodeTigaHuruf } from "../shared-charts";

export type AsesmenStatus = "not_started" | "in_progress" | "completed";

export function getStudentAsesmenStatus(s: Student): AsesmenStatus {
  try {
    const draft = localStorage.getItem(`assessment_draft_${s.id}`) || localStorage.getItem(`draft_obs_${s.id}`) || localStorage.getItem(`obs_${s.id}`);
    if (draft && !s.hasObs) return "in_progress";
  } catch (e) {}
  if (s.obsStatus) return s.obsStatus;
  if ((s as any).obsInProgress) return "in_progress";
  if (s.hasObs) return "completed";
  return "not_started";
}

/** Kartu kode orang tua — guru yang membuat & membagikannya (peran admin ada di guru). */
export function KodeOrtuCard({ s, onRegen }: { s: Student; onRegen: (id: number) => void }) {
  const [copied, setCopied] = useState(false);
  const salin = () => {
    if (s.kodeOrtu) navigator.clipboard?.writeText(s.kodeOrtu).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ background: CARD, border: "1px solid rgba(91, 122, 104, 0.12)", borderRadius: 20, boxShadow: "0 3px 10px -2px rgba(91, 122, 104, 0.06)" }} className="p-4">
      <div className="flex items-center gap-2 mb-1">
        <Key size={15} style={{ color: T }} />
        <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>Kode Akses Orang Tua</p>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>
        Bagikan kode ini kepada orang tua {s.name.split(" ")[0]} agar mereka bisa memantau perkembangan bakat dan asesmen anak.
      </p>
      <div style={{ background: SEC, border: `1px dashed ${T}` }} className="rounded-xl px-3 py-3 text-center mb-3">
        <p className="font-bold" style={{ fontFamily: DMM, fontSize: 17, color: DEEP, letterSpacing: "0.1em" }}>{s.kodeOrtu ?? "—"}</p>
      </div>
      <div className="flex gap-2.5">
        <button onClick={salin} style={{
          flex: 1,
          background: copied ? SEC : A,
          color: copied ? DEEP : "#fff",
          fontFamily: PJS,
          fontWeight: 700,
          fontSize: 13,
          minHeight: 46,
          borderRadius: 14,
          border: "none",
          boxShadow: copied ? "none" : "0 4px 14px rgba(210,125,107,0.38)",
          cursor: "pointer"
        }}
          className="flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
          {copied ? <><CheckCircle size={14} />Tersalin</> : <><Copy size={14} />Salin Kode</>}
        </button>
        <button onClick={() => onRegen(s.id)} style={{
          flex: 1,
          background: CARD,
          border: `2px solid ${DEEP}`,
          color: DEEP,
          fontFamily: PJS,
          fontWeight: 700,
          fontSize: 13,
          minHeight: 46,
          borderRadius: 14,
          cursor: "pointer"
        }}
          className="flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
          <RefreshCw size={14} />Buat Ulang
        </button>
      </div>
      <p className="text-xs mt-2 leading-relaxed" style={{ color: MUTED }}>
        Membuat ulang kode akan memutus akses orang tua yang memakai kode lama.
      </p>
    </div>
  );
}

export function JurnalTab({
  s,
  laporan,
  onKirim,
}: {
  s: Student;
  laporan: LaporanKirim[];
  onKirim: (studentId: number, isi: string) => void;
}) {
  const generated = `${s.name} menunjukkan perkembangan positif pada ${s.hasObs ? kodeTigaHuruf(getMockJawaban(s.id)).toLowerCase() : "kegiatan belajarnya"} di Semester Genap 2026. Fokus dan kemandirian meningkat dibanding semester lalu.`;
  const [draft, setDraft] = useState(generated);
  const [expanded, setExpanded] = useState(false);
  const [listening, setListening] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filterCatatan, setFilterCatatan] = useState<"semua" | "hari" | "minggu" | "bulan">("semua");
  const allRiwayat = laporan.filter(l => l.studentId === s.id).slice().reverse();

  const filterRiwayat = (items: typeof allRiwayat) => {
    if (filterCatatan === "semua") return items;
    const now = new Date();
    return items.filter(r => {
      const raw = r.dikirimPada.replace(/(\d+)\s+(\w+)\s+(\d+)/, (_, d, m, y) => {
        const bln: Record<string, string> = { Jan:"01",Feb:"02",Mar:"03",Apr:"04",Mei:"05",Jun:"06",Jul:"07",Agu:"08",Sep:"09",Okt:"10",Nov:"11",Des:"12" };
        return `${y}-${bln[m] || "01"}-${d.padStart(2,"0")}`;
      });
      const d = new Date(raw);
      if (isNaN(d.getTime())) return true;
      if (filterCatatan === "hari") {
        return d.toDateString() === now.toDateString();
      }
      if (filterCatatan === "minggu") {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (filterCatatan === "bulan") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const riwayat = filterRiwayat(allRiwayat);

  const recRef = useRef<any>(null);
  const baseRef = useRef("");

  const startMic = () => {
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "id-ID";
    rec.continuous = true;
    rec.interimResults = false;
    baseRef.current = draft.trimEnd() + " ";
    recRef.current = rec;
    rec.onresult = (e: any) => {
      let t = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) t += e.results[i][0].transcript;
      }
      if (t) {
        baseRef.current = (baseRef.current + t).replace(/\s+/, " ") + " ";
        setDraft(baseRef.current.trimStart());
      }
    };
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };
  const stopMic = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const firstLine = draft.split(/\n/)[0];
  const isLong = draft.length > firstLine.length + 2 || firstLine.length > 80;

  const handleSave = () => {
    onKirim(s.id, draft);
    if (draft.trim()) {
      simpanMemoriSiswaAI(s.id, draft.trim());
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleGenerateAiDraft = () => {
    const conf = loadAiKnowledge();
    const p = s.name.split(" ")[0];
    let text = "";
    if (conf.tone === "suportif") {
      text = `Alhamdulillah, Ananda ${p} hari ini menunjukkan antusiasme yang sangat baik di kelas. ${p} mulai berani mencoba kegiatan mandiri dengan respon positif saat diarahkan. Terima kasih Ayah/Bunda atas pendampingan penuh kasih di rumah! 🌸`;
    } else if (conf.tone === "objektif") {
      text = `Perkembangan Ananda ${p} minggu ini: fokus aktivitas bertahan lebih stabil saat menggunakan media visual terstruktur. Indikator kemandirian ADL menunjukkan peningkatan respon adaptif. Target selanjutnya adalah pemantapan rutinitas kelas. 📊`;
    } else {
      text = `Ananda ${p} hari ini berpartisipasi aktif dalam sesi kelas bersama teman sebaya. Di rumah, Ayah/Bunda dapat melanjutkan penguatan dengan memberi kesempatan ${p} merapikan barang mandiri secara bertahap. Salam hormat! 🤝`;
    }
    setDraft(text);
    setExpanded(true);
  };

  const shortDate = (str: string) => {
    const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const d = new Date(str.replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$2-$1").replace(/\s.*/, ""));
    if (isNaN(d.getTime())) return str.slice(0, 6);
    return `${d.getDate()} ${bulan[d.getMonth()]}`;
  };

  return (
    <div className="space-y-3">
      {/* ── Compact input area ── */}
      <div style={{ background: CARD, border: `1.5px solid ${listening ? A : BDR}`, borderRadius: 18, overflow: "hidden", transition: "border-color 0.2s" }}>
        <div style={{ position: "relative" }}>
          <textarea
            value={draft}
            onChange={e => {
              setDraft(e.target.value);
              if (!expanded && e.target.value !== firstLine) setExpanded(true);
            }}
            onFocus={() => setExpanded(true)}
            rows={expanded ? 4 : 2}
            placeholder="Tulis catatan untuk orang tua..."
            style={{
              width: "100%", border: "none", outline: "none", resize: "none",
              padding: "12px 14px 8px", fontSize: 13, lineHeight: 1.6,
              color: TEXT, fontFamily: IPS, background: CARD,
              overflow: expanded ? "auto" : "hidden",
              display: "block",
            }}
          />
          {!expanded && isLong && (
            <button
              onClick={() => setExpanded(true)}
              style={{ position: "absolute", bottom: 4, right: 10, fontSize: 11, fontWeight: 700, color: T, background: "transparent", border: "none", cursor: "pointer", fontFamily: IPS }}>
              Selengkapnya...
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px 8px", borderTop: `1px solid ${BDR}`, background: BG }}>
          <button
            onClick={listening ? stopMic : startMic}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
              borderRadius: 10, border: "none", cursor: "pointer", fontFamily: IPS,
              fontSize: 11, fontWeight: 700,
              background: listening ? A : SEC,
              color: listening ? "#fff" : T,
              animation: listening ? "vt-pulse 1.5s infinite" : undefined,
            }}>
            {listening ? <MicOff size={12} /> : <Mic size={12} />}
            {listening ? "Berhenti" : "Bicara untuk Menulis"}
          </button>
          <button
            onClick={handleGenerateAiDraft}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 10px",
              borderRadius: 10, border: "none", cursor: "pointer", fontFamily: IPS,
              fontSize: 11, fontWeight: 700,
              background: "rgba(45,84,62,0.10)",
              color: DEEP,
            }}
            title="Draf pesan sesuai AI Knowledge Guru"
            className="active:scale-95 transition-transform"
          >
            <Sparkles size={12} style={{ color: "#FFA000" }} />
            <span>Draf AI</span>
          </button>
          {listening && (
            <span style={{ fontSize: 10, color: A, fontFamily: IPS, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: A, display: "inline-block" }} />
              Mendengarkan…
            </span>
          )}
          <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED, fontFamily: IPS }}>
            {draft.trim().split(/\s+/).filter(Boolean).length} kata
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <p style={{ fontSize: 11, color: MUTED, fontFamily: IPS, flex: 1, display: "flex", alignItems: "center", gap: 5 }}>
          <Sparkles size={13} style={{ color: "#059669", flexShrink: 0 }} />
          <span>Tersinkron ke orang tua & diserap AI per siswa di balik layar.</span>
        </p>
        <button
          onClick={handleSave}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
            borderRadius: 14, border: "none", cursor: "pointer",
            background: saved ? DEEP : A, color: "#fff", fontFamily: PJS,
            fontSize: 13, fontWeight: 700, flexShrink: 0,
            boxShadow: saved ? "0 4px 12px rgba(91,122,104,0.35)" : "0 4px 14px rgba(210,125,107,0.42)",
            transition: "all 0.2s",
          }}
          className="active:scale-95 transition-transform">
          {saved ? <><CheckCircle size={14} />Tersimpan</> : <><Send size={13} />Simpan Catatan</>}
        </button>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT }}>Riwayat</p>
          <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, fontFamily: IPS }}>{riwayat.length}/{allRiwayat.length} catatan</span>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 2 }}>
          {([
            { key: "semua", label: "Semua" },
            { key: "hari", label: "Hari ini" },
            { key: "minggu", label: "Minggu ini" },
            { key: "bulan", label: "Bulan ini" },
          ] as const).map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterCatatan(f.key)}
              style={{
                flexShrink: 0,
                padding: "5px 12px",
                borderRadius: 20,
                border: filterCatatan === f.key ? `1.5px solid ${DEEP}` : `1.5px solid ${BDR}`,
                background: filterCatatan === f.key ? DEEP : CARD,
                color: filterCatatan === f.key ? "#fff" : MUTED,
                fontFamily: PJS, fontWeight: 700, fontSize: 11,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {riwayat.length === 0 ? (
          <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>Belum ada catatan tersimpan.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {riwayat.map(r => (
              <div key={r.id} style={{
                background: CARD,
                border: `1px solid ${r.dibaca ? "rgba(20,184,166,0.25)" : BDR}`,
                borderRadius: 14, padding: "10px 12px",
                display: "flex", gap: 10, alignItems: "flex-start",
                transition: "border-color 0.2s",
              }}>
                <div style={{ flexShrink: 0, width: 36, textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: TEXT, fontFamily: PJS, lineHeight: 1 }}>{shortDate(r.dikirimPada).split(" ")[0]}</p>
                  <p style={{ fontSize: 10, color: MUTED, fontFamily: IPS }}>{shortDate(r.dikirimPada).split(" ")[1] || ""}</p>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 12, color: TEXT, fontFamily: IPS, lineHeight: 1.55,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                  } as React.CSSProperties}>
                    {r.isi}
                  </p>
                  {r.dibaca && r.dibacaPada && (
                    <p style={{ fontSize: 10, color: "#0D9488", fontFamily: IPS, marginTop: 3, fontWeight: 600 }}>
                      Dibaca {r.dibacaPada}
                    </p>
                  )}
                </div>

                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, paddingTop: 2 }}>
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{ display: "block" }}>
                    <path d="M1 6L5 10L13 2" stroke={r.dibaca ? "#14B8A6" : "#9CA3AF"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 6L11 10L19 2" stroke={r.dibaca ? "#14B8A6" : "#9CA3AF"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, fontFamily: IPS,
                    color: r.dibaca ? "#0D9488" : "#9CA3AF",
                  }}>
                    {r.dibaca ? "Dibaca" : "Terkirim"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes vt-pulse{0%,100%{box-shadow:0 0 0 0 rgba(210,125,107,0.45)}70%{box-shadow:0 0 0 8px rgba(210,125,107,0)}}`}</style>
    </div>
  );
}

/** Foto profil siswa: foto unggahan > foto dummy, fallback ke emoji. */
function FotoProfil({ s, size }: { s: Student; size: number }) {
  const src = fotoSiswa(s);
  const [gagal, setGagal] = useState(false);

  if (!src || gagal) {
    return (
      <span
        aria-hidden
        style={{
          width: size, height: size, borderRadius: "50%",
          background: "rgba(91,122,104,0.12)", border: `1px solid rgba(91,122,104,0.20)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: Math.round(size * 0.46), flexShrink: 0, lineHeight: 1,
        }}
      >
        {s.emoji}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`Foto profil ${s.name}`}
      onError={() => setGagal(true)}
      style={{
        width: size, height: size, borderRadius: "50%", objectFit: "cover",
        flexShrink: 0, border: `2px solid rgba(91,122,104,0.25)`,
        boxShadow: "0 2px 8px rgba(91,122,104,0.12)", background: "rgba(91,122,104,0.08)",
      }}
    />
  );
}

export function ProfileScreen({
  onBack,
  go,
  studentId,
  onStartObs,
  onRegenKode,
  onUpdateStudent,
  namaSekolah,
  laporan,
  onKirim,
}: {
  onBack: () => void;
  go: (s: Screen) => void;
  studentId: number;
  onStartObs: (id: number) => void;
  onRegenKode: (id: number) => void;
  onUpdateStudent?: (id: number, updates: Partial<Student>) => void;
  namaSekolah: string;
  laporan: LaporanKirim[];
  onKirim: (studentId: number, isi: string) => void;
}) {
  const students = useStudents();
  const updateStudentStore = useUpdateStudent();
  const s = students.find(x => x.id === studentId) ?? students[0];
  const [tab, setTab] = useState<"abk" | "kode" | "jurnal">("abk");
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    nisn: "",
    gender: "P" as "L" | "P",
    tanggalLahir: "",
    namaOrtu: "",
    statusOrtu: "Kandung",
    kodeOrtu: "",
    abk: "Tunadaksa",
    tingkatDukungan: "",
    komunikasi: "",
    motorik: "",
    caraBelajar: "Auditori & Kinestetik",
    rentang: "",
    minat: "",
    terapi: "",
  });

  // Sync formData when student changes or when entering edit mode
  useEffect(() => {
    if (s) {
      setFormData({
        nisn: s.nisn || "0012345602",
        gender: s.gender || "P",
        tanggalLahir: s.tanggalLahir || "05 Juli 2012",
        namaOrtu: s.namaOrtu || "Bapak Haris",
        statusOrtu: s.statusOrtu || "Kandung",
        kodeOrtu: s.kodeOrtu || s.abk || "Tunadaksa",
        abk: s.abk || "Tunadaksa",
        tingkatDukungan: s.tingkatDukungan || "Perlu pendampingan berkala",
        komunikasi: s.komunikasi || "Verbal lancar, artikulasi jelas",
        motorik: s.motorik || "Perlu bantuan kursi roda",
        caraBelajar: s.caraBelajar || "Auditori & Kinestetik",
        rentang: s.rentang || "15 - 20 menit",
        minat: s.minat || "Musik & Komputer",
        terapi: s.terapi || "Fisioterapi rutin 1x seminggu",
      });
    }
  }, [s, isEditing]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  };

  const handleSaveProfile = () => {
    if (!s) return;
    const updates: Partial<Student> = {
      nisn: formData.nisn,
      gender: formData.gender,
      tanggalLahir: formData.tanggalLahir,
      namaOrtu: formData.namaOrtu,
      statusOrtu: formData.statusOrtu,
      kodeOrtu: formData.kodeOrtu,
      abk: formData.abk,
      tingkatDukungan: formData.tingkatDukungan,
      komunikasi: formData.komunikasi,
      motorik: formData.motorik,
      caraBelajar: formData.caraBelajar,
      rentang: formData.rentang,
      minat: formData.minat,
      terapi: formData.terapi,
    };

    if (onUpdateStudent) {
      onUpdateStudent(s.id, updates);
    } else {
      updateStudentStore(s.id, updates);
    }

    setIsEditing(false);
    showToast("Data profil siswa berhasil diperbarui!");
  };

  if (!s) return null;

  // ── Semester helper ──
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth() + 1;
  const semNow = mo >= 7 ? 1 : 2;          // Sem.1 = Jul-Des, Sem.2 = Jan-Jun
  const semNext = semNow === 1 ? 2 : 1;
  const yrNext  = semNow === 1 ? yr : yr + 1;

  // ── Status Asesmen Berdasarkan 3 Kondisi Permintaan User ──
  const status = getStudentAsesmenStatus(s);

  const getStatusBadge = () => {
    switch (status) {
      case "not_started":
        return {
          label: "Asesmen belum dimulai",
          icon: Clock,
          btnTitle: "Mulai Asesmen",
          btnSubtitle: `Sem. ${semNow} ${yr}`,
        };
      case "in_progress":
        return {
          label: "Asesmen sedang berjalan",
          icon: Users,
          btnTitle: "Lanjutkan Asesmen",
          btnSubtitle: `Sem. 2 2026`,
        };
      case "completed":
        return {
          label: "Asesmen selesai",
          icon: CheckCircle,
          btnTitle: "Asesmen Lanjutan",
          btnSubtitle: `Sem. ${semNext} ${yrNext}`,
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="flex-1 overflow-y-auto relative flex flex-col" style={{ fontFamily: IPS, background: BG }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#1E382B",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: PJS,
            fontSize: 13,
            fontWeight: 700,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#48BB78",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={14} color="#FFFFFF" strokeWidth={3} />
          </div>
          {toastMsg}
        </div>
      )}

      {/* ── MODE EDIT PROFIL ── */}
      {isEditing ? (
        <div className="flex-1 flex flex-col" style={{ overflow: "hidden" }}>
          {/* Header Edit */}
          <div
            style={{
              background: "#FFFFFF",
              padding: "14px 18px",
              borderBottom: "1px solid rgba(91,122,104,0.12)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "sticky",
              top: 0,
              zIndex: 30,
            }}
          >
            <button
              onClick={() => setIsEditing(false)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: "rgba(91,122,104,0.08)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: TEXT,
              }}
              className="active:scale-95 transition-transform"
              title="Batal"
            >
              <ArrowLeft size={20} strokeWidth={2.4} />
            </button>
            <div>
              <h1 style={{ fontFamily: PJS, fontSize: 17.5, fontWeight: 800, color: TEXT, margin: 0 }}>
                Edit Data Profil Siswa
              </h1>
              <p style={{ fontFamily: IPS, fontSize: 12, color: "#5A6E63", margin: "1px 0 0" }}>
                {s.name} • Kelas {s.kelas}
              </p>
            </div>
          </div>

          {/* Scrollable form area */}
          <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Student mini card */}
          <div
            style={{
              background: "#FFFFFF",
              borderBottom: "1px solid rgba(91,122,104,0.10)",
              padding: "14px 20px",
            }}
            className="flex items-center gap-3.5"
          >
            <FotoProfil s={s} size={52} />
            <div className="flex-1 min-w-0">
              <h2 style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: 0 }}>
                {s.name}
              </h2>
              <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#5A6E63", margin: "2px 0 4px" }}>
                Kelas {s.kelas} • {s.age || 14} tahun • {s.teacher || "Bu Sari"}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  style={{
                    background: "#EAF2EC",
                    color: "#3D5A49",
                    border: "1px solid #D4E5DB",
                    borderRadius: 12,
                    padding: "2px 8px",
                    fontSize: 10.5,
                    fontWeight: 700,
                    fontFamily: PJS,
                  }}
                >
                  {formData.abk}
                </span>
                <span
                  style={{
                    background: "#EAF2EC",
                    color: "#3D5A49",
                    border: "1px solid #D4E5DB",
                    borderRadius: 12,
                    padding: "2px 8px",
                    fontSize: 10.5,
                    fontWeight: 700,
                    fontFamily: PJS,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3.5,
                  }}
                >
                  <statusInfo.icon size={11} strokeWidth={2.4} />
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form Body */}
          <div className="px-4 pt-4 space-y-4">
            {/* Section 1: IDENTITAS SISWA */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <User size={15} style={{ color: "#2E3E35" }} strokeWidth={2.4} />
                <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: TEXT, margin: 0, letterSpacing: "0.03em" }}>
                  IDENTITAS SISWA
                </h3>
              </div>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  border: "1px solid rgba(91,122,104,0.15)",
                  padding: "16px 18px",
                  boxShadow: "0 2px 8px rgba(91,122,104,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    NISN *
                  </label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0012345602"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #D6E6DC",
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: TEXT,
                      outline: "none",
                      background: "#F8FAF9",
                    }}
                    className="focus:border-[#3D5A49] transition-colors"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Jenis Kelamin *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as "L" | "P" })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1.5px solid #D6E6DC",
                        fontFamily: PJS,
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: TEXT,
                        outline: "none",
                        background: "#F8FAF9",
                        appearance: "none",
                        cursor: "pointer",
                      }}
                      className="focus:border-[#3D5A49] transition-colors"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                    <ChevronDown size={17} style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none", color: "#64748B" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Tanggal Lahir *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.tanggalLahir}
                      onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                      placeholder="Contoh: 05 Juli 2012"
                      style={{
                        width: "100%",
                        padding: "10px 40px 10px 14px",
                        borderRadius: 12,
                        border: "1.5px solid #D6E6DC",
                        fontFamily: PJS,
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: TEXT,
                        outline: "none",
                        background: "#F8FAF9",
                      }}
                      className="focus:border-[#3D5A49] transition-colors"
                    />
                    <Calendar size={17} style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none", color: "#64748B" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: INFORMASI KELUARGA */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Users size={15} style={{ color: "#2E3E35" }} strokeWidth={2.4} />
                <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: TEXT, margin: 0, letterSpacing: "0.03em" }}>
                  INFORMASI KELUARGA
                </h3>
              </div>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  border: "1px solid rgba(91,122,104,0.15)",
                  padding: "16px 18px",
                  boxShadow: "0 2px 8px rgba(91,122,104,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                      Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      value={formData.namaOrtu}
                      onChange={(e) => setFormData({ ...formData, namaOrtu: e.target.value })}
                      placeholder="Nama Orang Tua"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1.5px solid #D6E6DC",
                        fontFamily: PJS,
                        fontSize: 13,
                        fontWeight: 700,
                        color: TEXT,
                        outline: "none",
                        background: "#F8FAF9",
                      }}
                      className="focus:border-[#3D5A49] transition-colors"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                      Status / Hubungan
                    </label>
                    <div className="relative">
                      <select
                        value={formData.statusOrtu}
                        onChange={(e) => setFormData({ ...formData, statusOrtu: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "10px 28px 10px 12px",
                          borderRadius: 12,
                          border: "1.5px solid #D6E6DC",
                          fontFamily: PJS,
                          fontSize: 13,
                          fontWeight: 700,
                          color: TEXT,
                          outline: "none",
                          background: "#F8FAF9",
                          appearance: "none",
                          cursor: "pointer",
                        }}
                        className="focus:border-[#3D5A49] transition-colors"
                      >
                        <option value="Kandung">Kandung</option>
                        <option value="Wali">Wali</option>
                        <option value="Angkat">Angkat</option>
                        <option value="Keluarga">Keluarga</option>
                      </select>
                      <ChevronDown size={15} style={{ position: "absolute", right: 10, top: 13, pointerEvents: "none", color: "#64748B" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Kode Akses Ortu *
                  </label>
                  <input
                    type="text"
                    value={formData.kodeOrtu}
                    onChange={(e) => setFormData({ ...formData, kodeOrtu: e.target.value })}
                    placeholder="Kode Ortu (cth: Tunadaksa)"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #D6E6DC",
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: TEXT,
                      outline: "none",
                      background: "#F8FAF9",
                    }}
                    className="focus:border-[#3D5A49] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: KONDISI & KEBUTUHAN SISWA */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Heart size={15} style={{ color: "#2E3E35" }} strokeWidth={2.4} />
                <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: TEXT, margin: 0, letterSpacing: "0.03em" }}>
                  KONDISI & KEBUTUHAN SISWA
                </h3>
              </div>
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  border: "1px solid rgba(91,122,104,0.15)",
                  padding: "16px 18px",
                  boxShadow: "0 2px 8px rgba(91,122,104,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {/* Jenis Kekhususan */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Jenis Kekhususan *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.abk}
                      onChange={(e) => setFormData({ ...formData, abk: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1.5px solid #D6E6DC",
                        fontFamily: PJS,
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: TEXT,
                        outline: "none",
                        background: "#F8FAF9",
                        appearance: "none",
                        cursor: "pointer",
                      }}
                      className="focus:border-[#3D5A49] transition-colors"
                    >
                      {ABK_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={17} style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none", color: "#64748B" }} />
                  </div>
                </div>

                {/* Tingkat Dukungan */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Tingkat Dukungan
                  </label>
                  <input
                    type="text"
                    value={formData.tingkatDukungan}
                    onChange={(e) => setFormData({ ...formData, tingkatDukungan: e.target.value })}
                    placeholder="Contoh: Perlu pendampingan berkala"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #D6E6DC",
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: TEXT,
                      outline: "none",
                      background: "#F8FAF9",
                    }}
                    className="focus:border-[#3D5A49] transition-colors"
                  />
                </div>

                {/* Kemampuan Komunikasi */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Kemampuan Komunikasi
                  </label>
                  <input
                    type="text"
                    value={formData.komunikasi}
                    onChange={(e) => setFormData({ ...formData, komunikasi: e.target.value })}
                    placeholder="Contoh: Verbal lancar, artikulasi jelas"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #D6E6DC",
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: TEXT,
                      outline: "none",
                      background: "#F8FAF9",
                    }}
                    className="focus:border-[#3D5A49] transition-colors"
                  />
                </div>

                {/* Kemampuan Motorik */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Kemampuan Motorik
                  </label>
                  <input
                    type="text"
                    value={formData.motorik}
                    onChange={(e) => setFormData({ ...formData, motorik: e.target.value })}
                    placeholder="Contoh: Perlu bantuan kursi roda"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #D6E6DC",
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: TEXT,
                      outline: "none",
                      background: "#F8FAF9",
                    }}
                    className="focus:border-[#3D5A49] transition-colors"
                  />
                </div>

                {/* Cara Belajar Dominan */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Cara Belajar Dominan
                  </label>
                  <div className="relative">
                    <select
                      value={formData.caraBelajar}
                      onChange={(e) => setFormData({ ...formData, caraBelajar: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1.5px solid #D6E6DC",
                        fontFamily: PJS,
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: TEXT,
                        outline: "none",
                        background: "#F8FAF9",
                        appearance: "none",
                        cursor: "pointer",
                      }}
                      className="focus:border-[#3D5A49] transition-colors"
                    >
                      {CARA_BELAJAR_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                      <option value="Auditori & Kinestetik">Auditori & Kinestetik</option>
                      <option value="Visual & Auditori">Visual & Auditori</option>
                      <option value="Visual & Kinestetik">Visual & Kinestetik</option>
                    </select>
                    <ChevronDown size={17} style={{ position: "absolute", right: 14, top: 13, pointerEvents: "none", color: "#64748B" }} />
                  </div>
                </div>

                {/* Rentang Konsentrasi */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Rentang Konsentrasi
                  </label>
                  <input
                    type="text"
                    value={formData.rentang}
                    onChange={(e) => setFormData({ ...formData, rentang: e.target.value })}
                    placeholder="Contoh: 15 - 20 menit"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #D6E6DC",
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: TEXT,
                      outline: "none",
                      background: "#F8FAF9",
                    }}
                    className="focus:border-[#3D5A49] transition-colors"
                  />
                </div>

                {/* Minat Awal */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Minat Awal
                  </label>
                  <input
                    type="text"
                    value={formData.minat}
                    onChange={(e) => setFormData({ ...formData, minat: e.target.value })}
                    placeholder="Contoh: Musik & Komputer"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #D6E6DC",
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: TEXT,
                      outline: "none",
                      background: "#F8FAF9",
                    }}
                    className="focus:border-[#3D5A49] transition-colors"
                  />
                </div>

                {/* Riwayat Terapi */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", fontFamily: PJS, marginBottom: 4 }}>
                    Riwayat Terapi
                  </label>
                  <input
                    type="text"
                    value={formData.terapi}
                    onChange={(e) => setFormData({ ...formData, terapi: e.target.value })}
                    placeholder="Contoh: Fisioterapi rutin 1x seminggu"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #D6E6DC",
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: TEXT,
                      outline: "none",
                      background: "#F8FAF9",
                    }}
                    className="focus:border-[#3D5A49] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Bottom Actions */}
          <div
            style={{
              flexShrink: 0,
              background: "#FFFFFF",
              borderTop: "1px solid rgba(91,122,104,0.15)",
              padding: "12px 18px",
              display: "flex",
              gap: 12,
              boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
            }}
          >
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                minHeight: 46,
                borderRadius: 14,
                background: "#F1F5F3",
                border: "1.5px solid #D6E6DC",
                fontFamily: PJS,
                fontWeight: 800,
                fontSize: 14,
                color: "#5A6E63",
                cursor: "pointer",
              }}
              className="active:scale-[0.98] transition-transform"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              style={{
                flex: 1.6,
                minHeight: 46,
                borderRadius: 14,
                background: "#2E3E35",
                border: "none",
                fontFamily: PJS,
                fontWeight: 800,
                fontSize: 14,
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 14px rgba(46,62,53,0.3)",
              }}
              className="active:scale-[0.98] hover:brightness-110 transition-all"
            >
              <Save size={17} />
              Simpan Perubahan
            </button>
          </div>
        </div>
      ) : (
        /* ── MODE TAMPILAN PROFIL STANDAR ── */
        <>
          {/* ── Top Bar / Header ── */}
          <div
            style={{
              background: "#FFFFFF",
              padding: "12px 18px",
              borderBottom: "1px solid rgba(91,122,104,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={onBack}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: TEXT,
                }}
                className="active:scale-95 transition-transform"
                title="Kembali"
              >
                <ArrowLeft size={20} strokeWidth={2.4} />
              </button>
              <div>
                <h1 style={{ fontFamily: PJS, fontSize: 17.5, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
                  Profil Siswa
                </h1>
                <p style={{ fontFamily: IPS, fontSize: 12, color: "#5A6E63", margin: "2px 0 0", fontWeight: 500 }}>
                  {s.name}
                </p>
              </div>
            </div>

            {/* Action Button di Kanan Atas */}
            <button
              onClick={() => onStartObs(s.id)}
              style={{
                background: "#2E3E35",
                border: "none",
                borderRadius: 22,
                padding: "6px 14px 6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 3px 10px rgba(46,62,53,0.25)",
                transition: "all 0.15s ease",
              }}
              className="active:scale-95 hover:brightness-110"
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Play size={13} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: 1 }} />
              </div>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: "#FFFFFF", margin: 0, lineHeight: 1.2 }}>
                  {statusInfo.btnTitle}
                </p>
                <p style={{ fontFamily: IPS, fontSize: 10, color: "rgba(255,255,255,0.85)", margin: "1px 0 0", lineHeight: 1.2 }}>
                  {statusInfo.btnSubtitle}
                </p>
              </div>
            </button>
          </div>

          {/* ── Header Identitas Singkat Siswa ── */}
          <div
            style={{
              background: "#FFFFFF",
              borderBottom: "1px solid rgba(91,122,104,0.10)",
              padding: "16px 20px",
            }}
            className="flex items-center gap-4"
          >
            <FotoProfil s={s} size={64} />
            <div className="flex-1 min-w-0">
              <h2 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                {s.name}
              </h2>
              <p style={{ fontFamily: IPS, fontSize: 12, color: "#5A6E63", margin: "3px 0 6px" }}>
                Kelas {s.kelas} • {s.age || 14} tahun • {s.teacher || "Bu Sari"}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Pill Kekhususan */}
                <span
                  style={{
                    background: "#EAF2EC",
                    color: "#3D5A49",
                    border: "1px solid #D4E5DB",
                    borderRadius: 16,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: PJS,
                    display: "inline-block",
                  }}
                >
                  {s.abk}
                </span>

                {/* Pill Status Asesmen */}
                <span
                  style={{
                    background: "#EAF2EC",
                    color: "#3D5A49",
                    border: "1px solid #D4E5DB",
                    borderRadius: 16,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: PJS,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4.5,
                  }}
                >
                  <statusInfo.icon size={12} strokeWidth={2.4} />
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* ── Navigation Tabs ── */}
          <div style={{ background: "#FFFFFF", borderBottom: "1px solid rgba(91,122,104,0.10)" }} className="flex">
            {[
              { k: "abk", l: "Profil Siswa" },
              { k: "kode", l: "Kode Ortu" },
              { k: "jurnal", l: "Jurnal & Catatan" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k as any)}
                style={{
                  color: tab === t.k ? "#2E3E35" : "#6B8070",
                  borderBottom: tab === t.k ? "3px solid #3D5A49" : "3px solid transparent",
                  fontFamily: PJS,
                  fontWeight: tab === t.k ? 800 : 600,
                  minHeight: 44,
                  flex: 1,
                  background: "transparent",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  cursor: "pointer",
                  fontSize: 12.5,
                }}
                className="py-2 transition-colors"
              >
                {t.l}
              </button>
            ))}
          </div>

          {/* ── Tab Content ── */}
          <div className="px-4 pt-4 pb-8 space-y-3.5">
            {tab === "abk" && (
              <>

                {/* Box 2: Asesmen Custom (Toned-up / Prominent) */}
                <button
                  type="button"
                  onClick={() => go("asesmen-custom")}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #F0F8F3 0%, #E3F2E9 100%)",
                    border: "1.5px solid #6EBA8B",
                    borderRadius: 18,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    boxShadow: "0 3px 12px rgba(61,90,73,0.08)",
                  }}
                  className="active:scale-[0.99] hover:shadow-md transition-all group"
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: "#D6EBDD",
                      border: "1px solid #B8DCC4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={22} style={{ color: "#2E3E35" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 14, color: TEXT, margin: 0 }}>
                      Asesmen Custom
                    </p>
                    <p style={{ fontFamily: IPS, fontSize: 12, color: "#486353", margin: "2px 0 0" }}>
                      Gunakan instrumen milik guru
                    </p>
                    <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
                      <FileSpreadsheet size={13} style={{ color: "#2E3E35", flexShrink: 0 }} />
                      <span
                        style={{
                          fontSize: 10.5,
                          color: "#2E3E35",
                          fontWeight: 700,
                          fontFamily: PJS,
                          background: "#D5EBDE",
                          padding: "2px 8px",
                          borderRadius: 8,
                        }}
                      >
                        XLSX · Template tersedia
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(61,90,73,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ChevronRight size={16} style={{ color: "#2E3E35" }} strokeWidth={2.5} />
                  </div>
                </button>

                {/* Hasil Asesmen Card (Compact) */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 18,
                    border: "1px solid rgba(91,122,104,0.15)",
                    overflow: "hidden",
                    boxShadow: "0 2px 10px rgba(91,122,104,0.06)",
                  }}
                >
                  <div
                    style={{
                      background: "#2E3E35",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} style={{ color: "#D4E8DA" }} />
                      <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: "#FFFFFF", margin: 0 }}>
                        Hasil Asesmen Sem. 1 2026
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: PJS,
                        background: "#5B7A68",
                        color: "#FFFFFF",
                        borderRadius: 20,
                        padding: "2px 10px",
                      }}
                    >
                      Selesai
                    </span>
                  </div>

                  <div style={{ padding: "10px 14px" }}>
                    <button
                      type="button"
                      onClick={() => go("talent-map-detail")}
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "1.5px solid #3D5A49",
                        color: "#3D5A49",
                        fontFamily: PJS,
                        fontWeight: 800,
                        fontSize: 12,
                        minHeight: 38,
                        borderRadius: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                      className="active:scale-[0.99] transition-transform"
                    >
                      <Sparkles size={14} />
                      Lihat Laporan Lengkap AI Talent Mapping
                    </button>
                  </div>
                </div>

                {/* ── Section: IDENTITAS SISWA ── */}
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <User size={15} style={{ color: "#2E3E35" }} strokeWidth={2.4} />
                      <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: TEXT, margin: 0, letterSpacing: "0.03em" }}>
                        IDENTITAS SISWA
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3D5A49",
                        fontFamily: PJS,
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                      className="hover:underline"
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>
                  </div>
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 18,
                      border: "1px solid rgba(91,122,104,0.12)",
                      padding: "16px 18px",
                      boxShadow: "0 2px 8px rgba(91,122,104,0.04)",
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
                      <div>
                        <p style={{ fontSize: 11, color: "#64748B", fontFamily: IPS, margin: 0 }}>NISN</p>
                        <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13.5, color: TEXT, margin: "3px 0 0" }}>
                          {s.nisn || "0012345602"}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "#64748B", fontFamily: IPS, margin: 0 }}>Jenis Kelamin</p>
                        <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13.5, color: TEXT, margin: "3px 0 0" }}>
                          {s.gender === "L" ? "Laki-laki" : "Perempuan"}
                        </p>
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <p style={{ fontSize: 11, color: "#64748B", fontFamily: IPS, margin: 0 }}>Tanggal Lahir</p>
                        <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13.5, color: TEXT, margin: "3px 0 0" }}>
                          {s.tanggalLahir || "05 Juli 2012"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section: INFORMASI KELUARGA ── */}
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <Users size={15} style={{ color: "#2E3E35" }} strokeWidth={2.4} />
                      <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: TEXT, margin: 0, letterSpacing: "0.03em" }}>
                        INFORMASI KELUARGA
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3D5A49",
                        fontFamily: PJS,
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                      className="hover:underline"
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>
                  </div>
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 18,
                      border: "1px solid rgba(91,122,104,0.12)",
                      padding: "16px 18px",
                      boxShadow: "0 2px 8px rgba(91,122,104,0.04)",
                    }}
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px 16px" }}>
                      <div>
                        <p style={{ fontSize: 11, color: "#64748B", fontFamily: IPS, margin: 0 }}>Orang Tua / Wali</p>
                        <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13.5, color: TEXT, margin: "3px 0 0" }}>
                          {s.namaOrtu ? `${s.namaOrtu}${s.statusOrtu ? ` (${s.statusOrtu})` : ""}` : "Bapak Haris (Kandung)"}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "#64748B", fontFamily: IPS, margin: 0 }}>Kode Ortu</p>
                        <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13.5, color: TEXT, margin: "3px 0 0" }}>
                          {s.kodeOrtu || s.abk || "Tunadaksa"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section: KONDISI & KEBUTUHAN SISWA ── */}
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <Heart size={15} style={{ color: "#2E3E35" }} strokeWidth={2.4} />
                      <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 12.5, color: TEXT, margin: 0, letterSpacing: "0.03em" }}>
                        KONDISI & KEBUTUHAN SISWA
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3D5A49",
                        fontFamily: PJS,
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                      className="hover:underline"
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>
                  </div>
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 18,
                      border: "1px solid rgba(91,122,104,0.12)",
                      padding: "6px 18px",
                      boxShadow: "0 2px 8px rgba(91,122,104,0.04)",
                    }}
                  >
                    {[
                      ["Jenis Kekhususan", s.abk || "Tunadaksa"],
                      ["Tingkat Dukungan", s.tingkatDukungan || "Belum diisi"],
                      ["Kemampuan Komunikasi", s.komunikasi || "Belum diisi"],
                      ["Kemampuan Motorik", s.motorik || "Belum diisi"],
                      ["Cara Belajar Dominan", s.caraBelajar || "Auditori & Kinestetik"],
                      ["Rentang Konsentrasi", s.rentang || "Belum diisi"],
                      ["Minat Awal", s.minat || "Belum diisi"],
                      ["Riwayat Terapi", s.terapi || "Belum diisi"],
                    ].map(([label, val], idx, arr) => (
                      <div
                        key={label}
                        style={{
                          padding: "12px 0",
                          borderBottom: idx < arr.length - 1 ? "1px solid rgba(91,122,104,0.08)" : "none",
                        }}
                      >
                        <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>
                          {label}
                        </p>
                        <p
                          style={{
                            fontFamily: IPS,
                            fontSize: 13,
                            color: val === "Belum diisi" ? "#94A3B8" : TEXT,
                            fontWeight: val === "Belum diisi" ? 500 : 700,
                            margin: "3px 0 0",
                          }}
                        >
                          {val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Banner Tip Bantuan Guru */}
                <div
                  style={{
                    background: "#EAF2EC",
                    border: "1px solid #D6E6DC",
                    borderRadius: 18,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: "#D6E6DC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Sprout size={20} style={{ color: "#3D5A49" }} />
                  </div>
                  <p style={{ fontFamily: IPS, fontSize: 12, color: "#3D5A49", margin: 0, lineHeight: 1.45 }}>
                    Informasi ini membantu guru dalam memahami kebutuhan {s.name} secara lebih baik.
                  </p>
                </div>
              </>
            )}

            {tab === "kode" && <KodeOrtuCard s={s} onRegen={onRegenKode} />}
            {tab === "jurnal" && <JurnalTab s={s} laporan={laporan} onKirim={onKirim} />}
          </div>
        </>
      )}
    </div>
  );
}

export { ProfileScreen as StudentProfileScreen };

