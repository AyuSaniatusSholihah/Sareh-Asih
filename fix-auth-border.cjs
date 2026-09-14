const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

code = code.replace(
  'border: \\`1.5px solid \\${abkInput===o ? T : BDR}\\`,',
  'border: `1.5px solid ${abkInput===o ? T : BDR}`,'
);

code = code.replace(
  'border:\\`1.5px solid \\${BDR}\\`,',
  'border:`1.5px solid ${BDR}`,'
);

code = code.replace(
  /border:\\\`1\.5px solid \\\$\\{BDR\\}\\\`/g,
  'border:`1.5px solid ${BDR}`'
);

// One more check in case it's formatted differently
code = code.replace(
  'border: \\`1.5px solid \\${BDR}\\`',
  'border: `1.5px solid ${BDR}`'
);

fs.writeFileSync('src/app/components/auth.tsx', code);
