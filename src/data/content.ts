/**
 * All learning content lives here so it is easy to edit and add to.
 * Everything is beginner-friendly Korean with Revised Romanization and an
 * English translation. Emojis act as the "pictures" for vocabulary.
 *
 * The big goal of this app: understand spoken Korean well enough to watch
 * Korean series without English subtitles. So most modes train the EAR —
 * listen first, reveal the text/translation only after you've tried.
 */

/* ===================================================================
   0) HANGUL (한글) — the Korean alphabet
   `syllable` is a real, speakable sound (lone letters don't read well in
   text-to-speech, so we play a syllable). `name` is the letter's name. */
export type HangulItem = {
  char: string;
  rom: string; // sound in Revised Romanization
  name: string; // the Korean name of the letter (also speakable)
  syllable: string; // a simple syllable to hear the sound in context
  syllableRom: string;
  ex: { word: string; rom: string; en: string };
};

export const hangulVowels: HangulItem[] = [
  { char: "ㅏ", rom: "a", name: "아", syllable: "아", syllableRom: "a", ex: { word: "아빠", rom: "appa", en: "dad" } },
  { char: "ㅑ", rom: "ya", name: "야", syllable: "야", syllableRom: "ya", ex: { word: "야구", rom: "yagu", en: "baseball" } },
  { char: "ㅓ", rom: "eo", name: "어", syllable: "어", syllableRom: "eo", ex: { word: "어머니", rom: "eomeoni", en: "mother" } },
  { char: "ㅕ", rom: "yeo", name: "여", syllable: "여", syllableRom: "yeo", ex: { word: "여자", rom: "yeoja", en: "woman" } },
  { char: "ㅗ", rom: "o", name: "오", syllable: "오", syllableRom: "o", ex: { word: "오리", rom: "ori", en: "duck" } },
  { char: "ㅛ", rom: "yo", name: "요", syllable: "요", syllableRom: "yo", ex: { word: "요리", rom: "yori", en: "cooking" } },
  { char: "ㅜ", rom: "u", name: "우", syllable: "우", syllableRom: "u", ex: { word: "우유", rom: "uyu", en: "milk" } },
  { char: "ㅠ", rom: "yu", name: "유", syllable: "유", syllableRom: "yu", ex: { word: "유리", rom: "yuri", en: "glass" } },
  { char: "ㅡ", rom: "eu", name: "으", syllable: "으", syllableRom: "eu", ex: { word: "음악", rom: "eumak", en: "music" } },
  { char: "ㅣ", rom: "i", name: "이", syllable: "이", syllableRom: "i", ex: { word: "이름", rom: "ireum", en: "name" } },
];

export const hangulConsonants: HangulItem[] = [
  { char: "ㄱ", rom: "g / k", name: "기역", syllable: "가", syllableRom: "ga", ex: { word: "가방", rom: "gabang", en: "bag" } },
  { char: "ㄴ", rom: "n", name: "니은", syllable: "나", syllableRom: "na", ex: { word: "나무", rom: "namu", en: "tree" } },
  { char: "ㄷ", rom: "d / t", name: "디귿", syllable: "다", syllableRom: "da", ex: { word: "다리", rom: "dari", en: "leg / bridge" } },
  { char: "ㄹ", rom: "r / l", name: "리을", syllable: "라", syllableRom: "ra", ex: { word: "라디오", rom: "radio", en: "radio" } },
  { char: "ㅁ", rom: "m", name: "미음", syllable: "마", syllableRom: "ma", ex: { word: "머리", rom: "meori", en: "head" } },
  { char: "ㅂ", rom: "b / p", name: "비읍", syllable: "바", syllableRom: "ba", ex: { word: "바다", rom: "bada", en: "sea" } },
  { char: "ㅅ", rom: "s", name: "시옷", syllable: "사", syllableRom: "sa", ex: { word: "사람", rom: "saram", en: "person" } },
  { char: "ㅇ", rom: "silent / ng", name: "이응", syllable: "아", syllableRom: "a", ex: { word: "강", rom: "gang", en: "river (ng sound)" } },
  { char: "ㅈ", rom: "j", name: "지읒", syllable: "자", syllableRom: "ja", ex: { word: "자동차", rom: "jadongcha", en: "car" } },
  { char: "ㅊ", rom: "ch", name: "치읓", syllable: "차", syllableRom: "cha", ex: { word: "책", rom: "chaek", en: "book" } },
  { char: "ㅋ", rom: "k", name: "키읔", syllable: "카", syllableRom: "ka", ex: { word: "커피", rom: "keopi", en: "coffee" } },
  { char: "ㅌ", rom: "t", name: "티읕", syllable: "타", syllableRom: "ta", ex: { word: "토마토", rom: "tomato", en: "tomato" } },
  { char: "ㅍ", rom: "p", name: "피읖", syllable: "파", syllableRom: "pa", ex: { word: "포도", rom: "podo", en: "grape" } },
  { char: "ㅎ", rom: "h", name: "히읗", syllable: "하", syllableRom: "ha", ex: { word: "하늘", rom: "haneul", en: "sky" } },
];

