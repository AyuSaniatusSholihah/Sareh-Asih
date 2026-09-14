const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

// Ensure imports
if (!code.includes('useEffect')) {
    code = code.replace('import { useState', 'import { useState, useEffect');
}
if (!code.includes('AnimatePresence')) {
    code = code.replace('import { motion }', 'import { motion, AnimatePresence }');
}

// Ensure heroImage points to a single illustration, not the collage
code = code.replace(/import heroImage from "@\/imports\/image-\d+\.png";/, 'import heroImage from "@/imports/image-23.png";');

const regex = /export function LandingScreen.*?^}/ms;

const newLandingScreen = `const SplashLogo = () => (
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
            key={\`step-\${step}\`}
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
}`;

code = code.replace(regex, newLandingScreen);
fs.writeFileSync('src/app/components/auth.tsx', code);
