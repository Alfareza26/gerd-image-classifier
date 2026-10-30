# Panduan Pengoperasian GERD Image Classifier
Sistem Klasifikasi Citra Medis Berbasis Deep Learning & Explainable AI (Grad-CAM)

---

## 1. Ikhtisar Sistem & Arsitektur

Proyek **GERD Image Classifier** adalah sistem pendukung keputusan klinis (*Clinical Decision Support System*) yang dirancang untuk menganalisis citra endoskopi saluran cerna bagian atas (EGD). Sistem ini membantu mendeteksi tanda-tanda erosi mukosa esofagus distal dan lesi pada Z-line yang berkaitan dengan GERD (*Gastroesophageal Reflux Disease*).

### Arsitektur Aplikasi
- **Backend (`/backend`)**:
  - **Framework**: FastAPI (Python 3.11) & Uvicorn.
  - **Deep Learning Model**: EfficientNetB0 (`model_gerd_lanjutan.keras`) dengan Test-Time Augmentation (TTA).
  - **Explainable AI (XAI)**: Grad-CAM (*Gradient-weighted Class Activation Mapping*) berbasis aktivasi layer `top_activation`.
  - **Guard Layer**: Filter kualitas statistik (brightness, contrast, saturation), deteksi *Out-of-Distribution* (OOD) jarak Mahalanobis, kalibrasi probabilitas Platt (*Platt Scaling*), serta pita ketidakpastian (*uncertainty band*).
- **Frontend (`/frontend`)**:
  - **Framework**: React 19, Vite, Tailwind CSS, Lucide Icons, Material Symbols.
  - **Interaksi**: Drag-and-drop unggah citra, inspeksi side-by-side, visualisasi overlay heatmap Grad-CAM dengan slider opasitas, manajemen riwayat lokal (EHR), dan cetak rekap medis.

---

## 2. Prasyarat Sistem (*Prerequisites*)

Pastikan perangkat Anda telah terpasang:
1. **Python 3.11 (64-bit)**
2. **Node.js (v18.0.0 atau lebih baru)** & **npm**
3. **Sistem Operasi**: Windows 10/11 (PowerShell atau Command Prompt)

---

## 3. Instalasi & Penyiapan Pertama Kali (*First-time Setup*)

### A. Penyiapan Backend
Buka terminal (PowerShell atau Command Prompt) dan masuk ke direktori `backend`:
```powershell
cd "c:\Users\User\Documents\Project\GERD Classification\backend"
```

Pastikan virtual environment telah aktif atau gunakan Python dari `.venv`:
```powershell
# Jika dependensi belum diinstal:
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Pastikan file model dan konfigurasi Guard berikut tersedia pada folder `backend/model`:
- `model/lanjutan/model_gerd_lanjutan.keras` (Model CNN utama)
- `model/guard/gerd_guard.npz` (Matriks kovariansi OOD & statistik)
- `model/guard/gerd_guard_config.json` (Konfigurasi ambang batas kalibrasi)

### B. Penyiapan Frontend
Buka terminal baru dan masuk ke direktori `frontend`:
```powershell
cd "c:\Users\User\Documents\Project\GERD Classification\frontend"

