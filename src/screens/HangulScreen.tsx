import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, H2, ChoiceButton, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak } from "../speech/speech";
import { hangulVowels, hangulConsonants, HangulItem } from "../data/content";
import { colors, font, shape, spacing, MIN_TOUCH } from "../theme";
import { shuffle } from "../util";

type Mode = "learn" | "quiz";

export function HangulScreen({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>("learn");
  return mode === "quiz" ? (
    <HangulQuiz onBack={onBack} onExit={() => setMode("learn")} />
  ) : (
    <HangulLearn onBack={onBack} onQuiz={() => setMode("quiz")} />
  );
}

/* ── Learn / browse ──────────────────────────────────────────────────────── */

function HangulLearn({ onBack, onQuiz }: { onBack: () => void; onQuiz: () => void }) {
  const [tab, setTab] = useState<"vowels" | "consonants">("consonants");
  const data = tab === "vowels" ? hangulVowels : hangulConsonants;

  return (
    <Screen>
      <ActivityHeader title="한글 Hangul" onBack={onBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.md }}>
          Tap a letter to hear its sound and an example word.
        </Body>

        {/* MD3-style tab bar */}
        <View
          style={s.tabs}
          accessibilityRole="tablist"
        >
          {(["consonants", "vowels"] as const).map((t) => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t === "consonants" ? "자음 Consonants" : "모음 Vowels"}
                style={[s.tab, active && s.tabActive]}
              >
                <Text style={[s.tabText, active && s.tabTextActive]}>
                  {t === "consonants" ? "자음 Consonants" : "모음 Vowels"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={s.grid}>
          {data.map((it) => <LetterCard key={it.char} item={it} />)}
        </View>

        <Button title="퀴즈 Quiz me" icon="✏️" onPress={onQuiz} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}

function LetterCard({ item }: { item: HangulItem }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => { setOpen((o) => !o); speak(item.syllable); }}
      accessibilityRole="button"
      accessibilityLabel={`${item.char}, ${item.rom}`}
      style={({ pressed }) => [s.cell, pressed && { opacity: 0.85 }]}
    >
      <Text style={s.cellChar}>{item.char}</Text>
      <Text style={s.cellRom}>{item.rom}</Text>
      {open && (
        <View style={{ alignItems: "center", marginTop: spacing.xs }}>
          <Text style={s.cellName}>이름 {item.name}</Text>
          <Pressable
            onPress={() => speak(item.ex.word)}
            accessibilityRole="button"
            accessibilityLabel={`Example: ${item.ex.word}, ${item.ex.en}`}
            style={s.exBtn}
          >
            <Text style={s.exWord}>{item.ex.word}</Text>
            <Text style={s.exRom}>{item.ex.rom} · {item.ex.en} 🔊</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

/* ── Quiz ────────────────────────────────────────────────────────────────── */

function HangulQuiz({ onBack, onExit }: { onBack: () => void; onExit: () => void }) {
  const pool = useMemo(() => shuffle([...hangulConsonants, ...hangulVowels]).slice(0, 12), []);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = pool[i];
  const options = useMemo(() => {
    const wrong = shuffle(
      [...hangulConsonants, ...hangulVowels].filter((x) => x.rom !== item.rom)
    ).slice(0, 2).map((x) => x.rom);
    return shuffle([item.rom, ...wrong]);
  }, [i]);
  const answerIndex = options.indexOf(item.rom);

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === answerIndex) setScore((s) => s + 1);
  }
  function next() {
    if (i + 1 >= pool.length) setDone(true);
    else { setI(i + 1); setPicked(null); }
  }
  function restart() { setI(0); setPicked(null); setScore(0); setDone(false); }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="한글 퀴즈 Quiz" onBack={onExit} />
        <DoneCard score={score} total={pool.length} onRestart={restart} onBack={onExit} mode="hangul" modeLabel="한글 Hangul" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="한글 퀴즈 Quiz" onBack={onExit} step={i + 1} total={pool.length} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
          <Text
            style={s.quizChar}
            accessibilityLabel={`Letter: ${item.char}`}
          >
            {item.char}
          </Text>
          <Button
            title="소리 듣기 Hear it"
            icon="🔊"
            variant="tonal"
            onPress={() => speak(item.syllable)}
            style={{ marginTop: spacing.sm }}
          />
        </Card>
        <H2 style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>What sound is this?</H2>
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
          <Button
            title={i + 1 >= pool.length ? "See results" : "다음 Next"}
            onPress={next}
            style={{ marginTop: spacing.md }}
          />
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    marginTop: spacing.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: shape.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: shape.full,
    minHeight: MIN_TOUCH,
    justifyContent: "center",
  },
  tabActive: { backgroundColor: colors.surface },
  tabText: { fontSize: font.labelLarge, fontWeight: "700", color: colors.onSurfaceVariant },
  tabTextActive: { color: colors.primary },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: spacing.md },
  cell: {
    width: "31.5%",
    backgroundColor: colors.surface,
    borderRadius: shape.medium,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: spacing.sm,
    minHeight: MIN_TOUCH + 16,
  },
  cellChar: { fontSize: font.hangul, fontWeight: "800", color: colors.onSurface },
  cellRom:  { fontSize: font.labelLarge, color: colors.secondary, fontWeight: "700", marginTop: spacing.xxs },
  cellName: { fontSize: font.labelMedium, color: colors.onSurfaceVariant },
  exBtn:    { alignItems: "center", marginTop: spacing.xs },
  exWord:   { fontSize: font.bodyLarge, fontWeight: "700", color: colors.primary },
  exRom:    { fontSize: font.labelSmall, color: colors.onSurfaceVariant, marginTop: spacing.xxs, textAlign: "center" },

  quizChar: { fontSize: font.hangulXL, fontWeight: "800", color: colors.onSurface },
});
