import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { useDialogPlayer } from "../components/useDialogPlayer";
import { stopSpeaking } from "../speech/speech";
import { dialogs } from "../data/content";
import { colors, font, spacing } from "../theme";

export function DialogScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showEn, setShowEn] = useState(false);
  const [done, setDone] = useState(false);

  const item = dialogs[i];
  const player = useDialogPlayer(item.lines);

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === item.answer) setScore((s) => s + 1);
  }
  function next() {
    player.stop();
    if (i + 1 >= dialogs.length) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
      setShowEn(false);
    }
  }
  function restart() {
    stopSpeaking();
    setI(0);
    setPicked(null);
    setScore(0);
    setShowEn(false);
    setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="대화 Dialog" onBack={onBack} />
        <DoneCard score={score} total={dialogs.length} onRestart={restart} onBack={onBack} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="대화 Dialog" onBack={onBack} step={i + 1} total={dialogs.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <H2 style={{ marginTop: spacing.md }}>{item.title}</H2>

        <Card style={{ marginTop: spacing.sm }}>
          {item.lines.map((l, idx) => (
            <View key={idx} style={[styles.line, player.active === idx && styles.lineActive]}>
              <Text style={styles.speaker}>{l.speaker}</Text>
              <Text style={styles.lineText}>{l.text}</Text>
              <Rom>{l.rom}</Rom>
              {showEn && <Body style={{ color: colors.textSoft, marginTop: 2 }}>{l.en}</Body>}
            </View>
          ))}
          <View style={styles.btnRow}>
            <Button title="대화 듣기 Play" icon="🔊" onPress={() => player.play()} style={{ flex: 1, marginRight: spacing.xs }} />
            <Button title="천천히" icon="🐢" variant="neutral" onPress={() => player.play(0.6)} style={{ flex: 1, marginHorizontal: spacing.xs }} />
            <Button title={showEn ? "Hide" : "🌐"} variant="neutral" onPress={() => setShowEn((s) => !s)} style={{ flex: 0.6, marginLeft: spacing.xs }} />
          </View>
        </Card>

        <H2 style={{ marginTop: spacing.lg }}>{item.question}</H2>
        <Body style={{ color: colors.textSoft, marginBottom: spacing.xs }}>{item.questionEn}</Body>
        {item.options.map((opt, idx) => {
          let state: "idle" | "correct" | "wrong" | "dim" = "idle";
          if (picked != null) {
            if (idx === item.answer) state = "correct";
            else if (idx === picked) state = "wrong";
            else state = "dim";
          }
          return (
            <ChoiceButton
              key={idx}
              label={opt.ko}
              sub={showEn || picked != null ? opt.en : undefined}
              state={state}
              disabled={picked != null}
              onPress={() => choose(idx)}
            />
          );
        })}

        {picked != null && (
          <View style={{ marginTop: spacing.md }}>
            <Body style={{ color: picked === item.answer ? colors.correct : colors.wrong, fontWeight: "700" }}>
              {picked === item.answer ? "✓ 맞아요! Correct!" : "아쉬워요 — the highlighted one is right."}
            </Body>
            <Button title={i + 1 >= dialogs.length ? "See results" : "다음 Next"} onPress={next} style={{ marginTop: spacing.md }} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  line: { paddingVertical: spacing.sm, borderRadius: 12, paddingHorizontal: spacing.sm },
  lineActive: { backgroundColor: colors.correctBg },
  speaker: { fontSize: font.label, fontWeight: "800", color: colors.primary },
  lineText: { fontSize: font.body, fontWeight: "600", color: colors.text, marginTop: 2 },
  btnRow: { flexDirection: "row", marginTop: spacing.md, alignItems: "stretch" },
});
