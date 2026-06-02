import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font, radius, spacing } from "../theme";

/** Top bar for every activity: a big Back button, a title and progress. */
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
      <View style={styles.row}>
        <Pressable onPress={onBack} style={({ pressed }) => [styles.back, pressed && { opacity: 0.8 }]}>
          <Text style={styles.backText}>‹ 메뉴 Menu</Text>
        </Pressable>
        {step != null && total != null && (
          <Text style={styles.progress}>
            {step} / {total}
          </Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      {step != null && total != null && (
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${(step / total) * 100}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.sm },
  back: {
    backgroundColor: colors.neutralBtn,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  backText: { fontSize: font.label, fontWeight: "700", color: colors.text },
  progress: { fontSize: font.label, fontWeight: "700", color: colors.textSoft },
  title: { fontSize: font.title, fontWeight: "800", color: colors.text, marginTop: spacing.md },
  barTrack: {
    height: 8,
    backgroundColor: colors.neutralBtn,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.primary },
});
