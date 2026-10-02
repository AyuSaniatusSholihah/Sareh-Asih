import { useState, useEffect } from "react";
import {
  Bell, Users, MessageSquare, Sparkles, Lock, Info, Heart, Star,
  Key, Hash, XCircle, ChevronRight, ChevronLeft, MapPin, Phone,
  Clock, Wallet, CalendarDays, CheckCircle, Search, FileText, ChevronDown, X,
  Palette, Target, BookOpen, Settings, TrendingUp, Lightbulb, Laptop,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, TBar, useUI,
} from "./ui-kit";
import {
  AGENDA, KIND_META, LAYANAN, studentTalentDetail, RIASEC_META, FUNGSIONAL_KATEGORI,
  FUNGSIONAL_META, SKALA_FUNGSIONAL, KAPTION_ASPEK, WARNA_LEVEL, WARNA_LEVEL_TEKS,
  PROFIL_FUNGSIONAL, SARAN_RUMAH, seedPerkembangan, PERIODE_LIST,
  fotoSiswa, type PeriodePerkembangan, type FungsionalKategori, type RiasecKategori,
  type Screen, type Student, type LaporanKirim,
  type AgendaEvent, type EventKind,
} from "./data";
import { ProfilFungsionalRadar, ProfilKecenderunganBar, getMockJawaban, kodeTigaHuruf, skorKetekunan } from "./shared-charts";

// ─── Modal: masukkan kode akses dari dalam aplikasi ───────────────────
export function LinkCodeModal({onClose,onLinked,students}:{onClose:()=>void;onLinked:(s:Student)=>void;students:Student[]}) {
  const [kode, setKode] = useState("");
  const [err,  setErr]  = useState("");

  const submit = () => {
    if (!kode.trim()) { setErr("Masukkan kode akses terlebih dahulu"); return; }
    const k = kode.trim().toUpperCase();
    const found = students.find(s=>s.kodeOrtu?.toUpperCase()===k);
    if (!found) { setErr("Kode tidak dikenali. Pastikan kode sesuai yang diberikan guru pendamping."); return; }
    onLinked(found);
  };

  return (
    <div style={{position:"absolute",inset:0,zIndex:70,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(46,62,53,0.5)"}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:CARD,borderRadius:"26px 26px 0 0",padding:"14px 20px 28px"}}>
        {/* Top bar with drag handle and close button */}
        <div style={{position:"relative", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14}}>
          <div style={{width:36,height:4,borderRadius:2,background:"#D1D5DB"}}/>
          <button
            type="button"
            onClick={onClose}
            style={{
              position:"absolute", right:0, top:-4,
              width:30, height:30, borderRadius:"50%",
              background:"#F1F5F9", border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#64748B",
            }}
            className="active:scale-90 transition-transform"
            title="Tutup"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Key size={16} style={{color:T}}/>
          <p className="font-bold" style={{fontFamily:PJS,fontSize:17,color:TEXT}}>Masukkan Kode Akses</p>
        </div>
        <p className="text-xs leading-relaxed mb-4" style={{color:MUTED,fontFamily:IPS}}>
          Kode diberikan oleh guru pendamping di sekolah anak Anda. Setelah terhubung, Anda bisa melihat perkembangan anak.
        </p>

        <div className="relative">
          <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:MUTED}}/>
          <input autoFocus value={kode} onChange={e=>{setKode(e.target.value);setErr("");}}
            placeholder="VIIA-RAFI-2026"
            style={{width:"100%",border:`1.5px solid ${err?"#B91C1C":BDR}`,borderRadius:12,padding:"12px 12px 12px 36px",fontSize:15,color:TEXT,fontFamily:DMM,background:BG,outline:"none",minHeight:50,letterSpacing:"0.08em",textTransform:"uppercase"}}/>
        </div>
        {err && (
          <div className="mt-2 rounded-xl p-3 flex items-start gap-2" style={{background:"#FEF2F2"}}>
            <XCircle size={13} style={{color:"#B91C1C",flexShrink:0,marginTop:1}}/>
            <p className="text-xs leading-relaxed" style={{color:"#B91C1C",fontFamily:IPS}}>{err}</p>
          </div>
        )}

        <button onClick={submit} style={{width:"100%",background:A,color:"#fff",fontFamily:IPS,minHeight:50,marginTop:12}}
          className="rounded-2xl text-sm font-bold">Hubungkan</button>
        <button onClick={onClose} style={{width:"100%",color:MUTED,fontFamily:IPS,minHeight:42,background:"transparent"}}
          className="text-xs font-semibold mt-1">Nanti saja</button>
      </div>
    </div>
  );
}

// ─── BERANDA ORANG TUA ────────────────────────────────────────────────
function ChildAvatar({ name }: { name: string }) {
  return (
    <div style={{
      width: 52, height: 52, borderRadius: "50%",
      background: "linear-gradient(145deg, #FFE8D6 0%, #F5D5B8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, position: "relative", overflow: "hidden",
      border: "2.5px solid #FFD6B8",
    }}>
      <svg viewBox="0 0 52 52" width={52} height={52} style={{ position: "absolute", inset: 0 }}>
        {/* Hair */}
        <ellipse cx={26} cy={15} rx={13} ry={9} fill="#6B4E3D" opacity={0.7} />
        {/* Face */}
        <circle cx={26} cy={22} r={10} fill="#E8C4A0" />
        {/* Eyes */}
        <circle cx={22} cy={21} r={1.3} fill="#3D2E1F" />
        <circle cx={30} cy={21} r={1.3} fill="#3D2E1F" />
        {/* Cheeks */}
        <circle cx={19} cy={24} r={2} fill="#F0B8A0" opacity={0.5} />
        <circle cx={33} cy={24} r={2} fill="#F0B8A0" opacity={0.5} />
        {/* Smile */}
        <path d="M23 26 Q26 29 29 26" stroke="#3D2E1F" strokeWidth={0.9} fill="none" strokeLinecap="round" />
        {/* Body/shirt */}
        <ellipse cx={26} cy={42} rx={15} ry={11} fill="#8BB098" opacity={0.7} />
      </svg>
    </div>
  );
}

// Foto profil anak (dummy) — fallback ke ChildAvatar jika tidak ada/gagal load
function FotoAnak({ child }: { child: Student }) {
  const [gagal, setGagal] = useState(false);
  const src = fotoSiswa(child);
  if (!src || gagal) return <ChildAvatar name={child.name} />;
  return (
    <img
      src={src}
      alt={`Foto profil ${child.name}`}
      onError={() => setGagal(true)}
      style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2.5px solid #FFD6B8" }}
    />
  );
}

