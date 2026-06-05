import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { speak, stopSpeaking } from "../speech/speech";
import { reviewItems } from "../data/review";
import { colors, font, shape, spacing, MIN_TOUCH } from "../theme";
import { shuffle } from "../util";

export function ExposureScreen({ onBack }: { onBack: () => void }) {
  const [order] = useState(() => shuffle(reviewItems));
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);
  const [listenMode, setListenMode] = useState(false);
  const [peek, setPeek] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const item = order[idx];

  useEffect(() => () => {
    playingRef.current = false;
    if (timer.current) clearTimeout(timer.current);
    stopSpeaking();
  }, []);

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
        timer.current = setTimeout(() => { setIndex(idxRef.current + 1); speakCurrent(); }, 900);
      },
    });
  }
  function play() { playingRef.current = true; setPlaying(true); speakCurrent(); }
  function pause() {
    playingRef.current = false; setPlaying(false);
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.md, textAlign: "center" }}>
          Keep what you've learned warm. Press play and let it run — hands-free.
        </Body>

        {/* Card */}
        <Pressable
          onPress={() => (listenMode && !peek ? setPeek(true) : speak(item.ko))}
          accessibilityRole="button"
          accessibilityLabel={showText ? item.ko : "Tap to reveal"}
        >
          <Card style={{ marginTop: spacing.md, alignItems: "center", minHeight: 260, justifyContent: "center" }}>
            {item.emoji ? (
              <Text style={{ fontSize: font.emojiXL }}>{item.emoji}</Text>
            ) : (
              <Text style={{ fontSize: font.emojiLg }}>{playing ? "🔊" : "🎧"}</Text>
            )}
            {showText ? (
              <>
                <Text style={s.ko}>{item.ko}</Text>
                <Rom style={{ fontSize: font.bodyLarge }}>{item.rom}</Rom>
                <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs, textAlign: "center" }}>
                  {item.en}
                </Body>
              </>
            ) : (
              <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.md }}>
                🎧 들어보세요 · Listen… (tap to reveal)
              </Body>
            )}
          </Card>
        </Pressable>

        {/* Transport */}
        <View style={s.row}>
          <Button title="‹" variant="tonal"   onPress={() => jump(-1)} style={{ flex: 1, marginRight: spacing.xs }} accessibilityLabel="Previous" />
          <Button
            title={playing ? "⏸ Pause" : "▶️ Play"}
            variant={playing ? "accent" : "filled"}
            onPress={playing ? pause : play}
            style={{ flex: 1.4, marginHorizontal: spacing.xs }}
          />
          <Button title="›" variant="tonal"   onPress={() => jump(1)} style={{ flex: 1, marginLeft: spacing.xs }} accessibilityLabel="Next" />
        </View>

        {/* Mode toggle */}
        <Pressable
          onPress={() => { setListenMode((m) => !m); setPeek(false); }}
          accessibilityRole="switch"
          accessibilityState={{ checked: listenMode }}
          accessibilityLabel={listenMode ? "Listen mode — tap to switch to Show mode" : "Show mode — tap to switch to Listen mode"}
          style={({ pressed }) => [s.toggle, pressed && { opacity: 0.85 }]}
        >
          <Text style={s.toggleText}>
            {listenMode ? "🙈 Listen mode (text hidden)" : "📖 Show mode (read along)"}
          </Text>
          <Text style={s.toggleHint}>Tap to switch</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  ko: {
    fontSize: font.hangul - 8,
    fontWeight: "800",
    color: colors.onSurface,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  row: { flexDirection: "row", marginTop: spacing.lg, alignItems: "stretch" },
  toggle: {
    marginTop: spacing.lg,
    borderRadius: shape.medium,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    minHeight: MIN_TOUCH,
  },
  toggleText: { fontSize: font.bodyLarge, fontWeight: "700", color: colors.onSurface },
  toggleHint: { fontSize: font.labelMedium, color: colors.onSurfaceVariant, marginTop: spacing.xxs },
});
