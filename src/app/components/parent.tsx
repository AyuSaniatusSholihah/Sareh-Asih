import { useState, useEffect, useRef } from "react";
import {
  Bell, Users, MessageSquare, Sparkles, Lock, Info, Heart, Star,
  Key, Hash, XCircle, ChevronRight, ChevronLeft, MapPin, Phone,
  Clock, Wallet, CalendarDays, CheckCircle, Search, FileText, ChevronDown, X,
  Palette, Target, BookOpen, Settings, TrendingUp, Lightbulb, Laptop, Plus,
  BarChart3, ClipboardList, MessageCircle, Send, Paperclip, AtSign, MoreVertical,
  ShieldCheck, Check, CheckCheck, Globe, ExternalLink, LocateFixed, Loader,
  ArrowRight, History, ThumbsUp, Smile, Edit3, RotateCcw,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, TBar, useUI,
} from "./ui-kit";
import {
  AGENDA, KIND_META, LAYANAN, studentTalentDetail, RIASEC_META, FUNGSIONAL_KATEGORI,
  FUNGSIONAL_META, SKALA_FUNGSIONAL, KAPTION_ASPEK, WARNA_LEVEL, WARNA_LEVEL_TEKS,
  PROFIL_FUNGSIONAL, SARAN_RUMAH, seedPerkembangan, PERIODE_LIST,
  fotoSiswa, type PeriodePerkembangan, type FungsionalKategori, type RiasecKategori,
  type Screen, type Student, type LaporanKirim, type Layanan,
  type AgendaEvent, type EventKind,
} from "./data";
import { ProfilFungsionalRadar, ProfilKecenderunganBar, getMockJawaban, kodeTigaHuruf, skorKetekunan } from "./shared-charts";

