import { useState } from "react";
import {
  Bell, Users, MessageSquare, Sparkles, Lock, Info, Heart, Star,
  Key, Hash, XCircle, ChevronRight, ChevronLeft, MapPin, Phone,
  Clock, Wallet, CalendarDays, CheckCircle, Search, FileText, ChevronDown, X,
  Palette, Target, BookOpen, Settings,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, TBar,
} from "./ui-kit";
import {
  progressData, AGENDA, KIND_META, LAYANAN, type Screen, type Student,
  type LaporanKirim,
  type AgendaEvent, type EventKind,
} from "./data";

// â”€â”€â”€ Modal: masukkan kode akses dari dalam aplikasi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ BERANDA ORANG TUA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  const upcoming = AGENDA.filter(e => e.kind !== "sekolah" || !!child).slice(0, 1);
  const latestLaporan = laporan.length > 0 ? laporan[laporan.length - 1] : null;
  const ibuName = namaOrtu.split(" ")[0];

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* â”€â”€ Header â”€â”€ */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: MUTED, margin: 0, fontWeight: 500 }}>
              Selamat pagi, {ibuName} ðŸ‘‹
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

        {/* â”€â”€ Belum terhubung â”€â”€ */}
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

        {/* â”€â”€ Sudah terhubung â”€â”€ */}
        {child && (
          <>
            {/* â”€â”€ Kartu Profil Anak â”€â”€ */}
            <div style={{ background: CARD, borderRadius: 20, padding: "18px 16px 16px", border: `1px solid ${BDR}`, boxShadow: "0 1px 8px rgba(91,122,104,0.05)" }}>
              {/* Profile row */}
              <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                <ChildAvatar name={child.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>{child.name}</p>
                  <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "3px 0 0", lineHeight: 1.3 }}>
                    Kelas {child.kelas} Â· SLB Negeri 1
                  </p>
                </div>
              </div>

              {/* Three info boxes */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {/* Potensi Utama */}
                <div style={{ background: BG, borderRadius: 14, padding: "10px 8px", border: `1px solid ${BDR}` }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px" }}>
                    <Palette size={14} style={{ color: DEEP }} />
                  </div>
                  <p style={{ fontFamily: IPS, fontSize: 9, color: MUTED, margin: 0, textAlign: "center", fontWeight: 500, lineHeight: 1.2 }}>Potensi Utama</p>
                  <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: "2px 0 0", textAlign: "center", lineHeight: 1.2 }}>
                    {child.talent || "â€”"}
                  </p>
                </div>

                {/* Fokus Minggu Ini */}
                <div style={{ background: BG, borderRadius: 14, padding: "10px 8px", border: `1px solid ${BDR}` }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EDE7F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px" }}>
                    <BookOpen size={14} style={{ color: "#7C3AED" }} />
                  </div>
                  <p style={{ fontFamily: IPS, fontSize: 9, color: MUTED, margin: 0, textAlign: "center", fontWeight: 500, lineHeight: 1.2 }}>Fokus Minggu Ini</p>
                  <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: "2px 0 0", textAlign: "center", lineHeight: 1.2 }}>
                    {child.talent ? `Latihan ${child.talent.split(" ")[0]}` : "â€”"}
                  </p>
                </div>

                {/* Target Terdekat */}
                <div style={{ background: BG, borderRadius: 14, padding: "10px 8px", border: `1px solid ${BDR}` }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px" }}>
                    <Target size={14} style={{ color: "#0369A1" }} />
                  </div>
                  <p style={{ fontFamily: IPS, fontSize: 9, color: MUTED, margin: 0, textAlign: "center", fontWeight: 500, lineHeight: 1.2 }}>Target Terdekat</p>
                  <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: "2px 0 0", textAlign: "center", lineHeight: 1.2 }}>
                    {child.comps[0] ? child.comps[0].replace("-PDBK", "") : "â€”"}
                  </p>
                  {child.comps[0] && <p style={{ fontFamily: IPS, fontSize: 8, color: MUTED, margin: "1px 0 0", textAlign: "center" }}>Lomba</p>}
                </div>
              </div>
            </div>

            {/* â”€â”€ CTA Button â”€â”€ */}
            <button onClick={() => go("parent-detail")}
              style={{ background: A, color: "#fff", fontFamily: IPS, minHeight: 50, width: "100%", border: "none", cursor: "pointer" }}
              className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              Cek Perkembangan {child.name.split(" ")[0]} <ChevronRight size={16} />
            </button>

            {/* â”€â”€ Laporan Terbaru dari Guru â”€â”€ */}
            {latestLaporan && (
              <div style={{ background: CARD, borderRadius: 20, padding: "16px", border: `1px solid ${BDR}`, boxShadow: "0 1px 8px rgba(91,122,104,0.05)" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: A, lineHeight: 1 }}>â</span>
                    </div>
                    <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: TEXT, margin: 0 }}>Laporan Terbaru dari Guru</p>
                  </div>
                  <span style={{ fontFamily: DMM, fontSize: 10, color: MUTED, flexShrink: 0 }}>{latestLaporan.dikirimPada}</span>
                </div>
                <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, margin: "0 0 4px", lineHeight: 1.3 }}>
                  {latestLaporan.judul}
                </p>
                <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, lineHeight: 1.5, margin: "0 0 10px" }}>
                  {latestLaporan.isi.length > 100 ? latestLaporan.isi.slice(0, 100) + "â€¦" : latestLaporan.isi}
                </p>
                <div className="flex items-center justify-between" style={{ paddingTop: 10, borderTop: `1px solid ${BDR}` }}>
                  <div className="flex items-center gap-1.5">
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: SEC, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={10} style={{ color: DEEP }} />
                    </div>
                    <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>{child.teacher}, Guru Pendamping</p>
                  </div>
                  <ChevronRight size={14} style={{ color: MUTED, flexShrink: 0 }} />
                </div>
              </div>
            )}

            {/* â”€â”€ Dua kartu info side-by-side â”€â”€ */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Agenda Terdekat */}
              <button onClick={() => go("parent-calendar")}
                style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: "14px 12px", textAlign: "left", cursor: "pointer", width: "100%", boxShadow: "0 1px 6px rgba(91,122,104,0.04)" }}
                className="flex flex-col gap-2 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={13} style={{ color: DEEP }} />
                  <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: 0 }}>Agenda Terdekat</p>
                </div>
                {upcoming.length > 0 ? (
                  <>
                    <p style={{ fontFamily: IPS, fontSize: 10.5, color: TEXT, margin: 0, fontWeight: 600, lineHeight: 1.3 }}>
                      {upcoming[0].title.length > 24 ? upcoming[0].title.slice(0, 24) + "â€¦" : upcoming[0].title}
                    </p>
                    <p style={{ fontFamily: DMM, fontSize: 9.5, color: MUTED, margin: 0 }}>
                      {new Date(upcoming[0].date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })} Â· {upcoming[0].jam.split("â€“")[0].trim()}
                    </p>
                  </>
                ) : (
                  <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: 0 }}>Belum ada agenda</p>
                )}
                <p style={{ fontFamily: IPS, fontSize: 10.5, color: T, margin: "4px 0 0", fontWeight: 700 }}>Lihat Kalender â†’</p>
              </button>

              {/* Rekomendasi Pelatihan */}
              <button onClick={() => go("parent-training")}
                style={{ background: CARD, border: `1px solid ${BDR}`, borderRadius: 16, padding: "14px 12px", textAlign: "left", cursor: "pointer", width: "100%", boxShadow: "0 1px 6px rgba(91,122,104,0.04)" }}
                className="flex flex-col gap-2 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} style={{ color: "#7C3AED" }} />
                  <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: 0 }}>Rekomendasi Pelatihan</p>
                </div>
                <p style={{ fontFamily: IPS, fontSize: 10.5, color: TEXT, margin: 0, fontWeight: 600, lineHeight: 1.3 }}>
                  Kelas Seni Visual
                </p>
                <p style={{ fontFamily: IPS, fontSize: 9.5, color: MUTED, margin: 0 }}>
                  Sesuai minat {child.name.split(" ")[0]}
                </p>
                <p style={{ fontFamily: IPS, fontSize: 10.5, color: T, margin: "4px 0 0", fontWeight: 700 }}>Lihat â†’</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// â”€â”€â”€ KALENDER EVENT & LOMBA ABK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const HARI = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export function ParentCalendarScreen({linked,sekolah,onOpenCode}:{
  linked:boolean; sekolah?:string; onOpenCode:()=>void;
}) {
  const today = new Date("2026-08-05T00:00:00");
  const [cursor,setCursor] = useState({y:today.getFullYear(), m:today.getMonth()});
  const [selected,setSelected] = useState<string|null>(null);
  const [filter,setFilter] = useState<EventKind|"semua">("semua");

  // Kalender hanya memuat kegiatan umum/terbuka. Agenda internal sekolah
  // baru ikut tampil setelah orang tua memasukkan kode akses dari guru.
  const visible = AGENDA.filter(e=>e.kind!=="sekolah"||linked);
  const hiddenSekolah = AGENDA.filter(e=>e.kind==="sekolah").length;
  const list = visible.filter(e=>filter==="semua"||e.kind===filter);

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
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <div style={{background:CARD}} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Kalender Kegiatan</p>
        <p className="text-xs" style={{color:MUTED}}>Kegiatan umum & terbuka untuk anak ABK{linked?" + agenda sekolah":""}</p>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Penjelasan cakupan kalender */}
        <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5">
          <Info size={14} style={{color:T,flexShrink:0,marginTop:1}}/>
          <p className="text-xs leading-relaxed" style={{color:T}}>
            Kalender hanya memuat <strong>kegiatan yang berlaku untuk umum</strong> â€” lomba resmi, pelatihan terbuka, dan layanan gratis. Jadwal terapi pribadi tidak ditampilkan karena berbeda untuk setiap anak dan diatur langsung dengan penyedia.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {([["semua","Semua","ðŸ“‹"],...Object.entries(KIND_META).map(([k,v])=>[k,v.label,v.icon])] as [string,string,string][]).map(([k,l,ic])=>{
            const on = filter===k;
            const locked = k==="sekolah" && !linked;
            return (
              <button key={k} onClick={()=>locked?onOpenCode():setFilter(k as any)}
                style={{
                  background:on?T:locked?BG:CARD,
                  color:on?"#fff":locked?"#A3B0A7":MUTED,
                  border:on?"none":`1px solid ${locked?"rgba(91,122,104,0.12)":BDR}`,
                  fontFamily:IPS,minHeight:38,flexShrink:0,
                }}
                className="px-3.5 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                {locked ? <Lock size={10}/> : <span>{ic}</span>}{l}
              </button>
            );
          })}
        </div>

        {/* Filter sekolah terkunci */}
        {!linked && (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`}} className="rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div style={{width:40,height:40,background:BG,flexShrink:0}} className="rounded-xl flex items-center justify-center">
                <Lock size={17} style={{color:MUTED}}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Agenda Sekolah Terkunci</p>
                <p className="text-xs leading-relaxed mt-0.5" style={{color:MUTED}}>
                  {hiddenSekolah} agenda internal sekolah (rapat wali murid, pembagian rapor, pentas karya) hanya bisa dilihat orang tua yang sudah terhubung dengan guru pendamping.
                </p>
              </div>
            </div>
            <button onClick={onOpenCode}
              style={{width:"100%",background:A,color:"#fff",fontFamily:IPS,minHeight:46,marginTop:12}}
              className="rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
              <Hash size={13}/>Masukkan Kode Akses untuk Membuka
            </button>
          </div>
        )}

        {/* Sudah terhubung */}
        {linked && sekolah && (
          <div style={{background:"#F0FDF4",border:`1px solid #15803D22`}} className="rounded-2xl px-4 py-3 flex items-center gap-2.5">
            <CheckCircle size={14} style={{color:"#15803D",flexShrink:0}}/>
            <p className="text-xs leading-relaxed" style={{color:"#15803D"}}>
              Filter <strong>Agenda Sekolah</strong> aktif â€” Anda menerima agenda dari <strong>{sekolah}</strong>.
            </p>
          </div>
        )}

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
            <span className="font-normal" style={{color:MUTED}}> Â· {monthEvents.length} kegiatan</span>
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
          {e.sekolah && (
            <div style={{background:meta.bg}} className="rounded-xl px-3 py-2.5 flex items-start gap-2">
              <Lock size={12} style={{color:meta.color,flexShrink:0,marginTop:2}}/>
              <p className="text-xs leading-relaxed" style={{color:meta.color}}><strong>Agenda internal {e.sekolah}</strong> â€” hanya terlihat oleh orang tua yang terhubung.</p>
            </div>
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

// â”€â”€â”€ PELATIHAN & TERAPI TERDEKAT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      <div style={{background:CARD}} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Pelatihan & Terapi</p>
        <p className="text-xs" style={{color:MUTED}}>Informasi umum layanan di sekitar Bandung</p>
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
              className="text-xs font-bold">{t.l} Â· {t.n}</button>
          ))}
        </div>

        {tab==="terbuka" ? (
          <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5">
            <Sparkles size={14} style={{color:T,flexShrink:0,marginTop:1}}/>
            <p className="text-xs leading-relaxed" style={{color:T}}>
              Program yang <strong>terbuka untuk siapa saja</strong> dengan jadwal pasti â€” terapi gratis, skrining, kelas terbuka. Jadwalnya sama untuk semua peserta, jadi ikut muncul di{" "}
              <button onClick={()=>go("parent-calendar")} className="font-bold underline" style={{color:T}}>Kalender</button>.
            </p>
          </div>
        ) : (
          <div style={{background:"#FEF9EC",border:`1px solid rgba(210,125,107,0.22)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5">
            <Info size={14} style={{color:A,flexShrink:0,marginTop:1}}/>
            <p className="text-xs leading-relaxed" style={{color:A}}>
              Terapi personal <strong>tidak dijadwalkan lewat aplikasi</strong> â€” jadwal setiap anak berbeda dan diatur langsung dengan penyedia. Di sini hanya ditampilkan info umum: lokasi, jam operasional, perkiraan biaya, dan kontak.
            </p>
          </div>
        )}

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
                  {l.jarak!=="â€”" && (
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

// â”€â”€â”€ DETAIL PERKEMBANGAN ANAK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function ParentDetailScreen({onBack,child,onOpenCode,laporan,onBaca}:{
  onBack:()=>void; child:Student|null; onOpenCode:()=>void;
  laporan:LaporanKirim[]; onBaca:(id:number)=>void;
}) {
  if (!child) {
    return (
      <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
        <TBar title="Perkembangan Anak" onBack={onBack}/>
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
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <TBar title="Detail Perkembangan" sub={`${child.name} â€” Hanya baca`} onBack={onBack}/>
      <div className="px-4 pt-4 pb-6 space-y-3">
        <LaporanGuruSection laporan={laporan} onBaca={onBaca} namaAnak={nama}/>

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
            <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><Sparkles size={14} style={{color:A}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Hasil Talent Mapping</p></div>
                <Lock size={12} style={{color:MUTED}}/>
              </div>
              {[
                {t:child.talent,st:child.stars,r:`${nama} menunjukkan kekuatan konsisten pada ${child.talent.toLowerCase()}. Ini potensi utama yang perlu terus didukung di rumah.`},
                {t:"Cara Belajar Dominan",st:4,r:`${nama} paling mudah menyerap materi dengan pendekatan ${child.caraBelajar.toLowerCase()}. Sesuaikan cara mendampingi belajar di rumah.`},
              ].map(x=>(
                <div key={x.t} className="mb-3 last:mb-0 pb-3 last:pb-0" style={{borderBottom:`1px solid ${BDR}`}}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-semibold text-sm" style={{color:TEXT}}>{x.t}</p>
                    <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={12} style={{color:i<x.st?A:"#E5E7EB",fill:i<x.st?A:"#E5E7EB"}}/>)}</div>
                  </div>
                  <div style={{background:SEC}} className="rounded-xl px-3 py-2 flex items-start gap-1.5">
                    <Info size={11} style={{color:T,flexShrink:0,marginTop:2}}/><p className="text-xs leading-relaxed" style={{color:TEXT}}>{x.r}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Progress per Semester</p>
                <Lock size={12} style={{color:MUTED}}/>
              </div>
              <div style={{height:160}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData} margin={{top:4,right:4,left:-24,bottom:0}}>
                    <CartesianGrid key="cg" strokeDasharray="3 3" stroke="#EDE9E3"/>
                    <XAxis key="xa" dataKey="sem" tick={{fontSize:10,fill:MUTED,fontFamily:DMM}}/>
                    <YAxis key="ya" tick={{fontSize:10,fill:MUTED,fontFamily:DMM}} domain={[0,100]}/>
                    <Tooltip key="tt" contentStyle={{borderRadius:12,border:"none",fontSize:12,fontFamily:IPS}}/>
                    <Line key="l1" type="monotone" dataKey="seni" stroke={T} strokeWidth={2.5} dot={{r:3}} name="Bakat Utama"/>
                    <Line key="l2" type="monotone" dataKey="komunikasi" stroke={A} strokeWidth={2.5} dot={{r:3}} name="Komunikasi"/>
                    <Line key="l3" type="monotone" dataKey="motorik" stroke="#7C3AED" strokeWidth={2.5} dot={{r:3}} name="Motorik"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-3 mt-2">
                {[{l:"Bakat Utama",c:T},{l:"Komunikasi",c:A},{l:"Motorik",c:"#7C3AED"}].map(x=>(
                  <div key={x.l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{background:x.c}}/><span className="text-xs" style={{color:MUTED}}>{x.l}</span></div>
                ))}
              </div>
            </div>

            <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Program Pengembangan Aktif</p>
                <Lock size={12} style={{color:MUTED}}/>
              </div>
              <div style={{background:SEC}} className="rounded-xl px-3 py-2.5 mb-3">
                <p className="text-xs font-bold" style={{color:T}}>Target Semester Ganjil 2026</p>
                <p className="font-bold text-sm mt-0.5" style={{color:TEXT}}>Mengembangkan {child.talent}</p>
              </div>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{color:MUTED}}>Progress</span>
                <span className="font-bold" style={{color:T,fontFamily:DMM}}>{child.talentScore}%</span>
              </div>
              <div className="h-2 rounded-full" style={{background:"#EDE9E3"}}>
                <div className="h-full rounded-full" style={{width:`${child.talentScore}%`,background:T}}/>
              </div>
            </div>
          </>
        )}

        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Heart size={13} style={{color:A}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Saran Guru untuk di Rumah</p></div>
            <Lock size={12} style={{color:MUTED}}/>
          </div>
          {[
            {i:"ðŸŽ¨",t:`Beri ${nama} waktu berlatih bebas minimal 20 menit setiap hari.`},
            {i:"ðŸ§°",t:"Siapkan alat sederhana yang mudah dijangkau anak."},
            {i:"ðŸ‘",t:"Apresiasi setiap usaha, bukan hanya hasil akhirnya."},
            {i:"ðŸ•’",t:`Jaga rutinitas yang sama setiap hari â€” ${nama} lebih tenang dengan jadwal yang dapat ditebak.`},
          ].map(s=>(
            <div key={s.t} className="flex items-start gap-2.5 py-2.5" style={{borderBottom:`1px solid ${BDR}`}}>
              <span className="text-lg flex-shrink-0">{s.i}</span>
              <p className="text-sm leading-relaxed" style={{color:TEXT}}>{s.t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* â”€â”€ Laporan dari guru (hanya baca, tidak bisa dibalas) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function LaporanGuruSection({laporan,onBaca,namaAnak}:{
  laporan:LaporanKirim[]; onBaca:(id:number)=>void; namaAnak:string;
}) {
  const [buka,setBuka] = useState<number|null>(null);
  const urut = laporan.slice().reverse();
  const belum = urut.filter(l=>!l.dibaca).length;

  const bukaLaporan = (id:number) => {
    setBuka(b=>b===id?null:id);
    onBaca(id);
  };

  return (
    <div style={{background:CARD,border:`1.5px solid ${belum?A:BDR}`}} className="rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <FileText size={15} style={{color:T}}/>
        <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Laporan dari Guru</p>
        {belum>0 && (
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{background:A,color:"#fff"}}>
            {belum} baru
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{color:MUTED}}>
        Guru mengirim laporan perkembangan {namaAnak} dari waktu ke waktu. Laporan bersifat satu arah â€” silakan hubungi guru langsung bila ingin berdiskusi.
      </p>

      {urut.length===0 ? (
        <div style={{background:BG,border:`1px dashed ${BDR}`}} className="rounded-xl px-3 py-5 text-center">
          <p className="text-xs" style={{color:MUTED}}>Belum ada laporan yang dikirim guru.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {urut.map(l=>{
            const terbuka = buka===l.id;
            return (
              <div key={l.id} style={{background:l.dibaca?BG:"#FEF9EC",border:`1px solid ${l.dibaca?BDR:"rgba(210,125,107,0.28)"}`}} className="rounded-xl overflow-hidden">
                <button onClick={()=>bukaLaporan(l.id)}
                  style={{width:"100%",textAlign:"left",minHeight:56,background:"transparent"}}
                  className="px-3 py-2.5 flex items-center gap-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{color:TEXT}}>{l.judul}</p>
                    <p className="text-xs" style={{color:MUTED,fontFamily:DMM}}>{l.dikirimPada}</p>
                  </div>
                  {!l.dibaca && <span style={{width:8,height:8,borderRadius:"50%",background:A,flexShrink:0}}/>}
                  <ChevronDown size={15} style={{color:MUTED,flexShrink:0,transform:terbuka?"rotate(180deg)":"none",transition:"transform .2s"}}/>
                </button>
                {terbuka && (
                  <div className="px-3 pb-3">
                    <p className="text-sm leading-relaxed" style={{color:TEXT}}>{l.isi}</p>
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2.5" style={{borderTop:`1px solid ${BDR}`}}>
                      <CheckCircle size={11} style={{color:"#15803D"}}/>
                      <p className="text-xs" style={{color:"#15803D"}}>
                        Ditandai sudah dibaca â€” guru akan melihat status ini.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}