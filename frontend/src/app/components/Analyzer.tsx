'use client';

import { useEffect, useState } from 'react';
import { classify, type Prediction } from '../lib/api';
import Icon from './Icon';

export default function Analyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Prediction | null>(null);

  useEffect(() => {
    if (!file) return setPreview('');
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      setResult(await classify(file));
    } catch (e) {
      setError(e instanceof Error ? `Analisis gagal: ${e.message}` : 'Analisis gagal.');
    } finally {
      setBusy(false);
    }
  }

  const isDitolak = result?.prediction === 'DITOLAK';
  const isGerd = result?.prediction === 'GERD';

  // Tentukan label yang ramah untuk ditampilkan
  function displayLabel(pred: string) {
    switch (pred) {
      case 'GERD':
        return 'GERD Terdeteksi';
      case 'GERD_Normal':
        return 'Normal (Tidak GERD)';
      case 'DITOLAK':
        return 'Gambar Ditolak';
      default:
        return pred;
    }
  }

  return (
    <div className="analyzer">
      <div className="card pane">
        <label className={`drop${preview ? ' has' : ''}`}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/bmp"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
              setError('');
            }}
          />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Pratinjau citra endoskopi yang diunggah" />
          ) : (
            <span className="drop-hint">
              <Icon name="upload" size={28} />
              <b>Pilih citra endoskopi</b>
              <small>JPG, PNG, atau BMP</small>
            </span>
          )}
        </label>
        <button className="btn btn-primary" disabled={!file || busy} onClick={run}>
          {busy ? (
            <>
              Menganalisis… <Icon name="sync" size={14} className="spin" />
            </>
          ) : (
            <>
              Analisis Citra <Icon name="arrow" size={13} />
            </>
          )}
        </button>
      </div>

      <div
        className={`card pane result${isDitolak ? ' g-ditolak' : isGerd ? ' g-gerd' : result ? ' g-normal' : ''}`}
        aria-live="polite"
      >
        {error && <p className="err">{error}</p>}
        {!error && !result && (
          <p className="muted">Hasil klasifikasi akan tampil di sini setelah citra dianalisis.</p>
        )}

        {/* Kasus DITOLAK oleh image-type gate */}
        {result && isDitolak && (
          <>
            <p className="muted">Gambar tidak lolos filter</p>
            <h3 className="verdict">{displayLabel(result.prediction)}</h3>
            <p className="reason">{result.reason}</p>
            {result.gate?.skor_non_endoscopy != null && (
              <p className="muted small">
                Skor non-endoskopi: {(result.gate.skor_non_endoscopy * 100).toFixed(1)}% (ambang:{' '}
                {((result.gate.ambang_non_endoscopy ?? 0.5) * 100).toFixed(1)}%)
              </p>
            )}
          </>
        )}

        {/* Kasus prediksi berhasil (GERD atau GERD_Normal) */}
        {result && !isDitolak && (
          <>
            <p className="muted">Hasil prediksi model</p>
            <h3 className="verdict">{displayLabel(result.prediction)}</h3>
            <span className={`tag ${isGerd ? 'tag-danger' : 'tag-safe'}`}>
              {isGerd ? 'Perlu Evaluasi Lanjut' : 'Tidak Terdeteksi GERD'}
            </span>

            {result.confidence != null && (
              <>
                <p className="conf-label">Confidence {(result.confidence * 100).toFixed(1)}%</p>
                <span className="meter">
                  <i style={{ width: `${result.confidence * 100}%` }} />
                </span>
              </>
            )}

            {result.probabilities && (
              <div className="prob-details">
                <p className="muted small">
                  P(GERD) = {(result.probabilities.GERD * 100).toFixed(2)}% &nbsp;|&nbsp; P(Normal) ={' '}
                  {(result.probabilities.GERD_Normal * 100).toFixed(2)}%
                </p>
              </div>
            )}

            <p className="muted small">{result.disclaimer}</p>
          </>
        )}
      </div>
    </div>
  );
}
