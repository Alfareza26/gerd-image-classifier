"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/auth";

export default function Login() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try { await signIn(String(f.get("email")), String(f.get("password"))); router.push("/analisis"); }
    catch (err) { setError(err instanceof Error ? err.message : "Gagal masuk."); setBusy(false); }
  }

  return (
    <div className="auth">
      <form className="panel stack" style={{ ["--gap" as string]: "20px" }} onSubmit={submit}>
        <div className="stack" style={{ ["--gap" as string]: "8px" }}>
          <p className="eyebrow">Masuk</p>
          <h1>Portal tenaga medis</h1>
          <p className="muted small">Masuk untuk memakai modul klasifikasi citra endoskopi.</p>
        </div>
        <div className="field"><label htmlFor="email">Email institusi</label>
          <input id="email" name="email" type="email" className="input" required autoComplete="username" placeholder="nama@rumahsakit.go.id" /></div>
        <div className="field">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <label htmlFor="password">Kata sandi</label>
            <Link href="/forgot-password" className="small">Lupa sandi?</Link>
          </div>
          <input id="password" name="password" type="password" className="input" required autoComplete="current-password" />
        </div>
        <label className="check"><input type="checkbox" name="remember" /> Ingat sesi di perangkat ini</label>
        {error && <p className="notice bad" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Memproses…" : "Masuk"}</button>
        <p className="small muted">Belum punya akun? <Link href="/register">Daftar sebagai tenaga medis</Link></p>
      </form>
    </div>
  );
}
