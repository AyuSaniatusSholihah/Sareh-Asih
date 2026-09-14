const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

// Update tab state definition
code = code.replace(
  'const [tab,setTab]=useState<"abk"|"catatan"|"kode">("abk");',
  'const [tab,setTab]=useState<"abk"|"kode">("abk");'
);

// Remove catatanBaru state
code = code.replace(
  'const [catatanBaru,setCatatanBaru] = useState("");\n',
  ''
);

// Remove "catatan" from the tabs map
code = code.replace(
  '{[{k:"abk",l:"Profil ABK"},{k:"catatan",l:"Catatan"},{k:"kode",l:"Kode Ortu"}].map(t=>(',
  '{[{k:"abk",l:"Profil ABK"},{k:"kode",l:"Kode Ortu"}].map(t=>('
);

// Remove the entire {tab==="catatan"} block
const catatanBlock = `        {tab==="catatan"&&(
          <>
            <div style={{background:CARD,border:\`1.5px solid \${T}\`}} className="rounded-2xl p-3">
              <VoiceTextarea
                label="Tambah Catatan Perkembangan"
                value={catatanBaru} onChange={setCatatanBaru} rows={3}
                placeholder={\`Tuliskan atau ceritakan perkembangan \${s.name.split(" ")[0]}...\`}
                hint="Catatan ini bisa dipakai sebagai bahan laporan ke orang tua."
              />
              <div className="flex justify-end mt-2">
                <PBtn label="Simpan" icon={<Edit3 size={13}/>} disabled={!catatanBaru.trim()} onClick={()=>setCatatanBaru("")}/>
              </div>
            </div>
            {s.hasObs ? [
              {d:"14 Jul 2026",t:\`\${s.name.split(" ")[0]} mulai berani menunjukkan karyanya kepada teman sekelas. Kepercayaan diri meningkat dibanding bulan lalu.\`},
              {d:"3 Jun 2026", t:"Koordinasi motorik halus sangat baik. Mampu menyelesaikan tugas tanpa bantuan."},
            ].map(c=>(
              <div key={c.d} style={{background:CARD,border:\`1px solid \${BDR}\`}} className="rounded-2xl p-4">
                <p className="text-xs font-bold mb-1.5" style={{color:MUTED,fontFamily:DMM}}>{c.d} · {s.teacher}</p>
                <p className="text-sm leading-relaxed" style={{color:TEXT}}>{c.t}</p>
              </div>
            )) : (
              <div style={{background:CARD,border:\`1.5px dashed \${BDR}\`}} className="rounded-2xl px-4 py-6 text-center">
                <p className="text-xs" style={{color:MUTED}}>Belum ada catatan untuk siswa ini.</p>
              </div>
            )}
          </>
        )}`;

code = code.replace(catatanBlock, '');

fs.writeFileSync('src/app/App.tsx', code);
