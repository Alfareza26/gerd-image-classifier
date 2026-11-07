import { stats } from '../lib/data';
import Icon from './Icon';

function Anatomy() {
  return (
    <svg viewBox="0 0 400 400" className="anatomy" role="img" aria-label="Ilustrasi esofagus dan lambung dengan penanda perbatasan GEJ dan area erosi">
      <g className="reticle">
        <circle cx="200" cy="200" r="190" />
        <circle cx="200" cy="200" r="140" />
        <circle cx="200" cy="200" r="90" />
        <path d="M200 10v380M10 200h380" />
      </g>
      <path d="M200 40v135" className="tube" />
      <path className="stomach" d="M200 165c-62 8-104 68-76 128 28 58 130 62 156-2 18-44-12-82-48-94-16-5-22-14-22-32z" />
      <path className="folds" d="M150 250c24-14 50-12 70 4M146 280c30-14 62-8 84 10M170 312c24-8 46-4 62 6" />
      <ellipse cx="200" cy="140" rx="11" ry="20" className="lesion" />
      <circle cx="200" cy="172" r="12" className="gej" />
      <circle cx="200" cy="172" r="3.5" className="gej-dot" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="beranda" className="wrap hero">
      <div className="hero-copy">
        <p className="chip rise">
          <span className="chip-dot" />
          SISTEM INFERENSI MEDIS BERBASIS CONVOLUTIONAL NEURAL NETWORK (CNN)
        </p>
        <h1 className="rise d1">Klasifikasi Citra Endoskopi &amp; Deteksi Dini Refluks Gastroesofagus (GERD)</h1>
        <p className="lead rise d2">
          Akselerasi interpretasi klinis esofagitis refluks dengan arsitektur Deep Convolutional Neural Network (CNN)
          berpresisi tinggi. Mengintegrasikan spatial convolution multi-layer dan feature extraction mendalam untuk
          lokalisasi otomatis perbatasan gastroesofageal (GEJ/Z-Line) serta segmentasi mucosal break pada mukosa esofagus.
        </p>
        <div className="cta-row rise d3">
          <a href="#analisis" className="btn btn-primary">
            Mulai Analisis Citra Medis <Icon name="arrow" size={13} />
          </a>
          <a href="#alur" className="btn btn-ghost">
            <Icon name="book" size={16} /> Pelajari Alur Kerja Medis
          </a>
        </div>
        <dl className="stats rise d4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className={`stat-${s.tone}`}>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-visual rise d2">
        <div className="reticle-box">
          <Anatomy />
          <div className="float f-top">
            <Icon name="target" size={15} />
            <span><b>GEJ / Z-Line AI</b><small className="ok">Integritas Terverifikasi</small></span>
          </div>
          <div className="float f-left">
            <Icon name="alert" size={16} />
            <span><b>Deteksi Refluks Mukosa</b><small className="warn">Erosi Esofagus Distal</small></span>
          </div>
          <div className="float f-pill"><span className="chip-dot" /> Model Convolutional Neural Network (CNN)</div>
        </div>
      </div>
    </section>
  );
}
