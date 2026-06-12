import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill, Rom, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import {
  speak, stopSpeaking, isRecognitionAvailable,
  startRecognition, RecognitionHandle, acceptMatch,
} from "../speech/speech";
import { conversations } from "../data/content";
import { colors, font, spacing } from "../theme";

export function TalkBackScreen({ onBack }: { onBack: () => void }) {
  const [c, setC] = useState(0);
  const [s, setS] = useState(0);
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

  useEffect(() => {
    const t = setTimeout(() => speak(step.prompt), 350);
    return () => { clearTimeout(t); stopRec(); stopSpeaking(); };
  }, [c, s]);

  function stopRec() {
    recRef.current?.stop(); recRef.current = null; setListening(false);
  }
  function startListening() {
    setHeard(""); setResult("none");
    const handle = startRecognition({
      onResult: (transcript, isFinal) => { setHeard(transcript); if (isFinal) judge(transcript); },
      onError: () => setListening(false),
      onEnd:   () => setListening(false),
    });
    if (!handle) return;
    recRef.current = handle; setListening(true);
  }
  function judge(transcript: string) {
    stopRec();
    if (acceptMatch(step.accept, transcript)) {
      setResult("ok");
    } else {
      setResult("retry");
      setTimeout(() => speak("다시 말해 주세요."), 400);
    }
  }
  function nextStep() {
    setHeard(""); setResult("none"); setShowHint(false); setShowEn(false);
    if (!lastStep) setS(s + 1);
    else if (!lastConvo) { setC(c + 1); setS(0); }
    else { setC(0); setS(0); }
  }

  return (
    <Screen>
      <ActivityHeader title="대화 연습 Talk Back" onBack={onBack} step={s + 1} total={convo.steps.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <H2 style={{ marginTop: spacing.md }}>{convo.title}</H2>

        {/* App speaks to you */}
        <Card style={{ marginTop: spacing.sm }}>
          <Body style={{ color: colors.onSurfaceVariant }}>🗣️ 상대방 · They say:</Body>
          <Text style={s2.prompt}>{step.prompt}</Text>
          <Rom>{step.promptRom}</Rom>
          {showEn && <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xxs }}>{step.promptEn}</Body>}
          <View style={s2.ctrlRow}>
            <Button title="다시 듣기 Replay" icon="🔊" variant="tonal" onPress={() => speak(step.prompt)} style={{ flex: 1, marginRight: spacing.xs }} />
            <Button title={showEn ? "Hide 🌐" : "뜻 🌐"} variant="outlined" onPress={() => setShowEn((v) => !v)} style={{ flex: 0.7, marginLeft: spacing.xs }} />
          </View>
        </Card>

        {/* Mic */}
        {supported ? (
          <Button
            title={listening ? "듣는 중… 탭하면 멈춤" : "내 차례 · Tap and reply"}
            icon={listening ? "🔴" : "🎤"}
            variant={listening ? "accent" : "filled"}
            onPress={listening ? stopRec : startListening}
            style={{ marginTop: spacing.lg }}
          />
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            <Body style={{ fontWeight: "700" }}>🎤 Spoken replies aren't available on this device.</Body>
            <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
              Speech recognition needs microphone permission, or isn't supported here. For now, read the example reply aloud, then continue.
            </Body>
          </Card>
        )}

        {heard !== "" && (
          <Card style={{ marginTop: spacing.md }}>
            <Body style={{ color: colors.onSurfaceVariant }}>You said:</Body>
            <Text style={s2.heard}>"{heard}"</Text>
          </Card>
        )}

        {result === "ok" && (
          <View style={{ marginTop: spacing.md, alignItems: "flex-start" }}>
            <Pill tone="good" text="✓ 좋아요! Nice reply!" />
            <Button
              title={lastStep && lastConvo ? "처음부터 Start over" : "계속 Continue ›"}
              onPress={nextStep}
              style={{ marginTop: spacing.md, alignSelf: "stretch" }}
            />
          </View>
        )}

        {result === "retry" && (
          <View style={{ marginTop: spacing.md }}>
            <Pill tone="bad" text="실례지만, 뭐라고요? · Excuse me, what did you say?" />
          </View>
        )}

        {result !== "ok" && (
          <>
            {!showHint ? (
              <Button
                title="예시 보기 Show example reply"
                icon="💡"
                variant="outlined"
                onPress={() => setShowHint(true)}
                style={{ marginTop: spacing.md }}
              />
            ) : (
              <Card style={{ marginTop: spacing.md }}>
                <Body style={{ color: colors.onSurfaceVariant }}>Try saying:</Body>
                <Text style={s2.hintText}>{step.expect}</Text>
                <Rom>{step.expectRom}</Rom>
                <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xxs }}>{step.expectEn}</Body>
                <Button
                  title="예시 듣기 Hear example"
                  icon="🔊"
                  variant="tonal"
                  onPress={() => speak(step.expect)}
                  style={{ marginTop: spacing.sm }}
                />
              </Card>
            )}
            <Button title="건너뛰기 Skip" variant="outlined" onPress={nextStep} style={{ marginTop: spacing.sm }} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const s2 = StyleSheet.create({
  prompt:  { fontSize: font.titleLarge, fontWeight: "800", color: colors.onSurface, marginTop: spacing.xs, lineHeight: font.titleLarge * 1.35 },
  heard:   { fontSize: font.bodyLarge, fontStyle: "italic", color: colors.onSurface, marginTop: spacing.xxs },
  hintText:{ fontSize: font.bodyLarge, fontWeight: "700", color: colors.primary, marginTop: spacing.xxs },
  ctrlRow: { flexDirection: "row", marginTop: spacing.md },
});
