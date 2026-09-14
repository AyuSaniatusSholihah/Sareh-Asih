const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// Add Calendar, Plus
content = content.replace(/Settings, Volume2, VolumeX, X, HelpCircle, Mic, MicOff,/, "Settings, Volume2, VolumeX, X, HelpCircle, Mic, MicOff, Calendar, Plus,");

// Update Competition to Agenda in data/tabs
content = content.replace(/{k:"competition",l:"Lomba",I:Trophy}/g, '{k:"competition",l:"Agenda",I:Calendar}');
content = content.replace(/label:"Lomba",             bg:"#EDE6F5", color:"#8E44AD", onClick:\(\)=>go\("competition"\)/g, 'label:"Agenda",             bg:"#EDE6F5", color:"#8E44AD", onClick:()=>go("competition")');
content = content.replace(/{icon:<Trophy size={15}\/>,         iconBg:"#EDE6F5", iconColor:"#8E44AD", value:totalLomba,        label:"Rekomendasi Lomba", sub:"Baru tersedia", onClick:\(\)=>go\("competition"\)}/g, '{icon:<Calendar size={15}/>,         iconBg:"#EDE6F5", iconColor:"#8E44AD", value:totalLomba,        label:"Agenda & Lomba", sub:"Info Baru", onClick:()=>go("competition")}');
content = content.replace(/case "competition":     return \["Lomba", "O2SN · FLS2N · LKS"\];/g, 'case "competition":     return ["Agenda", "Agenda & Rekomendasi Lomba"];');
content = content.replace(/<CompetitionScreen onStartObs={startObs}\/>/g, '<CompetitionScreen onStartObs={startObs} agendas={agendas} onAddAgenda={(a)=>setAgendas([...agendas,a])}/>');
content = content.replace(/icon:"🏆", title:"Menu Lomba"/g, 'icon:"📅", title:"Menu Agenda"');
content = content.replace(/badge:"Nav Lomba"/g, 'badge:"Nav Agenda"');

// Add state
const stateInsert = `
  // Data siswa
  const [agendas, setAgendas] = useState<any[]>([
    { id: 1, type: "sekolah", title: "Pentas Seni Inklusif", date: "2026-08-15", desc: "Acara tahunan sekolah menampilkan bakat siswa." },
    { id: 2, type: "lomba", title: "O2SN Diksus", date: "2026-09-10", desc: "Lomba olahraga bagi PDBK (Bocce, Lari, dll)." }
  ]);
`;
content = content.replace(/\/\/ Data siswa/, stateInsert);

// Replace CompetitionScreen
const compRegex = /function CompetitionScreen.*?return.*?<\/div>\n    <\/div>\n  \);\n}/s;

const newScreen = `function CompetitionScreen({onStartObs, agendas, onAddAgenda}:{onStartObs:(id:number)=>void, agendas:any[], onAddAgenda:(a:any)=>void}) {
  const students = useStudents();
  const withObs = students.filter(s=>s.hasObs);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({type:"sekolah", title:"", date:"", desc:""});

  const handleSubmit = () => {
    if(!form.title || !form.date) return;
    onAddAgenda({...form, id:Date.now()});
    setShowAdd(false);
    setForm({type:"sekolah", title:"", date:"", desc:""});
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{fontFamily:IPS}}>
      <div style={{background:CARD}} className="px-4 pt-2 pb-3 flex-shrink-0">
        <p className="font-bold text-xl" style={{fontFamily:PJS,color:TEXT}}>Agenda & Lomba</p>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <div className="flex flex-row gap-3 h-full">
          {/* Kotak Kiri: Rekomendasi Lomba (Per Lomba & Siswa) */}
          <div className="flex-1 flex flex-col bg-white border rounded-2xl overflow-hidden shadow-sm" style={{borderColor:BDR}}>
            <div className="px-3 py-2 border-b bg-gray-50 flex items-center justify-between" style={{borderColor:BDR}}>
              <p className="font-bold text-sm" style={{color:TEXT}}>Rekomendasi Lomba</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {withObs.length === 0 ? (
                 <p className="text-xs text-center text-gray-400 mt-4">Belum ada siswa dengan hasil pengamatan.</p>
              ) : (
                 withObs.map(s => (
                   <div key={s.id} className="border rounded-xl p-3 bg-white" style={{borderColor:BDR}}>
                     <div className="flex items-center gap-2 mb-2">
                       <span className="text-lg">{s.emoji}</span>
                       <div className="flex-1 min-w-0">
                         <p className="font-bold text-xs truncate">{s.name}</p>
                         <p className="text-[10px] text-gray-500">{s.abk}</p>
                       </div>
                     </div>
                     {s.comps.length === 0 ? (
                       <p className="text-[10px] text-gray-400">Belum ada rekomendasi</p>
                     ) : (
                       <div className="space-y-2">
                         {s.comps.map((c, i) => {
                           const detail = studentCompDetail[c]?.find(d=>d.id===s.id);
                           return (
                             <div key={i} className="bg-gray-50 rounded-lg p-2 flex flex-col gap-1">
                               <p className="font-semibold text-xs text-amber-700">{c}</p>
                               <p className="text-[10px] text-gray-500">Cabang: {detail?.cabang ?? "—"}</p>
                             </div>
                           )
                         })}
                       </div>
                     )}
                   </div>
                 ))
              )}
            </div>
          </div>

          {/* Kotak Kanan: Agenda Aktif */}
          <div className="flex-1 flex flex-col bg-white border rounded-2xl overflow-hidden shadow-sm" style={{borderColor:BDR}}>
            <div className="px-3 py-2 border-b bg-gray-50 flex flex-col gap-2" style={{borderColor:BDR}}>
              <p className="font-bold text-sm" style={{color:TEXT}}>Agenda Aktif</p>
              <button onClick={()=>setShowAdd(true)} className="w-full flex items-center justify-center gap-1 bg-green-700 text-white rounded-lg py-1.5 text-xs font-semibold">
                <Plus size={12}/> Tambah
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {agendas.length === 0 ? (
                <p className="text-xs text-center text-gray-400 mt-4">Belum ada agenda aktif.</p>
              ) : (
                agendas.map(a => (
                  <div key={a.id} className="border rounded-xl p-3" style={{borderColor:BDR}}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide" style={{background:a.type==="sekolah"?"#E3F2FD":"#FFF3E0", color:a.type==="sekolah"?"#1565C0":"#E65100"}}>{a.type}</span>
                      <span className="text-[10px] font-semibold text-gray-500">{a.date}</span>
                    </div>
                    <p className="font-bold text-xs mt-1 leading-snug">{a.title}</p>
                    {a.desc && <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{a.desc}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 space-y-4">
            <h3 className="font-bold text-lg">Tambah Agenda</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Jenis</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none">
                  <option value="sekolah">Agenda Sekolah</option>
                  <option value="lomba">Lomba</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-semibold block mb-1">Judul Agenda/Lomba</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Contoh: Lomba FLS2N" className="w-full border rounded-xl px-3 py-2 text-sm outline-none"/>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Tanggal</label>
                <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full border rounded-xl px-3 py-2 text-sm outline-none"/>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Deskripsi (Opsional)</label>
                <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} rows={2} placeholder="Keterangan singkat..." className="w-full border rounded-xl px-3 py-2 text-sm outline-none"/>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={()=>setShowAdd(false)} className="flex-1 py-2 rounded-xl text-sm font-semibold border bg-gray-50">Batal</button>
              <button onClick={handleSubmit} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-green-700 text-white">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

content = content.replace(compRegex, newScreen);

fs.writeFileSync('src/app/App.tsx', content);
