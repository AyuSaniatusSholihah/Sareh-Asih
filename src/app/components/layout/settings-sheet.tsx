import { useState } from "react";
import {
  HelpCircle, Heart, Shield, LogOut, Volume2, VolumeX, ChevronRight,
} from "lucide-react";
import {
  T, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, useUI,
} from "../ui-kit";
import { type Role } from "../data";

export const INFO_PANELS = [
  {
    icon: <HelpCircle size={16} />,
    label: "Panduan Penggunaan",
    body: [
      "Tambah siswa lewat tombol oranye “Tambah Siswa” yang selalu ada di pojok kanan bawah. Cukup 3 kolom wajib: nama, kelas, dan jenis ABK.",
      "Buka Pengamatan & Asesmen dari kartu siswa. Indikator dikelompokkan per kategori — Interaksi Sosial, Komunikasi, Motorik & Sensorik, Fokus & Kognitif, Minat & Bakat.",
      "Tahap Asesmen berisi dua kategori tes: Kemandirian dan Akademik & Bakat, dinilai dengan 4 tingkat.",
      "Catatan dan laporan bisa diisi dengan suara — tekan tombol mikrofon lalu bicara, tidak perlu mengetik.",
      "Kode akses orang tua dibuat guru di tab “Kode Ortu” pada profil siswa, lalu dibagikan ke orang tua.",
    ],
  },
  {
    icon: <Heart size={16} />,
    label: "Tentang Sareh Asih",
    body: [
      "Sareh Asih adalah pendamping belajar harian untuk guru dan orang tua. Guru mencatat pengamatan sehari-hari, menilai kemampuan tiap anak, lalu hasilnya disatukan menjadi laporan sederhana yang mudah dibaca orang tua.",
      "Setiap anak tumbuh dengan caranya sendiri — AI di sini bekerja sebagai rekan guru: membantu menenggarai potensi, tetapi keputusan tetap sepenuhnya di tangan guru.",
      "Alur utamanya singkat: amati keseharian anak, nilai sesuai kemampuannya, lalu bagikan perkembangannya ke orang tua.",
      "Dibuat untuk GEMASTIK XVII kategori UX Design.",
    ],
  },
  {
    icon: <Shield size={16} />,
    label: "Kebijakan Privasi",
    body: [
      "Data siswa hanya dapat diakses guru pengampu dan orang tua yang memegang kode akses yang sah.",
      "Laporan tidak pernah terkirim otomatis — selalu ada langkah konfirmasi oleh guru sebelum orang tua bisa melihatnya.",
      "Dikte suara diproses di perangkat melalui peramban; rekaman tidak disimpan aplikasi.",
      "Guru dapat membuat ulang kode akses kapan saja, dan kode lama langsung berhenti berlaku.",
    ],
  },
];

