const fs = require('fs');
let code = fs.readFileSync('src/app/components/add-student.tsx', 'utf8');

code = code.replace(
  `<p className="text-xs" style={{color:MUTED,fontFamily:IPS}}>
                    {step==="identitas"?"Isi data dasar — cukup 3 kolom wajib":"Semua opsional, bisa dilengkapi nanti"}
                  </p>`,
  `{step==="abk" && (
                    <p className="text-xs" style={{color:MUTED,fontFamily:IPS}}>
                      Semua opsional, bisa dilengkapi nanti
                    </p>
                  )}`
);

fs.writeFileSync('src/app/components/add-student.tsx', code);
