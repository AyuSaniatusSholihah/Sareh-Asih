import { useState, useEffect } from "react";
import {
  Bell, Users, MessageSquare, Sparkles, Lock, Info, Heart, Star,
  Key, Hash, XCircle, ChevronRight, ChevronLeft, MapPin, Phone,
  Clock, Wallet, CalendarDays, CheckCircle, Search, FileText, ChevronDown, X,
  Palette, Target, BookOpen, Settings, TrendingUp,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, TBar,
} from "./ui-kit";
import {
  AGENDA, KIND_META, LAYANAN, studentTalentDetail, RIASEC_META, FUNGSIONAL_KATEGORI,
  seedRiwayatAsesmen, type AsesmenPeriode, type RiasecKategori,
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
            placeholder="ABK-2025-RAFI"
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

export function ParentDashboard({ go, child, namaOrtu, onOpenCode, laporan = [] }: {
  go: (s: Screen) => void; child: Student | null; namaOrtu: string; onOpenCode: () => void;
  laporan: LaporanKirim[];
}) {
  const upcoming = AGENDA.slice(0, 1);
  const latestLaporan = laporan.length > 0 ? laporan[laporan.length - 1] : null;
  const ibuName = namaOrtu.split(" ")[0];

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
              onClick={() => go("parent-training")}
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
              <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                <ChildAvatar name={child.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>{child.name}</p>
                  <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "3px 0 0", lineHeight: 1.3 }}>
                    Kelas {child.kelas} · SLB Negeri 1
                  </p>
                </div>
                <div style={{ flexShrink: 0, background: BG, borderRadius: 10, padding: "6px 10px", border: `1px solid ${BDR}` }}>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={11} style={{ color: MUTED }} />
                    <p style={{ fontFamily: DMM, fontSize: 9, color: MUTED, margin: 0, whiteSpace: "nowrap" }}>Terakhir diperbarui</p>
                  </div>
                  <p style={{ fontFamily: PJS, fontSize: 10.5, fontWeight: 700, color: TEXT, margin: "2px 0 0", whiteSpace: "nowrap" }}>18 Jun 2026</p>
                </div>
              </div>

              {/* Kecenderungan Aktivitas */}
              {utama && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: "0 0 8px", fontWeight: 600 }}>Kecenderungan Aktivitas</p>
                  <div style={{ background: BG, borderRadius: 16, padding: "14px 14px", border: `1px solid ${BDR}` }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: RIASEC_META[utama.t as keyof typeof RIASEC_META]?.bg ?? SEC, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
                        {RIASEC_META[utama.t as keyof typeof RIASEC_META]?.icon ?? "🎨"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.3 }}>
                          {utama.t === "Artistic" ? "Seni & Kreativitas" : utama.t}
                        </p>
                        <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "3px 0 0", lineHeight: 1.35 }}>
                          Menonjol dalam eksplorasi ide dan ekspresi diri
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Kecenderungan pendukung */}
              {pendukung && (
                <div className="flex items-center gap-2" style={{ flexWrap: "wrap" }}>
                  <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: 0, fontWeight: 500 }}>Kecenderungan pendukung:</p>
                  <span style={{
                    background: RIASEC_META[pendukung.t as keyof typeof RIASEC_META]?.bg ?? SEC,
                    color: RIASEC_META[pendukung.t as keyof typeof RIASEC_META]?.color ?? DEEP,
                    border: `1px solid ${RIASEC_META[pendukung.t as keyof typeof RIASEC_META]?.color ?? DEEP}30`,
                    fontFamily: PJS, fontWeight: 700, fontSize: 11,
                  }} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full">
                    <Search size={10} />
                    {pendukung.t === "Investigative" ? "Investigasi" : pendukung.t}
                  </span>
                  <button onClick={() => go("parent-detail")} style={{ fontFamily: IPS, fontSize: 10.5, color: T, fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: "auto" }}>
                    Lihat profil &gt;
                  </button>
                </div>
              )}
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
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <div className="flex items-center gap-2.5">
                    <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg, #FFE8E0 0%, #FFD5C8 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={16} style={{ color: "#C4695A" }} strokeWidth={2.2} />
                    </div>
                    <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>Laporan Terbaru dari Guru</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontFamily: DMM, fontSize: 10, color: MUTED }}>{latestLaporan.dikirimPada}</span>
                    <ChevronRight size={14} style={{ color: MUTED }} />
                  </div>
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

                <div className="flex items-center justify-between" style={{ paddingTop: 12, marginTop: 12, borderTop: `1px solid ${BDR}` }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #D4E8DA 0%, #B8D8C0 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={11} style={{ color: "#3D6B4F" }} />
                    </div>
                    <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>{child.teacher}, Guru Pendamping</p>
                  </div>
                  <ChevronRight size={15} style={{ color: MUTED, flexShrink: 0 }} />
                </div>
              </div>
            )}

            {/* ── Dua kartu info side-by-side ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Agenda Terdekat */}
              <button onClick={() => go("parent-calendar")}
                style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 18, padding: "14px 12px", textAlign: "left", cursor: "pointer", width: "100%", boxShadow: "0 1px 6px rgba(91,122,104,0.04)" }}
                className="flex flex-col gap-1.5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg, #D4E8DA 0%, #B8D8C0 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CalendarDays size={11} style={{ color: "#3D6B4F" }} />
                    </div>
                    <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: 0 }}>Agenda Terdekat</p>
                  </div>
                  <ChevronRight size={13} style={{ color: MUTED }} />
                </div>
                {upcoming.length > 0 ? (
                  <>
                    <p style={{ fontFamily: PJS, fontSize: 11, color: TEXT, margin: "6px 0 0", fontWeight: 700, lineHeight: 1.3 }}>
                      {upcoming[0].title.length > 24 ? upcoming[0].title.slice(0, 24) + "…" : upcoming[0].title}
                    </p>
                    <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
                      <Clock size={10} style={{ color: "#8BA892" }} />
                      <p style={{ fontFamily: DMM, fontSize: 9.5, color: "#8BA892", margin: 0 }}>
                        {new Date(upcoming[0].date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })} · {upcoming[0].jam.split("–")[0].trim()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={10} style={{ color: "#8BA892" }} />
                      <p style={{ fontFamily: IPS, fontSize: 9.5, color: "#8BA892", margin: 0 }}>
                        {upcoming[0].lokasi.length > 20 ? upcoming[0].lokasi.slice(0, 20) + "…" : upcoming[0].lokasi}
                      </p>
                    </div>
                    {hariMenuju > 0 && (
                      <span style={{ fontFamily: PJS, fontSize: 9.5, fontWeight: 700, color: "#15803D", background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)", border: "1px solid #BBF7D0", borderRadius: 8, padding: "3px 8px", display: "inline-flex", alignItems: "center", width: "fit-content", marginTop: 4 }}>
                        {hariMenuju} hari lagi
                      </span>
                    )}
                  </>
                ) : (
                  <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: "6px 0 0" }}>Belum ada agenda</p>
                )}
                <p style={{ fontFamily: PJS, fontSize: 10.5, color: T, margin: "6px 0 0", fontWeight: 700 }}>Lihat Kalender →</p>
              </button>

              {/* Rekomendasi Pelatihan */}
              <button onClick={() => go("parent-training")}
                style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 18, padding: "14px 12px", textAlign: "left", cursor: "pointer", width: "100%", boxShadow: "0 1px 6px rgba(91,122,104,0.04)" }}
                className="flex flex-col gap-1.5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={11} style={{ color: "#7C3AED" }} />
                    </div>
                    <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: 0 }}>Rekomendasi Pelatihan</p>
                  </div>
                  <ChevronRight size={13} style={{ color: MUTED }} />
                </div>
                <p style={{ fontFamily: PJS, fontSize: 11, color: TEXT, margin: "6px 0 0", fontWeight: 700, lineHeight: 1.3 }}>
                  Kelas Seni Visual
                </p>
                <p style={{ fontFamily: IPS, fontSize: 9.5, color: "#8BA892", margin: 0 }}>
                  Sesuai minat {nama}
                </p>
                <div className="flex items-center gap-1.5" style={{ marginTop: 4 }}>
                  <span style={{ fontFamily: PJS, fontSize: 9.5, fontWeight: 700, color: "#0369A1", background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)", border: "1px solid #BAE6FD", borderRadius: 8, padding: "3px 8px", display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    Online
                  </span>
                </div>
                <p style={{ fontFamily: IPS, fontSize: 9.5, color: "#8BA892", margin: "4px 0 0", lineHeight: 1.3 }}>
                  Untuk kemandirian & kreativitas
                </p>
                <p style={{ fontFamily: PJS, fontSize: 10.5, color: T, margin: "6px 0 0", fontWeight: 700 }}>Lihat →</p>
              </button>
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
            <button onClick={()=>go("parent-training")} style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Pengaturan">
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
            <button onClick={()=>go("parent-calendar")} style={{width:32,height:32,background:BG,borderRadius:8,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Kalender">
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
              <button onClick={()=>go("parent-training")} style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Pengaturan">
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
            <button onClick={()=>go("parent-training")} style={{width:36,height:36,background:BG,borderRadius:10,border:`1px solid ${BDR}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} className="active:scale-95 transition-transform" title="Pengaturan">
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
              <PerkembanganKemandirian riwayat={seedRiwayatAsesmen[child.id] ?? []} />
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

function PerkembanganKemandirian({ riwayat }: { riwayat: AsesmenPeriode[] }) {
  if (riwayat.length < 2) {
    return (
      <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
        <p className="font-bold text-sm mb-1" style={{fontFamily:PJS,color:TEXT}}>Perkembangan Kemandirian</p>
        <p className="text-xs" style={{color:MUTED}}>Ini asesmen pertama. Perbandingan akan muncul mulai periode berikutnya.</p>
      </div>
    );
  }

  const sebelum = riwayat[riwayat.length - 2].skorFungsional;
  const sekarang = riwayat[riwayat.length - 1].skorFungsional;

  const deltas = FUNGSIONAL_KATEGORI
    .map(domain => ({
      domain,
      delta: (sekarang[domain] ?? 0) - (sebelum[domain] ?? 0),
      tersedia: sekarang[domain] !== null && sebelum[domain] !== null,
    }))
    .filter(d => d.tersedia);

  // Aturan: selisih <10 poin = "relatif stabil", bukan naik/turun
  const berkembang = deltas.filter(d => d.delta >= 10).sort((a,b)=>b.delta-a.delta);
  const stabil = deltas.filter(d => Math.abs(d.delta) < 10);

  return (
    <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
      <p className="font-bold text-sm mb-3" style={{fontFamily:PJS,color:TEXT}}>Perkembangan Kemandirian</p>
      
      {berkembang.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold mb-1.5" style={{color:"#2E7A5C"}}>Yang berkembang sejak periode lalu</p>
          {berkembang.map(d => (
            <div key={d.domain} className="flex justify-between text-sm py-1">
              <span style={{color:TEXT}}>↑ {d.domain}</span>
              <span className="font-semibold" style={{color:"#2E7A5C"}}>+{d.delta} poin</span>
            </div>
          ))}
        </div>
      )}

      {stabil.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{color:MUTED}}>Yang masih perlu dipantau</p>
          {stabil.map(d => (
            <div key={d.domain} className="flex justify-between text-sm py-1">
              <span style={{color:TEXT}}>→ {d.domain}</span>
              <span style={{color:MUTED}}>relatif stabil</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}