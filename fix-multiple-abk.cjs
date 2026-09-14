const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

code = code.replace(
  `  const [abkInput,setAbkInput]     = useState("");

  const addClass = () => {
    const k = kelasInput.trim();
    const a = abkInput.trim();
    if (!k || !a) return;
    setKelasAbkMap(m => ({...m, [k]: a}));
    setKelasInput(""); setAbkInput("");
  };`,
  `  const [abkInput,setAbkInput]     = useState<string[]>([]);
  const [lainnyaInput,setLainnyaInput] = useState("");

  const addClass = () => {
    const k = kelasInput.trim();
    let selectedAbks = abkInput.filter(x => x !== "Lainnya");
    if (abkInput.includes("Lainnya") && lainnyaInput.trim()) {
      selectedAbks.push(lainnyaInput.trim());
    }
    if (!k || selectedAbks.length === 0) return;
    setKelasAbkMap(m => ({...m, [k]: selectedAbks.join(" · ")}));
    setKelasInput(""); setAbkInput([]); setLainnyaInput("");
  };`
);

// update keydown check in row 1
code = code.replace(
  `onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); if(abkInput.trim()) addClass(); } }}`,
  `onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addClass(); } }}`
);

// update mapping logic
code = code.replace(
  `              {[...ABK_OPTIONS, "Lainnya"].map(o=>(
                <button
                  key={o}
                  onClick={()=>setAbkInput(o)}
                  style={{
                    background: abkInput===o ? SEC : BG,
                    border: \`1.5px solid \${abkInput===o ? T : BDR}\`,
                    color: abkInput===o ? DEEP : MUTED,
                    padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, fontFamily: IPS,
                    cursor: "pointer", transition: "all 0.2s"
                  }}>
                  {o}
                </button>
              ))}`,
  `              {[...ABK_OPTIONS, "Lainnya"].map(o=>(
                <button
                  key={o}
                  onClick={()=>setAbkInput(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o])}
                  style={{
                    background: abkInput.includes(o) ? SEC : BG,
                    border: \`1.5px solid \${abkInput.includes(o) ? T : BDR}\`,
                    color: abkInput.includes(o) ? DEEP : MUTED,
                    padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, fontFamily: IPS,
                    cursor: "pointer", transition: "all 0.2s"
                  }}>
                  {o}
                </button>
              ))}`
);

// update lainnya input
code = code.replace(
  `            {abkInput === "Lainnya" && (
              <input
                autoFocus
                placeholder="Tulis jenis ABK spesifik..."
                onBlur={e => { if (e.target.value.trim()) setAbkInput(e.target.value.trim()); }}
                onKeyDown={e => { if (e.key==="Enter") { e.preventDefault(); if (e.currentTarget.value.trim()) { setAbkInput(e.currentTarget.value.trim()); addClass(); } } }}
                style={{width:"100%",border:\`1.5px solid \${BDR}\`,borderRadius:12,padding:"9px 12px",fontSize:13,color:TEXT,fontFamily:IPS,background:CARD,outline:"none"}}
              />
            )}
            <button
              onClick={addClass}
              disabled={!kelasInput.trim() || !abkInput.trim() || abkInput==="Lainnya"}
              style={{width:"100%",height:42,borderRadius:12,background:(kelasInput.trim()&&abkInput.trim()&&abkInput!=="Lainnya")?T:"#D1D5DB",border:"none",cursor:(kelasInput.trim()&&abkInput.trim()&&abkInput!=="Lainnya")?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"bold",fontFamily:IPS,fontSize:14,marginTop:4}}>`,
  `            {abkInput.includes("Lainnya") && (
              <input
                autoFocus
                placeholder="Tulis jenis ABK spesifik..."
                value={lainnyaInput}
                onChange={e => setLainnyaInput(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter") { e.preventDefault(); addClass(); } }}
                style={{width:"100%",border:\`1.5px solid \${BDR}\`,borderRadius:12,padding:"9px 12px",fontSize:13,color:TEXT,fontFamily:IPS,background:CARD,outline:"none"}}
              />
            )}
            <button
              onClick={addClass}
              disabled={!kelasInput.trim() || abkInput.length === 0 || (abkInput.length === 1 && abkInput[0] === "Lainnya" && !lainnyaInput.trim())}
              style={{width:"100%",height:42,borderRadius:12,background:(!kelasInput.trim() || abkInput.length === 0 || (abkInput.length === 1 && abkInput[0] === "Lainnya" && !lainnyaInput.trim()))?"#D1D5DB":T,border:"none",cursor:(!kelasInput.trim() || abkInput.length === 0 || (abkInput.length === 1 && abkInput[0] === "Lainnya" && !lainnyaInput.trim()))?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"bold",fontFamily:IPS,fontSize:14,marginTop:4}}>`
);

fs.writeFileSync('src/app/components/auth.tsx', code);
