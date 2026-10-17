import React, { useMemo } from "react";
import {
  Clock, CheckCircle, Home, ChevronRight, User,
} from "lucide-react";
import {
  A, T, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, TBar, PBtn, BG,
} from "../ui-kit";
import { useStudents, fotoSiswa } from "../data";

export function AsesmenPendingScreen({
  onBack,
  onStartObs,
}: {
  onBack: () => void;
  onStartObs: (id: number) => void;
}) {
  const students = useStudents();
  const pending = useMemo(() => students.filter(s => !s.hasObs), [students]);
  const completedCount = useMemo(() => students.filter(s => s.hasObs).length, [students]);

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
            background: "#D27D6B",
            borderRadius: 20, padding: "13px 15px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 6px 18px rgba(210,125,107,0.30)", color: "#FFFFFF"
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

        {/* Daftar siswa */}
        {pending.length === 0 ? (
          <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 22, padding: 28, textAlign: "center" }}>
            <div style={{ width: 54, height: 54, background: SEC, borderRadius: 16, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={26} style={{ color: DEEP }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, fontFamily: PJS, color: TEXT, marginBottom: 6 }}>
              Semua siswa sudah diamati
            </p>
            <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>Tidak ada asesmen yang perlu diperiksa.</p>
            <div className="mt-4">
              <PBtn full label="Kembali ke Beranda" icon={<Home size={15} />} onClick={onBack} size="sm" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: 0 }}>Daftar Siswa</p>
              <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: DMM }}>{pending.length} belum · {completedCount} selesai</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pending.map(s => (
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
                  {/* Avatar foto profil siswa */}
                  {fotoSiswa(s) ? (
                    <img
                      src={fotoSiswa(s)}
                      alt={`Foto profil ${s.name}`}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: `1.5px solid ${s.gender === "L" ? "rgba(45,84,62,0.22)" : "rgba(210,110,91,0.28)"}`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: s.gender === "L" ? "#EBF4EE" : "#FBF1EF",
                        border: `1.5px solid ${s.gender === "L" ? "rgba(45,84,62,0.22)" : "rgba(210,110,91,0.28)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <User size={20} style={{ color: s.gender === "L" ? "#3D7A5E" : "#C0603A" }} />
                    </div>
                  )}

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
                          color: "#D27D6B",
                          fontFamily: PJS,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 8,
                          border: "1px solid rgba(210,125,107,0.25)",
                        }}
                      >
                        {s.abk}
                      </span>
                    </div>
                    <p style={{ color: MUTED, fontFamily: IPS, fontSize: 11.5, margin: 0 }}>
                      {s.kelas} · {s.age} thn · {s.teacher}
                    </p>
                  </div>

                  {/* Tombol Mulai Asesmen serasi menu bakat */}
                  <button
                    type="button"
                    onClick={() => onStartObs(s.id)}
                    style={{
                      background: "#D27D6B",
                      border: "none",
                      borderRadius: 16,
                      padding: "9px 13px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      flexShrink: 0,
                      boxShadow: "0 3px 10px rgba(210,125,107,0.30)",
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
        )}
      </div>
    </div>
  );
}
