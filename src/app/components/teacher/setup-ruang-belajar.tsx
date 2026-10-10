import { useState } from "react";
import {
  ArrowLeft, CheckCircle, School, Plus, XCircle, User, ChevronRight,
  BookOpen, Home,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
  Field, PBtn,
} from "../ui-kit";
import { ABK_OPTIONS } from "../data";
import { type GuruProfile } from "../auth/akun-guru";
import { SLBSearchInput } from "../auth/slb-search";
import {
  type TeacherRole, TEACHER_ROLE_OPTIONS, KEKHUSUSAN_DESCRIPTIVE,
} from "../role-labels";

// ─── Kekhususan list (shared) ─────────────────────────────────────────
const KEKHUSUSAN_LIST = [
  { kode: "A", nama: "Hambatan penglihatan (Tunanetra / A)", abk: "Tunanetra" },
  { kode: "B", nama: "Hambatan pendengaran (Tuna Rungu / B)", abk: "Tuna Rungu" },
  { kode: "C", nama: "Hambatan intelektual ringan (Tunagrahita Ringan / C)", abk: "Tunagrahita Ringan" },
  { kode: "C1", nama: "Hambatan intelektual sedang (Tunagrahita Sedang / C1)", abk: "Tunagrahita Sedang" },
  { kode: "D", nama: "Hambatan fisik ringan (Tuna Daksa Ringan / D)", abk: "Tuna Daksa Ringan" },
  { kode: "D1", nama: "Hambatan fisik sedang (Tuna Daksa Sedang / D1)", abk: "Tuna Daksa Sedang" },
  { kode: "F", nama: "Hambatan wicara (Tuna Wicara / F)", abk: "Tuna Wicara" },
  { kode: "Q", nama: "Spektrum autisme (Autis / Q)", abk: "Autis (ASD)" },
  { kode: "Lainnya", nama: "Lainnya (tulis sendiri)", abk: "Lainnya" },
];

const JENJANG_MAP: Record<string, { label: string; tingkats: string[] }> = {
  SDLB: { label: "SDLB", tingkats: ["1", "2", "3", "4", "5", "6"] },
  SMPLB: { label: "SMPLB", tingkats: ["7", "8", "9"] },
  SMALB: { label: "SMALB", tingkats: ["10", "11", "12"] },
};

const ABK_HOMESCHOOL = [
  "Belum ada diagnosis / sedang observasi",
  ...ABK_OPTIONS.filter(o => o !== "Lainnya"),
  "Lainnya",
];

const JENJANG_HOMESCHOOL = [
  "Tanpa jenjang formal",
  "PAUD / usia dini",
  "SD / sederajat",
  "SMP / sederajat",
  "SMA / sederajat",
];

// ─── Added class item ─────────────────────────────────────────────────
interface AddedKelas {
  id: string;
  label: string;
  abk: string;
  kategori?: "reguler" | "vokasional";
}

// ─── Added child item (homeschool / GPK) ──────────────────────────────
export interface AddedAnak {
  id: string;
  nama: string;
  usia: string;
  abk: string;
  jenjang: string;
  sekolahAsal?: string;
}

