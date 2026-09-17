import { useState, useRef, useEffect } from "react";
import {
  Home, Users, ClipboardList, Bell, Search,
  ChevronRight, Star, Brain, Target, CheckCircle,
  Heart, TrendingUp, Sparkles, Trophy,
  Send, Edit3, Info, Shield,
  LogOut, Lock, FileText, Clock, XCircle,
  CheckSquare, UserPlus, CalendarDays, HeartPulse, Key, Copy, RefreshCw,
  Settings, Volume2, VolumeX, X, HelpCircle, Mic, MicOff, Calendar, Plus,
  Percent, User, ArrowLeft,
} from "lucide-react";

import classDrawingImg from "@/imports/class_drawing.jpg";
import classGroupImg from "@/imports/class_group.jpg";
import classActivityImg from "@/imports/class_activity.jpg";


import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
  UI, useUI, type UICtx, Chip, SBadge, PBtn, TBar,
} from "./components/ui-kit";
import {
  seedStudents, StudentsCtx, useStudents,
  GAYA_META, TALENT_COLOR, studentTalentDetail,
  LOMBA, studentCompDetail, ABK_OPTIONS, KELAS_OPTIONS,
  seedLaporan,
  type Role, type Screen, type Student, type LaporanKirim,
} from "./components/data";
import {
  LandingScreen, RoleSelectScreen, GoogleLoginScreen, ParentCodeScreen,
  AkunGuruModal, ProfilSekolahModal, TambahSiswaPromptModal, type GuruProfile,
} from "./components/auth";
import { AddStudentSheet } from "./components/add-student";
import guruIcon from "@/imports/guru-icon.png";
import ortuIcon from "@/imports/ortu-icon.png";
import { ObservationScreen } from "./components/observation";
import { VoiceTextarea } from "./components/voice-input";
import { KodeAksesCard, KodeAksesScreen, ExportPanel, StudentPicker } from "./components/kode-manager";
import { exportLaporanPemetaan } from "./components/export";
import {
  ParentDashboard, ParentDetailScreen, ParentCalendarScreen,
  ParentTrainingScreen, LinkCodeModal,
} from "./components/parent";

// ─── Phone shell ─────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-2.5 pb-1">
      <span style={{fontFamily:IPS,fontSize:12,fontWeight:600,color:TEXT}}>9:41</span>
      <div className="flex gap-1 items-center">
        <div className="w-4 h-2.5 border border-gray-800 rounded-sm relative">
          <div className="absolute inset-0.5 bg-gray-800 rounded-[1px]" style={{width:"75%"}}/>
        </div>
        <svg width="14" height="10"><rect x="0" y="3" width="2.5" height="7" rx="0.5" fill={TEXT}/><rect x="3.5" y="2" width="2.5" height="8" rx="0.5" fill={TEXT}/><rect x="7" y="1" width="2.5" height="9" rx="0.5" fill={TEXT}/><rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill={TEXT}/></svg>
      </div>
    </div>
  );
}

