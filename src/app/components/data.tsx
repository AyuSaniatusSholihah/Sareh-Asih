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
  | "parent-calendar" | "parent-training";

export interface Student {
  id:number; name:string; abk:string; kelas:string; age:number; emoji:string;
  talent:string; talentScore:number; stars:number; teacher:string;
  hasObs:boolean; comps:string[]; caraBelajar:string;
  tingkatDukungan?:string; komunikasi?:string; motorik?:string;
  sensorik?:string; rentang?:string; minat?:string; terapi?:string;
  kodeOrtu?:string;
}

// ─── Seed data ───────────────────────────────────────────────────────
export const seedStudents: Student[] = [
  { id:1, name:"Rafi Pratama",   abk:"Tunanetra (Low Vision)",   kelas:"VII A",  age:13, emoji:"👦", talent:"Artistic",       talentScore:90, stars:5, teacher:"Bu Sari",  hasObs:true,  comps:["FLS2N-PDBK","LKS"],         caraBelajar:"Visual",                kodeOrtu:"ABK-2025-RAFI" },
  { id:2, name:"Nisa Aulia",     abk:"Tunarungu",                kelas:"VIII B", age:14, emoji:"👧", talent:"Realistic",      talentScore:84, stars:4, teacher:"Bu Sari",  hasObs:true,  comps:["FLS2N-PDBK","O2SN Diksus"], caraBelajar:"Auditori & Kinestetik", kodeOrtu:"ABK-2025-NISA" },
  { id:3, name:"Arga Saputra",   abk:"Tunadaksa",                kelas:"VII A",  age:12, emoji:"👦", talent:"Investigative",  talentScore:76, stars:4, teacher:"Pak Budi", hasObs:true,  comps:[],                           caraBelajar:"Visual & Kinestetik",   kodeOrtu:"ABK-2025-ARGA" },
  { id:4, name:"Dina Maharani",  abk:"Tunanetra (Total)",        kelas:"IX C",   age:15, emoji:"👧", talent:"Social",         talentScore:71, stars:4, teacher:"Bu Sari",  hasObs:false, comps:[],                           caraBelajar:"Kinestetik",            kodeOrtu:"ABK-2025-DINA" },
  { id:5, name:"Budi Santoso",   abk:"Tunadaksa (Cerebral Palsy)",kelas:"VII A",  age:13, emoji:"👦", talent:"Enterprising",   talentScore:82, stars:4, teacher:"Bu Sari",  hasObs:false, comps:["FLS2N-PDBK"],               caraBelajar:"Visual",                kodeOrtu:"ABK-2025-BUDI" },
  { id:6, name:"Maya Dewi",      abk:"Tunarungu (Hard of Hearing)",kelas:"VIII B", age:14, emoji:"👧", talent:"Conventional",   talentScore:68, stars:3, teacher:"Bu Rina",  hasObs:false, comps:[],                           caraBelajar:"Kinestetik",            kodeOrtu:"ABK-2025-MAYA" },
  { id:7, name:"Toni Firmansyah",abk:"Tunadaksa",                kelas:"IX A",   age:15, emoji:"👦", talent:"Realistic",      talentScore:79, stars:4, teacher:"Pak Budi", hasObs:true,  comps:["LKS"],                      caraBelajar:"Visual & Kinestetik",   kodeOrtu:"ABK-2025-TONI" },
  { id:8, name:"Sari Indah",     abk:"Tunarungu",                kelas:"VIII A", age:13, emoji:"👧", talent:"Artistic",       talentScore:73, stars:4, teacher:"Bu Rina",  hasObs:true,  comps:["O2SN Diksus"],              caraBelajar:"Auditori & Kinestetik", kodeOrtu:"ABK-2025-SARI" },
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
  { id:1, studentId:1, judul:"Perkembangan Bulan Mei", dikirimPada:"3 Jun 2026", dibaca:true, dibacaPada:"3 Jun 2026, 19.20",
    isi:"Rafi semakin fokus saat kegiatan menggambar dan mulai mau menunjukkan hasil karyanya ke teman. Mohon dilanjutkan latihan menggambar 20 menit di rumah." },
  { id:2, studentId:1, judul:"Catatan Latihan Lomba", dikirimPada:"18 Jun 2026", dibaca:false,
    isi:"Rafi mulai ikut latihan persiapan FLS2N cabang menggambar setiap Rabu. Mohon dukungan agar tetap semangat dan istirahat cukup." },
];

