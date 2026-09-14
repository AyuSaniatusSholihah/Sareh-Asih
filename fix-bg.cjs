const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

code = code.replace(
  `import heroImage from "@/imports/image-14.png";`,
  `import heroImage from "@/imports/image-15.png";`
);

code = code.replace(
  `    <div className="flex-1 flex flex-col overflow-y-auto" style={{fontFamily:IPS, background:BG_LANDING, position:"relative"}}>`,
  `    <div className="flex-1 flex flex-col overflow-y-auto" style={{fontFamily:IPS, background:BG_LANDING, position:"relative"}}>
      <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0}}>
        <ImageWithFallback src={heroImage} alt="Background" className="w-full h-full object-cover" />
        <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(245,241,235,0.4) 0%, rgba(245,241,235,0.8) 50%, rgba(245,241,235,1) 100%)"}} />
      </div>
      <div style={{position:"relative", zIndex: 1, display:"flex", flexDirection:"column", flex: 1}}>`
);

// Remove the inline illustration since it's now the background
code = code.replace(
  `        {/* illustration */}
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{margin:"14px 0 6px", width:"100%", display:"flex", justifyContent:"center"}}>
          <ImageWithFallback src={heroImage} alt="Teacher and child illustration" className="w-full h-auto object-contain" style={{maxHeight: 280, mixBlendMode: "multiply", filter: "contrast(1.05)"}}/>
        </motion.div>`,
  `        {/* illustration (moved to background) */}`
);

// Close the inner relative div just before the CTA section (or at the very end of the main return content)
code = code.replace(
  `      {/* CTA */}
      <div style={{padding:"0 20px 24px", flexShrink:0}}>`,
  `      </div>
      {/* CTA */}
      <div style={{padding:"0 20px 24px", flexShrink:0, position:"relative", zIndex: 1}}>`
);

fs.writeFileSync('src/app/components/auth.tsx', code);
