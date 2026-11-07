import Icon from './Icon';

export default function ModuleBar() {
  return (
    <section className="wrap">
      <div className="module">
        <Icon name="stomach" size={228} className="watermark" />
        <div>
          <p className="chip chip-onDark"><Icon name="shield" size={12} /> Akurasi Klinis Terkalibrasi Standar Internasional</p>
          <h2>Siap Menganalisis Citra Endoskopi Pasien Anda Hari Ini?</h2>
          <p>
            Dukung keputusan klinis Anda dengan presisi inferensi visual modern. Masuk ke ruang kerja klasifikasi sekarang
            untuk mengeliminasi bias evaluasi subjektif.
          </p>
        </div>
        <a href="#analisis" className="btn btn-light btn-lg">
          Buka Modul Analisis Citra Medis <Icon name="arrow" size={13} />
        </a>
      </div>
    </section>
  );
}
