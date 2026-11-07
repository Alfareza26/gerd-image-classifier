import json
from pathlib import Path

import numpy as np
import tensorflow as tf


class ImageTypeGate:

    def __init__(self, model_path, config_path):

        self.model_path = Path(model_path)
        self.config_path = Path(config_path)

        if not self.model_path.is_file():
            raise FileNotFoundError(self.model_path)

        if not self.config_path.is_file():
            raise FileNotFoundError(self.config_path)

        with open(self.config_path, encoding="utf-8") as f:
            self.config = json.load(f)

        self.img_size = tuple(
            self.config.get("input_size", [224, 224])
        )

        self.threshold = float(
            self.config.get("non_endoscopy_threshold", 0.5)
        )

        self.model = tf.keras.models.load_model(
            self.model_path,
            compile=False
        )

        print("Image-Type Gate berhasil dimuat")
        print("Input:", self.img_size)
        print("Threshold:", self.threshold)

    def predict(self, image):

        image = image.convert("RGB")

        image = image.resize(
            (self.img_size[1], self.img_size[0]),
            resample=2
        )

        array = np.asarray(image, dtype=np.float32)

        array = np.expand_dims(array, axis=0)

        score = float(
            self.model.predict(array, verbose=0).reshape(-1)[0]
        )

        is_non_endoscopy = score >= self.threshold

        return {
            "status": (
                "NON_ENDOSCOPY"
                if is_non_endoscopy
                else "ENDOSCOPY"
            ),
            "non_endoscopy_score": score,
            "endoscopy_score": 1.0 - score,
            "threshold": self.threshold
        }