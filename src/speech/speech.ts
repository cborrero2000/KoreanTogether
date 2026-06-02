import { Platform } from "react-native";
import * as Speech from "expo-speech";

/* ================================================================== */
/*  TEXT TO SPEECH  (Korean)                                          */
/*  Goal: sound as natural as the device allows by choosing the best   */
/*  available "neural / natural" Korean voice instead of the robotic    */
/*  default — and make two dialog speakers sound like different people. */
/* ================================================================== */

export const LANG = "ko-KR";

export type VoiceInfo = {
  id: string; // identifier we pass back to speak()
  name: string; // friendly name shown in the picker
  lang: string;
  natural: boolean; // true for neural / enhanced / online voices
};

let webVoices: SpeechSynthesisVoice[] = [];
let nativeVoices: Speech.Voice[] = [];
let autoVoiceA: string | null = null; // best voice (primary)
let autoVoiceB: string | null = null; // a different voice, for dialog variety
let userVoiceId: string | null = null; // manual override (null = automatic)
let ready = false;

const NEURAL = /natural|neural|enhanced|premium|online/i;
// Known good-sounding Korean voices across platforms (Edge/Chrome/Apple/Android).
const NICE = /google|yuna|sunhi|sun-hi|injoon|in-joon|heami|seoyeon|jimin|nara|hyunsu/i;
// Loose gender heuristic so dialog speakers can differ (Korean names are tricky).
const FEMALE = /yuna|sunhi|sun-hi|heami|seoyeon|nara|aria|female|woman/i;
const MALE = /injoon|in-joon|jimin|hyunsu|male|\bman\b/i;

function isKo(lang: string): boolean {
  return /^ko/i.test(lang || "");
}

/* ---------- web voice handling ---------- */

function scoreWeb(v: SpeechSynthesisVoice): number {
  let s = 0;
  const n = v.name.toLowerCase();
  if (NEURAL.test(n)) s += 200;
  if (/google/.test(n)) s += 90;
  if (v.localService === false) s += 70;
  if (NICE.test(n)) s += 40;
  if (/ko[-_]kr/i.test(v.lang)) s += 15;
  return s;
}

function gender(name: string): "f" | "m" | "?" {
  if (FEMALE.test(name)) return "f";
  if (MALE.test(name)) return "m";
  return "?";
}

function autoPickWeb() {
  const korean = webVoices.filter((v) => isKo(v.lang));
  const pool = (korean.length ? korean : webVoices).slice();
  pool.sort((a, b) => scoreWeb(b) - scoreWeb(a));
  if (pool.length === 0) return;
  autoVoiceA = pool[0].voiceURI;
  // Pick B: prefer a different gender than A for natural-sounding dialogs.
  const gA = gender(pool[0].name);
  const diff = pool.find((v) => v.voiceURI !== autoVoiceA && gender(v.name) !== gA && gender(v.name) !== "?");
  autoVoiceB = (diff || pool[1] || pool[0]).voiceURI;
}

function loadWebVoices(): Promise<void> {
  return new Promise((resolve) => {
    const synth = (globalThis as any).speechSynthesis as SpeechSynthesis | undefined;
    if (!synth) return resolve();
    const grab = () => {
      const v = synth.getVoices();
      if (v.length) {
        webVoices = v;
        autoPickWeb();
        resolve();
      }
    };
    const existing = synth.getVoices();
    if (existing.length) {
      webVoices = existing;
      autoPickWeb();
      return resolve();
    }
    synth.onvoiceschanged = grab;
    setTimeout(grab, 1200); // safety net if the event never fires
  });
}

/* ---------- native voice handling ---------- */

