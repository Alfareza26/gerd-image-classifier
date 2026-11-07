/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import ResultDialog from "@/components/ResultDialog";
import { DEFAULT_PROFILE, HISTORY_KEY, PROFILE_KEY, useStored, type HistoryRecord } from "@/lib/store";

const PER_PAGE = 5;
type Filter = "all" | "GERD" | "Normal";

export default function Riwayat() {
  const [rows, , ready] = useStored<HistoryRecord[]>(HISTORY_KEY, []);
  const [profile] = useStored(PROFILE_KEY, DEFAULT_PROFILE);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<HistoryRecord | null>(null);

  const gerd = rows.filter((r) => r.label === "GERD").length;
  const shown = useMemo(
    () => rows.filter((r) => (filter === "all" || r.label === filter) && r.patientId.toLowerCase().includes(q.trim().toLowerCase())),
    [rows, filter, q],
  );
  const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = shown.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const share = (n: number) => (rows.length ? `${((n / rows.length) * 100).toFixed(1)}%` : "0%");

  function exportCsv() {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, "\"\"")}"`;
    const lines = [["id_pasien", "waktu", "usia", "jk", "berkas", "label", "keyakinan"].join(",")].concat(
      shown.map((r) => [r.patientId, r.at, r.age, r.sex, r.file, r.label, r.confidence.toFixed(4)].map(esc).join(",")),
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    a.download = "riwayat-analisis.csv"; a.click(); URL.revokeObjectURL(a.href);
  }

  const chip = (f: Filter, label: string, n: number) => (
    <button key={f} className="chip" aria-pressed={filter === f} onClick={() => { setFilter(f); setPage(1); }}>{label} ({n})</button>
  );

  return (
    <div className="wrap" style={{ padding: "48px var(--pad) 80px" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p className="eyebrow">Arsip pemeriksaan</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: 12 }}>Riwayat analisis</h1>
          <p className="muted" style={{ marginTop: 12 }}>Hasil yang Anda simpan dari modul analisis, tersimpan di browser ini.</p>
        </div>
        <div className="row no-print">
          <button className="btn btn-ghost" onClick={exportCsv} disabled={!shown.length}>Ekspor CSV</button>
          <button className="btn btn-ghost" onClick={() => window.print()}>Cetak</button>
          <Link href="/analisis" className="btn btn-primary">+ Analisis baru</Link>
        </div>
      </div>

      <div className="stats" style={{ marginTop: 32 }}>
        <div className="panel"><span className="label muted">Total analisis</span><b>{rows.length}</b></div>
        <div className="panel"><span className="label muted">Prediksi GERD</span><b style={{ color: "var(--warn)" }}>{gerd}</b><span className="small muted">{share(gerd)} dari total</span></div>
        <div className="panel"><span className="label muted">Prediksi Normal</span><b style={{ color: "var(--ok)" }}>{rows.length - gerd}</b><span className="small muted">{share(rows.length - gerd)} dari total</span></div>
      </div>

      <div className="row no-print" style={{ margin: "32px 0 16px", justifyContent: "space-between" }}>
        <div className="chips">{chip("all", "Semua", rows.length)}{chip("GERD", "GERD", gerd)}{chip("Normal", "Normal", rows.length - gerd)}</div>
        <input className="input" style={{ maxWidth: 260 }} placeholder="Cari ID pasien" aria-label="Cari ID pasien" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>ID pasien</th><th>Waktu</th><th>Citra</th><th>Hasil</th><th>Keyakinan</th><th className="no-print" /></tr></thead>
          <tbody>
            {slice.map((r) => (
              <tr key={r.id}>
                <td><b>{r.patientId}</b><div className="small muted">{r.sex} · {r.age} th</div></td>
                <td>{new Date(r.at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  <div className="small muted">{new Date(r.at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</div></td>
                <td>{r.thumb ? <img className="thumb" src={r.thumb} alt="" /> : <span className="muted">-</span>}
                  <div className="small muted mono">{r.file}</div></td>
                <td><span className={`badge ${r.label === "GERD" ? "gerd" : "normal"}`}>{r.label}</span></td>
                <td className="mono">{(r.confidence * 100).toFixed(1)}%</td>
                <td className="no-print"><button className="btn btn-ghost" onClick={() => setOpen(r)}>Detail</button></td>
              </tr>
            ))}
            {ready && !slice.length && (
              <tr><td colSpan={6} className="muted" style={{ padding: 40, textAlign: "center" }}>
                {rows.length ? "Tidak ada hasil yang cocok." : <>Belum ada riwayat. <Link href="/analisis">Mulai analisis pertama</Link>.</>}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="row no-print" style={{ justifyContent: "space-between", marginTop: 16 }}>
        <span className="small muted">Menampilkan {slice.length} dari {shown.length} rekam analisis</span>
        <div className="row">
          <button className="btn btn-ghost" disabled={current <= 1} onClick={() => setPage(current - 1)}>Sebelumnya</button>
          <span className="small muted">{current} / {pages}</span>
          <button className="btn btn-ghost" disabled={current >= pages} onClick={() => setPage(current + 1)}>Berikutnya</button>
        </div>
      </div>

      {open && <ResultDialog record={open} threshold={profile.threshold} onClose={() => setOpen(null)} />}
    </div>
  );
}
