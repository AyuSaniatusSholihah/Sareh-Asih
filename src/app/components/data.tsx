import { createContext, useContext } from "react";
import type { StatusType } from "./ui-kit";

// ─── Types ───────────────────────────────────────────────────────────
export type Role   = "guru" | "ortu";

export type Screen =
  | "landing" | "role-select" | "google-login" | "parent-code"
  | "dashboard" | "students" | "profile" | "observation" | "kode-akses"
  | "asesmen-pending"
  | "talent-map" | "talent-map-detail"
  | "learning-rec"
  | "competition"
  | "report"
  | "parent-dashboard" | "parent-detail"
  | "parent-calendar" | "parent-training"
  | "riwayat-laporan";

export interface Student {
  id:number; name:string; abk:string; kelas:string; age:number; emoji:string;
  gender: "L" | "P";
  teacher:string; hasObs:boolean; comps:string[]; caraBelajar:string;
  tingkatDukungan?:string; komunikasi?:string; motorik?:string;
  sensorik?:string; rentang?:string; minat?:string; terapi?:string;
  kodeOrtu?:string;
  nisn?: string;
}

// ─── Seed data ───────────────────────────────────────────────────────
export const seedStudents: Student[] = [
  { id:1, name:"Rafi Pratama",   abk:"Tunanetra",   kelas:"VII A",  age:13, emoji:"👦", gender:"L", teacher:"Bu Sari",  hasObs:true,  comps:["FLS2N-PDBK","LKS"],         caraBelajar:"Visual",                kodeOrtu:"ABK-2025-RAFI", nisn:"0098421873" },
  { id:2, name:"Nisa Aulia",     abk:"Tunarungu",   kelas:"VIII B", age:14, emoji:"👧", gender:"P", teacher:"Bu Sari",  hasObs:true,  comps:["FLS2N-PDBK","O2SN Diksus"], caraBelajar:"Auditori & Kinestetik", kodeOrtu:"ABK-2025-NISA", nisn:"0097654321" },
  { id:3, name:"Arga Saputra",   abk:"Tunadaksa",   kelas:"VII A",  age:12, emoji:"👦", gender:"L", teacher:"Pak Budi", hasObs:false, comps:[],                           caraBelajar:"Visual & Kinestetik",   kodeOrtu:"ABK-2025-ARGA", nisn:"0091122334" },
  { id:4, name:"Dina Maharani",  abk:"Tunanetra",   kelas:"IX C",   age:15, emoji:"👧", gender:"P", teacher:"Bu Sari",  hasObs:false, comps:[],                           caraBelajar:"Kinestetik",            kodeOrtu:"ABK-2025-DINA", nisn:"0089988776" },
  { id:5, name:"Budi Santoso",   abk:"Tunadaksa",   kelas:"VII A",  age:13, emoji:"👦", gender:"L", teacher:"Bu Sari",  hasObs:false, comps:["FLS2N-PDBK"],               caraBelajar:"Visual",                kodeOrtu:"ABK-2025-BUDI", nisn:"0093344556" },
  { id:6, name:"Maya Dewi",      abk:"Tunarungu",   kelas:"VIII B", age:14, emoji:"👧", gender:"P", teacher:"Bu Rina",  hasObs:false, comps:[],                           caraBelajar:"Kinestetik",            kodeOrtu:"ABK-2025-MAYA", nisn:"0095566778" },
  { id:7, name:"Toni Firmansyah",abk:"Tunadaksa",   kelas:"IX A",   age:15, emoji:"👦", gender:"L", teacher:"Pak Budi", hasObs:true,  comps:["LKS"],                      caraBelajar:"Visual & Kinestetik",   kodeOrtu:"ABK-2025-TONI", nisn:"0087788990" },
  { id:8, name:"Sari Indah",     abk:"Tunarungu",   kelas:"VIII A", age:13, emoji:"👧", gender:"P", teacher:"Bu Rina",  hasObs:false, comps:["O2SN Diksus"],              caraBelajar:"Auditori & Kinestetik", kodeOrtu:"ABK-2025-SARI", nisn:"0092233445" },
];

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
  { id:1, studentId:1, judul:"Catatan Latihan Gambar", isi:"Rafi mulai ikut latihan persiapan FLS2N cabang menggambar setiap Rabu. Mohon dukungan agar tetap semangat!", dikirimPada:"18 Jun 2026", dibaca:false },
];

