import io
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image


class GERDGuard:
    def __init__(self, model, guard_dir, model_path=None):
        if model is None:
            raise ValueError("Model belum dimuat; Guard butuh model yang sudah siap.")

        self.model = model
        self.guard_dir = Path(guard_dir)

        config_path = self.guard_dir / "gerd_guard_config.json"
        npz_path = self.guard_dir / "gerd_guard.npz"

        if not config_path.is_file() or not npz_path.is_file():
            raise FileNotFoundError(
                "File Guard tidak lengkap: gerd_guard_config.json "
                "dan gerd_guard.npz wajib tersedia di "
                f"{self.guard_dir}."
            )

        with open(config_path, encoding="utf-8") as f:
            self.cfg = json.load(f)

        # Jangan gunakan statistik Guard dari model yang berbeda.
        expected_model = self.cfg.get("model_path")
        if model_path and expected_model:
            expected_name = Path(expected_model).name
            actual_name = Path(model_path).name
            if expected_name != actual_name:
                raise ValueError(
                    f"Guard dibuat untuk {expected_name}, "
                    f"tetapi backend memakai {actual_name}. "
                    "Gunakan model yang cocok atau buat ulang Guard."
                )

        # img_size boleh berupa [H, W] atau satu angka.
        size = self.cfg["img_size"]
        if isinstance(size, (list, tuple)):
            self.img_size = (int(size[0]), int(size[1]))
        else:
            self.img_size = (int(size), int(size))

        self.tta = bool(self.cfg.get("tta", True))
        self.threshold = float(self.cfg["threshold_calibrated"])
        self.delta = float(self.cfg["uncertain_delta_logit"])
        self.ood_threshold = float(self.cfg["ood_threshold"])
        self.max_pixels = int(self.cfg["max_pixels"])
        self.min_side = int(self.cfg["min_side"])
        self.a = float(self.cfg["platt"]["a"])
        self.b = float(self.cfg["platt"]["b"])

        with np.load(npz_path) as data:
            self.mu0 = data["mu0"].astype(np.float64)
            self.mu1 = data["mu1"].astype(np.float64)
            self.precision = data["precision"].astype(np.float64)
            self.stat_lo = data["stat_lo"].astype(np.float32)
            self.stat_hi = data["stat_hi"].astype(np.float32)

        gap = next(
            (
                layer
                for layer in self.model.layers
                if isinstance(
                    layer, tf.keras.layers.GlobalAveragePooling2D
                )
            ),
            None,
        )
        if gap is None:
            raise RuntimeError(
                "GlobalAveragePooling2D tidak ditemukan pada model."
            )

        self.feature_model = tf.keras.Model(
            self.model.input, gap.output
        )

    @staticmethod
    def _logit(p):
        p = np.clip(np.asarray(p, dtype=np.float64), 1e-6, 1 - 1e-6)
        return np.log(p / (1 - p))

    @staticmethod
    def _sigmoid(z):
        z = np.clip(z, -60, 60)
        return 1.0 / (1.0 + np.exp(-z))

    def _statistics(self, x):
        # x: (N, H, W, 3), nilai 0-255.
        x = np.asarray(x, dtype=np.float32)
        n = x.shape[0]

        gray = x @ np.array(
            [0.299, 0.587, 0.114], dtype=np.float32
        )
        gray = gray.reshape(n, -1)

        mx = x.max(axis=-1)
        mn = x.min(axis=-1)
        saturation = (
            (mx - mn) / (mx + 1e-6)
        ).reshape(n, -1).mean(axis=1)

        return np.stack(
            [gray.mean(axis=1), gray.std(axis=1), saturation],
            axis=1,
        )

    def _mahalanobis(self, embedding):
        embedding = embedding.astype(np.float64)
        distances = []

        for mu in (self.mu0, self.mu1):
            diff = embedding - mu
            distance = ((diff @ self.precision) * diff).sum(axis=1)
            distances.append(distance)

        return np.min(distances, axis=0)

    def predict_bytes(self, image_bytes):
        # 1. Validasi dan preprocessing, mengikuti pipeline training.
        try:
            with Image.open(io.BytesIO(image_bytes)) as im:
                if im.format not in ("JPEG", "PNG", "BMP"):
                    return {
                        "status": "DITOLAK",
                        "alasan": "Format gambar tidak didukung.",
                    }

                w, h = im.size
                if w * h > self.max_pixels:
                    return {
                        "status": "DITOLAK",
                        "alasan": "Resolusi gambar terlalu besar.",
                    }

                if min(w, h) < self.min_side:
                    return {
                        "status": "DITOLAK",
                        "alasan": "Resolusi gambar terlalu kecil.",
                    }

                im = im.convert("RGB")
                im = im.resize(
                    (self.img_size[1], self.img_size[0]),
                    Image.Resampling.BILINEAR,
                )
                arr = np.asarray(im, dtype=np.uint8)

        except Exception:
            return {
                "status": "DITOLAK",
                "alasan": "File bukan gambar valid atau rusak.",
            }

        x = arr.astype(np.float32)[None, ...]

        # 2. Filter statistik gambar.
        stats = self._statistics(x)
        outside = (
            (stats < self.stat_lo) | (stats > self.stat_hi)
        ).any(axis=1)

        if outside[0]:
            return {
                "status": "DITOLAK",
                "alasan": (
                    "Kecerahan, kontras, atau saturasi di luar "
                    "rentang citra endoskopi pada data latih."
                ),
                "statistik": stats[0].round(4).tolist(),
            }

        # 3. Filter OOD berbasis fitur model.
        embedding = self.feature_model.predict(x, verbose=0)
        distance = float(self._mahalanobis(embedding)[0])

        if distance > self.ood_threshold:
            return {
                "status": "DITOLAK",
                "alasan": (
                    "Fitur gambar terlalu jauh dari citra latih "
                    "menurut ambang OOD."
                ),
                "jarak_ood": distance,
            }

        # 4. Prediksi model dan Test-Time Augmentation (TTA).
        # Semua varian digabung jadi satu batch agar hanya satu panggilan predict.
        batches = [x]
        if self.tta:
            batches.append(x[:, :, ::-1, :].copy())  # flip horizontal
            batches.append(x[:, ::-1, :, :].copy())  # flip vertikal

        scores = np.asarray(
            self.model.predict(
                np.concatenate(batches, axis=0), verbose=0
            )
        ).reshape(len(batches), -1)

        p_raw = float(scores[:, 0].mean())

        # 5. Kalibrasi Platt.
        p_cal = float(
            self._sigmoid(
                self.a * self._logit([p_raw])[0] + self.b
            )
        )

        # 6. Pita ketidakpastian di sekitar threshold.
        distance_from_threshold = abs(
            float(self._logit([p_cal])[0])
            - float(self._logit([self.threshold])[0])
        )

        common = {
            "skor_gerd": p_cal,
            "skor_mentah": p_raw,
            "threshold": self.threshold,
            "jarak_ood": distance,
        }

        if distance_from_threshold < self.delta:
            return {
                "status": "TIDAK_PASTI",
                "alasan": (
                    "Skor terlalu dekat dengan batas keputusan. "
                    "Citra perlu ditinjau tenaga medis."
                ),
                **common,
            }

        status = "GERD" if p_cal >= self.threshold else "GERD_Normal"

        return {
            "status": status,
            "alasan": "",
            **common,
        }