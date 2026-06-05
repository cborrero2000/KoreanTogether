import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { useDialogPlayer } from "../components/useDialogPlayer";
import { stopSpeaking } from "../speech/speech";
import { dialogs } from "../data/content";
import { colors, font, shape, spacing } from "../theme";

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
    else { setI(i + 1); setPicked(null); setShowEn(false); }
  }
  function restart() {
    stopSpeaking();
    setI(0); setPicked(null); setScore(0); setShowEn(false); setDone(false);
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <H2 style={{ marginTop: spacing.md }}>{item.title}</H2>

        <Card style={{ marginTop: spacing.sm }}>
          {item.lines.map((l, idx) => (
            <View
              key={idx}
              style={[
                s.line,
                player.active === idx && { backgroundColor: colors.primaryContainer, borderRadius: shape.small },
              ]}
            >
              <Text style={s.speaker}>{l.speaker}</Text>
              <Text style={s.lineText}>{l.text}</Text>
              <Rom>{l.rom}</Rom>
              {showEn && (
                <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xxs }}>{l.en}</Body>
              )}
            </View>
          ))}

          {/* Control row — separate rows to avoid overflow on narrow screens */}
          <View style={s.ctrlRow}>
            <Button title="대화 듣기 Play" icon="🔊" onPress={() => player.play()} style={{ flex: 1, marginRight: spacing.xs }} />
            <Button title="천천히" icon="🐢" variant="tonal" onPress={() => player.play(0.6)} style={{ flex: 1, marginLeft: spacing.xs }} />
          </View>
          <Button
            title={showEn ? "번역 숨기기 Hide" : "뜻 보기 Translation 🌐"}
            variant="outlined"
            onPress={() => setShowEn((s) => !s)}
            style={{ marginTop: spacing.sm }}
          />
        </Card>

        <H2 style={{ marginTop: spacing.lg }}>{item.question}</H2>
        <Body style={{ color: colors.onSurfaceVariant, marginBottom: spacing.xs }}>{item.questionEn}</Body>
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
            <Body
              style={{
                color: picked === item.answer ? colors.correct : colors.error,
                fontWeight: "700",
              }}
            >
              {picked === item.answer ? "✓ 맞아요! Correct!" : "아쉬워요 — the highlighted one is right."}
            </Body>
            <Button
              title={i + 1 >= dialogs.length ? "See results" : "다음 Next"}
              onPress={next}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  line: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xxs,
  },
  speaker:  { fontSize: font.labelLarge, fontWeight: "800", color: colors.primary },
  lineText: { fontSize: font.bodyLarge, fontWeight: "600", color: colors.onSurface, marginTop: spacing.xxs },
  ctrlRow:  { flexDirection: "row", marginTop: spacing.md },
});
