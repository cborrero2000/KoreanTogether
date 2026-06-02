import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, H2, ChoiceButton, Rom } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak } from "../speech/speech";
import { hangulVowels, hangulConsonants, HangulItem } from "../data/content";
import { colors, font, radius, spacing } from "../theme";
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

/* ---------- Learn / browse ---------- */

function HangulLearn({ onBack, onQuiz }: { onBack: () => void; onQuiz: () => void }) {
  const [tab, setTab] = useState<"vowels" | "consonants">("consonants");
  const data = tab === "vowels" ? hangulVowels : hangulConsonants;

  return (
    <Screen>
      <ActivityHeader title="한글 Hangul" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Body style={{ color: colors.textSoft, marginTop: spacing.md }}>
          Tap a letter to hear its sound and an example word.
        </Body>

        <View style={styles.tabs}>
          <Pressable
            onPress={() => setTab("consonants")}
            style={[styles.tab, tab === "consonants" && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === "consonants" && styles.tabTextActive]}>자음 Consonants</Text>
          </Pressable>
          <Pressable onPress={() => setTab("vowels")} style={[styles.tab, tab === "vowels" && styles.tabActive]}>
            <Text style={[styles.tabText, tab === "vowels" && styles.tabTextActive]}>모음 Vowels</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {data.map((it) => (
            <LetterCard key={it.char} item={it} />
          ))}
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
      onPress={() => {
        setOpen((o) => !o);
        speak(item.syllable);
      }}
      style={({ pressed }) => [styles.cell, pressed && { opacity: 0.85 }]}
    >
      <Text style={styles.cellChar}>{item.char}</Text>
      <Text style={styles.cellRom}>{item.rom}</Text>
      {open && (
        <View style={{ alignItems: "center", marginTop: spacing.xs }}>
          <Text style={styles.cellName}>이름 {item.name}</Text>
          <Pressable onPress={() => speak(item.ex.word)} style={styles.exBtn}>
            <Text style={styles.exWord}>{item.ex.word}</Text>
            <Text style={styles.exRom}>{item.ex.rom} · {item.ex.en} 🔊</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

/* ---------- Quiz: hear/see a letter, pick its romanization ---------- */

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
    )
      .slice(0, 2)
      .map((x) => x.rom);
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
    else {
      setI(i + 1);
      setPicked(null);
    }
  }
  function restart() {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="한글 퀴즈 Quiz" onBack={onExit} />
        <DoneCard score={score} total={pool.length} onRestart={restart} onBack={onExit} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="한글 퀴즈 Quiz" onBack={onExit} step={i + 1} total={pool.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Card style={{ marginTop: spacing.md, alignItems: "center" }}>
          <Text style={styles.quizChar}>{item.char}</Text>
          <Button title="소리 듣기 Hear it" icon="🔊" variant="neutral" onPress={() => speak(item.syllable)} style={{ marginTop: spacing.sm }} />
        </Card>
        <H2 style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>What sound is this?</H2>
        {options.map((opt, idx) => {
          let state: "idle" | "correct" | "wrong" | "dim" = "idle";
          if (picked != null) {
            if (idx === answerIndex) state = "correct";
            else if (idx === picked) state = "wrong";
            else state = "dim";
          }
          return <ChoiceButton key={idx} label={opt} state={state} disabled={picked != null} onPress={() => choose(idx)} />;
        })}
        {picked != null && (
          <Button title={i + 1 >= pool.length ? "See results" : "다음 Next"} onPress={next} style={{ marginTop: spacing.md }} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", marginTop: spacing.md, backgroundColor: colors.neutralBtn, borderRadius: radius.pill, padding: 4 },
  tab: { flex: 1, paddingVertical: spacing.sm, alignItems: "center", borderRadius: radius.pill },
  tabActive: { backgroundColor: colors.card },
  tabText: { fontSize: font.label, fontWeight: "700", color: colors.textSoft },
  tabTextActive: { color: colors.primary },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: spacing.md },
  cell: {
    width: "31.5%",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cellChar: { fontSize: 44, fontWeight: "800", color: colors.text },
  cellRom: { fontSize: font.label, color: colors.rom, fontWeight: "700", marginTop: 2 },
  cellName: { fontSize: font.label, color: colors.textSoft },
  exBtn: { alignItems: "center", marginTop: spacing.xs },
  exWord: { fontSize: font.body, fontWeight: "700", color: colors.primary },
  exRom: { fontSize: font.label - 2, color: colors.textSoft, marginTop: 1, textAlign: "center" },
  quizChar: { fontSize: 96, fontWeight: "800", color: colors.text },
});
