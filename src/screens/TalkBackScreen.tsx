import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill, Rom, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import {
  speak,
  stopSpeaking,
  isRecognitionAvailable,
  startRecognition,
  RecognitionHandle,
  acceptMatch,
} from "../speech/speech";
import { conversations } from "../data/content";
import { colors, font, spacing } from "../theme";

export function TalkBackScreen({ onBack }: { onBack: () => void }) {
  const [c, setC] = useState(0); // conversation index
  const [s, setS] = useState(0); // step index
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [result, setResult] = useState<"none" | "ok" | "retry">("none");
  const [showHint, setShowHint] = useState(false);
  const [showEn, setShowEn] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();

  const convo = conversations[c];
  const step = convo.steps[s];
  const lastStep = s + 1 >= convo.steps.length;
  const lastConvo = c + 1 >= conversations.length;

  // Speak the app's line whenever the step changes.
  useEffect(() => {
    const t = setTimeout(() => speak(step.prompt), 350);
    return () => {
      clearTimeout(t);
      stopRec();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c, s]);

  function stopRec() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  function startListening() {
    setHeard("");
    setResult("none");
    const handle = startRecognition({
      onResult: (transcript, isFinal) => {
        setHeard(transcript);
        if (isFinal) judge(transcript);
      },
      onError: () => setListening(false),
      onEnd: () => setListening(false),
    });
    if (!handle) return;
    recRef.current = handle;
    setListening(true);
  }

  function judge(transcript: string) {
    stopRec();
    if (acceptMatch(step.accept, transcript)) {
      setResult("ok");
    } else {
      setResult("retry");
      setTimeout(() => speak("다시 말해 주세요."), 400); // "Please say it again."
    }
  }

  function nextStep() {
    setHeard("");
    setResult("none");
    setShowHint(false);
    setShowEn(false);
    if (!lastStep) setS(s + 1);
    else if (!lastConvo) {
      setC(c + 1);
      setS(0);
    } else {
      // loop back to the first conversation
      setC(0);
      setS(0);
    }
  }

  return (
    <Screen>
      <ActivityHeader title="대화 연습 Talk Back" onBack={onBack} step={s + 1} total={convo.steps.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <H2 style={{ marginTop: spacing.md }}>{convo.title}</H2>

        {/* The app speaks to you */}
        <Card style={{ marginTop: spacing.sm }}>
          <Body style={{ color: colors.textSoft }}>🗣️ 상대방 · They say:</Body>
          <Text style={styles.prompt}>{step.prompt}</Text>
          <Rom>{step.promptRom}</Rom>
          {showEn && <Body style={{ color: colors.textSoft, marginTop: 2 }}>{step.promptEn}</Body>}
          <View style={styles.btnRow}>
            <Button title="다시 듣기 Replay" icon="🔊" variant="neutral" onPress={() => speak(step.prompt)} style={{ flex: 1, marginRight: spacing.xs }} />
            <Button title={showEn ? "Hide 🌐" : "뜻 🌐"} variant="neutral" onPress={() => setShowEn((v) => !v)} style={{ flex: 0.7, marginLeft: spacing.xs }} />
          </View>
        </Card>

        {/* Your turn to reply */}
        {supported ? (
          <Button
            title={listening ? "듣는 중… 탭하면 멈춤" : "내 차례 · Tap and reply"}
            icon={listening ? "🔴" : "🎤"}
            variant={listening ? "accent" : "primary"}
            onPress={listening ? stopRec : startListening}
            style={{ marginTop: spacing.lg }}
          />
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            <Body style={{ fontWeight: "700" }}>🎤 Spoken replies work in Chrome / Edge on a computer.</Body>
            <Body style={{ color: colors.textSoft, marginTop: spacing.xs }}>
              For now, read the example reply aloud, then continue.
            </Body>
          </Card>
        )}

        {heard !== "" && (
          <Card style={{ marginTop: spacing.md }}>
            <Body style={{ color: colors.textSoft }}>You said:</Body>
            <Text style={styles.heard}>“{heard}”</Text>
          </Card>
        )}

        {result === "ok" && (
          <View style={{ marginTop: spacing.md, alignItems: "flex-start" }}>
            <Pill tone="good" text="✓ 좋아요! Nice reply!" />
            <Button title={lastStep && lastConvo ? "처음부터 Start over" : "계속 Continue ›"} onPress={nextStep} style={{ marginTop: spacing.md, alignSelf: "stretch" }} />
          </View>
        )}

        {result === "retry" && (
          <View style={{ marginTop: spacing.md }}>
            <Pill tone="bad" text="실례지만, 뭐라고요? · Excuse me, what did you say?" />
          </View>
        )}

        {/* Hint + skip are always available */}
        {result !== "ok" && (
          <>
            {!showHint ? (
              <Button title="예시 보기 Show example reply" icon="💡" variant="ghost" onPress={() => setShowHint(true)} style={{ marginTop: spacing.md }} />
            ) : (
              <Card style={{ marginTop: spacing.md }}>
                <Body style={{ color: colors.textSoft }}>Try saying:</Body>
                <Text style={styles.hintText}>{step.expect}</Text>
                <Rom>{step.expectRom}</Rom>
                <Body style={{ color: colors.textSoft, marginTop: 2 }}>{step.expectEn}</Body>
                <Button title="예시 듣기 Hear example" icon="🔊" variant="neutral" onPress={() => speak(step.expect)} style={{ marginTop: spacing.sm }} />
              </Card>
            )}
            <Button title="건너뛰기 Skip" variant="neutral" onPress={nextStep} style={{ marginTop: spacing.sm }} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  prompt: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.xs, lineHeight: font.big * 1.3 },
  heard: { fontSize: font.body, fontStyle: "italic", color: colors.text, marginTop: 4 },
  hintText: { fontSize: font.body, fontWeight: "700", color: colors.primary, marginTop: 4 },
  btnRow: { flexDirection: "row", marginTop: spacing.md },
});
