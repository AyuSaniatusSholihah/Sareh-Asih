import { useState, useRef } from "react";
import {
  Sparkles, CheckCircle, ChevronRight, ChevronDown, Info, ClipboardList, Gauge, X, ArrowLeft,
  AlertCircle, ArrowRight, Check, Users,
} from "lucide-react";
import {
  T, A, BG, CARD, TEXT, MUTED, SEC, BDR, DEEP, PJS, IPS, DMM, PBtn, TBar,
} from "./ui-kit";
import {
  FUNGSIONAL_KATEGORI, FUNGSIONAL_META, SKALA_FUNGSIONAL, PROFIL_FUNGSIONAL,
  RIASEC_KATEGORI, RIASEC_META, SKALA_RIASEC, PROFIL_KECENDERUNGAN,
  useStudents, type FungsionalKategori, type RiasecKategori,
} from "./data";
import { VoiceTextarea } from "./voice-input";

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
  const [highlightUnanswered, setHighlightUnanswered] = useState<boolean>(false);
  const [highlightUnansweredRiasec, setHighlightUnansweredRiasec] = useState<boolean>(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

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
    return Math.round(list.reduce((s, a) => s + skorRiasec[a.id], 0) / list.length * 100 / 3);
  };

  const bisaSimpan = terisiFungsional > 0 || terisiRiasec > 0;

  const handleSimpan = () => {
    if (!bisaSimpan) return;
    setIsSaved(true);
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

            {/* 2. Category Filter Pills (Tanpa 'Semua Kategori' sesuai permintaan user) */}
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
                      {DOMAIN_SHORT[kat]}
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

            {/* 3. Card Arti Tingkat Kemampuan (Sesuai Referensi Gambar) */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 24,
                border: "1.5px solid #E2E8F0",
                padding: "18px 20px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
              }}
            >
              <h4
                style={{
                  fontFamily: PJS,
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#1E293B",
                  margin: "0 0 14px",
                }}
              >
                Arti tingkat kemampuan
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    badge: "N/A",
                    desc: "Tidak dapat dijawab / diamati",
                    bg: "#EEF2F6",
                    border: "#CBD5E1",
                    color: "#64748B",
                  },
                  {
                    badge: "Belum",
                    desc: "0 Belum bisa sama sekali",
                    bg: "#FEE2E2",
                    border: "#FECACA",
                    color: "#DC2626",
                  },
                  {
                    badge: "Dibantu",
                    desc: "1 Bisa dengan bantuan penuh",
                    bg: "#FEF3C7",
                    border: "#FDE68A",
                    color: "#D97706",
                  },
                  {
                    badge: "Sebagian",
                    desc: "2 Bisa sebagian, butuh diingatkan",
                    bg: "#DCFCE7",
                    border: "#BBF7D0",
                    color: "#16A34A",
                  },
                  {
                    badge: "Mandiri",
                    desc: "3 Bisa sendiri secara konsisten",
                    bg: "#D1FAE5",
                    border: "#86EFAC",
                    color: "#065F46",
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span
                      style={{
                        fontFamily: PJS,
                        fontWeight: 800,
                        fontSize: 12,
                        padding: "4px 14px",
                        borderRadius: 9999,
                        background: item.bg,
                        border: `1px solid ${item.border}`,
                        color: item.color,
                        minWidth: 74,
                        textAlign: "center",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    >
                      {item.badge}
                    </span>
                    <span
                      style={{
                        fontFamily: IPS,
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: "#475569",
                        lineHeight: 1.35,
                      }}
                    >
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
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
                    <h3 style={{ fontFamily: PJS, fontSize: 16.5, fontWeight: 800, color: "#1E293B", margin: 0, lineHeight: 1.25 }}>
                      {currentCategory}
                    </h3>
                    <p style={{ fontFamily: IPS, fontSize: 12, color: "#64748B", margin: "4px 0 0", lineHeight: 1.35, fontWeight: 400 }}>
                      {currentMeta.desc}
                    </p>
                  </div>
                </div>

                {/* Counter Pill Badge */}
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: 9999,
                    background: "#F0F9FF",
                    border: "1.5px solid #BAE6FD",
                    color: "#0284C7",
                    fontFamily: PJS,
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {currentCategoryAnswered.length}/{currentCategoryItems.length}
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

                      {/* 4 Pilihan Skala Kemampuan */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                        {[
                          { v: 0, label: "Belum" },
                          { v: 1, label: "Dibantu" },
                          { v: 2, label: "Sebagian" },
                          { v: 3, label: "Mandiri" },
                        ].map(opt => {
                          const isSelected = skorFungsional[a.id] === opt.v;
                          return (
                            <button
                              key={opt.v}
                              type="button"
                              onClick={() => setSkorFungsional(p => ({ ...p, [a.id]: opt.v }))}
                              style={{
                                height: 44,
                                borderRadius: 16,
                                background: isSelected ? "#FFA000" : "#FFFFFF",
                                border: isSelected ? "1.5px solid #FFA000" : "1.5px solid #CBD5E1",
                                color: isSelected ? "#FFFFFF" : "#334155",
                                fontFamily: PJS,
                                fontWeight: isSelected ? 800 : 700,
                                fontSize: 12.5,
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

            {/* Navigasi Bawah Slide */}
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

            {/* 2. Category Filter Pills (Tanpa 'Semua Kategori' sesuai instruksi) */}
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
                const katLabel = kat === "Investigative" ? "Investigasi" : kat === "Realistic" ? "Realistik" : kat === "Artistic" ? "Artistik" : kat === "Social" ? "Sosial" : kat === "Conventional" ? "Konvensional" : kat;

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

            {/* 3. Card Arti Frekuensi Ketertarikan (Sesuai Desain Fungsional) */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 24,
                border: "1.5px solid #E2E8F0",
                padding: "18px 20px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
              }}
            >
              <h4
                style={{
                  fontFamily: PJS,
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#1E293B",
                  margin: "0 0 14px",
                }}
              >
                Arti frekuensi ketertarikan
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { badge: "N/A", desc: "Tidak dapat dijawab / diamati", bg: "#EEF2F6", border: "#CBD5E1", color: "#64748B" },
                  { badge: "Tidak Pernah", desc: "0 Tidak pernah sama sekali", bg: "#FEE2E2", border: "#FECACA", color: "#DC2626" },
                  { badge: "Kadang", desc: "1 Kadang-kadang tertarik / melakukan", bg: "#FEF3C7", border: "#FDE68A", color: "#D97706" },
                  { badge: "Sering", desc: "2 Sering tertarik / melakukan", bg: "#DCFCE7", border: "#BBF7D0", color: "#16A34A" },
                  { badge: "Sangat Sering", desc: "3 Sangat sering, antusias konsisten", bg: "#D1FAE5", border: "#86EFAC", color: "#065F46" },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span
                      style={{
                        fontFamily: PJS,
                        fontWeight: 800,
                        fontSize: 11.5,
                        padding: "4px 10px",
                        borderRadius: 9999,
                        background: item.bg,
                        border: `1px solid ${item.border}`,
                        color: item.color,
                        minWidth: 88,
                        textAlign: "center",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    >
                      {item.badge}
                    </span>
                    <span
                      style={{
                        fontFamily: IPS,
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: "#475569",
                        lineHeight: 1.35,
                      }}
                    >
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
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
                    <h3 style={{ fontFamily: PJS, fontSize: 16.5, fontWeight: 800, color: "#1E293B", margin: 0, lineHeight: 1.25 }}>
                      {currentRiasecCategory === "Investigative" ? "Investigasi (Investigative)" : currentRiasecCategory === "Realistic" ? "Realistik (Realistic)" : currentRiasecCategory === "Artistic" ? "Artistik (Artistic)" : currentRiasecCategory === "Social" ? "Sosial (Social)" : currentRiasecCategory === "Enterprising" ? "Enterprising (Kewirausahaan)" : "Konvensional (Conventional)"}
                    </h3>
                    <p style={{ fontFamily: IPS, fontSize: 12, color: "#64748B", margin: "4px 0 0", lineHeight: 1.35, fontWeight: 400 }}>
                      {currentRiasecMeta.desc}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: 9999,
                    background: currentRiasecMeta.bg,
                    border: `1.5px solid ${currentRiasecMeta.color}40`,
                    color: currentRiasecMeta.color,
                    fontFamily: PJS,
                    fontWeight: 800,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {currentRiasecAnswered.length}/{currentRiasecItems.length}
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

                      {/* 4 Pilihan Skala Kemampuan */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                        {[
                          { v: 0, label: "Tidak Pernah" },
                          { v: 1, label: "Kadang" },
                          { v: 2, label: "Sering" },
                          { v: 3, label: "Sangat Sering" },
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

            <div style={{ background: CARD, border: `1px solid ${BDR}` }} className="rounded-2xl px-4 py-3 text-center">
              <p className="text-xs mb-2.5" style={{ color: MUTED }}>
                {!bisaSimpan ? "Isi minimal satu indikator atau butir asesmen sebelum menyimpan."
                  : "Data siap diproses AI untuk pemetaan bakat dan rekomendasi belajar."}
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
                    label={isSaved ? "Tersimpan ✓ — Simpan Ulang" : "Simpan & Proses AI"}
                    icon={<Sparkles size={15} />}
                    onClick={handleSimpan}
                    disabled={!bisaSimpan}
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
              Asesmen Tersimpan!
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
              Data asesmen untuk <strong>{student.name}</strong> telah berhasil disimpan. Silakan pilih langkah selanjutnya:
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
                <span>Lihat Hasil Asesmen</span>
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
    </div>
  );
}
