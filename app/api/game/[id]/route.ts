import { NextResponse } from "next/server";
import {
  fetchGameById,
  fetchGameStats,
  fetchSeasonAverages,
  normalizeGameStatus,
  getCurrentSeason,
} from "@/lib/nba-api";
import { MOCK_GAME_DETAIL } from "@/lib/mock-data";

export const revalidate = 30;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  try {
    const [game, stats] = await Promise.all([
      fetchGameById(id),
      fetchGameStats(id),
    ]);

    const { isFinished, isLive, isUpcoming } = normalizeGameStatus(game);

    // Group stats by team
    const homeStats = stats.filter(
      (s) => s.team?.id === game.home_team.id
    );
    const awayStats = stats.filter(
      (s) => s.team?.id === game.visitor_team.id
    );

    const topN = 3;
    const sortedHome = homeStats.sort((a, b) => b.pts - a.pts).slice(0, topN);
    const sortedAway = awayStats.sort((a, b) => b.pts - a.pts).slice(0, topN);

    // Compute team-level aggregates
    const teamAgg = (playerStats: typeof stats) => ({
      pts: playerStats.reduce((s, p) => s + (p.pts || 0), 0),
      reb: playerStats.reduce((s, p) => s + (p.reb || 0), 0),
      ast: playerStats.reduce((s, p) => s + (p.ast || 0), 0),
      stl: playerStats.reduce((s, p) => s + (p.stl || 0), 0),
      blk: playerStats.reduce((s, p) => s + (p.blk || 0), 0),
      to: playerStats.reduce((s, p) => s + (p.turnover || 0), 0),
      fgm: playerStats.reduce((s, p) => s + (p.fgm || 0), 0),
      fga: playerStats.reduce((s, p) => s + (p.fga || 0), 0),
      fg3m: playerStats.reduce((s, p) => s + (p.fg3m || 0), 0),
      fg3a: playerStats.reduce((s, p) => s + (p.fg3a || 0), 0),
      ftm: playerStats.reduce((s, p) => s + (p.ftm || 0), 0),
      fta: playerStats.reduce((s, p) => s + (p.fta || 0), 0),
    });

    const homeAgg = teamAgg(homeStats);
    const awayAgg = teamAgg(awayStats);

    const normalized = {
      id: game.id,
      date: game.date,
      status: game.status,
      isFinished,
      isLive,
      isUpcoming,
      period: game.period,
      time: game.time,
      season: game.season,
      postseason: game.postseason,
      homeTeam: {
        id: game.home_team.id,
        name: game.home_team.name,
        fullName: game.home_team.full_name,
        abbreviation: game.home_team.abbreviation,
        score: game.home_team_score,
        conference: game.home_team.conference,
        topPlayers: sortedHome.map((p) => ({
          name: `${p.player?.first_name} ${p.player?.last_name}`,
          position: p.player?.position || "—",
          pts: p.pts,
          reb: p.reb,
          ast: p.ast,
          fg_pct: p.fg_pct,
          min: p.min,
        })),
        teamStats: {
          fgPct: homeAgg.fga > 0 ? homeAgg.fgm / homeAgg.fga : 0,
          fg3Pct: homeAgg.fg3a > 0 ? homeAgg.fg3m / homeAgg.fg3a : 0,
          ftPct: homeAgg.fta > 0 ? homeAgg.ftm / homeAgg.fta : 0,
          reb: homeAgg.reb,
          ast: homeAgg.ast,
          stl: homeAgg.stl,
          blk: homeAgg.blk,
          to: homeAgg.to,
        },
      },
      awayTeam: {
        id: game.visitor_team.id,
        name: game.visitor_team.name,
        fullName: game.visitor_team.full_name,
        abbreviation: game.visitor_team.abbreviation,
        score: game.visitor_team_score,
        conference: game.visitor_team.conference,
        topPlayers: sortedAway.map((p) => ({
          name: `${p.player?.first_name} ${p.player?.last_name}`,
          position: p.player?.position || "—",
          pts: p.pts,
          reb: p.reb,
          ast: p.ast,
          fg_pct: p.fg_pct,
          min: p.min,
        })),
        teamStats: {
          fgPct: awayAgg.fga > 0 ? awayAgg.fgm / awayAgg.fga : 0,
          fg3Pct: awayAgg.fg3a > 0 ? awayAgg.fg3m / awayAgg.fg3a : 0,
          ftPct: awayAgg.fta > 0 ? awayAgg.ftm / awayAgg.fta : 0,
          reb: awayAgg.reb,
          ast: awayAgg.ast,
          stl: awayAgg.stl,
          blk: awayAgg.blk,
          to: awayAgg.to,
        },
      },
    };

    return NextResponse.json({ game: normalized, source: "api" });
  } catch (err) {
    console.error(`Game ${id} API error:`, err);

    return NextResponse.json(
      {
        game: MOCK_GAME_DETAIL,
        source: "mock",
        note: "Using demo data — API unavailable or rate limited",
      },
      { status: 200 }
    );
  }
}
