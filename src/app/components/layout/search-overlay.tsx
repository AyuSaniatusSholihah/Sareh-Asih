import { useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { CARD, SEC, BDR, TEXT, MUTED, DEEP, PJS, IPS } from "../ui-kit";
import { useStudents } from "../data";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const students = useStudents();
  const [q, setQ] = useState("");
  const results = q.length > 1
    ? students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.abk.toLowerCase().includes(q.toLowerCase()))
    : [];

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.55)", zIndex: 80, display: "flex", flexDirection: "column" }} onClick={onClose}>
      <div style={{ background: CARD, borderRadius: "0 0 24px 24px", padding: "12px 16px 16px", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: SEC, borderRadius: 16, padding: "10px 14px" }}>
          <Search size={16} style={{ color: MUTED, flexShrink: 0 }} />
          <input
            autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Cari siswa, fitur, atau artikel..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: TEXT, fontFamily: IPS }}
          />
          {q && <button onClick={() => setQ("")}><X size={14} style={{ color: MUTED }} /></button>}
        </div>
        {results.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {results.map(s => (
              <div key={s.id} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: `1px solid ${BDR}`, cursor: "pointer" }}>
                <span style={{ fontSize: 22 }}>{s.emoji}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: PJS }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>{s.kelas} · {s.abk}</p>
                </div>
                <ChevronRight size={14} style={{ color: MUTED, marginLeft: "auto" }} />
              </div>
            ))}
          </div>
        )}
        {q.length > 1 && results.length === 0 && (
          <p style={{ fontSize: 13, color: MUTED, fontFamily: IPS, textAlign: "center", marginTop: 12 }}>Tidak ada hasil untuk "{q}"</p>
        )}
        {q.length === 0 && (
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Rafi Pratama", "Asesmen", "Talent Map", "Lomba FLS2N", "Laporan"].map(t => (
              <span key={t} onClick={() => setQ(t)} style={{ fontSize: 11, fontFamily: IPS, background: SEC, color: DEEP, padding: "5px 10px", borderRadius: 20, cursor: "pointer", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
