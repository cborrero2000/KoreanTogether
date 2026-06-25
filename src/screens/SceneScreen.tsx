import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { useDialogPlayer } from "../components/useDialogPlayer";
import { stopSpeaking } from "../speech/speech";
import { scenes } from "../data/content";
import { colors, font, shape, spacing } from "../theme";

export function SceneScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showEn, setShowEn] = useState(false);
  const [done, setDone] = useState(false);

  const item = scenes[i];
  const player = useDialogPlayer(item.lines);
  const speaking = player.active >= 0;

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === item.answer) setScore((s) => s + 1);
  }
  function next() {
    player.stop();
    if (i + 1 >= scenes.length) setDone(true);
    else { setI(i + 1); setPicked(null); setShowEn(false); }
  }
  function restart() {
    stopSpeaking();
    setI(0); setPicked(null); setScore(0); setShowEn(false); setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="장면 Watch & Decide" onBack={onBack} />
        <DoneCard score={score} total={scenes.length} onRestart={restart} onBack={onBack} mode="scenes" modeLabel="장면 Watch & Decide" />
      </Screen>
    );
  }

  const current = player.active >= 0 ? item.lines[player.active] : null;

  return (
    <Screen>
      <ActivityHeader title="장면 Watch & Decide" onBack={onBack} step={i + 1} total={scenes.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <H2 style={{ marginTop: spacing.md }}>{item.title}</H2>
        <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
          {item.situation}
        </Body>

        {/* ── Scene card (dark "TV" style) ── */}
        <Card
          style={{
            marginTop: spacing.md,
            alignItems: "center",
            backgroundColor: colors.sceneCard,
            borderColor: colors.sceneCardBorder,
          }}
        >
          <Text
            accessibilityLabel={speaking ? "Speaking" : "Not speaking"}
            style={[s.avatar, speaking && s.avatarTalking]}
          >
            {speaking ? "🗣️" : "🙂"}
          </Text>
          {current ? (
            <>
              <Text style={s.subSpeaker}>{current.speaker}</Text>
              <Text style={s.subtitle}>{current.text}</Text>
              <Text style={s.subRom}>{current.rom}</Text>
              {showEn && <Text style={s.subEn}>{current.en}</Text>}
            </>
          ) : (
            <Text style={s.subtitle}>▶ Tap "Play scene"</Text>
          )}
        </Card>

        {/* ── Controls ── */}
        <View style={s.btnRow}>
          <Button title="장면 보기 Play" icon="▶️" onPress={() => player.play()} style={{ flex: 1, marginRight: spacing.xs }} />
          <Button title="천천히" icon="🐢" iconSize={font.headlineLarge} variant="tonal" onPress={() => player.play(0.6)} style={{ flex: 0.8, marginHorizontal: spacing.xs }} />
          <Button title={showEn ? "Hide 🌐" : "자막 🌐"} variant="outlined" onPress={() => setShowEn((v) => !v)} style={{ flex: 0.7, marginLeft: spacing.xs }} />
        </View>

        {/* ── Question ── */}
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
              title={i + 1 >= scenes.length ? "See results" : "다음 Next"}
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
  avatar:       { fontSize: font.avatar },
  avatarTalking:{ fontSize: font.avatarTalk },
  subSpeaker:   { fontSize: font.labelLarge, fontWeight: "800", color: colors.sceneHighlight, marginTop: spacing.sm },
  subtitle:     { fontSize: font.titleLarge,  fontWeight: "700", color: colors.sceneSubtitle, textAlign: "center", marginTop: spacing.xxs, lineHeight: font.titleLarge * 1.35 },
  subRom:       { fontSize: font.labelMedium, color: colors.sceneRom, fontStyle: "italic", textAlign: "center", marginTop: spacing.xxs },
  subEn:        { fontSize: font.labelMedium, color: colors.sceneEn, textAlign: "center", marginTop: spacing.xxs },
  btnRow:       { flexDirection: "row", marginTop: spacing.md, alignItems: "stretch" },
});
