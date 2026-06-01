"use client";

import StandingsTable from "@/components/standings/StandingsTable";
import QuickStatsStrip from "./QuickStatsStrip";
import type { NormalizedGame, StandingsEntry } from "@/types/nba";
import InsightCard from "../ui/InsightCard";

interface HomeSidebarProps {
  games: NormalizedGame[];
  standings: { east: StandingsEntry[]; west: StandingsEntry[] } | null;
}

export default function HomeSidebar({ games, standings }: HomeSidebarProps) {
  const liveCount     = games.filter((g) => g.isLive).length;
  const upcomingCount = games.filter((g) => g.isUpcoming).length;
  const finalCount    = games.filter((g) => g.isFinished).length;

  const stats = [
    { label: "Live",     value: liveCount,     color: "var(--color-live)"       },
    { label: "Upcoming", value: upcomingCount,  color: "var(--color-accent)"     },
    { label: "Final",    value: finalCount,     color: "var(--color-text-muted)" },
  ];

  return (
    <aside className="space-y-6">
      {/* Quick stats strip */}
      <QuickStatsStrip stats={stats} />

      {/* Standings */}
      <div className="flex items-center justify-between">
        <h2
          className="font-display font-700 text-lg tracking-wider uppercase"
          style={{ color: "var(--color-text)" }}
        >
          Standings
        </h2>
        <a
          href="/standings"
          className="text-xs font-display font-600 tracking-wide uppercase hover:underline"
          style={{ color: "var(--color-accent)" }}
        >
          Full Table →
        </a>
      </div>

      {standings ? (
        <>
          <StandingsTable teams={standings.east.slice(0, 5)} conference="East" />
          <StandingsTable teams={standings.west.slice(0, 5)} conference="West" />
        </>
      ) : (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-2xl h-48 animate-pulse"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            />
          ))}
        </div>
      )}

      {/* What to Watch 
      <InsightCard title="What To Watch" message="Click any game card to see the full breakdown — key matchups, player stats, quarter-by-quarter scores, and team comparisons." />
        */}
      </aside>
  );
}
