const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/app/App.tsx',
  'src/app/components/export.tsx',
  'src/app/components/add-student.tsx'
];

for (const file of filesToProcess) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/\bdiobservasi\b/g, 'didampingi');
    content = content.replace(/\bDiobservasi\b/g, 'Didampingi');
    
    fs.writeFileSync(filePath, content);
    console.log(`Processed ${file}`);
  }
}
