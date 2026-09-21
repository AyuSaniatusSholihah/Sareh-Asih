import React, { useState, useMemo } from "react";
import {
  Clock, CheckCircle, Home, ChevronRight, School, ChevronDown, User,
} from "lucide-react";
import {
  A, T, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, TBar, PBtn, BG,
} from "../ui-kit";
import { useStudents } from "../data";

export function AsesmenPendingScreen({
  onBack,
  onStartObs,
}: {
  onBack: () => void;
  onStartObs: (id: number) => void;
}) {
  const students = useStudents();
  const [selectedClass, setSelectedClass] = useState<string>("Semua");

  const pending = useMemo(() => students.filter(s => !s.hasObs), [students]);

  const classes = useMemo(() => {
    return Array.from(new Set(students.map(s => s.kelas))).sort();
  }, [students]);

  const filteredPending = useMemo(() => {
    return pending.filter(s => selectedClass === "Semua" || s.kelas === selectedClass);
  }, [pending, selectedClass]);

  const byKelas = useMemo(() => {
    return Object.entries(
      filteredPending.reduce((acc, s) => {
        (acc[s.kelas] ||= []).push(s);
        return acc;
      }, {} as Record<string, typeof pending>)
    );
  }, [filteredPending]);

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS, background: BG }}>
      <TBar
        title="Asesmen Perlu Diperiksa"
        sub={`${pending.length} siswa belum dinilai`}
        onBack={onBack}
      />

      <div style={{ padding: "14px 16px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Banner notifikasi */}
        {pending.length > 0 && (
          <div style={{
            background: `linear-gradient(135deg, ${A} 0%, #C46F5F 100%)`,
            borderRadius: 20, padding: "13px 15px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 8px 24px rgba(210,125,107,0.35)", color: "#FFFFFF"
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Clock size={19} style={{ color: "#FFFFFF" }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", fontFamily: PJS, lineHeight: 1.2 }}>{pending.length} asesmen perlu diperiksa</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.88)", marginTop: 2, lineHeight: 1.3 }}>Daftar siswa yang belum dilengkapi asesmen</p>
            </div>
          </div>
        )}

        {/* ── Filter Per Kelas (Dropdown & Chips serasi Menu Bakat) ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Dropdown Kelas */}
          <div className="relative flex-shrink-0">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                background: "#FFFFFF",
                border: `1px solid ${BDR}`,
                borderRadius: 16,
                padding: "8px 30px 8px 34px",
                fontFamily: PJS,
                fontWeight: 700,
                fontSize: 12,
                color: TEXT,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(91,122,104,0.05)",
              }}
            >
              <option value="Semua">Semua Kelas ({pending.length})</option>
              {classes.map(k => {
                const countK = pending.filter(s => s.kelas === k).length;
                return (
                  <option key={k} value={k}>
                    {k.startsWith("Kelas") ? k : `Kelas ${k}`} ({countK})
                  </option>
                );
              })}
            </select>
            <School
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: DEEP,
                pointerEvents: "none",
              }}
            />
            <ChevronDown
              size={14}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: MUTED,
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Chips Kelas Cepat */}
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedClass("Semua")}
              style={{
                background: selectedClass === "Semua" ? DEEP : "#FFFFFF",
                color: selectedClass === "Semua" ? "#FFFFFF" : TEXT,
                border: selectedClass === "Semua" ? "none" : `1px solid ${BDR}`,
                borderRadius: 14,
                padding: "6px 12px",
                fontFamily: PJS,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: selectedClass === "Semua" ? "0 2px 6px rgba(45,84,62,0.22)" : "none",
                transition: "all 0.15s ease",
              }}
              className="active:scale-95"
            >
              Semua ({pending.length})
            </button>

            {classes.map(k => {
              const isSel = selectedClass === k;
              const countK = pending.filter(s => s.kelas === k).length;
              return (
                <button
                  key={k}
                  onClick={() => setSelectedClass(k)}
                  style={{
                    background: isSel ? DEEP : "#FFFFFF",
                    color: isSel ? "#FFFFFF" : TEXT,
                    border: isSel ? "none" : `1px solid ${BDR}`,
                    borderRadius: 14,
                    padding: "6px 12px",
                    fontFamily: PJS,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: isSel ? "0 2px 6px rgba(45,84,62,0.22)" : "none",
                    transition: "all 0.15s ease",
                  }}
                  className="active:scale-95"
                >
                  {k} ({countK})
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar siswa */}
        {filteredPending.length === 0 ? (
          <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 22, padding: 28, textAlign: "center" }}>
            <div style={{ width: 54, height: 54, background: SEC, borderRadius: 16, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={26} style={{ color: DEEP }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, fontFamily: PJS, color: TEXT, marginBottom: 6 }}>
              {selectedClass === "Semua" ? "Semua siswa sudah diamati" : `Semua siswa di ${selectedClass} sudah diamati`}
            </p>
            <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>Tidak ada asesmen yang perlu diperiksa untuk filter ini.</p>
            <div className="mt-4">
              <PBtn full label="Kembali ke Beranda" icon={<Home size={15} />} onClick={onBack} size="sm" />
            </div>
          </div>
        ) : (
          byKelas.map(([kelas, siswaList]) => {
            const sudah = students.filter(s => s.kelas === kelas && s.hasObs).length;
            return (
              <div key={kelas} className="space-y-2">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: 0 }}>{kelas}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: DMM }}>{siswaList.length} belum · {sudah} terpetakan</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {siswaList.map(s => (
                    <div
                      key={s.id}
                      style={{
                        background: CARD,
                        border: `1.5px solid ${BDR}`,
                        borderRadius: 20,
                        padding: "12px 14px",
                        boxShadow: "0 2px 10px rgba(91,122,104,0.06)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      {/* Avatar icon person serasi menu bakat */}
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          background: "#FBF1EF",
                          border: "1.5px solid rgba(210,110,91,0.28)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <User size={20} style={{ color: A }} />
                      </div>

                      {/* Detail Siswa */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <p
                            style={{
                              color: TEXT,
                              fontFamily: PJS,
                              fontSize: 14.5,
                              fontWeight: 800,
                              margin: 0,
                            }}
                            className="truncate"
                          >
                            {s.name}
                          </p>
                          <span
                            style={{
                              background: "#FFF1EE",
                              color: A,
                              fontFamily: PJS,
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: 8,
                              border: "1px solid rgba(210,110,91,0.25)",
                            }}
                          >
                            {s.abk}
                          </span>
                        </div>
                        <p style={{ color: MUTED, fontFamily: IPS, fontSize: 11.5, margin: 0 }}>
                          {s.kelas} · {s.age} thn · {s.teacher}
                        </p>
                      </div>

                      {/* Tombol Mulai Asesmen serasi menu bakat (tanpa tombol play) */}
                      <button
                        type="button"
                        onClick={() => onStartObs(s.id)}
                        style={{
                          background: `linear-gradient(135deg, ${A} 0%, #C45F4B 100%)`,
                          border: "none",
                          borderRadius: 16,
                          padding: "9px 13px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          flexShrink: 0,
                          boxShadow: "0 3px 12px rgba(210, 110, 91, 0.32)",
                          transition: "all 0.15s ease",
                        }}
                        className="active:scale-95 hover:brightness-105"
                      >
                        <span style={{ fontSize: 11.5, fontWeight: 800, color: "#FFFFFF", fontFamily: PJS, whiteSpace: "nowrap" }}>
                          Mulai asesmen
                        </span>
                        <ChevronRight size={13} style={{ color: "#FFFFFF", flexShrink: 0 }} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
