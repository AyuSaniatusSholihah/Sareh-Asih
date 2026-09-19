import { useState, useMemo } from "react";
import {
  CheckCircle, FileSpreadsheet, FileText, Download, Users, User,
  School, Check, MessageCircle, Printer, X, Share2,
  ChevronRight, BarChart3, Clock, ArrowLeft, Search,
  Laptop, QrCode, Monitor, RefreshCw, Copy, LogOut,
  Globe, ExternalLink, ShieldCheck, Smartphone, Sparkles, Settings,
} from "lucide-react";
import { CARD, TEXT, MUTED, SEC, T, A, DEEP, PJS, IPS, BG, BDR, DMM, useUI } from "../ui-kit";
import { useStudents, type Student } from "../data";
import { exportSpreadsheet, exportLaporanPemetaan, printReportPDF } from "../export";

type ReportView = "main" | "detail" | "web-connect";
type FilterScope = "semua" | "kelas" | "anak";
type OverviewTab = "kelas" | "anak";

interface ConnectedDeviceInfo {
  name: string;
  os: string;
  browser: string;
  ip: string;
  lastActive: string;
}

export function ReportScreen({ namaSekolah, onProfile }: { namaSekolah: string; onProfile?: () => void }) {
  const { openSearch, openSettings } = useUI();
  const students = useStudents();
  const [view, setView] = useState<ReportView>("main");
  const [overviewTab, setOverviewTab] = useState<OverviewTab>("kelas");
  const [filterScope, setFilterScope] = useState<FilterScope>("semua");
  const [selectedClass, setSelectedClass] = useState<string>("Semua");
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(new Set());
  const [searchAnak, setSearchAnak] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Web Connect / WhatsApp Web style state
  const [isConnectedWeb, setIsConnectedWeb] = useState(true);
  const [connectedDevice, setConnectedDevice] = useState<ConnectedDeviceInfo | null>({
    name: "Laptop Guru (ThinkPad E14)",
    os: "Windows 11 Pro",
    browser: "Google Chrome 124.0",
    ip: "192.168.1.42 (WiFi Sekolah)",
    lastActive: "Aktif sekarang",
  });
  const [webSessionCode, setWebSessionCode] = useState("SA-8942");
  const [isScanning, setIsScanning] = useState(false);
  const [showPCPreviewModal, setShowPCPreviewModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const classes = useMemo(() => Array.from(new Set(students.map(s => s.kelas))).sort(), [students]);
  const totalObs = students.filter(s => s.hasObs).length;
  const totalNotObs = students.length - totalObs;
  const byClass = useMemo(() => classes.map(k => {
    const ss = students.filter(s => s.kelas === k);
    return { kelas: k, total: ss.length, obs: ss.filter(s => s.hasObs).length };
  }), [classes, students]);

  const filteredList = useMemo(() => {
    if (filterScope === "semua") return students;
    if (filterScope === "kelas") {
      if (selectedClass === "Semua") return students;
      return students.filter(s => s.kelas.toLowerCase().replace(/\s+/g, "") === selectedClass.toLowerCase().replace(/\s+/g, ""));
    }
    if (filterScope === "anak") {
      if (selectedStudentIds.size === 0) return students;
      return students.filter(s => selectedStudentIds.has(s.id));
    }
    return students;
  }, [students, filterScope, selectedClass, selectedStudentIds]);

  const searchedAnakList = useMemo(() => {
    if (!searchAnak.trim()) return students;
    const q = searchAnak.toLowerCase();
    return students.filter(s => s.name.toLowerCase().includes(q) || s.abk.toLowerCase().includes(q) || s.kelas.toLowerCase().includes(q));
  }, [students, searchAnak]);

  const toggleStudent = (id: number) => setSelectedStudentIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const allSearchedSelected = searchedAnakList.length > 0 && searchedAnakList.every(s => selectedStudentIds.has(s.id));
  const toggleAllSearched = () => {
    if (allSearchedSelected) {
      setSelectedStudentIds(prev => { const next = new Set(prev); searchedAnakList.forEach(s => next.delete(s.id)); return next; });
    } else {
      setSelectedStudentIds(prev => { const next = new Set(prev); searchedAnakList.forEach(s => next.add(s.id)); return next; });
    }
  };

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3200); };
  const handleDownloadExcel = () => { exportSpreadsheet(filteredList, namaSekolah); showToast(`Rekap Excel ${filteredList.length} siswa berhasil diunduh!`); };
  const handleDownloadWord = () => { exportLaporanPemetaan(filteredList, namaSekolah); showToast(`Laporan Rapor ${filteredList.length} siswa berhasil diunduh!`); };
  const handleDownloadPDF = () => { printReportPDF(filteredList, namaSekolah); showToast(`Format PDF ${filteredList.length} siswa disiapkan untuk dicetak/disimpan!`); };

  const handleShareWA = () => {
    // 1. Output dokumen PDF resmi secara otomatis
    printReportPDF(filteredList, namaSekolah);

    // 2. Format teks WhatsApp untuk dibagikan
    const isPerAnak = filterScope === "anak" && selectedStudentIds.size === 1;
    const student = filteredList[0];
    let lines: string[];

    if (isPerAnak && student) {
      lines = [
        `*Laporan Pemetaan Bakat Siswa (Format PDF)*`,
        `*${student.name}*`,
        `*${namaSekolah}*`,
        "",
        `Kelas: ${student.kelas}`,
        `Kekhususan: ${student.abk}`,
        `Status: ${student.hasObs ? "Sudah dipetakan bakat" : "Belum diamati"}`,
        student.talent ? `Bakat Dominan: ${student.talent}` : "",
        "",
        "Dokumen laporan lengkap dalam format PDF telah disiapkan.",
        "Terima kasih atas perhatian dan kerja samanya.",
        "_Sareh Asih - Sistem Pemetaan Bakat ABK_",
      ].filter(Boolean);
    } else {
      const scopeLabel = filterScope === "kelas" && selectedClass !== "Semua" ? `Kelas ${selectedClass}` : `${filteredList.length} Siswa`;
      lines = [
        `*Laporan Rekap Pemetaan Bakat (Format PDF)*`,
        `*${namaSekolah}*`,
        "",
        `Cakupan: ${scopeLabel}`,
        `Total Siswa: ${filteredList.length}`,
        `Sudah Terpetakan: ${filteredList.filter(s => s.hasObs).length} siswa`,
        `Belum Diamati: ${filteredList.filter(s => !s.hasObs).length} siswa`,
        "",
        "Dokumen rekap laporan resmi format PDF telah disiapkan untuk dibagikan.",
        "_Sareh Asih - Sistem Pemetaan Bakat ABK_",
      ];
    }

    showToast("Dokumen PDF disiapkan & membuka WhatsApp...");
    setTimeout(() => {
      window.open(`https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
    }, 400);
  };

  // ─── WEB CONNECT ACTIONS ───────────────────────────────────────────────────
  const handleConnectWeb = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsConnectedWeb(true);
      setIsScanning(false);
      setConnectedDevice({
        name: "Laptop Guru (ThinkPad E14)",
        os: "Windows 11 Pro",
        browser: "Google Chrome 124.0",
        ip: "192.168.1.42 (WiFi Sekolah)",
        lastActive: "Aktif sekarang",
      });
      showToast("Laptop berhasil terhubung ke Sareh Asih Web!");
    }, 1100);
  };

  const handleDisconnectWeb = () => {
    setIsConnectedWeb(false);
    setConnectedDevice(prev => prev ? { ...prev, lastActive: "1 menit yang lalu" } : null);
    showToast("Koneksi laptop telah diputuskan.");
  };

  const handleRefreshCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "SA-";
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    setWebSessionCode(code);
    showToast("Kode sesi baru diperbarui.");
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(webSessionCode);
    setCopiedCode(true);
    showToast(`Kode ${webSessionCode} disalin!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // ─── 1. WEB CONNECT VIEW (Hubungkan ke Web PC) ───────────────────────────
  if (view === "web-connect") {
    return (
      <div className="flex-1 overflow-y-auto relative" style={{ fontFamily: IPS, background: BG }}>
        {toastMsg && (
          <div style={{ margin: "12px 16px 0", background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle size={16} style={{ color: "#059669", flexShrink: 0 }} />
            <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: "#065F46", margin: 0 }}>{toastMsg}</p>
          </div>
        )}

        {/* Header Hubungkan ke Web */}
        <div style={{ background: "#FFFFFF", padding: "16px 20px 14px", borderBottom: "1px solid rgba(91,122,104,0.12)", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 30 }}>
          <button
            onClick={() => setView("main")}
            style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(139,176,152,0.14)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1B2E24", flexShrink: 0 }}
            className="active:scale-95 transition-transform"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>Hubungkan ke Web</h1>
            <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "2px 0 0" }}>sareh_asih.id (Browser Laptop & PC)</p>
          </div>
        </div>

        <div style={{ padding: "16px 16px 120px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Petunjuk Langkah Penggunaan */}
          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px", border: "1px solid rgba(91,122,104,0.12)", boxShadow: "0 2px 8px rgba(91,122,104,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(45,84,62,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: DEEP }}>
                <Laptop size={16} />
              </div>
              <div>
                <h2 style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: 0 }}>Ekspor & Kelola via PC</h2>
                <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>Cetak rapor massal & unduh Excel Dapodik</p>
              </div>
            </div>

            <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "12px 14px", border: "1px solid #EDF2F7", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: DEEP, color: "#FFFFFF", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: PJS }}>1</span>
                <div>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>Buka browser di laptop/PC</p>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "2px 0 0" }}>Kunjungi tautan: <span style={{ color: "#2563EB", fontWeight: 700 }}>sareh_asih.id</span></p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: DEEP, color: "#FFFFFF", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: PJS }}>2</span>
                <div>
                  <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>Scan QR Code atau ketik Kode Sesi</p>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "2px 0 0" }}>Perangkat akan otomatis terhubung tanpa perlu login ulang</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Kode Undangan / Sesi */}
          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px 16px", border: "1px solid rgba(91,122,104,0.12)", textAlign: "center", boxShadow: "0 2px 8px rgba(91,122,104,0.04)" }}>
            <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 800, color: TEXT, margin: "0 0 14px" }}>Scan QR Code di Layar Laptop</p>

            {/* Simulated Realistis QR Code */}
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", padding: 14, background: "#FFFFFF", borderRadius: 18, border: "2px solid #E2E8F0", boxShadow: "0 4px 14px rgba(0,0,0,0.06)", position: "relative" }}>
              <div style={{ width: 170, height: 170, background: "#F8FAFC", borderRadius: 12, padding: 10, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, position: "relative" }}>
                {/* 4 Corners finder pattern */}
                <div style={{ position: "absolute", top: 12, left: 12, width: 38, height: 38, border: "4px solid #1B382B", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 16, height: 16, background: "#1B382B", borderRadius: 4 }} />
                </div>
                <div style={{ position: "absolute", top: 12, right: 12, width: 38, height: 38, border: "4px solid #1B382B", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 16, height: 16, background: "#1B382B", borderRadius: 4 }} />
                </div>
                <div style={{ position: "absolute", bottom: 12, left: 12, width: 38, height: 38, border: "4px solid #1B382B", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 16, height: 16, background: "#1B382B", borderRadius: 4 }} />
                </div>
                {/* Center logo badge */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 44, height: 44, borderRadius: 10, background: "#1B382B", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
                  <Laptop size={20} />
                </div>
                {/* Random decorative QR cells */}
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} style={{ background: i % 2 === 0 ? "rgba(27,56,43,0.75)" : "transparent", borderRadius: 2 }} />
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: isConnectedWeb ? "#10B981" : "#F59E0B" }} />
                <span style={{ fontFamily: IPS, fontSize: 11, color: MUTED }}>{isConnectedWeb ? "Sesi web aktif" : "Menunggu pemindaian..."}</span>
              </div>
            </div>

            {/* Atau Input Kode Sesi */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px dashed rgba(91,122,104,0.18)" }}>
              <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "0 0 8px" }}>Atau masukkan kode undangan di laptop:</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F1F5F9", padding: "8px 14px", borderRadius: 14, border: "1.5px solid #CBD5E1" }}>
                <span style={{ fontFamily: PJS, fontSize: 19, fontWeight: 800, letterSpacing: 2, color: DEEP }}>{webSessionCode}</span>
                <button type="button" onClick={handleCopyCode} style={{ background: "transparent", border: "none", cursor: "pointer", color: copiedCode ? "#059669" : DEEP, padding: 4, display: "flex", alignItems: "center" }} title="Salin Kode">
                  {copiedCode ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
                </button>
                <button type="button" onClick={handleRefreshCode} style={{ background: "transparent", border: "none", cursor: "pointer", color: MUTED, padding: 4, display: "flex", alignItems: "center" }} title="Perbarui Kode">
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {/* Tombol Aksi Hubungkan Cepat / Simulasi */}
            <div style={{ marginTop: 16 }}>
              {!isConnectedWeb ? (
                <button
                  type="button"
                  onClick={handleConnectWeb}
                  disabled={isScanning}
                  style={{ width: "100%", padding: "12px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #1B382B, #2D543E)", color: "#FFFFFF", fontFamily: PJS, fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(27,56,43,0.25)" }}
                  className="active:scale-[0.98] transition-transform"
                >
                  <QrCode size={16} />
                  <span>{isScanning ? "Menghubungkan ke Laptop..." : "Tautkan Laptop Ini (Scan Berhasil)"}</span>
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowPCPreviewModal(true)}
                    style={{ flex: 1, padding: "11px", borderRadius: 14, border: "1.5px solid #2563EB", background: "#EFF6FF", color: "#1D4ED8", fontFamily: PJS, fontSize: 12.5, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    className="active:scale-95 transition-transform"
                  >
                    <ExternalLink size={15} />
                    <span>Layar Laptop</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDisconnectWeb}
                    style={{ padding: "11px 16px", borderRadius: 14, border: "1.5px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", fontFamily: PJS, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    className="active:scale-95 transition-transform"
                  >
                    <LogOut size={15} />
                    <span>Putuskan</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Informasi Perangkat Terhubung (WhatsApp Web Style) */}
          <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px", border: "1px solid rgba(91,122,104,0.12)", boxShadow: "0 2px 8px rgba(91,122,104,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Monitor size={16} style={{ color: DEEP }} />
                <h3 style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>Perangkat yang Terhubung</h3>
              </div>
              <span style={{ fontSize: 10.5, fontFamily: PJS, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: isConnectedWeb ? "#ECFDF5" : "#F1F5F9", color: isConnectedWeb ? "#059669" : MUTED }}>
                {isConnectedWeb ? "1 Perangkat Aktif" : "Tidak Ada"}
              </span>
            </div>

            {isConnectedWeb && connectedDevice ? (
              <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "12px 14px", border: "1px solid #EDF2F7", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(45,84,62,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: DEEP, flexShrink: 0 }}>
                  <Laptop size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: TEXT, margin: 0 }}>{connectedDevice.name}</p>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontFamily: PJS, fontWeight: 700, color: "#059669", background: "#ECFDF5", padding: "1px 6px", borderRadius: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669" }} />Aktif
                    </span>
                  </div>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "2px 0 0" }}>{connectedDevice.browser} · {connectedDevice.os}</p>
                  <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: "2px 0 0" }}>Jaringan: {connectedDevice.ip}</p>
                  <p style={{ fontFamily: PJS, fontSize: 10.5, fontWeight: 700, color: DEEP, margin: "4px 0 0" }}>Terakhir aktif: {connectedDevice.lastActive}</p>
                </div>
              </div>
            ) : (
              <div style={{ padding: "18px 12px", textAlign: "center", background: "#F8FAFC", borderRadius: 14, border: "1px dashed #CBD5E1" }}>
                <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0 }}>Belum ada laptop yang terhubung</p>
                <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: "3px 0 0" }}>Gunakan tombol di atas untuk menautkan perangkat PC Anda</p>
              </div>
            )}

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, color: MUTED, fontSize: 10.5, fontFamily: IPS }}>
              <ShieldCheck size={13} style={{ color: "#059669", flexShrink: 0 }} />
              <span>Koneksi aman terenkripsi end-to-end antar perangkat</span>
            </div>
          </div>
        </div>

        {/* Modal Pratinjau Tampilan Web Laptop (sareh_asih.id) */}
        {showPCPreviewModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.60)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 14, backdropFilter: "blur(4px)" }}>
            <div style={{ background: "#FFFFFF", borderRadius: 24, width: "100%", maxWidth: 360, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.20)", display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
              {/* Fake Browser Window Header */}
              <div style={{ background: "#1E293B", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 6, padding: "3px 8px", textAlign: "center", color: "#94A3B8", fontSize: 10, fontFamily: IPS, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <Globe size={11} /><span>sareh_asih.id/portal-guru</span>
                </div>
                <button type="button" onClick={() => setShowPCPreviewModal(false)} style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <X size={15} />
                </button>
              </div>

              {/* PC Content View */}
              <div style={{ padding: "14px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "12px", border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: PJS, fontSize: 12, fontWeight: 800, color: DEEP }}>{namaSekolah}</span>
                    <span style={{ fontSize: 9.5, background: "#ECFDF5", color: "#059669", fontWeight: 700, padding: "2px 6px", borderRadius: 6 }}>PC Mode</span>
                  </div>
                  <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>Dashboard Ekspor Layar Lebar ({students.length} Siswa)</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 800, color: TEXT, margin: 0 }}>Aksi Ekspor di PC/Laptop:</p>
                  <button
                    type="button"
                    onClick={() => { exportSpreadsheet(students, namaSekolah); showToast("File Excel Dapodik diunduh!"); }}
                    style={{ padding: "10px 12px", borderRadius: 12, border: "1.5px solid #107C41", background: "#F0FDF4", color: "#107C41", fontFamily: PJS, fontSize: 11.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <FileSpreadsheet size={15} />
                    <span>Download Rekap Excel (Format Dapodik)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { printReportPDF(students, namaSekolah); showToast("Dokumen Rapor PDF dicetak!"); }}
                    style={{ padding: "10px 12px", borderRadius: 12, border: "1.5px solid #1D4ED8", background: "#EFF6FF", color: "#1D4ED8", fontFamily: PJS, fontSize: 11.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Printer size={15} />
                    <span>Cetak Rapor PDF Semua Siswa Sekaligus</span>
                  </button>
                </div>

                <div style={{ background: "#FEF3C7", borderRadius: 12, padding: "9px 12px", border: "1px solid #FCD34D" }}>
                  <p style={{ fontFamily: IPS, fontSize: 10.5, color: "#92400E", margin: 0 }}>
                    💡 <b>Keuntungan PC:</b> Tampilan tabel lebar, cetak 1-klik seluruh kelas, dan integrasi template resmi sekolah.
                  </p>
                </div>
              </div>

              <div style={{ padding: "10px 14px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowPCPreviewModal(false)}
                  style={{ padding: "8px 16px", borderRadius: 10, background: DEEP, color: "#FFFFFF", fontFamily: PJS, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer" }}
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── 2. DETAIL VIEW (Buat Laporan) ─────────────────────────────────────────
  if (view === "detail") {
    return (
      <div className="flex-1 overflow-y-auto relative" style={{ fontFamily: IPS, background: BG }}>
        {toastMsg && (
          <div style={{ margin: "12px 16px 0", background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle size={16} style={{ color: "#059669", flexShrink: 0 }} />
            <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: "#065F46", margin: 0 }}>{toastMsg}</p>
          </div>
        )}

        {/* Header Buat Laporan (Tanpa tulisan Laporan di atasnya) */}
        <div style={{ background: "#FFFFFF", padding: "16px 20px 14px", borderBottom: "1px solid rgba(91,122,104,0.12)", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 30 }}>
          <button
            onClick={() => setView("main")}
            style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(139,176,152,0.14)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#1B2E24", flexShrink: 0 }}
            className="active:scale-95 transition-transform"
            aria-label="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontFamily: PJS, fontSize: 18, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>Bagikan Laporan</h1>
            <p style={{ fontFamily: IPS, fontSize: 11.5, color: MUTED, margin: "2px 0 0" }}>Pilih cakupan lalu bagikan atau unduh</p>
          </div>
        </div>

        <div style={{ padding: "14px 16px 130px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Pilihan Cakupan Laporan */}
          <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "14px", border: "1px solid rgba(91,122,104,0.12)", boxShadow: "0 2px 8px rgba(91,122,104,0.04)" }}>
            <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 800, color: DEEP, margin: "0 0 10px" }}>Pilih Cakupan Laporan</p>
            <div style={{ display: "flex", background: "#D4DFD9", borderRadius: 12, padding: 3, gap: 3 }}>
              {([{ id: "semua" as FilterScope, label: "Semua", icon: <Users size={13} /> }, { id: "kelas" as FilterScope, label: "Per Kelas", icon: <School size={13} /> }, { id: "anak" as FilterScope, label: "Per Anak", icon: <User size={13} /> }]).map(tab => {
                const active = filterScope === tab.id;
                return (
                  <button key={tab.id} type="button" onClick={() => setFilterScope(tab.id)} style={{ flex: 1, minHeight: 34, borderRadius: 9, border: "none", background: active ? DEEP : "rgba(255,255,255,0.40)", color: active ? "#FFFFFF" : DEEP, fontFamily: PJS, fontWeight: active ? 800 : 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, boxShadow: active ? "0 2px 8px rgba(45,84,62,0.20)" : "none", transition: "all 0.15s ease" }} className="active:scale-[0.98]">
                    {tab.icon}<span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {filterScope === "kelas" && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed rgba(91,122,104,0.18)" }}>
                <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: MUTED, margin: "0 0 8px" }}>Pilih Kelas:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <button type="button" onClick={() => setSelectedClass("Semua")} style={{ padding: "7px 13px", borderRadius: 12, border: selectedClass === "Semua" ? `1.5px solid ${DEEP}` : "1px solid #E2E8F0", background: selectedClass === "Semua" ? DEEP : "#F8FAFC", color: selectedClass === "Semua" ? "#FFFFFF" : TEXT, fontFamily: PJS, fontSize: 12, fontWeight: 700, cursor: "pointer" }} className="active:scale-95 transition-all">Semua ({students.length})</button>
                  {classes.map(k => {
                    const count = students.filter(s => s.kelas === k).length;
                    const active = selectedClass === k;
                    return (
                      <button key={k} type="button" onClick={() => setSelectedClass(k)} style={{ padding: "7px 13px", borderRadius: 12, border: active ? `1.5px solid ${DEEP}` : "1px solid #E2E8F0", background: active ? DEEP : "#F8FAFC", color: active ? "#FFFFFF" : TEXT, fontFamily: PJS, fontSize: 12, fontWeight: 700, cursor: "pointer" }} className="active:scale-95 transition-all">{k} ({count})</button>
                    );
                  })}
                </div>
              </div>
            )}

            {filterScope === "anak" && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed rgba(91,122,104,0.18)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: MUTED, margin: 0 }}>Pilih Siswa:</p>
                    {selectedStudentIds.size > 0 && (<span style={{ fontFamily: PJS, fontSize: 11, fontWeight: 700, color: "#FFFFFF", background: DEEP, padding: "2px 8px", borderRadius: 8 }}>{selectedStudentIds.size} dipilih</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {selectedStudentIds.size > 0 && (<button type="button" onClick={() => setSelectedStudentIds(new Set())} style={{ border: "none", background: "transparent", color: "#EF4444", fontFamily: PJS, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Reset</button>)}
                    <button type="button" onClick={toggleAllSearched} style={{ border: `1.5px solid ${allSearchedSelected ? "#EF4444" : DEEP}`, background: allSearchedSelected ? "#FEF2F2" : "rgba(45,84,62,0.08)", color: allSearchedSelected ? "#DC2626" : DEEP, fontFamily: PJS, fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "4px 10px", borderRadius: 8 }} className="active:scale-95">{allSearchedSelected ? "Batalkan Semua" : "Pilih Semua"}</button>
                  </div>
                </div>
                <div style={{ position: "relative", marginBottom: 8 }}>
                  <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
                  <input type="text" value={searchAnak} onChange={e => setSearchAnak(e.target.value)} placeholder="Cari siswa..." style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "8px 32px 8px 34px", fontSize: 12.5, fontFamily: IPS, color: TEXT, background: "#F8FAFC", outline: "none", boxSizing: "border-box" }} />
                  {searchAnak && (<button type="button" onClick={() => setSearchAnak("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#E2E8F0", border: "none", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={10} strokeWidth={2.5} style={{ color: "#64748B" }} /></button>)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                  {searchedAnakList.map(s => {
                    const checked = selectedStudentIds.has(s.id);
                    return (
                      <div key={s.id} onClick={() => toggleStudent(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 12, border: checked ? `1.5px solid ${DEEP}` : "1px solid #E2E8F0", background: checked ? "rgba(45,84,62,0.07)" : "#FFFFFF", cursor: "pointer", transition: "all 0.15s" }} className="active:scale-[0.99]">
                        <div style={{ width: 20, height: 20, borderRadius: 6, border: checked ? `2px solid ${DEEP}` : "2px solid #CBD5E1", background: checked ? DEEP : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                          {checked && <Check size={12} strokeWidth={3} color="#FFFFFF" />}
                        </div>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{s.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: checked ? 800 : 700, color: checked ? DEEP : TEXT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                          <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: 0 }}>Kelas {s.kelas} · {s.abk}</p>
                        </div>
                        {s.hasObs ? (
                          <span style={{ background: "#ECFDF5", color: "#059669", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8, fontFamily: PJS, flexShrink: 0 }}>Terpetakan</span>
                        ) : (
                          <span style={{ background: "#FFFBEB", color: "#B45309", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8, fontFamily: PJS, flexShrink: 0 }}>Belum</span>
                        )}
                      </div>
                    );
                  })}
                  {searchedAnakList.length === 0 && <p style={{ textAlign: "center", color: MUTED, fontSize: 12, padding: "12px 0", margin: 0 }}>Tidak ada siswa yang cocok.</p>}
                </div>
              </div>
            )}

            <div style={{ marginTop: 12, background: "rgba(139,176,152,0.14)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: PJS, fontSize: 12, fontWeight: 700, color: DEEP }}>{filteredList.length} siswa dalam laporan</span>
              <span style={{ fontFamily: IPS, fontSize: 11, color: MUTED }}>{filteredList.filter(s => s.hasObs).length} terpetakan</span>
            </div>
          </div>

          {/* Pratinjau Siswa */}
          <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "14px", border: "1px solid rgba(91,122,104,0.12)", boxShadow: "0 2px 8px rgba(91,122,104,0.04)" }}>
            <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 800, color: TEXT, margin: "0 0 10px" }}>Preview Siswa ({filteredList.length})</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 160, overflowY: "auto" }}>
              {filteredList.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #EDF2F7" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{s.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: PJS, fontSize: 12.5, fontWeight: 700, color: TEXT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                    <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: 0 }}>Kelas {s.kelas}</p>
                  </div>
                  {s.hasObs ? (
                    <span style={{ background: "#ECFDF5", color: "#059669", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8, fontFamily: PJS, flexShrink: 0 }}>{s.talent || "Terpetakan"}</span>
                  ) : (
                    <span style={{ background: "#FFFBEB", color: "#B45309", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8, fontFamily: PJS, flexShrink: 0, display: "flex", alignItems: "center", gap: 3 }}>
                      <Clock size={9} />Belum
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Shortcut Ekspor via PC */}
          <div
            onClick={() => setView("web-connect")}
            style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            className="active:scale-[0.99] transition-transform"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Laptop size={18} style={{ color: "#166534" }} />
              <div>
                <p style={{ fontFamily: PJS, fontSize: 12, fontWeight: 800, color: "#166534", margin: 0 }}>Ekspor Lengkap via Laptop / PC</p>
                <p style={{ fontFamily: IPS, fontSize: 10.5, color: "#15803D", margin: 0 }}>Buka sareh_asih.id untuk cetak massal</p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "#166534" }} />
          </div>
        </div>

        {/* Action Bar Sticky Bottom */}
        <div style={{ position: "sticky", bottom: 0, background: "#FFFFFF", borderTop: "1px solid rgba(91,122,104,0.12)", padding: "12px 16px 20px", display: "flex", flexDirection: "column", gap: 8, zIndex: 20 }}>
          <button
            type="button"
            onClick={handleShareWA}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 14,
              border: "none",
              background: "#25D366",
              color: "#FFFFFF",
              fontFamily: PJS,
              fontWeight: 800,
              fontSize: 13.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 14px rgba(37,211,102,0.32)",
            }}
            className="active:scale-[0.98] transition-transform"
          >
            <MessageCircle size={17} strokeWidth={2.3} />
            <span>Bagikan WA</span>
            <span style={{ fontSize: 10.5, background: "rgba(255,255,255,0.24)", padding: "2px 7px", borderRadius: 6, fontWeight: 700, marginLeft: 2 }}>PDF</span>
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={handleDownloadExcel} style={{ flex: 1, padding: "11px", borderRadius: 14, border: "1.5px solid rgba(16,124,65,0.30)", background: "#FFFFFF", color: "#107C41", fontFamily: PJS, fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} className="active:scale-[0.97] transition-transform"><FileSpreadsheet size={15} />Excel</button>
            <button type="button" onClick={handleDownloadWord} style={{ flex: 1, padding: "11px", borderRadius: 14, border: "1.5px solid rgba(24,90,189,0.30)", background: "#FFFFFF", color: "#185ABD", fontFamily: PJS, fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} className="active:scale-[0.97] transition-transform"><FileText size={15} />Rapor</button>
            <button type="button" onClick={handleDownloadPDF} style={{ flex: 1, padding: "11px", borderRadius: 14, border: "1.5px solid rgba(100,116,139,0.30)", background: "#FFFFFF", color: "#475569", fontFamily: PJS, fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }} className="active:scale-[0.97] transition-transform"><Printer size={15} />PDF</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 3. MAIN VIEW (Laporan Utama) ─────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto relative" style={{ fontFamily: IPS, background: BG }}>
      {/* Header Laporan Utama (Sesuai header lainnya: Search, Profile, Settings) */}
      <div style={{ background: "#FFFFFF", padding: "14px 20px 10px", borderBottom: "1px solid rgba(91,122,104,0.10)", position: "sticky", top: 0, zIndex: 15 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#1B2E24", margin: 0, lineHeight: 1.2 }}>
              Laporan
            </h1>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: "#5A6E63", margin: "4px 0 0", fontWeight: 500 }}>
              Rekap data siswa & pemetaan bakat
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 2 }}>
            <button
              type="button"
              onClick={openSearch}
              style={{
                width: 38,
                height: 38,
                background: "rgba(139,176,152,0.14)",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="active:scale-95 transition-transform"
              title="Cari"
            >
              <Search size={17} style={{ color: "#1B2E24" }} />
            </button>

            <button
              type="button"
              onClick={onProfile}
              style={{
                width: 38,
                height: 38,
                background: "rgba(139,176,152,0.14)",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="active:scale-95 transition-transform"
              title="Profil"
            >
              <User size={17} style={{ color: "#1B2E24" }} />
            </button>

            <button
              type="button"
              onClick={openSettings}
              style={{
                width: 38,
                height: 38,
                background: "rgba(139,176,152,0.14)",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="active:scale-95 transition-transform"
              title="Pengaturan"
            >
              <Settings size={17} style={{ color: "#1B2E24" }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 110px", display: "flex", flexDirection: "column", gap: 14 }}>
        {toastMsg && (
          <div style={{ background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <CheckCircle size={18} style={{ color: "#059669", flexShrink: 0 }} />
            <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: "#065F46", margin: 0 }}>{toastMsg}</p>
          </div>
        )}

        {/* Banner: Export PDF & Excel lengkap via PC (Simple Style sesuai screenshot) */}
        <div
          onClick={() => setView("web-connect")}
          style={{
            background: "#EAF6EE",
            borderRadius: 16,
            padding: "13px 16px",
            border: "1px solid rgba(45,84,62,0.12)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            transition: "all 0.15s ease",
          }}
          className="active:scale-[0.99] transition-transform"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
            <Laptop size={22} style={{ color: "#164E36", flexShrink: 0 }} strokeWidth={1.8} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 800, color: "#164E36", margin: 0, lineHeight: 1.25 }}>
                Export PDF & Excel lengkap via PC
              </p>
              <p style={{ fontFamily: IPS, fontSize: 11, color: "#5E7E6E", margin: "3px 0 0", lineHeight: 1.2 }}>
                Hubungkan HP ke Web Dashboard Sareh Asih
              </p>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: "#164E36", flexShrink: 0 }} />
        </div>

        {/* Format Rekapan Guru langsung di awal */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px", border: "1px solid rgba(91,122,104,0.12)", boxShadow: "0 2px 8px rgba(91,122,104,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(16,124,65,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#107C41" }}>
              <FileSpreadsheet size={16} />
            </div>
            <div>
              <h2 style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: 0 }}>Rekapan Guru</h2>
              <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>{namaSekolah}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <div style={{ background: "rgba(45,84,62,0.08)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
              <p style={{ fontFamily: PJS, fontSize: 22, fontWeight: 800, color: DEEP, margin: 0, lineHeight: 1 }}>{students.length}</p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, color: DEEP, margin: "4px 0 0", fontWeight: 600 }}>Total Siswa</p>
            </div>
            <div style={{ background: "#ECFDF5", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
              <p style={{ fontFamily: PJS, fontSize: 22, fontWeight: 800, color: "#059669", margin: 0, lineHeight: 1 }}>{totalObs}</p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, color: "#059669", margin: "4px 0 0", fontWeight: 600 }}>Terpetakan</p>
            </div>
            <div style={{ background: "#FFFBEB", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
              <p style={{ fontFamily: PJS, fontSize: 22, fontWeight: 800, color: "#B45309", margin: 0, lineHeight: 1 }}>{totalNotObs}</p>
              <p style={{ fontFamily: IPS, fontSize: 10.5, color: "#B45309", margin: "4px 0 0", fontWeight: 600 }}>Belum Diamati</p>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: IPS, fontSize: 11, color: MUTED, fontWeight: 600 }}>Progress Pemetaan</span>
              <span style={{ fontFamily: PJS, fontSize: 11, color: DEEP, fontWeight: 800 }}>{students.length > 0 ? Math.round((totalObs / students.length) * 100) : 0}%</span>
            </div>
            <div style={{ height: 8, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #3F6851, #5B9A6E)", width: `${students.length > 0 ? (totalObs / students.length) * 100 : 0}%`, transition: "width 0.4s ease" }} />
            </div>
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed rgba(91,122,104,0.18)" }}>
            <p style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: MUTED, margin: "0 0 8px" }}>{classes.length} Kelas Terdaftar</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {byClass.map(c => (
                <div key={c.kelas} style={{ background: "#F1F5F9", borderRadius: 10, padding: "5px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                  <School size={11} style={{ color: DEEP }} />
                  <span style={{ fontFamily: PJS, fontSize: 11.5, fontWeight: 700, color: TEXT }}>{c.kelas}</span>
                  <span style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED }}>· {c.total} siswa</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Laporan (Per Kelas / Per Anak) */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px", border: "1px solid rgba(91,122,104,0.12)", boxShadow: "0 2px 8px rgba(91,122,104,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(91,122,104,0.10)", display: "flex", alignItems: "center", justifyContent: "center", color: DEEP }}>
              <BarChart3 size={16} />
            </div>
            <h2 style={{ fontFamily: PJS, fontSize: 14, fontWeight: 800, color: TEXT, margin: 0 }}>Overview Laporan</h2>
          </div>
          <div style={{ display: "flex", background: "#D4DFD9", borderRadius: 12, padding: 3, gap: 3, marginBottom: 12 }}>
            {([{ id: "kelas" as OverviewTab, label: "Per Kelas", icon: <School size={13} /> }, { id: "anak" as OverviewTab, label: "Per Anak", icon: <User size={13} /> }]).map(tab => {
              const active = overviewTab === tab.id;
              return (
                <button key={tab.id} type="button" onClick={() => setOverviewTab(tab.id)} style={{ flex: 1, minHeight: 34, borderRadius: 9, border: "none", background: active ? DEEP : "rgba(255,255,255,0.40)", color: active ? "#FFFFFF" : DEEP, fontFamily: PJS, fontWeight: active ? 800 : 600, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, boxShadow: active ? "0 2px 8px rgba(45,84,62,0.20)" : "none", transition: "all 0.15s ease" }} className="active:scale-[0.98]">
                  {tab.icon}<span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {overviewTab === "kelas" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {byClass.map(c => {
                const pct = c.total > 0 ? Math.round((c.obs / c.total) * 100) : 0;
                return (
                  <div key={c.kelas} style={{ background: "#F8FAFC", borderRadius: 14, padding: "12px 14px", border: "1px solid #EDF2F7" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <School size={13} style={{ color: DEEP }} />
                        <span style={{ fontFamily: PJS, fontSize: 13, fontWeight: 800, color: TEXT }}>Kelas {c.kelas}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: IPS, fontSize: 11, color: MUTED }}>{c.obs}/{c.total}</span>
                        <span style={{ fontFamily: PJS, fontSize: 10.5, fontWeight: 700, background: pct === 100 ? "#ECFDF5" : pct >= 50 ? "#EFF6FF" : "#FFFBEB", color: pct === 100 ? "#059669" : pct >= 50 ? "#2563EB" : "#B45309", padding: "2px 7px", borderRadius: 8 }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, background: pct === 100 ? "#059669" : pct >= 50 ? "#3B82F6" : "#F59E0B", width: `${pct}%`, transition: "width 0.4s ease" }} />
                    </div>
                    <p style={{ fontFamily: IPS, fontSize: 10.5, color: MUTED, margin: "5px 0 0" }}>{c.obs} terpetakan · {c.total - c.obs} belum diamati</p>
                  </div>
                );
              })}
              {byClass.length === 0 && <p style={{ textAlign: "center", color: MUTED, fontSize: 12, padding: "16px 0", margin: 0 }}>Belum ada data kelas.</p>}
            </div>
          )}

          {overviewTab === "anak" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: 300, overflowY: "auto", paddingRight: 2 }}>
              {students.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8FAFC", borderRadius: 12, padding: "9px 12px", border: "1px solid #EDF2F7" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{s.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: PJS, fontSize: 13, fontWeight: 700, color: TEXT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</p>
                    <p style={{ fontFamily: IPS, fontSize: 11, color: MUTED, margin: 0 }}>Kelas {s.kelas} · {s.abk}</p>
                  </div>
                  {s.hasObs ? (
                    <span style={{ background: "#ECFDF5", color: "#059669", fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 10, fontFamily: PJS, flexShrink: 0 }}>{s.talent || "Terpetakan"}</span>
                  ) : (
                    <span style={{ background: "#FFFBEB", color: "#B45309", fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 10, fontFamily: PJS, flexShrink: 0, display: "flex", alignItems: "center", gap: 3 }}>
                      <Clock size={10} />Belum
                    </span>
                  )}
                </div>
              ))}
              {students.length === 0 && <p style={{ textAlign: "center", color: MUTED, fontSize: 12, padding: "16px 0", margin: 0 }}>Belum ada data siswa.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button "Buat Laporan" di Main View */}
      <div style={{ position: "sticky", bottom: 20, display: "flex", justifyContent: "center", paddingInline: 16, marginTop: -60, zIndex: 10, pointerEvents: "none" }}>
        <button
          onClick={() => setView("detail")}
          style={{ background: "linear-gradient(135deg, #3F6851, #5B9A6E)", color: "#FFFFFF", fontFamily: PJS, fontWeight: 800, fontSize: 14.5, padding: "14px 28px", borderRadius: 28, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(45,84,62,0.40)", pointerEvents: "auto" }}
          className="active:scale-[0.96] transition-transform"
        >
          <Share2 size={18} strokeWidth={2.5} />
          <span>Bagikan Laporan</span>
        </button>
      </div>
    </div>
  );
}
