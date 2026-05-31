import { NextResponse } from "next/server";
import { MOCK_STANDINGS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

// NOTE: The free tier of BallDontLie does not include a dedicated standings endpoint.
// We use mock standings data as a representative sample.
// With an API key or upgraded plan, this could call a real standings endpoint.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const season = searchParams.get("season") ? Number(searchParams.get("season")) : 2024;
  return NextResponse.json({
    standings: MOCK_STANDINGS,
    source: "mock",
    note: `Standings use representative data for the ${season}-${String(season + 1).slice(-2)} season.`,
    season,
  });
}
