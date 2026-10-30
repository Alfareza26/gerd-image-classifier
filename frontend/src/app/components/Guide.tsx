import React from 'react';
import { Icon } from './Icon';
import { ACTION_GUIDES, SOP_STEPS } from '../lib/data';

interface GuideProps {
  onTriggerAction?: (actionKey: string) => void;
}

export function Guide({ onTriggerAction }: GuideProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ============================================== */}
      {/* INTERAKSI PENGGUNA (TOMBOL & AKSI)             */}
      {/* ============================================== */}
      <div className="lg:col-span-7 bg-white rounded-lg border border-[#bfc7d2]/60 p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff] mb-3">
            <div className="flex items-center gap-2">
              <Icon name="touch_app" className="text-[#006194] text-xl" />
              <h4 className="text-[16px] font-bold text-[#131b2e]">
                Interaksi Pengguna (Tombol &amp; Aksi)
              </h4>
            </div>
            <span className="text-[10px] bg-[#eaedff] px-2 py-0.5 rounded text-[#3f4850] font-bold uppercase tracking-wider">
              Panduan Tombol UI
            </span>
          </div>

          <p className="text-[12px] text-[#3f4850] mb-3">
            Daftar tombol navigasi dan fungsi operasional di setiap halaman sistem:
          </p>

          <div className="overflow-hidden rounded-lg border border-[#bfc7d2]/40">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#f2f3ff] px-3 py-2 text-[10px] font-bold text-[#131b2e] uppercase border-b border-[#bfc7d2]/30 tracking-wider">
              <div className="col-span-3">Halaman</div>
              <div className="col-span-4">Tombol / Aksi</div>
              <div className="col-span-5">Fungsi</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#bfc7d2]/20 text-[12px] bg-[#faf8ff]">
              {/* Row 1: Beranda */}
              <div className="grid grid-cols-12 px-3 py-2 items-center hover:bg-[#f2f3ff]/60 transition-colors">
                <div className="col-span-3 font-semibold flex items-center gap-1.5 text-[#131b2e]">
                  <Icon name="home" className="text-base text-[#006194]" />
                  <span>Beranda</span>
                </div>
                <div className="col-span-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#006194] text-white text-[10px] font-semibold">
                    <Icon name="play_arrow" className="text-xs" />
                    Mulai Analisis
                  </span>
                </div>
                <div className="col-span-5 text-[#3f4850]">Menuju halaman upload citra</div>
              </div>

              {/* Row 2: Upload */}
              <div className="grid grid-cols-12 px-3 py-2 items-center hover:bg-[#f2f3ff]/60 transition-colors">
                <div className="col-span-3 font-semibold flex items-center gap-1.5 text-[#131b2e]">
                  <Icon name="cloud_upload" className="text-base text-[#006194]" />
                  <span>Upload</span>
                </div>
                <div className="col-span-4 space-y-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#bfc7d2] bg-white text-[10px] font-semibold text-[#131b2e]">
                    <Icon name="folder_open" className="text-xs text-[#006194]" />
                    Pilih File
                  </span>
                  <br />
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#006194] text-white text-[10px] font-semibold">
                    <Icon name="arrow_forward" className="text-xs" />
                    Lanjut ke Analisis
                  </span>
                </div>
                <div className="col-span-5 text-[#3f4850]">
                  Memilih gambar dari perangkat lalu mengirim gambar ke model
                </div>
              </div>

              {/* Row 3: Analisis */}
              <div className="grid grid-cols-12 px-3 py-2 items-center hover:bg-[#f2f3ff]/60 transition-colors">
                <div className="col-span-3 font-semibold flex items-center gap-1.5 text-[#131b2e]">
                  <Icon name="sync" className="text-base text-[#006194]" />
                  <span>Analisis</span>
                </div>
                <div className="col-span-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eaedff] text-[10px] font-semibold text-[#131b2e]">
                    <Icon name="sync" className="text-xs animate-spin text-[#006194]" />
                    Proses Otomatis
                  </span>
                </div>
                <div className="col-span-5 text-[#3f4850]">
                  Menampilkan progress inferensi neural network
                </div>
              </div>

              {/* Row 4: Hasil */}
              <div className="grid grid-cols-12 px-3 py-2 items-center hover:bg-[#f2f3ff]/60 transition-colors">
                <div className="col-span-3 font-semibold flex items-center gap-1.5 text-[#131b2e]">
                  <Icon name="query_stats" className="text-base text-[#006194]" />
                  <span>Hasil</span>
                </div>
                <div className="col-span-4 space-y-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#bfc7d2] bg-white text-[10px] font-semibold text-[#131b2e]">
                    <Icon name="refresh" className="text-xs text-[#006194]" />
                    Analisis Gambar Lain
                  </span>
                  <br />
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#006194] text-white text-[10px] font-semibold">
                    <Icon name="save" className="text-xs" />
                    Simpan ke Riwayat
                  </span>
                </div>
                <div className="col-span-5 text-[#3f4850]">
                  Kembali ke upload atau menyimpan hasil ke riwayat
                </div>
              </div>

              {/* Row 5: Riwayat */}
              <div className="grid grid-cols-12 px-3 py-2 items-center hover:bg-[#f2f3ff]/60 transition-colors">
                <div className="col-span-3 font-semibold flex items-center gap-1.5 text-[#131b2e]">
                  <Icon name="history" className="text-base text-[#006194]" />
                  <span>Riwayat</span>
                </div>
                <div className="col-span-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#bfc7d2] bg-white text-[10px] font-semibold text-[#131b2e]">
                    <Icon name="visibility" className="text-xs text-[#006194]" />
                    Lihat Detail
                  </span>
                </div>
                <div className="col-span-5 text-[#3f4850]">
                  Melihat hasil rekap pemeriksaan lengkap
                </div>
              </div>

              {/* Row 6: Profil */}
              <div className="grid grid-cols-12 px-3 py-2 items-center hover:bg-[#f2f3ff]/60 transition-colors">
                <div className="col-span-3 font-semibold flex items-center gap-1.5 text-[#131b2e]">
                  <Icon name="person" className="text-base text-[#006194]" />
                  <span>Profil</span>
                </div>
                <div className="col-span-4 space-y-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[#006194] text-[#006194] bg-white text-[10px] font-semibold">
                    <Icon name="edit" className="text-xs" />
                    Ubah Profil
                  </span>
                  <br />
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-red-200 text-red-700 bg-red-50 text-[10px] font-semibold">
                    <Icon name="logout" className="text-xs" />
                    Logout
                  </span>
                </div>
                <div className="col-span-5 text-[#3f4850]">
                  Mengedit data pengguna dan keluar dari akun
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* ALUR PENGGUNAAN (DARI UPLOAD HINGGA HASIL)      */}
      {/* ============================================== */}
      <div className="lg:col-span-5 bg-white rounded-lg border border-[#bfc7d2]/60 p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff] mb-3">
            <div className="flex items-center gap-2">
              <Icon name="account_tree" className="text-[#006194] text-xl" />
              <h4 className="text-[16px] font-bold text-[#131b2e]">
                Alur Penggunaan (Dari Upload hingga Hasil)
              </h4>
            </div>
            <span className="text-[10px] bg-[#dbe1ff] text-[#00174b] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              6 Tahap SOP
            </span>
          </div>

          <div className="space-y-2.5">
            {SOP_STEPS.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-3 p-2 rounded-lg bg-[#faf8ff] hover:bg-[#f2f3ff]/60 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#cce5ff] text-[#006194] font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#131b2e]">{step.title}</p>
                  <p className="text-[12px] text-[#3f4850] mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
