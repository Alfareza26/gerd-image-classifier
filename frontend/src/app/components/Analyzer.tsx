import React, { useState } from 'react';
import { Icon } from './Icon';
import { ClassProbability } from '../lib/data';

interface AnalyzerProps {
  inputImage: string;
  gradcamImage: string;
  probabilities: ClassProbability[];
  confidence: number;
  primaryResult: string;
  diagnosisNote: string;
  categoryTag?: string;
  onReset: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function Analyzer({
  inputImage,
  gradcamImage,
  probabilities,
  confidence,
  primaryResult,
  diagnosisNote,
  categoryTag = 'GERD (TANDA REFLUKS)',
  onReset,
  onSave,
  isSaving = false,
}: AnalyzerProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'blend'>('side-by-side');
  const [blendOpacity, setBlendOpacity] = useState<number>(65);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-lg border border-[#bfc7d2]/60 p-5 flex flex-col h-full shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]">
      {/* Card Header & Diagnostic Alert Pill */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eaedff] mb-4">
        <div className="flex items-center gap-2">
          <Icon name="query_stats" className="text-[#006194] text-xl" />
          <h3 className="text-[16px] font-bold text-[#131b2e]">2. Hasil Prediksi &amp; Grad-CAM</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          {categoryTag}
        </span>
      </div>

      {/* Highlight Metric Card */}
      <div className="p-3.5 rounded-lg bg-red-50/50 border border-red-200/80 mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-red-800 tracking-wider">
            Hasil Klasifikasi AI
          </p>
          <h4 className="text-[20px] font-bold text-red-700 mt-0.5 leading-snug">
            {primaryResult}
          </h4>
          <p className="text-[12px] text-red-900/80 mt-0.5 leading-relaxed">
            {diagnosisNote}
          </p>
        </div>
        <div className="text-right flex-shrink-0 pl-3">
          <p className="text-[10px] text-red-700 font-semibold uppercase tracking-wider">
            Tingkat Kepercayaan
          </p>
          <p className="text-[32px] font-extrabold text-red-700 leading-none mt-1 font-mono">
            {confidence.toFixed(1)}%
          </p>
          <span className="inline-block mt-1 text-[10px] text-red-800 font-bold bg-red-100 px-2 py-0.5 rounded">
            High Confidence
          </span>
        </div>
      </div>

      {/* Image View Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-lg">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
              viewMode === 'side-by-side' ? 'bg-white text-[#006194] shadow-sm' : 'text-[#3f4850]'
            }`}
          >
            Berdampingan
          </button>
          <button
            onClick={() => setViewMode('blend')}
            className={`px-2 py-1 text-[11px] font-bold rounded transition-colors ${
              viewMode === 'blend' ? 'bg-white text-[#006194] shadow-sm' : 'text-[#3f4850]'
            }`}
          >
            Overlay Grad-CAM
          </button>
        </div>

        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="text-[11px] font-semibold text-[#006194] hover:underline flex items-center gap-1"
        >
          <Icon name={isZoomed ? 'zoom_out' : 'zoom_in'} className="text-base" />
          <span>{isZoomed ? 'Reset Zoom' : 'Perbesar Area Z-Line'}</span>
        </button>
      </div>

      {/* Dual Side-by-Side or Overlay Comparison */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Raw Endoscopy */}
          <div className="flex flex-col gap-1.5">
            <div
              className={`relative rounded-lg overflow-hidden border border-[#bfc7d2] bg-[#131b2e] aspect-square transition-transform duration-300 ${
                isZoomed ? 'scale-105' : ''
              }`}
            >
              <img
                src={inputImage}
                alt="Gambar Asli Input Endoskopi"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/sampel-zline.jpg';
                }}
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white text-[10px] font-mono">
                Input: 224x224 RGB
              </div>
            </div>
            <p className="text-[11px] font-bold text-[#131b2e] text-center">Gambar Asli (Input)</p>
          </div>

          {/* Grad-CAM Attention Heatmap */}
          <div className="flex flex-col gap-1.5">
            <div
              className={`relative rounded-lg overflow-hidden border border-[#bfc7d2] bg-[#131b2e] aspect-square transition-transform duration-300 ${
                isZoomed ? 'scale-105' : ''
              }`}
            >
              <img
                src={gradcamImage}
                alt="Heatmap Grad-CAM Visualisasi Model"
                className="w-full h-full object-cover mix-blend-screen"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/img/gradcam-crop.jpg';
                }}
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#007bb9] text-white text-[10px] font-mono">
                Grad-CAM Feature Map
              </div>
            </div>
            <p className="text-[11px] font-bold text-[#006194] text-center">Heatmap (Grad-CAM Explainable AI)</p>
          </div>
        </div>
      ) : (
        /* Overlay Blend Mode */
        <div className="mb-4">
          <div className="relative rounded-lg overflow-hidden border border-[#bfc7d2] bg-[#131b2e] aspect-video w-full">
            <img
              src={inputImage}
              alt="Gambar Asli Input"
              className="w-full h-full object-cover absolute inset-0"
            />
            <img
              src={gradcamImage}
              alt="Grad-CAM Overlay"
              style={{ opacity: blendOpacity / 100 }}
              className="w-full h-full object-cover absolute inset-0 mix-blend-screen pointer-events-none transition-opacity"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
              Blend Overlay ({blendOpacity}%)
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 px-1">
            <span className="text-[11px] text-[#3f4850] font-semibold">Opasitas Heatmap:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={blendOpacity}
              onChange={(e) => setBlendOpacity(Number(e.target.value))}
              className="w-full h-1.5 bg-[#eaedff] rounded-lg appearance-none cursor-pointer accent-[#006194]"
            />
            <span className="text-[11px] font-mono font-bold text-[#131b2e] w-8 text-right">
              {blendOpacity}%
            </span>
          </div>
        </div>
      )}

      {/* Probability Distribution Breakdown */}
      <div className="p-3.5 rounded-lg bg-[#f2f3ff] border border-[#bfc7d2]/40 space-y-2.5">
        <p className="text-[10px] font-bold uppercase text-[#3f4850] tracking-wider">
          Detail Prediksi Probabilitas Kelas
        </p>

        {probabilities.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex justify-between text-[12px]">
              <span className={`font-semibold flex items-center gap-1.5 ${item.id === 'gerd' ? 'text-red-700 font-bold' : 'text-[#131b2e]'}`}>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.name}
              </span>
              <span
                className={`font-mono font-bold ${
                  item.id === 'gerd' ? 'text-red-700' : 'text-[#131b2e]'
                }`}
              >
                {item.probability.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.probability}%`,
                  backgroundColor: item.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions inside Analysis Card */}
      <div className="mt-4 pt-2 flex items-center gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-2 px-3 rounded-lg border border-[#bfc7d2] bg-white hover:bg-[#f2f3ff] text-[#131b2e] font-semibold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
        >
          <Icon name="refresh" className="text-base text-[#006194]" />
          <span>Analisis Gambar Lain</span>
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 py-2 px-3 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-[0.98] disabled:opacity-50"
        >
          <Icon name="save" className="text-base" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Riwayat (EHR)'}</span>
        </button>
      </div>
    </div>
  );
}

export default Analyzer;
