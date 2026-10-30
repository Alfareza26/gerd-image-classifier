'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ModuleBar from './components/ModuleBar';
import Workspace from './components/Workspace';
import Guide from './components/Guide';
import Footer from './components/Footer';
import Icon from './components/Icon';
import {
  CURRENT_DOCTOR,
  HISTORY_RECORDS,
  InspectionRecord,
  ModuleItem,
} from './lib/data';
import { getLocalRecords, saveLocalRecord, runInferenceSimulation } from './lib/api';

export default function Page() {
  const [activeModule, setActiveModule] = useState<ModuleItem['key']>('beranda');
  const [records, setRecords] = useState<InspectionRecord[]>(HISTORY_RECORDS);
  const [currentRecord, setCurrentRecord] = useState<InspectionRecord>(HISTORY_RECORDS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(70);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<InspectionRecord | null>(null);

  // Load records from local storage
  useEffect(() => {
    const loaded = getLocalRecords();
    setRecords(loaded);
    if (loaded.length > 0) {
      setCurrentRecord(loaded[0]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleModuleSelect = (key: ModuleItem['key']) => {
    setActiveModule(key);
    if (key === 'login') {
      setShowLoginModal(true);
    } else if (key === 'profil') {
      setShowProfileModal(true);
    } else if (key === 'upload') {
      const uploadEl = document.getElementById('workspace-section');
      uploadEl?.scrollIntoView({ behavior: 'smooth' });
    } else if (key === 'analisis') {
      handleRunInference();
    } else if (key === 'hasil') {
      const workspaceEl = document.getElementById('workspace-section');
      workspaceEl?.scrollIntoView({ behavior: 'smooth' });
    } else if (key === 'riwayat') {
      setShowDetailModal(currentRecord);
    }
  };

  const handleRunInference = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const result = await runInferenceSimulation(
        currentRecord.sampleName,
        (progress) => {
          setAnalysisProgress(progress);
        }
      );

      const updatedRecord: InspectionRecord = {
        ...currentRecord,
        category: result.category,
        confidence: result.confidence,
        probabilities: result.probabilities,
        notes: result.description,
      };

      setCurrentRecord(updatedRecord);
      showToast('Analisis citra endoskopi selesai: GERD Positif (87.6%)');
    } catch {
      showToast('Gagal memproses inferensi citra');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  };

  const handleFileUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const newRecord: InspectionRecord = {
      id: `rec-${Date.now()}`,
      code: `#GERD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Hari ini',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      category: 'GERD',
      confidence: 87.6,
      sampleName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      dimensions: '1920×1080 px',
      study: 'Endoskopi Saluran Cerna Atas (EGD)',
      notes: 'Terdeteksi erosi mukosa esofagus distal & break pada Z-line',
      thumbnail: objectUrl,
      inputImage: objectUrl,
      gradcamImage: '/img/gradcam.jpg',
      probabilities: [
        { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 87.6, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
        { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 8.7, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
        { id: '3', name: 'Polyp / Suspek Adenoma', probability: 2.1, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
        { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 1.6, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
      ],
    };

    setCurrentRecord(newRecord);
    showToast(`Citra ${file.name} berhasil diunggah dan divalidasi`);
    handleRunInference();
  };

  const handleSaveRecord = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updated = saveLocalRecord(currentRecord);
      setRecords(updated);
      setIsSaving(false);
      showToast(`Pemeriksaan ${currentRecord.code} berhasil disimpan ke EHR rumah sakit`);
    }, 600);
  };

  const handleResetAnalysis = () => {
    // Reset to base endoscopy sample
    setCurrentRecord(HISTORY_RECORDS[0]);
    showToast('Tampilan kembali ke sampel awal');
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col">
      {/* Top Navigation */}
      <Header
        activeModule={activeModule}
        onSelectModule={handleModuleSelect}
        onStartAnalysis={() => {
          handleModuleSelect('upload');
          handleRunInference();
        }}
      />

      {/* Main Workspace Canvas */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 flex-1">
        {/* Hero Clinical Banner */}
        <Hero onNavigate={handleModuleSelect} />

        {/* 7 Modules Wireframe Bar */}
        <ModuleBar
          activeModule={activeModule}
          onSelectModule={handleModuleSelect}
        />

        {/* 3-Column Clinical Diagnostic Workspace */}
        <div id="workspace-section">
          <Workspace
            currentRecord={currentRecord}
            records={records}
            onSelectRecord={(rec) => {
              setCurrentRecord(rec);
              setShowDetailModal(rec);
            }}
            onRunInference={handleRunInference}
            isAnalyzing={isAnalyzing}
            analysisProgress={analysisProgress}
            onFileUpload={handleFileUpload}
            onResetAnalysis={handleResetAnalysis}
            onSaveRecord={handleSaveRecord}
            isSaving={isSaving}
          />
        </div>

        {/* Clinical Workflow & Guide Table */}
        <Guide onTriggerAction={(act) => showToast(`Menjalankan aksi: ${act}`)} />

        {/* Footer */}
        <Footer />
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl text-[12px] flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Icon name="check_circle" className="text-emerald-400 text-base" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal: Login / Masuk (Module 1) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#cce5ff] text-[#006194] flex items-center justify-center">
                  <Icon name="account_circle" className="text-xl" />
                </div>
                <h3 className="text-[16px] font-bold text-[#131b2e]">Autentikasi Klinisi Medis</h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>

            <p className="text-[12px] text-[#3f4850] mt-3">
              Masuk dengan akun terdaftar di Sistem Informasi Rumah Sakit (SIMRS) atau kredensial Kemenkes.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowLoginModal(false);
                showToast(`Login berhasil sebagai ${CURRENT_DOCTOR.name}`);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="text-[11px] font-bold text-[#131b2e] block mb-1">
                  Nomor Induk / SIP Dokter
                </label>
                <input
                  type="text"
                  defaultValue={CURRENT_DOCTOR.licenseNumber}
                  className="w-full text-[12px] px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#006194] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#131b2e] block mb-1">
                  Email Klinis
                </label>
                <input
                  type="email"
                  defaultValue={CURRENT_DOCTOR.email}
                  className="w-full text-[12px] px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#006194]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="px-3.5 py-2 text-[12px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-[12px] font-bold text-white bg-[#006194] hover:bg-[#007bb9] rounded-lg shadow-sm"
                >
                  Masuk ke Sistem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Profil Pengguna (Module 7) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#cce5ff] text-[#006194] flex items-center justify-center">
                  <Icon name="person" className="text-xl" />
                </div>
                <h3 className="text-[16px] font-bold text-[#131b2e]">Profil Klinisi Pengguna</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>

            <div className="mt-4 flex items-start gap-4 p-4 rounded-lg bg-[#f2f3ff] border border-slate-200">
              <img
                src={CURRENT_DOCTOR.avatar}
                alt={CURRENT_DOCTOR.name}
                className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover"
              />
              <div>
                <h4 className="text-[15px] font-bold text-[#131b2e]">{CURRENT_DOCTOR.name}</h4>
                <p className="text-[12px] font-semibold text-[#006194]">{CURRENT_DOCTOR.title}</p>
                <p className="text-[11px] text-[#3f4850] mt-0.5">{CURRENT_DOCTOR.hospital}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">{CURRENT_DOCTOR.licenseNumber}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-[12px]">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Unit Spesialisasi:</span>
                <span className="font-semibold text-[#131b2e]">{CURRENT_DOCTOR.department}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Otorisasi Model AI:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                  Full Access (Inference &amp; EHR)
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Versi Klasifikasi:</span>
                <span className="font-mono text-[#131b2e]">MobileNetV2 v2.4 (Lyon 2.0)</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  showToast('Anda telah logout dari sesi');
                }}
                className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 text-[11px] font-bold flex items-center gap-1.5"
              >
                <Icon name="logout" className="text-sm" />
                <span>Logout Sesi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  showToast('Data profil klinisi telah diperbarui');
                }}
                className="px-4 py-1.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-[11px] font-bold"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detail Riwayat Rekap (Module 6) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#cce5ff] text-[#006194] flex items-center justify-center">
                  <Icon name="history" className="text-xl" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#131b2e]">
                    Rekap Pemeriksaan {showDetailModal.code}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Waktu inferensi: {showDetailModal.date} • {showDetailModal.time}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <Icon name="close" className="text-lg" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-600 mb-1">Citra Endoskopi Input</p>
                <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                  <img
                    src={showDetailModal.inputImage}
                    alt={showDetailModal.sampleName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#006194] mb-1">Peta Aktivasi Grad-CAM</p>
                <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                  <img
                    src={showDetailModal.gradcamImage}
                    alt="Grad-CAM"
                    className="w-full h-full object-cover mix-blend-screen"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-lg bg-[#f2f3ff] border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#131b2e]">Diagnosis Probabilitas AI:</span>
                <span className="text-[12px] font-mono font-bold text-red-700">
                  {showDetailModal.category} ({showDetailModal.confidence.toFixed(1)}%)
                </span>
              </div>
              <p className="text-[12px] text-[#3f4850]">{showDetailModal.notes}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1.5"
              >
                <Icon name="print" className="text-sm" />
                <span>Cetak Rekap Medis</span>
              </button>
              <button
                onClick={() => {
                  setCurrentRecord(showDetailModal);
                  setShowDetailModal(null);
                  showToast(`Sampel ${showDetailModal.code} dimuat ke workspace utama`);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-[11px] font-bold"
              >
                Muat ke Analisis Aktif
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