// ─── Main Setup Component ─────────────────────────────────────────────
export function SetupRuangBelajar({
  guru,
  onBack,
  onDone,
}: {
  guru: GuruProfile;
  onBack: () => void;
  onDone: (result: {
    teacherRole: TeacherRole;
    sekolah: string;
    namaRuangBelajar: string;
    kelas: string[];
    kelasAbkMap: Record<string, string>;
    anakList: AddedAnak[];
  }) => void;
}) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1 — Peran
  const [selectedRole, setSelectedRole] = useState<TeacherRole | null>(guru.teacherRole || null);

  // Step 2 — Tempat mengajar
  const [sekolah, setSekolah] = useState(guru.sekolah || "");
  const [namaRuangBelajar, setNamaRuangBelajar] = useState(guru.namaRuangBelajar || "Ruang Belajar Saya");

  // Step 3 — SLB: kelas
  const [kategoriRombel, setKategoriRombel] = useState<"reguler" | "vokasional">("reguler");
  const [jenjang, setJenjang] = useState<"SDLB" | "SMPLB" | "SMALB">("SMPLB");
  const [tingkat, setTingkat] = useState("7");
  const [selectedKekhususan, setSelectedKekhususan] = useState<string[]>([]);
  const [addedKelas, setAddedKelas] = useState<AddedKelas[]>([]);

  // Step 3 — GPK/Homeschool: anak
  const [anakNama, setAnakNama] = useState("");
  const [anakUsia, setAnakUsia] = useState("");
  const [anakSekolahAsal, setAnakSekolahAsal] = useState("");
  const [anakAbk, setAnakAbk] = useState("");
  const [anakJenjang, setAnakJenjang] = useState("");
  const [anakAbkCustom, setAnakAbkCustom] = useState("");
  const [addedAnak, setAddedAnak] = useState<AddedAnak[]>([]);

  // ── Helpers ──
  const canStep2 = () => {
    if (!selectedRole) return false;
    if (selectedRole === "guru_slb") return sekolah.trim() !== "";
    if (selectedRole === "gpk") return sekolah.trim() !== "";
    return true; // homeschool: optional input with default
  };

  const canStep3 = () => {
    if (selectedRole === "guru_slb") return addedKelas.length > 0;
    return addedAnak.length > 0;
  };

  const addKelasItem = () => {
    if (selectedKekhususan.length === 0) return;
    const prefix = kategoriRombel === "vokasional" ? "Vokasional " : "";
    selectedKekhususan.forEach(kode => {
      const info = KEKHUSUSAN_LIST.find(k => k.kode === kode);
      const label = `Kelas ${tingkat} ${info?.abk || kode} - ${prefix}${jenjang}`;
      const id = `${jenjang}-${tingkat}-${kode}-${Date.now()}`;
      setAddedKelas(prev => [...prev, { id, label, abk: info?.abk || kode, kategori: kategoriRombel }]);
    });
    setSelectedKekhususan([]);
  };

  const removeKelas = (id: string) => setAddedKelas(prev => prev.filter(k => k.id !== id));

  const addAnakItem = () => {
    if (!anakNama.trim()) return;
    const abkFinal = anakAbk === "Lainnya" ? (anakAbkCustom.trim() || "Lainnya") : anakAbk;
    const id = `anak-${Date.now()}`;
    setAddedAnak(prev => [...prev, {
      id,
      nama: anakNama.trim(),
      usia: anakUsia.trim(),
      abk: abkFinal || "Belum ada diagnosis / sedang observasi",
      jenjang: anakJenjang || "Tanpa jenjang formal",
      sekolahAsal: anakSekolahAsal.trim(),
    }]);
    setAnakNama(""); setAnakUsia(""); setAnakAbk(""); setAnakJenjang(""); setAnakAbkCustom(""); setAnakSekolahAsal("");
  };

  const removeAnak = (id: string) => setAddedAnak(prev => prev.filter(a => a.id !== id));

  const handleDone = () => {
    const kelasAbkMap: Record<string, string> = {};
    addedKelas.forEach(k => { kelasAbkMap[k.label] = k.abk; });
    onDone({
      teacherRole: selectedRole!,
      sekolah: selectedRole === "homeschool" ? "" : sekolah,
      namaRuangBelajar: selectedRole === "homeschool" ? (namaRuangBelajar || "Ruang Belajar Saya") : "",
      kelas: addedKelas.map(k => k.label),
      kelasAbkMap,
      anakList: addedAnak,
    });
  };

  const nextStep = () => {
    if (step === 1 && selectedRole) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const prevStep = () => {
    if (step === 1) { onBack(); return; }
    setStep(s => s - 1);
  };

  // ── Step indicator ──
  const StepIndicator = () => (
    <div style={{ display: "flex", gap: 6, padding: "0 20px", marginBottom: 8 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i <= step ? T : "rgba(91,122,104,0.18)",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );

  // ────────────────── RENDER ──────────────────
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: BG, fontFamily: IPS, overflow: "hidden" }}>
      {/* ── Header ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 10px", flexShrink: 0, borderBottom: `1px solid rgba(91,122,104,0.10)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={prevStep}
            style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(139,176,152,0.14)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1B2E24", flexShrink: 0 }}
            className="active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>
              Setup Ruang Belajar
            </h1>
            <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#5A6E63", margin: "2px 0 0", fontWeight: 500 }}>
              Langkah {step} dari {totalSteps}
            </p>
          </div>
        </div>
      </div>

      <StepIndicator />

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 100px" }}>
        {step === 1 && <Step1PickRole selected={selectedRole} onSelect={setSelectedRole} />}
        {step === 2 && <Step2Place role={selectedRole!} sekolah={sekolah} onSekolah={setSekolah} namaRuang={namaRuangBelajar} onNamaRuang={setNamaRuangBelajar} />}
        {step === 3 && selectedRole === "guru_slb" && (
          <Step3SLB
            kategoriRombel={kategoriRombel} onKategoriRombel={setKategoriRombel}
            jenjang={jenjang} onJenjang={j => { setJenjang(j); setTingkat(JENJANG_MAP[j].tingkats[0]); }}
            tingkat={tingkat} onTingkat={setTingkat}
            kekhususan={selectedKekhususan} onKekhususan={setSelectedKekhususan}
            added={addedKelas} onAdd={addKelasItem} onRemove={removeKelas}
          />
        )}
        {step === 3 && (selectedRole === "gpk" || selectedRole === "homeschool") && (
          <Step3Anak
            role={selectedRole}
            nama={anakNama} onNama={setAnakNama}
            usia={anakUsia} onUsia={setAnakUsia}
            sekolahAsal={anakSekolahAsal} onSekolahAsal={setAnakSekolahAsal}
            abk={anakAbk} onAbk={setAnakAbk}
            abkCustom={anakAbkCustom} onAbkCustom={setAnakAbkCustom}
            jenjang={anakJenjang} onJenjang={setAnakJenjang}
            added={addedAnak} onAdd={addAnakItem} onRemove={removeAnak}
          />
        )}
        {step === 4 && (
          <Step4Summary
            role={selectedRole!} sekolah={sekolah} namaRuang={namaRuangBelajar}
            kelasList={addedKelas} anakList={addedAnak}
          />
        )}
      </div>

      {/* ── Footer buttons ── */}
      <div style={{ padding: "12px 16px 20px", background: CARD, borderTop: `1px solid rgba(91,122,104,0.10)`, flexShrink: 0 }}>
        {step === 1 && (
          <PBtn label="Lanjut" full disabled={!selectedRole} onClick={nextStep} />
        )}
        {step === 2 && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={nextStep} style={{ flex: 1, border: `1.5px solid ${BDR}`, color: MUTED, fontFamily: IPS, minHeight: 48, borderRadius: 16, fontSize: 13, fontWeight: 600, background: CARD, cursor: "pointer" }}>
              Lewati dulu
            </button>
            <div style={{ flex: 2 }}>
              <PBtn label="Lanjut" full disabled={!canStep2()} onClick={nextStep} />
            </div>
          </div>
        )}
        {step === 3 && (
          <>
            {!canStep3() && (
              <p style={{ fontSize: 11.5, color: MUTED, fontFamily: IPS, textAlign: "center", marginBottom: 8, fontWeight: 500 }}>
                Tambahkan minimal 1 {selectedRole === "guru_slb" ? "kelas" : "anak"} untuk lanjut
              </p>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={nextStep} style={{ flex: 1, border: `1.5px solid ${BDR}`, color: MUTED, fontFamily: IPS, minHeight: 48, borderRadius: 16, fontSize: 13, fontWeight: 600, background: CARD, cursor: "pointer" }}>
                Lewati dulu
              </button>
              <div style={{ flex: 2 }}>
                <PBtn label="Lanjut" full disabled={!canStep3()} onClick={nextStep} />
              </div>
            </div>
          </>
        )}
        {step === 4 && (
          <PBtn label="Selesai ✓" full onClick={handleDone} />
        )}
      </div>
    </div>
  );
}

