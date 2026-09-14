const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

code = code.replace(
  `import heroImage from "@/imports/image-13.png";`,
  `import heroImage from "@/imports/image-14.png";`
);

code = code.replace(
  `<ImageWithFallback src={heroImage} alt="Teacher and child illustration" className="w-full h-auto object-contain" style={{maxHeight: 240}}/>`,
  `<ImageWithFallback src={heroImage} alt="Teacher and child illustration" className="w-full h-auto object-contain" style={{maxHeight: 280, mixBlendMode: "multiply", filter: "contrast(1.05)"}}/>`
);

fs.writeFileSync('src/app/components/auth.tsx', code);
