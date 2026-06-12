import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, H2, Button, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { speak, stopSpeaking } from "../speech/speech";
import { casualPairs } from "../data/content";
import { colors, font, spacing } from "../theme";

export function CasualScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [showEn, setShowEn] = useState(false);

  if (casualPairs.length === 0) {
    return (
      <Screen>
        <ActivityHeader title="반말 Casual Speech" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg }}>
          <Body>No casual-speech pairs available.</Body>
        </Card>
      </Screen>
    );
  }

  const item = casualPairs[i];

  function reset() { setShowEn(false); }
  function next() { stopSpeaking(); setI((i + 1) % casualPairs.length); reset(); }
  function prev() { stopSpeaking(); setI((i - 1 + casualPairs.length) % casualPairs.length); reset(); }

  return (
    <Screen>
      <ActivityHeader title="반말 Casual Speech" onBack={onBack} step={i + 1} total={casualPairs.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Situation */}
        <Text style={s.situation}>{item.situation}</Text>

        {/* Formal (해요체) */}
        <Card style={{ marginTop: spacing.md }}>
          <View style={s.labelRow}>
            <Text style={[s.tag, s.tagFormal]}>존댓말 Formal</Text>
          </View>
          <Text style={s.sentence}>{item.formal.ko}</Text>
          <Rom style={{ fontSize: font.bodyLarge }}>{item.formal.rom}</Rom>
          {showEn && (
            <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xxs }}>
              {item.formal.en}
            </Body>
          )}
          <Button
            title="듣기 Hear (formal)"
            icon="🔊"
            variant="tonal"
            onPress={() => speak(item.formal.ko, { voice: "a" })}
            style={{ marginTop: spacing.md, alignSelf: "stretch" }}
          />
        </Card>

        {/* Casual (반말) */}
        <Card style={{ marginTop: spacing.md }}>
          <View style={s.labelRow}>
            <Text style={[s.tag, s.tagCasual]}>반말 Casual</Text>
          </View>
          <Text style={s.sentence}>{item.casual.ko}</Text>
          <Rom style={{ fontSize: font.bodyLarge }}>{item.casual.rom}</Rom>
          {showEn && (
            <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xxs }}>
              {item.casual.en}
            </Body>
          )}
          <Button
            title="듣기 Hear (casual)"
            icon="🔊"
            variant="tonal"
            onPress={() => speak(item.casual.ko, { voice: "b" })}
            style={{ marginTop: spacing.md, alignSelf: "stretch" }}
          />
        </Card>

        {/* Translation toggle */}
        {!showEn && (
          <Button
            title="뜻 보기 Translation"
            icon="🌐"
            variant="outlined"
            onPress={() => setShowEn(true)}
            style={{ marginTop: spacing.lg }}
          />
        )}

        {/* Note */}
        <Card style={{ marginTop: spacing.lg, backgroundColor: colors.surfaceVariant }}>
          <H2 style={{ fontSize: font.titleMedium, marginBottom: spacing.xs }}>💡 What changes</H2>
          <Body style={{ color: colors.onSurfaceVariant }}>{item.note}</Body>
        </Card>

        {/* Navigation */}
        <View style={s.navRow}>
          <Button title="‹ 이전 Prev" variant="tonal"  onPress={prev} style={{ flex: 1, marginRight: spacing.sm }} />
          <Button title="다음 Next ›" variant="filled" onPress={next} style={{ flex: 1, marginLeft:  spacing.sm }} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  situation: {
    fontSize: font.titleLarge,
    fontWeight: "800",
    color: colors.onBackground,
    marginTop: spacing.md,
  },
  labelRow: { flexDirection: "row", marginBottom: spacing.sm },
  tag: {
    fontSize: font.labelMedium,
    fontWeight: "800",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 999,
    overflow: "hidden",
  },
  tagFormal: { backgroundColor: colors.surfaceVariant, color: colors.onSurfaceVariant },
  tagCasual: { backgroundColor: colors.primaryContainer, color: colors.onPrimaryContainer },
  sentence: {
    fontSize: font.titleLarge,
    fontWeight: "700",
    color: colors.onSurface,
    lineHeight: font.titleLarge * 1.35,
  },
  navRow: { flexDirection: "row", marginTop: spacing.lg },
});
