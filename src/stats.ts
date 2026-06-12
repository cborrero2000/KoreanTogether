import { getJSON, setJSON } from "./storage";

/**
 * Progress tracking: daily streak + per-mode session/accuracy totals.
 * Recorded once per completed activity via recordSession() (called from DoneCard).
 */

export type ModeStats = { label: string; sessions: number; correct: number; total: number };

export type StatsData = {
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  totalSessions: number;
  byMode: Record<string, ModeStats>;
};

const KEY = "kt_stats_v1";

const EMPTY: StatsData = { streak: 0, lastActiveDate: null, totalSessions: 0, byMode: {} };

function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  return todayStr(new Date(Date.now() - 24 * 60 * 60 * 1000));
}

export function getStats(): StatsData {
  return getJSON<StatsData>(KEY, EMPTY);
}

/** Record one finished activity (a DoneCard view). Safe to call once per completion. */
export function recordSession(mode: string, label: string, correct: number, total: number): StatsData {
  const data = getStats();
  const today = todayStr();

  if (data.lastActiveDate !== today) {
    data.streak = data.lastActiveDate === yesterdayStr() ? data.streak + 1 : 1;
    data.lastActiveDate = today;
  }

  data.totalSessions += 1;

  const m = data.byMode[mode] ?? { label, sessions: 0, correct: 0, total: 0 };
  m.label = label;
  m.sessions += 1;
  m.correct += correct;
  m.total += total;
  data.byMode[mode] = m;

  setJSON(KEY, data);
  return data;
}

/** Whether today's activity has already extended the streak (for display). */
export function isStreakActiveToday(data: StatsData): boolean {
  return data.lastActiveDate === todayStr();
}
