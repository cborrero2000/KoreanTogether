import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, H1, Body } from "../components/UI";
import { colors, font, shape, spacing, isLargeScreen, MIN_TOUCH } from "../theme";
import { ScreenName } from "../navigation";
import { reviewItems } from "../data/review";
import { dueCount } from "../srs";

type Tile = { key: ScreenName; icon: string; title: string; desc: string; badge?: number };
type Section = { heading: string; sub: string; tiles: Tile[] };

export function HomeScreen({ go }: { go: (s: ScreenName) => void }) {
  const due = dueCount(reviewItems.map((r) => r.id));

  const sections: Section[] = [
    {
      heading: "시작 · Start here",
      sub: "Read",
      tiles: [
        { key: "hangul",  icon: "가", title: "Hangul · 한글",      desc: "Learn the alphabet and its sounds." },
        { key: "vocab",   icon: "📖", title: "Vocabulary · 단어",  desc: "Words alone, then in a sentence + picture." },
      ],
    },
    {
      heading: "반말 · Casual Speech",
      sub: "Drama Korean",
      tiles: [
        { key: "casual", icon: "💬", title: "Casual Speech · 반말", desc: "Formal vs. casual — the Korean dramas actually use." },
      ],
    },
    {
      heading: "듣기 · Listen",
      sub: "Most important",
      tiles: [
        { key: "practice",  icon: "🎧", title: "Listening Practice · 듣기 연습", desc: "K-drama ear trainer — no subtitles first." },
        { key: "listening", icon: "👂", title: "Listen & Choose · 듣기",        desc: "Hear a sentence, pick the one you heard." },
        { key: "dialog",    icon: "💬", title: "Dialog & Question · 대화",      desc: "Hear a short conversation, answer a question." },
        { key: "scenes",    icon: "🎬", title: "Watch & Decide · 장면",         desc: "Watch a scene, choose the best reply." },
      ],
    },
    {
      heading: "말하기 · Speak",
      sub: "",
      tiles: [
        { key: "speaking",  icon: "🎤", title: "Say It · 말하기",           desc: "Read it aloud — your speaking is checked." },
        { key: "shadowing", icon: "🗣️", title: "Shadowing · 쉐도잉",       desc: "Hear it, then echo it back instantly." },
        { key: "talkback",  icon: "🔁", title: "Talk Back · 대화 연습",     desc: "Have a real conversation. Reply out loud." },
      ],
    },
    {
      heading: "쓰기 · Write",
      sub: "Build sentences",
      tiles: [
        { key: "build", icon: "🧩", title: "Build It · 만들기", desc: "Assemble Korean by tapping word tiles." },
      ],
    },
    {
      heading: "기억 · Recall & Maintain",
      sub: "",
      tiles: [
        { key: "recall",   icon: "🧠", title: "Recall · 기억하기",       desc: "Spaced review — recall before you forget.", badge: due || undefined },
        { key: "exposure", icon: "🔂", title: "Exposure · 노출 유지",    desc: "Hands-free playlist to keep it all warm." },
        { key: "stats",    icon: "📊", title: "Progress · 진행 상황",    desc: "Streaks, accuracy, and how much you've practiced." },
      ],
    },
  ];

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerRow}>
            <H1>한국어 Korean</H1>
            <Pressable
              onPress={() => go("settings")}
              accessibilityRole="button"
              accessibilityLabel="Voice settings"
              style={({ pressed }) => [s.voiceBtn, pressed && { opacity: 0.8 }]}
            >
              <Text style={s.voiceBtnText}>🔊 Voice</Text>
            </Pressable>
          </View>
          <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
            Understand spoken Korean — watch your shows without subtitles.
          </Body>
        </View>

        {sections.map((section) => (
          <View key={section.heading} style={s.section}>
            <View style={s.sectionHeadingRow}>
              <Text style={s.sectionTitle}>{section.heading}</Text>
              {section.sub ? <Text style={s.sectionSub}>{section.sub}</Text> : null}
            </View>
            <View style={[s.grid, isLargeScreen() && s.gridWide]}>
              {section.tiles.map((t) => (
                <Pressable
                  key={t.key}
                  onPress={() => go(t.key)}
                  accessibilityRole="button"
                  accessibilityLabel={t.title}
                  style={({ pressed }) => [
                    s.tile,
                    isLargeScreen() && s.tileWide,
                    pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <Text style={s.tileIcon}>{t.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.tileTitle}>{t.title}</Text>
                    <Text style={s.tileDesc}>{t.desc}</Text>
                  </View>
                  {t.badge ? (
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{t.badge}</Text>
                    </View>
                  ) : (
                    <Text style={s.chevron}>›</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { paddingVertical: spacing.lg },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  voiceBtn: {
    backgroundColor: colors.surfaceVariant,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: shape.full,
    minHeight: MIN_TOUCH,
    alignItems: "center",
    justifyContent: "center",
  },
  voiceBtnText: { fontSize: font.labelLarge, fontWeight: "700", color: colors.onSurface },

  section: { marginBottom: spacing.md },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: font.labelLarge,
    fontWeight: "800",
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionSub: {
    fontSize: font.labelMedium,
    color: colors.primary,
    fontWeight: "700",
  },

  grid: {},
  gridWide: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  tile: {
    backgroundColor: colors.surface,
    borderRadius: shape.large,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    minHeight: MIN_TOUCH + 24,
    // MD3 level-1 shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  tileWide: { width: "48.8%" },

  tileIcon: {
    fontSize: font.icon,
    marginRight: spacing.md,
    fontWeight: "800",
    color: colors.primary,
    width: 44,
    textAlign: "center",
  },
  tileTitle: { fontSize: font.titleMedium, fontWeight: "800", color: colors.onSurface },
  tileDesc:  { fontSize: font.labelMedium, color: colors.onSurfaceVariant, marginTop: spacing.xxs },

  chevron: { fontSize: 28, color: colors.onSurfaceVariant, marginLeft: spacing.sm },

  badge: {
    backgroundColor: colors.accent,
    borderRadius: shape.full,
    minWidth: 28,
    height: 28,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  badgeText: { color: colors.onError, fontWeight: "900", fontSize: font.labelMedium },
});
