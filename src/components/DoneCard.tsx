import React from "react";
import { StyleSheet, Text } from "react-native";
import { Card, H2, Body, Button } from "./UI";
import { colors, font, spacing } from "../theme";

export function DoneCard({
  score,
  total,
  onRestart,
  onBack,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  onBack: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const great = pct >= 80;
  const ok    = pct >= 50;
  const emoji = great ? "🎉" : ok ? "👍" : "💪";
  const msg   = great
    ? "정말 잘했어요! Excellent!"
    : ok
    ? "잘하고 있어요! Keep going!"
    : "좋은 시도예요! Practice makes perfect!";

  return (
    <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
      <Text style={s.emoji}>{emoji}</Text>
      <H2 style={{ marginTop: spacing.sm, textAlign: "center" }}>{msg}</H2>
      <Text style={s.score}>{score} / {total}</Text>
      <Body style={{ color: colors.onSurfaceVariant }}>{pct}% correct</Body>
      <Button
        title="다시 하기 Try again"
        icon="🔁"
        onPress={onRestart}
        style={{ marginTop: spacing.lg, alignSelf: "stretch" }}
      />
      <Button
        title="메뉴로 Back to menu"
        variant="tonal"
        onPress={onBack}
        style={{ marginTop: spacing.sm, alignSelf: "stretch" }}
      />
    </Card>
  );
}

const s = StyleSheet.create({
  emoji: { fontSize: 56 },
  score: {
    fontSize: font.displayMedium,
    fontWeight: "900",
    color: colors.primary,
    marginTop: spacing.md,
  },
});