// ────────────────── STEP 1: PILIH PERAN ──────────────────
function Step1PickRole({ selected, onSelect }: { selected: TeacherRole | null; onSelect: (r: TeacherRole) => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 4, lineHeight: 1.3 }}>
        Kamu mengajar sebagai apa?
      </h2>
      <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 16, lineHeight: 1.5 }}>
        Pilih peran yang paling sesuai. Peran ini disimpan di profilmu dan bisa diubah kapan saja di Pengaturan.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {TEACHER_ROLE_OPTIONS.map(opt => {
          const isActive = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 16px",
                borderRadius: 20,
                border: `2px solid ${isActive ? T : "rgba(91,122,104,0.15)"}`,
                background: isActive ? SEC : CARD,
                cursor: "pointer",
                textAlign: "left",
                boxShadow: isActive ? `0 4px 16px rgba(91,122,104,0.18)` : "0 2px 8px rgba(91,122,104,0.06)",
                transition: "all 0.2s",
                minHeight: 72,
              }}
              className="active:scale-[0.98] transition-all"
            >
              <div style={{
                width: 48, height: 48, borderRadius: 16,
                background: isActive ? T : "rgba(139,176,152,0.14)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
                transition: "all 0.2s",
              }}>
                {isActive ? <CheckCircle size={22} style={{ color: "#fff" }} /> : <span>{opt.icon}</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 14.5, color: isActive ? DEEP : TEXT, marginBottom: 2, lineHeight: 1.25 }}>
                  {opt.label}
                </p>
                <p style={{ fontFamily: IPS, fontSize: 12, color: MUTED, lineHeight: 1.4 }}>
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────── STEP 2: TEMPAT MENGAJAR ──────────────────
function Step2Place({
  role, sekolah, onSekolah, namaRuang, onNamaRuang,
}: {
  role: TeacherRole; sekolah: string; onSekolah: (v: string) => void;
  namaRuang: string; onNamaRuang: (v: string) => void;
}) {
  const [manualMode, setManualMode] = useState(false);

  if (role === "homeschool") {
    return (
      <div>
        <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 4 }}>
          Ruang Belajarmu
        </h2>
        <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 16, lineHeight: 1.5 }}>
          Beri nama ruang belajar mandiri yang kamu kelola. Bisa diubah nanti.
        </p>

        <div style={{ background: CARD, borderRadius: 20, padding: 16, border: `1.5px solid rgba(91,122,104,0.15)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: "rgba(139,176,152,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Home size={20} style={{ color: DEEP }} />
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13.5, color: TEXT }}>Nama Ruang Belajar</p>
              <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED }}>Opsional (Default: Ruang Belajar Saya)</p>
            </div>
          </div>
          <input
            value={namaRuang}
            onChange={e => onNamaRuang(e.target.value)}
            placeholder="Ruang Belajar Saya"
            style={{
              width: "100%", border: `1.5px solid ${BDR}`, borderRadius: 12,
              padding: "12px 14px", fontSize: 14, color: TEXT, fontFamily: IPS,
              background: BG, outline: "none", minHeight: 46, boxSizing: "border-box",
            }}
          />
        </div>
      </div>
    );
  }

  // SLB & GPK: school search
  return (
    <div>
      <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 4 }}>
        {role === "guru_slb" ? "Pilih Sekolah (SLB)" : "Pilih Sekolah Dampingan"}
      </h2>
      <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 16, lineHeight: 1.5 }}>
        {role === "guru_slb"
          ? "Cari nama SLB dari database nasional."
          : "Cari nama sekolah reguler / inklusif tempat kamu mendampingi anak."}
      </p>

      {manualMode ? (
        <div style={{ background: CARD, borderRadius: 20, padding: 16, border: `1.5px solid rgba(91,122,104,0.15)` }}>
          <Field label="Nama Sekolah (Manual)" placeholder="Ketik nama sekolah..." value={sekolah} onChange={onSekolah} required />
          <button onClick={() => setManualMode(false)} style={{ marginTop: 10, fontSize: 12, color: T, fontFamily: IPS, fontWeight: 600, background: "transparent", border: "none", cursor: "pointer" }}>
            ← Kembali ke pencarian database
          </button>
        </div>
      ) : (
        <>
          <SLBSearchInput value={sekolah} onChange={onSekolah} required />
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button onClick={() => setManualMode(true)} style={{ fontSize: 12.5, color: MUTED, fontFamily: IPS, fontWeight: 500, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Saya tidak mengajar di sekolah / sekolah saya tidak ada di daftar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ────────────────── STEP 3a: SLB KELAS ──────────────────
function Step3SLB({
  kategoriRombel, onKategoriRombel,
  jenjang, onJenjang, tingkat, onTingkat,
  kekhususan, onKekhususan,
  added, onAdd, onRemove,
}: {
  kategoriRombel: "reguler" | "vokasional"; onKategoriRombel: (k: "reguler" | "vokasional") => void;
  jenjang: "SDLB" | "SMPLB" | "SMALB"; onJenjang: (j: "SDLB" | "SMPLB" | "SMALB") => void;
  tingkat: string; onTingkat: (t: string) => void;
  kekhususan: string[]; onKekhususan: (ks: string[]) => void;
  added: AddedKelas[]; onAdd: () => void; onRemove: (id: string) => void;
}) {
  return (
    <div>
      <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 4 }}>Tambah Kelas</h2>
      <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 1.5 }}>
        Buat rombongan belajar berdasarkan jenis kelas, jenjang, tingkat, dan jenis kekhususan.
      </p>

      {/* Tab Reguler / Vokasional */}
      <div style={{ display: "flex", background: "rgba(91,122,104,0.08)", padding: 4, borderRadius: 14, marginBottom: 12 }}>
        {(["reguler", "vokasional"] as const).map(k => (
          <button
            key={k}
            onClick={() => onKategoriRombel(k)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 12.5, fontWeight: 700, fontFamily: PJS,
              border: "none", background: kategoriRombel === k ? CARD : "transparent",
              color: kategoriRombel === k ? DEEP : MUTED, cursor: "pointer",
              boxShadow: kategoriRombel === k ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {k === "reguler" ? "Reguler SLB" : "Kelas Vokasional"}
          </button>
        ))}
      </div>

      {/* Tab Jenjang */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {(["SDLB", "SMPLB", "SMALB"] as const).map(j => (
          <button key={j} onClick={() => onJenjang(j)} style={{
            flex: 1, padding: "8px 0", borderRadius: 12, fontSize: 12, fontWeight: 700, fontFamily: PJS, border: `1.5px solid ${jenjang === j ? T : BDR}`,
            background: jenjang === j ? SEC : CARD, color: jenjang === j ? DEEP : MUTED, cursor: "pointer", minHeight: 38,
          }} className="active:scale-[0.98] transition-all">
            {j}
          </button>
        ))}
      </div>

      {/* Tingkat kelas */}
      <p style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: PJS, marginBottom: 6, textTransform: "uppercase" }}>Tingkat Kelas</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {JENJANG_MAP[jenjang].tingkats.map(t => (
          <button key={t} onClick={() => onTingkat(t)} style={{
            padding: "6px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: IPS,
            border: `1.5px solid ${tingkat === t ? T : BDR}`,
            background: tingkat === t ? SEC : CARD, color: tingkat === t ? DEEP : MUTED,
            cursor: "pointer", minHeight: 36,
          }} className="active:scale-[0.98] transition-all">
            Kelas {t}
          </button>
        ))}
      </div>

      {/* Kekhususan */}
      <p style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: PJS, marginBottom: 6, textTransform: "uppercase" }}>Jenis Kekhususan</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {KEKHUSUSAN_LIST.map(k => {
          const on = kekhususan.includes(k.kode);
          return (
            <button key={k.kode} onClick={() => {
              onKekhususan(on ? kekhususan.filter(x => x !== k.kode) : [...kekhususan, k.kode]);
            }} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
              borderRadius: 14, border: `1.5px solid ${on ? T : "rgba(91,122,104,0.15)"}`,
              background: on ? SEC : CARD, cursor: "pointer", textAlign: "left", minHeight: 44,
            }} className="active:scale-[0.98] transition-all">
              {on ? <CheckCircle size={16} style={{ color: T, flexShrink: 0 }} /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${BDR}`, flexShrink: 0 }} />}
              <span style={{ fontFamily: IPS, fontSize: 12.5, color: on ? DEEP : TEXT, fontWeight: on ? 700 : 500 }}>
                {k.nama}
              </span>
            </button>
          );
        })}
      </div>

      <button onClick={onAdd} disabled={kekhususan.length === 0} style={{
        width: "100%", padding: "10px", borderRadius: 14, border: "none",
        background: kekhususan.length > 0 ? T : "#CBD5E1",
        color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: kekhususan.length > 0 ? "pointer" : "not-allowed",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 44,
      }} className="active:scale-[0.98] transition-all">
        <Plus size={16} /> Tambahkan Kelas Ini
      </button>

      {/* Added list */}
      {added.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: PJS, marginBottom: 6, textTransform: "uppercase" }}>
            Kelas Ditambahkan ({added.length})
          </p>
          {added.map(k => (
            <div key={k.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", borderRadius: 14, background: CARD, border: `1px solid ${BDR}`, marginBottom: 6,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <School size={14} style={{ color: DEEP }} />
                <span style={{ fontFamily: IPS, fontSize: 12.5, color: TEXT, fontWeight: 600 }}>{k.label}</span>
              </div>
              <button onClick={() => onRemove(k.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#EF4444", padding: 4 }}>
                <XCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────── STEP 3b: GPK / HOMESCHOOL ANAK ──────────────────
function Step3Anak({
  role, nama, onNama, usia, onUsia, sekolahAsal, onSekolahAsal, abk, onAbk, abkCustom, onAbkCustom,
  jenjang, onJenjang, added, onAdd, onRemove,
}: {
  role: TeacherRole;
  nama: string; onNama: (v: string) => void;
  usia: string; onUsia: (v: string) => void;
  sekolahAsal: string; onSekolahAsal: (v: string) => void;
  abk: string; onAbk: (v: string) => void;
  abkCustom: string; onAbkCustom: (v: string) => void;
  jenjang: string; onJenjang: (v: string) => void;
  added: AddedAnak[]; onAdd: () => void; onRemove: (id: string) => void;
}) {
  return (
    <div>
      <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 4 }}>
        {role === "gpk" ? "Tambah Anak Dampingan" : "Tambah Anak Didik"}
      </h2>
      <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 1.5 }}>
        {role === "gpk"
          ? "Masukkan data anak yang kamu dampingi di sekolah reguler / inklusif."
          : "Masukkan data anak yang kamu ajar di rumah secara mandiri."}
      </p>

      <div style={{ background: CARD, borderRadius: 20, padding: 16, border: `1.5px solid rgba(91,122,104,0.15)`, marginBottom: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Nama Anak" placeholder="Nama lengkap anak" value={nama} onChange={onNama} required />
          <Field label="Usia (tahun)" placeholder="cth: 8" value={usia} onChange={onUsia} type="number" />

          {role === "gpk" && (
            <Field label="Kelas / Sekolah Asal" placeholder="cth: Kelas 3 SDN 1 Merdeka" value={sekolahAsal} onChange={onSekolahAsal} />
          )}

          {/* Jenjang */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: IPS, display: "block", marginBottom: 6 }}>
              Jenjang <span style={{ color: MUTED, fontWeight: 400 }}>(opsional)</span>
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {JENJANG_HOMESCHOOL.map(j => (
                <button key={j} onClick={() => onJenjang(jenjang === j ? "" : j)} style={{
                  padding: "6px 12px", borderRadius: 10, fontSize: 11.5, fontWeight: 600, fontFamily: IPS,
                  border: `1.5px solid ${jenjang === j ? T : BDR}`,
                  background: jenjang === j ? SEC : CARD, color: jenjang === j ? DEEP : MUTED,
                  cursor: "pointer", minHeight: 34,
                }} className="active:scale-[0.98] transition-all">
                  {j}
                </button>
              ))}
            </div>
          </div>

          {/* ABK */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT, fontFamily: IPS, display: "block", marginBottom: 6 }}>
              Kebutuhan Khusus / Kondisi
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ABK_HOMESCHOOL.map(opt => {
                const on = abk === opt;
                const prominent = opt === "Belum ada diagnosis / sedang observasi" || opt === "Lainnya";
                return (
                  <button key={opt} onClick={() => onAbk(on ? "" : opt)} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
                    borderRadius: 12, border: `1.5px solid ${on ? T : prominent ? "rgba(210,125,107,0.35)" : "rgba(91,122,104,0.12)"}`,
                    background: on ? SEC : prominent ? "rgba(210,125,107,0.06)" : CARD,
                    cursor: "pointer", textAlign: "left", minHeight: 40,
                  }} className="active:scale-[0.98] transition-all">
                    {on ? <CheckCircle size={15} style={{ color: T, flexShrink: 0 }} /> : <div style={{ width: 15, height: 15, borderRadius: "50%", border: `1.5px solid ${BDR}`, flexShrink: 0 }} />}
                    <span style={{ fontFamily: IPS, fontSize: 12, color: on ? DEEP : TEXT, fontWeight: on ? 700 : prominent ? 600 : 500 }}>
                      {KEKHUSUSAN_DESCRIPTIVE[opt] || opt}
                    </span>
                  </button>
                );
              })}
            </div>
            {abk === "Lainnya" && (
              <input
                value={abkCustom}
                onChange={e => onAbkCustom(e.target.value)}
                placeholder="Ketik kebutuhan khusus..."
                style={{
                  width: "100%", border: `1.5px solid ${BDR}`, borderRadius: 12,
                  padding: "8px 12px", fontSize: 13, color: TEXT, fontFamily: IPS,
                  background: BG, outline: "none", minHeight: 40, marginTop: 6, boxSizing: "border-box",
                }}
              />
            )}
          </div>
        </div>

        <button onClick={onAdd} disabled={!nama.trim()} style={{
          width: "100%", padding: "10px", borderRadius: 14, border: "none", marginTop: 12,
          background: nama.trim() ? T : "#CBD5E1",
          color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 13,
          cursor: nama.trim() ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 44,
        }} className="active:scale-[0.98] transition-all">
          <Plus size={16} /> Tambahkan Anak Ini
        </button>
      </div>

      {/* Added list */}
      {added.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: PJS, marginBottom: 6, textTransform: "uppercase" }}>
            Anak Ditambahkan ({added.length})
          </p>
          {added.map(a => (
            <div key={a.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 14, background: CARD, border: `1px solid ${BDR}`, marginBottom: 6,
            }}>
              <div>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: TEXT }}>{a.nama}</p>
                <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED }}>
                  {a.usia ? `${a.usia} thn` : ""}{a.abk ? ` · ${a.abk}` : ""}{a.jenjang ? ` · ${a.jenjang}` : ""}{a.sekolahAsal ? ` · ${a.sekolahAsal}` : ""}
                </p>
              </div>
              <button onClick={() => onRemove(a.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#EF4444", padding: 4 }}>
                <XCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────────── STEP 4: SUMMARY ──────────────────
function Step4Summary({
  role, sekolah, namaRuang, kelasList, anakList,
}: {
  role: TeacherRole; sekolah: string; namaRuang: string;
  kelasList: AddedKelas[]; anakList: AddedAnak[];
}) {
  const roleName = TEACHER_ROLE_OPTIONS.find(r => r.value === role)?.label || role;

  return (
    <div>
      <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 4 }}>
        Ringkasan Setup
      </h2>
      <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 16, lineHeight: 1.5 }}>
        Pastikan data di bawah sudah benar. Tekan "Selesai" untuk menyimpan setup ruang belajarmu.
      </p>

      <div style={{ background: CARD, borderRadius: 20, padding: 16, border: `1.5px solid rgba(91,122,104,0.15)`, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Role */}
        <SummaryRow icon="🎓" label="Peran Pengajar" value={roleName} />

        {/* Tempat */}
        {role === "homeschool" ? (
          <SummaryRow icon="🏠" label="Ruang Belajar" value={namaRuang || "Ruang Belajar Saya"} />
        ) : (
          <SummaryRow icon="🏫" label="Sekolah" value={sekolah || "—"} />
        )}

        {/* Kelas / Anak */}
        {role === "guru_slb" ? (
          <SummaryRow icon="📚" label="Kelas" value={kelasList.length > 0 ? `${kelasList.length} kelas` : "Belum ada"} />
        ) : (
          <SummaryRow icon="👦" label="Anak" value={anakList.length > 0 ? `${anakList.length} anak` : "Belum ada"} />
        )}
      </div>

      {/* Detail */}
      {kelasList.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: PJS, marginBottom: 6, textTransform: "uppercase" }}>Daftar Kelas:</p>
          {kelasList.map(k => (
            <div key={k.id} style={{ padding: "8px 12px", background: CARD, borderRadius: 12, border: `1px solid ${BDR}`, marginBottom: 6 }}>
              <p style={{ fontFamily: IPS, fontSize: 12.5, color: TEXT, fontWeight: 600 }}>• {k.label}</p>
            </div>
          ))}
        </div>
      )}
      {anakList.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: PJS, marginBottom: 6, textTransform: "uppercase" }}>Daftar Anak:</p>
          {anakList.map(a => (
            <div key={a.id} style={{ padding: "8px 12px", background: CARD, borderRadius: 12, border: `1px solid ${BDR}`, marginBottom: 6 }}>
              <p style={{ fontFamily: IPS, fontSize: 12.5, color: TEXT, fontWeight: 600 }}>• {a.nama} <span style={{ color: MUTED, fontWeight: 400 }}>{a.abk ? `(${a.abk})` : ""}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, fontWeight: 600, textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 700, color: TEXT }}>{value}</p>
      </div>
    </div>
  );
}

