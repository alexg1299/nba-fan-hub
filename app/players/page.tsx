"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, User, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/Skeleton";
import { useSeason, seasonLabel } from "@/app/context/season-context";
import { getTeamColors } from "@/lib/nba-api";

interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height?: string;
  weight?: string;
  jersey_number?: string;
  college?: string;
  country?: string;
  team?: { id?: number; full_name: string; abbreviation: string };
}

export default function PlayersPage() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  // cursor-based (API) or page-based (mock) pagination
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [cursorStack, setCursorStack] = useState<(number | null)[]>([null]); // history of cursors for prev
  const [useCursor, setUseCursor] = useState(false); // true when API responded with cursors

  const { season } = useSeason();

  const fetchPlayers = useCallback(
    async (q: string, cursorOrPage: number | null, direction: "first" | "next" | "prev" = "first") => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q);

        let targetPage = 1;
        if (!useCursor || direction === "first") {
          // page-based (mock fallback or first load)
          targetPage =
            direction === "next" ? page + 1 : direction === "prev" ? Math.max(1, page - 1) : 1;
          params.set("page", String(targetPage));
        } else if (cursorOrPage !== null) {
          params.set("cursor", String(cursorOrPage));
        } else {
          params.set("page", "1");
        }

        const res = await fetch(`/api/players?${params}`);
        const data = await res.json();

        const incoming: Player[] = data.players || [];
        setPlayers(incoming);
        setHasMore(!!data.hasMore);

        if (data.nextCursor !== undefined) {
          // API / cursor mode
          setUseCursor(true);
          setNextCursor(data.nextCursor ?? null);
          if (direction === "first") {
            setCursorStack([null]);
          } else if (direction === "next") {
            setCursorStack((prev) => [...prev, cursorOrPage]);
          } else if (direction === "prev") {
            setCursorStack((prev) => prev.slice(0, -1));
          }
        } else {
          // mock / page mode
          setUseCursor(false);
          setPage(targetPage);
        }
      } finally {
        setLoading(false);
      }
    },
    [page, useCursor],
  );

  // Initial load
  useEffect(() => {
    fetchPlayers("", null, "first");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season]);

  function handleSearch() {
    setPage(1);
    setCursorStack([null]);
    setUseCursor(false);
    fetchPlayers(query, null, "first");
  }

  function handleNext() {
    if (useCursor) {
      fetchPlayers(query, nextCursor, "next");
    } else {
      fetchPlayers(query, null, "next");
    }
  }

  function handlePrev() {
    if (useCursor) {
      const prevCursor = cursorStack[cursorStack.length - 2] ?? null;
      fetchPlayers(query, prevCursor, "prev");
    } else {
      fetchPlayers(query, null, "prev");
    }
  }

  const currentPage = useCursor ? cursorStack.length : page;
  const canGoPrev = currentPage > 1;

  return (
    <div className="min-h-screen court-pattern" style={{ background: "var(--color-bg)" }}>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 page-enter">
        <div className="mb-8">
          <p className="text-xs font-display font-600 tracking-widest uppercase mb-1" style={{ color: "var(--color-accent)" }}>
            Database · {seasonLabel(season)}
          </p>
          <h1 className="font-display font-800 text-5xl tracking-tight mb-2" style={{ color: "var(--color-text)" }}>
            Players
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Search by name, team, position, college, country, or jersey number.
          </p>
        </div>

        {/* Search input */}
        <div className="flex gap-3 mb-6">
          <div
            className="flex-1 flex items-center gap-3 rounded-xl px-4"
            style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
          >
            <Search size={16} style={{ color: "var(--color-text-subtle)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Name, team, position, college, country..."
              className="flex-1 py-3 bg-transparent text-sm outline-none"
              style={{ color: "var(--color-text)" }}
            />
            {query && (
              <button
                onClick={() => { setQuery(""); fetchPlayers("", null, "first"); }}
                className="text-xs px-2 py-0.5 rounded opacity-60 hover:opacity-100"
                style={{ color: "var(--color-text-muted)" }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary px-5 py-3 rounded-xl text-sm disabled:opacity-50"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {/* Skeletons */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-16 rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && players.length === 0 && (
          <div className="text-center py-12">
            <User size={40} className="mx-auto mb-3" style={{ color: "var(--color-text-subtle)" }} />
            <p className="font-display font-600 text-lg" style={{ color: "var(--color-text-muted)" }}>
              No players found
            </p>
            {query && (
              <p className="text-sm mt-1" style={{ color: "var(--color-text-subtle)" }}>
                Try a different name, team, or position
              </p>
            )}
          </div>
        )}

        {/* Results */}
        {!loading && players.length > 0 && (
          <>
            <div className="space-y-2 mb-6">
              {players.map((player) => {
                const abbr = player.team?.abbreviation ?? "";
                const colors = getTeamColors(abbr);
                return (
                  <Link
                    key={player.id}
                    href={`/players/${player.id}?season=${season}`}
                    className="group flex items-center justify-between rounded-xl p-4 transition-all hover:scale-[1.005]"
                    style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-display font-800 text-sm text-white shrink-0"
                        style={{ background: abbr ? colors.primary : "var(--color-accent)" }}
                      >
                        {player.first_name[0]}{player.last_name[0]}
                      </div>
                      <div>
                        <p className="font-display font-700 text-base" style={{ color: "var(--color-text)" }}>
                          {player.first_name} {player.last_name}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          {player.position && (
                            <span className="text-xs font-display font-600" style={{ color: "var(--color-text-muted)" }}>
                              {player.position}
                            </span>
                          )}
                          {player.position && player.team && (
                            <span style={{ color: "var(--color-text-subtle)" }}>·</span>
                          )}
                          <span className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
                            {player.team?.full_name || "Free Agent"}
                          </span>
                          {player.jersey_number && (
                            <>
                              <span style={{ color: "var(--color-text-subtle)" }}>·</span>
                              <span className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
                                #{player.jersey_number}
                              </span>
                            </>
                          )}
                          {player.country && (
                            <>
                              <span style={{ color: "var(--color-text-subtle)" }}>·</span>
                              <span className="text-xs" style={{ color: "var(--color-text-subtle)" }}>
                                {player.country}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className="font-display font-700 text-xs tracking-wider uppercase px-3 py-1 rounded-full shrink-0 ml-2"
                      style={{
                        background: abbr ? `${colors.primary}22` : "var(--color-bg-elevated)",
                        color: abbr ? colors.primary : "var(--color-text-muted)",
                        border: `1px solid ${abbr ? colors.primary + "44" : "var(--color-border)"}`,
                      }}
                    >
                      {abbr || "FA"}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {(canGoPrev || hasMore) && (
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  disabled={!canGoPrev || loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-display font-600 transition-opacity disabled:opacity-30"
                  style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
                >
                  <ChevronLeft size={14} />
                  Previous
                </button>

                <span className="text-xs font-display font-600 tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                  Page {currentPage}
                </span>

                <button
                  onClick={handleNext}
                  disabled={!hasMore || loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-display font-600 transition-opacity disabled:opacity-30"
                  style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
