"use client";
import { useEffect, useRef } from "react";
import type { HistoryRecord } from "@/lib/store";

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

type Props = { record: HistoryRecord; threshold: number; onClose: () => void; onSave?: () => void };

export default function ResultDialog({ record, threshold, onClose, onSave }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  const gerd = record.label === "GERD";
  const low = record.confidence * 100 < threshold;

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="dlg-title">
      <div className="dlg-body">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <p className="eyebrow" id="dlg-title">Hasil klasifikasi</p>
          <span className="small muted mono">{record.patientId} · {record.age} th · {record.sex}</span>
        </div>
        <div>
          <p className="result-label" style={{ color: gerd ? "var(--warn)" : "var(--ok)" }}>{gerd ? "GERD" : "Normal"}</p>
          <p className="muted small">Berkas {record.file}</p>
        </div>
        <div className="stack" style={{ ["--gap" as string]: "8px" }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="label">Tingkat keyakinan model</span>
            <span className="mono">{pct(record.confidence)}</span>
          </div>
          <div className={`bar ${gerd ? "warn" : ""}`}><i style={{ width: pct(record.confidence) }} /></div>
          <p className="hint">Ambang batas Anda: {threshold}%</p>
        </div>
        {record.probabilities && (
          <div className="stack" style={{ ["--gap" as string]: "10px" }}>
            <span className="label">Probabilitas per kelas</span>
            {Object.entries(record.probabilities).map(([k, v]) => (
              <div key={k}>
                <div className="row small" style={{ justifyContent: "space-between" }}><span>{k}</span><span className="mono">{pct(v)}</span></div>
                <div className="bar"><i style={{ width: pct(v) }} /></div>
              </div>
            ))}
          </div>
        )}
        {low && <p className="notice warn">Keyakinan di bawah ambang batas {threshold}%. Tinjau citra secara manual sebelum mengambil keputusan.</p>}
        <p className="small muted">Hasil ini keluaran model untuk membantu penyaringan, bukan diagnosis mandiri. Keputusan terapi ada pada dokter spesialis.</p>
      </div>
      <div className="dlg-foot no-print">
        <button className="btn btn-ghost" onClick={() => ref.current?.close()}>Tutup</button>
        <button className="btn btn-ghost" onClick={() => window.print()}>Cetak</button>
        {onSave && <button className="btn btn-primary" onClick={onSave}>Simpan ke riwayat</button>}
      </div>
    </dialog>
  );
}
