const fs = require('fs');
let code = fs.readFileSync('src/app/components/add-student.tsx', 'utf8');

// Import ArrowLeft and Upload
code = code.replace(
  `import { CheckCircle, Info, XCircle, UserPlus, Sparkles, Plus } from "lucide-react";`,
  `import { CheckCircle, Info, XCircle, UserPlus, Sparkles, Plus, ArrowLeft, Upload } from "lucide-react";`
);

// Header changes: Add ArrowLeft and Upload button
code = code.replace(
  `<div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold text-base" style={{fontFamily:PJS,color:TEXT}}>
                    {step==="identitas"?"Tambah Siswa":"Profil Kebutuhan Siswa"}
                  </p>`,
  `<div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <button onClick={() => { if (step==="abk") setStep("identitas"); else onClose(); }} style={{color:TEXT}} className="p-1 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={20}/>
                  </button>
                  <div>
                    <p className="font-bold text-base" style={{fontFamily:PJS,color:TEXT}}>
                      {step==="identitas"?"Tambah Siswa":"Profil Kebutuhan Siswa"}
                    </p>`
);

code = code.replace(
  `{!firstTime && (
                  <button onClick={onClose} style={{minWidth:36,minHeight:36,color:MUTED}} className="flex items-center justify-center rounded-xl">
                    <XCircle size={18}/>
                  </button>
                )}`,
  `{!firstTime && (
                  <div className="flex items-center gap-2">
                    <button title="Upload File (CSV/Excel)" style={{minWidth:36,minHeight:36,color:T, background:SEC}} className="flex items-center justify-center rounded-xl">
                      <Upload size={16}/>
                    </button>
                    <button onClick={onClose} style={{minWidth:36,minHeight:36,color:MUTED}} className="flex items-center justify-center rounded-xl">
                      <XCircle size={18}/>
                    </button>
                  </div>
                )}
                {firstTime && (
                  <button title="Upload File (CSV/Excel)" style={{minWidth:36,minHeight:36,color:T, background:SEC}} className="flex items-center justify-center rounded-xl">
                    <Upload size={16}/>
                  </button>
                )}`
);

// Edit ABK part to make it editable
code = code.replace(
  `                  {/* ABK auto-filled */}
                  {form.jenis_abk && (
                    <div>
                      <p style={{fontSize:13,fontWeight:600,color:TEXT,fontFamily:IPS,marginBottom:6}}>
                        Jenis ABK <span style={{fontSize:11,fontWeight:400,color:MUTED}}>(otomatis dari kelas)</span>
                      </p>
                      {/* Primary ABK tag */}
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,background:SEC,border:\`1.5px solid \${T}\`,borderRadius:20,padding:"5px 12px"}}>
                          <Sparkles size={11} style={{color:T}}/>
                          <span style={{fontSize:12,fontWeight:700,color:DEEP,fontFamily:IPS}}>{form.jenis_abk}</span>
                        </div>`,
  `                  {/* ABK auto-filled but editable */}
                  {form.jenis_abk && (
                    <div>
                      <p style={{fontSize:13,fontWeight:600,color:TEXT,fontFamily:IPS,marginBottom:6}}>
                        Jenis ABK <span style={{fontSize:11,fontWeight:400,color:MUTED}}>(default kelas, bisa diubah)</span>
                      </p>
                      {/* Primary ABK Selector */}
                      <select
                        value={form.jenis_abk}
                        onChange={e=>setForm(f=>({...f, jenis_abk: e.target.value}))}
                        style={{width:"100%",border:\`1.5px solid \${BDR}\`,borderRadius:12,padding:"9px 12px",fontSize:13,color:TEXT,fontFamily:IPS,background:CARD,outline:"none",marginBottom:8}}>
                        {ABK_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                        {!ABK_OPTIONS.includes(form.jenis_abk) && <option value={form.jenis_abk}>{form.jenis_abk}</option>}
                      </select>
                      
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>`
);

fs.writeFileSync('src/app/components/add-student.tsx', code);
