import Link from "next/link";

const steps = [
  ["01", "Siapkan citra", "Pilih citra endoskopi esofagus dalam format JPG, PNG, atau WEBP dengan ukuran maksimal 10 MB."],
  ["02", "Unggah dan isi data", "Masukkan kode pasien anonim, usia, dan jenis kelamin. Gerbang input memeriksa apakah citra memang hasil endoskopi."],
  ["03", "Tinjau hasil", "Model memberi label GERD atau Normal beserta tingkat keyakinannya. Anda memutuskan apakah hasil masuk ke riwayat."],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">Klasifikasi citra endoskopi</p>
          <h1 style={{ marginTop: 16 }}>Deteksi dini GERD dari citra endoskopi</h1>
          <p className="lead">
            Unggah citra, lalu baca label GERD atau Normal beserta tingkat keyakinan model. Citra yang bukan hasil endoskopi ditolak sebelum diklasifikasi.
          </p>
          <div className="row" style={{ marginTop: 32 }}>
            <Link href="/analisis" className="btn btn-primary">Mulai Analisis Citra</Link>
            <a href="#alur" className="btn btn-ghost">Lihat alur kerja</a>
          </div>
          <div className="facts">
            <div><b>2 kelas</b><span className="muted">GERD dan Normal</span></div>
            <div><b>EfficientNetB0</b><span className="muted">Transfer learning, lalu fine-tuning</span></div>
            <div><b>Gerbang input</b><span className="muted">Menolak citra non-endoskopi</span></div>
          </div>
        </div>
      </section>

      <section id="alur" className="section" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <p className="eyebrow">Alur kerja</p>
          <h2 style={{ marginTop: 12, maxWidth: "22ch" }}>Tiga langkah dari citra ke hasil</h2>
          <div className="steps">
            {steps.map(([n, t, d]) => (
              <div className="panel flat" key={n}>
                <span className="n">{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2>Siap menganalisis citra pertama Anda?</h2>
          <p>Hasil klasifikasi membantu Anda menyaring kasus. Penegakan diagnosis tetap membutuhkan penilaian dokter.</p>
          <Link href="/analisis" className="btn btn-on-band">Buka Modul Analisis</Link>
        </div>
      </section>
    </>
  );
}
