import axios from "axios";
import type { Game, Player, Team, PlayerStats, SeasonAverages } from "@/types/nba";

const BASE_URL = "https://api.balldontlie.io/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: process.env.BALLDONTLIE_API_KEY || "",
  },
  timeout: 10000,
});

// ─── Games ───────────────────────────────────────────────────────────────────

export async function fetchRecentGames(count = 10): Promise<Game[]> {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 3);

  const params: Record<string, string | number> = {
    "per_page": count,
    "start_date": startDate.toISOString().split("T")[0],
    "end_date": endDate.toISOString().split("T")[0],
    "seasons[]": new Date().getMonth() < 9 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
  };

  const res = await api.get("/games", { params });
  return res.data.data as Game[];
}

export async function fetchGameById(id: number): Promise<Game> {
  const res = await api.get(`/games/${id}`);
  return res.data as Game;
}

export async function fetchGamesByTeam(teamId: number, season: number): Promise<Game[]> {
  const res = await api.get("/games", {
    params: { "team_ids[]": teamId, "seasons[]": season, per_page: 20 },
  });
  return res.data.data as Game[];
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function fetchAllTeams(): Promise<Team[]> {
  const res = await api.get("/teams", { params: { per_page: 30 } });
  return res.data.data as Team[];
}

export async function fetchTeamById(id: number): Promise<Team> {
  const res = await api.get(`/teams/${id}`);
  return res.data as Team;
}

// ─── Players ─────────────────────────────────────────────────────────────────

export async function searchPlayers(query: string): Promise<Player[]> {
  const res = await api.get("/players", {
    params: { search: query, per_page: 5 },
  });
  return res.data.data as Player[];
}

export async function fetchPlayersByTeam(teamId: number): Promise<Player[]> {
  const res = await api.get("/players", {
    params: { team_ids: [teamId], per_page: 25, seasons: [getCurrentSeason()] },
  });
  return res.data.data as Player[];
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function fetchGameStats(gameId: number): Promise<PlayerStats[]> {
  const res = await api.get("/stats", {
    params: { game_ids: [gameId], per_page: 30 },
  });
  return res.data.data as PlayerStats[];
}

export async function fetchSeasonAverages(playerIds: number[], season?: number): Promise<SeasonAverages[]> {
  const s = season || getCurrentSeason();
  const res = await api.get("/season_averages", {
    params: { season: s, player_ids: playerIds },
  });
  return res.data.data as SeasonAverages[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getCurrentSeason(): number {
  const now = new Date();
  return now.getMonth() < 9 ? now.getFullYear() - 1 : now.getFullYear();
}

export function normalizeGameStatus(game: Game) {
  const statusRaw = game.status?.toLowerCase() || "";
  const isFinished =
    statusRaw === "final" ||
    statusRaw.includes("final") ||
    (game.period > 0 && !statusRaw.includes("pm") && !statusRaw.includes("am") && !statusRaw.includes(":"));
  const isLive =
    statusRaw.includes("qtr") ||
    statusRaw.includes("half") ||
    statusRaw.includes("ot") ||
    (game.period > 0 && !isFinished && !statusRaw.includes("pm") && !statusRaw.includes("am"));
  const isUpcoming = !isFinished && !isLive;

  return { isFinished, isLive, isUpcoming };
}

export function getTeamLogoUrl(abbreviation: string): string {
  return `https://cdn.nba.com/logos/nba/${abbreviation}/global/L/logo.svg`;
}

export function getTeamColors(abbreviation: string): { primary: string; secondary: string } {
  const colors: Record<string, { primary: string; secondary: string }> = {
    ATL: { primary: "#E03A3E", secondary: "#C1D32F" },
    BOS: { primary: "#007A33", secondary: "#BA9653" },
    BKN: { primary: "#000000", secondary: "#FFFFFF" },
    CHA: { primary: "#1D1160", secondary: "#00788C" },
    CHI: { primary: "#CE1141", secondary: "#000000" },
    CLE: { primary: "#860038", secondary: "#FDBB30" },
    DAL: { primary: "#00538C", secondary: "#002B5E" },
    DEN: { primary: "#0E2240", secondary: "#FEC524" },
    DET: { primary: "#C8102E", secondary: "#006BB6" },
    GSW: { primary: "#1D428A", secondary: "#FFC72C" },
    HOU: { primary: "#CE1141", secondary: "#000000" },
    IND: { primary: "#002D62", secondary: "#FDBB30" },
    LAC: { primary: "#C8102E", secondary: "#1D428A" },
    LAL: { primary: "#552583", secondary: "#FDB927" },
    MEM: { primary: "#5D76A9", secondary: "#12173F" },
    MIA: { primary: "#98002E", secondary: "#F9A01B" },
    MIL: { primary: "#00471B", secondary: "#EEE1C6" },
    MIN: { primary: "#0C2340", secondary: "#236192" },
    NOP: { primary: "#0C2340", secondary: "#C8102E" },
    NYK: { primary: "#006BB6", secondary: "#F58426" },
    OKC: { primary: "#007AC1", secondary: "#EF3B24" },
    ORL: { primary: "#0077C0", secondary: "#C4CED4" },
    PHI: { primary: "#006BB6", secondary: "#ED174C" },
    PHX: { primary: "#1D1160", secondary: "#E56020" },
    POR: { primary: "#E03A3E", secondary: "#000000" },
    SAC: { primary: "#5A2D81", secondary: "#63727A" },
    SAS: { primary: "#C4CED4", secondary: "#000000" },
    TOR: { primary: "#CE1141", secondary: "#000000" },
    UTA: { primary: "#002B5C", secondary: "#00471B" },
    WAS: { primary: "#002B5C", secondary: "#E31837" },
  };
  return colors[abbreviation] || { primary: "#FF8C00", secondary: "#1A1A2E" };
}
