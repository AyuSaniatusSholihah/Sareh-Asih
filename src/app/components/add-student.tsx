import { useState } from "react";
import { CheckCircle, Info, XCircle, UserPlus, Sparkles, Plus, ArrowLeft, Upload } from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
  Field, SelectField,
} from "./ui-kit";
import { ABK_OPTIONS, CARA_BELAJAR_OPTIONS, type Student } from "./data";
import siswaIcon from "@/imports/siswa-icon.png";

type Step = "identitas" | "abk" | "success";

const EMPTY = {
  nama:"", kelas:"", umur:"", emoji:"👦",
  jenis_abk:"", extra_abk:[] as string[],
  tingkat_dukungan:"", komunikasi:"", motorik:"",
  cara_belajar:"", rentang:"", minat:"", terapi:"",
};

const GENDER_OPTIONS = [
  { label:"Laki-laki", emoji:"👦" },
  { label:"Perempuan", emoji:"👧" },
];

/**
 * Bottom sheet tambah siswa — dipakai guru, baik saat setup pertama kali
 * maupun dari halaman Daftar Siswa. Hanya 2 langkah agar tidak membebani guru:
 * data wajib minimum di langkah 1, sisanya opsional di langkah 2.
 */
export function AddStudentSheet({
  onClose, onBack, onSave, teacher, kelasAbkMap, firstTime, savedCount,
}:{
  onClose:()=>void;
  onBack?:()=>void;
  onSave:(s:Omit<Student,"id">)=>void;
  teacher:string;
  kelasAbkMap: Record<string,string>;
  firstTime?:boolean;
  savedCount?:number;
}) {
  const [step,setStep]   = useState<Step>("identitas");
  const [form,setForm]   = useState(EMPTY);
  const [lastName,setLastName] = useState("");
  const [extraInput,setExtraInput] = useState("");

  const set = (k:keyof typeof EMPTY) => (v:string) => setForm(f=>({...f,[k]:v}));

  // Ketika kelas dipilih, auto-fill jenis_abk dari map
  const onKelasChange = (k:string) => {
    const abk = kelasAbkMap[k] ?? "";
    setForm(f=>({...f, kelas:k, jenis_abk:abk, extra_abk:[]}));
  };

  // Tambah ABK tambahan (opsional)
  const addExtra = () => {
    const v = extraInput.trim();
    if (!v || form.extra_abk.includes(v) || v === form.jenis_abk) return;
    setForm(f=>({...f, extra_abk:[...f.extra_abk, v]}));
    setExtraInput("");
  };
  const removeExtra = (v:string) => setForm(f=>({...f, extra_abk:f.extra_abk.filter(x=>x!==v)}));

  // ABK options untuk "tambah lain" = semua ABK_OPTIONS minus yang sudah dipilih
  const extraOptions = ABK_OPTIONS.filter(o => o !== form.jenis_abk && !form.extra_abk.includes(o));

  const kelasOptions = Object.keys(kelasAbkMap);
  const canNext = form.nama.trim()!=="" && form.kelas!=="";

  const save = () => {
    const allAbk = form.extra_abk.length
      ? `${form.jenis_abk} · ${form.extra_abk.join(" · ")}`
      : form.jenis_abk;
    onSave({
      name: form.nama.trim(),
      abk: allAbk,
      kelas: form.kelas,
      age: Number(form.umur) || 0,
      emoji: form.emoji,
      talent: "",
      talentScore: 0,
      stars: 0,
      teacher,
      hasObs: false,
      comps: [],
      caraBelajar: form.cara_belajar || "",
      tingkatDukungan: form.tingkat_dukungan,
      komunikasi: form.komunikasi,
      motorik: form.motorik,
      rentang: form.rentang,
      minat: form.minat,
      terapi: form.terapi,
      kodeOrtu: `ABK-2026-${form.nama.trim().split(" ")[0].toUpperCase()}`,
    });
    setLastName(form.nama.trim());
    setStep("success");
  };

  const tambahLagi = () => { setForm(EMPTY); setStep("identitas"); };

  const stepNum = step==="identitas" ? 1 : 2;

  return (
    <div style={{position:"absolute",inset:0,zIndex:70,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={firstTime?undefined:onClose} style={{position:"absolute",inset:0,background:"rgba(46,62,53,0.5)"}}/>

      <div style={{position:"relative",background:CARD,borderRadius:"24px 24px 0 0",maxHeight:"92%",display:"flex",flexDirection:"column"}}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{width:36,height:4,borderRadius:2,background:"#D1D5DB"}}/>
        </div>

        {step!=="success" && (
          <>
            {/* Header */}
            <div className="px-5 pb-3 flex-shrink-0" style={{borderBottom:`1px solid ${BDR}`}}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold text-base" style={{fontFamily:PJS,color:TEXT}}>
                    {step==="identitas"?"Tambah Siswa":"Profil Kebutuhan Siswa"}
                  </p>
                  {step==="abk" && (
                    <p className="text-xs" style={{color:MUTED,fontFamily:IPS}}>
                      Semua opsional, bisa dilengkapi nanti
                    </p>
                  )}
                </div>
                {!firstTime && (
                  <div className="flex items-center gap-2">
                    <button title="Upload File (CSV/Excel)" style={{height:36, padding:"0 12px", color:T, background:SEC, fontSize:12, fontWeight:600, fontFamily:IPS}} className="flex items-center justify-center gap-1.5 rounded-xl">
                      <Upload size={14}/> Upload File
                    </button>
                    <button onClick={onClose} style={{minWidth:36,minHeight:36,color:MUTED}} className="flex items-center justify-center rounded-xl">
                      <XCircle size={18}/>
                    </button>
                  </div>
                )}
                {firstTime && (
                  <button title="Upload File (CSV/Excel)" style={{height:36, padding:"0 12px", color:T, background:SEC, fontSize:12, fontWeight:600, fontFamily:IPS}} className="flex items-center justify-center gap-1.5 rounded-xl">
                    <Upload size={14}/> Upload File
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {[1,2].map(n=>(
                  <div key={n} style={{height:4,flex:1,borderRadius:2,background:stepNum>=n?T:"#E5E7EB"}}/>
                ))}
                <span className="text-xs ml-1" style={{color:MUTED,fontFamily:DMM}}>{stepNum}/2</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {step==="identitas" && (
                <>
                  <Field label="Nama Lengkap" placeholder="Contoh: Budi Santoso" value={form.nama} onChange={set("nama")} required/>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Pilih kelas → ABK auto-fill */}
                    <SelectField label="Kelompok/Kelas" options={kelasOptions} value={form.kelas} onChange={onKelasChange} required/>
                    <Field label="Umur" placeholder="13" value={form.umur} onChange={set("umur")} type="number"/>
                  </div>

                  {/* ABK auto-filled but editable */}
                  {form.jenis_abk && (
                    <div>
                      <p style={{fontSize:13,fontWeight:600,color:TEXT,fontFamily:IPS,marginBottom:6}}>
                        Jenis ABK <span style={{fontSize:11,fontWeight:400,color:MUTED}}>(default kelas, bisa diubah)</span>
                      </p>
                      {/* Primary ABK Selector */}
                      <select
                        value={form.jenis_abk}
                        onChange={e=>setForm(f=>({...f, jenis_abk: e.target.value}))}
                        style={{width:"100%",border:`1.5px solid ${BDR}`,borderRadius:12,padding:"9px 12px",fontSize:13,color:TEXT,fontFamily:IPS,background:CARD,outline:"none",marginBottom:8}}>
                        {ABK_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                        {!ABK_OPTIONS.includes(form.jenis_abk) && <option value={form.jenis_abk}>{form.jenis_abk}</option>}
                      </select>
                      
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                        {form.extra_abk.map(e=>(
                          <div key={e} style={{display:"flex",alignItems:"center",gap:5,background:BG,border:`1px solid ${BDR}`,borderRadius:20,padding:"5px 10px 5px 12px"}}>
                            <span style={{fontSize:12,fontWeight:600,color:TEXT,fontFamily:IPS}}>{e}</span>
                            <button onClick={()=>removeExtra(e)} style={{display:"flex",alignItems:"center",background:"transparent",border:"none",cursor:"pointer",padding:0}}>
                              <XCircle size={13} style={{color:MUTED}}/>
                            </button>
                          </div>
                        ))}
                      </div>
                      {/* Tambah ABK lain (opsional) */}
                      {extraOptions.length > 0 && (
                        <div style={{display:"flex",gap:6}}>
                          <select
                            value={extraInput}
                            onChange={e=>setExtraInput(e.target.value)}
                            style={{flex:1,border:`1px solid ${BDR}`,borderRadius:11,padding:"8px 10px",fontSize:12,color:extraInput?TEXT:MUTED,fontFamily:IPS,background:BG,outline:"none",minHeight:38}}>
                            <option value="">+ Tambah jenis ABK lain (opsional)</option>
                            {extraOptions.map(o=><option key={o} value={o}>{o}</option>)}
                          </select>
                          <button onClick={addExtra} disabled={!extraInput}
                            style={{width:38,height:38,borderRadius:11,background:extraInput?T:"#D1D5DB",border:"none",cursor:extraInput?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            <Plus size={15} style={{color:"#fff"}}/>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Gender — menentukan avatar otomatis */}
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:TEXT,fontFamily:IPS,display:"block",marginBottom:8}}>Jenis Kelamin</label>
                    <div style={{display:"flex",gap:8}}>
                      {GENDER_OPTIONS.map(g=>(
                        <button key={g.label} type="button" onClick={()=>set("emoji")(g.emoji)}
                          style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px 0",borderRadius:14,fontSize:13,fontWeight:600,fontFamily:IPS,cursor:"pointer",transition:"all 0.15s",background:form.emoji===g.emoji?SEC:BG,border:`1.5px solid ${form.emoji===g.emoji?T:BDR}`,color:form.emoji===g.emoji?DEEP:MUTED}}>
                          <img src={siswaIcon} style={{width:24,height:24,objectFit:"contain"}}/>
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!form.jenis_abk && (
                    <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-xl px-3 py-2.5 flex items-start gap-2">
                      <Sparkles size={13} style={{color:T,flexShrink:0,marginTop:1}}/>
                      <p className="text-xs leading-relaxed" style={{color:T,fontFamily:IPS}}>
                        Pilih kelompok/kelas — jenis ABK akan terisi otomatis sesuai kelas yang sudah Anda buat.
                      </p>
                    </div>
                  )}
                </>
              )}

              {step==="abk" && (
                <>
                  <div style={{background:"#FEF9EC",border:`1px solid rgba(217,142,30,0.2)`}} className="rounded-xl px-3 py-2.5 flex items-start gap-2">
                    <Info size={13} style={{color:A,flexShrink:0,marginTop:1}}/>
                    <p className="text-xs leading-relaxed" style={{color:A,fontFamily:IPS}}>
                      Bagian ini boleh dilewati. Semakin lengkap, semakin akurat rekomendasi AI-nya.
                    </p>
                  </div>
                  <SelectField label="Tingkat Dukungan" options={["Dukungan Minimal","Dukungan Sedang","Dukungan Intensif"]} value={form.tingkat_dukungan} onChange={set("tingkat_dukungan")}/>
                  <SelectField label="Kemampuan Komunikasi" options={["Verbal baik","Verbal terbatas","Non-verbal","Menggunakan BISINDO/SIBI"]} value={form.komunikasi} onChange={set("komunikasi")}/>
                  <SelectField label="Kemampuan Motorik" options={["Motorik halus baik","Motorik kasar baik","Keduanya baik","Perlu dukungan alat bantu"]} value={form.motorik} onChange={set("motorik")}/>
                  <SelectField label="Cara Belajar Dominan" options={CARA_BELAJAR_OPTIONS} value={form.cara_belajar} onChange={set("cara_belajar")}/>
                  <Field label="Rentang Konsentrasi" placeholder="Contoh: 10–15 menit" value={form.rentang} onChange={set("rentang")}/>
                  <Field label="Minat Awal" placeholder="Contoh: Menggambar, musik" value={form.minat} onChange={set("minat")}/>
                  <Field label="Riwayat Terapi" placeholder="Contoh: Terapi wicara 2021–2023" value={form.terapi} onChange={set("terapi")}/>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 flex gap-3 flex-shrink-0" style={{borderTop:`1px solid ${BDR}`}}>
              {step==="identitas" && (
                <button onClick={onBack || onClose}
                  style={{flex:1,border:`2px solid ${DEEP}`,color:DEEP,fontFamily:PJS,fontWeight:700,fontSize:14,minHeight:50,background:CARD,borderRadius:16}}
                  className="active:scale-[0.98] transition-all cursor-pointer">
                  ← Kembali
                </button>
              )}
              {step==="abk" && (
                <button onClick={()=>setStep("identitas")}
                  style={{flex:1,border:`2px solid ${DEEP}`,color:DEEP,fontFamily:PJS,fontWeight:700,fontSize:14,minHeight:50,background:CARD,borderRadius:16}}
                  className="active:scale-[0.98] transition-all cursor-pointer">
                  ← Kembali
                </button>
              )}
              <button
                onClick={()=>{ if (step==="identitas") { if (canNext) setStep("abk"); } else save(); }}
                disabled={step==="identitas" && !canNext}
                style={{
                  flex:2,
                  background:(step==="identitas"&&!canNext) ? "#D1D5DB" : A,
                  color:"#fff",
                  fontFamily:PJS,
                  fontWeight:700,
                  fontSize:15,
                  minHeight:50,
                  borderRadius:16,
                  border:"none",
                  boxShadow:(step==="identitas"&&!canNext) ? "none" : "0 6px 20px rgba(210,125,107,0.42)",
                  cursor:(step==="identitas"&&!canNext) ? "not-allowed" : "pointer"
                }}
                className="active:scale-[0.98] transition-all">
                {step==="identitas" ? "Lanjut →" : "Simpan Siswa"}
              </button>
            </div>
            {step==="identitas" && (
              <div className="px-5 pb-4 -mt-2">
                <button onClick={()=>canNext && save()} disabled={!canNext}
                  style={{width:"100%",color:canNext?DEEP:"#9CA3AF",fontFamily:PJS,fontWeight:600,minHeight:38,background:"transparent",border:"none",cursor:canNext?"pointer":"default"}}
                  className="text-xs">
                  Simpan cepat tanpa profil detail
                </button>
              </div>
            )}
          </>
        )}

        {step==="success" && (
          <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
            <div style={{width:72,height:72,background:SEC}} className="rounded-3xl flex items-center justify-center mb-4">
              <CheckCircle size={36} style={{color:DEEP}}/>
            </div>
            <p className="font-bold text-xl mb-1" style={{fontFamily:PJS,color:TEXT}}>Siswa Ditambahkan!</p>
            <p className="text-sm leading-relaxed mb-1" style={{color:MUTED,fontFamily:IPS}}>
              <strong style={{color:TEXT}}>{lastName}</strong> sudah masuk daftar kelas Anda dan siap didampingi.
            </p>
            <p className="text-xs mb-5" style={{color:MUTED,fontFamily:IPS}}>
              Kode akses orang tua otomatis dibuat — bisa dilihat di halaman profil siswa.
            </p>
            <button onClick={tambahLagi}
              style={{
                width:"100%",
                border:`2px solid ${DEEP}`,
                color:DEEP,
                fontFamily:PJS,
                fontWeight:700,
                fontSize:14,
                minHeight:50,
                background:CARD,
                borderRadius:16,
                cursor:"pointer"
              }}
              className="flex items-center justify-center gap-2 mb-3 active:scale-[0.98] transition-all">
              <UserPlus size={16}/> Tambah Siswa Lain
            </button>
            <button onClick={onClose}
              style={{
                width:"100%",
                background:A,
                color:"#fff",
                fontFamily:PJS,
                fontWeight:700,
                fontSize:15,
                minHeight:52,
                borderRadius:16,
                border:"none",
                cursor:"pointer",
                boxShadow:"0 6px 20px rgba(210,125,107,0.42)"
              }}
              className="active:scale-[0.98] transition-all">
              {firstTime ? `Selesai${savedCount?` · ${savedCount} siswa`:""} → Masuk Aplikasi` : "Selesai"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
