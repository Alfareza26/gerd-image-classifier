import React, { useState } from 'react';
import { Icon } from './Icon';
import { CURRENT_DOCTOR } from '../lib/data';

interface HeaderProps {
  activeModule: string;
  onSelectModule: (moduleKey: 'login' | 'beranda' | 'upload' | 'analisis' | 'hasil' | 'riwayat' | 'profil') => void;
  onStartAnalysis: () => void;
}

export function Header({ activeModule, onSelectModule, onStartAnalysis }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Model MobileNetV2 v2.4 Siap', desc: 'Akselerator inferensi GPU aktif (~1.2 detik)', time: '5m lalu', unread: true },
    { id: 2, title: 'Protokol Lyon Consensus 2.0', desc: 'Validasi otomatis erosif break mukosa esofagus diaktifkan', time: '1j lalu', unread: false },
    { id: 3, title: 'Sinkronisasi EHR', desc: 'Riwayat 8 sampel terakhir terverifikasi di database', time: '3j lalu', unread: false },
  ]);

  return (
    <header className="sticky top-0 w-full bg-white border-b border-[#bfc7d2]/40 z-50 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div 
          className="flex items-center gap-3 flex-shrink-0 cursor-pointer"
          onClick={() => onSelectModule('beranda')}
        >
          <div className="w-10 h-10 rounded-lg bg-[#006194] text-white flex items-center justify-center shadow-sm">
            <Icon name="vital_signs" className="text-2xl text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold text-[#131b2e] tracking-tight">GERD Image Classifier</h1>
              <span className="text-[10px] bg-[#cce5ff] text-[#001d31] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                GERD AI v2.4
              </span>
            </div>
            <p className="text-[11px] text-[#3f4850] leading-none mt-0.5">
              AI untuk Analisis Citra Endoskopi Medis
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 flex-1 max-w-xl mx-4">
          <button
            onClick={() => onSelectModule('beranda')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeModule === 'beranda'
                ? 'bg-[#006194] text-white shadow-sm'
                : 'text-[#3f4850] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <Icon name="home" className="text-lg" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onSelectModule('upload')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeModule === 'upload'
                ? 'bg-[#006194] text-white shadow-sm'
                : 'text-[#3f4850] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <Icon name="cloud_upload" className="text-lg" />
            <span>Upload Gambar</span>
          </button>

          <button
            onClick={() => onSelectModule('riwayat')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeModule === 'riwayat'
                ? 'bg-[#006194] text-white shadow-sm'
                : 'text-[#3f4850] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <Icon name="history" className="text-lg" />
            <span>Riwayat Pemeriksaan</span>
          </button>

          <button
            onClick={() => onSelectModule('profil')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeModule === 'profil'
                ? 'bg-[#006194] text-white shadow-sm'
                : 'text-[#3f4850] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
            }`}
          >
            <Icon name="account_circle" className="text-lg" />
            <span>Profil Pengguna</span>
          </button>
        </nav>

        {/* Action Controls & Doctor Profile */}
        <div className="flex items-center gap-3 flex-shrink-0 relative">
          <button
            onClick={onStartAnalysis}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-[13px] font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Icon name="play_arrow" className="text-lg" />
            <span>Mulai Analisis</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#3f4850] hover:text-[#131b2e] rounded-lg hover:bg-[#f2f3ff] transition-colors"
              title="Notifikasi"
              aria-label="Buka notifikasi"
            >
              <Icon name="notifications" className="text-xl" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#bfc7d2]/50 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-[#131b2e]">Pemberitahuan Sistem</span>
                  <span className="text-[10px] text-[#006194] font-semibold cursor-pointer hover:underline">Tandai telah dibaca</span>
                </div>
                <div className="divide-y divide-slate-100 mt-1 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-[#f2f3ff] rounded transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#131b2e]">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#3f4850] mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-[#bfc7d2]/40 hidden sm:block"></div>

          {/* Profile Card */}
          <div
            onClick={() => onSelectModule('profil')}
            className="flex items-center gap-2.5 pl-1 py-1 pr-2 rounded-lg hover:bg-[#f2f3ff] transition-colors cursor-pointer border border-transparent hover:border-[#bfc7d2]/30"
            title="Lihat Profil Klinisi"
          >
            <img
              src={CURRENT_DOCTOR.avatar}
              alt={`Foto profil ${CURRENT_DOCTOR.name} ${CURRENT_DOCTOR.title}`}
              className="w-8 h-8 rounded-full border border-[#93ccff] object-cover flex-shrink-0"
              onError={(e) => {
                // Fallback avatar if local image not found
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden lg:block text-left">
              <p className="text-[11px] font-bold text-[#131b2e] leading-tight">{CURRENT_DOCTOR.name}</p>
              <p className="text-[10px] text-[#3f4850] leading-tight">{CURRENT_DOCTOR.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subheader Diagnostic Ribbon */}
      <div className="border-t border-[#bfc7d2]/30 bg-[#f2f3ff]/70 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center flex-wrap gap-2 text-[#3f4850]">
            <span className="font-bold text-[#131b2e]">Platform Diagnostik</span>
            <span className="text-[#bfc7d2]/60">/</span>
            <span className="text-[#006194] font-semibold">Modul: Klasifikasi Citra Endoskopi</span>
            <span className="text-[#bfc7d2]/60">•</span>
            <span className="text-[#3f4850] font-medium">MobileNetV2 (Feature Extraction & Grad-CAM)</span>
            <span className="text-[#bfc7d2]/60">•</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Status: Siap Analisis
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#dae2fd]/60 text-[11px] text-[#3f4850]">
              <Icon name="info" className="text-sm text-[#006194]" />
              <span>Aplikasi ini hanya melakukan klasifikasi citra medis, bukan mendiagnosis pasti.</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
