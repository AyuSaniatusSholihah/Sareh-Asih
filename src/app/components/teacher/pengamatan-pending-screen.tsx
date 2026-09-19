import React from "react";
import { Clock, CheckCircle, Home, ChevronRight } from "lucide-react";
import {
  A, T, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, TBar, PBtn, BG,
} from "../ui-kit";
import { useStudents } from "../data";

export function PengamatanPendingScreen({
  onBack,
  onStartObs,
}: {
  onBack: () => void;
  onStartObs: (id: number) => void;
}) {
  const students = useStudents();
  const pending = students.filter(s => !s.hasObs);

  const byKelas = Object.entries(
    pending.reduce((acc, s) => {
      (acc[s.kelas] ||= []).push(s);
      return acc;
    }, {} as Record<string, typeof pending>)
  );

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

        {/* Daftar siswa */}
        {pending.length === 0 ? (
          <div style={{ background: CARD, border: `1.5px dashed ${BDR}`, borderRadius: 22, padding: 28, textAlign: "center" }}>
            <div style={{ width: 54, height: 54, background: SEC, borderRadius: 16, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={26} style={{ color: DEEP }} />
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, fontFamily: PJS, color: TEXT, marginBottom: 6 }}>Semua siswa sudah diamati</p>
            <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>Tidak ada asesmen yang perlu diperiksa. Tambahkan siswa baru atau tinjau kembali profil siswa.</p>
            <div className="mt-4">
              <PBtn full label="Kembali ke Beranda" icon={<Home size={15} />} onClick={onBack} size="sm" />
            </div>
          </div>
        ) : (
          byKelas.map(([kelas, siswaList]) => {
            const sudah = students.filter(s => s.kelas === kelas && s.hasObs).length;
            return (
              <div key={kelas}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT }}>{kelas}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, fontFamily: DMM }}>{siswaList.length} belum · {sudah} sudah diamati</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {siswaList.map(s => (
                    <div key={s.id} style={{ background: CARD, border: `1.5px solid ${BDR}`, borderRadius: 18, padding: 12, boxShadow: "0 2px 10px rgba(91,122,104,0.07)", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 26, flexShrink: 0 }}>{s.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontWeight: 700, fontSize: 13.5, color: TEXT, fontFamily: PJS, lineHeight: 1.1 }}>{s.name}</p>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          <span style={{ fontSize: 10, fontWeight: 700, color: A, background: "rgba(210,125,107,0.12)", border: "1px solid rgba(210,125,107,0.35)", padding: "2px 7px", borderRadius: 8 }}>Belum diamati</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: T, background: SEC, border: `1px solid ${BDR}`, padding: "2px 7px", borderRadius: 8 }}>{s.abk}</span>
                        </div>
                      </div>
                      <button onClick={() => onStartObs(s.id)}
                        style={{
                          flexShrink: 0, background: DEEP, color: "#FFFFFF", border: "none", borderRadius: 12,
                          padding: "10px 12px", fontFamily: PJS, fontSize: 11, fontWeight: 800, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4, boxShadow: "0 4px 12px rgba(91,122,104,0.3)"
                        }}
                        className="active:scale-95 transition-transform">
                        Mulai <ChevronRight size={13} strokeWidth={2.5} />
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
