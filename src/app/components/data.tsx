import { createContext, useContext } from "react";
import type { StatusType } from "./ui-kit";
import fotoSiswa1 from "@/imports/foto-siswa-1.jpg";
import fotoSiswa2 from "@/imports/foto-siswa-2.jpg";
import fotoSiswa3 from "@/imports/foto-siswa-3.jpg";
import fotoSiswa4 from "@/imports/foto-siswa-4.jpg";
import fotoSiswa5 from "@/imports/foto-siswa-5.jpg";
import fotoSiswa6 from "@/imports/foto-siswa-6.jpg";
import fotoSiswa7 from "@/imports/foto-siswa-7.jpg";
import fotoSiswa8 from "@/imports/foto-siswa-8.jpg";
import artTrainingImg from "@/imports/art_training.jpg";
import classActivityImg from "@/imports/class_activity.jpg";
import classDrawingImg from "@/imports/class_drawing.jpg";
import classGroupImg from "@/imports/class_group.jpg";

// ─── Types ───────────────────────────────────────────────────────────
export type Role   = "guru" | "ortu";

export type Screen =
  | "landing" | "role-select" | "google-login" | "parent-code"
  | "dashboard" | "students" | "profile" | "observation" | "kode-akses"
  | "asesmen-pending" | "asesmen-custom" | "pilih-asesmen" | "riwayat-asesmen"
  | "talent-map" | "talent-map-detail"
  | "learning-rec"
  | "competition"
  | "report"
  | "parent-dashboard" | "parent-detail"
  | "parent-calendar" | "parent-training"
  | "riwayat-laporan" | "riwayat-perkembangan" | "detail-aspek" | "kemampuan-diamati"
  | "setup-ruang-belajar"
  | "konsultasi-guru"
  | "konfirmasi-akun"
  | "saran-rumah"
  | "notifikasi";

export interface Student {
  id:number; name:string; abk:string; kelas:string; age:number; emoji:string;
  gender: "L" | "P";
  teacher:string; hasObs:boolean; comps:string[]; caraBelajar:string;
  tingkatDukungan?:string; komunikasi?:string; motorik?:string;
  sensorik?:string; rentang?:string; minat?:string; terapi?:string;
  kodeOrtu?:string;
  tanggalLahir?:string;
  nisn?:string;
  alamat?:string;
  statusOrtu?:string;
  namaOrtu?:string;
  talent?:string;
  talentScore?:number;
  stars?:number;
  foto?:string; // base64 data URL dari upload foto profil
  obsStatus?: "not_started" | "in_progress" | "completed";
  // ─ Field baru (backward-compatible, opsional) ─
  jenjangOpsional?: string;       // "PAUD/usia dini" | "Tanpa jenjang formal" | "SD" dsb
  statusDiagnosis?: string;       // "Belum ada diagnosis / sedang observasi" | nama diagnosis
}

// ─── Seed data ───────────────────────────────────────────────────────
// Kode akses orang tua: format <KELAS>-<NAMA>-<TAHUN> (contoh: VIIA-RAFI-2026)
export const kodeOrtuBaru = (nama: string, kelas: string, tahun: string | number = 2026, seri?: string) => {
  const kepala = (kelas.trim() || "KLS").replace(/\s+/g, "").toUpperCase();
  const anak = (nama.trim().split(" ")[0] || "SISWA").toUpperCase();
  return `${kepala}-${anak}-${tahun}${seri ? `-${seri}` : ""}`;
};
export const KODE_ORTU_REGEX = /^[A-Z0-9]+-[A-Z]+-\d{4}(-[A-Z0-9]+)?$/;

export const seedStudents: Student[] = [
  { id:1, name:"Rafi Pratama",   abk:"Tunadaksa Ganda",   kelas:"VII A",  age:13, emoji:"👦", gender:"L", teacher:"Bu Sari",  hasObs:true,  obsStatus:"completed", comps:["FLS3N PDBK","LKSN Diksus"],  caraBelajar:"Visual & Kinestetik",   kodeOrtu:"VIIA-RAFI-2026",  tanggalLahir:"12 Maret 2013", nisn:"0012345601", alamat:"Jl. Merpati No. 5, Surakarta", statusOrtu:"Kandung", namaOrtu:"Ibu Ratna" },
  { id:2, name:"Nisa Aulia",     abk:"Tunadaksa Ringan",     kelas:"VII A",  age:14, emoji:"👧", gender:"P", teacher:"Bu Sari",  hasObs:true,  obsStatus:"in_progress", comps:["FLS3N PDBK","O2SN Diksus"],  caraBelajar:"Auditori & Kinestetik", kodeOrtu:"VIIA-NISA-2026",  tanggalLahir:"05 Juli 2012",  nisn:"0012345602", alamat:"Jl. Kenari No. 12, Jakarta",  statusOrtu:"Kandung", namaOrtu:"Bapak Haris" },
  { id:3, name:"Arga Saputra",   abk:"Tunadaksa Ringan",     kelas:"VII A",  age:12, emoji:"👦", gender:"L", teacher:"Pak Budi", hasObs:false, obsStatus:"not_started", comps:[],                            caraBelajar:"Visual & Kinestetik",   kodeOrtu:"VIIA-ARGA-2026",  tanggalLahir:"20 Nov 2014",   nisn:"0012345603", alamat:"Jl. Dahlia No. 8, Depok",     statusOrtu:"Yatim",   namaOrtu:"Ibu Sinta" },
  { id:4, name:"Dina Maharani",  abk:"Tunadaksa Ganda",   kelas:"VII B",  age:15, emoji:"👧", gender:"P", teacher:"Bu Sari",  hasObs:false, obsStatus:"not_started", comps:[],                            caraBelajar:"Kinestetik",            kodeOrtu:"VIIB-DINA-2026",  tanggalLahir:"03 Feb 2011",   nisn:"0012345604", alamat:"Jl. Melati No. 3, Bandung",   statusOrtu:"Kandung", namaOrtu:"Ibu Dewi" },
  { id:5, name:"Budi Santoso",   abk:"Tunadaksa Ringan",     kelas:"VII B",  age:13, emoji:"👦", gender:"L", teacher:"Bu Sari",  hasObs:false, obsStatus:"in_progress", comps:["FLS3N PDBK"],                caraBelajar:"Visual",                kodeOrtu:"VIIB-BUDI-2026",  tanggalLahir:"15 Agu 2013",   nisn:"0012345605", alamat:"Jl. Anggrek No. 1, Solo",     statusOrtu:"Piatu",   namaOrtu:"Bapak Joko" },
  { id:6, name:"Maya Dewi",      abk:"Tunadaksa Ganda",   kelas:"VII B",  age:14, emoji:"👧", gender:"P", teacher:"Bu Rina",  hasObs:false, obsStatus:"not_started", comps:[],                            caraBelajar:"Kinestetik",            kodeOrtu:"VIIB-MAYA-2026",  tanggalLahir:"21 Apr 2012",   nisn:"0012345606", alamat:"Jl. Mawar No. 9, Semarang",   statusOrtu:"Wali",    namaOrtu:"Bibi Ani" },
  { id:7, name:"Toni Firmansyah",abk:"Tunadaksa Ringan",     kelas:"VIII A", age:15, emoji:"👦", gender:"L", teacher:"Pak Budi", hasObs:true,  obsStatus:"completed", comps:["LKSN Diksus"],               caraBelajar:"Visual & Kinestetik",   kodeOrtu:"VIIIA-TONI-2026", tanggalLahir:"30 Jan 2011",   nisn:"0012345607", alamat:"Jl. Flamboyan No. 7, Jogja",  statusOrtu:"Kandung", namaOrtu:"Bapak Rudi" },
  { id:8, name:"Sari Indah",     abk:"Tunadaksa Ganda",   kelas:"VIII A", age:13, emoji:"👧", gender:"P", teacher:"Bu Rina",  hasObs:false, obsStatus:"not_started", comps:["O2SN Diksus"],               caraBelajar:"Auditori & Kinestetik", kodeOrtu:"VIIIA-SARI-2026", tanggalLahir:"10 Des 2013",   nisn:"0012345608", alamat:"Jl. Cempaka No. 4, Bandung",  statusOrtu:"Kandung", namaOrtu:"Ibu Lina" },
];

// ─── Contoh foto profil siswa (dummy, disimpan lokal di src/imports) ──
// Foto tiap id dibuat cocok dengan `gender` pada data seed di atas.
// Sumber: Pexels — lisensi bebas (https://www.pexels.com/license/).
export const FOTO_DUMMY: Record<number, string> = {
  1: fotoSiswa1, // Rafi (L)
  2: fotoSiswa2, // Nisa (P)
  3: fotoSiswa3, // Arga (L)
  4: fotoSiswa4, // Dina (P)
  5: fotoSiswa5, // Budi (L)
  6: fotoSiswa6, // Maya (P)
  7: fotoSiswa7, // Toni (L)
  8: fotoSiswa8, // Sari (P)
};
// Pool foto cadangan untuk siswa di luar data seed (mis. data dari Firestore),
// dipilih otomatis sesuai gender agar tetap ada foto profil.
const FOTO_POOL_L: string[] = [fotoSiswa1, fotoSiswa3, fotoSiswa5, fotoSiswa7];
const FOTO_POOL_P: string[] = [fotoSiswa2, fotoSiswa4, fotoSiswa6, fotoSiswa8];

// Urutan pemilihan: foto unggahan guru → foto dummy sesuai id → pool gender
export const fotoSiswa = (s: Pick<Student, "id" | "foto" | "gender">): string | undefined =>
  s.foto ||
  FOTO_DUMMY[s.id] ||
  (s.gender === "P" ? FOTO_POOL_P : FOTO_POOL_L)[Math.abs(s.id || 0) % 4];

// ─── Laporan ke orang tua ────────────────────────────────────────────
/**
 * Laporan bersifat SATU ARAH: hanya guru yang mengirim, orang tua tidak
 * dapat membalas. Guru bebas mengirim berapa kali pun; setiap kiriman
 * tercatat di riwayat beserta status dibaca/belum dibaca.
 */
export interface LaporanKirim {
  id:number;
  studentId:number;
  judul:string;
  isi:string;
  dikirimPada:string;   // contoh "3 Jun 2026"
  dibaca:boolean;
  dibacaPada?:string;
}

export const seedLaporan: LaporanKirim[] = [
  {
    id: 3,
    studentId: 1,
    judul: "Perkembangan Kemandirian & Latihan FLS2N",
    isi: "Alhamdulillah minggu ini Rafi sangat antusias mengikuti persiapan FLS2N cabang menggambar setiap Rabu. Yang paling menggembirakan, Rafi sekarang sudah dapat merapikan sendiri kuas dan cat airnya setelah selesai berkarya tanpa perlu diingatkan.",
    dikirimPada: "18 Jun 2026",
    dibaca: false,
  },
  {
    id: 2,
    studentId: 1,
    judul: "Observasi Fokus Belajar & Partisipasi Kelompok",
    isi: "Dalam kegiatan kelompok minggu ini, Rafi tampak lebih riang dan aktif berbagi ide warna dengan teman sebangkunya. Konsentrasi Rafi saat menyelesaikan tugas visual mencapai 35 menit berturut-turut tanpa terlihat lelah.",
    dikirimPada: "28 Mei 2026",
    dibaca: true,
    dibacaPada: "29 Mei 2026",
  },
  {
    id: 1,
    studentId: 1,
    judul: "Laporan Awal Asesmen Fungsional & Minat",
    isi: "Guru pendamping telah menyelesaikan pemetaan awal minat dan profil fungsional. Minat Rafi sangat kuat di bidang Artistik (seni rupa). Di aspek mobilitas, kami terus mendampingi latihan langkah mandiri saat berpindah antar ruang kelas.",
    dikirimPada: "15 Apr 2026",
    dibaca: true,
    dibacaPada: "16 Apr 2026",
  },
];

