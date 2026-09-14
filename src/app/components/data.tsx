import { createContext, useContext } from "react";
import type { StatusType } from "./ui-kit";

// ─── Types ───────────────────────────────────────────────────────────
export type Role   = "guru" | "ortu";

export type Screen =
  | "landing" | "role-select" | "google-login" | "parent-code"
  | "dashboard" | "students" | "profile" | "observation" | "kode-akses"
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
  { id:1, name:"Rafi Pratama",   abk:"Autism Spectrum Disorder", kelas:"VII A",  age:13, emoji:"👦", talent:"Seni Visual",    talentScore:90, stars:5, teacher:"Bu Sari",  hasObs:true,  comps:["FLS2N-PDBK","LKS"],         caraBelajar:"Visual",                kodeOrtu:"ABK-2025-RAFI" },
  { id:2, name:"Nisa Aulia",     abk:"Tunarungu",                kelas:"VIII B", age:14, emoji:"👧", talent:"Musik Perkusi",  talentScore:84, stars:4, teacher:"Bu Sari",  hasObs:true,  comps:["FLS2N-PDBK","O2SN Diksus"], caraBelajar:"Auditori & Kinestetik", kodeOrtu:"ABK-2025-NISA" },
  { id:3, name:"Arga Saputra",   abk:"Tunadaksa",                kelas:"VII A",  age:12, emoji:"👦", talent:"Desain Digital", talentScore:76, stars:4, teacher:"Pak Budi", hasObs:true,  comps:[],                           caraBelajar:"Visual & Kinestetik",   kodeOrtu:"ABK-2025-ARGA" },
  { id:4, name:"Dina Maharani",  abk:"Tunagrahita Ringan",       kelas:"IX C",   age:15, emoji:"👧", talent:"Tari",           talentScore:71, stars:4, teacher:"Bu Sari",  hasObs:false, comps:[],                           caraBelajar:"Kinestetik",            kodeOrtu:"ABK-2025-DINA" },
  { id:5, name:"Budi Santoso",   abk:"Autism Spectrum Disorder", kelas:"VII A",  age:13, emoji:"👦", talent:"Seni Visual",    talentScore:82, stars:4, teacher:"Bu Sari",  hasObs:false, comps:["FLS2N-PDBK"],               caraBelajar:"Visual",                kodeOrtu:"ABK-2025-BUDI" },
  { id:6, name:"Maya Dewi",      abk:"Tunagrahita Ringan",       kelas:"VIII B", age:14, emoji:"👧", talent:"Tari",           talentScore:68, stars:3, teacher:"Bu Rina",  hasObs:false, comps:[],                           caraBelajar:"Kinestetik",            kodeOrtu:"ABK-2025-MAYA" },
  { id:7, name:"Toni Firmansyah",abk:"Tunadaksa",                kelas:"IX A",   age:15, emoji:"👦", talent:"Desain Digital", talentScore:79, stars:4, teacher:"Pak Budi", hasObs:true,  comps:["LKS"],                      caraBelajar:"Visual & Kinestetik",   kodeOrtu:"ABK-2025-TONI" },
  { id:8, name:"Sari Indah",     abk:"Tunarungu",                kelas:"VIII A", age:13, emoji:"👧", talent:"Musik Perkusi",  talentScore:73, stars:4, teacher:"Bu Rina",  hasObs:true,  comps:["O2SN Diksus"],              caraBelajar:"Auditori & Kinestetik", kodeOrtu:"ABK-2025-SARI" },
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
  "Autism Spectrum Disorder","Tunarungu","Tunadaksa",
  "Tunagrahita Ringan","Tunagrahita Sedang","Tunanetra","Tunalaras",
];
export const KELAS_OPTIONS = [
  "VII A","VII B","VIII A","VIII B","IX A","IX B","IX C",
];
export const CARA_BELAJAR_OPTIONS = [
  "Visual","Auditori","Kinestetik","Visual & Kinestetik","Auditori & Kinestetik",
];

// ─── Pengamatan per jenis ABK ─────────────────────────────────────────
/** Kategori pengamatan — indikator dikelompokkan agar guru mudah menelusuri. */
export type ObsKategori = "Interaksi Sosial" | "Komunikasi" | "Motorik & Sensorik" | "Fokus & Kognitif" | "Minat & Bakat";

