// ─── Peran Guru (teacher role) ────────────────────────────────────────
// Satu sumber label terpusat agar seluruh aplikasi konsisten.
export type TeacherRole = "guru_slb" | "gpk" | "homeschool";

export const TEACHER_ROLE_OPTIONS: { value: TeacherRole; label: string; desc: string; icon: string }[] = [
  { value: "guru_slb",   label: "Guru SLB",                          desc: "Mengajar di Sekolah Luar Biasa",                    icon: "🏫" },
  { value: "gpk",        label: "Guru Pendamping Khusus (GPK)",      desc: "Mendampingi ABK di sekolah reguler / inklusif",     icon: "🤝" },
  { value: "homeschool", label: "Homeschooling / Pendidik Mandiri",  desc: "Mengajar anak secara mandiri di rumah",             icon: "🏠" },
];

// ─── Label mapping per peran ──────────────────────────────────────────
type LabelKey =
  | "tabSiswa"       // label di bottom nav
  | "kelasSaya"      // header Students screen
  | "siswa"          // generic "siswa" noun
  | "tambahSiswa"    // floating button label
  | "agendaDesc"     // sub-desc di kartu Agenda (Dashboard)
  | "ruangBelajar"   // nama container (kelas/ruang belajar)
  ;

const LABELS: Record<TeacherRole, Record<LabelKey, string>> = {
  guru_slb: {
    tabSiswa:     "Siswa",
    kelasSaya:    "Kelas Saya",
    siswa:        "Siswa",
    tambahSiswa:  "Tambah Siswa",
    agendaDesc:   "Jadwal O2SN, FLS3N & LKSN Diksus.",
    ruangBelajar: "Kelas",
  },
  gpk: {
    tabSiswa:     "Anak",
    kelasSaya:    "Anak Dampingan",
    siswa:        "Anak",
    tambahSiswa:  "Tambah Anak",
    agendaDesc:   "Jadwal belajar, sesi terapi & evaluasi berkala.",
    ruangBelajar: "Sekolah",
  },
  homeschool: {
    tabSiswa:     "Anak",
    kelasSaya:    "Ruang Belajar",
    siswa:        "Anak",
    tambahSiswa:  "Tambah Anak",
    agendaDesc:   "Jadwal belajar, sesi terapi & evaluasi berkala.",
    ruangBelajar: "Ruang Belajar",
  },
};

/** Ambil label berdasarkan peran guru. Default ke guru_slb. */
export function getLabel(role: TeacherRole | undefined | null, key: LabelKey): string {
  return LABELS[role || "guru_slb"][key];
}

// ─── Deskripsi kekhususan yang ramah ──────────────────────────────────
export const KEKHUSUSAN_DESCRIPTIVE: Record<string, string> = {
  "A":       "Hambatan penglihatan (Tunanetra / A)",
  "B":       "Hambatan pendengaran (Tuna Rungu / B)",
  "C":       "Hambatan intelektual ringan (Tunagrahita Ringan / C)",
  "C1":      "Hambatan intelektual sedang (Tunagrahita Sedang / C1)",
  "D":       "Tunadaksa Ringan — tanpa hambatan intelektual (D)",
  "D1":      "Tunadaksa — dengan hambatan intelektual/ganda (D1)",
  "Q":       "Spektrum autisme (Autis / Q)",
  "Lainnya": "Lainnya (tulis sendiri)",
};
