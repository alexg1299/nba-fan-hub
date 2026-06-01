import type { StandingsEntry } from "@/types/nba";

/**
 * Returns the CSS color variable for a team's rank badge based on playoff/play-in position.
 */
export function getRankColor(
  idx: number,
  playoffLine: number,
  playInLine: number
): string {
  if (idx < playoffLine) return "var(--color-accent)";
  if (idx < playInLine) return "var(--color-text-muted)";
  return "var(--color-text-subtle)";
}

/**
 * Returns a win/loss color for a team's current streak string (e.g. "W3", "L1").
 */
export function getStreakColor(streak?: string): string {
  if (streak?.startsWith("W")) return "#22c55e";
  if (streak?.startsWith("L")) return "#ef4444";
  return "var(--color-text-muted)";
}

/**
 * Returns a new array of standings entries sorted descending by win percentage.
 */
export function sortByWinPct(teams: StandingsEntry[]): StandingsEntry[] {
  return [...teams].sort((a, b) => b.winPct - a.winPct);
}
