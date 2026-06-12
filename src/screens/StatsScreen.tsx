import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { reviewItems } from "../data/review";
import { dueCount, stats } from "../srs";
import { getStats, isStreakActiveToday } from "../stats";
import { colors, font, shape, spacing } from "../theme";

export function StatsScreen({ onBack }: { onBack: () => void }) {
  const data = getStats();
  const due = dueCount(reviewItems.map((r) => r.id));
  const srsStats = stats(reviewItems.map((r) => r.id));
  const modes = Object.entries(data.byMode).sort((a, b) => b[1].sessions - a[1].sessions);

  const streakLabel = data.streak === 0
    ? "Start a session to begin your streak!"
    : isStreakActiveToday(data)
    ? `${data.streak} day${data.streak === 1 ? "" : "s"} — today counts!`
    : `${data.streak} day${data.streak === 1 ? "" : "s"} — practice today to keep it going!`;

  return (
    <Screen>
      <ActivityHeader title="진행 상황 Progress" onBack={onBack} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Streak */}
        <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
          <Text style={s.streakEmoji}>🔥</Text>
          <Text style={s.streakNum}>{data.streak}</Text>
          <Body style={{ color: colors.onSurfaceVariant, textAlign: "center" }}>{streakLabel}</Body>
        </Card>

        {/* Totals */}
        <View style={s.totalsRow}>
          <Card style={{ ...s.totalCard, marginRight: spacing.sm }}>
            <Text style={s.totalNum}>{data.totalSessions}</Text>
            <Body style={{ color: colors.onSurfaceVariant, textAlign: "center" }}>Sessions completed</Body>
          </Card>
          <Card style={{ ...s.totalCard, marginLeft: spacing.sm }}>
            <Text style={s.totalNum}>{due}</Text>
            <Body style={{ color: colors.onSurfaceVariant, textAlign: "center" }}>
              Cards due now (of {srsStats.total})
            </Body>
          </Card>
        </View>

        {/* Per-mode accuracy */}
        <H2 style={{ marginTop: spacing.lg }}>모드별 정확도 · Accuracy by mode</H2>
        {modes.length === 0 ? (
          <Card style={{ marginTop: spacing.sm }}>
            <Body style={{ color: colors.onSurfaceVariant }}>
              Finish any activity to see your stats here.
            </Body>
          </Card>
        ) : (
          modes.map(([key, m]) => {
            const pct = m.total > 0 ? Math.round((m.correct / m.total) * 100) : 0;
            return (
              <Card key={key} style={{ marginTop: spacing.sm }}>
                <View style={s.modeRow}>
                  <Body style={{ fontWeight: "700", flex: 1 }}>{m.label}</Body>
                  <Body style={{ color: colors.onSurfaceVariant }}>{m.sessions}×</Body>
                </View>
                <View style={s.barTrack}>
                  <View style={[s.barFill, { width: `${pct}%` }]} />
                </View>
                <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xxs }}>
                  {pct}% correct overall
                </Body>
              </Card>
            );
          })
        )}

        {/* SRS box breakdown */}
        <H2 style={{ marginTop: spacing.lg }}>기억 카드 · Recall boxes</H2>
        <Card style={{ marginTop: spacing.sm }}>
          <Body style={{ color: colors.onSurfaceVariant }}>
            {srsStats.total} cards total — {srsStats.studied} studied at least once, {srsStats.mature} well-retained.
          </Body>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  streakEmoji: { fontSize: 48 },
  streakNum: {
    fontSize: font.displayMedium,
    fontWeight: "900",
    color: colors.primary,
    marginTop: spacing.xs,
  },
  totalsRow: {
    flexDirection: "row",
    marginTop: spacing.md,
  },
  totalCard: {
    flex: 1,
    alignItems: "center",
  },
  totalNum: {
    fontSize: font.headlineLarge,
    fontWeight: "800",
    color: colors.onSurface,
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: shape.full,
    marginTop: spacing.sm,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: shape.full,
  },
});
