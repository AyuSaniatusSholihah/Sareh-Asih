const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const reportRegex = /function ReportScreen\(.*?\}\s*\n\s*\}\s*\n/s;

// We need a precise regex match. Let's do it with replace first
const fullReportSection = content.match(/function ReportScreen\(\{namaSekolah,laporan,onKirim\}:\{(.*?)\}\s*\n/s);

// We will construct the new ReportScreen and replace the old one.
const newReportScreen = `function ReportScreen({namaSekolah,laporan,onKirim}:{
  namaSekolah:string; laporan:LaporanKirim[]; onKirim:(studentId:number,isi:string)=>void;
}) {
  const students = useStudents();
  const [targetId,setTargetId] = useState<number>(students[0]?.id ?? 0);
  const target = students.find(s=>s.id===targetId) ?? students[0];

  if (!target) {
    return (
      <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
        <div style={{background:CARD}} className="px-4 pt-2 pb-3">
          <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Laporan Orang Tua</p>
        </div>
        <div className="px-4 pt-6">
          <div style={{background:CARD,border:\`1.5px dashed \${BDR}\`}} className="rounded-2xl px-4 py-8 text-center">
            <p className="text-sm" style={{color:MUTED}}>Tambahkan siswa terlebih dahulu untuk melihat laporan.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <div style={{background:CARD}} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Laporan Orang Tua</p>
        <p className="text-xs" style={{color:MUTED}}>Pilih siswa untuk melihat data siswa</p>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Pilih siswa */}
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{color:TEXT}}>Siswa</p>
          <select value={targetId} onChange={e=>setTargetId(Number(e.target.value))}
            style={{width:"100%",border:\`1.5px solid \${BDR}\`,borderRadius:12,padding:"11px 12px",fontSize:14,color:TEXT,fontFamily:IPS,background:CARD,outline:"none",minHeight:46}}>
            {students.map(s=><option key={s.id} value={s.id}>{s.name} — Kelas {s.kelas}</option>)}
          </select>
        </div>

        {/* Info siswa saja */}
        <div style={{background:CARD,border:\`1px solid \${BDR}\`}} className="rounded-2xl p-4 text-center">
            <p className="text-sm font-semibold mb-2" style={{color:TEXT}}>Data terhubung ke: {target.name}</p>
            <p className="text-xs mb-3" style={{color:MUTED}}>Kode Orang Tua: <span style={{fontFamily:DMM}} className="font-bold">{target.kodeOrtu}</span></p>
            <p className="text-xs leading-relaxed text-left" style={{color:MUTED}}>
               Gunakan tab "Jurnal & Catatan" di profil siswa untuk menambahkan riwayat dan observasi terbaru.
            </p>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(/function ReportScreen\(\{.*?\}\)\s*\{[\s\S]*?(?=\/\/ ─── MAIN APP)/, newReportScreen + "\n// ─── MAIN APP");
fs.writeFileSync('src/app/App.tsx', content);
