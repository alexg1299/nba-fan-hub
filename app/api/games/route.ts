import { NextResponse } from "next/server";
import { fetchRecentGames, fetchAllSeasonGames, normalizeGameStatus } from "@/lib/nba-api";
import { MOCK_GAMES } from "@/lib/mock-data";
import type { NormalizedGame } from "@/types/nba";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const season = searchParams.get("season") ? Number(searchParams.get("season")) : undefined;
  const fetchAll = searchParams.get("all") === "true";
  try {
    const raw = fetchAll
      ? await fetchAllSeasonGames(season)
      : await fetchRecentGames(15, season);

    const normalized: NormalizedGame[] = raw.map((game) => {
      const { isFinished, isLive, isUpcoming } = normalizeGameStatus(game);

      return {
        id: game.id,
        date: game.date,
        status: game.status,
        homeTeam: {
          id: game.home_team.id,
          name: game.home_team.name,
          fullName: game.home_team.full_name,
          abbreviation: game.home_team.abbreviation,
          score: game.home_team_score,
          conference: game.home_team.conference,
        },
        awayTeam: {
          id: game.visitor_team.id,
          name: game.visitor_team.name,
          fullName: game.visitor_team.full_name,
          abbreviation: game.visitor_team.abbreviation,
          score: game.visitor_team_score,
          conference: game.visitor_team.conference,
        },
        isLive,
        isFinished,
        isUpcoming,
        period: game.period,
        time: game.time,
        season: game.season,
        postseason: game.postseason,
      };
    });

    // Sort: Live first, then today's upcoming, then recent finished, then future
    const sorted = normalized.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json({ games: sorted, source: "api" });
  } catch (err) {
    console.error("Games API error:", err);

    // Graceful fallback to mock data
    return NextResponse.json(
      { games: MOCK_GAMES, source: "mock", note: "Using demo data — API unavailable or rate limited" },
      { status: 200 }
    );
  }
}
