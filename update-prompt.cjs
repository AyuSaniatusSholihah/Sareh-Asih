const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

// Add Upload to lucide-react imports
if (!code.includes('Upload,')) {
    code = code.replace(
        'Hash, ShieldCheck, Users, Sparkles, UserPlus, School, Plus,',
        'Hash, ShieldCheck, Users, Sparkles, UserPlus, School, Plus, Upload,'
    );
}

// Find TambahSiswaPromptModal and replace the buttons
const oldButtons = `<button onClick={onOpenForm} style={{width:"100%",background:A,color:"#fff",fontFamily:IPS,minHeight:50}}
        className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
        <UserPlus size={16}/>Tambah Siswa Sekarang
      </button>
      <button onClick={onSkip} style={{width:"100%",color:MUTED,fontFamily:IPS,minHeight:44,marginTop:4,background:"transparent"}}
        className="text-xs font-semibold">
        Nanti saja, masuk ke aplikasi dulu
      </button>`;

const newButtons = `<div className="flex flex-col gap-2.5">
        <button style={{width:"100%",background:CARD,border:\`1.5px solid \${T}\`,color:T,fontFamily:IPS,minHeight:50}}
          className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
          <Upload size={16}/>Upload Daftar Siswa
        </button>
        <p className="text-center" style={{fontSize:10, color:MUTED, marginTop:-6, marginBottom:2}}>Format: CSV, Excel, JPG, PNG</p>
        
        <button onClick={onOpenForm} style={{width:"100%",background:A,color:"#fff",fontFamily:IPS,minHeight:50}}
          className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
          <UserPlus size={16}/>Tambah Siswa (Manual)
        </button>
      </div>
      <button onClick={onSkip} style={{width:"100%",color:MUTED,fontFamily:IPS,minHeight:44,marginTop:6,background:"transparent"}}
        className="text-xs font-semibold">
        Nanti saja, masuk ke aplikasi dulu
      </button>`;

code = code.replace(oldButtons, newButtons);

fs.writeFileSync('src/app/components/auth.tsx', code);