// ─── Students store (guru dapat menambah siswa sendiri) ──────────────
interface StudentsStore { list:Student[]; add:(s:Omit<Student,"id">)=>Student; }
export const StudentsCtx = createContext<StudentsStore>({ list:seedStudents, add:()=>seedStudents[0] });
export const useStudents = () => useContext(StudentsCtx).list;
export const useAddStudent = () => useContext(StudentsCtx).add;

// ─── Pilihan form ────────────────────────────────────────────────────
export const ABK_OPTIONS = [
  "Tunanetra (Low Vision)","Tunarungu","Tunadaksa",
  "Tunanetra (Total)","Tunarungu (Hard of Hearing)","Tunanetra","Tunalaras",
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
  {v:-1, l:"N/A",     d:"Tidak dapat dijawab / diamati",       color:"#94A3B8", bg:"#F1F5F9"},
  {v:0, l:"Belum",    d:"0 Belum bisa sama sekali",            color:"#D27D6B", bg:"#F8EBE8"},
  {v:1, l:"Dibantu",  d:"1 Bisa dengan bantuan penuh",         color:"#F59E0B", bg:"#FFFBEB"},
  {v:2, l:"Sebagian", d:"2 Bisa sebagian, butuh diingatkan",   color:"#8BB098", bg:"#EBF3ED"},
  {v:3, l:"Mandiri",  d:"3 Bisa sendiri secara konsisten",     color:"#2E3E35", bg:"#D4E8DA"},
];

export interface FungsionalItem { id:number; text:string; kategori:FungsionalKategori }

export const PROFIL_FUNGSIONAL: FungsionalItem[] = [
  // D1 Kognisi
  {id:101, kategori:"Kognisi", text:"Memahami instruksi bertahap (2-3 langkah) yang diberikan guru."},
  {id:102, kategori:"Kognisi", text:"Mengingat informasi pelajaran dari pertemuan sebelumnya."},
  {id:103, kategori:"Kognisi", text:"Mempertahankan perhatian pada satu tugas hingga selesai."},
  {id:104, kategori:"Kognisi", text:"Menemukan cara alternatif ketika menghadapi kesulitan dalam tugas."},
  // D2 Mobilitas
  {id:201, kategori:"Mobilitas", text:"Berpindah tempat di dalam ruang kelas."},
  {id:202, kategori:"Mobilitas", text:"Menavigasi lingkungan sekolah di luar kelas (kantin, toilet, lapangan)."},
  {id:203, kategori:"Mobilitas", text:"Mengikuti kegiatan yang melibatkan gerak fisik."},
  {id:204, kategori:"Mobilitas", text:"Menyesuaikan diri ketika ada perubahan tata letak atau rute."},
  // D3 Perawatan Diri
  {id:301, kategori:"Perawatan Diri", text:"Makan dan minum sendiri saat istirahat."},
  {id:302, kategori:"Perawatan Diri", text:"Ke toilet dan membersihkan diri sendiri."},
  {id:303, kategori:"Perawatan Diri", text:"Menjaga kerapian diri dan seragam."},
  {id:304, kategori:"Perawatan Diri", text:"Menjaga dan mengelola barang miliknya sendiri."},
  // D4 Interaksi dengan Orang Lain
  {id:401, kategori:"Interaksi dengan Orang Lain", text:"Memulai komunikasi dengan teman atau guru."},
  {id:402, kategori:"Interaksi dengan Orang Lain", text:"Merespons ketika disapa atau diajak berkomunikasi."},
  {id:403, kategori:"Interaksi dengan Orang Lain", text:"Menjaga interaksi berlangsung dua arah (bukan hanya menjawab satu kali)."},
  {id:404, kategori:"Interaksi dengan Orang Lain", text:"Menyelesaikan perselisihan dengan teman tanpa bantuan orang dewasa."},
  // D5 Aktivitas Sehari-hari
  {id:501, kategori:"Aktivitas Sehari-hari", text:"Memulai tugas tanpa harus diminta berulang."},
  {id:502, kategori:"Aktivitas Sehari-hari", text:"Menyelesaikan tugas sekolah dalam waktu yang tersedia."},
  {id:503, kategori:"Aktivitas Sehari-hari", text:"Menyiapkan dan merapikan alat belajar sendiri."},
  {id:504, kategori:"Aktivitas Sehari-hari", text:"Berpindah antar kegiatan mengikuti jadwal tanpa pendampingan."},
  // D6 Partisipasi
  {id:601, kategori:"Partisipasi", text:"Terlibat aktif dalam kegiatan kelompok di kelas."},
  {id:602, kategori:"Partisipasi", text:"Ikut serta dalam kegiatan sekolah di luar jam pelajaran."},
  {id:603, kategori:"Partisipasi", text:"Menggunakan alat bantu atau teknologi pendukungnya secara mandiri."},
  {id:604, kategori:"Partisipasi", text:"Menyampaikan kebutuhan atau meminta penyesuaian ketika menghadapi hambatan."},
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

export const progressData = [
  { sem:"S1'23", seni:58, komunikasi:42, motorik:55 },
  { sem:"S2'23", seni:67, komunikasi:50, motorik:60 },
  { sem:"S1'24", seni:75, komunikasi:56, motorik:63 },
  { sem:"S2'24", seni:85, komunikasi:64, motorik:70 },
];

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
  category: "Seni" | "Olahraga" | "Akademik";
  date: string;
  level: string;
  iconBg: string;
  iconType: "palette-mint" | "runner-blue" | "grad-purple" | "palette-peach";
}

