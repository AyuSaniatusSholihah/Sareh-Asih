import { useState } from "react";
import {
  Key, CheckSquare, Square, Copy, RefreshCw, Trash2, FileSpreadsheet,
  FileText, CheckCircle, Info, Search, AlertTriangle,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, TBar,
} from "./ui-kit";
import { useStudents, type Student } from "./data";
import { exportSpreadsheet, exportLaporanPemetaan } from "./export";

/* ── Kartu ringkas di Beranda guru ─────────────────────────────────── */
export function KodeAksesCard({onOpen}:{onOpen:()=>void}) {
  const students = useStudents();
  const punya = students.filter(s=>!!s.kodeOrtu);
  const belum = students.filter(s=>!s.kodeOrtu);
  const pct = students.length ? Math.round(punya.length/students.length*100) : 0;

  return (
    <div style={{background:CARD,border:`1.5px solid ${belum.length?A:BDR}`}} className="rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Key size={15} style={{color:T}}/>
        <p className="font-bold text-sm" style={{fontFamily:PJS,color:TEXT}}>Kode Akses Orang Tua</p>
        {belum.length>0 && (
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{background:"#FEF9EC",color:"#92400E"}}>
            {belum.length} belum dibuat
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{color:MUTED}}>
        {belum.length
          ? `${belum.length} siswa belum punya kode, sehingga orang tuanya belum bisa memantau perkembangan anak.`
          : "Semua siswa sudah memiliki kode akses untuk orang tua."}
      </p>

      <div className="flex items-center gap-2 mb-3">
        <div className="h-2 flex-1 rounded-full" style={{background:"#EDE9E3"}}>
          <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:T}}/>
        </div>
        <span className="text-xs font-bold" style={{color:T,fontFamily:DMM}}>{punya.length}/{students.length}</span>
      </div>

      {/* Pratinjau 3 kode teratas */}
      <div className="space-y-1.5 mb-3">
        {students.slice(0,3).map(s=>(
          <div key={s.id} className="flex items-center gap-2 px-2.5 py-2 rounded-xl" style={{background:BG}}>
            <span style={{fontSize:15}}>{s.emoji}</span>
            <span className="text-xs font-semibold flex-1 min-w-0 truncate" style={{color:TEXT}}>{s.name}</span>
            {s.kodeOrtu
              ? <span className="text-xs font-bold" style={{color:DEEP,fontFamily:DMM}}>{s.kodeOrtu}</span>
              : <span className="text-xs font-bold" style={{color:"#92400E"}}>belum ada</span>}
          </div>
        ))}
        {students.length>3 && (
          <p className="text-xs text-center pt-0.5" style={{color:MUTED}}>+{students.length-3} siswa lainnya</p>
        )}
      </div>

      <button onClick={onOpen}
        style={{width:"100%",background:belum.length?A:SEC,color:belum.length?"#fff":DEEP,fontFamily:IPS,minHeight:46}}
        className="rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
        <Key size={14}/>Kelola & Bagikan Kode
      </button>
    </div>
  );
}

