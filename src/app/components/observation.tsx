import { useState } from "react";
import {
  Sparkles, CheckCircle, Circle, ChevronRight, Info, ClipboardList, Gauge,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, PBtn, TBar,
} from "./ui-kit";
import {
  OBS_BY_ABK, OBS_KATEGORI, OBS_KAT_META, ASESMEN, ASESMEN_META, SKALA,
  useStudents, type ObsKategori, type AsesmenKategori,
} from "./data";
import { VoiceTextarea } from "./voice-input";

type Tahap = "pengamatan" | "asesmen" | "catatan";

export function ObservationScreen({onBack,onDone,studentId}:{
  onBack:()=>void; onDone:(id:number)=>void; studentId:number;
}) {
  const students = useStudents();
  const student = students.find(s=>s.id===studentId) ?? students[0];

  const items = (student?.abk ? OBS_BY_ABK[student.abk] : undefined)
    ?? Object.entries(OBS_BY_ABK).find(([k]) => student?.abk?.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(student?.abk?.toLowerCase() || ""))?.[1]
    ?? OBS_BY_ABK["Autism Spectrum Disorder"]
    ?? Object.values(OBS_BY_ABK)[0]
    ?? [];

  const [tahap,setTahap]   = useState<Tahap>("pengamatan");
  const [checked,setChecked] = useState<Set<number>>(new Set());
  const [skor,setSkor]     = useState<Record<number,number>>({});
  const [buka,setBuka]     = useState<Set<string>>(new Set(["Interaksi Sosial"]));
  const [catatan,setCatatan] = useState("");

  if (!student) {
    return (
      <div className="flex-1 overflow-y-auto" style={{fontFamily:IPS}}>
        <TBar title="Pengamatan & Asesmen" sub="Pilih Siswa" onBack={onBack}/>
        <div className="p-8 text-center">
          <p className="text-sm font-semibold mb-4" style={{color:MUTED}}>Belum ada siswa yang dipilih atau tersedia untuk diamati.</p>
          <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-xs font-bold" style={{background:A, color:"#fff", fontFamily:PJS}}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

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
  const obsPct     = totalObs > 0 ? Math.round(totalCheck/totalObs*100) : 0;

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
          <span style={{fontSize:28}}>{student.emoji}</span>
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
              style={{
                flex:1,minHeight:44,
                color:tahap===t.k?DEEP:MUTED,
                borderBottom:tahap===t.k?`3px solid ${DEEP}`:"3px solid transparent",
                fontFamily:PJS,
                fontWeight:tahap===t.k?800:600
              }}
              className="text-xs">
              {t.l} <span style={{fontFamily:DMM,fontWeight:700}}>{t.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TAHAP 1: PENGAMATAN BERKATEGORI ── */}
      {tahap==="pengamatan" && (
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div style={{background:DEEP,borderRadius:18,padding:"14px",color:"#FFFFFF",boxShadow:"0 4px 14px rgba(91,122,104,0.25)"}} className="flex items-start gap-2.5">
            <Sparkles size={16} style={{color:"#D4E8DA",flexShrink:0,marginTop:2}}/>
            <p className="text-xs leading-relaxed" style={{color:"#FFFFFF"}}>
              <strong style={{color:"#FFFFFF"}}>{totalObs} indikator</strong> dalam <strong style={{color:"#FFFFFF"}}>{perKategori.length} kategori</strong> dipilih AI sesuai profil {student.abk}. Buka kategori yang ingin diisi.
            </p>
          </div>

          <div style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:18,padding:"14px 16px",boxShadow:"0 2px 8px rgba(91,122,104,0.06)"}}>
            <div className="flex justify-between text-xs mb-2">
              <span style={{color:TEXT,fontWeight:600}}>Indikator terpenuhi</span>
              <span className="font-bold" style={{color:"#059669",fontFamily:DMM,fontSize:13}}>{totalCheck}/{totalObs} · {obsPct}%</span>
            </div>
            <div className="h-2.5 rounded-full" style={{background:"#EDE9E3"}}>
              <div className="h-full rounded-full transition-all" style={{width:`${obsPct}%`,background:obsPct>0?`linear-gradient(90deg, #10B981 0%, #059669 100%)`:"transparent"}}/>
            </div>
          </div>

          {perKategori.map(({kategori,list})=>{
            const meta = OBS_KAT_META[kategori as ObsKategori];
            const isOpen = buka.has(kategori);
            const done = list.filter(i=>checked.has(i.id)).length;
            return (
              <div key={kategori} style={{background:CARD,border:`1.5px solid ${meta.color}35`,boxShadow:"0 2px 8px rgba(91,122,104,0.06)",overflow:"hidden"}} className="rounded-2xl">
                <button onClick={()=>toggleSeksi(kategori)} className="w-full px-4 py-3 flex items-center gap-3 text-left" style={{minHeight:64}}>
                  <div style={{width:42,height:42,background:meta.bg,borderRadius:12,border:`1px solid ${meta.color}40`,flexShrink:0,fontSize:20}} className="flex items-center justify-center">{meta.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{kategori}</p>
                    <p className="text-xs" style={{color:MUTED}}>{meta.desc}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: done>0 ? "#ECFDF5" : BG,
                      color: done>0 ? "#059669" : MUTED,
                      border: `1.5px solid ${done>0 ? "#10B981" : BDR}`,
                      fontFamily: DMM
                    }}>
                    {done}/{list.length}
                  </span>
                  <ChevronRight size={16} style={{color:MUTED,flexShrink:0,transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.2s"}} strokeWidth={2.2}/>
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 pt-1 space-y-2" style={{borderTop:`1px solid ${meta.color}20`}}>
                    {list.map(item=>{
                      const on = checked.has(item.id);
                      return (
                        <button key={item.id} onClick={()=>toggleItem(item.id)}
                          style={{
                            background: on ? "#ECFDF5" : CARD,
                            border: on ? "2px solid #10B981" : `1.5px solid ${BDR}`,
                            minHeight: 60, width: "100%", textAlign: "left",
                            boxShadow: on ? "0 4px 14px rgba(16,185,129,0.22)" : "none"
                          }}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all active:scale-[0.98]">
                          {on ? (
                            <CheckCircle size={22} style={{color:"#059669",flexShrink:0}} strokeWidth={2.5}/>
                          ) : (
                            <Circle size={22} style={{color:"#CBD5E1",flexShrink:0}}/>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-snug" style={{color: on ? "#064E3B" : TEXT, fontWeight: on ? 700 : 500}}>
                              {item.text}
                            </p>
                            <span className="text-xs mt-0.5 inline-block font-semibold" style={{color: on ? "#059669" : MUTED, fontFamily: DMM}}>
                              {item.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <PBtn
            full
            label="Lanjut ke Asesmen Kemampuan"
            icon={<Gauge size={17}/>}
            onClick={()=>setTahap("asesmen")}
            size="md"
          />
        </div>
      )}

      {/* ── TAHAP 2: ASESMEN 2 KATEGORI ── */}
      {tahap==="asesmen" && (
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div style={{background:"rgba(210,125,107,0.12)",border:`1.5px solid rgba(210,125,107,0.35)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5">
            <Gauge size={16} style={{color:A,flexShrink:0,marginTop:1}}/>
            <p className="text-xs leading-relaxed" style={{color:TEXT}}>
              Dua kategori tes: <strong style={{color:A}}>Kemandirian</strong> dan <strong style={{color:A}}>Akademik & Bakat</strong>. Pilih tingkat yang paling menggambarkan anak.
            </p>
          </div>

          {/* Legenda skala */}
          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl px-4 py-3">
            <p className="text-xs font-bold mb-2" style={{color:TEXT,fontFamily:PJS}}>Arti tingkat penilaian</p>
            <div className="space-y-1.5">
              {SKALA.map(s=>(
                <div key={s.v} className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0" style={{background:s.bg,color:s.color,border:`1px solid ${s.color}40`,minWidth:66,textAlign:"center"}}>{s.l}</span>
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
              <div key={kat} style={{background:CARD,border:`1.5px solid ${meta.color}35`,boxShadow:"0 2px 8px rgba(91,122,104,0.06)"}} className="rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-1">
                  <div style={{width:42,height:42,background:meta.bg,borderRadius:12,border:`1px solid ${meta.color}40`,flexShrink:0,fontSize:20}} className="flex items-center justify-center">{meta.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>{kat}</p>
                    <p className="text-xs" style={{color:MUTED}}>{meta.desc}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{background:isi>0?meta.bg:BG,color:isi>0?meta.color:MUTED,border:`1px solid ${isi>0?meta.color+"50":BDR}`,fontFamily:DMM}}>{isi}/{list.length}</span>
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
                      <p className="text-sm leading-snug mb-0.5 font-semibold" style={{color:TEXT}}>{a.text}</p>
                      <p className="text-xs mb-2" style={{color:MUTED}}>💡 {a.petunjuk}</p>
                      <div className="flex gap-1.5">
                        {SKALA.map(s=>{
                          const on = skor[a.id]===s.v;
                          return (
                            <button key={s.v} onClick={()=>setSkor(p=>({...p,[a.id]:s.v}))}
                              style={{
                                flex:1,
                                minHeight:42,
                                background: on ? s.color : CARD,
                                border: on ? `2px solid ${s.color}` : `1.5px solid ${BDR}`,
                                color: on ? "#FFFFFF" : TEXT,
                                fontFamily: PJS,
                                fontWeight: on ? 800 : 600,
                                boxShadow: on ? `0 3px 10px ${s.color}40` : "none"
                              }}
                              className="rounded-xl text-xs transition-all active:scale-95">
                              {s.l}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{background:CARD,border:`1px solid ${BDR}`,borderRadius:18,padding:"14px 16px",boxShadow:"0 2px 8px rgba(91,122,104,0.06)"}}>
            <div className="flex justify-between text-xs mb-2">
              <span style={{color:TEXT,fontWeight:600}}>Butir asesmen terisi</span>
              <span className="font-bold" style={{color:A,fontFamily:DMM,fontSize:13}}>{terisi}/{totalAsesmen} · {asesmenPct}%</span>
            </div>
            <div className="h-2.5 rounded-full" style={{background:"#EDE9E3"}}>
              <div className="h-full rounded-full transition-all" style={{width:`${asesmenPct}%`,background:asesmenPct>0?A:"transparent"}}/>
            </div>
          </div>

          <PBtn
            full
            label="Lanjut ke Catatan"
            icon={<ClipboardList size={17}/>}
            onClick={()=>setTahap("catatan")}
            size="md"
          />
        </div>
      )}

      {/* ── TAHAP 3: CATATAN SUARA ── */}
      {tahap==="catatan" && (
        <div className="px-4 pt-4 pb-6 space-y-3">
          <div style={{background:DEEP,borderRadius:18,padding:"14px",color:"#FFFFFF",boxShadow:"0 4px 14px rgba(91,122,104,0.25)"}} className="flex items-start gap-2.5">
            <Info size={16} style={{color:"#D4E8DA",flexShrink:0,marginTop:2}}/>
            <p className="text-xs leading-relaxed" style={{color:"#FFFFFF"}}>
              Catatan ini menjadi bahan tambahan pemetaan potensi jika ditemukan indikator yang tidak tercantum di checklist sebelumnya. Tekan tombol mikrofon lalu ceritakan langsung atau ketik manual.
            </p>
          </div>

          <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
            <VoiceTextarea
              label="Catatan Tambahan Siswa"
              value={catatan} onChange={setCatatan} rows={6}
              placeholder={`Ceritakan apa yang Anda amati pada ${student.name.split(" ")[0]}`}
            />
          </div>

          <div style={{background:CARD,border:`1.5px solid rgba(91,122,104,0.35)`,borderRadius:18,boxShadow:"0 2px 8px rgba(91,122,104,0.06)"}} className="px-4 py-3">
            <p className="text-xs font-bold mb-2" style={{color:DEEP,fontFamily:PJS}}>Ringkasan sesi ini</p>
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
