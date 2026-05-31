import { NextResponse } from "next/server";
import { MOCK_STANDINGS } from "@/lib/mock-data";

export const revalidate = 3600; // 1 hour

// NOTE: The free tier of BallDontLie does not include a dedicated standings endpoint.
// We use mock standings data that reflects the 2024 season.
// With an API key or upgraded plan, this could call a standings/season endpoint.
export async function GET() {
  return NextResponse.json({
    standings: MOCK_STANDINGS,
    source: "mock",
    note: "Standings use representative 2024 season data.",
    season: 2024,
  });
}
