"use client";

import type { StandingsEntry } from "@/types/nba";
import ConferenceHeading from "@/components/ui/ConferenceHeading";
import TeamLogo from "@/components/team/TeamLogo";

interface StandingsTableProps {
  teams: StandingsEntry[];
  conference: "East" | "West";
  /** When true (default), shows only W / L / PCT — suitable for sidebar widgets.
   *  When false, shows the full stat line: GB · Home · Away · L10 · Streak. */
  compact?: boolean;
}

/**
 * Conference standings table with playoff cutline indicator.
 * Used on both the homepage sidebar (compact=true) and the /standings page (compact=false).
 */
export default function StandingsTable({ teams, conference, compact = true }: StandingsTableProps) {
  const sorted = [...teams].sort((a, b) => b.winPct - a.winPct);
  const playoffLine = 6;
  const playInLine = 10; // ranks 7-10 are play-in

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--color-border)", background: "var(--color-bg-card)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <ConferenceHeading conference={conference} />
      </div>

      {compact ? (
        <>
          {/* Compact column labels */}
          <div
            className="grid grid-cols-12 px-4 py-2 text-xs"
            style={{ color: "var(--color-text-subtle)", borderBottom: "1px solid var(--color-border)" }}
          >
            <span className="col-span-1">#</span>
            <span className="col-span-5">Team</span>
            <span className="col-span-2 text-center">W</span>
            <span className="col-span-2 text-center">L</span>
            <span className="col-span-2 text-right font-display font-600">PCT</span>
          </div>

          {/* Compact rows */}
          {sorted.map((entry, idx) => {
            const isPlayoffBorder = idx === playoffLine - 1;
            const inPlayoffs = idx < playoffLine;

            return (
              <div key={entry.team.id}>
                <div
                  className="grid grid-cols-12 px-4 py-3 items-center hover:opacity-80 transition-opacity"
                  style={{ background: idx % 2 === 0 ? "transparent" : "var(--color-bg-elevated)" }}
                >
                  <span
                    className="col-span-1 font-display font-700 text-sm"
                    style={{ color: inPlayoffs ? "var(--color-accent)" : "var(--color-text-subtle)" }}
                  >
                    {idx + 1}
                  </span>
                  <div className="col-span-5 flex items-center gap-2">
                    <TeamLogo abbreviation={entry.team.abbreviation} size={24} />
                    <span className="font-body font-500 text-sm" style={{ color: "var(--color-text)" }}>
                      {entry.team.name}
                    </span>
                  </div>
                  <span className="col-span-2 text-center font-display font-700 text-sm" style={{ color: "var(--color-text)" }}>
                    {entry.wins}
                  </span>
                  <span className="col-span-2 text-center font-display text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {entry.losses}
                  </span>
                  <span
                    className="col-span-2 text-right font-display font-700 text-sm"
                    style={{ color: inPlayoffs ? "var(--color-accent)" : "var(--color-text-muted)" }}
                  >
                    {entry.winPct.toFixed(3)}
                  </span>
                </div>
                {isPlayoffBorder && (
                  <div className="h-px mx-4" style={{ background: "var(--color-accent)", opacity: 0.4 }} />
                )}
              </div>
            );
          })}
        </>
      ) : (
        <div className="overflow-x-auto">
          {/* Full column labels */}
          <div
            className="grid px-4 py-2 text-xs"
            style={{
              minWidth: "44rem",
              gridTemplateColumns: "2rem 1fr 3rem 3rem 4rem 4rem 5rem 5rem 4rem 5rem",
              color: "var(--color-text-subtle)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span>#</span>
            <span>Team</span>
            <span className="text-center">W</span>
            <span className="text-center">L</span>
            <span className="text-center font-display font-600">PCT</span>
            <span className="text-center">GB</span>
            <span className="text-center">Home</span>
            <span className="text-center">Away</span>
            <span className="text-center">L10</span>
            <span className="text-right">Streak</span>
          </div>

          {/* Full rows */}
          {sorted.map((entry, idx) => {
            const isPlayoffBorder = idx === playoffLine - 1;
            const isPlayInBorder = idx === playInLine - 1;
            const inPlayoffs = idx < playoffLine;
            const inPlayIn = idx >= playoffLine && idx < playInLine;

            const rankColor = inPlayoffs
              ? "var(--color-accent)"
              : inPlayIn
              ? "var(--color-text-muted)"
              : "var(--color-text-subtle)";

            const streakColor =
              entry.streak?.startsWith("W")
                ? "#22c55e"
                : entry.streak?.startsWith("L")
                ? "#ef4444"
                : "var(--color-text-muted)";

            return (
              <div key={entry.team.id}>
                <div
                  className="grid px-4 py-2 items-center hover:opacity-80 transition-opacity"
                  style={{
                    minWidth: "44rem",
                    gridTemplateColumns: "2rem 1fr 3rem 3rem 4rem 4rem 5rem 5rem 4rem 5rem",
                    background: idx % 2 === 0 ? "transparent" : "var(--color-bg-elevated)",
                  }}
                >
                  <span className="font-display font-700 text-sm" style={{ color: rankColor }}>
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <TeamLogo abbreviation={entry.team.abbreviation} size={24} className="shrink-0" />
                    <span className="font-body font-500 text-sm truncate" style={{ color: "var(--color-text)" }}>
                      {entry.team.name}
                    </span>
                  </div>
                  <span className="text-center font-display font-700 text-sm" style={{ color: "var(--color-text)" }}>
                    {entry.wins}
                  </span>
                  <span className="text-center font-display text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {entry.losses}
                  </span>
                  <span
                    className="text-center font-display font-700 text-sm"
                    style={{ color: inPlayoffs ? "var(--color-accent)" : "var(--color-text-muted)" }}
                  >
                    {entry.winPct.toFixed(3)}
                  </span>
                  <span className="text-center font-display text-sm" style={{ color: "var(--color-text-subtle)" }}>
                    {entry.gamesBack ?? "-"}
                  </span>
                  <span className="text-center font-display text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {entry.homeRecord ?? "-"}
                  </span>
                  <span className="text-center font-display text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {entry.awayRecord ?? "-"}
                  </span>
                  <span className="text-center font-display text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {entry.last10 ?? "-"}
                  </span>
                  <span className="text-right font-display font-700 text-sm" style={{ color: streakColor }}>
                    {entry.streak ?? "-"}
                  </span>
                </div>

                {isPlayoffBorder && (
                  <div
                    className="h-px mx-4 flex items-center"
                    style={{ background: "var(--color-accent)", opacity: 0.5 }}
                  />
                )}
                {isPlayInBorder && (
                  <div
                    className="h-px mx-4"
                    style={{ background: "var(--color-text-subtle)", opacity: 0.3 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend footer */}
      <div
        className="px-4 py-2 flex items-center gap-4 text-xs flex-wrap"
        style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-subtle)" }}
      >
        <span className="flex items-center gap-1">
          <span className="w-4 h-px inline-block" style={{ background: "var(--color-accent)" }} />
          Playoff cutline (Top 6)
        </span>
        {!compact && (
          <span className="flex items-center gap-1">
            <span className="w-4 h-px inline-block" style={{ background: "var(--color-text-subtle)", opacity: 0.5 }} />
            Play-In cutline (7–10)
          </span>
        )}
      </div>
    </div>
  );
}