export const LOMBA: LombaItem[] = [
  {
    k: "FLS2N-PDBK",
    full: "Festival & Lomba Seni Siswa Nasional (PDBK)",
    category: "Seni",
    date: "12–15 Jul 2026",
    level: "Tingkat Nasional",
    iconBg: "#E6F4F1",
    iconType: "palette-mint",
  },
  {
    k: "O2SN Pendidikan Khusus",
    full: "Olimpiade Olahraga Siswa Nasional Pendidikan Khusus",
    category: "Olahraga",
    date: "20–24 Jul 2026",
    level: "Tingkat Nasional",
    iconBg: "#E1F0FE",
    iconType: "runner-blue",
  },
  {
    k: "Lomba Cerdas Cermat",
    full: "Pendidikan Khusus",
    category: "Akademik",
    date: "5 Agu 2026",
    level: "Tingkat Provinsi",
    iconBg: "#EFEAFF",
    iconType: "grad-purple",
  },
  {
    k: "Festival Seni Pertunjukan",
    full: "Siswa Berkebutuhan Khusus",
    category: "Seni",
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
export type EventKind = "lomba"|"terapi"|"pelatihan"|"sekolah";

/**
 * Kalender HANYA memuat agenda yang bersifat umum/terbuka:
 * - lomba resmi, pelatihan terbuka, dan layanan gratis terbuka untuk umum.
 * - agenda "sekolah" bersifat privat: hanya tampil jika orang tua sudah
 *   memasukkan kode akses dari guru (lihat field `sekolah`).
 * Jadwal terapi personal TIDAK dimasukkan ke kalender karena bersifat
 * pribadi, berbayar, dan diatur langsung antara orang tua & penyedia.
 */
export interface AgendaEvent {
  id:number; date:string; // YYYY-MM-DD
  endDate?:string;
  title:string; kind:EventKind; lokasi:string; jam:string; desc:string;
  pendaftaran?:string;
  biaya?:string;
  /** diisi hanya untuk agenda internal sekolah — butuh kode akses */
  sekolah?:string;
}

export const AGENDA: AgendaEvent[] = [
  { id:1,  date:"2026-08-08", title:"Seleksi Kabupaten FLS2N-PDBK", kind:"lomba",     lokasi:"SLB Negeri 1 Bandung",       jam:"08.00 – 12.00", desc:"Seleksi tingkat kabupaten cabang Seni Lukis dan Seni Pertunjukan untuk peserta didik berkebutuhan khusus.", pendaftaran:"Melalui sekolah, paling lambat 5 Agustus", biaya:"Gratis" },
  { id:2,  date:"2026-08-12", title:"Skrining Tumbuh Kembang Gratis", kind:"terapi",  lokasi:"Puskesmas Cibeunying",       jam:"08.00 – 12.00", desc:"Skrining perkembangan anak dan konsultasi awal dengan terapis, terbuka untuk umum tanpa biaya.", pendaftaran:"Datang langsung, bawa KIA/BPJS", biaya:"Gratis · terbuka umum" },
  { id:3,  date:"2026-08-15", title:"Pelatihan Parenting ABK",      kind:"pelatihan", lokasi:"Aula SLB Harapan Bangsa",    jam:"09.00 – 12.00", desc:"Workshop terbuka untuk semua orang tua: strategi mendampingi anak belajar di rumah sesuai gaya belajarnya.", pendaftaran:"Daftar via tautan panitia", biaya:"Gratis · terbuka umum" },
  { id:4,  date:"2026-08-19", title:"Pembagian Rapor Tengah Sem.",  kind:"sekolah",   lokasi:"SLB Harapan Bangsa",         jam:"08.00 – 11.00", desc:"Orang tua diundang untuk menerima laporan perkembangan dan berdiskusi dengan guru pendamping.", sekolah:"SLB Harapan Bangsa" },
  { id:5,  date:"2026-08-22", title:"O2SN Diksus — Cabang Boccia",  kind:"lomba",     lokasi:"GOR Pajajaran, Bandung",     jam:"07.30 – 15.00", desc:"Kompetisi Boccia tingkat provinsi untuk kategori tunadaksa dan tunagrahita.", pendaftaran:"Kuota 2 siswa per sekolah", biaya:"Gratis" },
  { id:6,  date:"2026-08-26", title:"Klinik Terapi Wicara Gratis",  kind:"terapi",    lokasi:"Balai RW 07 Cibeunying",     jam:"09.00 – 14.00", desc:"Layanan terapi wicara gratis hasil kerja sama Dinas Kesehatan. Terbuka untuk umum, kuota 40 anak.", pendaftaran:"Pendaftaran online dibuka 20 Agustus", biaya:"Gratis · kuota terbatas" },
  { id:7,  date:"2026-08-28", title:"Rapat Wali Murid Kelas VII",   kind:"sekolah",   lokasi:"SLB Harapan Bangsa",         jam:"09.00 – 11.00", desc:"Pembahasan program pendampingan semester dan persiapan lomba tingkat kabupaten.", sekolah:"SLB Harapan Bangsa" },
  { id:8,  date:"2026-09-03", title:"LKS Diksus — Desain Grafis",   kind:"lomba",     lokasi:"SMKN 4 Bandung",             jam:"08.00 – 16.00", desc:"Lomba Kompetensi Siswa bidang desain grafis untuk peserta didik berkebutuhan khusus.", pendaftaran:"Pendaftaran dibuka 10 Agustus", biaya:"Gratis" },
  { id:9,  date:"2026-09-09", title:"Kelas Seni Inklusi Terbuka",   kind:"pelatihan", lokasi:"Rumah Kreatif Bandung",      jam:"14.00 – 16.00", desc:"Kelas melukis dan kriya terbuka untuk anak ABK, didampingi instruktur seni dan shadow teacher.", pendaftaran:"Daftar via WhatsApp panitia", biaya:"Gratis (subsidi Dinas Pendidikan)" },
  { id:10, date:"2026-09-12", title:"Bazar & Pentas Karya Siswa",   kind:"sekolah",   lokasi:"SLB Harapan Bangsa",         jam:"08.00 – 13.00", desc:"Pameran karya siswa dan pentas seni. Orang tua diharapkan hadir mendampingi anak.", sekolah:"SLB Harapan Bangsa" },
];

export const KIND_META: Record<EventKind,{label:string;color:string;bg:string;icon:string}> = {
  lomba:     {label:"Lomba",            color:"#B45309", bg:"#FEF3C7", icon:"🏆"},
  terapi:    {label:"Terapi Gratis",    color:"#0369A1", bg:"#E0F2FE", icon:"🩺"},
  pelatihan: {label:"Pelatihan Umum",   color:"#6D28D9", bg:"#EDE9FE", icon:"🎓"},
  sekolah:   {label:"Agenda Sekolah",   color:"#15803D", bg:"#F0FDF4", icon:"🏫"},
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
