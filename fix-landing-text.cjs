const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

code = code.replace(
  `      {/* Content Container */}
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
        <div className="flex flex-col items-center text-center w-full">`,
  `      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full justify-end px-6 pt-12 pb-8">
        
        {/* Bottom / Tagline & CTA */}
        <div className="flex flex-col items-center text-center w-full">`
);

fs.writeFileSync('src/app/components/auth.tsx', code);
