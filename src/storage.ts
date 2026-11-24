import { Platform } from "react-native";

/**
 * Tiny key/value persistence.
 *  - Web: localStorage.
 *  - Phone/tablet: an in-memory cache that is loaded from one JSON file in the
 *    app's document folder at startup (see hydrateStorage) and written back
 *    whenever a value changes, so voice choice, SRS progress and stats survive
 *    closing the app.
 * Reads stay synchronous so callers don't need to change. Values are plain
 * strings — callers JSON-encode their own objects.
 */
const mem: Record<string, string> = {};
const FILE_NAME = "kt_storage_v1.json";

function filePath(): string | null {
  try {
    const FS = require("expo-file-system/legacy");
    return FS.documentDirectory ? FS.documentDirectory + FILE_NAME : null;
  } catch {
    return null;
  }
}

/** Call once before rendering. Loads saved values into memory on native. */
export async function hydrateStorage(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const FS = require("expo-file-system/legacy");
    const path = filePath();
    if (!path) return;
    const info = await FS.getInfoAsync(path);
    if (!info.exists) return;
    const raw = await FS.readAsStringAsync(path);
    const saved = JSON.parse(raw);
    if (saved && typeof saved === "object") Object.assign(mem, saved);
  } catch {
    // Unreadable/corrupt file — start fresh rather than crash.
  }
}

// Writes are chained so two quick saves can't overwrite each other out of order.
let writeChain: Promise<void> = Promise.resolve();
function persist() {
  const path = filePath();
  if (!path) return;
  const json = JSON.stringify(mem);
  writeChain = writeChain.then(async () => {
    try {
      const FS = require("expo-file-system/legacy");
      await FS.writeAsStringAsync(path, json);
    } catch {}
  });
}

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
  persist();
}

export function removeItem(key: string): void {
  try {
    if (Platform.OS === "web") {
      (globalThis as any).localStorage?.removeItem(key);
      return;
    }
  } catch {}
  delete mem[key];
  persist();
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
