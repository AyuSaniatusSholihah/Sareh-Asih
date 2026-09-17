const fs = require('fs');
let c = fs.readFileSync('src/app/App.tsx', 'utf-8');
c = c.replace(/&quot;/g, '"');
fs.writeFileSync('src/app/App.tsx', c);
