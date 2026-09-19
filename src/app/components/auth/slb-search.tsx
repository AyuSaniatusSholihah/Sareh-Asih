import { useState, useEffect, useRef } from "react";
import { School, Search, XCircle, CheckCircle, Building2, MapPin, ChevronRight } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, IPS } from "../ui-kit";
import { cariSLB, DATABASE_SLB_INDONESIA } from "../data-slb";

export function SLBSearchInput({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Deteksi sekolah terpilih di database
  const selectedMatch = DATABASE_SLB_INDONESIA.find(
    s => s.nama.toLowerCase() === value.trim().toLowerCase()
  );

  // Cari SLB sesuai input pencarian
  const results = cariSLB(value, 12);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold block" style={{ color: TEXT, fontFamily: IPS }}>
          <School size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
          Nama Sekolah (SLB) {required && <span style={{ color: A }}>*</span>}
        </label>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: "#E4F0E9", color: "#166534", fontFamily: IPS, border: "1px solid #BBF7D0" }}>
          <span>🇮🇩</span> Database SLB Nasional
        </span>
      </div>

      <div className="relative">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setShowDropdown(false);
            }
          }}
          placeholder="Ketik nama SLB, kota, atau provinsi..."
          style={{
            width: "100%",
            border: `1.5px solid ${isFocused ? T : BDR}`,
            borderRadius: 12,
            padding: "10px 34px 10px 36px",
            fontSize: 13,
            color: TEXT,
            fontFamily: IPS,
            background: CARD,
            outline: "none",
            minHeight: 44,
            transition: "all 0.18s",
          }}
        />
        <Search
          size={16}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: isFocused ? T : MUTED,
            pointerEvents: "none",
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setShowDropdown(true);
            }}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              color: MUTED,
            }}>
              <XCircle size={15} />
          </button>
        )}
      </div>

      {/* Info status sekolah terdaftar di database */}
      {selectedMatch && !showDropdown && (
        <div
          className="mt-1.5 px-3 py-1.5 rounded-xl flex items-center gap-2"
          style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <CheckCircle size={13} style={{ color: "#16A34A", flexShrink: 0 }} />
          <p className="text-[11px] font-medium" style={{ color: "#166534", fontFamily: IPS }}>
            Terdaftar di Database: <strong>{selectedMatch.kota}, {selectedMatch.provinsi}</strong> ({selectedMatch.status})
            {selectedMatch.npsn && ` · NPSN ${selectedMatch.npsn}`}
          </p>
        </div>
      )}

      {/* Info status sekolah input manual / kustom */}
      {value.trim() && !selectedMatch && !showDropdown && (
        <div
          className="mt-1.5 px-3 py-1.5 rounded-xl flex items-center justify-between"
          style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
          <div className="flex items-center gap-2 min-w-0">
            <Building2 size={13} style={{ color: "#D97706", flexShrink: 0 }} />
            <p className="text-[11px] font-medium text-amber-900 truncate" style={{ fontFamily: IPS }}>
              Sekolah Kustom: <strong>{value.trim()}</strong> (Input Manual)
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 flex-shrink-0"
            style={{ fontFamily: IPS }}>
            ✓ Tersimpan
          </span>
        </div>
      )}

      {/* Dropdown Hasil Pencarian Database SLB */}
      {showDropdown && (
        <div
          className="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl shadow-xl overflow-hidden no-scrollbar"
          style={{
            background: CARD,
            border: `1.5px solid ${T}`,
            maxHeight: 270,
            overflowY: "auto",
            boxShadow: "0 12px 28px -4px rgba(46,62,53,0.3)",
          }}>
          {/* Header dropdown */}
          <div className="p-2 border-b flex items-center justify-between" style={{ borderColor: BDR, background: BG }}>
            <p className="text-[11px] font-bold" style={{ color: DEEP, fontFamily: IPS }}>
              {value.trim() ? `Pencarian SLB (${results.length})` : "Pilih dari Database SLB"}
            </p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: SEC, color: DEEP }}>
              {DATABASE_SLB_INDONESIA.length} SLB Terdaftar
            </span>
          </div>

          {/* Daftar SLB dari database */}
          {results.length > 0 ? (
            <div className="divide-y" style={{ borderColor: BDR }}>
              {results.map((slb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(slb.nama);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left p-2.5 hover:bg-emerald-50/70 active:bg-emerald-100/70 transition-colors flex items-start gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: SEC, color: DEEP }}>
                    <School size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold leading-tight" style={{ color: TEXT, fontFamily: IPS }}>
                        {slb.nama}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          slb.status === "Negeri" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                        {slb.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px]" style={{ color: MUTED, fontFamily: IPS }}>
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} /> {slb.kota}, {slb.provinsi}
                      </span>
                      {slb.npsn && <span>• NPSN: {slb.npsn}</span>}
                    </div>
                  </div>
                  <ChevronRight size={13} style={{ color: MUTED, flexShrink: 0, marginTop: 6 }} />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center" style={{ background: "#FFFBEB" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  color: "#D97706",
                }}>
                <Building2 size={20} />
              </div>
              <p className="text-xs font-bold text-gray-900" style={{ fontFamily: IPS }}>
                "{value.trim()}" Belum Ada di Database
              </p>
              <p className="text-[11px] text-gray-600 mt-1 mb-3" style={{ fontFamily: IPS, lineHeight: 1.4 }}>
                Sekolah tidak terdaftar? Tetap bisa didaftarkan langsung!
              </p>
              {value.trim() && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowDropdown(false);
                  }}
                  style={{ background: T, color: "#fff", fontFamily: IPS, border: "none" }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all">
                  <CheckCircle size={14} /> Gunakan "{value.trim()}" Langsung
                </button>
              )}
            </div>
          )}

          {/* Opsi custom input di footer jika ada hasil database */}
          {value.trim() && results.length > 0 && !selectedMatch && (
            <div className="p-2 border-t text-center" style={{ borderColor: BDR, background: BG }}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowDropdown(false);
                }}
                className="text-[11px] font-semibold flex items-center justify-center gap-1 w-full py-1 hover:underline cursor-pointer"
                style={{ color: T, fontFamily: IPS }}>
                ✓ Tetap gunakan nama kustom ini: "{value.trim()}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