// ─── Students store (guru dapat menambah siswa sendiri) ──────────────
interface StudentsStore { list:Student[]; add:(s:Omit<Student,"id">)=>Student; }
export const StudentsCtx = createContext<StudentsStore>({ list:seedStudents, add:()=>seedStudents[0] });
export const useStudents = () => useContext(StudentsCtx).list;
export const useAddStudent = () => useContext(StudentsCtx).add;

// ─── Pilihan form ────────────────────────────────────────────────────
export const ABK_OPTIONS = [
  "Tunanetra",
  "Tunarungu",
  "Tunagrahita",
  "Tunadaksa",
  "Tunalaras",
  "Tunaganda",
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

export const FUNGSIONAL_META: Record<FungsionalKategori,{icon:string;color:string;bg:string;desc:string;kode:string}> = {
  "Kognisi": {icon:"🧠", color:"#0284C7", bg:"#F0F9FF", desc:"Memahami instruksi, memori, dan penyelesaian masalah", kode:"D1"},
  "Mobilitas": {icon:"🏃", color:"#059669", bg:"#ECFDF5", desc:"Berpindah tempat dan menavigasi lingkungan", kode:"D2"},
  "Perawatan Diri": {icon:"🧍", color:"#F59E0B", bg:"#FFFBEB", desc:"Makan, ke toilet, dan menjaga kerapian", kode:"D3"},
  "Interaksi dengan Orang Lain": {icon:"🤝", color:"#7C3AED", bg:"#F5F3FF", desc:"Komunikasi dan respons sosial", kode:"D4"},
  "Aktivitas Sehari-hari": {icon:"📅", color:"#D97706", bg:"#FEF3C7", desc:"Tanggung jawab rutin dan tugas sekolah", kode:"D5"},
  "Partisipasi": {icon:"🙋", color:"#DB2777", bg:"#FDF2F8", desc:"Keterlibatan dalam kegiatan kelas atau kelompok", kode:"D6"},
};

export const SKALA_FUNGSIONAL = [
  {v:-1, l:"N/A",     d:"Tidak dapat dijawab / diamati",       color:"#94A3B8", bg:"#F1F5F9"},
  {v:0, l:"Belum",    d:"0 Belum bisa sama sekali",            color:"#D27D6B", bg:"#F8EBE8"},
  {v:1, l:"Dibantu",  d:"1 Bisa dengan bantuan penuh",         color:"#F59E0B", bg:"#FFFBEB"},
  {v:2, l:"Sebagian", d:"2 Bisa sebagian, butuh diingatkan",   color:"#8BB098", bg:"#EBF3ED"},
  {v:3, l:"Mandiri",  d:"3 Bisa sendiri secara konsisten",     color:"#2E3E35", bg:"#D4E8DA"},
];

export interface FungsionalItem {
  id: number;
  kode: string;
  no: number;
  domain: string;
  kategori: FungsionalKategori;
  text: string;
}

export const PROFIL_FUNGSIONAL: FungsionalItem[] = [
  // ── D1 Kognisi (12 butir) ──
  { id: 1,  no: 1,  kode: "D1.01", domain: "D1 Kognisi", kategori: "Kognisi", text: "Memahami instruksi bertahap (2-3 langkah) yang diberikan guru, dengan contoh bila diperlukan." },
  { id: 2,  no: 2,  kode: "D1.02", domain: "D1 Kognisi", kategori: "Kognisi", text: "Mengingat informasi pelajaran dari pertemuan sebelumnya." },
  { id: 3,  no: 3,  kode: "D1.03", domain: "D1 Kognisi", kategori: "Kognisi", text: "Mempertahankan perhatian pada satu tugas hingga selesai." },
  { id: 4,  no: 4,  kode: "D1.04", domain: "D1 Kognisi", kategori: "Kognisi", text: "Menemukan cara alternatif (bertanya, mencoba ulang) ketika menghadapi kesulitan dalam tugas." },
  { id: 5,  no: 5,  kode: "D1.05", domain: "D1 Kognisi", kategori: "Kognisi", text: "Membaca teks pendek dan menyebutkan isi pokoknya." },
  { id: 6,  no: 6,  kode: "D1.06", domain: "D1 Kognisi", kategori: "Kognisi", text: "Melakukan operasi hitung dasar (tambah, kurang, kali, bagi sederhana) dengan bilangan sampai 1.000." },
  { id: 7,  no: 7,  kode: "D1.07", domain: "D1 Kognisi", kategori: "Kognisi", text: "Mengenal konsep waktu sederhana (pagi-siang-malam, nama hari, jam)." },
  { id: 8,  no: 8,  kode: "D1.08", domain: "D1 Kognisi", kategori: "Kognisi", text: "Mengenali nilai uang dan menggunakannya dalam transaksi sederhana." },
  { id: 9,  no: 9,  kode: "D1.09", domain: "D1 Kognisi", kategori: "Kognisi", text: "Menerapkan hal yang telah dipelajari pada situasi baru yang serupa." },
  { id: 10, no: 10, kode: "D1.10", domain: "D1 Kognisi", kategori: "Kognisi", text: "Merencanakan langkah-langkah untuk menyelesaikan tugas atau proyek sederhana (mis. praktik keterampilan) sebelum mengerjakannya." },
  { id: 11, no: 11, kode: "D1.11", domain: "D1 Kognisi", kategori: "Kognisi", text: "Membandingkan dua pilihan dan menyebutkan alasan memilih salah satunya." },
  { id: 12, no: 12, kode: "D1.12", domain: "D1 Kognisi", kategori: "Kognisi", text: "Menerapkan konsep pelajaran pada situasi nyata (mis. mengukur bahan, menghitung uang, membaca petunjuk)." },

  // ── D2 Mobilitas (12 butir) ──
  { id: 13, no: 13, kode: "D2.01", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Berpindah tempat di dalam ruang kelas dengan aman." },
  { id: 14, no: 14, kode: "D2.02", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Menavigasi lingkungan sekolah di luar kelas (kantin, toilet, lapangan)." },
  { id: 15, no: 15, kode: "D2.03", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Mengikuti kegiatan yang melibatkan gerak fisik (senam, permainan)." },
  { id: 16, no: 16, kode: "D2.04", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Menyesuaikan diri ketika ada perubahan tata letak atau rute." },
  { id: 17, no: 17, kode: "D2.05", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Berlari, melompat, dan menjaga keseimbangan sesuai usia." },
  { id: 18, no: 18, kode: "D2.06", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Berjalan beriringan dan mengantre dalam barisan." },
  { id: 19, no: 19, kode: "D2.07", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Menyeberang jalan dengan aman." },
  { id: 20, no: 20, kode: "D2.08", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Menemukan jalan menuju ruang atau tempat yang sudah dikenal di sekolah (ruang keterampilan, perpustakaan, kantin, gerbang)." },
  { id: 21, no: 21, kode: "D2.09", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Mengenali tanda bahaya di lingkungan sekolah dan menghindarinya." },
  { id: 22, no: 22, kode: "D2.10", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Berpindah antar ruang pelajaran (kelas, laboratorium, ruang keterampilan, perpustakaan) tepat waktu sesuai jadwal." },
  { id: 23, no: 23, kode: "D2.11", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Mencapai sekolah dan pulang dengan cara yang aman (berjalan, kendaraan antar-jemput, atau angkutan) sesuai pengaturan yang disepakati." },
  { id: 24, no: 24, kode: "D2.12", domain: "D2 Mobilitas", kategori: "Mobilitas", text: "Berpartisipasi dalam kegiatan fisik atau ekstrakurikuler (olahraga, pramuka, senam) dengan alat bantu atau modifikasi bila perlu." },

  // ── D3 Perawatan Diri (12 butir) ──
  { id: 25, no: 25, kode: "D3.01", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Makan dan minum sendiri saat istirahat dengan rapi." },
  { id: 26, no: 26, kode: "D3.02", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Ke toilet dan membersihkan diri sendiri." },
  { id: 27, no: 27, kode: "D3.03", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Menjaga kerapian diri dan seragam." },
  { id: 28, no: 28, kode: "D3.04", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Menjaga dan mengelola barang miliknya sendiri." },
  { id: 29, no: 29, kode: "D3.05", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Mandi, menyikat gigi, dan keramas secara mandiri." },
  { id: 30, no: 30, kode: "D3.06", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Menyiapkan makanan atau minuman sederhana." },
  { id: 31, no: 31, kode: "D3.07", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Mengenali kebutuhan tubuh (lapar, haus, sakit) dan menyampaikannya." },
  { id: 32, no: 32, kode: "D3.08", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Menjaga keselamatan diri (tidak ikut orang asing, menjauhi benda berbahaya)." },
  { id: 33, no: 33, kode: "D3.09", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Menyebutkan identitas diri dan nomor telepon orang tua atau wali." },
  { id: 34, no: 34, kode: "D3.10", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Menjaga kebersihan diri sesuai perubahan masa remaja (memakai deodoran, merawat rambut dan kuku, mengganti pakaian dalam)." },
  { id: 35, no: 35, kode: "D3.11", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Mengelola kebutuhan pribadi masa pubertas (mis. kebersihan saat menstruasi atau mimpi basah) dengan bantuan minimal atau meminta bantuan orang yang tepat." },
  { id: 36, no: 36, kode: "D3.12", domain: "D3 Perawatan Diri", kategori: "Perawatan Diri", text: "Mengelola uang saku sederhana (membawa, membelanjakan, menyimpan) untuk kebutuhan sekolah atau jajan." },

  // ── D4 Interaksi dengan Orang Lain (12 butir) ──
  { id: 37, no: 37, kode: "D4.01", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Memulai komunikasi dengan teman atau guru." },
  { id: 38, no: 38, kode: "D4.02", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Merespons ketika disapa atau diajak berkomunikasi." },
  { id: 39, no: 39, kode: "D4.03", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Menjaga interaksi berlangsung dua arah (bukan hanya menjawab satu kali)." },
  { id: 40, no: 40, kode: "D4.04", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Menyelesaikan perselisihan dengan teman tanpa bantuan orang dewasa." },
  { id: 41, no: 41, kode: "D4.05", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Menyampaikan keinginan atau pendapat dengan kalimat yang jelas." },
  { id: 42, no: 42, kode: "D4.06", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Mengikuti aturan permainan atau kegiatan kelompok (olahraga, permainan tim)." },
  { id: 43, no: 43, kode: "D4.07", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Mengenali dan menyebutkan emosi diri dan orang lain beserta penyebabnya." },
  { id: 44, no: 44, kode: "D4.08", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Mengendalikan emosi (marah, kecewa) tanpa menyakiti orang lain." },
  { id: 45, no: 45, kode: "D4.09", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Menolak ajakan atau permintaan yang tidak sesuai dengan sopan." },
  { id: 46, no: 46, kode: "D4.10", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Menjaga hubungan pertemanan sebaya (menepati janji, berbagi cerita, menyelesaikan salah paham)." },
  { id: 47, no: 47, kode: "D4.11", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Menolak ajakan berisiko atau tidak sesuai dari teman sebaya (mis. bolos, mengambil barang orang lain, ajakan tidak pantas) dan melapor kepada orang dewasa yang dipercaya." },
  { id: 48, no: 48, kode: "D4.12", domain: "D4 Berinteraksi dengan Orang Lain", kategori: "Interaksi dengan Orang Lain", text: "Berkomunikasi dengan guru mata pelajaran dan staf sekolah yang berbeda sesuai kesantunan masing-masing." },

  // ── D5 Aktivitas Sehari-hari (12 butir) ──
  { id: 49, no: 49, kode: "D5.01", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Memulai tugas tanpa harus diminta berulang." },
  { id: 50, no: 50, kode: "D5.02", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Menyelesaikan tugas sekolah dalam waktu yang tersedia." },
  { id: 51, no: 51, kode: "D5.03", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Menyiapkan dan merapikan alat belajar sendiri." },
  { id: 52, no: 52, kode: "D5.04", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Berpindah antar kegiatan mengikuti jadwal tanpa pendampingan." },
  { id: 53, no: 53, kode: "D5.05", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Mengikuti langkah kerja tugas praktik (3-5 langkah) sesuai contoh." },
  { id: 54, no: 54, kode: "D5.06", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Melaksanakan piket kelas sesuai tugasnya." },
  { id: 55, no: 55, kode: "D5.07", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Membawa pulang dan membawa kembali perlengkapan sekolah (buku, tugas)." },
  { id: 56, no: 56, kode: "D5.08", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Menggunakan alat kerja sederhana (gunting, cutter, palu, alat dapur) dengan benar dan aman." },
  { id: 57, no: 57, kode: "D5.09", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Melakukan pekerjaan rumah tangga (menyapu, mencuci piring, menyetrika, memasak sederhana)." },
  { id: 58, no: 58, kode: "D5.10", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Mengatur perlengkapan sesuai jadwal pelajaran harian (membawa buku dan alat hari itu) dengan bantuan minimal." },
  { id: 59, no: 59, kode: "D5.11", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Mengerjakan tugas rumah atau tugas mandiri dan mengumpulkannya tepat waktu." },
  { id: 60, no: 60, kode: "D5.12", domain: "D5 Aktivitas Sehari-hari", kategori: "Aktivitas Sehari-hari", text: "Mengerjakan tugas keterampilan dasar (mis. boga, kriya, berkebun, membatik) sesuai langkah kerja dan aturan keselamatan." },

  // ── D6 Partisipasi (12 butir) ──
  { id: 61, no: 61, kode: "D6.01", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Terlibat aktif dalam kegiatan kelompok di kelas." },
  { id: 62, no: 62, kode: "D6.02", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Ikut serta dalam kegiatan sekolah di luar jam pelajaran." },
  { id: 63, no: 63, kode: "D6.03", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Menggunakan alat bantu atau media pendukung (kartu, media visual, tablet) secara mandiri." },
  { id: 64, no: 64, kode: "D6.04", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Menyampaikan kebutuhan atau meminta penyesuaian ketika menghadapi hambatan." },
  { id: 65, no: 65, kode: "D6.05", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Ikut serta dalam pentas atau lomba sederhana." },
  { id: 66, no: 66, kode: "D6.06", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Menjalankan peran yang diberikan dalam kelompok." },
  { id: 67, no: 67, kode: "D6.07", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Mengikuti kegiatan masyarakat di lingkungan sekitar." },
  { id: 68, no: 68, kode: "D6.08", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Menaati aturan dan tata tertib bersama." },
  { id: 69, no: 69, kode: "D6.09", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Menyampaikan pendapat sederhana dalam diskusi." },
  { id: 70, no: 70, kode: "D6.10", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Ikut serta dalam organisasi atau kegiatan kelompok sekolah (OSIS, pramuka, ekstrakurikuler)." },
  { id: 71, no: 71, kode: "D6.11", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Menyampaikan pendapat, kebutuhan, atau keberatan kepada guru dengan cara sopan dan jelas." },
  { id: 72, no: 72, kode: "D6.12", domain: "D6 Partisipasi", kategori: "Partisipasi", text: "Berpartisipasi dalam kegiatan keterampilan, pentas, atau pameran karya di sekolah dan lingkungan sekitar." },
];

// ─── Profil Kecenderungan Aktivitas / RIASEC (Tahap 2) ─────────────────────────
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

export const SKALA_RIASEC = [
  {v:-1, l:"N/A", d:"Tidak dapat dijawab / diamati", color:"#94A3B8", bg:"#F1F5F9"},
  {v:0, l:"Tidak Pernah", d:"0 Tidak pernah",       color:"#64748B", bg:"#F1F5F9"},
  {v:1, l:"Kadang",       d:"1 Kadang",             color:"#0EA5E9", bg:"#F0F9FF"},
  {v:2, l:"Sering",       d:"2 Sering",             color:"#2563EB", bg:"#EFF6FF"},
  {v:3, l:"Sangat Sering",d:"3 Sangat sering",      color:"#1E3A8A", bg:"#DBEAFE"},
];

export interface RiasecItem { id:number; text:string; kategori:RiasecKategori }

export const PROFIL_KECENDERUNGAN: RiasecItem[] = [
  // Realistic
  {id:1001, kategori:"Realistic", text:"Tertarik membongkar, merakit, atau memperbaiki benda."},
  {id:1002, kategori:"Realistic", text:"Memilih kegiatan yang menggunakan tangan atau alat (prakarya, kriya, berkebun)."},
  {id:1003, kategori:"Realistic", text:"Menikmati kegiatan yang melibatkan gerak tubuh atau olahraga."},
  // Investigative
  {id:2001, kategori:"Investigative", text:"Mengajukan pertanyaan “mengapa” atau “bagaimana” di luar yang ditanyakan guru."},
  {id:2002, kategori:"Investigative", text:"Tertarik mencoba-coba untuk menemukan jawaban sendiri."},
  {id:2003, kategori:"Investigative", text:"Menikmati teka-teki, pola, hitungan, atau tantangan berpikir."},
  // Artistic
  {id:3001, kategori:"Artistic", text:"Memilih kegiatan menggambar, mewarnai, membentuk, atau kriya (tunanetra: seni taktil/keramik)."},
  {id:3002, kategori:"Artistic", text:"Menunjukkan ketertarikan pada musik, ritme, atau gerak/tari."},
  {id:3003, kategori:"Artistic", text:"Senang bercerita, menulis, atau memerankan sesuatu."},
  // Social
  {id:4001, kategori:"Social", text:"Membantu teman yang mengalami kesulitan tanpa diminta."},
  {id:4002, kategori:"Social", text:"Menjelaskan atau mengajari sesuatu kepada temannya."},
  {id:4003, kategori:"Social", text:"Memilih mengerjakan sesuatu bersama teman daripada sendirian."},
  // Enterprising
  {id:5001, kategori:"Enterprising", text:"Mengambil peran memimpin ketika bekerja dalam kelompok."},
  {id:5002, kategori:"Enterprising", text:"Mengajak teman mengikuti ide atau rencananya."},
  {id:5003, kategori:"Enterprising", text:"Berani tampil atau menyampaikan sesuatu di depan orang banyak."},
  // Conventional
  {id:6001, kategori:"Conventional", text:"Merapikan, menyusun, atau mengurutkan benda atas kemauan sendiri."},
  {id:6002, kategori:"Conventional", text:"Memperbaiki detail dan terganggu bila ada yang tidak rapi atau keliru."},
  {id:6003, kategori:"Conventional", text:"Lebih nyaman pada tugas dengan aturan dan langkah yang jelas."},
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
    k: "FLS2N-PDBK",
    full: "Festival & Lomba Seni Siswa Nasional (PDBK)",
    category: "Artistic",
    date: "12–15 Jul 2026",
    level: "Tingkat Nasional",
    iconBg: "#E6F4F1",
    iconType: "palette-mint",
  },
  {
    k: "O2SN Pendidikan Khusus",
    full: "Olimpiade Olahraga Siswa Nasional Pendidikan Khusus",
    category: "Realistic",
    date: "20–24 Jul 2026",
    level: "Tingkat Nasional",
    iconBg: "#E1F0FE",
    iconType: "runner-blue",
  },
  {
    k: "Lomba Cerdas Cermat",
    full: "Pendidikan Khusus",
    category: "Investigative",
    date: "5 Agu 2026",
    level: "Tingkat Provinsi",
    iconBg: "#EFEAFF",
    iconType: "grad-purple",
  },
  {
    k: "Festival Seni Pertunjukan",
    full: "Siswa Berkebutuhan Khusus",
    category: "Artistic",
    date: "10–12 Sep 2026",
    level: "Tingkat Kabupaten",
    iconBg: "#FEF0E6",
    iconType: "palette-peach",
  },
];

export const studentCompDetail: Record<string,{id:number;cabang:string;match:number;status:StatusType;alasan:string}[]> = {
  "FLS2N-PDBK":[
    {id:1,cabang:"Seni Lukis",       match:98,status:"Didaftarkan",     alasan:"Seni visual Rafi sangat kuat (90/100). Koordinasi motorik halus sesuai kriteria penilaian."},
    {id:2,cabang:"Seni Pertunjukan", match:78,status:"Direkomendasikan",alasan:"Ekspresi musikal Nisa kuat dan cocok untuk cabang seni pertunjukan non-verbal."},
  ],
  "O2SN Pendidikan Khusus":[
    {id:2,cabang:"Boccia",           match:80,status:"Direkomendasikan",alasan:"Motorik Nisa sangat baik (75/100), sangat cocok untuk Boccia."},
    {id:1,cabang:"Boccia",           match:72,status:"Direkomendasikan",alasan:"Konsentrasi dan motorik Rafi mendukung olahraga presisi tanpa komunikasi verbal."},
    {id:8,cabang:"Bulutangkis",      match:76,status:"Direkomendasikan",alasan:"Kelincahan dan refleks Sari aktif dalam aktivitas olahraga berkoordinasi cepat."},
  ],
  "O2SN Diksus":[
    {id:2,cabang:"Boccia",           match:80,status:"Direkomendasikan",alasan:"Motorik Nisa sangat baik (75/100), sangat cocok untuk Boccia."},
    {id:1,cabang:"Boccia",           match:72,status:"Direkomendasikan",alasan:"Konsentrasi dan motorik Rafi mendukung olahraga presisi tanpa komunikasi verbal."},
  ],
  "Lomba Cerdas Cermat":[
    {id:3,cabang:"Matematika Kreatif",match:85,status:"Direkomendasikan",alasan:"Pemahaman logika pola, bentuk, dan konsentrasi analisis Arga sangat baik."},
    {id:7,cabang:"Literasi Digital",  match:81,status:"Direkomendasikan",alasan:"Kemampuan komputasi dan pemecahan masalah Toni sangat menonjol di bidang akademik digital."},
  ],
  "Festival Seni Pertunjukan":[
    {id:4,cabang:"Tari Tradisional Kreasi",match:88,status:"Direkomendasikan",alasan:"Bakat kinestetik dan ekspresi gerak Dina sangat menonjol saat menari."},
  ],
  "LKS":[
    {id:1,cabang:"Desain Grafis",match:83,status:"Direkomendasikan", alasan:"Kemampuan spasial dan visual Rafi (85/100) cocok untuk desain grafis digital."},
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
  { id:1,  date:"2026-08-08", title:"Seleksi Kabupaten FLS2N-PDBK", kind:"lomba",     lokasi:"SLB Negeri 1 Bandung",       jam:"08.00 – 12.00", desc:"Seleksi tingkat kabupaten cabang Seni Lukis dan Seni Pertunjukan untuk peserta didik berkebutuhan khusus.", pendaftaran:"Melalui sekolah, paling lambat 5 Agustus", biaya:"Gratis" },
  { id:2,  date:"2026-08-12", title:"Skrining Tumbuh Kembang Gratis", kind:"terapi",  lokasi:"Puskesmas Cibeunying",       jam:"08.00 – 12.00", desc:"Skrining perkembangan anak dan konsultasi awal dengan terapis, terbuka untuk umum tanpa biaya.", pendaftaran:"Datang langsung, bawa KIA/BPJS", biaya:"Gratis · terbuka umum" },
  { id:3,  date:"2026-08-15", title:"Pelatihan Parenting ABK",      kind:"pelatihan", lokasi:"Aula SLB Harapan Bangsa",    jam:"09.00 – 12.00", desc:"Workshop terbuka untuk semua orang tua: strategi mendampingi anak belajar di rumah sesuai gaya belajarnya.", pendaftaran:"Daftar via tautan panitia", biaya:"Gratis · terbuka umum" },
  { id:5,  date:"2026-08-22", title:"O2SN Diksus — Cabang Boccia",  kind:"lomba",     lokasi:"GOR Pajajaran, Bandung",     jam:"07.30 – 15.00", desc:"Kompetisi Boccia tingkat provinsi untuk kategori tunadaksa dan tunagrahita.", pendaftaran:"Kuota 2 siswa per sekolah", biaya:"Gratis" },
  { id:6,  date:"2026-08-26", title:"Klinik Terapi Wicara Gratis",  kind:"terapi",    lokasi:"Balai RW 07 Cibeunying",     jam:"09.00 – 14.00", desc:"Layanan terapi wicara gratis hasil kerja sama Dinas Kesehatan. Terbuka untuk umum, kuota 40 anak.", pendaftaran:"Pendaftaran online dibuka 20 Agustus", biaya:"Gratis · kuota terbatas" },
  { id:8,  date:"2026-09-03", title:"LKS Diksus — Desain Grafis",   kind:"lomba",     lokasi:"SMKN 4 Bandung",             jam:"08.00 – 16.00", desc:"Lomba Kompetensi Siswa bidang desain grafis untuk peserta didik berkebutuhan khusus.", pendaftaran:"Pendaftaran dibuka 10 Agustus", biaya:"Gratis" },
  { id:9,  date:"2026-09-09", title:"Kelas Seni Inklusi Terbuka",   kind:"pelatihan", lokasi:"Rumah Kreatif Bandung",      jam:"14.00 – 16.00", desc:"Kelas melukis dan kriya terbuka untuk anak ABK, didampingi instruktur seni dan shadow teacher.", pendaftaran:"Daftar via WhatsApp panitia", biaya:"Gratis (subsidi Dinas Pendidikan)" },
];

export const KIND_META: Record<EventKind,{label:string;color:string;bg:string;icon:string}> = {
  lomba:     {label:"Lomba",            color:"#B45309", bg:"#FEF3C7", icon:"🏆"},
  terapi:    {label:"Terapi Gratis",    color:"#0369A1", bg:"#E0F2FE", icon:"🩺"},
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
  kategori:string; jarak:string; alamat:string; jadwal:string;
  biaya:string; kontak:string; rating:number; emoji:string; catatan:string;
  terbuka:boolean;
  /** untuk program terbuka: tanggal penyelenggaraan berikutnya */
  agendaBerikutnya?:string;
}

export const LAYANAN: Layanan[] = [
  { id:1, nama:"Klinik Tumbuh Kembang Asa", jenis:"Terapi", kategori:"Terapi Okupasi & Sensori Integrasi", jarak:"1,2 km", alamat:"Jl. Cikutra No. 45, Bandung", jadwal:"Buka Senin–Sabtu · 09.00–17.00", biaya:"Rp150.000/sesi · BPJS diterima", kontak:"0812-1234-5678", rating:4.8, emoji:"🩺", terbuka:false, catatan:"Cocok untuk anak dengan hambatan motorik halus dan regulasi sensorik." },
  { id:2, nama:"Pusat Terapi Wicara Nusantara", jenis:"Terapi", kategori:"Terapi Wicara & Komunikasi", jarak:"2,4 km", alamat:"Jl. Dipatiukur No. 12, Bandung", jadwal:"Buka Senin–Jumat · 13.00–19.00", biaya:"Rp120.000/sesi", kontak:"0813-2222-9090", rating:4.6, emoji:"🗣️", terbuka:false, catatan:"Menerima anak ASD dan tunarungu, tersedia terapis bahasa isyarat." },
  { id:3, nama:"Kelas Seni Inklusi — Rumah Kreatif Bandung", jenis:"Pelatihan", kategori:"Seni Lukis & Kriya", jarak:"3,1 km", alamat:"Jl. Braga No. 88, Bandung", jadwal:"Rabu & Sabtu · 14.00–16.00", biaya:"Gratis (subsidi Dinas Pendidikan)", kontak:"0821-5555-1122", rating:4.9, emoji:"🎨", terbuka:true, agendaBerikutnya:"9 September 2026", catatan:"Terbuka untuk umum. Cocok untuk anak dengan bakat seni visual yang menyiapkan FLS2N." },
  { id:4, nama:"Sanggar Musik Ritme Anak", jenis:"Pelatihan", kategori:"Musik Perkusi Adaptif", jarak:"4,0 km", alamat:"Jl. Setiabudi No. 210, Bandung", jadwal:"Selasa & Kamis · 15.30–17.00", biaya:"Rp200.000/bulan", kontak:"0857-7788-3344", rating:4.5, emoji:"🥁", terbuka:false, catatan:"Kelas berlangganan — jadwal anak diatur langsung dengan sanggar. Metode berbasis getaran, ramah untuk anak tunarungu." },
  { id:5, nama:"Fisioterapi Anak Sehat Mandiri", jenis:"Terapi", kategori:"Fisioterapi & Mobilitas", jarak:"2,8 km", alamat:"Jl. Pasteur No. 30, Bandung", jadwal:"Buka Senin–Sabtu · 08.00–15.00", biaya:"Rp175.000/sesi · BPJS diterima", kontak:"0811-4433-2211", rating:4.7, emoji:"🦿", terbuka:false, catatan:"Layanan untuk anak tunadaksa, tersedia alat bantu latihan." },
  { id:6, nama:"Klinik Terapi Wicara Gratis Dinkes", jenis:"Terapi", kategori:"Terapi Wicara · Program Pemerintah", jarak:"1,8 km", alamat:"Balai RW 07 Cibeunying, Bandung", jadwal:"Digelar berkala · lihat kalender", biaya:"Gratis · kuota 40 anak", kontak:"0800-1000-100", rating:4.7, emoji:"🏥", terbuka:true, agendaBerikutnya:"26 Agustus 2026", catatan:"Terbuka untuk umum tanpa biaya, hasil kerja sama Dinas Kesehatan." },
  { id:7, nama:"Skrining Tumbuh Kembang Puskesmas", jenis:"Terapi", kategori:"Skrining & Konsultasi Awal", jarak:"1,5 km", alamat:"Puskesmas Cibeunying, Bandung", jadwal:"Setiap bulan · lihat kalender", biaya:"Gratis · bawa KIA/BPJS", kontak:"022-720-1234", rating:4.6, emoji:"🔎", terbuka:true, agendaBerikutnya:"12 Agustus 2026", catatan:"Layanan umum untuk deteksi dini. Tidak perlu rujukan." },
  { id:8, nama:"Komunitas Orang Tua ABK Bandung", jenis:"Komunitas", kategori:"Support Group & Sharing Session", jarak:"—", alamat:"Pertemuan bergilir · info via grup", jadwal:"Minggu ke-2 setiap bulan", biaya:"Gratis", kontak:"0895-1010-2020", rating:4.9, emoji:"🤝", terbuka:true, agendaBerikutnya:"13 September 2026", catatan:"Ruang berbagi pengalaman antar orang tua, sering menghadirkan psikolog anak." },
];