/* ===================================================================
   1) VOCABULARY (단어) — the word alone (with a picture/emoji), then the
   same word inside a sentence (also with a picture). */
export type VocabItem = {
  ko: string;
  rom: string;
  en: string;
  emoji: string; // stands in for a picture
  sentence: { ko: string; rom: string; en: string };
};

export const vocab: VocabItem[] = [
  { ko: "물", rom: "mul", en: "water", emoji: "💧", sentence: { ko: "물 좀 주세요.", rom: "mul jom juseyo.", en: "Water, please." } },
  { ko: "사랑", rom: "sarang", en: "love", emoji: "❤️", sentence: { ko: "사랑해요.", rom: "saranghaeyo.", en: "I love you." } },
  { ko: "친구", rom: "chingu", en: "friend", emoji: "🧑‍🤝‍🧑", sentence: { ko: "우리는 친구예요.", rom: "urineun chinguyeyo.", en: "We are friends." } },
  { ko: "밥", rom: "bap", en: "rice / meal", emoji: "🍚", sentence: { ko: "밥 먹었어요?", rom: "bap meogeosseoyo?", en: "Have you eaten?" } },
  { ko: "집", rom: "jip", en: "house / home", emoji: "🏠", sentence: { ko: "집에 가요.", rom: "jibe gayo.", en: "I'm going home." } },
  { ko: "시간", rom: "sigan", en: "time", emoji: "⏰", sentence: { ko: "시간 있어요?", rom: "sigan isseoyo?", en: "Do you have time?" } },
  { ko: "학교", rom: "hakgyo", en: "school", emoji: "🏫", sentence: { ko: "학교에 가요.", rom: "hakgyoe gayo.", en: "I go to school." } },
  { ko: "책", rom: "chaek", en: "book", emoji: "📚", sentence: { ko: "이 책 재미있어요.", rom: "i chaek jaemiisseoyo.", en: "This book is fun." } },
  { ko: "커피", rom: "keopi", en: "coffee", emoji: "☕", sentence: { ko: "커피 한 잔 주세요.", rom: "keopi han jan juseyo.", en: "One coffee, please." } },
  { ko: "고양이", rom: "goyangi", en: "cat", emoji: "🐱", sentence: { ko: "고양이가 귀여워요.", rom: "goyangiga gwiyeowoyo.", en: "The cat is cute." } },
  { ko: "날씨", rom: "nalssi", en: "weather", emoji: "🌤️", sentence: { ko: "오늘 날씨가 좋아요.", rom: "oneul nalssiga joayo.", en: "The weather is nice today." } },
  { ko: "영화", rom: "yeonghwa", en: "movie", emoji: "🎬", sentence: { ko: "영화 보러 가요.", rom: "yeonghwa boreo gayo.", en: "Let's go see a movie." } },
];

