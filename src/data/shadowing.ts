import { speaking, clips } from "./content";

/**
 * Flattened pool of short lines for the Shadowing mode: every "Say It" sentence
 * plus every line of dialogue from the Listening Practice clips, so shadowing
 * draws from the same natural, drama-style speech the rest of the app uses.
 */
export type ShadowItem = { ko: string; rom: string; en: string; source: string };

export const shadowItems: ShadowItem[] = [
  ...speaking.map((s) => ({ ko: s.ko, rom: s.rom, en: s.en, source: "말하기 Say It" })),
  ...clips.flatMap((c) => c.lines.map((l) => ({ ko: l.text, rom: l.rom, en: l.en, source: c.title }))),
];
