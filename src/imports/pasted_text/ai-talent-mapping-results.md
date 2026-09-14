# Prompt Per Fitur — TalentaABK
### (disesuaikan dengan SRS_TalentaABK.docx)

Semua prompt di bawah pakai brand guideline yang sama (lihat blok "DESIGN SYSTEM" — tinggal copy-paste sekali di awal chat AI tool kamu, baru lanjut prompt per fitur satu-satu). **Ini web app (diakses lewat browser), bukan mobile app** — sesuai batasan SRS bagian 2.2.

---

## DESIGN SYSTEM (paste ini duluan, sekali saja)

```
Design system for "TalentaABK" — a responsive WEB app (browser-based, 
desktop-first, NOT a native mobile app) — reference this for every 
screen I ask you to design next:
- Actors: Guru SLB (25-50, primary, full access), Orang Tua (30-50, 
  secondary, view-only access), Admin Sekolah (data-entry role).
  Design for mature, non-tech-native users — calm, trustworthy, 
  professional. NOT a youth/startup aesthetic.
- Typography: Plus Jakarta Sans SemiBold/Bold for headings, IBM Plex Sans 
  Regular/Medium for body/UI. Body text minimum 16px, line-height 1.5x. 
  No thin/light weights, no all-caps paragraphs.
- Colors: muted deep teal #0B5A63 (primary), muted warm amber #D98E1E 
  (secondary), charcoal #212529 text, off-white #FAF9F7 background 
  (not pure white). WCAG 2.1 AA contrast (4.5:1 min).
- Click targets minimum 48x48px. Card-based layouts, not dense tables. 
  Icons always paired with text labels. One primary CTA per screen, in 
  amber. Color-coded status always paired with icon/pattern (colorblind-safe).
- Every AI-generated result (Talent Mapping, Learning Recommendation) 
  must visibly include a plain-language explanation next to it — this is 
  a hard requirement (explainable AI), never show a bare score alone.
Confirm you've got this, then I'll ask for individual screens one at a time.
```

---

## 1. Registrasi & Login Guru (FR-01)

```
Using the TalentaABK design system: design a teacher registration/login 
screen. Login form fields: email, password. Registration form fields: 
nama, email, sekolah (school name), password. No OAuth/Google sign-in — 
plain form only. Include a toggle/link between "Masuk" and "Daftar", and 
an error state for "akun sudah terdaftar" when registering with an 
existing email.
```

## 2. Login Orang Tua via Kode Akses (FR-02)

```
Using the TalentaABK design system: design a parent login screen — 
completely separate flow from teacher login, reachable via a tab or link 
from the main login page. Single input field for a unique access code 
(kode akses) given by the school — no name/email/password, no self-
registration option at all. Include an error state for wrong/expired 
code with a message directing the parent to contact the school.
```

## 3. Dashboard Guru (FR-03)

```
Using the TalentaABK design system: design the teacher's home dashboard, 
shown right after login. Show: number of students assigned, count of 
pending/unfinished observations, the student with the best recent 
progress, latest competition recommendations, and the next scheduled 
observation. Prioritize a fast morning-glance scan — teacher opens this 
between classes with limited time.
```

## 4. Manajemen Data Siswa (FR-04)

```
Using the TalentaABK design system: design (a) a student list screen 
with search and a card per student (photo, name, disability type badge), 
and (b) the student profile screen it opens into — showing identity 
(nama, umur, kelas, foto), ABK profile (jenis_abk, tingkat_dukungan, 
kemampuan_komunikasi, kemampuan_motorik, kemampuan_sensorik, 
cara_belajar_dominan, rentang_konsentrasi, minat_awal, 
riwayat_terapi_ringkas). ALL of these fields are admin-entered and 
strictly READ-ONLY for the teacher — mark them visually as locked/
non-editable. Below that, an editable "Catatan Perkembangan" section 
where the teacher can add dated progress notes — this is the only 
editable part of the whole profile.
```

## 5. Observasi Adaptif Berbasis AI (FR-05)

```
Using the TalentaABK design system: design the "Observasi Adaptif" flow. 
Teacher clicks "Mulai Observasi" on a student profile, and the app shows 
a checklist (Adaptive Observation Matrix) that has already been 
auto-selected and filtered by AI to match the student's disability type — 
the matrix type itself is not manually changeable by the teacher. Show a 
clean checklist UI with large click targets, e.g. "Fokus terhadap tugas", 
"Menyukai aktivitas visual", "Koordinasi motorik baik", plus a save 
action that marks the observation complete and ready for AI processing.
```

## 6. AI Talent Mapping (FR-06)

```
Using the TalentaABK design system: design the AI Talent Mapping results 
screen. Show potensi utama (main potential) and potensi pendukung 
(supporting potential) as a ranked list with 1-5 star ratings, plus a 
short plain-language explanation of why the AI reached this result 
(explainability is required — never show a bare score). This result can 
only be generated after at least one observation session is complete — 
include an empty/locked state for students without any observation yet. 
Avoid technical/ML jargon in the copy — this is also read by parents.
```

