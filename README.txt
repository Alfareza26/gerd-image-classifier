GERDGuard backend update: model training terbaru

Isi:
- backend/main.py: FastAPI memakai model EfficientNetB0 hasil training gabungan terbaru.
- backend/model/combined/model_gerd_combined.keras: model dari GERD_Combined_Training_Results.
- backend/requirements.txt
- frontend/lib/gerdApi.ts: helper Next.js untuk memanggil API nyata.

Pemasangan:
1. Salin folder backend/model/combined ke folder backend proyek lama.
2. Ganti backend/main.py dengan file pada paket ini.
3. Jangan import GERDGuard lama pada main.py ini. Guard lama dibuat untuk model sebelumnya.
4. Instal dependency: pip install -r requirements.txt
5. Jalankan dari folder backend: python -m uvicorn main:app --reload
6. Cek http://127.0.0.1:8000/health dan http://127.0.0.1:8000/docs
7. Salin frontend/lib/gerdApi.ts ke frontend proyek. Panggil predictGerdImage(file) dari handler upload.

Konfigurasi:
- Input: RGB 224x224, float32, rentang 0-255.
- Label: GERD_Normal=0, GERD=1.
- Threshold sementara: 0.50, sama dengan evaluasi test yang dilaporkan.
- TTA tidak diaktifkan karena evaluasi training terbaru tidak memakai TTA.
- Guard OOD, statistik, dan kalibrasi Platt lama tidak dipakai karena tidak kompatibel dengan model baru.

Frontend helper:
const result = await predictGerdImage(file);
// result.prediction: GERD atau GERD_Normal
// result.probabilities.GERD: skor sigmoid GERD 0..1
// result.confidence: skor kelas terpilih 0..1

Catatan:
Hasil merupakan prediksi eksperimental dan bukan diagnosis medis.
