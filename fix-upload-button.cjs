const fs = require('fs');
let code = fs.readFileSync('src/app/components/add-student.tsx', 'utf8');

const oldButton1 = `<button title="Upload File (CSV/Excel)" style={{minWidth:36,minHeight:36,color:T, background:SEC}} className="flex items-center justify-center rounded-xl">
                      <Upload size={16}/>
                    </button>`;

const newButton1 = `<button title="Upload File (CSV/Excel)" style={{height:36, padding:"0 12px", color:T, background:SEC, fontSize:12, fontWeight:600, fontFamily:IPS}} className="flex items-center justify-center gap-1.5 rounded-xl">
                      <Upload size={14}/> Upload File
                    </button>`;

code = code.replace(oldButton1, newButton1);

const oldButton2 = `<button title="Upload File (CSV/Excel)" style={{minWidth:36,minHeight:36,color:T, background:SEC}} className="flex items-center justify-center rounded-xl">
                    <Upload size={16}/>
                  </button>`;
                  
const newButton2 = `<button title="Upload File (CSV/Excel)" style={{height:36, padding:"0 12px", color:T, background:SEC, fontSize:12, fontWeight:600, fontFamily:IPS}} className="flex items-center justify-center gap-1.5 rounded-xl">
                    <Upload size={14}/> Upload File
                  </button>`;

code = code.replace(oldButton2, newButton2);

fs.writeFileSync('src/app/components/add-student.tsx', code);
