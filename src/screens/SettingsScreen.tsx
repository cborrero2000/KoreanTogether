import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import {
  listVoices,
  getPreferredVoiceId,
  setPreferredVoiceId,
  speak,
  hasNaturalVoice,
  hasAnyVoice,
  VoiceInfo,
} from "../speech/speech";
import { colors, font, radius, spacing } from "../theme";

const SAMPLE = "안녕하세요. 만나서 반가워요. 이렇게 들려요.";

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const voices = listVoices();
  const [selected, setSelected] = useState<string | null>(getPreferredVoiceId());
  const natural = hasNaturalVoice();
  const anyVoice = hasAnyVoice();

  function pick(v: VoiceInfo | null) {
    const id = v?.id ?? null;
    setSelected(id);
    setPreferredVoiceId(id);
    speak(SAMPLE, { voiceId: id ?? undefined });
  }

  return (
    <Screen>
      <ActivityHeader title="목소리 Voice" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Body style={{ color: colors.textSoft, marginTop: spacing.md }}>
          Pick the Korean voice you like best. Tap one to hear a sample.
        </Body>

        {!natural && (
          <Card style={{ marginTop: spacing.md, backgroundColor: colors.correctBg, borderColor: colors.correct }}>
            <Text style={{ fontSize: font.body, fontWeight: "700", color: colors.text }}>
              💡 Want a natural, human-sounding Korean voice?
            </Text>
            <Body style={{ color: colors.text, marginTop: spacing.xs }}>
              {Platform.OS === "web"
                ? anyVoice
                  ? "This browser only has a basic Korean voice. Open the app in Microsoft Edge for free, lifelike “Natural” voices (SunHi 선희 and InJoon 인준)."
                  : "No Korean voice was found in this browser. Open the app in Microsoft Edge — it has free, natural Korean voices (SunHi, InJoon) built in."
                : "Install your device's Korean voice in Settings (Accessibility → Spoken Content / Text-to-speech) and choose the enhanced quality for a natural sound."}
            </Body>
          </Card>
        )}

        {/* Automatic = let the app pick the best available voice */}
        <VoiceRow
          name="Automatic (best available)"
          sub="Let the app choose for you"
          natural={natural}
          selected={selected == null}
          onPress={() => pick(null)}
        />

        {voices.map((v) => (
          <VoiceRow
            key={v.id}
            name={v.name}
            sub={v.lang}
            natural={v.natural}
            selected={selected === v.id}
            onPress={() => pick(v)}
          />
        ))}

        <Button title="샘플 듣기 Hear a sample" icon="🔊" variant="neutral" onPress={() => speak(SAMPLE, { voiceId: selected ?? undefined })} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}

function VoiceRow({
  name,
  sub,
  natural,
  selected,
  onPress,
}: {
  name: string;
  sub: string;
  natural: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.correctBg : colors.card },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      {natural && <Pill tone="good" text="Natural" />}
      {selected && <Text style={styles.check}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: font.body, fontWeight: "700", color: colors.text },
  sub: { fontSize: font.label, color: colors.textSoft, marginTop: 2 },
  check: { fontSize: font.heading, color: colors.primary, fontWeight: "900", marginLeft: spacing.sm },
});
