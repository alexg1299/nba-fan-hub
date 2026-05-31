"use client";

import Link from "next/link";
import { Calendar, Clock, Zap } from "lucide-react";
import type { NormalizedGame } from "@/types/nba";
import { getTeamColors } from "@/lib/nba-api";
import clsx from "clsx";

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
    <div className="flex flex-col items-center gap-2 flex-1">
      {/* Team color swatch */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-800 text-sm tracking-widest shadow-md"
        style={{ background: colors.primary }}
      >
        {abbreviation}
      </div>
      <span
        className="font-body text-xs font-500 text-center leading-tight"
        style={{ color: "var(--color-text-muted)" }}
      >
        {name}
      </span>
      {(score !== undefined && score !== null) && (
        <span
          className={clsx(
            "score-display text-4xl",
            isFinished && isWinner ? "opacity-100" : isFinished ? "opacity-40" : "opacity-70"
          )}
          style={{
            color: isFinished && isWinner ? "var(--color-text)" : undefined,
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
  const gameDate = new Date(game.date);
  const isToday = new Date().toDateString() === gameDate.toDateString();

  const dateLabel = isToday
    ? "Today"
    : gameDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Link href={`/game/${game.id}`}>
      <article
        className="card rounded-2xl p-5 cursor-pointer group hover:-translate-y-0.5 transition-all duration-200"
        style={{ background: "var(--color-bg-card)" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-subtle)" }}>
            <Calendar size={11} />
            <span className="font-display font-600 tracking-wide uppercase">{dateLabel}</span>
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
                className="flex items-center gap-1 text-xs font-display font-600 tracking-wider uppercase"
                style={{ color: "var(--color-accent)" }}
              >
                <Clock size={11} />
                {game.time}
              </span>
            )}
            {game.isFinished && (
              <span
                className="text-xs font-display font-600 tracking-wider uppercase"
                style={{ color: "var(--color-text-subtle)" }}
              >
                Final
              </span>
            )}
          </div>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center gap-3">
          <TeamSide
            name={game.awayTeam.name}
            abbreviation={game.awayTeam.abbreviation}
            score={game.awayTeam.score}
            isWinner={awayWon}
            isFinished={game.isFinished}
          />

          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <span
              className="font-display text-lg font-800 tracking-widest"
              style={{ color: "var(--color-text-subtle)" }}
            >
              @
            </span>
            {game.isFinished && (
              <div
                className="w-1.5 h-1.5 rounded-full mt-0.5"
                style={{ background: "var(--color-accent)" }}
              />
            )}
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
          <span
            className="text-xs font-body font-400"
            style={{ color: "var(--color-text-subtle)" }}
          >
            {game.homeTeam.fullName}
          </span>
          <span
            className="text-xs font-display font-600 tracking-wide group-hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            View Details →
          </span>
        </div>
      </article>
    </Link>
  );
}
