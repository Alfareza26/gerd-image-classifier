import { grades, steps } from '../lib/data';
import Icon from './Icon';

export default function Guide() {
  return (
    <>
      <section id="alur" className="band">
        <div className="wrap">
          <div className="sec-head split">
            <div>
              <p className="eyebrow"><Icon name="shield" size={13} /> STANDAR OPERASIONAL PROSEDUR MEDIS</p>
              <h2>Alur Kerja Pemeriksaan Terintegrasi</h2>
              <p className="sub">Transisi mulus dari telaah pra-tindakan hingga laporan analitik berbantuan kecerdasan buatan.</p>
            </div>
            <a href="#analisis" className="btn btn-primary btn-md">
              Lanjut ke Langkah Analisis Sekarang <Icon name="arrow" size={12} />
            </a>
          </div>

          <ol className="steps">
            {steps.map((s) => (
              <li key={s.badge} className={`card step${s.featured ? ' featured' : ''}`}>
                {s.featured && <span className="flag">FOKUS UTAMA MODUL</span>}
                <div className="step-top">
                  <span className="badge">{s.badge}</span>
                  <Icon name={s.icon as 'book'} size={20} className="muted" />
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="step-foot">
                  <span><Icon name="shield" size={12} /> {s.note}</span>
                  <b>{s.status}</b>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="matriks" className="wrap section">
        <div className="sec-head center">
          <p className="eyebrow"><Icon name="book" size={13} /> REFERENSI STANDAR INTERNASIONAL</p>
          <h2>Matriks Stratifikasi Klasifikasi Los Angeles (LA)</h2>
          <p className="sub">
            Algoritma Convolutional Neural Network (CNN) dilatih secara ketat menggunakan konsensus klasifikasi esofagitis
            Los Angeles untuk mendeteksi tingkat erosi mukosa esofagus secara objektif.
          </p>
        </div>
        <div className="grades">
          {grades.map((g) => (
            <article key={g.id} className={`card grade g-${g.id}`}>
              <header>
                <h3>Grade {g.id}</h3>
                <span className="tag">{g.tag}</span>
              </header>
              <div className="panel">
                <span className="meter"><i style={{ width: `${g.bar}%` }} /></span>
                {g.rows.map((r) => <p key={r}>{r}</p>)}
              </div>
              <p className="grade-body">{g.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
