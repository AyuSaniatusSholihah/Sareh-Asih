import { useState, useRef } from "react";
import {
  Home, Users, ClipboardList, Bell, Search,
  ChevronRight, Star, Brain, Target, CheckCircle,
  TrendingUp, Sparkles, Trophy,
  Send, Edit3, Info, Shield,
  LogOut, Lock, FileText, Clock, XCircle,
  CheckSquare, UserPlus, CalendarDays, HeartPulse, Key, Copy, RefreshCw,
  Settings, Volume2, VolumeX, X, HelpCircle, Mic, MicOff, Calendar, Plus,
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from "recharts";

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
    icon:<Info size={16}/>, label:"Tentang TalentaABK",
    body:[
      "Platform pemetaan bakat anak berkebutuhan khusus untuk guru SLB, dengan pengamatan adaptif yang menyesuaikan jenis ABK setiap siswa.",
      "Tidak ada peran admin terpisah — guru sekaligus memegang pengelolaan data siswa dan kode orang tua, agar alurnya ringkas untuk sekolah kecil.",
      "Rekomendasi lomba merujuk tiga ajang resmi: O2SN Diksus, FLS2N-PDBK, dan LKS Diksus.",
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

        <div style={{marginBottom:18}}>
          <p style={{fontSize:12,fontWeight:600,color:MUTED,fontFamily:IPS,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>Ukuran Teks</p>
          <div style={{display:"flex",gap:8}}>
            {SIZES.map(sz=>(
              <button key={sz.v} onClick={()=>setFontSize(sz.v)}
                style={{flex:1,padding:"10px 0",borderRadius:14,border:`2px solid ${fontSize===sz.v?T:BDR}`,background:fontSize===sz.v?SEC:CARD,color:fontSize===sz.v?DEEP:MUTED,fontFamily:IPS,fontSize:13,fontWeight:700,transition:"all 0.15s",cursor:"pointer"}}>
                {sz.l}
              </button>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginTop:12}}>
            <button onClick={()=>setFontSize(Math.max(1,+(fontSize-0.15).toFixed(2)))}
              style={{display:"flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:12,border:`1px solid ${BDR}`,background:CARD,color:TEXT,fontFamily:IPS,fontSize:13,fontWeight:600,cursor:"pointer"}}>
              <span style={{fontSize:15,fontWeight:700}}>A</span><span style={{fontSize:11}}>−</span>
            </button>
            <span style={{fontSize:12,color:MUTED,fontFamily:IPS}}>{Math.round(fontSize*100)}%</span>
            <button onClick={()=>setFontSize(Math.min(1.3,+(fontSize+0.15).toFixed(2)))}
              style={{display:"flex",alignItems:"center",gap:6,padding:"8px 18px",borderRadius:12,border:`1px solid ${BDR}`,background:CARD,color:TEXT,fontFamily:IPS,fontSize:13,fontWeight:600,cursor:"pointer"}}>
              <span style={{fontSize:19,fontWeight:700}}>A</span><span style={{fontSize:11}}>+</span>
            </button>
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
  {k:"students",l:"Siswa",I:Users},
  {k:"talent-map",l:"Bakat",I:Sparkles},
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
      <div className="flex">
        {nav.map(({k,l,I})=>{
          const active=screen===k;
          return (
            <button key={k} onClick={()=>go(k as Screen)} style={{fontFamily:IPS,minHeight:56}} className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors">
              <I size={21} style={{color:active?T:MUTED}}/>
              <span style={{fontSize:10,fontWeight:600,color:active?T:MUTED}}>{l}</span>
              {active&&<div style={{width:4,height:4,borderRadius:"50%",background:T}}/>}
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

// ─── DASHBOARD GURU ──────────────────────────────────────────────────
function DashboardGuru({go,onStartObs,guru,onAddStudent}:{
  go:(s:Screen)=>void; onStartObs:(id:number)=>void; guru:GuruProfile; onAddStudent:()=>void;
}) {
  const students = useStudents();
  const {openSearch, openSettings} = useUI();
  const pendingObs = students.filter(s=>!s.hasObs);
  const done = students.filter(s=>s.hasObs);
  const totalLomba = done.reduce((a,s)=>a+s.comps.length, 0);
  const studentsWithKode = students.filter(s=>s.kodeOrtu);
  const kodePercent = students.length ? Math.round(studentsWithKode.length/students.length*100) : 0;
  const firstName = guru.nama.split(" ")[0];

  const quickActions = [
    {icon:<UserPlus size={20}/>, label:"Tambah\nSiswa",   bg:"#E4F0E9", color:DEEP,      onClick:onAddStudent},
    {icon:<ClipboardList size={20}/>, label:"Pengamatan\nSiswa", bg:"#E3EDF8", color:"#3A7BD5", onClick:()=>go("students")},
    {icon:<Trophy size={20}/>, label:"Agenda",             bg:"#EDE6F5", color:"#8E44AD", onClick:()=>go("competition")},
    {icon:<FileText size={20}/>, label:"Laporan",         bg:"#FEF3E2", color:"#D68910", onClick:()=>go("report")},
  ];

  const activities = [
    {icon:<CheckCircle size={14}/>, color:T,        bg:"#E4F0E9", text:"Pengamatan Rafi Pratama selesai",             time:"Kemarin, 14:30"},
    {icon:<Trophy size={14}/>,      color:"#8E44AD", bg:"#EDE6F5", text:"Rekomendasi lomba baru untuk Nisa Aulia",   time:"Kemarin, 09:15"},
    {icon:<Users size={14}/>,       color:"#3A7BD5", bg:"#E3EDF8", text:"Orang tua Arga Saputra baru login",         time:"2 hari yang lalu, 16:45"},
  ];

  const circumference = 2 * Math.PI * 20;

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS, background:BG}}>

      {/* ── Header ── */}
      <div style={{background:CARD, position:"relative"}}>
        {/* Top row: greeting left, icons right — same line */}
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"14px 16px 10px"}}>
          <div>
            <p style={{fontSize:12, color:MUTED}}>Selamat pagi,</p>
            <h1 style={{fontFamily:PJS, fontSize:22, fontWeight:800, color:TEXT, lineHeight:1.15}}>
              {firstName} <span>👋</span>
            </h1>
            <p style={{fontSize:11, color:MUTED, marginTop:3}}>🌿 Semangat menginspirasi hari ini!</p>
          </div>
          <div style={{display:"flex", gap:4, flexShrink:0}}>
            <button onClick={openSearch}
              style={{width:32,height:32,background:BG,borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Search size={15} style={{color:MUTED}}/>
            </button>
            <button style={{width:32,height:32,background:BG,borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <Bell size={15} style={{color:MUTED}}/>
              <span style={{position:"absolute",top:4,right:4,width:14,height:14,background:A,borderRadius:"50%",fontSize:7,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>2</span>
            </button>
            <button onClick={openSettings}
              style={{width:32,height:32,background:BG,borderRadius:10,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Settings size={15} style={{color:MUTED}}/>
            </button>
          </div>
        </div>

        {/* ── Pengamatan Banner — illustration overlaps top-right ── */}
        <div style={{margin:"0 16px 14px", background:"#F2EDE5", borderRadius:18, padding:"14px 16px", position:"relative", overflow:"visible"}}>
          {/* Illustration — centered vertically in banner */}
          <div style={{position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", pointerEvents:"none"}}>
            <TeacherIllustration/>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:10, paddingRight:72}}>
            <div style={{width:38,height:38,background:"rgba(255,255,255,0.7)",borderRadius:11,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <ClipboardList size={18} style={{color:DEEP}}/>
            </div>
            <p style={{fontSize:12,color:TEXT,lineHeight:1.5}}>
              Hari ini ada{" "}
              <span style={{fontWeight:800,fontSize:14,color:A}}>{pendingObs.length}</span>{" "}
              <strong>pengamatan</strong><br/>yang perlu diselesaikan
            </p>
          </div>
          <button onClick={()=>go("students")}
            style={{marginTop:10,background:DEEP,color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",fontFamily:IPS,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
            Lihat Jadwal <ChevronRight size={12}/>
          </button>
        </div>
      </div>

      <div style={{padding:"16px 16px 88px",display:"flex",flexDirection:"column",gap:16}}>

        {/* ── Stats Card ── */}
        <div style={{background:CARD,borderRadius:20,overflow:"hidden",border:`1px solid ${BDR}`}}>
          <div className="flex">
            {/* Left: Siswa Aktif */}
            <div style={{flex:"0 0 40%",background:SEC,padding:"18px 12px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
              <div style={{width:46,height:46,background:"rgba(91,122,104,0.15)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Users size={22} style={{color:DEEP}}/>
              </div>
              <div style={{textAlign:"center"}}>
                <p style={{fontFamily:PJS,fontSize:34,fontWeight:800,color:TEXT,lineHeight:1}}>{students.length}</p>
                <p style={{fontSize:12,fontWeight:700,color:TEXT,marginTop:3}}>Siswa Aktif</p>
                <p style={{fontSize:11,color:MUTED,marginTop:2}}>{guru.kelas.length} kelas diampu</p>
              </div>
            </div>
            {/* Right: 3 metric rows */}
            <div style={{flex:1,display:"flex",flexDirection:"column"}}>
              {[
                {icon:<ClipboardList size={15}/>, iconBg:"#FEF0E0", iconColor:"#D68910", value:pendingObs.length, label:"Pengamatan Pending",  onClick:()=>go("students")},
                {icon:<CheckCircle size={15}/>,   iconBg:"#E4F0E9", iconColor:T,          value:done.length,       label:"Sudah Didampingi", onClick:()=>go("talent-map")},
                {icon:<Trophy size={15}/>,         iconBg:"#EDE6F5", iconColor:"#8E44AD", value:totalLomba,        label:"Rekomendasi Lomba", sub:"Baru tersedia", onClick:()=>go("competition")},
              ].map((item,i)=>(
                <button key={i} onClick={item.onClick}
                  style={{
                    display:"flex",alignItems:"center",gap:10,
                    padding:"12px 12px",
                    borderBottom: i < 2 ? `1px solid ${BDR}` : "none",
                    background:"transparent",border:"none",
                    cursor:"pointer",textAlign:"left",width:"100%",
                  }}>
                  <div style={{width:32,height:32,background:item.iconBg,borderRadius:10,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:item.iconColor}}>
                    {item.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontFamily:PJS,fontSize:18,fontWeight:800,color:TEXT,lineHeight:1}}>{item.value}</p>
                    <p style={{fontSize:11,color:MUTED,lineHeight:1.3,marginTop:1}}>{item.label}{item.sub && <><br/><span style={{fontSize:10}}>{item.sub}</span></>}</p>
                  </div>
                  <ChevronRight size={14} style={{color:MUTED,flexShrink:0}}/>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Aksi Cepat ── */}
        <div>
          <p style={{fontFamily:PJS,fontSize:15,fontWeight:700,color:TEXT,marginBottom:12}}>Aksi Cepat</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {quickActions.map((a,i)=>(
              <button key={i} onClick={a.onClick}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,background:"transparent",border:"none",cursor:"pointer",padding:0}}>
                <div style={{width:58,height:58,background:a.bg,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",color:a.color}}>
                  {a.icon}
                </div>
                <p style={{fontSize:11,fontWeight:600,color:TEXT,textAlign:"center",lineHeight:1.3,whiteSpace:"pre-line"}}>{a.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Kode Akses Orang Tua ── */}
        {students.length > 0 && (
          <div style={{background:CARD,borderRadius:20,padding:"14px 14px 10px",border:`1px solid ${BDR}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{flex:1,minWidth:0,marginRight:10}}>
                <p style={{fontFamily:PJS,fontSize:13,fontWeight:700,color:TEXT}}>Kode Akses Orang Tua</p>
                <p style={{fontSize:11,color:MUTED,marginTop:2,lineHeight:1.3}}>
                  {studentsWithKode.length === students.length
                    ? "Semua siswa sudah memiliki kode akses"
                    : `${studentsWithKode.length} dari ${students.length} siswa memiliki kode`}
                </p>
              </div>
              {/* Circular progress + label — horizontal */}
              <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                <svg width="46" height="46" viewBox="0 0 46 46">
                  <circle cx="23" cy="23" r="18" fill="none" stroke={BDR} strokeWidth="3.5"/>
                  <circle cx="23" cy="23" r="18" fill="none" stroke={T} strokeWidth="3.5"
                    strokeDasharray={`${2*Math.PI*18*kodePercent/100} ${2*Math.PI*18}`}
                    strokeLinecap="round" transform="rotate(-90 23 23)"/>
                  <text x="23" y="23" textAnchor="middle" dominantBaseline="middle"
                    fill={DEEP} fontSize="9" fontWeight="700" fontFamily="IBM Plex Sans">{kodePercent}%</text>
                </svg>
                <div>
                  <p style={{fontSize:13,fontWeight:700,color:TEXT,lineHeight:1}}>{studentsWithKode.length}/{students.length}</p>
                  <p style={{fontSize:10,color:MUTED,marginTop:2}}>Selesai</p>
                </div>
              </div>
            </div>

            {/* Student chips */}
            <div style={{display:"flex",gap:6}}>
              {students.slice(0,3).map(s=>(
                <div key={s.id} style={{flex:1,display:"flex",alignItems:"center",gap:6,padding:"7px 8px",background:BG,borderRadius:12,border:`1px solid ${BDR}`,minWidth:0}}>
                  <span style={{fontSize:18,flexShrink:0}}>{s.emoji}</span>
                  <div style={{minWidth:0}}>
                    <p style={{fontSize:11,fontWeight:700,color:TEXT,fontFamily:PJS,lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name.split(" ")[0]} {s.name.split(" ")[1]||""}</p>
                    <p style={{fontSize:9,color:MUTED,fontFamily:DMM,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.kodeOrtu ?? "—"}</p>
                  </div>
                </div>
              ))}
            </div>

            {students.length > 3 && (
              <button onClick={()=>go("kode-akses")}
                style={{marginTop:8,width:"100%",fontSize:11,fontWeight:600,color:MUTED,background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:3,padding:"4px 0"}}>
                <Users size={11}/>+{students.length - 3} siswa lainnya
              </button>
            )}
          </div>
        )}

        {/* ── Empty state ── */}
        {students.length === 0 && (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`,borderRadius:20,padding:24,textAlign:"center"}}>
            <div style={{width:56,height:56,background:SEC,borderRadius:18,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Users size={26} style={{color:T}}/>
            </div>
            <p style={{fontWeight:700,fontSize:14,fontFamily:PJS,color:TEXT,marginBottom:6}}>Belum ada siswa</p>
            <p style={{fontSize:12,color:MUTED,lineHeight:1.6,marginBottom:16}}>Tambahkan siswa Anda untuk mulai pengamatan dan pemetaan bakat.</p>
            <PBtn full label="Tambah Siswa" icon={<UserPlus size={15}/>} onClick={onAddStudent}/>
          </div>
        )}

        {/* ── Aktivitas Terbaru ── */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <p style={{fontFamily:PJS,fontSize:15,fontWeight:700,color:TEXT}}>Aktivitas Terbaru</p>
            <button onClick={()=>go("students")} style={{fontSize:12,fontWeight:600,color:T,background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>
              Lihat Semua <ChevronRight size={12}/>
            </button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {activities.map((a,i)=>(
              <div key={i} style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:16,padding:"11px 14px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:32,height:32,background:a.bg,borderRadius:10,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:a.color}}>
                  {a.icon}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:600,color:TEXT}}>{a.text}</p>
                  <p style={{fontSize:11,color:MUTED,marginTop:2}}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── STUDENTS + KELOMPOK BELAJAR ─────────────────────────────────────
function StudentsScreen({go,onAddStudent,onSelect}:{go:(s:Screen)=>void;onAddStudent:()=>void;onSelect:(id:number)=>void}) {
  const students = useStudents();
  const [mainTab,setMainTab] = useState<"siswa"|"kelompok">("siswa");
  const [kelTab,setKelTab] = useState<"gaya"|"bakat">("gaya");
  const [expanded,setExpanded] = useState<string|null>(null);
  const [q,setQ] = useState("");
  const filtered = students.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.abk.toLowerCase().includes(q.toLowerCase()));
  const abkColor = (a:string)=>a.includes("Autism")?"purple":a.includes("Tunarungu")?"blue":a.includes("Tunadaksa")?"orange":"pink";

  const withObs = students.filter(s=>s.hasObs);
  const gayaGroups = Object.entries(
    withObs.reduce((acc,s)=>{
      const key = s.caraBelajar||"Belum Diketahui";
      (acc[key] ||= []).push(s);
      return acc;
    }, {} as Record<string,Student[]>)
  ).sort((a,b)=>b[1].length-a[1].length);

  const talentGroups = Object.entries(
    withObs.filter(s=>s.talentScore>0).reduce((acc,s)=>{
      (acc[s.talent] ||= []).push(s);
      return acc;
    }, {} as Record<string,Student[]>)
  ).sort((a,b)=>b[1].length-a[1].length);

  const noObsStudents = students.filter(s=>!s.hasObs);
  const toggleExpand = (key:string) => setExpanded(e=>e===key?null:key);

  return (
    <div className="flex-1 overflow-y-auto relative" style={{fontFamily:IPS}}>
      <div style={{background:CARD}} className="px-4 pt-2 pb-0">
        <div className="flex items-center justify-between mb-2 pt-1">
          <div>
            <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Siswa & Kelompok</p>
            <p className="text-xs" style={{color:MUTED}}>{students.length} siswa · {withObs.length} sudah didampingi</p>
          </div>
          <button onClick={onAddStudent} style={{background:A,color:"#fff",fontFamily:IPS,minHeight:42,flexShrink:0}} className="flex items-center gap-1.5 px-3 rounded-xl text-xs font-bold">
            <UserPlus size={14}/>Tambah
          </button>
        </div>
        <div className="flex" style={{borderBottom:`1px solid ${BDR}`}}>
          {[{k:"siswa",l:"Daftar Siswa"},{k:"kelompok",l:"Kelompok Belajar"}].map(t=>(
            <button key={t.k} onClick={()=>setMainTab(t.k as any)}
              style={{color:mainTab===t.k?T:MUTED,borderBottom:mainTab===t.k?`2.5px solid ${T}`:"2.5px solid transparent",fontFamily:IPS,minHeight:44,flex:1}}
              className="text-xs font-bold">{t.l}</button>
          ))}
        </div>
      </div>

      {mainTab==="siswa" && (
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:MUTED}}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama atau jenis ABK..." style={{width:"100%",border:`1.5px solid ${BDR}`,borderRadius:14,padding:"11px 14px 11px 38px",fontSize:15,color:TEXT,fontFamily:IPS,background:CARD,outline:"none",minHeight:48}}/>
          </div>

          {filtered.length===0 && (
            <div style={{background:CARD,border:`1.5px dashed ${BDR}`}} className="rounded-2xl px-4 py-8 text-center">
              <p className="text-sm font-semibold mb-3" style={{color:MUTED}}>
                {students.length===0 ? "Belum ada siswa di daftar Anda." : "Tidak ada siswa yang cocok."}
              </p>
              {students.length===0 && <PBtn label="Tambah Siswa" icon={<UserPlus size={14}/>} onClick={onAddStudent}/>}
            </div>
          )}

          <div className="space-y-2">
            {filtered.map(s=>(
              <button key={s.id} onClick={()=>onSelect(s.id)} style={{background:CARD,border:`1px solid ${BDR}`,width:"100%",textAlign:"left",minHeight:76}} className="rounded-2xl p-4 flex items-center gap-3">
                <div style={{width:48,height:48,background:SEC,flexShrink:0}} className="rounded-2xl flex items-center justify-center text-2xl">{s.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{s.name}</p>
                  <p className="text-xs" style={{color:MUTED}}>Kelas {s.kelas}{s.age?` · ${s.age}th`:""} · {s.teacher}</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <Chip label={s.abk} color={abkColor(s.abk) as any}/>
                    {s.hasObs
                      ? <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:"#F0FDF4",color:"#15803D"}}><CheckCircle size={10}/>Pengamatan ada</span>
                      : <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:"#FEF9EC",color:"#92400E"}}><Clock size={10}/>Belum pengamatan</span>
                    }
                  </div>
                </div>
                <ChevronRight size={15} style={{color:MUTED,flexShrink:0}}/>
              </button>
            ))}
          </div>
        </div>
      )}

      {mainTab==="kelompok" && (
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl px-4 py-3 flex items-start gap-3">
            <Sparkles size={15} style={{color:T,flexShrink:0,marginTop:1}}/>
            <div>
              <p className="text-xs font-bold mb-0.5" style={{color:T,fontFamily:PJS}}>Dikelompokkan otomatis oleh AI</p>
              <p className="text-xs leading-relaxed" style={{color:T}}>Berdasarkan hasil pengamatan dan pemetaan bakat. Siswa yang belum didampingi tidak masuk kelompok.</p>
            </div>
          </div>

          <div className="flex rounded-2xl overflow-hidden" style={{border:`1px solid ${BDR}`}}>
            {[{k:"gaya",l:"Per Gaya Belajar"},{k:"bakat",l:"Per Bakat"}].map(t=>(
              <button key={t.k} onClick={()=>setKelTab(t.k as any)}
                style={{flex:1,background:kelTab===t.k?T:CARD,color:kelTab===t.k?"#fff":MUTED,fontFamily:IPS,minHeight:38}}
                className="text-xs font-bold">{t.l}</button>
            ))}
          </div>

          {kelTab==="gaya" && (
            <div className="space-y-2">
              {gayaGroups.map(([gaya,members])=>{
                const meta = GAYA_META[gaya];
                const isOpen = expanded===gaya;
                return (
                  <div key={gaya} style={{background:CARD,border:`1px solid ${meta?meta.warna+"33":BDR}`,overflow:"hidden"}} className="rounded-2xl">
                    <button onClick={()=>toggleExpand(gaya)} className="w-full px-4 py-3 flex items-center gap-3 text-left" style={{minHeight:64}}>
                      <div style={{width:42,height:42,background:meta?meta.warna+"18":SEC,borderRadius:12,flexShrink:0,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {meta?.icon||"👥"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{gaya}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center">
                            {members.slice(0,4).map((s,i)=>(
                              <span key={s.id} style={{fontSize:16,marginLeft:i===0?0:-4}}>{s.emoji}</span>
                            ))}
                          </div>
                          <span className="text-xs" style={{color:MUTED}}>{members.length} siswa</span>
                        </div>
                      </div>
                      <ChevronRight size={15} style={{color:MUTED,flexShrink:0,transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s"}}/>
                    </button>

                    {isOpen && (
                      <div style={{borderTop:`1px solid ${meta?meta.warna+"22":BDR}`}}>
                        <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
                          {members.map(s=>{
                            const tc = s.talent ? TALENT_COLOR[s.talent] : null;
                            return (
                              <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{background:BG}}>
                                <span style={{fontSize:20,flexShrink:0}}>{s.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold" style={{color:TEXT,fontFamily:IPS}}>{s.name}</p>
                                  <p className="text-xs" style={{color:MUTED}}>Kelas {s.kelas} · {s.abk}</p>
                                </div>
                                {tc && s.talentScore>0 && (
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{background:tc.bg,color:tc.text}}>{s.talent}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {meta && (
                          <div className="px-4 pb-4 space-y-2">
                            <p className="text-xs font-bold mt-2" style={{color:TEXT,fontFamily:PJS}}>Strategi Pengajaran</p>
                            <div style={{background:meta.warna+"10",border:`1px solid ${meta.warna}22`}} className="rounded-xl px-3 py-2.5">
                              <p className="text-xs font-semibold mb-1.5" style={{color:meta.warna}}>✓ Disarankan</p>
                              {meta.strategi.map((s,i)=>(
                                <p key={i} className="text-xs leading-relaxed" style={{color:TEXT,paddingLeft:8}}>• {s}</p>
                              ))}
                            </div>
                            <div style={{background:"#FEF2F2",border:`1px solid #FCA5A533`}} className="rounded-xl px-3 py-2.5">
                              <p className="text-xs font-semibold mb-1.5" style={{color:"#B91C1C"}}>✗ Hindari</p>
                              {meta.hindari.map((s,i)=>(
                                <p key={i} className="text-xs leading-relaxed" style={{color:"#7F1D1D",paddingLeft:8}}>• {s}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {kelTab==="bakat" && (
            <div className="space-y-2">
              {talentGroups.map(([talent,members])=>{
                const tc = TALENT_COLOR[talent]||{bg:SEC,text:T};
                const isOpen = expanded===("b-"+talent);
                const avgScore = Math.round(members.reduce((a,s)=>a+s.talentScore,0)/members.length);
                return (
                  <div key={talent} style={{background:CARD,border:`1px solid ${tc.text}33`,overflow:"hidden"}} className="rounded-2xl">
                    <button onClick={()=>toggleExpand("b-"+talent)} className="w-full px-4 py-3 flex items-center gap-3 text-left" style={{minHeight:64}}>
                      <div style={{width:42,height:42,background:tc.bg,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:20}}>{talent==="Seni Visual"?"🎨":talent==="Musik Perkusi"?"🎵":talent==="Desain Digital"?"💻":"💃"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{talent}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center">
                            {members.slice(0,4).map((s,i)=>(
                              <span key={s.id} style={{fontSize:16,marginLeft:i===0?0:-4}}>{s.emoji}</span>
                            ))}
                          </div>
                          <span className="text-xs" style={{color:MUTED}}>{members.length} siswa</span>
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{background:tc.bg,color:tc.text,fontFamily:DMM}}>avg {avgScore}</span>
                        </div>
                      </div>
                      <ChevronRight size={15} style={{color:MUTED,flexShrink:0,transform:isOpen?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s"}}/>
                    </button>

                    {isOpen && (
                      <div style={{borderTop:`1px solid ${tc.text}22`}}>
                        <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
                          {members.map(s=>(
                            <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{background:BG}}>
                              <span style={{fontSize:20,flexShrink:0}}>{s.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold" style={{color:TEXT,fontFamily:IPS}}>{s.name}</p>
                                <p className="text-xs" style={{color:MUTED}}>{s.abk} · {s.caraBelajar}</p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {Array.from({length:5}).map((_,i)=>(
                                  <Star key={i} size={11} fill={i<s.stars?A:"none"} style={{color:i<s.stars?A:"#D1D5DB"}}/>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div style={{background:tc.bg,border:`1px solid ${tc.text}22`}} className="rounded-xl px-3 py-2.5 mt-1 flex items-start gap-2">
                            <Brain size={12} style={{color:tc.text,flexShrink:0,marginTop:1}}/>
                            <p className="text-xs leading-relaxed" style={{color:tc.text}}>
                              Kelompok ini dapat diarahkan bersama ke kompetisi yang relevan. Bakat dominan mereka saling mendukung untuk kolaborasi.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {noObsStudents.length>0 && (
            <div style={{background:CARD,border:`1.5px dashed rgba(107,114,128,0.3)`}} className="rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={13} style={{color:MUTED}}/>
                <p className="text-xs font-bold" style={{color:MUTED,fontFamily:PJS}}>Belum dapat dikelompokkan ({noObsStudents.length} siswa)</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {noObsStudents.map(s=>(
                  <div key={s.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{background:BG,border:`1px solid ${BDR}`}}>
                    <span style={{fontSize:14}}>{s.emoji}</span>
                    <span className="text-xs font-semibold" style={{color:MUTED}}>{s.name.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{color:MUTED}}>Lakukan pengamatan terlebih dahulu agar AI dapat memetakan gaya belajar dan bakatnya.</p>
            </div>
          )}
        </div>
      )}
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
      <div className="flex gap-2">
        <button onClick={salin} style={{flex:1,background:copied?SEC:A,color:copied?DEEP:"#fff",fontFamily:IPS,minHeight:44}}
          className="rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5">
          {copied ? <><CheckCircle size={13}/>Tersalin</> : <><Copy size={13}/>Salin Kode</>}
        </button>
        <button onClick={()=>onRegen(s.id)} style={{flex:1,background:CARD,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:44}}
          className="rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5">
          <RefreshCw size={13}/>Buat Ulang
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
            display:"flex",alignItems:"center",gap:5,padding:"8px 16px",
            borderRadius:12,border:"none",cursor:"pointer",
            background:saved?T:A,color:"#fff",fontFamily:IPS,
            fontSize:12,fontWeight:700,flexShrink:0,
            transition:"background 0.3s",
          }}>
          {saved ? <><CheckCircle size={13}/>Tersimpan</> : <><Send size={12}/>Simpan Catatan</>}
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
        right={<button onClick={()=>onStartObs(s.id)} style={{background:A,color:"#fff",fontFamily:IPS,minHeight:44,minWidth:44}} className="flex items-center gap-1.5 px-3 rounded-xl font-semibold text-xs"><ClipboardList size={13}/>Pengamatan</button>}/>
      <div style={{background:CARD,borderBottom:`1px solid ${BDR}`}} className="px-4 py-3 flex items-center gap-3">
        <div style={{width:52,height:52,background:SEC,flexShrink:0}} className="rounded-2xl flex items-center justify-center text-2xl">{s.emoji}</div>
        <div className="flex-1">
          <p className="font-bold text-base" style={{fontFamily:PJS,color:TEXT}}>{s.name}</p>
          <p className="text-xs" style={{color:MUTED}}>Kelas {s.kelas}{s.age?` · ${s.age} tahun`:""} · {s.teacher}</p>
          <div className="flex gap-1.5 mt-1"><Chip label={s.abk} color="purple"/><SBadge s={s.hasObs?"Berjalan":"Belum Dibaca"}/></div>
        </div>
      </div>
      <div className="flex" style={{background:CARD,borderBottom:`1px solid ${BDR}`}}>
        {[{k:"abk",l:"Profil ABK"},{k:"kode",l:"Kode Ortu"},{k:"jurnal",l:"Jurnal & Catatan"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k as any)} style={{color:tab===t.k?T:MUTED,borderBottom:tab===t.k?`2.5px solid ${T}`:"2.5px solid transparent",fontFamily:IPS,minHeight:44,flex:1}} className="py-2 text-xs font-bold transition-colors">{t.l}</button>
        ))}
      </div>
      <div className="px-4 pt-4 pb-6 space-y-2">
        {tab==="abk"&&(
          <>
            <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-xl px-3 py-2.5 flex items-center gap-2 mb-3">
              <Edit3 size={13} style={{color:T,flexShrink:0}}/>
              <p className="text-xs" style={{color:T}}>Data diinput oleh guru — dapat diperbarui kapan saja.</p>
            </div>
            {rows.map(([l,v])=>(
              <div key={l} style={{background:BG,border:`1px solid ${BDR}`}} className="rounded-xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{color:MUTED}}>{l}</p>
                <p className="text-sm mt-0.5 font-medium" style={{color:TEXT,fontFamily:l.includes("Kode")?DMM:IPS}}>{v}</p>
              </div>
            ))}
          </>
        )}

        {tab==="kode" && <KodeOrtuCard s={s} onRegen={onRegenKode}/>}

        {tab==="jurnal" && <JurnalTab s={s} laporan={laporan} onKirim={onKirim}/>}

        {/* Unduh laporan pemetaan untuk anak ini saja */}
        <button onClick={()=>exportLaporanPemetaan([s], namaSekolah)}
          style={{width:"100%",background:CARD,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:48}}
          className="rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
          <FileText size={14}/>Unduh Laporan Pemetaan {s.name.split(" ")[0]}
        </button>
        <div className="flex gap-2 pt-2">
          <button onClick={()=>go("talent-map-detail")} style={{flex:1,background:SEC,color:T,fontFamily:IPS,minHeight:44,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl text-xs font-semibold flex items-center justify-center gap-1"><Sparkles size={13}/>Talent Map</button>
          <button onClick={()=>go("learning-rec")} style={{flex:1,background:SEC,color:T,fontFamily:IPS,minHeight:44,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl text-xs font-semibold flex items-center justify-center gap-1"><Brain size={13}/>Rekomendasi</button>
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
                      <div key={s.id} style={{background:BG,border:`2px dashed rgba(91,122,104,0.15)`}} className="rounded-2xl p-3.5 flex items-center gap-3">
                        <div style={{width:44,height:44,background:"#EDE9E3",flexShrink:0}} className="rounded-2xl flex items-center justify-center text-xl opacity-50">{s.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{color:MUTED}}>{s.name}</p>
                          <p className="text-xs" style={{color:MUTED}}>{s.abk}</p>
                          <p className="text-xs mt-1" style={{color:MUTED}}>Belum ada data pengamatan</p>
                        </div>
                        <button onClick={() => onStartObs(s.id)} style={{background:A,color:"#fff",fontFamily:IPS,minHeight:34,flexShrink:0}} className="px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1">
                          <ClipboardList size={11}/>Mulai
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

function TalentMapDetailScreen({onBack,studentId}:{onBack:()=>void;studentId:number}) {
  const students = useStudents();
  const s = students.find(x=>x.id===studentId);
  const data = studentTalentDetail[studentId];
  if (!s) return null;

  if (!data) {
    return (
      <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
        <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack}/>
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3"><Sparkles size={14} style={{color:A}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Ringkasan Bakat</p></div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-bold text-sm" style={{color:TEXT}}>{s.talent||"Belum teridentifikasi"}</p>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={12} style={{color:i<s.stars?A:"#E5E7EB",fill:i<s.stars?A:"#E5E7EB"}}/>)}</div>
                <span className="text-xs font-bold" style={{color:T,fontFamily:DMM}}>{s.talentScore}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full mb-2" style={{background:"#EDE9E3"}}><div className="h-full rounded-full" style={{width:`${s.talentScore}%`,background:T}}/></div>
            <div style={{background:SEC}} className="rounded-xl px-3 py-2.5 flex items-start gap-1.5">
              <Info size={12} style={{color:T,flexShrink:0,marginTop:2}}/>
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
      <TBar title="AI Talent Mapping" sub={`${s.name} · ${s.abk}`} onBack={onBack}/>
      <div className="px-4 pt-4 pb-6 space-y-3">
        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
          <p className="font-bold text-sm mb-3" style={{fontFamily:PJS,color:TEXT}}>Peta Bakat</p>
          <div style={{height:180}}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.radar}>
                <PolarGrid key="pg" stroke="#D4E8DA"/>
                <PolarAngleAxis key="pa" dataKey="s" tick={{fontSize:10,fill:MUTED,fontFamily:DMM}}/>
                <Radar key="ra" dataKey="A" stroke={T} fill={T} fillOpacity={0.15} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3"><Sparkles size={14} style={{color:A}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Hasil Talent Mapping</p></div>
          {data.domains.map((x,idx)=>(
            <div key={x.t} className="mb-4 last:mb-0 pb-4 last:pb-0" style={{borderBottom:idx<data.domains.length-1?`1px solid ${BDR}`:"none"}}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-bold text-sm" style={{color:TEXT}}>{x.t}</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={12} style={{color:i<x.st?A:"#E5E7EB",fill:i<x.st?A:"#E5E7EB"}}/>)}</div>
                  <span className="text-xs font-bold" style={{color:T,fontFamily:DMM}}>{x.sc}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full mb-2" style={{background:"#EDE9E3"}}><div className="h-full rounded-full" style={{width:`${x.sc}%`,background:T}}/></div>
              <div style={{background:SEC}} className="rounded-xl px-3 py-2.5 flex items-start gap-1.5">
                <Info size={12} style={{color:T,flexShrink:0,marginTop:2}}/><p className="text-xs leading-relaxed" style={{color:TEXT}}><strong>Mengapa:</strong> {x.r}</p>
              </div>
            </div>
          ))}
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
          <div className="flex items-center gap-2 mb-3"><CheckSquare size={16} style={{color:T}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Strategi yang Disarankan</p></div>
          {meta.strategi.map(t=>(
            <div key={t} style={{background:BG,border:`1px solid ${BDR}`}} className="rounded-xl p-3 mb-2 last:mb-0">
              <div className="flex items-start gap-2"><CheckCircle size={15} style={{color:T,flexShrink:0,marginTop:2}}/><p className="text-sm font-semibold" style={{color:TEXT}}>{t}</p></div>
            </div>
          ))}
          <div style={{background:SEC}} className="rounded-xl px-3 py-2.5 mt-2 flex items-start gap-2">
            <Target size={13} style={{color:T,flexShrink:0,marginTop:2}}/>
            <p className="text-xs leading-relaxed" style={{color:T}}>Strategi ini dipilih AI karena gaya belajar dominan {nama} adalah <strong>{gaya}</strong>.</p>
          </div>
        </div>

        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3"><XCircle size={16} style={{color:"#B91C1C"}}/><p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Strategi yang Dihindari</p></div>
          {meta.hindari.map(t=>(
            <div key={t} style={{background:"#FEF2F2",border:"1px solid #FECACA"}} className="rounded-xl p-3 mb-2 last:mb-0">
              <div className="flex items-start gap-2"><XCircle size={15} style={{color:"#B91C1C",flexShrink:0,marginTop:2}}/><p className="text-sm font-semibold" style={{color:TEXT}}>{t}</p></div>
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
             <button onClick={()=>setShowAdd(true)} className="w-full flex items-center justify-center gap-1 text-white rounded-xl py-3 text-sm font-semibold shadow-sm" style={{background:A}}>
               <Plus size={16}/> Tambah Agenda
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
            <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-3 flex items-start gap-2">
              <Info size={13} style={{color:T,flexShrink:0,marginTop:2}}/>
              <p className="text-xs leading-relaxed" style={{color:T}}>Hanya 3 lomba resmi. Pendaftaran manual oleh sekolah — klik <strong>"Daftarkan"</strong> untuk ubah status.</p>
            </div>

            <div className="flex rounded-2xl p-1" style={{background:"#EDE9E3"}}>
              {(["lomba","siswa"] as const).map(m=>(
                <button key={m} onClick={()=>setViewMode(m)}
                  style={{background:viewMode===m?CARD:"transparent",color:viewMode===m?TEXT:MUTED,fontFamily:IPS,minHeight:36}}
                  className="flex-1 rounded-lg text-xs font-bold transition-all capitalize">
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
                <div key={lomba.k} style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3" style={{borderBottom:`1px solid ${BDR}`,background:SEC}}>
                    <span className="text-xl">{lomba.icon}</span>
                    <div>
                      <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{lomba.k}</p>
                      <p className="text-xs" style={{color:MUTED}}>{lomba.full}</p>
                    </div>
                    <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full" style={{background:T,color:"#fff"}}>{matchedStudents.length} siswa</span>
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
                              <div className="h-1.5 flex-1 rounded-full" style={{background:"#EDE9E3"}}><div className="h-full rounded-full" style={{width:`${m.match}%`,background:T}}/></div>
                              <span className="text-xs font-bold flex-shrink-0" style={{color:T,fontFamily:DMM}}>{m.match}%</span>
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
                  <div key={s.id} style={{background:BG,border:`2px dashed rgba(91,122,104,0.15)`}} className="rounded-2xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl opacity-40">{s.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{color:MUTED}}>{s.name}</p>
                      <p className="text-xs" style={{color:MUTED}}>Rekomendasi tersedia setelah pengamatan selesai.</p>
                    </div>
                    <button onClick={()=>onStartObs(s.id)} style={{background:A,color:"#fff",fontFamily:IPS,minHeight:36,flexShrink:0}} className="px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1">
                      <ClipboardList size={11}/>Pengamatan
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
  nama:"Sari Dewi, S.Pd.", email:"sari.dewi@gmail.com",
  sekolah:"SLB Harapan Bangsa",
  kelas:["VII A","VIII B"],
  abk:["Autism Spectrum Disorder","Tunarungu","Tunadaksa","Tunagrahita Ringan"],
  kelasAbkMap:{
    "VII A":  "Autism Spectrum Disorder",
    "VIII B": "Tunarungu",
    "IX A":   "Tunadaksa",
    "IX C":   "Tunagrahita Ringan",
  },
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
      case "students":        return ["Siswa & Kelompok", `${list.length} siswa · ${guru.kelas.join(", ")}`];
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
      case "students":         return <StudentsScreen go={go} onAddStudent={()=>openAddStudent(false)} onSelect={(id)=>{setSelectedStudentId(id);go("profile");}}/>;
      case "profile":          return <ProfileScreen onBack={goBack} go={go} studentId={selectedStudentId} onStartObs={startObs} onRegenKode={regenKode} namaSekolah={guru.sekolah} laporan={laporan} onKirim={kirimLaporan}/>;
      case "kode-akses":       return <KodeAksesScreen onBack={goBack} onBuat={buatKode} onHapus={hapusKode} namaSekolah={guru.sekolah}/>;
      case "observation":      return <ObservationScreen onBack={goBack} onDone={finishObs} studentId={selectedStudentId}/>;
      case "talent-map":       return <TalentMapScreen go={go} onStartObs={startObs} onSelect={setSelectedStudentId}/>;
      case "talent-map-detail":return <TalentMapDetailScreen onBack={goBack} studentId={selectedStudentId}/>;
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
    <div className="min-h-screen w-full flex items-center justify-center" style={{background:"#E8E4DD",fontFamily:PJS}}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{background:`${T}25`}}/>
        <div className="absolute bottom-16 right-16 w-80 h-80 rounded-full opacity-30 blur-3xl" style={{background:`${A}18`}}/>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 py-8">
        {/* Demo switcher */}
        {!!role && (
          <div className="flex items-center gap-1 p-1 rounded-2xl" style={{background:"rgba(255,255,255,0.85)",border:`1px solid rgba(91,122,104,0.12)`}}>
            {(["guru","ortu"] as Role[]).map(r=>(
              <button key={r} onClick={()=>demoSwitch(r)} style={{background:role===r?T:"transparent",color:role===r?"#fff":MUTED,fontFamily:IPS,minHeight:38}} className="px-4 rounded-xl text-xs font-bold transition-all">
                {r==="guru"?"👩‍🏫 Guru":"👨‍👩‍👧 Orang Tua"}
              </button>
            ))}
            <button onClick={logout} style={{minWidth:36,minHeight:38,color:MUTED}} className="flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors" title="Keluar">
              <LogOut size={14}/>
            </button>
          </div>
        )}

        {/* Phone frame */}
        <div style={{
          width:390, height:844, background:BG, borderRadius:44,
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
            <div style={{background:(screen==="role-select"||screen==="google-login"||screen==="parent-code")?BG:CARD,paddingTop:36,flexShrink:0}}>
              <StatusBar/>
            </div>
          )}
          {/* Content */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:BG,position:"relative",fontSize:`${fontSize}rem`}}>
            {showNav && screen !== "dashboard" && <GlobalHeader title={title} sub={sub}/>}
            {renderScreen()}

            {/* Tombol tambah siswa mengambang — selalu dalam jangkauan ibu jari */}
            {role==="guru" && !guruSetup && !showOnboarding && !showAddStudent &&
             ["dashboard","students","talent-map","competition","report"].includes(screen) && (
              <button onClick={()=>openAddStudent(false)}
                style={{
                  position:"absolute", right:16, bottom:16, zIndex:40,
                  width:52, height:52,
                  background:DEEP, color:"#fff", fontFamily:IPS,
                  boxShadow:"0 8px 24px rgba(46,62,53,0.38)",
                  borderRadius:"50%", border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}
                className="active:scale-95 transition-transform">
                <span style={{fontSize:26, fontWeight:300, lineHeight:1}}>+</span>
              </button>
            )}

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

        <p className="text-xs font-semibold" style={{color:T,fontFamily:IPS,opacity:0.8}}>TalentaABK · GEMASTIK XVII · UX Design</p>
      </div>
    </div>
  </UI.Provider>
  </StudentsCtx.Provider>
  );
}
