import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import {
  speak, stopSpeaking, isRecognitionAvailable,
  startRecognition, RecognitionHandle, matchScore,
} from "../speech/speech";
import { speaking } from "../data/content";
import { colors, font, spacing } from "../theme";

const PASS = 0.6;

export function SpeakingScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [passes, setPasses] = useState(0);
  const [showEn, setShowEn] = useState(false);
  const [done, setDone] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();

  const item = speaking[i];
  const passed = score != null && score >= PASS;

  useEffect(() => () => stopRec(), []);

  function stopRec() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }
  function startListening() {
    setHeard(""); setScore(null);
    const handle = startRecognition({
      onResult: (transcript, isFinal) => { setHeard(transcript); if (isFinal) finish(transcript); },
      onError: () => setListening(false),
      onEnd:   () => setListening(false),
    });
    if (!handle) return;
    recRef.current = handle;
    setListening(true);
  }
  function finish(transcript: string) {
    const s = matchScore(item.ko, transcript);
    setScore(s);
    if (s >= PASS) setPasses((p) => p + 1);
    stopRec();
  }
  function advance() {
    if (i + 1 >= speaking.length) setDone(true);
    else { setI(i + 1); setHeard(""); setScore(null); setShowEn(false); }
  }
  function restart() {
    stopSpeaking();
    setI(0); setHeard(""); setScore(null); setPasses(0); setShowEn(false); setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="말하기 Say It" onBack={onBack} />
        <DoneCard score={passes} total={speaking.length} onRestart={restart} onBack={onBack} />
      </Screen>
    );
  }

  const close = score != null && score >= 0.4 && score < PASS;

  return (
    <Screen>
      <ActivityHeader title="말하기 Say It" onBack={onBack} step={i + 1} total={speaking.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Sentence card */}
        <Card style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.onSurfaceVariant }}>이 문장을 소리 내어 읽어 보세요 · Read this aloud:</Body>
          <Text style={s.target}>{item.ko}</Text>
          <Rom style={{ fontSize: font.bodyLarge }}>{item.rom}</Rom>
          {showEn ? (
            <Body style={{ marginTop: spacing.xs, fontWeight: "700" }}>{item.en}</Body>
          ) : (
            <Button
              title="뜻 보기 Translation"
              icon="🌐"
              variant="outlined"
              onPress={() => setShowEn(true)}
              style={{ marginTop: spacing.sm }}
            />
          )}
          <Button
            title="듣기 Hear it"
            icon="🔊"
            variant="tonal"
            onPress={() => speak(item.ko)}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {/* Mic or fallback */}
        {supported ? (
          <>
            <Button
              title={listening ? "듣는 중… 탭하면 멈춤" : "탭하고 말하기 · Tap and speak"}
              icon={listening ? "🔴" : "🎤"}
              variant={listening ? "accent" : "filled"}
              onPress={listening ? stopRec : startListening}
              style={{ marginTop: spacing.lg }}
            />
            {(heard !== "" || score != null) && (
              <Card style={{ marginTop: spacing.md }}>
                <Body style={{ color: colors.onSurfaceVariant }}>I heard you say:</Body>
                <Text style={s.heard}>"{heard || "…"}"</Text>
                {score != null && (
                  <View style={{ marginTop: spacing.sm }}>
                    <Pill
                      tone={passed ? "good" : close ? "neutral" : "bad"}
                      text={
                        passed ? "✓ 잘했어요! Great!"
                        : close ? "거의 맞았어요! Almost — try again."
                        : "다시 해 볼까요? Try again."
                      }
                    />
                  </View>
                )}
              </Card>
            )}
          </>
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            <Body style={{ fontWeight: "700" }}>🎤 Speaking check works in Chrome / Edge</Body>
            <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
              Open in a desktop browser for automatic checking. For now, tap "Hear it", repeat, then compare.
            </Body>
          </Card>
        )}

        {passed ? (
          <Button
            title={i + 1 >= speaking.length ? "끝내기 Finish" : "다음 Next ›"}
            onPress={advance}
            style={{ marginTop: spacing.lg }}
          />
        ) : (
          <>
            <Button
              title={i + 1 >= speaking.length ? "건너뛰고 끝내기 Skip & finish" : "건너뛰기 Skip"}
              variant="outlined"
              onPress={advance}
              style={{ marginTop: spacing.lg }}
            />
            <Body style={{ color: colors.onSurfaceVariant, textAlign: "center", marginTop: spacing.sm }}>
              Say it correctly to unlock Next, or Skip to continue.
            </Body>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  target: {
    fontSize: font.titleLarge,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: spacing.sm,
    lineHeight: font.titleLarge * 1.35,
  },
  heard: {
    fontSize: font.bodyLarge,
    fontStyle: "italic",
    color: colors.onSurface,
    marginTop: spacing.xxs,
  },
});
