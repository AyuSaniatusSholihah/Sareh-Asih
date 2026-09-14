import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Info } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, IPS } from "./ui-kit";

/* Web Speech API belum ada di lib.dom standar, jadi dideklarasikan seperlunya. */
type SR = {
  lang:string; continuous:boolean; interimResults:boolean;
  start:()=>void; stop:()=>void;
  onresult:((e:any)=>void)|null;
  onerror:((e:any)=>void)|null;
  onend:(()=>void)|null;
};

function getRecognizer(): SR | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r: SR = new Ctor();
  r.lang = "id-ID";
  r.continuous = true;
  r.interimResults = true;
  return r;
}

/**
 * Textarea dengan dikte suara Bahasa Indonesia.
 * Guru bisa mengetik biasa atau menekan tombol mikrofon dan berbicara —
 * hasilnya ditambahkan ke akhir teks yang sudah ada.
 */
export function VoiceTextarea({
  value, onChange, placeholder, rows = 4, label, hint,
}:{
  value:string;
  onChange:(v:string)=>void;
  placeholder?:string;
  rows?:number;
  label?:string;
  hint?:string;
}) {
  const [listening,setListening] = useState(false);
  const [interim,setInterim]     = useState("");
  const [err,setErr]             = useState("");
  const recRef  = useRef<SR|null>(null);
  const baseRef = useRef("");
  const valRef  = useRef(value);
  valRef.current = value;

  const supported = typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  useEffect(()=>()=>{ recRef.current?.stop(); }, []);

  const stop = () => {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
    setInterim("");
  };

  const start = () => {
    const rec = getRecognizer();
    if (!rec) { setErr("Peramban ini belum mendukung dikte suara. Silakan ketik manual."); return; }
    setErr("");
    baseRef.current = valRef.current ? valRef.current.trimEnd() + " " : "";
    recRef.current = rec;

    rec.onresult = (e:any) => {
      let finalText = "";
      let sedangDiucapkan = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t;
        else sedangDiucapkan += t;
      }
      if (finalText) {
        baseRef.current = (baseRef.current + finalText).replace(/\s+/g," ") + " ";
        onChange(baseRef.current.trimStart());
      }
      setInterim(sedangDiucapkan);
    };
    rec.onerror = (e:any) => {
      setErr(e?.error === "not-allowed"
        ? "Izin mikrofon ditolak. Aktifkan izin mikrofon untuk memakai dikte suara."
        : "Dikte suara terhenti. Coba lagi atau ketik manual.");
      stop();
    };
    rec.onend = () => { setListening(false); setInterim(""); };

    rec.start();
    setListening(true);
  };

  return (
    <div>
      <style>{`@keyframes vt-pulse{0%,100%{box-shadow:0 0 0 0 rgba(210,125,107,0.45)}70%{box-shadow:0 0 0 10px rgba(210,125,107,0)}}`}</style>

      {label && (
        <label className="text-xs font-semibold block mb-1.5" style={{color:TEXT,fontFamily:IPS}}>{label}</label>
      )}

      <div style={{border:`1.5px solid ${listening?A:BDR}`,borderRadius:14,background:CARD,overflow:"hidden"}}>
        <textarea
          value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder} rows={rows}
          style={{width:"100%",border:"none",outline:"none",resize:"none",padding:"12px 14px",fontSize:14,lineHeight:1.65,color:TEXT,fontFamily:IPS,background:CARD}}
        />

        {listening && interim && (
          <p className="px-3.5 pb-2 text-xs italic" style={{color:MUTED,fontFamily:IPS}}>{interim}…</p>
        )}

        <div className="flex items-center gap-2 px-3 py-2" style={{borderTop:`1px solid ${BDR}`,background:BG}}>
          <button
            type="button"
            onClick={listening?stop:start}
            disabled={!supported}
            style={{
              background: listening ? A : supported ? SEC : "#E5E7EB",
              color: listening ? "#fff" : supported ? T : "#9CA3AF",
              fontFamily:IPS, minHeight:38,
              animation: listening ? "vt-pulse 1.5s infinite" : undefined,
            }}
            className="px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            {listening ? <MicOff size={14}/> : <Mic size={14}/>}
            {listening ? "Berhenti Merekam" : "Bicara untuk Menulis"}
          </button>

          {listening ? (
            <span className="text-xs font-semibold flex items-center gap-1.5" style={{color:A,fontFamily:IPS}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:A,display:"inline-block"}}/>
              Mendengarkan…
            </span>
          ) : (
            <span className="text-xs" style={{color:MUTED,fontFamily:IPS}}>
              {value.trim() ? `${value.trim().split(/\s+/).length} kata` : "atau ketik manual"}
            </span>
          )}
        </div>
      </div>

      {(hint || err || !supported) && (
        <div className="flex items-start gap-1.5 mt-1.5">
          <Info size={11} style={{color:err||!supported?"#B45309":MUTED,flexShrink:0,marginTop:2}}/>
          <p className="text-xs leading-relaxed" style={{color:err||!supported?"#B45309":MUTED,fontFamily:IPS}}>
            {err || (!supported ? "Dikte suara tidak tersedia di peramban ini — silakan ketik manual." : hint)}
          </p>
        </div>
      )}
    </div>
  );
}
