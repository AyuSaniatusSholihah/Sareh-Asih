const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

code = code.replace(
  `background: "linear-gradient(to bottom, rgba(245,241,235,0.4) 0%, rgba(245,241,235,0.8) 50%, rgba(245,241,235,1) 100%)"`,
  `background: "linear-gradient(to bottom, rgba(245,241,235,0) 0%, rgba(245,241,235,0.2) 30%, rgba(245,241,235,1) 70%)"`
);

fs.writeFileSync('src/app/components/auth.tsx', code);
