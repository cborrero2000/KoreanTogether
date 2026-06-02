import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import {
  speak,
  stopSpeaking,
  isRecognitionAvailable,
  startRecognition,
  RecognitionHandle,
  matchScore,
} from "../speech/speech";
import { speaking } from "../data/content";
import { colors, font, spacing } from "../theme";

const PASS = 0.6; // Korean speech-to-text is fuzzier; 60% similarity counts as correct.

export function SpeakingScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null); // 0..1 for current item
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
    setHeard("");
    setScore(null);
    const handle = startRecognition({
      onResult: (transcript, isFinal) => {
        setHeard(transcript);
        if (isFinal) finish(transcript);
      },
      onError: () => setListening(false),
      onEnd: () => setListening(false),
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
    else {
      setI(i + 1);
      setHeard("");
      setScore(null);
      setShowEn(false);
    }
  }

  function restart() {
    stopSpeaking();
    setI(0);
    setHeard("");
    setScore(null);
    setPasses(0);
    setShowEn(false);
    setDone(false);
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
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Card style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.textSoft }}>이 문장을 소리 내어 읽어 보세요 · Read this aloud:</Body>
          <Text style={styles.target}>{item.ko}</Text>
          <Rom style={{ fontSize: font.body }}>{item.rom}</Rom>
          {showEn ? (
            <Body style={{ marginTop: spacing.xs, fontWeight: "700" }}>{item.en}</Body>
          ) : (
            <Button title="뜻 보기 Translation" icon="🌐" variant="ghost" onPress={() => setShowEn(true)} style={{ marginTop: spacing.sm }} />
          )}
          <Button title="듣기 Hear it" icon="🔊" variant="neutral" onPress={() => speak(item.ko)} style={{ marginTop: spacing.md }} />
        </Card>

        {supported ? (
          <>
            <Button
              title={listening ? "듣는 중… 탭하면 멈춤" : "탭하고 말하기 · Tap and speak"}
              icon={listening ? "🔴" : "🎤"}
              variant={listening ? "accent" : "primary"}
              onPress={listening ? stopRec : startListening}
              style={{ marginTop: spacing.lg }}
            />
            {(heard !== "" || score != null) && (
              <Card style={{ marginTop: spacing.md }}>
                <Body style={{ color: colors.textSoft }}>I heard you say:</Body>
                <Text style={styles.heard}>“{heard || "…"}”</Text>
                {score != null && (
                  <View style={{ marginTop: spacing.sm }}>
                    <Pill
                      tone={passed ? "good" : close ? "neutral" : "bad"}
                      text={passed ? "✓ 잘했어요! Great!" : close ? "거의 맞았어요! Almost — try again." : "다시 해 볼까요? Try again."}
                    />
                  </View>
                )}
              </Card>
            )}
          </>
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            <Body style={{ fontWeight: "700" }}>🎤 Speaking check works in the web browser</Body>
            <Body style={{ color: colors.textSoft, marginTop: spacing.xs }}>
              On this device, open the app in Chrome or Edge on a computer to have your Korean checked
              automatically. For now, tap “Hear it”, then repeat the sentence out loud.
            </Body>
          </Card>
        )}

        {/* You can't move on until you say it right — but Skip is always allowed. */}
        {passed ? (
          <Button title={i + 1 >= speaking.length ? "끝내기 Finish" : "다음 Next ›"} onPress={advance} style={{ marginTop: spacing.lg }} />
        ) : (
          <Button
            title={i + 1 >= speaking.length ? "건너뛰고 끝내기 Skip & finish" : "건너뛰기 Skip"}
            variant="neutral"
            onPress={advance}
            style={{ marginTop: spacing.lg }}
          />
        )}
        {!passed && (
          <Body style={{ color: colors.textSoft, textAlign: "center", marginTop: spacing.sm }}>
            Say it correctly to unlock “Next”, or Skip if you want to move on.
          </Body>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  target: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.sm, lineHeight: font.big * 1.35 },
  heard: { fontSize: font.body, fontStyle: "italic", color: colors.text, marginTop: 4 },
});
