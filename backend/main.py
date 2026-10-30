import threading
from contextlib import asynccontextmanager
from pathlib import Path

import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

from guard import GERDGuard


# ==========================================
# KONFIGURASI
# ==========================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
LANJUTAN_DIR = MODEL_DIR / "lanjutan"
GUARD_DIR = MODEL_DIR / "guard"

# Model yang dipakai harus cocok dengan Guard (lihat "model_path" di
# gerd_guard_config.json).
MODEL_PATH = LANJUTAN_DIR / "model_gerd_lanjutan.keras"

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# Format yang diterima Guard (JPEG, PNG, BMP). WEBP ditolak di Guard,
# jadi ditolak lebih awal di sini.
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/bmp"}

model = None
guard: GERDGuard | None = None

# Keras predict tidak aman dipanggil paralel pada model yang sama.
inference_lock = threading.Lock()


# ==========================================
# LOAD MODEL + GUARD
# ==========================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, guard

    if not MODEL_PATH.is_file():
        raise RuntimeError(f"File model tidak ditemukan: {MODEL_PATH}")

    model = tf.keras.models.load_model(MODEL_PATH, compile=False)

    print("Model GERD berhasil dimuat.")
    print("Path model:", MODEL_PATH)
    print("Input model:", model.input_shape)
    print("Output model:", model.output_shape)

    # Guard dibuat SETELAH model dimuat. Sebelumnya dibuat saat import
    # dengan model=None sehingga crash.
    guard = GERDGuard(
        model=model,
        guard_dir=GUARD_DIR,
        model_path=str(MODEL_PATH),
    )

    input_shape = model.input_shape
    if isinstance(input_shape, list):
        print("PERINGATAN: model memiliki beberapa input; pipeline perlu diperiksa.")
    elif len(input_shape) == 4:
        expected_h, expected_w = input_shape[1], input_shape[2]
        if (
            isinstance(expected_h, int)
            and isinstance(expected_w, int)
            and (expected_h, expected_w) != guard.img_size
        ):
            raise RuntimeError(
                f"Ukuran input Guard {guard.img_size} tidak cocok dengan "
                f"ukuran model {(expected_h, expected_w)}."
            )

    print("Guard aktif. Ukuran input:", guard.img_size)
    print("Threshold terkalibrasi:", guard.threshold)
    print("TTA aktif:", guard.tta)

    yield

    guard = None
    model = None


# ==========================================
# APLIKASI FASTAPI
# ==========================================

app = FastAPI(
    title="GERD Classification API",
    description=(
        "API klasifikasi gambar GERD menggunakan TensorFlow dan EfficientNetB0 "
        "dengan Guard (filter statistik, OOD, kalibrasi, dan pita ketidakpastian). "
        "Hasil merupakan prediksi model, bukan diagnosis medis."
    ),
    version="1.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "GERD Classification API aktif",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health():
    ready = model is not None and guard is not None
    return {
        "status": "ok" if ready else "not_ready",
        "model_loaded": model is not None,
        "guard_loaded": guard is not None,
        "model_path": MODEL_PATH.name,
        "image_size": list(guard.img_size) if guard else None,
        "threshold": guard.threshold if guard else None,
        "tta": guard.tta if guard else None,
    }


# ==========================================
# ENDPOINT PREDIKSI GAMBAR
# ==========================================

def run_guard(image_bytes: bytes) -> dict:
    with inference_lock:
        return guard.predict_bytes(image_bytes)


def build_response(result: dict) -> dict:
    status = result["status"]
    response = {
        "status": status,
        "prediction": status,
        "alasan": result.get("alasan", ""),
        "confidence": None,
        "probabilities": None,
        "threshold": result.get("threshold"),
        "skor_gerd": result.get("skor_gerd"),
        "skor_mentah": result.get("skor_mentah"),
        "jarak_ood": result.get("jarak_ood"),
    }

    if status in ("GERD", "GERD_Normal"):
        p_gerd = float(result["skor_gerd"])
        probabilities = {"GERD_Normal": 1.0 - p_gerd, "GERD": p_gerd}
        response["probabilities"] = {
            name: round(value, 6) for name, value in probabilities.items()
        }
        response["confidence"] = round(probabilities[status], 6)

    return response


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None or guard is None:
        await file.close()
        raise HTTPException(status_code=503, detail="Model belum siap.")

    if file.content_type not in ALLOWED_TYPES:
        await file.close()
        raise HTTPException(
            status_code=415,
            detail="Format tidak didukung. Gunakan JPG, PNG, atau BMP.",
        )

    try:
        image_bytes = await file.read(MAX_FILE_SIZE + 1)
    finally:
        await file.close()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="File gambar kosong.")

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Ukuran gambar maksimal 10 MB.")

    try:
        result = await run_in_threadpool(run_guard, image_bytes)
    except Exception as exc:
        print("Prediction error:", repr(exc))
        raise HTTPException(
            status_code=500,
            detail="Terjadi kesalahan saat memproses gambar.",
        ) from exc

    return {
        **build_response(result),
        "filename": file.filename,
        "model": "EfficientNetB0",
        "disclaimer": (
            "Hasil ini merupakan prediksi model, bukan diagnosis medis. "
            "Interpretasikan bersama tenaga medis."
        ),
    }