import { useState } from "react";
import { CheckCircle } from "lucide-react";
import {
  CARD, TEXT, MUTED, SEC, T, DEEP, PJS, IPS,
} from "../ui-kit";
import { useStudents } from "../data";
import { StudentPicker, ExportPanel } from "../kode-manager";

export function ReportScreen({ namaSekolah }: { namaSekolah: string }) {
  const students = useStudents();
  const [pilihEkspor, setPilihEkspor] = useState<Set<number>>(new Set());
  const [toastEkspor, setToastEkspor] = useState("");

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: IPS }}>
      <div style={{ background: CARD }} className="px-4 pt-2 pb-3">
        <p className="font-bold text-xl" style={{ fontFamily: PJS, color: TEXT }}>Ekspor Data & Laporan</p>
        <p className="text-xs" style={{ color: MUTED }}>Unduh berkas laporan pemetaan bakat dan rekap data siswa</p>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* Ekspor data & laporan pemetaan */}
        <div>
          <p className="font-bold text-sm mb-1" style={{ fontFamily: PJS, color: TEXT }}>Ekspor Data & Laporan Pemetaan</p>
          <p className="text-xs mb-2.5 leading-relaxed" style={{ color: MUTED }}>
            Unduh rekap seluruh siswa, atau pilih anak tertentu saja.
          </p>
          <div className="space-y-2.5">
            <StudentPicker pilih={pilihEkspor} setPilih={setPilihEkspor} />
            <ExportPanel
              list={pilihEkspor.size ? students.filter(s => pilihEkspor.has(s.id)) : students}
              adaSeleksi={pilihEkspor.size > 0}
              namaSekolah={namaSekolah}
              onDone={t => { setToastEkspor(t); setTimeout(() => setToastEkspor(""), 2400); }}
              judul="Unduh Berkas"
            />
          </div>
          {toastEkspor && (
            <div className="mt-2 rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ background: SEC }}>
              <CheckCircle size={14} style={{ color: T, flexShrink: 0 }} />
              <p className="text-xs font-semibold" style={{ color: DEEP }}>{toastEkspor}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
