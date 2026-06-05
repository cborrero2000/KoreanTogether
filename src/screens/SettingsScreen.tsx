import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import {
  listVoices, getPreferredVoiceId, setPreferredVoiceId,
  speak, hasNaturalVoice, hasAnyVoice, VoiceInfo,
} from "../speech/speech";
import { colors, font, shape, spacing, MIN_TOUCH } from "../theme";

const SAMPLE = "안녕하세요. 만나서 반가워요. 이렇게 들려요.";

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const voices = listVoices();
  const [selected, setSelected] = useState<string | null>(getPreferredVoiceId());
  const natural  = hasNaturalVoice();
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <Body style={{ color: colors.onSurfaceVariant, marginTop: spacing.md }}>
          Pick the Korean voice you like best. Tap one to hear a sample.
        </Body>

        {!natural && (
          <Card
            style={{
              marginTop: spacing.md,
              backgroundColor: colors.primaryContainer,
              borderColor: colors.primary,
            }}
          >
            <Text style={{ fontSize: font.bodyLarge, fontWeight: "700", color: colors.onPrimaryContainer }}>
              💡 Want a natural, human-sounding Korean voice?
            </Text>
            <Body style={{ color: colors.onPrimaryContainer, marginTop: spacing.xs }}>
              {Platform.OS === "web"
                ? anyVoice
                  ? "This browser only has a basic Korean voice. Open in Microsoft Edge for free, lifelike 'Natural' voices (SunHi, InJoon)."
                  : "No Korean voice found. Open in Microsoft Edge — it has free, natural Korean voices built in."
                : "Install your device's Korean voice in Settings (Accessibility → Spoken Content / Text-to-speech) and choose Enhanced quality."}
            </Body>
          </Card>
        )}

        {/* Automatic option */}
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

        <Button
          title="샘플 듣기 Hear a sample"
          icon="🔊"
          variant="tonal"
          onPress={() => speak(SAMPLE, { voiceId: selected ?? undefined })}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </Screen>
  );
}

function VoiceRow({
  name, sub, natural, selected, onPress,
}: {
  name: string; sub: string; natural: boolean; selected: boolean; onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={name}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        s.row,
        selected && { borderColor: colors.primary, backgroundColor: colors.primaryContainer },
        pressed && { opacity: 0.88 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[s.name, selected && { color: colors.onPrimaryContainer }]}>{name}</Text>
        <Text style={[s.sub, selected && { color: colors.onPrimaryContainer }]}>{sub}</Text>
      </View>
      {natural && <Pill tone="good" text="Natural" />}
      {selected && (
        <Text style={{ fontSize: font.headlineSmall, color: colors.primary, fontWeight: "900", marginLeft: spacing.sm }}>
          ✓
        </Text>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    minHeight: MIN_TOUCH + 20,
    borderRadius: shape.medium,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: font.bodyLarge, fontWeight: "700", color: colors.onSurface },
  sub:  { fontSize: font.labelMedium, color: colors.onSurfaceVariant, marginTop: spacing.xxs },
});