// ─── Search Overlay ──────────────────────────────────────────────────
function SearchOverlay({onClose}:{onClose:()=>void}) {
  const students = useStudents();
  const [q,setQ]=useState("");
  const results = q.length>1
    ? students.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.abk.toLowerCase().includes(q.toLowerCase()))
    : [];
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(46,62,53,0.55)",zIndex:80,display:"flex",flexDirection:"column"}} onClick={onClose}>
      <div style={{background:CARD,borderRadius:"0 0 24px 24px",padding:"12px 16px 16px",flexShrink:0}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10,background:SEC,borderRadius:16,padding:"10px 14px"}}>
          <Search size={16} style={{color:MUTED,flexShrink:0}}/>
          <input
            autoFocus value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Cari siswa, fitur, atau artikel..."
            style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:14,color:TEXT,fontFamily:IPS}}
          />
          {q && <button onClick={()=>setQ("")}><X size={14} style={{color:MUTED}}/></button>}
        </div>
        {results.length>0 && (
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
            {results.map(s=>(
              <div key={s.id} onClick={onClose} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 4px",borderBottom:`1px solid ${BDR}`,cursor:"pointer"}}>
                <span style={{fontSize:22}}>{s.emoji}</span>
                <div>
                  <p style={{fontSize:13,fontWeight:600,color:TEXT,fontFamily:PJS}}>{s.name}</p>
                  <p style={{fontSize:11,color:MUTED,fontFamily:IPS}}>{s.kelas} · {s.abk}</p>
                </div>
                <ChevronRight size={14} style={{color:MUTED,marginLeft:"auto"}}/>
              </div>
            ))}
          </div>
        )}
        {q.length>1&&results.length===0&&(
          <p style={{fontSize:13,color:MUTED,fontFamily:IPS,textAlign:"center",marginTop:12}}>Tidak ada hasil untuk "{q}"</p>
        )}
        {q.length===0&&(
          <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
            {["Rafi Pratama","Pengamatan","Talent Map","Lomba FLS2N","Laporan"].map(t=>(
              <span key={t} onClick={()=>setQ(t)} style={{fontSize:11,fontFamily:IPS,background:SEC,color:DEEP,padding:"5px 10px",borderRadius:20,cursor:"pointer",fontWeight:600}}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings Sheet ───────────────────────────────────────────────────
const INFO_PANELS = [
  {
    icon:<HelpCircle size={16}/>, label:"Panduan Penggunaan",
    body:[
      "Tambah siswa lewat tombol oranye “Tambah Siswa” yang selalu ada di pojok kanan bawah. Cukup 3 kolom wajib: nama, kelas, dan jenis ABK.",
      "Buka Pengamatan & Asesmen dari kartu siswa. Indikator dikelompokkan per kategori — Interaksi Sosial, Komunikasi, Motorik & Sensorik, Fokus & Kognitif, Minat & Bakat.",
      "Tahap Asesmen berisi dua kategori tes: Kemandirian dan Akademik & Bakat, dinilai dengan 4 tingkat.",
      "Catatan dan laporan bisa diisi dengan suara — tekan tombol mikrofon lalu bicara, tidak perlu mengetik.",
      "Kode akses orang tua dibuat guru di tab “Kode Ortu” pada profil siswa, lalu dibagikan ke orang tua.",
    ],
  },
  {
    icon:<Heart size={16}/>, label:"Tentang Sareh Asih",
    body:[
      "Sareh Asih adalah pendamping belajar harian untuk guru dan orang tua. Guru mencatat pengamatan sehari-hari, menilai kemampuan tiap anak, lalu hasilnya disatukan menjadi laporan sederhana yang mudah dibaca orang tua.",
      "Setiap anak tumbuh dengan caranya sendiri — AI di sini bekerja sebagai rekan guru: membantu menenggarai potensi, tetapi keputusan tetap sepenuhnya di tangan guru.",
      "Alur utamanya singkat: amati keseharian anak, nilai sesuai kemampuannya, lalu bagikan perkembangannya ke orang tua.",
      "Dibuat untuk GEMASTIK XVII kategori UX Design.",
    ],
  },
  {
    icon:<Shield size={16}/>, label:"Kebijakan Privasi",
    body:[
      "Data siswa hanya dapat diakses guru pengampu dan orang tua yang memegang kode akses yang sah.",
      "Laporan tidak pernah terkirim otomatis — selalu ada langkah konfirmasi oleh guru sebelum orang tua bisa melihatnya.",
      "Dikte suara diproses di perangkat melalui peramban; rekaman tidak disimpan aplikasi.",
      "Guru dapat membuat ulang kode akses kapan saja, dan kode lama langsung berhenti berlaku.",
    ],
  },
];

function SettingsSheet({onClose, onLogout, role}:{onClose:()=>void; onLogout?:()=>void; role?:Role|null}) {
  const {fontSize,setFontSize,tts,setTts}=useUI();
  const [info,setInfo]=useState<string|null>(null);
  const [confirmLogout, setConfirmLogout]=useState(false);
  const SIZES=[{v:1,l:"Normal"},{v:1.15,l:"Besar"},{v:1.3,l:"Sangat Besar"}];
  return (
    <div style={{position:"absolute",inset:0,background:"rgba(46,62,53,0.45)",zIndex:80,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={onClose}>
      <div style={{background:CARD,borderRadius:"24px 24px 0 0",padding:"20px 20px 32px",maxHeight:"90%",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,borderRadius:2,background:BDR,margin:"0 auto 18px"}}/>
        <p style={{fontSize:16,fontWeight:700,color:TEXT,fontFamily:PJS,marginBottom:16}}>Pengaturan & Bantuan</p>

        {/* Akun & Logout */}
        {role && onLogout && (
          <div style={{marginBottom:18,padding:"14px",background:BG,borderRadius:16,border:`1px solid ${BDR}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <p style={{fontSize:10,fontWeight:700,color:MUTED,fontFamily:DMM,textTransform:"uppercase"}}>Akun Aktif</p>
                <p style={{fontSize:14,fontWeight:700,color:TEXT,fontFamily:PJS}}>
                  {role === "guru" ? "Guru SLB (Sari Dewi, S.Pd.)" : "Orang Tua Siswa"}
                </p>
              </div>
              <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:SEC,color:DEEP,fontFamily:IPS}}>
                {role === "guru" ? "Guru" : "Orang Tua"}
              </span>
            </div>

            {!confirmLogout ? (
              <button onClick={()=>setConfirmLogout(true)}
                style={{width:"100%",padding:"10px",borderRadius:12,border:"1px solid #FCA5A5",background:"#FEF2F2",color:"#DC2626",fontFamily:IPS,fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer"}}>
                <LogOut size={16}/> Keluar Akun
              </button>
            ) : (
              <div style={{background:CARD,padding:12,borderRadius:12,border:"1px solid #FCA5A5",textAlign:"center"}}>
                <p style={{fontSize:12,fontWeight:600,color:TEXT,marginBottom:10,fontFamily:IPS}}>Apakah Anda yakin ingin keluar dari akun ini?</p>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setConfirmLogout(false)} style={{flex:1,padding:"8px",borderRadius:10,border:`1px solid ${BDR}`,background:BG,fontSize:12,fontWeight:600,fontFamily:IPS,color:TEXT,cursor:"pointer"}}>
                    Batal
                  </button>
                  <button onClick={()=>{ onLogout(); onClose(); }} style={{flex:1,padding:"8px",borderRadius:10,border:"none",background:"#DC2626",color:"#fff",fontSize:12,fontWeight:700,fontFamily:IPS,cursor:"pointer"}}>
                    Ya, Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Slider Pengatur Ukuran Teks */}
        <div style={{marginBottom:18, padding:"16px", background:BG, borderRadius:18, border:`1px solid ${BDR}`}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>
            <p style={{fontSize:12,fontWeight:700,color:DEEP,fontFamily:PJS,textTransform:"uppercase",letterSpacing:"0.05em"}}>Ukuran Teks</p>
            <span style={{fontSize:12,fontWeight:700,color:TEXT,fontFamily:DMM,background:CARD,padding:"2px 8px",borderRadius:8,border:`1px solid ${BDR}`}}>
              {Math.round(fontSize * 100)}%
            </span>
          </div>
          
          {/* Range Slider Geser Kiri Kanan */}
          <div style={{display:"flex", alignItems:"center", gap:12, margin:"8px 0 14px"}}>
            <span style={{fontSize:13, fontWeight:700, color:MUTED, fontFamily:PJS, minWidth:16, textAlign:"center"}}>A</span>
            <div style={{position:"relative", flex:1, display:"flex", alignItems:"center"}}>
              <input
                type="range"
                min="0.85"
                max="1.35"
                step="0.05"
                value={fontSize}
                onChange={(e)=>setFontSize(parseFloat(e.target.value))}
                style={{
                  width:"100%",
                  height:8,
                  borderRadius:4,
                  accentColor:T,
                  cursor:"pointer",
                  outline:"none",
                  WebkitAppearance:"none",
                  background:`linear-gradient(to right, ${T} 0%, ${T} ${((fontSize - 0.85) / (1.35 - 0.85)) * 100}%, #D4E8DA ${((fontSize - 0.85) / (1.35 - 0.85)) * 100}%, #D4E8DA 100%)`
                }}
              />
            </div>
            <span style={{fontSize:20, fontWeight:800, color:DEEP, fontFamily:PJS, minWidth:20, textAlign:"center"}}>A</span>
          </div>

          {/* Preset Buttons */}
          <div style={{display:"flex", gap:6}}>
            {([
              {v:0.85, l:"Kecil"},
              {v:1.0,  l:"Normal"},
              {v:1.15, l:"Besar"},
              {v:1.30, l:"Sangat Besar"}
            ]).map(sz=>(
              <button
                key={sz.v}
                onClick={()=>setFontSize(sz.v)}
                style={{
                  flex:1,
                  padding:"7px 0",
                  borderRadius:12,
                  border:`1.5px solid ${Math.abs(fontSize - sz.v) < 0.03 ? T : BDR}`,
                  background: Math.abs(fontSize - sz.v) < 0.03 ? SEC : CARD,
                  color: Math.abs(fontSize - sz.v) < 0.03 ? DEEP : MUTED,
                  fontFamily:IPS,
                  fontSize:11.5,
                  fontWeight:700,
                  transition:"all 0.15s",
                  cursor:"pointer"
                }}
              >
                {sz.l}
              </button>
            ))}
          </div>

          {/* Live Preview Box */}
          <div style={{marginTop:12, padding:"10px 12px", background:CARD, borderRadius:12, border:`1px solid ${BDR}`}}>
            <p style={{fontSize: 10, fontWeight: 700, color: MUTED, fontFamily: DMM, textTransform: "uppercase", marginBottom: 3}}>Pratinjau Teks</p>
            <p style={{fontSize: `${13 * fontSize}px`, fontWeight: 600, color: TEXT, fontFamily: PJS, lineHeight: 1.4}}>
              Sareh Asih: Mengenali & Mengembangkan Potensi Anak
            </p>
          </div>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderTop:`1px solid ${BDR}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {tts ? <Volume2 size={20} style={{color:T}}/> : <VolumeX size={20} style={{color:MUTED}}/>}
            <div>
              <p style={{fontSize:14,fontWeight:600,color:TEXT,fontFamily:IPS}}>Baca Layar (TTS)</p>
              <p style={{fontSize:11,color:MUTED,fontFamily:IPS}}>Bacakan konten layar dengan suara</p>
            </div>
          </div>
          <button onClick={()=>setTts(!tts)}
            style={{width:48,height:28,borderRadius:14,background:tts?T:BDR,transition:"background 0.2s",position:"relative",cursor:"pointer",border:"none",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:tts?22:3,width:22,height:22,borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.18)",transition:"left 0.2s"}}/>
          </button>
        </div>

        <div style={{borderTop:`1px solid ${BDR}`,paddingTop:14,display:"flex",flexDirection:"column",gap:2}}>
          <p style={{fontSize:12,fontWeight:600,color:MUTED,fontFamily:IPS,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Informasi</p>
          {INFO_PANELS.map(item=>{
            const open = info===item.label;
            return (
              <div key={item.label}>
                <button onClick={()=>setInfo(open?null:item.label)}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"11px 4px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",width:"100%",minHeight:44}}>
                  <span style={{color:T}}>{item.icon}</span>
                  <span style={{fontSize:13,fontWeight:500,color:TEXT,fontFamily:IPS}}>{item.label}</span>
                  <ChevronRight size={14} style={{color:MUTED,marginLeft:"auto",transform:open?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
                </button>
                {open && (
                  <div style={{background:BG,border:`1px solid ${BDR}`,borderRadius:14,padding:"12px 14px",marginBottom:8}}>
                    {item.body.map(b=>(
                      <div key={b} style={{display:"flex",gap:8,marginBottom:6}}>
                        <span style={{color:T,fontSize:12,lineHeight:1.7}}>•</span>
                        <p style={{fontSize:12,lineHeight:1.7,color:TEXT,fontFamily:IPS,margin:0}}>{b}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onClose} style={{marginTop:8,width:"100%",padding:"12px",borderRadius:16,background:SEC,border:"none",color:DEEP,fontFamily:IPS,fontWeight:700,fontSize:14,cursor:"pointer"}}>Tutup</button>
      </div>
    </div>
  );
}

// ─── Global Header ────────────────────────────────────────────────────
function GlobalHeader({title,sub}:{title:string;sub?:string}) {
  const {tts,setTts,openSearch,openSettings}=useUI();
  return (
    <div style={{background:CARD,borderBottom:`1px solid ${BDR}`,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"10px 12px"}}>
        <div style={{minWidth:4}}/>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontFamily:PJS,fontSize:17,fontWeight:700,color:TEXT,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{title}</p>
          {sub && <p style={{fontSize:11,color:MUTED,fontFamily:IPS,margin:0}}>{sub}</p>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:2}}>
          <button onClick={openSearch} style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,border:"none",background:"transparent",cursor:"pointer"}} title="Cari">
            <Search size={18} style={{color:MUTED}}/>
          </button>
          <button onClick={()=>setTts(!tts)} style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,border:"none",background:tts?SEC:"transparent",cursor:"pointer"}} title={tts?"Matikan TTS":"Aktifkan TTS"}>
            {tts ? <Volume2 size={18} style={{color:T}}/> : <VolumeX size={18} style={{color:MUTED}}/>}
          </button>
          <button onClick={openSettings} style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,border:"none",background:"transparent",cursor:"pointer"}} title="Pengaturan">
            <Settings size={18} style={{color:MUTED}}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom nav ───────────────────────────────────────────────────────
const GURU_NAV = [
  {k:"dashboard",l:"Beranda",I:Home},
  {k:"students",l:"Kelas",I:Users},
  {k:"talent-map",l:"Bakat",I:Star},
  {k:"competition",l:"Agenda",I:Calendar},
  {k:"report",l:"Laporan",I:FileText},
];
const ORTU_NAV = [
  {k:"parent-dashboard",l:"Beranda",I:Home},
  {k:"parent-detail",l:"Anak",I:Users},
  {k:"parent-calendar",l:"Kalender",I:CalendarDays},
  {k:"parent-training",l:"Pelatihan",I:HeartPulse},
];

function BotNav({role,screen,go}:{role:Role;screen:Screen;go:(s:Screen)=>void}) {
  const nav = role==="guru" ? GURU_NAV : ORTU_NAV;
  return (
    <div style={{background:CARD,borderTop:`1px solid ${BDR}`,flexShrink:0}}>
      <div className="flex px-2 py-1">
        {nav.map(({k,l,I})=>{
          const active=screen===k;
          return (
            <button key={k} onClick={()=>go(k as Screen)} style={{fontFamily:IPS,minHeight:52}} className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all">
              <div style={{
                display:"flex",alignItems:"center",justifyContent:"center",
                padding: active ? "3px 14px" : "3px 0",
                borderRadius: 16,
                background: active ? "rgba(91,122,104,0.16)" : "transparent",
                transition: "all 0.2s ease"
              }}>
                <I size={20} strokeWidth={active ? 2.5 : 1.8} style={{color:active?DEEP:MUTED}}/>
              </div>
              <span style={{fontSize:10,fontWeight:active?800:500,color:active?DEEP:MUTED,fontFamily:active?PJS:IPS}}>{l}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── ONBOARDING (Interactive Spotlight) ──────────────────────────────
type OStep = {
  targetScreen: Screen;
  ring: {x:number; y:number; w:number; h:number; r:number};
  cardPlacement: "top" | "bottom";
  icon: string; title: string; desc: string; badge: string;
};

const OBS_STEPS: OStep[] = [
  {
    targetScreen:"dashboard", ring:{x:16,y:128,w:358,h:108,r:18}, cardPlacement:"top",
    icon:"⚠️", title:"Pengingat Pengamatan Hari Ini",
    desc:"Banner ini menampilkan jumlah siswa yang belum didampingi. Tap 'Lihat Jadwal' untuk langsung ke daftar siswa yang perlu ditangani.",
    badge:"Banner Beranda",
  },
  {
    targetScreen:"dashboard", ring:{x:155,y:252,w:219,h:52,r:0}, cardPlacement:"top",
    icon:"👆", title:"Pengamatan Pending",
    desc:"Tap baris ini untuk membuka daftar siswa yang belum didampingi — AI sudah menyiapkan indikator sesuai profil ABK masing-masing siswa.",
    badge:"Stats Card",
  },
  {
    targetScreen:"students", ring:{x:78,y:788,w:78,h:56,r:0}, cardPlacement:"top",
    icon:"➕", title:"Menu Siswa",
    desc:"Semua siswa yang Anda input ada di sini. Tambah siswa baru cukup 3 kolom wajib, dan AI langsung mengelompokkan mereka per gaya belajar.",
    badge:"Nav Siswa",
  },
  {
    targetScreen:"talent-map", ring:{x:156,y:788,w:78,h:56,r:0}, cardPlacement:"top",
    icon:"✨", title:"Menu Bakat",
    desc:"AI mengelompokkan seluruh siswa berdasarkan gaya belajar dan domain bakat dari hasil pengamatan. Guru langsung tahu siapa bisa diajar bersama.",
    badge:"Nav Bakat",
  },
  {
    targetScreen:"competition", ring:{x:234,y:788,w:78,h:56,r:0}, cardPlacement:"top",
    icon:"📅", title:"Menu Agenda",
    desc:"AI mencocokkan bakat siswa ke 3 ajang resmi: O2SN Diksus, FLS2N-PDBK, dan LKS. Muncul alasan kecocokannya, bukan sekadar daftar nama lomba.",
    badge:"Nav Agenda",
  },
  {
    targetScreen:"report", ring:{x:312,y:788,w:78,h:56,r:0}, cardPlacement:"top",
    icon:"📄", title:"Menu Laporan",
    desc:"Guru bisa generate laporan perkembangan untuk orang tua. Ada langkah konfirmasi sebelum dikirim — laporan tidak pernah terkirim otomatis.",
    badge:"Nav Laporan",
  },
];

function OnboardingModal({onClose, goTab}: {onClose:()=>void; goTab:(s:Screen)=>void}) {
  const [step, setStep] = useState(0);
  const s = OBS_STEPS[step];
  const isLast = step === OBS_STEPS.length - 1;
  const {ring} = s;

  const advance = () => {
    if (isLast) { onClose(); return; }
    const next = OBS_STEPS[step + 1];
    if (next.targetScreen !== s.targetScreen) goTab(next.targetScreen);
    setStep(st => st + 1);
  };

  const arrowFromCardBottom = s.cardPlacement === "top";
  const arrowTipX = ring.x + ring.w / 2;

  return (
    <>
      <style>{`@keyframes ob-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.04)}}`}</style>

      <div style={{position:"absolute",inset:0,zIndex:60,pointerEvents:"none"}}>
        <svg width="390" height="844" style={{position:"absolute",inset:0}}>
          <defs>
            <mask id="ob-mask">
              <rect width="390" height="844" fill="white"/>
              <rect x={ring.x} y={ring.y} width={ring.w} height={ring.h} rx={ring.r} fill="black"/>
            </mask>
          </defs>
          <rect width="390" height="844" fill="rgba(0,0,0,0.62)" mask="url(#ob-mask)"/>
        </svg>

        <div style={{
          position:"absolute",
          top:ring.y-3, left:ring.x-3, width:ring.w+6, height:ring.h+6,
          borderRadius:ring.r+3,
          border:`2.5px solid ${A}`,
          boxShadow:`0 0 0 4px rgba(210,125,107,0.25), 0 0 16px rgba(210,125,107,0.3)`,
          animation:"ob-pulse 1.6s ease-in-out infinite",
        }}/>

        <svg width="390" height="844" style={{position:"absolute",inset:0,overflow:"visible"}}>
          <defs>
            <marker id="ob-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill={A}/>
            </marker>
          </defs>
          <line
            x1={195} y1={s.cardPlacement==="top" ? 272 : 664}
            x2={arrowTipX} y2={arrowFromCardBottom ? ring.y-3 : ring.y+ring.h+3}
            stroke={A} strokeWidth="2" strokeDasharray="5,4"
            markerEnd="url(#ob-arrow)" opacity="0.9"
          />
        </svg>
      </div>

      <div style={{
        position:"absolute", left:16, right:16,
        ...(s.cardPlacement==="top" ? {top:100} : {bottom:8}),
        zIndex:61, pointerEvents:"auto",
      }}>
        <div style={{background:CARD,borderRadius:20,padding:"14px 16px",boxShadow:"0 12px 40px rgba(0,0,0,0.32)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:18}}>{s.icon}</span>
              <span style={{fontSize:10,fontWeight:700,color:A,fontFamily:DMM,letterSpacing:"0.08em"}}>
                {step+1} / {OBS_STEPS.length}
              </span>
            </div>
            <span style={{fontSize:10,fontWeight:600,color:MUTED,fontFamily:IPS,background:"#F3F4F6",padding:"2px 8px",borderRadius:6}}>
              {s.badge}
            </span>
          </div>

          <div style={{height:3,background:"#EDE9E3",borderRadius:2,marginBottom:10}}>
            <div style={{height:"100%",borderRadius:2,background:T,width:`${(step+1)/OBS_STEPS.length*100}%`,transition:"width 0.35s"}}/>
          </div>

          <p style={{fontFamily:PJS,fontWeight:700,fontSize:14,color:TEXT,marginBottom:4}}>{s.title}</p>
          <p style={{fontFamily:IPS,fontSize:12,color:MUTED,lineHeight:1.65,marginBottom:12}}>{s.desc}</p>

          <div style={{display:"flex",gap:8}}>
            {!isLast && (
              <button onClick={onClose}
                style={{flex:1,border:`1px solid ${BDR}`,color:MUTED,fontFamily:IPS,minHeight:40,borderRadius:12,fontSize:12,fontWeight:600,background:CARD}}>
                Lewati
              </button>
            )}
            <button onClick={advance}
              style={{flex:2,background:isLast?T:A,color:"#fff",fontFamily:IPS,minHeight:40,borderRadius:12,fontSize:13,fontWeight:700}}>
              {isLast?"Mulai Gunakan App ✓":"Selanjutnya →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Teacher Illustration SVG ─────────────────────────────────────────
function TeacherIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="40" cy="40" r="38" fill="#EBF3ED"/>
      {/* Plant left */}
      <ellipse cx="15" cy="58" rx="7" ry="4" fill="#8BB098" opacity="0.4"/>
      <path d="M15 58 Q10 46 14 38 Q16 44 18 50 Q17 54 15 58Z" fill="#8BB098" opacity="0.6"/>
      <path d="M15 58 Q22 48 20 40 Q18 46 16 52 Q16 55 15 58Z" fill="#5B7A68" opacity="0.5"/>
      {/* Plant right */}
      <ellipse cx="65" cy="60" rx="6" ry="3.5" fill="#8BB098" opacity="0.4"/>
      <path d="M65 60 Q61 50 63 43 Q65 49 67 55 Q66 58 65 60Z" fill="#8BB098" opacity="0.6"/>
      {/* Person body */}
      <rect x="28" y="42" width="24" height="20" rx="6" fill="#5B7A68"/>
      {/* Collar */}
      <path d="M36 42 L40 50 L44 42" fill="#EBF3ED" opacity="0.8"/>
      {/* Head */}
      <circle cx="40" cy="32" r="11" fill="#F4C5A0"/>
      {/* Hair */}
      <path d="M29 28 Q30 18 40 19 Q50 18 51 28 Q49 22 40 21 Q31 22 29 28Z" fill="#2E1A0E"/>
      <path d="M29 28 Q27 35 30 38 Q29 32 31 29Z" fill="#2E1A0E"/>
      <path d="M51 28 Q53 35 50 38 Q51 32 49 29Z" fill="#2E1A0E"/>
      {/* Eyes */}
      <ellipse cx="36" cy="32" rx="1.5" ry="1.8" fill="#2E1A0E"/>
      <ellipse cx="44" cy="32" rx="1.5" ry="1.8" fill="#2E1A0E"/>
      {/* Smile */}
      <path d="M36 37 Q40 40 44 37" stroke="#C47A5A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Tablet */}
      <rect x="42" y="46" width="14" height="10" rx="2" fill="#B5D4BC"/>
      <rect x="43" y="47" width="12" height="8" rx="1" fill="#EBF3ED"/>
    </svg>
  );
}

// ─── PENGAMATAN PERLU DIPERIKSA (Daftar siswa belum dinilai) ───────────
function PengamatanPendingScreen({onBack,onStartObs}:{
  onBack:()=>void; onStartObs:(id:number)=>void;
}) {
  const students = useStudents();
  const pending = students.filter(s=>!s.hasObs);

  const byKelas = Object.entries(
    pending.reduce((acc,s)=>{
      (acc[s.kelas] ||= []).push(s);
      return acc;
    }, {} as Record<string, typeof pending>)
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS, background:"#F7F9F8"}}>
      <TBar
        title="Pengamatan Perlu Diperiksa"
        sub={`${pending.length} siswa belum dinilai`}
        onBack={onBack}
      />

      <div style={{padding:"14px 16px 40px",display:"flex",flexDirection:"column",gap:14}}>

        {/* Banner notifikasi */}
        {pending.length>0 && (
          <div style={{
            background:`linear-gradient(135deg, ${A} 0%, #C46F5F 100%)`,
            borderRadius:20,padding:"13px 15px",
            display:"flex",alignItems:"center",gap:10,
            boxShadow:"0 8px 24px rgba(210,125,107,0.35)",color:"#FFFFFF"
          }}>
            <div style={{width:40,height:40,borderRadius:13,background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Clock size={19} style={{color:"#FFFFFF"}}/>
            </div>
            <div>
              <p style={{fontSize:13,fontWeight:800,color:"#FFFFFF",fontFamily:PJS,lineHeight:1.2}}>{pending.length} pengamatan perlu diperiksa</p>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.88)",marginTop:2,lineHeight:1.3}}>Daftar siswa yang belum dilengkapi pengamatan</p>
            </div>
          </div>
        )}

        {/* Daftar siswa */}
        {pending.length===0 ? (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`,borderRadius:22,padding:28,textAlign:"center"}}>
            <div style={{width:54,height:54,background:SEC,borderRadius:16,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <CheckCircle size={26} style={{color:DEEP}}/>
            </div>
            <p style={{fontWeight:700,fontSize:14,fontFamily:PJS,color:TEXT,marginBottom:6}}>Semua siswa sudah diamati</p>
            <p style={{fontSize:12,color:MUTED,lineHeight:1.6}}>Tidak ada pengamatan yang perlu diperiksa. Tambahkan siswa baru atau tinjau kembali profil siswa.</p>
            <div className="mt-4">
              <PBtn full label="Kembali ke Beranda" icon={<Home size={15}/>} onClick={onBack} size="sm"/>
            </div>
          </div>
        ) : (
          byKelas.map(([kelas,siswaList])=>{
            const sudah = students.filter(s=>s.kelas===kelas && s.hasObs).length;
            return (
              <div key={kelas}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <p style={{fontFamily:PJS,fontSize:14,fontWeight:800,color:TEXT}}>{kelas}</p>
                  <span style={{fontSize:11,fontWeight:700,color:MUTED,fontFamily:DMM}}>{siswaList.length} belum · {sudah} sudah diamati</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {siswaList.map(s=>(
                    <div key={s.id} style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:18,padding:12,boxShadow:"0 2px 10px rgba(91,122,104,0.07)",display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:26,flexShrink:0}}>{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p style={{fontWeight:700,fontSize:13.5,color:TEXT,fontFamily:PJS,lineHeight:1.1}}>{s.name}</p>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          <span style={{fontSize:10,fontWeight:700,color:A,background:"rgba(210,125,107,0.12)",border:"1px solid rgba(210,125,107,0.35)",padding:"2px 7px",borderRadius:8}}>Belum diamati</span>
                          <span style={{fontSize:10,fontWeight:700,color:T,background:SEC,border:`1px solid ${BDR}`,padding:"2px 7px",borderRadius:8}}>{s.abk}</span>
                        </div>
                      </div>
                      <button onClick={()=>onStartObs(s.id)}
                        style={{
                          flexShrink:0,background:DEEP,color:"#FFFFFF",border:"none",borderRadius:12,
                          padding:"10px 12px",fontFamily:PJS,fontSize:11,fontWeight:800,cursor:"pointer",
                          display:"flex",alignItems:"center",gap:4,boxShadow:"0 4px 12px rgba(91,122,104,0.3)"
                        }}
                        className="active:scale-95 transition-transform">
                        Mulai <ChevronRight size={13} strokeWidth={2.5}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD GURU ──────────────────────────────────────────────────
function DashboardGuru({go,onStartObs,guru,onAddStudent}:{
  go:(s:Screen)=>void; onStartObs:(id:number)=>void; guru:GuruProfile; onAddStudent:()=>void;
}) {
  const students = useStudents();
  const {openSearch, openSettings} = useUI();
  const pendingObs = students.filter(s=>!s.hasObs);
  const firstName = guru.nama.split(" ")[0];
  const sudahDiamati = students.length - pendingObs.length;
  const pctDiamati = students.length ? Math.round(sudahDiamati/students.length*100) : 0;
  const rataBakat = students.length
    ? Math.round(students.reduce((a,s)=>a+(s.talentScore||0),0)/students.length)
    : 0;
  const donutC = 2*Math.PI*34;

  const quickActions = [
    {
      icon: <Percent size={21} strokeWidth={2.6}/>,
      label: "Kelas Saya",
      sub: "Lihat perkembangan siswa di kelas.",
      iconBg: "#D4E8DA", // Light sage matching background
      iconBorder: "1.5px solid rgba(91,122,104,0.35)",
      iconColor: "#1B2E24", // High contrast dark charcoal green
      onClick: () => go("students")
    },
    {
      icon: <Star size={20} strokeWidth={2.4}/>,
      label: "Bakat Anak",
      sub: "Lihat potensi & minat bakat anak.",
      iconBg: "rgba(210,125,107,0.16)",
      iconBorder: "1.5px solid rgba(210,125,107,0.38)",
      iconColor: "#A64735",
      onClick: () => go("talent-map")
    },
    {
      icon: <Calendar size={20} strokeWidth={2.4}/>,
      label: "Agenda",
      sub: "Jadwal kegiatan kelas & agenda lomba.",
      iconBg: "rgba(91,122,104,0.16)",
      iconBorder: "1.5px solid rgba(91,122,104,0.38)",
      iconColor: "#1B2E24",
      onClick: () => go("competition")
    },
    {
      icon: <FileText size={20} strokeWidth={2.4}/>,
      label: "Laporan",
      sub: "Unduh laporan kemajuan siswa.",
      iconBg: "rgba(139,176,152,0.20)",
      iconBorder: "1.5px solid rgba(91,122,104,0.35)",
      iconColor: "#1B2E24",
      onClick: () => go("report")
    },
  ];

  // Group students by kelas
  const kelasList = Object.entries(
    students.reduce((acc, s) => {
      (acc[s.kelas] ||= []).push(s);
      return acc;
    }, {} as Record<string, typeof students>)
  );

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS, background:"#F7F9F8"}}>

      {/* ── Header ── */}
      <div style={{background:CARD, paddingTop:12}}>
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"8px 20px 10px"}}>
          <div>
            <p style={{fontSize:13, color:MUTED, fontWeight:500}}>Selamat pagi,</p>
            <h1 style={{fontFamily:PJS, fontSize:24, fontWeight:800, color:TEXT, lineHeight:1.15, display:"flex", alignItems:"center", gap:6}}>
              {firstName} <span>👋</span>
            </h1>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:6, flexShrink:0, marginTop:4}}>
            <button onClick={openSearch}
              style={{width:38,height:38,background:"rgba(139,176,152,0.12)",borderRadius:12,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Search size={16} style={{color:TEXT}}/>
            </button>
            <button style={{width:38,height:38,background:"rgba(139,176,152,0.12)",borderRadius:12,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <Bell size={16} style={{color:TEXT}}/>
              {pendingObs.length > 0 && (
                <span style={{position:"absolute",top:8,right:9,width:7,height:7,background:A,borderRadius:"50%",border:"2px solid #fff"}}/>
              )}
            </button>
            <button onClick={openSettings}
              style={{width:38,height:38,background:"rgba(139,176,152,0.12)",borderRadius:12,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Settings size={16} style={{color:TEXT}}/>
            </button>
          </div>
        </div>
        <p style={{fontSize:12, color:MUTED, padding:"0 20px 14px"}}>Pantau perkembangan siswa dengan mudah.</p>
      </div>

      <div style={{padding:"14px 16px 90px", display:"flex", flexDirection:"column", gap:16}}>

        {/* ── Alert Banner ── */}
        {pendingObs.length > 0 && (
          <div onClick={()=>go("pengamatan-pending")}
            style={{
              background: `linear-gradient(135deg, ${A} 0%, #C46F5F 100%)`,
              borderRadius: 22,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              boxShadow: "0 8px 24px rgba(210,125,107,0.38)",
              color: "#FFFFFF",
              cursor: "pointer"
            }}
            className="active:scale-[0.98] transition-transform">
            <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
              <div style={{width:42,height:42,borderRadius:14,background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,backdropFilter:"blur(4px)"}}>
                <Bell size={20} style={{color:"#FFFFFF"}}/>
              </div>
              <div style={{minWidth:0}}>
                <p style={{fontSize:13.5,fontWeight:800,color:"#FFFFFF",fontFamily:PJS,lineHeight:1.2}}>{pendingObs.length} pengamatan perlu diperiksa</p>
                <p style={{fontSize:11,color:"rgba(255,255,255,0.88)",marginTop:2,lineHeight:1.3}}>Tap untuk lengkapi pengamatan siswa</p>
              </div>
            </div>
            <button onClick={()=>go("pengamatan-pending")}
              style={{
                background: "#FFFFFF",
                color: A,
                border: "none",
                borderRadius: 14,
                padding: "9px 13px",
                fontFamily: PJS,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
              }}
              className="active:scale-95 transition-transform">
              Lihat <ChevronRight size={13} strokeWidth={2.5}/>
            </button>
          </div>
        )}

        {/* ── Aksi Cepat ── */}
        <div>
          <p style={{fontFamily:PJS,fontSize:16,fontWeight:800,color:TEXT,marginBottom:10}}>Aksi Cepat</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {quickActions.map((a,i)=>(
              <button key={i} onClick={a.onClick}
                style={{
                  background: CARD,
                  border: `1.5px solid rgba(91,122,104,0.18)`,
                  borderRadius: 22,
                  padding: "16px 14px 14px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 128,
                  boxShadow: "0 4px 14px rgba(91,122,104,0.06)",
                }}
                className="active:scale-[0.97] transition-all hover:shadow-md">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",width:"100%"}}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: a.iconBg,
                    border: a.iconBorder || "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: a.iconColor || "#FFFFFF",
                    flexShrink: 0
                  }}>
                    {a.icon}
                  </div>
                  <ChevronRight size={18} style={{color:"#2E3E35",marginTop:4}} strokeWidth={2.2}/>
                </div>
                <div style={{marginTop:12}}>
                  <p style={{fontFamily:PJS,fontWeight:800,fontSize:15.5,color:"#1B2E24",marginBottom:3,lineHeight:1.2}}>{a.label}</p>
                  <p style={{fontSize:11.5,color:MUTED,lineHeight:1.35,fontWeight:500}}>{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Ikhtisar Perkembangan Siswa ── */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <p style={{fontFamily:PJS,fontSize:16,fontWeight:800,color:TEXT}}>Ikhtisar Perkembangan</p>
            <button onClick={()=>go("students")} style={{fontSize:12,fontWeight:700,color:DEEP,background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>
              Lihat semua <ChevronRight size={12} strokeWidth={2.2}/>
            </button>
          </div>

          {students.length === 0 ? (
            <div style={{background:CARD,border:`1.5px dashed ${BDR}`,borderRadius:22,padding:24,textAlign:"center"}}>
              <div style={{width:52,height:52,background:SEC,borderRadius:16,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Users size={24} style={{color:DEEP}}/>
              </div>
              <p style={{fontWeight:700,fontSize:14,fontFamily:PJS,color:TEXT,marginBottom:6}}>Belum ada siswa</p>
              <p style={{fontSize:12,color:MUTED,lineHeight:1.6,marginBottom:16}}>Tambahkan siswa untuk mulai pengamatan dan pemetaan bakat.</p>
              <PBtn full label="Tambah Siswa" icon={<UserPlus size={15}/>} onClick={onAddStudent}/>
            </div>
          ) : (
            <>
              <div style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:22,padding:16,boxShadow:"0 2px 10px rgba(91,122,104,0.08)",display:"flex",alignItems:"center",gap:16}}>
                <div style={{position:"relative",width:84,height:84,flexShrink:0}}>
                  <svg width={84} height={84} viewBox="0 0 84 84">
                    <circle cx={42} cy={42} r={34} fill="none" stroke="#EDE9E3" strokeWidth={9}/>
                    <circle cx={42} cy={42} r={34} fill="none" stroke="#059669" strokeWidth={9} strokeLinecap="round"
                      strokeDasharray={`${(pctDiamati/100)*donutC} ${donutC}`} transform="rotate(-90 42 42)"/>
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <p style={{fontFamily:DMM,fontWeight:800,fontSize:17,color:TEXT,lineHeight:1,margin:0}}>{pctDiamati}%</p>
                    <p style={{fontSize:9,color:MUTED,fontWeight:700,marginTop:2}}>diamati</p>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{fontFamily:PJS,fontSize:13,fontWeight:800,color:TEXT,margin:0}}>{sudahDiamati} dari {students.length} siswa sudah diamati</p>
                  <p style={{fontSize:11,color:MUTED,marginTop:2,lineHeight:1.4}}>Rata-rata skor bakat <strong style={{color:DEEP}}>{rataBakat}/100</strong></p>
                  <div style={{display:"flex",gap:6,marginTop:10}}>
                    {[
                      {l:"Total", v:students.length, c:TEXT, b:BG},
                      {l:"Sudah", v:sudahDiamati, c:"#059669", b:"#ECFDF5"},
                      {l:"Belum", v:pendingObs.length, c:A, b:"rgba(210,125,107,0.12)"},
                    ].map((s)=>(
                      <span key={s.l} style={{flex:1,textAlign:"center",background:s.b,border:`1px solid ${s.c}30`,borderRadius:12,padding:"7px 4px"}}>
                        <p style={{fontFamily:DMM,fontWeight:800,fontSize:14,color:s.c,lineHeight:1,margin:0}}>{s.v}</p>
                        <p style={{fontSize:9,color:MUTED,fontWeight:600,marginTop:2}}>{s.l}</p>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress per kelas */}
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
                {kelasList.map(([kelas,siswaList])=>{
                  const sudah = siswaList.filter(s=>s.hasObs).length;
                  const pr = siswaList.length ? Math.round(sudah/siswaList.length*100) : 0;
                  return (
                    <div key={kelas} style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:16,padding:"11px 13px",boxShadow:"0 2px 8px rgba(91,122,104,0.06)"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:15}}>🏫</span>
                          <p style={{fontFamily:PJS,fontWeight:700,fontSize:13,color:TEXT,margin:0}}>{kelas}</p>
                        </div>
                        <span style={{fontFamily:DMM,fontWeight:800,fontSize:11,color:pr===100?"#059669":pr>0?DEEP:MUTED}}>
                          {sudah}/{siswaList.length} · {pr}%
                        </span>
                      </div>
                      <div style={{height:7,borderRadius:99,background:"#EDE9E3"}}>
                        <div style={{height:"100%",borderRadius:99,background:pr===100?"#10B981":"#8BB098",width:`${pr}%`,transition:"width 0.4s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}


// ─── STUDENTS + KELOMPOK BELAJAR ─────────────────────────────────────
// ─── KELAS SAYA (DAFTAR KELAS & SISWA) ──────────────────────────────
interface KelasCardData {
  id: string;
  nama: string;
  abk: string;
  img: string;
  count?: number;
}

const DEFAULT_KELAS_CARDS: KelasCardData[] = [
  { id: "vii",  nama: "Kelas VII",  abk: "Tunalaras", img: classDrawingImg, count: 10 },
  { id: "vi-a", nama: "Kelas VI A", abk: "Tunarungu", img: classGroupImg,   count: 10 },
  { id: "ix-a", nama: "IX A",       abk: "Tunadaksa", img: classActivityImg, count: 10 },
];

function StudentsScreen({go,onAddStudent,onSelect,guru}:{go:(s:Screen)=>void;onAddStudent:()=>void;onSelect:(id:number)=>void;guru?:GuruProfile}) {
  const students = useStudents();
  const {openSearch, openSettings} = useUI();
  const [kelasList, setKelasList] = useState<KelasCardData[]>(DEFAULT_KELAS_CARDS);
  const [selectedClassId, setSelectedClassId] = useState<string|null>(null);
  const [isAddingKelas, setIsAddingKelas] = useState(false);
  const [schoolName, setSchoolName] = useState(guru?.sekolah || "SLB N Surakrata");
  const [newNama, setNewNama] = useState("");
  const [selectedAbk, setSelectedAbk] = useState("Autism Spectrum Disorder");
  const [customAbk, setCustomAbk] = useState("");
  const [q, setQ] = useState("");

  const selectedClass = kelasList.find(k => k.id === selectedClassId);

  const getAbkBadge = (abk: string) => {
    if (abk.includes("Laras") || abk.includes("Ganda") || abk.includes("Autis")) {
      return { bg: "#F3E8FF", color: "#7C3AED", border: "1px solid #E9D5FF" };
    }
    if (abk.includes("Rungu") || abk.includes("Wicara")) {
      return { bg: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" };
    }
    if (abk.includes("Daksa") || abk.includes("Netra")) {
      return { bg: "#FFF7ED", color: "#EA580C", border: "1px solid #FFEDD5" };
    }
    return { bg: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" };
  };

  const handleSaveKelas = () => {
    if (!newNama.trim()) return;
    const abkFinal = selectedAbk === "Lainnya" && customAbk.trim() ? customAbk.trim() : selectedAbk;
    const imgs = [classDrawingImg, classGroupImg, classActivityImg];
    const newK: KelasCardData = {
      id: Date.now().toString(),
      nama: newNama.trim(),
      abk: abkFinal,
      img: imgs[kelasList.length % imgs.length],
      count: 0
    };
    setKelasList(prev => [...prev, newK]);
    setNewNama("");
    setCustomAbk("");
    setIsAddingKelas(false);
  };

  // ─── DEDICATED VIEW: TAMBAH KELAS (Exact Match to Mockup) ─────────────
  if (isAddingKelas) {
    const abkOptions = [
      "Autism Spectrum Disorder",
      "Tunarungu",
      "Tunadaksa",
      "Tunagrahita Ringan",
      "Tunagrahita Sedang",
      "Tunanetra",
      "Tunalaras",
      "Lainnya"
    ];

    return (
      <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS, background:"#EEF4F0", minHeight:"100%"}}>
        {/* Top Header */}
        <div style={{display:"flex", alignItems:"flex-start", gap:14, padding:"16px 20px 14px", background:"#EEF4F0"}}>
          <button
            onClick={() => setIsAddingKelas(false)}
            style={{background:"none", border:"none", cursor:"pointer", padding:"2px 0 0", display:"flex", alignItems:"center", color:"#1B2E24"}}
            title="Kembali"
          >
            <ArrowLeft size={22} strokeWidth={2.4}/>
          </button>
          <div>
            <h1 style={{fontFamily:PJS, fontSize:19, fontWeight:800, color:"#1B2E24", margin:0, lineHeight:1.2}}>
              Tambah Kelas
            </h1>
            <p style={{fontFamily:IPS, fontSize:12.5, color:"#6B7280", margin:0, marginTop:3, fontWeight:500}}>
              Lengkapi informasi kelas yang akan ditambahkan
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div style={{
          margin: "8px 16px 36px",
          background: "#FFFFFF",
          border: "1.5px solid #8BAE9A",
          borderRadius: 24,
          padding: "22px 18px 24px",
          boxShadow: "0 4px 16px rgba(91,122,104,0.06)"
        }}>
          {/* Field 1: Nama Sekolah */}
          <div style={{marginBottom: 16}}>
            <label style={{display:"block", fontFamily:PJS, fontSize:13.5, fontWeight:800, color:"#1B2E24", marginBottom:8}}>
              Nama Sekolah
            </label>
            <input
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              placeholder="Nama sekolah . contoh: SLB N Surakrata"
              style={{
                width: "100%",
                border: "1.5px solid #E2E8F0",
                borderRadius: 14,
                padding: "13px 16px",
                fontSize: 13.5,
                fontFamily: IPS,
                color: "#1B2E24",
                background: "#FFFFFF",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Field 2: Kelompok Kelas/Ekskul/Mapel * */}
          <div style={{marginBottom: 16}}>
            <label style={{display:"block", fontFamily:PJS, fontSize:13.5, fontWeight:800, color:"#1B2E24", marginBottom:8}}>
              Kelompok Kelas/Ekskul/Mapel <span style={{color:"#EF4444"}}>*</span>
            </label>
            <input
              value={newNama}
              onChange={e => setNewNama(e.target.value)}
              placeholder="Nama kelas · contoh: VII A"
              style={{
                width: "100%",
                border: "1.5px solid #E2E8F0",
                borderRadius: 14,
                padding: "13px 16px",
                fontSize: 13.5,
                fontFamily: IPS,
                color: "#1B2E24",
                background: "#FFFFFF",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* ABK Options Chips */}
          <div style={{display:"flex", flexWrap:"wrap", gap:8, marginBottom: 20}}>
            {abkOptions.map(opt => {
              const isSelected = selectedAbk === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedAbk(opt)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 9999,
                    background: isSelected ? "#5B7A68" : "#EBF3ED",
                    border: isSelected ? "1.5px solid #5B7A68" : "1.5px solid #BDD5C7",
                    color: isSelected ? "#FFFFFF" : "#2E4737",
                    fontFamily: PJS,
                    fontSize: 12.5,
                    fontWeight: isSelected ? 800 : 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "inline-flex",
                    alignItems: "center"
                  }}
                  className="active:scale-95"
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Custom ABK Input if Lainnya is selected */}
          {selectedAbk === "Lainnya" && (
            <div style={{marginBottom: 20}}>
              <label style={{display:"block", fontFamily:PJS, fontSize:12, fontWeight:700, color:"#5B7A68", marginBottom:6}}>
                Ketik Jenis Kekhususan:
              </label>
              <input
                value={customAbk}
                onChange={e => setCustomAbk(e.target.value)}
                placeholder="Contoh: Lamban Belajar / ADHD"
                style={{
                  width: "100%",
                  border: "1.5px solid #5B7A68",
                  borderRadius: 12,
                  padding: "11px 14px",
                  fontSize: 13,
                  fontFamily: IPS,
                  color: "#1B2E24",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            disabled={!newNama.trim()}
            onClick={handleSaveKelas}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 14,
              background: newNama.trim() ? "#5B7A68" : "#CBD5E1",
              color: "#FFFFFF",
              border: "none",
              fontFamily: PJS,
              fontSize: 14,
              fontWeight: 800,
              cursor: newNama.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.2s ease",
              boxShadow: newNama.trim() ? "0 4px 14px rgba(91,122,104,0.25)" : "none"
            }}
            className={newNama.trim() ? "active:scale-[0.98]" : ""}
          >
            <Plus size={16} strokeWidth={2.8} /> Tambah Kelas
          </button>

          {/* Helper Caption */}
          <p style={{
            fontFamily: IPS,
            fontSize: 11.5,
            color: "#64748B",
            marginTop: 14,
            marginBottom: 0,
            lineHeight: 1.4
          }}>
            Isi nama kelas + tekan jenis ABK, lalu tekan <strong style={{color:"#334155"}}>Tambah Kelas</strong>
          </p>
        </div>
      </div>
    );
  }

  // If viewing a specific class detail (students in this class)
  if (selectedClass) {
    const classStudents = students.filter(s =>
      s.kelas.toLowerCase().replace(/\s+/g,'').includes(selectedClass.nama.toLowerCase().replace(/\s+/g,'')) ||
      selectedClass.nama.toLowerCase().replace(/\s+/g,'').includes(s.kelas.toLowerCase().replace(/\s+/g,''))
    );
    const filteredInClass = classStudents.filter(s =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.abk.toLowerCase().includes(q.toLowerCase())
    );

    return (
      <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS, background:"#F7F9F8"}}>
        <TBar
          title={selectedClass.nama}
          sub={`${selectedClass.abk} · ${classStudents.length} Siswa`}
          onBack={() => { setSelectedClassId(null); setQ(""); }}
          right={
            <button
              onClick={onAddStudent}
              style={{
                background: A,
                color: "#fff",
                fontFamily: PJS,
                minHeight: 38,
                borderRadius: 12,
                padding: "0 12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(210,125,107,0.35)"
              }}
              className="flex items-center gap-1.5 text-xs active:scale-95 transition-transform"
            >
              <UserPlus size={14}/> Tambah Siswa
            </button>
          }
        />

        <div style={{padding:"14px 16px 80px", display:"flex", flexDirection:"column", gap:12}}>
          {/* Search bar inside class */}
          <div style={{position:"relative"}}>
            <Search size={18} style={{position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#94A3B8"}}/>
            <input
              value={q}
              onChange={e=>setQ(e.target.value)}
              placeholder={`Cari siswa di ${selectedClass.nama}...`}
              style={{
                width:"100%",
                border:"1.5px solid rgba(91,122,104,0.20)",
                borderRadius:16,
                padding:"11px 14px 11px 40px",
                fontSize:14,
                color:TEXT,
                fontFamily:IPS,
                background:CARD,
                outline:"none",
                minHeight:46
              }}
            />
          </div>

          {classStudents.length === 0 ? (
            <div style={{background:CARD,border:`1.5px dashed ${BDR}`,borderRadius:22,padding:"32px 20px",textAlign:"center"}}>
              <div style={{width:52,height:52,background:SEC,borderRadius:16,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
                🏫
              </div>
              <p style={{fontFamily:PJS,fontWeight:800,fontSize:15,color:TEXT,marginBottom:4}}>Belum ada siswa di {selectedClass.nama}</p>
              <p style={{fontSize:12,color:MUTED,lineHeight:1.5,marginBottom:16}}>Tambahkan siswa pertama ke kelas ini untuk mulai memantau perkembangan dan bakatnya.</p>
              <button onClick={onAddStudent} style={{background:A,color:"#fff",fontFamily:PJS,fontWeight:800,fontSize:12,padding:"10px 18px",borderRadius:14,border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
                <UserPlus size={15}/> Tambah Siswa ke {selectedClass.nama}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredInClass.map(s => (
                <button
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  style={{
                    background:CARD,
                    border:`1.5px solid rgba(91,122,104,0.18)`,
                    width:"100%",
                    textAlign:"left",
                    borderRadius:20,
                    padding:"12px 14px",
                    display:"flex",
                    alignItems:"center",
                    gap:12,
                    boxShadow:"0 2px 8px rgba(91,122,104,0.06)",
                    cursor:"pointer"
                  }}
                  className="active:scale-[0.99] transition-transform"
                >
                  <div style={{width:46,height:46,background:SEC,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                    {s.emoji}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontFamily:PJS,fontSize:14.5,fontWeight:800,color:TEXT}}>{s.name}</p>
                    <p style={{fontSize:11.5,color:MUTED,marginTop:2}}>{s.abk}{s.age ? ` · ${s.age} th` : ""}</p>
                    <div style={{display:"flex",gap:6,marginTop:4}}>
                      <span style={{
                        fontSize:10.5,
                        fontWeight:700,
                        padding:"2px 8px",
                        borderRadius:12,
                        background: s.hasObs ? "#ECFDF5" : "rgba(210,125,107,0.14)",
                        color: s.hasObs ? "#059669" : A,
                        border: `1px solid ${s.hasObs ? "#A7F3D0" : "rgba(210,125,107,0.35)"}`,
                        display:"flex",
                        alignItems:"center",
                        gap:3
                      }}>
                        {s.hasObs ? <CheckCircle size={10}/> : null}
                        {s.hasObs ? "Sudah Diamati" : "Belum Diamati"}
                      </span>
                      {s.talent && (
                        <span style={{fontSize:10.5,fontWeight:700,padding:"2px 8px",borderRadius:12,background:SEC,color:DEEP}}>
                          {s.talent}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{color:MUTED,flexShrink:0}} strokeWidth={2.2}/>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setSelectedClassId(null)}
            style={{
              marginTop: 12,
              background: "transparent",
              color: DEEP,
              border: `1.5px solid ${BDR}`,
              borderRadius: 14,
              padding: "10px",
              fontFamily: PJS,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            ← Kembali ke Semua Kelas
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN VIEW: KELAS SAYA SCREEN (Exact Match to Mockup) ─────────────
  const filteredClasses = kelasList.filter(k =>
    k.nama.toLowerCase().includes(q.toLowerCase()) ||
    k.abk.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto relative" style={{fontFamily:IPS, background:"#F7F9F8"}}>
      {/* ── Header ── */}
      <div style={{background:CARD, paddingTop:12}}>
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"8px 20px 10px"}}>
          <div>
            <h1 style={{fontFamily:PJS, fontSize:24, fontWeight:800, color:"#1B2E24", lineHeight:1.15}}>
              Kelas Saya
            </h1>
            <p style={{fontSize:13, color:MUTED, marginTop:4, fontWeight:500}}>
              Kelola Kelas dengan Mudah
            </p>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:6, flexShrink:0, marginTop:4}}>
            <button onClick={openSearch}
              style={{width:38,height:38,background:"rgba(139,176,152,0.12)",borderRadius:12,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
              title="Cari">
              <Search size={16} style={{color:TEXT}}/>
            </button>
            <button onClick={() => {
              if (students.length > 0) onSelect(students[0].id);
            }}
              style={{width:38,height:38,background:"rgba(139,176,152,0.12)",borderRadius:12,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
              title="Profil Siswa">
              <User size={16} style={{color:TEXT}}/>
            </button>
            <button onClick={openSettings}
              style={{width:38,height:38,background:"rgba(139,176,152,0.12)",borderRadius:12,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
              title="Pengaturan">
              <Settings size={16} style={{color:TEXT}}/>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div style={{padding:"14px 16px 6px"}}>
        <div style={{position:"relative"}}>
          <Search size={18} style={{position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#94A3B8"}}/>
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Cari nama atau jenis ABK..."
            style={{
              width:"100%",
              border:"1.5px solid rgba(91,122,104,0.20)",
              borderRadius:18,
              padding:"12px 14px 12px 42px",
              fontSize:14,
              color:TEXT,
              fontFamily:IPS,
              background:CARD,
              outline:"none",
              minHeight:48,
              boxShadow:"0 2px 6px rgba(91,122,104,0.04)"
            }}
          />
        </div>
      </div>

      {/* ── Class Cards List ── */}
      <div style={{padding:"10px 16px 90px", display:"flex", flexDirection:"column", gap:12}}>
        {filteredClasses.map(k => {
          const abkStyle = getAbkBadge(k.abk);
          const studentCount = students.filter(s =>
            s.kelas.toLowerCase().replace(/\s+/g,'').includes(k.nama.toLowerCase().replace(/\s+/g,'')) ||
            k.nama.toLowerCase().replace(/\s+/g,'').includes(s.kelas.toLowerCase().replace(/\s+/g,''))
          ).length || k.count || 10;

          return (
            <button
              key={k.id}
              onClick={() => setSelectedClassId(k.id)}
              style={{
                background: CARD,
                border: `1.5px solid rgba(91,122,104,0.18)`,
                borderRadius: 22,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(91,122,104,0.06)",
              }}
              className="active:scale-[0.99] transition-all hover:shadow-md"
            >
              {/* Left: Illustration Image */}
              <img
                src={k.img}
                alt={k.nama}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid rgba(0,0,0,0.06)"
                }}
              />

              {/* Middle: Class Details */}
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:2}}>
                  <p style={{fontFamily:PJS, fontSize:16.5, fontWeight:800, color:"#1B2E24", lineHeight:1.2}}>
                    {k.nama}
                  </p>
                  <span style={{fontSize:11, fontWeight:700, color:"#5B7A68", fontFamily:PJS}}>
                    {guru?.sekolah || "SLB N Surakarta"}
                  </span>
                </div>

                <div style={{display:"flex", gap:6, alignItems:"center", marginTop:8, flexWrap:"wrap"}}>
                  {/* ABK badge */}
                  <span style={{
                    fontSize:11,
                    fontWeight:700,
                    padding:"3.5px 10px",
                    borderRadius:20,
                    background: abkStyle.bg,
                    color: abkStyle.color,
                    border: abkStyle.border,
                    fontFamily: PJS
                  }}>
                    {k.abk}
                  </span>

                  {/* Student count badge */}
                  <span style={{
                    fontSize:11,
                    fontWeight:700,
                    padding:"3.5px 10px",
                    borderRadius:20,
                    background: "#ECFDF5",
                    color: "#059669",
                    border: "1px solid #A7F3D0",
                    display:"flex",
                    alignItems:"center",
                    gap:3.5,
                    fontFamily: PJS
                  }}>
                    <CheckCircle size={11} strokeWidth={2.5}/> {studentCount} Siswa
                  </span>
                </div>
              </div>

              {/* Right: Chevron arrow */}
              <ChevronRight size={18} style={{color:"#2E3E35", flexShrink:0, marginLeft:2}} strokeWidth={2.2}/>
            </button>
          );
        })}

        {filteredClasses.length === 0 && (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`,borderRadius:22,padding:"36px 20px",textAlign:"center"}}>
            <p style={{fontFamily:PJS,fontWeight:700,fontSize:14,color:TEXT,marginBottom:4}}>Tidak ada kelas yang cocok</p>
            <p style={{fontSize:12,color:MUTED,marginBottom:14}}>Gunakan kata kunci lain atau tambahkan kelas baru.</p>
            <button onClick={()=>setIsAddingKelas(true)} style={{background:A,color:"#fff",fontFamily:PJS,fontWeight:800,fontSize:12,padding:"10px 16px",borderRadius:14,border:"none",cursor:"pointer"}}>
              + Tambah Kelas Baru
            </button>
          </div>
        )}
      </div>

      {/* ── Sticky Floating Button "+ Tambah Kelas" ── */}
      <div style={{
        position: "sticky",
        bottom: 20,
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: 16,
        pointerEvents: "none",
        marginTop: -70,
        zIndex: 10
      }}>
        <button
          onClick={() => setIsAddingKelas(true)}
          style={{
            background: "#D27D6B",
            color: "#FFFFFF",
            fontFamily: PJS,
            fontWeight: 800,
            fontSize: 13,
            padding: "12px 20px",
            borderRadius: 24,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 6px 20px rgba(210,125,107,0.40)",
            pointerEvents: "auto"
          }}
          className="active:scale-95 transition-transform"
        >
          <Plus size={16} strokeWidth={2.6}/> Tambah Kelas
        </button>
      </div>
    </div>
  );
}

// ─── PROFILE SISWA ───────────────────────────────────────────────────
/** Kartu kode orang tua — guru yang membuat & membagikannya (peran admin ada di guru). */
function KodeOrtuCard({s,onRegen}:{s:Student;onRegen:(id:number)=>void}) {
  const [copied,setCopied] = useState(false);
  const salin = () => {
    if (s.kodeOrtu) navigator.clipboard?.writeText(s.kodeOrtu).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),1800);
  };
  return (
    <div style={{background:CARD,border:`1.5px solid ${T}`}} className="rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Key size={15} style={{color:T}}/>
        <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Kode Akses Orang Tua</p>
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{color:MUTED}}>
        Bagikan kode ini kepada orang tua {s.name.split(" ")[0]} agar mereka bisa memantau perkembangan anak dan menerima agenda sekolah.
      </p>
      <div style={{background:SEC,border:`1px dashed ${T}`}} className="rounded-xl px-3 py-3 text-center mb-3">
        <p className="font-bold" style={{fontFamily:DMM,fontSize:17,color:DEEP,letterSpacing:"0.1em"}}>{s.kodeOrtu ?? "—"}</p>
      </div>
      <div className="flex gap-2.5">
        <button onClick={salin} style={{
            flex:1,
            background:copied?SEC:A,
            color:copied?DEEP:"#fff",
            fontFamily:PJS,
            fontWeight:700,
            fontSize:13,
            minHeight:46,
            borderRadius:14,
            border:"none",
            boxShadow:copied?"none":"0 4px 14px rgba(210,125,107,0.38)",
            cursor:"pointer"
          }}
          className="flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
          {copied ? <><CheckCircle size={14}/>Tersalin</> : <><Copy size={14}/>Salin Kode</>}
        </button>
        <button onClick={()=>onRegen(s.id)} style={{
            flex:1,
            background:CARD,
            border:`2px solid ${DEEP}`,
            color:DEEP,
            fontFamily:PJS,
            fontWeight:700,
            fontSize:13,
            minHeight:46,
            borderRadius:14,
            cursor:"pointer"
          }}
          className="flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
          <RefreshCw size={14}/>Buat Ulang
        </button>
      </div>
      <p className="text-xs mt-2 leading-relaxed" style={{color:MUTED}}>
        Membuat ulang kode akan memutus akses orang tua yang memakai kode lama.
      </p>
    </div>
  );
}

function JurnalTab({s,laporan,onKirim}:{s:Student;laporan:LaporanKirim[];onKirim:(studentId:number,isi:string)=>void}) {
  const generated = `${s.name} menunjukkan perkembangan positif pada ${s.talent?s.talent.toLowerCase():"kegiatan belajarnya"} di Semester Genap 2026. Fokus dan kemandirian meningkat dibanding semester lalu.`;
  const [draft,setDraft] = useState(generated);
  const [expanded,setExpanded] = useState(false);
  const [listening,setListening] = useState(false);
  const [saved,setSaved] = useState(false);
  const riwayat = laporan.filter(l=>l.studentId===s.id).slice().reverse();

  const recRef = useRef<any>(null);
  const baseRef = useRef("");

  const startMic = () => {
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "id-ID"; rec.continuous = true; rec.interimResults = false;
    baseRef.current = draft.trimEnd() + " ";
    recRef.current = rec;
    rec.onresult = (e:any) => {
      let t = ""; for (let i=e.resultIndex;i<e.results.length;i++) if(e.results[i].isFinal) t+=e.results[i][0].transcript;
      if(t){ baseRef.current=(baseRef.current+t).replace(/\s+/," ")+" "; setDraft(baseRef.current.trimStart()); }
    };
    rec.onend = () => setListening(false);
    rec.start(); setListening(true);
  };
  const stopMic = () => { recRef.current?.stop(); setListening(false); };

  const firstLine = draft.split(/\n/)[0];
  const isLong = draft.length > firstLine.length + 2 || firstLine.length > 80;

  const handleSave = () => {
    onKirim(s.id, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const shortDate = (str: string) => {
    const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const d = new Date(str.replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$2-$1").replace(/\s.*/,""));
    if(isNaN(d.getTime())) return str.slice(0,6);
    return `${d.getDate()} ${bulan[d.getMonth()]}`;
  };

  return (
    <div className="space-y-3">
      {/* ── Compact input area ── */}
      <div style={{background:CARD,border:`1.5px solid ${listening?A:BDR}`,borderRadius:18,overflow:"hidden",transition:"border-color 0.2s"}}>
        {/* Textarea — collapsed or expanded */}
        <div style={{position:"relative"}}>
          <textarea
            value={draft}
            onChange={e=>{setDraft(e.target.value);if(!expanded&&e.target.value!==firstLine)setExpanded(true);}}
            onFocus={()=>setExpanded(true)}
            rows={expanded?4:2}
            placeholder="Tulis catatan untuk orang tua..."
            style={{
              width:"100%",border:"none",outline:"none",resize:"none",
              padding:"12px 14px 8px",fontSize:13,lineHeight:1.6,
              color:TEXT,fontFamily:IPS,background:CARD,
              overflow:expanded?"auto":"hidden",
              display:"block",
            }}
          />
          {!expanded && isLong && (
            <button
              onClick={()=>setExpanded(true)}
              style={{position:"absolute",bottom:4,right:10,fontSize:11,fontWeight:700,color:T,background:"transparent",border:"none",cursor:"pointer",fontFamily:IPS}}>
              Selengkapnya...
            </button>
          )}
        </div>

        {/* Toolbar — mic + word count */}
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px 8px",borderTop:`1px solid ${BDR}`,background:BG}}>
          <button
            onClick={listening?stopMic:startMic}
            style={{
              display:"flex",alignItems:"center",gap:5,padding:"5px 10px",
              borderRadius:10,border:"none",cursor:"pointer",fontFamily:IPS,
              fontSize:11,fontWeight:700,
              background:listening?A:SEC,
              color:listening?"#fff":T,
              animation:listening?"vt-pulse 1.5s infinite":undefined,
            }}>
            {listening ? <MicOff size={12}/> : <Mic size={12}/>}
            {listening?"Berhenti":"Bicara untuk Menulis"}
          </button>
          {listening && (
            <span style={{fontSize:10,color:A,fontFamily:IPS,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:A,display:"inline-block"}}/>
              Mendengarkan…
            </span>
          )}
          <span style={{marginLeft:"auto",fontSize:11,color:MUTED,fontFamily:IPS}}>
            {draft.trim().split(/\s+/).filter(Boolean).length} kata
          </span>
        </div>
      </div>

      {/* ── Info + Save ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
        <p style={{fontSize:11,color:MUTED,fontFamily:IPS,flex:1}}>
          Catatan akan terlihat oleh orang tua.
        </p>
        <button
          onClick={handleSave}
          style={{
            display:"flex",alignItems:"center",gap:6,padding:"9px 18px",
            borderRadius:14,border:"none",cursor:"pointer",
            background:saved?DEEP:A,color:"#fff",fontFamily:PJS,
            fontSize:13,fontWeight:700,flexShrink:0,
            boxShadow:saved?"0 4px 12px rgba(91,122,104,0.35)":"0 4px 14px rgba(210,125,107,0.42)",
            transition:"all 0.2s",
          }}
          className="active:scale-95 transition-transform">
          {saved ? <><CheckCircle size={14}/>Tersimpan</> : <><Send size={13}/>Simpan Catatan</>}
        </button>
      </div>

      {/* ── Riwayat ── */}
      <div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <p style={{fontFamily:PJS,fontSize:13,fontWeight:700,color:TEXT}}>Riwayat</p>
          <span style={{fontSize:11,fontWeight:600,color:MUTED,fontFamily:IPS}}>{riwayat.length} catatan</span>
        </div>
        {riwayat.length===0 ? (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`,borderRadius:14,padding:"16px 14px",textAlign:"center"}}>
            <p style={{fontSize:11,color:MUTED,fontFamily:IPS}}>Belum ada catatan tersimpan.</p>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {riwayat.map(r=>(
              <div key={r.id} style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:14,padding:"10px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
                {/* Date */}
                <div style={{flexShrink:0,width:36,textAlign:"center"}}>
                  <p style={{fontSize:13,fontWeight:800,color:TEXT,fontFamily:PJS,lineHeight:1}}>{shortDate(r.dikirimPada).split(" ")[0]}</p>
                  <p style={{fontSize:10,color:MUTED,fontFamily:IPS}}>{shortDate(r.dikirimPada).split(" ")[1]||""}</p>
                </div>
                {/* Content */}
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:12,color:TEXT,fontFamily:IPS,lineHeight:1.55,
                    display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"} as React.CSSProperties}>
                    {r.isi}
                  </p>
                </div>
                {/* Status */}
                <div style={{flexShrink:0,display:"flex",alignItems:"center",gap:3}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:r.dibaca?"#22C55E":"#D4A843",display:"inline-block"}}/>
                  <span style={{fontSize:10,fontWeight:600,color:r.dibaca?"#15803D":"#92400E",fontFamily:IPS}}>
                    {r.dibaca?"Dibaca":"Belum"}
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

function ProfileScreen({onBack,go,studentId,onStartObs,onRegenKode,namaSekolah,laporan,onKirim}:{
  onBack:()=>void;go:(s:Screen)=>void;studentId:number;onStartObs:(id:number)=>void;
  onRegenKode:(id:number)=>void;namaSekolah:string;laporan:LaporanKirim[];onKirim:(studentId:number,isi:string)=>void;
}) {
  const students = useStudents();
  const s = students.find(x=>x.id===studentId) ?? students[0];
  const [tab,setTab]=useState<"abk"|"kode"|"jurnal">("abk");
    if (!s) return null;

  const rows:[string,string][] = [
    ["Jenis ABK", s.abk],
    ["Tingkat Dukungan", s.tingkatDukungan||"Belum diisi"],
    ["Kemampuan Komunikasi", s.komunikasi||"Belum diisi"],
    ["Kemampuan Motorik", s.motorik||"Belum diisi"],
    ["Cara Belajar Dominan", s.caraBelajar||"Menunggu hasil pengamatan"],
    ["Rentang Konsentrasi", s.rentang||"Belum diisi"],
    ["Minat Awal", s.minat||"Belum diisi"],
    ["Riwayat Terapi", s.terapi||"Belum diisi"],
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <TBar title="Profil Siswa" sub={s.name} onBack={onBack}
        right={<button onClick={()=>onStartObs(s.id)} style={{background:A,color:"#fff",fontFamily:PJS,fontWeight:800,minHeight:42,borderRadius:14,padding:"0 16px",boxShadow:"0 4px 14px rgba(210,125,107,0.42)",border:"none",cursor:"pointer"}} className="flex items-center gap-1.5 text-xs active:scale-95 transition-transform"><ClipboardList size={14} strokeWidth={2.2}/>Pengamatan</button>}/>
      <div style={{background:CARD,borderBottom:`1px solid ${BDR}`}} className="px-4 py-3 flex items-center gap-3">
        <div style={{width:52,height:52,background:SEC,border:`1.5px solid rgba(91,122,104,0.25)`,flexShrink:0}} className="rounded-2xl flex items-center justify-center text-2xl">{s.emoji}</div>
        <div className="flex-1">
          <p className="font-bold text-base" style={{fontFamily:PJS,color:TEXT}}>{s.name}</p>
          <p className="text-xs" style={{color:MUTED}}>Kelas {s.kelas}{s.age?` · ${s.age} tahun`:""} · {s.teacher}</p>
          <div className="flex gap-1.5 mt-1"><Chip label={s.abk} color="purple"/><SBadge s={s.hasObs?"Berjalan":"Belum Dibaca"}/></div>
        </div>
      </div>
      <div className="flex" style={{background:CARD,borderBottom:`1px solid ${BDR}`}}>
        {[{k:"abk",l:"Profil ABK"},{k:"kode",l:"Kode Ortu"},{k:"jurnal",l:"Jurnal & Catatan"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as any)}
            style={{
              color:tab===t.k?DEEP:MUTED,
              borderBottom:tab===t.k?`3px solid ${DEEP}`:"3px solid transparent",
              fontFamily:PJS,
              fontWeight:tab===t.k?800:600,
              minHeight:44,flex:1
            }}
            className="py-2 text-xs transition-colors">{t.l}</button>
        ))}
      </div>
      <div className="px-4 pt-4 pb-6 space-y-2">
        {tab==="abk"&&(
          <>
            <div style={{background:DEEP,borderRadius:16,padding:"12px 14px",color:"#FFFFFF",boxShadow:"0 4px 14px rgba(91,122,104,0.22)"}} className="flex items-center gap-2 mb-3">
              <Edit3 size={15} style={{color:"#D4E8DA",flexShrink:0}}/>
              <p className="text-xs" style={{color:"#FFFFFF"}}>Data diinput oleh guru — dapat diperbarui kapan saja.</p>
            </div>
            {rows.map(([l,v])=>(
              <div key={l} style={{background:CARD,border:`1.5px solid rgba(91,122,104,0.35)`,borderRadius:16,boxShadow:"0 2px 8px rgba(91,122,104,0.06)"}} className="px-4 py-3">
                <p style={{fontSize:11,fontWeight:800,color:DEEP,fontFamily:PJS,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</p>
                <p style={{fontSize:14,fontWeight:700,color:TEXT,fontFamily:l.includes("Kode")?DMM:PJS,marginTop:3}}>{v}</p>
              </div>
            ))}
          </>
        )}

        {tab==="kode" && <KodeOrtuCard s={s} onRegen={onRegenKode}/>}

        {tab==="jurnal" && <JurnalTab s={s} laporan={laporan} onKirim={onKirim}/>}

        {/* Unduh laporan pemetaan untuk anak ini saja */}
        <button onClick={()=>exportLaporanPemetaan([s], namaSekolah)}
          style={{width:"100%",background:CARD,border:`1.5px solid ${DEEP}`,color:DEEP,fontFamily:PJS,fontWeight:800,minHeight:48,borderRadius:16,cursor:"pointer",boxShadow:"0 2px 8px rgba(91,122,104,0.08)"}}
          className="text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <FileText size={15}/>Unduh Laporan Pemetaan {s.name.split(" ")[0]}
        </button>
        <div className="flex gap-2 pt-2">
          <button onClick={()=>go("talent-map-detail")} style={{flex:1,background:DEEP,color:"#FFFFFF",fontFamily:PJS,fontWeight:800,minHeight:46,borderRadius:16,border:"none",cursor:"pointer",boxShadow:"0 4px 12px rgba(91,122,104,0.25)"}} className="text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"><Sparkles size={14}/>Talent Map</button>
          <button onClick={()=>go("learning-rec")} style={{flex:1,background:A,color:"#FFFFFF",fontFamily:PJS,fontWeight:800,minHeight:46,borderRadius:16,border:"none",cursor:"pointer",boxShadow:"0 4px 12px rgba(210,125,107,0.35)"}} className="text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"><Brain size={14}/>Rekomendasi</button>
        </div>
      </div>
    </div>
  );
}

// ─── TALENT MAP ──────────────────────────────────────────────────────
function TalentMapScreen({go,onStartObs,onSelect}:{go:(s:Screen)=>void;onStartObs:(id:number)=>void;onSelect:(id:number)=>void}) {
  const students = useStudents();
  const [selectedClass, setSelectedClass] = useState<string>("Semua");

  // Get unique list of classes
  const classes = Array.from(new Set(students.map(s => s.kelas))).sort();

  const filteredStudents = selectedClass === "Semua" 
    ? students 
    : students.filter(s => s.kelas === selectedClass);

  // Group filtered students by class
  const groupedByClass = classes.reduce((acc, k) => {
    const list = filteredStudents.filter(s => s.kelas === k);
    if (list.length > 0) acc[k] = list;
    return acc;
  }, {} as Record<string, typeof students>);

  const withObsCount = filteredStudents.filter(s => s.hasObs).length;
  const noObsCount = filteredStudents.filter(s => !s.hasObs).length;

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      {/* Header */}
      <div style={{background:CARD}} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Peta Bakat Siswa Per Kelas</p>
        <p className="text-xs" style={{color:MUTED}}>Hasil pemetaan potensi & bakat siswa dikelompokkan per kelas</p>
        
        {/* Class Filter Chips */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedClass("Semua")}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: IPS,
              background: selectedClass === "Semua" ? T : SEC,
              color: selectedClass === "Semua" ? "#fff" : DEEP,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
            Semua Kelas
          </button>
          {classes.map(k => (
            <button
              key={k}
              onClick={() => setSelectedClass(k)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: IPS,
                background: selectedClass === k ? T : SEC,
                color: selectedClass === k ? "#fff" : DEEP,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
              Kelas {k}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Metric Cards */}
        <div className="flex gap-2">
          <div className="flex-1 rounded-2xl p-3 text-center" style={{background:T}}>
            <p className="font-bold text-2xl text-white" style={{fontFamily:PJS}}>{withObsCount}</p>
            <p className="text-xs mt-0.5" style={{color:"rgba(255,255,255,0.75)"}}>Sudah dipetakan</p>
          </div>
          <div className="flex-1 rounded-2xl p-3 text-center" style={{background:CARD,border:`1px solid ${BDR}`}}>
            <p className="font-bold text-2xl" style={{fontFamily:PJS,color:A}}>{noObsCount}</p>
            <p className="text-xs mt-0.5" style={{color:MUTED}}>Belum pengamatan</p>
          </div>
          <div className="flex-1 rounded-2xl p-3 text-center" style={{background:CARD,border:`1px solid ${BDR}`}}>
            <p className="font-bold text-2xl" style={{fontFamily:PJS,color:TEXT}}>{filteredStudents.length}</p>
            <p className="text-xs mt-0.5" style={{color:MUTED}}>Total siswa</p>
          </div>
        </div>

        {/* Quick Link to Rekomendasi Lomba */}
        <div style={{
          background: `linear-gradient(135deg, ${A} 0%, #C46F5F 100%)`,
          borderRadius: 20,
          padding: "14px 16px",
          color: "#FFFFFF",
          boxShadow: "0 6px 18px rgba(210,125,107,0.30)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12
        }}>
          <div style={{display:"flex", alignItems:"center", gap: 10}}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "rgba(255,255,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0
            }}>
              🏆
            </div>
            <div>
              <p style={{fontFamily: PJS, fontSize: 13, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2}}>
                Rekomendasi Lomba & Agenda
              </p>
              <p style={{fontSize: 10.5, color: "rgba(255,255,255,0.88)", marginTop: 1}}>
                Lihat ajang lomba FLS2N, O2SN & LKSN sesuai minat siswa
              </p>
            </div>
          </div>
          <button onClick={()=>go("competition")}
            style={{
              background: "#FFFFFF",
              color: A,
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 11.5,
              padding: "8px 12px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexShrink: 0,
              boxShadow: "0 4px 10px rgba(0,0,0,0.10)"
            }}
            className="active:scale-95 transition-transform">
            Buka <ChevronRight size={13} strokeWidth={2.5}/>
          </button>
        </div>

        {/* Grouped Student List per Class */}
        {Object.keys(groupedByClass).length === 0 ? (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`}} className="rounded-2xl px-4 py-8 text-center">
            <p className="text-sm font-semibold" style={{color:MUTED}}>Tidak ada siswa di kelas ini.</p>
          </div>
        ) : (
          Object.entries(groupedByClass).map(([kelasName, classStudents]) => {
            const mappedInClass = classStudents.filter(s => s.hasObs);
            return (
              <div key={kelasName} className="space-y-2">
                {/* Class Section Header */}
                <div className="flex items-center justify-between px-1 pt-2">
                  <div className="flex items-center gap-2">
                    <div style={{width:26,height:26,background:SEC,borderRadius:8}} className="flex items-center justify-center text-xs font-bold text-[#5B7A68]">
                      🏫
                    </div>
                    <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Kelas {kelasName}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:SEC,color:DEEP}}>
                    {mappedInClass.length}/{classStudents.length} Dipetakan
                  </span>
                </div>

                {/* Students in this class */}
                <div className="space-y-2">
                  {classStudents.map(s => (
                    s.hasObs ? (
                      <button key={s.id} onClick={() => { onSelect(s.id); go("talent-map-detail"); }}
                        style={{background:CARD,border:`1px solid ${BDR}`,width:"100%",textAlign:"left"}}
                        className="rounded-2xl p-3.5 flex items-center gap-3 hover:bg-[#D4E8DA] transition-colors">
                        <div style={{width:44,height:44,background:SEC,flexShrink:0}} className="rounded-2xl flex items-center justify-center text-xl">{s.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{s.name}</p>
                          <p className="text-xs" style={{color:MUTED}}>{s.abk}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:SEC,color:T}}>{s.talent || "Menunggu analisis"}</span>
                            <div className="flex gap-0.5">
                              {Array.from({length:5}).map((_,i) => <Star key={i} size={10} style={{color:i<s.stars?A:"#E5E7EB",fill:i<s.stars?A:"#E5E7EB"}}/>)}
                            </div>
                            <span className="text-xs font-bold" style={{color:T,fontFamily:DMM}}>{s.talentScore}</span>
                          </div>
                          <div className="mt-1.5 h-1.5 rounded-full" style={{background:"#EDE9E3"}}>
                            <div className="h-full rounded-full" style={{width:`${s.talentScore}%`,background:T}}/>
                          </div>
                        </div>
                        <ChevronRight size={15} style={{color:MUTED,flexShrink:0}}/>
                      </button>
                    ) : (
                      <div key={s.id} style={{background:CARD,border:`1.5px dashed rgba(91,122,104,0.40)`,boxShadow:"0 2px 8px rgba(91,122,104,0.06)"}} className="rounded-2xl p-3.5 flex items-center gap-3">
                        <div style={{width:44,height:44,background:"#EDE9E3",flexShrink:0}} className="rounded-2xl flex items-center justify-center text-xl opacity-50">{s.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{color:MUTED}}>{s.name}</p>
                          <p className="text-xs" style={{color:MUTED}}>{s.abk}</p>
                          <p className="text-xs mt-1" style={{color:MUTED}}>Belum ada data pengamatan</p>
                        </div>
                        <button onClick={() => onStartObs(s.id)}
                          style={{
                            background:A,
                            color:"#fff",
                            fontFamily:PJS,
                            fontWeight:700,
                            fontSize:12,
                            minHeight:36,
                            padding:"0 12px",
                            borderRadius:12,
                            border:"none",
                            flexShrink:0,
                            boxShadow:"0 3px 10px rgba(210,125,107,0.38)",
                            cursor:"pointer"
                          }}
                          className="flex items-center gap-1.5 active:scale-95 transition-all">
                          <ClipboardList size={13}/> Mulai
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}



// ─── TALENT BAR CHART (Persentase Bakat dan Minat Anak) ─────────────
interface BarItem {
  id: string;
  label: string;
  pct: number;
  color: string;
  icon: string;
}

function TalentBarChart({ studentId }: { studentId: number }) {
  const items: BarItem[] = studentId === 2 ? [
    { id: "seni",       label: "Seni &\nKreativitas", pct: 75, color: "#FF5B8A", icon: "🎨" },
    { id: "teknologi",  label: "Teknologi &\nDigital", pct: 50, color: "#3B82F6", icon: "💻" },
    { id: "komunikasi", label: "Komunikasi",           pct: 70, color: "#F59E0B", icon: "💬" },
    { id: "sains",      label: "Sains &\nRiset",       pct: 40, color: "#8B5CF6", icon: "🧪" },
    { id: "olahraga",   label: "Olahraga",             pct: 88, color: "#10B981", icon: "🏃" },
  ] : [
    { id: "seni",       label: "Seni &\nKreativitas", pct: 85, color: "#FF5B8A", icon: "🎨" },
    { id: "teknologi",  label: "Teknologi &\nDigital", pct: 72, color: "#3B82F6", icon: "💻" },
    { id: "komunikasi", label: "Komunikasi",           pct: 60, color: "#F59E0B", icon: "💬" },
    { id: "sains",      label: "Sains &\nRiset",       pct: 45, color: "#8B5CF6", icon: "🧪" },
    { id: "olahraga",   label: "Olahraga",             pct: 30, color: "#10B981", icon: "🏃" },
  ];

  return (
    <div style={{
      background: CARD,
      border: `1.5px solid rgba(91,122,104,0.30)`,
      borderRadius: 24,
      padding: "20px 14px 18px",
      boxShadow: "0 4px 16px rgba(91,122,104,0.08)"
    }}>
      <h3 style={{
        fontFamily: PJS,
        fontSize: 16,
        fontWeight: 800,
        color: "#1E293B",
        marginBottom: 16,
        paddingLeft: 4
      }}>
        Persentase Bakat dan Minat Anak
      </h3>

      {/* Chart container with Y-Axis */}
      <div style={{ display: "flex", gap: 8, height: 200 }}>
        {/* Y-axis labels */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingBottom: 2,
          paddingRight: 4,
          fontFamily: DMM,
          fontSize: 10,
          color: "#94A3B8",
          fontWeight: 700,
          width: 32,
          flexShrink: 0
        }}>
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        {/* Bars and grid lines container */}
        <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
          {/* Horizontal grid lines */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none"
          }}>
            {[100, 75, 50, 25, 0].map(val => (
              <div key={val} style={{
                borderBottom: val === 0 ? "1.5px solid #CBD5E1" : "1px dashed #E2E8F0",
                width: "100%"
              }}/>
            ))}
          </div>

          {/* Bars columns */}
          <div style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around"
          }}>
            {items.map(b => (
              <div key={b.id} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
                width: 44
              }}>
                {/* Percentage label above bar */}
                <span style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: b.color,
                  fontFamily: PJS,
                  marginBottom: 6,
                  lineHeight: 1
                }}>
                  {b.pct}%
                </span>

                {/* Vertical bar */}
                <div style={{
                  width: 36,
                  height: `${(b.pct / 100) * 82}%`,
                  background: b.color,
                  borderRadius: "12px 12px 3px 3px",
                  boxShadow: `0 4px 12px ${b.color}45`,
                  transition: "height 0.5s ease"
                }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories below chart */}
      <div style={{ display: "flex", paddingLeft: 40, marginTop: 12, justifyContent: "space-around" }}>
        {items.map(b => (
          <div key={b.id} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 52
          }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: `${b.color}15`,
              border: `1.5px solid ${b.color}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16
            }}>
              {b.icon}
            </div>
            <p style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "#1E293B",
              fontFamily: PJS,
              textAlign: "center",
              lineHeight: 1.25,
              marginTop: 6,
              whiteSpace: "pre-line"
            }}>
              {b.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TalentMapDetailScreen({onBack,studentId,go}:{onBack:()=>void;studentId:number;go:(s:Screen)=>void}) {
  const students = useStudents();
  const s = students.find(x=>x.id===studentId);
  const data = studentTalentDetail[studentId];
  if (!s) return null;

  const getDomainStyle = (title: string) => {
    if (title.includes("Seni") || title.includes("Kreatif") || title.includes("Visual")) {
      return { color: "#FF5B8A", bg: "#FFF1F5", border: "#FECDD3", icon: "🎨" };
    }
    if (title.includes("Spasial") || title.includes("Digital") || title.includes("Teknologi")) {
      return { color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE", icon: "💻" };
    }
    if (title.includes("Musik") || title.includes("Komunikasi") || title.includes("Perkusi")) {
      return { color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", icon: "💬" };
    }
    if (title.includes("Sains") || title.includes("Verbal") || title.includes("Kognitif")) {
      return { color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE", icon: "🧪" };
    }
    return { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", icon: "🏃" };
  };

  const competitionBanner = (
    <div style={{
      background: `linear-gradient(135deg, ${A} 0%, #C46F5F 100%)`,
      borderRadius: 22,
      padding: "16px 18px",
      color: "#FFFFFF",
      boxShadow: "0 8px 24px rgba(210,125,107,0.32)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }}>
      <div style={{display:"flex", alignItems:"center", gap: 12, minWidth: 0}}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: "rgba(255,255,255,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0, backdropFilter: "blur(4px)"
        }}>
          🏆
        </div>
        <div style={{minWidth: 0}}>
          <p style={{fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2}}>
            Rekomendasi Lomba & Agenda
          </p>
          <p style={{fontSize: 11, color: "rgba(255,255,255,0.92)", marginTop: 2, lineHeight: 1.3}}>
            Lihat ajang lomba FLS2N, O2SN & LKSN yang cocok untuk {s.name.split(" ")[0]}
          </p>
        </div>
      </div>
      <button onClick={()=>go("competition")}
        style={{
          background: "#FFFFFF",
          color: A,
          fontFamily: PJS,
          fontWeight: 800,
          fontSize: 12,
          padding: "9px 14px",
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexShrink: 0
        }}
        className="active:scale-95 transition-transform">
        Lihat <ChevronRight size={13} strokeWidth={2.5}/>
      </button>
    </div>
  );

  if (!data) {
    return (
      <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
        <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack}
          right={<button onClick={()=>go("competition")} style={{background:A,color:"#FFFFFF",fontFamily:PJS,fontWeight:800,minHeight:38,borderRadius:12,padding:"0 12px",boxShadow:"0 3px 10px rgba(210,125,107,0.35)",border:"none",cursor:"pointer"}} className="flex items-center gap-1.5 text-xs active:scale-95 transition-transform"><Trophy size={14} strokeWidth={2.2}/>Lomba</button>}/>
        <div className="px-4 pt-4 pb-6 space-y-4">
          <TalentBarChart studentId={studentId}/>
          {competitionBanner}
          <div style={{background:CARD,border:`1.5px solid rgba(91,122,104,0.30)`,borderRadius:24,padding:18,boxShadow:"0 4px 16px rgba(91,122,104,0.08)"}}>
            <div className="flex items-center gap-2 mb-3"><Sparkles size={16} style={{color:A}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Ringkasan Bakat</p></div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-bold text-sm" style={{color:TEXT}}>{s.talent||"Belum teridentifikasi"}</p>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={12} style={{color:i<s.stars?A:"#E5E7EB",fill:i<s.stars?A:"#E5E7EB"}}/>)}</div>
                <span className="text-xs font-bold" style={{color:DEEP,fontFamily:DMM}}>{s.talentScore}</span>
              </div>
            </div>
            <div className="h-2 rounded-full mb-2" style={{background:"#EDE9E3"}}><div className="h-full rounded-full" style={{width:`${s.talentScore}%`,background:A}}/></div>
            <div style={{background:"#F5F9F7",border:`1.5px solid rgba(91,122,104,0.25)`,borderRadius:16,padding:"12px 14px"}} className="flex items-start gap-2">
              <Info size={14} style={{color:DEEP,flexShrink:0,marginTop:2}}/>
              <p className="text-xs leading-relaxed" style={{color:TEXT}}>
                Analisis mendalam akan tersedia setelah beberapa sesi pengamatan. Gaya belajar sementara: <strong>{s.caraBelajar||"belum terdeteksi"}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack}
        right={<button onClick={()=>go("competition")} style={{background:A,color:"#FFFFFF",fontFamily:PJS,fontWeight:800,minHeight:38,borderRadius:12,padding:"0 12px",boxShadow:"0 3px 10px rgba(210,125,107,0.35)",border:"none",cursor:"pointer"}} className="flex items-center gap-1.5 text-xs active:scale-95 transition-transform"><Trophy size={14} strokeWidth={2.2}/>Lomba</button>}/>
      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Diagram Batang: Persentase Bakat dan Minat Anak */}
        <TalentBarChart studentId={studentId}/>

        {/* Link Menuju Rekomendasi Lomba */}
        {competitionBanner}

        {/* Hasil Talent Mapping List with distinct colorful badges & accents */}
        <div style={{background:CARD,border:`1.5px solid rgba(91,122,104,0.30)`,borderRadius:24,padding:18,boxShadow:"0 4px 16px rgba(91,122,104,0.08)"}}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} style={{color:A}}/>
            <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Hasil Talent Mapping</p>
          </div>
          {data.domains.map((x,idx)=>{
            const ds = getDomainStyle(x.t);
            return (
              <div key={x.t} className="mb-4 last:mb-0 pb-4 last:pb-0" style={{borderBottom:idx<data.domains.length-1?`1px solid rgba(91,122,104,0.18)`:"none"}}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span style={{fontSize:16}}>{ds.icon}</span>
                    <p className="font-bold text-sm" style={{color:TEXT,fontFamily:PJS}}>{x.t}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={13} style={{color:i<x.st?ds.color:"#CBD5E1",fill:i<x.st?ds.color:"#CBD5E1"}}/>)}</div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:ds.bg,color:ds.color,border:`1px solid ${ds.border}`,fontFamily:DMM}}>{x.sc}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full mb-2.5" style={{background:"#EDE9E3"}}>
                  <div className="h-full rounded-full transition-all" style={{width:`${x.sc}%`,background:ds.color}}/>
                </div>
                <div style={{background:ds.bg,border:`1.5px solid ${ds.border}`,borderRadius:14,padding:"10px 12px"}} className="flex items-start gap-2">
                  <Info size={13} style={{color:ds.color,flexShrink:0,marginTop:2}}/>
                  <p className="text-xs leading-relaxed" style={{color:TEXT}}><strong>Mengapa:</strong> {x.r}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── LEARNING REC ────────────────────────────────────────────────────
function LearningRecScreen({onBack,studentId}:{onBack:()=>void;studentId:number}) {
  const students = useStudents();
  const s = students.find(x=>x.id===studentId);
  const nama = s?.name.split(" ")[0] ?? "Siswa";
  const gaya = s?.caraBelajar || "Visual";
  const meta = GAYA_META[gaya] ?? GAYA_META["Visual"];

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <TBar title="Rekomendasi Pembelajaran" sub={`${nama} · Gaya ${gaya}`} onBack={onBack}/>
      <div className="px-4 pt-4 pb-6 space-y-3">
        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3"><CheckSquare size={16} style={{color:DEEP}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Strategi yang Disarankan</p></div>
          {meta.strategi.map(t=>(
            <div key={t} style={{background:CARD,border:`1.5px solid rgba(91,122,104,0.32)`,borderRadius:14,boxShadow:"0 2px 6px rgba(91,122,104,0.06)"}} className="p-3 mb-2 last:mb-0">
              <div className="flex items-start gap-2"><CheckCircle size={16} style={{color:DEEP,flexShrink:0,marginTop:2}}/><p className="text-sm font-semibold" style={{color:TEXT}}>{t}</p></div>
            </div>
          ))}
          <div style={{background:DEEP,borderRadius:14,color:"#FFFFFF",boxShadow:"0 3px 10px rgba(91,122,104,0.22)"}} className="px-3.5 py-3 mt-2 flex items-start gap-2">
            <Target size={15} style={{color:"#D4E8DA",flexShrink:0,marginTop:2}}/>
            <p className="text-xs leading-relaxed" style={{color:"#FFFFFF"}}>Strategi ini dipilih AI karena gaya belajar dominan {nama} adalah <strong style={{color:"#D4E8DA"}}>{gaya}</strong>.</p>
          </div>
        </div>

        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3"><XCircle size={16} style={{color:A}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Strategi yang Dihindari</p></div>
          {meta.hindari.map(t=>(
            <div key={t} style={{background:"rgba(210,125,107,0.10)",border:`1.5px solid rgba(210,125,107,0.35)`,borderRadius:14}} className="p-3 mb-2 last:mb-0">
              <div className="flex items-start gap-2"><XCircle size={16} style={{color:A,flexShrink:0,marginTop:2}}/><p className="text-sm font-semibold" style={{color:TEXT}}>{t}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COMPETITION ─────────────────────────────────────────────────────
function CompetitionScreen({onStartObs, agendas, onAddAgenda}:{onStartObs:(id:number)=>void, agendas:any[], onAddAgenda:(a:any)=>void}) {
  const students = useStudents();
  const withObs = students.filter(s=>s.hasObs);
  const [mainTab, setMainTab] = useState<"agenda"|"lomba">("agenda");
  const [viewMode, setViewMode] = useState<"lomba"|"siswa">("lomba");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({type:"sekolah", title:"", date:"", desc:""});

  const handleSubmit = () => {
    if(!form.title || !form.date) return;
    onAddAgenda({...form, id:Date.now()});
    setShowAdd(false);
    setForm({type:"sekolah", title:"", date:"", desc:""});
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <div style={{background:CARD}} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Agenda & Lomba</p>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Main Tabs */}
        <div className="flex rounded-2xl p-1" style={{background:"#EDE9E3"}}>
          {(["agenda","lomba"] as const).map(m=>(
            <button key={m} onClick={()=>setMainTab(m)}
              style={{background:mainTab===m?CARD:"transparent",color:mainTab===m?TEXT:MUTED,fontFamily:IPS,minHeight:40}}
              className="flex-1 rounded-xl text-xs font-bold transition-all capitalize">
              {m==="agenda"?"Agenda Sekolah":"Rekomendasi Lomba"}
            </button>
          ))}
        </div>

        {mainTab === "agenda" && (
          <div className="space-y-4">
             <button onClick={()=>setShowAdd(true)} className="w-full flex items-center justify-center gap-1.5 text-white rounded-2xl py-3.5 text-sm font-bold active:scale-[0.98] transition-transform" style={{background:A,fontFamily:PJS,boxShadow:"0 6px 20px rgba(210,125,107,0.42)",border:"none",cursor:"pointer"}}>
               <Plus size={16} strokeWidth={2.5}/> Tambah Agenda
             </button>

             <div className="space-y-3">
                {agendas.length === 0 ? (
                  <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-6 text-center">
                    <Calendar size={28} style={{color:MUTED,margin:"0 auto 8px"}}/>
                    <p className="text-sm font-semibold" style={{color:MUTED}}>Belum ada agenda aktif.</p>
                  </div>
                ) : (
                  agendas.map(a => (
                    <div key={a.id} style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide" style={{background:a.type==="sekolah"?"#E3F2FD":"#FFF3E0", color:a.type==="sekolah"?"#1565C0":"#E65100"}}>{a.type}</span>
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
            <div style={{background:DEEP,borderRadius:18,color:"#FFFFFF",boxShadow:"0 4px 14px rgba(91,122,104,0.25)"}} className="p-3.5 flex items-start gap-2.5">
              <Info size={16} style={{color:"#D4E8DA",flexShrink:0,marginTop:2}}/>
              <p className="text-xs leading-relaxed" style={{color:"#FFFFFF"}}>Hanya 3 lomba resmi. Pendaftaran manual oleh sekolah — klik <strong style={{color:"#D4E8DA"}}>"Daftarkan"</strong> untuk ubah status.</p>
            </div>

            <div className="flex rounded-2xl p-1" style={{background:"#EDE9E3"}}>
              {(["lomba","siswa"] as const).map(m=>(
                <button key={m} onClick={()=>setViewMode(m)}
                  style={{
                    background:viewMode===m?DEEP:"transparent",
                    color:viewMode===m?"#fff":MUTED,
                    fontFamily:PJS,
                    fontWeight:viewMode===m?800:600,
                    minHeight:36
                  }}
                  className="flex-1 rounded-lg text-xs transition-all capitalize">
                  {m==="lomba"?"Per Lomba":"Per Siswa"}
                </button>
              ))}
            </div>

            {viewMode==="lomba" && LOMBA.map(lomba=>{
              const matched = studentCompDetail[lomba.k] ?? [];
              const matchedStudents = matched
                .map(m=>({...m,student:students.find(s=>s.id===m.id)}))
                .filter((m): m is typeof m & {student:Student} => !!m.student);
              return (
                <div key={lomba.k} style={{background:CARD,border:`1px solid ${BDR}`,boxShadow:"0 2px 10px rgba(91,122,104,0.08)"}} className="rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3" style={{borderBottom:`1px solid ${BDR}`,background:DEEP,color:"#FFFFFF"}}>
                    <span className="text-xl">{lomba.icon}</span>
                    <div>
                      <p className="font-bold text-sm" style={{fontFamily:PJS,color:"#FFFFFF"}}>{lomba.k}</p>
                      <p className="text-xs" style={{color:"rgba(255,255,255,0.85)"}}>{lomba.full}</p>
                    </div>
                    <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full" style={{background:A,color:"#fff",fontFamily:PJS}}>{matchedStudents.length} siswa</span>
                  </div>
                  {matchedStudents.length===0
                    ? <p className="px-4 py-3 text-xs" style={{color:MUTED}}>Belum ada siswa yang cocok dengan lomba ini.</p>
                    : matchedStudents.map((m,i)=>(
                        <div key={m.id} className="px-4 py-3 flex items-center gap-3" style={{borderBottom:i<matchedStudents.length-1?`1px solid ${BDR}`:"none"}}>
                          <span className="text-lg flex-shrink-0">{m.student.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{color:TEXT}}>{m.student.name}</p>
                            <p className="text-xs" style={{color:MUTED}}>Cabang: {m.cabang}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="h-2 flex-1 rounded-full" style={{background:"#EDE9E3"}}><div className="h-full rounded-full" style={{width:`${m.match}%`,background:DEEP}}/></div>
                              <span className="text-xs font-bold flex-shrink-0" style={{color:DEEP,fontFamily:DMM}}>{m.match}%</span>
                            </div>
                            <p className="text-xs leading-relaxed mt-1.5" style={{color:MUTED}}>💡 {m.alasan}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <SBadge s={m.status}/>
                            {m.status!=="Didaftarkan" &&
                              <button style={{background:A,color:"#fff",fontFamily:IPS,minHeight:32}} className="px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                                <CheckSquare size={11}/>Daftarkan
                              </button>
                            }
                          </div>
                        </div>
                      ))
                  }
                </div>
              );
            })}

            {viewMode==="siswa" && (
              <div className="space-y-3">
                {withObs.length===0 && (
                  <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-6 text-center">
                    <Lock size={28} style={{color:MUTED,margin:"0 auto 8px"}}/>
                    <p className="text-sm font-semibold" style={{color:MUTED}}>Belum ada siswa yang memiliki hasil pengamatan.</p>
                  </div>
                )}
                {withObs.map(s=>(
                  <div key={s.id} style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3" style={{borderBottom:`1px solid ${BDR}`}}>
                      <span className="text-xl">{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{s.name}</p>
                        <p className="text-xs" style={{color:MUTED}}>{s.abk}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background:SEC,color:T}}>{s.comps.length} lomba</span>
                    </div>
                    {s.comps.length===0
                      ? <p className="px-4 py-3 text-xs" style={{color:MUTED}}>Belum ada rekomendasi lomba untuk siswa ini.</p>
                      : s.comps.map((c,i)=>{
                          const detail = studentCompDetail[c]?.find(d=>d.id===s.id);
                          return (
                            <div key={c} className="px-4 py-3 flex items-center justify-between" style={{borderBottom:i<s.comps.length-1?`1px solid ${BDR}`:"none"}}>
                              <div>
                                <p className="font-semibold text-sm" style={{color:TEXT}}>{c}</p>
                                <p className="text-xs" style={{color:MUTED}}>Cabang: {detail?.cabang ?? "—"} · {detail?.match ?? "—"}% cocok</p>
                              </div>
                              <SBadge s={detail?.status ?? "Direkomendasikan"}/>
                            </div>
                          );
                        })
                    }
                  </div>
                ))}

                {students.filter(s=>!s.hasObs).map(s=>(
                  <div key={s.id} style={{background:CARD,border:`1.5px dashed rgba(91,122,104,0.40)`,boxShadow:"0 2px 8px rgba(91,122,104,0.06)"}} className="rounded-2xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl opacity-40">{s.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{color:MUTED}}>{s.name}</p>
                      <p className="text-xs" style={{color:MUTED}}>Rekomendasi tersedia setelah pengamatan selesai.</p>
                    </div>
                    <button onClick={()=>onStartObs(s.id)}
                      style={{
                        background:A,
                        color:"#fff",
                        fontFamily:PJS,
                        fontWeight:700,
                        fontSize:12,
                        minHeight:36,
                        padding:"0 12px",
                        borderRadius:12,
                        border:"none",
                        flexShrink:0,
                        boxShadow:"0 3px 10px rgba(210,125,107,0.38)",
                        cursor:"pointer"
                      }}
                      className="flex items-center gap-1.5 active:scale-95 transition-all">
                      <ClipboardList size={13}/> Pengamatan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 space-y-4">
            <h3 className="font-bold text-lg">Tambah Agenda</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Jenis</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none">
                  <option value="sekolah">Agenda Sekolah</option>
                  <option value="lomba">Lomba</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-semibold block mb-1">Judul Agenda/Lomba</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Contoh: Lomba FLS2N" className="w-full border rounded-xl px-3 py-2 text-sm outline-none"/>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Tanggal</label>
                <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none"/>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Deskripsi (Opsional)</label>
                <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={2} placeholder="Keterangan singkat..." className="w-full border rounded-xl px-3 py-2 text-sm outline-none"/>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm font-semibold border bg-gray-50">Batal</button>
              <button onClick={handleSubmit} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-green-700 text-white" style={{background:T}}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REPORT ──────────────────────────────────────────────────────────
function ReportScreen({namaSekolah}:{namaSekolah:string}) {
  const students = useStudents();
  const [pilihEkspor,setPilihEkspor] = useState<Set<number>>(new Set());
  const [toastEkspor,setToastEkspor] = useState("");

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <div style={{background:CARD}} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Ekspor Data & Laporan</p>
        <p className="text-xs" style={{color:MUTED}}>Unduh berkas laporan pemetaan bakat dan rekap data siswa</p>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Ekspor data & laporan pemetaan */}
        <div>
          <p className="font-bold text-sm mb-1" style={{fontFamily:PJS,color:TEXT}}>Ekspor Data & Laporan Pemetaan</p>
          <p className="text-xs mb-2.5 leading-relaxed" style={{color:MUTED}}>
            Unduh rekap seluruh siswa, atau pilih anak tertentu saja.
          </p>
          <div className="space-y-2.5">
            <StudentPicker pilih={pilihEkspor} setPilih={setPilihEkspor}/>
            <ExportPanel
              list={pilihEkspor.size ? students.filter(s=>pilihEkspor.has(s.id)) : students}
              adaSeleksi={pilihEkspor.size>0}
              namaSekolah={namaSekolah}
              onDone={t=>{setToastEkspor(t);setTimeout(()=>setToastEkspor(""),2400);}}
              judul="Unduh Berkas"
            />
          </div>
          {toastEkspor && (
            <div className="mt-2 rounded-xl px-3 py-2.5 flex items-center gap-2" style={{background:SEC}}>
              <CheckCircle size={14} style={{color:T,flexShrink:0}}/>
              <p className="text-xs font-semibold" style={{color:DEEP}}>{toastEkspor}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────
const MAIN_SCREENS:Screen[] = [
  "dashboard","students","talent-map","competition","report",
  "parent-dashboard","parent-detail","parent-calendar","parent-training",
];

type GuruSetup = null | "akun" | "sekolah" | "siswa";

const DEFAULT_GURU: GuruProfile = {
  nama: "Sari Dewi, S.Pd.",
  email: "sari.dewi@gmail.com",
  sekolah: "",
  jabatan: "",
  noHp: "",
  kelas: [],
  abk: [],
  kelasAbkMap: {},
};

export default function App() {
  // Auth & navigasi
  const [role,setRole]           = useState<Role|null>(null);
  const [pendingRole,setPending] = useState<Role>("guru");
  const [screen,setScreen]       = useState<Screen>("landing");
  const [tab,setTab]             = useState<Screen>("dashboard");

  
  // Data siswa
  const [agendas, setAgendas] = useState<any[]>([
    { id: 1, type: "sekolah", title: "Pentas Seni Inklusif", date: "2026-08-15", desc: "Acara tahunan sekolah menampilkan bakat siswa." },
    { id: 2, type: "lomba", title: "O2SN Diksus", date: "2026-09-10", desc: "Lomba olahraga bagi PDBK (Bocce, Lari, dll)." }
  ]);

  const [list,setList] = useState<Student[]>(seedStudents);
  const addStudent = (s:Omit<Student,"id">) => {
    const created:Student = {...s, id: Math.max(0,...list.map(x=>x.id)) + 1};
    setList(prev=>[...prev,created]);
    return created;
  };

  // Guru
  const [laporan,setLaporan] = useState<LaporanKirim[]>(seedLaporan);
  const [guru,setGuru]           = useState<GuruProfile>(DEFAULT_GURU);
  const [guruSetup,setGuruSetup] = useState<GuruSetup>(null);
  const [showAddStudent,setShowAddStudent] = useState(false);
  const [addFirstTime,setAddFirstTime]     = useState(false);
  const [showOnboarding,setShowOnboarding] = useState(false);

  // Orang tua
  const [namaOrtu] = useState("Ani Rahmawati");
  const [childId,setChildId] = useState<number|null>(null);
  const [showLinkCode,setShowLinkCode] = useState(false);
  const child = childId!==null ? (list.find(s=>s.id===childId) ?? null) : null;

  // Seleksi & UI global
  const [selectedStudentId,setSelectedStudentId] = useState<number>(1);
  const [fontSize,setFontSize] = useState(1);
  const [tts,setTts]           = useState(false);
  const [showSearch,setShowSearch]     = useState(false);
  const [showSettings,setShowSettings] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize * 16}px`);
  }, [fontSize]);

  const go    = (s:Screen) => setScreen(s);
  const goTab = (s:Screen) => { setScreen(s); setTab(s); };

  // ── Flow login ──
  const pickRole = (r:Role) => { setPending(r); go("google-login"); };

  const googleSuccess = () => {
    if (pendingRole==="guru") {
      setRole("guru"); setScreen("dashboard"); setTab("dashboard");
      setGuruSetup("akun");
    } else {
      go("parent-code");
    }
  };

  const finishGuruSetup = () => {
    setGuruSetup(null);
    setShowOnboarding(true);
  };

  const enterParent = (linkedId:number|null) => {
    setRole("ortu"); setChildId(linkedId);
    setScreen("parent-dashboard"); setTab("parent-dashboard");
  };

  const handleLogout = () => {
    setRole(null);
    setScreen("landing");
    setGuruSetup(null);
    setShowSettings(false);
  };

  // Demo switcher — lompat langsung tanpa mengulang setup
  const demoSwitch = (r:Role) => {
    setRole(r);
    if (r==="guru") { setGuruSetup(null); setShowOnboarding(false); goTab("dashboard"); }
    else { setChildId(id=>id ?? 1); goTab("parent-dashboard"); }
  };

  const logout = () => {
    setRole(null); setGuruSetup(null); setShowOnboarding(false);
    setChildId(null); setScreen("landing");
  };

  const startObs = (id:number) => { setSelectedStudentId(id); go("observation"); };

  const finishObs = (id:number) => {
    setList(prev=>prev.map(s=>s.id===id
      ? {...s,
         hasObs:true,
         talent: s.talent || "Seni Visual",
         talentScore: s.talentScore || 72,
         stars: s.stars || 4,
         caraBelajar: s.caraBelajar || "Visual & Kinestetik"}
      : s));
    setSelectedStudentId(id);
    goTab("talent-map");
  };

  const openAddStudent = (firstTime=false) => { setAddFirstTime(firstTime); setShowAddStudent(true); };

  /** Guru merangkap peran admin: dialah yang membuat & memperbarui kode orang tua. */
  const regenKode = (id:number) => setList(prev=>prev.map(s=>{
    if (s.id!==id) return s;
    const seri = Math.random().toString(36).slice(2,6).toUpperCase();
    return {...s, kodeOrtu:`ABK-2026-${s.name.split(" ")[0].toUpperCase()}-${seri}`};
  }));

  // Laporan satu arah: guru mengirim, orang tua hanya membaca.
  const kirimLaporan = (studentId:number, isi:string) => setLaporan(prev=>[
    ...prev,
    {
      id: Math.max(0,...prev.map(l=>l.id)) + 1,
      studentId, isi,
      judul: `Laporan ${new Date().toLocaleDateString("id-ID",{month:"long",year:"numeric"})}`,
      dikirimPada: new Date().toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"}),
      dibaca: false,
    },
  ]);
  const tandaiDibaca = (id:number) => setLaporan(prev=>prev.map(l=>
    l.id===id && !l.dibaca
      ? {...l, dibaca:true, dibacaPada:new Date().toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
      : l));

  const buatKode = (ids:number[]) => setList(prev=>prev.map(s=>{
    if (!ids.includes(s.id)) return s;
    const seri = Math.random().toString(36).slice(2,6).toUpperCase();
    return {...s, kodeOrtu:`ABK-2026-${s.name.split(" ")[0].toUpperCase()}-${seri}`};
  }));
  const hapusKode = (ids:number[]) =>
    setList(prev=>prev.map(s=>ids.includes(s.id) ? {...s, kodeOrtu:undefined} : s));

  const isMain  = MAIN_SCREENS.includes(screen);
  const showNav = !!role && isMain && !guruSetup;

  const goBack = () => {
    if (screen==="kode-akses")              goTab("dashboard");
    else if (screen==="pengamatan-pending") goTab("dashboard");
    else if (screen==="profile")            goTab("students");
    else if (screen==="observation")        go("profile");
    else if (screen==="talent-map-detail")  goTab("talent-map");
    else if (screen==="learning-rec")       go("profile");
    else if (screen==="parent-detail")      goTab("parent-dashboard");
    else if (screen==="google-login")       go("role-select");
    else if (screen==="role-select")        go("landing");
    else if (screen==="parent-code")        go("google-login");
    else goTab(tab);
  };

  const headerTitle = (): [string,string] => {
    switch(screen) {
      case "dashboard":       return ["Beranda", `${guru.nama.split(" ")[0]} · ${guru.sekolah}`];
      case "pengamatan-pending":return ["Pengamatan Perlu Diperiksa", "Daftar siswa yang belum dinilai"];
      case "students":        return ["Kelas Saya", "Kelola Kelas dengan Mudah"];
      case "talent-map":      return ["Peta Bakat", guru.sekolah];
      case "competition":     return ["Agenda", "Agenda & Rekomendasi Lomba"];
      case "report":          return ["Laporan", "Untuk orang tua"];
      case "parent-dashboard":return ["Beranda", child?`Orang Tua · ${child.name}`:"Orang Tua · belum terhubung"];
      case "parent-detail":   return ["Perkembangan Anak", child?child.name:"Belum terhubung"];
      case "parent-calendar": return ["Kalender", child?`Umum + agenda ${guru.sekolah}`:"Kegiatan terbuka untuk umum"];
      case "parent-training": return ["Pelatihan & Terapi", "Info umum layanan terdekat"];
      default: return ["",""];
    }
  };

  const renderScreen = () => {
    switch(screen) {
      case "landing":      return <LandingScreen onNext={()=>go("role-select")}/>;
      case "role-select":  return <RoleSelectScreen onPick={pickRole} onBack={()=>go("landing")}/>;
      case "google-login": return <GoogleLoginScreen role={pendingRole} onBack={()=>go("role-select")} onSuccess={googleSuccess}/>;
      case "parent-code":  return (
        <ParentCodeScreen
          namaOrtu={namaOrtu}
          onBack={()=>go("google-login")}
          onLinked={(kode)=>{
            const found = list.find(s=>s.kodeOrtu?.toUpperCase()===kode);
            enterParent(found ? found.id : 1);
          }}
          onSkip={()=>enterParent(null)}
        />
      );

      case "dashboard":        return <DashboardGuru go={go} onStartObs={startObs} guru={guru} onAddStudent={()=>openAddStudent(false)}/>;
      case "pengamatan-pending": return <PengamatanPendingScreen onBack={goBack} onStartObs={startObs}/>;
      case "students":         return <StudentsScreen go={go} onAddStudent={()=>openAddStudent(false)} onSelect={(id)=>{setSelectedStudentId(id);go("profile");}} guru={guru}/>;
      case "profile":          return <ProfileScreen onBack={goBack} go={go} studentId={selectedStudentId} onStartObs={startObs} onRegenKode={regenKode} namaSekolah={guru.sekolah} laporan={laporan} onKirim={kirimLaporan}/>;
      case "kode-akses":       return <KodeAksesScreen onBack={goBack} onBuat={buatKode} onHapus={hapusKode} namaSekolah={guru.sekolah}/>;
      case "observation":      return <ObservationScreen onBack={goBack} onDone={finishObs} studentId={selectedStudentId}/>;
      case "talent-map":       return <TalentMapScreen go={go} onStartObs={startObs} onSelect={setSelectedStudentId}/>;
      case "talent-map-detail":return <TalentMapDetailScreen onBack={goBack} studentId={selectedStudentId} go={go}/>;
      case "learning-rec":     return <LearningRecScreen onBack={goBack} studentId={selectedStudentId}/>;
      case "competition":      return <CompetitionScreen onStartObs={startObs} agendas={agendas} onAddAgenda={(a)=>setAgendas([...agendas,a])}/>;
      case "report":           return <ReportScreen namaSekolah={guru.sekolah}/>;

      case "parent-dashboard": return <ParentDashboard go={go} child={child} namaOrtu={namaOrtu} onOpenCode={()=>setShowLinkCode(true)}/>;
      case "parent-detail":    return <ParentDetailScreen onBack={goBack} child={child} onOpenCode={()=>setShowLinkCode(true)} laporan={child?laporan.filter(l=>l.studentId===child.id):[]} onBaca={tandaiDibaca}/>;
      case "parent-calendar":  return <ParentCalendarScreen linked={!!child} sekolah={guru.sekolah} onOpenCode={()=>setShowLinkCode(true)}/>;
      case "parent-training":  return <ParentTrainingScreen go={go}/>;
      default: return null;
    }
  };

  const uiCtx:UICtx = {
    fontSize, setFontSize, tts, setTts,
    openSearch:()=>setShowSearch(true),
    openSettings:()=>setShowSettings(true),
  };

  const [title,sub] = headerTitle();

  return (
  <StudentsCtx.Provider value={{list, add:addStudent}}>
  <UI.Provider value={uiCtx}>
    <div className="min-h-screen w-full flex items-center justify-center" style={{background:"#EBF3ED",fontFamily:PJS}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{background:`${T}25`}}/>
        <div className="absolute bottom-16 right-16 w-80 h-80 rounded-full opacity-30 blur-3xl" style={{background:`${A}18`}}/>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 py-8">
        {/* Demo switcher */}
        {!!role && (
          <div className="flex items-center gap-1 p-1 rounded-2xl" style={{background:"rgba(255,255,255,0.85)",border:`1px solid rgba(91,122,104,0.12)`}}>
            {(["guru","ortu"] as Role[]).map(r=>(
              <button key={r} onClick={()=>demoSwitch(r)} style={{background:role===r?T:"transparent",color:role===r?"#fff":MUTED,fontFamily:IPS,minHeight:38}} className="px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                <img src={r==="guru"?guruIcon:ortuIcon} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                {r==="guru"?"Guru":"Orang Tua"}
              </button>
            ))}
            <button onClick={logout} style={{minWidth:36,minHeight:38,color:MUTED}} className="flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors" title="Keluar">
              <LogOut size={14}/>
            </button>
          </div>
        )}

        {/* Phone frame */}
        <div style={{
          width:393, height:852, background:BG, borderRadius:47,
          display:"flex", flexDirection:"column", overflow:"hidden",
          boxShadow:"0 40px 80px rgba(91,122,104,0.22), 0 0 0 8px #1A1F23, 0 0 0 9.5px #2E3438",
          position:"relative",
        }}>
          {/* Notch */}
          <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:126,height:34,background:"#1A1F23",borderRadius:"0 0 20px 20px",zIndex:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#2E3438"}}/>
            <div style={{width:48,height:6,borderRadius:3,background:"#2E3438"}}/>
          </div>

          {screen!=="landing" && (
            <div style={{background:BG,paddingTop:36,flexShrink:0}}>
              <StatusBar/>
            </div>
          )}
          {/* Content */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:BG,position:"relative",fontSize:`${fontSize}rem`}}>
            {showNav && screen !== "dashboard" && screen !== "students" && <GlobalHeader title={title} sub={sub}/>}
            {renderScreen()}

            {showSearch   && <SearchOverlay onClose={()=>setShowSearch(false)}/>}
            {showSettings && <SettingsSheet onClose={()=>setShowSettings(false)} onLogout={handleLogout} role={role}/>}

            {/* Modal orang tua: kode akses */}
            {showLinkCode && (
              <LinkCodeModal
                students={list}
                onClose={()=>setShowLinkCode(false)}
                onLinked={(s)=>{ setChildId(s.id); setShowLinkCode(false); goTab("parent-detail"); }}
              />
            )}

            {/* Pop-up setup guru bertahap */}
            {guruSetup==="akun" && (
              <AkunGuruModal profile={guru} onNext={(p)=>{ setGuru(g=>({...g,...p})); setGuruSetup("sekolah"); }}/>
            )}
            {guruSetup==="sekolah" && (
              <ProfilSekolahModal profile={guru} onBack={()=>setGuruSetup("akun")}
                onNext={(p)=>{ setGuru(g=>({...g,...p})); setGuruSetup("siswa"); }}/>
            )}
            {guruSetup==="siswa" && !showAddStudent && (
              <TambahSiswaPromptModal
                sekolah={guru.sekolah} jumlahKelas={guru.kelas.length}
                onOpenForm={()=>openAddStudent(true)}
                onSkip={finishGuruSetup}
                onImportSiswa={(importedSiswa)=>{
                  // SRS-F-003: simpan siswa hasil import (DB sekolah / upload CSV)
                  const kelasKeys = guru.kelas.length ? guru.kelas : Object.keys(guru.kelasAbkMap);
                  const defaultKelas = kelasKeys[0] || "VII A";
                  importedSiswa.forEach((s, idx) => {
                    const emoji = ["👦","👧","🧑"][idx % 3];
                    addStudent({
                      name: s.nama,
                      abk:  s.abk || "Belum Ditentukan",
                      kelas: defaultKelas,
                      age:   0,
                      emoji,
                      talent:"", talentScore:0, stars:0,
                      teacher: guru.nama,
                      hasObs:false, comps:[],
                      kodeOrtu:undefined,
                      caraBelajar:"",
                      komunikasi:"", motorik:"",
                      tingkatDukungan:"",
                      rentang:"", minat:"", terapi:"",
                    });
                  });
                  finishGuruSetup();
                }}
              />
            )}

            {/* Sheet tambah siswa */}
            {showAddStudent && (
              <AddStudentSheet
                teacher={guru.nama}
                kelasAbkMap={Object.keys(guru.kelasAbkMap??{}).length ? guru.kelasAbkMap : DEFAULT_GURU.kelasAbkMap}
                firstTime={addFirstTime}
                savedCount={list.length}
                onSave={addStudent}
                onClose={()=>{
              setShowAddStudent(false);
              if (addFirstTime) { setAddFirstTime(false); finishGuruSetup(); }
            }}
            onBack={()=>{
              setShowAddStudent(false);
              if (addFirstTime) { setGuruSetup("sekolah"); }
            }}
              />
            )}
          </div>

          {showNav && <BotNav role={role!} screen={screen} go={goTab}/>}

          {showOnboarding && <OnboardingModal onClose={()=>setShowOnboarding(false)} goTab={goTab}/>}
        </div>

        <p className="text-xs font-semibold" style={{color:T,fontFamily:IPS,opacity:0.8}}>Sareh Asih · GEMASTIK XVII · UX Design</p>
      </div>
    </div>
  </UI.Provider>
  </StudentsCtx.Provider>
  );
}
