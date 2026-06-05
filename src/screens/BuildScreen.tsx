import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, H2, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { speaking, vocab } from "../data/content";
import { colors, font, shape, spacing, MIN_TOUCH } from "../theme";
import { shuffle } from "../util";

type BuildItem = { ko: string; rom: string; en: string };

const POOL: BuildItem[] = [...speaking, ...vocab.map((v) => v.sentence)].filter(
  (x) => x.ko.trim().split(/\s+/).length >= 2
);

type Chip = { id: number; word: string };

export function BuildScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<Chip[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = POOL[i];
  const tokens = useMemo(() => item.ko.trim().split(/\s+/), [i]);
  const bank = useMemo(() => shuffle(tokens.map((word, id) => ({ id, word }))), [i]);
  const usedIds = new Set(answer.map((c) => c.id));
  const remaining = bank.filter((c) => !usedIds.has(c.id));

  function addChip(c: Chip) { if (checked != null) return; setAnswer((a) => [...a, c]); }
  function removeChip(idx: number) { if (checked != null) return; setAnswer((a) => a.filter((_, k) => k !== idx)); }

  function check() {
    const correct = answer.map((c) => c.word).join(" ") === tokens.join(" ");
    setChecked(correct);
    if (correct) { setScore((s) => s + 1); speak(item.ko); }
  }
  function clear() { setAnswer([]); setChecked(null); }
  function next() {
    stopSpeaking();
    if (i + 1 >= POOL.length) setDone(true);
    else { setI(i + 1); setAnswer([]); setChecked(null); }
  }
  function restart() {
    stopSpeaking();
    setI(0); setAnswer([]); setChecked(null); setScore(0); setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="만들기 Build It" onBack={onBack} />
        <DoneCard score={score} total={POOL.length} onRestart={restart} onBack={onBack} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="만들기 Build It" onBack={onBack} step={i + 1} total={POOL.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* English cue card */}
        <Card style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.onSurfaceVariant }}>이 뜻이 되도록 문장을 만드세요 · Build the Korean for:</Body>
          <Text style={s.en}>{item.en}</Text>
          <Button title="듣기 Hear it" icon="🔊" variant="tonal" onPress={() => speak(item.ko)} style={{ marginTop: spacing.sm }} />
        </Card>

        {/* Answer tray */}
        <View
          style={[
            s.answerBox,
            checked === true  && { borderColor: colors.correct,    backgroundColor: colors.correctBg },
            checked === false && { borderColor: colors.error,       backgroundColor: colors.errorContainer },
          ]}
        >
          {answer.length === 0 ? (
            <Text style={s.placeholder}>Tap words below to build the sentence…</Text>
          ) : (
            <View style={s.chipRow}>
              {answer.map((c, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => removeChip(idx)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove word: ${c.word}`}
                  style={({ pressed }) => [s.chipPicked, pressed && { opacity: 0.8 }]}
                >
                  <Text style={s.chipPickedText}>{c.word}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Word bank */}
        <View style={s.chipRow}>
          {remaining.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => addChip(c)}
              accessibilityRole="button"
              accessibilityLabel={`Add word: ${c.word}`}
              style={({ pressed }) => [s.chip, pressed && { opacity: 0.8 }]}
            >
              <Text style={s.chipText}>{c.word}</Text>
            </Pressable>
          ))}
        </View>

        {/* Actions */}
        {checked == null ? (
          <View style={s.btnRow}>
            <Button title="지우기 Clear" variant="outlined" onPress={clear} style={{ flex: 1, marginRight: spacing.sm }} />
            <Button title="확인 Check" onPress={check} disabled={answer.length !== tokens.length} style={{ flex: 1, marginLeft: spacing.sm }} />
          </View>
        ) : (
          <View style={{ marginTop: spacing.lg }}>
            {checked ? (
              <Body style={{ color: colors.correct, fontWeight: "700" }}>✓ 맞아요! Correct!</Body>
            ) : (
              <Card style={{ borderColor: colors.error }}>
                <Body style={{ color: colors.error, fontWeight: "700" }}>아쉬워요 · The correct answer is:</Body>
                <Text style={s.solution}>{item.ko}</Text>
                <Rom>{item.rom}</Rom>
              </Card>
            )}
            <View style={s.btnRow}>
              {!checked && (
                <Button title="다시 Try again" variant="outlined" onPress={clear} style={{ flex: 1, marginRight: spacing.sm }} />
              )}
              <Button
                title={i + 1 >= POOL.length ? "끝내기 Finish" : "다음 Next ›"}
                onPress={next}
                style={{ flex: 1, marginLeft: checked ? 0 : spacing.sm }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  en: {
    fontSize: font.titleLarge,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: spacing.xs,
    lineHeight: font.titleLarge * 1.35,
  },
  answerBox: {
    marginTop: spacing.lg,
    minHeight: 80,
    borderRadius: shape.medium,
    borderWidth: 2,
    borderColor: colors.outline,
    borderStyle: "dashed",
    backgroundColor: colors.surface,
    padding: spacing.md,
    justifyContent: "center",
  },
  placeholder: {
    fontSize: font.labelLarge,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  // Use margin on chips instead of gap (better RN compat)
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: shape.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { fontSize: font.bodyLarge, fontWeight: "700", color: colors.primary },
  chipPicked: {
    backgroundColor: colors.primary,
    borderRadius: shape.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
  },
  chipPickedText: { fontSize: font.bodyLarge, fontWeight: "700", color: colors.onPrimary },
  solution: {
    fontSize: font.titleLarge,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: spacing.xs,
  },
  btnRow: { flexDirection: "row", marginTop: spacing.lg },
});
