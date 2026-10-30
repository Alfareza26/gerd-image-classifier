import React from 'react';
import { Icon } from './Icon';

interface HeroProps {
  onNavigate: (moduleKey: 'login' | 'beranda' | 'upload' | 'analisis' | 'hasil' | 'riwayat' | 'profil') => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="bg-white rounded-lg border border-[#bfc7d2]/50 p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] relative overflow-hidden">
      {/* Subtle Radial Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#cce5ff]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Clinical Title & Scope */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#dbe1ff]/50 text-[#00174b] text-[10px] uppercase tracking-wider font-bold mb-2">
              <Icon name="biotech" className="text-sm" />
              <span>Deep Learning Endoscopy Decision Support</span>
            </div>

            <h2 className="text-[32px] font-bold text-[#131b2e] tracking-tight leading-tight">
              GERD Image Classifier
            </h2>
            <p className="text-[16px] font-semibold text-[#006194] mt-1">
              AI untuk Analisis Citra Endoskopi
            </p>
            <p className="text-[13px] text-[#3f4850] mt-2.5 leading-relaxed">
              Sistem klasifikasi citra medis berbasis deep learning untuk membantu analisis tanda-tanda yang berkaitan dengan GERD pada citra endoskopi.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#cce5ff]/30 border border-[#cce5ff] text-[#006194] text-[11px] font-semibold">
            <Icon name="verified" className="text-base text-[#006194]" />
            <span>Untuk edukasi dan penelitian — bukan pengganti diagnosis medis.</span>
          </div>
        </div>

        {/* Right Feature Architecture Matrix */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#131b2e] flex items-center gap-2">
              <Icon name="apps" className="text-[#006194] text-xl" />
              <span>Fitur Utama</span>
            </h3>
            <span className="text-[10px] text-[#3f4850] font-medium uppercase tracking-wider">
              Arsitektur Sistem
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Feature 1 */}
            <div 
              onClick={() => onNavigate('beranda')}
              className="p-3.5 rounded-lg bg-[#faf8ff] border border-[#bfc7d2]/50 hover:border-[#006194] hover:shadow-sm transition-all flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#cce5ff] text-[#006194] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="home" className="text-xl" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#131b2e]">Beranda</h4>
                <p className="text-[12px] text-[#3f4850] mt-0.5 leading-snug">
                  Informasi aplikasi dan mulai analisis.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => onNavigate('upload')}
              className="p-3.5 rounded-lg bg-[#faf8ff] border border-[#bfc7d2]/50 hover:border-[#006194] hover:shadow-sm transition-all flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#cce5ff] text-[#006194] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="cloud_upload" className="text-xl" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#131b2e]">Upload Gambar</h4>
                <p className="text-[12px] text-[#3f4850] mt-0.5 leading-snug">
                  Unggah citra endoskopi dan validasi otomatis.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => onNavigate('hasil')}
              className="p-3.5 rounded-lg bg-[#faf8ff] border border-[#bfc7d2]/50 hover:border-[#006194] hover:shadow-sm transition-all flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#cce5ff] text-[#006194] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="analytics" className="text-xl" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#131b2e]">Hasil Prediksi</h4>
                <p className="text-[12px] text-[#3f4850] mt-0.5 leading-snug">
                  Kelas, skor, heatmap Grad-CAM, dan penjelasan.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => onNavigate('riwayat')}
              className="p-3.5 rounded-lg bg-[#faf8ff] border border-[#bfc7d2]/50 hover:border-[#006194] hover:shadow-sm transition-all flex items-start gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#cce5ff] text-[#006194] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="history" className="text-xl" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#131b2e]">Riwayat Pemeriksaan</h4>
                <p className="text-[12px] text-[#3f4850] mt-0.5 leading-snug">
                  Lihat hasil analisis sebelumnya dan kelola akun.
                </p>
              </div>
            </div>
          </div>

          {/* Important Medical Note */}
          <div className="p-3 rounded-lg bg-[#f2f3ff] border border-[#006194]/20 flex items-start gap-2.5 mt-1">
            <Icon name="info" className="text-[#006194] text-lg mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-[#131b2e]">Catatan Penting Medis</p>
              <p className="text-[12px] text-[#3f4850] mt-0.5 leading-relaxed">
                Aplikasi ini hanya melakukan klasifikasi citra medis, bukan mendiagnosis GERD secara pasti. Hasil prediksi harus selalu dikonfirmasi oleh tenaga medis profesional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