/* ── Layar kelola kode akses + ekspor ──────────────────────────────── */
export function KodeAksesScreen({onBack,onBuat,onHapus,namaSekolah}:{
  onBack:()=>void;
  onBuat:(ids:number[])=>void;
  onHapus:(ids:number[])=>void;
  namaSekolah:string;
}) {
  const students = useStudents();
  const [pilih,setPilih] = useState<Set<number>>(new Set());
  const [q,setQ] = useState("");
  const [filter,setFilter] = useState<"semua"|"punya"|"belum">("semua");
  const [toast,setToast] = useState("");
  const [konfirmasiHapus,setKonfirmasiHapus] = useState(false);

  const beritahu = (t:string) => { setToast(t); setTimeout(()=>setToast(""),2400); };

  const tampil = students
    .filter(s=>filter==="semua" || (filter==="punya" ? !!s.kodeOrtu : !s.kodeOrtu))
    .filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.kelas.toLowerCase().includes(q.toLowerCase()));

  const terpilih = students.filter(s=>pilih.has(s.id));
  const semuaTampilTerpilih = tampil.length>0 && tampil.every(s=>pilih.has(s.id));

  const toggle = (id:number) => setPilih(p=>{
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const pilihSemuaTampil = () => setPilih(p=>{
    const n = new Set(p);
    semuaTampilTerpilih ? tampil.forEach(s=>n.delete(s.id)) : tampil.forEach(s=>n.add(s.id));
    return n;
  });
  const pilihBelumPunya = () => setPilih(new Set(students.filter(s=>!s.kodeOrtu).map(s=>s.id)));
  const bersihkan = () => setPilih(new Set());

  const terpilihBelum = terpilih.filter(s=>!s.kodeOrtu);
  const terpilihPunya = terpilih.filter(s=>!!s.kodeOrtu);

  const buatKode = () => {
    if (!terpilih.length) return;
    onBuat(terpilih.map(s=>s.id));
    beritahu(`${terpilih.length} kode akses berhasil dibuat.`);
  };
  const hapusKode = () => {
    onHapus(terpilihPunya.map(s=>s.id));
    setKonfirmasiHapus(false);
    beritahu(`${terpilihPunya.length} kode akses dihapus.`);
  };
  const salinTerpilih = () => {
    const teks = terpilih.filter(s=>s.kodeOrtu).map(s=>`${s.name} (${s.kelas}): ${s.kodeOrtu}`).join("\n");
    if (!teks) { beritahu("Tidak ada kode untuk disalin."); return; }
    navigator.clipboard?.writeText(teks).catch(()=>{});
    beritahu("Daftar kode disalin ke papan klip.");
  };

  const sasaranEkspor = terpilih.length ? terpilih : students;

  return (
    <div className="flex-1 overflow-y-auto relative" style={{fontFamily:IPS}}>
      <TBar title="Kode Akses Orang Tua" sub={`${students.filter(s=>!!s.kodeOrtu).length} dari ${students.length} siswa sudah punya kode`} onBack={onBack}/>

      <div className="px-4 pt-4 pb-6 space-y-3">
        <div style={{background:SEC,border:`1px solid rgba(91,122,104,0.2)`}} className="rounded-2xl p-3.5 flex items-start gap-2.5">
          <Info size={14} style={{color:T,flexShrink:0,marginTop:1}}/>
          <p className="text-xs leading-relaxed" style={{color:T}}>
            Guru yang membuat dan membagikan kode akses. Pilih beberapa siswa sekaligus untuk membuat, menyalin, menghapus, atau mengekspor datanya.
          </p>
        </div>

        {/* Cari + filter */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:MUTED}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama atau kelas..."
            style={{width:"100%",border:`1.5px solid ${BDR}`,borderRadius:14,padding:"11px 14px 11px 38px",fontSize:15,color:TEXT,fontFamily:IPS,background:CARD,outline:"none",minHeight:48}}/>
        </div>

        <div className="flex gap-2">
          {([
            {k:"semua", l:"Semua",           n:students.length},
            {k:"belum", l:"Belum Ada Kode",  n:students.filter(s=>!s.kodeOrtu).length},
            {k:"punya", l:"Sudah Ada",       n:students.filter(s=>!!s.kodeOrtu).length},
          ] as const).map(f=>{
            const on = filter===f.k;
            return (
              <button key={f.k} onClick={()=>setFilter(f.k)}
                style={{flex:1,background:on?T:CARD,color:on?"#fff":MUTED,border:on?"none":`1px solid ${BDR}`,fontFamily:IPS,minHeight:40}}
                className="rounded-xl text-xs font-bold">{f.l} · {f.n}</button>
            );
          })}
        </div>

        {/* Aksi seleksi */}
        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={pilihSemuaTampil}
              style={{flex:1,background:semuaTampilTerpilih?SEC:BG,border:`1px solid ${semuaTampilTerpilih?T:BDR}`,color:semuaTampilTerpilih?DEEP:TEXT,fontFamily:IPS,minHeight:42}}
              className="rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
              {semuaTampilTerpilih ? <CheckSquare size={13}/> : <Square size={13}/>}
              {semuaTampilTerpilih ? "Batal Pilih Semua" : "Pilih Semua"}
            </button>
            <button onClick={pilihBelumPunya}
              style={{flex:1,background:BG,border:`1px solid ${BDR}`,color:TEXT,fontFamily:IPS,minHeight:42}}
              className="rounded-xl text-xs font-bold">Pilih yang Belum Ada</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{color:MUTED}}>
              {terpilih.length ? <><strong style={{color:TEXT}}>{terpilih.length} siswa</strong> terpilih</> : "Belum ada yang dipilih"}
            </span>
            {terpilih.length>0 && (
              <button onClick={bersihkan} className="text-xs font-semibold" style={{color:A}}>Kosongkan pilihan</button>
            )}
          </div>
        </div>

        {/* Daftar siswa */}
        {tampil.length===0 ? (
          <div style={{background:CARD,border:`1.5px dashed ${BDR}`}} className="rounded-2xl px-4 py-8 text-center">
            <p className="text-sm font-semibold" style={{color:MUTED}}>Tidak ada siswa pada filter ini.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tampil.map(s=>{
              const on = pilih.has(s.id);
              return (
                <button key={s.id} onClick={()=>toggle(s.id)}
                  style={{background:on?SEC:CARD,border:`1.5px solid ${on?T:BDR}`,width:"100%",textAlign:"left",minHeight:68}}
                  className="rounded-2xl px-3.5 py-3 flex items-center gap-3 transition-all">
                  {on ? <CheckSquare size={20} style={{color:T,flexShrink:0}}/> : <Square size={20} style={{color:"#C4CBC6",flexShrink:0}}/>}
                  <span style={{fontSize:20,flexShrink:0}}>{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{color:TEXT,fontFamily:IPS}}>{s.name}</p>
                    <p className="text-xs" style={{color:MUTED}}>Kelas {s.kelas} · {s.abk}</p>
                    {s.kodeOrtu
                      ? <p className="text-xs font-bold mt-0.5" style={{color:DEEP,fontFamily:DMM}}>{s.kodeOrtu}</p>
                      : <span className="text-xs font-semibold mt-0.5 inline-block px-2 py-0.5 rounded-full" style={{background:"#FEF9EC",color:"#92400E"}}>Belum ada kode</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tindakan pada yang terpilih */}
        <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
          <p className="font-bold text-sm mb-1" style={{fontFamily:PJS,color:TEXT}}>Tindakan</p>
          <p className="text-xs mb-3" style={{color:MUTED}}>
            {terpilih.length ? `Berlaku untuk ${terpilih.length} siswa terpilih.` : "Pilih siswa terlebih dahulu untuk mengaktifkan tindakan."}
          </p>

          <button onClick={buatKode} disabled={!terpilih.length}
            style={{width:"100%",background:terpilih.length?A:"#E5E7EB",color:terpilih.length?"#fff":"#9CA3AF",fontFamily:IPS,minHeight:48,marginBottom:8}}
            className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
            <RefreshCw size={15}/>
            {terpilihBelum.length===terpilih.length && terpilih.length
              ? `Buat Kode untuk ${terpilih.length} Siswa`
              : `Buat / Perbarui Kode (${terpilih.length})`}
          </button>

          <div className="flex gap-2">
            <button onClick={salinTerpilih} disabled={!terpilih.length}
              style={{flex:1,background:CARD,border:`1.5px solid ${terpilih.length?T:BDR}`,color:terpilih.length?T:"#C4CBC6",fontFamily:IPS,minHeight:46}}
              className="rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5">
              <Copy size={13}/>Salin Daftar
            </button>
            <button onClick={()=>terpilihPunya.length && setKonfirmasiHapus(true)} disabled={!terpilihPunya.length}
              style={{flex:1,background:CARD,border:`1.5px solid ${terpilihPunya.length?"#FCA5A5":BDR}`,color:terpilihPunya.length?"#B91C1C":"#C4CBC6",fontFamily:IPS,minHeight:46}}
              className="rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5">
              <Trash2 size={13}/>Hapus Kode
            </button>
          </div>

          {terpilihPunya.length>0 && (
            <p className="text-xs mt-2 leading-relaxed" style={{color:MUTED}}>
              Membuat ulang atau menghapus kode akan memutus akses orang tua yang memakai kode lama.
            </p>
          )}
        </div>

        {/* Ekspor */}
        <ExportPanel list={sasaranEkspor} adaSeleksi={terpilih.length>0} namaSekolah={namaSekolah} onDone={beritahu}/>
      </div>

      {/* Konfirmasi hapus */}
      {konfirmasiHapus && (
        <div style={{position:"absolute",inset:0,zIndex:70,display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"rgba(46,62,53,0.5)"}}
          onClick={()=>setKonfirmasiHapus(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:CARD,borderRadius:22,padding:20,width:"100%"}}>
            <div style={{width:52,height:52,background:"#FEF2F2",borderRadius:16,margin:"0 auto 12px"}} className="flex items-center justify-center">
              <AlertTriangle size={24} style={{color:"#B91C1C"}}/>
            </div>
            <p className="font-bold text-base text-center mb-1" style={{fontFamily:PJS,color:TEXT}}>Hapus {terpilihPunya.length} Kode Akses?</p>
            <p className="text-xs text-center leading-relaxed mb-4" style={{color:MUTED}}>
              Orang tua yang sedang memakai kode ini akan langsung kehilangan akses ke perkembangan anak dan agenda sekolah.
            </p>
            <div className="flex gap-2">
              <button onClick={()=>setKonfirmasiHapus(false)}
                style={{flex:1,background:CARD,border:`1.5px solid ${BDR}`,color:TEXT,fontFamily:IPS,minHeight:46}}
                className="rounded-2xl text-sm font-semibold">Batal</button>
              <button onClick={hapusKode}
                style={{flex:1,background:"#B91C1C",color:"#fff",fontFamily:IPS,minHeight:46}}
                className="rounded-2xl text-sm font-bold">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{position:"absolute",left:16,right:16,bottom:16,zIndex:75,background:"#2E3E35",borderRadius:16,padding:"12px 16px",display:"flex",alignItems:"center",gap:9,boxShadow:"0 10px 28px rgba(0,0,0,0.28)"}}>
          <CheckCircle size={15} style={{color:"#8BB098",flexShrink:0}}/>
          <p className="text-xs font-semibold" style={{color:"#fff",fontFamily:IPS}}>{toast}</p>
        </div>
      )}
    </div>
  );
}

/* ── Panel ekspor, dipakai ulang di layar Laporan ──────────────────── */
export function ExportPanel({list,adaSeleksi,namaSekolah,onDone,judul}:{
  list:Student[]; adaSeleksi:boolean; namaSekolah:string;
  onDone:(t:string)=>void; judul?:string;
}) {
  return (
    <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-4">
      <p className="font-bold text-sm mb-1" style={{fontFamily:PJS,color:TEXT}}>{judul ?? "Ekspor Data"}</p>
      <p className="text-xs mb-3 leading-relaxed" style={{color:MUTED}}>
        {adaSeleksi
          ? <>Mengekspor <strong style={{color:TEXT}}>{list.length} siswa terpilih</strong>.</>
          : <>Tidak ada yang dipilih — akan mengekspor <strong style={{color:TEXT}}>seluruh {list.length} siswa</strong>.</>}
      </p>

      <button
        onClick={()=>{ exportSpreadsheet(list,namaSekolah); onDone(`Spreadsheet ${list.length} siswa diunduh.`); }}
        disabled={!list.length}
        style={{width:"100%",background:list.length?"#15803D":"#E5E7EB",color:list.length?"#fff":"#9CA3AF",fontFamily:IPS,minHeight:48,marginBottom:8}}
        className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
        <FileSpreadsheet size={15}/>Ekspor ke Spreadsheet (.csv)
      </button>
      <p className="text-xs mb-3 leading-relaxed" style={{color:MUTED}}>
        Berisi identitas, profil ABK, hasil pemetaan, rekomendasi lomba, dan kode akses. Langsung terbuka di Excel maupun Google Sheets.
      </p>

      <button
        onClick={()=>{ exportLaporanPemetaan(list,namaSekolah); onDone(`Laporan pemetaan ${list.length} siswa diunduh.`); }}
        disabled={!list.length}
        style={{width:"100%",background:list.length?T:"#E5E7EB",color:list.length?"#fff":"#9CA3AF",fontFamily:IPS,minHeight:48}}
        className="rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
        <FileText size={15}/>Unduh Laporan Pemetaan (.doc)
      </button>
      <p className="text-xs mt-2 leading-relaxed" style={{color:MUTED}}>
        Dokumen ringkasan per anak: profil kebutuhan, hasil pemetaan bakat beserta alasannya, rekomendasi pembelajaran, rekomendasi lomba, dan kolom tanda tangan guru. Bila memilih beberapa siswa, setiap anak mendapat halaman sendiri.
      </p>
    </div>
  );
}

/* ── Pemilih siswa ringkas untuk layar Laporan ─────────────────────── */
export function StudentPicker({pilih,setPilih}:{pilih:Set<number>;setPilih:(s:Set<number>)=>void}) {
  const students = useStudents();
  const semua = students.length>0 && students.every(s=>pilih.has(s.id));
  const toggle = (id:number) => {
    const n = new Set(pilih); n.has(id) ? n.delete(id) : n.add(id); setPilih(n);
  };
  return (
    <div style={{background:CARD,border:`1px solid ${BDR}`}} className="rounded-2xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold" style={{color:TEXT,fontFamily:PJS}}>Pilih siswa</p>
        <button onClick={()=>setPilih(semua ? new Set() : new Set(students.map(s=>s.id)))}
          className="text-xs font-bold flex items-center gap-1" style={{color:T}}>
          {semua ? <Square size={12}/> : <CheckSquare size={12}/>}
          {semua ? "Batal pilih semua" : "Pilih semua"}
        </button>
      </div>
      <div className="space-y-1.5" style={{maxHeight:214,overflowY:"auto"}}>
        {students.map(s=>{
          const on = pilih.has(s.id);
          return (
            <button key={s.id} onClick={()=>toggle(s.id)}
              style={{background:on?SEC:BG,border:`1px solid ${on?T:BDR}`,width:"100%",textAlign:"left",minHeight:46}}
              className="rounded-xl px-2.5 py-2 flex items-center gap-2.5">
              {on ? <CheckSquare size={16} style={{color:T,flexShrink:0}}/> : <Square size={16} style={{color:"#C4CBC6",flexShrink:0}}/>}
              <span style={{fontSize:16,flexShrink:0}}>{s.emoji}</span>
              <span className="text-xs font-semibold flex-1 min-w-0 truncate" style={{color:TEXT}}>{s.name}</span>
              <span className="text-xs flex-shrink-0" style={{color:MUTED}}>{s.kelas}</span>
              {!s.hasObs && <span className="text-xs flex-shrink-0" style={{color:"#92400E"}}>belum asesmen</span>}
            </button>
          );
        })}
      </div>
      <p className="text-xs mt-2" style={{color:MUTED}}>{pilih.size} dari {students.length} siswa dipilih</p>
    </div>
  );
}
