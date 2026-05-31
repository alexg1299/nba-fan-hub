import { NextRequest, NextResponse } from "next/server";
import { searchPlayers } from "@/lib/nba-api";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) {
    return NextResponse.json({ players: [] });
  }
  try {
    const players = await searchPlayers(q);
    return NextResponse.json({ players });
  } catch (err) {
    console.error("Players search error:", err);
    return NextResponse.json({ players: [], error: "Search failed" }, { status: 500 });
  }
}
