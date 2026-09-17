import { createContext, useContext } from "react";
import {
  CheckCircle, Circle, Clock, XCircle, Sparkles, Trophy, Eye, Bell,
  ArrowLeft,
} from "lucide-react";

// ─── Tokens ─────────────────────────────────────────────────────────
export const T    = "#8BB098";   // Sage Green — primary
export const A    = "#D27D6B";   // Muted Terracotta — accent / CTA
export const BG   = "#EBF3ED";   // Mint White — background
export const CARD = "#FFFFFF";   // Card surface
export const TEXT = "#2E3E35";   // Dark Charcoal Green — text
export const MUTED= "#6B8070";   // Muted sage — secondary text
export const SEC  = "#D4E8DA";   // Light sage tint — secondary bg
export const BDR  = "rgba(91,122,104,0.35)"; // Prominent sage stroke
export const DEEP = "#5B7A68";   // Deep Forest — supporting components
export const TEAL = "#5B7A68";   // Deep sage — complement
export const PJS  = "'Plus Jakarta Sans', sans-serif";
export const IPS  = "'IBM Plex Sans', sans-serif";
export const DMM  = "'DM Mono', monospace";

// ─── Global UI Context (font size, TTS, search, settings) ────────────
export interface UICtx {
  fontSize: number;
  setFontSize: (n:number)=>void;
  tts: boolean;
  setTts: (v:boolean)=>void;
  openSearch: ()=>void;
  openSettings: ()=>void;
}
export const UI = createContext<UICtx>({
  fontSize:1, setFontSize:()=>{},
  tts:false,  setTts:()=>{},
  openSearch:()=>{}, openSettings:()=>{},
});
export const useUI = () => useContext(UI);

// ─── Atoms ───────────────────────────────────────────────────────────
export function Chip({ label, color }: { label:string; color:"purple"|"blue"|"orange"|"pink"|"gray" }) {
  const m={
    purple:{bg:"rgba(91,122,104,0.14)",tx:DEEP,bdr:"rgba(91,122,104,0.3)"},
    blue:{bg:"#D4E8DA",tx:DEEP,bdr:"rgba(91,122,104,0.35)"},
    orange:{bg:"rgba(210,125,107,0.14)",tx:A,bdr:"rgba(210,125,107,0.35)"},
    pink:{bg:"rgba(210,125,107,0.18)",tx:A,bdr:"rgba(210,125,107,0.4)"},
    gray:{bg:"#EBF3ED",tx:TEXT,bdr:"rgba(91,122,104,0.22)"}
  };
  const c=m[color]??m.gray;
  return <span style={{background:c.bg,color:c.tx,border:`1px solid ${c.bdr}`,fontFamily:PJS}} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold">{label}</span>;
}

export type StatusType = "Berjalan"|"Tercapai"|"Tidak Tercapai"|"Direkomendasikan"|"Didaftarkan"|"Selesai"|"Sudah Dibaca"|"Belum Dibaca";

export function SBadge({ s }: { s:StatusType }) {
  const m:Record<StatusType,{bg:string;tx:string;bdr:string;I:typeof CheckCircle}> = {
    "Berjalan":        {bg:"#D4E8DA",tx:DEEP,bdr:"rgba(91,122,104,0.35)",I:Clock},
    "Tercapai":        {bg:"#D4E8DA",tx:"#2E3E35",bdr:"#8BB098",I:CheckCircle},
    "Tidak Tercapai":  {bg:"rgba(210,125,107,0.15)",tx:A,bdr:"rgba(210,125,107,0.35)",I:XCircle},
    "Direkomendasikan":{bg:"rgba(210,125,107,0.15)",tx:A,bdr:"rgba(210,125,107,0.35)",I:Sparkles},
    "Didaftarkan":     {bg:"#D4E8DA",tx:"#2E3E35",bdr:"#8BB098",I:CheckCircle},
    "Selesai":         {bg:"#D4E8DA",tx:DEEP,bdr:"rgba(91,122,104,0.35)",I:Trophy},
    "Sudah Dibaca":    {bg:"#D4E8DA",tx:"#2E3E35",bdr:"#8BB098",I:Eye},
    "Belum Dibaca":    {bg:"rgba(210,125,107,0.15)",tx:A,bdr:"rgba(210,125,107,0.35)",I:Bell},
  };
  const {bg,tx,bdr,I}=m[s]??{bg:SEC,tx:DEEP,bdr:BDR,I:Circle};
  return <span style={{background:bg,color:tx,border:`1px solid ${bdr}`,fontFamily:PJS}} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"><I size={11} strokeWidth={2.2}/>{s}</span>;
}

export type PrimaryBtnVariant = "solid" | "light" | "outline";
export type SecondaryBtnVariant = "sage" | "deep" | "light" | "outline";

