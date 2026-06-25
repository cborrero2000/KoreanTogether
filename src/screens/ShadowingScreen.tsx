import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import {
  speak, stopSpeaking, isRecognitionAvailable,
  startRecognition, RecognitionHandle, matchScore,
} from "../speech/speech";
import { shadowItems } from "../data/shadowing";
import { colors, font, spacing } from "../theme";

const PASS = 0.6;

export function ShadowingScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [passes, setPasses] = useState(0);
  const [showEn, setShowEn] = useState(false);
  const [done, setDone] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();

  const item = shadowItems[i];
  const passed = score != null && score >= PASS;
  const close = score != null && score >= 0.4 && score < PASS;

  useEffect(() => () => { stopRec(); stopSpeaking(); }, []);

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

  /** Play the line, then immediately listen for the user's echo. */
  function shadow() {
    setHeard(""); setScore(null);
    speak(item.ko, { onDone: () => { if (supported) startListening(); } });
  }

  function advance() {
    if (i + 1 >= shadowItems.length) setDone(true);
    else { setI(i + 1); setHeard(""); setScore(null); setShowEn(false); }
  }
  function restart() {
    stopSpeaking();
    setI(0); setHeard(""); setScore(null); setPasses(0); setShowEn(false); setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="쉐도잉 Shadowing" onBack={onBack} />
        <DoneCard score={passes} total={shadowItems.length} onRestart={restart} onBack={onBack} mode="shadowing" modeLabel="쉐도잉 Shadowing" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="쉐도잉 Shadowing" onBack={onBack} step={i + 1} total={shadowItems.length} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.md }}>
          Listen, then say it back right away — match the rhythm, not just the words.
        </Body>

        {/* Target sentence */}
        <Card style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.onSurfaceVariant }}>{item.source}</Body>
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
          <View style={s.btnRow}>
            <Button
              title="듣기 Listen"
              icon="🔊"
              variant="tonal"
              onPress={() => speak(item.ko)}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title="천천히 Slower"
              icon="🐢"
              iconSize={font.headlineLarge}
              variant="tonal"
              onPress={() => speak(item.ko, { rate: 0.55 })}
              style={{ flex: 1, marginLeft: spacing.sm }}
            />
          </View>
        </Card>

        {/* Shadow button + result */}
        {supported ? (
          <>
            <Button
              title={listening ? "듣는 중… 따라 말하세요" : "🗣️ 따라 말하기 Shadow it"}
              icon={listening ? "🔴" : "🎙️"}
              variant={listening ? "accent" : "filled"}
              onPress={listening ? stopRec : shadow}
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
                        passed ? "✓ 좋아요! Great rhythm!"
                        : close ? "거의 다 왔어요! Almost — try again."
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
            <Body style={{ fontWeight: "700" }}>🎤 Shadowing check isn't available on this device</Body>
            <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
              Speech recognition needs microphone permission, or isn't supported here. Tap "Listen", then shadow it out loud anyway.
            </Body>
          </Card>
        )}

        <View style={s.navRow}>
          <Button
            title="건너뛰기 Skip"
            variant="outlined"
            onPress={advance}
            style={{ flex: 1, marginRight: spacing.sm }}
          />
          <Button
            title={i + 1 >= shadowItems.length ? "끝내기 Finish" : "다음 Next ›"}
            onPress={advance}
            style={{ flex: 1, marginLeft: spacing.sm }}
          />
        </View>
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
  btnRow: {
    flexDirection: "row",
    marginTop: spacing.md,
  },
  navRow: {
    flexDirection: "row",
    marginTop: spacing.lg,
  },
});
