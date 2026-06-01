"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Zap,
  Calendar,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Filter,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import GameCard from "@/components/game/GameCard";
import { GameCardSkeleton } from "@/components/ui/Skeleton";
import WeekStrip from "@/components/game/WeekStrip";
import HomeSidebar from "@/components/hub/HomeSidebar";
import type { NormalizedGame, StandingsEntry } from "@/types/nba";
import { useSeason, seasonLabel } from "@/app/context/season-context";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import FilterTabs from "@/components/ui/filterTabs";

// ─── types ──────────────────────────────────────────────────────────────────

type Filter = "all" | "live" | "recent" | "upcoming";

const FILTERS: { key: Filter; label: string; icon: React.ElementType }[] = [
  { key: "all",      label: "All Games", icon: Calendar    },
  { key: "live",     label: "Live",      icon: Zap         },
  { key: "recent",   label: "Recent",    icon: CheckCircle },
  { key: "upcoming", label: "Upcoming",  icon: Clock       },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekStart(d: Date) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  mon.setHours(0, 0, 0, 0);
  return mon;
}

function buildWeek(anchor: Date): Date[] {
  const mon = weekStart(anchor);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

// ─── component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const { season } = useSeason();

  const PAGE_SIZE = 6;

  const [games,      setGames]      = useState<NormalizedGame[]>([]);
  const [standings,  setStandings]  = useState<{ east: StandingsEntry[]; west: StandingsEntry[] } | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<Filter>("all");
  const [dataSource, setDataSource] = useState<"api" | "mock">("api");
  const [error,      setError]      = useState<string | null>(null);
  const [page,       setPage]       = useState(1);

  const today                             = useMemo(() => startOfDay(new Date()), []);
  const [weekAnchor, setWeekAnchor]       = useState<Date>(today);
  const [selectedDate, setSelectedDate]   = useState<string | null>(toISO(startOfDay(new Date())));
  const week                              = useMemo(() => buildWeek(weekAnchor), [weekAnchor]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [gamesRes, standingsRes] = await Promise.all([
        fetch(`/api/games?season=${season}&all=true`),
        fetch(`/api/standings?season=${season}`),
      ]);
      const gamesData     = await gamesRes.json();
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

  useEffect(() => { loadData(); }, [season]);
  // Reset to page 1 whenever the filtered set changes
  useEffect(() => { setPage(1); }, [filter, selectedDate, season]);

  const filtered = useMemo(() => {
    if (selectedDate) {
      return games.filter((g) => g.date.slice(0, 10) === selectedDate);
    }
    if (filter === "live")     return games.filter((g) => g.isLive);
    if (filter === "recent")   return games.filter((g) => g.isFinished);
    if (filter === "upcoming") return games.filter((g) => g.isUpcoming);
    return games;
  }, [games, filter, selectedDate]);

  const gameCountByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const g of games) {
      const key = g.date.slice(0, 10);
      map[key] = (map[key] ?? 0) + 1;
    }
    return map;
  }, [games]);

  const liveCount = games.filter((g) => g.isLive).length;

  function selectFilter(f: Filter) {
    setFilter(f);
    setSelectedDate(null);
    setPage(1);
  }

  function selectDay(d: Date) {
    const iso = toISO(d);
    setSelectedDate((prev) => (prev === iso ? null : iso));
    setFilter("all");
    setPage(1);
  }

  function prevWeek() {
    const w = new Date(weekAnchor);
    w.setDate(w.getDate() - 7);
    setWeekAnchor(w);
  }

  function nextWeek() {
    const w = new Date(weekAnchor);
    w.setDate(w.getDate() + 7);
    setWeekAnchor(w);
  }

  function goToToday() {
    setWeekAnchor(today);
    setSelectedDate(toISO(today));
    setFilter("all");
  }

  function handleDateInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!val) { setSelectedDate(null); setPage(1); return; }
    const d = new Date(val + "T00:00:00");
    setWeekAnchor(d);
    setSelectedDate(val);
    setFilter("all");
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeHeading = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
      })
    : filter === "live"     ? "Live Games"
    : filter === "recent"   ? "Recent Games"
    : filter === "upcoming" ? "Upcoming Games"
    : "All Games";

  return (
    <div className="min-h-screen court-pattern" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Hero */}
        <Hero title="HOME" description="Don't miss the courtside action" dataSource={dataSource} season={season} live={{ count: liveCount }} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Games Column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Filter tabs */}
            <FilterTabs 
              options={FILTERS} 
              selectedDate={selectedDate ?? undefined} 
              filter={filter} onSelect={(f) => selectFilter(f as Filter)} 
              live={liveCount > 0 ? { count: liveCount } : undefined} 
              refresh={{ loading, loadData }} 
            />
            {/* Week Strip */}
            <WeekStrip
              week={week}
              today={today}
              selectedDate={selectedDate}
              gameCountByDate={gameCountByDate}
              onPrevWeek={prevWeek}
              onNextWeek={nextWeek}
              onGoToToday={goToToday}
              onSelectDay={selectDay}
              onDateChange={handleDateInput}
              onClearDate={() => setSelectedDate(null)}
            />

            {/* Active heading + count */}
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className="font-display font-700 text-base tracking-wider uppercase"
                style={{ color: "var(--color-text)" }}
              >
                {activeHeading}
              </h2>
              {!loading && (
                <>
                  <span
                    className="font-display font-700 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--color-bg-elevated)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {filtered.length}
                  </span>
                  {totalPages > 1 && (
                    <span
                      className="font-display font-600 text-xs ml-auto"
                      style={{ color: "var(--color-text-subtle)" }}
                    >
                      Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: "#E03A3E18", border: "1px solid #E03A3E40", color: "var(--color-text)" }}
              >
                <AlertCircle size={16} style={{ color: "#E03A3E" }} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Games grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <GameCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
              >
                <Calendar size={32} className="mx-auto mb-3 opacity-30" style={{ color: "var(--color-text-muted)" }} />
                <p className="font-display font-700 text-xl mb-1" style={{ color: "var(--color-text-muted)" }}>
                  No games found
                </p>
                <p className="text-sm" style={{ color: "var(--color-text-subtle)" }}>
                  Try a different filter or pick another date.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paginated.map((game) => (
                    <div key={game.id} className="animate-fade-in">
                      <GameCard game={game} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-600 text-xs tracking-wider uppercase transition-all disabled:opacity-30 hover:opacity-70"
                      style={{
                        background: "var(--color-bg-card)",
                        color: "var(--color-text-muted)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <ChevronLeft size={12} /> Prev
                    </button>

                    {/* Smart page buttons with ellipsis */}
                    <div className="flex items-center gap-1">
                      {(() => {
                        const delta = 1; // siblings on each side of current
                        const pages: (number | "…")[] = [];
                        const addPage = (p: number) => {
                          if (!pages.includes(p)) pages.push(p);
                        };
                        addPage(1);
                        for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) addPage(i);
                        addPage(totalPages);
                        const withEllipsis: (number | "…")[] = [];
                        let prev = 0;
                        for (const p of pages as number[]) {
                          if (p - prev > 1) withEllipsis.push("…");
                          withEllipsis.push(p);
                          prev = p;
                        }
                        return withEllipsis.map((p, idx) =>
                          p === "…" ? (
                            <span
                              key={`ellipsis-${idx}`}
                              className="w-7 h-7 flex items-center justify-center text-xs"
                              style={{ color: "var(--color-text-subtle)" }}
                            >
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setPage(p as number)}
                              className="w-7 h-7 rounded-lg font-display font-700 text-xs transition-all hover:opacity-80"
                              style={
                                p === page
                                  ? { background: "var(--color-accent)", color: "#fff" }
                                  : {
                                      background: "var(--color-bg-card)",
                                      color: "var(--color-text-muted)",
                                      border: "1px solid var(--color-border)",
                                    }
                              }
                            >
                              {p}
                            </button>
                          )
                        );
                      })()}
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-600 text-xs tracking-wider uppercase transition-all disabled:opacity-30 hover:opacity-70"
                      style={{
                        background: "var(--color-bg-card)",
                        color: "var(--color-text-muted)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      Next <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <HomeSidebar games={games} standings={standings} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
