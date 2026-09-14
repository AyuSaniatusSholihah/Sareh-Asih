const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

const newLandingScreen = `export function LandingScreen({onNext}:{onNext:()=>void}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{fontFamily:IPS, backgroundColor: "#2E5537"}}>
      {/* Background Image Edge-to-Edge */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback src={heroImage} alt="Sareh Asih Background" className="w-full h-full object-cover" />
        {/* Gradient Overlay agar teks terbaca jelas */}
        <div className="absolute inset-0" style={{background: "linear-gradient(to top, rgba(46, 85, 55, 0.95) 0%, rgba(46, 85, 55, 0.3) 50%, rgba(0,0,0,0.1) 100%)"}} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full justify-between px-6 pt-12 pb-8">
        
        {/* Header / Logo Area */}
        <div className="flex flex-col items-center mt-4">
          <h1 style={{fontFamily:PJS, fontSize:40, fontWeight:800, letterSpacing:"-1px", color:"#FFF", lineHeight: 1}}>
            sareh <span style={{color:"#D4E8DA"}}>asih</span>
          </h1>
          <p style={{fontSize:14, color:"rgba(255,255,255,0.85)", marginTop:6, fontFamily:IPS}}>
            AI untuk guru SLB dan orang tua
          </p>
        </div>

        {/* Bottom / Tagline & CTA */}
        <div className="flex flex-col items-center text-center w-full">
          <p style={{fontSize:24, fontWeight:700, color:"#FFF", lineHeight:1.4, fontFamily:PJS, marginBottom: 36}}>
            Temani setiap potensi,<br/>tumbuhkan prestasi. <span style={{color:"#D4A843"}}>♡</span>
          </p>

          <button onClick={onNext}
            style={{width:"100%", background:"#FFF", color:"#2E5537", fontFamily:PJS, fontWeight:800, fontSize:16, minHeight:56, borderRadius:28, display:"flex", alignItems:"center", justifyContent:"center", gap:8, border:"none", cursor:"pointer", boxShadow:"0 10px 25px rgba(0,0,0,0.2)"}}
            className="active:scale-95 transition-transform">
            Mulai Petualangan
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
        
      </div>
    </div>
  );
}`;

// Use regex to replace the entire LandingScreen function
const regex = /export function LandingScreen.*?^}/ms;
code = code.replace(regex, newLandingScreen);

fs.writeFileSync('src/app/components/auth.tsx', code);
