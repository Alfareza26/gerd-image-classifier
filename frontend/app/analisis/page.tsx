"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ResultDialog from "@/components/ResultDialog";
import { ApiError, predict } from "@/lib/api";
import { addRecord, DEFAULT_PROFILE, makeThumb, PROFILE_KEY, useStored, type HistoryRecord } from "@/lib/store";

const OK_TYPES = ["image/jpeg", "image/png", "image/bmp"];
const OK_EXTS = [".jpg", ".jpeg", ".png", ".bmp"];
const ACCEPT_ATTR = "image/jpeg,image/png,image/bmp,.jpg,.jpeg,.png,.bmp";
const MAX_MB = 10;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isValidImage(f: File) {
  const typeMatch = OK_TYPES.includes(f.type.toLowerCase());
  const nameMatch = OK_EXTS.some((ext) => f.name.toLowerCase().endsWith(ext));
  return typeMatch || nameMatch;
}

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
    if (!isValidImage(f)) return setError("Format berkas harus JPG, PNG, atau BMP.");
    if (f.size > MAX_MB * 1024 * 1024) {
      return setError(`Ukuran berkas (${formatSize(f.size)}) melebihi batas maksimal ${MAX_MB} MB.`);
    }

    if (url) URL.revokeObjectURL(url);
    setFile(f);
    setUrl(URL.createObjectURL(f));
  }

  function clearFile() {
    if (url) URL.revokeObjectURL(url);
    setFile(null);
    setUrl("");
    setError("");
    setRejected("");
    if (input.current) input.current.value = "";
  }

  async function loadSample(fileName: string, title: string) {
    setError("");
    setRejected("");
    try {
      const res = await fetch(`/img/${fileName}`);
      if (!res.ok) throw new Error("Gagal mengambil citra sampel.");
      const blob = await res.blob();
      const sampleFile = new File([blob], `${title}.jpg`, { type: "image/jpeg" });
      pick(sampleFile);
    } catch {
      setError("Citra sampel tidak dapat dimuat.");
    }
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
          <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
            <h3>1. Citra endoskopi</h3>
            <span className="small muted">JPG, PNG, BMP · Maks {MAX_MB} MB</span>
          </div>

          {url ? (
            <div className="stack" style={{ ["--gap" as string]: "12px" }}>
              <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--r-md)", background: "#000" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Pratinjau citra endoskopi" className="preview" />
              </div>
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ minWidth: 0, maxWidth: "65%" }}>
                  <div className="small mono" style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file?.name}
                  </div>
                  <span className="small muted">{file ? formatSize(file.size) : ""} · Siap dianalisis</span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: "6px 12px", minHeight: 34, fontSize: 13 }}
                    onClick={() => {
                      if (input.current) input.current.value = "";
                      input.current?.click();
                    }}
                  >
                    Ganti citra
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ padding: "6px 12px", minHeight: 34, fontSize: 13, color: "var(--danger)" }}
                    onClick={clearFile}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="stack" style={{ ["--gap" as string]: "12px" }}>
              <div
                role="button"
                tabIndex={0}
                className={`drop ${over ? "over" : ""}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  cursor: "pointer",
                  outline: "none",
                  transition: "all 0.15s ease",
                  padding: "40px 20px",
                }}
                onClick={() => {
                  if (input.current) input.current.value = "";
                  input.current?.click();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (input.current) input.current.value = "";
                    input.current?.click();
                  }
                }}
                onDragOver={(e) => { e.preventDefault(); setOver(true); }}
                onDragLeave={() => setOver(false)}
                onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files?.[0]); }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "var(--surface)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--primary)",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>Tarik citra ke sini atau klik untuk memilih berkas</p>
                  <p className="hint" style={{ marginTop: 4 }}>JPG, PNG, atau BMP · maksimal {MAX_MB} MB</p>
                </div>
              </div>
            </div>
          )}

          <input
            ref={input}
            id="image-file-input"
            type="file"
            accept={ACCEPT_ATTR}
            hidden
            onChange={(e) => {
              pick(e.target.files?.[0]);
              e.target.value = "";
            }}
            aria-label="Pilih citra endoskopi"
          />

          {rejected && (
            <div className="notice bad" role="alert" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>⚠️</span>
              <div>
                <b>Citra ditolak oleh sistem keamanan (Guard):</b>
                <p style={{ marginTop: 4 }}>{rejected}</p>
                <p className="small muted" style={{ marginTop: 6 }}>
                  Pastikan gambar yang diunggah adalah foto endoskopi esofagus/lambung asli, bukan dokumen teks, foto rontgen, atau ilustrasi.
                </p>
              </div>
            </div>
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
