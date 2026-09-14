import { useState, useEffect } from "react";
import {
  ChevronRight, Info, Key, XCircle, CheckCircle, ArrowLeft,
  Hash, ShieldCheck, Users, Sparkles, UserPlus, School, Plus, Upload,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
  Field,
} from "./ui-kit";
import { ABK_OPTIONS, type Role } from "./data";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import heroImage from "@/imports/image-23.png";

// ─── Google mark ──────────────────────────────────────────────────────
function GoogleMark({size=18}:{size?:number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{flexShrink:0}}>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.8l7.8 6.1C12.3 14 17.6 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9.1h12.4c-.5 2.9-2.1 5.4-4.5 7l7.1 5.5c4.2-3.9 6.6-9.6 6.6-17z"/>
      <path fill="#FBBC05" d="M10.4 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .8-4.4l-7.8-6.1C1 16.6 0 20.2 0 24s1 7.4 2.6 10.5l7.8-6.1z"/>
      <path fill="#34A853" d="M24 47.5c6.2 0 11.5-2 15.3-5.5l-7.1-5.5c-2 1.4-4.6 2.2-8.2 2.2-6.4 0-11.7-4.5-13.6-10.4l-7.8 6.1C6.5 42.1 14.6 47.5 24 47.5z"/>
    </svg>
  );
}

// ─── LANDING illustrations ────────────────────────────────────────────
function LogoMark() {
  return (
    <motion.svg animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} width="72" height="72" viewBox="0 0 72 72" fill="none">
      {/* leaf base */}
      <ellipse cx="36" cy="58" rx="18" ry="6" fill="#8BB098" opacity="0.3"/>
      {/* left figure (adult) */}
      <circle cx="28" cy="22" r="9" fill="#5B7A68"/>
      <path d="M18 50 Q18 36 28 34 Q32 33 34 36 L34 50Z" fill="#5B7A68"/>
      {/* right figure (child) */}
      <circle cx="46" cy="26" r="7" fill="#D4A843"/>
      <path d="M38 50 Q38 38 46 36 Q50 35 52 38 L52 50Z" fill="#D4A843"/>
      {/* heart formed by both */}
      <path d="M36 46 Q28 38 28 33 Q28 29 32 29 Q34 29 36 31 Q38 29 40 29 Q44 29 44 33 Q44 38 36 46Z" fill="#E8637A" opacity="0.85"/>
      {/* small leaf top-right */}
      <path d="M50 14 Q56 8 60 14 Q56 18 50 14Z" fill="#8BB098"/>
      <path d="M55 14 L55 20" stroke="#5B7A68" strokeWidth="1.2" strokeLinecap="round"/>
      {/* flower top-left */}
      <circle cx="20" cy="12" r="3" fill="#F5C9A0"/>
      <circle cx="16" cy="15" r="3" fill="#F5C9A0"/>
      <circle cx="24" cy="15" r="3" fill="#F5C9A0"/>
      <circle cx="20" cy="19" r="3" fill="#F5C9A0"/>
      <circle cx="20" cy="15" r="2" fill="#D4A843"/>
      {/* sparkles */}
      <circle cx="58" cy="22" r="1.5" fill="#8BB098"/>
      <circle cx="16" cy="32" r="1.2" fill="#D4A843" opacity="0.6"/>
    </motion.svg>
  );
}