export const OBS_KATEGORI: ObsKategori[] = [
  "Interaksi Sosial","Komunikasi","Motorik & Sensorik","Fokus & Kognitif","Minat & Bakat",
];

export const OBS_KAT_META: Record<ObsKategori,{icon:string;color:string;bg:string;desc:string}> = {
  "Interaksi Sosial":   {icon:"🤝", color:"#B45309", bg:"#FEF3C7", desc:"Cara anak berhubungan dengan teman dan guru"},
  "Komunikasi":         {icon:"💬", color:"#0369A1", bg:"#E0F2FE", desc:"Menyampaikan dan memahami pesan"},
  "Motorik & Sensorik": {icon:"✋", color:"#6D28D9", bg:"#EDE9FE", desc:"Gerak tubuh dan respons indra"},
  "Fokus & Kognitif":   {icon:"🧠", color:"#15803D", bg:"#F0FDF4", desc:"Perhatian, ingatan, dan pemahaman"},
  "Minat & Bakat":      {icon:"✨", color:"#BE185D", bg:"#FCE7F3", desc:"Kegiatan yang menarik minat anak"},
};

export interface ObsItem { id:number; text:string; tag:string; kategori:ObsKategori }

/** Indikator interaksi sosial yang berlaku untuk semua jenis ABK. */
const SOSIAL_UMUM: ObsItem[] = [
  {id:101, text:"Mau bermain atau bekerja berdampingan dengan teman",       tag:"Kebersamaan",  kategori:"Interaksi Sosial"},
  {id:102, text:"Menyapa atau merespons sapaan guru maupun teman",          tag:"Respons",      kategori:"Interaksi Sosial"},
  {id:103, text:"Mau bergantian dan menunggu giliran",                      tag:"Regulasi",     kategori:"Interaksi Sosial"},
  {id:104, text:"Meminta bantuan saat mengalami kesulitan",                 tag:"Inisiatif",    kategori:"Interaksi Sosial"},
  {id:105, text:"Menunjukkan empati saat teman kesulitan atau sedih",       tag:"Empati",       kategori:"Interaksi Sosial"},
];