## 7. AI Learning Recommendation (FR-07)

```
Using the TalentaABK design system: design a screen showing AI-generated 
teaching-strategy recommendations, always based on the student's LATEST 
Talent Mapping result — e.g. "Gunakan media visual", "Demonstrasi 
langsung" (disarankan) vs "Hindari instruksi verbal panjang" (dihindari). 
Present as a clear do/avoid checklist, scannable in a few seconds. 
Include an empty state for when no Talent Mapping result exists yet.
```

## 8. Individual Development Plan / IDP (FR-08)

```
Using the TalentaABK design system: design the IDP screen where the 
teacher sets a semester development target for a student — bidang target 
(pulled from Talent Mapping domains) plus indikator capaian (e.g. 
"Ketelitian", "Kreativitas", "Percaya diri"), with AI-assisted 
suggestions for indicators. Show a status badge that can be one of three 
states: Berjalan / Tercapai / Tidak Tercapai — make this status visually 
distinct (color + icon, not color alone).
```

## 9. Progress Monitoring (FR-09)

```
Using the TalentaABK design system: design a progress monitoring screen 
showing a semester-over-semester comparison as a simple bar or line 
chart (e.g. Semester 1: 70 → Semester 2: 85), pulling from IDP and 
observation score history. Designed to be legible at a glance for a 
40-something viewer, not a dense analytics dashboard. Include an empty 
state for students with less than two semesters of data (comparison not 
yet possible).
```

## 10. Competition Recommendation (FR-10)

```
Using the TalentaABK design system: design a screen listing AI-matched 
official competitions for the student, matched from their Talent Mapping 
result — ONLY from these three: O2SN Diksus, FLS2N-PDBK, LKS. Each card 
shows competition name, cabang lomba, and a short reason for the match, 
plus a status badge with three states: Direkomendasikan / Didaftarkan / 
Selesai. Note: this screen does NOT include an automatic registration 
action — actual registration stays manual/offline per the school, so the 
CTA should be something like "Tandai Didaftarkan", not "Daftar Sekarang".
```

## 11. Generate Parent Report (FR-11, guru-facing)

```
Using the TalentaABK design system: design a screen where the teacher 
clicks "Generate Report" and the AI produces a short plain-language 
draft summary for parents, e.g. "Rafi menunjukkan perkembangan positif 
pada kemampuan seni visual. Direkomendasikan untuk mengikuti kegiatan 
menggambar secara rutin." The draft must be editable, with an explicit 
teacher confirmation step ("Konfirmasi & Kirim") before it becomes 
visible to the parent — it should never auto-send. Also show a simple 
list of previously sent reports with a status badge: Sudah Dibaca / 
Belum Dibaca.
```

## 12. Dashboard Orang Tua (FR-12)

```
Using the TalentaABK design system: design the parent's home dashboard, 
shown right after access-code login. Show a warm greeting (e.g. "Halo Bu 
Ani 👋"), the child's main talent domain, semester progress percentage, 
and the current development target being worked on (e.g. "Persiapan 
FLS2N"). Keep it to essential information only, entirely view-only — 
parents should understand their child's status in under 10 seconds.
```

## 13. Tampilan Detail bagi Orang Tua (FR-13)

```
Using the TalentaABK design system: design the parent's detail view, 
opened from the dashboard — showing the child's basic profile, Talent 
Mapping result (simplified, plain-language, same explainability 
requirement as the teacher version), a progress chart per semester, the 
currently active development program (IDP), and the teacher's 
recommendations. Every element on this screen is VIEW-ONLY — no editable 
fields, no data-entry controls anywhere.
```

## 14. Admin — Input & Kelola Data Awal Siswa (FR-14)

```
Using the TalentaABK design system: design the admin screen for adding a 
new student. Form fields: nama, umur, kelas, foto, jenis_abk (required), 
tingkat_dukungan, kemampuan_komunikasi, kemampuan_motorik, 
kemampuan_sensorik, cara_belajar_dominan, rentang_konsentrasi, 
minat_awal, riwayat_terapi_ringkas, and assignment of a guru pendamping. 
This is a straightforward, form-heavy data-entry screen — prioritize 
clear field grouping and validation states over visual flourish. Include 
the resulting student list view for admin, showing which teacher each 
student is assigned to.
```

## 15. Admin — Kelola Akun Guru & Orang Tua

```
Using the TalentaABK design system: design an admin screen for managing 
accounts — a list of registered teacher accounts (with activate/
deactivate action), and a section for generating a unique parent access 
code linked to a specific student, with the ability to view/reissue an 
existing code. Simple table/list layout, form-heavy, minimal decoration.
```