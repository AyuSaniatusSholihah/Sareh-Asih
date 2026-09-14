const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

const regex = /export function LandingScreen.*?^}/ms;

const newLandingScreen = `export function LandingScreen({onNext}:{onNext:()=>void}) {
  const BG_COLOR = "#FAF8F5";
  const PRIMARY = "#8BB098"; // Sage Green
  const PRIMARY_DARK = "#5B7A68";
  const ACCENT = "#D27D6B"; // Soft Terracotta
  const TEXT_DARK = "#2E3E35";
  const TEXT_MUTED = "#5B7A68";

  return (
    <div className="w-full min-h-screen overflow-y-auto" style={{fontFamily:IPS, backgroundColor: BG_COLOR, color: TEXT_DARK}}>
      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4" style={{backgroundColor: "rgba(250, 248, 245, 0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(139, 176, 152, 0.2)"}}>
        <div className="flex items-center gap-2">
          <h1 style={{fontFamily:PJS, fontSize:22, fontWeight:800, letterSpacing:"-0.5px", color:PRIMARY_DARK}}>
            Sareh<span style={{color:PRIMARY}}>Asih</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {["Beranda", "Fitur", "Manfaat", "Kontak"].map(item => (
            <a key={item} href="#" className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{color: TEXT_DARK}}>{item}</a>
          ))}
        </nav>
        <button onClick={onNext} className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-transform hover:scale-105" style={{backgroundColor: ACCENT, boxShadow: "0 4px 14px rgba(210, 125, 107, 0.3)"}}>
          Mulai SarehAsih
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-8 pt-16 pb-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10">
          <h2 style={{fontFamily:PJS, fontSize:48, fontWeight:800, lineHeight: 1.15, color: TEXT_DARK}}>
            Temani setiap potensi, <br/>
            <span style={{color: PRIMARY_DARK}}>tumbuhkan prestasi. <span style={{color:"#D4A843"}}>♡</span></span>
          </h2>
          <p className="text-lg leading-relaxed max-w-lg" style={{color: TEXT_MUTED}}>
            Platform berbasis AI yang membantu guru dan orang tua mengenali, mendampingi, dan mengembangkan bakat serta potensi anak secara personal.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button onClick={onNext} className="px-6 py-3.5 rounded-full text-base font-bold text-white transition-transform hover:scale-105" style={{backgroundColor: ACCENT, boxShadow: "0 8px 20px rgba(210, 125, 107, 0.35)"}}>
              Coba Sekarang
            </button>
            <button className="px-6 py-3.5 rounded-full text-base font-bold transition-colors hover:bg-gray-100" style={{color: PRIMARY_DARK, border: \`2px solid \${PRIMARY}\`}}>
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4E8DA] to-transparent rounded-full blur-3xl opacity-50"></div>
          <ImageWithFallback src={heroImage} alt="Guru mendampingi anak belajar" className="relative z-10 w-full h-auto object-cover rounded-[3rem]" style={{boxShadow: "0 24px 50px rgba(91, 122, 104, 0.15)"}} />
          {/* Leaf decorative element */}
          <svg className="absolute -bottom-6 -left-6 z-20 w-24 h-24 text-primary" viewBox="0 0 100 100" fill="none">
            <path d="M50 10 Q80 20 70 50 Q60 80 30 70 Q10 60 20 30 Q30 10 50 10Z" fill="#8BB098" opacity="0.4"/>
            <path d="M55 20 Q80 30 70 55 Q60 80 40 70 Q20 60 30 40 Q40 20 55 20Z" fill="#5B7A68" opacity="0.6"/>
          </svg>
        </div>
      </section>

      {/* MANFAAT SECTION */}
      <section className="px-8 py-20" style={{backgroundColor: "#F0EBE1"}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 style={{fontFamily:PJS, fontSize:36, fontWeight:800, color: TEXT_DARK}}>Mengapa Memilih SarehAsih?</h3>
            <p className="text-base mt-3 max-w-2xl mx-auto" style={{color: TEXT_MUTED}}>Didesain khusus untuk memudahkan peran guru dan orang tua dalam mendukung perkembangan anak.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Kenali Setiap Anak dengan Lebih Mendalam",
                desc: "SarehAsih membantu guru mengenali karakter, kekuatan, minat, serta kebutuhan belajar setiap anak melalui pengamatan yang didukung AI.",
                icon: <Users size={28} style={{color: ACCENT}}/>,
              },
              {
                title: "Potensi Anak Menjadi Lebih Terarah",
                desc: "Hasil pengamatan diolah menjadi peta potensi yang memudahkan guru menentukan strategi pembelajaran yang sesuai.",
                icon: <Sparkles size={28} style={{color: ACCENT}}/>,
              },
              {
                title: "Dampingi Perkembangan Setiap Hari",
                desc: "Catat perkembangan belajar, perilaku, komunikasi, dan capaian anak secara berkelanjutan dalam satu tempat.",
                icon: <CheckCircle size={28} style={{color: ACCENT}}/>,
              },
              {
                title: "Guru dan Orang Tua Terhubung Lebih Dekat",
                desc: "Bagikan laporan perkembangan dan rekomendasi pembelajaran agar guru dan orang tua dapat mendampingi anak bersama.",
                icon: <UserPlus size={28} style={{color: ACCENT}}/>,
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl transition-transform hover:-translate-y-1" style={{boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid rgba(139, 176, 152, 0.15)"}}>
                <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center" style={{backgroundColor: "rgba(210, 125, 107, 0.15)"}}>
                  {item.icon}
                </div>
                <h4 style={{fontFamily:PJS, fontSize:20, fontWeight:700, marginBottom:12, color: TEXT_DARK}}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{color: TEXT_MUTED}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR UNGGULAN SECTION */}
      <section className="px-8 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 style={{fontFamily:PJS, fontSize:36, fontWeight:800, color: TEXT_DARK}}>Fitur Unggulan Kami</h3>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              emoji: "🌱",
              title: "SarehKenali",
              sub: "(Kenali Potensi)",
              desc: "Guru melakukan asesmen adaptif, kemudian AI mengenali karakteristik dan memetakan bakat serta potensi anak."
            },
            {
              emoji: "🪴",
              title: "SarehKembangkan",
              sub: "(Tumbuhkan Potensi)",
              desc: "AI memberikan strategi pembelajaran, target perkembangan (IDP), dan memantau progres anak bersama guru serta orang tua."
            },
            {
              emoji: "🏆",
              title: "SarehPrestasi",
              sub: "(Raih Prestasi)",
              desc: "AI merekomendasikan lomba, pelatihan, atau kegiatan yang sesuai dengan potensi anak."
            },
            {
              emoji: "📄",
              title: "SarehLaporan",
              sub: "(Bagikan Perkembangan)",
              desc: "AI menyusun laporan perkembangan secara otomatis untuk guru dan orang tua."
            }
          ].map((f, i) => (
            <div key={i} className="flex flex-col h-full bg-white p-6 rounded-3xl" style={{border: \`2px solid \${PRIMARY}40\`}}>
              <span className="text-4xl mb-4">{f.emoji}</span>
              <h4 style={{fontFamily:PJS, fontSize:18, fontWeight:700, color: PRIMARY_DARK}}>{f.title}</h4>
              <p className="text-xs font-bold mb-3" style={{color: ACCENT}}>{f.sub}</p>
              <p className="text-sm leading-relaxed" style={{color: TEXT_MUTED}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="px-8 py-24 mb-12 max-w-5xl mx-auto text-center rounded-[3rem] relative overflow-hidden" style={{backgroundColor: PRIMARY_DARK}}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
        <div className="relative z-10 px-4">
          <h2 style={{fontFamily:PJS, fontSize:36, fontWeight:800, color: "#fff", marginBottom: 16}}>
            Siap menumbuhkan prestasi anak bersama SarehAsih?
          </h2>
          <p className="text-base mb-10 max-w-2xl mx-auto" style={{color: "rgba(255,255,255,0.85)"}}>
            Bergabunglah dengan guru dan orang tua lainnya untuk memberikan pendampingan terbaik bagi setiap potensi anak.
          </p>
          <button onClick={onNext} className="px-10 py-4 rounded-full text-lg font-bold text-white transition-transform hover:scale-105" style={{backgroundColor: ACCENT, boxShadow: "0 10px 25px rgba(210, 125, 107, 0.4)"}}>
            Mulai
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center" style={{borderTop: "1px solid rgba(139, 176, 152, 0.2)"}}>
        <p className="text-sm" style={{color: TEXT_MUTED}}>© 2026 SarehAsih. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}`;

code = code.replace(regex, newLandingScreen);

// Make sure the image imports points to image-25.png
code = code.replace(/import heroImage from "@\/imports\/image-\d+\.png";/, 'import heroImage from "@/imports/image-25.png";');

fs.writeFileSync('src/app/components/auth.tsx', code);
