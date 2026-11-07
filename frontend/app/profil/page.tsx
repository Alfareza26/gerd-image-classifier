"use client";
import { useEffect, useState } from "react";
import { DEFAULT_PROFILE, PROFILE_KEY, useStored, type Profile } from "@/lib/store";

const presets = [[50, "Sensitivitas tinggi"], [85, "Rekomendasi"], [98, "Spesifisitas maksimal"]] as const;

export default function Profil() {
  const [saved, setSaved, ready] = useStored<Profile>(PROFILE_KEY, DEFAULT_PROFILE);
  const [form, setForm] = useState<Profile>(DEFAULT_PROFILE);
  const [ok, setOk] = useState(false);
  useEffect(() => { if (ready) setForm(saved); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const bind = (k: keyof Profile) => ({
    id: k, value: String(form[k]),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => { setOk(false); setForm({ ...form, [k]: e.target.value }); },
  });

  function submit(e: React.FormEvent) { e.preventDefault(); setSaved({ ...form, threshold: Number(form.threshold) }); setOk(true); }

  return (
    <div className="wrap" style={{ padding: "48px var(--pad) 80px", maxWidth: 820 }}>
      <p className="eyebrow">Akun</p>
      <h1 style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: 12 }}>Profil pengguna</h1>

      <form className="stack" style={{ ["--gap" as string]: "24px", marginTop: 32 }} onSubmit={submit}>
        <section className="panel stack" style={{ ["--gap" as string]: "16px" }}>
          <h3>Informasi pribadi</h3>
          <div className="field"><label htmlFor="name">Nama lengkap dan gelar</label><input className="input" {...bind("name")} /></div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="field"><label htmlFor="email">Email institusi</label><input type="email" className="input" {...bind("email")} /></div>
            <div className="field"><label htmlFor="phone">Nomor telepon</label><input type="tel" className="input" {...bind("phone")} /></div>
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="field"><label htmlFor="institution">Institusi</label><input className="input" {...bind("institution")} /></div>
            <div className="field"><label htmlFor="role">Peran</label><input className="input" {...bind("role")} /></div>
          </div>
        </section>

        <section className="panel stack" style={{ ["--gap" as string]: "16px" }}>
          <h3>Ambang batas keyakinan</h3>
          <p className="muted small">Hasil dengan keyakinan di bawah angka ini diberi peringatan agar Anda meninjau citra secara manual.</p>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <label htmlFor="threshold" className="label">Ambang batas</label>
            <span className="mono" style={{ color: "var(--primary)", fontWeight: 700 }}>{form.threshold}%</span>
          </div>
          <input id="threshold" type="range" min={50} max={98} value={form.threshold} style={{ accentColor: "var(--primary)", width: "100%" }}
            onChange={(e) => { setOk(false); setForm({ ...form, threshold: Number(e.target.value) }); }} />
          <div className="chips">
            {presets.map(([v, l]) => (
              <button type="button" key={v} className="chip" aria-pressed={Number(form.threshold) === v} onClick={() => { setOk(false); setForm({ ...form, threshold: v }); }}>{v}% · {l}</button>
            ))}
          </div>
        </section>

        {ok && <p className="notice good" role="status">Perubahan tersimpan di browser ini.</p>}
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-ghost" onClick={() => { setForm(saved); setOk(false); }}>Batalkan</button>
          <button className="btn btn-primary">Simpan perubahan</button>
        </div>
      </form>
    </div>
  );
}
