import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import {
  speak, stopSpeaking, isRecognitionAvailable,
  startRecognition, RecognitionHandle, matchScore,
} from "../speech/speech";
import {
  Phrase, masterVocab, masterGrammar, masterDialogs, masterDistinctions,
} from "../data/masterList";
import { colors, font, shape, spacing, MIN_TOUCH } from "../theme";

/** Similarity (0..1) needed for a green "correct" result. */
const PASS = 0.7;
const SLOW = 0.6;
const REPEAT_TIMES = 3;
const GAP_MS = 700;

type Tab = "vocab" | "grammar" | "dialogs" | "tips";
const TABS: { key: Tab; ko: string; en: string }[] = [
  { key: "vocab",   ko: "표현", en: "Phrases" },
  { key: "grammar", ko: "문법", en: "Grammar" },
  { key: "dialogs", ko: "대화", en: "Dialogs" },
  { key: "tips",    ko: "팁",   en: "Tips" },
];

type Result = { heard: string; score: number };

export function MasterListScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("vocab");
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [micKey, setMicKey] = useState<string | null>(null);
  const [liveHeard, setLiveHeard] = useState("");
  const [results, setResults] = useState<Record<string, Result | "none">>({});
  const supported = isRecognitionAvailable();

  // Every new action bumps the token, so any queued "play again" / "next"
  // step from an older action quietly stops itself.
  const token = useRef(0);
  const recRef = useRef<RecognitionHandle | null>(null);
  const heardRef = useRef("");
  const scoredRef = useRef(false);

  useEffect(() => () => { token.current++; stopMic(); stopSpeaking(); }, []);

  /* ── audio ──────────────────────────────────────────────────────────── */

  function stopAll() {
    token.current++;
    stopMic();
    stopSpeaking();
    setPlayingKey(null);
  }

  /** Play one phrase `times` times in a row (with a short gap). */
  function play(key: string, text: string, opts?: { rate?: number; times?: number }) {
    stopAll();
    const my = token.current;
    let left = opts?.times ?? 1;
    const once = () => {
      setPlayingKey(key);
      speak(text, {
        rate: opts?.rate,
        onDone: () => {
          if (token.current !== my) return;
          left -= 1;
          if (left > 0) setTimeout(() => { if (token.current === my) once(); }, GAP_MS);
          else setPlayingKey(null);
        },
      });
    };
    once();
  }

  /** Play a whole list in order — e.g. every phrase, or a full conversation. */
  function playSequence(items: { key: string; text: string; voice?: "a" | "b" }[]) {
    stopAll();
    const my = token.current;
    const step = (i: number) => {
      if (token.current !== my) return;
      if (i >= items.length) { setPlayingKey(null); return; }
      const it = items[i];
      setPlayingKey(it.key);
      speak(it.text, {
        voice: it.voice,
        onDone: () => {
          if (token.current !== my) return;
          setTimeout(() => step(i + 1), GAP_MS);
        },
      });
    };
    step(0);
  }

  /* ── pronunciation check ────────────────────────────────────────────── */

  function stopMic() {
    recRef.current?.stop();
    recRef.current = null;
    setMicKey(null);
  }

  function score(key: string, target: string, heard: string) {
    if (scoredRef.current) return;
    scoredRef.current = true;
    setResults((r) => ({
      ...r,
      [key]: heard ? { heard, score: matchScore(target, heard) } : "none",
    }));
    stopMic();
  }

  function listen(key: string, target: string) {
    if (micKey === key) { stopMic(); return; } // tap again to cancel
    stopAll();
    heardRef.current = "";
    scoredRef.current = false;
    setLiveHeard("");
    setResults((r) => { const n = { ...r }; delete n[key]; return n; });
    const handle = startRecognition({
      onResult: (t, isFinal) => {
        heardRef.current = t;
        setLiveHeard(t);
        if (isFinal) score(key, target, t);
      },
      onError: () => score(key, target, heardRef.current),
      // Some recognizers end without a "final" flag — grade what we heard.
      onEnd: () => score(key, target, heardRef.current),
    });
    if (!handle) return;
    recRef.current = handle;
    setMicKey(key);
  }

  /* ── render helpers ─────────────────────────────────────────────────── */

  const card = (key: string, item: Phrase, label?: string) => (
    <PhraseCard
      key={key}
      item={item}
      label={label}
      playing={playingKey === key}
      recording={micKey === key}
      liveHeard={micKey === key ? liveHeard : ""}
      result={results[key]}
      micSupported={supported}
      onPlay={() => play(key, item.ko)}
      onSlow={() => play(key, item.ko, { rate: SLOW })}
      onRepeat={() => play(key, item.ko, { times: REPEAT_TIMES })}
      onMic={() => listen(key, item.ko)}
    />
  );

  const listTab = (prefix: string, list: Phrase[], intro: string) => (
    <>
      <Body style={s.intro}>{intro}</Body>
      <Button
        title={playingKey?.startsWith(prefix) ? "멈추기 Stop" : "전체 듣기 Play all"}
        icon={playingKey?.startsWith(prefix) ? "⏹️" : "▶️"}
        variant="tonal"
        onPress={() =>
          playingKey?.startsWith(prefix)
            ? stopAll()
            : playSequence(list.map((p, i) => ({ key: `${prefix}${i}`, text: p.ko })))
        }
        style={{ marginTop: spacing.md }}
      />
      {list.map((p, i) => card(`${prefix}${i}`, p, String(i + 1)))}
    </>
  );

  return (
    <Screen>
      <ActivityHeader title="표현 목록 Master List" onBack={onBack} />

      {/* MD3-style tab bar */}
      <View style={s.tabs} accessibilityRole="tablist">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => { stopAll(); setTab(t.key); }}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${t.ko} ${t.en}`}
              style={[s.tab, active && s.tabActive]}
            >
              <Text style={[s.tabKo, active && s.tabTextActive]}>{t.ko}</Text>
              <Text style={[s.tabEn, active && s.tabTextActive]}>{t.en}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {tab === "vocab" &&
          listTab("v", masterVocab, "29 everyday expressions. Play each one as many times as you like, then tap 🎤 and say it.")}

        {tab === "grammar" &&
          listTab("g", masterGrammar, "The small building blocks inside the phrases.")}

        {tab === "dialogs" && (
          <>
            <Body style={s.intro}>Two short practice conversations. Play the whole thing, then practice each line.</Body>
            {masterDialogs.map((d, di) => {
              const prefix = `d${di}-`;
              const isPlaying = !!playingKey?.startsWith(prefix);
              return (
                <View key={d.title} style={{ marginTop: spacing.lg }}>
                  <Text style={s.sectionTitle}>{d.title}</Text>
                  <Button
                    title={isPlaying ? "멈추기 Stop" : "대화 듣기 Play conversation"}
                    icon={isPlaying ? "⏹️" : "▶️"}
                    variant="tonal"
                    onPress={() =>
                      isPlaying
                        ? stopAll()
                        : playSequence(d.lines.map((l, li) => ({
                            key: `${prefix}${li}`,
                            text: l.ko,
                            voice: li === 0 ? "a" : "b", // asker vs. answerer
                          })))
                    }
                    style={{ marginTop: spacing.sm }}
                  />
                  {d.lines.map((l, li) => card(`${prefix}${li}`, l, l.purpose))}
                </View>
              );
            })}
          </>
        )}

        {tab === "tips" && (
          <>
            <Body style={s.intro}>Useful distinctions — when to use which.</Body>
            {masterDistinctions.map((t, ti) => (
              <View key={t.title} style={{ marginTop: spacing.lg }}>
                <Text style={s.sectionTitle}>{t.title}</Text>
                <Card style={{ marginTop: spacing.sm, backgroundColor: colors.secondaryContainer }}>
                  <Body style={{ color: colors.onSecondaryContainer, fontWeight: "600" }}>{t.text}</Body>
                </Card>
                {t.phrases.map((p, pi) => card(`t${ti}-${pi}`, p))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

/* ── One phrase: Korean, pronunciation, meaning + controls ─────────────── */

function PhraseCard({
  item, label, playing, recording, liveHeard, result, micSupported,
  onPlay, onSlow, onRepeat, onMic,
}: {
  item: Phrase;
  label?: string;
  playing: boolean;
  recording: boolean;
  liveHeard: string;
  result?: Result | "none";
  micSupported: boolean;
  onPlay: () => void;
  onSlow: () => void;
  onRepeat: () => void;
  onMic: () => void;
}) {
  const graded = result && result !== "none" ? result : null;
  const good = graded ? graded.score >= PASS : null;

  return (
    <View
      style={[
        s.card,
        playing && s.cardPlaying,
        good === true && s.cardGood,
        good === false && s.cardBad,
      ]}
    >
      <View style={s.headRow}>
        {label ? (
          <View style={s.badge}><Text style={s.badgeText}>{label}</Text></View>
        ) : null}
        <Text style={s.ko}>{item.ko}</Text>
      </View>
      <Text style={s.pron}>{item.pron}</Text>
      <Text style={s.en}>{item.en}</Text>

      <View style={s.ctrlRow}>
        <IconBtn icon="🔊" label="Play" onPress={onPlay} active={playing} />
        <IconBtn icon="🐢" label="Slow" onPress={onSlow} />
        <IconBtn icon="🔁" label={`×${REPEAT_TIMES}`} onPress={onRepeat} accessibilityLabel={`Repeat ${REPEAT_TIMES} times`} />
        {micSupported ? (
          <IconBtn
            icon={recording ? "🔴" : "🎤"}
            label={recording ? "Stop" : "Say it"}
            onPress={onMic}
            active={recording}
            accent
          />
        ) : null}
      </View>

      {recording ? (
        <Text style={s.listening}>듣는 중… say it now{liveHeard ? `:  "${liveHeard}"` : ""}</Text>
      ) : null}

      {graded ? (
        <View style={[s.feedback, good ? s.feedbackGood : s.feedbackBad]}>
          <Text style={[s.feedbackTitle, { color: good ? colors.correct : colors.error }]}>
            {good ? "✓ 잘했어요! Correct" : "✗ 다시 해 봐요 Try again"}  ·  {Math.round(graded.score * 100)}%
          </Text>
          <Text style={s.feedbackHeard}>I heard: "{graded.heard}"</Text>
        </View>
      ) : result === "none" ? (
        <Text style={s.listening}>I didn't catch that — tap 🎤 and try again.</Text>
      ) : null}
    </View>
  );
}

function IconBtn({
  icon, label, onPress, active, accent, accessibilityLabel,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  active?: boolean;
  accent?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        s.iconBtn,
        accent && s.iconBtnAccent,
        active && (accent ? s.iconBtnRecording : s.iconBtnActive),
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={s.iconBtnIcon}>{icon}</Text>
      <Text style={[s.iconBtnLabel, active && { color: accent ? colors.onError : colors.onPrimary }]}>{label}</Text>
    </Pressable>
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

  sectionTitle: { fontSize: font.titleLarge, fontWeight: "800", color: colors.onBackground },

  card: {
    backgroundColor: colors.surface,
    borderRadius: shape.large,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  cardPlaying: { borderColor: colors.primary },
  cardGood: { borderColor: colors.correct, backgroundColor: colors.correctBg },
  cardBad: { borderColor: colors.error, backgroundColor: colors.errorContainer },

  headRow: { flexDirection: "row", alignItems: "center" },
  badge: {
    backgroundColor: colors.primaryContainer,
    borderRadius: shape.full,
    minWidth: 32,
    height: 32,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  badgeText: { fontSize: font.labelMedium, fontWeight: "800", color: colors.onPrimaryContainer },
  ko: {
    flex: 1,
    fontSize: font.headlineSmall,
    fontWeight: "800",
    color: colors.onSurface,
    lineHeight: font.headlineSmall * 1.3,
  },
  pron: {
    fontSize: font.bodyXL,
    fontWeight: "700",
    color: colors.secondary,
    marginTop: spacing.xs,
  },
  en: {
    fontSize: font.bodyLarge,
    color: colors.onSurface,
    marginTop: spacing.xxs,
  },

  ctrlRow: { flexDirection: "row", marginTop: spacing.md, marginHorizontal: -spacing.xxs },
  iconBtn: {
    flex: 1,
    minHeight: MIN_TOUCH + 12,
    marginHorizontal: spacing.xxs,
    borderRadius: shape.medium,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
  },
  iconBtnActive: { backgroundColor: colors.primary },
  iconBtnAccent: { backgroundColor: colors.secondaryContainer },
  iconBtnRecording: { backgroundColor: colors.error },
  iconBtnIcon: { fontSize: font.headlineSmall },
  iconBtnLabel: {
    fontSize: font.labelMedium,
    fontWeight: "800",
    color: colors.onPrimaryContainer,
    marginTop: spacing.xxs,
  },

  listening: {
    fontSize: font.bodyMedium,
    fontWeight: "600",
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
  },
  feedback: { marginTop: spacing.sm, borderRadius: shape.medium, padding: spacing.sm },
  feedbackGood: { backgroundColor: colors.surface },
  feedbackBad: { backgroundColor: colors.surface },
  feedbackTitle: { fontSize: font.bodyLarge, fontWeight: "800" },
  feedbackHeard: { fontSize: font.bodyMedium, color: colors.onSurface, marginTop: spacing.xxs },
});