const BASE: Record<string, ObsItem[]> = {
  "Autism Spectrum Disorder": [
    {id:1, text:"Fokus pada tugas visual >15 menit tanpa gangguan",           tag:"Konsentrasi", kategori:"Fokus & Kognitif"},
    {id:2, text:"Menyukai aktivitas menggambar atau mewarnai secara mandiri", tag:"Minat",       kategori:"Minat & Bakat"},
    {id:3, text:"Koordinasi motorik halus (pensil/kuas) baik",                tag:"Motorik",     kategori:"Motorik & Sensorik"},
    {id:4, text:"Respons instruksi visual tanpa penjelasan verbal",           tag:"Komunikasi",  kategori:"Komunikasi"},
    {id:5, text:"Menyelesaikan proyek multi-langkah secara konsisten",        tag:"Kognitif",    kategori:"Fokus & Kognitif"},
    {id:6, text:"Percaya diri menunjukkan karya kepada orang lain",           tag:"Sosial",      kategori:"Interaksi Sosial"},
    {id:7, text:"Tetap tenang saat rutinitas kelas berubah",                  tag:"Adaptasi",    kategori:"Motorik & Sensorik"},
  ],
  "Tunarungu": [
    {id:1, text:"Merespons instruksi melalui kontak mata dan isyarat visual", tag:"Komunikasi",  kategori:"Komunikasi"},
    {id:2, text:"Mampu memahami ekspresi wajah dan bahasa tubuh guru",        tag:"Sosial",      kategori:"Interaksi Sosial"},
    {id:3, text:"Koordinasi motorik dan gerak tubuh baik",                    tag:"Motorik",     kategori:"Motorik & Sensorik"},
    {id:4, text:"Menggunakan BISINDO/SIBI untuk berkomunikasi",               tag:"Bahasa",      kategori:"Komunikasi"},
    {id:5, text:"Merespons getaran ritme/musik melalui sentuhan",             tag:"Sensorik",    kategori:"Motorik & Sensorik"},
    {id:6, text:"Fokus visual terjaga >20 menit dalam aktivitas terstruktur", tag:"Konsentrasi", kategori:"Fokus & Kognitif"},
    {id:7, text:"Dapat mengikuti urutan instruksi bergambar",                 tag:"Kognitif",    kategori:"Fokus & Kognitif"},
    {id:8, text:"Antusias pada kegiatan gerak, tari, atau ritme",             tag:"Minat",       kategori:"Minat & Bakat"},
  ],
  "Tunadaksa": [
    {id:1, text:"Konsentrasi dan fokus intelektual terjaga dengan baik",        tag:"Kognitif",     kategori:"Fokus & Kognitif"},
    {id:2, text:"Mampu mengikuti instruksi verbal multi-langkah",               tag:"Komunikasi",   kategori:"Komunikasi"},
    {id:3, text:"Kreativitas tinggi dalam menyampaikan ide",                    tag:"Kreativitas",  kategori:"Minat & Bakat"},
    {id:4, text:"Eksplorasi media seni adaptif (digital/oral/manual terbatas)", tag:"Seni",         kategori:"Minat & Bakat"},
    {id:5, text:"Kepercayaan diri dalam berinteraksi sosial",                   tag:"Sosial",       kategori:"Interaksi Sosial"},
    {id:6, text:"Mampu berpartisipasi dengan alat bantu yang tersedia",         tag:"Adaptasi",     kategori:"Motorik & Sensorik"},
    {id:7, text:"Mengendalikan gerak tangan/kepala untuk mengoperasikan alat",  tag:"Motorik",      kategori:"Motorik & Sensorik"},
  ],
  "Tunagrahita Ringan": [
    {id:1, text:"Mengikuti instruksi sederhana 1–2 langkah",         tag:"Kognitif",  kategori:"Fokus & Kognitif"},
    {id:2, text:"Mengenal dan membedakan bentuk serta warna dasar",  tag:"Persepsi",  kategori:"Fokus & Kognitif"},
    {id:3, text:"Mampu meniru gerakan fisik yang dicontohkan guru",  tag:"Motorik",   kategori:"Motorik & Sensorik"},
    {id:4, text:"Berpartisipasi aktif dalam aktivitas kelompok",     tag:"Sosial",    kategori:"Interaksi Sosial"},
    {id:5, text:"Merespons positif terhadap pujian dan penguatan",   tag:"Motivasi",  kategori:"Interaksi Sosial"},
    {id:6, text:"Menunjukkan minat pada aktivitas musik atau gerak", tag:"Minat",     kategori:"Minat & Bakat"},
    {id:7, text:"Menyampaikan kebutuhan dengan kalimat sederhana",   tag:"Komunikasi",kategori:"Komunikasi"},
  ],
  "Tunagrahita Sedang": [
    {id:1, text:"Merespons namanya saat dipanggil",               tag:"Atensi",     kategori:"Fokus & Kognitif"},
    {id:2, text:"Meniru gerakan sederhana yang dicontohkan",      tag:"Motorik",    kategori:"Motorik & Sensorik"},
    {id:3, text:"Menunjukkan ketertarikan pada warna atau bunyi", tag:"Sensorik",   kategori:"Minat & Bakat"},
    {id:4, text:"Mampu duduk tenang minimal 10 menit",            tag:"Konsentrasi",kategori:"Fokus & Kognitif"},
    {id:5, text:"Berinteraksi positif dengan teman sekelas",      tag:"Sosial",     kategori:"Interaksi Sosial"},
    {id:6, text:"Menunjuk atau memberi isyarat saat menginginkan sesuatu", tag:"Komunikasi", kategori:"Komunikasi"},
  ],
  "Tunanetra": [
    {id:1, text:"Merespons instruksi verbal dengan tepat",        tag:"Komunikasi", kategori:"Komunikasi"},
    {id:2, text:"Mengenali objek melalui perabaan",               tag:"Sensorik",   kategori:"Motorik & Sensorik"},
    {id:3, text:"Kepekaan terhadap nada dan irama musik",         tag:"Musik",      kategori:"Minat & Bakat"},
    {id:4, text:"Orientasi dan mobilitas di ruang kelas baik",    tag:"Motorik",    kategori:"Motorik & Sensorik"},
    {id:5, text:"Daya ingat auditori kuat (hafalan lagu/cerita)", tag:"Kognitif",   kategori:"Fokus & Kognitif"},
    {id:6, text:"Percaya diri berbicara di depan kelompok",       tag:"Sosial",     kategori:"Interaksi Sosial"},
  ],
  "Tunalaras": [
    {id:1, text:"Mampu mengelola emosi saat kegiatan berlangsung",  tag:"Emosi",       kategori:"Interaksi Sosial"},
    {id:2, text:"Mengikuti aturan kelas yang disepakati",           tag:"Perilaku",    kategori:"Interaksi Sosial"},
    {id:3, text:"Menyelesaikan tugas tanpa meninggalkan tempat",    tag:"Konsentrasi", kategori:"Fokus & Kognitif"},
    {id:4, text:"Menyampaikan keinginan secara verbal, bukan fisik",tag:"Komunikasi",  kategori:"Komunikasi"},
    {id:5, text:"Menunjukkan minat pada aktivitas tertentu",        tag:"Minat",       kategori:"Minat & Bakat"},
    {id:6, text:"Menyalurkan energi lewat aktivitas fisik terarah", tag:"Motorik",     kategori:"Motorik & Sensorik"},
  ],
};

