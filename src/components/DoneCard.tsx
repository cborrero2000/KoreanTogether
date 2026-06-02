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
  const ok = pct >= 50;
  const emoji = great ? "🎉" : ok ? "👍" : "💪";
  const msg = great ? "정말 잘했어요! Excellent!" : ok ? "잘하고 있어요! Keep going!" : "좋은 시도예요! Practice makes perfect!";
  return (
    <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
      <Text style={{ fontSize: 56 }}>{emoji}</Text>
      <H2 style={{ marginTop: spacing.sm, textAlign: "center" }}>{msg}</H2>
      <Text style={styles.score}>
        {score} / {total}
      </Text>
      <Body style={{ color: colors.textSoft }}>{pct}% correct</Body>
      <Button title="다시 하기 Try again" icon="🔁" onPress={onRestart} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
      <Button title="메뉴로 Back to menu" variant="neutral" onPress={onBack} style={{ marginTop: spacing.sm, alignSelf: "stretch" }} />
    </Card>
  );
}

const styles = StyleSheet.create({
  score: { fontSize: font.title + 14, fontWeight: "900", color: colors.primary, marginTop: spacing.md },
});
