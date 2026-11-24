import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { speak, stopSpeaking } from "../speech/speech";
import { Phrase, masterVocab, masterGrammar } from "../data/masterList";
import { recordSession } from "../stats";
import { shuffle } from "../util";
import { colors, font, shape, spacing, MIN_TOUCH } from "../theme";

type Pool = "all" | "phrases" | "grammar";
const POOLS: { key: Pool; ko: string; en: string }[] = [
  { key: "all",     ko: "전체", en: "All" },
  { key: "phrases", ko: "표현", en: "Phrases" },
  { key: "grammar", ko: "문법", en: "Grammar" },
];

function poolItems(pool: Pool): Phrase[] {
  if (pool === "phrases") return masterVocab;
  if (pool === "grammar") return masterGrammar;
  return [...masterVocab, ...masterGrammar];
}

/**
 * Listening game: a random phrase is played with its text hidden. Try to work
 * out what was said, then reveal the meaning and say whether you got it.
 * Every phrase is played once (in random order) before any repeats.
 */
export function GuessGameScreen({ onBack }: { onBack: () => void }) {
  const [pool, setPool] = useState<Pool>("all");
  const [current, setCurrent] = useState<Phrase | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [got, setGot] = useState(0);
  const [missed, setMissed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  const deck = useRef<Phrase[]>([]);
  const last = useRef<Phrase | null>(null);
  const tally = useRef({ got: 0, missed: 0 });

  // Save the round to the Progress screen when the player leaves.
  useEffect(
    () => () => {
      stopSpeaking();
      const { got: g, missed: m } = tally.current;
      if (g + m > 0) recordSession("guess", "듣기 게임 Listening Game", g, g + m);
    },
    []
  );

  function draw(p: Pool): Phrase {
    if (deck.current.length === 0) {
      let fresh = shuffle(poolItems(p));
      // Never start a new pass with the phrase we just played.
      if (fresh.length > 1 && fresh[fresh.length - 1] === last.current) fresh = [fresh[fresh.length - 1], ...fresh.slice(0, -1)];
      deck.current = fresh;
    }
    return deck.current.pop() as Phrase;
  }

  function next(p: Pool = pool) {
    const item = draw(p);
    last.current = item;
    setCurrent(item);
    setRevealed(false);
    speak(item.ko);
  }

  function changePool(p: Pool) {
    stopSpeaking();
    deck.current = [];
    setPool(p);
    setCurrent(null);
    setRevealed(false);
  }

  function rate(correct: boolean) {
    if (correct) {
      tally.current.got += 1;
      setGot((n) => n + 1);
      setStreak((s) => {
        const ns = s + 1;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      tally.current.missed += 1;
      setMissed((n) => n + 1);
      setStreak(0);
    }
    next();
  }

  const played = got + missed;

  return (
    <Screen>
      <ActivityHeader title="듣기 게임 Listening Game" onBack={onBack} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Body style={s.intro}>
          Listen, work out what was said, then reveal the meaning. No text until you tap Reveal.
        </Body>

        {/* What to practise */}
        <View style={s.tabs} accessibilityRole="tablist">
          {POOLS.map((p) => {
            const active = pool === p.key;
            return (
              <Pressable
                key={p.key}
                onPress={() => changePool(p.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${p.ko} ${p.en}`}
                style={[s.tab, active && s.tabActive]}
              >
                <Text style={[s.tabKo, active && s.tabTextActive]}>{p.ko}</Text>
                <Text style={[s.tabEn, active && s.tabTextActive]}>{p.en}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Score */}
        <View style={s.scoreRow}>
          <Pill tone="good" text={`✓ ${got}`} />
          <View style={{ width: spacing.sm }} />
          <Pill tone="bad" text={`✗ ${missed}`} />
          <View style={{ width: spacing.sm }} />
          <Pill text={`🔥 ${streak}${best > 0 ? `  ·  best ${best}` : ""}`} />
        </View>

        {!current ? (
          <Card style={s.startCard}>
            <Text style={s.bigEmoji}>🎲</Text>
            <Body style={{ textAlign: "center", color: colors.onSurfaceVariant }}>
              {poolItems(pool).length} phrases in the mix. Ready?
            </Body>
            <Button
              title="랜덤 재생 Play a random phrase"
              icon="🎲"
              onPress={() => next()}
              style={{ marginTop: spacing.md, alignSelf: "stretch" }}
            />
          </Card>
        ) : (
          <Card style={revealed ? { ...s.card, ...s.cardRevealed } : s.card}>
            {!revealed ? (
              <>
                <Text style={s.bigEmoji}>🎧</Text>
                <Text style={s.question}>What did you hear?</Text>
                <Body style={{ textAlign: "center", color: colors.onSurfaceVariant }}>
                  Play it as many times as you like.
                </Body>
              </>
            ) : (
              <>
                <Text style={s.ko}>{current.ko}</Text>
                <Text style={s.pron}>{current.pron}</Text>
                <Text style={s.en}>{current.en}</Text>
              </>
            )}

            <View style={s.row}>
              <Button
                title="다시 Again"
                icon="🔊"
                variant="tonal"
                onPress={() => speak(current.ko)}
                style={{ flex: 1, marginRight: spacing.xs }}
              />
              <Button
                title="천천히"
                icon="🐢"
                iconSize={font.headlineLarge}
                variant="tonal"
                onPress={() => speak(current.ko, { rate: 0.6 })}
                style={{ flex: 1, marginLeft: spacing.xs }}
              />
            </View>

            {!revealed ? (
              <>
                <Button
                  title="뜻 보기 Reveal meaning"
                  icon="👁️"
                  onPress={() => setRevealed(true)}
                  style={{ marginTop: spacing.sm, alignSelf: "stretch" }}
                />
                <Button
                  title="건너뛰기 Skip"
                  variant="text"
                  onPress={() => next()}
                  style={{ marginTop: spacing.xs, alignSelf: "stretch" }}
                />
              </>
            ) : (
              <>
                <Body style={s.askRow}>Did you understand it before revealing?</Body>
                <View style={s.row}>
                  <Pressable
                    onPress={() => rate(true)}
                    accessibilityRole="button"
                    accessibilityLabel="I got it"
                    style={({ pressed }) => [s.rateBtn, s.rateGood, pressed && { opacity: 0.85 }]}
                  >
                    <Text style={[s.rateText, { color: colors.onCorrect }]}>✓ 알았어요{"\n"}I got it</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => rate(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Not yet"
                    style={({ pressed }) => [s.rateBtn, s.rateBad, pressed && { opacity: 0.85 }]}
                  >
                    <Text style={[s.rateText, { color: colors.onError }]}>✗ 아직{"\n"}Not yet</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Card>
        )}

        {played > 0 ? (
          <Body style={s.footer}>
            {played} played · {Math.round((got / played) * 100)}% understood. Your score is saved to Progress when you leave.
          </Body>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  intro: { color: colors.onSurfaceVariant, marginTop: spacing.md },

  tabs: {
    flexDirection: "row",
    backgroundColor: colors.surfaceVariant,
    borderRadius: shape.full,
    padding: 4,
    marginTop: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: shape.full,
    minHeight: MIN_TOUCH + 4,
  },
  tabActive: { backgroundColor: colors.surface },
  tabKo: { fontSize: font.bodyLarge, fontWeight: "800", color: colors.onSurfaceVariant },
  tabEn: { fontSize: font.labelMedium, fontWeight: "700", color: colors.onSurfaceVariant },
  tabTextActive: { color: colors.primary },

  scoreRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md },

  startCard: { marginTop: spacing.md, alignItems: "center" },
  card: { marginTop: spacing.md, alignItems: "center" },
  cardRevealed: { borderColor: colors.primary, borderWidth: 2 },

  bigEmoji: { fontSize: font.emojiLg, textAlign: "center" },
  question: {
    fontSize: font.headlineSmall,
    fontWeight: "800",
    color: colors.onSurface,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  ko: {
    fontSize: font.headlineMedium,
    fontWeight: "800",
    color: colors.onSurface,
    textAlign: "center",
    lineHeight: font.headlineMedium * 1.3,
  },
  pron: { fontSize: font.bodyXL, fontWeight: "700", color: colors.secondary, textAlign: "center", marginTop: spacing.xs },
  en: { fontSize: font.titleLarge, fontWeight: "700", color: colors.onSurface, textAlign: "center", marginTop: spacing.sm },

  row: { flexDirection: "row", alignSelf: "stretch", marginTop: spacing.md },
  askRow: { marginTop: spacing.md, textAlign: "center", fontWeight: "700" },

  rateBtn: {
    flex: 1,
    minHeight: MIN_TOUCH + 16,
    borderRadius: shape.large,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  rateGood: { backgroundColor: colors.correct },
  rateBad: { backgroundColor: colors.error },
  rateText: { fontSize: font.titleMedium, fontWeight: "800", textAlign: "center" },

  footer: { marginTop: spacing.md, textAlign: "center", color: colors.onSurfaceVariant },
});
