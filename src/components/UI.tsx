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
import { colors, font, radius, spacing, isLargeScreen } from "../theme";

/** Centered, max-width content column so the app looks good on wide screens. */
export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.screenOuter}>
      <View style={[styles.screenInner, isLargeScreen() && styles.screenInnerWide]}>
        {children}
      </View>
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function H1({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.h1, style]}>{children}</Text>;
}

export function H2({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.h2, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

/** Romanization line — soft violet, used under Hangul text. */
export function Rom({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.rom, style]}>{children}</Text>;
}

type BtnVariant = "primary" | "neutral" | "accent" | "ghost";

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
}) {
  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "accent"
      ? colors.accent
      : variant === "ghost"
      ? "transparent"
      : colors.neutralBtn;
  const fg =
    variant === "primary" || variant === "accent" ? colors.white : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === "ghost" && styles.btnGhost,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.btnText, { color: fg }]}>
          {icon ? icon + "  " : ""}
          {title}
        </Text>
      )}
    </Pressable>
  );
}

/** Large answer-choice button with optional correct/wrong state coloring. */
export function ChoiceButton({
  label,
  sub,
  onPress,
  state = "idle",
  disabled,
}: {
  label: string;
  sub?: string; // optional second line (e.g. romanization or translation)
  onPress: () => void;
  state?: "idle" | "correct" | "wrong" | "dim";
  disabled?: boolean;
}) {
  const bg =
    state === "correct"
      ? colors.correctBg
      : state === "wrong"
      ? colors.wrongBg
      : colors.card;
  const border =
    state === "correct"
      ? colors.correct
      : state === "wrong"
      ? colors.wrong
      : colors.border;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.choice,
        { backgroundColor: bg, borderColor: border, opacity: state === "dim" ? 0.55 : pressed ? 0.9 : 1 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.choiceText}>{label}</Text>
        {sub ? <Text style={styles.choiceSub}>{sub}</Text> : null}
      </View>
      {state === "correct" && <Text style={styles.mark}>✓</Text>}
      {state === "wrong" && <Text style={[styles.mark, { color: colors.wrong }]}>✕</Text>}
    </Pressable>
  );
}

export function Pill({ text, tone = "neutral" }: { text: string; tone?: "neutral" | "good" | "bad" }) {
  const bg = tone === "good" ? colors.correctBg : tone === "bad" ? colors.wrongBg : colors.neutralBtn;
  const fg = tone === "good" ? colors.correct : tone === "bad" ? colors.wrong : colors.textSoft;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenOuter: { flex: 1, backgroundColor: colors.bg, alignItems: "center" },
  screenInner: { flex: 1, width: "100%", paddingHorizontal: spacing.md },
  screenInnerWide: { maxWidth: 760 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  h1: { fontSize: font.title, fontWeight: "800", color: colors.text },
  h2: { fontSize: font.heading, fontWeight: "700", color: colors.text },
  body: { fontSize: font.body, color: colors.text, lineHeight: font.body * 1.45 },
  rom: { fontSize: font.label, color: colors.rom, fontWeight: "600", fontStyle: "italic" },
  btn: {
    minHeight: 60,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  btnGhost: { borderWidth: 2, borderColor: colors.border },
  btnText: { fontSize: font.big, fontWeight: "700" },
  choice: {
    minHeight: 68,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  choiceText: { fontSize: font.body, color: colors.text, fontWeight: "600" },
  choiceSub: { fontSize: font.label, color: colors.textSoft, marginTop: 3 },
  mark: { fontSize: font.heading, color: colors.correct, fontWeight: "900", marginLeft: spacing.sm },
  pill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, alignSelf: "flex-start" },
  pillText: { fontSize: font.label, fontWeight: "700" },
});
