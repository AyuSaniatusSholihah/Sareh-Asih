import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface TambahKelasFormProps {
  onBack?: () => void;
  onSave?: (data: { namaSekolah: string; namaKelas: string; tag: string }) => void;
  defaultSekolah?: string;
}

export default function TambahKelasForm({ onBack, onSave, defaultSekolah = '' }: TambahKelasFormProps) {
  const [namaSekolah, setNamaSekolah] = useState(defaultSekolah);
  const [namaKelas, setNamaKelas] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tunanetra');
  const [showModal, setShowModal] = useState(false);

  const tags = [
    'Tunanetra',
    'Tunarungu',
    'Tunanetra',
    'Tunadaksa',
    'Lainnya',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKelas.trim()) return;
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (onSave) {
      onSave({
        namaSekolah: namaSekolah.trim(),
        namaKelas: namaKelas.trim(),
        tag: selectedTag,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#8EA194] flex items-center justify-center p-4">
      {/* Container Layar HP */}
      <div className="w-full max-w-sm bg-[#8EA194] rounded-[40px] shadow-2xl overflow-hidden relative border-4 border-[#738478] flex flex-col h-[700px]">
        
        {/* Header */}
        <div className="px-6 pt-10 pb-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="text-gray-800 hover:opacity-70 transition-opacity"
            title="Kembali"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tambah Kelas</h1>
            <p className="text-xs text-gray-700">Lengkapi informasi kelas yang akan ditambahkan</p>
          </div>
        </div>

        {/* Form Utama */}
        <form onSubmit={handleSubmit} className="px-6 py-2 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Input Nama Sekolah */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Nama Sekolah
              </label>
              <input
                type="text"
                placeholder="Nama sekolah . contoh: SLB N Surakarta"
                value={namaSekolah}
                onChange={(e) => setNamaSekolah(e.target.value)}
                className="w-full px-4 py-3 bg-[#EAEFEA] rounded-xl text-sm border border-transparent focus:border-gray-500 outline-none text-gray-800 placeholder-gray-400 shadow-inner"
              />
            </div>

            {/* Input Kelompok Kelas */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Kelompok Kelas/Ekskul/Mapel <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama kelas . contoh: VII A"
                value={namaKelas}
                onChange={(e) => setNamaKelas(e.target.value)}
                className="w-full px-4 py-3 bg-[#EAEFEA] rounded-xl text-sm border border-transparent focus:border-gray-500 outline-none text-gray-800 placeholder-gray-400 shadow-inner mb-3"
                required
              />

              {/* Pilihan Filter / Kategori Tag */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-[#738478] text-white shadow-sm'
                        : 'bg-[#EAEFEA]/80 text-gray-700 hover:bg-[#EAEFEA]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="pb-6">
            <button
              type="submit"
              disabled={!namaKelas.trim()}
              className={`w-full py-3.5 rounded-2xl font-semibold shadow-md transition-all ${
                namaKelas.trim()
                  ? 'bg-[#738478] text-white hover:bg-[#627167] cursor-pointer active:scale-[0.99]'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Simpan Kelas
            </button>
          </div>
        </form>

        {/* Modal Sukses */}
        {showModal && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-6 z-50 animate-fadeIn">
            <div className="bg-white w-full rounded-3xl p-6 text-center shadow-2xl relative flex flex-col items-center">
              
              {/* Icon Centang Hijau */}
              <div className="w-16 h-16 bg-[#8EA194] rounded-full flex items-center justify-center mb-4 shadow-md text-white">
                <Check size={36} strokeWidth={3} />
              </div>

              {/* Teks Pesan */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Kelas berhasil ditambahkan!
              </h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed px-2">
                Kelas <span className="font-semibold text-gray-900">{namaKelas || 'VII A'}</span> telah berhasil ditambahkan ke daftar kelas Anda
              </p>

              {/* Tombol Aksi Modal */}
              <button
                type="button"
                onClick={handleModalConfirm}
                className="w-full py-3 bg-[#D9826B] hover:bg-[#C2715A] text-white rounded-2xl font-semibold shadow-md transition-all text-sm active:scale-[0.98]"
              >
                Oke, Mengerti
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export { TambahKelasForm };
