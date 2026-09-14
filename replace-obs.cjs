const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/app/App.tsx',
  'src/app/components/export.tsx',
  'src/app/components/data.tsx',
  'src/app/components/observation.tsx',
  'src/app/components/auth.tsx',
  'src/app/components/parent.tsx',
  'src/app/components/kode-manager.tsx'
];

for (const file of filesToProcess) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/\bObservasi\b/g, 'Pengamatan');
    content = content.replace(/\bobservasi\b/g, 'pengamatan');
    content = content.replace(/\bOBSERVASI\b/g, 'PENGAMATAN');
    content = content.replace(/\bObs\./g, 'Pengamatan');
    content = content.replace(/\bobs\./g, 'pengamatan');
    
    fs.writeFileSync(filePath, content);
    console.log(`Processed ${file}`);
  }
}
