"use client";
import { useEffect, useState } from "react";
import type { Label } from "./api";

export type HistoryRecord = {
  id: string; patientId: string; age: number; sex: string; notes: string;
  at: string; file: string; thumb: string;
  label: Label; confidence: number; probabilities?: Record<string, number>;
};
export type Profile = { name: string; email: string; phone: string; institution: string; role: string; threshold: number };

export const HISTORY_KEY = "gerd.history";
export const PROFILE_KEY = "gerd.profile";
export const DEFAULT_PROFILE: Profile = { name: "", email: "", phone: "", institution: "", role: "", threshold: 85 };

function read<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* kuota penuh atau mode privat */ }
}

// Riwayat dan profil disimpan di browser. shortcut: tidak ada endpoint riwayat di backend, pindahkan ke DB bila perlu lintas perangkat.
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => { setValue(read(key, fallback)); setReady(true); }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (next: T) => { setValue(next); write(key, next); };
  return [value, set, ready] as const;
}

export function addRecord(rec: HistoryRecord) {
  write(HISTORY_KEY, [rec, ...read<HistoryRecord[]>(HISTORY_KEY, [])]);
}

export async function makeThumb(file: File, width = 128): Promise<string> {
  try {
    const bmp = await createImageBitmap(file);
    const c = document.createElement("canvas");
    c.width = width; c.height = Math.round((bmp.height / bmp.width) * width);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.6);
  } catch { return ""; }
}
