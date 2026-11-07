"use client";
import Link from "next/link";
import { useState } from "react";
import { requestReset } from "@/lib/auth";

export default function Forgot() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try { await requestReset(String(f.get("id")), String(f.get("method"))); setSent(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Permintaan gagal."); }
    setBusy(false);
  }

  return (
    <div className="auth">
      <form className="panel stack" style={{ ["--gap" as string]: "20px" }} onSubmit={submit}>
        <div className="stack" style={{ ["--gap" as string]: "8px" }}>
          <p className="eyebrow">Pemulihan akun</p>
          <h1>Atur ulang kata sandi</h1>
          <p className="muted small">Masukkan email institusi atau ID dokter yang terdaftar.</p>
        </div>
        <div className="field"><label htmlFor="id">Email institusi atau ID dokter</label>
          <input id="id" name="id" className="input" required placeholder="dokter@rumahsakit.go.id" /></div>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }} className="stack">
          <legend className="label" style={{ marginBottom: 8 }}>Metode verifikasi</legend>
          <div className="seg">
            <label><input type="radio" name="method" value="email" defaultChecked />Token via email</label>
            <label><input type="radio" name="method" value="totp" />Kode autentikator</label>
          </div>
        </fieldset>
        {sent && <p className="notice good" role="status">Permintaan terkirim. Periksa kotak masuk Anda.</p>}
        {error && <p className="notice bad" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Memproses…" : "Kirim tautan pemulihan"}</button>
        <Link href="/login" className="small">Kembali ke halaman masuk</Link>
      </form>
    </div>
  );
}
