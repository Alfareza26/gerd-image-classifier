import { HISTORY_RECORDS, InspectionRecord, INITIAL_PROBABILITIES } from './data';

const STORAGE_KEY = 'gerd_classifier_records';

export interface PreprocessingStatus {
  bitIntegrity: 'pending' | 'ok' | 'error';
  resizeNormalize: 'pending' | 'ok' | 'error';
  featureExtractionProgress: number; // 0 to 100
}

export function getLocalRecords(): InspectionRecord[] {
  if (typeof window === 'undefined') return HISTORY_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(HISTORY_RECORDS));
      return HISTORY_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return HISTORY_RECORDS;
  }
}

export function saveLocalRecord(record: InspectionRecord): InspectionRecord[] {
  if (typeof window === 'undefined') return HISTORY_RECORDS;
  try {
    const existing = getLocalRecords();
    const updated = [record, ...existing.filter(r => r.code !== record.code)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [record, ...HISTORY_RECORDS];
  }
}

export async function runInferenceSimulation(
  fileName: string,
  onProgress?: (progress: number, stepLabel: string) => void
): Promise<{
  category: 'GERD' | 'Normal' | 'Polyp';
  confidence: number;
  description: string;
  probabilities: typeof INITIAL_PROBABILITIES;
}> {
  return new Promise((resolve) => {
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current < 40) {
        onProgress?.(current, 'Validasi bit citra & normalisasi resolusi...');
      } else if (current < 85) {
        onProgress?.(current, 'Ekstraksi fitur layer konvolusional MobileNetV2...');
      } else if (current < 100) {
        onProgress?.(current, 'Komputasi gradien aktivasi Grad-CAM & softmax...');
      } else {
        clearInterval(interval);
        onProgress?.(100, 'Inferensi selesai');
        
        // Return realistic result
        resolve({
          category: 'GERD',
          confidence: 87.6,
          description: 'Terdeteksi erosi mukosa esofagus distal & break pada Z-line',
          probabilities: INITIAL_PROBABILITIES,
        });
      }
    }, 180);
  });
}
