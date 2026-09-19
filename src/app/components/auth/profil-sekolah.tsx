import { useState } from "react";
import { School, Plus, XCircle, CheckCircle } from "lucide-react";
import { T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS } from "../ui-kit";
import { ABK_OPTIONS } from "../data";
import { type GuruProfile } from "./akun-guru";
import { ModalShell } from "./modal-shell";
import { SLBSearchInput } from "./slb-search";

export function ProfilSekolahModal({
  profile,
  onBack,
  onNext,
  onClose,
}: {
  profile: GuruProfile;
  onBack: () => void;
  onNext: (p: { sekolah: string; kelas: string[]; abk: string[]; kelasAbkMap: Record<string, string> }) => void;
  onClose?: () => void;
}) {
  const [sekolah, setSekolah] = useState(profile.sekolah);
  const [kelasAbkMap, setKelasAbkMap] = useState<Record<string, string>>(profile.kelasAbkMap ?? {});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Tab mode pembuatan kelas
  const [activeTab, setActiveTab] = useState<"reguler" | "vokasional">("reguler");

  // 1. State Reguler (SDLB / SMPLB / SMALB)
  const [jenjang, setJenjang] = useState<"SDLB" | "SMPLB" | "SMALB">("SMPLB");
  const [tingkat, setTingkat] = useState<string>("7");
  // Multi-select kekhususan (bisa pilih lebih dari 1: A, B, C, dst.)
  const [selectedKekhususan, setSelectedKekhususan] = useState<string[]>(["B"]);
  // Detail untuk Disabilitas Ganda
  const [detailGanda, setDetailGanda] = useState<string>("");
  // Input manual jenis kelas jika pilih "Lainnya" (misal: Inklusi, ADHD, Slow Learner)
  const [customJenisInput, setCustomJenisInput] = useState<string>("");
  const [customAbkInput, setCustomAbkInput] = useState<string>("Autism Spectrum Disorder");
  const [rombelParalel, setRombelParalel] = useState<string>("");

  // 2. State Vokasional (SMPLB & SMALB)
  const [vokasiJenjang, setVokasiJenjang] = useState<"SMPLB" | "SMALB">("SMALB");
  const [vokasiItem, setVokasiItem] = useState<string>("Tata Boga");

  // Konfigurasi Jenjang
  const JENJANG_MAP = {
    SDLB: { label: "SDLB", sub: "Kelas 1–6", defaultTingkat: "1", tingkats: ["1", "2", "3", "4", "5", "6"] },
    SMPLB: { label: "SMPLB", sub: "Kelas 7–9", defaultTingkat: "7", tingkats: ["7", "8", "9"] },
    SMALB: { label: "SMALB", sub: "Kelas 10–12", defaultTingkat: "10", tingkats: ["10", "11", "12"] },
  };

  // Konfigurasi Jenis Kekhususan / Layanan
  const KEKHUSUSAN_LIST = [
    { kode: "A", nama: "Kelas Tunanetra (A)", ringkas: "Tunanetra", abk: "Tunanetra", desc: "Hambatan penglihatan" },
    { kode: "B", nama: "Kelas Tunarungu (B)", ringkas: "Tunarungu", abk: "Tunarungu", desc: "Hambatan pendengaran/wicara" },
    { kode: "C", nama: "Kelas Tunagrahita (C)", ringkas: "Tunagrahita", abk: "Tunagrahita Ringan", desc: "Hambatan intelektual (ringan–sedang)" },
    { kode: "D", nama: "Kelas Tunadaksa (D)", ringkas: "Tunadaksa", abk: "Tunadaksa", desc: "Hambatan fisik/motorik" },
    { kode: "Autis", nama: "Kelas Spektrum Autis", ringkas: "Autis", abk: "Autism Spectrum Disorder", desc: "Penanganan & kurikulum adaptif" },
    { kode: "Ganda", nama: "Kelas Disabilitas Ganda", ringkas: "Disabilitas Ganda", abk: "Disabilitas Ganda", desc: "Memiliki lebih dari satu ragam disabilitas" },
    { kode: "Lainnya", nama: "Lainnya (Input Sendiri)", ringkas: "Lainnya", abk: "Lainnya", desc: "Ketikkan kelas / layanan khusus jika tidak ada di daftar" },
  ];

  // Presets kombinasi disabilitas ganda
  const PRESET_GANDA = [
    "Tunanetra + Tunarungu (Deafblind)",
    "Tunarungu + Tunagrahita",
    "Tunadaksa + Tunagrahita (Cerebral Palsy)",
    "Autis + Tunagrahita",
    "Tunanetra + Tunadaksa",
  ];

  // Konfigurasi Kelas Keterampilan / Vokasional
  const VOKASIONAL_LIST = [
    { id: "Tata Busana", nama: "Kelas Tata Busana / Menjahit", ringkas: "Tata Busana", icon: "✂️", abk: "Keterampilan Vokasional" },
    { id: "Tata Boga", nama: "Kelas Keterampilan Tata Boga", ringkas: "Tata Boga", icon: "🍳", abk: "Keterampilan Vokasional" },
    { id: "IT Komputer", nama: "Kelas Keterampilan IT / Komputer Dasar", ringkas: "IT & Komputer", icon: "💻", abk: "Keterampilan Vokasional" },
    { id: "Kriya", nama: "Kelas Kesenian & Kriya (Perkusi, Batik, Kerajinan)", ringkas: "Kesenian & Kriya", icon: "🎨", abk: "Keterampilan Vokasional" },
  ];

  // Toggle multi-select kekhususan
  const toggleKekhususan = (kode: string) => {
    setSelectedKekhususan(prev => {
      if (prev.includes(kode)) {
        if (prev.length === 1) return prev;
        return prev.filter(k => k !== kode);
      } else {
        return [...prev, kode];
      }
    });
  };

  // Switch jenjang & sinkronkan tingkat kelas
  const handleJenjangChange = (j: "SDLB" | "SMPLB" | "SMALB") => {
    setJenjang(j);
    setTingkat(JENJANG_MAP[j].defaultTingkat);
  };

  // Helper format nama kelas reguler
  const getPreviewReguler = () => {
    const selectedObjs = KEKHUSUSAN_LIST.filter(k => selectedKekhususan.includes(k.kode));
    const parts: string[] = [];

    if (selectedObjs.length > 0) {
      const regularCodes = selectedObjs.filter(k => k.kode !== "Ganda" && k.kode !== "Lainnya").map(k => k.kode);
      if (regularCodes.length > 0) {
        parts.push(regularCodes.join(", "));
      }
      if (selectedKekhususan.includes("Ganda")) {
        const gandaLabel = detailGanda.trim() ? `Ganda: ${detailGanda.trim()}` : "Ganda";
        parts.push(gandaLabel);
      }
      if (selectedKekhususan.includes("Lainnya")) {
        const customLabel = customJenisInput.trim() ? customJenisInput.trim() : "Kustom";
        parts.push(customLabel);
      }
    }

    const labelBagian = parts.length > 0 ? parts.join(" · ") : "Umum";
    const paralel = rombelParalel.trim() ? ` ${rombelParalel.trim()}` : "";
    return `Kelas ${tingkat}${paralel} (${labelBagian}) - ${jenjang}`;
  };

  // Helper format nama kelas vokasional
  const getPreviewVokasi = () => {
    const vObj = VOKASIONAL_LIST.find(v => v.id === vokasiItem || v.ringkas === vokasiItem) || VOKASIONAL_LIST[1];
    return `${vObj.nama} - ${vokasiJenjang}`;
  };

  // Handler tambah kelas reguler
  const addReguler = () => {
    const selectedObjs = KEKHUSUSAN_LIST.filter(k => selectedKekhususan.includes(k.kode));
    const abkItems: string[] = [];

    selectedObjs.forEach(k => {
      if (k.kode === "Ganda") {
        abkItems.push(detailGanda.trim() ? `Disabilitas Ganda (${detailGanda.trim()})` : "Disabilitas Ganda");
      } else if (k.kode === "Lainnya") {
        abkItems.push(customAbkInput.trim() || customJenisInput.trim() || "Kebutuhan Khusus");
      } else {
        abkItems.push(k.abk);
      }
    });

    const finalAbk = abkItems.join(" · ") || "Kebutuhan Khusus";
    const namaKelas = getPreviewReguler();
    setKelasAbkMap(prev => ({ ...prev, [namaKelas]: finalAbk }));
    setRombelParalel("");
  };

  // Handler tambah kelas vokasional
  const addVokasi = () => {
    const vObj = VOKASIONAL_LIST.find(v => v.id === vokasiItem || v.ringkas === vokasiItem) || VOKASIONAL_LIST[1];
    const namaKelas = getPreviewVokasi();
    setKelasAbkMap(prev => ({ ...prev, [namaKelas]: vObj.abk }));
  };

  const removeClass = (k: string) =>
    setKelasAbkMap(m => {
      const n = { ...m };
      delete n[k];
      return n;
    });

  const entries = Object.entries(kelasAbkMap);
  const valid = sekolah.trim() !== "" && entries.length > 0;
  const sekolahFilled = sekolah.trim() !== "";
  const kelasFilled = entries.length > 0;

  // Sub-step: 1=isi sekolah, 2=isi kelas, 3=simpan
  const subStep = !sekolahFilled ? 1 : !kelasFilled ? 2 : 3;

  return (
    <ModalShell
      step={2}
      total={3}
      title="Profil Sekolah & Kelas"
      desc="Pilih sekolah dan buat kelompok kelas SLB sesuai jenjang & layanan."
      onClose={onClose}
    >
      <div className="space-y-4">

        {/* ─── Sub-step indicator lingkaran (Sticky / Pinned at Top) ─── */}
        <div
          style={{
            position: "sticky",
            top: -16,
            zIndex: 30,
            background: CARD,
            margin: "-16px -20px 14px -20px",
            padding: "14px 20px 12px",
            borderBottom: `1.5px solid ${BDR}`,
            boxShadow: "0 4px 14px rgba(91,122,104,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
            {[
              { num: 1, label: "Nama Sekolah" },
              { num: 2, label: "Tambah Kelas" },
              { num: 3, label: "Simpan" },
            ].map((s, idx) => {
              const isDone = subStep > s.num;
              const isActive = subStep === s.num;
              const isLocked = subStep < s.num;
              return (
                <div key={s.num} style={{ display: "flex", alignItems: "center" }}>
                  {/* connector line */}
                  {idx > 0 && (
                    <div style={{
                      width: 34,
                      height: 2,
                      background: isDone || isActive
                        ? (idx === 1 && !sekolahFilled ? "#D1D5DB" : isDone ? T : T)
                        : "#D1D5DB",
                      transition: "background 0.3s",
                      flexShrink: 0,
                    }} />
                  )}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: PJS,
                      fontWeight: 700,
                      fontSize: 13,
                      border: `2px solid ${isDone ? T : isActive ? T : "#D1D5DB"}`,
                      background: isDone ? T : isActive ? `${T}18` : "#F3F4F6",
                      color: isDone ? "#fff" : isActive ? DEEP : "#9CA3AF",
                      transition: "all 0.3s",
                      boxShadow: isActive ? `0 0 0 4px ${T}22` : "none",
                    }}>
                      {isDone ? "✓" : s.num}
                    </div>
                    <span style={{
                      fontSize: 10.5,
                      fontFamily: IPS,
                      fontWeight: isActive ? 700 : 500,
                      color: isLocked ? "#9CA3AF" : isActive ? DEEP : "#6B7280",
                      whiteSpace: "nowrap",
                      transition: "color 0.3s",
                    }}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input Sekolah dengan Database Nasional */}
        <SLBSearchInput value={sekolah} onChange={setSekolah} required />

        {/* ─── PENGATUR KELAS SLB ─── */}
        <div style={{ position: "relative" }}>
          {/* LOCK OVERLAY — muncul jika sekolah belum diisi */}
          {!sekolahFilled && (
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              background: "rgba(243,244,246,0.88)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backdropFilter: "blur(2px)",
              cursor: "not-allowed",
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <p style={{ fontFamily: IPS, fontSize: 12, fontWeight: 700, color: "#9CA3AF", textAlign: "center", margin: 0 }}>
                Isi nama sekolah terlebih dahulu
              </p>
              <p style={{ fontFamily: IPS, fontSize: 11, color: "#9CA3AF", textAlign: "center", margin: 0 }}>
                Langkah ② akan terbuka otomatis
              </p>
            </div>
          )}
          <div style={{ background: BG, border: `1.5px solid ${!sekolahFilled ? "#E5E7EB" : BDR}`, borderRadius: 20, padding: 14, transition: "border-color 0.3s" }}>
            <div className="flex items-center justify-between mb-2.5">
              <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: PJS }}>
                Kelompok Kelas / Rombel <span style={{ color: A }}>*</span>
              </p>
              {entries.length > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#166534",
                    background: "#DCFCE7",
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontFamily: IPS,
                  }}>
                  ✓ {entries.length} Kelas Siap
                </span>
              )}
            </div>

            {/* 2 Tab Mode Pilihan */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl mb-3" style={{ background: CARD, border: `1px solid ${BDR}` }}>
              {[
                { id: "reguler", label: "🏫 Reguler SLB" },
                { id: "vokasional", label: "✂️ Vokasional" },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: "8px 4px",
                    borderRadius: 9,
                    fontSize: 11.5,
                    fontWeight: 700,
                    fontFamily: IPS,
                    border: "none",
                    cursor: "pointer",
                    background: activeTab === tab.id ? T : "transparent",
                    color: activeTab === tab.id ? "#fff" : MUTED,
                    transition: "all 0.15s",
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: REGULER SLB */}
            {activeTab === "reguler" && (
              <div className="space-y-3">
                {/* Pilihan Jenjang */}
                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: MUTED, fontFamily: IPS }}>
                    1. PILIH JENJANG SEKOLAH:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["SDLB", "SMPLB", "SMALB"] as const).map(j => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => handleJenjangChange(j)}
                        style={{
                          padding: "8px 6px",
                          borderRadius: 12,
                          textAlign: "center",
                          cursor: "pointer",
                          background: jenjang === j ? SEC : CARD,
                          border: `1.5px solid ${jenjang === j ? T : BDR}`,
                          color: jenjang === j ? DEEP : TEXT,
                          transition: "all 0.15s",
                        }}>
                        <p className="text-xs font-bold leading-none" style={{ fontFamily: PJS }}>{JENJANG_MAP[j].label}</p>
                        <p className="text-[10px] mt-1" style={{ color: MUTED, fontFamily: IPS }}>{JENJANG_MAP[j].sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pilihan Tingkat Kelas */}
                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: MUTED, fontFamily: IPS }}>
                    2. TINGKAT KELAS:
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                    {JENJANG_MAP[jenjang].tingkats.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTingkat(t)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: IPS,
                          cursor: "pointer",
                          background: tingkat === t ? T : CARD,
                          color: tingkat === t ? "#fff" : TEXT,
                          border: `1px solid ${tingkat === t ? T : BDR}`,
                          flexShrink: 0,
                          transition: "all 0.15s",
                        }}>
                        Kelas {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pilihan Kekhususan / Layanan */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold block" style={{ color: MUTED, fontFamily: IPS }}>
                      3. JENIS KEKHUSUSAN / LAYANAN:
                    </label>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "#DCFCE7", color: "#166534", fontFamily: IPS }}>
                      ✓ Bisa pilih lebih dari 1 (misal A, B, C)
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {KEKHUSUSAN_LIST.map(k => {
                      const isSelected = selectedKekhususan.includes(k.kode);
                      return (
                        <button
                          key={k.kode}
                          type="button"
                          onClick={() => toggleKekhususan(k.kode)}
                          className="w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer"
                          style={{
                            background: isSelected ? SEC : CARD,
                            border: `1.5px solid ${isSelected ? T : BDR}`,
                          }}>
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: 6,
                                  background: isSelected ? T : "#E2E8F0",
                                  color: isSelected ? "#fff" : "#475569",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 10,
                                  fontWeight: 800,
                                }}>
                                {k.kode === "Autis" ? "★" : k.kode === "Ganda" ? "∞" : k.kode}
                              </span>
                              <p
                                className="text-xs font-bold leading-tight"
                                style={{ color: isSelected ? DEEP : TEXT, fontFamily: IPS }}>
                                {k.nama}
                              </p>
                            </div>
                            <p className="text-[10px] mt-0.5 ml-7" style={{ color: MUTED, fontFamily: IPS }}>
                              {k.desc}
                            </p>
                          </div>
                          {/* Checkbox Icon */}
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 6,
                              border: `2px solid ${isSelected ? T : "#CBD5E1"}`,
                              background: isSelected ? T : "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: "bold",
                              transition: "all 0.15s",
                            }}>
                            {isSelected && "✓"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-panel Disabilitas Ganda */}
                {selectedKekhususan.includes("Ganda") && (
                  <div
                    className="p-3 rounded-xl space-y-2 border"
                    style={{ background: "#FAF5FF", borderColor: "#E9D5FF" }}>
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 15 }}>🧩</span>
                      <p className="text-xs font-bold" style={{ color: "#6B21A8", fontFamily: IPS }}>
                        Ragam Disabilitas Ganda pada Kelas/Siswa:
                      </p>
                    </div>
                    <p className="text-[10px]" style={{ color: "#7E22CE", fontFamily: IPS }}>
                      Pilih kombinasi umum di bawah atau ketikkan sendiri ragam disabilitas yang dialami siswa:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_GANDA.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDetailGanda(preset)}
                          className={`text-[10px] px-2 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                            detailGanda === preset
                              ? "bg-purple-700 text-white shadow-sm"
                              : "bg-white text-purple-800 border border-purple-200 hover:bg-purple-100"
                          }`}
                          style={{ fontFamily: IPS }}>
                          {preset}
                        </button>
                      ))}
                    </div>
                    <input
                      value={detailGanda}
                      onChange={e => setDetailGanda(e.target.value)}
                      placeholder="Atau ketik kombinasi disabilitas (misal: Tunarungu + Tunadaksa)..."
                      style={{
                        width: "100%",
                        border: "1.5px solid #D8B4FE",
                        borderRadius: 10,
                        padding: "7px 10px",
                        fontSize: 11,
                        color: TEXT,
                        fontFamily: IPS,
                        background: "#fff",
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                {/* Sub-panel Input Kustom Lainnya */}
                {selectedKekhususan.includes("Lainnya") && (
                  <div
                    className="p-3 rounded-xl space-y-2.5 border"
                    style={{ background: "#FEF9C3", borderColor: "#FACC15" }}>
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 16 }}>✏️</span>
                      <p className="text-xs font-bold" style={{ color: "#854D0E", fontFamily: IPS }}>
                        Input Kelas / Layanan Lainnya (Kustom):
                      </p>
                    </div>
                    <p className="text-[10px]" style={{ color: "#713F12", fontFamily: IPS }}>
                      Ketikkan nama atau jenis kelas yang tidak ada di daftar (contoh: Inklusi, Terapi Wicara, ADHD, Kelas Transisi, dsb):
                    </p>
                    <input
                      value={customJenisInput}
                      onChange={e => setCustomJenisInput(e.target.value)}
                      placeholder="Tuliskan nama jenis kelas di sini..."
                      style={{
                        width: "100%",
                        border: "1.5px solid #FCD34D",
                        borderRadius: 10,
                        padding: "8px 12px",
                        fontSize: 12,
                        color: TEXT,
                        fontFamily: IPS,
                        background: "#fff",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    <div className="pt-0.5">
                      <label className="text-[10px] font-bold block mb-1" style={{ color: "#854D0E", fontFamily: IPS }}>
                        Jenis Kebutuhan Khusus / ABK Terkait:
                      </label>
                      <select
                        value={customAbkInput}
                        onChange={e => setCustomAbkInput(e.target.value)}
                        style={{
                          width: "100%",
                          border: "1.5px solid #FCD34D",
                          borderRadius: 10,
                          padding: "7px 10px",
                          fontSize: 11.5,
                          color: TEXT,
                          fontFamily: IPS,
                          background: "#fff",
                          outline: "none",
                          boxSizing: "border-box"
                        }}>
                        <option value="Autism Spectrum Disorder">Autism Spectrum Disorder (ASD)</option>
                        <option value="Tunarungu">Tunarungu / Wicara</option>
                        <option value="Tunadaksa">Tunadaksa (Fisik/Motorik)</option>
                        <option value="Tunagrahita Ringan">Tunagrahita Ringan</option>
                        <option value="Tunagrahita Sedang">Tunagrahita Sedang</option>
                        <option value="Tunanetra">Tunanetra</option>
                        <option value="Tunalaras">Tunalaras</option>
                        <option value="Disabilitas Ganda">Disabilitas Ganda</option>
                        <option value="Inklusi & Lainnya">Inklusi / ADHD / Lainnya</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Rombel paralel opsional */}
                <div className="flex items-center gap-2">
                  <input
                    value={rombelParalel}
                    onChange={e => setRombelParalel(e.target.value)}
                    placeholder="Kode rombel paralel opsional (contoh: 1, 2, A, B)..."
                    style={{
                      flex: 1,
                      border: `1.5px solid ${BDR}`,
                      borderRadius: 10,
                      padding: "8px 10px",
                      fontSize: 12,
                      color: TEXT,
                      fontFamily: IPS,
                      background: CARD,
                      outline: "none",
                    }}
                  />
                </div>

                {/* Preview & Tombol Tambah */}
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: "10px 12px" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#166534", fontFamily: IPS }}>
                    Preview Rombel yang Dibuat:
                  </p>
                  <p className="text-sm font-extrabold mt-0.5" style={{ color: DEEP, fontFamily: PJS }}>
                    {getPreviewReguler()}
                  </p>
                  <button
                    type="button"
                    onClick={addReguler}
                    style={{
                      width: "100%",
                      height: 40,
                      borderRadius: 11,
                      background: T,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontFamily: IPS,
                      fontSize: 13,
                      marginTop: 8,
                    }}>
                    <Plus size={16} style={{ marginRight: 6 }} /> Tambahkan Kelas Ini
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: VOKASIONAL */}
            {activeTab === "vokasional" && (
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl flex items-start gap-2" style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}>
                  <span style={{ fontSize: 16 }}>✂️</span>
                  <p className="text-[11px] leading-relaxed" style={{ color: "#92400E", fontFamily: IPS }}>
                    <strong>Kelas Keterampilan Vokasional:</strong> Khusus jenjang menengah (SMPLB & SMALB) untuk pembekalan kemandirian siswa.
                  </p>
                </div>

                {/* Pilih Jenjang Vokasional */}
                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: MUTED, fontFamily: IPS }}>
                    JENJANG VOKASIONAL:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["SMPLB", "SMALB"] as const).map(vj => (
                      <button
                        key={vj}
                        type="button"
                        onClick={() => setVokasiJenjang(vj)}
                        style={{
                          padding: "8px",
                          borderRadius: 12,
                          cursor: "pointer",
                          background: vokasiJenjang === vj ? SEC : CARD,
                          border: `1.5px solid ${vokasiJenjang === vj ? T : BDR}`,
                          color: vokasiJenjang === vj ? DEEP : TEXT,
                          fontWeight: 700,
                          fontSize: 12,
                          fontFamily: IPS,
                          transition: "all 0.15s",
                        }}>
                        {vj} ({vj === "SMPLB" ? "Tingkat SMP" : "Tingkat SMA"})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pilihan Bidang Vokasional */}
                <div>
                  <label className="text-[11px] font-bold block mb-1" style={{ color: MUTED, fontFamily: IPS }}>
                    BIDANG KETERAMPILAN / PELATIHAN:
                  </label>
                  <div className="space-y-1.5">
                    {VOKASIONAL_LIST.map(v => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVokasiItem(v.id)}
                        className="w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-all"
                        style={{
                          background: vokasiItem === v.id ? SEC : CARD,
                          border: `1.5px solid ${vokasiItem === v.id ? T : BDR}`,
                          cursor: "pointer",
                        }}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span style={{ fontSize: 18 }}>{v.icon}</span>
                          <div>
                            <p className="text-xs font-bold leading-tight" style={{ color: vokasiItem === v.id ? DEEP : TEXT, fontFamily: IPS }}>
                              {v.nama}
                            </p>
                            <p className="text-[10px]" style={{ color: MUTED, fontFamily: IPS }}>
                              Kategori: Vokasional Mandiri
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: `2px solid ${vokasiItem === v.id ? T : BDR}`,
                            background: vokasiItem === v.id ? T : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}>
                          {vokasiItem === v.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview & Tambah Vokasi */}
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: "10px 12px" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#166534", fontFamily: IPS }}>
                    Preview Kelas Vokasional:
                  </p>
                  <p className="text-sm font-extrabold mt-0.5" style={{ color: DEEP, fontFamily: PJS }}>
                    {getPreviewVokasi()}
                  </p>
                  <button
                    type="button"
                    onClick={addVokasi}
                    style={{
                      width: "100%",
                      height: 40,
                      borderRadius: 11,
                      background: T,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontFamily: IPS,
                      fontSize: 13,
                      marginTop: 8,
                    }}>
                    <Plus size={16} style={{ marginRight: 6 }} /> Tambahkan Kelas Vokasional
                  </button>
                </div>
              </div>
            )}

            {/* DAFTAR KELAS YANG SUDAH DITAMBAHKAN */}
            <div className="mt-4 pt-3 border-t" style={{ borderColor: BDR }}>
              <p className="text-xs font-bold mb-2 flex items-center justify-between" style={{ color: TEXT, fontFamily: PJS }}>
                <span>Daftar Kelas di {sekolah || "Sekolah Anda"}</span>
                <span className="text-[11px] font-normal" style={{ color: MUTED }}>
                  {entries.length} kelas aktif
                </span>
              </p>

              {entries.length === 0 ? (
                <div
                  className="p-3 text-center rounded-xl border border-dashed"
                  style={{ borderColor: BDR, background: CARD }}>
                  <p className="text-xs font-semibold" style={{ color: MUTED, fontFamily: IPS }}>
                    Belum ada kelas yang ditambahkan.
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: MUTED, fontFamily: IPS }}>
                    Pilih tab di atas (Reguler atau Vokasional) lalu tekan tombol <strong>Tambah</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
                  {entries.map(([k, a]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: CARD,
                        border: `1px solid ${BDR}`,
                        borderRadius: 14,
                        padding: "8px 12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          background: SEC,
                          color: DEEP,
                          borderRadius: 9,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                        <School size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold leading-tight truncate" style={{ color: TEXT, fontFamily: IPS }}>
                          {k}
                        </p>
                        <p className="text-[10px] truncate mt-0.5" style={{ color: MUTED, fontFamily: IPS }}>
                          Kekhususan: <span style={{ color: DEEP, fontWeight: 600 }}>{a}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeClass(k)}
                        title="Hapus kelas"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                        }}>
                        <XCircle size={16} style={{ color: "#EF4444" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigasi */}
      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving || isSaved}
          style={{
            flex: 1,
            border: `2px solid ${DEEP}`,
            color: DEEP,
            fontFamily: PJS,
            fontWeight: 700,
            fontSize: 14,
            minHeight: 52,
            background: CARD,
            borderRadius: 16,
            opacity: isSaving || isSaved ? 0.6 : 1,
            cursor: isSaving || isSaved ? "not-allowed" : "pointer"
          }}
          className="active:scale-[0.98] transition-all">
          ← Kembali
        </button>
        <button
          type="button"
          onClick={() => {
            if (!valid || isSaving || isSaved) return;
            setIsSaving(true);
            setTimeout(() => {
              setIsSaving(false);
              setIsSaved(true);
              setTimeout(() => {
                const kelas = Object.keys(kelasAbkMap);
                const abk = [...new Set(Object.values(kelasAbkMap))];
                onNext({ sekolah: sekolah.trim(), kelas, abk, kelasAbkMap });
              }, 700);
            }, 600);
          }}
          disabled={!valid || isSaving || isSaved}
          style={{
            flex: 2,
            background: isSaved ? "#10B981" : isSaving ? DEEP : valid ? A : "#D1D5DB",
            color: "#fff",
            fontFamily: PJS,
            fontWeight: 700,
            fontSize: 15,
            minHeight: 52,
            borderRadius: 16,
            border: "none",
            boxShadow: isSaved ? "0 6px 20px rgba(16,185,129,0.42)" : valid ? "0 6px 20px rgba(210,125,107,0.42)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.25s ease",
            cursor: valid && !isSaving && !isSaved ? "pointer" : "not-allowed"
          }}
          className="active:scale-[0.98] transition-all">
          {isSaving ? (
            <>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              Menyimpan Data…
            </>
          ) : isSaved ? (
            <>
              <CheckCircle size={18} strokeWidth={2.6} />
              Berhasil Disimpan!
            </>
          ) : (
            "Lanjut ke Tambah Siswa →"
          )}
        </button>
      </div>
    </ModalShell>
  );
}
