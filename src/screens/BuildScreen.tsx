import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, H2, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { speaking, vocab } from "../data/content";
import { colors, font, radius, spacing } from "../theme";
import { shuffle } from "../util";

type BuildItem = { ko: string; rom: string; en: string };

// Build from sentences that have at least two words to arrange.
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
  // A shuffled bank of word chips, each with a stable id (handles duplicate words).
  const bank = useMemo(() => shuffle(tokens.map((word, id) => ({ id, word }))), [i]);
  const usedIds = new Set(answer.map((c) => c.id));
  const remaining = bank.filter((c) => !usedIds.has(c.id));

  function addChip(c: Chip) {
    if (checked) return;
    setAnswer((a) => [...a, c]);
  }
  function removeChip(idx: number) {
    if (checked) return;
    setAnswer((a) => a.filter((_, k) => k !== idx));
  }
  function check() {
    const correct = answer.map((c) => c.word).join(" ") === tokens.join(" ");
    setChecked(correct);
    if (correct) {
      setScore((s) => s + 1);
      speak(item.ko);
    }
  }
  function clear() {
    setAnswer([]);
    setChecked(null);
  }
  function next() {
    stopSpeaking();
    if (i + 1 >= POOL.length) setDone(true);
    else {
      setI(i + 1);
      setAnswer([]);
      setChecked(null);
    }
  }
  function restart() {
    stopSpeaking();
    setI(0);
    setAnswer([]);
    setChecked(null);
    setScore(0);
    setDone(false);
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
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Card style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.textSoft }}>이 뜻이 되도록 문장을 만드세요 · Build the Korean for:</Body>
          <Text style={styles.en}>{item.en}</Text>
          <Button title="듣기 Hear it" icon="🔊" variant="neutral" onPress={() => speak(item.ko)} style={{ marginTop: spacing.sm }} />
        </Card>

        {/* Your sentence */}
        <View
          style={[
            styles.answerBox,
            checked === true && { borderColor: colors.correct, backgroundColor: colors.correctBg },
            checked === false && { borderColor: colors.wrong, backgroundColor: colors.wrongBg },
          ]}
        >
          {answer.length === 0 ? (
            <Text style={styles.placeholder}>Tap words below to build the sentence…</Text>
          ) : (
            <View style={styles.chipRow}>
              {answer.map((c, idx) => (
                <Pressable key={idx} onPress={() => removeChip(idx)} style={styles.chipPicked}>
                  <Text style={styles.chipPickedText}>{c.word}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Word bank */}
        <View style={[styles.chipRow, { marginTop: spacing.md }]}>
          {remaining.map((c) => (
            <Pressable key={c.id} onPress={() => addChip(c)} style={styles.chip}>
              <Text style={styles.chipText}>{c.word}</Text>
            </Pressable>
          ))}
        </View>

        {checked === null ? (
          <View style={styles.btnRow}>
            <Button title="지우기 Clear" variant="neutral" onPress={clear} style={{ flex: 1, marginRight: spacing.sm }} />
            <Button title="확인 Check" onPress={check} disabled={answer.length !== tokens.length} style={{ flex: 1, marginLeft: spacing.sm }} />
          </View>
        ) : (
          <View style={{ marginTop: spacing.lg }}>
            {checked ? (
              <Body style={{ color: colors.correct, fontWeight: "700" }}>✓ 맞아요! Correct!</Body>
            ) : (
              <Card style={{ borderColor: colors.wrong }}>
                <Body style={{ color: colors.wrong, fontWeight: "700" }}>아쉬워요 · The correct answer is:</Body>
                <Text style={styles.solution}>{item.ko}</Text>
                <Rom>{item.rom}</Rom>
              </Card>
            )}
            <View style={styles.btnRow}>
              {!checked && (
                <Button title="다시 Try again" variant="neutral" onPress={clear} style={{ flex: 1, marginRight: spacing.sm }} />
              )}
              <Button title={i + 1 >= POOL.length ? "끝내기 Finish" : "다음 Next ›"} onPress={next} style={{ flex: 1, marginLeft: checked ? 0 : spacing.sm }} />
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  en: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.xs, lineHeight: font.big * 1.3 },
  answerBox: {
    marginTop: spacing.lg,
    minHeight: 80,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.card,
    padding: spacing.md,
    justifyContent: "center",
  },
  placeholder: { fontSize: font.label, color: colors.textSoft, textAlign: "center" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm as unknown as number },
  chip: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
  },
  chipText: { fontSize: font.body, fontWeight: "700", color: colors.primary },
  chipPicked: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    marginRight: spacing.sm,
  },
  chipPickedText: { fontSize: font.body, fontWeight: "700", color: colors.white },
  solution: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.xs },
  btnRow: { flexDirection: "row", marginTop: spacing.lg },
});
