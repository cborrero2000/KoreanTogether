import { Dimensions } from "react-native";

/* =========================================================================
   Material Design 3 (Material You) colour token system
   -------------------------------------------------------------------------
   Every colour is a semantic token. Change ONE set of seed values below
   and the whole app re-themes automatically — no hardcoded hex anywhere else.

   Seed palette: Taegeuk Blue (#2D3FE0) primary, Red (#E84B5A) secondary/error.
   Generated with the MD3 tone-palette algorithm (approximated for RN).
   ========================================================================= */

// ── Core palette tones (don't use directly — use semantic tokens below) ──
const palette = {
  // Blue family (primary)
  blue10:  "#0A0F60",
  blue20:  "#1520A3",
  blue30:  "#2131D4",
  blue40:  "#2D3FE0",   // ← key seed
  blue50:  "#4A5BF5",
  blue80:  "#B0BAFF",
  blue90:  "#DDE1FF",
  blue95:  "#EFF0FF",
  blue99:  "#FEFBFF",

  // Violet (secondary / K-drama romanization accent)
  violet20: "#2D1A78",
  violet30: "#4531A0",
  violet40: "#5C47BF",
  violet80: "#C9BEFF",
  violet90: "#E8DFFF",

  // Red family (error / Korean flag red)
  red10:  "#410002",
  red20:  "#690005",
  red30:  "#93000A",
  red40:  "#BA1A1A",
  red50:  "#E84B5A",   // ← key seed
  red80:  "#FFB4AB",
  red90:  "#FFDAD6",

  // Neutral (surface / background)
  n6:   "#F6F7FB",
  n10:  "#EDEDF4",
  n17:  "#E2E3EC",
  n30:  "#C4C5D0",
  n50:  "#78798A",
  n70:  "#5B5C6E",
  n80:  "#444558",
  n87:  "#2E2F43",
  n90:  "#1A1B2E",
  n95:  "#0F1020",

  // Neutral-Variant (borders, outlines)
  nv20: "#3F4055",
  nv30: "#575871",
  nv50: "#75768E",
  nv60: "#8F90AA",
  nv80: "#C6C6E0",
  nv90: "#E2E2F9",

  white: "#FFFFFF",
  black: "#000000",
} as const;

/* ── Light scheme semantic tokens ── */
export const colors = {
  // ── Primary ──────────────────────────────────────────────
  primary:           palette.blue40,        // main brand colour
  onPrimary:         palette.white,         // text/icon ON primary
  primaryContainer:  palette.blue90,        // tinted container
  onPrimaryContainer:palette.blue10,        // text inside primaryContainer

  // ── Secondary (romanization / violet accent) ──────────────
  secondary:           palette.violet40,
  onSecondary:         palette.white,
  secondaryContainer:  palette.violet90,
  onSecondaryContainer:palette.violet20,

  // ── Error / wrong-answer red ──────────────────────────────
  error:           palette.red50,
  onError:         palette.white,
  errorContainer:  palette.red90,
  onErrorContainer:palette.red10,

  // ── Surfaces ──────────────────────────────────────────────
  background:    palette.n6,
  onBackground:  palette.n90,
  surface:       palette.white,
  onSurface:     palette.n90,
  surfaceVariant:  palette.nv90,
  onSurfaceVariant:palette.n70,

  // ── Outline ───────────────────────────────────────────────
  outline:       palette.nv60,
  outlineVariant:palette.nv90,

  // ── Semantic helpers (map to tokens above) ────────────────
  /** Any "correct / success" feedback */
  correct:     "#1F8A4C",
  correctBg:   "#E4F6EA",
  onCorrect:   palette.white,

  // ── Scene / K-drama dark card ─────────────────────────────
  sceneCard:       "#11152B",
  sceneCardBorder: "#11152B",
  sceneHighlight:  "#8FA0FF",  // speaker name
  sceneSubtitle:   palette.white,
  sceneRom:        "#B9C0E0",
  sceneEn:         "#D7DBEC",

  // ── Convenience aliases kept for backward compat ─────────
  /** @deprecated use primary */           bg:          palette.n6,
  /** @deprecated use surface */           card:        palette.white,
  /** @deprecated use onBackground */      text:        palette.n90,
  /** @deprecated use onSurfaceVariant */  textSoft:    palette.n70,
  /** @deprecated use secondary */         rom:         palette.violet40,
  /** @deprecated use outline */           border:      palette.nv90,
  /** @deprecated use error */             wrong:       palette.red50,
  /** @deprecated use errorContainer */    wrongBg:     palette.red90,
  /** @deprecated use surfaceVariant */    neutralBtn:  palette.n10,
  /** pure white */                        white:       palette.white,
  /** accent / tertiary for badges */      accent:      palette.red50,
} as const;

