const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

// Replace image import (handles image-15, image-16, etc)
code = code.replace(/import heroImage from "@\/imports\/image-\d+\.png";/, 'import heroImage from "@/imports/image-23.png";');

// Replace LandingScreen
const newLandingScreen = `export function LandingScreen({onNext}:{onNext:()=>void}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{fontFamily:IPS, backgroundColor: "#FAF8F5"}}>
      
      {/* Header */}
      <div className="flex flex-col items-center pt-14 pb-2 relative z-10">
        <h1 style={{fontFamily:PJS, fontSize:38, fontWeight:800, letterSpacing:"-1px", color:"#1F3D28", lineHeight: 1}}>
          sareh <span style={{color:"#72967F"}}>asih</span>
        </h1>
        <p style={{fontSize:13, color:"#5B7A68", marginTop:6, fontFamily:IPS, fontWeight:600}}>
          AI untuk guru SLB dan orang tua
        </p>
      </div>

      {/* Illustration Container */}
      <div className="flex-1 w-full flex items-center justify-center px-2 relative z-10">
        <ImageWithFallback src={heroImage} alt="Sareh Asih Hero" className="w-full h-full object-contain" style={{maxHeight: "400px", mixBlendMode: "multiply"}} />
      </div>

      {/* Bottom Area */}
      <div className="px-6 pb-12 pt-6 flex flex-col items-center text-center relative z-10">
        <p style={{fontSize:24, fontWeight:700, color:"#1A2E20", lineHeight:1.35, fontFamily:PJS, marginBottom: 32}}>
          Temani setiap potensi,<br/>tumbuhkan prestasi. <span style={{color:"#D4A843"}}>♡</span>
        </p>

        <button onClick={onNext}
          style={{width:"100%", background:"#1F3D28", color:"#FFF", fontFamily:PJS, fontWeight:700, fontSize:16, minHeight:58, borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", gap:8, border:"none", cursor:"pointer", boxShadow:"0 10px 25px rgba(31, 61, 40, 0.25)"}}
          className="active:scale-95 transition-transform">
          Mulai Petualangan
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>
      
    </div>
  );
}`;

const regex = /export function LandingScreen.*?^}/ms;
code = code.replace(regex, newLandingScreen);

fs.writeFileSync('src/app/components/auth.tsx', code);
