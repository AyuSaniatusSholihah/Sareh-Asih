import { GAYA_META, studentCompDetail, studentTalentDetail, type Student } from "./data";

/* ── Util unduh berkas ────────────────────────────────────────────── */
function unduh(nama:string, isi:string, mime:string) {
  const blob = new Blob(["﻿" + isi], {type:`${mime};charset=utf-8`});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = nama;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1500);
}

const tanggal = () => new Date().toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});
const stempel = () => new Date().toISOString().slice(0,10);

/* ── 1. Ekspor spreadsheet (CSV, siap dibuka Excel / Google Sheets) ── */
const KOLOM: {h:string; get:(s:Student)=>string}[] = [
  {h:"Nama Siswa",       get:s=>s.name},
  {h:"Kelas",            get:s=>s.kelas},
  {h:"Umur",             get:s=>s.age?String(s.age):""},
  {h:"Jenis ABK",        get:s=>s.abk},
  {h:"Guru Pendamping",  get:s=>s.teacher},
  {h:"Status Asesmen", get:s=>s.hasObs?"Sudah didampingi":"Belum didampingi"},
  {h:"Cara Belajar",     get:s=>s.caraBelajar||""},
  {h:"Bakat Dominan",    get:s=>s.talent||""},
  {h:"Skor Bakat",       get:s=>s.talentScore?String(s.talentScore):""},
  {h:"Rekomendasi Lomba",get:s=>s.comps.join(", ")},
  {h:"Tingkat Dukungan", get:s=>s.tingkatDukungan||""},
  {h:"Komunikasi",       get:s=>s.komunikasi||""},
  {h:"Motorik",          get:s=>s.motorik||""},
  {h:"Rentang Fokus",    get:s=>s.rentang||""},
  {h:"Minat",            get:s=>s.minat||""},
  {h:"Riwayat Terapi",   get:s=>s.terapi||""},
  {h:"Kode Akses Ortu",  get:s=>s.kodeOrtu||"BELUM DIBUAT"},
];

