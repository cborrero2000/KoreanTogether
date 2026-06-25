import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { listening } from "../data/content";
import { colors, font, spacing } from "../theme";
import { shuffle } from "../util";

export function ListeningScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const item = listening[i];
  const options = useMemo(() => shuffle(item.options), [i]);
  const answerIndex = options.indexOf(item.say);

  useEffect(() => {
    const t = setTimeout(() => speak(item.say), 350);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [i]);

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === answerIndex) setScore((s) => s + 1);
  }
  function next() {
    if (i + 1 >= listening.length) setDone(true);
    else { setI(i + 1); setPicked(null); setShowTranslation(false); }
  }
  function restart() {
    stopSpeaking();
    setI(0); setPicked(null); setScore(0); setDone(false); setShowTranslation(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="듣기 Listen & Choose" onBack={onBack} />
        <DoneCard score={score} total={listening.length} onRestart={restart} onBack={onBack} mode="listening" modeLabel="듣기 Listen & Choose" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="듣기 Listen & Choose" onBack={onBack} step={i + 1} total={listening.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <Card style={{ marginTop: spacing.md, alignItems: "center", backgroundColor: colors.secondaryContainer }}>
          <Body style={{ color: colors.onSecondaryContainer, fontWeight: "700", textAlign: "center" }}>
            Listen carefully, then choose the sentence you heard.
          </Body>
          <Button
            title="다시 듣기 Play again"
            icon="🔊"
            onPress={() => speak(item.say)}
            style={{ marginTop: spacing.md, alignSelf: "stretch" }}
          />
          <Button
            title="천천히 Slower"
            icon="🐢"
            iconSize={font.headlineLarge}
            variant="tonal"
            onPress={() => speak(item.say, { rate: 0.6 })}
            style={{ marginTop: spacing.sm, alignSelf: "stretch" }}
          />
        </Card>

        <H2 style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>무엇을 들었나요?</H2>
        {options.map((opt, idx) => {
          let state: "idle" | "correct" | "wrong" | "dim" = "idle";
          if (picked != null) {
            if (idx === answerIndex) state = "correct";
            else if (idx === picked) state = "wrong";
            else state = "dim";
          }
          return (
            <ChoiceButton
              key={idx}
              label={opt}
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
                color: picked === answerIndex ? colors.correct : colors.error,
                fontWeight: "700",
              }}
            >
              {picked === answerIndex ? "✓ 맞아요! Correct!" : "아쉬워요 — the highlighted one is right."}
            </Body>
            {!showTranslation ? (
              <Button
                title="뜻 보기 Translation"
                icon="🌐"
                variant="outlined"
                onPress={() => setShowTranslation(true)}
                style={{ marginTop: spacing.sm }}
              />
            ) : (
              <Card style={{ marginTop: spacing.sm }}>
                <Rom>{item.rom}</Rom>
                <Body style={{ marginTop: spacing.xxs }}>{item.en}</Body>
              </Card>
            )}
            <Button
              title={i + 1 >= listening.length ? "See results" : "다음 Next"}
              onPress={next}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
