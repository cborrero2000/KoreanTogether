import { Platform } from "react-native";

/**
 * Tiny key/value persistence. Uses localStorage on the web (where most of the
 * speaking/recall work happens) and an in-memory fallback on native, so the app
 * never crashes if no storage is available. Values are plain strings — callers
 * JSON-encode their own objects.
 */
const mem: Record<string, string> = {};

export function getItem(key: string): string | null {
  try {
    if (Platform.OS === "web") return (globalThis as any).localStorage?.getItem(key) ?? null;
  } catch {}
  return key in mem ? mem[key] : null;
}

export function setItem(key: string, value: string): void {
  try {
    if (Platform.OS === "web") {
      (globalThis as any).localStorage?.setItem(key, value);
      return;
    }
  } catch {}
  mem[key] = value;
}

export function getJSON<T>(key: string, fallback: T): T {
  const raw = getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON(key: string, value: unknown): void {
  setItem(key, JSON.stringify(value));
}
