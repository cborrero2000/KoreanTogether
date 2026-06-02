# 한국어 Korean — Korean Together

A cross-platform app (phone · tablet · computer) for learning Korean, built so you
can eventually **watch Korean series without reading the English subtitles**. The
whole app is built around training your ear, with romanization and translations
available on demand so you only lean on English when you choose to.

Stack: Expo SDK 56 · React Native 0.85 · React 19 · TypeScript. Runs on iOS,
Android (Expo Go) and the web from one codebase.

The Home screen is organized as a full sensory loop, in priority order:
**Listen → Speak → Read → Write → Recall & keep it fresh.**

## Run it

- **Computer (best for speaking/listening checks):** `npm run web` then open the
  URL. Use **Microsoft Edge** for free, natural-sounding Korean voices (SunHi 선희,
  InJoon 인준). Speech-to-text and natural voices are best in Edge/Chrome.
- **Phone / tablet:** `npm start`, then scan the QR code with **Expo Go**.

## The eight modes

1. **Hangul · 한글** — learn the alphabet (consonants + vowels), hear each sound and
   an example word, then a quick quiz.
2. **Vocabulary · 단어** — each word alone with a picture (emoji), then the same word
   inside a real sentence with a picture. Translation on demand.
3. **Listen & Choose · 듣기** — the app speaks a sentence; you pick the one you heard
   (3 options). Replay, slower, and a translation button.
4. **Say It · 말하기** — read a sentence aloud; speech-to-text checks it. You can't
   advance until you say it closely enough — but **Skip** is always available.
   Translation button included.
5. **Dialog & Question · 대화** — a short conversation plays (two distinct voices),
   then a comprehension question.
6. **Talk Back · 대화 연습** — interactive: the app speaks a line and waits for your
   spoken reply. Right → continue; wrong → "실례지만, 뭐라고요?" (Excuse me, what did you
   say?). Example reply + Skip always available.
7. **Watch & Decide · 장면** — a short scene is acted out (speaking avatar + voices +
   live subtitles); choose the best response.
8. **Listening Practice · 듣기 연습** — the K-drama trainer. A clip plays with **no
   subtitles first**; answer a comprehension question, then reveal the transcript
   and translation only when you want to. This is the core "understand it by ear"
   exercise.
9. **Build It · 만들기** (write) — see an English meaning, hear the Korean, then
   **assemble the sentence by tapping word tiles** in the right order. This is
   "writing" without a Korean keyboard.
10. **Recall · 기억하기** — **spaced-repetition active recall**. You see the meaning,
    say the Korean from memory, then reveal and self-rate (Again / Good / Easy).
    Items come back right before you'd forget them; a badge on Home shows how many
    are due. Progress is saved (localStorage on web).
11. **Exposure · 노출 유지** (maintenance) — a **hands-free autoplay playlist** that
    cycles through everything you've learned, speaking each item. "Show mode" reads
    along; "Listen mode" hides the text so you train comprehension (tap to reveal).

### How retention works

`src/srs.ts` is a small Leitner-style scheduler: each item lives in a "box", and a
correct review pushes it to a longer interval (10 min → 1d → 3d → 7d → 16d → …).
`src/data/review.ts` builds the review pool from your vocabulary and sentences, each
with a stable id so schedules survive across sessions. `src/storage.ts` persists to
localStorage on the web and falls back to memory on native.

## Natural voices

Speech (`src/speech/speech.ts`) auto-selects the most natural Korean voice the
device offers (it scores neural/online/enhanced voices) and gives the two dialog
speakers different pitches so they sound like different people. Pick a specific
voice via the **🔊 Voice** button on the Home screen. On the web it talks through
the browser's Web Speech API. Note: Chrome on Windows ships only a basic Korean
voice — open the app in **Microsoft Edge** for the lifelike "Natural" voices.

## Editing content

All learning material — Hangul, vocabulary, sentences, dialogs, scenes, and
listening clips, each with romanization and English — lives in
`src/data/content.ts`. Add or change entries there; no other code needs to change.