# Instal dependensi paket node
npm install
```

---

## 4. Cara Menjalankan Aplikasi (*Running the Project*)

Untuk mengoperasikan sistem secara penuh, jalankan **Backend** dan **Frontend** pada dua terminal terpisah.

### Langkah 1: Jalankan Backend (Terminal 1)
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
*Output sukses terminal backend:*
```text
Model GERD berhasil dimuat.
Input model: (None, 224, 224, 3)
Guard aktif. Ukuran input: (224, 224)
Threshold terkalibrasi: 0.44
INFO: Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Langkah 2: Jalankan Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
*Output sukses terminal frontend:*
```text
  VITE v8.3.5  ready in 450 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### Langkah 3: Akses Aplikasi
- Buka browser Anda dan akses antarmuka web:
  👉 **http://localhost:3000**
- Akses dokumentasi interaktif Swagger API (Backend):
  👉 **http://127.0.0.1:8000/docs**
- Cek status kesiapan model (*Health Check*):
  👉 **http://127.0.0.1:8000/health**

---

## 5. Alur Operasional Analisis Citra (*Step-by-Step User Guide*)

Aplikasi web terdiri dari 3 kolom alur kerja klinis:

```
+------------------------+-------------------------------+--------------------------+
|  1. Unggah Citra       |  2. Hasil Prediksi & Grad-CAM |  3. Riwayat Analisis     |
|  - Drag & Drop File    |  - Klasifikasi & Confidence   |  - Daftar Rekap Pasien   |
|  - Validasi Preprocess |  - Heatmap Lesi (Explainable) |  - Detail & Cetak Resume |
+------------------------+-------------------------------+--------------------------+
```

### 1. Unggah Citra Endoskopi (Kolom 1)
- Seret (*drag & drop*) file gambar endoskopi ke kotak unggah, atau klik tombol **"Pilih File Endoskopi"**.
- Format yang didukung: **JPEG, JPG, PNG, BMP, WEBP** (maksimal 10 MB, resolusi minimal 32×32 px).
- Anda juga dapat memilih sampel preset instan (**Esofagitis**, **Normal**, **Polip**) untuk demonstrasi cepat.
- Sistem akan melakukan validasi format bit, auto-orientasi EXIF, dan normalisasi ukuran citra (224×224 px).

### 2. Jalankan Analisis AI
- Klik tombol **"Lanjut ke Analisis Model AI"** (atau analisis akan berjalan otomatis setelah berkas terunggah).
- Pipeline backend akan mengevaluasi:
  1. Filter statistik kecerahan & kontras citra.
  2. Jarak OOD Mahalanobis untuk memastikan citra merupakan endoskopi saluran cerna yang valid.
  3. Inferensi CNN EfficientNetB0 dengan TTA (*Test-Time Augmentation*).
  4. Kalibrasi probabilitas Platt (*Platt Scaling*).
  5. Pembangkitan peta aktivasi fitur Grad-CAM.

### 3. Tinjauan Hasil Prediksi & Grad-CAM (Kolom 2)
- **Hasil Klasifikasi**: Menampilkan kategori prediksi (**GERD Positif** atau **GERD Negatif/Normal**).
- **Tingkat Kepercayaan (*Confidence*)**: Menampilkan persentase kepastian model terkalibrasi.
- **Peta Grad-CAM**:
  - Mode **Berdampingan (*Side-by-side*)**: Membandingkan citra asli dengan heatmap Grad-CAM.
  - Mode **Overlay Heatmap**: Menumpuk heatmap di atas citra asli dengan slider opasitas interaktif untuk memverifikasi lokasi anatomi lesi mukosa / Z-line.
  - Tombol **"Perbesar Area Z-Line"** untuk memperbesar detail citra.

### 4. Simpan ke Riwayat & Cetak Rekap (Kolom 3)
- Klik tombol **"Simpan ke Riwayat (EHR)"** untuk menyimpan hasil pemeriksaan ke database lokal.
- Klik rekaman pada tabel riwayat untuk membuka modal detail.
- Klik **"Cetak Rekap Medis"** untuk mencetak laporan resmi atau menyimpannya sebagai format PDF.

---

## 6. Penjelasan Status & Kategori Guard

Sistem dilengkapi proteksi klinis (*Guard*) untuk mencegah kesalahan interpretasi:

| Status Hasil | Keterangan Klinis | Tindakan Rekomendasi |
| :--- | :--- | :--- |
| **GERD** | Probabilitas terkalibrasi $\ge 0.44$. Terdeteksi erosi mukosa esofagus distal atau break pada Z-line. | Konfirmasi derajat erosi sesuai kriteria *Los Angeles Classification*. |
| **GERD_Normal** | Probabilitas terkalibrasi $< 0.44$. Mukosa esofagus tampak intak tanpa lesi erosif. | Pertimbangkan evaluasi klinis gejala NERD bila pasien bergejala refluks. |
| **TIDAK_PASTI** | Skor probabilitas berada di dekat batas keputusan model (*Uncertainty Band*). | Memerlukan tinjauan langsung oleh dokter spesialis gastroenterologi. |
| **DITOLAK** | Citra bukan endoskopi (*Out-of-Distribution*), format rusak, atau kualitas pencahayaan ekstrem. | Unggah ulang citra endoskopi saluran cerna yang memadai. |

---

## 7. Endpoint API Backend

Jika Anda mengintegrasikan backend dengan sistem SIMRS / EHR eksternal:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/` | Informasi versi API, arsitektur model, dan fitur aktif. |
| `GET` | `/health` | Pemeriksaan kesehatan status model dan komponen Guard. |
| `POST` | `/predict` | Menerima berkas `multipart/form-data` (`file`) dan mengembalikan hasil klasifikasi, probabilitas, serta data base64 Grad-CAM. |

**Contoh Payload Respons `/predict`:**
```json
{
  "status": "GERD",
  "prediction": "GERD",
  "category": "GERD",
  "primary_result": "GERD Positif (Esofagitis Refluks / Erosi)",
  "confidence": 0.998,
  "probabilities": {
    "GERD": 0.998,
    "GERD_Normal": 0.002
  },
  "alasan": "",
  "gradcam_image": "data:image/jpeg;base64,/9j/4AAQ...",
  "threshold": 0.44,
  "skor_gerd": 0.998,
  "skor_mentah": 0.9998,
  "jarak_ood": 2360.5,
  "filename": "pasien_001.jpg",
  "model": "EfficientNetB0",
  "disclaimer": "Hasil ini merupakan prediksi model berbasis deep learning..."
}
```

---

## 8. Panduan Mengatasi Kendala (*Troubleshooting*)

1. **PowerShell `PSSecurityException` (Script execution disabled):**
   - Jalankan perintah dengan awalan `cmd /c` atau jalankan PowerShell sebagai Administrator dan aktifkan kebijakan eksekusi:
     ```powershell
     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
     ```
2. **Port 8000 atau Port 3000 Sudah Digunakan (*Address already in use*):**
   - Cari dan hentikan proses yang menempati port:
     ```powershell
     # Cek port 8000
     netstat -ano | findstr :8000
     # Hentikan proses berdasarkan PID
     taskkill /PID <PID_NOMOR> /F
     ```
3. **Frontend Tidak Terhubung ke Backend (*Failed to fetch*):**
   - Pastikan backend berjalan pada `http://127.0.0.1:8000` (bukan port lain).
   - Periksa status `http://127.0.0.1:8000/health` di browser. Jika backend offline, frontend secara cerdas beralih ke simulasi interaktif tanpa menyebabkan crash.
4. **Grad-CAM Tidak Muncul pada Citra Baru:**
   - Pastikan backend sedang aktif saat mengunggah citra. Backend otomatis membangkitkan heatmap aktivasi dan menyematkannya ke respons JSON.

---

## 9. Catatan Medis & Kepatuhan Etika

> **PERINGATAN MEDIS:**
> Sistem ini dikembangkan sebagai alat bantu komputasi edukasi dan riset pendukung keputusan klinis (*Clinical Decision Support*). Sistem ini **hanya mengklasifikasikan pola citra medis, bukan menetapkan diagnosis medis final secara definitif**. Segala keputusan diagnostik dan intervensi terapi tetap menjadi wewenang dan tanggung jawab penuh dokter spesialis / tenaga medis profesional.