async function loadNativeVoices() {
  try {
    nativeVoices = await Speech.getAvailableVoicesAsync();
  } catch {
    nativeVoices = [];
  }
  const korean = nativeVoices.filter((v) => isKo(v.language || ""));
  const score = (v: Speech.Voice) => {
    let s = 0;
    if (v.quality === Speech.VoiceQuality.Enhanced) s += 100;
    if (NEURAL.test(v.name || "") || NEURAL.test(v.identifier || "")) s += 120;
    if (NICE.test(v.name || "")) s += 30;
    return s;
  };
  const pool = korean.slice().sort((a, b) => score(b) - score(a));
  if (pool.length) {
    autoVoiceA = pool[0].identifier;
    const gA = gender(pool[0].name || pool[0].identifier);
    const diff = pool.find(
      (v) => v.identifier !== autoVoiceA && gender(v.name || v.identifier) !== gA && gender(v.name || v.identifier) !== "?"
    );
    autoVoiceB = (diff || pool[1] || pool[0]).identifier;
  }
}

/* ---------- public init + voice selection ---------- */

export async function initSpeech(): Promise<void> {
  if (ready) return;
  // restore saved choice (web only — localStorage)
  try {
    if (Platform.OS === "web") {
      userVoiceId = (globalThis as any).localStorage?.getItem("kt_voice") || null;
    }
  } catch {}
  if (Platform.OS === "web") await loadWebVoices();
  else await loadNativeVoices();
  ready = true;
}

/** Korean voices available on this device, for the picker UI. */
export function listVoices(): VoiceInfo[] {
  if (Platform.OS === "web") {
    return webVoices
      .filter((v) => isKo(v.lang))
      .map((v) => ({ id: v.voiceURI, name: v.name, lang: v.lang, natural: NEURAL.test(v.name) || v.localService === false }))
      .sort((a, b) => Number(b.natural) - Number(a.natural) || a.name.localeCompare(b.name));
  }
  return nativeVoices
    .filter((v) => isKo(v.language || ""))
    .map((v) => ({
      id: v.identifier,
      name: v.name || v.identifier,
      lang: v.language || "ko-KR",
      natural: v.quality === Speech.VoiceQuality.Enhanced || NEURAL.test(v.name || ""),
    }))
    .sort((a, b) => Number(b.natural) - Number(a.natural) || a.name.localeCompare(b.name));
}

export function getPreferredVoiceId(): string | null {
  return userVoiceId; // null means "automatic best"
}

export function setPreferredVoiceId(id: string | null) {
  userVoiceId = id;
  try {
    if (Platform.OS === "web") {
      const ls = (globalThis as any).localStorage;
      if (id) ls?.setItem("kt_voice", id);
      else ls?.removeItem("kt_voice");
    }
  } catch {}
}

/** Whether this device offers at least one genuinely natural Korean voice. */
export function hasNaturalVoice(): boolean {
  return listVoices().some((v) => v.natural);
}

/** True if any Korean voice at all is installed. */
export function hasAnyVoice(): boolean {
  return listVoices().length > 0;
}

function resolveVoiceId(which: "a" | "b" | undefined): string | null {
  if (userVoiceId) {
    // Honor the user's pick for the main speaker; keep variety for "b".
    if (which === "b") return autoVoiceB && autoVoiceB !== userVoiceId ? autoVoiceB : userVoiceId;
    return userVoiceId;
  }
  return which === "b" ? autoVoiceB ?? autoVoiceA : autoVoiceA;
}

/* ---------- speak ---------- */

export type SpeakOpts = {
  rate?: number;
  voice?: "a" | "b"; // "a" = main speaker, "b" = the other person in a dialog
  voiceId?: string; // explicit voice (used by the picker's "Try it")
  onDone?: () => void;
  onStart?: () => void;
};

// When only one Korean voice exists, give speaker "b" a different pitch so the
// two people in a dialog don't sound identical.
function pitchFor(which: "a" | "b" | undefined, sameVoice: boolean): number {
  if (which === "b") return sameVoice ? 0.82 : 0.9;
  return 1.04;
}

export function speak(text: string, opts?: SpeakOpts) {
  if (Platform.OS === "web") speakWeb(text, opts);
  else speakNative(text, opts);
}

