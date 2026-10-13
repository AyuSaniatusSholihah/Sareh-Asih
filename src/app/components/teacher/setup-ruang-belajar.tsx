import { useState, useContext } from "react";
import {
  ArrowLeft, CheckCircle, School, Plus, XCircle, User, ChevronRight,
  BookOpen, Home,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM,
  Field, PBtn,
} from "../ui-kit";
import { type Student, StudentsCtx } from "../data";
import { type GuruProfile } from "../auth/akun-guru";
import { SLBSearchInput } from "../auth/slb-search";
import {
  type TeacherRole, TEACHER_ROLE_OPTIONS, KEKHUSUSAN_DESCRIPTIVE,
} from "../role-labels";
import { PilihanTambahSiswa, AddStudentSheet } from "../add-student";

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

// ─── Main Setup Component ─────────────────────────────────────────────
export function SetupRuangBelajar({
  guru,
  onBack,
  onDone,
  onSaveStudent,
}: {
  guru: GuruProfile;
  onBack: () => void;
  onDone: (result: {
    teacherRole: TeacherRole;
    sekolah: string;
    namaRuangBelajar: string;
    kelas: string[];
    kelasAbkMap: Record<string, string>;
    kelasKekhususanList: string[];
    anakList: Student[];
  }) => void;
  onSaveStudent?: (s: Omit<Student, "id">) => void;
}) {
  const [step, setStep] = useState(1);
  const studentsStore = useContext(StudentsCtx);

  // Step 1 — Peran
  const [selectedRole, setSelectedRole] = useState<TeacherRole | null>(guru.teacherRole || null);

  // Step 2 — Tempat mengajar
  const [sekolah, setSekolah] = useState(guru.sekolah || "");
  const [namaRuangBelajar, setNamaRuangBelajar] = useState(guru.namaRuangBelajar || "Ruang Belajar Saya");

  // Step 3 — SLB/GPK: single class config
  const [kategoriRombel, setKategoriRombel] = useState<"reguler" | "vokasional">("reguler");
  const [jenjang, setJenjang] = useState<"SDLB" | "SMPLB" | "SMALB">("SMPLB");
  const [tingkat, setTingkat] = useState("7");
  const [selectedKekhususan, setSelectedKekhususan] = useState<string[]>([]);

  // Step 3 (homeschool) / Step 4 (SLB/GPK): siswa yang ditambahkan
  const [savedStudents, setSavedStudents] = useState<Student[]>([]);
  const [activeAddModal, setActiveAddModal] = useState<"choice" | "db-sekolah" | "upload" | "identitas" | null>(null);

  // ── Derived ──
  // SLB/GPK: 4 steps (Peran → Tempat → Kelas → Siswa)
  // Homeschool: 3 steps (Peran → Ruang Belajar → Anak)
  const isHomeschool = selectedRole === "homeschool";
  const totalSteps = isHomeschool ? 3 : 4;
  const roleName = TEACHER_ROLE_OPTIONS.find(r => r.value === selectedRole)?.label || selectedRole || "";

  const kelasLabel = `Kelas ${tingkat}`;

  const selectedKekhususanAbk = selectedKekhususan.map(kode => {
    const info = KEKHUSUSAN_LIST.find(k => k.kode === kode);
    return info?.abk || kode;
  });

  const kelasAbkMapForAdd: Record<string, string> = {};
  if (!isHomeschool) {
    kelasAbkMapForAdd[kelasLabel] = selectedKekhususanAbk.join(", ");
  } else {
    kelasAbkMapForAdd[namaRuangBelajar || "Ruang Belajar Saya"] = "Umum";
  }

  // ── Helpers ──
  const canStep2 = () => {
    if (!selectedRole) return false;
    if (selectedRole === "guru_slb") return sekolah.trim() !== "";
    if (selectedRole === "gpk") return sekolah.trim() !== "";
    return true;
  };

  // Step 3 for SLB/GPK = kelas must have minimal 1 kekhususan selected
  const canStep3Kelas = () => selectedKekhususan.length > 0;

  const handleSaveStudent = async (studentData: Omit<Student, "id">) => {
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const created: Student = { ...studentData, id: newId };
    setSavedStudents(prev => [...prev, created]);
    if (onSaveStudent) {
      onSaveStudent(studentData);
    } else if (studentsStore?.add) {
      try {
        await studentsStore.add(studentData);
      } catch (e) {
        console.error("Gagal simpan siswa:", e);
      }
    }
  };

  const handleDone = () => {
    if (savedStudents.length === 0) return;

    const kelasAbkMap: Record<string, string> = {};
    if (!isHomeschool) {
      kelasAbkMap[kelasLabel] = selectedKekhususanAbk.join(", ");
    }

    onDone({
      teacherRole: selectedRole!,
      sekolah: isHomeschool ? "" : sekolah,
      namaRuangBelajar: isHomeschool ? (namaRuangBelajar || "Ruang Belajar Saya") : "",
      kelas: isHomeschool ? [] : [kelasLabel],
      kelasAbkMap,
      kelasKekhususanList: isHomeschool ? [] : [...selectedKekhususanAbk],
      anakList: savedStudents,
    });
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step === 1) { onBack(); return; }
    setStep(s => s - 1);
  };

  // Which step is the "anak" step?
  const anakStep = isHomeschool ? 3 : 4;
  // Which step is the "kelas" step? (only for SLB/GPK)
  const kelasStep = 3;

  // ── Step indicator (SATU indikator: garis segmen saja) ──
  const StepIndicator = () => (
    <div style={{ display: "flex", gap: 6, padding: "10px 20px 6px" }}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i + 1 <= step ? T : "rgba(91,122,104,0.18)",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );

  // ── Determine current step content ──
  const isKelasStep = !isHomeschool && step === kelasStep;
  const isAnakStep = step === anakStep;

  // ────────────────── RENDER ──────────────────
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: BG, fontFamily: IPS, overflow: "hidden" }}>
      {/* ── Header (SATU indikator langkah dipakai: hanya garis segmen di bawah header) ── */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 12px", flexShrink: 0, borderBottom: `1px solid rgba(91,122,104,0.10)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={prevStep}
            style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(139,176,152,0.14)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1B2E24", flexShrink: 0 }}
            className="active:scale-95 transition-transform"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>
              Setup Ruang Belajar
            </h1>
          </div>
        </div>
      </div>

      {/* Indikator progress: garis segmen */}
      <StepIndicator />

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 100px" }}>
        {step === 1 && <Step1PickRole selected={selectedRole} onSelect={setSelectedRole} />}
        {step === 2 && <Step2Place role={selectedRole!} sekolah={sekolah} onSekolah={setSekolah} namaRuang={namaRuangBelajar} onNamaRuang={setNamaRuangBelajar} />}

        {/* SLB/GPK step 3: single class with multi-kekhususan */}
        {isKelasStep && (
          <Step3SingleClass
            kategoriRombel={kategoriRombel} onKategoriRombel={setKategoriRombel}
            jenjang={jenjang} onJenjang={j => { setJenjang(j); setTingkat(JENJANG_MAP[j].tingkats[0]); }}
            tingkat={tingkat} onTingkat={setTingkat}
            kekhususan={selectedKekhususan} onKekhususan={setSelectedKekhususan}
          />
        )}

        {/* Langkah 4 (SLB/GPK) atau Langkah 3 (Homeschool): Tambah Siswa pakai 3 Cara */}
        {isAnakStep && (
          <div>
            {/* Ringkasan kecil di atas */}
            <div style={{ background: SEC, borderRadius: 16, padding: "10px 14px", border: `1.5px solid ${BDR}`, marginBottom: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: IPS }}>
                  {isHomeschool
                    ? `${roleName} · ${namaRuangBelajar || "Ruang Belajar Saya"}`
                    : `${roleName} · ${sekolah || "—"} · ${kelasLabel}`}
                </span>
              </div>
              {!isHomeschool && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  {selectedKekhususanAbk.slice(0, 3).map(abk => (
                    <span key={abk} style={{ fontSize: 10, fontWeight: 600, fontFamily: IPS, padding: "2px 7px", borderRadius: 6, background: CARD, color: DEEP, border: `1px solid ${BDR}` }}>
                      {abk}
                    </span>
                  ))}
                  {selectedKekhususanAbk.length > 3 && (
                    <span style={{ fontSize: 10, fontWeight: 600, fontFamily: IPS, padding: "2px 7px", borderRadius: 6, background: CARD, color: DEEP, border: `1px solid ${BDR}` }}>
                      +{selectedKekhususanAbk.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Penghitung kecil jumlah siswa ditambahkan */}
            {savedStudents.length > 0 && (
              <div style={{ background: "#E8F5E9", border: "1.5px solid #A5D6A7", borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <CheckCircle size={18} style={{ color: "#2E7D32", flexShrink: 0 }} />
                <p style={{ margin: 0, fontFamily: PJS, fontWeight: 700, fontSize: 13, color: "#1B5E20" }}>
                  {savedStudents.length} {isHomeschool ? "anak" : "siswa"} ditambahkan
                </p>
              </div>
            )}

            <h2 style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, color: TEXT, marginBottom: 4 }}>
              {isHomeschool ? "Tambah Anak Didik" : "Tambah Siswa (PDBK)"}
            </h2>
            <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 1.5 }}>
              {isHomeschool
                ? "Pilih cara menambahkan anak didik ke ruang belajarmu. Minimal 1 anak untuk menyelesaikan setup."
                : `Pilih cara menambahkan siswa ke ${kelasLabel}. Minimal 1 siswa untuk menyelesaikan setup.`}
            </p>

            {/* Komponen 3 Cara yang Sudah Ada */}
            <PilihanTambahSiswa
              onSelectDbSekolah={() => setActiveAddModal("db-sekolah")}
              onSelectUpload={() => setActiveAddModal("upload")}
              onSelectManual={() => setActiveAddModal("identitas")}
              isHomeschool={isHomeschool}
              showTips={false}
            />

            {/* Modal Sheet Tambah Siswa Terintegrasi */}
            {activeAddModal && (
              <AddStudentSheet
                teacher={guru.nama}
                kelasAbkMap={kelasAbkMapForAdd}
                targetKelas={isHomeschool ? (namaRuangBelajar || "Ruang Belajar Saya") : kelasLabel}
                isHomeschool={isHomeschool}
                initialStep={activeAddModal}
                onClose={() => setActiveAddModal(null)}
                onSave={handleSaveStudent}
              />
            )}
          </div>
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
        {isKelasStep && (
          <>
            {!canStep3Kelas() && (
              <p style={{ fontSize: 11.5, color: MUTED, fontFamily: IPS, textAlign: "center", marginBottom: 8, fontWeight: 500 }}>
                Pilih minimal 1 kekhususan untuk lanjut
              </p>
            )}
            <PBtn label="Lanjut" full disabled={!canStep3Kelas()} onClick={nextStep} />
          </>
        )}
        {isAnakStep && (
          <>
            {savedStudents.length === 0 && (
              <p style={{ fontSize: 11.5, color: MUTED, fontFamily: IPS, textAlign: "center", marginBottom: 8, fontWeight: 500 }}>
                Tambahkan minimal 1 {isHomeschool ? "anak" : "siswa"} untuk selesai
              </p>
            )}
            <PBtn label="Selesai ✓" full disabled={savedStudents.length < 1} onClick={handleDone} />
          </>
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

// ────────────────── STEP 3: SINGLE CLASS (SLB/GPK) ──────────────────
function Step3SingleClass({
  kategoriRombel, onKategoriRombel,
  jenjang, onJenjang, tingkat, onTingkat,
  kekhususan, onKekhususan,
}: {
  kategoriRombel: "reguler" | "vokasional"; onKategoriRombel: (k: "reguler" | "vokasional") => void;
  jenjang: "SDLB" | "SMPLB" | "SMALB"; onJenjang: (j: "SDLB" | "SMPLB" | "SMALB") => void;
  tingkat: string; onTingkat: (t: string) => void;
  kekhususan: string[]; onKekhususan: (ks: string[]) => void;
}) {
  return (
    <div>
      <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: TEXT, marginBottom: 4 }}>Atur Kelas</h2>
      <p style={{ fontFamily: IPS, fontSize: 13, color: MUTED, marginBottom: 14, lineHeight: 1.5 }}>
        Pilih jenjang, tingkat kelas, dan jenis kekhususan. Satu kelas bisa menampung beberapa jenis kekhususan.
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

      {/* Kekhususan (multi-select checkbox) */}
      <p style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: PJS, marginBottom: 6, textTransform: "uppercase" }}>
        Jenis Kekhususan <span style={{ fontWeight: 400, color: MUTED, textTransform: "none" }}>(pilih semua yang ada di kelas ini)</span>
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
              {on ? <CheckCircle size={16} style={{ color: T, flexShrink: 0 }} /> : <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${BDR}`, flexShrink: 0 }} />}
              <span style={{ fontFamily: IPS, fontSize: 12.5, color: on ? DEEP : TEXT, fontWeight: on ? 700 : 500 }}>
                {k.nama}
              </span>
            </button>
          );
        })}
      </div>

      {/* Preview Kelas */}
      {kekhususan.length > 0 && (
        <div style={{ marginTop: 14, padding: "12px 14px", background: SEC, borderRadius: 16, border: `1.5px solid ${BDR}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: DEEP, fontFamily: PJS, marginBottom: 4, textTransform: "uppercase" }}>Preview Kelas</p>
          <p style={{ fontFamily: PJS, fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Kelas {tingkat}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {kekhususan.map(kode => {
              const info = KEKHUSUSAN_LIST.find(k => k.kode === kode);
              return (
                <span key={kode} style={{ fontSize: 10.5, fontWeight: 600, fontFamily: IPS, padding: "2px 8px", borderRadius: 8, background: CARD, color: DEEP, border: `1px solid ${BDR}` }}>
                  {info?.abk || kode}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