function TeacherChildIllustration() {
  return (
    <svg width="300" height="190" viewBox="0 0 300 190" fill="none">
      {/* background blob */}
      <ellipse cx="150" cy="130" rx="130" ry="55" fill="#E8F0E9" opacity="0.7"/>

      {/* desk */}
      <rect x="40" y="140" width="220" height="10" rx="5" fill="#C8A87A" opacity="0.5"/>

      {/* books stack left */}
      <rect x="48" y="120" width="34" height="8" rx="3" fill="#5B7A68"/>
      <rect x="50" y="113" width="30" height="8" rx="3" fill="#D4A843"/>
      <rect x="52" y="106" width="26" height="8" rx="3" fill="#8BB098"/>

      {/* laptop */}
      <rect x="110" y="108" width="80" height="52" rx="5" fill="#5A5A6A"/>
      <rect x="113" y="111" width="74" height="46" rx="3" fill="#E8F5ED"/>
      {/* logo on laptop */}
      <path d="M148 130 Q143 124 143 121 Q143 118 146 118 Q148 118 150 120 Q152 118 154 118 Q157 118 157 121 Q157 124 150 130Z" fill="#8BB098" opacity="0.8"/>
      <rect x="100" y="158" width="100" height="5" rx="2.5" fill="#3A3A4A"/>

      {/* mug right */}
      <rect x="202" y="124" width="24" height="20" rx="4" fill="#fff" stroke="#8BB098" strokeWidth="1.5"/>
      <path d="M226 130 Q234 130 234 136 Q234 142 226 142" stroke="#8BB098" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M208 122 Q210 116 214 116 Q218 116 216 122" stroke="#8BB098" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* plant right */}
      <rect x="238" y="130" width="8" height="16" rx="2" fill="#C8A87A" opacity="0.7"/>
      <ellipse cx="242" cy="128" rx="10" ry="6" fill="#8BB098" opacity="0.6"/>
      <ellipse cx="236" cy="122" rx="7" ry="5" fill="#5B7A68" opacity="0.5"/>
      <ellipse cx="248" cy="120" rx="7" ry="5" fill="#5B7A68" opacity="0.5"/>

      {/* plant left */}
      <rect x="28" y="140" width="6" height="10" rx="2" fill="#C8A87A" opacity="0.6"/>
      <ellipse cx="31" cy="138" rx="8" ry="5" fill="#8BB098" opacity="0.5"/>
      <ellipse cx="26" cy="133" rx="6" ry="4" fill="#5B7A68" opacity="0.4"/>
      <ellipse cx="37" cy="132" rx="6" ry="4" fill="#5B7A68" opacity="0.4"/>

      {/* ADULT (teacher) — body */}
      <rect x="82" y="80" width="42" height="65" rx="14" fill="#5B7A68"/>
      {/* collar white */}
      <path d="M100 80 L103 92 L106 80" fill="#F0EDE8" opacity="0.9"/>
      {/* adult head */}
      <circle cx="103" cy="64" r="18" fill="#F5C9A0"/>
      {/* hair */}
      <path d="M84 58 Q85 44 103 44 Q121 44 122 58 Q118 50 103 49 Q88 50 84 58Z" fill="#2E1A0E"/>
      <path d="M84 58 Q81 68 85 74 Q83 65 86 60Z" fill="#2E1A0E"/>
      <path d="M122 58 Q125 68 121 74 Q123 65 120 60Z" fill="#2E1A0E"/>
      {/* eyes */}
      <ellipse cx="97" cy="64" rx="2" ry="2.2" fill="#2E1A0E"/>
      <ellipse cx="109" cy="64" rx="2" ry="2.2" fill="#2E1A0E"/>
      {/* smile */}
      <path d="M97 71 Q103 75 109 71" stroke="#C47A5A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* arm pointing to laptop */}
      <path d="M124 100 Q140 105 148 115" stroke="#5B7A68" strokeWidth="8" strokeLinecap="round"/>

      {/* CHILD — body */}
      <rect x="162" y="92" width="34" height="52" rx="11" fill="#D4A843" opacity="0.9"/>
      {/* child head */}
      <circle cx="179" cy="76" r="15" fill="#F5C9A0"/>
      {/* child hair */}
      <path d="M163 70 Q165 60 179 60 Q193 60 195 70 Q192 63 179 62 Q166 63 163 70Z" fill="#3D2010"/>
      {/* child eyes */}
      <ellipse cx="174" cy="76" rx="1.8" ry="2" fill="#2E1A0E"/>
      <ellipse cx="184" cy="76" rx="1.8" ry="2" fill="#2E1A0E"/>
      {/* child smile */}
      <path d="M174 82 Q179 86 184 82" stroke="#C47A5A" strokeWidth="1.3" fill="none" strokeLinecap="round"/>

      {/* chat bubble (heart) top-left */}
      <rect x="56" y="52" width="32" height="28" rx="10" fill="#fff" stroke="#8BB098" strokeWidth="1.5"/>
      <path d="M65 76 L60 84" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
      <path d="M65 76 L60 84" stroke="#8BB098" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M72 64 Q67 58 67 55 Q67 52 70 52 Q72 52 72 54 Q72 52 74 52 Q77 52 77 55 Q77 58 72 64Z" fill="#E8637A" opacity="0.85"/>

      {/* star top-right */}
      <path d="M228 48 L230 54 L236 54 L231 58 L233 64 L228 60 L223 64 L225 58 L220 54 L226 54Z" fill="#D4A843"/>
    </svg>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────
const SplashLogo = () => (
  <svg width="100" height="100" viewBox="0 0 72 72" fill="none">
    <ellipse cx="36" cy="58" rx="18" ry="6" fill="#8BB098" opacity="0.3"/>
    <circle cx="28" cy="22" r="9" fill="#5B7A68"/>
    <path d="M18 50 Q18 36 28 34 Q32 33 34 36 L34 50Z" fill="#5B7A68"/>
    <circle cx="46" cy="26" r="7" fill="#D4A843"/>
    <path d="M38 50 Q38 38 46 36 Q50 35 52 38 L52 50Z" fill="#D4A843"/>
    <path d="M36 46 Q28 38 28 33 Q28 29 32 29 Q34 29 36 31 Q38 29 40 29 Q44 29 44 33 Q44 38 36 46Z" fill="#E8637A" opacity="0.85"/>
    <path d="M50 14 Q56 8 60 14 Q56 18 50 14Z" fill="#8BB098"/>
    <path d="M55 14 L55 20" stroke="#5B7A68" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="20" cy="14" r="2" fill="#D4A843"/>
    <circle cx="58" cy="22" r="1.5" fill="#8BB098"/>
    <circle cx="16" cy="32" r="1.2" fill="#D4A843" opacity="0.6"/>
  </svg>
);

export function LandingScreen({onNext}:{onNext:()=>void}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const goNext = () => {
    if (step < 5) setStep(step + 1);
    else onNext();
  };

  const skip = () => onNext();

  const ONBOARDING_DATA = [
    { }, // 0: Splash
    {
      img: heroImage,
      title: "sareh asih",
      desc: "Temani setiap potensi, tumbuhkan prestasi. ♡"
    },
    {
      emoji: "🌱",
      title: "Kenali Potensi",
      desc: "Bantu guru mengenali karakter, kekuatan, minat, serta kebutuhan belajar setiap anak melalui pengamatan AI adaptif."
    },
    {
      emoji: "🪴",
      title: "Arahkan Pembelajaran",
      desc: "Hasil pengamatan diolah menjadi peta potensi yang memudahkan penentuan strategi pembelajaran personal."
    },
    {
      emoji: "📄",
      title: "Pantau Perkembangan",
      desc: "Catat dan bagikan perkembangan belajar, perilaku, komunikasi, dan capaian anak secara berkelanjutan."
    },
    {
      emoji: "🤝",
      title: "Selalu Terhubung",
      desc: "Guru dan orang tua saling terhubung lebih dekat untuk mendampingi anak mencapai potensi terbaiknya."
    }
  ];

  const current = ONBOARDING_DATA[step];

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{fontFamily:IPS, backgroundColor: step === 0 ? "#FAF8F5" : "#FAF8F5"}}>
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#FAF8F5]"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-4"
            >
              <SplashLogo />
            </motion.div>
            <h1 style={{fontFamily:PJS, fontSize:42, fontWeight:800, letterSpacing:"-1px", color:"#1F3D28", lineHeight: 1}}>
              sareh <span style={{color:"#72967F"}}>asih</span>
            </h1>
            <p style={{fontSize:13, color:"#5B7A68", marginTop:8, fontFamily:IPS, fontWeight:600}}>
              AI untuk guru SLB dan orang tua
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col bg-[#FAF8F5]"
          >
            {/* Header (Skip) */}
            <div className="flex justify-end p-6 pt-10">
              {step < 5 && (
                <button onClick={skip} className="text-sm font-bold bg-[#F0F5F1] px-4 py-2 rounded-full" style={{color: "#5B7A68"}}>
                  Lewati
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-12">
              {current.img ? (
                <div className="w-full h-64 mb-10 flex items-center justify-center">
                  <ImageWithFallback src={current.img} alt="Hero" className="w-full h-full object-contain" style={{mixBlendMode: "multiply"}} />
                </div>
              ) : (
                <div className="w-36 h-36 mb-10 rounded-full flex items-center justify-center text-6xl shadow-sm" style={{backgroundColor: "#E8F0E9", border: "4px solid #fff"}}>
                  {current.emoji}
                </div>
              )}

              <h2 style={{fontFamily:PJS, fontSize:28, fontWeight:800, color:"#1F3D28", marginBottom:14}}>
                {current.title}
              </h2>
              <p style={{fontSize:15, color:"#5B7A68", lineHeight:1.6}}>
                {current.desc}
              </p>
            </div>

            {/* Footer (Dots + Next) */}
            <div className="p-8 pb-12 flex flex-col items-center">
              <div className="flex gap-2.5 mb-10">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    style={{
                      width: step === i ? 28 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: step === i ? "#1F3D28" : "#D4E8DA",
                      transition: "width 0.3s ease, background-color 0.3s ease"
                    }}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                style={{
                  width:"100%", background:"#1F3D28", color:"#FFF", fontFamily:PJS, fontWeight:700, fontSize:16, minHeight:58, borderRadius:20, display:"flex", alignItems:"center", justifyContent: "center", boxShadow:"0 10px 25px rgba(31, 61, 40, 0.25)"
                }}
                className="active:scale-95 transition-transform flex justify-center gap-2"
              >
                {step === 5 ? "Mulai Petualangan" : "Lanjut"}
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PILIH ROLE ───────────────────────────────────────────────────────
export function RoleSelectScreen({onPick,onBack}:{onPick:(r:Role)=>void;onBack:()=>void}) {
  const ROLES = [
    {
      r: "guru" as Role,
      emoji: "👩‍🏫",
      title: "Saya Guru Pendamping",
      desc: "Lakukan pengamatan, petakan potensi anak, dan bagikan laporan ke orang tua.",
      bullets: ["Pengamatan adaptif sesuai kondisi ABK", "Manajemen kelompok kelas terintegrasi", "Laporan dan rekomendasi lomba"],
      bgInfo: "#E8F0E9",
      emojiSize: 32
    },
    {
      r: "ortu" as Role,
      emoji: "👨‍👩‍👧",
      title: "Saya Orang Tua",
      desc: "Pantau progres harian anak, baca laporan dari guru, dan temukan jadwal terapi.",
      bullets: ["Cek perkembangan anak real-time", "Terima laporan & catatan harian dari guru", "Temukan jadwal terapi & event terdekat"],
      bgInfo: "#FFF4E6",
      emojiSize: 32
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS, background: "#FDFBF7"}}>
      <div className="px-4 pt-4 pb-2">
        <button onClick={onBack} style={{minWidth:40,minHeight:40, background: "#FFF", border: "1px solid #E5E7EB"}} className="flex items-center justify-center rounded-2xl shadow-sm">
          <ArrowLeft size={18} style={{color: TEXT}}/>
        </button>
      </div>
      <div className="px-6 pb-10 pt-2">
        <h1 style={{fontFamily:PJS, fontSize:26, fontWeight:800, color:"#1F3D28", marginBottom:8}}>Masuk Sebagai Siapa?</h1>
        <p style={{fontSize:14, color:"#5B7A68", marginBottom:24, lineHeight:1.5}}>Tampilan dan fitur aplikasi akan disesuaikan dengan peran yang Anda pilih.</p>

        <div className="space-y-4">
          {ROLES.map(x => (
            <button key={x.r} onClick={() => onPick(x.r)}
              style={{background: "#FFF", border: "1.5px solid #EAEAEA", width: "100%", textAlign: "left", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"}}
              className="rounded-3xl p-5 transition-all hover:border-[#8BB098] hover:shadow-md group">

              <div className="flex gap-4 mb-4">
                <div style={{width: 60, height: 60, background: x.bgInfo, flexShrink: 0, fontSize: x.emojiSize}} className="rounded-2xl flex items-center justify-center">
                  {x.emoji}
                </div>
                <div className="flex-1">
                  <h3 style={{fontFamily:PJS, fontSize:18, fontWeight:700, color:"#1A2E20", marginBottom:4}}>{x.title}</h3>
                  <p style={{fontSize:13, color:"#5B7A68", lineHeight:1.4}}>{x.desc}</p>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-4" style={{borderTop: "1px dashed #EAEAEA"}}>
                {x.bullets.map(b => (
                  <div key={b} className="flex items-start gap-2.5">
                    <CheckCircle size={14} style={{color: "#8BB098", flexShrink: 0, marginTop: 2}}/>
                    <span style={{fontSize: 13, color: "#4A5568", lineHeight: 1.4}}>{b}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div style={{background: "#E8F0E9", border: "1px solid rgba(139, 176, 152, 0.3)"}} className="rounded-2xl p-4 flex items-start gap-3 mt-6">
          <ShieldCheck size={18} style={{color: "#2E5537", flexShrink: 0, marginTop: 1}}/>
          <p style={{fontSize: 12, color: "#2E5537", lineHeight: 1.5}}>
            Data anak dikelola secara tertutup. Orang tua memerlukan kode akses dari guru untuk melihat informasi.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── GOOGLE LOGIN ─────────────────────────────────────────────────────
export function GoogleLoginScreen({role,onBack,onSuccess}:{role:Role;onBack:()=>void;onSuccess:()=>void}) {
  const [loading,setLoading] = useState(false);
  const isGuru = role==="guru";

  const masuk = () => { setLoading(true); setTimeout(onSuccess, 900); };

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS,background:BG}}>
      <div className="px-4 pt-2 pb-1">
        <button onClick={onBack} style={{minWidth:44,minHeight:44}} className="flex items-center justify-center rounded-2xl">
          <ArrowLeft size={20} style={{color:TEXT}}/>
        </button>
      </div>

      <div className="px-5 pt-4 pb-8 flex flex-col items-center text-center">
        <div style={{width:76,height:76,background:SEC,borderRadius:26,fontSize:36}} className="flex items-center justify-center mb-4">
          {isGuru?"👩‍🏫":"👨‍👩‍👧"}
        </div>
        <p className="text-xs font-bold px-3 py-1 rounded-full mb-3" style={{background:SEC,color:DEEP,fontFamily:IPS}}>
          {isGuru?"Masuk sebagai Guru":"Masuk sebagai Orang Tua"}
        </p>
        <h1 className="font-bold" style={{fontFamily:PJS,fontSize:23,color:TEXT,marginBottom:6}}>Lanjutkan dengan Google</h1>
        <p className="text-sm leading-relaxed mb-7" style={{color:MUTED}}>
          Tidak perlu membuat kata sandi baru. Nama dan email Anda diambil otomatis dari akun Google.
        </p>

        <button onClick={masuk} disabled={loading}
          style={{width:"100%",background:CARD,border:`1.5px solid ${BDR}`,minHeight:56,borderRadius:18,color:TEXT,fontFamily:IPS,fontWeight:700,fontSize:15}}
          className="flex items-center justify-center gap-3 transition-opacity hover:opacity-90">
          {loading
            ? <><span style={{width:16,height:16,border:`2px solid ${BDR}`,borderTopColor:T,borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>Menghubungkan…</>
            : <><GoogleMark size={20}/>Lanjutkan dengan Google</>}
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

        {/* Akun tersimpan — mock chooser */}
        <div style={{background:CARD,border:`1px solid ${BDR}`,width:"100%"}} className="rounded-2xl mt-3 overflow-hidden">
          <p className="text-xs font-semibold px-4 pt-3 pb-2 text-left" style={{color:MUTED}}>Akun di perangkat ini</p>
          <button onClick={masuk} className="w-full flex items-center gap-3 px-4 py-3 text-left" style={{borderTop:`1px solid ${BDR}`,minHeight:60}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:isGuru?T:A,color:"#fff",fontFamily:PJS,fontWeight:700,flexShrink:0}} className="flex items-center justify-center text-sm">
              {isGuru?"S":"A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{color:TEXT}}>{isGuru?"Sari Dewi":"Ani Rahmawati"}</p>
              <p className="text-xs truncate" style={{color:MUTED,fontFamily:DMM}}>{isGuru?"sari.dewi@gmail.com":"ani.rahma@gmail.com"}</p>
            </div>
            <ChevronRight size={16} style={{color:MUTED,flexShrink:0}}/>
          </button>
        </div>

        <p className="text-xs leading-relaxed mt-5" style={{color:MUTED}}>
          Dengan melanjutkan, Anda menyetujui Kebijakan Privasi TalentaABK. Data anak tidak pernah dibagikan ke pihak ketiga.
        </p>
      </div>
    </div>
  );
}

// ─── GURU: POP-UP 1 — Konfirmasi akun Google ──────────────────────────
export interface GuruProfile {
  nama:string; email:string; sekolah:string;
  kelas:string[];           // derived from kelasAbkMap keys
  abk:string[];             // derived from kelasAbkMap values (unique)
  kelasAbkMap: Record<string,string>; // "VII A" → "Autism Spectrum Disorder"
}

export function AkunGuruModal({profile,onNext}:{profile:GuruProfile;onNext:(p:{nama:string;email:string})=>void}) {
  const [nama,setNama]   = useState(profile.nama);
  const [email,setEmail] = useState(profile.email);
  const [edit,setEdit]   = useState(false);
  const valid = nama.trim()!=="" && email.trim()!=="";

  return (
    <ModalShell step={1} total={3} title="Konfirmasi Akun Anda" desc="Data ini diambil dari akun Google Anda. Periksa dan ubah bila perlu.">
      <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
        <GoogleMark size={20}/>
        <p className="text-xs leading-relaxed" style={{color:DEEP,fontFamily:IPS}}>Terhubung dengan Google — Anda tidak perlu mengingat kata sandi baru.</p>
      </div>

      {edit ? (
        <div className="space-y-3">
          <Field label="Nama Lengkap" placeholder="Sari Dewi, S.Pd." value={nama} onChange={setNama} required/>
          <Field label="Email" placeholder="nama@gmail.com" value={email} onChange={setEmail} type="email" required/>
        </div>
      ) : (
        <div className="space-y-2">
          {[["Nama Lengkap",nama],["Email",email]].map(([l,v])=>(
            <div key={l} style={{background:BG,border:`1px solid ${BDR}`}} className="rounded-xl px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{color:MUTED,fontFamily:IPS}}>{l}</p>
              <p className="text-sm mt-0.5 font-medium" style={{color:TEXT,fontFamily:IPS}}>{v}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={()=>setEdit(!edit)} className="text-xs font-semibold mt-3" style={{color:T,fontFamily:IPS,minHeight:38}}>
        {edit?"✓ Selesai mengubah":"✎ Ubah nama atau email"}
      </button>

      <button onClick={()=>valid && onNext({nama:nama.trim(),email:email.trim()})} disabled={!valid}
        style={{width:"100%",background:valid?A:"#D1D5DB",color:"#fff",fontFamily:IPS,minHeight:50,marginTop:8}}
        className="rounded-2xl text-sm font-bold">
        Lanjut →
      </button>
    </ModalShell>
  );
}

// ─── GURU: POP-UP 2 — Profil sekolah & pengajaran ─────────────────────
export function ProfilSekolahModal({profile,onBack,onNext}:{profile:GuruProfile;onBack:()=>void;onNext:(p:{sekolah:string;kelas:string[];abk:string[];kelasAbkMap:Record<string,string>})=>void}) {
  const [sekolah,setSekolah]       = useState(profile.sekolah);
  const [kelasAbkMap,setKelasAbkMap] = useState<Record<string,string>>(profile.kelasAbkMap ?? {});
  const [kelasInput,setKelasInput] = useState("");
  const [abkInput,setAbkInput]     = useState<string[]>([]);
  const [lainnyaInput,setLainnyaInput] = useState("");

  const addClass = () => {
    const k = kelasInput.trim();
    let selectedAbks = abkInput.filter(x => x !== "Lainnya");
    if (abkInput.includes("Lainnya") && lainnyaInput.trim()) {
      selectedAbks.push(lainnyaInput.trim());
    }
    if (!k || selectedAbks.length === 0) return;
    setKelasAbkMap(m => ({...m, [k]: selectedAbks.join(" · ")}));
    setKelasInput(""); setAbkInput([]); setLainnyaInput("");
  };
  const removeClass = (k:string) => setKelasAbkMap(m => { const n={...m}; delete n[k]; return n; });

  const entries = Object.entries(kelasAbkMap);
  const valid   = sekolah.trim() !== "" && entries.length > 0;

  return (
    <ModalShell step={2} total={3} title="Profil Mengajar" desc="Buat kelompok kelas — setiap kelas terhubung ke jenis ABK yang diajar.">
      <div className="space-y-4">
        <Field label="Nama Sekolah" placeholder="SLB Negeri 1 Bandung" value={sekolah} onChange={setSekolah} required/>

        {/* Classroom-style kelas + ABK */}
        <div>
          <p style={{fontSize:13,fontWeight:600,color:TEXT,fontFamily:IPS,marginBottom:6}}>
            Kelompok Kelas/Ekskul/Mapel <span style={{color:A}}>*</span>
            {entries.length>0 && <span style={{fontWeight:400,color:MUTED,marginLeft:6}}>· {entries.length} kelas</span>}
          </p>
          {/* Row 1: nama kelas */}
          <div style={{display:"flex",gap:6,marginBottom:6}}>
            <input
              value={kelasInput}
              onChange={e=>setKelasInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addClass(); } }}
              placeholder="Nama kelas · contoh: VII A"
              style={{flex:1,border:`1.5px solid ${BDR}`,borderRadius:12,padding:"9px 12px",fontSize:13,color:TEXT,fontFamily:IPS,background:CARD,outline:"none",minHeight:42}}
            />
          </div>
          {/* Row 2: jenis ABK pilihan (chips) + tombol tambah */}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {[...ABK_OPTIONS, "Lainnya"].map(o=>(
                <button
                  key={o}
                  onClick={()=>setAbkInput(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o])}
                  style={{
                    background: abkInput.includes(o) ? SEC : BG,
                    border: `1.5px solid ${abkInput.includes(o) ? T : BDR}`,
                    color: abkInput.includes(o) ? DEEP : MUTED,
                    padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, fontFamily: IPS,
                    cursor: "pointer", transition: "all 0.2s"
                  }}>
                  {o}
                </button>
              ))}
            </div>
            {abkInput.includes("Lainnya") && (
              <input
                autoFocus
                placeholder="Tulis jenis ABK spesifik..."
                value={lainnyaInput}
                onChange={e => setLainnyaInput(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter") { e.preventDefault(); addClass(); } }}
                style={{width:"100%",border:`1.5px solid ${BDR}`,borderRadius:12,padding:"9px 12px",fontSize:13,color:TEXT,fontFamily:IPS,background:CARD,outline:"none"}}
              />
            )}
            <button
              onClick={addClass}
              disabled={!kelasInput.trim() || abkInput.length === 0 || (abkInput.length === 1 && abkInput[0] === "Lainnya" && !lainnyaInput.trim())}
              style={{width:"100%",height:42,borderRadius:12,background:(!kelasInput.trim() || abkInput.length === 0 || (abkInput.length === 1 && abkInput[0] === "Lainnya" && !lainnyaInput.trim()))?"#D1D5DB":T,border:"none",cursor:(!kelasInput.trim() || abkInput.length === 0 || (abkInput.length === 1 && abkInput[0] === "Lainnya" && !lainnyaInput.trim()))?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"bold",fontFamily:IPS,fontSize:14,marginTop:4}}>
              <Plus size={16} style={{marginRight:6}}/> Tambah Kelas
            </button>
          </div>
          <p style={{fontSize:11,color:MUTED,fontFamily:IPS,marginTop:8}}>
            Isi nama kelas + tekan jenis ABK, lalu tekan <strong>Tambah Kelas</strong>
          </p>

          {/* Classroom cards */}
          {entries.length > 0 && (
            <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:16}}>
              <p style={{fontSize:13,fontWeight:600,color:TEXT,fontFamily:IPS}}>
                Kelas terdaftar di {sekolah || "SLB Anda"}
              </p>
              {entries.map(([k,a])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:10,background:SEC,border:`1px solid ${T}`,borderRadius:14,padding:"8px 12px"}}>
                  <div style={{width:32,height:32,background:T,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <School size={15} style={{color:"#fff"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:700,color:DEEP,fontFamily:IPS,lineHeight:1}}>{k}</p>
                    <p style={{fontSize:11,color:MUTED,marginTop:2}}>{a}</p>
                  </div>
                  <button onClick={()=>removeClass(k)} style={{background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",padding:0}}>
                    <XCircle size={16} style={{color:MUTED}}/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button onClick={onBack} style={{flex:1,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:50,background:CARD}} className="rounded-2xl text-sm font-semibold">
          Kembali
        </button>
        <button
          onClick={()=>{ if(!valid) return; const kelas=Object.keys(kelasAbkMap); const abk=[...new Set(Object.values(kelasAbkMap))]; onNext({sekolah:sekolah.trim(),kelas,abk,kelasAbkMap}); }}
          disabled={!valid}
          style={{flex:2,background:valid?A:"#D1D5DB",color:"#fff",fontFamily:IPS,minHeight:50}} className="rounded-2xl text-sm font-bold">
          Lanjut →
        </button>
      </div>
    </ModalShell>
  );
}

// ─── GURU: POP-UP 3 — Ajakan tambah siswa ─────────────────────────────
export function TambahSiswaPromptModal({sekolah,jumlahKelas,onOpenForm,onSkip}:{sekolah:string;jumlahKelas:number;onOpenForm:()=>void;onSkip:()=>void}) {
  return (
    <ModalShell step={3} total={3} title="Tambahkan Siswa Anda" desc={`${sekolah} · ${jumlahKelas} kelas`}>
      <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={15} style={{color:T}}/>
          <p className="text-sm font-bold" style={{color:DEEP,fontFamily:PJS}}>Daftar siswa masih kosong</p>
        </div>
        <p className="text-xs leading-relaxed" style={{color:DEEP,fontFamily:IPS}}>
          Guru yang menginput data siswa — cukup nama, kelas, dan jenis ABK. Sisanya bisa dilengkapi kapan saja.
        </p>
      </div>

      <div className="space-y-2 mb-5">
        {[
          {icon:<Sparkles size={14} style={{color:T}}/>, t:"AI langsung menyiapkan indikator pengamatan sesuai jenis ABK tiap siswa"},
          {icon:<Key size={14} style={{color:T}}/>,      t:"Kode akses orang tua dibuat otomatis untuk setiap siswa"},
          {icon:<School size={14} style={{color:T}}/>,   t:"Siswa langsung masuk ke kelas yang Anda ajar"},
        ].map(x=>(
          <div key={x.t} style={{background:BG,border:`1px solid ${BDR}`}} className="rounded-xl px-3 py-2.5 flex items-start gap-2.5">
            <span style={{flexShrink:0,marginTop:1}}>{x.icon}</span>
            <p className="text-xs leading-relaxed" style={{color:TEXT,fontFamily:IPS}}>{x.t}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        <button style={{width:"100%",background:CARD,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:50}}
          className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
          <Upload size={16}/>Upload Daftar Siswa
        </button>
        <p className="text-center" style={{fontSize:10, color:MUTED, marginTop:-6, marginBottom:2}}>Format: CSV, Excel, JPG, PNG</p>
        
        <button onClick={onOpenForm} style={{width:"100%",background:A,color:"#fff",fontFamily:IPS,minHeight:50}}
          className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
          <UserPlus size={16}/>Tambah Siswa (Manual)
        </button>
      </div>
      <button onClick={onSkip} style={{width:"100%",color:MUTED,fontFamily:IPS,minHeight:44,marginTop:6,background:"transparent"}}
        className="text-xs font-semibold">
        Nanti saja, masuk ke aplikasi dulu
      </button>
    </ModalShell>
  );
}

// ─── ORANG TUA: Kode akses (dengan opsi lewati) ───────────────────────
export function ParentCodeScreen({onBack,onLinked,onSkip,namaOrtu}:{onBack:()=>void;onLinked:(kode:string)=>void;onSkip:()=>void;namaOrtu:string}) {
  const [kode,setKode] = useState("");
  const [err,setErr]   = useState("");

  const submit = () => {
    const k = kode.trim().toUpperCase();
    if (k==="") { setErr("Kode akses belum diisi."); return; }
    if (!/^ABK-\d{4}-[A-Z]+$/.test(k)) {
      setErr("Kode tidak valid atau sudah kedaluwarsa. Hubungi guru pendamping anak Anda.");
      return;
    }
    onLinked(k);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS,background:BG}}>
      <div className="px-4 pt-2 pb-1">
        <button onClick={onBack} style={{minWidth:44,minHeight:44}} className="flex items-center justify-center rounded-2xl">
          <ArrowLeft size={20} style={{color:TEXT}}/>
        </button>
      </div>

      <div className="px-5 pb-8">
        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-5">
          <div style={{width:38,height:38,borderRadius:"50%",background:A,color:"#fff",fontFamily:PJS,fontWeight:700,flexShrink:0}} className="flex items-center justify-center text-sm">
            {namaOrtu[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{color:TEXT}}>Halo, {namaOrtu.split(" ")[0]} 👋</p>
            <p className="text-xs" style={{color:MUTED}}>Berhasil masuk dengan Google</p>
          </div>
          <CheckCircle size={18} style={{color:T,flexShrink:0}}/>
        </div>

        <h1 className="font-bold" style={{fontFamily:PJS,fontSize:23,color:TEXT,marginBottom:6}}>Hubungkan dengan Anak Anda</h1>
        <p className="text-sm leading-relaxed mb-5" style={{color:MUTED}}>
          Masukkan kode akses dari guru pendamping untuk melihat perkembangan anak.
        </p>

        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{color:TEXT}}>Kode Akses Anak</label>
            <div className="relative">
              <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:MUTED}}/>
              <input value={kode} onChange={e=>{setKode(e.target.value);setErr("");}}
                placeholder="ABK-2025-RAFI"
                style={{width:"100%",border:`1.5px solid ${err?"#B91C1C":BDR}`,borderRadius:12,padding:"12px 12px 12px 36px",fontSize:15,color:TEXT,fontFamily:DMM,background:BG,outline:"none",minHeight:50,letterSpacing:"0.08em",textTransform:"uppercase"}}/>
            </div>
            {err && (
              <div className="mt-2 rounded-xl p-3 flex items-start gap-2" style={{background:"#FEF2F2"}}>
                <XCircle size={13} style={{color:"#B91C1C",flexShrink:0,marginTop:1}}/>
                <p className="text-xs leading-relaxed" style={{color:"#B91C1C"}}>{err}</p>
              </div>
            )}
          </div>

          <button onClick={submit}
            style={{width:"100%",background:A,color:"#fff",fontFamily:IPS,minHeight:50}}
            className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
            <Key size={15}/>Hubungkan Sekarang
          </button>

          <p className="text-xs text-center" style={{color:MUTED}}>Contoh kode aktif: <strong style={{fontFamily:DMM,color:T}}>ABK-2025-RAFI</strong></p>
        </div>

        {/* Opsi masuk tanpa kode */}
        <div className="flex items-center gap-3 my-5">
          <div style={{height:1,flex:1,background:BDR}}/>
          <span className="text-xs" style={{color:MUTED}}>atau</span>
          <div style={{height:1,flex:1,background:BDR}}/>
        </div>

        <button onClick={onSkip}
          style={{width:"100%",background:CARD,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:50}}
          className="rounded-2xl text-sm font-bold">
          Masuk Tanpa Kode Akses
        </button>

        <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5 mt-3">
          <Info size={14} style={{color:T,flexShrink:0,marginTop:1}}/>
          <p className="text-xs leading-relaxed" style={{color:T}}>
            Tanpa kode, Anda tetap bisa membuka <strong>kalender event & lomba ABK</strong> serta <strong>info pelatihan dan terapi terdekat</strong>. Kode bisa dimasukkan kapan saja dari halaman Beranda.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Shell modal bertahap ─────────────────────────────────────────────
function ModalShell({step,total,title,desc,children}:{step:number;total:number;title:string;desc:string;children:React.ReactNode}) {
  return (
    <div style={{position:"absolute",inset:0,zIndex:70,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(46,62,53,0.5)"}}/>
      <div style={{position:"relative",background:CARD,borderRadius:"26px 26px 0 0",maxHeight:"93%",display:"flex",flexDirection:"column"}}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{width:36,height:4,borderRadius:2,background:"#D1D5DB"}}/>
        </div>
        <div className="px-5 pb-3 flex-shrink-0" style={{borderBottom:`1px solid ${BDR}`}}>
          <div className="flex items-center gap-1.5 mb-2">
            {Array.from({length:total}).map((_,i)=>(
              <div key={i} style={{height:4,flex:1,borderRadius:2,background:step>=i+1?T:"#E5E7EB"}}/>
            ))}
            <span className="text-xs ml-1" style={{color:MUTED,fontFamily:DMM}}>{step}/{total}</span>
          </div>
          <p className="font-bold" style={{fontFamily:PJS,fontSize:18,color:TEXT}}>{title}</p>
          <p className="text-xs mt-0.5" style={{color:MUTED,fontFamily:IPS}}>{desc}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-6">{children}</div>
      </div>
    </div>
  );
}