export function ParentDashboard({ go, child, namaOrtu, onOpenCode, laporan = [] }: {
  go: (s: Screen) => void; child: Student | null; namaOrtu: string; onOpenCode: () => void;
  laporan: LaporanKirim[];
}) {
  const upcoming = AGENDA.slice(0, 1);
  const latestLaporan = laporan.length > 0 ? laporan[laporan.length - 1] : null;
  const ibuName = namaOrtu.split(" ")[0];
  const { openSettings } = useUI();

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* ── Header ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: MUTED, margin: 0, fontWeight: 500 }}>
              Selamat pagi, {ibuName} 👋
            </p>
            <h1 style={{ fontFamily: PJS, fontSize: 22, fontWeight: 800, color: TEXT, margin: "2px 0 0", lineHeight: 1.15 }}>
              Beranda
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            <button
              style={{ width: 36, height: 36, background: BG, borderRadius: 10, border: `1px solid ${BDR}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="active:scale-95 transition-transform" title="Cari">
              <Search size={16} style={{ color: DEEP }} />
            </button>
            <button
              style={{ width: 36, height: 36, background: BG, borderRadius: 10, border: `1px solid ${BDR}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
              className="active:scale-95 transition-transform" title="Notifikasi">
              <Bell size={16} style={{ color: DEEP }} />
              <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: A, border: "1.5px solid #fff" }} />
            </button>
            <button
              onClick={openSettings}
              style={{ width: 36, height: 36, background: BG, borderRadius: 10, border: `1px solid ${BDR}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              className="active:scale-95 transition-transform" title="Pengaturan">
              <Settings size={16} style={{ color: DEEP }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 90px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Belum terhubung ── */}
        {!child && (
          <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 20, padding: "24px 18px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: SEC, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Key size={24} style={{ color: DEEP }} />
            </div>
            <p style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, margin: "0 0 6px" }}>Hubungkan dengan Anak Anda</p>
            <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, margin: "0 0 16px" }}>
              Masukkan kode akses dari guru pendamping untuk melihat perkembangan anak.
            </p>
            <button onClick={onOpenCode}
              style={{ width: "100%", background: A, color: "#fff", fontFamily: IPS, minHeight: 48, border: "none", cursor: "pointer" }}
              className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
              <Hash size={15} />Masukkan Kode Akses
            </button>
          </div>
        )}

        {/* ── Sudah terhubung ── */}
        {child && (() => {
          const talent = studentTalentDetail[child.id];
          const domains = talent?.domains ?? [];
          const utama = domains[0];
          const pendukung = domains[1];
          const nama = child.name.split(" ")[0];
          const hariMenuju = (() => {
            const target = new Date("2026-08-08T00:00:00");
            const now = new Date();
            const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return diff > 0 ? diff : 0;
          })();

          return (
          <>
            {/* ── Kartu Profil Anak ── */}
            <div style={{ background: CARD, borderRadius: 20, padding: "18px 16px 16px", border: `1px solid ${BDR}`, boxShadow: "0 1px 8px rgba(91,122,104,0.05)" }}>
              {/* Profile row */}
              <button onClick={() => go("parent-detail")} className="flex items-center gap-3 w-full"
                style={{ marginBottom: 14, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
                <FotoAnak child={child} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>{child.name}</p>
                  <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "3px 0 0", lineHeight: 1.3 }}>
                    Kelas {child.kelas} · SLB Negeri 1
                  </p>
                </div>
                <ChevronRight size={18} style={{ color: MUTED, flexShrink: 0 }} />
              </button>

              {/* Kecenderungan utama */}
              {utama && (
                <div style={{ background: BG, borderRadius: 16, padding: "13px 14px", border: `1px solid ${BDR}`, marginBottom: 12 }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: RIASEC_META[utama.t as keyof typeof RIASEC_META]?.bg ?? SEC, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                      {RIASEC_META[utama.t as keyof typeof RIASEC_META]?.icon ?? "🎨"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: 0, fontWeight: 600 }}>Kecenderungan utama</p>
                      <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: "2px 0 0", lineHeight: 1.3 }}>
                        {utama.t === "Artistic" ? "Seni & Kreativitas" : utama.t}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Kecenderungan pendukung */}
              {pendukung && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: "0 0 7px", fontWeight: 600 }}>Kecenderungan pendukung</p>
                  <div className="flex items-center gap-2" style={{ flexWrap: "wrap" }}>
                    <span style={{
                      background: RIASEC_META[pendukung.t as keyof typeof RIASEC_META]?.bg ?? SEC,
                      color: RIASEC_META[pendukung.t as keyof typeof RIASEC_META]?.color ?? DEEP,
                      border: `1px solid ${RIASEC_META[pendukung.t as keyof typeof RIASEC_META]?.color ?? DEEP}30`,
                      fontFamily: PJS, fontWeight: 700, fontSize: 11,
                    }} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full">
                      <Search size={10} />
                      {pendukung.t === "Investigative" ? "Investigasi" : pendukung.t}
                    </span>
                    {domains.length > 2 && (
                      <span style={{ background: BG, color: MUTED, border: `1px solid ${BDR}`, fontFamily: PJS, fontWeight: 700, fontSize: 11 }}
                        className="inline-flex items-center px-2.5 py-1 rounded-full">
                        +{domains.length - 2} lainnya
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button onClick={() => go("parent-detail")} className="flex items-center gap-1.5"
                style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: T, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                Lihat profil <span>→</span>
              </button>
            </div>

            {/* ── CTA Button ── */}
            <button onClick={() => go("parent-detail")}
              style={{ background: "linear-gradient(135deg, #D27D6B 0%, #C4695A 100%)", color: "#fff", fontFamily: PJS, minHeight: 52, width: "100%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 6px 18px rgba(210,125,107,0.4)" }}
              className="rounded-2xl text-sm font-bold hover:opacity-95 active:scale-[0.98] transition-all">
              <TrendingUp size={17} strokeWidth={2.5} />
              Cek Perkembangan {nama} <ChevronRight size={17} strokeWidth={2.5} />
            </button>

            {/* ── Laporan Terbaru dari Guru ── */}
            {latestLaporan && (
              <div style={{ background: CARD, borderRadius: 20, padding: "16px", border: `1px solid ${BDR}`, boxShadow: "0 1px 8px rgba(91,122,104,0.05)" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <div className="flex items-center gap-2.5">
                    <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg, #FFE8E0 0%, #FFD5C8 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={16} style={{ color: "#C4695A" }} strokeWidth={2.2} />
                    </div>
                    <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>Laporan Terbaru dari Guru</p>
                  </div>
                  <button onClick={() => go("riwayat-laporan")} className="flex items-center gap-1.5"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <span style={{ fontFamily: DMM, fontSize: 10, color: MUTED }}>{latestLaporan.dikirimPada}</span>
                    <ChevronRight size={14} style={{ color: MUTED }} />
                  </button>
                </div>

                {/* Guru pengirim */}
                <div className="flex items-center gap-1.5" style={{ marginBottom: 8 }}>
                  <Users size={13} style={{ color: MUTED, flexShrink: 0 }} />
                  <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: 0 }}>
                    {child.teacher} · Guru Pendamping
                  </p>
                </div>

                <p style={{ fontFamily: IPS, fontSize: 12, color: "#8BA892", lineHeight: 1.55, margin: "0 0 12px" }}>
                  {latestLaporan.isi.length > 100 ? latestLaporan.isi.slice(0, 100) + "…" : latestLaporan.isi}
                </p>

                {/* Saran untuk orang tua */}
                <div style={{ background: "linear-gradient(135deg, #FFF8F4 0%, #FFF2EC 100%)", border: `1px solid rgba(210,125,107,0.18)`, borderRadius: 14, padding: "12px 14px" }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: 15, lineHeight: 1 }}>💡</span>
                    <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: "#C4695A", margin: 0 }}>Saran untuk orang tua</p>
                  </div>
                  <p style={{ fontFamily: IPS, fontSize: 12, color: TEXT, margin: 0, lineHeight: 1.45 }}>
                    Berikan waktu latihan menggambar secara rutin di rumah.
                  </p>
                </div>

                <button onClick={() => go("riwayat-laporan")} className="flex items-center gap-1.5"
                  style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: T, background: "none", border: "none", padding: "12px 0 0", cursor: "pointer" }}>
                  Lihat laporan lengkap <span>→</span>
                </button>
              </div>
            )}

            {/* ── Dua kartu info 2 kolom: Agenda Terdekat & Rekomendasi Pelatihan ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* 1. Agenda Terdekat */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid rgba(210,125,107,0.25)",
                  borderRadius: 20,
                  padding: "13px 12px 12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 10px rgba(210,125,107,0.05)",
                  minHeight: 180,
                }}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: "rgba(210,125,107,0.14)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <CalendarDays size={16} style={{ color: "#C4695A" }} strokeWidth={2.3} />
                      </div>
                      <h4 style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
                        Agenda Terdekat
                      </h4>
                    </div>
                    <button
                      onClick={() => go("parent-calendar")}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(210,125,107,0.12)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        padding: 0,
                      }}
                      title="Lihat Kalender"
                    >
                      <ChevronRight size={13} style={{ color: "#C4695A" }} />
                    </button>
                  </div>

                  {/* Badge Tanggal */}
                  <div style={{ marginTop: 10 }}>
                    <span style={{
                      background: "rgba(210,125,107,0.14)",
                      color: "#C4695A",
                      fontFamily: PJS,
                      fontSize: 9.5,
                      fontWeight: 800,
                      padding: "2.5px 8px",
                      borderRadius: 6,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}>
                      <CalendarDays size={10} style={{ color: "#C4695A" }} />
                      {upcoming.length > 0
                        ? `${new Date(upcoming[0].date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })} ${new Date(upcoming[0].date + "T00:00:00").getFullYear()}`
                        : "8 Agu 2026"}
                    </span>
                  </div>

                  {/* Event Title */}
                  <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: "7px 0 0", lineHeight: 1.3 }}>
                    {upcoming.length > 0
                      ? (upcoming[0].title.length > 24 ? upcoming[0].title.slice(0, 24) + "…" : upcoming[0].title)
                      : "Seleksi Kabupaten FLS3N ..."}
                  </p>

                  {/* Time & Location */}
                  <div className="flex items-center gap-1.5" style={{ marginTop: 5 }}>
                    <Clock size={10.5} style={{ color: "#8BA892", flexShrink: 0 }} />
                    <span style={{ fontFamily: DMM, fontSize: 9.5, color: MUTED }}>
                      {upcoming.length > 0 ? upcoming[0].jam.split("–")[0].trim() : "08.00"} – {upcoming.length > 0 ? upcoming[0].jam.split("–")[1]?.trim() || "12.00" : "12.00"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ marginTop: 3 }}>
                    <MapPin size={10.5} style={{ color: "#8BA892", flexShrink: 0 }} />
                    <span style={{ fontFamily: IPS, fontSize: 9.5, color: MUTED }}>
                      {upcoming.length > 0
                        ? (upcoming[0].lokasi.length > 20 ? upcoming[0].lokasi.slice(0, 20) + "…" : upcoming[0].lokasi)
                        : "SLB Negeri 1 Bandung"}
                    </span>
                  </div>
                </div>

                {/* Tombol aksi */}
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => go("parent-calendar")}
                    style={{
                      background: "#FFFFFF",
                      border: "1.5px solid rgba(210,125,107,0.45)",
                      borderRadius: 999,
                      padding: "6px 12px",
                      color: "#C4695A",
                      fontFamily: PJS,
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      gap: 4,
                      boxShadow: "0 1px 3px rgba(210,125,107,0.08)",
                    }}
                    className="hover:bg-orange-50 active:scale-98 transition-all"
                  >
                    Lihat Kalender →
                  </button>
                </div>
              </div>

              {/* 2. Rekomendasi Pelatihan */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid rgba(91,122,104,0.25)",
                  borderRadius: 20,
                  padding: "13px 12px 12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 10px rgba(91,122,104,0.05)",
                  minHeight: 180,
                }}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9,
                        background: "rgba(91,122,104,0.14)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Lightbulb size={16} style={{ color: "#2D5A43" }} strokeWidth={2.3} />
                      </div>
                      <h4 style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
                        Rekomendasi Pelatihan
                      </h4>
                    </div>
                    <button
                      onClick={() => go("parent-training")}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(91,122,104,0.12)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        padding: 0,
                      }}
                      title="Lihat Pelatihan"
                    >
                      <ChevronRight size={13} style={{ color: "#2D5A43" }} />
                    </button>
                  </div>

                  {/* Badge Kategori */}
                  <div style={{ marginTop: 10 }}>
                    <span style={{
                      background: "rgba(91,122,104,0.16)",
                      color: "#2D5A43",
                      fontFamily: PJS,
                      fontSize: 9.5,
                      fontWeight: 800,
                      padding: "2.5px 8px",
                      borderRadius: 6,
                      display: "inline-block",
                    }}>
                      Kelas Seni Visual
                    </span>
                  </div>

                  {/* Subtitle minat */}
                  <div className="flex items-center gap-1.5" style={{ marginTop: 7 }}>
                    <Users size={11} style={{ color: MUTED, flexShrink: 0 }} />
                    <span style={{ fontFamily: IPS, fontSize: 10, color: MUTED }}>
                      Sesuai minat {nama}
                    </span>
                  </div>

                  {/* Mode Online Tag */}
                  <div style={{ marginTop: 5 }}>
                    <span style={{
                      fontFamily: PJS,
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: "#2D5A43",
                      background: "#E2EFE6",
                      border: "1px solid rgba(91,122,104,0.25)",
                      borderRadius: 5,
                      padding: "2px 7px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}>
                      <Laptop size={9.5} style={{ color: "#2D5A43" }} />
                      Online
                    </span>
                  </div>
                </div>

                {/* Tombol aksi */}
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => go("parent-training")}
                    style={{
                      background: "#FFFFFF",
                      border: "1.5px solid rgba(91,122,104,0.45)",
                      borderRadius: 999,
                      padding: "6px 12px",
                      color: "#2D5A43",
                      fontFamily: PJS,
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      gap: 4,
                      boxShadow: "0 1px 3px rgba(91,122,104,0.08)",
                    }}
                    className="hover:bg-emerald-50 active:scale-98 transition-all"
                  >
                    Lihat Semua →
                  </button>
                </div>
              </div>
            </div>
          </>
          );
        })()}
      </div>
    </div>
  );
}


// ─── KALENDER EVENT & LOMBA ABK ───────────────────────────────────────
const HARI = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export function ParentCalendarScreen({linked,sekolah,onOpenCode,go}:{
  linked:boolean; sekolah?:string; onOpenCode:()=>void; go:(s:Screen)=>void;
}) {
  const today = new Date("2026-08-05T00:00:00");
  const [cursor,setCursor] = useState({y:today.getFullYear(), m:today.getMonth()});
  const [selected,setSelected] = useState<string|null>(null);
  const [filter,setFilter] = useState<EventKind|"semua">("semua");
  const { openSettings } = useUI();

  // Kalender memuat kegiatan umum/terbuka (lomba, terapi, pelatihan)
  const list = AGENDA.filter(e=>filter==="semua"||e.kind===filter);

  const first = new Date(cursor.y, cursor.m, 1);
  const daysInMonth = new Date(cursor.y, cursor.m+1, 0).getDate();
  const startPad = first.getDay();
  const cells: (number|null)[] = [
    ...Array.from({length:startPad},()=>null),
    ...Array.from({length:daysInMonth},(_,i)=>i+1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const key = (d:number) => `${cursor.y}-${String(cursor.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const eventsOn = (d:number) => list.filter(e=>e.date===key(d));

  const shift = (n:number) => setCursor(c=>{
    const m = c.m+n;
    if (m<0)  return {y:c.y-1,m:11};
    if (m>11) return {y:c.y+1,m:0};
    return {y:c.y,m};
  });

  const monthEvents = list
    .filter(e=>e.date.startsWith(`${cursor.y}-${String(cursor.m+1).padStart(2,"0")}`))
    .sort((a,b)=>a.date.localeCompare(b.date));

  const selectedEvents = selected ? list.filter(e=>e.date===selected) : [];

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS,background:BG}}>
      {/* ── Header ── */}
      <div style={{background:"#FFFFFF",padding:"14px 20px 12px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontFamily:PJS,fontSize:22,fontWeight:800,color:TEXT,margin:0,lineHeight:1.15}}>Kalender Kegiatan</h1>
            <p style={{fontFamily:IPS,fontSize:12.5,color:MUTED,margin:"2px 0 0",fontWeight:500}}>Agenda ajang talenta, pelatihan & terapi terbuka untuk PDBK</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginTop:2}}>
            <button style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Cari">
              <Search size={16} style={{color:DEEP}}/>
            </button>
            <button style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}} className="active:scale-95 transition-transform" title="Notifikasi">
              <Bell size={16} style={{color:DEEP}}/>
              <span style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:A,border:"1.5px solid #fff"}}/>
            </button>
            <button onClick={openSettings} style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Pengaturan">
              <Settings size={16} style={{color:DEEP}}/>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {([["semua","Semua","📋"],...Object.entries(KIND_META).map(([k,v])=>[k,v.label,v.icon])] as [string,string,string][]).map(([k,l,ic])=>{
            const on = filter===k;
            return (
              <button key={k} onClick={()=>setFilter(k as any)}
                style={{
                  background:on?T:CARD,
                  color:on?"#fff":MUTED,
                  border:on?"none":`1px solid ${BDR}`,
                  fontFamily:IPS,minHeight:38,flexShrink:0,
                }}
                className="px-3.5 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                <span>{ic}</span>{l}
              </button>
            );
          })}
        </div>

        {/* Grid kalender */}
        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={()=>shift(-1)} style={{width:38,height:38,background:BG,border:`1px solid ${BDR}`}} className="rounded-xl flex items-center justify-center">
              <ChevronLeft size={16} style={{color:TEXT}}/>
            </button>
            <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{BULAN[cursor.m]} {cursor.y}</p>
            <button onClick={()=>shift(1)} style={{width:38,height:38,background:BG,border:`1px solid ${BDR}`}} className="rounded-xl flex items-center justify-center">
              <ChevronRight size={16} style={{color:TEXT}}/>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {HARI.map(h=>(
              <div key={h} className="text-center text-xs font-bold py-1" style={{color:MUTED,fontFamily:DMM}}>{h}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d,i)=>{
              if (d===null) return <div key={`p${i}`} style={{height:44}}/>;
              const evs = eventsOn(d);
              const isToday = key(d)===`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
              const isSel = selected===key(d);
              return (
                <button key={d} onClick={()=>setSelected(isSel?null:key(d))}
                  style={{
                    height:44, borderRadius:12,
                    background: isSel ? T : evs.length ? SEC : "transparent",
                    border: isToday ? `1.5px solid ${A}` : "1.5px solid transparent",
                  }}
                  className="flex flex-col items-center justify-center">
                  <span className="text-xs font-semibold" style={{color:isSel?"#fff":evs.length?DEEP:TEXT,fontFamily:DMM}}>{d}</span>
                  <div className="flex gap-0.5 mt-0.5" style={{height:4}}>
                    {evs.slice(0,3).map(e=>(
                      <span key={e.id} style={{width:4,height:4,borderRadius:"50%",background:isSel?"#fff":KIND_META[e.kind].color}}/>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2.5 mt-3 pt-3" style={{borderTop:`1px solid ${BDR}`}}>
            {Object.entries(KIND_META).map(([k,v])=>(
              <div key={k} className="flex items-center gap-1.5">
                <span style={{width:7,height:7,borderRadius:"50%",background:v.color}}/>
                <span className="text-xs" style={{color:MUTED}}>{v.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <span style={{width:9,height:9,borderRadius:3,border:`1.5px solid ${A}`}}/>
              <span className="text-xs" style={{color:MUTED}}>Hari ini</span>
            </div>
          </div>
        </div>

        {/* Detail tanggal terpilih */}
        {selected && (
          <div>
            <p className="font-bold text-sm mb-2" style={{fontFamily:PJS,color:TEXT}}>
              Agenda {new Date(selected+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}
            </p>
            {selectedEvents.length===0 ? (
              <div style={{background:CARD,border:`1.5px dashed ${BDR}`}} className="rounded-2xl px-4 py-5 text-center">
                <p className="text-xs" style={{color:MUTED}}>Tidak ada agenda pada tanggal ini.</p>
              </div>
            ) : (
              <div className="space-y-2">{selectedEvents.map(e=><EventCard key={e.id} e={e}/>)}</div>
            )}
          </div>
        )}

        {/* Daftar agenda bulan ini */}
        <div>
          <p className="font-bold text-sm mb-2" style={{fontFamily:PJS,color:TEXT}}>
            Semua Agenda {BULAN[cursor.m]}
            <span className="font-normal" style={{color:MUTED}}> · {monthEvents.length} kegiatan</span>
          </p>
          {monthEvents.length===0 ? (
            <div style={{background:CARD,border:`1.5px dashed ${BDR}`}} className="rounded-2xl px-4 py-6 text-center">
              <CalendarDays size={26} style={{color:MUTED,margin:"0 auto 8px"}}/>
              <p className="text-xs" style={{color:MUTED}}>Belum ada agenda di bulan ini untuk filter yang dipilih.</p>
            </div>
          ) : (
            <div className="space-y-2">{monthEvents.map(e=><EventCard key={e.id} e={e}/>)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({e}:{e:AgendaEvent}) {
  const [open,setOpen] = useState(false);
  const meta = KIND_META[e.kind];
  const d = new Date(e.date+"T00:00:00");
  return (
    <div style={{background:CARD,border:`1px solid ${meta.color}25`,overflow:"hidden"}} className="rounded-2xl">
      <button onClick={()=>setOpen(o=>!o)} className="w-full px-4 py-3 flex items-center gap-3 text-left">
        <div style={{width:46,background:meta.bg,flexShrink:0,paddingTop:6,paddingBottom:6}} className="rounded-xl flex flex-col items-center justify-center">
          <span className="text-xs font-bold" style={{color:meta.color,fontFamily:DMM}}>{d.toLocaleDateString("id-ID",{month:"short"})}</span>
          <span className="font-bold" style={{color:meta.color,fontFamily:PJS,fontSize:17,lineHeight:1}}>{d.getDate()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-snug" style={{color:TEXT,fontFamily:PJS}}>{e.title}</p>
          <p className="text-xs mt-0.5" style={{color:MUTED}}>{e.jam}</p>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1" style={{background:meta.bg,color:meta.color}}>{meta.icon} {meta.label}</span>
        </div>
        <ChevronRight size={15} style={{color:MUTED,flexShrink:0,transform:open?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-2" style={{borderTop:`1px solid ${BDR}`}}>
          <p className="text-xs leading-relaxed pt-2" style={{color:TEXT}}>{e.desc}</p>
          <div className="flex items-start gap-2"><MapPin size={13} style={{color:MUTED,flexShrink:0,marginTop:2}}/><p className="text-xs" style={{color:MUTED}}>{e.lokasi}</p></div>
          <div className="flex items-start gap-2"><Clock size={13} style={{color:MUTED,flexShrink:0,marginTop:2}}/><p className="text-xs" style={{color:MUTED}}>{e.jam}</p></div>
          {e.biaya && (
            <div className="flex items-start gap-2"><Wallet size={13} style={{color:MUTED,flexShrink:0,marginTop:2}}/><p className="text-xs" style={{color:MUTED}}>{e.biaya}</p></div>
          )}

          {e.pendaftaran && (
            <div style={{background:meta.bg}} className="rounded-xl px-3 py-2.5 flex items-start gap-2">
              <Info size={12} style={{color:meta.color,flexShrink:0,marginTop:2}}/>
              <p className="text-xs leading-relaxed" style={{color:meta.color}}><strong>Pendaftaran:</strong> {e.pendaftaran}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PELATIHAN & TERAPI TERDEKAT ──────────────────────────────────────
export function ParentTrainingScreen({go}:{go:(s:Screen)=>void}) {
  const [tab,setTab] = useState<"terbuka"|"layanan">("terbuka");
  const [q,setQ] = useState("");
  const { openSettings } = useUI();

  const match = (l:typeof LAYANAN[number]) =>
    l.nama.toLowerCase().includes(q.toLowerCase()) || l.kategori.toLowerCase().includes(q.toLowerCase());

  const terbuka = LAYANAN.filter(l=>l.terbuka).filter(match);
  const personal = LAYANAN.filter(l=>!l.terbuka).filter(match);
  const list = tab==="terbuka" ? terbuka : personal;

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <div style={{background:"#FFFFFF",padding:"14px 20px 12px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Pelatihan & Terapi</p>
            <p className="text-xs" style={{color:MUTED}}>Informasi umum layanan di sekitar Bandung</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginTop:2}}>
            <button style={{width:32,height:32,background:BG,borderRadius:8,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Cari">
              <Search size={14} style={{color:DEEP}}/>
            </button>
            <button style={{width:32,height:32,background:BG,borderRadius:8,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}} className="active:scale-95 transition-transform" title="Notifikasi">
              <Bell size={14} style={{color:DEEP}}/>
              <span style={{position:"absolute",top:5,right:5,width:6,height:6,borderRadius:"50%",background:A,border:"1.5px solid #fff"}}/>
            </button>
            <button onClick={openSettings} style={{width:32,height:32,background:BG,borderRadius:8,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Pengaturan">
              <Settings size={14} style={{color:DEEP}}/>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:MUTED}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari terapi, kelas seni, komunitas..."
            style={{width:"100%",border:`1.5px solid ${BDR}`,borderRadius:14,padding:"11px 14px 11px 38px",fontSize:15,color:TEXT,fontFamily:IPS,background:CARD,outline:"none",minHeight:48}}/>
        </div>

        {/* Dua kategori: terbuka umum vs personal */}
        <div className="flex rounded-2xl overflow-hidden" style={{border:`1px solid ${BDR}`}}>
          {([
            {k:"terbuka",  l:"Terbuka Umum", n:terbuka.length},
            {k:"layanan",  l:"Layanan Personal", n:personal.length},
          ] as const).map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{flex:1,background:tab===t.k?T:CARD,color:tab===t.k?"#fff":MUTED,fontFamily:IPS,minHeight:44}}
              className="text-xs font-bold">{t.l} · {t.n}</button>
          ))}
        </div>

        {list.length===0 && (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`}} className="rounded-2xl px-4 py-8 text-center">
            <p className="text-sm font-semibold" style={{color:MUTED}}>Tidak ada layanan yang cocok.</p>
          </div>
        )}

        {list.map(l=>(
          <div key={l.id} style={{background:CARD,border:`1px solid ${l.terbuka?"rgba(91,122,104,0.28)":BDR}`}} className="rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div style={{width:48,height:48,background:SEC,flexShrink:0,fontSize:22}} className="rounded-2xl flex items-center justify-center">{l.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-snug" style={{fontFamily:PJS,color:TEXT}}>{l.nama}</p>
                <p className="text-xs mt-0.5" style={{color:MUTED}}>{l.kategori}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {l.terbuka
                    ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"#F0FDF4",color:"#15803D"}}>Terbuka Umum</span>
                    : <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:BG,color:MUTED}}>Perlu janji temu</span>
                  }
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:SEC,color:DEEP}}>{l.jenis}</span>
                  {l.jarak!=="—" && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1" style={{background:"#FEF9EC",color:"#92400E"}}>
                      <MapPin size={9}/>{l.jarak}
                    </span>
                  )}
                  <span className="text-xs font-bold inline-flex items-center gap-0.5" style={{color:A,fontFamily:DMM}}>
                    <Star size={10} fill={A} style={{color:A}}/>{l.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5" style={{borderTop:`1px solid ${BDR}`,paddingTop:10}}>
              {[
                {I:MapPin, v:l.alamat},
                {I:Clock,  v:l.jadwal},
                {I:Wallet, v:l.biaya},
                {I:Phone,  v:l.kontak},
              ].map(x=>(
                <div key={x.v} className="flex items-start gap-2">
                  <x.I size={12} style={{color:MUTED,flexShrink:0,marginTop:2}}/>
                  <p className="text-xs" style={{color:TEXT}}>{x.v}</p>
                </div>
              ))}
            </div>

            {l.terbuka && l.agendaBerikutnya && (
              <button onClick={()=>go("parent-calendar")}
                style={{background:"#F0FDF4",border:`1px solid #15803D22`,width:"100%",textAlign:"left"}}
                className="rounded-xl px-3 py-2.5 mt-3 flex items-center gap-2">
                <CalendarDays size={13} style={{color:"#15803D",flexShrink:0}}/>
                <p className="text-xs leading-relaxed flex-1" style={{color:"#15803D"}}>
                  Penyelenggaraan berikutnya: <strong>{l.agendaBerikutnya}</strong>
                </p>
                <ChevronRight size={13} style={{color:"#15803D",flexShrink:0}}/>
              </button>
            )}

            <div style={{background:BG,border:`1px solid ${BDR}`}} className="rounded-xl px-3 py-2.5 mt-2 flex items-start gap-2">
              <Info size={12} style={{color:T,flexShrink:0,marginTop:2}}/>
              <p className="text-xs leading-relaxed" style={{color:TEXT}}>{l.catatan}</p>
            </div>

            <div className="flex gap-2 mt-3">
              <button style={{flex:1,background:CARD,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:44}}
                className="rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5">
                <MapPin size={13}/>Lihat Peta
              </button>
              <button style={{flex:1,background:A,color:"#fff",fontFamily:IPS,minHeight:44}}
                className="rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5">
                <Phone size={13}/>{l.terbuka?"Tanya Panitia":"Buat Janji"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DETAIL PERKEMBANGAN ANAK ─────────────────────────────────────────
export function ParentDetailScreen({onBack,child,onOpenCode,laporan,onBaca,onLihatRiwayat,go}:{
  onBack:()=>void; child:Student|null; onOpenCode:()=>void;
  laporan:LaporanKirim[]; onBaca:(id:number)=>void; onLihatRiwayat?:()=>void; go:(s:Screen)=>void;
}) {
  const { openSettings } = useUI();
  if (!child) {
    return (
      <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS,background:BG}}>
        {/* ── Header ── */}
        <div style={{background:"#FFFFFF",padding:"14px 20px 12px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
            <div style={{flex:1,minWidth:0}}>
                <h1 style={{fontFamily:PJS,fontSize:22,fontWeight:800,color:TEXT,margin:0,lineHeight:1.15}}>Perkembangan Anak</h1>
              </div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginTop:2}}>
              <button style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Cari">
                <Search size={16} style={{color:DEEP}}/>
              </button>
              <button style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}} className="active:scale-95 transition-transform" title="Notifikasi">
                <Bell size={16} style={{color:DEEP}}/>
                <span style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:A,border:"1.5px solid #fff"}}/>
              </button>
            <button onClick={openSettings} style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Pengaturan">
              <Settings size={16} style={{color:DEEP}}/>
            </button>
            </div>
          </div>
        </div>
        <div className="px-5 pt-10 pb-6 flex flex-col items-center text-center">
          <div style={{width:76,height:76,background:SEC,borderRadius:26}} className="flex items-center justify-center mb-4">
            <Lock size={32} style={{color:T}}/>
          </div>
          <p className="font-bold text-lg mb-1" style={{fontFamily:PJS,color:TEXT}}>Belum Terhubung</p>
          <p className="text-sm leading-relaxed mb-6" style={{color:MUTED}}>
            Perkembangan anak hanya bisa dibuka setelah Anda memasukkan kode akses dari guru pendamping.
          </p>
          <button onClick={onOpenCode} style={{width:"100%",background:A,color:"#fff",fontFamily:IPS,minHeight:50}}
            className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
            <Hash size={15}/>Masukkan Kode Akses
          </button>
        </div>
      </div>
    );
  }

  const nama = child.name.split(" ")[0];

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS,background:BG}}>
      {/* ── Header ── */}
      <div style={{background:"#FFFFFF",padding:"14px 20px 12px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontFamily:PJS,fontSize:22,fontWeight:800,color:TEXT,margin:0,lineHeight:1.15}}>Detail Perkembangan</h1>
            <p style={{fontFamily:IPS,fontSize:12.5,color:MUTED,margin:"2px 0 0",fontWeight:500}}>{child.name}</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginTop:2}}>
            <button style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Cari">
              <Search size={16} style={{color:DEEP}}/>
            </button>
            <button style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}} className="active:scale-95 transition-transform" title="Notifikasi">
              <Bell size={16} style={{color:DEEP}}/>
              <span style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:A,border:"1.5px solid #fff"}}/>
            </button>
            <button onClick={openSettings} style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Pengaturan">
              <Settings size={16} style={{color:DEEP}}/>
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 pt-4 pb-6 space-y-3">
        <LaporanGuruSection laporan={laporan} onBaca={onBaca} namaAnak={nama} onLihatRiwayat={onLihatRiwayat}/>

        {!child.hasObs && (
          <div style={{background:"#FEF9EC",border:`1px solid rgba(217,142,30,0.25)`}} className="rounded-2xl px-4 py-3 flex items-start gap-2.5">
            <Info size={14} style={{color:A,flexShrink:0,marginTop:1}}/>
            <p className="text-xs leading-relaxed" style={{color:A}}>
              Guru belum menyelesaikan asesmen pertama untuk {nama}. Hasil pemetaan bakat akan muncul di sini setelah asesmen selesai.
            </p>
          </div>
        )}

        {child.hasObs && (
          <>
            <SeksiCollapsible judul="Peta Potensi Anak" defaultTerbuka={true}>
              <ProfilFungsionalRadar jawaban={getMockJawaban(child.id)} readOnly={true} />
              <ProfilKecenderunganBar jawaban={getMockJawaban(child.id)} studentName={nama} studentId={child.id} readOnly={true} />
              <div style={{background:"#F0FDF4",border:`1px solid #BBF7D0`}} className="rounded-xl px-4 py-3 flex items-start gap-2.5 mt-2">
                <Info size={14} style={{color:"#15803D",flexShrink:0,marginTop:1}}/>
                <p className="text-xs leading-relaxed" style={{color:"#15803D"}}>
                  Profil ini berdasarkan pengamatan guru di lingkungan sekolah, bukan laporan langsung dari anak.
                </p>
              </div>
            </SeksiCollapsible>

            <SeksiCollapsible judul="Tren & Perkembangan" defaultTerbuka={true}>
              <KartuMasukPerkembangan nama={nama} data={seedPerkembangan[child.id]} onLihat={() => go("riwayat-perkembangan")} />
            </SeksiCollapsible>
          </>
        )}

        <SeksiCollapsible judul="Saran Guru untuk di Rumah" defaultTerbuka={true}>
          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Heart size={13} style={{color:A}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Saran Guru untuk di Rumah</p></div>
              <Lock size={12} style={{color:MUTED}}/>
            </div>
            {[
              {i:"🎨",t:`Beri ${nama} waktu berlatih bebas minimal 20 menit setiap hari.`},
              {i:"🧰",t:"Siapkan alat sederhana yang mudah dijangkau anak."},
              {i:"👏",t:"Apresiasi setiap usaha, bukan hanya hasil akhirnya."},
              {i:"🕒",t:`Jaga rutinitas yang sama setiap hari — ${nama} lebih tenang dengan jadwal yang dapat ditebak.`},
            ].map(s=>(
              <div key={s.t} className="flex items-start gap-2.5 py-2.5" style={{borderBottom:`1px solid ${BDR}`}}>
                <span className="text-lg flex-shrink-0">{s.i}</span>
                <p className="text-sm leading-relaxed" style={{color:TEXT}}>{s.t}</p>
              </div>
            ))}
          </div>
        </SeksiCollapsible>
      </div>
    </div>
  );
}

