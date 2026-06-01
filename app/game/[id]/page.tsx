"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Zap, Trophy, Users, BarChart3, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import BackButton from "@/components/layout/BackButton";
import PlayerCard from "@/components/player/PlayerCard";
import StatBar from "@/components/game/StatBar";
import { Skeleton } from "@/components/ui/Skeleton";
import TeamLogo from "@/components/team/TeamLogo";
import Tabs from "@/components/ui/Tabs";
import { getTeamColors } from "@/lib/nba-api";
import clsx from "clsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GameDetail = any;

const TABS = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "players", label: "Players", icon: Users },
  { key: "stats", label: "Team Stats", icon: Trophy },
];


export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [game, setGame] = useState<GameDetail>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dataSource, setDataSource] = useState<"api" | "mock">("api");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/game/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setGame(data.game);
        setDataSource(data.source);
      })
      .catch(() => setError("Failed to load game details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="w-24 h-8" />
          <Skeleton className="w-full h-48 rounded-2xl" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </main>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h2 className="font-display font-700 text-2xl mb-2" style={{ color: "var(--color-text)" }}>
            Game not found
          </h2>
          <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
            {error || "This game doesn't exist or data is unavailable."}
          </p>
          <button
            onClick={() => router.back()}
            className="btn-primary px-6 py-2 rounded-lg text-sm"
          >
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const homeColors = getTeamColors(game.homeTeam.abbreviation);
  const awayColors = getTeamColors(game.awayTeam.abbreviation);
  const homeWon = game.isFinished && game.homeTeam.score > game.awayTeam.score;
  const awayWon = game.isFinished && game.awayTeam.score > game.homeTeam.score;

  const gameDate = new Date((game.date ?? game.gameDate ?? "").slice(0, 10) + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen court-pattern" style={{ background: "var(--color-bg)" }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Back button */}
        <BackButton label="Back to Home" />

        {dataSource === "mock" && (
          <div
            className="rounded-xl p-3 mb-5 flex items-center gap-2 text-xs"
            style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-text-subtle)" }}
          >
            <AlertCircle size={12} />
            Showing demo game data — live API data unavailable for this game.
          </div>
        )}

        {/* Scoreboard hero */}
        <div
          className="rounded-3xl overflow-hidden mb-6"
          style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
        >
          {/* Status bar */}
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-elevated)" }}
          >
            <p className="text-xs font-body" style={{ color: "var(--color-text-subtle)" }}>
              {gameDate} · {game.postseason ? "Playoffs" : `${game.season}-${String(game.season + 1).slice(2)} Season`}
            </p>
            <div className="flex items-center gap-2">
              {game.isLive && (
                <span className="live-badge flex items-center gap-1">
                  <Zap size={9} />
                  Q{game.period} {game.time}
                </span>
              )}
              {game.isFinished && (
                <span
                  className="text-xs font-display font-700 tracking-widest uppercase px-3 py-1 rounded-full"
                  style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-subtle)", border: "1px solid var(--color-border)" }}
                >
                  Final
                </span>
              )}
              {game.isUpcoming && (
                <span
                  className="text-xs font-display font-700 tracking-wide uppercase"
                  style={{ color: "var(--color-accent)" }}
                >
                  {game.time || "Upcoming"}
                </span>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="p-6 sm:p-8">
            {/* Dual color strip */}
            <div
              className="h-1 w-full rounded-full mb-6 mx-auto max-w-xs"
              style={{ background: `linear-gradient(90deg, ${awayColors.primary} 0%, ${awayColors.primary} 50%, ${homeColors.primary} 50%, ${homeColors.primary} 100%)` }}
            />
            <div className="flex items-center justify-between">
              {/* Away team */}
              <div className="flex flex-col items-center gap-3 flex-1">
                <TeamLogo abbreviation={game.awayTeam.abbreviation} size={80} variant="box" />
                <div className="text-center">
                  <p
                    className="font-display font-800 text-base sm:text-lg tracking-widest uppercase"
                    style={{ color: "var(--color-text)" }}
                  >
                    {game.awayTeam.city || game.awayTeam.name}
                  </p>
                  <p className="text-xs font-display font-600 tracking-widest uppercase" style={{ color: "var(--color-text-subtle)" }}>Away</p>
                </div>
                <p
                  className={clsx("score-display text-6xl sm:text-7xl", game.isFinished && !awayWon && "opacity-30")}
                  style={{ color: awayWon ? awayColors.primary : "var(--color-text)" }}
                >
                  {game.awayTeam.score || (game.isUpcoming ? "—" : 0)}
                </p>
                {awayWon && (
                  <div className="flex items-center gap-1 text-xs font-display font-700 tracking-widest uppercase" style={{ color: "var(--color-live)" }}>
                    <Trophy size={12} />
                    Winner
                  </div>
                )}
              </div>

              {/* VS divider */}
              <div className="flex flex-col items-center gap-2 px-4">
                <span
                  className="font-display font-800 text-2xl tracking-widest"
                  style={{ color: "var(--color-border)" }}
                >
                  VS
                </span>
                <div
                  className="w-8 h-px"
                  style={{ background: "var(--color-border)" }}
                />
                <span
                  className="font-body text-xs"
                  style={{ color: "var(--color-text-subtle)" }}
                >
                  @
                </span>
              </div>

              {/* Home team */}
              <div className="flex flex-col items-center gap-3 flex-1">
                <TeamLogo abbreviation={game.homeTeam.abbreviation} size={80} variant="box" />
                <div className="text-center">
                  <p
                    className="font-display font-800 text-base sm:text-lg tracking-widest uppercase"
                    style={{ color: "var(--color-text)" }}
                  >
                    {game.homeTeam.city || game.homeTeam.name}
                  </p>
                  <p className="text-xs font-display font-600 tracking-widest uppercase" style={{ color: "var(--color-text-subtle)" }}>Home</p>
                </div>
                <p
                  className={clsx("score-display text-6xl sm:text-7xl", game.isFinished && !homeWon && "opacity-30")}
                  style={{ color: homeWon ? homeColors.primary : "var(--color-text)" }}
                >
                  {game.homeTeam.score || (game.isUpcoming ? "—" : 0)}
                </p>
                {homeWon && (
                  <div className="flex items-center gap-1 text-xs font-display font-700 tracking-widest uppercase" style={{ color: "var(--color-live)" }}>
                    <Trophy size={12} />
                    Winner
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={TABS}
          active={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {/* Tab content */}
        <div className="animate-fade-in">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Matchups */}
              {game.keyMatchups?.length > 0 && (
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                >
                  <h3
                    className="font-display font-700 text-lg tracking-wider uppercase mb-4"
                    style={{ color: "var(--color-text)" }}
                  >
                    Key Matchups
                  </h3>
                  <div className="space-y-4">
                    {game.keyMatchups.map((matchup: GameDetail, i: number) => (
                      <div
                        key={i}
                        className="rounded-xl p-4"
                        style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}
                      >
                        <p
                          className="font-display font-700 text-base mb-1"
                          style={{ color: "var(--color-accent)" }}
                        >
                          {matchup.title}
                        </p>
                        <p
                          className="text-sm mb-3"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {matchup.description}
                        </p>
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-left flex-1">
                            <p className="font-display font-700 text-sm" style={{ color: "var(--color-text)" }}>{matchup.awayPlayer}</p>
                            <p className="font-display text-xl font-800" style={{ color: awayColors.primary }}>{matchup.awayStat}</p>
                          </div>
                          <div
                            className="font-display font-800 text-xs tracking-widest"
                            style={{ color: "var(--color-text-subtle)" }}
                          >
                            VS
                          </div>
                          <div className="text-right flex-1">
                            <p className="font-display font-700 text-sm" style={{ color: "var(--color-text)" }}>{matchup.homePlayer}</p>
                            <p className="font-display text-xl font-800" style={{ color: homeColors.primary }}>{matchup.homeStat}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quarter scores */}
              {game.quarters?.length > 0 && (
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                >
                  <h3
                    className="font-display font-700 text-lg tracking-wider uppercase mb-4"
                    style={{ color: "var(--color-text)" }}
                  >
                    Quarter Breakdown
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                          <th className="text-left pb-2 font-display font-600 tracking-wide" style={{ color: "var(--color-text-subtle)" }}>Team</th>
                          {game.quarters.map((q: GameDetail) => (
                            <th key={q.label} className="text-center pb-2 font-display font-600 tracking-wide" style={{ color: "var(--color-text-subtle)" }}>{q.label}</th>
                          ))}
                          <th className="text-center pb-2 font-display font-700 tracking-wide" style={{ color: "var(--color-accent)" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                          <td className="py-3 font-display font-700 tracking-wide" style={{ color: "var(--color-text)" }}>{game.awayTeam.abbreviation}</td>
                          {game.quarters.map((q: GameDetail, i: number) => (
                            <td key={i} className="text-center py-3 font-display font-600" style={{ color: "var(--color-text-muted)" }}>{q.away}</td>
                          ))}
                          <td className="text-center py-3 font-display font-800 text-lg" style={{ color: awayWon ? "var(--color-text)" : "var(--color-text-muted)" }}>{game.awayTeam.score}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-display font-700 tracking-wide" style={{ color: "var(--color-text)" }}>{game.homeTeam.abbreviation}</td>
                          {game.quarters.map((q: GameDetail, i: number) => (
                            <td key={i} className="text-center py-3 font-display font-600" style={{ color: "var(--color-text-muted)" }}>{q.home}</td>
                          ))}
                          <td className="text-center py-3 font-display font-800 text-lg" style={{ color: homeWon ? "var(--color-text)" : "var(--color-text-muted)" }}>{game.homeTeam.score}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Players tab */}
          {activeTab === "players" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Away team */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded" style={{ background: awayColors.primary }} />
                  <h3 className="font-display font-700 text-base tracking-wider uppercase" style={{ color: "var(--color-text)" }}>
                    {game.awayTeam.fullName}
                  </h3>
                </div>
                <div className="space-y-3">
                  {(game.awayTeam.topPlayers || []).map((p: GameDetail, i: number) => (
                    <PlayerCard
                      key={i}
                      name={p.name}
                      position={p.position}
                      pts={p.pts}
                      reb={p.reb}
                      ast={p.ast}
                      fg_pct={p.fg_pct}
                      teamAbbr={game.awayTeam.abbreviation}
                      teamColor={awayColors.primary}
                      isHighlighted={i === 0}
                    />
                  ))}
                  {(!game.awayTeam.topPlayers || game.awayTeam.topPlayers.length === 0) && (
                    <p className="text-sm" style={{ color: "var(--color-text-subtle)" }}>
                      Player stats unavailable for upcoming games.
                    </p>
                  )}
                </div>
              </div>

              {/* Home team */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded" style={{ background: homeColors.primary }} />
                  <h3 className="font-display font-700 text-base tracking-wider uppercase" style={{ color: "var(--color-text)" }}>
                    {game.homeTeam.fullName}
                  </h3>
                </div>
                <div className="space-y-3">
                  {(game.homeTeam.topPlayers || []).map((p: GameDetail, i: number) => (
                    <PlayerCard
                      key={i}
                      name={p.name}
                      position={p.position}
                      pts={p.pts}
                      reb={p.reb}
                      ast={p.ast}
                      fg_pct={p.fg_pct}
                      teamAbbr={game.homeTeam.abbreviation}
                      teamColor={homeColors.primary}
                      isHighlighted={i === 0}
                    />
                  ))}
                  {(!game.homeTeam.topPlayers || game.homeTeam.topPlayers.length === 0) && (
                    <p className="text-sm" style={{ color: "var(--color-text-subtle)" }}>
                      Player stats unavailable for upcoming games.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Team Stats tab */}
          {activeTab === "stats" && game.homeTeam.teamStats && (
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className="flex items-center gap-2 font-display font-700 tracking-wide"
                  style={{ color: awayColors.primary }}
                >
                  <div className="w-6 h-6 rounded text-white text-xs flex items-center justify-center font-800" style={{ background: awayColors.primary }}>{game.awayTeam.abbreviation}</div>
                  {game.awayTeam.name}
                </div>
                <span className="text-xs font-display font-600 tracking-widest uppercase" style={{ color: "var(--color-text-subtle)" }}>
                  vs
                </span>
                <div
                  className="flex items-center gap-2 font-display font-700 tracking-wide"
                  style={{ color: homeColors.primary }}
                >
                  {game.homeTeam.name}
                  <div className="w-6 h-6 rounded text-white text-xs flex items-center justify-center font-800" style={{ background: homeColors.primary }}>{game.homeTeam.abbreviation}</div>
                </div>
              </div>

              <div className="space-y-5">
                <StatBar label="FG%" homeValue={game.homeTeam.teamStats.fgPct} awayValue={game.awayTeam.teamStats?.fgPct || 0} homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} isPercentage />
                <StatBar label="3PT%" homeValue={game.homeTeam.teamStats.fg3Pct} awayValue={game.awayTeam.teamStats?.fg3Pct || 0} homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} isPercentage />
                <StatBar label="FT%" homeValue={game.homeTeam.teamStats.ftPct} awayValue={game.awayTeam.teamStats?.ftPct || 0} homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} isPercentage />
                <StatBar label="Rebounds" homeValue={game.homeTeam.teamStats.reb} awayValue={game.awayTeam.teamStats?.reb || 0} homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} />
                <StatBar label="Assists" homeValue={game.homeTeam.teamStats.ast} awayValue={game.awayTeam.teamStats?.ast || 0} homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} />
                <StatBar label="Steals" homeValue={game.homeTeam.teamStats.stl} awayValue={game.awayTeam.teamStats?.stl || 0} homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} />
                <StatBar label="Blocks" homeValue={game.homeTeam.teamStats.blk} awayValue={game.awayTeam.teamStats?.blk || 0} homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} />
                <StatBar label="Turnovers" homeValue={game.homeTeam.teamStats.to} awayValue={game.awayTeam.teamStats?.to || 0} homeAbbr={game.homeTeam.abbreviation} awayAbbr={game.awayTeam.abbreviation} higherIsBetter={false} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
