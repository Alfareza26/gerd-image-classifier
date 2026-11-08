// Satu-satunya tempat yang tahu bentuk respons backend. Kalau main.py berubah, ubah normalize() saja.
export type Label = "GERD" | "Normal";

export type Prediction = {
  label: Label;
  confidence: number; // 0..1
  probabilities?: Record<string, number>; // 0..1
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const PREDICT_PATH = process.env.NEXT_PUBLIC_PREDICT_PATH || "/predict";

const toUnit = (n: number) => (n > 1 ? n / 100 : n);

// shortcut: nama field ditebak dari beberapa kemungkinan umum, cocokkan dengan respons main.py/hasil_ui.json yang asli.
export function normalize(raw: unknown): Prediction {
  const src = raw as Record<string, any>;
  const r = src?.hasil ?? src?.result ?? src?.prediction_result ?? src;
  const labelRaw = r?.label ?? r?.prediction ?? r?.prediksi ?? r?.kelas ?? r?.class_name ?? r?.predicted_class;
  const conf = r?.confidence ?? r?.probability ?? r?.skor ?? r?.score;
  if (typeof labelRaw !== "string" || typeof conf !== "number") {
    throw new Error("Format respons backend tidak dikenali. Sesuaikan normalize() di lib/api.ts.");
  }
  const probsRaw = r?.probabilities ?? r?.probs ?? r?.scores ?? r?.probabilitas;
  const probabilities = probsRaw && typeof probsRaw === "object"
    ? Object.fromEntries(Object.entries(probsRaw as Record<string, number>).map(([k, v]) => [k, toUnit(Number(v))]))
    : undefined;
  return {
    label: /normal/i.test(labelRaw) ? "Normal" : "GERD",
    confidence: toUnit(conf),
    probabilities,
  };
}

function errorMessage(body: any, status: number): string {
  const d = body?.detail ?? body?.message ?? body?.error;
  if (typeof d === "string") return d;
  if (d && typeof d === "object") return d.message ?? d.pesan ?? d.reason ?? JSON.stringify(d);
  return `Server menjawab dengan status ${status}.`;
}

export async function predict(file: File): Promise<Prediction> {
  const form = new FormData();
  form.append("file", file); // nama field "file" mengikuti konvensi FastAPI UploadFile
  let res: Response;
  try {
    res = await fetch(`/api${PREDICT_PATH}`, { method: "POST", body: form });
  } catch {
    throw new ApiError(0, "Backend tidak terjangkau. Pastikan uvicorn berjalan dan BACKEND_URL benar.");
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, errorMessage(body, res.status));
  return normalize(body);
}
