import { useState, useEffect, useCallback, useRef } from "react";
import { LogOut } from "lucide-react";
import {
  saveStudentToFirestore,
  loadStudentsFromFirestore,
  updateStudentInFirestore,
} from "./components/firestore-students";

import {
  T, A, BG, PJS, IPS, UI, type UICtx,
} from "./components/ui-kit";
import {
  seedStudents, StudentsCtx, seedLaporan, kodeOrtuBaru,
  type Role, type Screen, type Student, type LaporanKirim, type FungsionalKategori,
} from "./components/data";
import {
  LandingScreen, RoleSelectScreen, GoogleLoginScreen, ParentCodeScreen,
  AkunGuruModal, KonfirmasiAkunScreen, type GuruProfile,
} from "./components/auth";
import { AddStudentSheet } from "./components/add-student";
import { ObservationScreen } from "./components/observation";
import { KodeAksesScreen } from "./components/kode-manager";
import {
  ParentDashboard, ParentDetailScreen, ParentCalendarScreen,
  ParentTrainingScreen, LinkCodeModal, RiwayatLaporanScreen, PerkembanganScreen, AspekDetailScreen, KemampuanDiamatiScreen,
  KonsultasiGuruScreen, SaranRumahScreen,
} from "./components/parent";
import { NotificationScreen } from "./components/notification-screen";

// Layout components
import {
  StatusBar, SearchOverlay, SettingsSheet, GlobalHeader, BotNav,
  CoachMark, COACH_MARKS, isCoachSeen, markCoachSeen, type CoachRect,
  ProfileSheet, ParentNotificationSheet,
} from "./components/layout";


// Teacher components
import {
  DashboardGuru, AsesmenPendingScreen, StudentsScreen,
  StudentProfileScreen, TalentMapScreen, TalentMapDetailScreen,
  LearningRecScreen, CompetitionScreen, ReportScreen, AsesmenCustomScreen,
  PilihAsesmenScreen, RiwayatAsesmenScreen,
  SetupRuangBelajar, type AddedAnak,
} from "./components/teacher";
import type { TeacherRole } from "./components/role-labels";

import guruIcon from "@/imports/guru-icon.png";
import ortuIcon from "@/imports/ortu-icon.png";

const MAIN_SCREENS: Screen[] = [
  "dashboard", "students", "talent-map", "competition", "report",
  "parent-dashboard", "parent-detail", "parent-calendar", "parent-training",
];

type GuruSetup = null | "akun";

