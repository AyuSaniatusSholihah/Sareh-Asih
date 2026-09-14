const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

code = code.replace(
  `import heroImage from "@/imports/image-16.png";`,
  `import heroImage from "@/imports/image-15.png";`
);

fs.writeFileSync('src/app/components/auth.tsx', code);
