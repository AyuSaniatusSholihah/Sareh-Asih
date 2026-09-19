import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

import {
  T, A, BG, PJS, IPS, UI, type UICtx,
} from "./components/ui-kit";
import {
  seedStudents, StudentsCtx, seedLaporan,
  type Role, type Screen, type Student, type LaporanKirim,
} from "./components/data";
import {
  LandingScreen, RoleSelectScreen, GoogleLoginScreen, ParentCodeScreen,
  AkunGuruModal, ProfilSekolahModal, TambahSiswaPromptModal, type GuruProfile,
} from "./components/auth";
import { AddStudentSheet } from "./components/add-student";
import { ObservationScreen } from "./components/observation";
import { KodeAksesScreen } from "./components/kode-manager";
import {
  ParentDashboard, ParentDetailScreen, ParentCalendarScreen,
  ParentTrainingScreen, LinkCodeModal,
} from "./components/parent";

// Layout components
import {
  StatusBar, SearchOverlay, SettingsSheet, GlobalHeader, BotNav, OnboardingModal,
} from "./components/layout";

// Teacher components
import {
  DashboardGuru, PengamatanPendingScreen, StudentsScreen,
  StudentProfileScreen, TalentMapScreen, TalentMapDetailScreen,
  LearningRecScreen, CompetitionScreen, ReportScreen,
} from "./components/teacher";

import guruIcon from "@/imports/guru-icon.png";
import ortuIcon from "@/imports/ortu-icon.png";

const MAIN_SCREENS: Screen[] = [
  "dashboard", "students", "talent-map", "competition", "report",
  "parent-dashboard", "parent-detail", "parent-calendar", "parent-training",
];

type GuruSetup = null | "akun" | "sekolah" | "siswa";

const DEFAULT_GURU: GuruProfile = {
  nama: "Sari Dewi, S.Pd.",
  email: "sari.dewi@gmail.com",
  sekolah: "SLB N Surakarta",
  jabatan: "",
  noHp: "",
  kelas: [],
  abk: [],
  kelasAbkMap: {},
};

