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

  const item = vocab[i];

  function reset() {
    setShowSentence(false);
    setShowEn(false);
  }
  function next() {
    stopSpeaking();
    setI((i + 1) % vocab.length);
    reset();
  }
  function prev() {
    stopSpeaking();
    setI((i - 1 + vocab.length) % vocab.length);
    reset();
  }

  return (
    <Screen>
      <ActivityHeader title="단어 Vocabulary" onBack={onBack} step={i + 1} total={vocab.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* The word alone, with a picture */}
        <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.word}>{item.ko}</Text>
          <Rom style={{ fontSize: font.body }}>{item.rom}</Rom>
          {showEn ? (
            <Body style={{ marginTop: spacing.xs, fontWeight: "700" }}>{item.en}</Body>
          ) : (
            <Button title="뜻 보기 Translation" icon="🌐" variant="ghost" onPress={() => setShowEn(true)} style={{ marginTop: spacing.sm }} />
          )}
          <Button title="듣기 Hear word" icon="🔊" variant="neutral" onPress={() => speak(item.ko)} style={{ marginTop: spacing.md, alignSelf: "stretch" }} />
        </Card>

        {/* The same word inside a sentence, with a picture */}
        {!showSentence ? (
          <Button title="문장으로 보기 · See in a sentence" icon="📝" onPress={() => setShowSentence(true)} style={{ marginTop: spacing.lg }} />
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            <View style={styles.sentRow}>
              <Text style={styles.sentEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.sentence}>{item.sentence.ko}</Text>
                <Rom>{item.sentence.rom}</Rom>
                {showEn && <Body style={{ color: colors.textSoft, marginTop: 2 }}>{item.sentence.en}</Body>}
              </View>
            </View>
            <Button title="문장 듣기 Hear sentence" icon="🔊" variant="neutral" onPress={() => speak(item.sentence.ko)} style={{ marginTop: spacing.md }} />
          </Card>
        )}

        <View style={styles.navRow}>
          <Button title="‹ 이전 Prev" variant="neutral" onPress={prev} style={{ flex: 1, marginRight: spacing.sm }} />
          <Button title="다음 Next ›" onPress={next} style={{ flex: 1, marginLeft: spacing.sm }} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emoji: { fontSize: 88 },
  word: { fontSize: font.hangul, fontWeight: "800", color: colors.text, marginTop: spacing.sm },
  sentRow: { flexDirection: "row", alignItems: "center" },
  sentEmoji: { fontSize: 48, marginRight: spacing.md },
  sentence: { fontSize: font.big, fontWeight: "700", color: colors.text, lineHeight: font.big * 1.3 },
  navRow: { flexDirection: "row", marginTop: spacing.lg },
});
