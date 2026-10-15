import { useState, useRef, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Sparkles, CheckCircle, ChevronRight, ChevronDown, Info, ClipboardList, Gauge, X, ArrowLeft,
  AlertCircle, ArrowRight, Check, Users, Lightbulb, Play, Eye, HelpCircle,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, PBtn, TBar,
} from "./ui-kit";
import {
  FUNGSIONAL_KATEGORI, FUNGSIONAL_META, SKALA_FUNGSIONAL, PROFIL_FUNGSIONAL,
  RIASEC_KATEGORI, RIASEC_META, SKALA_RIASEC, PROFIL_KECENDERUNGAN,
  PANDUAN_UNJUK_KERJA, PANDUAN_RIASEC,
  useStudents, type FungsionalKategori, type RiasecKategori,
  simpanMemoriSiswaAI, muatMemoriSiswaAI,
} from "./data";
import { VoiceTextarea } from "./voice-input";
import { updateStudentInFirestore } from "./firestore-students";

type Tahap = "fungsional" | "kecenderungan" | "catatan";

const DOMAIN_CODES: Record<FungsionalKategori, string> = {
  "Kognisi": "D1",
  "Mobilitas": "D2",
  "Perawatan Diri": "D3",
  "Interaksi dengan Orang Lain": "D4",
  "Aktivitas Sehari-hari": "D5",
  "Partisipasi": "D6",
};

const DOMAIN_SHORT: Record<FungsionalKategori, string> = {
  "Kognisi": "Kognisi",
  "Mobilitas": "Mobilitas",
  "Perawatan Diri": "Perawatan",
  "Interaksi dengan Orang Lain": "Interaksi",
  "Aktivitas Sehari-hari": "Aktivitas",
  "Partisipasi": "Partisipasi",
};

const PILL_CONFIG: Record<FungsionalKategori, { label: string; circleBg: string; icon: string }> = {
  "Kognisi": { label: "Kognisi", circleBg: "#FCE7F3", icon: "🧠" },
  "Mobilitas": { label: "Mobilitas", circleBg: "#FEF3C7", icon: "🏃" },
  "Perawatan Diri": { label: "Perawatan", circleBg: "#EDE9FE", icon: "🧍" },
  "Interaksi dengan Orang Lain": { label: "Interaksi", circleBg: "#FEF3C7", icon: "🤝" },
  "Aktivitas Sehari-hari": { label: "Aktivitas", circleBg: "#D1FAE5", icon: "📅" },
  "Partisipasi": { label: "Partisipasi", circleBg: "#FCE7F3", icon: "👥" },
};

