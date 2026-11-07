// Re-export dari lib/api.ts — semua logika prediksi dan tipe ada di satu tempat.
// File ini dipertahankan agar impor lama (`from "@/lib/gerdApi"`) tidak rusak.
export { predict as predictGerdImage, normalize, ApiError } from "./api";
export type { Prediction as GerdPrediction, Label } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_GERD_API_URL ?? "http://127.0.0.1:8000";

/** Cek apakah backend hidup dan model sudah dimuat. */
export async function checkGerdApi(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
    if (!response.ok) return false;
    const health = await response.json();
    return health.status === "ok" && health.model_loaded === true;
  } catch {
    return false;
  }
}
