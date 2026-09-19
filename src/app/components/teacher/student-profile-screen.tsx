import React, { useState, useRef } from "react";
import {
  Key, Copy, RefreshCw, CheckCircle, Mic, MicOff, Send,
  ClipboardList, Edit3, FileText, Sparkles, Brain,
} from "lucide-react";
import {
  T, A, CARD, TEXT, MUTED, SEC, BDR, DEEP, BG, PJS, IPS, DMM, TBar, Chip, SBadge,
} from "../ui-kit";
import { useStudents, type Student, type LaporanKirim, type Screen } from "../data";
import { exportLaporanPemetaan } from "../export";

/** Kartu kode orang tua — guru yang membuat & membagikannya (peran admin ada di guru). */
export function KodeOrtuCard({ s, onRegen }: { s: Student; onRegen: (id: number) => void }) {
  const [copied, setCopied] = useState(false);
  const salin = () => {
    if (s.kodeOrtu) navigator.clipboard?.writeText(s.kodeOrtu).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ background: CARD, border: `1.5px solid ${T}` }} className="rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Key size={15} style={{ color: T }} />
        <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>Kode Akses Orang Tua</p>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>
        Bagikan kode ini kepada orang tua {s.name.split(" ")[0]} agar mereka bisa memantau perkembangan anak dan menerima agenda sekolah.
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
  const generated = `${s.name} menunjukkan perkembangan positif pada ${s.talent ? s.talent.toLowerCase() : "kegiatan belajarnya"} di Semester Genap 2026. Fokus dan kemandirian meningkat dibanding semester lalu.`;
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
      // parse dikirimPada: "18 Sep 2026" or "18/09/2026" etc.
      const raw = r.dikirimPada.replace(/(\d+)\s+(\w+)\s+(\d+)/, (_, d, m, y) => {
        const bln: Record<string, string> = { Jan:"01",Feb:"02",Mar:"03",Apr:"04",Mei:"05",Jun:"06",Jul:"07",Agu:"08",Sep:"09",Okt:"10",Nov:"11",Des:"12" };
        return `${y}-${bln[m] || "01"}-${d.padStart(2,"0")}`;
      });
      const d = new Date(raw);
      if (isNaN(d.getTime())) return true; // keep if unparseable
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
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
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
        {/* Textarea — collapsed or expanded */}
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

        {/* Toolbar — mic + word count */}
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

      {/* ── Info + Save ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <p style={{ fontSize: 11, color: MUTED, fontFamily: IPS, flex: 1 }}>
          Catatan akan terlihat oleh orang tua.
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

      {/* ── Riwayat ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT }}>Riwayat</p>
          <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, fontFamily: IPS }}>{riwayat.length}/{allRiwayat.length} catatan</span>
        </div>

        {/* Filter Pills */}
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
                {/* Date column */}
                <div style={{ flexShrink: 0, width: 36, textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: TEXT, fontFamily: PJS, lineHeight: 1 }}>{shortDate(r.dikirimPada).split(" ")[0]}</p>
                  <p style={{ fontSize: 10, color: MUTED, fontFamily: IPS }}>{shortDate(r.dikirimPada).split(" ")[1] || ""}</p>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 12, color: TEXT, fontFamily: IPS, lineHeight: 1.55,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
                  } as React.CSSProperties}>
                    {r.isi}
                  </p>
                  {/* Read timestamp — muncul jika sudah dibaca */}
                  {r.dibaca && r.dibacaPada && (
                    <p style={{ fontSize: 10, color: "#0D9488", fontFamily: IPS, marginTop: 3, fontWeight: 600 }}>
                      Dibaca {r.dibacaPada}
                    </p>
                  )}
                </div>

                {/* Read Receipt — double checkmark */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, paddingTop: 2 }}>
                  {/* Double check SVG */}
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{ display: "block" }}>
                    {/* First check (back) */}
                    <path d="M1 6L5 10L13 2" stroke={r.dibaca ? "#14B8A6" : "#9CA3AF"}
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Second check (front, offset right) */}
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

