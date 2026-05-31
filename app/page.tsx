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
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import GameCard from "@/components/game/GameCard";
import { GameCardSkeleton } from "@/components/ui/Skeleton";
import StandingsTable from "@/components/standings/StandingsTable";
import type { NormalizedGame, StandingsEntry } from "@/types/nba";
import clsx from "clsx";
import { useSeason, seasonLabel } from "@/app/context/season-context";

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
  return d.toISOString().slice(0, 10);
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
  const [selectedDate, setSelectedDate]   = useState<string | null>(null);
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
        <section className="mb-8 page-enter">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p
                className="text-xs font-display font-700 tracking-widest uppercase mb-2 flex items-center gap-2"
                style={{ color: "var(--color-accent)" }}
              >
                <span className="inline-block w-4 h-0.5" style={{ background: "var(--color-accent)" }} />
                {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h1
                className="font-hero text-6xl sm:text-7xl leading-none"
                style={{ color: "var(--color-text)", letterSpacing: "0.04em" }}
              >
                {seasonLabel(season)}
                <br />
                <span style={{ color: "var(--color-accent)" }}>SCORES</span>
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
          <div className="h-px w-full mt-6" style={{ background: "var(--color-border)" }} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Games Column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {FILTERS.map(({ key, label, icon: Icon }) => {
                const isActive = !selectedDate && filter === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectFilter(key)}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-600 text-xs tracking-wider uppercase transition-all",
                      isActive ? "text-white shadow-md" : "hover:opacity-80"
                    )}
                    style={
                      isActive
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
                );
              })}

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

            {/* Week Strip */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
              {/* Week nav */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevWeek}
                  className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-muted)" }}
                  aria-label="Previous week"
                >
                  <ChevronLeft size={14} />
                </button>

                <div className="flex items-center gap-3">
                  <span
                    className="font-display font-700 text-xs tracking-widest uppercase"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {week[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {" — "}
                    {week[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <button
                    onClick={goToToday}
                    className="text-xs font-display font-600 tracking-wider uppercase px-2 py-0.5 rounded transition-opacity hover:opacity-70"
                    style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)" }}
                  >
                    Today
                  </button>
                </div>

                <button
                  onClick={nextWeek}
                  className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-muted)" }}
                  aria-label="Next week"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Day pills */}
              <div className="grid grid-cols-7 gap-1.5">
                {week.map((d) => {
                  const iso        = toISO(d);
                  const isToday    = iso === toISO(today);
                  const isSelected = selectedDate === iso;
                  const count      = gameCountByDate[iso] ?? 0;
                  const dayName    = d.toLocaleDateString("en-US", { weekday: "short" });
                  const dayNum     = d.getDate();

                  return (
                    <button
                      key={iso}
                      onClick={() => selectDay(d)}
                      className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all hover:opacity-80"
                      style={
                        isSelected
                          ? { background: "var(--color-accent)", color: "#fff" }
                          : isToday
                          ? {
                              background: "var(--color-bg-elevated)",
                              color: "var(--color-accent)",
                              border: "1px solid var(--color-accent)",
                            }
                          : {
                              background: "var(--color-bg-elevated)",
                              color: "var(--color-text-muted)",
                            }
                      }
                    >
                      <span className="font-display font-700 text-xs tracking-wide uppercase">{dayName}</span>
                      <span className="font-display font-800 text-base leading-none">{dayNum}</span>
                      {count > 0 ? (
                        <span
                          className="text-xs font-display font-700 leading-none"
                          style={{ color: isSelected ? "rgba(255,255,255,0.85)" : "var(--color-accent)" }}
                        >
                          {count}
                        </span>
                      ) : (
                        <span className="text-xs opacity-0">·</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Date jump */}
              <div
                className="mt-3 pt-3 flex items-center gap-2"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <Calendar size={13} style={{ color: "var(--color-text-subtle)" }} />
                <label
                  className="font-display font-600 text-xs tracking-wider uppercase"
                  style={{ color: "var(--color-text-subtle)" }}
                >
                  Jump to date
                </label>
                <input
                  type="date"
                  value={selectedDate ?? ""}
                  onChange={handleDateInput}
                  className="ml-auto text-xs font-display font-600 rounded-lg px-2 py-1 outline-none"
                  style={{
                    background: "var(--color-bg-elevated)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-xs font-display font-600 tracking-wider uppercase hover:opacity-70 transition-opacity"
                    style={{ color: "var(--color-text-subtle)" }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

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
          <aside className="space-y-6">

            {/* Quick stats strip */}
            <div
              className="rounded-2xl p-4 grid grid-cols-3 gap-3"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
              {[
                { label: "Live",     value: liveCount,                                color: "var(--color-live)"        },
                { label: "Upcoming", value: games.filter((g) => g.isUpcoming).length,  color: "var(--color-accent)"      },
                { label: "Final",    value: games.filter((g) => g.isFinished).length,  color: "var(--color-text-muted)"  },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <p className="font-display font-800 text-2xl leading-none" style={{ color }}>{value}</p>
                  <p
                    className="font-display font-600 text-xs tracking-wider uppercase mt-1"
                    style={{ color: "var(--color-text-subtle)" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

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

            {/* What to Watch */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-card) 100%)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} style={{ color: "var(--color-accent)" }} />
                <p
                  className="font-display font-700 text-base tracking-wider uppercase"
                  style={{ color: "var(--color-accent)" }}
                >
                  What To Watch
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Click any game card to see the full breakdown — key matchups, player stats, quarter-by-quarter scores, and team comparisons.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8" style={{ borderColor: "var(--color-border)" }}>
        <div className="h-[2px] w-full mb-8" style={{ background: "linear-gradient(90deg, var(--color-accent), transparent)" }} />
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ color: "var(--color-text-subtle)" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-hero text-xl tracking-widest" style={{ color: "var(--color-text)" }}>COURT</span>
            <span className="font-hero text-xl tracking-widest" style={{ color: "var(--color-accent)" }}>SIDE</span>
          </div>
          <span className="text-xs">Data via BallDontLie API · Built with Next.js</span>
          <span className="text-xs font-display font-700 tracking-widest uppercase">NBA Fan Hub</span>
        </div>
      </footer>
    </div>
  );
}
