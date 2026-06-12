import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { useDialogPlayer } from "../components/useDialogPlayer";
import { stopSpeaking } from "../speech/speech";
import { clips } from "../data/content";
import { colors, font, spacing } from "../theme";

export function ListenPracticeScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showEn, setShowEn] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = clips[i];
  const player = useDialogPlayer(item.lines);

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === item.answer) setScore((s) => s + 1);
  }
  function next() {
    player.stop();
    if (i + 1 >= clips.length) setDone(true);
    else { setI(i + 1); setShowTranscript(false); setShowEn(false); setPicked(null); }
  }
  function restart() {
    stopSpeaking();
    setI(0); setShowTranscript(false); setShowEn(false); setPicked(null); setScore(0); setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="듣기 연습 Listening" onBack={onBack} />
        <DoneCard score={score} total={clips.length} onRestart={restart} onBack={onBack} mode="practice" modeLabel="듣기 연습 Listening Practice" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="듣기 연습 Listening Practice" onBack={onBack} step={i + 1} total={clips.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <H2 style={{ marginTop: spacing.md }}>{item.title}</H2>
        <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
          Listen first — no subtitles. Try to understand, then check yourself.
        </Body>

        {/* Audio-only player */}
        <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
          <Text
            style={s.wave}
            accessibilityLabel={player.active >= 0 ? "Playing audio" : "Audio ready"}
          >
            {player.active >= 0 ? "🔊 〰️〰️〰️" : "🎧"}
          </Text>
          <View style={s.btnRow}>
            <Button title="듣기 Play" icon="▶️" onPress={() => player.play()} style={{ flex: 1, marginRight: spacing.sm }} />
            <Button title="천천히 Slower" icon="🐢" variant="tonal" onPress={() => player.play(0.55)} style={{ flex: 1, marginLeft: spacing.sm }} />
          </View>
        </Card>

        {/* Question first (no transcript yet) */}
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
              sub={picked != null ? opt.en : undefined}
              state={state}
              disabled={picked != null}
              onPress={() => choose(idx)}
            />
          );
        })}

        {picked != null && (
          <Body
            style={{
              marginTop: spacing.sm,
              color: picked === item.answer ? colors.correct : colors.error,
              fontWeight: "700",
            }}
          >
            {picked === item.answer ? "✓ 맞아요! Correct!" : "아쉬워요 — the highlighted one is right."}
          </Body>
        )}

        {/* Reveal transcript */}
        {!showTranscript ? (
          <Button
            title="대본 보기 · Show transcript"
            icon="📄"
            variant="outlined"
            onPress={() => setShowTranscript(true)}
            style={{ marginTop: spacing.lg }}
          />
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            {item.lines.map((l, idx) => (
              <View key={idx} style={{ marginBottom: spacing.sm }}>
                <Text style={s.speaker}>{l.speaker}</Text>
                <Text style={s.lineText}>{l.text}</Text>
                <Rom>{l.rom}</Rom>
                {showEn && (
                  <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xxs }}>{l.en}</Body>
                )}
              </View>
            ))}
            <Button
              title={showEn ? "번역 숨기기 Hide" : "번역 보기 Show translation"}
              icon="🌐"
              variant="tonal"
              onPress={() => setShowEn((v) => !v)}
              style={{ marginTop: spacing.sm }}
            />
          </Card>
        )}

        <Button
          title={i + 1 >= clips.length ? "끝내기 Finish" : "다음 Next ›"}
          onPress={next}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  wave:    { fontSize: font.emojiLg },
  btnRow:  { flexDirection: "row", marginTop: spacing.md, alignSelf: "stretch" },
  speaker: { fontSize: font.labelLarge, fontWeight: "800", color: colors.primary },
  lineText:{ fontSize: font.bodyLarge, fontWeight: "600", color: colors.onSurface, marginTop: spacing.xxs },
});
