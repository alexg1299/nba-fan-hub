"use client";

import type { StandingsEntry } from "@/types/nba";
import { getTeamColors } from "@/lib/nba-api";

interface StandingsTableProps {
  teams: StandingsEntry[];
  conference: "East" | "West";
}

/**
 * Conference standings table with playoff cutline indicator.
 * Used on both the homepage sidebar and the /standings page.
 */
export default function StandingsTable({ teams, conference }: StandingsTableProps) {
  const sorted = [...teams].sort((a, b) => b.winPct - a.winPct);
  const playoffLine = 6;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--color-border)", background: "var(--color-bg-card)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: conference === "East" ? "#CE1141" : "#1D428A" }}
        />
        <h3
          className="font-display font-700 text-base tracking-wider uppercase"
          style={{ color: "var(--color-text)" }}
        >
          {conference}ern Conference
        </h3>
      </div>

      {/* Column labels */}
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

      {/* Rows */}
      {sorted.map((entry, idx) => {
        const colors = getTeamColors(entry.team.abbreviation);
        const isPlayoffBorder = idx === playoffLine - 1;
        const inPlayoffs = idx < playoffLine;

        return (
          <div key={entry.team.id}>
            <div
              className="grid grid-cols-12 px-4 py-3 items-center hover:opacity-80 transition-opacity"
              style={{
                background: idx % 2 === 0 ? "transparent" : "var(--color-bg-elevated)",
              }}
            >
              <span
                className="col-span-1 font-display font-700 text-sm"
                style={{ color: inPlayoffs ? "var(--color-accent)" : "var(--color-text-subtle)" }}
              >
                {idx + 1}
              </span>
              <div className="col-span-5 flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-display font-800"
                  style={{ background: colors.primary, fontSize: "9px" }}
                >
                  {entry.team.abbreviation}
                </div>
                <span
                  className="font-body font-500 text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {entry.team.name}
                </span>
              </div>
              <span
                className="col-span-2 text-center font-display font-700 text-sm"
                style={{ color: "var(--color-text)" }}
              >
                {entry.wins}
              </span>
              <span
                className="col-span-2 text-center font-display text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {entry.losses}
              </span>
              <span
                className="col-span-2 text-right font-display font-700 text-sm"
                style={{ color: inPlayoffs ? "var(--color-accent)" : "var(--color-text-muted)" }}
              >
                {entry.winPct.toFixed(3)}
              </span>
            </div>

            {/* Playoff cut line */}
            {isPlayoffBorder && (
              <div
                className="h-px mx-4"
                style={{ background: "var(--color-accent)", opacity: 0.4 }}
              />
            )}
          </div>
        );
      })}

      <div
        className="px-4 py-2 flex items-center gap-2 text-xs"
        style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-subtle)" }}
      >
        <div
          className="w-4 h-px"
          style={{ background: "var(--color-accent)" }}
        />
        Playoff cutline (Top 6 + Play-In)
      </div>
    </div>
  );
}