export function ProfileScreen({
  onBack,
  go,
  studentId,
  onStartObs,
  onRegenKode,
  namaSekolah,
  laporan,
  onKirim,
}: {
  onBack: () => void;
  go: (s: Screen) => void;
  studentId: number;
  onStartObs: (id: number) => void;
  onRegenKode: (id: number) => void;
  namaSekolah: string;
  laporan: LaporanKirim[];
  onKirim: (studentId: number, isi: string) => void;
}) {
  const students = useStudents();
  const s = students.find(x => x.id === studentId) ?? students[0];
  const [tab, setTab] = useState<"abk" | "kode" | "jurnal">("abk");
  if (!s) return null;

  const rows: [string, string][] = [
    ["Jenis ABK", s.abk],
    ["Tingkat Dukungan", s.tingkatDukungan || "Belum diisi"],
    ["Kemampuan Komunikasi", s.komunikasi || "Belum diisi"],
    ["Kemampuan Motorik", s.motorik || "Belum diisi"],
    ["Cara Belajar Dominan", s.caraBelajar || "Menunggu hasil asesmen"],
    ["Rentang Konsentrasi", s.rentang || "Belum diisi"],
    ["Minat Awal", s.minat || "Belum diisi"],
    ["Riwayat Terapi", s.terapi || "Belum diisi"],
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS }}>
      <TBar title="Profil Siswa" sub={s.name} onBack={onBack}
        right={<button onClick={() => onStartObs(s.id)} style={{ background: A, color: "#fff", fontFamily: PJS, fontWeight: 800, minHeight: 42, borderRadius: 14, padding: "0 16px", boxShadow: "0 4px 14px rgba(210,125,107,0.42)", border: "none", cursor: "pointer" }} className="flex items-center gap-1.5 text-xs active:scale-95 transition-transform"><ClipboardList size={14} strokeWidth={2.2} />Asesmen</button>} />
      <div style={{ background: CARD, borderBottom: `1px solid ${BDR}` }} className="px-4 py-3 flex items-center gap-3">
        <div style={{ width: 52, height: 52, background: SEC, border: `1.5px solid rgba(91,122,104,0.25)`, flexShrink: 0 }} className="rounded-2xl flex items-center justify-center text-2xl">{s.emoji}</div>
        <div className="flex-1">
          <p className="font-bold text-base" style={{ fontFamily: PJS, color: TEXT }}>{s.name}</p>
          <p className="text-xs" style={{ color: MUTED }}>Kelas {s.kelas}{s.age ? ` · ${s.age} tahun` : ""} · {s.teacher}</p>
          <div className="flex gap-1.5 mt-1"><Chip label={s.abk} color="purple" /><SBadge s={s.hasObs ? "Berjalan" : "Belum Dibaca"} /></div>
        </div>
      </div>
      <div className="flex" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
        {[{ k: "abk", l: "Profil ABK" }, { k: "kode", l: "Kode Ortu" }, { k: "jurnal", l: "Jurnal & Catatan" }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k as any)}
            style={{
              color: tab === t.k ? DEEP : MUTED,
              borderBottom: tab === t.k ? `3px solid ${DEEP}` : "3px solid transparent",
              fontFamily: PJS,
              fontWeight: tab === t.k ? 800 : 600,
              minHeight: 44, flex: 1
            }}
            className="py-2 text-xs transition-colors">{t.l}</button>
        ))}
      </div>
      <div className="px-4 pt-4 pb-6 space-y-2">
        {tab === "abk" && (
          <>
            <div style={{ background: DEEP, borderRadius: 16, padding: "12px 14px", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(91,122,104,0.22)" }} className="flex items-center gap-2 mb-3">
              <Edit3 size={15} style={{ color: "#D4E8DA", flexShrink: 0 }} />
              <p className="text-xs" style={{ color: "#FFFFFF" }}>Data diinput oleh guru — dapat diperbarui kapan saja.</p>
            </div>
            {rows.map(([l, v]) => (
              <div key={l} style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.35)`, borderRadius: 16, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }} className="px-4 py-3">
                <p style={{ fontSize: 11, fontWeight: 800, color: DEEP, fontFamily: PJS, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: l.includes("Kode") ? DMM : PJS, marginTop: 3 }}>{v}</p>
              </div>
            ))}
          </>
        )}

        {tab === "kode" && <KodeOrtuCard s={s} onRegen={onRegenKode} />}

        {tab === "jurnal" && <JurnalTab s={s} laporan={laporan} onKirim={onKirim} />}

        {/* Unduh laporan pemetaan untuk anak ini saja */}
        <button onClick={() => exportLaporanPemetaan([s], namaSekolah)}
          style={{ width: "100%", background: CARD, border: `1.5px solid ${DEEP}`, color: DEEP, fontFamily: PJS, fontWeight: 800, minHeight: 48, borderRadius: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(91,122,104,0.08)" }}
          className="text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <FileText size={15} />Unduh Laporan Pemetaan {s.name.split(" ")[0]}
        </button>
        <div className="flex gap-2 pt-2">
          <button onClick={() => go("talent-map-detail")} style={{ flex: 1, background: DEEP, color: "#FFFFFF", fontFamily: PJS, fontWeight: 800, minHeight: 46, borderRadius: 16, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(91,122,104,0.25)" }} className="text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"><Sparkles size={14} />Talent Map</button>
          <button onClick={() => go("learning-rec")} style={{ flex: 1, background: A, color: "#FFFFFF", fontFamily: PJS, fontWeight: 800, minHeight: 46, borderRadius: 16, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(210,125,107,0.35)" }} className="text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"><Brain size={14} />Rekomendasi</button>
        </div>
      </div>
    </div>
  );
}
export { ProfileScreen as StudentProfileScreen };
