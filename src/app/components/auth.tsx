import { useState, useEffect, useRef } from "react";
import {
  ChevronRight, Info, Key, XCircle, CheckCircle, ArrowLeft,
  Hash, ShieldCheck, Users, Sparkles, UserPlus, School, Plus, Upload,
  FileText, Building2, Phone, Briefcase, AlertCircle, Eye, Trash2, Database,
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
  <svg width="120" height="101" viewBox="0 0 125 105" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M72.1475 37.0083C72.1475 55.1312 64.7526 104 52.6236 104C40.4945 104 9.92851 85.9004 1.56112 49.7014C-5.18691 31.5364 10.5761 -4.50951 36.5986 1.51474C48.7277 1.51474 72.1475 18.8854 72.1475 37.0083Z" fill="#8BB098"/>
    <ellipse cx="88.0087" cy="15.2788" rx="13.9456" ry="15.2788" fill="#D27D6B"/>
    <path d="M63.653 103.76C63.6346 103.794 63.6162 103.828 63.5978 103.862C63.6144 103.828 63.6328 103.794 63.653 103.76C69.4179 93.091 73.6973 62.8798 80.4557 53.8555C87.2358 44.8023 121.616 22.8219 122.996 33.3994C124.927 48.2081 124.653 51.2698 116.929 68.8991C108.706 87.6672 87.2839 94.313 80.0972 97.2651C72.7874 100.268 64.8815 101.715 63.653 103.76Z" fill="#8BB098"/>
    <path d="M63.5978 103.862C69.3906 93.2841 73.6757 62.9086 80.4557 53.8555C87.2358 44.8023 121.616 22.8219 122.996 33.3994C124.927 48.2081 124.653 51.2698 116.929 68.8991C108.706 87.6672 87.2839 94.313 80.0972 97.2651C72.6669 100.317 64.6208 101.763 63.5978 103.862Z" stroke="#8BB098"/>
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
            className="absolute inset-0 flex flex-col items-center z-50"
            style={{ backgroundColor: "#E8F0E9", paddingTop: "38%" }}
          >
            {/* Logo + teks */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-4"
            >
              <SplashLogo />
            </motion.div>
            <h1 style={{fontFamily:PJS, fontSize:36, fontWeight:800, letterSpacing:"-0.5px", color:TEXT, lineHeight: 1}}>
              sareh <span style={{color:"#72967F"}}>asih</span>
            </h1>


            {/* Elemen 1 – Tanaman dekoratif pojok kiri bawah */}
            <div style={{ position:"absolute", bottom: 60, left: -22, pointerEvents:"none", zIndex: 2 }}>
              <svg width="137" height="273" viewBox="0 0 137 273" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32.1326 208.758C31.9646 213.168 27.1053 224.237 9.14134 233.75C8.53025 234.074 7.93348 234.459 7.39999 234.899C-12.3609 251.194 -18.0102 265.436 -18.3526 270.575" stroke="#E7BDA8" strokeWidth="3" strokeLinecap="round"/>
                <path d="M42.8568 170.439C38.1932 179.2 33.5223 198.392 31.7651 209.394C37.1872 209.179 49.2985 208.46 54.3675 207.301C60.7038 205.851 80.9932 198.131 87.4123 192.56C93.8313 186.988 96.9086 184.745 111.275 157.864C113.024 152.95 115.184 132.35 110.962 125.109C110.252 124.245 103.082 122.5 78.4177 133.067C51.4035 149.506 46.7671 163.094 42.8568 170.439Z" fill="#E7BDA8" stroke="#E6BEA8"/>
                <path d="M69.7906 85.8494C64.4235 87.9581 54.8506 94.7207 49.7253 98.9533C51.9475 100.953 57.0081 105.312 59.4721 106.753C62.5521 108.555 73.6547 112.949 78.4283 112.942C83.2019 112.936 85.3178 113.124 101.808 106.675C104.477 105.157 113.628 96.7954 114.883 91.9317C114.951 91.2717 112.83 87.7221 98.8568 82.9079C81.5919 79.8071 74.2907 84.0812 69.7906 85.8494Z" fill="#B7C2B2" stroke="#B7C2B2"/>
                <path d="M42.2832 77.5062C43.0491 83.2216 41.7923 94.8746 40.5847 101.411C37.7571 100.441 31.4877 98.1374 29.0305 96.6846C25.9591 94.8685 16.7219 87.3019 14.4075 83.1268C12.0932 78.9518 10.9004 77.1941 8.52008 59.6483C8.54956 56.5784 11.4087 44.5163 15.0493 41.0555C15.5929 40.6753 19.7261 40.8036 30.7253 50.675C41.8272 64.2558 41.641 72.714 42.2832 77.5062Z" fill="#B7C2B2" stroke="#B7C2B2"/>
                <path d="M79.29 72.3772C74.3481 75.3487 63.1534 78.8203 56.6745 80.3062C56.4427 77.3258 56.0687 70.6571 56.4269 67.8251C56.8747 64.2852 60.1535 52.8035 63.0671 49.0222C65.9807 45.2408 67.1206 43.4484 82.2804 34.2996C85.1098 33.1082 97.316 30.945 101.937 32.9129C102.502 33.261 104.025 37.1056 99.3299 51.1194C91.271 66.6996 83.4337 69.8858 79.29 72.3772Z" fill="#B7C2B2" stroke="#B7C2B2"/>
                <path d="M57.2595 79.4744C47.5138 115.003 38.6248 89.9982 19.3496 116.017C3.92941 136.832 -0.879248 151.053 -1.35605 155.561" stroke="#B7C2B2" strokeWidth="3" strokeLinecap="round"/>
                <path d="M8.55377 159.756C7.5141 163.754 3.38691 172.418 -5.0138 176.666C-5.95918 177.145 -6.87957 177.687 -7.66241 178.401C-18.48 188.263 -23.7143 199.831 -25 204.524" stroke="#E7BDA8" strokeWidth="3" strokeLinecap="round"/>
                <path d="M16.7042 140.746C13.1361 145.276 8.28704 155.947 5.99976 162.188C8.92748 162.792 15.4966 164 18.3511 164C21.9192 164 33.7216 162.188 37.8387 159.772C41.9558 157.356 43.8772 156.45 54.8561 142.558C56.3932 139.901 60.0711 128.063 58.6987 123.231C58.4243 122.627 54.8012 120.634 40.309 123.533C23.8406 129.573 19.6961 136.948 16.7042 140.746Z" fill="#E7BDA8" stroke="#E6BEA8"/>
              </svg>
            </div>

            {/* Elemen 2 – Gelombang coral di bawah */}
            <div style={{ position:"absolute", bottom: 0, left: 0, right: 0, pointerEvents:"none", zIndex: 1 }}>
              <svg width="100%" viewBox="0 0 393 181" preserveAspectRatio="xMidYMax meet" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M133.5 40.8454C70.3652 84.2505 -43.3735 58.0765 -9.30923 122.129C-8.40301 123.833 -7.8811 125.839 -7.98623 127.766L-11.4248 190.801C-11.7372 196.53 -7.17647 201.346 -1.43958 201.346H384C389.523 201.346 394 196.905 394 191.382V24.6007C394 20.5922 390.796 17.2675 386.787 17.2675C385.725 17.2675 384.683 17.0532 383.712 16.6228C353.987 3.45608 248.097 -22.6012 133.5 40.8454Z" fill="#D27D6B" fillOpacity="0.5"/>
              </svg>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col"
            style={{ backgroundColor: "#FAF8F5" }}
          >
            {step === 1 ? (
              /* ── Hero fullscreen (step 1) ─────────────────────── */
              <div style={{ position:"relative", width:"100%", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                {/* Background image – Unsplash */}
                <img
                  src="https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=800&q=80"
                  alt="Ibu dan anak belajar bersama"
                  style={{
                    position:"absolute", inset:0, width:"100%", height:"100%",
                    objectFit:"cover", objectPosition:"top center", zIndex:1
                  }}
                />
                {/* Gradient overlay – bawah putih */}
                <div style={{
                  position:"absolute", inset:0,
                  background:"linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 28%, rgba(255,255,255,0) 55%)",
                  zIndex:2
                }}/>

                {/* Content bawah */}
                <div style={{ position:"relative", zIndex:3, padding:"0 24px 40px", display:"flex", flexDirection:"column", alignItems:"center" }}>
                  <p style={{
                    fontFamily:PJS, fontSize:24, fontWeight:800,
                    color:TEXT, lineHeight:1.35, marginBottom:24,
                    textAlign:"center",
                  }}>
                    Temani setiap potensi,<br/>tumbuhkan prestasi. ♡
                  </p>
                  <button
                    onClick={goNext}
                    className="active:scale-95 transition-transform"
                    style={{
                      width:"100%", background:A, color:"#fff",
                      fontFamily:PJS, fontWeight:700, fontSize:16,
                      border:"none", borderRadius:16, padding:"16px 24px",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      gap:8, cursor:"pointer",
                      boxShadow:"0 4px 16px rgba(210,125,107,0.35)"
                    }}
                  >
                    <span>Mulai</span>
                    <ChevronRight size={18} strokeWidth={2.5}/>
                  </button>
                </div>
              </div>
            ) : (
              /* ── Onboarding steps 2–5 ─────────────────────────── */
              <>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-12">
                  <div className="w-36 h-36 mb-10 rounded-full flex items-center justify-center text-6xl shadow-sm" style={{backgroundColor: "#E8F0E9", border: "4px solid #fff"}}>
                    {current.emoji}
                  </div>
                  <h2 style={{fontFamily:PJS, fontSize:28, fontWeight:800, color:TEXT, marginBottom:14}}>
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
                          backgroundColor: step === i ? A : "#D4E8DA",
                          transition: "width 0.3s ease, background-color 0.3s ease"
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={goNext}
                    style={{
                      width:"100%", background:A, color:"#FFF", fontFamily:PJS, fontWeight:700, fontSize:16, minHeight:58, borderRadius:20, display:"flex", alignItems:"center", justifyContent: "center", boxShadow:"0 10px 25px rgba(210,125,107,0.35)"
                    }}
                    className="active:scale-95 transition-transform flex justify-center gap-2"
                  >
                    {step === 5 ? "Mulai Petualangan" : "Lanjut"}
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </>
            )}
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
      title: "Guru Pendamping",
      tagline: "Kelola siswa & pantau perkembangan ABK",
      accent: T,
      accentLight: "#E8F0E9",
      accentShadow: "rgba(139,176,152,0.3)",
    },
    {
      r: "ortu" as Role,
      emoji: "👨‍👩‍👧",
      title: "Orang Tua",
      tagline: "Ikuti perkembangan & terima laporan anak",
      accent: A,
      accentLight: "#FFF0EC",
      accentShadow: "rgba(210,125,107,0.3)",
    },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{fontFamily:IPS, background:"#FDFBF7"}}>
      <div className="px-4 pt-4 pb-2">
        <button onClick={onBack} style={{minWidth:40,minHeight:40,background:"#FFF",border:"1px solid #E5E7EB"}} className="flex items-center justify-center rounded-2xl shadow-sm">
          <ArrowLeft size={18} style={{color:TEXT}}/>
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-10 gap-4" style={{paddingTop:20}}>
        <div className="mb-2">
          <h1 style={{fontFamily:PJS, fontSize:24, fontWeight:800, color:TEXT, marginBottom:4}}>Masuk sebagai?</h1>
          <p style={{fontSize:14, color:MUTED}}>Pilih peran Anda untuk melanjutkan.</p>
        </div>

        {ROLES.map(x => (
          <button key={x.r} onClick={() => onPick(x.r)}
            style={{
              background:"#FFF",
              border:`2px solid ${x.accentLight}`,
              width:"100%", textAlign:"left",
              boxShadow:`0 6px 24px ${x.accentShadow}`,
              borderRadius:20, overflow:"hidden",
            }}
            className="transition-all active:scale-[0.98]">
            <div style={{background:x.accent, padding:"18px 20px", display:"flex", alignItems:"center", gap:14}}>
              <div style={{fontSize:38, width:54, height:54, background:"rgba(255,255,255,0.22)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                {x.emoji}
              </div>
              <div className="flex-1">
                <div style={{fontFamily:PJS, fontWeight:800, fontSize:18, color:"#fff"}}>{x.title}</div>
                <div style={{fontSize:14, color:"rgba(255,255,255,0.85)", marginTop:3}}>{x.tagline}</div>
              </div>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <ChevronRight size={22} strokeWidth={2.5} color="#fff"/>
              </div>
            </div>
          </button>
        ))}

        <div style={{background:"#E8F0E9", borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:10, marginTop:4}}>
          <ShieldCheck size={15} style={{color:DEEP, flexShrink:0, marginTop:1}}/>
          <p style={{fontSize:13, color:DEEP, lineHeight:1.5, margin:0}}>
            Data anak dijaga kerahasiaannya. Orang tua butuh kode akses dari guru.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── GOOGLE LOGIN ─────────────────────────────────────────────────────
export function GoogleLoginScreen({role,onBack,onSuccess}:{role:Role;onBack:()=>void;onSuccess:()=>void}) {
  const [loading,setLoading] = useState(false);
  const [loadingFb,setLoadingFb] = useState(false);
  const isGuru = role==="guru";

  const masuk = () => { setLoading(true); setTimeout(onSuccess, 900); };
  const masukFb = () => { setLoadingFb(true); setTimeout(onSuccess, 900); };

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS,background:BG}}>
      <div className="px-4 pt-2 pb-1">
        <button onClick={onBack} style={{minWidth:44,minHeight:44}} className="flex items-center justify-center rounded-2xl">
          <ArrowLeft size={20} style={{color:TEXT}}/>
        </button>
      </div>

      <div className="px-5 pt-4 pb-8 flex flex-col items-center text-center">
        {/* Avatar */}
        <div style={{width:76,height:76,background:SEC,borderRadius:26,fontSize:36}} className="flex items-center justify-center mb-4">
          {isGuru?"👩‍🏫":"👨‍👩‍👧"}
        </div>

        {/* Badge peran */}
        <p className="text-xs font-bold px-3 py-1 rounded-full mb-3" style={{background:SEC,color:DEEP,fontFamily:IPS}}>
          {isGuru?"Masuk sebagai Guru":"Masuk sebagai Orang Tua"}
        </p>

        {/* Heading */}
        <h1 className="font-bold" style={{fontFamily:PJS,fontSize:22,color:TEXT,marginBottom:6,lineHeight:1.25}}>
          Selamat Datang di<br/>SarehAsih 👋
        </h1>
        <p className="text-sm leading-relaxed mb-7" style={{color:MUTED}}>
          {isGuru?"Masuk untuk mengelola kelas dan pantau perkembangan siswa.":"Masuk untuk mendampingi perkembangan anak Anda."}
        </p>

        {/* Tombol Google */}
        <button onClick={masuk} disabled={loading||loadingFb}
          style={{width:"100%",background:CARD,border:"2px solid #DADCE0",minHeight:54,borderRadius:16,color:TEXT,fontFamily:IPS,fontWeight:700,fontSize:15,marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}
          className="flex items-center justify-center gap-3 transition-opacity hover:opacity-90">
          {loading
            ? <><span style={{width:16,height:16,border:`2px solid ${BDR}`,borderTopColor:T,borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>Menghubungkan…</>
            : <><GoogleMark size={20}/>Lanjutkan dengan Google</>}
        </button>

        {/* Tombol Facebook */}
        <button onClick={masukFb} disabled={loading||loadingFb}
          style={{width:"100%",background:"#1877F2",border:"none",minHeight:54,borderRadius:16,color:"#fff",fontFamily:IPS,fontWeight:700,fontSize:15}}
          className="flex items-center justify-center gap-3 transition-opacity hover:opacity-90">
          {loadingFb
            ? <><span style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>Menghubungkan…</>
            : <>
                {/* Facebook icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Lanjutkan dengan Facebook
              </>}
        </button>

        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full my-5">
          <div style={{flex:1,height:1,background:BDR}}/>
          <span style={{fontSize:12,color:MUTED,fontFamily:IPS}}>atau</span>
          <div style={{flex:1,height:1,background:BDR}}/>
        </div>

        {/* Akun tersimpan — mock chooser */}
        <div style={{background:CARD,border:`1px solid ${BDR}`,width:"100%"}} className="rounded-2xl overflow-hidden">
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
          Dengan melanjutkan, Anda menyetujui{" "}
          <span style={{color:T,fontWeight:600}}>Kebijakan Privasi</span> &{" "}
          <span style={{color:T,fontWeight:600}}>Ketentuan Layanan</span>.
        </p>
      </div>
    </div>
  );
}


// ─── GURU: POP-UP 1 — Konfirmasi akun Google ──────────────────────────
export interface GuruProfile {
  nama:string; email:string; sekolah:string;
  jabatan:string;           // SRS-F-002: posisi/jabatan guru
  noHp:string;              // SRS-F-002: nomor HP (opsional)
  kelas:string[];           // derived from kelasAbkMap keys
  abk:string[];             // derived from kelasAbkMap values (unique)
  kelasAbkMap: Record<string,string>; // "VII A" → "Autism Spectrum Disorder"
}

// SRS-F-002: Profil guru lengkap — nama, email, jabatan, noHp
export function AkunGuruModal({profile,onNext}:{profile:GuruProfile;onNext:(p:{nama:string;email:string;jabatan:string;noHp:string})=>void}) {
  const [nama,setNama]     = useState(profile.nama);
  const [email,setEmail]   = useState(profile.email);
  const [jabatan,setJabatan] = useState(profile.jabatan||"");
  const [noHp,setNoHp]     = useState(profile.noHp||"");
  const [edit,setEdit]     = useState(false);
  const valid = nama.trim()!=="" && email.trim()!=="" && jabatan.trim()!=="";

  const JABATAN_OPTIONS = [
    "Guru Kelas","Guru Mata Pelajaran","Guru Pendamping Khusus (GPK)",
    "Kepala Sekolah","Wali Kelas","Terapis","Konselor",
  ];

  return (
    <ModalShell step={1} total={3} title="Konfirmasi Profil Anda" desc="Data diambil dari akun Google. Lengkapi jabatan untuk melanjutkan.">
      {/* Google badge */}
      <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
        <GoogleMark size={18}/>
        <p className="text-xs leading-relaxed" style={{color:DEEP,fontFamily:IPS}}>Terhubung dengan Google — Anda tidak perlu mengingat kata sandi baru.</p>
      </div>

      <div className="space-y-3">
        {/* Nama & email — tampil/edit */}
        {edit ? (
          <>
            <Field label="Nama Lengkap" placeholder="Sari Dewi, S.Pd." value={nama} onChange={setNama} required/>
            <Field label="Email" placeholder="nama@gmail.com" value={email} onChange={setEmail} type="email" required/>
          </>
        ) : (
          <div className="space-y-2">
            {([["Nama Lengkap",nama],["Email",email]] as [string,string][]).map(([l,v])=>(
              <div key={l} style={{background:BG,border:`1px solid ${BDR}`}} className="rounded-xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{color:MUTED,fontFamily:IPS}}>{l}</p>
                <p className="text-sm mt-0.5 font-medium" style={{color:TEXT,fontFamily:IPS}}>{v||"—"}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={()=>setEdit(!edit)} className="text-xs font-semibold" style={{color:T,fontFamily:IPS,minHeight:36}}>
          {edit?"✓ Selesai mengubah":"✎ Ubah nama atau email"}
        </button>

        {/* Jabatan — wajib (SRS-F-002) */}
        <div>
          <label className="text-xs font-semibold block mb-1.5" style={{color:TEXT,fontFamily:IPS}}>
            <Briefcase size={11} style={{display:"inline",marginRight:4,verticalAlign:"middle"}}/>
            Jabatan / Peran <span style={{color:"#B91C1C"}}>*</span>
          </label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {JABATAN_OPTIONS.map(j=>(
              <button key={j} onClick={()=>setJabatan(j)}
                style={{
                  padding:"6px 12px",borderRadius:14,fontSize:12,fontWeight:600,fontFamily:IPS,
                  background:jabatan===j?SEC:CARD,
                  border:`1.5px solid ${jabatan===j?T:BDR}`,
                  color:jabatan===j?DEEP:MUTED,cursor:"pointer",transition:"all 0.15s"
                }}>
                {j}
              </button>
            ))}
          </div>
        </div>

        {/* No HP — opsional (SRS-F-002) */}
        <div>
          <label className="text-xs font-semibold block mb-1" style={{color:TEXT,fontFamily:IPS}}>
            <Phone size={11} style={{display:"inline",marginRight:4,verticalAlign:"middle"}}/>
            Nomor HP <span style={{color:MUTED,fontWeight:400}}>(opsional)</span>
          </label>
          <input
            type="tel" value={noHp} onChange={e=>setNoHp(e.target.value)}
            placeholder="08xxxxxxxxxx"
            style={{width:"100%",border:`1.5px solid ${BDR}`,borderRadius:12,padding:"10px 12px",fontSize:14,color:TEXT,fontFamily:IPS,background:BG,outline:"none",minHeight:44}}
          />
        </div>
      </div>

      <button onClick={()=>valid && onNext({nama:nama.trim(),email:email.trim(),jabatan:jabatan.trim(),noHp:noHp.trim()})} disabled={!valid}
        style={{width:"100%",background:valid?A:"#D1D5DB",color:"#fff",fontFamily:IPS,minHeight:50,marginTop:16}}
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

// ─── GURU: POP-UP 3 — Tambah Siswa (3 jalur: DB, Upload, Manual) — SRS-F-003 ──
export function TambahSiswaPromptModal({
  sekolah, jumlahKelas, onOpenForm, onSkip, onImportSiswa,
}:{
  sekolah:string; jumlahKelas:number;
  onOpenForm:()=>void;
  onSkip:()=>void;
  onImportSiswa:(siswa:{nama:string;abk:string;ttl:string}[])=>void;
}) {
  const [mode,setMode] = useState<"pilih"|"upload"|"db-sekolah"|null>(null);

  if (mode==="upload")
    return <UploadSiswaModal onBack={()=>setMode(null)} onImport={onImportSiswa}/>;
  if (mode==="db-sekolah")
    return <PilihKelasDBModal sekolah={sekolah} onBack={()=>setMode(null)} onImport={onImportSiswa}/>;

  return (
    <ModalShell step={3} total={3} title="Tambahkan Siswa Anda" desc={`${sekolah} · ${jumlahKelas} kelas terdaftar`}>
      <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={15} style={{color:T}}/>
          <p className="text-sm font-bold" style={{color:DEEP,fontFamily:PJS}}>Pilih cara menambahkan siswa</p>
        </div>
        <p className="text-xs leading-relaxed" style={{color:DEEP,fontFamily:IPS}}>
          Cukup nama, jenis hambatan, dan TTL. Sisanya bisa dilengkapi kapan saja.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {/* Opsi 1: Pilih dari Database Sekolah (SRS-F-003 jalur 1) */}
        <button onClick={()=>setMode("db-sekolah")}
          style={{width:"100%",background:CARD,border:`2px solid ${T}`,borderRadius:18,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}
          className="active:scale-[0.98] transition-transform">
          <div style={{width:44,height:44,borderRadius:14,background:SEC,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Database size={20} style={{color:DEEP}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontFamily:PJS,fontWeight:700,fontSize:14,color:TEXT,marginBottom:2}}>Pilih dari Database Sekolah</p>
            <p style={{fontSize:12,color:MUTED,lineHeight:1.4}}>Import kelas & siswa yang sudah ada di sistem</p>
          </div>
          <ChevronRight size={16} style={{color:MUTED,flexShrink:0}}/>
        </button>

        {/* Opsi 2: Upload CSV/Excel (SRS-F-003 jalur 2) */}
        <button onClick={()=>setMode("upload")}
          style={{width:"100%",background:CARD,border:`1.5px solid ${BDR}`,borderRadius:18,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}
          className="active:scale-[0.98] transition-transform">
          <div style={{width:44,height:44,borderRadius:14,background:"#EDE6F5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Upload size={20} style={{color:"#7C3AED"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontFamily:PJS,fontWeight:700,fontSize:14,color:TEXT,marginBottom:2}}>Upload Daftar Siswa</p>
            <p style={{fontSize:12,color:MUTED,lineHeight:1.4}}>CSV atau Excel · kolom: Nama, Jenis Hambatan, TTL</p>
          </div>
          <ChevronRight size={16} style={{color:MUTED,flexShrink:0}}/>
        </button>

        {/* Opsi 3: Manual */}
        <button onClick={onOpenForm}
          style={{width:"100%",background:A,borderRadius:18,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12,border:"none"}}
          className="active:scale-[0.98] transition-transform">
          <div style={{width:44,height:44,borderRadius:14,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <UserPlus size={20} style={{color:"#fff"}}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontFamily:PJS,fontWeight:700,fontSize:14,color:"#fff",marginBottom:2}}>Tambah Siswa (Manual)</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.8)",lineHeight:1.4}}>Isi form satu per satu</p>
          </div>
          <ChevronRight size={16} style={{color:"rgba(255,255,255,0.7)",flexShrink:0}}/>
        </button>
      </div>

      <button onClick={onSkip} style={{width:"100%",color:MUTED,fontFamily:IPS,minHeight:44,background:"transparent",border:"none"}}
        className="text-xs font-semibold">
        Nanti saja, masuk ke aplikasi dulu
      </button>
    </ModalShell>
  );
}

// ─── UPLOAD SISWA MODAL — CSV parser functional (SRS-F-003) ──────────
type SiswaCSV = {nama:string; abk:string; ttl:string; valid:boolean};

function UploadSiswaModal({onBack,onImport}:{onBack:()=>void;onImport:(s:{nama:string;abk:string;ttl:string}[])=>void}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows]   = useState<SiswaCSV[]>([]);
  const [err,  setErr]    = useState("");
  const [fileName, setFileName] = useState("");
  const [step, setStep]   = useState<"upload"|"preview">("upload");

  const parseCSV = (text:string): SiswaCSV[] => {
    const lines = text.trim().split(/\r?\n/);
    // Detect & skip header row
    const start = /nama|name|siswa/i.test(lines[0]) ? 1 : 0;
    return lines.slice(start).filter(l=>l.trim()).map(line=>{
      // Support comma & semicolon as delimiter
      const cols = line.split(/[,;\t]/).map(c=>c.trim().replace(/^"|"$/g,""));
      const nama = cols[0]||""; const abk = cols[1]||""; const ttl = cols[2]||"";
      return {nama, abk, ttl, valid: nama.trim()!==""};
    });
  };

  const handleFile = (file:File) => {
    if (!file) return;
    setFileName(file.name);
    setErr("");
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv","txt"].includes(ext||"csv")) {
      // For Excel/other: show friendly note (full parse needs xlsx lib)
      setErr("File Excel (.xlsx) belum didukung langsung. Ekspor ke CSV dulu dari Excel (File → Save As → CSV).");
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length === 0) { setErr("File kosong atau formatnya tidak sesuai."); return; }
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file, "UTF-8");
  };

  const validRows = rows.filter(r=>r.valid);

  return (
    <ModalShell step={3} total={3} title="Upload Daftar Siswa" desc="Format: CSV dengan kolom Nama, Jenis Hambatan, TTL">
      {step==="upload" ? (
        <>
          {/* Drop zone */}
          <div
            onClick={()=>fileRef.current?.click()}
            onDragOver={e=>{e.preventDefault();}}
            onDrop={e=>{e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) handleFile(f);}}
            style={{
              border:`2px dashed ${err?"#B91C1C":T}`, borderRadius:18, padding:"28px 20px",
              textAlign:"center", cursor:"pointer", background:err?"#FEF2F2":SEC,
              marginBottom:16
            }}>
            <div style={{width:52,height:52,borderRadius:16,background:CARD,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Upload size={24} style={{color:err?"#B91C1C":T}}/>
            </div>
            <p style={{fontFamily:PJS,fontWeight:700,fontSize:14,color:err?"#B91C1C":TEXT,marginBottom:4}}>
              {fileName ? fileName : "Ketuk untuk pilih file"}
            </p>
            <p style={{fontSize:11,color:MUTED}}>atau seret & lepas di sini</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv,.txt" style={{display:"none"}}
            onChange={e=>{ const f=e.target.files?.[0]; if(f) handleFile(f); }}/>

          {err && (
            <div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:12,padding:"10px 12px",display:"flex",gap:8,marginBottom:12}}>
              <AlertCircle size={14} style={{color:"#B91C1C",flexShrink:0,marginTop:1}}/>
              <p style={{fontSize:12,color:"#B91C1C",lineHeight:1.5,fontFamily:IPS}}>{err}</p>
            </div>
          )}

          {/* Format guide */}
          <div style={{background:BG,border:`1px solid ${BDR}`,borderRadius:14,padding:"12px 14px"}}>
            <p style={{fontSize:12,fontWeight:700,color:TEXT,fontFamily:PJS,marginBottom:8}}>📋 Format CSV yang benar</p>
            <div style={{background:CARD,borderRadius:10,padding:"8px 12px",fontFamily:"monospace",fontSize:11,color:DEEP,lineHeight:1.8,overflowX:"auto"}}>
              <div style={{color:MUTED,fontWeight:600}}>Nama Lengkap,Jenis Hambatan,TTL</div>
              <div>Rafi Pratama,Autisme,Bandung 12 Maret 2014</div>
              <div>Nisa Aulia,Tunarungu,Jakarta 05 Juli 2013</div>
              <div>Arga Saputra,Tunadaksa,Depok 20 Nov 2015</div>
            </div>
            <p style={{fontSize:11,color:MUTED,marginTop:8,fontFamily:IPS}}>💡 Buka Excel → File → Save As → CSV (Comma delimited)</p>
          </div>

          <button onClick={onBack}
            style={{width:"100%",background:"transparent",border:`1px solid ${BDR}`,color:MUTED,fontFamily:IPS,minHeight:44,marginTop:14,borderRadius:14,fontSize:13,fontWeight:600,cursor:"pointer"}}>
            ← Kembali
          </button>
        </>
      ) : (
        <>
          {/* Preview tabel */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <p style={{fontFamily:PJS,fontWeight:700,fontSize:14,color:TEXT}}>{fileName}</p>
              <p style={{fontSize:11,color:MUTED,marginTop:1}}>
                {validRows.length} siswa siap diimpor{rows.length!==validRows.length?` · ${rows.length-validRows.length} baris tidak valid`:""}
              </p>
            </div>
            <button onClick={()=>{setStep("upload");setRows([]);setFileName("");setErr("");}}
              style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:MUTED,background:"transparent",border:"none",cursor:"pointer"}}>
              <Trash2 size={12}/> Ganti file
            </button>
          </div>

          <div style={{border:`1px solid ${BDR}`,borderRadius:14,overflow:"hidden",marginBottom:14}}>
            {/* Header */}
            <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 2fr",background:SEC,padding:"8px 12px",gap:8}}>
              {["Nama Lengkap","Jenis Hambatan","TTL"].map(h=>(
                <p key={h} style={{fontSize:10,fontWeight:700,color:DEEP,fontFamily:IPS,textTransform:"uppercase",letterSpacing:"0.05em"}}>{h}</p>
              ))}
            </div>
            {/* Rows */}
            <div style={{maxHeight:220,overflowY:"auto"}}>
              {rows.map((r,i)=>(
                <div key={i} style={{
                  display:"grid",gridTemplateColumns:"2fr 2fr 2fr",
                  padding:"9px 12px",gap:8,
                  borderTop:`1px solid ${BDR}`,
                  background:r.valid?"transparent":"#FEF2F2"
                }}>
                  <p style={{fontSize:12,color:r.valid?TEXT:"#B91C1C",fontWeight:r.valid?600:400,fontFamily:IPS,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {r.nama||"(kosong)"}
                  </p>
                  <p style={{fontSize:12,color:MUTED,fontFamily:IPS,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.abk||"—"}</p>
                  <p style={{fontSize:11,color:MUTED,fontFamily:IPS,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.ttl||"—"}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setStep("upload");setRows([]);setFileName("");}}
              style={{flex:1,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:48,borderRadius:14,fontSize:13,fontWeight:700,background:CARD,cursor:"pointer"}}>
              Kembali
            </button>
            <button onClick={()=>onImport(validRows)}
              disabled={validRows.length===0}
              style={{flex:2,background:validRows.length?A:"#D1D5DB",color:"#fff",fontFamily:IPS,minHeight:48,borderRadius:14,fontSize:13,fontWeight:700,border:"none",cursor:validRows.length?"pointer":"default"}}>
              Import {validRows.length} Siswa →
            </button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

// ─── PILIH KELAS DB SEKOLAH — SRS-F-003 jalur 1 ──────────────────────
const MOCK_DB_SEKOLAH: Record<string,{nama:string;abk:string;ttl:string}[]> = {
  "VII A – Autisme": [
    {nama:"Rafi Pratama",    abk:"Autisme",             ttl:"Bandung, 12 Mar 2014"},
    {nama:"Dinda Sari",      abk:"Autisme",             ttl:"Depok, 07 Jun 2014"},
    {nama:"Farhan Maulana",  abk:"Autisme",             ttl:"Bogor, 21 Sep 2013"},
  ],
  "VII B – Tunarungu": [
    {nama:"Nisa Aulia",      abk:"Tunarungu",           ttl:"Jakarta, 05 Jul 2013"},
    {nama:"Ilham Nugraha",   abk:"Tunarungu",           ttl:"Bekasi, 14 Apr 2014"},
  ],
  "VIII A – Tunadaksa": [
    {nama:"Arga Saputra",    abk:"Tunadaksa",           ttl:"Depok, 20 Nov 2013"},
    {nama:"Putri Rahayu",    abk:"Tunadaksa",           ttl:"Jakarta, 03 Feb 2014"},
    {nama:"Toni Hermawan",   abk:"Tunadaksa",           ttl:"Tangerang, 17 Aug 2013"},
  ],
  "VIII B – Tunagrahita": [
    {nama:"Budi Santoso",    abk:"Tunagrahita Ringan",  ttl:"Bandung, 29 Jan 2014"},
    {nama:"Siti Nurhaliza",  abk:"Tunagrahita Sedang",  ttl:"Jakarta, 11 Okt 2013"},
  ],
  "IX A – Kesulitan Belajar": [
    {nama:"Kevin Alvaro",    abk:"Disleksia",            ttl:"Depok, 08 Des 2012"},
    {nama:"Maya Puspita",    abk:"ADHD",                 ttl:"Jakarta, 22 Mar 2012"},
  ],
};

function PilihKelasDBModal({sekolah,onBack,onImport}:{sekolah:string;onBack:()=>void;onImport:(s:{nama:string;abk:string;ttl:string}[])=>void}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string|null>(null);

  const toggleKelas = (k:string) => setSelected(s=>{
    const n = new Set(s);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  });

  const siswaSelected = [...selected].flatMap(k=>MOCK_DB_SEKOLAH[k]||[]);

  return (
    <ModalShell step={3} total={3} title="Database Sekolah" desc={`${sekolah} · Pilih kelas yang ingin diimpor`}>
      {/* Info banner */}
      <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`,borderRadius:14,padding:"10px 12px",display:"flex",gap:8,marginBottom:12}}>
        <Database size={13} style={{color:T,flexShrink:0,marginTop:1}}/>
        <p style={{fontSize:12,color:DEEP,fontFamily:IPS,lineHeight:1.5}}>
          Data kelas di bawah tersedia dari sistem dapodik / basis data sekolah. Centang kelas yang ingin Anda ajar.
        </p>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {Object.entries(MOCK_DB_SEKOLAH).map(([kelas,siswas])=>{
          const isSelected = selected.has(kelas);
          const isExpanded = expanded===kelas;
          return (
            <div key={kelas} style={{border:`1.5px solid ${isSelected?T:BDR}`,borderRadius:16,overflow:"hidden",background:isSelected?SEC:CARD,transition:"all 0.15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",cursor:"pointer"}}
                onClick={()=>toggleKelas(kelas)}>
                {/* Checkbox */}
                <div style={{
                  width:20,height:20,borderRadius:6,border:`2px solid ${isSelected?T:BDR}`,
                  background:isSelected?T:"transparent",flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center"
                }}>
                  {isSelected && <CheckCircle size={12} style={{color:"#fff"}}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:700,color:isSelected?DEEP:TEXT,fontFamily:IPS}}>{kelas}</p>
                  <p style={{fontSize:11,color:MUTED,marginTop:1}}>{siswas.length} siswa</p>
                </div>
                {/* Expand toggle */}
                <button onClick={e=>{e.stopPropagation();setExpanded(p=>p===kelas?null:kelas);}}
                  style={{background:"transparent",border:"none",cursor:"pointer",padding:"4px",color:MUTED}}>
                  <ChevronRight size={14} style={{transform:isExpanded?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
                </button>
              </div>
              {/* Expanded: preview siswa */}
              {isExpanded && (
                <div style={{borderTop:`1px solid ${BDR}`,padding:"8px 14px 10px"}}>
                  {siswas.map(s=>(
                    <div key={s.nama} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${BDR}`}}>
                      <p style={{fontSize:12,fontWeight:600,color:TEXT,fontFamily:IPS}}>{s.nama}</p>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:11,color:T,fontWeight:600}}>{s.abk}</p>
                        <p style={{fontSize:10,color:MUTED}}>{s.ttl}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selected.size>0 && (
        <div style={{background:SEC,borderRadius:12,padding:"8px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <Users size={13} style={{color:T}}/>
          <p style={{fontSize:12,color:DEEP,fontFamily:IPS,fontWeight:600}}>
            {selected.size} kelas · {siswaSelected.length} siswa akan diimpor
          </p>
        </div>
      )}

      <div style={{display:"flex",gap:8}}>
        <button onClick={onBack}
          style={{flex:1,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:48,borderRadius:14,fontSize:13,fontWeight:700,background:CARD,cursor:"pointer"}}>
          Kembali
        </button>
        <button onClick={()=>onImport(siswaSelected)}
          disabled={selected.size===0}
          style={{flex:2,background:selected.size?A:"#D1D5DB",color:"#fff",fontFamily:IPS,minHeight:48,borderRadius:14,fontSize:13,fontWeight:700,border:"none",cursor:selected.size?"pointer":"default"}}>
          Import {siswaSelected.length > 0 ? `${siswaSelected.length} Siswa` : "Siswa"} →
        </button>
      </div>
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
