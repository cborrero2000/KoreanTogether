import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font, shape, spacing, MIN_TOUCH } from "../theme";

/** Top bar for every activity: a big accessible Back button, title and progress bar. */
export function ActivityHeader({
  title,
  onBack,
  step,
  total,
}: {
  title: string;
  onBack: () => void;
  step?: number;
  total?: number;
}) {
  return (
    <View>
      <View style={s.row}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back to menu"
          style={({ pressed }) => [s.back, pressed && { opacity: 0.8 }]}
        >
          <View style={s.backArrow} />
          <Text style={s.backText}>메뉴 Menu</Text>
        </Pressable>
        {step != null && total != null && (
          <Text style={s.progress} accessibilityLabel={`Step ${step} of ${total}`}>
            {step} / {total}
          </Text>
        )}
      </View>
      <Text style={s.title}>{title}</Text>
      {step != null && total != null && (
        <View
          style={s.barTrack}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: total, now: step }}
        >
          <View style={[s.barFill, { width: `${(step / total) * 100}%` }]} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  back: {
    backgroundColor: colors.surfaceVariant,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: shape.full,
    minHeight: MIN_TOUCH,
    minWidth: MIN_TOUCH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    width: 14,
    height: 14,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: colors.onSurface,
    transform: [{ rotate: "135deg" }],
    marginRight: spacing.sm,
  },
  backText: {
    fontSize: font.labelLarge,
    fontWeight: "700",
    color: colors.onSurface,
  },
  progress: {
    fontSize: font.labelLarge,
    fontWeight: "700",
    color: colors.onSurfaceVariant,
  },
  title: {
    fontSize: font.headlineLarge,
    fontWeight: "800",
    color: colors.onBackground,
    marginTop: spacing.md,
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
