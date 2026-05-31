"use client";

import { useEffect, useState } from "react";
import { Zap, Calendar, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import GameCard from "@/components/GameCard";
import { GameCardSkeleton } from "@/components/Skeleton";
import StandingsTable from "@/components/StandingsTable";
import type { NormalizedGame, StandingsEntry } from "@/types/nba";
import clsx from "clsx";

type Filter = "all" | "live" | "today" | "finished";

const FILTERS: { key: Filter; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All Games", icon: Calendar },
  { key: "live", label: "Live", icon: Zap },
  { key: "today", label: "Today", icon: Calendar },
  { key: "finished", label: "Final", icon: CheckCircle },
];

export default function HomePage() {
  const [games, setGames] = useState<NormalizedGame[]>([]);
  const [standings, setStandings] = useState<{ east: StandingsEntry[]; west: StandingsEntry[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [dataSource, setDataSource] = useState<"api" | "mock">("api");
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [gamesRes, standingsRes] = await Promise.all([
        fetch("/api/games"),
        fetch("/api/standings"),
      ]);
      const gamesData = await gamesRes.json();
      const standingsData = await standingsRes.json();

      setGames(gamesData.games || []);
      setDataSource(gamesData.source);
      setStandings(standingsData.standings);
    } catch {
      setError("Failed to load game data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const filtered = games.filter((g) => {
    const today = new Date().toDateString() === new Date(g.date).toDateString();
    if (filter === "live") return g.isLive;
    if (filter === "today") return today;
    if (filter === "finished") return g.isFinished;
    return true;
  });

  const liveCount = games.filter((g) => g.isLive).length;

  return (
    <div className="min-h-screen court-pattern" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <section className="mb-10 page-enter">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p
                className="text-xs font-display font-600 tracking-widest uppercase mb-1"
                style={{ color: "var(--color-accent)" }}
              >
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h1
                className="font-display font-800 text-5xl sm:text-6xl tracking-tight leading-none"
                style={{ color: "var(--color-text)" }}
              >
                Game Day
                <br />
                <span style={{ color: "var(--color-accent)" }}>Fan Hub</span>
              </h1>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1">
              {liveCount > 0 && (
                <div className="live-badge flex items-center gap-1.5">
                  <Zap size={10} />
                  {liveCount} Live {liveCount === 1 ? "Game" : "Games"}
                </div>
              )}
              {dataSource === "mock" && (
                <p className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-subtle)" }}>
                  <AlertCircle size={10} />
                  Demo data
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mt-6" style={{ background: "var(--color-border)" }} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Games column */}
          <div className="lg:col-span-2">
            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {FILTERS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-600 text-xs tracking-wider uppercase transition-all",
                    filter === key ? "text-white shadow-md" : "hover:opacity-80"
                  )}
                  style={
                    filter === key
                      ? { background: "var(--color-accent)" }
                      : {
                          background: "var(--color-bg-card)",
                          color: "var(--color-text-muted)",
                          border: "1px solid var(--color-border)",
                        }
                  }
                >
                  <Icon size={11} />
                  {label}
                  {key === "live" && liveCount > 0 && (
                    <span
                      className="w-4 h-4 rounded-full text-white text-xs flex items-center justify-center"
                      style={{ background: "var(--color-live)", fontSize: "9px" }}
                    >
                      {liveCount}
                    </span>
                  )}
                </button>
              ))}

              <button
                onClick={loadData}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-600 text-xs tracking-wider uppercase transition-all hover:opacity-80"
                style={{
                  background: "var(--color-bg-card)",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {/* Error state */}
            {error && (
              <div
                className="rounded-xl p-4 mb-6 flex items-center gap-3"
                style={{ background: "#E03A3E18", border: "1px solid #E03A3E40", color: "var(--color-text)" }}
              >
                <AlertCircle size={16} style={{ color: "#E03A3E" }} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Games grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
              >
                <p
                  className="font-display font-700 text-xl mb-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  No games found
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-subtle)" }}>
                  Try a different filter or check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((game) => (
                  <div key={game.id} className="animate-fade-in">
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Standings */}
          <aside className="space-y-6">
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

            {/* What to watch callout */}
            <div
              className="rounded-2xl p-5 mt-6"
              style={{
                background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-card) 100%)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p
                className="font-display font-700 text-base tracking-wider uppercase mb-2"
                style={{ color: "var(--color-accent)" }}
              >
                What To Watch
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Click any game card to see the full breakdown — key matchups, player stats, quarter-by-quarter scores, and team comparisons.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-16 py-8"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ color: "var(--color-text-subtle)" }}
        >
          <span className="font-display font-700 tracking-widest uppercase">CourtSide</span>
          <span>Data via BallDontLie API · Built with Next.js 14</span>
          <span>NBA Fan Hub Assessment Project</span>
        </div>
      </footer>
    </div>
  );
}
