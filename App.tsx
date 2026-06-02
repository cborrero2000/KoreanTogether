import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { colors } from "./src/theme";
import { ScreenName } from "./src/navigation";
import { HomeScreen } from "./src/screens/HomeScreen";
import { HangulScreen } from "./src/screens/HangulScreen";
import { VocabScreen } from "./src/screens/VocabScreen";
import { ListeningScreen } from "./src/screens/ListeningScreen";
import { SpeakingScreen } from "./src/screens/SpeakingScreen";
import { DialogScreen } from "./src/screens/DialogScreen";
import { TalkBackScreen } from "./src/screens/TalkBackScreen";
import { SceneScreen } from "./src/screens/SceneScreen";
import { ListenPracticeScreen } from "./src/screens/ListenPracticeScreen";
import { BuildScreen } from "./src/screens/BuildScreen";
import { RecallScreen } from "./src/screens/RecallScreen";
import { ExposureScreen } from "./src/screens/ExposureScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { initSpeech, stopSpeaking } from "./src/speech/speech";

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("home");

  // Load the available device voices once, and pick the most natural one.
  useEffect(() => {
    initSpeech();
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
        {screen === "home" && <HomeScreen go={go} />}
        {screen === "hangul" && <HangulScreen onBack={back} />}
        {screen === "vocab" && <VocabScreen onBack={back} />}
        {screen === "listening" && <ListeningScreen onBack={back} />}
        {screen === "speaking" && <SpeakingScreen onBack={back} />}
        {screen === "dialog" && <DialogScreen onBack={back} />}
        {screen === "talkback" && <TalkBackScreen onBack={back} />}
        {screen === "scenes" && <SceneScreen onBack={back} />}
        {screen === "practice" && <ListenPracticeScreen onBack={back} />}
        {screen === "build" && <BuildScreen onBack={back} />}
        {screen === "recall" && <RecallScreen onBack={back} />}
        {screen === "exposure" && <ExposureScreen onBack={back} />}
        {screen === "settings" && <SettingsScreen onBack={back} />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
