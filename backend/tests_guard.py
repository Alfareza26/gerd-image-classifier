
from pathlib import Path
import csv
import requests

API_URL = "http://127.0.0.1:8000/predict"

# Folder untuk gambar yang akan diuji.
# Buat folder ini di dalam backend.
TEST_DIR = Path(__file__).parent / "testing_guard"

# Hasil pengujian disimpan di backend.
OUTPUT_CSV = Path(__file__).parent / "hasil_pengujian_guard.csv"

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}

MIME_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".bmp": "image/bmp",
}

VALID_STATUSES = {"GERD", "GERD_Normal", "TIDAK_PASTI"}


def main():
    if not TEST_DIR.exists():
        print(f"Folder pengujian belum ada: {TEST_DIR}")
        print("Buat folder testing_guard dan subfolder:")
        print("  valid_endoscopy/")
        print("  foreign_images/")
        return

    image_files = [
        p for p in TEST_DIR.rglob("*")
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    if not image_files:
        print(f"Tidak ada gambar JPG, PNG, atau BMP di {TEST_DIR}")
        return

    rows = []
    passed = 0

    for path in image_files:
        # Tentukan jenis gambar berdasarkan foldernya.
        is_valid_image = "valid_endoscopy" in path.parts
        expected = "CITRA_VALID" if is_valid_image else "CITRA_ASING"

        try:
            with path.open("rb") as image:
                response = requests.post(
                    API_URL,
                    files={
                        "file": (
                            path.name,
                            image,
                            MIME_TYPES[path.suffix.lower()]
                        )
                    },
                    timeout=120,
                )

            try:
                data = response.json()
            except ValueError:
                data = {}

            status = data.get("status", "")
            reason = data.get("reason", data.get("alasan", ""))

            if not status:
                status = data.get("prediction", "")

            if response.status_code != 200:
                result = "GAGAL"
                reason = reason or f"HTTP {response.status_code}"
            elif is_valid_image:
                result = (
                    "LULUS"
                    if status in VALID_STATUSES
                    else "GAGAL"
                )
            else:
                result = "LULUS" if status == "DITOLAK" else "GAGAL"

            if result == "LULUS":
                passed += 1

            rows.append({
                "file": str(path.relative_to(TEST_DIR)),
                "jenis_diharapkan": expected,
                "http_code": response.status_code,
                "status_model": status,
                "hasil_uji": result,
                "alasan": reason,
            })

            print(
                f"[{result}] {path.name} | "
                f"status={status} | HTTP={response.status_code}"
            )

        except requests.RequestException as exc:
            rows.append({
                "file": str(path.relative_to(TEST_DIR)),
                "jenis_diharapkan": expected,
                "http_code": "",
                "status_model": "ERROR",
                "hasil_uji": "GAGAL",
                "alasan": str(exc),
            })
            print(f"[GAGAL] {path.name}: {exc}")

    with OUTPUT_CSV.open("w", newline="", encoding="utf-8-sig") as file:
        writer = csv.DictWriter(file, fieldnames=[
            "file",
            "jenis_diharapkan",
            "http_code",
            "status_model",
            "hasil_uji",
            "alasan",
        ])
        writer.writeheader()
        writer.writerows(rows)

    total = len(rows)
    accuracy_uji = passed / total * 100 if total else 0

    print("\n===== RINGKASAN PENGUJIAN =====")
    print(f"Total gambar : {total}")
    print(f"Lulus        : {passed}")
    print(f"Gagal        : {total - passed}")
    print(f"Persentase   : {accuracy_uji:.2f}%")
    print(f"Hasil CSV    : {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
    