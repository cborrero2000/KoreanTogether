import { getJSON, setJSON } from "./storage";

/**
 * A small, dependency-free spaced-repetition scheduler (Leitner-style) so the
 * Recall mode brings items back right before you'd forget them — the single
 * most powerful thing for long-term retention.
 *
 * Each card sits in a "box". Higher box = longer wait. Grading:
 *   - "again" → back to box 0 (see it again very soon)
 *   - "good"  → move up one box
 *   - "easy"  → jump up two boxes
 */
export type Grade = "again" | "good" | "easy";

export type Card = {
  id: string;
  box: number; // index into INTERVALS_MIN
  due: number; // epoch ms when it's next due
  reps: number; // total times reviewed
  lapses: number; // times graded "again"
};

const KEY = "kt_srs_v1";
const MIN = 60 * 1000;
// Minutes until next review for each box.  Box 0 ≈ 10 min, then 1d, 3d, 7d, …
const INTERVALS_MIN = [10, 60 * 24, 60 * 24 * 3, 60 * 24 * 7, 60 * 24 * 16, 60 * 24 * 35, 60 * 24 * 90];

type Deck = Record<string, Card>;

function load(): Deck {
  return getJSON<Deck>(KEY, {});
}
function save(deck: Deck) {
  setJSON(KEY, deck);
}

function intervalMs(box: number): number {
  const b = Math.max(0, Math.min(box, INTERVALS_MIN.length - 1));
  return INTERVALS_MIN[b] * MIN;
}

/** A brand-new (never-studied) card, due immediately. */
function fresh(id: string, now: number): Card {
  return { id, box: 0, due: now, reps: 0, lapses: 0 };
}

/**
 * Given the full set of item ids, return the cards that are due now (new items
 * count as due), oldest-due first. `limit` caps the size of a study session.
 */
export function getDue(allIds: string[], now = Date.now(), limit = 20): Card[] {
  const deck = load();
  const due = allIds
    .map((id) => deck[id] ?? fresh(id, now))
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due);
  return due.slice(0, limit);
}

/** The stored card for an id, or undefined if it has never been studied. */
export function getCard(id: string): Card | undefined {
  return load()[id];
}

/** How many of the given ids are due now (for the Home badge / counts). */
export function dueCount(allIds: string[], now = Date.now()): number {
  const deck = load();
  return allIds.reduce((n, id) => n + ((deck[id]?.due ?? 0) <= now ? 1 : 0), 0);
}

/** Apply a grade to a card and persist its new schedule. */
export function rate(id: string, grade: Grade, now = Date.now()): Card {
  const deck = load();
  const card = deck[id] ?? fresh(id, now);
  card.reps += 1;
  if (grade === "again") {
    card.box = 0;
    card.lapses += 1;
  } else if (grade === "good") {
    card.box = Math.min(card.box + 1, INTERVALS_MIN.length - 1);
  } else {
    card.box = Math.min(card.box + 2, INTERVALS_MIN.length - 1);
  }
  card.due = now + intervalMs(card.box);
  deck[id] = card;
  save(deck);
  return card;
}

/** A friendly "next review" label for a grade, shown on the buttons. */
export function nextLabel(card: Card | undefined, grade: Grade): string {
  const cur = card ? card.box : 0; // a never-studied card starts at box 0
  const box = grade === "again" ? 0 : grade === "good" ? cur + 1 : cur + 2;
  const mins = INTERVALS_MIN[Math.max(0, Math.min(box, INTERVALS_MIN.length - 1))];
  if (mins < 60) return `${mins}m`;
  const days = Math.round(mins / (60 * 24));
  return days <= 1 ? "1d" : `${days}d`;
}

export type Stats = { studied: number; total: number; mature: number };

/** Simple progress stats across the whole pool, for the Recall home blurb. */
export function stats(allIds: string[]): Stats {
  const deck = load();
  let studied = 0;
  let mature = 0;
  for (const id of allIds) {
    const c = deck[id];
    if (c && c.reps > 0) studied += 1;
    if (c && c.box >= 3) mature += 1;
  }
  return { studied, total: allIds.length, mature };
}
