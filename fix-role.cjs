const fs = require('fs');
let code = fs.readFileSync('src/app/components/auth.tsx', 'utf8');

const regex = /export function RoleSelectScreen.*?^}/ms;

const newRoleScreen = `export function RoleSelectScreen({onPick,onBack}:{onPick:(r:Role)=>void;onBack:()=>void}) {
  const ROLES = [
    { 
      r: "guru" as Role, 
      emoji: "👩‍🏫", 
      title: "Saya Guru Pendamping", 
      desc: "Lakukan pengamatan, petakan potensi anak, dan bagikan laporan ke orang tua.",
      bullets: ["Pengamatan adaptif sesuai kondisi ABK", "Manajemen kelompok kelas terintegrasi", "Laporan dan rekomendasi lomba"],
      bgInfo: "#E8F0E9",
      emojiSize: 32
    },
    { 
      r: "ortu" as Role, 
      emoji: "👨‍👩‍👧", 
      title: "Saya Orang Tua", 
      desc: "Pantau progres harian anak, baca laporan dari guru, dan temukan jadwal terapi.",
      bullets: ["Cek perkembangan anak real-time", "Terima laporan & catatan harian dari guru", "Temukan jadwal terapi & event terdekat"],
      bgInfo: "#FFF4E6",
      emojiSize: 32
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS, background: "#FDFBF7"}}>
      <div className="px-4 pt-4 pb-2">
        <button onClick={onBack} style={{minWidth:40,minHeight:40, background: "#FFF", border: "1px solid #E5E7EB"}} className="flex items-center justify-center rounded-2xl shadow-sm">
          <ArrowLeft size={18} style={{color: TEXT}}/>
        </button>
      </div>
      <div className="px-6 pb-10 pt-2">
        <h1 style={{fontFamily:PJS, fontSize:26, fontWeight:800, color:"#1F3D28", marginBottom:8}}>Masuk Sebagai Siapa?</h1>
        <p style={{fontSize:14, color:"#5B7A68", marginBottom:24, lineHeight:1.5}}>Tampilan dan fitur aplikasi akan disesuaikan dengan peran yang Anda pilih.</p>

        <div className="space-y-4">
          {ROLES.map(x => (
            <button key={x.r} onClick={() => onPick(x.r)}
              style={{background: "#FFF", border: "1.5px solid #EAEAEA", width: "100%", textAlign: "left", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"}}
              className="rounded-3xl p-5 transition-all hover:border-[#8BB098] hover:shadow-md group">
              
              <div className="flex gap-4 mb-4">
                <div style={{width: 60, height: 60, background: x.bgInfo, flexShrink: 0, fontSize: x.emojiSize}} className="rounded-2xl flex items-center justify-center">
                  {x.emoji}
                </div>
                <div className="flex-1">
                  <h3 style={{fontFamily:PJS, fontSize:18, fontWeight:700, color:"#1A2E20", marginBottom:4}}>{x.title}</h3>
                  <p style={{fontSize:13, color:"#5B7A68", lineHeight:1.4}}>{x.desc}</p>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-4" style={{borderTop: "1px dashed #EAEAEA"}}>
                {x.bullets.map(b => (
                  <div key={b} className="flex items-start gap-2.5">
                    <CheckCircle size={14} style={{color: "#8BB098", flexShrink: 0, marginTop: 2}}/>
                    <span style={{fontSize: 13, color: "#4A5568", lineHeight: 1.4}}>{b}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div style={{background: "#E8F0E9", border: "1px solid rgba(139, 176, 152, 0.3)"}} className="rounded-2xl p-4 flex items-start gap-3 mt-6">
          <ShieldCheck size={18} style={{color: "#2E5537", flexShrink: 0, marginTop: 1}}/>
          <p style={{fontSize: 12, color: "#2E5537", lineHeight: 1.5}}>
            Data anak dikelola secara tertutup. Orang tua memerlukan kode akses dari guru untuk melihat informasi.
          </p>
        </div>
      </div>
    </div>
  );
}`;

code = code.replace(regex, newRoleScreen);
fs.writeFileSync('src/app/components/auth.tsx', code);