/** Setiap jenis ABK otomatis mendapat indikator interaksi sosial umum. */
export const OBS_BY_ABK: Record<string, ObsItem[]> = Object.fromEntries(
  Object.entries(BASE).map(([abk,items])=>{
    const sudahAda = new Set(items.filter(i=>i.kategori==="Interaksi Sosial").map(i=>i.tag));
    const tambahan = SOSIAL_UMUM.filter(i=>!sudahAda.has(i.tag));
    return [abk, [...items, ...tambahan]];
  })
);

// ─── Asesmen kemampuan (2 kategori tes) ──────────────────────────────
export type AsesmenKategori = "Kemandirian" | "Akademik & Bakat";

export interface AsesmenItem { id:number; text:string; kategori:AsesmenKategori; petunjuk:string }

/** Skala penilaian — sengaja hanya 4 tingkat agar cepat diisi guru. */
export const SKALA = [
  {v:0, l:"Belum",         d:"Belum muncul sama sekali",            color:"#B91C1C", bg:"#FEF2F2"},
  {v:1, l:"Dibantu",       d:"Bisa dengan bantuan penuh guru",      color:"#B45309", bg:"#FEF3C7"},
  {v:2, l:"Sebagian",      d:"Bisa sebagian, sesekali diingatkan",  color:"#0369A1", bg:"#E0F2FE"},
  {v:3, l:"Mandiri",       d:"Bisa sendiri secara konsisten",       color:"#15803D", bg:"#F0FDF4"},
];

export const ASESMEN_META: Record<AsesmenKategori,{icon:string;color:string;bg:string;desc:string}> = {
  "Kemandirian":     {icon:"🧍", color:"#0369A1", bg:"#E0F2FE", desc:"Kemampuan mengurus diri dan menyelesaikan tugas sendiri"},
  "Akademik & Bakat":{icon:"📚", color:"#6D28D9", bg:"#EDE9FE", desc:"Kemampuan dasar akademik dan potensi bakat yang menonjol"},
};

export const ASESMEN: AsesmenItem[] = [
  // Kemandirian
  {id:1, kategori:"Kemandirian", text:"Merapikan alat belajar setelah selesai",        petunjuk:"Amati saat pergantian jam pelajaran"},
  {id:2, kategori:"Kemandirian", text:"Makan dan minum tanpa bantuan",                 petunjuk:"Amati saat istirahat"},
  {id:3, kategori:"Kemandirian", text:"Ke toilet dan membersihkan diri sendiri",       petunjuk:"Tanyakan juga pada orang tua"},
  {id:4, kategori:"Kemandirian", text:"Memulai tugas tanpa harus diminta berulang",    petunjuk:"Amati awal aktivitas kelas"},
  {id:5, kategori:"Kemandirian", text:"Berpindah antar kegiatan tanpa pendampingan",   petunjuk:"Amati transisi kegiatan"},
  {id:6, kategori:"Kemandirian", text:"Menjaga barang miliknya sendiri",               petunjuk:"Amati sepanjang hari"},
  // Akademik & Bakat
  {id:7,  kategori:"Akademik & Bakat", text:"Mengenali huruf atau kata yang sering dijumpai", petunjuk:"Gunakan kartu kata sederhana"},
  {id:8,  kategori:"Akademik & Bakat", text:"Mengenali angka dan jumlah benda 1–10",          petunjuk:"Gunakan benda konkret"},
  {id:9,  kategori:"Akademik & Bakat", text:"Menyalin bentuk, huruf, atau gambar",            petunjuk:"Beri contoh untuk ditiru"},
  {id:10, kategori:"Akademik & Bakat", text:"Menunjukkan karya yang menonjol di satu bidang", petunjuk:"Seni, musik, gerak, atau kriya"},
  {id:11, kategori:"Akademik & Bakat", text:"Bertahan lama pada kegiatan yang ia sukai",      petunjuk:"Catat perkiraan durasinya"},
  {id:12, kategori:"Akademik & Bakat", text:"Mengulang keterampilan tanpa diminta",           petunjuk:"Tanda minat kuat pada bidang itu"},
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
  "Seni Visual":   {bg:"#EDE9FE",text:"#6D28D9"},
  "Musik Perkusi": {bg:"#E0F2FE",text:"#0369A1"},
  "Desain Digital":{bg:"#FEF9C3",text:"#92400E"},
  "Tari":          {bg:"#FCE7F3",text:"#9D174D"},
};