/* ===================================================================
   2) LISTEN & CHOOSE (듣기) — the app SPEAKS `say`; the learner picks
   which sentence they heard. `options` must include the exact `say`. */
export type ListenItem = { say: string; rom: string; en: string; options: string[] };

export const listening: ListenItem[] = [
  {
    say: "안녕하세요. 만나서 반가워요.",
    rom: "annyeonghaseyo. mannaseo bangawoyo.",
    en: "Hello. Nice to meet you.",
    options: ["안녕하세요. 만나서 반가워요.", "안녕히 가세요. 또 봐요.", "안녕하세요. 어디 가세요?"],
  },
  {
    say: "지금 몇 시예요?",
    rom: "jigeum myeot siyeyo?",
    en: "What time is it now?",
    options: ["지금 어디예요?", "지금 몇 시예요?", "지금 뭐 해요?"],
  },
  {
    say: "이거 얼마예요?",
    rom: "igeo eolmayeyo?",
    en: "How much is this?",
    options: ["이거 뭐예요?", "이거 어디예요?", "이거 얼마예요?"],
  },
  {
    say: "물 한 잔 주세요.",
    rom: "mul han jan juseyo.",
    en: "One glass of water, please.",
    options: ["물 한 잔 주세요.", "커피 한 잔 주세요.", "물 좀 주실래요?"],
  },
  {
    say: "화장실이 어디예요?",
    rom: "hwajangsiri eodiyeyo?",
    en: "Where is the bathroom?",
    options: ["지하철역이 어디예요?", "화장실이 어디예요?", "화장실이 멀어요?"],
  },
  {
    say: "천천히 말해 주세요.",
    rom: "cheoncheonhi malhae juseyo.",
    en: "Please speak slowly.",
    options: ["다시 말해 주세요.", "크게 말해 주세요.", "천천히 말해 주세요."],
  },
];

/* ===================================================================
   3) SAY IT (말하기) — the learner reads the sentence and says it.
   Speech-to-text checks it. They can't advance unless they say it close
   enough — but a Skip button is always there. A Translation button shows
   the English meaning. */
export type SpeakItem = { ko: string; rom: string; en: string };

export const speaking: SpeakItem[] = [
  { ko: "안녕하세요.", rom: "annyeonghaseyo.", en: "Hello." },
  { ko: "감사합니다.", rom: "gamsahamnida.", en: "Thank you." },
  { ko: "만나서 반가워요.", rom: "mannaseo bangawoyo.", en: "Nice to meet you." },
  { ko: "저는 학생이에요.", rom: "jeoneun haksaengieyo.", en: "I am a student." },
  { ko: "한국어를 배우고 있어요.", rom: "hangugeoreul baeugo isseoyo.", en: "I am learning Korean." },
  { ko: "이거 얼마예요?", rom: "igeo eolmayeyo?", en: "How much is this?" },
  { ko: "천천히 말해 주세요.", rom: "cheoncheonhi malhae juseyo.", en: "Please speak slowly." },
  { ko: "다시 한번 말해 주세요.", rom: "dasi hanbeon malhae juseyo.", en: "Please say it once more." },
];

/* A localized choice with its English meaning, used by the modes below. */
export type Choice = { ko: string; en: string };

/* ===================================================================
   4) DIALOG & QUESTION (대화) — a short conversation is read aloud, then
   a comprehension question. */
export type Line = { speaker: string; text: string; rom: string; en: string };
export type DialogItem = {
  title: string;
  lines: Line[];
  question: string;
  questionEn: string;
  options: Choice[];
  answer: number;
};