/* ── Elevation (MD3 tonal elevation via alpha blends) ── */
export const elevation = {
  level0: "transparent",
  level1: "rgba(45,63,224,0.05)",   // +5% primary tint
  level2: "rgba(45,63,224,0.08)",
  level3: "rgba(45,63,224,0.11)",
} as const;

/* ── Shape (MD3 corner radii) ── */
export const shape = {
  none:      0,
  extraSmall:4,
  small:     8,
  medium:    12,
  large:     16,
  extraLarge:28,
  full:      999,
} as const;

/** @deprecated use shape.* */
export const radius = {
  sm:  shape.small,
  md:  shape.medium,
  lg:  shape.large,
  pill:shape.full,
} as const;

/* ── Spacing scale ── */
export const spacing = {
  xxs: 2,
  xs:  6,
  sm:  10,
  md:  16,
  lg:  24,
  xl:  36,
  xxl: 48,
} as const;

/* ── Screen helpers ── */
export function isLargeScreen(): boolean {
  return Dimensions.get("window").width >= 700;
}
export function scaledFont(base: number): number {
  return isLargeScreen() ? Math.round(base * 1.2) : base;
}

/* ── MD3-aligned type scale ── */
export const font = {
  // Display / headline
  get displayLarge() { return scaledFont(57); },
  get displayMedium(){ return scaledFont(45); },
  get headlineLarge(){ return scaledFont(32); },
  get headlineMedium(){ return scaledFont(28); },
  get headlineSmall(){ return scaledFont(24); },
  // Title
  get titleLarge()  { return scaledFont(22); },
  get titleMedium() { return scaledFont(16); },
  get titleSmall()  { return scaledFont(14); },
  // Body
  get bodyXL()      { return scaledFont(19); },
  get bodyLarge()   { return scaledFont(16); },
  get bodyMedium()  { return scaledFont(14); },
  // Label
  get labelLarge()  { return scaledFont(14); },
  get labelMedium() { return scaledFont(12); },
  get labelSmall()  { return scaledFont(11); },

  // ── App-specific aliases ──────────────────────────────────
  /** large Hangul display (vocab card, quiz) */
  get hangul()   { return scaledFont(64); },
  /** very large quiz char */
  get hangulXL() { return scaledFont(96); },
  /** emoji large */
  get emojiXL()  { return scaledFont(88); },
  /** emoji medium */
  get emojiLg()  { return scaledFont(64); },
  /** emoji small */
  get emojiMd()  { return scaledFont(48); },
  /** emoji icon in tiles / cards */
  get icon()     { return scaledFont(40); },
  /** speaking avatar in scene */
  get avatar()   { return scaledFont(80); },
  get avatarTalk(){ return scaledFont(88); },

  // ── Backward-compat aliases ───────────────────────────────
  /** @deprecated use headlineLarge */  get title()   { return scaledFont(30); },
  /** @deprecated use headlineSmall */  get heading() { return scaledFont(24); },
  /** @deprecated use bodyLarge */      get body()    { return scaledFont(19); },
  /** @deprecated use titleLarge */     get big()     { return scaledFont(26); },
  /** @deprecated use labelLarge */     get label()   { return scaledFont(16); },
} as const;

/* ── MD3 minimum touch target ── */
export const MIN_TOUCH = 48;

export type AppColors = typeof colors;
