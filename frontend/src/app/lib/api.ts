const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

/**
 * Kontrak respons dari backend POST /predict.
 *
 * Backend mengembalikan field berikut:
 *   prediction : "GERD" | "GERD_Normal" | "DITOLAK"
 *   status     : sama dengan prediction
 *   confidence : number (0–1) atau null jika DITOLAK
 *   probabilities : { GERD: number, GERD_Normal: number } | null
 *   skor_gerd  : number | undefined  (hanya saat lolos gate)
 *   threshold  : number | undefined
 *   guard      : boolean
 *   gate       : object   (detail image-type gate)
 *   reason     : string
 *   model      : string
 *   disclaimer : string
 *   filename   : string
 */
export type GateResult = {
  status: string;
  alasan?: string;
  skor_non_endoscopy?: number;
  ambang_non_endoscopy?: number;
};

export type Prediction = {
  prediction: string;
  status: string;
  confidence: number | null;
  probabilities: { GERD: number; GERD_Normal: number } | null;
  skor_gerd?: number;
  threshold?: number;
  guard: boolean;
  gate: GateResult;
  reason: string;
  model: string;
  disclaimer: string;
  filename: string;
};

/**
 * Kirim citra endoskopi ke backend untuk klasifikasi.
 * Backend hanya menerima field `file` (UploadFile).
 */
export async function classify(file: File): Promise<Prediction> {
  const body = new FormData();
  body.append('file', file);

  const res = await fetch(`${API}/predict`, { method: 'POST', body });

  if (!res.ok) {
    // FastAPI mengembalikan { detail: "..." } pada error
    let detail = `Server menjawab ${res.status}`;
    try {
      const err = await res.json();
      if (err.detail) detail = err.detail;
    } catch {
      /* respons bukan JSON, gunakan pesan default */
    }
    throw new Error(detail);
  }

  return res.json();
}

/**
 * Cek kesehatan backend.
 */
export async function checkHealth(): Promise<{ status: string; model_loaded: boolean }> {
  const res = await fetch(`${API}/health`);
  if (!res.ok) throw new Error(`Health check gagal: ${res.status}`);
  return res.json();
}
