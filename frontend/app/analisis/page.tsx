"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ResultDialog from "@/components/ResultDialog";
import { ApiError, predict } from "@/lib/api";
import { addRecord, DEFAULT_PROFILE, makeThumb, PROFILE_KEY, useStored, type HistoryRecord } from "@/lib/store";

const OK_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 10;

export default function Analisis() {
  const [profile] = useStored(PROFILE_KEY, DEFAULT_PROFILE);
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rejected, setRejected] = useState("");
  const [record, setRecord] = useState<HistoryRecord | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  function pick(f?: File) {
    if (!f) return;
    setError(""); setRejected(""); setSaved(false);
    if (!OK_TYPES.includes(f.type)) return setError("Format harus JPG, PNG, atau WEBP.");
    if (f.size > MAX_MB * 1024 * 1024) return setError(`Ukuran berkas melebihi ${MAX_MB} MB.`);
    setFile(f); setUrl(URL.createObjectURL(f));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return setError("Pilih citra endoskopi terlebih dahulu.");
    const f = new FormData(e.currentTarget);
    setBusy(true); setError(""); setRejected(""); setSaved(false);
    try {
      const [p, thumb] = await Promise.all([predict(file), makeThumb(file)]);
      setRecord({
        id: crypto.randomUUID(), patientId: String(f.get("patientId")), age: Number(f.get("age")),
        sex: String(f.get("sex")), notes: String(f.get("notes") || ""), at: new Date().toISOString(),
        file: file.name, thumb, label: p.label, confidence: p.confidence, probabilities: p.probabilities,
      });
    } catch (err) {
      // 4xx dari backend berarti gerbang/guard menolak citra; selain itu masalah koneksi atau server.
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) setRejected(err.message);
      else setError(err instanceof Error ? err.message : "Analisis gagal.");
    }
    setBusy(false);
  }

  function save() { if (record) { addRecord(record); setSaved(true); setRecord(null); } }

  return (
    <div className="wrap" style={{ padding: "48px var(--pad) 80px" }}>
      <p className="eyebrow">Modul analisis</p>
      <h1 style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: 12 }}>Analisis citra medis</h1>
      <p className="muted" style={{ marginTop: 12, maxWidth: "60ch" }}>Unggah citra endoskopi esofagus. Model akan mengklasifikasikannya sebagai GERD atau Normal.</p>

      <form className="grid-2" style={{ marginTop: 40 }} onSubmit={submit}>
        <section className="panel stack" style={{ ["--gap" as string]: "16px" }}>
          <h3>1. Citra endoskopi</h3>
          {url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Pratinjau citra endoskopi" className="preview" />
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="small muted mono">{file?.name} · {(file!.size / 1048576).toFixed(1)} MB</span>
                <button type="button" className="btn btn-ghost" onClick={() => input.current?.click()}>Ganti citra</button>
              </div>
            </>
          ) : (
            <label className={`drop ${over ? "over" : ""}`} onDragOver={(e) => { e.preventDefault(); setOver(true); }}
              onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]); }}>
              <p style={{ fontWeight: 600 }}>Tarik citra ke sini atau klik untuk memilih berkas</p>
              <p className="hint" style={{ marginTop: 6 }}>JPG, PNG, atau WEBP · maksimal {MAX_MB} MB</p>
            </label>
          )}
          <input ref={input} type="file" accept={OK_TYPES.join(",")} hidden onChange={(e) => pick(e.target.files?.[0])} aria-label="Pilih citra" />
          {rejected && (
            <div className="notice bad" role="alert"><b>Citra ditolak.</b> {rejected}</div>
          )}
        </section>

        <section className="panel stack" style={{ ["--gap" as string]: "16px" }}>
          <h3>2. Informasi pasien</h3>
          <div className="field"><label htmlFor="patientId">ID pasien anonim *</label>
            <input id="patientId" name="patientId" className="input" required placeholder="PS-8821" />
            <span className="hint">Pakai kode anonim, bukan nama pasien.</span></div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="field"><label htmlFor="age">Usia (tahun) *</label>
              <input id="age" name="age" type="number" min={1} max={120} className="input" required /></div>
            <div className="field"><span className="label">Jenis kelamin *</span>
              <div className="seg">
                {["Laki-laki", "Perempuan", "Tidak disebut"].map((s, i) => (
                  <label key={s}><input type="radio" name="sex" value={s} required defaultChecked={i === 0} />{s}</label>
                ))}
              </div></div>
          </div>
          <div className="field"><label htmlFor="notes">Keluhan atau indikasi klinis (opsional)</label>
            <textarea id="notes" name="notes" className="textarea" /></div>
          {error && <p className="notice bad" role="alert">{error}</p>}
          {saved && <p className="notice good" role="status">Tersimpan. <Link href="/riwayat">Lihat riwayat</Link></p>}
          <button className="btn btn-primary" disabled={busy || !file}>{busy ? "Menganalisis…" : "Mulai analisis"}</button>
        </section>
      </form>

      <p className="notice warn" style={{ marginTop: 32 }}>
        <b>Batas tanggung jawab klinis.</b> Hasil klasifikasi membantu dokter menyaring kasus dan bukan diagnosis mandiri. Keputusan terapi ditetapkan oleh dokter spesialis gastroenterologi.
      </p>

      {record && <ResultDialog record={record} threshold={profile.threshold} onClose={() => setRecord(null)} onSave={save} />}
    </div>
  );
}
