import { useEffect, useRef, useState } from "react";
import { speak, stopSpeaking } from "../speech/speech";
import type { Line } from "../data/content";

/**
 * Plays an array of conversation lines one after another, alternating the two
 * voices ("a"/"b") by speaker so the people sound different. Returns the index
 * of the line currently being spoken (or -1 when idle) plus play/stop controls.
 */
export function useDialogPlayer(lines: Line[]) {
  const [active, setActive] = useState(-1);
  const cancelled = useRef(false);

  useEffect(
    () => () => {
      cancelled.current = true;
      stopSpeaking();
    },
    []
  );

  function stop() {
    cancelled.current = true;
    stopSpeaking();
    setActive(-1);
  }

  function play(rate?: number) {
    cancelled.current = false;
    // Map each distinct speaker to voice "a" or "b" (first speaker = a).
    const speakers: string[] = [];
    for (const l of lines) if (!speakers.includes(l.speaker)) speakers.push(l.speaker);

    const speakAt = (idx: number) => {
      if (cancelled.current || idx >= lines.length) {
        setActive(-1);
        return;
      }
      setActive(idx);
      const which = speakers.indexOf(lines[idx].speaker) % 2 === 0 ? "a" : "b";
      speak(lines[idx].text, {
        voice: which,
        rate,
        onDone: () => {
          if (cancelled.current) return;
          setTimeout(() => speakAt(idx + 1), 350);
        },
      });
    };
    speakAt(0);
  }

  return { active, play, stop };
}
