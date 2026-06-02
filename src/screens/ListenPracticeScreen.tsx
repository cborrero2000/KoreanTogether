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
    else {
      setI(i + 1);
      setShowTranscript(false);
      setShowEn(false);
      setPicked(null);
    }
  }
  function restart() {
    stopSpeaking();
    setI(0);
    setShowTranscript(false);
    setShowEn(false);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="듣기 연습 Listening" onBack={onBack} />
        <DoneCard score={score} total={clips.length} onRestart={restart} onBack={onBack} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="듣기 연습 Listening Practice" onBack={onBack} step={i + 1} total={clips.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <H2 style={{ marginTop: spacing.md }}>{item.title}</H2>
        <Body style={{ color: colors.textSoft, marginTop: spacing.xs }}>
          Listen first — no subtitles. Try to understand, then check yourself.
        </Body>

        {/* Audio-only player (transcript hidden until you ask) */}
        <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
          <Text style={styles.wave}>{player.active >= 0 ? "🔊 〰️〰️〰️" : "🎧"}</Text>
          <View style={styles.btnRow}>
            <Button title="듣기 Play" icon="▶️" onPress={() => player.play()} style={{ flex: 1, marginRight: spacing.xs }} />
            <Button title="천천히 Slower" icon="🐢" variant="neutral" onPress={() => player.play(0.55)} style={{ flex: 1, marginLeft: spacing.xs }} />
          </View>
        </Card>

        {/* Comprehension question comes BEFORE the transcript on purpose */}
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
              sub={picked != null ? opt.en : undefined}
              state={state}
              disabled={picked != null}
              onPress={() => choose(idx)}
            />
          );
        })}

        {picked != null && (
          <Body style={{ marginTop: spacing.sm, color: picked === item.answer ? colors.correct : colors.wrong, fontWeight: "700" }}>
            {picked === item.answer ? "✓ 맞아요! Correct!" : "아쉬워요 — the highlighted one is right."}
          </Body>
        )}

        {/* Reveal the script + translation only when you choose to */}
        {!showTranscript ? (
          <Button title="대본 보기 · Show transcript" icon="📄" variant="ghost" onPress={() => setShowTranscript(true)} style={{ marginTop: spacing.lg }} />
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            {item.lines.map((l, idx) => (
              <View key={idx} style={{ marginBottom: spacing.sm }}>
                <Text style={styles.speaker}>{l.speaker}</Text>
                <Text style={styles.lineText}>{l.text}</Text>
                <Rom>{l.rom}</Rom>
                {showEn && <Body style={{ color: colors.textSoft, marginTop: 2 }}>{l.en}</Body>}
              </View>
            ))}
            <Button title={showEn ? "번역 숨기기 Hide translation" : "번역 보기 Show translation"} icon="🌐" variant="neutral" onPress={() => setShowEn((v) => !v)} style={{ marginTop: spacing.sm }} />
          </Card>
        )}

        <Button title={i + 1 >= clips.length ? "끝내기 Finish" : "다음 Next ›"} onPress={next} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wave: { fontSize: 56 },
  btnRow: { flexDirection: "row", marginTop: spacing.md, alignSelf: "stretch" },
  speaker: { fontSize: font.label, fontWeight: "800", color: colors.primary },
  lineText: { fontSize: font.body, fontWeight: "600", color: colors.text, marginTop: 2 },
});