// ─── Talent detail ───────────────────────────────────────────────────
export const studentTalentDetail: Record<number, { domains: {t:string;sc:number;st:number;r:string}[]; radar: {s:string;A:number}[] }> = {
  1: {
    radar:[{s:"Visual",A:90},{s:"Motorik",A:65},{s:"Sosial",A:55},{s:"Verbal",A:40},{s:"Musik",A:70},{s:"Spasial",A:85}],
    domains:[
      {t:"Seni Visual",sc:90,st:5,r:"Fokus tinggi pada tugas visual, koordinasi motorik halus sangat baik, dan inisiatif menggambar mandiri konsisten dalam 3 sesi pengamatan terakhir."},
      {t:"Desain Spasial",sc:85,st:4,r:"Pemahaman bentuk dan konstruksi di atas rata-rata. Mampu merekonstruksi objek 3D dari panduan 2D tanpa bimbingan verbal."},
      {t:"Musik",sc:70,st:4,r:"Respons positif terhadap ritme dan pola, meskipun belum menjadi minat dominan."},
      {t:"Komunikasi Verbal",sc:40,st:2,r:"Terbatas sesuai profil ASD — ini area dukungan, bukan hambatan pengembangan bakat lain."},
    ],
  },
  2: {
    radar:[{s:"Visual",A:55},{s:"Motorik",A:75},{s:"Sosial",A:70},{s:"Verbal",A:30},{s:"Musik",A:88},{s:"Spasial",A:60}],
    domains:[
      {t:"Musik Perkusi",sc:88,st:5,r:"Respons ritmis sangat kuat. Mampu menangkap pola musik melalui getaran dan ekspresi wajah instruktur tanpa bergantung pada pendengaran verbal."},
      {t:"Kemampuan Motorik",sc:75,st:4,r:"Koordinasi tubuh sangat baik, mendukung aktivitas seni pertunjukan dan olahraga presisi."},
      {t:"Seni Visual",sc:55,st:3,r:"Potensi pendukung yang cukup, perlu dikembangkan lebih lanjut dengan metode visual-kinestetik."},
    ],
  },
};

// ─── Lomba ───────────────────────────────────────────────────────────
export const LOMBA = [
  { k:"FLS2N-PDBK", full:"Festival & Lomba Seni Siswa Nasional — PDBK", icon:"🎨" },
  { k:"O2SN Diksus",full:"Olimpiade Olahraga Siswa Nasional — Diksus",   icon:"⚽" },
  { k:"LKS",        full:"Lomba Kompetensi Siswa",                        icon:"💻" },
];

export const studentCompDetail: Record<string,{id:number;cabang:string;match:number;status:StatusType;alasan:string}[]> = {
  "FLS2N-PDBK":[
    {id:1,cabang:"Seni Lukis",       match:98,status:"Didaftarkan",     alasan:"Seni visual Rafi sangat kuat (90/100). Koordinasi motorik halus sesuai kriteria penilaian."},
    {id:2,cabang:"Seni Pertunjukan", match:78,status:"Direkomendasikan",alasan:"Ekspresi musikal Nisa kuat dan cocok untuk cabang seni pertunjukan non-verbal."},
  ],
  "O2SN Diksus":[
    {id:1,cabang:"Boccia",match:72,status:"Direkomendasikan", alasan:"Konsentrasi dan motorik Rafi mendukung olahraga presisi tanpa komunikasi verbal."},
    {id:2,cabang:"Boccia",match:80,status:"Direkomendasikan", alasan:"Motorik Nisa sangat baik (75/100), sangat cocok untuk Boccia."},
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
