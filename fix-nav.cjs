const fs = require('fs');

// 1. UPDATE App.tsx
let appCode = fs.readFileSync('src/app/App.tsx', 'utf8');

appCode = appCode.replace(
  /onClose=\{\(\)=>\{\n\s*setShowAddStudent\(false\);\n\s*if \(addFirstTime\) \{ setAddFirstTime\(false\); finishGuruSetup\(\); \}\n\s*\}\}/,
  `onClose={()=>{
              setShowAddStudent(false);
              if (addFirstTime) { setAddFirstTime(false); finishGuruSetup(); }
            }}
            onBack={()=>{
              setShowAddStudent(false);
              if (addFirstTime) { setGuruSetup("sekolah"); }
            }}`
);
fs.writeFileSync('src/app/App.tsx', appCode);

// 2. UPDATE add-student.tsx
let studentCode = fs.readFileSync('src/app/components/add-student.tsx', 'utf8');

studentCode = studentCode.replace(
  'export function AddStudentSheet({\n  onClose, onSave',
  'export function AddStudentSheet({\n  onClose, onBack, onSave'
);

studentCode = studentCode.replace(
  'onClose:()=>void;',
  'onClose:()=>void;\n  onBack?:()=>void;'
);

// Remove ArrowLeft from header
studentCode = studentCode.replace(
  `<div className="flex items-center gap-3">
                  <button onClick={() => { if (step==="abk") setStep("identitas"); else onClose(); }} style={{color:TEXT}} className="p-1 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={20}/>
                  </button>
                  <div>
                    <p className="font-bold text-base" style={{fontFamily:PJS,color:TEXT}}>
                      {step==="identitas"?"Tambah Siswa":"Profil Kebutuhan Siswa"}
                    </p>
                    <p className="text-xs" style={{color:MUTED,fontFamily:IPS}}>
                      {step==="identitas"?"Isi data dasar — cukup 3 kolom wajib":"Semua opsional, bisa dilengkapi nanti"}
                    </p>
                  </div>
                </div>`,
  `<div>
                  <p className="font-bold text-base" style={{fontFamily:PJS,color:TEXT}}>
                    {step==="identitas"?"Tambah Siswa":"Profil Kebutuhan Siswa"}
                  </p>
                  <p className="text-xs" style={{color:MUTED,fontFamily:IPS}}>
                    {step==="identitas"?"Isi data dasar — cukup 3 kolom wajib":"Semua opsional, bisa dilengkapi nanti"}
                  </p>
                </div>`
);

// Add Kembali button to footer in Identitas step
studentCode = studentCode.replace(
  `{/* Footer */}
            <div className="px-5 py-4 flex gap-2 flex-shrink-0" style={{borderTop:\`1px solid \${BDR}\`}}>
              {step==="abk" && (`,
  `{/* Footer */}
            <div className="px-5 py-4 flex gap-2 flex-shrink-0" style={{borderTop:\`1px solid \${BDR}\`}}>
              {step==="identitas" && (
                <button onClick={onBack || onClose}
                  style={{flex:1,border:\`1.5px solid \${T}\`,color:T,fontFamily:IPS,minHeight:48,background:CARD}} className="rounded-2xl text-sm font-semibold">
                  Kembali
                </button>
              )}
              {step==="abk" && (`
);

fs.writeFileSync('src/app/components/add-student.tsx', studentCode);
