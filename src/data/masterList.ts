/**
 * "Korean Conversation – Master Vocabulary List" (29 expressions).
 * Pronunciations are the list's English-style spellings — friendly
 * approximations to help read the sounds, not strict romanization.
 */

export type Phrase = { ko: string; pron: string; en: string };

export type DialogLine = Phrase & { purpose: string };
export type PracticeDialog = { title: string; lines: DialogLine[] };

export type Distinction = { title: string; text: string; phrases: Phrase[] };

/* ── 1. Vocabulary – 29 expressions ─────────────────────────────────── */
export const masterVocab: Phrase[] = [
  { ko: "안녕하세요", pron: "An-nyeong-ha-se-yo", en: "Hello" },
  { ko: "저는 카를로스입니다", pron: "Jeo-neun Ka-reul-lo-seu-im-ni-da", en: "I am Carlos" },
  { ko: "반갑습니다", pron: "Ban-gap-seum-ni-da", en: "Nice to meet you" },
  { ko: "잘 지내세요?", pron: "Jal-ji-nae-se-yo?", en: "How are you?" },
  { ko: "네, 잘 지내요", pron: "Ne, jal-ji-nae-yo", en: "Yes, I'm doing well" },
  { ko: "잘 지내요?", pron: "Jal-ji-nae-yo?", en: "Are you doing well?" },
  { ko: "잘 지냈어요?", pron: "Jal-ji-nae-sseo-yo?", en: "How have you been?" },
  { ko: "잠깐만요", pron: "Jam-kkan-man-yo", en: "Wait a minute / Just a moment" },
  { ko: "안녕히 계세요", pron: "An-nyeong-hi-gye-se-yo", en: "Goodbye (to someone staying)" },
  { ko: "안녕히 가세요", pron: "An-nyeong-hi-ga-se-yo", en: "Goodbye (to someone leaving)" },
  { ko: "감사합니다", pron: "Gam-sa-ham-ni-da", en: "Thank you" },
  { ko: "괜찮아요", pron: "Gwaen-chan-a-yo", en: "It's okay / No problem" },
  { ko: "미안합니다", pron: "Mi-an-ham-ni-da", en: "I'm sorry" },
  { ko: "실례합니다", pron: "Sil-lye-ham-ni-da", en: "Excuse me" },
  { ko: "거기 있어요?", pron: "Geo-gi i-sseo-yo?", en: "Are you there?" },
  { ko: "네, 여기 있어요", pron: "Ne, yeo-gi i-sseo-yo", en: "Yes, I'm here" },
  { ko: "아니요, 지금 여기 없어요", pron: "A-ni-yo, ji-geum yeo-gi eop-seo-yo", en: "No, I'm not here right now" },
  { ko: "수고합니다", pron: "Su-go-ham-ni-da", en: "Thank you for your hard work / You're working hard" },
  { ko: "축하합니다", pron: "Chuk-ha-ham-ni-da", en: "Congratulations!" },
  { ko: "생일 축하합니다", pron: "Saeng-il chuk-ha-ham-ni-da", en: "Happy Birthday!" },
  { ko: "가자!", pron: "Ga-ja!", en: "Let's go! (informal)" },
  { ko: "좋은 하루 보내세요", pron: "Jo-eun ha-ru bo-nae-se-yo", en: "Have a good day" },
  { ko: "당신도요", pron: "Dang-sin-do-yo", en: "You too" },
  { ko: "알았어요", pron: "A-ra-sseo-yo", en: "Okay, got it / Understood (polite)" },
  { ko: "어서 오세요", pron: "Eo-seo o-se-yo", en: "Welcome! (polite)" },
  { ko: "어서 와", pron: "Eo-seo wa", en: "Welcome! / Come in! (informal)" },
  { ko: "가고 있어요", pron: "Ga-go i-sseo-yo", en: "I'm going / I'm on my way" },
  { ko: "지금 가는 중이에요", pron: "Ji-geum ga-neun jung-i-e-yo", en: "I'm on my way right now" },
  { ko: "죄송합니다", pron: "Joe-song-ham-ni-da", en: "I'm sorry / I apologize (formal and respectful)" },
];