export const dialogs: DialogItem[] = [
  {
    title: "카페에서 · At the café",
    lines: [
      { speaker: "점원", text: "안녕하세요! 뭐 드릴까요?", rom: "annyeonghaseyo! mwo deurilkkayo?", en: "Hello! What can I get you?" },
      { speaker: "손님", text: "아메리카노 한 잔 주세요.", rom: "amerikano han jan juseyo.", en: "One americano, please." },
      { speaker: "점원", text: "따뜻한 거요, 아이스요?", rom: "ttatteuthan geoyo, aiseuyo?", en: "Hot or iced?" },
      { speaker: "손님", text: "아이스로 주세요.", rom: "aiseuro juseyo.", en: "Iced, please." },
    ],
    question: "손님은 무엇을 주문했어요?",
    questionEn: "What did the customer order?",
    options: [
      { ko: "아이스 아메리카노", en: "An iced americano" },
      { ko: "따뜻한 차", en: "Hot tea" },
      { ko: "물 한 잔", en: "A glass of water" },
    ],
    answer: 0,
  },
  {
    title: "길 묻기 · Asking directions",
    lines: [
      { speaker: "A", text: "실례합니다, 지하철역이 어디예요?", rom: "sillyehamnida, jihacheoryeogi eodiyeyo?", en: "Excuse me, where is the subway station?" },
      { speaker: "B", text: "똑바로 가서 왼쪽으로 가세요.", rom: "ttokbaro gaseo oenjjogeuro gaseyo.", en: "Go straight, then turn left." },
      { speaker: "A", text: "멀어요?", rom: "meoreoyo?", en: "Is it far?" },
      { speaker: "B", text: "아니요, 5분 정도예요.", rom: "aniyo, obun jeongdoyeyo.", en: "No, about 5 minutes." },
    ],
    question: "지하철역까지 얼마나 걸려요?",
    questionEn: "How long to the subway station?",
    options: [
      { ko: "5분 정도", en: "About 5 minutes" },
      { ko: "15분 정도", en: "About 15 minutes" },
      { ko: "한 시간", en: "An hour" },
    ],
    answer: 0,
  },
  {
    title: "식당에서 · At a restaurant",
    lines: [
      { speaker: "종업원", text: "몇 분이세요?", rom: "myeot buniseyo?", en: "How many people?" },
      { speaker: "손님", text: "두 명이요.", rom: "du myeongiyo.", en: "Two people." },
      { speaker: "종업원", text: "이쪽으로 오세요.", rom: "ijjogeuro oseyo.", en: "Come this way." },
      { speaker: "손님", text: "감사합니다.", rom: "gamsahamnida.", en: "Thank you." },
    ],
    question: "손님은 몇 명이에요?",
    questionEn: "How many customers are there?",
    options: [
      { ko: "두 명", en: "Two" },
      { ko: "세 명", en: "Three" },
      { ko: "한 명", en: "One" },
    ],
    answer: 0,
  },
];

/* ===================================================================
   5) TALK BACK (대화 연습) — interactive. The app speaks `prompt`, then
   waits for the learner to answer out loud. If their answer matches any
   of `accept`, it moves on. If not, it says "다시 말해 주세요." */
export type TalkStep = {
  prompt: string;
  promptRom: string;
  promptEn: string;
  expect: string; // an example good answer (shown as a hint)
  expectRom: string;
  expectEn: string;
  accept: string[]; // key phrases that count as correct (any one is enough)
};
export type TalkConversation = { title: string; steps: TalkStep[] };

