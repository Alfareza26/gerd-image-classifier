"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { passwordStrength, register } from "@/lib/auth";

export default function Register() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const s = passwordStrength(pw);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (s.score < 4) return setError("Kata sandi harus minimal 8 karakter dengan huruf kapital, angka, dan simbol.");
    if (pw !== pw2) return setError("Konfirmasi kata sandi tidak sama.");
    setBusy(true); setError("");
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
      delete data.password; delete data.confirm;
      await register(data);
      router.push("/login");
    } catch (err) { setError(err instanceof Error ? err.message : "Registrasi gagal."); setBusy(false); }
  }

  const text = (id: string, label: string, ph: string, req = true, type = "text") => (
    <div className="field"><label htmlFor={id}>{label}{req && " *"}</label>
      <input id={id} name={id} type={type} className="input" required={req} placeholder={ph} /></div>
  );

  return (
    <div className="auth">
      <form className="panel stack" style={{ ["--gap" as string]: "18px", maxWidth: 560 }} onSubmit={submit}>
        <div className="stack" style={{ ["--gap" as string]: "8px" }}>
          <p className="eyebrow">Pendaftaran</p>
          <h1>Registrasi tenaga medis</h1>
          <p className="muted small">Akun untuk dokter spesialis dan residen yang memakai modul klasifikasi.</p>
        </div>
        {text("name", "Nama lengkap dan gelar", "dr. Budi Santoso, Sp.PD-KGEH")}
        <div className="grid-2" style={{ gap: 16 }}>
          {text("str", "Nomor STR", "16 digit nomor STR")}
          {text("npa", "NPA IDI", "110482", false)}
        </div>
        {text("institution", "Fasilitas layanan kesehatan", "Nama rumah sakit atau klinik")}
        {text("email", "Email institusi", "dokter@rumahsakit.go.id", true, "email")}
        <div className="field"><label htmlFor="password">Kata sandi *</label>
          <input id="password" name="password" type="password" className="input" required autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <div className="bar" aria-hidden><i style={{ width: `${s.score * 25}%` }} /></div>
          <span className="hint">{pw ? s.label : "Minimal 8 karakter dengan huruf kapital, angka, dan simbol."}</span></div>
        <div className="field"><label htmlFor="confirm">Konfirmasi kata sandi *</label>
          <input id="confirm" name="confirm" type="password" className="input" required autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        <label className="check"><input type="checkbox" required /> Saya menyetujui kerahasiaan data pasien sesuai UU PDP No. 27/2022.</label>
        {error && <p className="notice bad" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Memproses…" : "Ajukan registrasi"}</button>
        <p className="small muted">Sudah punya akun? <Link href="/login">Masuk</Link></p>
      </form>
    </div>
  );
}