/* ── 2. Grammar notes ───────────────────────────────────────────────── */
export const masterGrammar: Phrase[] = [
  { ko: "네", pron: "Ne", en: "Yes / Okay" },
  { ko: "아니요", pron: "A-ni-yo", en: "No" },
  { ko: "요", pron: "Yo", en: "Common polite sentence ending" },
  { ko: "니다", pron: "Ni-da", en: "Formal polite sentence ending" },
  { ko: "저", pron: "Jeo", en: "I / me (polite form)" },
  { ko: "는", pron: "Neun", en: "Topic particle" },
  { ko: "여기", pron: "Yeo-gi", en: "Here" },
  { ko: "거기", pron: "Geo-gi", en: "There" },
  { ko: "지금", pron: "Ji-geum", en: "Now" },
  { ko: "있어요", pron: "I-sseo-yo", en: "There is / am, is, or are here (depending on context)" },
  { ko: "없어요", pron: "Eop-seo-yo", en: "There isn't / am not, is not, or are not here (depending on context)" },
  { ko: "가요", pron: "Ga-yo", en: "Go / am going" },
  { ko: "가고 있어요", pron: "Ga-go i-sseo-yo", en: "Am going / am on my way" },
  { ko: "중이에요", pron: "Jung-i-e-yo", en: "Am in the middle of doing something" },
  { ko: "와요", pron: "Wa-yo", en: "Come / am coming" },
];

/* ── 3 & 4. Practice conversations ──────────────────────────────────── */
export const masterDialogs: PracticeDialog[] = [
  {
    title: "Are you there?",
    lines: [
      { purpose: "Question", ko: "거기 있어요?", pron: "Geo-gi i-sseo-yo?", en: "Are you there?" },
      { purpose: "Yes", ko: "네, 여기 있어요.", pron: "Ne, yeo-gi i-sseo-yo.", en: "Yes, I'm here." },
      { purpose: "No", ko: "아니요, 지금 여기 없어요.", pron: "A-ni-yo, ji-geum yeo-gi eop-seo-yo.", en: "No, I'm not here right now." },
    ],
  },
  {
    title: "Are you coming?",
    lines: [
      { purpose: "Question", ko: "오고 있어요?", pron: "O-go i-sseo-yo?", en: "Are you coming?" },
      { purpose: "Answer 1", ko: "네, 가고 있어요.", pron: "Ne, ga-go i-sseo-yo.", en: "Yes, I'm on my way." },
      { purpose: "Answer 2", ko: "네, 지금 가는 중이에요.", pron: "Ne, ji-geum ga-neun jung-i-e-yo.", en: "Yes, I'm on my way right now." },
    ],
  },
];

/* ── 5. Useful distinctions ─────────────────────────────────────────── */
export const masterDistinctions: Distinction[] = [
  {
    title: "Yes vs. Got it",
    text: "네 means “Yes.” 알았어요 means “Okay, I understand / Got it” (polite). 알았어 is the informal version.",
    phrases: [
      { ko: "네", pron: "Ne", en: "Yes" },
      { ko: "알았어요", pron: "A-ra-sseo-yo", en: "Okay, got it (polite)" },
      { ko: "알았어", pron: "A-ra-sseo", en: "Okay, got it (informal)" },
    ],
  },
  {
    title: "Apology",
    text: "죄송합니다 is a formal, respectful way to say “I'm sorry” or “I apologize.” A common response is 괜찮아요, meaning “It's okay.”",
    phrases: [
      { ko: "죄송합니다", pron: "Joe-song-ham-ni-da", en: "I'm sorry / I apologize" },
      { ko: "괜찮아요", pron: "Gwaen-chan-a-yo", en: "It's okay" },
    ],
  },
  {
    title: "Welcome",
    text: "어서 오세요 is polite; 어서 와 is informal.",
    phrases: [
      { ko: "어서 오세요", pron: "Eo-seo o-se-yo", en: "Welcome! (polite)" },
      { ko: "어서 와", pron: "Eo-seo wa", en: "Welcome! (informal)" },
    ],
  },
];