export function ObservationScreen({
  onBack,
  onDone,
  onSave,
  studentId,
}: {
  onBack: () => void;
  onDone: (id: number) => void;
  onSave?: (id: number) => void;
  studentId: number;
}) {
  const students = useStudents();
  const student = students.find(s => s.id === studentId) ?? students[0];

  const [tahap, setTahap] = useState<Tahap>("fungsional");
  const [skorFungsional, setSkorFungsional] = useState<Record<number, number>>({});
  const [skorRiasec, setSkorRiasec] = useState<Record<number, number>>({});
  const [catatan, setCatatan] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeRiasecFilter, setActiveRiasecFilter] = useState<string>("Semua");
  const [fungsionalStep, setFungsionalStep] = useState<number>(0); // 0 to 5 for the 6 domains
  const [riasecStep, setRiasecStep] = useState<number>(0); // 0 to 5 for R, I, A, S, E, C
  const [showIncompleteModal, setShowIncompleteModal] = useState<boolean>(false);
  const [showScaleModal, setShowScaleModal] = useState<boolean>(false);
  const [scaleModalTab, setScaleModalTab] = useState<"fungsional" | "riasec">("fungsional");
  const [showRiasecScaleModal, setShowRiasecScaleModal] = useState<boolean>(false);
  const [highlightUnanswered, setHighlightUnanswered] = useState<boolean>(false);
  const [highlightUnansweredRiasec, setHighlightUnansweredRiasec] = useState<boolean>(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // ── Panduan Unjuk Kerja ──
  const [expandedGuide, setExpandedGuide] = useState<FungsionalKategori | null>(null);
  const [expandedRiasecGuide, setExpandedRiasecGuide] = useState<RiasecKategori | null>(null);
  const [aktivitasHariIni, setAktivitasHariIni] = useState<string>("");
  
  // --- FIREBASE LOAD & AUTO SAVE ---
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadProgress() {
      if (!student) return;
      try {
        const docRef = doc(db, "assessments", student.id.toString());
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.skorFungsional) setSkorFungsional(data.skorFungsional);
          if (data.skorRiasec) setSkorRiasec(data.skorRiasec);
          if (data.catatan) setCatatan(data.catatan);
          if (data.aktivitasHariIni) setAktivitasHariIni(data.aktivitasHariIni);
          if (data.tahap) setTahap(data.tahap);
          if (data.fungsionalStep !== undefined) setFungsionalStep(data.fungsionalStep);
          if (data.riasecStep !== undefined) setRiasecStep(data.riasecStep);
        }
      } catch (err) {
        console.error("Failed to load assessment progress", err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadProgress();
  }, [student]);

  useEffect(() => {
    if (!isLoaded || !student) return;
    const hasAnyInput = Object.keys(skorFungsional).length > 0 || Object.keys(skorRiasec).length > 0 || catatan.trim().length > 0;
    if (!hasAnyInput) return;

    const saveProgress = async () => {
      try {
        const docRef = doc(db, "assessments", student.id.toString());
        await setDoc(docRef, {
          skorFungsional,
          skorRiasec,
          catatan,
          aktivitasHariIni,
          tahap,
          fungsionalStep,
          riasecStep,
          lastUpdated: new Date()
        }, { merge: true });

        // Update status di Firestore dan localStorage jika belum selesai
        if (!student.hasObs) {
          updateStudentInFirestore(student.id, { obsStatus: "in_progress" }).catch(() => {});
        }
        try {
          localStorage.setItem(`assessment_draft_${student.id}`, JSON.stringify({ inProgress: true, time: Date.now() }));
        } catch (e) {}
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    };
    
    // Debounce 1.5 detik untuk menghindari terlalu banyak write ke database
    const timeoutId = setTimeout(saveProgress, 1500);
    return () => clearTimeout(timeoutId);
  }, [skorFungsional, skorRiasec, catatan, aktivitasHariIni, tahap, fungsionalStep, riasecStep, isLoaded, student]);
  // ---------------------------------

  const currentCategory = FUNGSIONAL_KATEGORI[fungsionalStep] || FUNGSIONAL_KATEGORI[0];
  const currentMeta = FUNGSIONAL_META[currentCategory];
  const currentCategoryItems = PROFIL_FUNGSIONAL.filter(a => a.kategori === currentCategory);
  const currentCategoryAnswered = currentCategoryItems.filter(a => skorFungsional[a.id] !== undefined);
  const currentCategoryUnanswered = currentCategoryItems.filter(a => skorFungsional[a.id] === undefined);

  const currentRiasecCategory = RIASEC_KATEGORI[riasecStep] || RIASEC_KATEGORI[0];
  const currentRiasecMeta = RIASEC_META[currentRiasecCategory];
  const currentRiasecItems = PROFIL_KECENDERUNGAN.filter(a => a.kategori === currentRiasecCategory);
  const currentRiasecAnswered = currentRiasecItems.filter(a => skorRiasec[a.id] !== undefined);
  const currentRiasecUnanswered = currentRiasecItems.filter(a => skorRiasec[a.id] === undefined);

  const handleNextFungsionalStep = () => {
    if (currentCategoryUnanswered.length > 0) {
      setShowIncompleteModal(true);
      return;
    }
    proceedToNextFungsionalStep();
  };

  const proceedToNextFungsionalStep = () => {
    setHighlightUnanswered(false);
    if (fungsionalStep < FUNGSIONAL_KATEGORI.length - 1) {
      setFungsionalStep(prev => prev + 1);
      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTahap("kecenderungan");
      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMarkCurrentNAAndProceed = () => {
    setSkorFungsional(prev => {
      const updated = { ...prev };
      currentCategoryUnanswered.forEach(item => {
        updated[item.id] = -1;
      });
      return updated;
    });
    setShowIncompleteModal(false);
    proceedToNextFungsionalStep();
  };

  const handleReviewCurrentUnanswered = () => {
    setShowIncompleteModal(false);
    setHighlightUnanswered(true);
    if (currentCategoryUnanswered.length > 0) {
      const firstId = currentCategoryUnanswered[0].id;
      setTimeout(() => {
        const el = document.getElementById(`item-${firstId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const handlePrevFungsionalStep = () => {
    setHighlightUnanswered(false);
    if (fungsionalStep > 0) {
      setFungsionalStep(prev => prev - 1);
      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onBack();
    }
  };

  const handleNextRiasecStep = () => {
    if (currentRiasecUnanswered.length > 0) {
      setShowIncompleteModal(true);
      return;
    }
    proceedToNextRiasecStep();
  };

  const proceedToNextRiasecStep = () => {
    setHighlightUnansweredRiasec(false);
    if (riasecStep < RIASEC_KATEGORI.length - 1) {
      setRiasecStep(prev => prev + 1);
      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTahap("catatan");
      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevRiasecStep = () => {
    setHighlightUnansweredRiasec(false);
    if (riasecStep > 0) {
      setRiasecStep(prev => prev - 1);
      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTahap("fungsional");
      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMarkCurrentRiasecNAAndProceed = () => {
    setSkorRiasec(prev => {
      const updated = { ...prev };
      currentRiasecUnanswered.forEach(item => {
        updated[item.id] = -1;
      });
      return updated;
    });
    setShowIncompleteModal(false);
    proceedToNextRiasecStep();
  };

  const handleReviewCurrentRiasecUnanswered = () => {
    setShowIncompleteModal(false);
    setHighlightUnansweredRiasec(true);
    if (currentRiasecUnanswered.length > 0) {
      const firstId = currentRiasecUnanswered[0].id;
      setTimeout(() => {
        const el = document.getElementById(`riasec-item-${firstId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  if (!student) {
    return (
      <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS }}>
        <TBar title="Asesmen Siswa" sub="Pilih Siswa" onBack={onBack} />
        <div className="p-8 text-center">
          <p className="text-sm font-semibold mb-4" style={{ color: MUTED }}>Belum ada siswa yang dipilih atau tersedia untuk diamati.</p>
          <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-xs font-bold" style={{ background: A, color: "#fff", fontFamily: PJS }}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const totalFungsional = PROFIL_FUNGSIONAL.length;
  const terisiFungsional = Object.keys(skorFungsional).length;
  const fungsionalPct = Math.round((terisiFungsional / totalFungsional) * 100);

  const totalRiasec = PROFIL_KECENDERUNGAN.length;
  const terisiRiasec = Object.keys(skorRiasec).length;
  const riasecPct = Math.round((terisiRiasec / totalRiasec) * 100);

  const rataFungsional = (k: FungsionalKategori) => {
    const list = PROFIL_FUNGSIONAL
      .filter(a => a.kategori === k)
      .filter(a => skorFungsional[a.id] !== undefined && skorFungsional[a.id] !== -1);
    if (!list.length) return null;
    return Math.round(list.reduce((s, a) => s + skorFungsional[a.id], 0) / list.length * 100 / 3);
  };

  const rataRiasec = (k: RiasecKategori) => {
    const list = PROFIL_KECENDERUNGAN
      .filter(a => a.kategori === k)
      .filter(a => skorRiasec[a.id] !== undefined && skorRiasec[a.id] !== -1);
    if (!list.length) return null;
    return Math.round((list.reduce((s, a) => s + skorRiasec[a.id], 0) / (list.length * 2)) * 100);
  };

  const bisaSimpan = terisiFungsional > 0 || terisiRiasec > 0;

  const handleSimpan = () => {
    if (!bisaSimpan) return;
    setIsSaved(true);
    // Simpan catatan ke memori AI siswa di balik layar
    if (catatan.trim()) {
      simpanMemoriSiswaAI(student.id, catatan.trim());
    }
    if (onSave) {
      onSave(student.id);
    }
    setShowResultModal(true);
  };

  const handleLihatHasil = () => {
    setShowResultModal(false);
    onDone(student.id);
  };

  const handleKembali = () => {
    setShowResultModal(false);
    setTahap("catatan");
  };

  const TAHAP_TABS: { k: Tahap; l: string; n: string }[] = [
    { k: "fungsional", l: "Fungsional", n: `${terisiFungsional}/${totalFungsional}` },
    { k: "kecenderungan", l: "Aktivitas", n: `${terisiRiasec}/${totalRiasec}` },
    { k: "catatan", l: "Catatan", n: catatan.trim() ? "✓" : "—" },
  ];
  const curIdx = TAHAP_TABS.findIndex(t => t.k === tahap);

  return (
    <div
      className="flex-1 relative flex flex-col"
      style={{
        fontFamily: IPS,
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Top Bar Permanen Terkunci di Atas */}
      <TBar title="Asesmen Siswa" sub={student.name} onBack={onBack} />

      {/* Scrollable page body (terkunci saat modal aktif) */}
      <div
        ref={contentScrollRef}
        className="flex-1"
        style={{
          overflowY: showResultModal || showIncompleteModal ? "hidden" : "auto",
          overscrollBehavior: "contain",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "#F4F6F4",
        }}
      >
        {/* ── IDENTITAS SISWA & STEPPER (SESUAI GAMBAR REFERENSI) ── */}
        <div style={{ background: "#FFFFFF", borderBottom: `1px solid ${BDR}` }} className="px-4 pt-3 pb-3">
          {/* Identitas Siswa */}
          <div className="mb-2.5">
            <h2 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: "#1E293B", margin: 0 }}>
              {student.name}
            </h2>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  fontFamily: PJS,
                  padding: "3px 12px",
                  borderRadius: 9999,
                  background: "#EDE9FE",
                  color: "#6D28D9",
                  border: "1px solid #DDD6FE",
                }}
              >
                {student.abk}
              </span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  fontFamily: PJS,
                  padding: "3px 12px",
                  borderRadius: 9999,
                  background: "#EAF4EE",
                  color: "#2D5A43",
                  border: "1px solid #C4DFC9",
                }}
              >
                Kelas {student.kelas}
              </span>
            </div>
          </div>

          {/* Stepper 3 Tahap */}
          <div style={{ display: "flex", alignItems: "stretch", position: "relative", padding: "4px 0" }}>
            {/* Garis horizontal penghubung 1 -> 2 (Tepat di tengah vertikal lingkaran) */}
            <div
              style={{
                position: "absolute",
                top: 24.5,
                left: "16.67%",
                width: "33.33%",
                height: 2.5,
                background: curIdx >= 1 || (terisiFungsional > 0 && tahap !== "fungsional") ? "#2D5A43" : "#E2E8F0",
                zIndex: 0,
                transform: "translateY(-50%)",
                transition: "background 0.3s ease",
              }}
            />

            {/* Garis horizontal penghubung 2 -> 3 (Tepat di tengah vertikal lingkaran) */}
            <div
              style={{
                position: "absolute",
                top: 24.5,
                left: "50%",
                width: "33.33%",
                height: 2.5,
                background: curIdx >= 2 || (terisiRiasec > 0 && tahap === "catatan") ? "#2D5A43" : "#E2E8F0",
                zIndex: 0,
                transform: "translateY(-50%)",
                transition: "background 0.3s ease",
              }}
            />

            {TAHAP_TABS.map((t, i) => {
              const active = tahap === t.k;
              const stageNum = i + 1;
              const isDone = i === 0
                ? curIdx > 0 || terisiFungsional === totalFungsional || (terisiFungsional > 0 && !active)
                : i === 1
                ? curIdx > 1 || terisiRiasec === totalRiasec || (terisiRiasec > 0 && !active)
                : isSaved || catatan.trim().length > 0;

              return (
                <button
                  key={t.k}
                  type="button"
                  onClick={() => {
                    setTahap(t.k);
                    contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    flex: 1,
                    position: "relative",
                    zIndex: 1,
                    background: active ? "#FFFFFF" : "transparent",
                    border: active ? "1.5px solid #2D5A43" : "1.5px solid transparent",
                    borderRadius: 16,
                    padding: "6px 8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: active ? "0 3px 10px rgba(45, 90, 67, 0.10)" : "none",
                  }}
                  className="active:scale-95"
                >
                  {/* Step circle */}
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: active || isDone ? "#2D5A43" : "#F1F5F9",
                      color: active || isDone ? "#FFFFFF" : "#94A3B8",
                      border: active || isDone ? "none" : "1.5px solid #CBD5E1",
                      fontFamily: PJS,
                      fontWeight: 800,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: active || isDone ? "0 2px 6px rgba(45, 90, 67, 0.25)" : "none",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {isDone && !active ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      stageNum
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    style={{
                      fontFamily: PJS,
                      fontSize: 12,
                      fontWeight: active || isDone ? 800 : 600,
                      color: active || isDone ? "#2D5A43" : "#64748B",
                      lineHeight: 1.2,
                      transition: "color 0.2s ease",
                    }}
                  >
                    {t.l}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TAHAP 1: PROFIL FUNGSIONAL (CARD SESUAI REFERENSI GAMBAR) ── */}
        {tahap === "fungsional" && (
          <div className="px-4 pt-3.5 pb-6 space-y-4">
            {/* 1. Progress Card Profil Fungsional (DIKUNCI / STICKY SAAT SCROLL) */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 25,
                background: "#F4F6F4",
                paddingTop: 8,
                paddingBottom: 4,
                margin: "-14px -16px 0",
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  border: "1.5px solid #E2E8F0",
                  padding: "12px 18px",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🧠</span>
                    <span style={{ fontFamily: PJS, fontSize: 14.5, fontWeight: 800, color: "#1E293B" }}>
                      Fungsional
                    </span>
                  </div>
                  <span style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#059669" }}>
                    {terisiFungsional}/{totalFungsional} · {fungsionalPct}%
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 9999, background: "#E2E8F0", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${fungsionalPct}%`,
                      borderRadius: 9999,
                      background: "#059669",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Category Filter Pills (D1 sampai D6) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflowX: "auto",
                padding: "2px 0 4px",
              }}
              className="no-scrollbar"
            >
              {FUNGSIONAL_KATEGORI.map((kat, idx) => {
                const isCurrent = fungsionalStep === idx;
                const meta = FUNGSIONAL_META[kat];
                const list = PROFIL_FUNGSIONAL.filter(a => a.kategori === kat);
                const answeredCount = list.filter(a => skorFungsional[a.id] !== undefined).length;
                const isComplete = answeredCount === list.length && list.length > 0;

                return (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => {
                      setFungsionalStep(idx);
                      setHighlightUnanswered(false);
                      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{
                      flexShrink: 0,
                      height: 40,
                      borderRadius: 9999,
                      background: isCurrent ? "#FFFFFF" : isComplete ? "#ECFDF5" : "#FFFFFF",
                      border: isCurrent
                        ? `1.5px solid ${meta.color}`
                        : isComplete
                        ? "1.5px solid #A7F3D0"
                        : "1.5px solid #E2E8F0",
                      boxShadow: isCurrent ? `0 2px 8px ${meta.color}25` : "0 1px 3px rgba(0,0,0,0.03)",
                      padding: "0 12px 0 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    className="active:scale-95"
                  >
                    <span style={{ fontSize: 14 }}>{meta.icon}</span>
                    <span
                      style={{
                        fontFamily: PJS,
                        fontSize: 12,
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? meta.color : isComplete ? "#065F46" : "#334155",
                        whiteSpace: "nowrap",
                      }}
                    >
                      D{idx + 1}. {DOMAIN_SHORT[kat]}
                    </span>
                    <span
                      style={{
                        fontFamily: PJS,
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: 9999,
                        background: isCurrent ? `${meta.color}18` : isComplete ? "#D1FAE5" : "#F1F5F9",
                        color: isCurrent ? meta.color : isComplete ? "#065F46" : "#64748B",
                      }}
                    >
                      {answeredCount}/{list.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 4. Card Pertanyaan Berlatar Putih dengan Rounded Corners */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 24,
                border: "1.5px solid #E2E8F0",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
                padding: "20px 18px",
              }}
            >
              {/* Header Kartu Kategori */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  {/* Icon Box Rounded */}
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 16,
                      background: "#F0F9FF",
                      border: "1.5px solid #BAE6FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {currentMeta.icon}
                  </div>

                  {/* Judul & Deskripsi Kategori */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        fontFamily: PJS,
                        color: currentMeta.color,
                        background: `${currentMeta.color}18`,
                        padding: "2px 7px",
                        borderRadius: 6,
                      }}>
                        Bagian {fungsionalStep + 1} dari 6
                      </span>
                    </div>
                    <h3 style={{ fontFamily: PJS, fontSize: 16.5, fontWeight: 800, color: "#1E293B", margin: 0, lineHeight: 1.25 }}>
                      {currentCategory}
                    </h3>
                    <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#64748B", margin: "3px 0 0", lineHeight: 1.35, fontWeight: 400 }}>
                      {currentMeta.desc}
                    </p>
                  </div>
                </div>

                {/* Counter Pill Badge */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
                  <div
                    style={{
                      padding: "5px 12px",
                      borderRadius: 9999,
                      background: "#F0F9FF",
                      border: "1.5px solid #BAE6FD",
                      color: "#0284C7",
                      fontFamily: PJS,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {currentCategoryAnswered.length}/{currentCategoryItems.length} Terisi
                  </div>
                </div>
              </div>

              {/* Garis Pembatas Header */}
              <div style={{ height: 1, background: "#E2E8F0", margin: "16px 0 20px" }} />

              {/* Daftar Pertanyaan di dalam Kartu */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {currentCategoryItems.map((a, idx) => {
                  const isAnswered = skorFungsional[a.id] !== undefined;
                  const isHighlighted = highlightUnanswered && !isAnswered;

                  return (
                    <div id={`item-${a.id}`} key={a.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {/* Teks Pertanyaan */}
                      <p
                        style={{
                          fontFamily: PJS,
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: isHighlighted ? "#B45309" : "#334155",
                          margin: 0,
                          lineHeight: 1.45,
                        }}
                      >
                        {a.text}
                      </p>

                      {/* 4 Pilihan Skala Kemampuan (Unjuk Kerja) */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                        {[
                          { v: 0, label: "Tidak/Belum Bisa" },
                          { v: 1, label: "Banyak Bantuan" },
                          { v: 2, label: "Sedikit Bantuan" },
                          { v: 3, label: "Sudah Mandiri" },
                        ].map(opt => {
                          const isSelected = skorFungsional[a.id] === opt.v;
                          return (
                            <button
                              key={opt.v}
                              type="button"
                              onClick={() => setSkorFungsional(p => ({ ...p, [a.id]: opt.v }))}
                              style={{
                                minHeight: 46,
                                padding: "4px 4px",
                                borderRadius: 16,
                                background: isSelected ? "#FFA000" : "#FFFFFF",
                                border: isSelected ? "1.5px solid #FFA000" : "1.5px solid #CBD5E1",
                                color: isSelected ? "#FFFFFF" : "#334155",
                                fontFamily: PJS,
                                fontWeight: isSelected ? 800 : 700,
                                fontSize: 11.5,
                                lineHeight: 1.2,
                                textAlign: "center",
                                boxShadow: isSelected ? "0 4px 12px rgba(255, 160, 0, 0.35)" : "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                              className="active:scale-95"
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Tombol "Tidak dapat dijawab" (Garis Putus-Putus di Kiri Bawah) */}
                      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                        <button
                          type="button"
                          onClick={() => setSkorFungsional(p => ({ ...p, [a.id]: -1 }))}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 12,
                            background: skorFungsional[a.id] === -1 ? "#F1F5F9" : "transparent",
                            border: skorFungsional[a.id] === -1 ? "1.5px solid #94A3B8" : "1.5px dashed #CBD5E1",
                            color: skorFungsional[a.id] === -1 ? "#0F172A" : "#64748B",
                            fontFamily: PJS,
                            fontWeight: skorFungsional[a.id] === -1 ? 700 : 500,
                            fontSize: 11.5,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          className="active:scale-95"
                        >
                          Tidak dapat dijawab
                        </button>
                      </div>

                      {/* Divider halus antar butir soal (kecuali yang terakhir) */}
                      {idx < currentCategoryItems.length - 1 && (
                        <div style={{ height: 1, background: "#F1F5F9", marginTop: 14 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Panduan Aktivitas Unjuk Kerja (Collapsible di Bawah Form) */}
            {(() => {
              const panduan = PANDUAN_UNJUK_KERJA[currentCategory];
              const isExpanded = expandedGuide === currentCategory;
              const relevanPanduan = panduan.filter(
                a => !a.cocokUntuk || a.cocokUntuk.length === 0 || a.cocokUntuk.includes(student.abk)
              );
              const hasRelevant = relevanPanduan.length > 0;

              return (
                <div
                  style={{
                    background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                    borderRadius: 20,
                    border: "1.5px solid #FDE68A",
                    boxShadow: "0 2px 12px rgba(217, 119, 6, 0.08)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedGuide(isExpanded ? null : currentCategory)}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                    className="active:opacity-80 transition-opacity"
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: "#FEF3C7",
                        border: "1.5px solid #FDE68A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Lightbulb size={18} style={{ color: "#D97706" }} />
                    </div>
                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                      <p style={{
                        fontFamily: PJS, fontSize: 13.5, fontWeight: 800,
                        color: "#92400E", margin: 0, lineHeight: 1.25,
                      }}>
                        💡 Butuh Ide Aktivitas Pengamatan? (Opsional)
                      </p>
                      <p style={{
                        fontFamily: IPS, fontSize: 11.5, fontWeight: 500,
                        color: "#B45309", margin: "2px 0 0", lineHeight: 1.3,
                      }}>
                        {hasRelevant ? `${relevanPanduan.length} aktivitas terarah untuk ${student.abk}` : `${panduan.length} contoh aktivitas`}
                      </p>
                    </div>
                    <ChevronDown
                      size={18}
                      style={{
                        color: "#B45309",
                        flexShrink: 0,
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>

                  {isExpanded && (
                    <div style={{ padding: "0 14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {(hasRelevant ? relevanPanduan : panduan).map((akt, i) => (
                        <div
                          key={i}
                          style={{
                            background: "#FFFFFF",
                            borderRadius: 16,
                            border: "1px solid #FDE68A",
                            padding: "14px 16px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <Play size={13} style={{ color: "#D97706", flexShrink: 0 }} />
                            <h5 style={{
                              fontFamily: PJS, fontSize: 13, fontWeight: 800,
                              color: "#1E293B", margin: 0,
                            }}>
                              {akt.judul}
                            </h5>
                            {akt.cocokUntuk && akt.cocokUntuk.includes(student.abk) && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, fontFamily: PJS,
                                padding: "2px 8px", borderRadius: 9999,
                                background: "#D1FAE5", color: "#065F46", flexShrink: 0,
                              }}>
                                Cocok
                              </span>
                            )}
                          </div>
                          <p style={{
                            fontFamily: IPS, fontSize: 12, fontWeight: 400,
                            color: "#475569", margin: "0 0 10px", lineHeight: 1.45,
                          }}>
                            {akt.deskripsi}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <Eye size={12} style={{ color: "#64748B" }} />
                            <span style={{
                              fontFamily: PJS, fontSize: 11, fontWeight: 700, color: "#64748B",
                            }}>
                              Perilaku yang diamati:
                            </span>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {akt.perilakuDiamati.map((p, j) => (
                              <span
                                key={j}
                                style={{
                                  fontSize: 10.5, fontWeight: 600, fontFamily: PJS,
                                  padding: "3px 10px", borderRadius: 9999,
                                  background: "#F0F9FF", color: "#0369A1",
                                  border: "1px solid #BAE6FD",
                                }}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        padding: "10px 14px", borderRadius: 12,
                        background: "rgba(217, 119, 6, 0.08)",
                      }}>
                        <Info size={13} style={{ color: "#B45309", flexShrink: 0, marginTop: 1 }} />
                        <p style={{
                          fontFamily: IPS, fontSize: 11, fontWeight: 500,
                          color: "#92400E", margin: 0, lineHeight: 1.4,
                        }}>
                          Berikan aktivitas di atas kepada anak, lalu <strong>amati perilaku yang muncul</strong> dan catat di indikator-indikator di atas. Anda juga bisa menggunakan aktivitas lain yang sesuai.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 6. Input Aktivitas yang Digunakan Hari Ini (Opsional) */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                border: `1.5px solid ${aktivitasHariIni.trim() ? "#A7F3D0" : "#E2E8F0"}`,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "border-color 0.2s ease",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: aktivitasHariIni.trim() ? "#D1FAE5" : "#F1F5F9",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.2s ease",
              }}>
                <ClipboardList size={15} style={{ color: aktivitasHariIni.trim() ? "#065F46" : "#64748B" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label style={{
                  fontFamily: PJS, fontSize: 11, fontWeight: 700,
                  color: "#64748B", display: "block", marginBottom: 4,
                }}>
                  Aktivitas yang digunakan hari ini (opsional)
                </label>
                <input
                  value={aktivitasHariIni}
                  onChange={(e) => setAktivitasHariIni(e.target.value)}
                  placeholder="Contoh: Permainan stiker warna-warni, puzzle 6 keping..."
                  style={{
                    width: "100%", border: "none", outline: "none",
                    fontFamily: IPS, fontSize: 13, fontWeight: 500,
                    color: "#1E293B", background: "transparent",
                    padding: 0,
                  }}
                />
              </div>
              {aktivitasHariIni.trim() && (
                <CheckCircle size={16} style={{ color: "#059669", flexShrink: 0 }} />
              )}
            </div>

            <div className="flex gap-2.5 pt-3 pb-4">
              <button
                type="button"
                onClick={handlePrevFungsionalStep}
                style={{
                  flex: 1,
                  border: `1.5px solid ${BDR}`,
                  color: DEEP,
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 13,
                  minHeight: 46,
                  background: CARD,
                  borderRadius: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                className="active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={15} />
                <span>{fungsionalStep === 0 ? "Keluar" : "Sebelumnya"}</span>
              </button>

              <div style={{ flex: 2 }}>
                <PBtn
                  full
                  label={
                    fungsionalStep < 5
                      ? `Lanjut: ${DOMAIN_SHORT[FUNGSIONAL_KATEGORI[fungsionalStep + 1]]}`
                      : "Lanjut ke Aktivitas (RIASEC)"
                  }
                  icon={<ArrowRight size={16} />}
                  onClick={handleNextFungsionalStep}
                  size="md"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAHAP 2: PROFIL KECENDERUNGAN AKTIVITAS / RIASEC ── */}
        {tahap === "kecenderungan" && (
          <div className="px-4 pt-3.5 pb-6 space-y-4">
            {/* 1. Progress Card Profil Aktivitas (DIKUNCI / STICKY SAAT SCROLL) */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 25,
                background: "#F4F6F4",
                paddingTop: 8,
                paddingBottom: 4,
                margin: "-14px -16px 0",
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 20,
                  border: "1.5px solid #E2E8F0",
                  padding: "12px 18px",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🎯</span>
                    <span style={{ fontFamily: PJS, fontSize: 14.5, fontWeight: 800, color: "#1E293B" }}>
                      Aktivitas
                    </span>
                  </div>
                  <span style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#059669" }}>
                    {terisiRiasec}/{totalRiasec} · {riasecPct}%
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 9999, background: "#E2E8F0", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${riasecPct}%`,
                      borderRadius: 9999,
                      background: "#059669",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Category Filter Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflowX: "auto",
                padding: "2px 0 4px",
              }}
              className="no-scrollbar"
            >
              {RIASEC_KATEGORI.map((kat, idx) => {
                const isCurrent = riasecStep === idx;
                const meta = RIASEC_META[kat];
                const list = PROFIL_KECENDERUNGAN.filter(a => a.kategori === kat);
                const answeredCount = list.filter(a => skorRiasec[a.id] !== undefined).length;
                const isComplete = answeredCount === list.length && list.length > 0;
                const riasecLabelMap: Record<string, string> = {
                  Realistic: "1. Realistik (R)",
                  Investigative: "2. Investigasi (I)",
                  Artistic: "3. Artistik (A)",
                  Social: "4. Sosial (S)",
                  Enterprising: "5. Enterprising (E)",
                  Conventional: "6. Konvensional (C)",
                };
                const katLabel = riasecLabelMap[kat] || kat;

                return (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => {
                      setRiasecStep(idx);
                      setHighlightUnansweredRiasec(false);
                      contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{
                      flexShrink: 0,
                      height: 40,
                      borderRadius: 9999,
                      background: isCurrent ? "#FFFFFF" : isComplete ? "#ECFDF5" : "#FFFFFF",
                      border: isCurrent
                        ? `1.5px solid ${meta.color}`
                        : isComplete
                        ? "1.5px solid #A7F3D0"
                        : "1.5px solid #E2E8F0",
                      boxShadow: isCurrent ? `0 2px 8px ${meta.color}25` : "0 1px 3px rgba(0,0,0,0.03)",
                      padding: "0 12px 0 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    className="active:scale-95"
                  >
                    <span style={{ fontSize: 15 }}>{meta.icon}</span>
                    <span
                      style={{
                        fontFamily: PJS,
                        fontSize: 12.5,
                        fontWeight: isCurrent ? 800 : 600,
                        color: isCurrent ? meta.color : isComplete ? "#065F46" : "#334155",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {katLabel}
                    </span>
                    <span
                      style={{
                        fontFamily: PJS,
                        fontSize: 11,
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: 9999,
                        background: isCurrent ? `${meta.color}18` : isComplete ? "#D1FAE5" : "#F1F5F9",
                        color: isCurrent ? meta.color : isComplete ? "#065F46" : "#64748B",
                      }}
                    >
                      {answeredCount}/{list.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3. Card Pertanyaan Berlatar Putih dengan Rounded Corners */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 24,
                border: "1.5px solid #E2E8F0",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
                padding: "20px 18px",
              }}
            >
              {/* Header Kartu Kategori */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 16,
                      background: currentRiasecMeta.bg,
                      border: `1.5px solid ${currentRiasecMeta.color}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {currentRiasecMeta.icon}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        fontFamily: PJS,
                        color: currentRiasecMeta.color,
                        background: `${currentRiasecMeta.color}18`,
                        padding: "2px 7px",
                        borderRadius: 6,
                      }}>
                        Bagian {riasecStep + 1} dari 6
                      </span>
                    </div>
                    <h3 style={{ fontFamily: PJS, fontSize: 16.5, fontWeight: 800, color: "#1E293B", margin: 0, lineHeight: 1.25 }}>
                      {currentRiasecCategory === "Investigative" ? "Investigasi (Investigative)" : currentRiasecCategory === "Realistic" ? "Realistik (Realistic)" : currentRiasecCategory === "Artistic" ? "Artistik (Artistic)" : currentRiasecCategory === "Social" ? "Sosial (Social)" : currentRiasecCategory === "Enterprising" ? "Enterprising (Kewirausahaan)" : "Konvensional (Conventional)"}
                    </h3>
                    <p style={{ fontFamily: IPS, fontSize: 12, color: "#64748B", margin: "4px 0 0", lineHeight: 1.35, fontWeight: 400 }}>
                      {currentRiasecMeta.desc}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: 9999,
                      background: currentRiasecMeta.bg,
                      border: `1.5px solid ${currentRiasecMeta.color}40`,
                      color: currentRiasecMeta.color,
                      fontFamily: PJS,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {currentRiasecAnswered.length}/{currentRiasecItems.length}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRiasecScaleModal(true)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      color: "#64748B",
                      fontSize: 11,
                      fontFamily: PJS,
                      fontWeight: 700,
                    }}
                    className="hover:underline"
                  >
                    <HelpCircle size={12} style={{ color: "#059669" }} />
                    <span>Arti nilai?</span>
                  </button>
                </div>
              </div>

              {/* Garis Pembatas Header */}
              <div style={{ height: 1, background: "#E2E8F0", margin: "16px 0 20px" }} />

              {/* Daftar Pertanyaan di dalam Kartu */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {currentRiasecItems.map((a, idx) => {
                  const isAnswered = skorRiasec[a.id] !== undefined;
                  const isHighlighted = highlightUnansweredRiasec && !isAnswered;

                  return (
                    <div id={`riasec-item-${a.id}`} key={a.id} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <p
                        style={{
                          fontFamily: PJS,
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: isHighlighted ? "#B45309" : "#334155",
                          margin: 0,
                          lineHeight: 1.45,
                        }}
                      >
                        {a.text}
                      </p>

                      {/* 3 Pilihan Skala Minat (RIASEC) */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                        {[
                          { v: 0, label: "Tidak Pernah" },
                          { v: 1, label: "Kadang" },
                          { v: 2, label: "Sering / Selalu" },
                        ].map(opt => {
                          const isSelected = skorRiasec[a.id] === opt.v;
                          return (
                            <button
                              key={opt.v}
                              type="button"
                              onClick={() => setSkorRiasec(p => ({ ...p, [a.id]: opt.v }))}
                              style={{
                                height: 44,
                                borderRadius: 16,
                                background: isSelected ? "#FFA000" : "#FFFFFF",
                                border: isSelected ? "1.5px solid #FFA000" : "1.5px solid #CBD5E1",
                                color: isSelected ? "#FFFFFF" : "#334155",
                                fontFamily: PJS,
                                fontWeight: isSelected ? 800 : 700,
                                fontSize: 11.5,
                                lineHeight: 1.15,
                                textAlign: "center",
                                padding: "0 2px",
                                boxShadow: isSelected ? "0 4px 12px rgba(255, 160, 0, 0.35)" : "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                              className="active:scale-95"
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Tombol "Tidak dapat dijawab" (Garis Putus-Putus di Kiri Bawah) */}
                      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                        <button
                          type="button"
                          onClick={() => setSkorRiasec(p => ({ ...p, [a.id]: -1 }))}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 12,
                            background: skorRiasec[a.id] === -1 ? "#F1F5F9" : "transparent",
                            border: skorRiasec[a.id] === -1 ? "1.5px solid #94A3B8" : "1.5px dashed #CBD5E1",
                            color: skorRiasec[a.id] === -1 ? "#0F172A" : "#64748B",
                            fontFamily: PJS,
                            fontWeight: skorRiasec[a.id] === -1 ? 700 : 500,
                            fontSize: 11.5,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          className="active:scale-95"
                        >
                          Tidak dapat dijawab
                        </button>
                      </div>

                      {/* Divider halus antar butir soal (kecuali yang terakhir) */}
                      {idx < currentRiasecItems.length - 1 && (
                        <div style={{ height: 1, background: "#F1F5F9", marginTop: 14 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Card Panduan Unjuk Kerja Observasi Minat RIASEC (Collapsible di Bawah Form) */}
            {(() => {
              const panduan = PANDUAN_RIASEC[currentRiasecCategory] || [];
              const isExpanded = expandedRiasecGuide === currentRiasecCategory;
              const relevanPanduan = panduan.filter(
                (p) => !p.cocokUntuk || p.cocokUntuk.includes(student.abk)
              );
              const hasRelevant = relevanPanduan.length > 0 && panduan.some((p) => p.cocokUntuk?.includes(student.abk));

              return (
                <div
                  style={{
                    background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                    borderRadius: 20,
                    border: "1.5px solid #FDE68A",
                    boxShadow: "0 2px 12px rgba(217, 119, 6, 0.08)",
                    overflow: "hidden",
                  }}
                >
                  {/* Header — always visible */}
                  <button
                    type="button"
                    onClick={() => setExpandedRiasecGuide(isExpanded ? null : currentRiasecCategory)}
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                    className="active:opacity-80 transition-opacity"
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: "#FEF3C7",
                        border: "1.5px solid #FDE68A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Lightbulb size={18} style={{ color: "#D97706" }} />
                    </div>
                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                      <p style={{
                        fontFamily: PJS, fontSize: 13.5, fontWeight: 800,
                        color: "#92400E", margin: 0, lineHeight: 1.25,
                      }}>
                        💡 Ide Aktivitas Observasi Minat ({currentRiasecCategory})
                      </p>
                      <p style={{
                        fontFamily: IPS, fontSize: 11.5, fontWeight: 500,
                        color: "#B45309", margin: "2px 0 0", lineHeight: 1.3,
                      }}>
                        {hasRelevant ? `${relevanPanduan.length} aktivitas cocok untuk ${student.abk}` : `${panduan.length} aktivitas pemicu minat`}
                      </p>
                    </div>
                    <ChevronDown
                      size={18}
                      style={{
                        color: "#B45309",
                        flexShrink: 0,
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ padding: "0 14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {(hasRelevant ? relevanPanduan : panduan).map((akt, i) => (
                        <div
                          key={i}
                          style={{
                            background: "#FFFFFF",
                            borderRadius: 16,
                            border: "1px solid #FDE68A",
                            padding: "14px 16px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <Play size={13} style={{ color: "#D97706", flexShrink: 0 }} />
                            <h5 style={{
                              fontFamily: PJS, fontSize: 13, fontWeight: 800,
                              color: "#1E293B", margin: 0,
                            }}>
                              {akt.judul}
                            </h5>
                            {akt.cocokUntuk && akt.cocokUntuk.includes(student.abk) && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, fontFamily: PJS,
                                padding: "2px 8px", borderRadius: 9999,
                                background: "#D1FAE5", color: "#065F46", flexShrink: 0,
                              }}>
                                Cocok
                              </span>
                            )}
                          </div>
                          <p style={{
                            fontFamily: IPS, fontSize: 12, fontWeight: 400,
                            color: "#475569", margin: "0 0 10px", lineHeight: 1.45,
                          }}>
                            {akt.deskripsi}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <Eye size={12} style={{ color: "#64748B" }} />
                            <span style={{
                              fontFamily: PJS, fontSize: 11, fontWeight: 700, color: "#64748B",
                            }}>
                              Kecenderungan yang diamati:
                            </span>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {akt.perilakuDiamati.map((p, j) => (
                              <span
                                key={j}
                                style={{
                                  fontSize: 10.5, fontWeight: 600, fontFamily: PJS,
                                  padding: "3px 10px", borderRadius: 9999,
                                  background: "#FEF3C7", color: "#B45309",
                                  border: "1px solid #FDE68A",
                                }}
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {/* Info box */}
                      <div style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        padding: "10px 14px", borderRadius: 12,
                        background: "rgba(217, 119, 6, 0.08)",
                      }}>
                        <Info size={13} style={{ color: "#B45309", flexShrink: 0, marginTop: 1 }} />
                        <p style={{
                          fontFamily: IPS, fontSize: 11, fontWeight: 500,
                          color: "#92400E", margin: 0, lineHeight: 1.4,
                        }}>
                          Berikan aktivitas pemicu minat di atas kepada anak, lalu <strong>amati antusiasme dan responnya</strong> untuk mengisi skala frekuensi minat di atas.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Navigasi Bawah Slide RIASEC */}
            <div className="flex gap-2.5 pt-3 pb-4">
              <button
                type="button"
                onClick={handlePrevRiasecStep}
                style={{
                  flex: 1,
                  border: `1.5px solid ${BDR}`,
                  color: DEEP,
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 13,
                  minHeight: 46,
                  background: CARD,
                  borderRadius: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                className="active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={15} />
                <span>{riasecStep === 0 ? "Ke Fungsional" : "Sebelumnya"}</span>
              </button>

              <div style={{ flex: 2 }}>
                <PBtn
                  full
                  label={
                    riasecStep < RIASEC_KATEGORI.length - 1
                      ? `Lanjut: ${RIASEC_KATEGORI[riasecStep + 1] === "Investigative" ? "Investigasi" : RIASEC_KATEGORI[riasecStep + 1] === "Realistic" ? "Realistik" : RIASEC_KATEGORI[riasecStep + 1] === "Artistic" ? "Artistik" : RIASEC_KATEGORI[riasecStep + 1] === "Social" ? "Sosial" : RIASEC_KATEGORI[riasecStep + 1] === "Conventional" ? "Konvensional" : RIASEC_KATEGORI[riasecStep + 1]}`
                      : "Lanjut ke Catatan"
                  }
                  icon={riasecStep < RIASEC_KATEGORI.length - 1 ? <ArrowRight size={17} /> : <Check size={17} />}
                  onClick={handleNextRiasecStep}
                  size="md"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAHAP 3: CATATAN SUARA ── */}
        {tahap === "catatan" && (
          <div className="px-4 pt-4 pb-6 space-y-3">
            <div style={{ background: DEEP, borderRadius: 18, padding: "14px", color: "#FFFFFF", boxShadow: "0 4px 14px rgba(91,122,104,0.25)" }} className="flex items-start gap-2.5">
              <Info size={16} style={{ color: "#D4E8DA", flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs leading-relaxed" style={{ color: "#FFFFFF" }}>
                Catatan ini menjadi bahan tambahan pemetaan potensi jika ditemukan indikator yang tidak tercantum di checklist sebelumnya. Tekan tombol mikrofon lalu ceritakan langsung atau ketik manual.
              </p>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl p-4">
              <VoiceTextarea
                label="Catatan Tambahan Siswa"
                value={catatan} onChange={setCatatan} rows={6}
                placeholder={`Ceritakan apa yang Anda amati pada ${student.name.split(" ")[0]}`}
              />
            </div>

            {/* ── AI Merekam di Balik Layar ── */}
            <div
              style={{
                background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
                borderRadius: 16,
                padding: "12px 14px",
                border: "1.5px solid #A7F3D0",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "#D1FAE5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#059669",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <Sparkles size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 800, color: "#065F46", margin: 0 }}>
                    AI Merekam Catatan di Balik Layar
                  </p>
                  <span style={{ fontSize: 9.5, background: "#D1FAE5", color: "#047857", fontWeight: 800, padding: "1px 6px", borderRadius: 6, fontFamily: PJS }}>
                    Otomatis
                  </span>
                </div>
                <p style={{ fontFamily: IPS, fontSize: 11, color: "#047857", margin: 0, lineHeight: 1.45 }}>
                  Setiap narasi observasi yang Anda ketik atau rekam suara akan dipelajari AI untuk mempersonalisasi draf rapor & rekomendasi belajar <strong>{student.name.split(" ")[0]}</strong>.
                </p>
                {catatan.trim().length > 0 && (
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, fontFamily: PJS, fontWeight: 700, color: "#059669" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", display: "inline-block" }} />
                    <span>{catatan.trim().split(/\s+/).length} kata pengamatan siap diserap ke profil {student.name.split(" ")[0]}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: CARD, border: `1.5px solid rgba(91,122,104,0.35)`, borderRadius: 18, boxShadow: "0 2px 8px rgba(91,122,104,0.06)" }} className="px-4 py-3">
              <p className="text-xs font-bold mb-2" style={{ color: DEEP, fontFamily: PJS }}>Ringkasan sesi ini</p>
              {[
                { l: "Profil Fungsional", v: `${terisiFungsional} dari ${totalFungsional}` },
                { l: "Kecenderungan (RIASEC)", v: `${terisiRiasec} dari ${totalRiasec}` },
                { l: "Catatan suara", v: catatan.trim() ? `${catatan.trim().split(/\s+/).length} kata` : "kosong" },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between py-1">
                  <span className="text-xs" style={{ color: MUTED }}>{r.l}</span>
                  <span className="text-xs font-bold" style={{ color: TEXT, fontFamily: DMM }}>{r.v}</span>
                </div>
              ))}
            </div>

            {isSaved && (
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: 14,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle size={15} style={{ color: "#059669" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#059669", fontFamily: PJS }}>
                    Asesmen berhasil disimpan
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResultModal(true)}
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#059669",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontFamily: PJS,
                  }}
                >
                  Lihat Opsi
                </button>
              </div>
            )}

            {/* Penjelasan Proses AI Sareh Asih */}
            <div
              style={{
                background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
                borderRadius: 20,
                border: "1.5px solid #A7F3D0",
                padding: "16px 18px",
                boxShadow: "0 2px 10px rgba(5, 150, 105, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "#D1FAE5",
                    border: "1px solid #6EE7B7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#059669",
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: PJS,
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: "#065F46",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    Bagaimana AI Memproses Asesmen Ini?
                  </h4>
                  <p
                    style={{
                      fontFamily: IPS,
                      fontSize: 11.5,
                      color: "#047857",
                      margin: "2px 0 0",
                    }}
                  >
                    Kombinasi data checklist & narasi suara guru
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  {
                    num: "1",
                    title: "Sintesis Checklist & Catatan Suara",
                    desc: "AI menyatukan skor D1–D6 dan RIASEC dengan cerita suara guru untuk menangkap konteks nyata di luar lembar form.",
                  },
                  {
                    num: "2",
                    title: "Pemetaan Bakat & Minat Holland",
                    desc: "Menghitung kecenderungan bakat dominan dan profil fungsional siswa disesuaikan kebutuhan setiap anak.",
                  },
                  {
                    num: "3",
                    title: "Rekomendasi Belajar & Rencana Prestasi",
                    desc: "Menghasilkan adaptasi belajar individual di kelas serta peluang ekstrakurikuler atau lomba yang cocok.",
                  },
                ].map((step) => (
                  <div
                    key={step.num}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      background: "rgba(255, 255, 255, 0.8)",
                      borderRadius: 12,
                      padding: "10px 12px",
                      border: "1px solid rgba(167, 243, 208, 0.6)",
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#059669",
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: 800,
                        fontFamily: PJS,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {step.num}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: PJS,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#1E293B",
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {step.title}
                      </p>
                      <p
                        style={{
                          fontFamily: IPS,
                          fontSize: 11,
                          color: "#475569",
                          margin: "2px 0 0",
                          lineHeight: 1.4,
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl px-4 py-3.5 text-center">
              <p className="text-xs mb-2.5" style={{ color: MUTED }}>
                {!bisaSimpan
                  ? "Isi minimal satu indikator atau butir asesmen sebelum menyimpan."
                  : "Tekan tombol di bawah untuk menyimpan data dan memproses analisis AI."}
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setTahap("kecenderungan")}
                  style={{
                    flex: 1,
                    border: `1.5px solid ${BDR}`,
                    color: DEEP,
                    fontFamily: PJS,
                    fontWeight: 700,
                    fontSize: 13.5,
                    minHeight: 46,
                    background: CARD,
                    borderRadius: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                  className="active:scale-[0.98] transition-all"
                >
                  <ArrowLeft size={15} />
                  <span>Kembali</span>
                </button>
                <div style={{ flex: 2 }}>
                  <PBtn
                    full
                    label={isSaved ? "Tersimpan ✓ — Analisis Ulang (AI)" : "Simpan & Analisis Bakat (AI)"}
                    icon={<Sparkles size={16} />}
                    onClick={handleSimpan}
                    disabled={!bisaSimpan}
                    size="md"
                  />
                </div>
              </div>
              <p style={{ fontFamily: IPS, fontSize: 10.5, color: "#64748B", margin: "8px 0 0" }}>
                ✨ Otomatis menghasilkan Peta Bakat, Rekomendasi Belajar, & Rencana Intervensi
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── TOMBOL MELAYANG PANDUAN SKALA (FLOATING HELP BUTTON BULAT RINGKAS) ── */}
      {!showResultModal && !showIncompleteModal && !showScaleModal && !showRiasecScaleModal && (
        <button
          type="button"
          onClick={() => {
            setScaleModalTab(tahap === "kecenderungan" ? "riasec" : "fungsional");
            setShowScaleModal(true);
          }}
          style={{
            position: "absolute",
            bottom: 74,
            right: 16,
            zIndex: 40,
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #163828 0%, #2D5A43 100%)",
            color: "#FFFFFF",
            boxShadow: "0 6px 18px rgba(22, 56, 40, 0.40), 0 2px 5px rgba(0,0,0,0.15)",
            border: "2px solid rgba(255, 255, 255, 0.6)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="active:scale-90 transition-transform hover:brightness-110"
          title="Buka panduan arti skala penilaian"
        >
          <HelpCircle size={22} strokeWidth={2.4} />
        </button>
      )}

      {/* ── POP UP MODAL SETELAH SIMPAN (Lihat Hasil Asesmen / Kembali ke Catatan) — Terkunci Penuh di Frame HP ── */}
      {showResultModal && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            touchAction: "none",
            overscrollBehavior: "contain",
          }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#FFFFFF",
              borderRadius: 24,
              padding: "24px 20px 20px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.20)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Close 'X' button in top-right */}
            <button
              type="button"
              onClick={handleKembali}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#F1F5F9",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
              }}
              className="hover:bg-slate-200 active:scale-95 transition-all"
              title="Tutup"
            >
              <X size={16} />
            </button>

            {/* Success Icon */}
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 20,
                background: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
                boxShadow: "0 4px 14px rgba(5, 150, 105, 0.18)",
              }}
            >
              <CheckCircle size={32} style={{ color: "#059669" }} />
            </div>

            {/* Title & Description */}
            <h3
              style={{
                fontFamily: PJS,
                fontSize: 18,
                fontWeight: 800,
                color: "#1B2E24",
                margin: "0 0 8px",
                lineHeight: 1.3,
              }}
            >
              Asesmen & Analisis AI Selesai!
            </h3>
            <p
              style={{
                fontFamily: IPS,
                fontSize: 13,
                color: "#5A6E63",
                margin: "0 0 20px",
                lineHeight: 1.5,
              }}
            >
              Data asesmen checklist dan catatan suara untuk <strong>{student.name}</strong> telah berhasil disimpan & dianalisis oleh AI.
            </p>

            {/* Actions */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Button 1: Lihat Hasil Asesmen */}
              <button
                type="button"
                onClick={handleLihatHasil}
                style={{
                  width: "100%",
                  minHeight: 46,
                  background: "#2D543E",
                  color: "#FFFFFF",
                  fontFamily: PJS,
                  fontWeight: 800,
                  fontSize: 14,
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(45, 84, 62, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                className="hover:brightness-105 active:scale-95 transition-all"
              >
                <Sparkles size={16} />
                <span>Lihat Hasil & Peta Bakat (AI)</span>
              </button>

              {/* Button 2: Kembali (Redirects to Catatan) */}
              <button
                type="button"
                onClick={handleKembali}
                style={{
                  width: "100%",
                  minHeight: 44,
                  background: "#F8FAFC",
                  color: "#475569",
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 13.5,
                  borderRadius: 14,
                  border: "1.5px solid #E2E8F0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                className="hover:bg-slate-100 active:scale-95 transition-all"
              >
                <ArrowLeft size={15} />
                <span>Kembali</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── MODAL VALIDASI BUTIR BELUM TERISI ── */}
      {showIncompleteModal && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            touchAction: "none",
            overscrollBehavior: "contain",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#FFFFFF",
              borderRadius: 24,
              padding: "24px 20px 20px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.20)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                background: "#FEF3C7",
                color: "#D97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                border: "1px solid #FDE68A",
              }}
            >
              <AlertCircle size={26} />
            </div>

            <h3
              style={{
                fontFamily: PJS,
                fontSize: 16.5,
                fontWeight: 800,
                color: "#1E293B",
                margin: "0 0 6px",
                textAlign: "center",
              }}
            >
              Ada Butir yang Belum Diisi
            </h3>

            <p
              style={{
                fontFamily: IPS,
                fontSize: 13,
                lineHeight: 1.5,
                color: MUTED,
                textAlign: "center",
                margin: "0 0 18px",
              }}
            >
              Terdapat <strong style={{ color: "#D97706" }}>{tahap === "fungsional" ? currentCategoryUnanswered.length : currentRiasecUnanswered.length} dari 12 butir</strong> pada aspek <strong>{tahap === "fungsional" ? currentCategory : (currentRiasecCategory === "Investigative" ? "Investigasi" : currentRiasecCategory === "Realistic" ? "Realistik" : currentRiasecCategory === "Artistic" ? "Artistik" : currentRiasecCategory === "Social" ? "Sosial" : currentRiasecCategory === "Conventional" ? "Konvensional" : currentRiasecCategory)}</strong> yang belum dinilai.
            </p>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 9 }}>
              {/* Opsi 1: Lengkapi Sekarang */}
              <button
                type="button"
                onClick={tahap === "fungsional" ? handleReviewCurrentUnanswered : handleReviewCurrentRiasecUnanswered}
                style={{
                  width: "100%",
                  minHeight: 46,
                  background: DEEP,
                  color: "#FFFFFF",
                  fontFamily: PJS,
                  fontWeight: 800,
                  fontSize: 13.5,
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(45, 84, 62, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                className="hover:brightness-105 active:scale-95 transition-all"
              >
                <span>Lengkapi Butir yang Belum</span>
              </button>

              {/* Opsi 2: Tandai Tidak Dijawab & Lanjut */}
              <button
                type="button"
                onClick={tahap === "fungsional" ? handleMarkCurrentNAAndProceed : handleMarkCurrentRiasecNAAndProceed}
                style={{
                  width: "100%",
                  minHeight: 44,
                  background: "#F1F5F9",
                  color: "#334155",
                  fontFamily: PJS,
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: 14,
                  border: "1.5px solid #CBD5E1",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                className="hover:bg-slate-200 active:scale-95 transition-all"
              >
                <span>Tandai "Tidak Dijawab" & Lanjut</span>
              </button>

              {/* Batal */}
              <button
                type="button"
                onClick={() => setShowIncompleteModal(false)}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  background: "transparent",
                  color: MUTED,
                  fontFamily: PJS,
                  fontWeight: 600,
                  fontSize: 12,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL BOTTOM SHEET: PANDUAN SKALA (FUNGSIONAL & RIASEC DENGAN SWITCHER TAB) ── */}
      {showScaleModal && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={() => setShowScaleModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 430,
              background: "#FFFFFF",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: "20px 20px 24px",
              boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.2)",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div style={{ width: 40, height: 4, background: "#CBD5E1", borderRadius: 9999, margin: "0 auto 14px", flexShrink: 0 }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    background: scaleModalTab === "fungsional" ? "#E0F2FE" : "#FEF3C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: scaleModalTab === "fungsional" ? "#0284C7" : "#D97706",
                    transition: "all 0.2s ease",
                  }}
                >
                  {scaleModalTab === "fungsional" ? <HelpCircle size={22} /> : <Sparkles size={20} />}
                </div>
                <div>
                  <h3 style={{ fontFamily: PJS, fontSize: 16, fontWeight: 800, color: "#1E293B", margin: 0 }}>
                    {scaleModalTab === "fungsional" ? "Panduan Skala Kemandirian" : "Arti Frekuensi Ketertarikan (RIASEC)"}
                  </h3>
                  <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#64748B", margin: "2px 0 0" }}>
                    {scaleModalTab === "fungsional" ? "Skala profil fungsional domain D1 – D6" : "Skala observasi minat & bakat siswa"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScaleModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#F1F5F9",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748B",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Segmented Switcher Tab */}
            <div style={{ display: "flex", gap: 6, background: "#F1F5F9", padding: 4, borderRadius: 14, marginBottom: 14, flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setScaleModalTab("fungsional")}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: 10,
                  border: "none",
                  background: scaleModalTab === "fungsional" ? "#FFFFFF" : "transparent",
                  color: scaleModalTab === "fungsional" ? "#0284C7" : "#64748B",
                  fontFamily: PJS,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: scaleModalTab === "fungsional" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>🧠</span>
                <span>Fungsional (D1–D6)</span>
              </button>
              <button
                type="button"
                onClick={() => setScaleModalTab("riasec")}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: 10,
                  border: "none",
                  background: scaleModalTab === "riasec" ? "#FFFFFF" : "transparent",
                  color: scaleModalTab === "riasec" ? "#059669" : "#64748B",
                  fontFamily: PJS,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: scaleModalTab === "riasec" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span>🎯</span>
                <span>Minat (RIASEC)</span>
              </button>
            </div>

            {/* Banner Konteks Waktu Penyusunan Asesmen */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 14,
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                marginBottom: 12,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 16, marginTop: 1 }}>🗓️</span>
              <div>
                <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: "#166534", margin: 0 }}>
                  Waktu Penyusunan Asesmen
                </p>
                <p style={{ fontFamily: IPS, fontSize: 11, color: "#15803D", margin: "2px 0 0", lineHeight: 1.45 }}>
                  Guru menyusun asesmen di <strong>awal tahun ajaran</strong> sebagai baseline/diagnostik pembelajaran (PPI), kemudian <strong>disesuaikan & diselaraskan pada tahun berikutnya</strong>.
                </p>
              </div>
            </div>

            {/* List Skala */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9, overflowY: "auto", paddingRight: 2 }}>
              {(scaleModalTab === "fungsional" ? [
                {
                  badge: "0",
                  label: "Tidak/Belum Bisa",
                  desc: "Siswa belum mampu atau belum bisa melakukan aktivitas ini sama sekali.",
                  bg: "#FEE2E2",
                  border: "#FECACA",
                  color: "#DC2626",
                },
                {
                  badge: "1",
                  label: "Banyak Bantuan",
                  desc: "Mampu mencoba, namun membutuhkan banyak bantuan (pendampingan fisik penuh atau bimbingan intensif langkah demi langkah).",
                  bg: "#FEF3C7",
                  border: "#FDE68A",
                  color: "#D97706",
                },
                {
                  badge: "2",
                  label: "Sedikit Bantuan",
                  desc: "Mampu melakukan sebagian besar, hanya memerlukan sedikit bantuan (arahan lisan minimal, isyarat, atau pengingat).",
                  bg: "#DCFCE7",
                  border: "#BBF7D0",
                  color: "#16A34A",
                },
                {
                  badge: "3",
                  label: "Sudah Mandiri",
                  desc: "Sudah mampu menyelesaikan secara konsisten, tuntas, dan mandiri tanpa bantuan guru/pendamping.",
                  bg: "#D1FAE5",
                  border: "#86EFAC",
                  color: "#065F46",
                },
                {
                  badge: "N/A",
                  label: "Tidak Dapat Dijawab",
                  desc: "Indikator belum diobservasi pada sesi ini atau tidak relevan dengan kondisi fisik anak.",
                  bg: "#F1F5F9",
                  border: "#CBD5E1",
                  color: "#64748B",
                },
              ] : [
                {
                  badge: "0",
                  label: "Tidak Pernah",
                  desc: "Siswa tidak tertarik atau menolak aktivitas ini sama sekali saat diberikan kesempatan.",
                  bg: "#FEE2E2",
                  border: "#FECACA",
                  color: "#DC2626",
                },
                {
                  badge: "1",
                  label: "Kadang",
                  desc: "Kadang-kadang tertarik / hanya mau mencoba jika diajak teman atau dipandu guru.",
                  bg: "#FEF3C7",
                  border: "#FDE68A",
                  color: "#D97706",
                },
                {
                  badge: "2",
                  label: "Sering / Selalu",
                  desc: "Sering atau selalu tertarik, menunjukkan antusiasme tinggi, fokus konsisten, dan inisiatif mandiri.",
                  bg: "#D1FAE5",
                  border: "#86EFAC",
                  color: "#065F46",
                },
                {
                  badge: "N/A",
                  label: "Tidak Dapat Dijawab",
                  desc: "Aktivitas belum pernah diobservasi atau tidak dapat diujikan dalam sesi ini.",
                  bg: "#F1F5F9",
                  border: "#CBD5E1",
                  color: "#64748B",
                },
              ]).map((item) => (
                <div
                  key={item.badge}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <span
                    style={{
                      fontFamily: PJS,
                      fontWeight: 800,
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 10,
                      background: item.bg,
                      border: `1px solid ${item.border}`,
                      color: item.color,
                      minWidth: 46,
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.badge}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: "#1E293B", margin: 0 }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: IPS, fontSize: 11.5, color: "#64748B", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowScaleModal(false)}
              style={{
                width: "100%",
                marginTop: 14,
                padding: "12px",
                borderRadius: 14,
                background: scaleModalTab === "fungsional" ? "#0284C7" : "#059669",
                color: "#FFFFFF",
                fontFamily: PJS,
                fontWeight: 800,
                fontSize: 13.5,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }}
              className="active:scale-[0.98]"
            >
              Mengerti, Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
