import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { colors } from "./src/theme";
import { ScreenName } from "./src/navigation";
import { HomeScreen } from "./src/screens/HomeScreen";
import { HangulScreen } from "./src/screens/HangulScreen";
import { VocabScreen } from "./src/screens/VocabScreen";
import { CasualScreen } from "./src/screens/CasualScreen";
import { MasterListScreen } from "./src/screens/MasterListScreen";
import { GuessGameScreen } from "./src/screens/GuessGameScreen";
import { ListeningScreen } from "./src/screens/ListeningScreen";
import { SpeakingScreen } from "./src/screens/SpeakingScreen";
import { ShadowingScreen } from "./src/screens/ShadowingScreen";
import { DialogScreen } from "./src/screens/DialogScreen";
import { TalkBackScreen } from "./src/screens/TalkBackScreen";
import { SceneScreen } from "./src/screens/SceneScreen";
import { ListenPracticeScreen } from "./src/screens/ListenPracticeScreen";
import { BuildScreen } from "./src/screens/BuildScreen";
import { RecallScreen } from "./src/screens/RecallScreen";
import { ExposureScreen } from "./src/screens/ExposureScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { initSpeech, stopSpeaking } from "./src/speech/speech";
import { hydrateStorage } from "./src/storage";

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  // Wait for saved data (voice, progress) to load from the device before
  // showing any screen, so nothing reads empty defaults first.
  const [loaded, setLoaded] = useState(false);

  // Load saved data, then the available device voices (pick the most natural).
  useEffect(() => {
    hydrateStorage()
      .catch(() => {})
      .then(() => {
        setLoaded(true);
        return initSpeech();
      });
  }, []);

  function go(s: ScreenName) {
    stopSpeaking();
    setScreen(s);
  }
  const back = () => go("home");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={["top", "left", "right", "bottom"]}>
        <StatusBar style="dark" />
        {loaded && screen === "home" && <HomeScreen go={go} />}
        {screen === "hangul" && <HangulScreen onBack={back} />}
        {screen === "vocab" && <VocabScreen onBack={back} />}
        {screen === "casual" && <CasualScreen onBack={back} />}
        {screen === "masterlist" && <MasterListScreen onBack={back} />}
        {screen === "guess" && <GuessGameScreen onBack={back} />}
        {screen === "listening" && <ListeningScreen onBack={back} />}
        {screen === "speaking" && <SpeakingScreen onBack={back} />}
        {screen === "shadowing" && <ShadowingScreen onBack={back} />}
        {screen === "dialog" && <DialogScreen onBack={back} />}
        {screen === "talkback" && <TalkBackScreen onBack={back} />}
        {screen === "scenes" && <SceneScreen onBack={back} />}
        {screen === "practice" && <ListenPracticeScreen onBack={back} />}
        {screen === "build" && <BuildScreen onBack={back} />}
        {screen === "recall" && <RecallScreen onBack={back} />}
        {screen === "exposure" && <ExposureScreen onBack={back} />}
        {screen === "stats" && <StatsScreen onBack={back} />}
        {screen === "settings" && <SettingsScreen onBack={back} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
