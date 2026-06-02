import { vocab, speaking } from "./content";

/**
 * A flat pool of bite-size items that the Recall and Exposure modes draw from.
 * Each item has a STABLE id so spaced-repetition progress survives across
 * sessions. Built from vocabulary (word + its example sentence) and the
 * "Say It" sentences. `emoji` doubles as the picture for the visual sense.
 */
export type ReviewItem = {
  id: string;
  ko: string;
  rom: string;
  en: string;
  emoji?: string;
  kind: "word" | "sentence";
};

export const reviewItems: ReviewItem[] = [
  ...vocab.map((v, i) => ({ id: `v${i}`, ko: v.ko, rom: v.rom, en: v.en, emoji: v.emoji, kind: "word" as const })),
  ...vocab.map((v, i) => ({
    id: `vs${i}`,
    ko: v.sentence.ko,
    rom: v.sentence.rom,
    en: v.sentence.en,
    emoji: v.emoji,
    kind: "sentence" as const,
  })),
  ...speaking.map((s, i) => ({ id: `s${i}`, ko: s.ko, rom: s.rom, en: s.en, kind: "sentence" as const })),
];

export function reviewItemById(id: string): ReviewItem | undefined {
  return reviewItems.find((r) => r.id === id);
}
