export const nav = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Analisis', href: '#analisis' },
  // Belum ada halaman tujuan di desain Figma; ganti href saat halamannya dibuat.
  { label: 'Riwayat', href: '#' },
  { label: 'Profil', href: '#' },
];

export const stats = [
  { value: '98.4%', label: 'Akurasi Validasi Klinis', tone: 'accent' },
  { value: '< 50ms', label: 'Waktu Inferensi per Frame', tone: 'ink' },
  { value: '4 Derajat', label: 'Klasifikasi LA (Grade A-D)', tone: 'amber' },
] as const;

export const steps = [
  {
    badge: 'Langkah 01',
    icon: 'book',
    title: 'Orientasi Kasus & Protokol',
    body: 'Kaji panduan kriteria klasifikasi Los Angeles (LA) dan pastikan kriteria inklusi endoskopi esofagus terpenuhi sebelum transmisi citra.',
    note: 'Integritas Data Terjamin',
    status: 'Tersinkronisasi',
  },
  {
    badge: 'Langkah 02',
    icon: 'upload',
    title: 'Input & Unggah Citra Medis',
    body: 'Masukkan Rekam Medis (ID anonim pasien) dan transmit citra video/still endoskopi ke pipeline Convolutional Neural Network (CNN) multi-layer untuk ekstraksi fitur spasial instan.',
    note: 'Inferensi < 50ms',
    status: 'Siap Unggah',
    featured: true,
  },
  {
    badge: 'Langkah 03',
    icon: 'file',
    title: 'Hasil Prediksi & Validasi Dokter',
    body: 'Lapisan konvolusi mendalam memetakan bounding box batas mucosal break secara akurat, mengklasifikasi derajat LA (Grade A-D) dengan confidence score terkalibrasi untuk diverifikasi DPJP.',
    note: 'Ekspor Laporan PDF',
    status: 'Tervalidasi',
  },
];

// bar = lebar indikator keparahan (% dari lebar penuh)
export const grades = [
  {
    id: 'A',
    tag: 'Erosi Ringan',
    bar: 18,
    rows: ['Panjang Lesi: ≤ 5 mm', 'Distribusi: Terisolasi pada 1 lipatan'],
    body: 'Satu atau lebih mucosal break dengan panjang tidak lebih dari 5 mm yang tidak memanjang di antara puncak dua lipatan mukosa.',
  },
  {
    id: 'B',
    tag: 'Erosi Moderat',
    bar: 29,
    rows: ['Panjang Lesi: > 5 mm', 'Distribusi: Tidak berkesinambungan'],
    body: 'Satu atau lebih mucosal break dengan panjang lebih dari 5 mm, namun tidak berkesinambungan antara puncak dua lipatan mukosa.',
  },
  {
    id: 'C',
    tag: 'Erosi Signifikan',
    bar: 44,
    rows: ['Cakupan Lingkar: < 75%', 'Distribusi: Menyatu di puncak lipatan'],
    body: 'Mucosal break yang berkesinambungan di antara puncak dua atau lebih lipatan mukosa yang melibatkan kurang dari 75% lingkar esofagus.',
  },
  {
    id: 'D',
    tag: 'Erosi Berat / Sirkumferensial',
    bar: 100,
    rows: ['Cakupan Lingkar: ≥ 75%', 'Distribusi: Lesi sirkumferensial esofagus'],
    body: 'Mucosal break sirkumferensial yang melibatkan setidaknya 75% atau lebih dari lingkar esofagus, membutuhkan evaluasi striktur & keganasan.',
  },
];

export const footerLinks = ['Protokol Klinis', 'Kebijakan Privasi Medis', 'Bantuan Teknis', 'Dokumentasi API'];
