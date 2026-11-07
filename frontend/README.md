# GERD AI frontend (Next.js)

Letakkan folder ini sebagai `frontend/` di root proyek GERD Classification.

```bash
cd frontend
cp .env.example .env.local     # sesuaikan BACKEND_URL
npm install
npm run dev                    # http://localhost:3000
# terminal lain, dari root proyek:
uvicorn backend.main:app --port 8000
```

Browser memanggil `/api/*`, lalu `next.config.mjs` meneruskannya ke FastAPI. Tidak perlu mengaktifkan CORS.

## Yang perlu dicocokkan dengan backend

| Hal | Lokasi | Asumsi sekarang |
| --- | --- | --- |
| Path endpoint | `NEXT_PUBLIC_PREDICT_PATH` | `POST /predict`, field multipart `file` |
| Bentuk respons | `normalize()` di `lib/api.ts` | `label`, `confidence`, opsional `probabilities` |
| Citra ditolak gerbang | `app/analisis/page.tsx` | status 4xx, pesan di `detail` |

## Penyimpanan

Riwayat dan profil disimpan di `localStorage` (`lib/store.ts`). Login, registrasi, dan lupa sandi belum terhubung ke backend (`lib/auth.ts`).
