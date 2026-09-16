// Database Sekolah Luar Biasa (SLB) di seluruh Indonesia
export interface SLBSekolah {
  npsn?: string;
  nama: string;
  kota: string;
  provinsi: string;
  status: "Negeri" | "Swasta";
}

export const DATABASE_SLB_INDONESIA: SLBSekolah[] = [
  // ─── JAWA BARAT ───
  { npsn: "20219501", nama: "SLB Negeri 1 Bandung", kota: "Kota Bandung", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219502", nama: "SLB Negeri Cicendo", kota: "Kota Bandung", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219503", nama: "SLB Negeri A Pajajaran", kota: "Kota Bandung", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219504", nama: "SLB Negeri Taruna Mandiri", kota: "Kota Cimahi", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219505", nama: "SLB Negeri Bogor", kota: "Kota Bogor", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219506", nama: "SLB Negeri Depok", kota: "Kota Depok", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219507", nama: "SLB Negeri Bekasi Jaya", kota: "Kota Bekasi", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219508", nama: "SLB Negeri Cirebon", kota: "Kota Cirebon", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219509", nama: "SLB Negeri Sukabumi", kota: "Kota Sukabumi", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219510", nama: "SLB BC Nurani", kota: "Kab. Cirebon", provinsi: "Jawa Barat", status: "Swasta" },
  { npsn: "20219511", nama: "SLB B-C Cahaya Pertiwi", kota: "Kota Bekasi", provinsi: "Jawa Barat", status: "Swasta" },
  { npsn: "20219512", nama: "SLB Negeri Garut", kota: "Kab. Garut", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219513", nama: "SLB Negeri Tasikmalaya", kota: "Kota Tasikmalaya", provinsi: "Jawa Barat", status: "Negeri" },
  { npsn: "20219514", nama: "SLB Negeri Subang", kota: "Kab. Subang", provinsi: "Jawa Barat", status: "Negeri" },

  // ─── DKI JAKARTA ───
  { npsn: "20107301", nama: "SLB Negeri 01 Jakarta", kota: "Jakarta Barat", provinsi: "DKI Jakarta", status: "Negeri" },
  { npsn: "20107302", nama: "SLB Negeri 02 Jakarta", kota: "Jakarta Selatan", provinsi: "DKI Jakarta", status: "Negeri" },
  { npsn: "20107303", nama: "SLB Negeri 03 Jakarta", kota: "Jakarta Timur", provinsi: "DKI Jakarta", status: "Negeri" },
  { npsn: "20107304", nama: "SLB Negeri 07 Jakarta", kota: "Jakarta Utara", provinsi: "DKI Jakarta", status: "Negeri" },
  { npsn: "20107305", nama: "SLB A Pembina Tingkat Nasional", kota: "Jakarta Selatan", provinsi: "DKI Jakarta", status: "Negeri" },
  { npsn: "20107306", nama: "SLB Santi Rama (Tunarungu)", kota: "Jakarta Selatan", provinsi: "DKI Jakarta", status: "Swasta" },
  { npsn: "20107307", nama: "SLB Pangudi Luhur", kota: "Jakarta Barat", provinsi: "DKI Jakarta", status: "Swasta" },
  { npsn: "20107308", nama: "SLB Kasih Bunda", kota: "Jakarta Timur", provinsi: "DKI Jakarta", status: "Swasta" },
  { npsn: "20107309", nama: "SLB Daya Pelita Kasih", kota: "Jakarta Selatan", provinsi: "DKI Jakarta", status: "Swasta" },

  // ─── DI YOGYAKARTA ───
  { npsn: "20403101", nama: "SLB Negeri 1 Yogyakarta", kota: "Kota Yogyakarta", provinsi: "DI Yogyakarta", status: "Negeri" },
  { npsn: "20403102", nama: "SLB Negeri 2 Yogyakarta", kota: "Kota Yogyakarta", provinsi: "DI Yogyakarta", status: "Negeri" },
  { npsn: "20403103", nama: "SLB Negeri 1 Bantul", kota: "Kab. Bantul", provinsi: "DI Yogyakarta", status: "Negeri" },
  { npsn: "20403104", nama: "SLB Negeri 1 Sleman", kota: "Kab. Sleman", provinsi: "DI Yogyakarta", status: "Negeri" },
  { npsn: "20403105", nama: "SLB Negeri 1 Kulon Progo", kota: "Kab. Kulon Progo", provinsi: "DI Yogyakarta", status: "Negeri" },
  { npsn: "20403106", nama: "SLB Negeri 1 Gunungkidul", kota: "Kab. Gunungkidul", provinsi: "DI Yogyakarta", status: "Negeri" },
  { npsn: "20403107", nama: "SLB Negeri Pembina Yogyakarta", kota: "Kota Yogyakarta", provinsi: "DI Yogyakarta", status: "Negeri" },
  { npsn: "20403108", nama: "SLB Karnnamanohara (Tunarungu)", kota: "Kab. Sleman", provinsi: "DI Yogyakarta", status: "Swasta" },
  { npsn: "20403109", nama: "SLB Helen Keller Indonesia", kota: "Kab. Bantul", provinsi: "DI Yogyakarta", status: "Swasta" },

  // ─── JAWA TENGAH ───
  { npsn: "20328901", nama: "SLB Negeri Semarang", kota: "Kota Semarang", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328902", nama: "SLB Negeri Surakarta", kota: "Kota Surakarta (Solo)", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328903", nama: "SLB Negeri Banyumas", kota: "Kab. Banyumas (Purwokerto)", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328904", nama: "SLB Negeri Magelang", kota: "Kota Magelang", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328905", nama: "SLB Negeri Jepara", kota: "Kab. Jepara", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328906", nama: "SLB Negeri Purworejo", kota: "Kab. Purworejo", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328907", nama: "SLB Negeri Salatiga", kota: "Kota Salatiga", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328908", nama: "SLB Negeri Tegal", kota: "Kota Tegal", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328909", nama: "SLB Negeri Pekalongan", kota: "Kota Pekalongan", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328910", nama: "SLB Negeri Kudus", kota: "Kab. Kudus", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20328911", nama: "SLB Negeri Cilacap", kota: "Kab. Cilacap", provinsi: "Jawa Tengah", status: "Negeri" },
  { npsn: "20327953", nama: "SLB Panca Bakti Mulia", kota: "Kota Surakarta", provinsi: "Jawa Tengah", status: "Swasta" },

  // ─── JAWA TIMUR ───
  { npsn: "20539101", nama: "SLB Negeri Surabaya", kota: "Kota Surabaya", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539102", nama: "SLB Negeri Gedangan", kota: "Kab. Sidoarjo", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539103", nama: "SLB Negeri Malang", kota: "Kota Malang", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539104", nama: "SLB Negeri Banyuwangi", kota: "Kab. Banyuwangi", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539105", nama: "SLB Negeri Jember", kota: "Kab. Jember", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539106", nama: "SLB Negeri Kediri", kota: "Kota Kediri", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539107", nama: "SLB Negeri Madiun", kota: "Kota Madiun", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539108", nama: "SLB Negeri Pasuruan", kota: "Kota Pasuruan", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539109", nama: "SLB Negeri Probolinggo", kota: "Kota Probolinggo", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539110", nama: "SLB Negeri Blitar", kota: "Kota Blitar", provinsi: "Jawa Timur", status: "Negeri" },
  { npsn: "20539111", nama: "SLB Negeri Mojokerto", kota: "Kota Mojokerto", provinsi: "Jawa Timur", status: "Negeri" },

  // ─── BANTEN ───
  { npsn: "20614001", nama: "SLB Negeri Tangerang", kota: "Kota Tangerang", provinsi: "Banten", status: "Negeri" },
  { npsn: "20614002", nama: "SLB Negeri Tangerang Selatan", kota: "Kota Tangerang Selatan", provinsi: "Banten", status: "Negeri" },
  { npsn: "20614003", nama: "SLB Negeri Serang", kota: "Kota Serang", provinsi: "Banten", status: "Negeri" },
  { npsn: "20614004", nama: "SLB Negeri Cilegon", kota: "Kota Cilegon", provinsi: "Banten", status: "Negeri" },
  { npsn: "20614005", nama: "SLB Negeri Pandeglang", kota: "Kab. Pandeglang", provinsi: "Banten", status: "Negeri" },
  { npsn: "20614006", nama: "SLB Negeri Lebak", kota: "Kab. Lebak", provinsi: "Banten", status: "Negeri" },

  // ─── SUMATERA ───
  { npsn: "10258001", nama: "SLB Negeri Medan", kota: "Kota Medan", provinsi: "Sumatera Utara", status: "Negeri" },
  { npsn: "10258002", nama: "SLB Negeri Pembina Medan", kota: "Kota Medan", provinsi: "Sumatera Utara", status: "Negeri" },
  { npsn: "10304001", nama: "SLB Negeri 1 Padang", kota: "Kota Padang", provinsi: "Sumatera Barat", status: "Negeri" },
  { npsn: "10304002", nama: "SLB Negeri 2 Padang", kota: "Kota Padang", provinsi: "Sumatera Barat", status: "Negeri" },
  { npsn: "10304003", nama: "SLB Negeri Bukittinggi", kota: "Kota Bukittinggi", provinsi: "Sumatera Barat", status: "Negeri" },
  { npsn: "10609001", nama: "SLB Negeri Pembina Palembang", kota: "Kota Palembang", provinsi: "Sumatera Selatan", status: "Negeri" },
  { npsn: "10609002", nama: "SLB Negeri Lubuklinggau", kota: "Kota Lubuklinggau", provinsi: "Sumatera Selatan", status: "Negeri" },
  { npsn: "10403001", nama: "SLB Negeri Pembina Pekanbaru", kota: "Kota Pekanbaru", provinsi: "Riau", status: "Negeri" },
  { npsn: "10807001", nama: "SLB Negeri Bandar Lampung", kota: "Kota Bandar Lampung", provinsi: "Lampung", status: "Negeri" },
  { npsn: "10105001", nama: "SLB Negeri Banda Aceh", kota: "Kota Banda Aceh", provinsi: "Aceh", status: "Negeri" },
  { npsn: "10502001", nama: "SLB Negeri Jambi", kota: "Kota Jambi", provinsi: "Jambi", status: "Negeri" },
  { npsn: "10701001", nama: "SLB Negeri Bengkulu", kota: "Kota Bengkulu", provinsi: "Bengkulu", status: "Negeri" },
  { npsn: "10901001", nama: "SLB Negeri Pangkalpinang", kota: "Kota Pangkalpinang", provinsi: "Kepulauan Bangka Belitung", status: "Negeri" },
  { npsn: "11001001", nama: "SLB Negeri Batam", kota: "Kota Batam", provinsi: "Kepulauan Riau", status: "Negeri" },

  // ─── BALI & NUSA TENGGARA ───
  { npsn: "50103001", nama: "SLB Negeri 1 Denpasar", kota: "Kota Denpasar", provinsi: "Bali", status: "Negeri" },
  { npsn: "50103002", nama: "SLB Negeri 2 Denpasar", kota: "Kota Denpasar", provinsi: "Bali", status: "Negeri" },
  { npsn: "50103003", nama: "SLB Negeri 1 Badung", kota: "Kab. Badung", provinsi: "Bali", status: "Negeri" },
  { npsn: "50103004", nama: "SLB Negeri 1 Singaraja", kota: "Kab. Buleleng", provinsi: "Bali", status: "Negeri" },
  { npsn: "50204001", nama: "SLB Negeri 1 Mataram", kota: "Kota Mataram", provinsi: "Nusa Tenggara Barat", status: "Negeri" },
  { npsn: "50204002", nama: "SLB Negeri 1 Sumbawa", kota: "Kab. Sumbawa", provinsi: "Nusa Tenggara Barat", status: "Negeri" },
  { npsn: "50305001", nama: "SLB Negeri Kupang", kota: "Kota Kupang", provinsi: "Nusa Tenggara Timur", status: "Negeri" },
  { npsn: "50305002", nama: "SLB Negeri Ende", kota: "Kab. Ende", provinsi: "Nusa Tenggara Timur", status: "Negeri" },

  // ─── KALIMANTAN ───
  { npsn: "30204001", nama: "SLB Negeri 1 Banjarmasin", kota: "Kota Banjarmasin", provinsi: "Kalimantan Selatan", status: "Negeri" },
  { npsn: "30204002", nama: "SLB Negeri 2 Banjarmasin", kota: "Kota Banjarmasin", provinsi: "Kalimantan Selatan", status: "Negeri" },
  { npsn: "30405001", nama: "SLB Negeri 1 Samarinda", kota: "Kota Samarinda", provinsi: "Kalimantan Timur", status: "Negeri" },
  { npsn: "30405002", nama: "SLB Negeri Balikpapan", kota: "Kota Balikpapan", provinsi: "Kalimantan Timur", status: "Negeri" },
  { npsn: "30103001", nama: "SLB Negeri Pontianak", kota: "Kota Pontianak", provinsi: "Kalimantan Barat", status: "Negeri" },
  { npsn: "30302001", nama: "SLB Negeri 1 Palangka Raya", kota: "Kota Palangka Raya", provinsi: "Kalimantan Tengah", status: "Negeri" },
  { npsn: "30501001", nama: "SLB Negeri Tarakan", kota: "Kota Tarakan", provinsi: "Kalimantan Utara", status: "Negeri" },

  // ─── SULAWESI ───
  { npsn: "40306001", nama: "SLB Negeri 1 Makassar", kota: "Kota Makassar", provinsi: "Sulawesi Selatan", status: "Negeri" },
  { npsn: "40306002", nama: "SLB Negeri Pembina Tingkat Provinsi Sulsel", kota: "Kota Makassar", provinsi: "Sulawesi Selatan", status: "Negeri" },
  { npsn: "40105001", nama: "SLB Negeri Pembina Manado", kota: "Kota Manado", provinsi: "Sulawesi Utara", status: "Negeri" },
  { npsn: "40203001", nama: "SLB Negeri Palu", kota: "Kota Palu", provinsi: "Sulawesi Tengah", status: "Negeri" },
  { npsn: "40404001", nama: "SLB Negeri Kendari", kota: "Kota Kendari", provinsi: "Sulawesi Tenggara", status: "Negeri" },
  { npsn: "40501001", nama: "SLB Negeri Gorontalo", kota: "Kota Gorontalo", provinsi: "Gorontalo", status: "Negeri" },
  { npsn: "40601001", nama: "SLB Negeri Mamuju", kota: "Kab. Mamuju", provinsi: "Sulawesi Barat", status: "Negeri" },

  // ─── MALUKU & PAPUA ───
  { npsn: "60102001", nama: "SLB Negeri Ambon", kota: "Kota Ambon", provinsi: "Maluku", status: "Negeri" },
  { npsn: "60201001", nama: "SLB Negeri Ternate", kota: "Kota Ternate", provinsi: "Maluku Utara", status: "Negeri" },
  { npsn: "60303001", nama: "SLB Negeri Jayapura", kota: "Kota Jayapura", provinsi: "Papua", status: "Negeri" },
  { npsn: "60401001", nama: "SLB Negeri Manokwari", kota: "Kab. Manokwari", provinsi: "Papua Barat", status: "Negeri" },
  { npsn: "60501001", nama: "SLB Negeri Merauke", kota: "Kab. Merauke", provinsi: "Papua Selatan", status: "Negeri" },
  { npsn: "60601001", nama: "SLB Negeri Sorong", kota: "Kota Sorong", provinsi: "Papua Barat Daya", status: "Negeri" },
];

/**
 * Filter SLB berdasarkan query pencarian nama, kota, atau provinsi
 */
export function cariSLB(query: string, limit = 8): SLBSekolah[] {
  const q = query.trim().toLowerCase();
  if (!q) return DATABASE_SLB_INDONESIA.slice(0, limit);
  return DATABASE_SLB_INDONESIA.filter(s =>
    s.nama.toLowerCase().includes(q) ||
    s.kota.toLowerCase().includes(q) ||
    s.provinsi.toLowerCase().includes(q) ||
    (s.npsn && s.npsn.includes(q))
  ).slice(0, limit);
}
