import { NextRequest, NextResponse } from "next/server";
import { fetchTeamById, fetchPlayersByTeam } from "@/lib/nba-api";
import { getMockTeamById, getMockPlayersByTeam } from "@/lib/mock-data";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const season = Number(req.nextUrl.searchParams.get("season") || new Date().getFullYear() - 1);

  try {
    const [team, players] = await Promise.all([
      fetchTeamById(id),
      fetchPlayersByTeam(id, season),
    ]);
    return NextResponse.json({ team, players, source: "api" });
  } catch (err) {
    console.error("Team detail API error:", err);
    const team = getMockTeamById(id);
    const players = getMockPlayersByTeam(id);
    if (team) {
      return NextResponse.json(
        { team, players, source: "mock", note: "Using demo data — API unavailable or rate limited" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { team: null, players: [], source: "error", error: "Team not found" },
      { status: 404 }
    );
  }
}
  