export const conversations: TalkConversation[] = [
  {
    title: "인사하기 · Greetings",
    steps: [
      {
        prompt: "안녕하세요! 어떻게 지내세요?",
        promptRom: "annyeonghaseyo! eotteoke jinaeseyo?",
        promptEn: "Hello! How are you?",
        expect: "잘 지내요. 감사합니다.",
        expectRom: "jal jinaeyo. gamsahamnida.",
        expectEn: "I'm well, thank you.",
        accept: ["잘 지내요", "잘 지내", "좋아요", "괜찮아요", "감사합니다"],
      },
      {
        prompt: "이름이 뭐예요?",
        promptRom: "ireumi mwoyeyo?",
        promptEn: "What's your name?",
        expect: "제 이름은 ___이에요.",
        expectRom: "je ireumeun ___ieyo.",
        expectEn: "My name is ___.",
        accept: ["이름은", "저는", "제 이름", "이에요", "예요"],
      },
      {
        prompt: "만나서 반가워요!",
        promptRom: "mannaseo bangawoyo!",
        promptEn: "Nice to meet you!",
        expect: "저도 반가워요.",
        expectRom: "jeodo bangawoyo.",
        expectEn: "Nice to meet you too.",
        accept: ["저도", "반가워요", "반갑습니다", "네"],
      },
    ],
  },
  {
    title: "주문하기 · Ordering",
    steps: [
      {
        prompt: "어서 오세요! 뭐 드시겠어요?",
        promptRom: "eoseo oseyo! mwo deusigesseoyo?",
        promptEn: "Welcome! What would you like?",
        expect: "비빔밥 하나 주세요.",
        expectRom: "bibimbap hana juseyo.",
        expectEn: "One bibimbap, please.",
        accept: ["주세요", "하나", "비빔밥", "주문", "이거"],
      },
      {
        prompt: "음료는 뭐로 하시겠어요?",
        promptRom: "eumnyoneun mworo hasigesseoyo?",
        promptEn: "What would you like to drink?",
        expect: "물 주세요.",
        expectRom: "mul juseyo.",
        expectEn: "Water, please.",
        accept: ["물", "콜라", "주스", "커피", "주세요", "없어요"],
      },
      {
        prompt: "네, 곧 준비해 드릴게요.",
        promptRom: "ne, got junbihae deurilgeyo.",
        promptEn: "Okay, I'll have it ready soon.",
        expect: "감사합니다.",
        expectRom: "gamsahamnida.",
        expectEn: "Thank you.",
        accept: ["감사합니다", "고맙습니다", "고마워요", "네"],
      },
    ],
  },
];

/* ===================================================================
   6) WATCH & DECIDE (장면) — a short scene is acted out (emoji avatar +
   voices + subtitles), then the learner chooses the best response. */
export type SceneItem = {
  title: string;
  situation: string; // English setup
  lines: Line[];
  question: string;
  questionEn: string;
  options: Choice[];
  answer: number;
};

export const scenes: SceneItem[] = [
  {
    title: "동료의 인사 · A coworker greets you",
    situation: "You arrive at work. A coworker walks up and speaks.",
    lines: [{ speaker: "동료", text: "안녕하세요! 주말 잘 보냈어요?", rom: "annyeonghaseyo! jumal jal bonaesseoyo?", en: "Hi! Did you have a good weekend?" }],
    question: "뭐라고 대답하면 좋을까요?",
    questionEn: "What is the best thing to say back?",
    options: [
      { ko: "네, 잘 보냈어요. 그쪽은요?", en: "Yes, it was good. And you?" },
      { ko: "가게가 문을 닫았어요.", en: "The store is closed." },
      { ko: "저는 차가 없어요.", en: "I don't have a car." },
    ],
    answer: 0,
  },
  {
    title: "계산대에서 · At the checkout",
    situation: "You're buying groceries. The cashier finishes scanning.",
    lines: [{ speaker: "점원", text: "12,000원입니다. 어떻게 결제하시겠어요?", rom: "man-icheon-wonimnida. eotteoke gyeoljehasigesseoyo?", en: "That's 12,000 won. How would you like to pay?" }],
    question: "좋은 대답은 무엇일까요?",
    questionEn: "What is a good response?",
    options: [
      { ko: "카드로 할게요.", en: "I'll pay by card." },
      { ko: "날씨가 좋네요.", en: "The weather is nice." },
      { ko: "제 이름은 명단에 있어요.", en: "My name is on the list." },
    ],
    answer: 0,
  },
  {
    title: "도움 요청 · Someone asks for help",
    situation: "A person on the street stops you and asks a question.",
    lines: [{ speaker: "행인", text: "실례지만, 지금 몇 시예요?", rom: "sillyejiman, jigeum myeot siyeyo?", en: "Excuse me, what time is it now?" }],
    question: "가장 좋은 대답은?",
    questionEn: "What is the best reply?",
    options: [
      { ko: "세 시 반이에요.", en: "It's half past three." },
      { ko: "공원 근처에 살아요.", en: "I live near the park." },
      { ko: "네, 커피 좋아해요.", en: "Yes, I like coffee." },
    ],
    answer: 0,
  },
];

