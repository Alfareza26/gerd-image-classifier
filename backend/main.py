from contextlib import asynccontextmanager
from pathlib import Path
import threading

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool 

from guard import GERDGuard

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "combined" / "model_gerd_combined.keras"
GATE_MODEL_PATH = BASE_DIR / "model" / "gate" / "image_type_classifier.keras"
GATE_CONFIG_PATH = BASE_DIR / "model" / "gate" / "image_type_config.json"
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_MIME = {"image/jpeg", "image/png", "image/bmp"}

model: tf.keras.Model | None = None
guard: GERDGuard | None = None
lock = threading.Lock()


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, guard
    for path in (MODEL_PATH, GATE_MODEL_PATH, GATE_CONFIG_PATH):
        if not path.is_file():
            raise RuntimeError(f"Berkas wajib tidak ditemukan: {path}")

    model = tf.keras.models.load_model(str(MODEL_PATH), compile=False)
    if tuple(model.input_shape[1:]) != (224, 224, 3) or model.output_shape[-1] != 1:
        raise RuntimeError(f"Arsitektur model GERD tidak sesuai: {model.input_shape}, {model.output_shape}")

    guard = GERDGuard(GATE_MODEL_PATH, GATE_CONFIG_PATH)
    print("Model GERD:", MODEL_PATH)
    print("Image-type gate:", GATE_MODEL_PATH)
    yield
    guard = None
    model = None
    tf.keras.backend.clear_session()


app = FastAPI(
    title="GERD Classification API",
    description="Klasifikasi eksperimental citra endoskopi dengan filter tipe gambar. Bukan alat diagnosis.",
    version="4.0.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def run_prediction(data: bytes) -> dict:
    if model is None or guard is None:
        raise RuntimeError("Model belum siap")

    # Gate harus lolos sebelum model GERD menerima gambar.
    gate_result, arr = guard.check_bytes(data)
    if gate_result["status"] == "DITOLAK":
        return {
            "prediction": "DITOLAK",
            "status": "DITOLAK",
            "confidence": None,
            "probabilities": None,
            "guard": True,
            "gate": gate_result,
            "reason": gate_result["alasan"],
            "model": "EfficientNetB0_GERD_Combined",
            "disclaimer": "Hasil eksperimental, bukan diagnosis medis.",
        }

    batch = tf.convert_to_tensor(arr[None, ...], dtype=tf.float32)
    with lock:
        p_gerd = float(np.asarray(model(batch, training=False)).reshape(-1)[0])
    p_gerd = float(np.clip(p_gerd, 0.0, 1.0))
    threshold = 0.50  # Sama dengan evaluasi combined test yang dilaporkan.
    status = "GERD" if p_gerd >= threshold else "GERD_Normal"
    confidence = p_gerd if status == "GERD" else 1.0 - p_gerd
    return {
        "prediction": status,
        "status": status,
        "confidence": round(confidence, 6),
        "probabilities": {
            "GERD_Normal": round(1.0 - p_gerd, 6),
            "GERD": round(p_gerd, 6),
        },
        "skor_gerd": round(p_gerd, 6),
        "threshold": threshold,
        "guard": True,
        "gate": gate_result,
        "reason": "Lolos filter tipe gambar. OOD embedding khusus model combined belum dikalibrasi.",
        "model": "EfficientNetB0_GERD_Combined",
        "disclaimer": "Hasil eksperimental, bukan diagnosis medis. Perlu interpretasi tenaga kesehatan.",
    }


@app.get("/")
def root():
    return {"message": "GERD Classification API aktif", "version": app.version, "docs": "/docs", "health": "/health"}


@app.get("/health")
def health():
    return {
        "status": "ok" if model is not None and guard is not None else "not_ready",
        "model_loaded": model is not None,
        "image_type_gate_loaded": guard is not None,
        "embedding_ood_loaded": False,
        "model_path": str(MODEL_PATH.relative_to(BASE_DIR)),
        "gate_model_path": str(GATE_MODEL_PATH.relative_to(BASE_DIR)),
        "threshold": 0.50,
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None or guard is None:
        raise HTTPException(503, "Model atau filter belum siap.")
    if file.content_type and file.content_type.lower() not in ALLOWED_MIME:
        await file.close()
        raise HTTPException(415, "Gunakan JPG, PNG, atau BMP.")
    filename = file.filename or "uploaded_image"
    try:
        data = await file.read(MAX_FILE_SIZE + 1)
    finally:
        await file.close()
    if not data:
        raise HTTPException(400, "File gambar kosong.")
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(413, "Ukuran gambar maksimal 10 MB.")
    try:
        result = await run_in_threadpool(run_prediction, data)
    except Exception as exc:
        print("Prediction error:", repr(exc))
        raise HTTPException(500, "Terjadi kesalahan saat filter atau prediksi.") from exc
    result["filename"] = filename

    # Guard menolak citra → kembalikan 422 agar frontend bisa membedakan dari prediksi sukses.
    if result.get("status") == "DITOLAK":
        raise HTTPException(
            status_code=422,
            detail=result.get("reason", "Citra ditolak oleh gerbang input."),
        )

    return result
