import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, H2, Rom, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import {
  speak,
  stopSpeaking,
  isRecognitionAvailable,
  startRecognition,
  RecognitionHandle,
  matchScore,
} from "../speech/speech";
import { reviewItems, reviewItemById, ReviewItem } from "../data/review";
import { getDue, getCard, rate, nextLabel, stats, Grade } from "../srs";
import { colors, font, radius, spacing } from "../theme";
import { shuffle } from "../util";

const SESSION = 20;
const allIds = reviewItems.map((r) => r.id);

export function RecallScreen({ onBack }: { onBack: () => void }) {
  // The study queue is a list of item ids. Built on mount from what's due.
  const [queue, setQueue] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"cue" | "reveal">("cue");
  const [reviewed, setReviewed] = useState(0);
  const [heard, setHeard] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();

  const dueNow = useMemo(() => getDue(allIds, Date.now(), SESSION), []);
  const progress = useMemo(() => stats(allIds), [queue]);

  useEffect(() => () => stopRec(), []);

  function startQueue(ids: string[]) {
    setQueue(ids);
    setIdx(0);
    setPhase("cue");
    setReviewed(0);
    setHeard("");
  }

  function stopRec() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  // ----- Start screen (choose due now, or review ahead) -----
  if (queue === null) {
    return (
      <Screen>
        <ActivityHeader title="기억하기 Recall" onBack={onBack} />
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
            <Text style={{ fontSize: 56 }}>🧠</Text>
            <H2 style={{ marginTop: spacing.sm, textAlign: "center" }}>Active recall</H2>
            <Body style={{ color: colors.textSoft, textAlign: "center", marginTop: spacing.xs }}>
              See the meaning, say the Korean from memory, then check yourself. Items come back right
              before you'd forget them.
            </Body>
            <View style={styles.statRow}>
              <Stat label="Due now" value={dueNow.length} tone="accent" />
              <Stat label="Studied" value={`${progress.studied}/${progress.total}`} />
              <Stat label="Strong" value={progress.mature} tone="good" />
            </View>
          </Card>

          {dueNow.length > 0 ? (
            <Button title={`복습 시작 · Review ${dueNow.length} due`} icon="▶️" onPress={() => startQueue(dueNow.map((c) => c.id))} style={{ marginTop: spacing.lg }} />
          ) : (
            <Card style={{ marginTop: spacing.lg, alignItems: "center", backgroundColor: colors.correctBg, borderColor: colors.correct }}>
              <Text style={{ fontSize: 40 }}>✅</Text>
              <Body style={{ fontWeight: "700", marginTop: spacing.xs }}>다 했어요! Nothing due right now.</Body>
              <Body style={{ color: colors.textSoft, textAlign: "center", marginTop: spacing.xs }}>
                Come back later, or get ahead with a quick session.
              </Body>
            </Card>
          )}
          <Button
            title="미리 복습 · Review ahead"
            icon="⏩"
            variant="neutral"
            onPress={() => startQueue(shuffle(allIds).slice(0, SESSION))}
            style={{ marginTop: spacing.sm }}
          />
        </ScrollView>
      </Screen>
    );
  }

  // ----- Session complete -----
  if (idx >= queue.length) {
    return (
      <Screen>
        <ActivityHeader title="기억하기 Recall" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>🎉</Text>
          <H2 style={{ marginTop: spacing.sm, textAlign: "center" }}>잘했어요! Session done</H2>
          <Text style={styles.bigNum}>{reviewed}</Text>
          <Body style={{ color: colors.textSoft }}>items recalled</Body>
          <Button title="메뉴로 Back to menu" onPress={onBack} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
          <Button
            title="더 하기 · Review ahead"
            variant="neutral"
            onPress={() => startQueue(shuffle(allIds).slice(0, SESSION))}
            style={{ marginTop: spacing.sm, alignSelf: "stretch" }}
          />
        </Card>
      </Screen>
    );
  }

  const item = reviewItemById(queue[idx]) as ReviewItem;

  function reveal() {
    stopRec();
    setPhase("reveal");
    setTimeout(() => speak(item.ko), 200); // hear it as you check
  }

  function grade(g: Grade) {
    rate(item.id, g);
    setReviewed((n) => n + 1);
    setHeard("");
    setPhase("cue");
    setIdx((k) => k + 1);
  }

  function startListening() {
    setHeard("");
    const handle = startRecognition({
      onResult: (t, isFinal) => {
        setHeard(t);
        if (isFinal) stopRec();
      },
      onError: () => setListening(false),
      onEnd: () => setListening(false),
    });
    if (!handle) return;
    recRef.current = handle;
    setListening(true);
  }

  const sayScore = heard ? matchScore(item.ko, heard) : null;

  return (
    <Screen>
      <ActivityHeader title="기억하기 Recall" onBack={onBack} step={idx + 1} total={queue.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* CUE: the meaning (+ picture). Recall the Korean from memory. */}
        <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
          {item.emoji && <Text style={{ fontSize: 64 }}>{item.emoji}</Text>}
          <Body style={{ color: colors.textSoft }}>{item.kind === "word" ? "이 단어를 한국어로?" : "이 뜻을 한국어로?"}</Body>
          <Text style={styles.cue}>{item.en}</Text>
        </Card>

        {phase === "cue" ? (
          <>
            {supported && (
              <Button
                title={listening ? "듣는 중… 탭하면 멈춤" : "기억해서 말하기 · Say it from memory"}
                icon={listening ? "🔴" : "🎤"}
                variant={listening ? "accent" : "neutral"}
                onPress={listening ? stopRec : startListening}
                style={{ marginTop: spacing.lg }}
              />
            )}
            {heard !== "" && (
              <Body style={{ color: colors.textSoft, marginTop: spacing.sm, fontStyle: "italic" }}>“{heard}”</Body>
            )}
            <Button title="정답 보기 · Show answer" icon="👁️" onPress={reveal} style={{ marginTop: spacing.md }} />
          </>
        ) : (
          <>
            <Card style={{ marginTop: spacing.md }}>
              <Text style={styles.answer}>{item.ko}</Text>
              <Rom style={{ fontSize: font.body }}>{item.rom}</Rom>
              {sayScore != null && (
                <View style={{ marginTop: spacing.sm }}>
                  <Pill
                    tone={sayScore >= 0.6 ? "good" : sayScore >= 0.4 ? "neutral" : "bad"}
                    text={sayScore >= 0.6 ? "✓ You said it well!" : `You said: “${heard}”`}
                  />
                </View>
              )}
              <Button title="다시 듣기 Hear again" icon="🔊" variant="neutral" onPress={() => speak(item.ko)} style={{ marginTop: spacing.md }} />
            </Card>

            <Body style={{ color: colors.textSoft, textAlign: "center", marginTop: spacing.lg }}>
              How well did you remember it?
            </Body>
            <View style={styles.gradeRow}>
              <GradeBtn label="다시 Again" sub={nextLabel(undefined, "again")} color={colors.wrong} onPress={() => grade("again")} />
              <GradeBtn label="좋아요 Good" sub={recallNext(item.id, "good")} color={colors.primary} onPress={() => grade("good")} />
              <GradeBtn label="쉬워요 Easy" sub={recallNext(item.id, "easy")} color={colors.correct} onPress={() => grade("easy")} />
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

// Compute the "next review" label shown on each grade button.
function recallNext(id: string, g: Grade): string {
  return nextLabel(getCard(id), g);
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "good" | "accent" }) {
  const color = tone === "good" ? colors.correct : tone === "accent" ? colors.accent : colors.text;
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function GradeBtn({ label, sub, color, onPress }: { label: string; sub: string; color: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.grade, { borderColor: color, opacity: pressed ? 0.85 : 1 }]}>
      <Text style={[styles.gradeLabel, { color }]}>{label}</Text>
      <Text style={styles.gradeSub}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  statRow: { flexDirection: "row", justifyContent: "space-between", alignSelf: "stretch", marginTop: spacing.lg },
  stat: { alignItems: "center", flex: 1 },
  statValue: { fontSize: font.heading, fontWeight: "900" },
  statLabel: { fontSize: font.label - 2, color: colors.textSoft, marginTop: 2 },
  cue: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.xs, textAlign: "center", lineHeight: font.big * 1.3 },
  answer: { fontSize: font.big + 4, fontWeight: "800", color: colors.primary, lineHeight: (font.big + 4) * 1.3 },
  gradeRow: { flexDirection: "row", marginTop: spacing.md, justifyContent: "space-between" },
  grade: {
    flex: 1,
    borderWidth: 2,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: colors.card,
  },
  gradeLabel: { fontSize: font.label, fontWeight: "800" },
  gradeSub: { fontSize: font.label - 3, color: colors.textSoft, marginTop: 2 },
  bigNum: { fontSize: font.title + 14, fontWeight: "900", color: colors.primary, marginTop: spacing.md },
});