export default function App() {
  // Auth & navigasi
  const [role, setRole] = useState<Role | null>(null);
  const [pendingRole, setPending] = useState<Role>("guru");
  const [screen, setScreen] = useState<Screen>("landing");
  const [tab, setTab] = useState<Screen>("dashboard");

  // Data siswa
  const [agendas, setAgendas] = useState<any[]>([
    { id: 1, type: "sekolah", title: "Pentas Seni Inklusif", date: "2026-08-15", desc: "Acara tahunan sekolah menampilkan bakat siswa." },
    { id: 2, type: "lomba", title: "O2SN Diksus", date: "2026-09-10", desc: "Lomba olahraga bagi PDBK (Bocce, Lari, dll)." }
  ]);

  const [list, setList] = useState<Student[]>(seedStudents);
  const addStudent = (s: Omit<Student, "id">) => {
    const created: Student = { ...s, id: Math.max(0, ...list.map(x => x.id)) + 1 };
    setList(prev => [...prev, created]);
    return created;
  };

  // Guru
  const [laporan, setLaporan] = useState<LaporanKirim[]>(seedLaporan);
  const [guru, setGuru] = useState<GuruProfile>(DEFAULT_GURU);
  const [guruSetup, setGuruSetup] = useState<GuruSetup>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [addFirstTime, setAddFirstTime] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Orang tua
  const [namaOrtu] = useState("Ani Rahmawati");
  const [childId, setChildId] = useState<number | null>(null);
  const [showLinkCode, setShowLinkCode] = useState(false);
  const child = childId !== null ? (list.find(s => s.id === childId) ?? null) : null;

  // Seleksi & UI global
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [fontSize, setFontSize] = useState(1);
  const [tts, setTts] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize * 16}px`);
  }, [fontSize]);

  const go = (s: Screen) => setScreen(s);
  const goTab = (s: Screen) => { setScreen(s); setTab(s); };

  // ── Flow login ──
  const pickRole = (r: Role) => { setPending(r); go("google-login"); };

  const googleSuccess = () => {
    if (pendingRole === "guru") {
      setRole("guru"); setScreen("dashboard"); setTab("dashboard");
      setGuruSetup("akun");
    } else {
      go("parent-code");
    }
  };

  const finishGuruSetup = () => {
    setGuruSetup(null);
    setShowOnboarding(true);
  };

  const enterParent = (linkedId: number | null) => {
    setRole("ortu"); setChildId(linkedId);
    setScreen("parent-dashboard"); setTab("parent-dashboard");
  };

  const handleLogout = () => {
    setRole(null);
    setScreen("landing");
    setGuruSetup(null);
    setShowSettings(false);
  };

  // Demo switcher — lompat langsung tanpa mengulang setup
  const demoSwitch = (r: Role) => {
    setRole(r);
    if (r === "guru") { setGuruSetup(null); setShowOnboarding(false); goTab("dashboard"); }
    else { setChildId(id => id ?? 1); goTab("parent-dashboard"); }
  };

  const logout = () => {
    setRole(null); setGuruSetup(null); setShowOnboarding(false);
    setChildId(null); setScreen("landing");
  };

  const startObs = (id: number) => { setSelectedStudentId(id); go("observation"); };

  const finishObs = (id: number) => {
    setList(prev => prev.map(s => s.id === id
      ? {
        ...s,
        hasObs: true,
        talent: s.talent || "Seni Visual",
        talentScore: s.talentScore || 72,
        stars: s.stars || 4,
        caraBelajar: s.caraBelajar || "Visual & Kinestetik"
      }
      : s));
    setSelectedStudentId(id);
    go("talent-map-detail");
  };

  const openAddStudent = (firstTime = false) => { setAddFirstTime(firstTime); setShowAddStudent(true); };

  /** Guru merangkap peran admin: dialah yang membuat & memperbarui kode orang tua. */
  const regenKode = (id: number) => setList(prev => prev.map(s => {
    if (s.id !== id) return s;
    const seri = Math.random().toString(36).slice(2, 6).toUpperCase();
    return { ...s, kodeOrtu: `ABK-2026-${s.name.split(" ")[0].toUpperCase()}-${seri}` };
  }));

  // Laporan satu arah: guru mengirim, orang tua hanya membaca.
  const kirimLaporan = (studentId: number, isi: string) => setLaporan(prev => [
    ...prev,
    {
      id: Math.max(0, ...prev.map(l => l.id)) + 1,
      studentId, isi,
      judul: `Laporan ${new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`,
      dikirimPada: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      dibaca: false,
    },
  ]);

  const tandaiDibaca = (id: number) => setLaporan(prev => prev.map(l =>
    l.id === id && !l.dibaca
      ? { ...l, dibaca: true, dibacaPada: new Date().toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) }
      : l));

  const buatKode = (ids: number[]) => setList(prev => prev.map(s => {
    if (!ids.includes(s.id)) return s;
    const seri = Math.random().toString(36).slice(2, 6).toUpperCase();
    return { ...s, kodeOrtu: `ABK-2026-${s.name.split(" ")[0].toUpperCase()}-${seri}` };
  }));

  const hapusKode = (ids: number[]) =>
    setList(prev => prev.map(s => ids.includes(s.id) ? { ...s, kodeOrtu: undefined } : s));

  const isMain = MAIN_SCREENS.includes(screen);
  const showNav = !!role && isMain && !guruSetup;

  const goBack = () => {
    if (screen === "kode-akses") goTab("dashboard");
    else if (screen === "pengamatan-pending") goTab("dashboard");
    else if (screen === "profile") goTab("students");
    else if (screen === "observation") go("profile");
    else if (screen === "talent-map-detail") goTab("talent-map");
    else if (screen === "learning-rec") go("profile");
    else if (screen === "parent-detail") goTab("parent-dashboard");
    else if (screen === "google-login") go("role-select");
    else if (screen === "role-select") go("landing");
    else if (screen === "parent-code") go("google-login");
    else goTab(tab);
  };

  const headerTitle = (): [string, string] => {
    switch (screen) {
      case "dashboard": return ["Beranda", `${guru.nama.split(" ")[0]} · ${guru.sekolah}`];
      case "pengamatan-pending": return ["Pengamatan Perlu Diperiksa", "Daftar siswa yang belum dinilai"];
      case "students": return ["Kelas Saya", "Kelola Kelas dengan Mudah"];
      case "talent-map": return ["Peta Bakat", guru.sekolah];
      case "competition": return ["Agenda", "Agenda & Rekomendasi Lomba"];
      case "report": return ["Laporan", "Rekap data siswa & pemetaan bakat"];
      case "parent-dashboard": return ["Beranda", child ? `Orang Tua · ${child.name}` : "Orang Tua · belum terhubung"];
      case "parent-detail": return ["Perkembangan Anak", child ? child.name : "Belum terhubung"];
      case "parent-calendar": return ["Kalender", child ? `Umum + agenda ${guru.sekolah}` : "Kegiatan terbuka untuk umum"];
      case "parent-training": return ["Pelatihan & Terapi", "Info umum layanan terdekat"];
      default: return ["", ""];
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "landing": return <LandingScreen onNext={() => go("role-select")} />;
      case "role-select": return <RoleSelectScreen onPick={pickRole} onBack={() => go("landing")} />;
      case "google-login": return <GoogleLoginScreen role={pendingRole} onBack={() => go("role-select")} onSuccess={googleSuccess} />;
      case "parent-code": return (
        <ParentCodeScreen
          namaOrtu={namaOrtu}
          onBack={() => go("google-login")}
          onLinked={(kode) => {
            const found = list.find(s => s.kodeOrtu?.toUpperCase() === kode);
            enterParent(found ? found.id : 1);
          }}
          onSkip={() => enterParent(null)}
        />
      );

      case "dashboard": return (
        <DashboardGuru
          go={go}
          onStartObs={startObs}
          guru={guru}
          onAddStudent={() => openAddStudent(false)}
          laporan={laporan}
        />
      );
      case "pengamatan-pending": return <PengamatanPendingScreen onBack={goBack} onStartObs={startObs} />;
      case "students": return <StudentsScreen go={go} onAddStudent={() => openAddStudent(false)} onSelect={(id) => { setSelectedStudentId(id); go("profile"); }} guru={guru} />;
      case "profile": return <StudentProfileScreen onBack={goBack} go={go} studentId={selectedStudentId} onStartObs={startObs} onRegenKode={regenKode} namaSekolah={guru.sekolah} laporan={laporan} onKirim={kirimLaporan} />;
      case "kode-akses": return <KodeAksesScreen onBack={goBack} onBuat={buatKode} onHapus={hapusKode} namaSekolah={guru.sekolah} />;
      case "observation": return (
        <ObservationScreen
          onBack={goBack}
          onDone={finishObs}
          onSave={(id) => {
            setList(prev => prev.map(s => s.id === id
              ? {
                ...s,
                hasObs: true,
                talent: s.talent || "Seni Visual",
                talentScore: s.talentScore || 72,
                stars: s.stars || 4,
                caraBelajar: s.caraBelajar || "Visual & Kinestetik"
              }
              : s));
          }}
          studentId={selectedStudentId}
        />
      );
      case "talent-map": return <TalentMapScreen go={go} onStartObs={startObs} onSelect={setSelectedStudentId} />;
      case "talent-map-detail": return <TalentMapDetailScreen onBack={goBack} studentId={selectedStudentId} go={go} />;
      case "learning-rec": return <LearningRecScreen onBack={goBack} studentId={selectedStudentId} />;
      case "competition": return <CompetitionScreen onStartObs={startObs} agendas={agendas} onAddAgenda={(a) => setAgendas([...agendas, a])} />;
      case "report": return <ReportScreen namaSekolah={guru.sekolah} />;

      case "parent-dashboard": return <ParentDashboard go={go} child={child} namaOrtu={namaOrtu} onOpenCode={() => setShowLinkCode(true)} />;
      case "parent-detail": return <ParentDetailScreen onBack={goBack} child={child} onOpenCode={() => setShowLinkCode(true)} laporan={child ? laporan.filter(l => l.studentId === child.id) : []} onBaca={tandaiDibaca} />;
      case "parent-calendar": return <ParentCalendarScreen linked={!!child} sekolah={guru.sekolah} onOpenCode={() => setShowLinkCode(true)} />;
      case "parent-training": return <ParentTrainingScreen go={go} />;
      default: return null;
    }
  };

  const uiCtx: UICtx = {
    fontSize, setFontSize, tts, setTts,
    openSearch: () => setShowSearch(true),
    openSettings: () => setShowSettings(true),
  };

  const [title, sub] = headerTitle();

  return (
    <StudentsCtx.Provider value={{ list, add: addStudent }}>
      <UI.Provider value={uiCtx}>
        <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#EBF3ED", fontFamily: PJS }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 left-16 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: `${T}25` }} />
            <div className="absolute bottom-16 right-16 w-80 h-80 rounded-full opacity-30 blur-3xl" style={{ background: `${A}18` }} />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-5 py-8">
            {/* Demo switcher */}
            {!!role && (
              <div className="flex items-center gap-1 p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.85)", border: `1px solid rgba(91,122,104,0.12)` }}>
                {(["guru", "ortu"] as Role[]).map(r => (
                  <button key={r} onClick={() => demoSwitch(r)} style={{ background: role === r ? T : "transparent", color: role === r ? "#fff" : "#6B8070", fontFamily: IPS, minHeight: 38 }} className="px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                    <img src={r === "guru" ? guruIcon : ortuIcon} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                    {r === "guru" ? "Guru" : "Orang Tua"}
                  </button>
                ))}
                <button onClick={logout} style={{ minWidth: 36, minHeight: 38, color: "#6B8070" }} className="flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors" title="Keluar">
                  <LogOut size={14} />
                </button>
              </div>
            )}

            {/* Phone frame */}
            <div style={{
              width: 393, height: 852, background: BG, borderRadius: 47,
              display: "flex", flexDirection: "column", overflow: "hidden",
              boxShadow: "0 40px 80px rgba(91,122,104,0.22), 0 0 0 8px #1A1F23, 0 0 0 9.5px #2E3438",
              position: "relative",
            }}>
              {/* Notch */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 126, height: 34, background: "#1A1F23", borderRadius: "0 0 20px 20px", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2E3438" }} />
                <div style={{ width: 48, height: 6, borderRadius: 3, background: "#2E3438" }} />
              </div>

              {screen !== "landing" && (
                <div style={{ background: "#FFFFFF", paddingTop: 36, flexShrink: 0 }}>
                  <StatusBar />
                </div>
              )}
              {/* Content */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: BG, position: "relative", fontSize: `${fontSize}rem` }}>
                {showNav && screen !== "dashboard" && screen !== "students" && screen !== "talent-map" && screen !== "report" && (
                  <GlobalHeader
                    title={title}
                    sub={sub}
                    onProfile={() => {
                      if (list.length > 0) {
                        setSelectedStudentId(list[0].id);
                        go("profile");
                      }
                    }}
                  />
                )}
                {renderScreen()}

                {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
                {showSettings && <SettingsSheet onClose={() => setShowSettings(false)} onLogout={handleLogout} role={role} />}

                {/* Modal orang tua: kode akses */}
                {showLinkCode && (
                  <LinkCodeModal
                    students={list}
                    onClose={() => setShowLinkCode(false)}
                    onLinked={(s) => { setChildId(s.id); setShowLinkCode(false); goTab("parent-detail"); }}
                  />
                )}

                {/* Pop-up setup guru bertahap */}
                {guruSetup === "akun" && (
                  <AkunGuruModal
                    profile={guru}
                    onClose={() => setGuruSetup(null)}
                    onNext={(p) => { setGuru(g => ({ ...g, ...p })); setGuruSetup("sekolah"); }}
                  />
                )}
                {guruSetup === "sekolah" && (
                  <ProfilSekolahModal
                    profile={guru}
                    onClose={() => setGuruSetup(null)}
                    onBack={() => setGuruSetup("akun")}
                    onNext={(p) => { setGuru(g => ({ ...g, ...p })); setGuruSetup("siswa"); }}
                  />
                )}
                {guruSetup === "siswa" && (
                  <TambahSiswaPromptModal
                    sekolah={guru.sekolah}
                    jumlahKelas={guru.kelas.length}
                    kelasAbkMap={guru.kelasAbkMap}
                    teacher={guru.nama}
                    onClose={() => setGuruSetup(null)}
                    onBack={() => setGuruSetup("sekolah")}
                    onSaveManual={(s) => {
                      addStudent({
                        name: s.name,
                        abk: s.abk || "Belum Ditentukan",
                        kelas: s.kelas,
                        age: s.age,
                        emoji: s.emoji,
                        talent: "", talentScore: 0, stars: 0,
                        teacher: guru.nama,
                        hasObs: false, comps: [],
                        kodeOrtu: undefined,
                        caraBelajar: "",
                        komunikasi: "", motorik: "",
                        tingkatDukungan: "",
                        rentang: "", minat: "", terapi: "",
                      });
                      // Tidak langsung finishGuruSetup — modal handle kembali ke choice screen
                    }}
                    onImportSiswa={(importedSiswa) => {
                      const kelasKeys = guru.kelas.length ? guru.kelas : Object.keys(guru.kelasAbkMap);
                      const defaultKelas = kelasKeys[0] || "VII A";
                      importedSiswa.forEach((s, idx) => {
                        const emoji = ["👦", "👧", "🧑"][idx % 3];
                        const targetKelas = s.kelas || defaultKelas;
                        addStudent({
                          name: s.nama,
                          abk: s.abk || guru.kelasAbkMap[targetKelas] || "Belum Ditentukan",
                          kelas: targetKelas,
                          age: 0,
                          emoji,
                          talent: "", talentScore: 0, stars: 0,
                          teacher: guru.nama,
                          hasObs: false, comps: [],
                          kodeOrtu: undefined,
                          caraBelajar: "",
                          komunikasi: "", motorik: "",
                          tingkatDukungan: "",
                          rentang: "", minat: "", terapi: "",
                        });
                      });
                    }}
                    onDone={finishGuruSetup}
                  />
                )}

                {/* Sheet tambah siswa */}
                {showAddStudent && (
                  <AddStudentSheet
                    teacher={guru.nama}
                    kelasAbkMap={Object.keys(guru.kelasAbkMap ?? {}).length ? guru.kelasAbkMap : DEFAULT_GURU.kelasAbkMap}
                    firstTime={addFirstTime}
                    savedCount={list.length}
                    onSave={addStudent}
                    onClose={() => {
                      setShowAddStudent(false);
                      if (addFirstTime) { setAddFirstTime(false); finishGuruSetup(); }
                    }}
                    onBack={() => {
                      setShowAddStudent(false);
                      if (addFirstTime) { setGuruSetup("sekolah"); }
                    }}
                  />
                )}
              </div>

              {showNav && <BotNav role={role!} screen={screen} go={goTab} />}

              {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} goTab={goTab} />}
            </div>

            <p className="text-xs font-semibold" style={{ color: T, fontFamily: IPS, opacity: 0.8 }}>Sareh Asih · GEMASTIK XVII · UX Design</p>
          </div>
        </div>
      </UI.Provider>
    </StudentsCtx.Provider>
  );
}
