import { useState } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { CARD, SEC, BDR, TEXT, MUTED, DEEP, PJS, IPS } from "../ui-kit";
import { useStudents, type Screen } from "../data";

export function SearchOverlay({
  onClose,
  onSelect,
  onGo,
}: {
  onClose: () => void;
  onSelect?: (id: number) => void;
  onGo?: (screen: Screen) => void;
}) {
  const students = useStudents();
  const [q, setQ] = useState("");
  const results = q.length > 0
    ? students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.abk.toLowerCase().includes(q.toLowerCase()) || s.kelas.toLowerCase().includes(q.toLowerCase()))
    : [];

  const handleTagClick = (tag: string) => {
    if (tag === "Asesmen" || tag === "Talent Map") {
      onGo ? onGo("talent-map") : onClose();
    } else if (tag === "Laporan") {
      onGo ? onGo("report") : onClose();
    } else if (tag === "FLS3N PDBK" || tag === "O2SN" || tag === "LKSN") {
      onGo ? onGo("competition") : onClose();
    } else {
      const found = students.find(s => s.name.toLowerCase().includes(tag.toLowerCase()));
      if (found && onSelect) {
        onSelect(found.id);
      } else {
        setQ(tag);
      }
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.55)", zIndex: 85, display: "flex", flexDirection: "column" }} onClick={onClose}>
      <div style={{ background: CARD, borderRadius: "0 0 24px 24px", padding: "14px 16px 20px", flexShrink: 0, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: SEC, borderRadius: 16, padding: "10px 14px" }}>
          <Search size={17} style={{ color: DEEP, flexShrink: 0 }} />
          <input
            autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Cari siswa, kelas, atau fitur..."
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13.5, color: TEXT, fontFamily: IPS }}
          />
          {q ? (
            <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
              <X size={16} style={{ color: MUTED }} />
            </button>
          ) : (
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
              <X size={16} style={{ color: MUTED }} />
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, fontFamily: PJS, color: MUTED, textTransform: "uppercase", margin: "2px 0" }}>Hasil Pencarian Siswa</p>
            {results.map(s => (
              <div
                key={s.id}
                onClick={() => {
                  if (onSelect) onSelect(s.id);
                  else onClose();
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 8px",
                  borderRadius: 12, cursor: "pointer", transition: "background 0.15s",
                }}
                className="hover:bg-[#EBF3ED]"
              >
                <span style={{ fontSize: 20 }}>{s.emoji || "👤"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: PJS, margin: 0 }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: MUTED, fontFamily: IPS, margin: "2px 0 0" }}>{s.kelas} · {s.abk}</p>
                </div>
                <ChevronRight size={15} style={{ color: MUTED }} />
              </div>
            ))}
          </div>
        )}

        {q.length > 0 && results.length === 0 && (
          <p style={{ fontSize: 13, color: MUTED, fontFamily: IPS, textAlign: "center", marginTop: 16 }}>
            Tidak ada siswa ditemukan untuk "{q}"
          </p>
        )}

        {q.length === 0 && (
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, fontFamily: PJS, color: MUTED, textTransform: "uppercase", margin: "0 0 8px" }}>Pencarian Cepat</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Rafi Pratama", "Asesmen", "Talent Map", "FLS3N PDBK", "O2SN", "LKSN", "Laporan"].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTagClick(t)}
                  style={{
                    fontSize: 11, fontFamily: IPS, background: SEC, color: DEEP,
                    padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                    fontWeight: 600, border: `1px solid rgba(91,122,104,0.18)`,
                  }}
                  className="active:scale-95 transition-transform"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
