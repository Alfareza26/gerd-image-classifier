export interface DoctorProfile {
  name: string;
  title: string;
  hospital: string;
  department: string;
  licenseNumber: string;
  email: string;
  avatar: string;
}

export interface ClassProbability {
  id: string;
  name: string;
  probability: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export interface InspectionRecord {
  id: string;
  code: string;
  date: string;
  time: string;
  timestamp: string;
  category: 'GERD' | 'Normal' | 'Polyp' | 'Gastritis';
  confidence: number;
  sampleName: string;
  fileSize: string;
  dimensions: string;
  study: string;
  notes: string;
  thumbnail: string;
  inputImage: string;
  gradcamImage: string;
  probabilities: ClassProbability[];
}

export interface SopStep {
  step: number;
  title: string;
  description: string;
}

export interface ActionGuideItem {
  page: string;
  pageIcon: string;
  buttons: Array<{ label: string; icon: string; style: 'primary' | 'secondary' | 'neutral' | 'danger' }>;
  functionality: string;
}

export interface ModuleItem {
  id: number;
  name: string;
  key: 'login' | 'beranda' | 'upload' | 'analisis' | 'hasil' | 'riwayat' | 'profil';
}

export const CURRENT_DOCTOR: DoctorProfile = {
  name: 'dr. Ahmad Rizki',
  title: 'Sp.PD-KGEH',
  hospital: 'RSUP Dr. Cipto Mangunkusumo / Klinisi Endoskopi',
  department: 'Gastroenterohepatologi',
  licenseNumber: 'SIP. 446/1829/SP-PD/DKS/2024',
  email: 'ahmad.rizki@rscm.kemkes.go.id',
  avatar: '/img/dokter.jpg',
};

export const INITIAL_PROBABILITIES: ClassProbability[] = [
  {
    id: 'gerd',
    name: 'GERD (Esofagitis Refluks / Erosi)',
    probability: 87.6,
    color: '#dc2626',
    badgeBg: 'bg-red-50',
    badgeBorder: 'border-red-200',
    badgeText: 'text-red-700',
  },
  {
    id: 'normal',
    name: 'GERD Normal / Non-Erosive (NERD)',
    probability: 8.7,
    color: '#16a34a',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-700',
  },
  {
    id: 'polyp',
    name: 'Polyp / Suspek Adenoma',
    probability: 2.1,
    color: '#d97706',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-700',
  },
  {
    id: 'gastric',
    name: 'Mukosa Lambung Normal Lainnya',
    probability: 1.6,
    color: '#94a3b8',
    badgeBg: 'bg-slate-50',
    badgeBorder: 'border-slate-200',
    badgeText: 'text-slate-700',
  },
];

export const HISTORY_RECORDS: InspectionRecord[] = [
  {
    id: 'rec-1',
    code: '#GERD-8921',
    date: '12 Apr 2025',
    time: '10:24',
    timestamp: '2025-04-12T10:24:00Z',
    category: 'GERD',
    confidence: 87.6,
    sampleName: 'endoscopy_z-line_001.jpg',
    fileSize: '2.4 MB',
    dimensions: '1920×1080 px',
    study: 'Endoskopi Saluran Cerna Atas (EGD)',
    notes: 'Terdeteksi erosi mukosa esofagus distal & break pada Z-line. Temuan sesuai LA Classification Grade B.',
    thumbnail: '/img/thumb-gerd.jpg',
    inputImage: '/img/input.jpg',
    gradcamImage: '/img/gradcam.jpg',
    probabilities: [
      { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 87.6, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
      { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 8.7, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
      { id: '3', name: 'Polyp / Suspek Adenoma', probability: 2.1, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
      { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 1.6, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
    ],
  },
  {
    id: 'rec-2',
    code: '#GERD-8910',
    date: '10 Apr 2025',
    time: '15:18',
    timestamp: '2025-04-10T15:18:00Z',
    category: 'Normal',
    confidence: 92.3,
    sampleName: 'endoscopy_esophagus_normal.jpg',
    fileSize: '1.9 MB',
    dimensions: '1920×1080 px',
    study: 'Endoskopi Saluran Cerna Atas (EGD)',
    notes: 'Mukosa esofagus distal licin intak tanpa erosi mukosa atau striktur lumen.',
    thumbnail: '/img/thumb-normal.jpg',
    inputImage: '/img/thumb-normal.jpg',
    gradcamImage: '/img/gradcam.jpg',
    probabilities: [
      { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 4.8, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
      { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 92.3, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
      { id: '3', name: 'Polyp / Suspek Adenoma', probability: 1.5, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
      { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 1.4, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
    ],
  },
  {
    id: 'rec-3',
    code: '#POLYP-441',
    date: '08 Apr 2025',
    time: '09:42',
    timestamp: '2025-04-08T09:42:00Z',
    category: 'Polyp',
    confidence: 78.1,
    sampleName: 'gastric_corpus_polyp.jpg',
    fileSize: '3.1 MB',
    dimensions: '1920×1080 px',
    study: 'Endoskopi Saluran Cerna Atas (EGD)',
    notes: 'Lesi elevasi polipoid soliter korpus lambung ukuran ~5mm, disarankan evaluasi biopsi patologi.',
    thumbnail: '/img/thumb-polip.jpg',
    inputImage: '/img/thumb-polip.jpg',
    gradcamImage: '/img/gradcam.jpg',
    probabilities: [
      { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 8.2, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
      { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 10.4, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
      { id: '3', name: 'Polyp / Suspek Adenoma', probability: 78.1, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
      { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 3.3, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
    ],
  },
  {
    id: 'rec-4',
    code: '#GERD-8894',
    date: '05 Apr 2025',
    time: '14:37',
    timestamp: '2025-04-05T14:37:00Z',
    category: 'GERD',
    confidence: 85.4,
    sampleName: 'endoscopy_antrum_091.jpg',
    fileSize: '2.8 MB',
    dimensions: '1920×1080 px',
    study: 'Endoskopi Saluran Cerna Atas (EGD)',
    notes: 'Tanda refluks asam esofagus distal dengan keterlibatan mukosa perbatasan lambung.',
    thumbnail: '/img/thumb-antrum.jpg',
    inputImage: '/img/thumb-antrum.jpg',
    gradcamImage: '/img/gradcam.jpg',
    probabilities: [
      { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 85.4, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
      { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 9.8, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
      { id: '3', name: 'Polyp / Suspek Adenoma', probability: 2.8, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
      { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 2.0, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
    ],
  },
  {
    id: 'rec-5',
    code: '#GERD-8882',
    date: '02 Apr 2025',
    time: '11:15',
    timestamp: '2025-04-02T11:15:00Z',
    category: 'GERD',
    confidence: 89.1,
    sampleName: 'endoscopy_zline_grade_a.jpg',
    fileSize: '2.2 MB',
    dimensions: '1920×1080 px',
    study: 'Endoskopi Saluran Cerna Atas (EGD)',
    notes: 'Satu break mukosal terbatas <5mm, tidak meluas antara puncak lipatan.',
    thumbnail: '/img/thumb-gerd.jpg',
    inputImage: '/img/input.jpg',
    gradcamImage: '/img/gradcam.jpg',
    probabilities: [
      { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 89.1, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
      { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 7.2, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
      { id: '3', name: 'Polyp / Suspek Adenoma', probability: 2.0, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
      { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 1.7, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
    ],
  },
  {
    id: 'rec-6',
    code: '#NORM-302',
    date: '30 Mar 2025',
    time: '08:50',
    timestamp: '2025-03-30T08:50:00Z',
    category: 'Normal',
    confidence: 94.8,
    sampleName: 'endoscopy_zline_clear.jpg',
    fileSize: '1.8 MB',
    dimensions: '1920×1080 px',
    study: 'Endoskopi Saluran Cerna Atas (EGD)',
    notes: 'Tautan squamocolumnar reguler intak tanpa defek epitel atau tanda peradangan.',
    thumbnail: '/img/thumb-normal.jpg',
    inputImage: '/img/thumb-normal.jpg',
    gradcamImage: '/img/gradcam.jpg',
    probabilities: [
      { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 3.2, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
      { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 94.8, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
      { id: '3', name: 'Polyp / Suspek Adenoma', probability: 1.1, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
      { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 0.9, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
    ],
  },
  {
    id: 'rec-7',
    code: '#GAST-194',
    date: '27 Mar 2025',
    time: '16:30',
    timestamp: '2025-03-27T16:30:00Z',
    category: 'Gastritis',
    confidence: 81.2,
    sampleName: 'endoscopy_antrum_erythema.jpg',
    fileSize: '2.5 MB',
    dimensions: '1920×1080 px',
    study: 'Endoskopi Saluran Cerna Atas (EGD)',
    notes: 'Eritema difus mukosa antrum lambung dengan pola vaskular teratur.',
    thumbnail: '/img/thumb-antrum.jpg',
    inputImage: '/img/thumb-antrum.jpg',
    gradcamImage: '/img/gradcam.jpg',
    probabilities: [
      { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 6.4, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
      { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 8.9, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
      { id: '3', name: 'Polyp / Suspek Adenoma', probability: 3.5, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
      { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 81.2, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
    ],
  },
  {
    id: 'rec-8',
    code: '#GERD-8840',
    date: '22 Mar 2025',
    time: '13:10',
    timestamp: '2025-03-22T13:10:00Z',
    category: 'GERD',
    confidence: 82.3,
    sampleName: 'endoscopy_zline_reflux.jpg',
    fileSize: '2.1 MB',
    dimensions: '1920×1080 px',
    study: 'Endoskopi Saluran Cerna Atas (EGD)',
    notes: 'Kemerahan dan hilangnya kontinuitas epitel skuamosa esofagus distal.',
    thumbnail: '/img/thumb-gerd.jpg',
    inputImage: '/img/input.jpg',
    gradcamImage: '/img/gradcam.jpg',
    probabilities: [
      { id: '1', name: 'GERD (Esofagitis Refluks / Erosi)', probability: 82.3, color: '#dc2626', badgeBg: 'bg-red-50', badgeBorder: 'border-red-200', badgeText: 'text-red-700' },
      { id: '2', name: 'GERD Normal / Non-Erosive (NERD)', probability: 11.2, color: '#16a34a', badgeBg: 'bg-emerald-50', badgeBorder: 'border-emerald-200', badgeText: 'text-emerald-700' },
      { id: '3', name: 'Polyp / Suspek Adenoma', probability: 4.1, color: '#d97706', badgeBg: 'bg-amber-50', badgeBorder: 'border-amber-200', badgeText: 'text-amber-700' },
      { id: '4', name: 'Mukosa Lambung Normal Lainnya', probability: 2.4, color: '#94a3b8', badgeBg: 'bg-slate-50', badgeBorder: 'border-slate-200', badgeText: 'text-slate-700' },
    ],
  },
];

export const SOP_STEPS: SopStep[] = [
  { step: 1, title: '1. Akses Web', description: 'Buka aplikasi dan login (jika diperlukan).' },
  { step: 2, title: '2. Unggah Gambar', description: 'Pilih gambar endoskopi dan pastikan format sesuai.' },
  { step: 3, title: '3. Validasi & Preprocessing', description: 'Sistem memeriksa file, mengubah ukuran, dan menormalisasi gambar.' },
  { step: 4, title: '4. Analisis oleh Model', description: 'Model deep learning (MobileNetV2) memproses gambar.' },
  { step: 5, title: '5. Lihat Hasil Prediksi', description: 'Dapatkan kelas, skor, heatmap, dan penjelasan.' },
  { step: 6, title: '6. Simpan / Lihat Riwayat', description: 'Hasil dapat disimpan dan diakses kembali di menu riwayat.' },
];

export const ACTION_GUIDES: ActionGuideItem[] = [
  {
    page: 'Beranda',
    pageIcon: 'home',
    buttons: [{ label: 'Mulai Analisis', icon: 'play_arrow', style: 'primary' }],
    functionality: 'Menuju halaman upload citra',
  },
  {
    page: 'Upload',
    pageIcon: 'cloud_upload',
    buttons: [
      { label: 'Pilih File', icon: 'folder_open', style: 'neutral' },
      { label: 'Lanjut ke Analisis', icon: 'arrow_forward', style: 'primary' },
    ],
    functionality: 'Memilih gambar dari perangkat lalu mengirim gambar ke model',
  },
  {
    page: 'Analisis',
    pageIcon: 'sync',
    buttons: [{ label: 'Proses Otomatis', icon: 'sync', style: 'secondary' }],
    functionality: 'Menampilkan progress inferensi neural network',
  },
  {
    page: 'Hasil',
    pageIcon: 'query_stats',
    buttons: [
      { label: 'Analisis Gambar Lain', icon: 'refresh', style: 'neutral' },
      { label: 'Simpan ke Riwayat', icon: 'save', style: 'primary' },
    ],
    functionality: 'Kembali ke upload atau menyimpan hasil ke riwayat',
  },
  {
    page: 'Riwayat',
    pageIcon: 'history',
    buttons: [{ label: 'Lihat Detail', icon: 'visibility', style: 'neutral' }],
    functionality: 'Melihat hasil rekap pemeriksaan lengkap',
  },
  {
    page: 'Profil',
    pageIcon: 'person',
    buttons: [
      { label: 'Ubah Profil', icon: 'edit', style: 'secondary' },
      { label: 'Logout', icon: 'logout', style: 'danger' },
    ],
    functionality: 'Mengedit data pengguna dan keluar dari akun',
  },
];

export const MODULE_LIST: ModuleItem[] = [
  { id: 1, name: 'Login / Masuk', key: 'login' },
  { id: 2, name: 'Beranda', key: 'beranda' },
  { id: 3, name: 'Upload Gambar', key: 'upload' },
  { id: 4, name: 'Proses Analisis', key: 'analisis' },
  { id: 5, name: 'Hasil Prediksi', key: 'hasil' },
  { id: 6, name: 'Riwayat', key: 'riwayat' },
  { id: 7, name: 'Profil Pengguna', key: 'profil' },
];
