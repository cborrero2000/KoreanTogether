import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, H1, Body } from "../components/UI";
import { colors, font, radius, spacing, isLargeScreen } from "../theme";
import { ScreenName } from "../navigation";
import { reviewItems } from "../data/review";
import { dueCount } from "../srs";

type Tile = { key: ScreenName; icon: string; title: string; desc: string; badge?: number };
type Section = { heading: string; tiles: Tile[] };

export function HomeScreen({ go }: { go: (s: ScreenName) => void }) {
  const due = dueCount(reviewItems.map((r) => r.id));

  // Ordered by the learning priority: read foundation → listen → speak → write → recall/maintain.
  const sections: Section[] = [
    {
      heading: "시작 · Start here (read)",
      tiles: [
        { key: "hangul", icon: "가", title: "Hangul · 한글", desc: "Learn the alphabet and its sounds." },
        { key: "vocab", icon: "📖", title: "Vocabulary · 단어", desc: "Words alone, then in a sentence + picture." },
      ],
    },
    {
      heading: "듣기 · Listen (most important)",
      tiles: [
        { key: "practice", icon: "🎧", title: "Listening Practice · 듣기 연습", desc: "Train your ear for K-dramas — no subtitles first." },
        { key: "listening", icon: "👂", title: "Listen & Choose · 듣기", desc: "Hear a sentence, pick the one you heard." },
        { key: "dialog", icon: "💬", title: "Dialog & Question · 대화", desc: "Hear a short talk, then answer a question." },
        { key: "scenes", icon: "🎬", title: "Watch & Decide · 장면", desc: "Watch a scene, choose the best reply." },
      ],
    },
    {
      heading: "말하기 · Speak",
      tiles: [
        { key: "speaking", icon: "🎤", title: "Say It · 말하기", desc: "Read it aloud; your speaking is checked." },
        { key: "talkback", icon: "🔁", title: "Talk Back · 대화 연습", desc: "Have a real conversation. Reply out loud." },
      ],
    },
    {
      heading: "쓰기 · Write (build sentences)",
      tiles: [{ key: "build", icon: "🧩", title: "Build It · 만들기", desc: "Assemble the Korean by tapping word tiles." }],
    },
    {
      heading: "기억 · Recall & keep it fresh",
      tiles: [
        { key: "recall", icon: "🧠", title: "Recall · 기억하기", desc: "Spaced review — recall it before you forget.", badge: due || undefined },
        { key: "exposure", icon: "🔂", title: "Exposure · 노출 유지", desc: "Hands-free playlist that keeps it all warm." },
      ],
    },
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <H1>한국어 Korean</H1>
            <Pressable onPress={() => go("settings")} style={({ pressed }) => [styles.voiceBtn, pressed && { opacity: 0.8 }]}>
              <Text style={styles.voiceBtnText}>🔊 Voice</Text>
            </Pressable>
          </View>
          <Body style={{ color: colors.textSoft, marginTop: spacing.xs }}>
            Understand spoken Korean — and watch your shows without subtitles.
          </Body>
        </View>

        {sections.map((section) => (
          <View key={section.heading} style={{ marginBottom: spacing.sm }}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <View style={[styles.grid, isLargeScreen() && styles.gridWide]}>
              {section.tiles.map((t) => (
                <Pressable
                  key={t.key}
                  onPress={() => go(t.key)}
                  style={({ pressed }) => [
                    styles.tile,
                    isLargeScreen() && styles.tileWide,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
                  ]}
                >
                  <Text style={styles.icon}>{t.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tileTitle}>{t.title}</Text>
                    <Text style={styles.tileDesc}>{t.desc}</Text>
                  </View>
                  {t.badge ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{t.badge}</Text>
                    </View>
                  ) : (
                    <Text style={styles.chevron}>›</Text>
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

const styles = StyleSheet.create({
  header: { paddingVertical: spacing.lg },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  voiceBtn: { backgroundColor: colors.neutralBtn, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill },
  voiceBtnText: { fontSize: font.label, fontWeight: "700", color: colors.text },
  sectionHeading: { fontSize: font.label, fontWeight: "800", color: colors.textSoft, marginBottom: spacing.sm, marginTop: spacing.sm, textTransform: "uppercase", letterSpacing: 0.5 },
  grid: {},
  gridWide: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tile: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  tileWide: { width: "48.5%" },
  icon: { fontSize: 40, marginRight: spacing.md, fontWeight: "800", color: colors.primary },
  tileTitle: { fontSize: font.heading, fontWeight: "800", color: colors.text },
  tileDesc: { fontSize: font.label, color: colors.textSoft, marginTop: 2 },
  chevron: { fontSize: 34, color: colors.textSoft, marginLeft: spacing.sm },
  badge: { backgroundColor: colors.accent, borderRadius: radius.pill, minWidth: 30, height: 30, paddingHorizontal: 8, alignItems: "center", justifyContent: "center", marginLeft: spacing.sm },
  badgeText: { color: colors.white, fontWeight: "900", fontSize: font.label },
});
