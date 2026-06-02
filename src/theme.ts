import { Dimensions } from "react-native";

/**
 * A clean, modern, high-contrast theme. Korean (Hangul) text is the star,
 * so type is large and readable with generous spacing and big touch targets.
 * Colors take a cue from the Korean flag: taegeuk blue + red.
 */
export const colors = {
  bg: "#F6F7FB",
  card: "#FFFFFF",
  primary: "#2D3FE0",
  primaryDark: "#1E2BB0",
  accent: "#E84B5A",
  text: "#161A2B",
  textSoft: "#5B6275",
  rom: "#7A6CCB", // romanization text (a soft violet)
  border: "#E2E5EE",
  correct: "#1F8A4C",
  correctBg: "#E4F6EA",
  wrong: "#D23B4E",
  wrongBg: "#FCE8EB",
  neutralBtn: "#EAECF3",
  white: "#FFFFFF",
};

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };

export const spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 36 };

/** Tablets / desktops get larger type and a centered content column. */
export function isLargeScreen(): boolean {
  return Dimensions.get("window").width >= 700;
}

export function scaledFont(base: number): number {
  return isLargeScreen() ? Math.round(base * 1.2) : base;
}

export const font = {
  get title() {
    return scaledFont(30);
  },
  get heading() {
    return scaledFont(24);
  },
  get body() {
    return scaledFont(19);
  },
  get big() {
    return scaledFont(26);
  },
  get label() {
    return scaledFont(16);
  },
  /** Extra-large Hangul display (letters, vocab words). */
  get hangul() {
    return scaledFont(64);
  },
};