// ─── Modal: masukkan kode akses dari dalam aplikasi ───────────────────
export function LinkCodeModal({onClose,onLinked,students,linkedIds=[]}:{onClose:()=>void;onLinked:(s:Student)=>void;students:Student[];linkedIds?:number[]}) {
  const [kode, setKode] = useState("");
  const [err,  setErr]  = useState("");
  const [sukses, setSukses] = useState<Student | null>(null);

  const submit = () => {
    if (!kode.trim()) { setErr("Masukkan kode akses terlebih dahulu"); return; }
    const k = kode.trim().toUpperCase();
    const found = students.find(s=>s.kodeOrtu?.toUpperCase()===k);
    if (!found) { setErr("Kode tidak dikenali. Pastikan kode sesuai yang diberikan guru pendamping."); return; }
    if (linkedIds.includes(found.id)) { setErr(`${found.name.split(" ")[0]} sudah ditambahkan ke akun Anda.`); return; }
    setSukses(found);
  };

  // ── Tampilan setelah berhasil: "Rafi berhasil ditambahkan!" ──
  if (sukses) {
    const nama = sukses.name.split(" ")[0];
    return (
      <div style={{position:"absolute",inset:0,zIndex:70,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={onClose}>
        <div style={{position:"absolute",inset:0,background:"rgba(46,62,53,0.5)"}}/>
        <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:CARD,borderRadius:"26px 26px 0 0",padding:"14px 20px 28px",textAlign:"center"}}>
          <div className="flex justify-center mb-4"><div style={{width:36,height:4,borderRadius:2,background:"#D1D5DB"}}/></div>
          <div className="flex flex-col items-center">
            <div style={{width:64,height:64,background:SEC,borderRadius:"50%"}} className="flex items-center justify-center mb-3">
              <CheckCircle size={30} style={{color:T}}/>
            </div>
            <p className="font-bold" style={{fontFamily:PJS,fontSize:18,color:TEXT,margin:"0 0 6px"}}>{nama} berhasil ditambahkan!</p>
            <p className="text-xs leading-relaxed" style={{color:MUTED,fontFamily:IPS,margin:"0 0 18px"}}>
              Anda dapat melihat perkembangan {nama} dari Beranda, dan menambahkan anak lain kapan saja.
            </p>
            <button onClick={()=>onLinked(sukses)} style={{width:"100%",background:A,color:"#fff",fontFamily:IPS,minHeight:50}}
              className="rounded-2xl text-sm font-bold">Masuk ke Beranda</button>
            <button onClick={()=>{ setSukses(null); setKode(""); }}
              style={{width:"100%",color:T,fontFamily:IPS,minHeight:42,background:"transparent"}}
              className="text-xs font-semibold mt-1">Tambah anak lain</button>
          </div>
        </div>
      </div>
    );
  }

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
function ChildAvatar({ name, size = 52, border }: { name: string; size?: number; border?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(145deg, #FFE8D6 0%, #F5D5B8 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, position: "relative", overflow: "hidden",
      border: border !== undefined ? border : "2.5px solid #FFD6B8",
    }}>
      <svg viewBox="0 0 52 52" width={size} height={size} style={{ position: "absolute", inset: 0 }}>
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
function FotoAnak({ child, size = 52, border }: { child: Student; size?: number; border?: string }) {
  const [gagal, setGagal] = useState(false);
  const src = fotoSiswa(child);
  if (!src || gagal) return <ChildAvatar name={child.name} size={size} border={border} />;
  return (
    <img
      src={src}
      alt={`Foto profil ${child.name}`}
      onError={() => setGagal(true)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
        border: border !== undefined ? border : "2.5px solid #FFD6B8",
      }}
    />
  );
}

// Banner kutipan motivasi anak dengan karakter ramah dan ornamen dedaunan
function MotivationalKidBanner() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E6F3EA 0%, #D8EDE0 100%)",
        border: "1px solid rgba(91,122,104,0.18)",
        borderRadius: 22,
        padding: "14px 16px 14px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(91,122,104,0.06)",
      }}
    >
      {/* Bagian kiri: Ornamen daun & Teks Motivasi */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 9, flex: 1, minWidth: 0 }}>
        {/* Ornamen tangkai daun alami seperti di screenshot */}
        <svg width="28" height="52" viewBox="0 0 28 52" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
          {/* Ranting atas */}
          <path d="M12 2 C13 8, 12 16, 15 22" stroke="#689377" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 5 C7 4, 3 8, 6 12 C9 14, 13 8, 12 5 Z" fill="#6B9679" />
          <path d="M13 12 C18 10, 23 13, 20 18 C17 20, 14 16, 13 12 Z" fill="#6B9679" />
          <path d="M8 18 C3 18, 2 24, 6 26 C10 27, 11 21, 8 18 Z" fill="#8BB298" />

          {/* Ranting bawah */}
          <path d="M13 28 C14 34, 13 42, 16 50" stroke="#689377" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M13 32 C8 30, 4 34, 7 38 C10 40, 14 34, 13 32 Z" fill="#6B9679" />
          <path d="M14 40 C19 38, 24 41, 21 46 C18 48, 15 44, 14 40 Z" fill="#6B9679" />
          <path d="M9 44 C4 44, 3 49, 7 51 C11 52, 12 47, 9 44 Z" fill="#8BB298" />
        </svg>

        <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
          <p style={{ fontFamily: IPS, fontSize: 12.5, color: "#3A5645", margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
            Setiap anak punya cara
          </p>
          <p style={{ fontFamily: PJS, fontSize: 13.5, color: "#1E3A2B", margin: "1px 0 0", lineHeight: 1.35, fontWeight: 800 }}>
            unik untuk berkembang.
          </p>
          <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#547862", margin: "4px 0 0", lineHeight: 1.35 }}>
            Mari terus dukung langkah kecilnya.
          </p>
        </div>
      </div>

      {/* Bagian kanan: Ilustrasi anak dengan tas ransel (gaya Rafi di gambar) */}
      <div style={{ flexShrink: 0, width: 84, height: 90, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <svg viewBox="0 0 96 104" width="84" height="90" fill="none">
          {/* Tas ransel di belakang punggung */}
          <rect x="18" y="38" width="60" height="60" rx="18" fill="#D97706" />
          <rect x="22" y="42" width="52" height="54" rx="15" fill="#EA580C" />
          <path d="M38 38 V30 C38 26, 58 26, 58 30 V38" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Leher */}
          <rect x="41" y="44" width="14" height="12" rx="3" fill="#FCD9BD" />

          {/* Badan / Baju Kaos Biru Muda */}
          <path d="M24 62 C24 53, 34 50, 48 50 C62 50, 72 53, 72 62 L75 104 H21 Z" fill="#93C5FD" />
          <path d="M37 50 C41 55, 55 55, 59 50" stroke="#3B82F6" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Tali Ransel di Pundak */}
          <path d="M29 50 L31 104" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
          <path d="M29 50 L31 104" stroke="#EA580C" strokeWidth="4.2" strokeLinecap="round" />
          <rect x="27" y="74" width="6.5" height="5" rx="1.5" fill="#FED7AA" />

          <path d="M67 50 L65 104" stroke="#B45309" strokeWidth="6" strokeLinecap="round" />
          <path d="M67 50 L65 104" stroke="#EA580C" strokeWidth="4.2" strokeLinecap="round" />
          <rect x="62.5" y="74" width="6.5" height="5" rx="1.5" fill="#FED7AA" />

          {/* Telinga */}
          <circle cx="26" cy="32" r="4.2" fill="#FCD9BD" />
          <circle cx="26" cy="32" r="2.2" fill="#F8B493" opacity="0.6" />
          <circle cx="70" cy="32" r="4.2" fill="#FCD9BD" />
          <circle cx="70" cy="32" r="2.2" fill="#F8B493" opacity="0.6" />

          {/* Kepala */}
          <ellipse cx="48" cy="31" rx="22" ry="21" fill="#FCD9BD" />

          {/* Rambut hitam rapi */}
          <path d="M26 28 C26 12, 38 6, 48 6 C58 6, 70 12, 70 28 C70 33, 68 36, 68 36 C68 36, 66 22, 60 17 C54 13, 40 13, 34 17 C28 22, 27 36, 27 36 Z" fill="#2E2824" />
          <path d="M30 16 C35 11, 44 9, 53 11 C60 13, 65 18, 67 24 C63 20, 58 19, 53 21 C48 23, 43 26, 38 24 C34 22, 31 19, 30 16 Z" fill="#3D342E" />
          <path d="M26 25 C28 20, 33 17, 38 20 C34 22, 30 26, 28 30 Z" fill="#2E2824" />

          {/* Mata berbinar */}
          <ellipse cx="39" cy="31" rx="2.3" ry="3.1" fill="#1E293B" />
          <circle cx="40" cy="30" r="0.9" fill="#FFFFFF" />
          <ellipse cx="57" cy="31" rx="2.3" ry="3.1" fill="#1E293B" />
          <circle cx="58" cy="30" r="0.9" fill="#FFFFFF" />

          {/* Alis */}
          <path d="M36 25 Q39 23 42 25" stroke="#3D342E" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M54 25 Q57 23 60 25" stroke="#3D342E" strokeWidth="1.3" strokeLinecap="round" fill="none" />

          {/* Pipi merona */}
          <ellipse cx="34" cy="35" rx="3.5" ry="2.2" fill="#F87171" opacity="0.45" />
          <ellipse cx="62" cy="35" rx="3.5" ry="2.2" fill="#F87171" opacity="0.45" />

          {/* Hidung */}
          <circle cx="48" cy="33.5" r="1.2" fill="#E2A684" />

          {/* Senyum ramah */}
          <path d="M43 37 Q48 42 53 37" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
}

// ─── Sheet: pilih anak (satu akun orang tua bisa banyak anak) ─────────
function PilihAnakSheet({ daftar, activeId, onPilih, onTambah, onClose }: {
  daftar: Student[]; activeId: number | null;
  onPilih: (id: number) => void; onTambah: () => void; onClose: () => void;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 65, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.5)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: CARD, borderRadius: "26px 26px 0 0", padding: "14px 20px 28px" }}>
        <div className="flex items-center justify-center mb-3" style={{ position: "relative" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
          <button onClick={onClose}
            style={{ position: "absolute", right: 0, top: -4, width: 30, height: 30, borderRadius: "50%", background: "#F1F5F9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}
            className="active:scale-90 transition-transform" title="Tutup">
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <p className="font-bold" style={{ fontFamily: PJS, fontSize: 16, color: TEXT, margin: "0 0 10px" }}>Pilih anak</p>

        <div className="flex flex-col gap-1">
          {daftar.map(s => {
            const aktif = s.id === activeId;
            return (
              <button key={s.id} onClick={() => onPilih(s.id)}
                className="flex items-center gap-3 w-full"
                style={{
                  background: aktif ? SEC : "transparent",
                  border: `1.5px solid ${aktif ? T : "transparent"}`,
                  borderRadius: 16, padding: "10px 12px", cursor: "pointer", textAlign: "left",
                }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${aktif ? T : BDR}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {aktif && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T }} />}
                </span>
                <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{s.emoji}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, lineHeight: 1.25 }}>{s.name.split(" ")[0]}</span>
                  <span style={{ display: "block", fontFamily: IPS, fontSize: 11.5, color: MUTED, marginTop: 1 }}>Kelas {s.kelas}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: BDR, margin: "12px 0" }} />

        <button onClick={onTambah}
          className="flex items-center justify-center gap-2"
          style={{ width: "100%", background: BG, border: `1.5px solid ${T}`, borderRadius: 14, minHeight: 46, color: T, fontFamily: PJS, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
          <Plus size={16} /> Tambahkan anak
        </button>
      </div>
    </div>
  );
}

export function ParentDashboard({ go, child, anakList, onPilihAnak, namaOrtu, onOpenCode, laporan = [] }: {
  go: (s: Screen) => void; child: Student | null; anakList: Student[]; onPilihAnak: (id: number) => void;
  namaOrtu: string; onOpenCode: () => void;
  laporan: LaporanKirim[];
}) {
  const upcoming = AGENDA.slice(0, 1);
  const latestLaporan = laporan.length > 0 ? laporan[laporan.length - 1] : null;
  const ibuName = namaOrtu.split(" ")[0];
  const { openSettings } = useUI();
  const [pilihOpen, setPilihOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      {/* ── Header ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: PJS, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.15 }}>
              Beranda
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
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
            {/* ── Ringkasan Cepat & Pilihan Anak (Sesuai Desain Baru) ── */}
            {/* 1. Pill Pemilih Anak */}
            <button
              type="button"
              onClick={() => setPilihOpen(true)}
              style={{
                width: "100%",
                background: "#E8F4EC",
                border: "1.5px solid rgba(91,122,104,0.18)",
                borderRadius: 24,
                padding: "8px 16px 8px 10px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                textAlign: "left",
                boxShadow: "0 2px 8px rgba(91,122,104,0.06)",
              }}
              className="active:scale-[0.99] transition-transform"
              title="Ganti Anak"
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "#D7E9DE",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #FFFFFF",
                boxShadow: "0 2px 6px rgba(46,62,53,0.08)",
              }}>
                <FotoAnak child={child} size={44} border="none" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                  {nama}
                </p>
                <p style={{ fontFamily: IPS, fontSize: 12, color: "#5B7A68", margin: "2px 0 0", fontWeight: 500 }}>
                  Kelas {child.kelas}
                </p>
              </div>
              <ChevronDown size={20} style={{ color: "#2D5A43", flexShrink: 0 }} />
            </button>

            {/* 2. Sapaan Orang Tua */}
            <div style={{ margin: "2px 0 2px" }}>
              <h2 style={{ fontFamily: PJS, fontSize: 24, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
                Halo, {ibuName || "Ani"}! 👋
              </h2>
              <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, margin: "4px 0 0", fontWeight: 500 }}>
                Berikut ringkasan informasi {nama}.
              </p>
            </div>

            {/* 3. Grid 4 Kartu Menu Cepat (2x2) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Card 1: Laporan dari Guru */}
              <button
                type="button"
                onClick={() => go("riwayat-laporan")}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px 14px 14px",
                  border: "1.5px solid #E2E8F0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "left",
                  cursor: "pointer",
                  minHeight: 140,
                }}
                className="hover:shadow-md hover:border-blue-200 active:scale-[0.98] transition-all"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: "#EFF6FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <FileText size={19} style={{ color: "#2563EB" }} strokeWidth={2.2} />
                  </div>
                  <ChevronRight size={16} style={{ color: "#94A3B8" }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                    Laporan dari Guru
                  </p>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "4px 0 0", lineHeight: 1.4 }}>
                    Catatan perkembangan dan observasi terbaru.
                  </p>
                </div>
              </button>

              {/* Card 2: Peta Potensi Anak */}
              <button
                type="button"
                onClick={() => go("parent-detail")}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px 14px 14px",
                  border: "1.5px solid #FEF3C7",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "left",
                  cursor: "pointer",
                  minHeight: 140,
                }}
                className="hover:shadow-md hover:border-amber-300 active:scale-[0.98] transition-all"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: "#FFFBEB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Star size={19} style={{ color: "#D97706" }} strokeWidth={2.2} />
                  </div>
                  <ChevronRight size={16} style={{ color: "#94A3B8" }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                    Peta Potensi Anak
                  </p>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "4px 0 0", lineHeight: 1.4 }}>
                    Profil fungsional dan kecenderungan minat.
                  </p>
                </div>
              </button>

              {/* Card 3: Tren & Perkembangan */}
              <button
                type="button"
                onClick={() => go("riwayat-perkembangan")}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px 14px 14px",
                  border: "1.5px solid #E0F2FE",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "left",
                  cursor: "pointer",
                  minHeight: 140,
                }}
                className="hover:shadow-md hover:border-sky-300 active:scale-[0.98] transition-all"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: "#F0F9FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <BarChart3 size={19} style={{ color: "#0284C7" }} strokeWidth={2.2} />
                  </div>
                  <ChevronRight size={16} style={{ color: "#94A3B8" }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                    Tren & Perkembangan
                  </p>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "4px 0 0", lineHeight: 1.4 }}>
                    Perubahan kemampuan dari waktu ke waktu.
                  </p>
                </div>
              </button>

              {/* Card 4: Saran dari Guru */}
              <button
                type="button"
                onClick={() => go("saran-rumah")}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: "16px 14px 14px",
                  border: "1.5px solid #F3E8FF",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "left",
                  cursor: "pointer",
                  minHeight: 140,
                }}
                className="hover:shadow-md hover:border-purple-300 active:scale-[0.98] transition-all"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: "#FAF5FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Lightbulb size={19} style={{ color: "#7C3AED" }} strokeWidth={2.2} />
                  </div>
                  <ChevronRight size={16} style={{ color: "#94A3B8" }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.25 }}>
                    Saran dari Guru
                  </p>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "4px 0 0", lineHeight: 1.4 }}>
                    Rekomendasi kegiatan di rumah.
                  </p>
                </div>
              </button>
            </div>

            {/* 4. Banner Kutipan Motivasi Anak */}
            <MotivationalKidBanner />



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

                <p style={{ fontFamily: IPS, fontSize: 12, color: "#8BA892", lineHeight: 1.55, margin: "0 0 4px" }}>
                  {latestLaporan.isi.length > 100 ? latestLaporan.isi.slice(0, 100) + "…" : latestLaporan.isi}
                </p>

                <button onClick={() => go("riwayat-laporan")} className="flex items-center gap-1.5"
                  style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: T, background: "none", border: "none", padding: "10px 0 0", cursor: "pointer" }}>
                  Lihat laporan lengkap <span>→</span>
                </button>
              </div>
            )}

            {/* ── Saran dari Guru (Sesuai Desain Referensi) ── */}
            {(() => {
              const teacherName = child.teacher || "Bu Sari";
              const saranItems = [
                {
                  icon: MessageSquare,
                  title: "Latih komunikasi sehari-hari",
                  desc: `Mulai percakapan sederhana dan beri ${nama} waktu untuk menjawab.`,
                },
                {
                  icon: Users,
                  title: "Dukung interaksi dengan teman",
                  desc: `Ajak ${nama} bermain bersama teman yang sabar dan suportif.`,
                },
              ];

              return (
                <div
                  style={{
                    background: "#FFFBF9",
                    border: "1.5px solid #F5D5CB",
                    borderRadius: 22,
                    padding: "16px",
                    boxShadow: "0 2px 10px rgba(196,105,90,0.05)",
                  }}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => go("saran-rumah")}
                    className="flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
                    style={{ marginBottom: 14 }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: "#FFE8E0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Lightbulb size={20} style={{ color: "#C4695A" }} strokeWidth={2.2} />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: PJS,
                            fontSize: 15,
                            fontWeight: 800,
                            color: TEXT,
                            margin: 0,
                            lineHeight: 1.25,
                          }}
                        >
                          Saran dari Guru
                        </h3>
                        <p
                          style={{
                            fontFamily: IPS,
                            fontSize: 12,
                            color: MUTED,
                            margin: "2px 0 0",
                          }}
                        >
                          {teacherName} · Guru Pendamping
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} style={{ color: "#797673" }} />
                  </div>

                  {/* Inner Container: Rekomendasi Terbaru */}
                  <div
                    style={{
                      background: "#FFF4EF",
                      borderRadius: 16,
                      border: "1.5px solid #F8DCD4",
                      padding: "14px 14px 12px",
                    }}
                  >
                    {/* Sub-header row */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        style={{
                          background: "#FFE8DF",
                          color: "#C4695A",
                          borderRadius: 99,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          fontFamily: IPS,
                        }}
                      >
                        Rekomendasi terbaru
                      </span>
                      <span
                        style={{
                          fontFamily: IPS,
                          fontSize: 11.5,
                          color: MUTED,
                        }}
                      >
                        {saranItems.length} saran
                      </span>
                    </div>

                    {/* Recommendation Cards */}
                    <div className="space-y-2.5">
                      {saranItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            style={{
                              background: "#FFFFFF",
                              borderRadius: 12,
                              padding: "12px 14px",
                              border: "1px solid rgba(245, 213, 203, 0.4)",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                background: "#FFF0EB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: 1,
                              }}
                            >
                              <Icon size={16} style={{ color: "#C4695A" }} strokeWidth={2.2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                style={{
                                  fontFamily: PJS,
                                  fontSize: 13.5,
                                  fontWeight: 800,
                                  color: TEXT,
                                  margin: 0,
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.title}
                              </h4>
                              <p
                                style={{
                                  fontFamily: IPS,
                                  fontSize: 12,
                                  color: MUTED,
                                  margin: "4px 0 0",
                                  lineHeight: 1.45,
                                }}
                              >
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Action: Lihat semua saran */}
                  <div
                    style={{
                      borderTop: "1px solid #F5D5CB",
                      marginTop: 14,
                      paddingTop: 12,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => go("saran-rumah")}
                      className="w-full flex items-center justify-between active:scale-[0.99] transition-transform"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: PJS,
                          fontSize: 13,
                          fontWeight: 800,
                          color: "#C4695A",
                        }}
                      >
                        Lihat semua saran
                      </span>
                      <ArrowRight size={15} style={{ color: "#C4695A" }} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              );
            })()}

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

        {/* Sheet pilih anak (multi-anak) */}
        {pilihOpen && (
          <PilihAnakSheet
            daftar={anakList}
            activeId={child ? child.id : null}
            onPilih={(id) => { onPilihAnak(id); setPilihOpen(false); }}
            onTambah={() => { setPilihOpen(false); onOpenCode(); }}
            onClose={() => setPilihOpen(false)}
          />
        )}
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
  const [selected,setSelected] = useState<string|null>("2026-08-15");
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
              if (d===null) return <div key={`p${i}`} style={{height:52}}/>;
              const evs = eventsOn(d);
              const isToday = key(d)===`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
              const isSel = selected===key(d);
              const hasEvt = evs.length > 0;
              return (
                <button key={d} onClick={()=>setSelected(isSel?null:key(d))}
                  style={{
                    height:52, borderRadius:14,
                    background: isSel ? DEEP : hasEvt ? '#EEF6F1' : 'transparent',
                    border: isToday && !isSel ? `2px solid ${A}` : '2px solid transparent',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  className="flex flex-col items-center justify-center gap-0.5">
                  <span style={{fontSize:12,fontWeight:700,color:isSel?'#fff':hasEvt?DEEP:TEXT,fontFamily:PJS,lineHeight:1.1}}>{d}</span>
                  {hasEvt && (
                    <span style={{fontSize:12,lineHeight:1,filter:isSel?'brightness(10)':'none'}}>{KIND_META[evs[0].kind].icon}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{borderTop:`1px solid ${BDR}`}}>
            {Object.entries(KIND_META).map(([k,v])=>(
              <div key={k} className="flex items-center gap-1">
                <span style={{fontSize:12,lineHeight:1}}>{v.icon}</span>
                <span className="text-xs" style={{color:MUTED,fontFamily:IPS}}>{v.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <span style={{width:10,height:10,borderRadius:'50%',border:`2px solid ${BDR}`,display:'inline-block'}}/>
              <span className="text-xs" style={{color:MUTED,fontFamily:IPS}}>Hari ini</span>
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
  return (
    <div style={{background:CARD,border:`1px solid ${BDR}`,overflow:"hidden"}} className="rounded-2xl">
      <button onClick={()=>setOpen(o=>!o)} className="w-full px-4 py-3.5 flex items-center gap-3 text-left">
        {/* Icon box */}
        <div style={{width:48,height:48,background:meta.bg,flexShrink:0,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontSize:22,lineHeight:1}}>{meta.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-snug" style={{color:TEXT,fontFamily:PJS}}>{e.title}</p>
          <div className="flex items-center gap-1 mt-1">
            <Clock size={11} style={{color:MUTED,flexShrink:0}}/>
            <span className="text-xs" style={{color:MUTED,fontFamily:IPS}}>{e.jam}</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1.5" style={{background:meta.bg,color:meta.color}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:meta.color,display:'inline-block'}}/>
            {meta.label}
          </span>
        </div>
        <ChevronRight size={16} style={{color:MUTED,flexShrink:0,transform:open?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
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
  const [q, setQ] = useState("");
  const [filterTerdekat, setFilterTerdekat] = useState(true);
  const [filterJenis, setFilterJenis] = useState<string>("Semua");
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);

  // Filter & Search logic
  let list = LAYANAN.filter(l => {
    const matchQ = l.nama.toLowerCase().includes(q.toLowerCase()) ||
                   l.kategori.toLowerCase().includes(q.toLowerCase()) ||
                   l.alamat.toLowerCase().includes(q.toLowerCase());
    const matchJenis = filterJenis === "Semua" ? true : l.jenis === filterJenis;
    return matchQ && matchJenis;
  });

  if (filterTerdekat) {
    list = [...list].sort((a, b) => (a.jarakKm ?? 99) - (b.jarakKm ?? 99));
  }

  return (
    <div className="flex-1 relative flex flex-col h-full overflow-hidden" style={{fontFamily:IPS, background:BG}}>
      <div className="flex-1 overflow-y-auto">
        {/* ── Top Bar ── */}
      <div style={{background:"#FFFFFF",padding:"14px 16px 12px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${BDR}`,position:"sticky",top:0,zIndex:20}}>
        <button
          onClick={()=>go("parent-dashboard")}
          style={{width:36,height:36,borderRadius:10,background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
          className="active:scale-95 transition-transform"
          title="Kembali"
        >
          <ChevronLeft size={22} style={{color:TEXT}}/>
        </button>
        <h2 style={{fontFamily:PJS,fontSize:18,fontWeight:800,color:TEXT,margin:0,lineHeight:1.2}}>
          Pelatihan &amp; Terapi
        </h2>
      </div>

      <div className="px-4 pt-4 pb-20 space-y-3.5">
        {/* ── Search & Filter Card (Harmonis dengan Tema Aplikasi) ── */}
        <div
          style={{
            background: CARD,
            borderRadius: 20,
            padding: "16px",
            border: `1.5px solid ${BDR}`,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
          }}
        >
          {/* Header */}
          <h3
            style={{
              fontFamily: PJS,
              fontSize: 16,
              fontWeight: 800,
              color: TEXT,
              margin: "0 0 12px 2px",
              letterSpacing: "-0.01em",
            }}
          >
            Cari layanan
          </h3>

          {/* Search Box */}
          <div
            style={{
              background: "#F8F6F1",
              borderRadius: 14,
              border: `1.5px solid ${BDR}`,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              marginBottom: 12,
              transition: "border-color 0.15s ease",
            }}
          >
            <Search size={16} style={{ color: MUTED, marginRight: 8, flexShrink: 0 }} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Cari terapi wicara, kelas seni, dll."
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                color: TEXT,
                fontFamily: IPS,
                fontSize: 13,
                padding: "11px 0",
              }}
            />
            {q && (
              <button
                onClick={() => setQ("")}
                style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: "4px" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            {[
              { id: "Semua", label: "Semua layanan" },
              { id: "Terapi", label: "Terapi" },
              { id: "Pelatihan", label: "Pelatihan" },
            ].map(chip => {
              const active = filterJenis === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setFilterJenis(chip.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 9999,
                    background: active ? SEC : "#F8F6F1",
                    color: active ? DEEP : MUTED,
                    border: `1.5px solid ${active ? T : BDR}`,
                    fontSize: 12,
                    fontWeight: active ? 700 : 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    outline: "none",
                  }}
                  className="active:scale-95"
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Lokasi Row */}
          <div
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  () => setFilterTerdekat(true),
                  () => {}
                );
              }
            }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              paddingTop: 10,
              borderTop: `1px solid ${BDR}`,
              cursor: "pointer",
            }}
            title="Klik untuk gunakan izin lokasi"
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: SEC,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <LocateFixed size={16} style={{ color: T }} strokeWidth={2.3} />
            </div>
            <div>
              <h4
                style={{
                  fontFamily: PJS,
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: TEXT,
                  margin: "0 0 2px",
                }}
              >
                Lokasi
              </h4>
              <p
                style={{
                  fontFamily: IPS,
                  fontSize: 11.5,
                  color: MUTED,
                  margin: 0,
                  lineHeight: 1.35,
                }}
              >
                Pilih kota atau gunakan lokasi saat ini dengan izin pengguna.
              </p>
            </div>
          </div>
        </div>

        {/* ── Official Source Verification Banner ── */}
        <div
          style={{
            background: "#F0F7FF",
            border: "1.5px solid #BFDBFE",
            borderRadius: 16,
            padding: "12px 14px",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#DBEAFE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <ShieldCheck size={18} style={{color:"#1D4ED8"}} />
          </div>
          <p
            style={{
              fontFamily: IPS,
              fontSize: 11.5,
              color: "#1E40AF",
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            Data layanan bersumber dari mitra terpercaya dan instansi resmi. Informasi dapat berubah, cek kembali sebelum mendaftar.
          </p>
        </div>

        {/* ── List of Services (Daftar Layanan dengan Preview Kegiatan) ── */}
        <div className="flex items-center justify-between pt-1">
          <h3 style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, margin: 0 }}>
            Daftar layanan
          </h3>
          <span style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED }}>
            {list.length} tempat ditemukan
          </span>
        </div>

        {list.length === 0 ? (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`}} className="rounded-2xl px-4 py-8 text-center">
            <p className="text-sm font-semibold" style={{color:MUTED}}>Tidak ada layanan yang cocok dengan filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map(l => (
              <div
                key={l.id}
                onClick={() => setSelectedLayanan(l)}
                style={{
                  background: CARD,
                  borderRadius: 18,
                  border: `1.5px solid ${BDR}`,
                  padding: "14px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="active:scale-[0.99] hover:border-slate-300"
              >
                <div className="flex items-start gap-3.5">
                  {/* Thumbnail Preview Kegiatan */}
                  {l.gambar ? (
                    <img
                      src={l.gambar}
                      alt={l.nama}
                      style={{
                        width: 86,
                        height: 86,
                        borderRadius: 14,
                        objectFit: "cover",
                        flexShrink: 0,
                        border: `1px solid ${BDR}`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 86,
                        height: 86,
                        borderRadius: 14,
                        background: l.jenis === "Terapi" ? "#E0F2FE" : l.jenis === "Pelatihan" ? "#FEF3C7" : "#F3E8FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 32,
                        flexShrink: 0,
                      }}
                    >
                      {l.emoji}
                    </div>
                  )}

                  {/* Content Right */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between" style={{ minHeight: 86 }}>
                    <div>
                      <h4
                        style={{
                          fontFamily: PJS,
                          fontSize: 14.5,
                          fontWeight: 800,
                          color: TEXT,
                          margin: "0 0 2px",
                          lineHeight: 1.25,
                        }}
                      >
                        {l.nama}
                      </h4>
                      <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "0 0 5px" }}>
                        {l.jenis} · Bandung ({l.jarak})
                      </p>

                      {/* Badge: Sumber terverifikasi */}
                      <div
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                        style={{
                          background: "#EBF3ED",
                          border: "1px solid #D1E5D5",
                          marginBottom: 5,
                        }}
                      >
                        <Check size={11} strokeWidth={2.6} style={{ color: "#15803D" }} />
                        <span style={{ fontFamily: IPS, fontSize: 10.5, fontWeight: 700, color: "#15803D" }}>
                          Sumber terverifikasi
                        </span>
                      </div>

                      {/* Nama Penyelenggara */}
                      <p style={{ fontFamily: IPS, fontSize: 12, fontWeight: 700, color: TEXT, margin: "0 0 6px" }}>
                        {l.penyelenggara || l.sumberData?.split("(")[0]?.trim() || "Mitra Resmi"}
                      </p>
                    </div>

                    {/* Action Link: Lihat sumber dan detail → */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                      <span
                        style={{
                          fontFamily: IPS,
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: T,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        Lihat sumber dan detail <ChevronRight size={13} strokeWidth={2.5} />
                      </span>

                      <a
                        href={`tel:${l.kontak}`}
                        onClick={e => e.stopPropagation()}
                        title={`Telepon ${l.nama}`}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: "#F1F5F9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: DEEP,
                          textDecoration: "none",
                        }}
                        className="active:scale-90 transition-transform"
                      >
                        <Phone size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* ── Modal Bottom Sheet: Detail Layanan Terverifikasi ── */}
      {selectedLayanan && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
          }}
          onClick={()=>setSelectedLayanan(null)}
        >
          <div style={{position:"absolute",inset:0,background:"rgba(15, 23, 42, 0.50)"}}/>
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              position:"relative",
              background:"#FFFFFF",
              borderRadius:"24px 24px 0 0",
              padding:"18px 20px 24px",
              maxHeight:"88%",
              overflowY:"auto",
              boxShadow:"0 -10px 40px rgba(0,0,0,0.20)",
              fontFamily:IPS,
              zIndex: 1,
            }}
          >
            <div className="flex justify-center mb-3">
              <div style={{width:36,height:4,borderRadius:2,background:"#CBD5E1"}}/>
            </div>

            {selectedLayanan.gambar && (
              <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", marginBottom: 14, height: 130 }}>
                <img
                  src={selectedLayanan.gambar}
                  alt={selectedLayanan.nama}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(4px)",
                  padding: "3px 8px",
                  borderRadius: 6,
                  color: "#FFFFFF",
                  fontSize: 10.5,
                  fontWeight: 700,
                  fontFamily: IPS,
                }}>
                  Preview Kegiatan
                </div>
              </div>
            )}

            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    background: selectedLayanan.jenis === "Terapi" ? "#E0F2FE" : "#FEF3C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  {selectedLayanan.emoji}
                </div>
                <div>
                  <h3 style={{fontFamily:PJS,fontSize:16,fontWeight:800,color:TEXT,margin:0}}>
                    {selectedLayanan.nama}
                  </h3>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#15803D",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      marginTop: 2,
                    }}
                  >
                    <Check size={12} strokeWidth={3}/> Terverifikasi Resmi
                  </span>
                </div>
              </div>
              <button
                onClick={()=>setSelectedLayanan(null)}
                style={{border:"none",background:"#F1F5F9",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:MUTED}}
              >
                <X size={15}/>
              </button>
            </div>

            {/* Sumber Data & Web Resmi */}
            <div
              style={{
                background:"#F8FAFC",
                border:`1px solid ${BDR}`,
                borderRadius:14,
                padding:"12px 14px",
                marginBottom:14,
              }}
              className="space-y-1.5 text-xs"
            >
              <div className="flex items-start gap-2">
                <ShieldCheck size={14} style={{color:"#1D4ED8",flexShrink:0,marginTop:1}}/>
                <div>
                  <span className="font-bold text-slate-700 block">Sumber &amp; Kemitraan Resmi:</span>
                  <span className="text-slate-600">{selectedLayanan.sumberData || "Kemitraan Fasilitas Ramah Inklusi Kota Bandung"}</span>
                </div>
              </div>
              {selectedLayanan.website && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <Globe size={14} style={{color:T,flexShrink:0}}/>
                  <span className="font-bold text-slate-700">Website Resmi:</span>
                  <a
                    href={`https://${selectedLayanan.website}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{color:T,textDecoration:"underline",fontWeight:600}}
                    className="flex items-center gap-1"
                  >
                    {selectedLayanan.website}
                    <ExternalLink size={11}/>
                  </a>
                </div>
              )}
            </div>

            {/* Informasi Lengkap */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-start gap-2">
                <MapPin size={13} style={{color:MUTED,flexShrink:0,marginTop:2}}/>
                <p className="m-0 text-slate-700"><strong>Alamat:</strong> {selectedLayanan.alamat} ({selectedLayanan.jarak})</p>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={13} style={{color:MUTED,flexShrink:0,marginTop:2}}/>
                <p className="m-0 text-slate-700"><strong>Jadwal Operasional:</strong> {selectedLayanan.jadwal}</p>
              </div>
              <div className="flex items-start gap-2">
                <Wallet size={13} style={{color:MUTED,flexShrink:0,marginTop:2}}/>
                <p className="m-0 text-slate-700"><strong>Estimasi Biaya:</strong> {selectedLayanan.biaya}</p>
              </div>
            </div>

            {/* Catatan / Keterangan Spesialisasi */}
            <div
              style={{
                background:"#FEF9EC",
                border:"1px solid rgba(217,142,30,0.25)",
                borderRadius:12,
                padding:"10px 12px",
                marginBottom:16,
              }}
            >
              <p style={{fontSize:11.5,color:"#92400E",lineHeight:1.45,margin:0}}>
                💡 <strong>Catatan untuk Orang Tua:</strong> {selectedLayanan.catatan}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <a
                href={`tel:${selectedLayanan.kontak}`}
                style={{
                  flex:1,
                  background:T,
                  color:"#FFFFFF",
                  fontFamily:PJS,
                  fontWeight:800,
                  fontSize:13,
                  padding:"12px 14px",
                  borderRadius:14,
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  gap:6,
                  textDecoration:"none",
                }}
                className="active:scale-95 transition-transform"
              >
                <Phone size={15}/>
                <span>Hubungi Penyedia</span>
              </a>
              <button
                onClick={()=>alert(`Petunjuk arah menuju ${selectedLayanan.nama} (${selectedLayanan.alamat})`)}
                style={{
                  background:"#F1F5F9",
                  color:TEXT,
                  fontFamily:PJS,
                  fontWeight:700,
                  fontSize:13,
                  padding:"12px 16px",
                  borderRadius:14,
                  border:"none",
                  cursor:"pointer",
                  display:"flex",
                  alignItems:"center",
                  gap:6,
                }}
                className="active:scale-95 transition-transform"
              >
                <MapPin size={15} style={{color:T}}/>
                <span>Peta</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── KONSULTASI DENGAN GURU (CHAT DUA ARAH) ───────────────────────────
export function KonsultasiGuruScreen({
  onBack, teacherName = "Ibu Sari", studentName = "Rafi", kelas = "VII A",
}: {
  onBack: () => void;
  teacherName?: string;
  studentName?: string;
  kelas?: string;
}) {
  const [messages, setMessages] = useState<Array<{
    id: number;
    sender: "parent" | "teacher";
    text: string;
    time: string;
    read?: boolean;
  }>>([
    {
      id: 1,
      sender: "parent",
      text: `Selamat pagi, Bu. Saya ingin menanyakan apakah ada kegiatan tambahan untuk melatih kemandirian ${studentName} di rumah?`,
      time: "08.12",
      read: true,
    },
    {
      id: 2,
      sender: "teacher",
      text: `Selamat pagi, Bu. Untuk saat ini ${studentName} bisa mencoba rutinitas sederhana seperti merapikan meja dan menyiapkan tas. Kami juga punya rekomendasi aktivitas di menu Saran.`,
      time: "08.45",
      read: true,
    },
    {
      id: 3,
      sender: "parent",
      text: "Terima kasih banyak, Bu. 🙏",
      time: "08.46",
      read: true,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;

    const newMsg = {
      id: Date.now(),
      sender: "parent" as const,
      text,
      time: timeStr,
      read: true,
    };

    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputMessage("");

    // Auto-reply simulation from teacher
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyNow = new Date();
      const replyTime = `${String(replyNow.getHours()).padStart(2, "0")}.${String(replyNow.getMinutes()).padStart(2, "0")}`;
      let replyText = `Sama-sama, Ayah/Bunda. Catatan ini akan kami koordinasikan juga bersama terapis okupasi dan tim pengajar sekolah ya.`;

      if (text.toLowerCase().includes("lomba") || text.toLowerCase().includes("fls2n")) {
        replyText = `Terkait persiapan FLS2N, ${studentName} menunjukkan antusiasme yang sangat baik. Kami jadwalkan latihan terstruktur setiap Rabu.`;
      } else if (text.toLowerCase().includes("okupasi") || text.toLowerCase().includes("terapi")) {
        replyText = `Untuk terapi okupasi dan sensori, sekolah bekerja sama dengan klinik rujukan resmi. Nanti kami bantu siapkan rekomendasi pengantar ya.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "teacher" as const,
          text: replyText,
          time: replyTime,
          read: true,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full" style={{fontFamily:IPS, background:BG}}>
      {/* ── Top Bar ── */}
      <div style={{background:"#FFFFFF",padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${BDR}`,flexShrink:0}}>
        <button
          onClick={onBack}
          style={{width:36,height:36,borderRadius:10,background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
          className="active:scale-95 transition-transform"
          title="Kembali"
        >
          <ChevronLeft size={22} style={{color:TEXT}}/>
        </button>
        <h2 style={{fontFamily:PJS,fontSize:18,fontWeight:800,color:TEXT,margin:0}}>
          Konsultasi Guru
        </h2>
      </div>

      {/* ── Contact Info Card ── */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${BDR}`,
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#E7F2EB",
              border: `2px solid ${T}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            👩‍🏫
          </div>
          <div>
            <h3 style={{fontFamily:PJS,fontSize:15,fontWeight:800,color:TEXT,margin:0,lineHeight:1.2}}>
              {teacherName}
            </h3>
            <p style={{fontFamily:IPS,fontSize:11.5,color:MUTED,margin:"2px 0 0",lineHeight:1.2}}>
              Guru Pendamping · Kelas {kelas}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span style={{width:7,height:7,borderRadius:"50%",background:"#15803D",display:"inline-block"}}/>
              <span style={{fontFamily:IPS,fontSize:11,fontWeight:700,color:"#15803D"}}>Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={()=>setShowMenu(v=>!v)}
          style={{background:"transparent",border:"none",cursor:"pointer",padding:6,color:MUTED}}
          className="active:scale-90 transition-transform"
          title="Menu opsi"
        >
          <MoreVertical size={18}/>
        </button>
      </div>

      {/* Menu Info Tim Multidisiplin */}
      {showMenu && (
        <div
          style={{
            background:"#F0FDF4",
            borderBottom:`1px solid #BBF7D0`,
            padding:"10px 16px",
            fontSize:11.5,
            color:"#15803D",
            lineHeight:1.45,
          }}
          className="flex items-start justify-between gap-2"
        >
          <div className="flex items-start gap-2">
            <Info size={14} style={{flexShrink:0,marginTop:2}}/>
            <span>
              <strong>Tim Pendamping Terpadu:</strong> Guru Pendamping ({teacherName}), Guru Okupasi, dan Terapis Wicara berkolaborasi menjawab pertanyaan pengasuhan di rumah.
            </span>
          </div>
          <button onClick={()=>setShowMenu(false)} style={{border:"none",background:"none",cursor:"pointer",color:"#15803D"}}>
            <X size={14}/>
          </button>
        </div>
      )}

      {/* ── Chat Messages Container ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(m => {
          const isParent = m.sender === "parent";
          return (
            <div
              key={m.id}
              className={`flex ${isParent ? "justify-end" : "justify-start"}`}
            >
              <div
                style={{
                  maxWidth: "82%",
                  borderRadius: isParent ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px",
                  background: isParent ? "#DCFCE7" : "#FFFFFF",
                  border: isParent ? "1px solid #BBF7D0" : `1px solid ${BDR}`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <p style={{fontFamily:IPS,fontSize:13,color:TEXT,lineHeight:1.5,margin:0,whiteSpace:"pre-wrap"}}>
                  {m.text}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${isParent ? "justify-end" : "justify-start"}`}>
                  <span style={{fontFamily:DMM,fontSize:10,color:MUTED}}>
                    {m.time}
                  </span>
                  {isParent && (
                    <CheckCheck size={13} style={{color:"#15803D"}}/>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div
              style={{
                borderRadius: "18px 18px 18px 4px",
                padding: "8px 14px",
                background: "#FFFFFF",
                border: `1px solid ${BDR}`,
              }}
              className="flex items-center gap-1.5"
            >
              <span className="text-xs text-slate-500 font-medium">{teacherName} sedang mengetik</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-200" />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Prompts ── */}
      <div className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto" style={{scrollbarWidth:"none"}}>
        {[
          "💡 Tanya saran kemandirian",
          "🩺 Koordinasi guru okupasi",
          "🎨 Jadwal persiapan FLS2N",
        ].map(p => (
          <button
            key={p}
            onClick={()=>sendMessage(p.replace(/^[^\s]+\s/, ""))}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 whitespace-nowrap active:scale-95 transition-all cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* ── Chat Input Bar (Matching right screenshot) ── */}
      <div
        style={{
          background: "#FFFFFF",
          borderTop: `1px solid ${BDR}`,
          padding: "10px 14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={()=>setInputMessage(v => v + " 😊 ")}
          style={{background:"none",border:"none",cursor:"pointer",padding:4,color:MUTED}}
          className="active:scale-90 transition-transform"
          title="Stiker / Emoji"
        >
          <AtSign size={18}/>
        </button>

        <div style={{flex:1,position:"relative"}}>
          <input
            value={inputMessage}
            onChange={e=>setInputMessage(e.target.value)}
            onKeyDown={e=>{ if (e.key === "Enter") sendMessage(); }}
            placeholder="Tulis pesan..."
            style={{
              width:"100%",
              border:`1.5px solid ${BDR}`,
              borderRadius:22,
              padding:"10px 38px 10px 14px",
              fontSize:13.5,
              color:TEXT,
              fontFamily:IPS,
              background:"#F8FAFC",
              outline:"none",
              boxSizing:"border-box",
            }}
          />
          <button
            type="button"
            onClick={()=>alert("Fitur lampiran dokumen / foto observasi")}
            style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:MUTED}}
            className="active:scale-90 transition-transform"
            title="Lampirkan foto"
          >
            <Paperclip size={16}/>
          </button>
        </div>

        <button
          type="button"
          onClick={()=>sendMessage()}
          disabled={!inputMessage.trim()}
          style={{
            width:42,
            height:42,
            borderRadius:"50%",
            background: inputMessage.trim() ? T : "#CBD5E1",
            color:"#FFFFFF",
            border:"none",
            cursor: inputMessage.trim() ? "pointer" : "default",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            flexShrink:0,
          }}
          className="active:scale-95 transition-transform"
          title="Kirim pesan"
        >
          <Send size={16} />
        </button>
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
                <h1 style={{fontFamily:PJS,fontSize:22,fontWeight:800,color:TEXT,margin:0,lineHeight:1.15}}>Anak</h1>
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
  const [bukaSemesterDropdown, setBukaSemesterDropdown] = useState(false);
  const [selectedSemesterAsesmen, setSelectedSemesterAsesmen] = useState<string | null>(null);
  const [detailDropdownOpen, setDetailDropdownOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const SEMESTER_LIST = [
    {
      id: "Semester 1 - 2026/2027",
      title: "Semester 1",
      tahun: "2026/2027",
      tanggal: "12 Agustus 2026",
      status: "completed" as const,
      statusLabel: "Asesmen Selesai",
      desc: "Asesmen pertama telah dinilai oleh guru pendamping.",
    },
    {
      id: "Semester 2 - 2026/2027",
      title: "Semester 2",
      tahun: "2026/2027",
      tanggal: "Januari – Juni 2027",
      status: "pending" as const,
      statusLabel: "Belum tersedia",
      desc: "Periode asesmen genap belum dimulai.",
    },
    {
      id: "Semester 1 - 2027/2028",
      title: "Semester 1",
      tahun: "2027/2028",
      tanggal: "Juli – Desember 2027",
      status: "pending" as const,
      statusLabel: "Belum tersedia",
      desc: "Tahun ajaran baru.",
    },
  ];

  if (selectedSemesterAsesmen) {
    const currentSemester = SEMESTER_LIST.find(s => s.id === selectedSemesterAsesmen) || SEMESTER_LIST[0];
    const isCompleted = currentSemester.status === "completed";

    return (
      <div className="flex-1 overflow-y-auto relative" style={{ fontFamily: IPS, background: BG }}>
        {/* Floating Toast Notification */}
        {toastMsg && (
          <div
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              background: "#1E382B",
              color: "#FFFFFF",
              padding: "10px 18px",
              borderRadius: 14,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: PJS,
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#48BB78",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            </div>
            {toastMsg}
          </div>
        )}

        <TBar title={`Profil & Asesmen ${nama}`} onBack={() => { setSelectedSemesterAsesmen(null); setDetailDropdownOpen(false); }} />
        <div className="px-4 pt-4 pb-20 space-y-3.5">
          {/* Header Info Semester & Interactive Dropdown Switcher */}
          <div
            style={{
              background: CARD,
              borderRadius: 18,
              padding: "14px 16px",
              border: `1.5px solid ${detailDropdownOpen ? T : BDR}`,
              boxShadow: "0 2px 10px rgba(91,122,104,0.05)",
              transition: "border 0.2s ease",
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span style={{ fontFamily: PJS, fontSize: 11, fontWeight: 800, color: MUTED, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Pilihan Semester Asesmen
              </span>
              <span
                style={{
                  background: isCompleted ? "#E7F4EB" : "#F3F4F6",
                  color: isCompleted ? "#246E44" : "#6B7280",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 999,
                  border: `1px solid ${isCompleted ? "rgba(36,110,68,0.25)" : "#E5E7EB"}`,
                }}
              >
                {currentSemester.statusLabel}
              </span>
            </div>

            {/* Dropdown Button */}
            <button
              type="button"
              onClick={() => setDetailDropdownOpen(v => !v)}
              className="w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
              style={{
                background: detailDropdownOpen ? "#F0F6F2" : "#FAFCFA",
                border: `1.5px solid ${detailDropdownOpen ? T : "#CBD5E1"}`,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CalendarDays size={16} style={{ color: T, flexShrink: 0 }} />
                <span style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT }}>
                  {currentSemester.title} · TP {currentSemester.tahun}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span style={{ fontFamily: IPS, fontSize: 11, fontWeight: 600, color: T }}>
                  Ganti Semester
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    color: T,
                    transform: detailDropdownOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>
            </button>

            {/* Dropdown Options */}
            {detailDropdownOpen && (
              <div
                style={{
                  background: "#FFFFFF",
                  border: `1.5px solid #8BB098`,
                  borderRadius: 14,
                  marginTop: 8,
                  boxShadow: "0 4px 16px rgba(91,122,104,0.12)",
                  overflow: "hidden",
                }}
              >
                {SEMESTER_LIST.map((sem, idx) => {
                  const isSel = sem.id === currentSemester.id;
                  const isAvail = sem.status === "completed";
                  return (
                    <button
                      key={sem.id}
                      type="button"
                      onClick={() => {
                        setSelectedSemesterAsesmen(sem.id);
                        setDetailDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors"
                      style={{
                        background: isSel ? "#F0F6F2" : "#FFFFFF",
                        border: "none",
                        borderBottom: idx < SEMESTER_LIST.length - 1 ? `1px solid ${BDR}` : "none",
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: isAvail ? "#E8F4EC" : "#F3F4F6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isAvail ? (
                            <CheckCircle size={15} style={{ color: "#2E5E43" }} />
                          ) : (
                            <Clock size={15} style={{ color: "#9CA3AF" }} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>
                            {sem.title} ({sem.tahun})
                          </p>
                          <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "2px 0 0" }}>
                            {sem.desc}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          style={{
                            background: isAvail ? "#E8F4EC" : "#F3F4F6",
                            color: isAvail ? "#2E5E43" : "#6B7280",
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          {sem.statusLabel}
                        </span>
                        {isSel && <Check size={14} style={{ color: T }} strokeWidth={2.5} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-4 mt-2.5 text-xs" style={{ color: MUTED }}>
              <span>Tanggal: {currentSemester.tanggal}</span>
              <span>•</span>
              <span>Penilai: {child.teacher}</span>
            </div>
          </div>

          {!isCompleted ? (
            <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 20, padding: "32px 20px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <Clock size={26} style={{ color: "#64748B" }} />
              </div>
              <p style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: "0 0 6px" }}>
                Asesmen {currentSemester.title} Belum Tersedia
              </p>
              <p style={{ fontFamily: IPS, fontSize: 12.5, color: MUTED, lineHeight: 1.5, margin: "0 auto 16px", maxWidth: 300 }}>
                Guru pendamping belum melaksanakan asesmen minat dan fungsional untuk periode {currentSemester.title} {currentSemester.tahun}. Hasil pemetaan bakat akan muncul di sini setelah periode penilaian selesai.
              </p>
              <button
                type="button"
                onClick={() => setSelectedSemesterAsesmen("Semester 1 - 2026/2027")}
                style={{
                  background: T,
                  color: "#FFFFFF",
                  fontFamily: PJS,
                  fontSize: 12.5,
                  fontWeight: 700,
                  padding: "9px 18px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                }}
                className="active:scale-95 transition-transform"
              >
                Lihat Hasil Semester 1
              </button>
            </div>
          ) : !child.hasObs ? (
            <div style={{ background: "#FEF9EC", border: `1px solid rgba(217,142,30,0.25)` }} className="rounded-2xl px-4 py-3 flex items-start gap-2.5">
              <Info size={14} style={{ color: A, flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs leading-relaxed" style={{ color: A }}>
                Guru belum menyelesaikan asesmen pertama untuk {nama}. Hasil pemetaan bakat akan muncul di sini setelah asesmen selesai.
              </p>
            </div>
          ) : (
            <>
              <ProfilFungsionalRadar jawaban={getMockJawaban(child.id)} studentName={nama} studentId={child.id} readOnly={true} forParent={true} />
              <ProfilKecenderunganBar jawaban={getMockJawaban(child.id)} studentName={nama} studentId={child.id} readOnly={true} forParent={true} />
              <div style={{ background: "#F0FDF4", border: `1px solid #BBF7D0` }} className="rounded-xl px-4 py-3 flex items-start gap-2.5">
                <Info size={14} style={{ color: "#15803D", flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs leading-relaxed" style={{ color: "#15803D" }}>
                  Profil ini berdasarkan pengamatan guru di lingkungan sekolah, bukan laporan langsung dari anak.
                </p>
              </div>

              {/* Feedback Interaktif Orang Tua */}
              <div className="pt-2">
                <FeedbackPerkembanganOrtu
                  childId={child.id}
                  studentName={nama}
                  teacherName={child.teacher}
                  contextTitle={`Asesmen ${currentSemester.title} ${currentSemester.tahun}`}
                  onGoKonsultasi={() => go("konsultasi-guru")}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto relative" style={{fontFamily:IPS,background:BG}}>
      {/* Floating Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#1E382B",
            color: "#FFFFFF",
            padding: "10px 18px",
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: PJS,
            fontSize: 12.5,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#48BB78",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={12} color="#FFFFFF" strokeWidth={3} />
          </div>
          {toastMsg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{background:"#FFFFFF",padding:"14px 20px 12px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontFamily:PJS,fontSize:22,fontWeight:800,color:TEXT,margin:0,lineHeight:1.15}}>Anak</h1>
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

      <div style={{padding:"16px 16px 90px",display:"flex",flexDirection:"column",gap:16}}>
        {/* ── Profil Anak Card ── */}
        <div style={{
          background:CARD,
          borderRadius:22,
          padding:"18px 16px 16px",
          border:`1px solid ${BDR}`,
          boxShadow:"0 2px 12px rgba(91,122,104,0.07)",
        }}>
          <div className="flex items-center gap-3.5">
            <FotoAnak child={child} size={54} />
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontFamily:PJS,fontSize:17,fontWeight:800,color:TEXT,margin:0,lineHeight:1.25}}>
                {child.name}
              </p>
              <p style={{fontFamily:IPS,fontSize:12.5,color:MUTED,margin:"3px 0 0",lineHeight:1.3}}>
                Kelas {child.kelas}
              </p>
              <p style={{fontFamily:IPS,fontSize:12,color:MUTED,margin:"2px 0 0",lineHeight:1.3}}>
                Guru pendamping: {child.teacher}
              </p>
            </div>
          </div>
        </div>

        {/* ── Informasi {nama} ── */}
        <div>
          <p style={{fontFamily:PJS,fontSize:15,fontWeight:800,color:TEXT,margin:"0 0 12px",lineHeight:1.2}}>
            Informasi {nama}
          </p>

          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {/* Card 1: Profil dan asesmen (Dengan Dropdown Pilihan Semester) */}
            <div
              style={{
                background: CARD,
                borderRadius: 20,
                border: `1.5px solid ${bukaSemesterDropdown ? T : BDR}`,
                boxShadow: bukaSemesterDropdown
                  ? "0 4px 16px rgba(91,122,104,0.12)"
                  : "0 2px 10px rgba(91,122,104,0.05)",
                overflow: "hidden",
                transition: "all 0.2s ease",
              }}
            >
              {/* Header Card */}
              <div
                onClick={() => setBukaSemesterDropdown(v => !v)}
                style={{
                  padding: "16px 16px 12px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 13,
                      background: "#E4F1E9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ClipboardList size={20} style={{ color: T }} strokeWidth={2.2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        style={{
                          fontFamily: PJS,
                          fontSize: 15,
                          fontWeight: 800,
                          color: TEXT,
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        Profil dan Asesmen
                      </p>
                      <span
                        style={{
                          background: "#E8F4EC",
                          color: "#2E5E43",
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: "1px solid rgba(46,94,67,0.2)",
                        }}
                      >
                        Pilih Semester
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: IPS,
                        fontSize: 12,
                        color: MUTED,
                        margin: "4px 0 0",
                        lineHeight: 1.4,
                      }}
                    >
                      Lihat profil fungsional, kecenderungan minat, dan hasil asesmen anak per semester.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dropdown Box Pilihan Semester */}
              <div style={{ padding: "0 14px 14px" }}>
                <div
                  style={{
                    background: "#FAFCFA",
                    border: `1.5px solid ${bukaSemesterDropdown ? "#8BB098" : "#D4E2D8"}`,
                    borderRadius: 14,
                    overflow: "hidden",
                    transition: "all 0.15s ease",
                  }}
                >
                  {/* Dropdown Trigger Bar */}
                  <button
                    type="button"
                    onClick={() => setBukaSemesterDropdown(v => !v)}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left active:bg-[#EDF5EF] transition-colors"
                    style={{
                      background: bukaSemesterDropdown ? "#EDF5EF" : "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CalendarDays size={16} style={{ color: T, flexShrink: 0 }} />
                      <div className="min-w-0">
                        <span
                          style={{
                            fontFamily: PJS,
                            fontSize: 13,
                            fontWeight: 700,
                            color: TEXT,
                            display: "block",
                            lineHeight: 1.2,
                          }}
                        >
                          Semester 1 · 2026/2027
                        </span>
                        <span
                          style={{
                            fontFamily: IPS,
                            fontSize: 11,
                            color: MUTED,
                            display: "block",
                          }}
                        >
                          Asesmen selesai · Klik untuk buka pilihan
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span
                        style={{
                          background: "#E7F4EB",
                          color: "#246E44",
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 999,
                        }}
                      >
                        Selesai
                      </span>
                      <ChevronDown
                        size={17}
                        style={{
                          color: T,
                          transform: bukaSemesterDropdown ? "rotate(180deg)" : "none",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu Options */}
                  {bukaSemesterDropdown && (
                    <div
                      style={{
                        borderTop: "1px solid #D4E2D8",
                        background: "#FFFFFF",
                      }}
                      className="divide-y divide-[#EBF2ED]"
                    >
                      <div style={{ padding: "8px 14px 4px", background: "#F7FAF8" }}>
                        <p style={{ fontFamily: PJS, fontSize: 10.5, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                          Daftar Semester
                        </p>
                      </div>

                      {SEMESTER_LIST.map((sem) => {
                        const isAvailable = sem.status === "completed";
                        return (
                          <div
                            key={sem.id}
                            onClick={() => {
                              if (isAvailable) {
                                setSelectedSemesterAsesmen(sem.id);
                                setBukaSemesterDropdown(false);
                              } else {
                                showToast(`Asesmen ${sem.title} (${sem.tahun}) belum dilaksanakan oleh guru.`);
                              }
                            }}
                            className={`px-3.5 py-3 flex items-center justify-between gap-3 transition-colors ${
                              isAvailable ? "hover:bg-[#F2F8F4] active:bg-[#E8F4EC] cursor-pointer" : "opacity-75 cursor-not-allowed hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "50%",
                                  background: isAvailable ? "#E8F4EC" : "#F3F4F6",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}
                              >
                                {isAvailable ? (
                                  <CheckCircle size={16} style={{ color: "#2E5E43" }} />
                                ) : (
                                  <Clock size={16} style={{ color: "#9CA3AF" }} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p
                                  style={{
                                    fontFamily: PJS,
                                    fontSize: 13.5,
                                    fontWeight: 700,
                                    color: TEXT,
                                    margin: 0,
                                    lineHeight: 1.25,
                                  }}
                                >
                                  {sem.title}
                                </p>
                                <p
                                  style={{
                                    fontFamily: IPS,
                                    fontSize: 11.5,
                                    color: MUTED,
                                    margin: "2px 0 0",
                                  }}
                                >
                                  {sem.tahun} · {sem.tanggal}
                                </p>
                                <p
                                  style={{
                                    fontFamily: IPS,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: isAvailable ? "#44785B" : "#8A9990",
                                    margin: "2px 0 0",
                                  }}
                                >
                                  {sem.desc}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <span
                                style={{
                                  background: isAvailable ? "#E8F4EC" : "#F3F4F6",
                                  border: `1px solid ${isAvailable ? "rgba(46,94,67,0.2)" : "#E5E7EB"}`,
                                  color: isAvailable ? "#2E5E43" : "#6B7280",
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  padding: "3px 8px",
                                  borderRadius: 999,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {sem.statusLabel}
                              </span>
                              {isAvailable && (
                                <ChevronRight size={15} style={{ color: T }} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Tombol aksi langsung */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-2">
                  <span style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED }}>
                    Status: <b style={{ color: "#2E5E43" }}>1 asesmen selesai</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSemesterAsesmen("Semester 1 - 2026/2027")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                    style={{
                      background: "#E8F4EC",
                      border: "1px solid rgba(46,94,67,0.2)",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: T }}>
                      Buka Profil Lengkap
                    </span>
                    <ArrowRight size={13} style={{ color: T }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Riwayat laporan */}
            <button
              type="button"
              onClick={() => {
                if (onLihatRiwayat) onLihatRiwayat();
              }}
              style={{
                background:CARD,
                borderRadius:18,
                padding:"16px",
                border:`1.5px solid ${BDR}`,
                boxShadow:"0 2px 10px rgba(91,122,104,0.05)",
                display:"flex",
                flexDirection:"column",
                textAlign:"left",
                cursor:"pointer",
                width:"100%",
              }}
              className="active:scale-[0.99] transition-all"
            >
              <div className="flex items-start gap-3" style={{width:"100%"}}>
                <div style={{
                  width:38,height:38,borderRadius:12,
                  background:"#EFF6FF",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  flexShrink:0,
                }}>
                  <FileText size={18} style={{color:"#2563EB"}} strokeWidth={2.2} />
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="flex items-center gap-2">
                    <p style={{fontFamily:PJS,fontSize:14,fontWeight:800,color:TEXT,margin:0,lineHeight:1.3}}>
                      Riwayat laporan
                    </p>
                    {laporan.some(l => !l.dibaca) && (
                      <span style={{ fontSize: 10, fontWeight: 800, background: A, color: "#fff", padding: "1px 7px", borderRadius: 99, fontFamily: PJS }}>
                        Baru
                      </span>
                    )}
                  </div>
                  <p style={{fontFamily:IPS,fontSize:12,color:MUTED,margin:"4px 0 0",lineHeight:1.45}}>
                    {laporan.length > 0
                      ? `${laporan.length} catatan perkembangan berkala tersimpan rapi.`
                      : "Lihat laporan guru yang tersimpan berdasarkan tanggal."}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1 w-full" style={{marginTop:10}}>
                <span style={{fontFamily:PJS,fontSize:12,fontWeight:700,color:T}}>Lihat riwayat</span>
                <ChevronRight size={14} style={{color:T}} />
              </div>
            </button>

            {/* Card 3: Konsultasi dengan guru */}
            <button
              type="button"
              onClick={() => {
                go("konsultasi-guru");
              }}
              style={{
                background:CARD,
                borderRadius:18,
                padding:"16px",
                border:`1.5px solid ${BDR}`,
                boxShadow:"0 2px 10px rgba(91,122,104,0.05)",
                display:"flex",
                flexDirection:"column",
                textAlign:"left",
                cursor:"pointer",
                width:"100%",
              }}
              className="active:scale-[0.99] transition-all"
            >
              <div className="flex items-start gap-3" style={{width:"100%"}}>
                <div style={{
                  width:38,height:38,borderRadius:12,
                  background:"#FAF5FF",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  flexShrink:0,
                }}>
                  <MessageCircle size={18} style={{color:"#7C3AED"}} strokeWidth={2.2} />
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="flex items-center gap-2">
                    <p style={{fontFamily:PJS,fontSize:14,fontWeight:800,color:TEXT,margin:0,lineHeight:1.3}}>
                      Konsultasi dengan guru
                    </p>
                    <span style={{ fontSize: 10, fontWeight: 800, background: "#7C3AED", color: "#fff", padding: "1px 7px", borderRadius: 99, fontFamily: PJS }}>
                      Interaktif
                    </span>
                  </div>
                  <p style={{fontFamily:IPS,fontSize:12,color:MUTED,margin:"4px 0 0",lineHeight:1.45}}>
                    Tanyakan perkembangan anak atau diskusikan hasil observasi bersama guru pendamping.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1 w-full" style={{marginTop:10}}>
                <span style={{fontFamily:PJS,fontSize:12,fontWeight:700,color:"#7C3AED"}}>Buka konsultasi</span>
                <ChevronRight size={14} style={{color:"#7C3AED"}} />
              </div>
            </button>
          </div>
        </div>

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
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS, background:BG}}>
      <TBar title="Riwayat Laporan" sub={namaAnak} onBack={onBack}/>
      <div className="px-4 pt-4 pb-12 space-y-4">
        {/* Banner Penjelasan Riwayat Progresif */}
        <div
          style={{
            background: "#F0F7F4",
            border: `1.5px solid rgba(45, 84, 62, 0.20)`,
            borderRadius: 18,
            padding: "14px 16px",
          }}
          className="flex items-start gap-3"
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "rgba(45, 84, 62, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <TrendingUp size={16} style={{ color: DEEP }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: DEEP, margin: "0 0 3px" }}>
              Catatan Berkala &amp; Progresif
            </p>
            <p style={{ fontFamily: IPS, fontSize: 11.5, color: TEXT, lineHeight: 1.45, margin: 0 }}>
              Setiap catatan baru dari guru tersimpan berurutan dan tidak menimpa laporan lama, sehingga perkembangan {namaAnak} dari waktu ke waktu dapat dilihat dengan jelas.
            </p>
          </div>
        </div>

        {/* Timeline Header */}
        <div className="flex items-center justify-between px-1">
          <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: TEXT, margin: 0 }}>
            Timeline Perkembangan
          </p>
          <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: DMM }}>
            {urut.length} Laporan Tersimpan
          </span>
        </div>

        {/* Daftar Kartu Laporan Kronologis */}
        {urut.length === 0 ? (
          <div style={{ background: CARD, border: `1px dashed ${BDR}`, borderRadius: 20, padding: "32px 16px", textAlign: "center" }}>
            <FileText size={32} style={{ color: MUTED, margin: "0 auto 10px" }} />
            <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: "0 0 4px" }}>
              Belum Ada Laporan
            </p>
            <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
              Laporan observasi berkala dari guru akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {urut.map((l, idx) => (
              <div
                key={l.id}
                style={{
                  background: CARD,
                  border: `1px solid ${BDR}`,
                  borderRadius: 18,
                  padding: "16px",
                  boxShadow: "0 2px 10px rgba(91,122,104,0.05)",
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} style={{ color: T }} />
                    <span style={{ fontFamily: DMM, fontSize: 12, fontWeight: 700, color: TEXT }}>
                      {l.dikirimPada}
                    </span>
                  </div>
                  {idx === 0 && (
                    <span style={{ fontSize: 10.5, fontWeight: 800, background: "#FEF3C7", color: "#B45309", padding: "2px 8px", borderRadius: 99, fontFamily: PJS }}>
                      Laporan Terbaru
                    </span>
                  )}
                </div>

                <h4 style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: "0 0 6px" }}>
                  {l.judul || "Catatan Observasi Guru"}
                </h4>

                <p style={{ fontFamily: IPS, fontSize: 12.5, color: TEXT, lineHeight: 1.55, margin: "0 0 10px", whiteSpace: "pre-wrap" }}>
                  {l.isi}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px]" style={{ color: MUTED }}>
                  <span>Guru Pendamping</span>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle size={12} />
                    <span>Tersimpan di Portofolio</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

// ─── KOMPONEN FEEDBACK INTERAKTIF DARI ORANG TUA ───────────────────────
export function FeedbackPerkembanganOrtu({
  childId,
  studentName,
  teacherName = "Guru Pendamping",
  contextTitle = "Perkembangan Siswa",
  onGoKonsultasi,
}: {
  childId: number;
  studentName: string;
  teacherName?: string;
  contextTitle?: string;
  onGoKonsultasi?: () => void;
}) {
  const storageKey = `sareh_parent_feedback_${childId}_${contextTitle.replace(/\s+/g, "_")}`;

  const [submittedData, setSubmittedData] = useState<{
    reaksi: string[];
    keselarasan: string;
    catatan: string;
    waktu: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedReaksi, setSelectedReaksi] = useState<string[]>([]);
  const [keselarasan, setKeselarasan] = useState<string>("Sangat Sesuai");
  const [catatan, setCatatan] = useState("");
  const [sudahTinjau, setSudahTinjau] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSubmittedData(parsed);
        setSelectedReaksi(parsed.reaksi || []);
        setKeselarasan(parsed.keselarasan || "Sangat Sesuai");
        setCatatan(parsed.catatan || "");
      }
    } catch (e) {
      // ignore
    }
  }, [storageKey]);

  const DAFTAR_REAKSI = [
    { id: "bangga", label: "🌟 Sangat Membanggakan" },
    { id: "sesuai", label: "🏡 Sesuai di Rumah" },
    { id: "latihan", label: "💪 Perlu Latihan Lagi" },
    { id: "tips", label: "💡 Butuh Tips Guru" },
    { id: "diskusi", label: "💬 Ingin Diskusi" },
  ];

  const PILIHAN_KESELARASAN = [
    { id: "Sangat Sesuai", label: "Sangat Sesuai", icon: "✨" },
    { id: "Cukup Sesuai", label: "Cukup Sesuai", icon: "👍" },
    { id: "Ada Perbedaan", label: "Ada Perbedaan", icon: "🌱" },
  ];

  const QUICK_PROMPTS = [
    `Di rumah ${studentName} sudah bisa mandiri saat...`,
    `Masih butuh bantuan atau sering lupa saat...`,
    `Terlihat sangat antusias saat kegiatan...`,
    `Terima kasih bimbingannya untuk ${studentName}! 🙏`,
  ];

  const toggleReaksi = (label: string) => {
    setSelectedReaksi(prev =>
      prev.includes(label) ? prev.filter(r => r !== label) : [...prev, label]
    );
  };

  const handleSimpan = async () => {
    setIsSubmitting(true);
    try {
      const confettiModule = await import("canvas-confetti");
      const confetti = confettiModule.default || confettiModule;
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#5B7A68", "#2E5E43", "#8BB098", "#F59E0B", "#10B981"],
      });
    } catch (e) {}

    setTimeout(() => {
      const now = new Date();
      const waktuStr = `${now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · ${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")} WIB`;

      const payload = {
        reaksi: selectedReaksi.length > 0 ? selectedReaksi : ["🏡 Sesuai di Rumah"],
        keselarasan,
        catatan: catatan.trim(),
        waktu: waktuStr,
      };

      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch (e) {}

      setSubmittedData(payload);
      setIsSubmitting(false);
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 500);
  };

  if (submittedData && !isEditing) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1.5px solid #A8CBB5",
          padding: "18px 16px",
          boxShadow: "0 4px 16px rgba(46,94,67,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #5B7A68, #2E5E43, #8BB098)" }} />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#E8F4EC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CheckCircle size={20} style={{ color: "#2E5E43" }} />
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontSize: 14.5, fontWeight: 800, color: TEXT, margin: 0 }}>
                Tanggapan Anda Tersimpan
              </p>
              <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#2E5E43", margin: "2px 0 0", fontWeight: 600 }}>
                ✓ Terkirim ke {teacherName}
              </p>
            </div>
          </div>
          <span
            style={{
              background: "#E8F4EC",
              color: "#2E5E43",
              fontSize: 10.5,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 999,
              border: "1px solid rgba(46,94,67,0.2)",
              whiteSpace: "nowrap",
            }}
          >
            Feedback Orang Tua
          </span>
        </div>

        <div className="mb-3">
          <p style={{ fontFamily: PJS, fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>
            Reaksi Anda
          </p>
          <div className="flex flex-wrap gap-1.5">
            {submittedData.reaksi.map((r, i) => (
              <span
                key={i}
                style={{
                  background: "#F4F8F5",
                  border: "1px solid #CBE0D3",
                  color: "#1E3E2E",
                  fontSize: 11.5,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 12,
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "#F8FAF8", border: `1px solid ${BDR}` }}>
          <span style={{ fontSize: 16 }}>
            {submittedData.keselarasan === "Sangat Sesuai" ? "✨" : submittedData.keselarasan === "Cukup Sesuai" ? "👍" : "🌱"}
          </span>
          <div className="min-w-0 flex-1">
            <span style={{ fontFamily: IPS, fontSize: 11, color: MUTED, display: "block" }}>
              Kesesuaian dengan Kebiasaan di Rumah
            </span>
            <span style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT }}>
              {submittedData.keselarasan}
            </span>
          </div>
        </div>

        {submittedData.catatan && (
          <div className="mb-3.5 p-3 rounded-xl" style={{ background: "#F9FBF9", borderLeft: "3.5px solid #5B7A68" }}>
            <p style={{ fontFamily: PJS, fontSize: 11, fontWeight: 700, color: MUTED, margin: "0 0 4px" }}>
              Catatan Pengamatan Anda:
            </p>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: TEXT, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
              "{submittedData.catatan}"
            </p>
          </div>
        )}

        <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "0 0 12px" }}>
          Terkirim: {submittedData.waktu}
        </p>

        <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px solid ${BDR}` }}>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl active:scale-98 transition-all"
            style={{
              background: "#F1F5F2",
              border: `1px solid #D1DED6`,
              color: TEXT,
              fontFamily: PJS,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Edit3 size={14} style={{ color: T }} />
            Ubah Tanggapan
          </button>

          {onGoKonsultasi && (
            <button
              type="button"
              onClick={onGoKonsultasi}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl active:scale-98 transition-all"
              style={{
                background: T,
                border: "none",
                color: "#FFFFFF",
                fontFamily: PJS,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <MessageCircle size={14} />
              Konsultasi Guru
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: CARD,
        borderRadius: 20,
        border: `1.5px solid #8BB098`,
        padding: "18px 16px",
        boxShadow: "0 4px 18px rgba(91,122,104,0.08)",
      }}
    >
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#1E382B",
            color: "#FFFFFF",
            padding: "10px 18px",
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: PJS,
            fontSize: 12.5,
            fontWeight: 700,
          }}
        >
          <CheckCircle size={16} color="#48BB78" />
          Tanggapan Anda berhasil dikirim ke guru!
        </div>
      )}

      <div className="flex items-start gap-3 mb-3.5">
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "#E4F1E9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MessageSquare size={19} style={{ color: T }} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p style={{ fontFamily: PJS, fontSize: 15, fontWeight: 800, color: TEXT, margin: 0 }}>
              Tanggapan Orang Tua
            </p>
            <span
              style={{
                background: "#E8F4EC",
                color: "#2E5E43",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 999,
              }}
            >
              Interaktif
            </span>
          </div>
          <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "3px 0 0", lineHeight: 1.4 }}>
            Beri tanggapan atau ceritakan pengamatan {studentName} di rumah untuk guru pendamping ({teacherName}).
          </p>
        </div>
      </div>

      <div className="mb-3.5">
        <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, margin: "0 0 6px" }}>
          1. Reaksi Cepat Anda:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {DAFTAR_REAKSI.map(r => {
            const isSel = selectedReaksi.includes(r.label);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleReaksi(r.label)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all"
                style={{
                  background: isSel ? "#E8F4EC" : "#FAFCFA",
                  border: `1.5px solid ${isSel ? "#5B7A68" : "#E2ECE5"}`,
                  color: isSel ? "#1E3E2E" : "#4B5563",
                  fontFamily: PJS,
                  cursor: "pointer",
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3.5">
        <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, margin: "0 0 6px" }}>
          2. Kesesuaian dengan Perilaku di Rumah:
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {PILIHAN_KESELARASAN.map(p => {
            const isSel = keselarasan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setKeselarasan(p.id)}
                className="p-2 rounded-xl text-center active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                style={{
                  background: isSel ? "#E8F4EC" : "#FAFCFA",
                  border: `1.5px solid ${isSel ? "#5B7A68" : "#E2ECE5"}`,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <span
                  style={{
                    fontFamily: PJS,
                    fontSize: 11,
                    fontWeight: isSel ? 800 : 600,
                    color: isSel ? "#1E3E2E" : TEXT,
                    lineHeight: 1.2,
                  }}
                >
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>
            3. Catatan / Refleksi di Rumah:
          </p>
          <span style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED }}>
            {catatan.length}/300
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-1.5 no-scrollbar">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCatatan(prev => prev ? `${prev} ${qp}` : qp);
              }}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg transition-colors active:bg-slate-200"
              style={{
                background: "#F1F5F2",
                border: "1px solid #D4E2D8",
                color: "#374151",
                fontFamily: IPS,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              + {qp.slice(0, 24)}...
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={catatan}
          maxLength={300}
          onChange={e => setCatatan(e.target.value)}
          placeholder={`Tuliskan perkembangan ${studentName} yang terlihat di rumah, respon anak saat belajar, atau hal yang ingin ditanyakan ke guru...`}
          style={{
            width: "100%",
            borderRadius: 14,
            border: `1.5px solid #CBD5E1`,
            padding: "10px 12px",
            fontFamily: IPS,
            fontSize: 12.5,
            color: TEXT,
            background: "#FFFFFF",
            outline: "none",
            resize: "none",
            boxSizing: "border-box",
          }}
          className="focus:border-[#5B7A68] transition-colors"
        />
      </div>

      <label className="flex items-center gap-2 mb-3.5 cursor-pointer">
        <input
          type="checkbox"
          checked={sudahTinjau}
          onChange={e => setSudahTinjau(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: T, cursor: "pointer" }}
        />
        <span style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED }}>
          Saya telah meninjau laporan perkembangan ini sebagai orang tua
        </span>
      </label>

      <div className="flex items-center gap-2">
        {isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="py-2.5 px-4 rounded-xl active:scale-95 transition-all"
            style={{
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              color: "#475569",
              fontFamily: PJS,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Batal
          </button>
        )}

        <button
          type="button"
          onClick={handleSimpan}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl active:scale-98 transition-all"
          style={{
            background: isSubmitting ? "#8BB098" : T,
            border: "none",
            color: "#FFFFFF",
            fontFamily: PJS,
            fontSize: 13,
            fontWeight: 800,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(91,122,104,0.25)",
          }}
        >
          {isSubmitting ? (
            <>
              <Loader size={16} className="animate-spin" />
              <span>Menyimpan Tanggapan...</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Kirim Tanggapan ke {teacherName.split(" ")[0]}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* Halaman "Perkembangan {nama}" — screen riwayat-perkembangan */
export function PerkembanganScreen({ onBack, child, onPilihAspek, onGoKonsultasi }: {
  onBack: () => void; child: Student | null; onPilihAspek: (k: FungsionalKategori) => void;
  onGoKonsultasi?: () => void;
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
      <div className="px-4 pt-4 pb-12 space-y-3.5">

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

        {/* ── Feedback Interaktif Orang Tua ── */}
        <div className="pt-2">
          <FeedbackPerkembanganOrtu
            childId={child.id}
            studentName={nama}
            teacherName={child.teacher}
            contextTitle={`Perkembangan ${periode}`}
            onGoKonsultasi={onGoKonsultasi}
          />
        </div>
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
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            {[0, 1, 2, 3].map(i => {
              const label = i === 0 ? "Belum Bisa" : SKALA_FUNGSIONAL[i + 1].l;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 min-w-0">
                  <span
                    className="font-bold w-full text-center flex items-center justify-center"
                    style={{
                      fontSize: 10,
                      lineHeight: 1.15,
                      padding: "4px 2px",
                      borderRadius: 99,
                      background: `${WARNA_LEVEL[i]}66`,
                      color: WARNA_LEVEL_TEKS[i],
                      minHeight: 28,
                    }}
                  >
                    {label}
                  </span>
                  <span className="font-bold" style={{ fontSize: 15, color: WARNA_LEVEL_TEKS[i] }}>
                    {a.sesudah[i]}
                  </span>
                </div>
              );
            })}
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed" style={{ fontFamily: PJS, fontWeight: 600, color: TEXT, margin: 0 }}>{it.text}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs" style={{ color: MUTED }}>Saat ini:</span>
                    <span className="font-bold" style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: s.bg, color: s.color }}>{s.l}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Halaman Saran Guru untuk di Rumah (screen: "saran-rumah") ─────────────── */
export function SaranRumahScreen({ onBack, child, go }: {
  onBack: () => void;
  child: Student | null;
  go?: (s: Screen) => void;
}) {
  const nama = child ? child.name.split(" ")[0] : "Rafi";
  const [selectedSaran, setSelectedSaran] = useState<any | null>(null);
  const [showPanduan, setShowPanduan] = useState(false);
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({});

  const toggleCompleted = (id: number) => {
    setCompletedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saranList = [
    {
      id: 1, kategori: "KREATIVITAS", prioritas: true,
      judul: "Waktu bereksplorasi",
      deskripsi: "Berikan waktu 20 menit untuk menggambar atau mewarnai sesuai imajinasinya.",
      waktu: "20 menit per hari", waktuDetail: "Kapan saja",
      icon: Palette, iconBg: "#E8F3EB", iconColor: "#2E6B4F", badgeColor: "#2E6B4F",
      img: "/images/saran/kreativitas.jpg",
      langkah: [
        "Siapkan alat gambar atau mewarnai di tempat yang tenang dan nyaman.",
        `Biarkan ${nama} memilih warna dan gambar yang ia sukai tanpa batasan.`,
        "Jangan memberi batasan, cukup dukung dan apresiasi prosesnya.",
      ],
    },
    {
      id: 2, kategori: "KEMANDIRIAN",
      judul: "Belajar mandiri",
      deskripsi: `Ajak ${nama} menyiapkan alat belajarnya sendiri sebelum mulai beraktivitas.`,
      waktu: "Sebelum belajar", waktuDetail: "Sebelum beraktivitas",
      icon: BookOpen, iconBg: "#FEF3C7", iconColor: "#D97706", badgeColor: "#B45309",
      img: "/images/saran/kemandirian.jpg",
      langkah: [
        "Sediakan tempat penyimpanan alat tulis khusus yang mudah dijangkau anak.",
        `Ajak ${nama} menyusun buku dan perlengkapan belajarnya satu per satu.`,
        "Berikan pujian atas kemandirian dan kesiapannya dalam belajar.",
      ],
    },
    {
      id: 3, kategori: "SOSIAL EMOSIONAL",
      judul: "Apresiasi usaha",
      deskripsi: `Berikan pujian saat ${nama} mencoba, meski hasilnya belum sempurna.`,
      waktu: "Setiap hari", waktuDetail: "Sepanjang hari",
      icon: Heart, iconBg: "#FCE7F3", iconColor: "#DB2777", badgeColor: "#BE185D",
      img: "/images/saran/sosial.jpg",
      langkah: [
        "Fokuskan perhatian dan apresiasi pada usahanya, bukan sekadar hasil akhir.",
        `Katakan dengan tulus seperti 'Ibu bangga ${nama} sudah mau berusaha mencoba'.`,
        "Berikan senyuman atau pelukan hangat untuk menumbuhkan rasa percaya diri.",
      ],
    },
    {
      id: 4, kategori: "KOMUNIKASI",
      judul: "Latih percakapan sehari-hari",
      deskripsi: `Mulai percakapan sederhana dan beri ${nama} waktu untuk menjawab.`,
      waktu: "15 menit per hari", waktuDetail: "Saat sarapan / santai",
      icon: MessageSquare, iconBg: "#EFF6FF", iconColor: "#2563EB", badgeColor: "#1D4ED8",
      img: "/images/saran/komunikasi.jpg",
      langkah: [
        "Pilih topik ringan tentang hal menyenangkan yang baru saja terjadi.",
        `Tatap matanya dengan ramah, gunakan kalimat sederhana, dan hindari terburu-buru.`,
        "Berikan jeda waktu beberapa detik agar ia leluasa memproses dan menjawab.",
      ],
    },
    {
      id: 5, kategori: "FISIK & MOTORIK",
      judul: "Gerak aktif menyenangkan",
      deskripsi: "Ajak jalan santai atau permainan lempar tangkap bola ringan di halaman.",
      waktu: "Sore hari", waktuDetail: "Waktu luang sore",
      icon: Sparkles, iconBg: "#EDE9FE", iconColor: "#7C3AED", badgeColor: "#6D28D9",
      img: "/images/saran/fisik.jpg",
      langkah: [
        "Ajak melakukan peregangan ringan dan pemanasan ceria bersama orang tua.",
        "Gunakan bola spons empuk atau sasaran keranjang untuk melatih motorik kasar.",
        "Hentikan sebelum terlalu lelah dan akhiri dengan minum air bersama.",
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ fontFamily: IPS, background: BG }}>
      {/* Top Header */}
      <div style={{ background: "#FFFFFF", padding: "14px 16px 12px", borderBottom: `1px solid ${BDR}`, flexShrink: 0, position: "sticky", top: 0, zIndex: 20 }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            style={{ width: 36, height: 36, borderRadius: 10, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            className="active:scale-95 transition-transform"
            title="Kembali"
          >
            <ChevronLeft size={22} style={{ color: TEXT }} />
          </button>
          <div>
            <h2 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.2 }}>
              Saran Guru untuk di Rumah
            </h2>
            <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, margin: "2px 0 0" }}>
              Aktivitas sederhana untuk mendukung perkembangan {nama} di rumah.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 space-y-3.5">
        {/* Banner Ilustrasi Inspiratif (Sesuai Referensi & Palette Aplikasi) */}
        <div
          style={{
            background: "linear-gradient(135deg, #EBF3ED 0%, #DCECE1 100%)",
            borderRadius: 20,
            border: "1.5px solid rgba(91,122,104,0.25)",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 2px 10px rgba(91,122,104,0.06)",
          }}
        >
          {/* Avatar / Kid drawing illustration */}
          <img
            src="/images/saran/banner.jpg"
            alt="Anak menggambar di rumah"
            style={{ width: 72, height: 72, borderRadius: 16, objectFit: "cover", display: "block", flexShrink: 0 }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: PJS,
                fontSize: 13,
                fontWeight: 700,
                color: TEXT,
                lineHeight: 1.45,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              “Langkah kecil di rumah, berdampak besar untuk perkembangannya ♡”
            </p>
          </div>
        </div>

        {/* List of Saran Cards */}
        <div className="space-y-3">
          {saranList.map((item) => {
            const Icon = item.icon;
            const isDone = completedMap[item.id];
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedSaran(item);
                  setShowPanduan(false);
                }}
                style={{
                  background: CARD,
                  borderRadius: 18,
                  border: `1.5px solid ${isDone ? "#8BB098" : BDR}`,
                  padding: "15px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="active:scale-[0.99] hover:border-slate-300"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    style={{
                      width: 64, height: 64, borderRadius: 14,
                      overflow: "hidden", flexShrink: 0,
                      border: `1px solid ${BDR}`,
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.judul}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            fontFamily: PJS,
                            letterSpacing: "0.04em",
                            color: item.badgeColor,
                          }}
                        >
                          {item.kategori}
                        </span>
                        {item.prioritas && (
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: 6,
                              background: "#2D3748",
                              color: "#FFFFFF",
                            }}
                          >
                            Prioritas
                          </span>
                        )}
                        {isDone && (
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: 6,
                              background: "#DCFCE7",
                              color: "#15803D",
                            }}
                          >
                            ✓ Selesai
                          </span>
                        )}
                      </div>
                      <ChevronRight size={16} style={{ color: MUTED, flexShrink: 0 }} />
                    </div>

                    <h4
                      style={{
                        fontFamily: PJS,
                        fontSize: 14.5,
                        fontWeight: 800,
                        color: TEXT,
                        margin: "0 0 3px",
                      }}
                    >
                      {item.judul}
                    </h4>
                    <p
                      style={{
                        fontFamily: IPS,
                        fontSize: 12,
                        color: MUTED,
                        margin: "0 0 8px",
                        lineHeight: 1.45,
                      }}
                    >
                      {item.deskripsi}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }}>
                      <Clock size={12} style={{ color: MUTED, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontFamily: IPS }}>{item.waktu}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal Bottom Sheet: Detail & Panduan Aktivitas ── */}
      {selectedSaran && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
          }}
          onClick={() => setSelectedSaran(null)}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.45)" }} />
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#FFFFFF",
              borderRadius: "24px 24px 0 0",
              padding: "16px 20px 24px",
              maxHeight: "88%",
              overflowY: "auto",
              boxShadow: "0 -10px 40px rgba(0,0,0,0.18)",
              fontFamily: IPS,
              zIndex: 1,
            }}
          >
            {/* Pull handle */}
            <div className="flex justify-center mb-3">
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "#CBD5E1" }} />
            </div>

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: selectedSaran.iconBg,
                    color: selectedSaran.iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <selectedSaran.icon size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ fontSize: 10, fontWeight: 800, color: selectedSaran.badgeColor, letterSpacing: "0.03em" }}>
                      {selectedSaran.kategori}
                    </span>
                    {selectedSaran.prioritas && (
                      <span style={{ fontSize: 9.5, fontWeight: 700, padding: "1px 6px", borderRadius: 6, background: "#2D3748", color: "#FFFFFF" }}>
                        Prioritas
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: TEXT, margin: 0 }}>
                    {selectedSaran.judul}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedSaran(null)}
                style={{ width: 30, height: 30, borderRadius: "50%", background: "#F1F5F9", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontFamily: IPS, fontSize: 13, color: TEXT, lineHeight: 1.5, margin: "0 0 12px" }}>
              {selectedSaran.deskripsi}
            </p>

            {/* Meta Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "#F8F6F1", border: `1px solid ${BDR}`, color: TEXT }}>
                <Clock size={13} style={{ color: MUTED }} />
                <span>{selectedSaran.waktu}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: "#F8F6F1", border: `1px solid ${BDR}`, color: TEXT }}>
                <CalendarDays size={13} style={{ color: MUTED }} />
                <span>{selectedSaran.waktuDetail}</span>
              </div>
            </div>

            {/* Illustration — gambar asli per aktivitas */}
            <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 16, border: "1px solid #ECE4D6", position: "relative" }}>
              <img
                src={selectedSaran.img}
                alt={selectedSaran.judul}
                style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(transparent, rgba(46,62,53,0.65))",
                  padding: "20px 14px 12px",
                }}
              >
                <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  Aktivitas Ramah Anak & Menyenangkan
                </p>
              </div>
            </div>

            {/* Step-by-step guidance view or button toggle */}
            {showPanduan ? (
              <div style={{ background: "#F8FBF9", border: "1.5px solid #D4E8DA", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
                <h4 style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: DEEP, margin: "0 0 12px" }}>
                  Langkah sederhana:
                </h4>
                <div className="space-y-3">
                  {selectedSaran.langkah.map((l: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: "#5B7A68",
                          color: "#FFFFFF",
                          fontSize: 11,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {idx + 1}
                      </div>
                      <p style={{ fontFamily: IPS, fontSize: 12.5, color: TEXT, lineHeight: 1.45, margin: 0 }}>
                        {l}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowPanduan(false)}
                  style={{
                    width: "100%",
                    marginTop: 14,
                    padding: "10px",
                    borderRadius: 12,
                    background: "#5B7A68",
                    color: "#FFFFFF",
                    fontFamily: PJS,
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                  className="active:scale-[0.99] transition-transform"
                >
                  Selesai Membaca Panduan
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={() => setShowPanduan(true)}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    borderRadius: 16,
                    background: "#5B7A68",
                    color: "#FFFFFF",
                    fontFamily: PJS,
                    fontSize: 13.5,
                    fontWeight: 800,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  className="active:scale-[0.99] transition-transform shadow-sm"
                >
                  <BookOpen size={16} />
                  <span>Lihat panduan aktivitas</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  onClick={() => {
                    toggleCompleted(selectedSaran.id);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 16,
                    background: completedMap[selectedSaran.id] ? "#E8F5EC" : "#FFFFFF",
                    color: completedMap[selectedSaran.id] ? "#15803D" : TEXT,
                    border: `1.5px solid ${completedMap[selectedSaran.id] ? "#8BB098" : BDR}`,
                    fontFamily: PJS,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  className="active:scale-[0.99] transition-transform"
                >
                  <Check size={16} strokeWidth={completedMap[selectedSaran.id] ? 3 : 2} style={{ color: completedMap[selectedSaran.id] ? "#15803D" : MUTED }} />
                  <span>{completedMap[selectedSaran.id] ? "Sudah diselesaikan hari ini ✓" : "Tandai sebagai selesai"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}