// ─── Students store (guru dapat menambah siswa sendiri) ──────────────
interface StudentsStore {
  list: Student[];
  add: (s: Omit<Student, "id">) => Promise<Student> | Student;
  update?: (id: number, updates: Partial<Student>) => void;
}
export const StudentsCtx = createContext<StudentsStore>({
  list: seedStudents,
  add: () => seedStudents[0],
  update: () => {},
});
export const useStudents = () => useContext(StudentsCtx).list;
export const useAddStudent = () => useContext(StudentsCtx).add;
export const useUpdateStudent = () => useContext(StudentsCtx).update || (() => {});

// ─── Pilihan form ────────────────────────────────────────────────────
export const ABK_OPTIONS = [
  "Tunadaksa Ringan",
  "Tunadaksa Ganda",
  "Tunanetra",
  "Tuna Rungu",
  "Autis (ASD)",
  "Tunagrahita Ringan",
  "Tunagrahita Sedang",
  "Lainnya",
];
export const KELAS_OPTIONS = [
  "VII A","VII B","VIII A","VIII B","IX A","IX B","IX C",
];
export const CARA_BELAJAR_OPTIONS = [
  "Visual","Auditori","Kinestetik","Visual & Kinestetik","Auditori & Kinestetik",
];

// ─── Profil Fungsional (Tahap 1) ─────────────────────────────────────────
export type FungsionalKategori = "Kognisi" | "Mobilitas" | "Perawatan Diri" | "Interaksi dengan Orang Lain" | "Aktivitas Sehari-hari" | "Partisipasi";

export const FUNGSIONAL_KATEGORI: FungsionalKategori[] = [
  "Kognisi", "Mobilitas", "Perawatan Diri", "Interaksi dengan Orang Lain", "Aktivitas Sehari-hari", "Partisipasi"
];

export const FUNGSIONAL_META: Record<FungsionalKategori,{icon:string;color:string;bg:string;desc:string}> = {
  "Kognisi": {icon:"🧠", color:"#0284C7", bg:"#F0F9FF", desc:"Memahami instruksi, memori, dan penyelesaian masalah"},
  "Mobilitas": {icon:"🏃", color:"#059669", bg:"#ECFDF5", desc:"Berpindah tempat dan menavigasi lingkungan"},
  "Perawatan Diri": {icon:"🧍", color:"#F59E0B", bg:"#FFFBEB", desc:"Makan, ke toilet, dan menjaga kerapian"},
  "Interaksi dengan Orang Lain": {icon:"🤝", color:"#7C3AED", bg:"#F5F3FF", desc:"Komunikasi dan respons sosial"},
  "Aktivitas Sehari-hari": {icon:"📅", color:"#D97706", bg:"#FEF3C7", desc:"Tanggung jawab rutin dan tugas sekolah"},
  "Partisipasi": {icon:"🙋", color:"#DB2777", bg:"#FDF2F8", desc:"Keterlibatan dalam kegiatan kelas atau kelompok"},
};

export const SKALA_FUNGSIONAL = [
  {v:-1, l:"N/A",               d:"Tidak dapat dijawab / diamati",                   color:"#94A3B8", bg:"#F1F5F9"},
  {v:0,  l:"Tidak/Belum Bisa",  d:"0 Belum bisa sama sekali / belum mampu",          color:"#D27D6B", bg:"#F8EBE8"},
  {v:1,  l:"Banyak Bantuan",    d:"1 Memerlukan banyak bantuan / bantuan penuh",     color:"#F59E0B", bg:"#FFFBEB"},
  {v:2,  l:"Sedikit Bantuan",   d:"2 Memerlukan sedikit bantuan / arahan minimal",   color:"#8BB098", bg:"#EBF3ED"},
  {v:3,  l:"Sudah Mandiri",     d:"3 Sudah mandiri secara konsisten tanpa bantuan",  color:"#2E3E35", bg:"#D4E8DA"},
];

export interface FungsionalItem { id:number; kode?: string; text:string; kategori:FungsionalKategori }

export const PROFIL_FUNGSIONAL: FungsionalItem[] = [
  // D1 Kognisi
  {id:101, kode:"D1.01", kategori:"Kognisi", text:"Memahami instruksi bertahap (2-3 langkah) yang diberikan guru."},
  {id:102, kode:"D1.02", kategori:"Kognisi", text:"Mengingat informasi pelajaran dari pertemuan sebelumnya."},
  {id:103, kode:"D1.03", kategori:"Kognisi", text:"Mempertahankan perhatian pada satu tugas hingga selesai, termasuk saat mulai lelah."},
  {id:104, kode:"D1.04", kategori:"Kognisi", text:"Menemukan cara alternatif (alat bantu tulis, dikte, mengetik) ketika hambatan gerak menyulitkan tugas."},
  {id:105, kode:"D1.05", kategori:"Kognisi", text:"Membaca dan memahami bacaan sesuai jenjang kelas."},
  {id:106, kode:"D1.06", kategori:"Kognisi", text:"Memahami konsep bilangan dan operasi hitung sesuai jenjang kelas."},
  {id:107, kode:"D1.07", kategori:"Kognisi", text:"Menyelesaikan tugas berpikir melalui jawaban lisan ketika menulis sulit dilakukan."},
  {id:108, kode:"D1.08", kategori:"Kognisi", text:"Menyampaikan ide atau jawaban dengan cara yang dapat diakses (lisan, ketikan)."},
  {id:109, kode:"D1.09", kategori:"Kognisi", text:"Mengenali batas kemampuan fisik saat memilih cara mengerjakan tugas."},
  {id:110, kode:"D1.10", kategori:"Kognisi", text:"Merencanakan langkah-langkah untuk menyelesaikan tugas atau proyek sederhana (mis. praktik keterampilan) sebelum mengerjakannya."},
  {id:111, kode:"D1.11", kategori:"Kognisi", text:"Membandingkan dua pilihan dan menyebutkan alasan memilih salah satunya."},
  {id:112, kode:"D1.12", kategori:"Kognisi", text:"Menerapkan konsep pelajaran pada situasi nyata (mis. mengukur bahan, menghitung uang, membaca petunjuk)."},

  // D2 Mobilitas
  {id:201, kode:"D2.01", kategori:"Mobilitas", text:"Berpindah tempat di dalam ruang kelas (berjalan, kruk, walker, atau kursi roda) dengan aman."},
  {id:202, kode:"D2.02", kategori:"Mobilitas", text:"Menavigasi lingkungan sekolah di luar kelas (kantin, toilet, lapangan) dengan atau tanpa alat bantu jalan."},
  {id:203, kode:"D2.03", kategori:"Mobilitas", text:"Mengikuti kegiatan yang melibatkan gerak fisik dalam bentuk yang dimodifikasi (senam adaptif)."},
  {id:204, kode:"D2.04", kategori:"Mobilitas", text:"Menyesuaikan diri ketika ada perubahan tata letak atau rute (mencari jalur landai, jalur alternatif)."},
  {id:205, kode:"D2.05", kategori:"Mobilitas", text:"Berpindah posisi (duduk-berdiri, pindah dari kursi roda ke kursi) secara mandiri."},
  {id:206, kode:"D2.06", kategori:"Mobilitas", text:"Menggunakan tangga atau ramp dengan aman."},
  {id:207, kode:"D2.07", kategori:"Mobilitas", text:"Menggunakan alat mobilitas (kruk, tongkat, kursi roda, ortosis) dengan benar."},
  {id:208, kode:"D2.08", kategori:"Mobilitas", text:"Menjangkau, mengambil, dan membawa benda dengan cara yang aman."},
  {id:209, kode:"D2.09", kategori:"Mobilitas", text:"Meminta bantuan dengan tepat ketika menghadapi rintangan fisik."},
  {id:210, kode:"D2.10", kategori:"Mobilitas", text:"Berpindah antar ruang pelajaran tepat waktu melalui jalur yang aksesibel (ramp, lift, koridor)."},
  {id:211, kode:"D2.11", kategori:"Mobilitas", text:"Mencapai sekolah dan pulang dengan aman (berjalan, kursi roda, atau kendaraan antar-jemput yang aksesibel), dengan atau tanpa pendamping."},
  {id:212, kode:"D2.12", kategori:"Mobilitas", text:"Berpartisipasi dalam kegiatan fisik atau ekstrakurikuler (olahraga, pramuka, senam) dengan alat bantu atau modifikasi bila perlu."},

  // D3 Perawatan Diri
  {id:301, kode:"D3.01", kategori:"Perawatan Diri", text:"Makan dan minum sendiri saat istirahat (dengan alat makan adaptif bila perlu)."},
  {id:302, kode:"D3.02", kategori:"Perawatan Diri", text:"Ke toilet dan membersihkan diri sendiri."},
  {id:303, kode:"D3.03", kategori:"Perawatan Diri", text:"Menjaga kerapian diri dan seragam."},
  {id:304, kode:"D3.04", kategori:"Perawatan Diri", text:"Menjaga dan mengelola barang miliknya sendiri."},
  {id:305, kode:"D3.05", kategori:"Perawatan Diri", text:"Mengenakan dan melepas pakaian serta sepatu (dengan modifikasi bila perlu)."},
  {id:306, kode:"D3.06", kategori:"Perawatan Diri", text:"Mengancingkan pakaian, menarik resleting, atau mengikat tali."},
  {id:307, kode:"D3.07", kategori:"Perawatan Diri", text:"Merawat dan memasang alat bantu pribadi (ortosis, kruk, kursi roda)."},
  {id:308, kode:"D3.08", kategori:"Perawatan Diri", text:"Berpindah ke dan dari toilet dengan aman."},
  {id:309, kode:"D3.09", kategori:"Perawatan Diri", text:"Menjaga kenyamanan dan keselamatan tubuh (mengubah posisi duduk, menyampaikan rasa nyeri atau lelah)."},
  {id:310, kode:"D3.10", kategori:"Perawatan Diri", text:"Menjaga kebersihan diri sesuai perubahan masa remaja (memakai deodoran, merawat rambut dan kuku, mengganti pakaian dalam)."},
  {id:311, kode:"D3.11", kategori:"Perawatan Diri", text:"Mengelola kebutuhan pribadi masa pubertas (mis. kebersihan saat menstruasi atau mimpi basah) dengan bantuan minimal atau meminta bantuan orang yang tepat."},
  {id:312, kode:"D3.12", kategori:"Perawatan Diri", text:"Mengelola uang saku sederhana (membawa, membelanjakan, menyimpan) untuk kebutuhan sekolah atau jajan."},

  // D4 Interaksi dengan Orang Lain
  {id:401, kode:"D4.01", kategori:"Interaksi dengan Orang Lain", text:"Memulai komunikasi dengan teman atau guru."},
  {id:402, kode:"D4.02", kategori:"Interaksi dengan Orang Lain", text:"Merespons ketika disapa atau diajak berkomunikasi."},
  {id:403, kode:"D4.03", kategori:"Interaksi dengan Orang Lain", text:"Menjaga interaksi berlangsung dua arah (bukan hanya menjawab satu kali)."},
  {id:404, kode:"D4.04", kategori:"Interaksi dengan Orang Lain", text:"Menyelesaikan perselisihan dengan teman tanpa bantuan orang dewasa."},
  {id:405, kode:"D4.05", kategori:"Interaksi dengan Orang Lain", text:"Meminta bantuan fisik dengan sopan dan jelas."},
  {id:406, kode:"D4.06", kategori:"Interaksi dengan Orang Lain", text:"Bermain bersama teman dalam permainan yang dimodifikasi."},
  {id:407, kode:"D4.07", kategori:"Interaksi dengan Orang Lain", text:"Menjelaskan kondisinya kepada teman dengan percaya diri."},
  {id:408, kode:"D4.08", kategori:"Interaksi dengan Orang Lain", text:"Menolak ejekan atau perundungan dengan tegas atau melaporkannya."},
  {id:409, kode:"D4.09", kategori:"Interaksi dengan Orang Lain", text:"Bekerja sama dengan teman yang membantunya."},
  {id:410, kode:"D4.10", kategori:"Interaksi dengan Orang Lain", text:"Menjaga hubungan pertemanan sebaya (menepati janji, berbagi cerita, menyelesaikan salah paham)."},
  {id:411, kode:"D4.11", kategori:"Interaksi dengan Orang Lain", text:"Menolak ajakan berisiko atau tidak sesuai dari teman sebaya (mis. bolos, mengambil barang orang lain, ajakan tidak pantas) dan melapor kepada orang dewasa yang dipercaya."},
  {id:412, kode:"D4.12", kategori:"Interaksi dengan Orang Lain", text:"Berkomunikasi dengan guru mata pelajaran dan staf sekolah yang berbeda sesuai kesantunan masing-masing."},

  // D5 Aktivitas Sehari-hari
  {id:501, kode:"D5.01", kategori:"Aktivitas Sehari-hari", text:"Memulai tugas tanpa harus diminta berulang."},
  {id:502, kode:"D5.02", kategori:"Aktivitas Sehari-hari", text:"Menyelesaikan tugas sekolah dalam waktu yang tersedia (dengan penyesuaian waktu bila perlu)."},
  {id:503, kode:"D5.03", kategori:"Aktivitas Sehari-hari", text:"Menyiapkan dan merapikan alat belajar sendiri."},
  {id:504, kode:"D5.04", kategori:"Aktivitas Sehari-hari", text:"Berpindah antar kegiatan mengikuti jadwal tanpa pendampingan."},
  {id:505, kode:"D5.05", kategori:"Aktivitas Sehari-hari", text:"Menulis atau menggambar dengan alat yang sesuai (pegangan pensil adaptif, papan ketik)."},
  {id:506, kode:"D5.06", kategori:"Aktivitas Sehari-hari", text:"Menggunakan gunting, penggaris, dan alat lain yang dimodifikasi."},
  {id:507, kode:"D5.07", kategori:"Aktivitas Sehari-hari", text:"Membawa tas dan buku (tas ransel, tas pada kursi roda, troli)."},
  {id:508, kode:"D5.08", kategori:"Aktivitas Sehari-hari", text:"Melaksanakan piket kelas sesuai kemampuan."},
  {id:509, kode:"D5.09", kategori:"Aktivitas Sehari-hari", text:"Menyelesaikan tugas keterampilan atau prakarya dengan cara yang sesuai."},
  {id:510, kode:"D5.10", kategori:"Aktivitas Sehari-hari", text:"Mengatur perlengkapan sesuai jadwal pelajaran harian (membawa buku dan alat hari itu) dengan bantuan minimal."},
  {id:511, kode:"D5.11", kategori:"Aktivitas Sehari-hari", text:"Mengerjakan tugas rumah atau tugas mandiri dan mengumpulkannya tepat waktu."},
  {id:512, kode:"D5.12", kategori:"Aktivitas Sehari-hari", text:"Mengerjakan tugas keterampilan dasar (mis. boga, kriya, berkebun, membatik) sesuai langkah kerja dan aturan keselamatan."},

  // D6 Partisipasi
  {id:601, kode:"D6.01", kategori:"Partisipasi", text:"Terlibat aktif dalam kegiatan kelompok di kelas."},
  {id:602, kode:"D6.02", kategori:"Partisipasi", text:"Ikut serta dalam kegiatan sekolah di luar jam pelajaran."},
  {id:603, kode:"D6.03", kategori:"Partisipasi", text:"Menggunakan alat bantu (kursi roda, kruk, ortosis, alat tulis adaptif) secara mandiri."},
  {id:604, kode:"D6.04", kategori:"Partisipasi", text:"Menyampaikan kebutuhan atau meminta penyesuaian (posisi meja, ramp, waktu tambahan) ketika menghadapi hambatan."},
  {id:605, kode:"D6.05", kategori:"Partisipasi", text:"Berpartisipasi dalam diskusi kelas dengan menyampaikan pendapat."},
  {id:606, kode:"D6.06", kategori:"Partisipasi", text:"Ikut serta dalam olahraga atau permainan adaptif."},
  {id:607, kode:"D6.07", kategori:"Partisipasi", text:"Tampil di depan umum (bernyanyi, membaca, drama)."},
  {id:608, kode:"D6.08", kategori:"Partisipasi", text:"Mengidentifikasi hambatan aksesibilitas dan menyampaikannya kepada guru."},
  {id:609, kode:"D6.09", kategori:"Partisipasi", text:"Menunjukkan kepercayaan diri untuk mencoba kegiatan baru."},
  {id:610, kode:"D6.10", kategori:"Partisipasi", text:"Ikut serta dalam organisasi atau kegiatan kelompok sekolah (OSIS, pramuka, ekstrakurikuler)."},
  {id:611, kode:"D6.11", kategori:"Partisipasi", text:"Menyampaikan pendapat, kebutuhan, atau keberatan kepada guru dengan cara sopan dan jelas."},
  {id:612, kode:"D6.12", kategori:"Partisipasi", text:"Berpartisipasi dalam kegiatan keterampilan, pentas, atau pameran karya di sekolah dan lingkungan sekitar."},
];

