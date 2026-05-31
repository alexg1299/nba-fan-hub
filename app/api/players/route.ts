import { NextRequest, NextResponse } from "next/server";
import { searchPlayers } from "@/lib/nba-api";
import { searchMockPlayers } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const cursor = req.nextUrl.searchParams.get("cursor")
    ? Number(req.nextUrl.searchParams.get("cursor"))
    : undefined;
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const perPage = 25;

  try {
    const result = await searchPlayers(q, cursor, perPage);
    return NextResponse.json({
      players: result.players,
      nextCursor: result.nextCursor,
      hasMore: result.nextCursor !== null,
      source: "api",
    });
  } catch (err) {
    console.error("Players search error:", err);
    const result = searchMockPlayers(q, page, perPage);
    return NextResponse.json({
      players: result.players,
      total: result.total,
      hasMore: result.hasMore,
      page,
      source: "mock",
      note: "Using demo data — API unavailable or rate limited",
    });
  }
}