const DEFAULT_GURU: GuruProfile = {
  nama: "Sari Dewi, S.Pd.",
  email: "sari.dewi@gmail.com",
  sekolah: "SLB Negeri 1 Surabaya",
  jabatan: "Guru Kelas / Wali Kelas",
  noHp: "081234567890",
  kelas: ["VII A", "VIII B"],
  abk: ["Tunadaksa", "Autisme", "Tunagrahita"],
  kelasAbkMap: { "VII A": "Tunadaksa", "VIII B": "Autisme" },
  setupDone: true,
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 500);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 500);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();
  const [role, setRole] = useState<Role | null>(null);
  const [pendingRole, setPending] = useState<Role>("guru");
  const [screen, setScreen] = useState<Screen>("landing");
  const [tab, setTab] = useState<Screen>("dashboard");
  const [screenHistory, setScreenHistory] = useState<Screen[]>([]);

  const [list, setList] = useState<Student[]>(() => seedStudents.map(s => ({ ...s })));
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const fromDB = await loadStudentsFromFirestore();
        if (fromDB.length > 0) {
          setList(prev => {
            const tergabung = new Map<number, Student>(prev.map(s => [s.id, s]));
            fromDB.forEach(s => {
              if (s.id <= 8) tergabung.set(s.id, s);
            });
            return Array.from(tergabung.values()).filter(s => s.id <= 8).sort((a, b) => a.id - b.id);
          });
        }
      } catch (err) {
        console.error("Gagal memuat data siswa:", err);
      } finally {
        setIsLoadingStudents(false);
      }
    }
    loadStudents();
  }, []);

  const addStudent = useCallback(async (s: Omit<Student, "id">) => {
    const newId = Math.max(0, ...list.map(x => x.id)) + 1;
    const created: Student = { ...s, id: newId };
    setList(prev => [...prev, created]);
    try {
      await saveStudentToFirestore(created);
    } catch (err) {
      console.error("Gagal menyimpan siswa baru ke database:", err);
    }
    return created;
  }, [list]);

  const [laporan, setLaporan] = useState<LaporanKirim[]>(seedLaporan);
  const [guru, setGuru] = useState<GuruProfile>(DEFAULT_GURU);
  const [guruSetup, setGuruSetup] = useState<GuruSetup>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [addFirstTime, setAddFirstTime] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const [coach, setCoach] = useState<{ def: (typeof COACH_MARKS)[number]; rect: CoachRect } | null>(null);
  // Navigasi yang dipicu klik user (tab/kartu/kembali) — coach mark hanya muncul untuk ini
  const [navClick, setNavClick] = useState<{ seq: number; screen: Screen } | null>(null);
  const noteClick = (s: Screen) => setNavClick(prev => ({ seq: (prev?.seq ?? 0) + 1, screen: s }));

  const [namaOrtu] = useState("Ani Rahmawati");
  const [childId, setChildId] = useState<number | null>(null);
  const [childIds, setChildIds] = useState<number[]>([]);
  const [showLinkCode, setShowLinkCode] = useState(false);
  const child = childId !== null ? (list.find(s => s.id === childId) ?? null) : null;
  const anakTerkirim = list.filter(s => childIds.includes(s.id));

  const linkChild = (id: number) => {
    setChildIds(prev => (prev.includes(id) ? prev : [...prev, id]));
    setChildId(id);
  };

  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [aspekTerpilih, setAspekTerpilih] = useState<FungsionalKategori>("Kognisi");
  const [fontSize, setFontSize] = useState(1);
  const [tts, setTts] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [reportInitialView, setReportInitialView] = useState<"main" | "detail" | "web-connect">("main");
  const isAnyModalOpen = showSettings || showSearch || showProfile || showNotifications || showLinkCode || showAddStudent || !!coach;

  const handleOpenWebConnect = () => {
    setShowSettings(false);
    setShowProfile(false);
    setReportInitialView("web-connect");
    setScreenHistory(prev => [...prev, screen]);
    setScreen("report");
    setTab("report");
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize * 16}px`);
  }, [fontSize]);

  const go = (s: Screen) => {
    setScreenHistory(prev => [...prev, screen]);
    setScreen(s);
    noteClick(s);
  };
  const goTab = (s: Screen) => {
    setScreenHistory(prev => [...prev, screen]);
    setScreen(s);
    setTab(s);
    noteClick(s);
    if (s === "report") {
      setReportInitialView("main");
    }
  };

  const pickRole = (r: Role) => { setPending(r); go("google-login"); };

  const googleSuccess = () => {
    if (pendingRole === "guru") {
      // Arahkan ke full page konfirmasi akun untuk mencegah human error
      go("konfirmasi-akun");
    } else {
      go("parent-code");
    }
  };

  const finishGuruSetup = () => {
    setGuruSetup(null);
  };

  const enterParent = (linkedId: number | null) => {
    setRole("ortu"); setChildId(linkedId); setChildIds(linkedId ? [linkedId] : []);
    setScreen("parent-dashboard"); setTab("parent-dashboard");
  };

  const handleLogout = () => {
    setRole(null);
    setScreen("landing");
    setGuruSetup(null);
    setShowSettings(false);
    setChildId(null);
    setChildIds([]);
    setScreenHistory([]);
  };

  const demoSwitch = (r: Role) => {
    setRole(r);
    setScreenHistory([]);
    if (r === "guru") {
      setGuruSetup(null);
      setGuru({
        nama: "Sari Dewi, S.Pd.",
        email: "sari.dewi@gmail.com",
        sekolah: "SLB Negeri 1 Surakarta",
        jabatan: "Guru Kelas / Wali Kelas",
        noHp: "081234567890",
        kelas: ["Kelas VI A"],
        abk: ["Tunanetra"],
        kelasAbkMap: { "Kelas VI A": "Tunanetra" },
        setupDone: true,
      });
      setList(seedStudents.map(s => ({ ...s })));
      setScreen("dashboard");
      setTab("dashboard");
    }
    else {
      const id = childId ?? 1;
      setChildId(id);
      setChildIds(prev => (prev.length ? prev : [id]));
      setScreen("parent-dashboard");
      setTab("parent-dashboard");
    }
  };

  const logout = () => {
    setRole(null); setGuruSetup(null);
    setChildId(null); setChildIds([]); setScreen("landing"); setScreenHistory([]);
  };

  const startObs = (id: number) => { setSelectedStudentId(id); go("observation"); };

  const finishObs = (id: number) => {
    setList(prev => prev.map(s => s.id === id
      ? { ...s, hasObs: true, obsStatus: "completed", caraBelajar: s.caraBelajar || "Visual & Kinestetik" }
      : s));
    updateStudentInFirestore(id, {
      hasObs: true,
      obsStatus: "completed",
      caraBelajar: list.find(s => s.id === id)?.caraBelajar || "Visual & Kinestetik"
    }).catch(err => console.error("Gagal update hasObs:", err));
    try { localStorage.removeItem(`assessment_draft_${id}`); } catch (e) {}
    setSelectedStudentId(id);
    go("talent-map-detail");
  };

  const updateStudent = useCallback((id: number, updates: Partial<Student>) => {
    setList(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    updateStudentInFirestore(id, updates).catch(err => console.error("Gagal update student:", err));
  }, []);

  const openAddStudent = (firstTime = false) => { setAddFirstTime(firstTime); setShowAddStudent(true); };

  const regenKode = (id: number) => setList(prev => prev.map(s => {
    if (s.id !== id) return s;
    const seri = Math.random().toString(36).slice(2, 6).toUpperCase();
    const newKode = kodeOrtuBaru(s.name, s.kelas, 2026, seri);
    updateStudentInFirestore(id, { kodeOrtu: newKode })
      .catch(err => console.error("Gagal update kodeOrtu:", err));
    return { ...s, kodeOrtu: newKode };
  }));

  const kirimLaporan = (studentId: number, isi: string) => setLaporan(prev => [
    ...prev,
    {
      id: Math.max(0, ...prev.map(l => l.id)) + 1,
      studentId, isi,
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
    return { ...s, kodeOrtu: kodeOrtuBaru(s.name, s.kelas, 2026, seri) };
  }));

  const hapusKode = (ids: number[]) =>
    setList(prev => prev.map(s => ids.includes(s.id) ? { ...s, kodeOrtu: undefined } : s));

  const isMain = MAIN_SCREENS.includes(screen);
  const showNav = !!role && isMain && !guruSetup;

  // ── Coach mark: ukur target, pilih kandidat, dan tutup ─────────────────
  const measureTarget = (target: string): CoachRect | null => {
    const frame = frameRef.current;
    if (!frame) return null;
    const el = frame.querySelector<HTMLElement>(`[data-cm="${target}"]`);
    if (!el) return null;
    const t = el.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    return {
      x: t.left - f.left, y: t.top - f.top, w: t.width, h: t.height,
      frameW: f.width, frameH: f.height,
    };
  };

  const coachEligible = (def: (typeof COACH_MARKS)[number]) => {
    if (role !== def.role || screen !== def.screen) return false;
    // Coach beranda tampil saat awal masuk; lainnya hanya bila user mengeklik halaman/tab ini
    if (!def.entry && (!navClick || navClick.screen !== screen)) return false;
    if (isCoachSeen(def.id)) return false;
    // Antrean: satu per satu — coach sebelumnya di layar yang sama harus sudah dilihat
    const idx = COACH_MARKS.indexOf(def);
    const adaSebelumnyaYangBelum = COACH_MARKS.slice(0, idx).some(c =>
      c.role === def.role && c.screen === def.screen && !isCoachSeen(c.id)
    );
    if (adaSebelumnyaYangBelum) return false;
    if (def.id === "guru_tambah_siswa" && list.length > 0) return false;
    if (def.id === "guru_laporan" && reportInitialView !== "main") return false;
    return true;
  };

  const closeCoach = () => {
    if (coach) markCoachSeen(coach.def.id);
    setCoach(null);
  };

  // User mengeklik halaman/tab → tampilkan coach mark-nya (sekali, maksimal 1 per layar)
  useEffect(() => {
    if (coach) return;
    const def = COACH_MARKS.find(coachEligible);
    if (!def) return;
    const el = frameRef.current?.querySelector<HTMLElement>(`[data-cm="${def.target}"]`);
    if (!el) return;
    el.scrollIntoView({ block: "nearest" });
    const raf = requestAnimationFrame(() => {
      const rect = measureTarget(def.target);
      if (rect) setCoach({ def, rect });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, screen, navClick, coach, list.length, reportInitialView]);

  // Sinkronkan ring/bubble saat scroll/resize; tutup bila target hilang
  useEffect(() => {
    if (!coach) return;
    const update = () => {
      const rect = measureTarget(coach.def.target);
      if (!rect) { setCoach(null); return; }
      setCoach(c => (c ? { ...c, rect } : c));
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coach?.def.id, screen]);

  const goBack = () => {
    if (screenHistory.length === 0) return;
    const history = [...screenHistory];
    const last = history.pop()!;
    const isTabScreen = MAIN_SCREENS.includes(last);
    setScreenHistory(history);
    setScreen(last);
    if (isTabScreen) setTab(last);
    noteClick(last);
  };

  const headerTitle = (): [string, string] => {
    switch (screen) {
      case "dashboard": return ["Beranda", `${guru.nama.split(" ")[0]} · ${guru.sekolah}`];
      case "asesmen-pending": return ["Asesmen Perlu Diperiksa", "Daftar siswa yang belum dinilai"];
      case "students": return ["Kelas Saya", "Kelola Siswa dengan Mudah"];
      case "talent-map": return ["Peta Bakat", guru.sekolah];
      case "competition": return ["Agenda Lomba", ""];
      case "report": return ["Laporan", "Rekap data siswa & hasil pemetaannya"];
      case "parent-dashboard": return ["Beranda ♡", child ? `Orang Tua · ${child.name}` : "Orang Tua · belum terhubung"];
      case "parent-detail": return ["Perkembangan Anak", child ? child.name : "Belum terhubung"];
      case "parent-calendar": return ["Kalender", "Kegiatan terbuka untuk umum"];
      case "parent-training": return ["Pelatihan & Terapi", "Info umum layanan terdekat"];
      case "saran-rumah": return ["Saran Guru untuk di Rumah", child ? `Aktivitas pendukung ${child.name.split(" ")[0]}` : "Aktivitas di rumah"];
      case "notifikasi": return ["Notifikasi", ""];
      default: return ["", ""];
    }
  };

  // Handler onDone dari halaman Setup Ruang Belajar
  const handleSetupDone = (result: {
    teacherRole: TeacherRole;
    sekolah: string;
    namaRuangBelajar: string;
    kelas: string[];
    kelasAbkMap: Record<string, string>;
    kelasKekhususanList?: string[];
    anakList: Student[];
  }) => {
    const cleanKelas = (result.kelas || []).map(k => k.trim()).filter(Boolean);
    const cleanMap: Record<string, string> = {};
    (result.kelasAbkMap ? Object.entries(result.kelasAbkMap) : []).forEach(([k, v]) => {
      if (k.trim()) cleanMap[k.trim()] = v;
    });
    setGuru(g => ({
      ...g,
      sekolah: result.sekolah || g.sekolah,
      namaRuangBelajar: result.namaRuangBelajar || g.namaRuangBelajar,
      kelas: cleanKelas.length > 0 ? cleanKelas : g.kelas,
      kelasAbkMap: Object.keys(cleanMap).length > 0 ? cleanMap : g.kelasAbkMap,
      teacherRole: result.teacherRole,
      kelasKekhususan: result.kelasKekhususanList || [],
      setupDone: true,
    }));

    if (result.anakList && result.anakList.length > 0) {
      setList(result.anakList);
      result.anakList.forEach(s => {
        saveStudentToFirestore(s).catch(err => console.error("Gagal simpan siswa:", err));
      });
    }

    setScreen("students");
    setTab("students");
  };

  const renderScreen = () => {
    switch (screen) {
      case "landing": return <LandingScreen onNext={() => go("role-select")} />;
      case "role-select": return <RoleSelectScreen onPick={pickRole} onBack={() => go("landing")} />;
      case "google-login": return <GoogleLoginScreen role={pendingRole} onBack={() => go("role-select")} onSuccess={googleSuccess} />;
      case "konfirmasi-akun": return (
        <KonfirmasiAkunScreen
          profile={guru}
          onBack={goBack}
          onNext={(p) => {
            setGuru(g => ({ ...g, ...p, setupDone: true }));
            setRole("guru");
            setScreen("dashboard");
            setTab("dashboard");
          }}
        />
      );
      case "parent-code": return (
        <ParentCodeScreen
          namaOrtu={namaOrtu}
          onBack={() => go("google-login")}
          onLinked={(kode) => {
            const found = list.find(s => s.kodeOrtu?.toUpperCase() === kode);
            return found ? { id: found.id, nama: found.name.split(" ")[0] } : null;
          }}
          onEnter={(id) => enterParent(id)}
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
      case "asesmen-pending": return <AsesmenPendingScreen onBack={goBack} onStartObs={startObs} />;

      // Tab Siswa: State A (empty) atau State C (daftar siswa). Setup dilakukan di sini.
      case "students": return (
        <StudentsScreen
          go={go}
          onAddStudent={() => openAddStudent(false)}
          onSelect={(id) => { setSelectedStudentId(id); go("profile"); }}
          guru={guru}
        />
      );

      // Halaman full page Setup Ruang Belajar (State B) — bukan bottom sheet
      case "setup-ruang-belajar": return (
        <SetupRuangBelajar
          guru={guru}
          onBack={goBack}
          onDone={handleSetupDone}
          onSaveStudent={addStudent}
        />
      );

      case "profile": return <StudentProfileScreen onBack={goBack} go={go} studentId={selectedStudentId} onStartObs={startObs} onRegenKode={regenKode} onUpdateStudent={updateStudent} namaSekolah={guru.sekolah} laporan={laporan} onKirim={kirimLaporan} />;
      case "kode-akses": return <KodeAksesScreen onBack={goBack} onBuat={buatKode} onHapus={hapusKode} namaSekolah={guru.sekolah} />;
      case "observation": return (
        <ObservationScreen
          onBack={goBack}
          onDone={finishObs}
          onSave={(id) => {
            setList(prev => prev.map(s => s.id === id
              ? { ...s, hasObs: true, caraBelajar: s.caraBelajar || "Visual & Kinestetik" }
              : s));
          }}
          studentId={selectedStudentId}
        />
      );
      case "talent-map": return <TalentMapScreen go={go} onStartObs={startObs} onSelect={setSelectedStudentId} namaSekolah={guru.sekolah} onGoAsesmenPending={() => go("asesmen-pending")} />;
      case "talent-map-detail": return <TalentMapDetailScreen onBack={goBack} studentId={selectedStudentId} go={go} namaSekolah={guru.sekolah} />;
      case "learning-rec": return <LearningRecScreen onBack={goBack} studentId={selectedStudentId} />;
      case "asesmen-custom": return <AsesmenCustomScreen onBack={goBack} studentId={selectedStudentId} />;
      case "pilih-asesmen": return (
        <PilihAsesmenScreen
          onBack={goBack}
          go={go}
          studentId={selectedStudentId}
          onStartObs={startObs}
        />
      );
      case "riwayat-asesmen": return (
        <RiwayatAsesmenScreen
          onBack={goBack}
          go={go}
          studentId={selectedStudentId}
          onStartObs={startObs}
        />
      );
      case "competition": return <CompetitionScreen onStartObs={startObs} onBack={goBack} go={go} />;
      case "report": return (
        <ReportScreen
          onBack={goBack}
          go={go}
          namaSekolah={guru.sekolah}
          namaGuru={guru.nama}
          initialView={reportInitialView}
          onViewChange={setReportInitialView}
          onProfile={() => {
            if (list.length > 0) {
              setSelectedStudentId(list[0].id);
              go("profile");
            }
          }}
        />
      );

      case "parent-dashboard": return <ParentDashboard go={go} child={child} anakList={anakTerkirim} onPilihAnak={setChildId} namaOrtu={namaOrtu} onOpenCode={() => setShowLinkCode(true)} laporan={child ? laporan.filter(l => l.studentId === child.id) : []} />;
      case "parent-detail": return <ParentDetailScreen onBack={goBack} child={child} onOpenCode={() => setShowLinkCode(true)} laporan={child ? laporan.filter(l => l.studentId === child.id) : []} onBaca={tandaiDibaca} onLihatRiwayat={() => go("riwayat-laporan")} go={go} />;
      case "riwayat-laporan": return <RiwayatLaporanScreen onBack={goBack} laporan={child ? laporan.filter(l => l.studentId === child.id) : []} namaAnak={child ? child.name.split(" ")[0] : ""} />;
      case "riwayat-perkembangan": return <PerkembanganScreen onBack={goBack} child={child} onPilihAspek={(k) => { setAspekTerpilih(k); go("detail-aspek"); }} />;
      case "detail-aspek": return <AspekDetailScreen onBack={goBack} child={child} aspek={aspekTerpilih} onLihatKemampuan={() => go("kemampuan-diamati")} />;
      case "kemampuan-diamati": return <KemampuanDiamatiScreen onBack={goBack} child={child} aspek={aspekTerpilih} />;
      case "parent-calendar": return <ParentCalendarScreen linked={!!child} sekolah={guru.sekolah} onOpenCode={() => setShowLinkCode(true)} go={go} />;
      case "parent-training": return <ParentTrainingScreen go={go} />;
      case "konsultasi-guru": return <KonsultasiGuruScreen onBack={goBack} teacherName={child?.teacher || "Ibu Sari"} studentName={child ? child.name.split(" ")[0] : "Rafi"} kelas={child?.kelas || "VII A"} />;
      case "saran-rumah": return <SaranRumahScreen onBack={goBack} child={child} go={go} />;
      case "notifikasi": return (
        <NotificationScreen
          onBack={goBack}
          role={role}
          students={list}
          laporan={child ? laporan.filter(l => l.studentId === child.id) : laporan}
          child={child}
          onBaca={tandaiDibaca}
          onGo={go}
          onSelectStudent={(id) => {
            setSelectedStudentId(id);
            go("profile");
          }}
          teacherName={child?.teacher || guru.nama}
        />
      );
      default: return null;
    }
  };

  const uiCtx: UICtx = {
    fontSize, setFontSize, tts, setTts,
    openSearch: () => setShowSearch(true),
    openSettings: () => setShowSettings(true),
    openProfile: () => setShowProfile(true),
    openNotifications: () => go("notifikasi"),
  };

  const [title, sub] = headerTitle();

  return (
    <StudentsCtx.Provider value={{ list, add: addStudent, update: updateStudent }}>
      <UI.Provider value={uiCtx}>
        <div
          className="min-h-screen w-full flex items-center justify-center"
          style={{ background: "#FFFFFF", fontFamily: PJS }}
        >

          <div className={isMobile ? "w-full h-full" : "relative z-10 flex flex-col items-center gap-5"} style={!isMobile ? { padding: "60px 80px" } : undefined}>
            {/* Demo switcher — hanya di desktop */}
            {!!role && !isMobile && (
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
            <div
              ref={frameRef}
              style={isMobile ? {
              width: "100%", height: "100vh", background: BG, borderRadius: 0,
              display: "flex", flexDirection: "column", overflow: "hidden",
              position: "relative",
            } : {
              width: 393, height: 852, background: BG, borderRadius: 0,
              display: "flex", flexDirection: "column", overflow: "hidden",
              position: "relative",
              border: "1px solid #D0D0D0",
            }}>


              {/* ── Status Bar at the Top (always rendered, including landing & early screens) ── */}
              <div style={{
                background: screen === "landing" ? "transparent" : (screen === "role-select" || screen === "google-login" || screen === "parent-code" || screen === "konfirmasi-akun") ? BG : "#FFFFFF",
                paddingTop: 14,
                paddingBottom: 6,
                flexShrink: 0,
                zIndex: screen === "landing" ? 60 : 20,
                position: screen === "landing" ? "absolute" : "relative",
                top: screen === "landing" ? 0 : undefined,
                left: screen === "landing" ? 0 : undefined,
                right: screen === "landing" ? 0 : undefined,
                filter: isAnyModalOpen ? "blur(3.5px)" : "none",
                opacity: isAnyModalOpen ? 0.6 : 1,
                transition: "filter 0.2s ease, opacity 0.2s ease",
                pointerEvents: "none",
              }}>
                <StatusBar />
              </div>

              {/* Content */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: (screen === "role-select" || screen === "google-login" || screen === "parent-code" || screen === "konfirmasi-akun") ? BG : "#FFFFFF", position: "relative", zoom: fontSize }}>
                {showNav && screen !== "dashboard" && screen !== "students" && screen !== "talent-map" && screen !== "report" && screen !== "parent-dashboard" && screen !== "parent-detail" && screen !== "parent-calendar" && screen !== "parent-training" && screen !== "saran-rumah" && screen !== "konsultasi-guru" && screen !== "pilih-asesmen" && screen !== "riwayat-asesmen" && screen !== "notifikasi" && (
                  <GlobalHeader
                    title={title}
                    sub={sub}
                    onBack={screen === "competition" ? () => go("dashboard") : (screenHistory.length > 0 ? goBack : undefined)}
                    onProfile={() => setShowProfile(true)}
                  />
                )}
                {renderScreen()}
              </div>

              {showNav ? (
                <BotNav role={role!} screen={screen} go={goTab} />
              ) : (
                /* iPhone 16 Home Indicator untuk layar tanpa bottom nav (landing, login, role-select, dll.) */
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: 8,
                    paddingTop: 4,
                    zIndex: 35,
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      width: 134,
                      height: 5,
                      background: "#1A1A1A",
                      borderRadius: 100,
                      opacity: 0.22,
                    }}
                  />
                </div>
              )}

              {/* ── Modals & Overlays at Frame Level (Covers StatusBar, Content, and BotNav with blur) ── */}
              {showSettings && (
                <SettingsSheet
                  onClose={() => setShowSettings(false)}
                  onLogout={handleLogout}
                  role={role}
                  guru={guru}
                  guruName={guru.nama}
                  parentName={namaOrtu}
                  childName={child?.name}
                  childKelas={child?.kelas}
                  teacherRole={guru.role}
                  onOpenWebDashboard={handleOpenWebConnect}
                  onEditProfile={() => {
                    setShowSettings(false);
                    go("konfirmasi-akun");
                  }}
                  onGoStudents={() => {
                    setShowSettings(false);
                    go("students");
                  }}
                />
              )}

              {showNotifications && (
                <ParentNotificationSheet
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  role={role}
                  students={list}
                  laporan={child ? laporan.filter(l => l.studentId === child.id) : laporan}
                  child={child}
                  onBaca={tandaiDibaca}
                  onGo={(scr) => {
                    setShowNotifications(false);
                    go(scr);
                  }}
                  onSelectStudent={(id) => {
                    setSelectedStudentId(id);
                    setShowNotifications(false);
                    go("profile");
                  }}
                />
              )}

              {showSearch && (
                <SearchOverlay
                  onClose={() => setShowSearch(false)}
                  onSelect={(id) => {
                    setSelectedStudentId(id);
                    setShowSearch(false);
                    go("profile");
                  }}
                  onGo={(scr) => {
                    setShowSearch(false);
                    go(scr);
                  }}
                />
              )}

              {showProfile && (
                <ProfileSheet
                  isOpen={showProfile}
                  onClose={() => setShowProfile(false)}
                  role={role}
                  guru={guru}
                  namaOrtu={namaOrtu}
                  childName={child?.name}
                  onEditProfile={() => go("konfirmasi-akun")}
                  onOpenSettings={() => setShowSettings(true)}
                  onOpenWebDashboard={handleOpenWebConnect}
                  onLogout={handleLogout}
                  onGoStudents={() => go("students")}
                />
              )}

              {/* Modal kode akses orang tua */}
              {showLinkCode && (
                <LinkCodeModal
                  students={list}
                  linkedIds={childIds}
                  onClose={() => setShowLinkCode(false)}
                  onLinked={(s) => {
                    linkChild(s.id);
                    setShowLinkCode(false);
                    if (screen !== "parent-dashboard") goTab("parent-dashboard");
                  }}
                />
              )}

              {/* Sheet tambah siswa */}
              {showAddStudent && (
                <AddStudentSheet
                  teacher={guru.nama}
                  kelasAbkMap={guru.kelasAbkMap ?? {}}
                  firstTime={addFirstTime}
                  savedCount={list.length}
                  onSave={addStudent}
                  onDone={() => {
                    setShowAddStudent(false);
                    if (addFirstTime) { setAddFirstTime(false); finishGuruSetup(); }
                  }}
                  onClose={() => {
                    setShowAddStudent(false);
                    if (addFirstTime) { setAddFirstTime(false); finishGuruSetup(); }
                  }}
                  onBack={() => {
                    setShowAddStudent(false);
                  }}
                />
              )}

              {coach && (
                <CoachMark def={coach.def} rect={coach.rect} onClose={closeCoach} />
              )}
            </div>


          </div>
        </div>
      </UI.Provider>
    </StudentsCtx.Provider>
  );
}
