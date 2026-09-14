const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const startIndex = content.indexOf('function ReportScreen');
const endIndex = content.indexOf('// ─── MAIN APP');

if (startIndex !== -1 && endIndex !== -1) {
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
            <p className="text-sm" style={{color:MUTED}}>Tambahkan siswa terlebih dahulu untuk melihat data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <div style={{background:CARD}} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Laporan Orang Tua</p>
        <p className="text-xs" style={{color:MUTED}}>Informasi akses orang tua</p>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Pilih siswa */}
        <div>
          <p className="text-xs font-semibold mb-1.5" style={{color:TEXT}}>Pilih Siswa</p>
          <select value={targetId} onChange={e=>setTargetId(Number(e.target.value))}
            style={{width:"100%",border:\`1.5px solid \${BDR}\`,borderRadius:12,padding:"11px 12px",fontSize:14,color:TEXT,fontFamily:IPS,background:CARD,outline:"none",minHeight:46}}>
            {students.map(s=><option key={s.id} value={s.id}>{s.name} — Kelas {s.kelas}</option>)}
          </select>
        </div>

        {/* Info siswa saja */}
        <div style={{background:CARD,border:\`1px solid \${BDR}\`}} className="rounded-2xl p-4">
            <p className="text-sm font-bold mb-2" style={{color:TEXT}}>{target.name}</p>
            <p className="text-xs mb-3" style={{color:MUTED}}>Kode Akses Orang Tua: <span style={{fontFamily:DMM}} className="font-bold">{target.kodeOrtu}</span></p>
            <div style={{background:SEC,border:\`1px solid rgba(91,122,104,0.2)\`}} className="rounded-xl p-3 flex items-start gap-2">
              <Info size={13} style={{color:T,flexShrink:0,marginTop:2}}/>
              <p className="text-xs leading-relaxed" style={{color:T}}>
                 Pencatatan riwayat (jurnal dan observasi) kini dipindahkan ke dalam halaman <strong>Profil Siswa</strong> pada tab <strong>Jurnal & Catatan</strong> untuk memudahkan manajemen dan pelaporan terpusat.
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}

`;
  
  content = content.substring(0, startIndex) + newReportScreen + content.substring(endIndex);
  fs.writeFileSync('src/app/App.tsx', content);
}