export function SettingsSheet({
  onClose,
  onLogout,
  role,
}: {
  onClose: () => void;
  onLogout?: () => void;
  role?: Role | null;
}) {
  const { fontSize, setFontSize, tts, setTts } = useUI();
  const [info, setInfo] = useState<string | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(46,62,53,0.45)", zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: CARD, borderRadius: "24px 24px 0 0", padding: "20px 20px 32px", maxHeight: "90%", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: BDR, margin: "0 auto 18px" }} />
        <p style={{ fontSize: 16, fontWeight: 700, color: TEXT, fontFamily: PJS, marginBottom: 16 }}>Pengaturan & Bantuan</p>

        {/* Akun & Logout */}
        {role && onLogout && (
          <div style={{ marginBottom: 18, padding: "14px", background: BG, borderRadius: 16, border: `1.5px solid ${BDR}`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, fontFamily: DMM, textTransform: "uppercase" }}>Akun Aktif</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: PJS }}>
                  {role === "guru" ? "Guru SLB (Sari Dewi, S.Pd.)" : "Orang Tua Siswa"}
                </p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: SEC, color: DEEP, fontFamily: IPS, border: `1px solid ${BDR}` }}>
                {role === "guru" ? "Guru" : "Orang Tua"}
              </span>
            </div>

            {!confirmLogout ? (
              <button onClick={() => setConfirmLogout(true)}
                style={{ width: "100%", padding: "10px", borderRadius: 12, border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", fontFamily: IPS, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
                <LogOut size={16} /> Keluar Akun
              </button>
            ) : (
              <div style={{ background: CARD, padding: 12, borderRadius: 12, border: "1px solid #FCA5A5", textAlign: "center" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 10, fontFamily: IPS }}>Apakah Anda yakin ingin keluar dari akun ini?</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setConfirmLogout(false)} style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1px solid ${BDR}`, background: BG, fontSize: 12, fontWeight: 600, fontFamily: IPS, color: TEXT, cursor: "pointer" }}>
                    Batal
                  </button>
                  <button onClick={() => { onLogout(); onClose(); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: "#DC2626", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: IPS, cursor: "pointer" }}>
                    Ya, Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Slider Pengatur Ukuran Teks */}
        <div style={{ marginBottom: 18, padding: "16px", background: BG, borderRadius: 18, border: `1.5px solid ${BDR}`, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: DEEP, fontFamily: PJS, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ukuran Teks</p>
            <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: DMM, background: CARD, padding: "2px 8px", borderRadius: 8, border: `1px solid ${BDR}` }}>
              {Math.round(fontSize * 100)}%
            </span>
          </div>

          {/* Range Slider Geser Kiri Kanan */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 14px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: MUTED, fontFamily: PJS, minWidth: 16, textAlign: "center" }}>A</span>
            <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
              <input
                type="range"
                min="0.85"
                max="1.35"
                step="0.05"
                value={fontSize}
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 4,
                  accentColor: T,
                  cursor: "pointer",
                  outline: "none",
                  WebkitAppearance: "none",
                  background: `linear-gradient(to right, ${T} 0%, ${T} ${((fontSize - 0.85) / (1.35 - 0.85)) * 100}%, #D4E8DA ${((fontSize - 0.85) / (1.35 - 0.85)) * 100}%, #D4E8DA 100%)`
                }}
              />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: DEEP, fontFamily: PJS, minWidth: 20, textAlign: "center" }}>A</span>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: "flex", gap: 6 }}>
            {([
              { v: 0.85, l: "Kecil" },
              { v: 1.0, l: "Normal" },
              { v: 1.15, l: "Besar" },
              { v: 1.30, l: "Sangat Besar" }
            ]).map(sz => (
              <button
                key={sz.v}
                onClick={() => setFontSize(sz.v)}
                style={{
                  flex: 1,
                  padding: "7px 0",
                  borderRadius: 12,
                  border: `1.5px solid ${Math.abs(fontSize - sz.v) < 0.03 ? T : BDR}`,
                  background: Math.abs(fontSize - sz.v) < 0.03 ? SEC : CARD,
                  color: Math.abs(fontSize - sz.v) < 0.03 ? DEEP : MUTED,
                  fontFamily: IPS,
                  fontSize: 11.5,
                  fontWeight: 700,
                  transition: "all 0.15s",
                  cursor: "pointer"
                }}
              >
                {sz.l}
              </button>
            ))}
          </div>

          {/* Live Preview Box */}
          <div style={{ marginTop: 12, padding: "10px 12px", background: CARD, borderRadius: 12, border: `1.5px solid ${BDR}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, fontFamily: DMM, textTransform: "uppercase", marginBottom: 3 }}>Pratinjau Teks</p>
            <p style={{ fontSize: `${13 * fontSize}px`, fontWeight: 600, color: TEXT, fontFamily: PJS, lineHeight: 1.4 }}>
              Sareh Asih: Mengenali & Mengembangkan Potensi Anak
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: `1px solid ${BDR}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tts ? <Volume2 size={20} style={{ color: T }} /> : <VolumeX size={20} style={{ color: MUTED }} />}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: IPS }}>Baca Layar (TTS)</p>
              <p style={{ fontSize: 11, color: MUTED, fontFamily: IPS }}>Bacakan konten layar dengan suara</p>
            </div>
          </div>
          <button onClick={() => setTts(!tts)}
            style={{ width: 48, height: 28, borderRadius: 14, background: tts ? T : BDR, transition: "background 0.2s", position: "relative", cursor: "pointer", border: "none", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: tts ? 22 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.18)", transition: "left 0.2s" }} />
          </button>
        </div>

        <div style={{ borderTop: `1px solid ${BDR}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 2 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: MUTED, fontFamily: IPS, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Informasi</p>
          {INFO_PANELS.map(item => {
            const open = info === item.label;
            return (
              <div key={item.label}>
                <button onClick={() => setInfo(open ? null : item.label)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", width: "100%", minHeight: 44 }}>
                  <span style={{ color: T }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: TEXT, fontFamily: IPS }}>{item.label}</span>
                  <ChevronRight size={14} style={{ color: MUTED, marginLeft: "auto", transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {open && (
                  <div style={{ background: BG, border: `1.5px solid ${BDR}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                    {item.body.map(b => (
                      <div key={b} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <span style={{ color: T, fontSize: 12, lineHeight: 1.7 }}>•</span>
                        <p style={{ fontSize: 12, lineHeight: 1.7, color: TEXT, fontFamily: IPS, margin: 0 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onClose} style={{ marginTop: 8, width: "100%", padding: "12px", borderRadius: 16, background: SEC, border: `1px solid ${BDR}`, color: DEEP, fontFamily: IPS, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 6px rgba(91,122,104,0.1)" }}>Tutup</button>
      </div>
    </div>
  );
}