/* ── Laporan dari guru (hanya baca, tidak bisa dibalas) ─────────────── */
function LaporanGuruSection({laporan,onBaca,namaAnak,onLihatRiwayat}:{
  laporan:LaporanKirim[]; onBaca:(id:number)=>void; namaAnak:string; onLihatRiwayat?:()=>void;
}) {
  const terbaru = laporan.slice().sort((a,b)=> 
    new Date(b.dikirimPada).getTime() - new Date(a.dikirimPada).getTime()
  )[0];

  useEffect(() => {
    if (terbaru && !terbaru.dibaca) onBaca(terbaru.id);
  }, [terbaru?.id]);

  return (
    <div style={{background:CARD, border:`1.5px solid ${terbaru && !terbaru.dibaca ? A : BDR}`}} 
         className="rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <FileText size={15} style={{color:T}}/>
        <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Laporan dari Guru</p>
        {terbaru && !terbaru.dibaca && (
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" 
                style={{background:A,color:"#fff"}}>Baru</span>
        )}
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{color:MUTED}}>
        Laporan terbaru dari guru tentang {namaAnak}. Bersifat satu arah — 
        silakan hubungi guru langsung bila ingin berdiskusi.
      </p>
      
      {!terbaru ? (
        <div style={{background:BG,border:`1px dashed ${BDR}`}} className="rounded-xl px-3 py-5 text-center">
          <p className="text-xs" style={{color:MUTED}}>Belum ada laporan yang dikirim guru.</p>
        </div>
      ) : (
        <>
          <div style={{background:BG,border:`1px solid ${BDR}`}} className="rounded-xl px-3 py-3">
            <p className="text-xs mb-2 font-semibold" style={{color:MUTED,fontFamily:DMM}}>{terbaru.dikirimPada}</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{color:TEXT}}>{terbaru.isi}</p>
          </div>
          {laporan.length > 1 && onLihatRiwayat && (
            <button 
              onClick={onLihatRiwayat}
              className="w-full flex items-center justify-between mt-3 cursor-pointer"
              style={{color:T, background:"transparent", border:"none"}}
            >
              <span className="text-xs font-semibold">
                Lihat riwayat laporan ({laporan.length - 1})
              </span>
              <ChevronRight size={14} style={{color:T}}/>
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function RiwayatLaporanScreen({
  onBack, laporan, namaAnak,
}: {
  onBack: () => void; laporan: LaporanKirim[]; namaAnak: string;
}) {
  const urut = laporan.slice().sort((a,b)=>
    new Date(b.dikirimPada).getTime() - new Date(a.dikirimPada).getTime()
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <TBar title="Riwayat Laporan" sub={namaAnak} onBack={onBack}/>
      <div className="px-4 pt-4 pb-6 space-y-3">
        {urut.map(l=>(
          <div key={l.id} style={{background:CARD,border:`1px solid ${BDR}`}} 
               className="rounded-2xl p-4">
            <p className="text-xs mb-2 font-semibold" style={{color:MUTED,fontFamily:DMM}}>{l.dikirimPada}</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{color:TEXT}}>{l.isi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeksiCollapsible({
  judul, defaultTerbuka = true, children,
}: { judul: string; defaultTerbuka?: boolean; children: React.ReactNode }) {
  const [terbuka, setTerbuka] = useState(defaultTerbuka);
  return (
    <div className="mt-5">
      <button
        onClick={() => setTerbuka(!terbuka)}
        className="w-full flex items-center justify-between px-1 mb-2"
      >
        <span
          className="text-xs font-bold uppercase"
          style={{ color: MUTED, fontFamily: PJS, letterSpacing: "0.05em" }}
        >
          {judul}
        </span>
        <ChevronDown
          size={14}
          style={{
            color: MUTED,
            transform: terbuka ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.15s",
          }}
        />
      </button>
      {terbuka && <div className="space-y-3">{children}</div>}
    </div>
  );
}

const NAMA_ASPEK: Record<FungsionalKategori, string> = {
  "Kognisi": "Kognisi",
  "Mobilitas": "Mobilitas",
  "Perawatan Diri": "Perawatan diri",
  "Interaksi dengan Orang Lain": "Interaksi dengan orang lain",
  "Aktivitas Sehari-hari": "Aktivitas sehari-hari",
  "Partisipasi": "Partisipasi",
};

/* Bar komposisi abstrak: jumlah indikator per level, tanpa angka/legenda */
function BarDistribusi({ counts, height = 8 }: { counts: number[]; height?: number }) {
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex items-center" style={{ gap: 3, marginTop: 6, height }}>
      {counts.map((c, i) =>
        c > 0 ? (
          <span key={i} style={{ flex: c / total, height, borderRadius: 99, background: WARNA_LEVEL[i] }} />
        ) : null
      )}
    </div>
  );
}

/* Kartu pintu masuk: "Lihat perkembangan ›" */
function KartuMasukPerkembangan({ nama, data, onLihat }: {
  nama: string; data?: PeriodePerkembangan; onLihat: () => void;
}) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl p-4">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="flex items-center justify-center flex-shrink-0"
          style={{ width: 34, height: 34, borderRadius: 12, background: "#E4F1E9", fontSize: 16 }}>🌱</span>
        <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT }}>Perkembangan {nama}</p>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>
        {data
          ? `Ada beberapa perubahan pada kemampuan ${nama} sejak periode sebelumnya. ${data.perubahan.kategori} menunjukkan perubahan paling terlihat.`
          : `Belum ada riwayat perkembangan untuk ${nama}. Perbandingan akan muncul mulai periode berikutnya.`}
      </p>
      <button onClick={onLihat}
        className="w-full flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        style={{ background: "#E7F2EB", color: T, fontFamily: IPS, fontSize: 13, fontWeight: 700, padding: "11px 16px", borderRadius: 14, border: "none", cursor: "pointer" }}>
        Lihat perkembangan <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* Halaman "Perkembangan {nama}" — screen riwayat-perkembangan */
export function PerkembanganScreen({ onBack, child, onPilihAspek }: {
  onBack: () => void; child: Student | null; onPilihAspek: (k: FungsionalKategori) => void;
}) {
  const nama = child ? child.name.split(" ")[0] : "";
  const data = child ? seedPerkembangan[child.id] : undefined;
  const [periode, setPeriode] = useState(data?.label ?? "");
  const [bukaPeriode, setBukaPeriode] = useState(false);
  useEffect(() => {
    if (data) setPeriode(data.label);
    setBukaPeriode(false);
  }, [data?.label]);

  if (!data) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
        <TBar title={`Perkembangan ${nama}`} onBack={onBack} />
        <div className="px-4 pt-4 pb-6">
          <div style={{ background: CARD, border: `1px dashed ${BDR}` }} className="rounded-2xl px-4 py-6 text-center">
            <p className="font-bold text-sm mb-1" style={{ fontFamily: PJS, color: TEXT }}>Belum ada data perkembangan</p>
            <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
              Riwayat perkembangan {nama} akan muncul setelah guru menyelesaikan asesmen pada periode berikutnya.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const skala = (v: number) => SKALA_FUNGSIONAL.find(s => s.v === v) ?? SKALA_FUNGSIONAL[1];
  const p = data.perubahan;

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <TBar title={`Perkembangan ${nama}`} onBack={onBack} />
      <div className="px-4 pt-4 pb-6 space-y-3">

        {/* Pill periode + dropdown */}
        <div>
          <button onClick={() => setBukaPeriode(v => !v)}
            className="w-full flex items-center gap-2.5 px-4 py-3"
            style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, cursor: "pointer", textAlign: "left" }}>
            <CalendarDays size={16} style={{ color: T, flexShrink: 0 }} />
            <span className="flex-1 text-sm font-semibold" style={{ color: TEXT, fontFamily: IPS }}>{periode}</span>
            <ChevronDown size={16} style={{ color: MUTED, flexShrink: 0, transform: bukaPeriode ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
          </button>
          {bukaPeriode && (
            <div style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 14, marginTop: 6, overflow: "hidden" }}>
              {PERIODE_LIST.map((o, i) => {
                const aktif = o.label === periode;
                return (
                  <button key={o.label} onClick={() => { setPeriode(o.label); setBukaPeriode(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left"
                    style={{
                      background: aktif ? "#E7F2EB" : "transparent", border: "none",
                      borderBottom: i < PERIODE_LIST.length - 1 ? `1px solid ${BDR}` : "none",
                      cursor: "pointer",
                    }}>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold" style={{ color: TEXT, fontFamily: IPS }}>{o.label}</span>
                      <span className="block text-xs" style={{ color: MUTED }}>{o.semester}</span>
                    </span>
                    {aktif && <CheckCircle size={16} style={{ color: T, flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Card: Perubahan yang terlihat */}
        <div style={{ background: "#EEF6F0", border: `1px solid #D4E8DA` }} className="rounded-2xl p-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex items-center justify-center flex-shrink-0"
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#D9EDDF", fontSize: 18 }}>🌱</span>
            <div className="min-w-0">
              <p className="font-bold text-sm" style={{ fontFamily: PJS, color: "#2E6B4F" }}>Perubahan yang terlihat</p>
              <p className="text-xs leading-relaxed mt-0.5" style={{ color: MUTED }}>
                Ada beberapa perubahan pada kemampuan {nama} sejak periode sebelumnya.
              </p>
            </div>
          </div>
          <div style={{ background: CARD, border: `1px solid #D4E8DA` }} className="rounded-xl p-3 flex items-start gap-2.5">
            <span className="flex items-center justify-center flex-shrink-0"
              style={{ width: 34, height: 34, borderRadius: "50%", background: FUNGSIONAL_META[p.kategori].bg, fontSize: 16 }}>
              {FUNGSIONAL_META[p.kategori].icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-bold" style={{ fontFamily: PJS, color: TEXT }}>{p.kategori}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0 }}>
                  <span className="font-bold" style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: skala(p.dari).bg, color: skala(p.dari).color }}>{skala(p.dari).l}</span>
                  <span className="text-xs" style={{ color: MUTED }}>→</span>
                  <span className="font-bold" style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: skala(p.ke).bg, color: skala(p.ke).color }}>{skala(p.ke).l}</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed mt-1.5" style={{ color: MUTED }}>{p.teks.replace(/{nama}/g, nama)}</p>
            </div>
          </div>
        </div>

        {/* Kondisi saat ini pada 6 aspek */}
        <div className="pt-1">
          <p style={{ fontFamily: PJS, fontSize: 17, fontWeight: 800, color: TEXT, margin: 0 }}>Kondisi saat ini pada 6 aspek</p>
          <p className="text-xs mt-1" style={{ color: MUTED }}>Gambaran singkat kondisi {nama} berdasarkan hasil asesmen.</p>
        </div>

        {FUNGSIONAL_KATEGORI.map(k => {
          const meta = FUNGSIONAL_META[k];
          return (
            <button key={k} onClick={() => onPilihAspek(k)}
              className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:scale-[0.99] transition-transform"
              style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, cursor: "pointer" }}>
              <span className="flex items-center justify-center flex-shrink-0"
                style={{ width: 42, height: 42, borderRadius: "50%", background: meta.bg, fontSize: 19 }}>{meta.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ fontFamily: PJS, color: TEXT, margin: 0 }}>{NAMA_ASPEK[k]}</p>
                <BarDistribusi counts={data.aspek[k].sesudah} />
                <p className="text-xs mt-1.5" style={{ color: MUTED, margin: 0 }}>{KAPTION_ASPEK[k]}</p>
              </div>
              <ChevronRight size={16} style={{ color: MUTED, flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Halaman detail satu aspek (mis. Kognisi) — screen detail-aspek */
export function AspekDetailScreen({ onBack, child, aspek, onLihatKemampuan }: {
  onBack: () => void; child: Student | null; aspek: FungsionalKategori; onLihatKemampuan: () => void;
}) {
  const [bukaSaran, setBukaSaran] = useState(false);
  const nama = child ? child.name.split(" ")[0] : "";
  const data = child ? seedPerkembangan[child.id] : undefined;
  const meta = FUNGSIONAL_META[aspek];
  const jumlah = PROFIL_FUNGSIONAL.filter(i => i.kategori === aspek).length;

  if (!data) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
        <TBar title={aspek} onBack={onBack} />
        <div className="px-4 pt-4 pb-6">
          <div style={{ background: CARD, border: `1px dashed ${BDR}` }} className="rounded-2xl px-4 py-6 text-center">
            <p className="font-bold text-sm mb-1" style={{ fontFamily: PJS, color: TEXT }}>Belum ada data perkembangan</p>
            <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
              Gambaran {aspek} akan muncul setelah guru menyelesaikan asesmen pada periode berikutnya.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const a = data.aspek[aspek];
  const beban = (c: number[]) => c.reduce((s, v, i) => s + v * i, 0);
  const delta = beban(a.sesudah) - beban(a.sebelum);
  const teksPerubahan = delta > 0
    ? "Beberapa kemampuan kini dapat dilakukan dengan bantuan yang lebih sedikit."
    : delta === 0
      ? "Gambaran kemampuan saat ini mirip dengan periode sebelumnya."
      : "Beberapa kemampuan kini membutuhkan lebih banyak pendampingan.";
  const saran = SARAN_RUMAH[aspek].map(s => s.replace(/{nama}/g, nama));

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <TBar title={aspek} onBack={onBack} right={
        <span className="font-bold" style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: SEC, color: T, whiteSpace: "nowrap" }}>
          {jumlah} indikator
        </span>
      } />
      <div className="px-4 pt-4 pb-6 space-y-3">

        {/* Pengantar aspek */}
        <div className="flex items-center gap-3 p-4" style={{ background: meta.bg, borderRadius: 16 }}>
          <span className="flex items-center justify-center flex-shrink-0"
            style={{ width: 46, height: 46, borderRadius: "50%", background: "#FFFFFF", fontSize: 22 }}>{meta.icon}</span>
          <div className="min-w-0">
            <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT, margin: 0 }}>{aspek}</p>
            <p className="text-xs leading-relaxed mt-0.5" style={{ color: MUTED }}>{meta.desc}</p>
          </div>
        </div>

        {/* Gambaran kondisi saat ini */}
        <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl p-4">
          <p className="font-bold text-sm mb-3" style={{ fontFamily: PJS, color: TEXT }}>Gambaran kondisi saat ini</p>
          <BarDistribusi counts={a.sesudah} height={14} />
          <div className="flex items-start mt-3">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-1.5" style={{ flex: 1 }}>
                <span className="font-bold"
                  style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: `${WARNA_LEVEL[i]}66`, color: WARNA_LEVEL_TEKS[i], whiteSpace: "nowrap" }}>
                  {SKALA_FUNGSIONAL[i + 1].l}
                </span>
                <span className="font-bold" style={{ fontSize: 15, color: WARNA_LEVEL_TEKS[i] }}>{a.sesudah[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Perubahan dari periode sebelumnya */}
        <div style={{ background: "#EEF6F0", border: `1px solid #D4E8DA` }} className="rounded-2xl p-4 flex items-start gap-3">
          <span className="flex items-center justify-center flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#D9EDDF", fontSize: 16 }}>🌱</span>
          <div className="min-w-0">
            <p className="font-bold text-sm" style={{ fontFamily: PJS, color: "#2E6B4F", margin: 0 }}>
              {delta !== 0 ? "Ada perubahan" : "Belum ada perubahan yang terlihat"}
            </p>
            <p className="text-xs leading-relaxed mt-1" style={{ color: MUTED }}>{teksPerubahan}</p>
          </div>
        </div>

        {/* Yang bisa dilakukan di rumah */}
        <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center flex-shrink-0"
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#FEF3C7", fontSize: 16 }}>💡</span>
            <div className="min-w-0">
              <p className="font-bold text-sm" style={{ fontFamily: PJS, color: TEXT, margin: 0 }}>Yang bisa dilakukan di rumah</p>
              <p className="text-xs leading-relaxed mt-1" style={{ color: MUTED }}>{saran[0]}</p>
            </div>
          </div>
          {bukaSaran && (
            <ul className="mt-3 space-y-2">
              {saran.slice(1).map(s => (
                <li key={s} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: MUTED }}>
                  <span style={{ color: T }}>•</span>{s}
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setBukaSaran(v => !v)}
            className="w-full flex items-center justify-center gap-1.5 mt-3"
            style={{ background: "transparent", color: T, fontFamily: IPS, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
            {bukaSaran ? "Sembunyikan saran" : "Lihat saran lainnya"} <span>{bukaSaran ? "↑" : "→"}</span>
          </button>
        </div>

        {/* Aksi bawah → daftar kemampuan yang diamati */}
        <button onClick={onLihatKemampuan}
          className="w-full flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          style={{ background: "#E7F2EB", color: T, fontFamily: IPS, fontSize: 14, fontWeight: 700, padding: "13px 16px", borderRadius: 16, border: "none", cursor: "pointer" }}>
          Lihat kemampuan yang diamati <span>→</span>
        </button>
      </div>
    </div>
  );
}

/* Halaman "Kemampuan yang Diamati" — screen kemampuan-diamati */
export function KemampuanDiamatiScreen({ onBack, child, aspek }: {
  onBack: () => void; child: Student | null; aspek: FungsionalKategori;
}) {
  const data = child ? seedPerkembangan[child.id] : undefined;
  const meta = FUNGSIONAL_META[aspek];
  const items = PROFIL_FUNGSIONAL.filter(i => i.kategori === aspek);
  const namaPendek = (t: string) => t.split(" (")[0].replace(/\.$/, "");

  if (!data) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
        <TBar title="Kemampuan yang Diamati" sub={NAMA_ASPEK[aspek]} onBack={onBack} />
        <div className="px-4 pt-4 pb-6">
          <div style={{ background: CARD, border: `1px dashed ${BDR}` }} className="rounded-2xl px-4 py-6 text-center">
            <p className="font-bold text-sm mb-1" style={{ fontFamily: PJS, color: TEXT }}>Belum ada data kemampuan</p>
            <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
              Daftar kemampuan akan muncul setelah guru menyelesaikan asesmen pada periode berikutnya.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sebaran level per indikator mengikuti distribusi pada halaman aspek
  const level: number[] = [];
  data.aspek[aspek].sesudah.forEach((c, lvl) => {
    for (let j = 0; j < c; j++) level.push(lvl);
  });

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <TBar title="Kemampuan yang Diamati" sub={`${NAMA_ASPEK[aspek]} · ${items.length} kemampuan yang diamati`} onBack={onBack} />
      <div className="px-4 pt-4 pb-6 space-y-3">
        <div>
          <p className="text-sm leading-relaxed" style={{ color: TEXT, margin: 0 }}>
            Berikut kemampuan yang diamati guru dalam aspek {NAMA_ASPEK[aspek].toLowerCase()}.
          </p>
          <p className="text-xs mt-1" style={{ color: MUTED, margin: 0 }}>Setiap kemampuan dapat memiliki kondisi yang berbeda.</p>
        </div>

        <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl overflow-hidden">
          {items.map((it, idx) => {
            const s = SKALA_FUNGSIONAL[(level[idx] ?? 1) + 1];
            const terakhir = idx === items.length - 1;
            return (
              <div key={it.id} className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: terakhir ? "none" : `1px solid ${BDR}` }}>
                <span className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 32, height: 32, borderRadius: 10, background: meta.bg, fontSize: 15 }}>{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ fontFamily: PJS, fontWeight: 600, color: TEXT, margin: 0 }}>{namaPendek(it.text)}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs" style={{ color: MUTED }}>Saat ini:</span>
                    <span className="font-bold" style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: s.bg, color: s.color }}>{s.l}</span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: MUTED, flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}