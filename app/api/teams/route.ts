import { NextResponse } from "next/server";
import { fetchAllTeams } from "@/lib/nba-api";

export const revalidate = 86400; // 24 hours - teams rarely change

export async function GET() {
  try {
    const teams = await fetchAllTeams();
    return NextResponse.json({ teams, source: "api" });
  } catch (err) {
    console.error("Teams API error:", err);
    return NextResponse.json(
      { teams: [], source: "error", error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