/** Pemisah titik-koma dipakai agar langsung rapi di Excel berlokal Indonesia. */
function csvSel(v:string) {
  const bersih = v.replace(/"/g,'""');
  return /[;"\n]/.test(bersih) ? `"${bersih}"` : bersih;
}

export function exportSpreadsheet(list:Student[], namaSekolah:string) {
  const judul = [
    `Data Siswa ABK - ${namaSekolah}`,
    `Diekspor ${tanggal()} - ${list.length} siswa`,
    "",
  ].join("\n");
  const header = KOLOM.map(k=>csvSel(k.h)).join(";");
  const baris  = list.map(s=>KOLOM.map(k=>csvSel(k.get(s))).join(";"));
  unduh(`data-siswa-${stempel()}.csv`, judul + [header,...baris].join("\n"), "text/csv");
}

/* ── 2. Ekspor laporan dokumen pemetaan (.doc, dibuka Word/Docs) ───── */
const esc = (v:string) => v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function bagianSiswa(s:Student, index:number, total:number) {
  const gaya = s.caraBelajar ? GAYA_META[s.caraBelajar] : undefined;
  const talent = studentTalentDetail[s.id];
  const lomba = s.comps
    .map(c=>({c, d:studentCompDetail[c]?.find(x=>x.id===s.id)}))
    .filter(x=>!!x.d);

  const baris = (l:string,v:string) =>
    `<tr><td class="k">${esc(l)}</td><td class="v">${esc(v||"—")}</td></tr>`;

  return `
  <div class="siswa"${index<total-1?' style="page-break-after:always"':''}>
    <h2>${index+1}. ${esc(s.name)}</h2>
    <p class="sub">Kelas ${esc(s.kelas)}${s.age?` &middot; ${s.age} tahun`:""} &middot; ${esc(s.abk)} &middot; Guru pendamping: ${esc(s.teacher)}</p>

    <h3>A. Profil Kebutuhan</h3>
    <table>
      ${baris("Jenis ABK", s.abk)}
      ${baris("Tingkat Dukungan", s.tingkatDukungan||"")}
      ${baris("Kemampuan Komunikasi", s.komunikasi||"")}
      ${baris("Kemampuan Motorik", s.motorik||"")}
      ${baris("Rentang Konsentrasi", s.rentang||"")}
      ${baris("Minat Awal", s.minat||"")}
      ${baris("Riwayat Terapi", s.terapi||"")}
    </table>

    <h3>B. Hasil Pemetaan Bakat</h3>
    ${!s.hasObs
      ? `<p class="kosong">Belum ada data asesmen. Pemetaan bakat akan tersedia setelah asesmen pertama diselesaikan.</p>`
      : `<table>
          ${baris("Bakat Dominan", s.talent||"")}
          ${baris("Skor Bakat", s.talentScore?`${s.talentScore} / 100`:"")}
          ${baris("Tingkat Penguasaan", "★".repeat(s.stars) + "☆".repeat(Math.max(0,5-s.stars)))}
          ${baris("Gaya Belajar Dominan", s.caraBelajar||"")}
        </table>
        ${talent ? `<table class="rinci">
            <tr><th>Domain</th><th>Skor</th><th>Dasar penilaian</th></tr>
            ${talent.domains.map(d=>`<tr><td>${esc(d.t)}</td><td class="mid">${d.sc}</td><td>${esc(d.r)}</td></tr>`).join("")}
          </table>` : ""}`
    }

    <h3>C. Rekomendasi Pembelajaran</h3>
    ${gaya
      ? `<p><strong>Strategi yang disarankan:</strong></p><ul>${gaya.strategi.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
         <p><strong>Sebaiknya dihindari:</strong></p><ul>${gaya.hindari.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`
      : `<p class="kosong">Gaya belajar belum teridentifikasi, sehingga rekomendasi belum dapat disusun.</p>`
    }

    <h3>D. Rekomendasi Lomba</h3>
    ${lomba.length
      ? `<table class="rinci">
          <tr><th>Ajang</th><th>Cabang</th><th>Kecocokan</th><th>Status</th><th>Alasan</th></tr>
          ${lomba.map(x=>`<tr><td>${esc(x.c)}</td><td>${esc(x.d!.cabang)}</td><td class="mid">${x.d!.match}%</td><td>${esc(x.d!.status)}</td><td>${esc(x.d!.alasan)}</td></tr>`).join("")}
        </table>`
      : `<p class="kosong">Belum ada rekomendasi lomba untuk siswa ini.</p>`
    }

    <h3>E. Akses Orang Tua</h3>
    <table>${baris("Kode Akses", s.kodeOrtu||"Belum dibuat")}</table>

    <div class="ttd">
      <p>Guru Pendamping,</p>
      <div class="garis"></div>
      <p>${esc(s.teacher)}</p>
    </div>
  </div>`;
}

export function buildLaporanHTML(list:Student[], namaSekolah:string) {
  const satu = list.length === 1;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Laporan Pemetaan Bakat</title>
<style>
  @media print {
    body { margin: 16mm 14mm !important; }
    @page { margin: 10mm; }
  }
  body{font-family:'Calibri','Segoe UI',sans-serif;color:#2E3E35;line-height:1.6;font-size:11pt;margin:32px}
  h1{font-size:19pt;margin:0 0 4px;color:#2E3E35}
  h2{font-size:14pt;margin:26px 0 2px;padding-bottom:5px;border-bottom:2px solid #8BB098;color:#2E3E35}
  h3{font-size:11.5pt;margin:16px 0 6px;color:#5B7A68}
  .kop{border-bottom:3px solid #8BB098;padding-bottom:10px;margin-bottom:6px}
  .meta{color:#6B8070;font-size:9.5pt;margin:0}
  .sub{color:#6B8070;font-size:10pt;margin:2px 0 8px}
  .kosong{color:#6B8070;font-style:italic}
  table{border-collapse:collapse;width:100%;margin:6px 0 10px}
  td,th{border:1px solid #D4E8DA;padding:6px 9px;vertical-align:top;font-size:10pt}
  th{background:#D4E8DA;text-align:left;color:#2E3E35}
  td.k{background:#F3F8F4;width:34%;color:#5B7A68}
  td.mid{text-align:center}
  ul{margin:4px 0 10px 18px;padding:0}
  li{margin-bottom:3px}
  .ttd{margin-top:22px;font-size:10pt;page-break-inside:avoid}
  .garis{height:44px}
  .ttd p:last-child{border-top:1px solid #2E3E35;display:inline-block;padding-top:3px;min-width:190px}
  .catatan{background:#F3F8F4;border-left:3px solid #8BB098;padding:9px 12px;font-size:9.5pt;color:#5B7A68;margin-top:26px}
</style></head>
<body>
  <div class="kop">
    <h1>Laporan Pemetaan Bakat Siswa ABK</h1>
    <p class="meta">${esc(namaSekolah)} &middot; Dicetak ${tanggal()} &middot; ${list.length} siswa</p>
  </div>
  ${satu ? "" : `<p class="meta">Daftar siswa: ${list.map(s=>esc(s.name)).join(", ")}</p>`}
  ${list.map((s,i)=>bagianSiswa(s,i,list.length)).join("")}
  <p class="catatan">Laporan ini dihasilkan Sareh Asih dari data asesmen dan asesmen yang diinput guru pendamping. Hasil pemetaan bersifat indikatif dan tidak menggantikan asesmen tenaga ahli.</p>
</body></html>`;
}

export function printReportPDF(list: Student[], namaSekolah: string) {
  const html = buildLaporanHTML(list, namaSekolah);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.print();
      }
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {
          // ignore
        }
      }, 3000);
    }, 400);
  } else {
    window.print();
  }
}

export function exportLaporanPemetaan(list:Student[], namaSekolah:string) {
  const satu = list.length === 1;
  const html = buildLaporanHTML(list, namaSekolah);
  const nama = satu
    ? `laporan-pemetaan-${list[0].name.toLowerCase().replace(/\s+/g,"-")}-${stempel()}.doc`
    : `laporan-pemetaan-${list.length}-siswa-${stempel()}.doc`;
  unduh(nama, html, "application/msword");
}
