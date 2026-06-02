import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { speak, stopSpeaking } from "../speech/speech";
import { reviewItems } from "../data/review";
import { colors, font, radius, spacing } from "../theme";
import { shuffle } from "../util";

/**
 * Exposure maintenance: a hands-free playlist that cycles through everything
 * you've met, speaking each item and showing it. Keeps vocabulary and sentences
 * warm so they don't fade. Two modes: "Show" (read along) and "Listen" (text is
 * hidden so you train comprehension; tap to reveal).
 */
export function ExposureScreen({ onBack }: { onBack: () => void }) {
  const [order] = useState(() => shuffle(reviewItems));
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  const [listenMode, setListenMode] = useState(false); // hide text → comprehension
  const [peek, setPeek] = useState(false); // reveal the hidden text for this item
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const item = order[idx];

  useEffect(
    () => () => {
      playingRef.current = false;
      if (timer.current) clearTimeout(timer.current);
      stopSpeaking();
    },
    []
  );

  function setIndex(n: number) {
    const m = (n + order.length) % order.length;
    idxRef.current = m;
    setIdx(m);
    setPeek(false);
  }

  function speakCurrent() {
    const it = order[idxRef.current];
    speak(it.ko, {
      onDone: () => {
        if (!playingRef.current) return;
        timer.current = setTimeout(() => {
          setIndex(idxRef.current + 1);
          speakCurrent();
        }, 900);
      },
    });
  }

  function play() {
    playingRef.current = true;
    setPlaying(true);
    speakCurrent();
  }
  function pause() {
    playingRef.current = false;
    setPlaying(false);
    if (timer.current) clearTimeout(timer.current);
    stopSpeaking();
  }
  function jump(delta: number) {
    if (timer.current) clearTimeout(timer.current);
    stopSpeaking();
    setIndex(idxRef.current + delta);
    if (playingRef.current) speakCurrent();
    else speak(order[(idxRef.current) % order.length].ko);
  }

  const showText = !listenMode || peek;

  return (
    <Screen>
      <ActivityHeader title="노출 유지 Exposure" onBack={onBack} step={idx + 1} total={order.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Body style={{ color: colors.textSoft, marginTop: spacing.md, textAlign: "center" }}>
          Keep what you've learned warm. Press play and let it run — hands-free.
        </Body>

        {/* The card */}
        <Pressable onPress={() => (listenMode && !peek ? setPeek(true) : speak(item.ko))}>
          <Card style={{ marginTop: spacing.md, alignItems: "center", minHeight: 260, justifyContent: "center" }}>
            {item.emoji ? <Text style={{ fontSize: 72 }}>{item.emoji}</Text> : <Text style={{ fontSize: 64 }}>{playing ? "🔊" : "🎧"}</Text>}
            {showText ? (
              <>
                <Text style={styles.ko}>{item.ko}</Text>
                <Rom style={{ fontSize: font.body }}>{item.rom}</Rom>
                <Body style={{ color: colors.textSoft, marginTop: spacing.xs, textAlign: "center" }}>{item.en}</Body>
              </>
            ) : (
              <Body style={{ color: colors.textSoft, marginTop: spacing.md }}>🎧 들어보세요 · Listen… (tap to reveal)</Body>
            )}
          </Card>
        </Pressable>

        {/* Transport controls */}
        <View style={styles.row}>
          <Button title="‹ 이전" variant="neutral" onPress={() => jump(-1)} style={{ flex: 1, marginRight: spacing.xs }} />
          <Button
            title={playing ? "⏸ 멈춤 Pause" : "▶️ 재생 Play"}
            variant={playing ? "accent" : "primary"}
            onPress={playing ? pause : play}
            style={{ flex: 1.4, marginHorizontal: spacing.xs }}
          />
          <Button title="다음 ›" variant="neutral" onPress={() => jump(1)} style={{ flex: 1, marginLeft: spacing.xs }} />
        </View>

        {/* Mode toggle */}
        <Pressable
          onPress={() => {
            setListenMode((m) => !m);
            setPeek(false);
          }}
          style={({ pressed }) => [styles.toggle, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.toggleText}>{listenMode ? "🙈 Listen mode (text hidden)" : "📖 Show mode (read along)"}</Text>
          <Text style={styles.toggleHint}>Tap to switch</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ko: { fontSize: font.hangul - 8, fontWeight: "800", color: colors.text, marginTop: spacing.sm, textAlign: "center" },
  row: { flexDirection: "row", marginTop: spacing.lg, alignItems: "stretch" },
  toggle: {
    marginTop: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  toggleText: { fontSize: font.body, fontWeight: "700", color: colors.text },
  toggleHint: { fontSize: font.label - 2, color: colors.textSoft, marginTop: 2 },
});
