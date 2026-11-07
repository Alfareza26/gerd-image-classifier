import Analyzer from './Analyzer';
import Icon from './Icon';

export default function Workspace() {
  return (
    <section id="analisis" className="wrap section">
      <div className="sec-head">
        <p className="eyebrow"><Icon name="upload" size={13} /> RUANG KERJA KLASIFIKASI</p>
        <h2>Unggah Citra Endoskopi</h2>
        <p className="sub">Gunakan ID anonim, bukan nama pasien. Hasil model bersifat pendukung dan wajib divalidasi dokter penanggung jawab (DPJP).</p>
      </div>
      <Analyzer />
    </section>
  );
}
