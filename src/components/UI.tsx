/**
 * Shared component kit — Material Design 3 aligned.
 *
 * Rules:
 *  - Every colour from colors.* (no raw hex)
 *  - Every size from font.* / spacing.* / shape.*
 *  - Touch targets ≥ MIN_TOUCH (48dp)
 *  - accessibilityRole + accessibilityLabel on all interactive elements
 */
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import {
  colors, font, shape, spacing, isLargeScreen, MIN_TOUCH,
} from "../theme";

/* ── Layout ─────────────────────────────────────────────────────────────── */

/** Centred, max-width content column so the app looks great on wide screens. */
export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.screenOuter}>
      <View style={[s.screenInner, isLargeScreen() && s.screenInnerWide]}>
        {children}
      </View>
    </View>
  );
}

/* ── Cards ───────────────────────────────────────────────────────────────── */

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}

/* ── Typography ─────────────────────────────────────────────────────────── */

export function H1({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[s.h1, style]}>{children}</Text>;
}
export function H2({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[s.h2, style]}>{children}</Text>;
}
export function Body({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[s.body, style]}>{children}</Text>;
}
/** Romanization line — secondary colour, used under Hangul text. */
export function Rom({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[s.rom, style]}>{children}</Text>;
}

/* ── Buttons ─────────────────────────────────────────────────────────────── */

type BtnVariant = "filled" | "tonal" | "outlined" | "text" | "primary" | "neutral" | "accent" | "ghost";

const btnBg: Record<BtnVariant, string> = {
  filled:   colors.primary,
  tonal:    colors.primaryContainer,
  outlined: "transparent",
  text:     "transparent",
  // legacy aliases
  primary:  colors.primary,
  neutral:  colors.neutralBtn,
  accent:   colors.accent,
  ghost:    "transparent",
};
const btnFg: Record<BtnVariant, string> = {
  filled:   colors.onPrimary,
  tonal:    colors.onPrimaryContainer,
  outlined: colors.primary,
  text:     colors.primary,
  primary:  colors.onPrimary,
  neutral:  colors.onBackground,
  accent:   colors.onError,
  ghost:    colors.onBackground,
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  icon,
  style,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}) {
  const bg = btnBg[variant];
  const fg = btnFg[variant];
  const isOutlined = variant === "outlined" || variant === "ghost";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!(disabled || loading) }}
      style={({ pressed }) => [
        s.btn,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.38 : pressed ? 0.88 : 1,
        },
        isOutlined && { borderWidth: 1, borderColor: colors.outline },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[s.btnText, { color: fg }]}>
          {icon ? `${icon}  ` : ""}
          {title}
        </Text>
      )}
    </Pressable>
  );
}

/* ── Choice buttons (answer options) ────────────────────────────────────── */

export function ChoiceButton({
  label,
  sub,
  onPress,
  state = "idle",
  disabled,
}: {
  label: string;
  sub?: string;
  onPress: () => void;
  state?: "idle" | "correct" | "wrong" | "dim";
  disabled?: boolean;
}) {
  const bg =
    state === "correct" ? colors.correctBg
    : state === "wrong"  ? colors.errorContainer
    : colors.surface;
  const border =
    state === "correct" ? colors.correct
    : state === "wrong"  ? colors.error
    : colors.outline;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{
        selected: state === "correct",
        disabled: disabled || state === "dim",
      }}
      style={({ pressed }) => [
        s.choice,
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: state === "dim" ? 0.45 : pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={s.choiceText}>{label}</Text>
        {sub ? <Text style={s.choiceSub}>{sub}</Text> : null}
      </View>
      {state === "correct" && <Text style={[s.mark, { color: colors.correct }]}>✓</Text>}
      {state === "wrong"   && <Text style={[s.mark, { color: colors.error }]}>✕</Text>}
    </Pressable>
  );
}

/* ── Pills / chips ───────────────────────────────────────────────────────── */

export function Pill({
  text,
  tone = "neutral",
}: {
  text: string;
  tone?: "neutral" | "good" | "bad";
}) {
  const bg = tone === "good" ? colors.correctBg
           : tone === "bad"  ? colors.errorContainer
           : colors.surfaceVariant;
  const fg = tone === "good" ? colors.correct
           : tone === "bad"  ? colors.error
           : colors.onSurfaceVariant;
  return (
    <View style={[s.pill, { backgroundColor: bg }]}>
      <Text style={[s.pillText, { color: fg }]}>{text}</Text>
    </View>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */

const s = StyleSheet.create({
  screenOuter: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  screenInner: {
    flex: 1,
    width: "100%",
    paddingHorizontal: spacing.md,
  },
  screenInnerWide: { maxWidth: 760 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: shape.large,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    // MD3 elevation level-1 shadow (best-effort on RN)
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  h1: {
    fontSize: font.headlineLarge,
    fontWeight: "800",
    color: colors.onBackground,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: font.headlineSmall,
    fontWeight: "700",
    color: colors.onBackground,
  },
  body: {
    fontSize: font.bodyLarge,
    color: colors.onBackground,
    lineHeight: font.bodyLarge * 1.5,
  },
  rom: {
    fontSize: font.labelLarge,
    color: colors.secondary,
    fontWeight: "600",
    fontStyle: "italic",
  },

  btn: {
    minHeight: MIN_TOUCH,
    borderRadius: shape.full,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnText: {
    fontSize: font.titleMedium,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  choice: {
    minHeight: MIN_TOUCH + 4,   // 52dp
    borderRadius: shape.medium,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  choiceText: {
    fontSize: font.bodyLarge,
    color: colors.onSurface,
    fontWeight: "600",
    flex: 1,
  },
  choiceSub: {
    fontSize: font.labelMedium,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xxs,
  },
  mark: {
    fontSize: font.headlineSmall,
    fontWeight: "900",
    marginLeft: spacing.sm,
  },

  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: shape.full,
    alignSelf: "flex-start",
  },
  pillText: {
    fontSize: font.labelMedium,
    fontWeight: "700",
  },
});
