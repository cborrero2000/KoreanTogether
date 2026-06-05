import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { speak, stopSpeaking } from "../speech/speech";
import { vocab } from "../data/content";
import { colors, font, spacing } from "../theme";

export function VocabScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [showSentence, setShowSentence] = useState(false);
  const [showEn, setShowEn] = useState(false);

  if (vocab.length === 0) {
    return (
      <Screen>
        <ActivityHeader title="단어 Vocabulary" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg }}>
          <Body>No vocabulary items available.</Body>
        </Card>
      </Screen>
    );
  }

  const item = vocab[i];

  function reset() { setShowSentence(false); setShowEn(false); }
  function next() { stopSpeaking(); setI((i + 1) % vocab.length); reset(); }
  function prev() { stopSpeaking(); setI((i - 1 + vocab.length) % vocab.length); reset(); }

  return (
    <Screen>
      <ActivityHeader title="단어 Vocabulary" onBack={onBack} step={i + 1} total={vocab.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Word card */}
        <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
          <Text style={s.emoji} accessibilityLabel={item.en}>{item.emoji}</Text>
          <Text style={s.word}>{item.ko}</Text>
          <Rom style={{ fontSize: font.bodyLarge }}>{item.rom}</Rom>
          {showEn ? (
            <Body style={{ marginTop: spacing.xs, fontWeight: "700" }}>{item.en}</Body>
          ) : (
            <Button
              title="뜻 보기 Translation"
              icon="🌐"
              variant="outlined"
              onPress={() => setShowEn(true)}
              style={{ marginTop: spacing.sm }}
            />
          )}
          <Button
            title="듣기 Hear word"
            icon="🔊"
            variant="tonal"
            onPress={() => speak(item.ko)}
            style={{ marginTop: spacing.md, alignSelf: "stretch" }}
          />
        </Card>

        {/* Sentence card */}
        {!showSentence ? (
          <Button
            title="문장으로 보기 · See in a sentence"
            icon="📝"
            onPress={() => setShowSentence(true)}
            style={{ marginTop: spacing.lg }}
          />
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            <View style={s.sentRow}>
              <Text style={s.sentEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.sentence}>{item.sentence.ko}</Text>
                <Rom>{item.sentence.rom}</Rom>
                {showEn && (
                  <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xxs }}>
                    {item.sentence.en}
                  </Body>
                )}
              </View>
            </View>
            <Button
              title="문장 듣기 Hear sentence"
              icon="🔊"
              variant="tonal"
              onPress={() => speak(item.sentence.ko)}
              style={{ marginTop: spacing.md }}
            />
          </Card>
        )}

        {/* Navigation */}
        <View style={s.navRow}>
          <Button title="‹ 이전 Prev" variant="tonal"    onPress={prev} style={{ flex: 1, marginRight: spacing.sm }} />
          <Button title="다음 Next ›" variant="filled"   onPress={next} style={{ flex: 1, marginLeft:  spacing.sm }} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  emoji:   { fontSize: font.emojiXL },
  word:    { fontSize: font.hangul, fontWeight: "800", color: colors.onSurface, marginTop: spacing.sm },
  sentRow: { flexDirection: "row", alignItems: "center" },
  sentEmoji: { fontSize: font.emojiMd, marginRight: spacing.md },
  sentence:{ fontSize: font.titleLarge, fontWeight: "700", color: colors.onSurface, lineHeight: font.titleLarge * 1.35 },
  navRow:  { flexDirection: "row", marginTop: spacing.lg },
});