function speakWeb(text: string, opts?: SpeakOpts) {
  const synth = (globalThis as any).speechSynthesis as SpeechSynthesis | undefined;
  if (!synth) return;
  synth.cancel();
  const u = new (globalThis as any).SpeechSynthesisUtterance(text) as SpeechSynthesisUtterance;
  const id = opts?.voiceId ?? resolveVoiceId(opts?.voice);
  const v = id ? webVoices.find((x) => x.voiceURI === id) : null;
  if (v) {
    u.voice = v;
    u.lang = v.lang;
  } else {
    u.lang = LANG;
  }
  u.rate = opts?.rate ?? 0.95; // close to natural; the "Slower" button passes a lower value
  u.pitch = pitchFor(opts?.voice, autoVoiceA === autoVoiceB || !!opts?.voiceId);
  if (opts?.onStart) u.onstart = opts.onStart;
  u.onend = () => opts?.onDone?.();
  u.onerror = () => opts?.onDone?.();
  synth.speak(u);
}

function speakNative(text: string, opts?: SpeakOpts) {
  Speech.stop();
  const id = opts?.voiceId ?? resolveVoiceId(opts?.voice);
  Speech.speak(text, {
    language: LANG,
    voice: id ?? undefined,
    rate: opts?.rate ?? 0.95,
    pitch: pitchFor(opts?.voice, autoVoiceA === autoVoiceB || !!opts?.voiceId),
    onStart: opts?.onStart,
    onDone: opts?.onDone,
    onStopped: opts?.onDone,
    onError: opts?.onDone,
  });
}

export function stopSpeaking() {
  if (Platform.OS === "web") (globalThis as any).speechSynthesis?.cancel();
  else Speech.stop();
}

/* ================================================================== */
/*  SPEECH TO TEXT  (browser Web Speech API; native falls back to       */
/*  typed input in the screens that use it)                            */
/* ================================================================== */

export function isRecognitionAvailable(): boolean {
  if (Platform.OS !== "web") return false;
  const w = globalThis as any;
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export type RecognitionHandle = { stop: () => void };

export function startRecognition(handlers: {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}): RecognitionHandle | null {
  if (!isRecognitionAvailable()) return null;
  const w = globalThis as any;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  const rec = new Ctor();
  rec.lang = LANG;
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  rec.onresult = (event: any) => {
    let transcript = "";
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) isFinal = true;
    }
    handlers.onResult(transcript.trim(), isFinal);
  };
  rec.onerror = (e: any) => handlers.onError?.(e?.error || "Recognition error");
  rec.onend = () => handlers.onEnd?.();

  try {
    rec.start();
  } catch {
    return null;
  }
  return { stop: () => rec.stop() };
}

/* ================================================================== */
/*  Scoring helpers — compare what they said to the target sentence.    */
/*  Korean has flexible spacing and particles, so we compare on a       */
/*  space-stripped, punctuation-free string using edit distance.        */
/* ================================================================== */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'’“”\-…~()\[\]]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}

/** 0..1 similarity between the target sentence and what was spoken. */
export function matchScore(target: string, spoken: string): number {
  const t = normalize(target);
  const s = normalize(spoken);
  if (!t) return 0;
  if (!s) return 0;
  const dist = levenshtein(t, s);
  const sim = 1 - dist / Math.max(t.length, s.length);
  return Math.max(0, sim);
}

export function isCloseEnough(target: string, spoken: string, threshold = 0.6): boolean {
  return matchScore(target, spoken) >= threshold;
}

/**
 * For Talk Back: does the spoken reply match any acceptable answer?
 * Accepts an exact-ish match (edit distance) OR a normalized substring hit
 * so short key phrases ("네", "감사합니다") count inside a longer reply.
 */
export function acceptMatch(accept: string[], spoken: string): boolean {
  const s = normalize(spoken);
  if (!s) return false;
  return accept.some((a) => {
    const na = normalize(a);
    if (!na) return false;
    if (s.includes(na) || na.includes(s)) return true;
    return matchScore(a, spoken) >= 0.7;
  });
}
