import io
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image, UnidentifiedImageError


class GERDGuard:
    """Filter awal berbasis image-type classifier yang terpisah dari model GERD.

    Guard Mahalanobis lama sengaja tidak digunakan karena embedding dan statistiknya
    dibuat untuk model_gerd_lanjutan.keras, bukan model_gerd_combined.keras.
    """
    def __init__(self, gate_model_path, config_path):
        with open(config_path, encoding="utf-8") as f:
            self.cfg = json.load(f)
        size = self.cfg.get("input_size", [224, 224])
        self.img_size = (int(size[0]), int(size[1]))
        self.threshold = float(self.cfg.get("non_endoscopy_threshold", 0.5))
        self.gate = tf.keras.models.load_model(str(gate_model_path), compile=False)
        if tuple(self.gate.input_shape[1:]) != (*self.img_size, 3):
            raise RuntimeError(f"Input image-type gate tidak cocok: {self.gate.input_shape}")
        if self.gate.output_shape[-1] != 1:
            raise RuntimeError("Gate harus memiliki satu output sigmoid.")

    def check_bytes(self, image_bytes):
        try:
            with Image.open(io.BytesIO(image_bytes)) as im:
                if im.format not in ("JPEG", "PNG", "BMP"):
                    return {"status": "DITOLAK", "alasan": "Format gambar tidak didukung."}, None
                width, height = im.size
                if width * height > 50_000_000 or min(width, height) < 32:
                    return {"status": "DITOLAK", "alasan": "Resolusi gambar tidak memenuhi batas."}, None
                im = im.convert("RGB").resize(
                    (self.img_size[1], self.img_size[0]), Image.Resampling.BILINEAR
                )
                arr = np.asarray(im, dtype=np.float32)
        except (UnidentifiedImageError, OSError, ValueError):
            return {"status": "DITOLAK", "alasan": "File bukan gambar valid atau rusak."}, None

        score = float(np.asarray(self.gate(arr[None, ...], training=False)).reshape(-1)[0])
        score = float(np.clip(score, 0.0, 1.0))
        # Konfigurasi gate: kelas 0=endoscopy, kelas 1=non_endoscopy.
        if score >= self.threshold:
            return {
                "status": "DITOLAK",
                "alasan": "Gambar terdeteksi sebagai non-endoskopi oleh image-type gate.",
                "skor_non_endoscopy": round(score, 6),
                "ambang_non_endoscopy": self.threshold,
            }, None
        return {
            "status": "LOLOS_GATE",
            "skor_non_endoscopy": round(score, 6),
            "ambang_non_endoscopy": self.threshold,
        }, arr
 