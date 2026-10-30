import React, { useRef, useState } from 'react';
import { Icon } from './Icon';
import { Analyzer } from './Analyzer';
import { InspectionRecord, ClassProbability } from '../lib/data';

interface WorkspaceProps {
  currentRecord: InspectionRecord;
  records: InspectionRecord[];
  onSelectRecord: (record: InspectionRecord) => void;
  onRunInference: () => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  onFileUpload: (file: File) => void;
  onResetAnalysis: () => void;
  onSaveRecord: () => void;
  isSaving: boolean;
}

export function Workspace({
  currentRecord,
  records,
  onSelectRecord,
  onRunInference,
  isAnalyzing,
  analysisProgress,
  onFileUpload,
  onResetAnalysis,
  onSaveRecord,
  isSaving,
}: WorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const displayedRecords = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ============================================== */}
      {/* COLUMN 1: UNGGAH & VALIDASI CITRA (4 COLS)     */}
      {/* ============================================== */}
      <section className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-white rounded-lg border border-[#bfc7d2]/60 p-5 flex flex-col h-full shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff] mb-4">
            <div className="flex items-center gap-2">
              <Icon name="add_photo_alternate" className="text-[#006194] text-xl" />
              <h3 className="text-[16px] font-bold text-[#131b2e]">1. Unggah Citra Endoskopi</h3>
            </div>
            <span className="text-[10px] bg-[#e2e7ff] px-2 py-0.5 rounded text-[#3f4850] font-bold uppercase tracking-wider">
              Step 1-3
            </span>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />

          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#bfc7d2] hover:border-[#006194] rounded-lg p-5 flex flex-col items-center justify-center text-center bg-[#faf8ff] hover:bg-[#f2f3ff]/60 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-[#cce5ff] flex items-center justify-center text-[#006194] group-hover:scale-105 transition-transform mb-3 shadow-xs">
              <Icon name="cloud_upload" className="text-2xl" />
            </div>
            <p className="text-[13px] text-[#131b2e] font-bold">Tarik dan lepas gambar di sini</p>
            <p className="text-[12px] text-[#3f4850] mt-0.5">atau klik untuk memilih dari direktori lokal</p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#707881]">
              <span className="px-2 py-0.5 rounded bg-[#eaedff] font-mono font-bold">JPG</span>
              <span className="px-2 py-0.5 rounded bg-[#eaedff] font-mono font-bold">JPEG</span>
              <span className="px-2 py-0.5 rounded bg-[#eaedff] font-mono font-bold">PNG</span>
              <span className="font-medium">Maksimal 10 MB</span>
            </div>
            <button
              type="button"
              className="mt-3 px-4 py-1.5 rounded-lg border border-[#707881] bg-white hover:bg-[#f2f3ff] text-[#131b2e] text-[11px] font-semibold transition-colors pointer-events-none"
            >
              Pilih File Endoskopi
            </button>
          </div>

          {/* Preset Clinical Samples for fast switching */}
          <div className="mt-3 flex items-center justify-between text-[11px] px-1">
            <span className="text-[#3f4850] font-medium">Contoh Citra:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRecord(records[0]);
                }}
                className="px-2 py-0.5 rounded bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#006194] font-semibold text-[10px]"
              >
                Esofagitis
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (records[1]) onSelectRecord(records[1]);
                }}
                className="px-2 py-0.5 rounded bg-[#f2f3ff] hover:bg-[#e2e7ff] text-emerald-700 font-semibold text-[10px]"
              >
                Normal
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (records[2]) onSelectRecord(records[2]);
                }}
                className="px-2 py-0.5 rounded bg-[#f2f3ff] hover:bg-[#e2e7ff] text-amber-700 font-semibold text-[10px]"
              >
                Polip
              </button>
            </div>
          </div>

          {/* File Active Inspection Card */}
          <div className="mt-3 p-3.5 rounded-lg bg-[#f2f3ff] border border-[#bfc7d2]/50">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] uppercase font-bold text-[#3f4850] tracking-wider">
                Pratinjau Citra Aktif
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                <Icon name="check_circle" className="text-xs" />
                Valid
              </span>
            </div>

            <div className="flex gap-3">
              <img
                src={currentRecord.thumbnail || currentRecord.inputImage}
                alt="endoscopy_zline_sample_001"
                className="w-20 h-20 rounded border border-[#bfc7d2]/60 object-cover flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/sampel-zline.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-[#131b2e] truncate">
                  {currentRecord.sampleName}
                </p>
                <p className="text-[12px] text-[#3f4850] font-mono mt-0.5">
                  {currentRecord.fileSize} • {currentRecord.dimensions}
                </p>
                <p className="text-[10px] text-[#3f4850] mt-1 line-clamp-2">
                  Studi: {currentRecord.study}
                </p>
              </div>
            </div>

            {/* Pipeline Validation Step Checklist */}
            <div className="mt-3 pt-3 border-t border-[#bfc7d2]/30 space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-[#131b2e]">
                  <Icon name="check" className="text-emerald-600 text-sm font-bold" />
                  Validasi format &amp; integritas bit citra
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">OK</span>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-[#131b2e]">
                  <Icon name="check" className="text-emerald-600 text-sm font-bold" />
                  Preprocessing (Resize 224x224 &amp; Normalisasi)
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">OK</span>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-[#006194] font-semibold">
                  <Icon
                    name="sync"
                    className={`text-[#006194] text-sm ${isAnalyzing ? 'animate-spin' : ''}`}
                  />
                  Ekstraksi fitur &amp; klasifikasi MobileNetV2
                </span>
                <span className="text-[10px] text-[#006194] font-bold font-mono">
                  {isAnalyzing ? `${analysisProgress}%` : '100%'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#e2e7ff] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#006194] h-full rounded-full transition-all duration-300"
                style={{ width: `${isAnalyzing ? analysisProgress : 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-2">
            <button
              onClick={onRunInference}
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              <span>{isAnalyzing ? 'Sedang Memproses Model...' : 'Lanjut ke Analisis Model AI'}</span>
              <Icon name="arrow_forward" className="text-base" />
            </button>
            <p className="text-center text-[10px] text-[#3f4850] mt-2">
              Waktu inferensi: ~1.2 detik pada GPU akselerator klinis
            </p>
          </div>
        </div>
      </section>

      {/* ============================================== */}
      {/* COLUMN 2: HASIL ANALISIS & GRAD-CAM (5 COLS)   */}
      {/* ============================================== */}
      <section className="lg:col-span-5 flex flex-col gap-4">
        <Analyzer
          inputImage={currentRecord.inputImage}
          gradcamImage={currentRecord.gradcamImage}
          probabilities={currentRecord.probabilities}
          confidence={currentRecord.confidence}
          primaryResult={
            currentRecord.category === 'GERD'
              ? 'GERD Positif (Esofagitis Refluks)'
              : currentRecord.category === 'Normal'
              ? 'GERD Negatif (Mukosa Normal)'
              : currentRecord.category === 'Polyp'
              ? 'Suspek Polip Esofagogastrik'
              : 'Gastritis Eritematosa'
          }
          diagnosisNote={currentRecord.notes}
          categoryTag={
            currentRecord.category === 'GERD'
              ? 'GERD (TANDA REFLUKS)'
              : currentRecord.category === 'Normal'
              ? 'MUKOSA NORMAL (NERD/SEHAT)'
              : 'TEMUAN LESI (SUSPEK POLIP)'
          }
          onReset={onResetAnalysis}
          onSave={onSaveRecord}
          isSaving={isSaving}
        />
      </section>

      {/* ============================================== */}
      {/* COLUMN 3: RIWAYAT PEMERIKSAAN & REKAP (3 COLS) */}
      {/* ============================================== */}
      <section className="lg:col-span-3 flex flex-col gap-4">
        <div className="bg-white rounded-lg border border-[#bfc7d2]/60 p-5 flex flex-col h-full shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#eaedff] mb-3">
            <div className="flex items-center gap-2">
              <Icon name="history" className="text-[#006194] text-xl" />
              <h3 className="text-[16px] font-bold text-[#131b2e]">Riwayat Analisis</h3>
            </div>
            <button
              onClick={() => setCurrentPage(1)}
              className="text-[#006194] text-[10px] font-bold hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <p className="text-[12px] text-[#3f4850] mb-3">
            Daftar hasil inferensi citra pasien terkini yang telah dievaluasi oleh sistem:
          </p>

          {/* History List */}
          <div className="flex flex-col gap-2.5">
            {displayedRecords.map((item) => {
              const isSelected = item.code === currentRecord.code;
              const badgeClass =
                item.category === 'GERD'
                  ? 'text-red-700 bg-red-50 border-red-200'
                  : item.category === 'Normal'
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : item.category === 'Polyp'
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                  : 'text-slate-700 bg-slate-50 border-slate-200';

              return (
                <div
                  key={item.code}
                  onClick={() => onSelectRecord(item)}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#006194] bg-[#f2f3ff]'
                      : 'border-[#bfc7d2]/60 bg-[#faf8ff] hover:bg-[#f2f3ff]/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.thumbnail}
                      alt={item.code}
                      className="w-10 h-10 rounded border border-[#bfc7d2] object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/img/sampel-zline.jpg';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#131b2e]">{item.code}</p>
                      <p className="text-[10px] text-[#3f4850]">
                        {item.date} • {item.time}
                      </p>
                      <span
                        className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeClass}`}
                      >
                        {item.category} ({item.confidence.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <button
                    className="p-1 text-[#3f4850] hover:text-[#006194] transition-colors"
                    title="Detail"
                    aria-label={`Lihat detail ${item.code}`}
                  >
                    <Icon name="chevron_right" className="text-lg" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination Micro Widget */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#eaedff]">
            <span className="text-[10px] text-[#3f4850]">
              Hal {currentPage} dari {totalPages || 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded border border-[#bfc7d2] bg-white flex items-center justify-center text-[#131b2e] disabled:opacity-40 hover:bg-[#f2f3ff] transition-colors"
                title="Halaman Sebelumnya"
              >
                <Icon name="chevron_left" className="text-sm" />
              </button>

              {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).slice(0, 3).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded text-[10px] font-bold flex items-center justify-center transition-colors ${
                    currentPage === page
                      ? 'bg-[#006194] text-white'
                      : 'border border-[#bfc7d2] bg-white hover:bg-[#f2f3ff] text-[#131b2e]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded border border-[#bfc7d2] bg-white flex items-center justify-center text-[#131b2e] disabled:opacity-40 hover:bg-[#f2f3ff] transition-colors"
                title="Halaman Berikutnya"
              >
                <Icon name="chevron_right" className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Workspace;
