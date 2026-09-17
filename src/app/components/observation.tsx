import { useState } from "react";
import {
  Sparkles, CheckCircle, Circle, ChevronRight, Info, ClipboardList, Gauge,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, PJS, IPS, DMM, PBtn, TBar,
} from "./ui-kit";
import {
  OBS_BY_ABK, OBS_KATEGORI, OBS_KAT_META, ASESMEN, ASESMEN_META, SKALA,
  useStudents, type ObsKategori, type AsesmenKategori,
} from "./data";
import { VoiceTextarea } from "./voice-input";
import siswaIcon from "@/imports/siswa-icon.png";

type Tahap = "pengamatan" | "asesmen" | "catatan";

export function ObservationScreen({onBack,onDone,studentId}:{
  onBack:()=>void; onDone:(id:number)=>void; studentId:number;
}) {
  const students = useStudents();
  const student = students.find(s=>s.id===studentId) ?? students[0];

  const items = OBS_BY_ABK[student?.abk ?? ""] ?? OBS_BY_ABK["Autism Spectrum Disorder"];

  const [tahap,setTahap]   = useState<Tahap>("pengamatan");
  const [checked,setChecked] = useState<Set<number>>(new Set());
  const [skor,setSkor]     = useState<Record<number,number>>({});
  const [buka,setBuka]     = useState<Set<string>>(new Set(["Interaksi Sosial"]));
  const [catatan,setCatatan] = useState("");

  if (!student) return null;

  const toggleItem = (id:number) => setChecked(prev=>{
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const toggleSeksi = (k:string) => setBuka(prev=>{
    const n = new Set(prev);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  });

  const perKategori = OBS_KATEGORI
    .map(k=>({kategori:k, list:items.filter(i=>i.kategori===k)}))
    .filter(g=>g.list.length>0);

  const totalObs   = items.length;
  const totalCheck = checked.size;
  const obsPct     = Math.round(totalCheck/totalObs*100);

  const asesmenKategori: AsesmenKategori[] = ["Kemandirian","Akademik & Bakat"];
  const totalAsesmen = ASESMEN.length;
  const terisi = Object.keys(skor).length;
  const asesmenPct = Math.round(terisi/totalAsesmen*100);

  const rataKategori = (k:AsesmenKategori) => {
    const list = ASESMEN.filter(a=>a.kategori===k).filter(a=>skor[a.id]!==undefined);
    if (!list.length) return null;
    return Math.round(list.reduce((s,a)=>s+skor[a.id],0)/list.length*100/3);
  };

  const bisaSimpan = totalCheck>0 || terisi>0;

  const TAHAP_TABS:{k:Tahap;l:string;n:string}[] = [
    {k:"pengamatan", l:"Pengamatan", n:`${totalCheck}/${totalObs}`},
    {k:"asesmen",   l:"Asesmen",   n:`${terisi}/${totalAsesmen}`},
    {k:"catatan",   l:"Catatan",   n:catatan.trim()?"✓":"—"},
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
      <TBar title="Pengamatan & Asesmen" sub={student.name} onBack={onBack}/>

      {/* Identitas + progress */}
      <div style={{background:CARD,borderBottom:`1px solid ${BDR}`}} className="px-4 pt-2 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <img src={siswaIcon} style={{width:28,height:28,objectFit:"contain"}}/>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{student.name}</p>
            <div className="flex gap-1.5 mt-0.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background:"#F3EFFF",color:"#6D28D9"}}>{student.abk}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background:SEC,color:T}}>Kelas {student.kelas}</span>
            </div>
          </div>
        </div>

        <div className="flex" style={{borderBottom:`1px solid ${BDR}`,marginLeft:-16,marginRight:-16,paddingLeft:16,paddingRight:16}}>
          {TAHAP_TABS.map(t=>(
            <button key={t.k} onClick={()=>setTahap(t.k)}
              style={{flex:1,minHeight:44,color:tahap===t.k?T:MUTED,borderBottom:tahap===t.k?`2.5px solid ${T}`:"2.5px solid transparent",fontFamily:IPS}}
              className="text-xs font-bold">
              {t.l} <span style={{fontFamily:DMM,fontWeight:600}}>{t.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAHAP 1: PENGAMATAN BERKATEGORI ── */}
      {tahap==="pengamatan" && (
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5">
            <Sparkles size={15} style={{color:T,flexShrink:0,marginTop:1}}/>
            <p className="text-xs leading-relaxed" style={{color:T}}>
              <strong>{totalObs} indikator</strong> dalam <strong>{perKategori.length} kategori</strong> dipilih AI sesuai profil {student.abk}. Buka kategori yang ingin diisi — tidak harus semuanya sekaligus.
            </p>
          </div>

          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl px-4 py-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{color:MUTED}}>Indikator terpenuhi</span>
              <span className="font-bold" style={{color:T,fontFamily:DMM}}>{totalCheck}/{totalObs} · {obsPct}%</span>
            </div>
            <div className="h-2 rounded-full" style={{background:"#EDE9E3"}}>
              <div className="h-full rounded-full transition-all" style={{width:`${obsPct}%`,background:T}}/>
            </div>
          </div>

          {perKategori.map(({kategori,list})=>{
            const meta = OBS_KAT_META[kategori as ObsKategori];
            const isOpen = buka.has(kategori);
            const done = list.filter(i=>checked.has(i.id)).length;
            return (
              <div key={kategori} style={{background:CARD,border:`1px solid ${meta.color}25`,overflow:"hidden"}} className="rounded-2xl">
                <button onClick={()=>toggleSeksi(kategori)} className="w-full px-4 py-3 flex items-center gap-3 text-left" style={{minHeight:62}}>
                  <div style={{width:40,height:40,background:meta.bg,borderRadius:12,flexShrink:0,fontSize:19}} className="flex items-center justify-center">{meta.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{kategori}</p>
                    <p className="text-xs" style={{color:MUTED}}>{meta.desc}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{background:done?meta.bg:BG,color:done?meta.color:MUTED,fontFamily:DMM}}>{done}/{list.length}</span>
                  <ChevronRight size={15} style={{color:MUTED,flexShrink:0,transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 pt-1 space-y-2" style={{borderTop:`1px solid ${meta.color}18`}}>
                    {list.map(item=>{
                      const on = checked.has(item.id);
                      return (
                        <button key={item.id} onClick={()=>toggleItem(item.id)}
                          style={{background:on?meta.bg:BG,border:`1.5px solid ${on?meta.color:BDR}`,minHeight:60,width:"100%",textAlign:"left"}}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all">
                          {on ? <CheckCircle size={22} style={{color:meta.color,flexShrink:0}}/> : <Circle size={22} style={{color:"#D1D5DB",flexShrink:0}}/>}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-snug" style={{color:on?meta.color:TEXT,fontWeight:on?600:400}}>{item.text}</p>
                            <span className="text-xs mt-0.5 inline-block" style={{color:MUTED,fontFamily:DMM}}>{item.tag}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={()=>setTahap("asesmen")}
            style={{width:"100%",background:CARD,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:50}}
            className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
            <Gauge size={16}/>Lanjut ke Asesmen Kemampuan
          </button>
        </div>
      )}

      {/* ── TAHAP 2: ASESMEN 2 KATEGORI ── */}
      {tahap==="asesmen" && (
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div style={{background:"#FEF9EC",border:`1px solid rgba(210,125,107,0.22)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5">
            <Gauge size={15} style={{color:A,flexShrink:0,marginTop:1}}/>
            <p className="text-xs leading-relaxed" style={{color:A}}>
              Dua kategori tes: <strong>Kemandirian</strong> dan <strong>Akademik & Bakat</strong>. Pilih tingkat yang paling menggambarkan anak — boleh diisi sebagian dulu.
            </p>
          </div>

          {/* Legenda skala */}
          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl px-4 py-3">
            <p className="text-xs font-bold mb-2" style={{color:TEXT,fontFamily:PJS}}>Arti tingkat penilaian</p>
            <div className="space-y-1.5">
              {SKALA.map(s=>(
                <div key={s.v} className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0" style={{background:s.bg,color:s.color,minWidth:66,textAlign:"center"}}>{s.l}</span>
                  <span className="text-xs" style={{color:MUTED}}>{s.d}</span>
                </div>
              ))}
            </div>
          </div>

          {asesmenKategori.map(kat=>{
            const meta = ASESMEN_META[kat];
            const list = ASESMEN.filter(a=>a.kategori===kat);
            const rata = rataKategori(kat);
            const isi  = list.filter(a=>skor[a.id]!==undefined).length;
            return (
              <div key={kat} style={{background:CARD,border:`1px solid ${meta.color}25`}} className="rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-1">
                  <div style={{width:40,height:40,background:meta.bg,borderRadius:12,flexShrink:0,fontSize:19}} className="flex items-center justify-center">{meta.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{kat}</p>
                    <p className="text-xs" style={{color:MUTED}}>{meta.desc}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{background:meta.bg,color:meta.color,fontFamily:DMM}}>{isi}/{list.length}</span>
                </div>

                {rata!==null && (
                  <div className="mt-2 mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{color:MUTED}}>Skor sementara</span>
                      <span className="font-bold" style={{color:meta.color,fontFamily:DMM}}>{rata}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{background:"#EDE9E3"}}>
                      <div className="h-full rounded-full transition-all" style={{width:`${rata}%`,background:meta.color}}/>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mt-3" style={{borderTop:`1px solid ${BDR}`,paddingTop:12}}>
                  {list.map(a=>(
                    <div key={a.id}>
                      <p className="text-sm leading-snug mb-0.5" style={{color:TEXT}}>{a.text}</p>
                      <p className="text-xs mb-2" style={{color:MUTED}}>💡 {a.petunjuk}</p>
                      <div className="flex gap-1.5">
                        {SKALA.map(s=>{
                          const on = skor[a.id]===s.v;
                          return (
                            <button key={s.v} onClick={()=>setSkor(p=>({...p,[a.id]:s.v}))}
                              style={{flex:1,minHeight:44,background:on?s.bg:BG,border:`1.5px solid ${on?s.color:BDR}`,color:on?s.color:MUTED,fontFamily:IPS}}
                              className="rounded-xl text-xs font-bold">{s.l}</button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl px-4 py-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{color:MUTED}}>Butir asesmen terisi</span>
              <span className="font-bold" style={{color:A,fontFamily:DMM}}>{terisi}/{totalAsesmen} · {asesmenPct}%</span>
            </div>
            <div className="h-2 rounded-full" style={{background:"#EDE9E3"}}>
              <div className="h-full rounded-full transition-all" style={{width:`${asesmenPct}%`,background:A}}/>
            </div>
          </div>

          <button onClick={()=>setTahap("catatan")}
            style={{width:"100%",background:CARD,border:`1.5px solid ${T}`,color:T,fontFamily:IPS,minHeight:50}}
            className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
            <ClipboardList size={16}/>Lanjut ke Catatan
          </button>
        </div>
      )}

      {/* ── TAHAP 3: CATATAN SUARA ── */}
      {tahap==="catatan" && (
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5">
            <Info size={15} style={{color:T,flexShrink:0,marginTop:1}}/>
            <p className="text-xs leading-relaxed" style={{color:T}}>
              Catatan ini menjadi bahan tambahan pemetaan potensi jika ditemukan indikator yang tidak tercantum di checklist sebelumnya. Tekan tombol mikrofon lalu ceritakan langsung atau ketik manual
            </p>
          </div>

          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
            <VoiceTextarea
              label="Catatan Tambahan Siswa"
              value={catatan} onChange={setCatatan} rows={6}
              placeholder={`Ceritakan apa yang Anda amati pada ${student.name.split(" ")[0]}`}
            />
          </div>

          <div style={{background:BG,border:`1px solid ${BDR}`}} className="rounded-2xl px-4 py-3">
            <p className="text-xs font-bold mb-2" style={{color:TEXT,fontFamily:PJS}}>Ringkasan sesi ini</p>
            {[
              {l:"Indikator pengamatan", v:`${totalCheck} dari ${totalObs}`},
              {l:"Butir asesmen",       v:`${terisi} dari ${totalAsesmen}`},
              {l:"Kemandirian",         v:rataKategori("Kemandirian")!==null?`${rataKategori("Kemandirian")}/100`:"belum dinilai"},
              {l:"Akademik & Bakat",    v:rataKategori("Akademik & Bakat")!==null?`${rataKategori("Akademik & Bakat")}/100`:"belum dinilai"},
              {l:"Catatan suara",       v:catatan.trim()?`${catatan.trim().split(/\s+/).length} kata`:"kosong"},
            ].map(r=>(
              <div key={r.l} className="flex items-center justify-between py-1">
                <span className="text-xs" style={{color:MUTED}}>{r.l}</span>
                <span className="text-xs font-bold" style={{color:TEXT,fontFamily:DMM}}>{r.v}</span>
              </div>
            ))}
          </div>

          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl px-4 py-3 text-center">
            <p className="text-xs mb-2.5" style={{color:MUTED}}>
              {!bisaSimpan ? "Isi minimal satu indikator atau butir asesmen sebelum menyimpan."
                : "Data siap diproses AI untuk pemetaan bakat dan rekomendasi belajar."}
            </p>
            <PBtn full label="Simpan & Proses AI" icon={<Sparkles size={15}/>} onClick={()=>onDone(student.id)} disabled={!bisaSimpan}/>
          </div>
        </div>
      )}
    </div>
  );
}
