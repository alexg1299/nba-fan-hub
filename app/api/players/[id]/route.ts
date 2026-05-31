import { NextRequest, NextResponse } from "next/server";
import { fetchPlayerById, fetchSeasonAverages } from "@/lib/nba-api";
import { getMockPlayerById, getMockAveragesForPlayer } from "@/lib/mock-data";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const season = Number(req.nextUrl.searchParams.get("season") || new Date().getFullYear() - 1);

  try {
    const player = await fetchPlayerById(id);
    let averages = null;
    try {
      const avgs = await fetchSeasonAverages([id], season);
      averages = avgs[0] || null;
    } catch {
      // season averages may not exist for all players
    }
    return NextResponse.json({ player, averages, source: "api" });
  } catch (err) {
    console.error("Player detail API error:", err);
    const player = getMockPlayerById(id);
    const averages = player ? getMockAveragesForPlayer(id) ?? null : null;
    if (player) {
      return NextResponse.json(
        { player, averages, source: "mock", note: "Using demo data — API unavailable or rate limited" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { player: null, averages: null, source: "error", error: "Player not found" },
      { status: 404 }
    );
  }
}
