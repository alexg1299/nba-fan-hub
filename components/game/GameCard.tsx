"use client";

import Link from "next/link";
import { Calendar, Clock, Zap } from "lucide-react";
import type { NormalizedGame } from "@/types/nba";
import { getTeamColors } from "@/lib/nba-api";
import clsx from "clsx";
import TeamLogo from "@/components/team/TeamLogo";

interface GameCardProps {
  game: NormalizedGame;
}

function TeamSide({
  name,
  abbreviation,
  score,
  isWinner,
  isFinished,
}: {
  name: string;
  abbreviation: string;
  score: number;
  isWinner: boolean;
  isFinished: boolean;
}) {
  const colors = getTeamColors(abbreviation);

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
      <TeamLogo abbreviation={abbreviation} size={52} variant="circle" />
      <span
        className="font-display font-700 text-xs text-center leading-tight tracking-wider uppercase"
        style={{ color: "var(--color-text-muted)" }}
      >
        {abbreviation}
      </span>
      {score !== undefined && score !== null && (
        <span
          className={clsx(
            "score-display text-5xl transition-all",
            isFinished && isWinner ? "opacity-100" : isFinished ? "opacity-35" : "opacity-75"
          )}
          style={{
            color: isFinished && isWinner ? colors.primary : "var(--color-text)",
            textShadow: isFinished && isWinner ? `0 0 24px ${colors.primary}55` : "none",
          }}
        >
          {score}
        </span>
      )}
    </div>
  );
}

export default function GameCard({ game }: GameCardProps) {
  const homeWon = game.isFinished && game.homeTeam.score > game.awayTeam.score;
  const awayWon = game.isFinished && game.awayTeam.score > game.homeTeam.score;
  // Append T00:00:00 so the string is parsed as local time, not UTC
  const gameDate = new Date(game.date.slice(0, 10) + "T00:00:00");
  const isToday = new Date().toDateString() === gameDate.toDateString();

  const dateLabel = isToday
    ? "Today"
    : gameDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const awayColors = getTeamColors(game.awayTeam.abbreviation);
  const homeColors = getTeamColors(game.homeTeam.abbreviation);

  return (
    <Link href={`/game/${game.id}`}>
      <article
        className="card rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-200"
        style={{ background: "var(--color-bg-card)" }}
      >
        {/* Dual team color strip at top */}
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, ${awayColors.primary} 0%, ${awayColors.primary} 50%, ${homeColors.primary} 50%, ${homeColors.primary} 100%)`,
          }}
        />

        <div className="p-5">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-subtle)" }}>
              <Calendar size={10} />
              <span className="font-display font-700 tracking-widest uppercase">{dateLabel}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {game.isLive && (
                <span className="live-badge flex items-center gap-1">
                  <Zap size={9} className="inline" />
                  Live · Q{game.period}
                  {game.time && ` ${game.time}`}
                </span>
              )}
              {game.isUpcoming && game.time && (
                <span
                  className="flex items-center gap-1 text-xs font-display font-700 tracking-widest uppercase px-2 py-0.5 rounded-md"
                  style={{
                    color: "var(--color-accent)",
                    background: "var(--color-accent-glow)",
                  }}
                >
                  <Clock size={10} />
                  {game.time}
                </span>
              )}
              {game.isFinished && (
                <span
                  className="text-xs font-display font-700 tracking-widest uppercase px-2 py-0.5 rounded-md"
                  style={{ color: "var(--color-text-subtle)", background: "var(--color-bg-elevated)" }}
                >
                  Final
                </span>
              )}
            </div>
          </div>

          {/* Teams + Score */}
          <div className="flex items-center gap-2">
            <TeamSide
              name={game.awayTeam.name}
              abbreviation={game.awayTeam.abbreviation}
              score={game.awayTeam.score}
              isWinner={awayWon}
              isFinished={game.isFinished}
            />

            <div className="flex flex-col items-center gap-1 flex-shrink-0 w-7">
              <span
                className="font-display font-800 text-xs tracking-widest"
                style={{ color: "var(--color-border)" }}
              >
                {game.isFinished ? "—" : "@"}
              </span>
            </div>

            <TeamSide
              name={game.homeTeam.name}
              abbreviation={game.homeTeam.abbreviation}
              score={game.homeTeam.score}
              isWinner={homeWon}
              isFinished={game.isFinished}
            />
          </div>

          {/* Footer */}
          <div
            className="mt-4 pt-3 border-t flex items-center justify-between"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="text-xs font-body font-400" style={{ color: "var(--color-text-subtle)" }}>
              {game.homeTeam.fullName}
            </span>
            <span
              className="text-xs font-display font-700 tracking-wider uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              Details →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