// ─── Panduan Aktivitas Unjuk Kerja (Performance-Based Assessment) ───────
export interface AktivitasUnjukKerja {
  judul: string;
  deskripsi: string;
  perilakuDiamati: string[];
  cocokUntuk?: string[];    // ABK spesifik, kosong = semua
}

export const PANDUAN_UNJUK_KERJA: Record<FungsionalKategori, AktivitasUnjukKerja[]> = {
  "Kognisi": [
    {
      judul: "Menyusun Rencana Proyek Keterampilan",
      deskripsi: "Berikan bahan prakarya sederhana. Minta siswa merencanakan tahapan kerja dan membandingkan dua pilihan bahan/alat secara lisan atau ketikan sebelum mulai mengerjakan.",
      perilakuDiamati: ["Memahami instruksi 2-3 langkah (D1.01)", "Merencanakan langkah tugas (D1.10)", "Membandingkan pilihan (D1.11)", "Menyampaikan ide lisan/ketikan (D1.08)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Kuis Berpikir Adaptif (Jawaban Lisan / Keyboard)",
      deskripsi: "Berikan teks bacaan dan soal hitungan kontekstual. Berikan pilihan menjawab secara lisan atau mengetik bila motorik tangan lelah saat menulis.",
      perilakuDiamati: ["Membaca & memahami (D1.05)", "Konsep hitungan (D1.06)", "Jawaban lisan saat sulit menulis (D1.07)", "Mencari cara alternatif (D1.04)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Simulasi Nyata: Mengukur Bahan & Menghitung Uang",
      deskripsi: "Sediakan simulasi belanja atau takaran resep praktis. Amati bagaimana siswa menerapkan konsep nyata dan mengenali batas kemampuan fisiknya saat lelah.",
      perilakuDiamati: ["Penerapan konsep nyata (D1.12)", "Mengenali batas fisik (D1.09)", "Fokus saat mulai lelah (D1.03)", "Mengingat materi sebelumnya (D1.02)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Mobilitas": [
    {
      judul: "Navigasi Rute Kelas & Luar Kelas (Ramp & Koridor)",
      deskripsi: "Minta siswa berpindah dari dalam kelas menuju kantin, toilet, atau lapangan melewati jalur landai (ramp) dengan kursi roda, kruk, atau walker secara aman.",
      perilakuDiamati: ["Berpindah di kelas (D2.01)", "Navigasi luar kelas (D2.02)", "Menggunakan ramp/jalur landai (D2.06)", "Berpindah tepat waktu (D2.10)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Simulasi Transfer Posisi Mandiri",
      deskripsi: "Amati teknik siswa saat berpindah posisi duduk ke berdiri atau berpindah dari kursi roda ke kursi meja belajar secara mandiri dan aman.",
      perilakuDiamati: ["Berpindah posisi mandiri (D2.05)", "Menggunakan alat mobilitas (D2.07)", "Meminta bantuan tepat saat rintangan (D2.09)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Menjangkau Benda & Olahraga Adaptif (Boccia / Senam Kursi)",
      deskripsi: "Ajak siswa menjangkau benda di rak, membawanya di pangkuan/tas kursi roda, lalu berpartisipasi dalam senam adaptif atau permainan boccia.",
      perilakuDiamati: ["Menjangkau & membawa benda (D2.08)", "Senam/olahraga adaptif (D2.03)", "Ikut kegiatan fisik/ekskul (D2.12)", "Menyesuaikan rute (D2.04)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Perawatan Diri": [
    {
      judul: "Makan & Minum dengan Alat Adaptif",
      deskripsi: "Sediakan bekal istirahat. Amati kemandirian membuka wadah bekal/botol minum dan penggunaan alat makan adaptif (sendok bertali/pegangan besar).",
      perilakuDiamati: ["Makan & minum mandiri (D3.01)", "Menjaga kerapian diri (D3.03)", "Mengelola barang milik sendiri (D3.04)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Kemandirian Berpakaian & Alat Bantu Pribadi",
      deskripsi: "Amati siswa mengenakan/melepas jaket/rompi, mengancingkan, menarik resleting, atau memasang strap velcro ortosis/kruk secara mandiri.",
      perilakuDiamati: ["Memakai/melepas pakaian & sepatu (D3.05)", "Kancing/resleting/tali (D3.06)", "Memasang & merawat ortosis/alat bantu (D3.07)", "Menjaga kenyamanan & posisi duduk (D3.09)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Akses Toilet & Kebersihan Remaja",
      deskripsi: "Amati kemandirian navigasi ke toilet difabel, transfer posisi toilet dengan handrail, kebersihan diri remaja, dan pengelolaan uang saku jajan.",
      perilakuDiamati: ["Ke toilet mandiri (D3.02)", "Transfer toilet aman (D3.08)", "Kebersihan masa remaja (D3.10)", "Mengelola uang saku (D3.12)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Interaksi dengan Orang Lain": [
    {
      judul: "Proyek Kolaboratif & Meminta Bantuan Sopan",
      deskripsi: "Dua sampai tiga siswa bekerja sama menyelesaikan puzzle atau poster. Amati kemampuan siswa meminta bantuan fisik dengan sopan dan interaksi dua arah.",
      perilakuDiamati: ["Memulai komunikasi (D4.01)", "Interaksi dua arah (D4.03)", "Meminta bantuan fisik dengan sopan (D4.05)", "Bekerja sama dengan teman (D4.09)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Diskusi & Menjelaskan Kondisi Diri",
      deskripsi: "Siswa diajak menceritakan hobi atau menjelaskan fungsi alat bantunya kepada teman dalam suasana yang positif dan percaya diri.",
      perilakuDiamati: ["Menjelaskan kondisi dengan percaya diri (D4.07)", "Menolak ejekan/bullying tegas (D4.08)", "Menjaga pertemanan sebaya (D4.10)", "Komunikasi santun dengan guru/staf (D4.12)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Bermain Peran: Asertif Terhadap Ajakan Berisiko",
      deskripsi: "Simulasi situasi pertemanan untuk mengamati keberanian siswa menyelesaikan kesalahpahaman dan menolak ajakan tidak baik dari teman sebaya.",
      perilakuDiamati: ["Menyelesaikan perselisihan mandiri (D4.04)", "Menolak ajakan berisiko (D4.11)", "Bermain dalam permainan modifikasi (D4.06)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Aktivitas Sehari-hari": [
    {
      judul: "Menyiapkan Meja Belajar & Alat Adaptif",
      deskripsi: "Siswa mengeluarkan buku, pensil bergrip adaptif, dan perlengkapan dari tas kursi roda/ransel, lalu menyusun di meja belajar secara mandiri.",
      perilakuDiamati: ["Memulai tugas mandiri (D5.01)", "Menyiapkan alat belajar (D5.03)", "Menulis/menggambar dengan alat adaptif (D5.05)", "Membawa tas & buku (D5.07)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Prakarya Keterampilan Sesuai SOP",
      deskripsi: "Siswa membuat prakarya (menggunakan gunting adaptif, memotong bahan, membatik/kriya) sesuai langkah keselamatan kerja.",
      perilakuDiamati: ["Menggunakan gunting/alat modifikasi (D5.06)", "Menyelesaikan prakarya cara sesuai (D5.09)", "Keterampilan dasar & SOP (D5.12)", "Selesai tepat waktu (D5.02)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Piket Kelas & Pengaturan Jadwal Pelajaran",
      deskripsi: "Siswa menjalankan tugas piket (merapikan meja, menyortir buku) dan mengecek perlengkapan buku sesuai jadwal pelajaran esok hari.",
      perilakuDiamati: ["Piket kelas sesuai kemampuan (D5.08)", "Mengatur perlengkapan jadwal (D5.10)", "Berpindah jadwal mandiri (D5.04)", "Tugas mandiri tepat waktu (D5.11)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Partisipasi": [
    {
      judul: "Diskusi Kelas & Advokasi Aksesibilitas",
      deskripsi: "Siswa berpartisipasi dalam musyawarah kelas dan berani menyampaikan kebutuhan penyesuaian (posisi meja, akses ramp, waktu tambahan).",
      perilakuDiamati: ["Terlibat aktif di kelompok (D6.01)", "Partisipasi diskusi kelas (D6.05)", "Menyampaikan kebutuhan penyesuaian (D6.04)", "Identifikasi hambatan aksesibilitas (D6.08)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Olahraga / Ekstrakurikuler Adaptif",
      deskripsi: "Siswa bergabung dalam kegiatan ekstrakurikuler (pramuka, OSIS, olahraga adaptif seperti boccia/voli duduk) dengan alat bantunya.",
      perilakuDiamati: ["Olahraga adaptif (D6.06)", "Menggunakan alat bantu mandiri (D6.03)", "Ikut organisasi/ekskul (D6.10)", "Kegiatan luar jam sekolah (D6.02)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Pentas Seni & Pameran Karya",
      deskripsi: "Siswa menampilkan hasil karya atau tampil di depan umum (bernyanyi/presentasi) dan menyampaikan pendapat santun kepada guru.",
      perilakuDiamati: ["Tampil di depan umum (D6.07)", "Percaya diri hal baru (D6.09)", "Partisipasi pameran karya (D6.12)", "Menyampaikan pendapat santun ke guru (D6.11)"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],
};



export const PANDUAN_RIASEC: Record<RiasecKategori, AktivitasUnjukKerja[]> = {
  "Realistic": [
    {
      judul: "Merakit Komponen / Balok Besar",
      deskripsi: "Sediakan balok atau komponen rakit dengan pegangan mudah digenggam. Amati apakah siswa antusias membongkar-pasang dan mencoba alat kerja praktis.",
      perilakuDiamati: ["Tertarik membongkar/merakit", "Memilih kegiatan tangan/alat", "Lebih suka praktik langsung"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Berkebun Meja Adaptif / Menanam Benih",
      deskripsi: "Ajak siswa menanam biji di pot kecil di atas meja kerja: mengisi media tanam, menabur benih, dan menyiram dengan semprotan ringan.",
      perilakuDiamati: ["Merawat tanaman/hewan", "Mengolah bahan nyata", "Senang aktivitas praktik lingkungan"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Praktik Tata Boga dengan Alat Adaptif",
      deskripsi: "Membuat roti isi atau jus dengan sendok/alat potong adaptif, menakar bahan, dan menyajikan secara rapi.",
      perilakuDiamati: ["Tertarik praktik boga", "Mau memakai alat kerja", "Mengolah bahan nyata"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Investigative": [
    {
      judul: "Percobaan Sains Sederhana",
      deskripsi: "Mencampur warna larutan, mengamati reaksi benda apung-tenggelam, atau melarutkan bahan. Amati rasa ingin tahu dan ketelitian siswa.",
      perilakuDiamati: ["Bertanya mengapa/bagaimana", "Mencoba-coba sendiri", "Tertarik pada percobaan"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Teka-teki Pola & Permainan Logika",
      deskripsi: "Berikan puzzle magnetik, tebak pola, atau teka-teki logika sederhana. Amati persistensi dan strategi pemecahan masalah.",
      perilakuDiamati: ["Menikmati teka-teki/pola", "Mencari cara lain", "Senang membandingkan konsep"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Eksplorasi Alam & Observasi Lingkungan",
      deskripsi: "Siswa diajak mengamati spesimen daun, batuan, atau tanaman menggunakan lup/kaca pembesar dari posisi duduk yang nyaman.",
      perilakuDiamati: ["Memperhatikan detail benda/tanaman", "Tertarik mencari informasi", "Bertanya di luar materi dasar"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Artistic": [
    {
      judul: "Menggambar / Melukis dengan Alat Adaptif",
      deskripsi: "Sediakan kuas/pensil dengan pegangan tebal atau media digital. Biarkan siswa mengekspresikan karya seni visual secara bebas.",
      perilakuDiamati: ["Memilih kegiatan seni rupa", "Ingin menghias/mendesain", "Bangga menunjukkan karya"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Bermain Musik / Ritme Adaptif",
      deskripsi: "Sediakan instrumen musik yang mudah dimainkan (keyboard sentuh, perkusi ringan, marakas). Amati respon dan kepekaan ritmis siswa.",
      perilakuDiamati: ["Tertarik pada musik/ritme", "Menikmati irama musik", "Senang bernyanyi/memainkan alat musik"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Bercerita & Bermain Peran (Role Play)",
      deskripsi: "Ajak siswa mengekspresikan karakter cerita rakyat atau profesi favorit melalui dialog ekspresif dan gestur dramatis.",
      perilakuDiamati: ["Senang memerankan tokoh", "Senang bercerita", "Lebih suka membuat karya imajinatif"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Social": [
    {
      judul: "Simulasi Menolong & Berbagi dengan Teman",
      deskripsi: "Berikan situasi berbagi alat belajar atau membantu teman yang membutuhkan arahan. Amati spontanitas empati dan komunikasi.",
      perilakuDiamati: ["Membantu tanpa diminta", "Peduli pada orang lain", "Senang membantu guru & teman"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Proyek Kolaboratif Kelompok Kecil",
      deskripsi: "Tiga sampai empat siswa menyelesaikan tugas poster atau majalah dinding mini bersama. Amati kerjasama dan keterlibatan sosial.",
      perilakuDiamati: ["Memilih kerja tim daripada sendiri", "Berbagi bekal/alat", "Senang berinteraksi dalam kelompok"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Simulasi Pelayanan & Keramahan",
      deskripsi: "Siswa menjadi koordinator penerima tamu atau menyambut teman di kelas. Amati keramahan dan antusiasme melayani sesama.",
      perilakuDiamati: ["Menyapa teman baru dengan ramah", "Tertarik merawat/melayani", "Senang kerja bakti bersama"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Enterprising": [
    {
      judul: "Simulasi Bazar Mini / Penjualan Karya",
      deskripsi: "Buat simulasi meja bazar. Siswa memajang hasil karya, menentukan harga, dan menawarkan produk ke teman/guru.",
      perilakuDiamati: ["Senang menawarkan hasil karya", "Mengambil inisiatif berbicara", "Berani tampil percaya diri"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Permainan Koordinator / Pemimpin Regu",
      deskripsi: "Tunjuk siswa memimpin kelompok kecil untuk menentukan giliran dan membagi tugas diskusi secara adil.",
      perilakuDiamati: ["Mengajak teman mengikuti ide", "Berani memulai kegiatan baru", "Senang memimpin tim"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Presentasi Karya & Ide di Depan Kelas",
      deskripsi: "Minta siswa mempresentasikan ide proyeknya kepada teman-teman dengan gaya komunikasi persuasif.",
      perilakuDiamati: ["Berani tampil di depan umum", "Senang mendapat peran representatif", "Menyampaikan ide dengan percaya diri"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],

  "Conventional": [
    {
      judul: "Sortir & Klasifikasi Komponen Terstruktur",
      deskripsi: "Sediakan bahan campuran (kancing, manik, alat tulis). Minta siswa mengelompokkan berdasarkan kategori, warna, atau ukuran ke wadah rapi.",
      perilakuDiamati: ["Merapikan & menyusun benda", "Mengelompokkan menurut aturan", "Teliti pada keteraturan"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Menjalankan Prosedur / SOP Kerja Berurutan",
      deskripsi: "Berikan lembar panduan kerja langkah-demi-langkah (resep/urutan pelipatan). Amati kepatuhan terhadap urutan dan ketelitian hasil.",
      perilakuDiamati: ["Nyaman dengan aturan jelas", "Mengikuti langkah berurutan", "Memeriksa pekerjaan sebelum selesai"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
    {
      judul: "Pencatatan & Inventarisasi Alat Kelas",
      deskripsi: "Siswa diminta memeriksa ketersediaan buku atau spidol kelas, mencatatnya dalam daftar tabel sederhana.",
      perilakuDiamati: ["Teliti dalam pencatatan berulang", "Tertarik mencatat & menghitung", "Menyimpan barang di tempat tetap"],
      cocokUntuk: ["Tunadaksa", "Tunadaksa Ringan"],
    },
  ],
};

export type RiasecKategori = "Realistic" | "Investigative" | "Artistic" | "Social" | "Enterprising" | "Conventional";

export const RIASEC_KATEGORI: RiasecKategori[] = [
  "Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"
];

export const RIASEC_META: Record<RiasecKategori,{icon:string;color:string;bg:string;desc:string;letter:string}> = {
  "Realistic":     {icon:"🛠️", color:"#B45309", bg:"#FEF3C7", desc:"Bekerja dengan tangan, alat, benda konkret, aktivitas fisik", letter:"R"},
  "Investigative": {icon:"🔍", color:"#1D4ED8", bg:"#DBEAFE", desc:"Mengamati, menyelidiki, memecahkan masalah", letter:"I"},
  "Artistic":      {icon:"🎨", color:"#9D174D", bg:"#FCE7F3", desc:"Mengekspresikan diri lewat seni, cerita, gerak, musik", letter:"A"},
  "Social":        {icon:"🤝", color:"#15803D", bg:"#DCFCE7", desc:"Membantu, mengajari, dan peduli pada orang lain", letter:"S"},
  "Enterprising":  {icon:"🗣️", color:"#C2410C", bg:"#FFEDD5", desc:"Memimpin, mengajak, memengaruhi, berani tampil", letter:"E"},
  "Conventional":  {icon:"📋", color:"#4338CA", bg:"#E0E7FF", desc:"Ketelitian, keteraturan, prosedur yang jelas", letter:"C"},
};

export const RIASEC_KODE: Record<RiasecKategori, string> = {
  "Realistic": "RIA", "Investigative": "INV", "Artistic": "ART",
  "Social": "SOC", "Enterprising": "ENT", "Conventional": "CON",
};

export const RIASEC_PENJELASAN: Record<RiasecKategori, { apa: string; contoh: string[] }> = {
  "Realistic": {
    apa: "Anak dengan kecenderungan Realistic menyukai aktivitas yang melibatkan pekerjaan fisik, alat, mesin, dan kegiatan yang membutuhkan ketelitian serta keterampilan praktis.",
    contoh: ["Memperbaiki atau merakit benda", "Berkebun atau bertani", "Eksplorasi alam", "Menggunakan alat dan mesin"],
  },
  "Investigative": {
    apa: "Anak dengan kecenderungan Investigative menyukai aktivitas yang melibatkan pengamatan, analisis, pemecahan masalah, dan rasa ingin tahu terhadap hal baru.",
    contoh: ["Bereksperimen dan mengamati", "Membaca dan mencari informasi", "Memecahkan teka-teki", "Menjelajahi ilmu pengetahuan"],
  },
  "Artistic": {
    apa: "Anak dengan kecenderungan Artistic biasanya menikmati aktivitas yang melibatkan kreativitas, imajinasi, dan ekspresi diri. Mereka cenderung peka terhadap keindahan, suka mencoba hal baru, dan senang mengekspresikan ide melalui seni, musik, atau media kreatif lainnya.",
    contoh: ["Menggambar atau melukis", "Membuat kerajinan tangan", "Bermain musik", "Membuat cerita atau menulis"],
  },
  "Social": {
    apa: "Anak dengan kecenderungan Social menyukai aktivitas yang melibatkan interaksi dengan orang lain, membantu, memberi dukungan, dan bekerja dalam tim.",
    contoh: ["Mengajar atau membimbing", "Bekerja dalam kelompok", "Membantu orang lain", "Menjadi relawan"],
  },
  "Enterprising": {
    apa: "Anak dengan kecenderungan Enterprising menyukai aktivitas yang melibatkan kepemimpinan, komunikasi, kreativitas bisnis, dan pengambilan keputusan.",
    contoh: ["Membuat rencana atau proyek", "Berkomunikasi dan presentasi", "Mencoba hal baru", "Mengelola kegiatan atau bisnis kecil"],
  },
  "Conventional": {
    apa: "Anak dengan kecenderungan Conventional menyukai aktivitas yang terstruktur, teratur, dan melibatkan data, angka, serta pekerjaan yang sistematis.",
    contoh: ["Mencatat dan mengelola data", "Bekerja dengan angka", "Mengikuti aturan dan prosedur", "Organisasi dan administrasi"],
  },
};

export const SKALA_RIASEC = [
  {v:-1, l:"N/A",             d:"Tidak dapat dijawab / diamati",                 color:"#94A3B8", bg:"#F1F5F9"},
  {v:0,  l:"Tidak Pernah",    d:"0 Tidak pernah menunjukkan minat / menolak",    color:"#64748B", bg:"#F1F5F9"},
  {v:1,  l:"Kadang",          d:"1 Kadang-kadang tertarik / mencoba jika diajak", color:"#0EA5E9", bg:"#F0F9FF"},
  {v:2,  l:"Sering / Selalu", d:"2 Sering atau selalu antusias dan berinisiatif", color:"#16A34A", bg:"#DCFCE7"},
];

export interface RiasecItem { id:number; text:string; kategori:RiasecKategori }

export const PROFIL_KECENDERUNGAN: RiasecItem[] = [
  // Realistic (12 butir)
  {id:1001, kategori:"Realistic", text:"Tertarik membongkar, merakit, atau memperbaiki benda (mainan, alat, perangkat sederhana)."},
  {id:1002, kategori:"Realistic", text:"Memilih kegiatan yang menggunakan tangan atau alat (prakarya, kriya, berkebun)."},
  {id:1003, kategori:"Realistic", text:"Menyukai lari, lompat, atau permainan gerak lainnya sesuai kemampuan tubuhnya (dengan atau tanpa alat bantu)."},
  {id:1004, kategori:"Realistic", text:"Menyukai olahraga atau senam, biasa maupun adaptif (mis. goalball, boccia, voli duduk), sesuai kemampuan tubuhnya."},
  {id:1005, kategori:"Realistic", text:"Senang merawat tanaman atau hewan (menyiram, memberi makan, membersihkan tempatnya)."},
  {id:1006, kategori:"Realistic", text:"Senang mengolah bahan nyata dengan tangan (adonan, tanah liat, kain, kayu, tanah)."},
  {id:1007, kategori:"Realistic", text:"Tertarik praktik boga (mengaduk, menakar, membentuk adonan, memasak sederhana)."},
  {id:1008, kategori:"Realistic", text:"Tertarik praktik keterampilan berbahan kain atau benang (menjahit, menyulam, menenun, menganyam)."},
  {id:1009, kategori:"Realistic", text:"Tertarik praktik bengkel atau elektronik sederhana (mengganti ban, memasang kabel, merakit komponen)."},
  {id:1010, kategori:"Realistic", text:"Mau mencoba memakai alat kerja atau alat berdaya sederhana (gunting, palu, spatula, mesin jahit, blender) dengan pengawasan."},
  {id:1011, kategori:"Realistic", text:"Tertarik kegiatan kebersihan dan tata graha (menyapu, mengepel, mencuci, menyetrika, laundry)."},
  {id:1012, kategori:"Realistic", text:"Lebih suka belajar dengan mempraktikkan langsung daripada hanya mendengarkan penjelasan."},

  // Investigative (12 butir)
  {id:2001, kategori:"Investigative", text:"Bertanya \"mengapa\", \"bagaimana\", atau \"apa ini\" (dengan kata, isyarat, tulisan, gambar, atau alat komunikasi) di luar yang ditanyakan guru."},
  {id:2002, kategori:"Investigative", text:"Mencoba-coba sendiri untuk menemukan jawaban atau cara."},
  {id:2003, kategori:"Investigative", text:"Menikmati teka-teki, pola, atau permainan berpikir (puzzle, tebak suara atau raba, sudoku, catur)."},
  {id:2004, kategori:"Investigative", text:"Menikmati kegiatan berhitung, mengukur, atau membandingkan (banyak-sedikit, besar-kecil, berat-ringan)."},
  {id:2005, kategori:"Investigative", text:"Memperhatikan dengan saksama benda, hewan, tanaman, atau kejadian di sekitarnya (dengan melihat, meraba, mendengar, atau membaui)."},
  {id:2006, kategori:"Investigative", text:"Tertarik mengutak-atik benda atau alat untuk mengetahui cara kerjanya."},
  {id:2007, kategori:"Investigative", text:"Tertarik pada percobaan sederhana (mencampur warna, mengapungkan benda, melarutkan gula)."},
  {id:2008, kategori:"Investigative", text:"Mencari cara lain (memakai alat bantu, mengubah posisi, meminta contoh) agar suatu tugas tetap bisa diselesaikan."},
  {id:2009, kategori:"Investigative", text:"Senang mencocokkan, mengelompokkan, atau membandingkan benda, gambar, atau kata untuk menemukan persamaan dan perbedaan."},
  {id:2010, kategori:"Investigative", text:"Tertarik mencari informasi (buku, buku Braille atau audio, video berisyarat, internet, atau bertanya) tentang hal yang diminati."},
  {id:2011, kategori:"Investigative", text:"Tertarik memakai komputer, tablet, atau teknologi bantu untuk memecahkan masalah atau mencari tahu sesuatu."},
  {id:2012, kategori:"Investigative", text:"Tertarik pada strategi permainan atau olahraga (mengapa tim menang, bagaimana mengatur langkah)."},

  // Artistic (12 butir)
  {id:3001, kategori:"Artistic", text:"Memilih kegiatan seni rupa dan kriya (menggambar, mewarnai, membentuk tanah liat, keramik, kolase tekstur)."},
  {id:3002, kategori:"Artistic", text:"Tertarik membatik, ecoprint, atau menyablon (bermain motif, warna, dan pola)."},
  {id:3003, kategori:"Artistic", text:"Menunjukkan ketertarikan pada musik atau ritme (mendengarkan, menabuh, merasakan getaran, mengikuti irama)."},
  {id:3004, kategori:"Artistic", text:"Senang bernyanyi atau memainkan alat musik (angklung, keyboard, gamelan, drum)."},
  {id:3005, kategori:"Artistic", text:"Senang bergerak atau menari mengikuti irama, hitungan, atau getaran (termasuk dengan bagian tubuh yang dapat digerakkan)."},
  {id:3006, kategori:"Artistic", text:"Senang bercerita, menulis, atau mengarang cerita (secara lisan, isyarat, tulisan, atau Braille)."},
  {id:3007, kategori:"Artistic", text:"Senang memerankan tokoh (drama, bermain peran, pantomim, menirukan gaya orang)."},
  {id:3008, kategori:"Artistic", text:"Ingin menghias atau mendesain benda supaya tampak lebih indah atau unik."},
  {id:3009, kategori:"Artistic", text:"Lebih suka membuat sesuatu yang baru daripada menirukan contoh."},
  {id:3010, kategori:"Artistic", text:"Senang berkarya dengan media digital (aplikasi gambar, desain, fotografi, video, membuat musik atau audio)."},
  {id:3011, kategori:"Artistic", text:"Tertarik tata rias, menata rambut, atau berdandan."},
  {id:3012, kategori:"Artistic", text:"Bangga dan senang menunjukkan hasil karyanya kepada orang lain."},

  // Social (12 butir)
  {id:4001, kategori:"Social", text:"Membantu teman yang mengalami kesulitan tanpa diminta."},
  {id:4002, kategori:"Social", text:"Menjelaskan atau mengajari sesuatu kepada temannya (dengan kata, isyarat, tulisan, gambar, atau contoh)."},
  {id:4003, kategori:"Social", text:"Memilih mengerjakan sesuatu bersama teman daripada sendirian."},
  {id:4004, kategori:"Social", text:"Menemani atau menghibur teman yang sedang sedih atau sendirian."},
  {id:4005, kategori:"Social", text:"Peduli pada orang yang lebih muda atau membutuhkan bantuan (adik kelas, teman yang sakit, orang lanjut usia)."},
  {id:4006, kategori:"Social", text:"Bersedia berbagi bekal, alat, atau barang miliknya dengan teman."},
  {id:4007, kategori:"Social", text:"Senang membantu pekerjaan bersama (piket, kerja bakti, gotong royong)."},
  {id:4008, kategori:"Social", text:"Senang menolong guru (membawakan barang, membagikan buku atau alat)."},
  {id:4009, kategori:"Social", text:"Menyapa dan menyambut tamu atau teman baru dengan ramah (dengan kata, isyarat, senyum, atau gestur)."},
  {id:4010, kategori:"Social", text:"Senang bermain atau berolahraga dalam tim (kasti, voli, goalball, boccia, kelompok tari) bersama teman."},
  {id:4011, kategori:"Social", text:"Senang membantu teman memahami informasi atau instruksi (menceritakan, menunjukkan, menerjemahkan isyarat, menuliskan)."},
  {id:4012, kategori:"Social", text:"Tertarik kegiatan melayani atau merawat orang (kantin, kafe, toko, pijat, laundry, membantu perawatan)."},

  // Enterprising (12 butir)
  {id:5001, kategori:"Enterprising", text:"Mengambil peran memimpin ketika bekerja dalam kelompok."},
  {id:5002, kategori:"Enterprising", text:"Mengajak teman mengikuti ide atau rencananya."},
  {id:5003, kategori:"Enterprising", text:"Berani tampil atau menyampaikan sesuatu di depan orang banyak (secara lisan, isyarat, atau dengan alat komunikasi)."},
  {id:5004, kategori:"Enterprising", text:"Berani memulai kegiatan atau mencoba hal baru tanpa menunggu disuruh."},
  {id:5005, kategori:"Enterprising", text:"Senang menawarkan hasil karya atau jasanya kepada orang lain (bazar, kantin sekolah, jualan daring)."},
  {id:5006, kategori:"Enterprising", text:"Mau menjadi ketua kelas, ketua regu, atau perwakilan kelas."},
  {id:5007, kategori:"Enterprising", text:"Senang mengikuti perlombaan dan ingin menjadi yang terbaik."},
  {id:5008, kategori:"Enterprising", text:"Berani menyampaikan kebutuhan atau pilihan dan meminta penyesuaian kepada guru atau orang lain."},
  {id:5009, kategori:"Enterprising", text:"Berani menjadi pembawa acara, pemimpin doa, atau pemberi aba-aba."},
  {id:5010, kategori:"Enterprising", text:"Senang mengatur teman dalam permainan atau kegiatan (membagi tugas, menentukan giliran)."},
  {id:5011, kategori:"Enterprising", text:"Tertarik membuat atau mengelola usaha kecil (koperasi, bazar, jualan daring)."},
  {id:5012, kategori:"Enterprising", text:"Senang mendapat peran khusus atau menjadi pusat perhatian (tampil pertama, memegang tugas penting)."},

  // Conventional (12 butir)
  {id:6001, kategori:"Conventional", text:"Merapikan, menyusun, atau mengurutkan benda atas kemauan sendiri."},
  {id:6002, kategori:"Conventional", text:"Memperbaiki detail dan terganggu bila ada yang tidak rapi atau keliru."},
  {id:6003, kategori:"Conventional", text:"Lebih nyaman pada tugas dengan aturan dan langkah yang jelas."},
  {id:6004, kategori:"Conventional", text:"Menyukai kegiatan rutin dengan urutan yang sama setiap hari."},
  {id:6005, kategori:"Conventional", text:"Mengelompokkan benda menurut jenis, warna, atau ukuran."},
  {id:6006, kategori:"Conventional", text:"Memeriksa kembali pekerjaannya dengan teliti sebelum diserahkan."},
  {id:6007, kategori:"Conventional", text:"Menyimpan barang di tempat yang tetap dan tahu bila ada yang hilang atau bergeser."},
  {id:6008, kategori:"Conventional", text:"Mengikuti jadwal atau urutan kegiatan (tertulis, bergambar, berbunyi, atau raba) dengan tepat."},
  {id:6009, kategori:"Conventional", text:"Mengikuti langkah kerja berurutan (resep, pola jahit, prosedur alat) dengan benar."},
  {id:6010, kategori:"Conventional", text:"Teliti dalam pekerjaan berulang (menyortir, memberi label, menghitung, mengepak, memasukkan data)."},
  {id:6011, kategori:"Conventional", text:"Tertarik mencatat atau menghitung uang, stok barang, atau daftar hadir (dengan alat tulis, Braille, atau aplikasi)."},
  {id:6012, kategori:"Conventional", text:"Merapikan alat dan bahan setelah dipakai dan mengembalikannya ke tempat semula."},
];

export interface AsesmenPeriode {
  periode: string;        // contoh "S1'24"
  tanggal: string;        // contoh "3 Jun 2024"
  skorFungsional: Record<FungsionalKategori, number | null>;  // null = data belum memadai
  skorRiasec: Record<RiasecKategori, number | null>;
}

export const seedRiwayatAsesmen: Record<number, AsesmenPeriode[]> = {
  // key = studentId
  1: [
    { periode:"S1'23", tanggal:"Des 2023", 
      skorFungsional:{Kognisi:58,Mobilitas:70,"Perawatan Diri":62,"Interaksi dengan Orang Lain":40,"Aktivitas Sehari-hari":55,Partisipasi:48},
      skorRiasec:{Realistic:30,Investigative:35,Artistic:70,Social:45,Enterprising:25,Conventional:40} },
    { periode:"S2'23", tanggal:"Jun 2024",
      skorFungsional:{Kognisi:62,Mobilitas:72,"Perawatan Diri":65,"Interaksi dengan Orang Lain":52,"Aktivitas Sehari-hari":58,Partisipasi:55},
      skorRiasec:{Realistic:32,Investigative:38,Artistic:78,Social:50,Enterprising:28,Conventional:42} },
    { periode:"S1'24", tanggal:"Des 2024",
      skorFungsional:{Kognisi:65,Mobilitas:73,"Perawatan Diri":70,"Interaksi dengan Orang Lain":68,"Aktivitas Sehari-hari":60,Partisipasi:58},
      skorRiasec:{Realistic:35,Investigative:42,Artistic:85,Social:65,Enterprising:30,Conventional:45} },
  ],
};

// ─── Perkembangan anak — overview "Tren & Perkembangan" (tab Anak) ────
// 4 warna pastel per level, urutan: Belum, Dibantu, Sebagian, Mandiri
export const WARNA_LEVEL = ["#F2B18F", "#F7DEA9", "#B5DCC4", "#AFCDF2"];
// Warna teks yang tetap terbaca di atas warna pastel tersebut
export const WARNA_LEVEL_TEKS = ["#C9704F", "#A8801F", "#2E7D57", "#4A72CC"];

export const KAPTION_ASPEK: Record<FungsionalKategori, string> = {
  "Kognisi": "Lebih banyak membutuhkan bantuan.",
  "Mobilitas": "Sebagian besar sudah mampu.",
  "Perawatan Diri": "Mayoritas sudah mandiri.",
  "Interaksi dengan Orang Lain": "Kemampuan cukup beragam.",
  "Aktivitas Sehari-hari": "Masih membutuhkan bantuan.",
  "Partisipasi": "Banyak yang sudah mampu.",
};

// Saran yang bisa dilakukan orang tua di rumah — {nama} diganti nama anak
export const SARAN_RUMAH: Record<FungsionalKategori, string[]> = {
  "Kognisi": [
    "Berikan instruksi sederhana 1–2 langkah terlebih dahulu dan beri waktu {nama} untuk mencoba.",
    "Gunakan permainan sederhana seperti menyusun puzzle atau mencocokkan gambar untuk melatih ingatan.",
    "Ulangi kegiatan yang sudah dikuasai secara berkala agar {nama} tetap percaya diri.",
  ],
  "Mobilitas": [
    "Sediakan jalur yang aman dan bebas barang agar {nama} bisa bergerak tanpa halangan.",
    "Dorong {nama} berpindah tempat dengan caranya sendiri, dampingi dari dekat bila diperlukan.",
    "Beri waktu tambahan saat berpindah kegiatan agar {nama} tidak terburu-buru.",
  ],
  "Perawatan Diri": [
    "Biarkan {nama} mencoba mandiri lebih dulu, bantu hanya ketika benar-benar diperlukan.",
    "Sediakan alat makan atau pakaian yang mudah dipegang dan dipakai sendiri.",
    "Jaga rutinitas yang sama setiap hari supaya {nama} mudah mengingat urutannya.",
  ],
  "Interaksi dengan Orang Lain": [
    "Mulai percakapan singkat dengan pertanyaan sederhana dan beri waktu {nama} untuk menjawab.",
    "Ajak {nama} bermain berpasangan dengan teman yang sabar dan suportif.",
    "Puji setiap usaha {nama} dalam menyapa atau menjawab, sekalipun dengan singkat.",
  ],
  "Aktivitas Sehari-hari": [
    "Pecah tugas menjadi langkah kecil dan tunjukkan satu per satu kepada {nama}.",
    "Sediakan tempat alat belajar yang selalu mudah dijangkau {nama}.",
    "Gunakan pengingat visual seperti jadwal bergambar untuk rutinitas harian.",
  ],
  "Partisipasi": [
    "Libatkan {nama} dalam kegiatan kelompok kecil dengan peran yang jelas.",
    "Beri kesempatan {nama} memilih kegiatan yang ingin diikutinya terlebih dahulu.",
    "Diskusikan bersama guru bila ada hambatan akses yang menghalangi {nama} ikut kegiatan.",
  ],
};

// Opsi periode untuk dropdown "Perkembangan {nama}"
export const PERIODE_LIST = [
  { label: "Juli – Desember 2026",  semester: "Semester Ganjil" },
  { label: "Januari – Juni 2026",    semester: "Semester Genap" },
  { label: "Juli – Desember 2025",  semester: "Semester Ganjil" },
  { label: "Januari – Juni 2025",    semester: "Semester Genap" },
  { label: "Juli – Desember 2024",  semester: "Semester Ganjil" },
];

// Jumlah indikator per level [Belum, Dibantu, Sebagian, Mandiri] — total = 12
export interface AspekPerkembangan { sebelum: number[]; sesudah: number[] }

export interface PeriodePerkembangan {
  label: string;
  aspek: Record<FungsionalKategori, AspekPerkembangan>;
  perubahan: { kategori: FungsionalKategori; dari: number; ke: number; teks: string };
}

export const seedPerkembangan: Record<number, PeriodePerkembangan> = {
  1: {
    label: "Juli – Desember 2026",
    aspek: {
      "Kognisi":                { sebelum:[4,4,2,2], sesudah:[2,5,4,1] },
      "Mobilitas":              { sebelum:[1,3,5,3], sesudah:[0,3,5,4] },
      "Perawatan Diri":         { sebelum:[1,2,4,5], sesudah:[0,2,3,7] },
      "Interaksi dengan Orang Lain": { sebelum:[2,5,3,2], sesudah:[2,4,3,3] },
      "Aktivitas Sehari-hari":  { sebelum:[3,5,2,2], sesudah:[2,5,3,2] },
      "Partisipasi":            { sebelum:[1,3,4,4], sesudah:[0,2,5,5] },
    },
    perubahan: {
      kategori: "Interaksi dengan Orang Lain", dari: 1, ke: 2,
      teks: "{nama} mulai dapat berinteraksi dengan bantuan yang lebih sedikit.",
    },
  },
};

// ─── Kelompok belajar ────────────────────────────────────────────────
export const GAYA_META: Record<string,{icon:string;warna:string;strategi:string[];hindari:string[]}> = {
  "Visual":               {icon:"👁️",warna:"#8BB098",strategi:["Gunakan diagram, peta konsep, dan kartu visual","Tunjukkan contoh karya nyata sebelum berlatih","Gunakan warna untuk menandai perbedaan konsep"],hindari:["Instruksi verbal panjang tanpa alat bantu","Teks padat tanpa ilustrasi"]},
  "Auditori":             {icon:"🎵",warna:"#5B7A68",strategi:["Berikan penjelasan lisan yang jelas dan terstruktur","Gunakan nyanyian atau ritme untuk mengingat materi","Dorong diskusi dan tanya jawab aktif"],hindari:["Tugas mandiri membaca teks panjang","Aktivitas yang membutuhkan ketenangan penuh"]},
  "Kinestetik":           {icon:"✋",warna:"#D27D6B",strategi:["Rancang aktivitas gerak dan praktik langsung","Gunakan benda nyata atau model 3D sebagai media","Beri jeda gerak setiap 10–15 menit"],hindari:["Duduk diam terlalu lama","Instruksi tanpa praktik langsung"]},
  "Visual & Kinestetik":  {icon:"🎨",warna:"#A8C4B0",strategi:["Kombinasikan diagram dengan demonstrasi praktis","Gunakan project-based learning berbasis visual","Minta siswa membuat karya nyata dari referensi gambar"],hindari:["Ceramah satu arah tanpa aktivitas","Materi abstrak tanpa contoh visual"]},
  "Auditori & Kinestetik":{icon:"🥁",warna:"#6B8070",strategi:["Instruksi lisan diikuti langsung dengan praktik","Gunakan musik atau ritme sebagai pengiring aktivitas","Role-play dan simulasi sangat efektif"],hindari:["Baca-tulis mandiri tanpa interaksi","Lingkungan belajar yang terlalu sunyi"]},
};

export const TALENT_COLOR: Record<string,{bg:string;text:string}> = {
  "Realistic":     {bg:"#FEF3C7",text:"#B45309"},
  "Investigative": {bg:"#DBEAFE",text:"#1D4ED8"},
  "Artistic":      {bg:"#FCE7F3",text:"#9D174D"},
  "Social":        {bg:"#DCFCE7",text:"#15803D"},
  "Enterprising":  {bg:"#FFEDD5",text:"#C2410C"},
  "Conventional":  {bg:"#E0E7FF",text:"#4338CA"},
};

// ─── Talent detail ───────────────────────────────────────────────────
export const studentTalentDetail: Record<number, { domains: {t:string;sc:number;st:number;r:string}[]; radar: {s:string;A:number}[] }> = {
  1: {
    radar:[{s:"Visual",A:90},{s:"Motorik",A:65},{s:"Sosial",A:55},{s:"Verbal",A:40},{s:"Musik",A:70},{s:"Spasial",A:85}],
    domains:[
      {t:"Artistic",sc:90,st:5,r:"Fokus tinggi pada tugas visual, koordinasi motorik halus sangat baik, dan inisiatif menggambar mandiri konsisten dalam 3 sesi asesmen terakhir."},
      {t:"Investigative",sc:85,st:4,r:"Pemahaman bentuk dan konstruksi di atas rata-rata. Mampu merekonstruksi objek 3D dari panduan 2D tanpa bimbingan verbal."},
      {t:"Realistic",sc:70,st:4,r:"Respons positif terhadap ritme dan pola, meskipun belum menjadi minat dominan."},
      {t:"Social",sc:40,st:2,r:"Terbatas sesuai profil Tunanetra — ini area dukungan, bukan hambatan pengembangan bakat lain."},
    ],
  },
  2: {
    radar:[{s:"Visual",A:55},{s:"Motorik",A:75},{s:"Sosial",A:70},{s:"Verbal",A:30},{s:"Musik",A:88},{s:"Spasial",A:60}],
    domains:[
      {t:"Realistic",sc:88,st:5,r:"Respons ritmis sangat kuat. Mampu menangkap pola musik melalui getaran dan ekspresi wajah instruktur tanpa bergantung pada pendengaran verbal."},
      {t:"Investigative",sc:75,st:4,r:"Koordinasi tubuh sangat baik, mendukung aktivitas seni pertunjukan dan olahraga presisi."},
      {t:"Artistic",sc:55,st:3,r:"Potensi pendukung yang cukup, perlu dikembangkan lebih lanjut dengan metode visual-kinestetik."},
    ],
  },
};

// ─── Lomba ───────────────────────────────────────────────────────────
// ─── Lomba ───────────────────────────────────────────────────────────
export interface LombaItem {
  k: string;
  full: string;
  category: "Realistic" | "Investigative" | "Artistic" | "Social" | "Enterprising" | "Conventional";
  date: string;
  level: string;
  iconBg: string;
  iconType: "palette-mint" | "runner-blue" | "grad-purple" | "palette-peach";
}

export const LOMBA: LombaItem[] = [
  {
    k: "FLS3N PDBK",
    full: "Festival Lomba Seni dan Sastra Siswa Nasional (PDBK)",
    category: "Artistic",
    date: "12–15 Jul 2026",
    level: "Tingkat Nasional",
    iconBg: "#E6F4F1",
    iconType: "palette-mint",
  },
  {
    k: "O2SN Diksus",
    full: "Olimpiade Olahraga Siswa Nasional (Pendidikan Khusus)",
    category: "Realistic",
    date: "20–24 Jul 2026",
    level: "Tingkat Nasional",
    iconBg: "#E1F0FE",
    iconType: "runner-blue",
  },
  {
    k: "LKSN Diksus",
    full: "Lomba Kompetensi Siswa Nasional Jenjang Pendidikan Khusus",
    category: "Investigative",
    date: "5 Agu 2026",
    level: "Tingkat Provinsi",
    iconBg: "#EFEAFF",
    iconType: "grad-purple",
  },
  {
    k: "FLS3N Seni Pertunjukan",
    full: "Festival Seni Pertunjukan PDBK",
    category: "Artistic",
    date: "10–12 Sep 2026",
    level: "Tingkat Kabupaten",
    iconBg: "#FEF0E6",
    iconType: "palette-peach",
  },
];

export const studentCompDetail: Record<string,{id:number;cabang:string;match:number;status:StatusType;alasan:string}[]> = {
  "FLS3N PDBK":[
    {id:1,cabang:"Seni Lukis",       match:98,status:"Didaftarkan",     alasan:"Seni visual Rafi sangat kuat (90/100). Koordinasi motorik halus sesuai kriteria penilaian."},
    {id:2,cabang:"Seni Pertunjukan", match:78,status:"Direkomendasikan",alasan:"Ekspresi musikal Nisa kuat dan cocok untuk cabang seni pertunjukan non-verbal."},
  ],
  "O2SN Diksus":[
    {id:2,cabang:"Boccia",           match:80,status:"Direkomendasikan",alasan:"Motorik Nisa sangat baik (75/100), sangat cocok untuk Boccia."},
    {id:1,cabang:"Boccia",           match:72,status:"Direkomendasikan",alasan:"Konsentrasi dan motorik Rafi mendukung olahraga presisi tanpa komunikasi verbal."},
    {id:8,cabang:"Bulutangkis",      match:76,status:"Direkomendasikan",alasan:"Kelincahan dan refleks Sari aktif dalam aktivitas olahraga berkoordinasi cepat."},
  ],
  "LKSN Diksus":[
    {id:3,cabang:"Matematika Kreatif",match:85,status:"Direkomendasikan",alasan:"Pemahaman logika pola, bentuk, dan konsentrasi analisis Arga sangat baik."},
    {id:7,cabang:"Literasi Digital",  match:81,status:"Direkomendasikan",alasan:"Kemampuan komputasi dan pemecahan masalah Toni sangat menonjol di bidang akademik digital."},
    {id:1,cabang:"Desain Grafis",    match:83,status:"Direkomendasikan", alasan:"Kemampuan spasial dan visual Rafi (85/100) cocok untuk desain grafis digital."},
  ],
  "FLS3N Seni Pertunjukan":[
    {id:4,cabang:"Tari Tradisional Kreasi",match:88,status:"Direkomendasikan",alasan:"Bakat kinestetik dan ekspresi gerak Dina sangat menonjol saat menari."},
  ],
};

// ─── Kalender event & lomba khusus ABK (untuk orang tua) ─────────────
export type EventKind = "lomba"|"terapi"|"pelatihan";

/**
 * Kalender memuat agenda yang bersifat umum/terbuka:
 * - lomba resmi, pelatihan terbuka, dan layanan gratis terbuka untuk umum.
 * Jadwal terapi personal TIDAK dimasukkan ke kalender karena bersifat
 * pribadi, berbayar, dan diatur langsung antara orang tua & penyedia.
 */
export interface AgendaEvent {
  id:number; date:string; // YYYY-MM-DD
  endDate?:string;
  title:string; kind:EventKind; lokasi:string; jam:string; desc:string;
  pendaftaran?:string;
  biaya?:string;
}

export const AGENDA: AgendaEvent[] = [
  { id:1,  date:"2026-08-08", title:"Seleksi Kabupaten FLS3N PDBK", kind:"lomba",     lokasi:"SLB Negeri 1 Bandung",       jam:"08.00 – 12.00", desc:"Seleksi tingkat kabupaten cabang Seni Lukis dan Seni Pertunjukan untuk PDBK (Peserta Didik Berkebutuhan Khusus).", pendaftaran:"Melalui sekolah, paling lambat 5 Agustus", biaya:"Gratis" },
  { id:2,  date:"2026-08-12", title:"Lomba Seni Lukis PDBK",          kind:"lomba",   lokasi:"Balai Budaya Bandung",        jam:"08.00 – 14.00", desc:"Lomba seni lukis terbuka untuk Peserta Didik Berkebutuhan Khusus (PDBK) tingkat kota.", pendaftaran:"Melalui sekolah, paling lambat 8 Agustus", biaya:"Gratis" },
  { id:3,  date:"2026-08-15", title:"Pelatihan Parenting PDBK",     kind:"pelatihan", lokasi:"Aula SLB Harapan Bangsa",    jam:"09.00 – 12.00", desc:"Workshop terbuka untuk semua orang tua: strategi mendampingi anak belajar di rumah sesuai gaya belajarnya.", pendaftaran:"Daftar via tautan panitia", biaya:"Gratis · terbuka umum" },
  { id:5,  date:"2026-08-22", title:"O2SN Diksus — Cabang Boccia",  kind:"lomba",     lokasi:"GOR Pajajaran, Bandung",     jam:"07.30 – 15.00", desc:"Kompetisi Boccia tingkat provinsi untuk kategori tunadaksa dan tunagrahita.", pendaftaran:"Kuota 2 PDBK per sekolah", biaya:"Gratis" },
  { id:7,  date:"2026-08-19", title:"Skrining Tumbuh Kembang Gratis", kind:"terapi",  lokasi:"Puskesmas Cibeunying",       jam:"08.00 – 12.00", desc:"Skrining perkembangan anak dan konsultasi awal dengan terapis, terbuka untuk umum tanpa biaya.", pendaftaran:"Datang langsung, bawa KIA/BPJS", biaya:"Gratis · terbuka umum" },
  { id:6,  date:"2026-08-26", title:"Klinik Terapi Wicara Gratis",  kind:"terapi",    lokasi:"Balai RW 07 Cibeunying",     jam:"09.00 – 14.00", desc:"Layanan terapi wicara gratis hasil kerja sama Dinas Kesehatan. Terbuka untuk umum, kuota 40 anak.", pendaftaran:"Pendaftaran online dibuka 20 Agustus", biaya:"Gratis · kuota terbatas" },
  { id:8,  date:"2026-09-03", title:"LKSN Diksus — Desain Grafis",  kind:"lomba",     lokasi:"SMKN 4 Bandung",             jam:"08.00 – 16.00", desc:"Lomba Kompetensi Siswa Nasional bidang desain grafis untuk PDBK (Peserta Didik Berkebutuhan Khusus).", pendaftaran:"Pendaftaran dibuka 10 Agustus", biaya:"Gratis" },
  { id:9,  date:"2026-09-09", title:"Kelas Seni Inklusi Terbuka",   kind:"pelatihan", lokasi:"Rumah Kreatif Bandung",      jam:"14.00 – 16.00", desc:"Kelas melukis dan kriya terbuka untuk PDBK, didampingi instruktur seni dan shadow teacher.", pendaftaran:"Daftar via WhatsApp panitia", biaya:"Gratis (subsidi Dinas Pendidikan)" },
];

export const KIND_META: Record<EventKind,{label:string;color:string;bg:string;icon:string}> = {
  lomba:     {label:"Lomba",            color:"#B45309", bg:"#FEF3C7", icon:"🏆"},
  terapi:    {label:"Terapi Gratis",    color:"#0369A1", bg:"#E0F2FE", icon:"💙"},
  pelatihan: {label:"Pelatihan Umum",   color:"#6D28D9", bg:"#EDE9FE", icon:"🎓"},
};

// ─── Layanan terapi & pelatihan terdekat ─────────────────────────────
/**
 * Direktori layanan. Dibagi dua secara tegas:
 * - `terbuka: true`  → program umum/gratis dengan jadwal pasti. Boleh muncul
 *                      di kalender karena berlaku sama untuk semua orang.
 * - `terbuka: false` → layanan personal & berbayar. Jadwalnya per anak dan
 *                      diatur langsung dengan penyedia, jadi aplikasi hanya
 *                      menampilkan info umum (alamat, jam buka, kontak) —
 *                      tidak pernah masuk kalender.
 */
export interface Layanan {
  id:number; nama:string; jenis:"Terapi"|"Pelatihan"|"Komunitas";
  kategori:string; jarak:string; jarakKm?:number; alamat:string; jadwal:string;
  biaya:string; kontak:string; rating:number; emoji:string; catatan:string;
  terbuka:boolean;
  terverifikasi?:boolean;
  sumberData?:string;
  penyelenggara?:string;
  gambar?:string;
  website?:string;
  /** koordinat lokasi layanan */
  lat?:number;
  lng?:number;
  /** untuk program terbuka: tanggal penyelenggaraan berikutnya */
  agendaBerikutnya?:string;
}

export const LAYANAN: Layanan[] = [
  {
    id: 1,
    nama: "Klinik Terapi Wicara Pelita",
    jenis: "Terapi",
    kategori: "Terapi Wicara & Sensori",
    jarak: "3,1 km",
    jarakKm: 3.1,
    alamat: "Jl. Melati No. 12, Bandung",
    lat: -6.9025, lng: 107.6190,
    jadwal: "08.00 - 16.00",
    biaya: "Rp 100.000 - 150.000/sesi",
    kontak: "0812-3456-7890",
    rating: 4.8,
    emoji: "🗣️",
    gambar: classActivityImg,
    penyelenggara: "Klinik Pratama Pelita",
    terbuka: false,
    terverifikasi: true,
    sumberData: "Dinas Kesehatan Kota Bandung (Faskes Rujukan Terdaftar)",
    website: "dinkes.bandung.go.id/faskes-pelita",
    catatan: "Spesialisasi terapi wicara anak, artikulasi kata, dan penguatan motorik oral bagi anak berkebutuhan khusus.",
  },
  {
    id: 2,
    nama: "Kelas Seni Inklusi",
    jenis: "Pelatihan",
    kategori: "Seni Lukis & Kriya Kreatif",
    jarak: "3,2 km",
    jarakKm: 3.2,
    alamat: "Jl. Anggrek No. 8, Bandung",
    lat: -6.9145, lng: 107.6098,
    jadwal: "10.00 - 15.00",
    biaya: "Rp 50.000 - 75.000/sesi",
    kontak: "0821-9988-7766",
    rating: 4.9,
    emoji: "🎨",
    gambar: artTrainingImg,
    penyelenggara: "Rumah Kreatif Bandung",
    terbuka: true,
    terverifikasi: true,
    sumberData: "Binaan Dinas Kebudayaan & Yayasan Seni Ramah Anak",
    website: "seni-inklusi.bandung.go.id",
    agendaBerikutnya: "9 September 2026",
    catatan: "Kelas melukis dan kriya adaptif bagi anak dengan bakat seni rupa, didampingi shadow teacher berpengalaman.",
  },
  {
    id: 3,
    nama: "Pusat Terapi Tumbuh Harapan",
    jenis: "Terapi",
    kategori: "Terapi Okupasi & Fisioterapi",
    jarak: "1,5 km",
    jarakKm: 1.5,
    alamat: "Jl. Cikutra No. 45, Bandung",
    lat: -6.8990, lng: 107.6350,
    jadwal: "09.00 - 17.00",
    biaya: "Rp 120.000 - 160.000/sesi",
    kontak: "0813-8899-0011",
    rating: 4.9,
    emoji: "🩺",
    gambar: classDrawingImg,
    penyelenggara: "Yayasan Tumbuh Harapan",
    terbuka: false,
    terverifikasi: true,
    sumberData: "Kementerian Kesehatan RI & RSHS (Klinik Pratama Terakreditasi)",
    website: "tumbuhharapan-terapi.id",
    catatan: "Menyediakan layanan sensori integrasi, fisioterapi gerak mandiri, dan terapi okupasi terpadu.",
  },
  {
    id: 4,
    nama: "Klinik Terapi Wicara Gratis Dinkes",
    jenis: "Terapi",
    kategori: "Terapi Wicara · Program Pemerintah",
    jarak: "1,8 km",
    jarakKm: 1.8,
    alamat: "Balai RW 07 Cibeunying, Bandung",
    lat: -6.8950, lng: 107.6280,
    jadwal: "09.00 - 14.00",
    biaya: "Gratis (Subsidi APBD)",
    kontak: "0800-1000-100",
    rating: 4.7,
    emoji: "🏥",
    gambar: classActivityImg,
    penyelenggara: "Dinas Kesehatan Kota Bandung",
    terbuka: true,
    terverifikasi: true,
    sumberData: "Program Kolaborasi Dinas Kesehatan Kota Bandung",
    website: "dinkes.bandung.go.id",
    agendaBerikutnya: "26 Agustus 2026",
    catatan: "Terbuka untuk umum tanpa biaya, hasil kerja sama Dinas Kesehatan untuk skrining dan latihan wicara.",
  },
  {
    id: 5,
    nama: "Komunitas Sahabat Inklusi",
    jenis: "Komunitas",
    kategori: "Support Group & Konseling Ortu",
    jarak: "2,0 km",
    jarakKm: 2.0,
    alamat: "Jl. R.E. Martadinata No. 50, Bandung",
    lat: -6.9100, lng: 107.6150,
    jadwal: "09.00 - 12.00",
    biaya: "Gratis",
    kontak: "0895-1010-2020",
    rating: 4.9,
    emoji: "🤝",
    gambar: classGroupImg,
    penyelenggara: "Forum Sahabat Anak Inklusif",
    terbuka: true,
    terverifikasi: true,
    sumberData: "Forum Sahabat Anak Inklusif Jawa Barat",
    website: "sahabatanakinklusif.org",
    agendaBerikutnya: "13 September 2026",
    catatan: "Wadah pendampingan psikologis, konsultasi pengasuhan di rumah, dan informasi bantuan subsidi pendidikan.",
  },
];

// ─── AI Knowledge & Custom Instructions (Guru Assistant Persona) ─────
export interface DokumenRujukan {
  id: string;
  judul: string;
  tipe: string;
  ringkasan: string;
  aktif: boolean;
}

export interface AiKnowledgeConfig {
  tone: "suportif" | "objektif" | "kolaboratif";
  prioritasFokus: string[];
  batasanEtis: string[];
  modeAsesmen: "standar" | "guru" | "sensori";
  instruksiKhusus: string;
  panggilanSiswa: "nama_panggilan" | "nama_lengkap";
  rekomendasiRumahAktif: boolean;
  model: string;
  dokumenRujukan: DokumenRujukan[];
}

export const DEFAULT_AI_KNOWLEDGE: AiKnowledgeConfig = {
  tone: "suportif",
  prioritasFokus: [
    "Kemandirian Aktivitas Harian (ADL)",
    "Komunikasi Fungsional & Bahasa Isyarat/PECS",
    "Bakat Minat Vokasional & Kreativitas",
  ],
  batasanEtis: [
    "Dilarang mendiagnosis gangguan medis/psikiatri baru",
    "Dilarang membandingkan anak dengan siswa lain di laporan",
    "Gunakan bahasa hangat tanpa jargon medis yang menakutkan",
    "Sertakan apresiasi kemajuan sekecil apa pun",
  ],
  modeAsesmen: "guru",
  instruksiKhusus:
    "Fokus pada apresiasi kemajuan riil yang dicapai anak. Jika aspek motorik masih memerlukan bantuan penuh, sarankan adaptasi alat sederhana di rumah (seperti sendok berpegangan tebal atau pensil berbusa). Jangan pernah menggunakan kata 'gagal', gantikan dengan frasa 'sedang berproses menuju mandiri'.",
  panggilanSiswa: "nama_panggilan",
  rekomendasiRumahAktif: true,
  model: "Gemini 1.5 Pro (Edu-Inklusif v2.4)",
  dokumenRujukan: [
    {
      id: "doc-1",
      judul: "Panduan PPI & Kurikulum Merdeka SLB 2026",
      tipe: "Pedoman Resmi",
      ringkasan: "Penyesuaian capaian pembelajaran berbasis profil fungsional individu dan asesmen diagnostik awal.",
      aktif: true,
    },
    {
      id: "doc-2",
      judul: "Protokol Stimulasi Regulasi Sensori Ruang Kelas",
      tipe: "SOP Sekolah",
      ringkasan: "Langkah penanganan overstimulasi sensori: sediakan calming corner, tekstur menenangkan, & noise-cancelling.",
      aktif: true,
    },
    {
      id: "doc-3",
      judul: "Rubrik Kesiapan Vokasi & Ajang Talenta PDBK",
      tipe: "Pedoman Lomba",
      ringkasan: "Kriteria kesesuaian minat RIASEC dengan cabang lomba FLS3N, O2SN, dan LKSN Diksus.",
      aktif: true,
    },
  ],
};

export function loadAiKnowledge(): AiKnowledgeConfig {
  try {
    const saved = localStorage.getItem("sareh_asih_ai_knowledge");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_AI_KNOWLEDGE;
}

export function saveAiKnowledge(config: AiKnowledgeConfig): void {
  try {
    localStorage.setItem("sareh_asih_ai_knowledge", JSON.stringify(config));
  } catch (e) {}
}

// ─── Memori Catatan Siswa yang Diserap AI (Di Balik Layar) ───────────
export interface MemoriCatatanSiswa {
  catatan: string;
  waktu: string;
  poinKunci: string[];
}

export function simpanMemoriSiswaAI(studentId: number, catatanBaru: string): void {
  if (!catatanBaru || !catatanBaru.trim()) return;
  try {
    const key = `sareh_asih_ai_memory_${studentId}`;
    const list: MemoriCatatanSiswa[] = JSON.parse(localStorage.getItem(key) || "[]");
    
    // Ekstraksi poin penting secara otomatis (simulasi AI di balik layar)
    const kalimat = catatanBaru.split(/[.,\n]/).map(k => k.trim()).filter(k => k.length > 5);
    const poinKunci = kalimat.slice(0, 3);

    const entriBaru: MemoriCatatanSiswa = {
      catatan: catatanBaru.trim(),
      waktu: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      poinKunci: poinKunci.length > 0 ? poinKunci : [catatanBaru.trim().slice(0, 50)],
    };

    list.unshift(entriBaru);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 15)));
  } catch (e) {}
}

export function muatMemoriSiswaAI(studentId: number): MemoriCatatanSiswa[] {
  try {
    const key = `sareh_asih_ai_memory_${studentId}`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (e) {
    return [];
  }
}