export function PBtn({
  label,
  icon,
  onClick,
  full,
  disabled,
  variant = "solid",
  size = "md",
  className = "",
  style = {},
}: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
  variant?: PrimaryBtnVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}) {
  const minH = size === "sm" ? 40 : size === "lg" ? 54 : 48;
  const fSize = size === "sm" ? 13 : size === "lg" ? 15 : 14;
  const pad = size === "sm" ? "8px 16px" : size === "lg" ? "14px 24px" : "12px 20px";

  let bg = A;
  let color = "#FFFFFF";
  let border = "none";
  let shadow = "0 6px 20px rgba(210,125,107,0.45)";

  if (disabled) {
    bg = "#CBD5E1";
    color = "#94A3B8";
    shadow = "none";
  } else if (variant === "light") {
    bg = "rgba(210,125,107,0.16)";
    color = A;
    border = "1.5px solid rgba(210,125,107,0.35)";
    shadow = "none";
  } else if (variant === "outline") {
    bg = "transparent";
    color = A;
    border = `2.5px solid ${A}`;
    shadow = "none";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        color,
        border,
        boxShadow: shadow,
        fontFamily: PJS,
        fontWeight: 800,
        fontSize: fSize,
        minHeight: minH,
        padding: pad,
        borderRadius: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function SBtn({
  label,
  icon,
  onClick,
  full,
  disabled,
  variant = "sage",
  size = "md",
  className = "",
  style = {},
}: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
  disabled?: boolean;
  variant?: SecondaryBtnVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}) {
  const minH = size === "sm" ? 40 : size === "lg" ? 54 : 48;
  const fSize = size === "sm" ? 13 : size === "lg" ? 15 : 14;
  const pad = size === "sm" ? "8px 16px" : size === "lg" ? "14px 24px" : "12px 20px";

  let bg = T;
  let color = "#FFFFFF";
  let border = "none";
  let shadow = "0 6px 18px rgba(139,176,152,0.38)";

  if (disabled) {
    bg = "#D1D5DB";
    color = "#9CA3AF";
    shadow = "none";
  } else if (variant === "deep") {
    bg = DEEP;
    color = "#FFFFFF";
    shadow = "0 6px 18px rgba(91,122,104,0.38)";
  } else if (variant === "light") {
    bg = SEC;
    color = TEXT;
    border = `1.5px solid rgba(91,122,104,0.22)`;
    shadow = "0 2px 8px rgba(91,122,104,0.08)";
  } else if (variant === "outline") {
    bg = "transparent";
    color = DEEP;
    border = `2px solid ${DEEP}`;
    shadow = "none";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        color,
        border,
        boxShadow: shadow,
        fontFamily: PJS,
        fontWeight: 700,
        fontSize: fSize,
        minHeight: minH,
        padding: pad,
        borderRadius: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      className={`${full ? "w-full" : ""} inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─── Top nav bar inside phone ─────────────────────────────────────────
export function TBar({title,sub,onBack,right}:{title:string;sub?:string;onBack?:()=>void;right?:React.ReactNode}) {
  return (
    <div style={{background:CARD,borderBottom:`1px solid ${BDR}`,flexShrink:0}}>
      <div className="flex items-center gap-2 px-4 py-2.5">
        {onBack && (
          <button onClick={onBack} style={{minWidth:44,minHeight:44}} className="flex items-center justify-center rounded-2xl hover:bg-[#D4E8DA] transition-colors">
            <ArrowLeft size={20} style={{color:TEXT}}/>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-tight truncate" style={{fontFamily:PJS,fontSize:17,color:TEXT}}>{title}</p>
          {sub && <p className="text-xs truncate" style={{color:MUTED,fontFamily:IPS}}>{sub}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}

// ─── Form fields ──────────────────────────────────────────────────────
export function Field({label,placeholder,value,onChange,type="text",required,hint}:{label:string;placeholder:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean;hint?:string}) {
  const empty = required && value.trim()==="";
  return (
    <div>
      <label className="text-xs font-semibold block mb-1" style={{color:TEXT,fontFamily:IPS}}>
        {label}{required&&<span style={{color:"#B91C1C"}}> *</span>}
      </label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",border:`1.5px solid ${empty?"#F87171":BDR}`,borderRadius:12,padding:"10px 12px",fontSize:14,color:TEXT,fontFamily:IPS,background:BG,outline:"none",minHeight:44}}/>
      {hint && <p className="text-xs mt-1" style={{color:MUTED,fontFamily:IPS}}>{hint}</p>}
    </div>
  );
}

export function SelectField({label,options,value,onChange,required}:{label:string;options:string[];value:string;onChange:(v:string)=>void;required?:boolean}) {
  const empty = required && value==="";
  return (
    <div>
      <label className="text-xs font-semibold block mb-1" style={{color:TEXT,fontFamily:IPS}}>
        {label}{required&&<span style={{color:"#B91C1C"}}> *</span>}
      </label>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{width:"100%",border:`1.5px solid ${empty?"#F87171":BDR}`,borderRadius:12,padding:"10px 12px",fontSize:14,color:value?TEXT:MUTED,fontFamily:IPS,background:CARD,outline:"none",minHeight:44}}>
        <option value="">-- Pilih --</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/** Multi-select chip group — dipakai untuk "mengajar kelas" & "jenis ABK". */
export function MultiChipField({label,options,values,onToggle,required,hint}:{label:string;options:string[];values:string[];onToggle:(v:string)=>void;required?:boolean;hint?:string}) {
  const empty = required && values.length===0;
  return (
    <div>
      <label className="text-xs font-semibold block mb-1.5" style={{color:TEXT,fontFamily:IPS}}>
        {label}{required&&<span style={{color:"#B91C1C"}}> *</span>}
        {values.length>0 && <span style={{color:MUTED,fontWeight:400}}> · {values.length} dipilih</span>}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o=>{
          const on = values.includes(o);
          return (
            <button key={o} type="button" onClick={()=>onToggle(o)}
              style={{
                background:on?SEC:CARD,
                border:`1.5px solid ${on?T:(empty?"#F87171":BDR)}`,
                color:on?DEEP:MUTED, fontFamily:IPS, minHeight:38,
              }}
              className="px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all">
              {on ? <CheckCircle size={13} style={{color:T}}/> : <Circle size={13} style={{color:"#D1D5DB"}}/>}
              {o}
            </button>
          );
        })}
      </div>
      {hint && <p className="text-xs mt-1.5" style={{color:MUTED,fontFamily:IPS}}>{hint}</p>}
    </div>
  );
}