/* ===================================================================
   7) LISTENING PRACTICE (듣기 연습) — the K-drama trainer. A clip plays
   with NO text first. You replay (and replay slower), then reveal the
   transcript and translation, and answer a comprehension question. This
   is the core "watch without subtitles" exercise. */
export type ClipItem = {
  title: string;
  lines: Line[];
  question: string;
  questionEn: string;
  options: Choice[];
  answer: number;
};

export const clips: ClipItem[] = [
  {
    title: "약속 · Making plans",
    lines: [
      { speaker: "민수", text: "이번 주말에 뭐 해요?", rom: "ibeon jumare mwo haeyo?", en: "What are you doing this weekend?" },
      { speaker: "지영", text: "아직 계획 없어요. 왜요?", rom: "ajik gyehoek eopseoyo. waeyo?", en: "No plans yet. Why?" },
      { speaker: "민수", text: "같이 영화 볼래요?", rom: "gachi yeonghwa bollaeyo?", en: "Want to watch a movie together?" },
      { speaker: "지영", text: "좋아요! 토요일 어때요?", rom: "joayo! toyoil eottaeyo?", en: "Sure! How about Saturday?" },
    ],
    question: "두 사람은 무엇을 하기로 했어요?",
    questionEn: "What did the two people decide to do?",
    options: [
      { ko: "같이 영화 보기", en: "Watch a movie together" },
      { ko: "같이 밥 먹기", en: "Eat together" },
      { ko: "같이 공부하기", en: "Study together" },
    ],
    answer: 0,
  },
  {
    title: "전화 · Running late",
    lines: [
      { speaker: "수진", text: "여보세요? 어디예요?", rom: "yeoboseyo? eodiyeyo?", en: "Hello? Where are you?" },
      { speaker: "태현", text: "미안해요, 조금 늦을 것 같아요.", rom: "mianhaeyo, jogeum neujeul geot gatayo.", en: "Sorry, I think I'll be a little late." },
      { speaker: "수진", text: "괜찮아요. 천천히 오세요.", rom: "gwaenchanayo. cheoncheonhi oseyo.", en: "It's okay. Take your time." },
      { speaker: "태현", text: "십 분 안에 도착해요.", rom: "sip bun ane dochakhaeyo.", en: "I'll arrive within ten minutes." },
    ],
    question: "태현은 왜 전화했어요?",
    questionEn: "Why did Taehyun call?",
    options: [
      { ko: "늦는다고 말하려고", en: "To say he'll be late" },
      { ko: "약속을 취소하려고", en: "To cancel the plan" },
      { ko: "길을 물어보려고", en: "To ask for directions" },
    ],
    answer: 0,
  },
  {
    title: "우연한 만남 · Bumping into a friend",
    lines: [
      { speaker: "은지", text: "어? 여기서 만나네요!", rom: "eo? yeogiseo mannaneyo!", en: "Oh? Fancy meeting you here!" },
      { speaker: "준호", text: "오랜만이에요! 잘 지냈어요?", rom: "oraenmanieyo! jal jinaesseoyo?", en: "Long time no see! How have you been?" },
      { speaker: "은지", text: "네, 덕분에요. 커피 마실래요?", rom: "ne, deokbuneyo. keopi masillaeyo?", en: "Good, thanks. Want some coffee?" },
      { speaker: "준호", text: "좋죠. 제가 살게요.", rom: "jokjyo. jega salgeyo.", en: "Sure. It's on me." },
    ],
    question: "준호가 뭐라고 했어요?",
    questionEn: "What did Junho offer?",
    options: [
      { ko: "커피를 사겠다고", en: "To buy the coffee" },
      { ko: "집에 가겠다고", en: "To go home" },
      { ko: "전화하겠다고", en: "To call later" },
    ],
    answer: 0,
  },
];
