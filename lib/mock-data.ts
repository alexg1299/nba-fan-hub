import type { NormalizedGame, StandingsEntry } from "@/types/nba";

export const MOCK_GAMES: NormalizedGame[] = [
  {
    id: 1001,
    date: new Date(Date.now() - 86400000).toISOString(),
    status: "Final",
    homeTeam: { id: 14, name: "Lakers", fullName: "Los Angeles Lakers", abbreviation: "LAL", score: 112, conference: "West" },
    awayTeam: { id: 2, name: "Celtics", fullName: "Boston Celtics", abbreviation: "BOS", score: 108, conference: "East" },
    isLive: false, isFinished: true, isUpcoming: false, period: 4, time: null, season: 2024, postseason: false,
  },
  {
    id: 1002,
    date: new Date(Date.now() - 86400000).toISOString(),
    status: "Final",
    homeTeam: { id: 11, name: "Warriors", fullName: "Golden State Warriors", abbreviation: "GSW", score: 124, conference: "West" },
    awayTeam: { id: 20, name: "Knicks", fullName: "New York Knicks", abbreviation: "NYK", score: 119, conference: "East" },
    isLive: false, isFinished: true, isUpcoming: false, period: 4, time: null, season: 2024, postseason: false,
  },
  {
    id: 1003,
    date: new Date().toISOString(),
    status: "7:30 pm ET",
    homeTeam: { id: 5, name: "Bulls", fullName: "Chicago Bulls", abbreviation: "CHI", score: 0, conference: "East" },
    awayTeam: { id: 8, name: "Mavericks", fullName: "Dallas Mavericks", abbreviation: "DAL", score: 0, conference: "West" },
    isLive: false, isFinished: false, isUpcoming: true, period: 0, time: "7:30 pm ET", season: 2024, postseason: false,
  },
  {
    id: 1004,
    date: new Date().toISOString(),
    status: "Q3 8:42",
    homeTeam: { id: 15, name: "Clippers", fullName: "Los Angeles Clippers", abbreviation: "LAC", score: 87, conference: "West" },
    awayTeam: { id: 22, name: "Thunder", fullName: "Oklahoma City Thunder", abbreviation: "OKC", score: 91, conference: "West" },
    isLive: true, isFinished: false, isUpcoming: false, period: 3, time: "8:42", season: 2024, postseason: false,
  },
  {
    id: 1005,
    date: new Date(Date.now() + 86400000).toISOString(),
    status: "8:00 pm ET",
    homeTeam: { id: 19, name: "Heat", fullName: "Miami Heat", abbreviation: "MIA", score: 0, conference: "East" },
    awayTeam: { id: 9, name: "Nuggets", fullName: "Denver Nuggets", abbreviation: "DEN", score: 0, conference: "West" },
    isLive: false, isFinished: false, isUpcoming: true, period: 0, time: "8:00 pm ET", season: 2024, postseason: false,
  },
  {
    id: 1006,
    date: new Date(Date.now() - 172800000).toISOString(),
    status: "Final",
    homeTeam: { id: 25, name: "Spurs", fullName: "San Antonio Spurs", abbreviation: "SAS", score: 98, conference: "West" },
    awayTeam: { id: 30, name: "Wizards", fullName: "Washington Wizards", abbreviation: "WAS", score: 105, conference: "East" },
    isLive: false, isFinished: true, isUpcoming: false, period: 4, time: null, season: 2024, postseason: false,
  },
];

export const MOCK_STANDINGS: { east: StandingsEntry[]; west: StandingsEntry[] } = {
  east: [
    { team: { id: 2, abbreviation: "BOS", city: "Boston", conference: "East", division: "Atlantic", full_name: "Boston Celtics", name: "Celtics" }, wins: 64, losses: 18, winPct: 0.780, conference: "East", rank: 1 },
    { team: { id: 20, abbreviation: "NYK", city: "New York", conference: "East", division: "Atlantic", full_name: "New York Knicks", name: "Knicks" }, wins: 50, losses: 32, winPct: 0.610, conference: "East", rank: 2 },
    { team: { id: 19, abbreviation: "MIA", city: "Miami", conference: "East", division: "Southeast", full_name: "Miami Heat", name: "Heat" }, wins: 46, losses: 36, winPct: 0.561, conference: "East", rank: 3 },
    { team: { id: 5, abbreviation: "CHI", city: "Chicago", conference: "East", division: "Central", full_name: "Chicago Bulls", name: "Bulls" }, wins: 39, losses: 43, winPct: 0.476, conference: "East", rank: 4 },
    { team: { id: 17, abbreviation: "MIL", city: "Milwaukee", conference: "East", division: "Central", full_name: "Milwaukee Bucks", name: "Bucks" }, wins: 49, losses: 33, winPct: 0.598, conference: "East", rank: 5 },
  ],
  west: [
    { team: { id: 22, abbreviation: "OKC", city: "Oklahoma City", conference: "West", division: "Northwest", full_name: "Oklahoma City Thunder", name: "Thunder" }, wins: 57, losses: 25, winPct: 0.695, conference: "West", rank: 1 },
    { team: { id: 9, abbreviation: "DEN", city: "Denver", conference: "West", division: "Northwest", full_name: "Denver Nuggets", name: "Nuggets" }, wins: 57, losses: 25, winPct: 0.695, conference: "West", rank: 2 },
    { team: { id: 14, abbreviation: "LAL", city: "Los Angeles", conference: "West", division: "Pacific", full_name: "Los Angeles Lakers", name: "Lakers" }, wins: 47, losses: 35, winPct: 0.573, conference: "West", rank: 3 },
    { team: { id: 11, abbreviation: "GSW", city: "Golden State", conference: "West", division: "Pacific", full_name: "Golden State Warriors", name: "Warriors" }, wins: 46, losses: 36, winPct: 0.561, conference: "West", rank: 4 },
    { team: { id: 15, abbreviation: "LAC", city: "Los Angeles", conference: "West", division: "Pacific", full_name: "Los Angeles Clippers", name: "Clippers" }, wins: 51, losses: 31, winPct: 0.622, conference: "West", rank: 5 },
  ],
};

export const MOCK_GAME_DETAIL = {
  id: 1001,
  homeTeam: {
    id: 14, name: "Lakers", fullName: "Los Angeles Lakers", abbreviation: "LAL", score: 112, conference: "West",
    topPlayers: [
      { name: "LeBron James", position: "SF", pts: 28, reb: 8, ast: 7, fg_pct: 0.52 },
      { name: "Anthony Davis", position: "C", pts: 24, reb: 14, ast: 3, fg_pct: 0.61 },
      { name: "Austin Reaves", position: "G", pts: 18, reb: 4, ast: 5, fg_pct: 0.48 },
    ],
  },
  awayTeam: {
    id: 2, name: "Celtics", fullName: "Boston Celtics", abbreviation: "BOS", score: 108, conference: "East",
    topPlayers: [
      { name: "Jayson Tatum", position: "SF", pts: 31, reb: 9, ast: 4, fg_pct: 0.49 },
      { name: "Jaylen Brown", position: "SG", pts: 26, reb: 6, ast: 3, fg_pct: 0.44 },
      { name: "Kristaps Porzingis", position: "C", pts: 19, reb: 7, ast: 2, fg_pct: 0.55 },
    ],
  },
  keyMatchups: [
    { title: "Star Power Clash", description: "LeBron James vs Jayson Tatum — the generational matchup", homePlayer: "LeBron James", awayPlayer: "Jayson Tatum", homeStat: "28 PTS / 8 REB", awayStat: "31 PTS / 9 REB" },
    { title: "Paint Presence", description: "Davis controlled the interior, limiting Boston's easy baskets", homePlayer: "Anthony Davis", awayPlayer: "Kristaps Porzingis", homeStat: "24 PTS / 14 REB", awayStat: "19 PTS / 7 REB" },
  ],
  quarters: [
    { label: "Q1", home: 28, away: 24 },
    { label: "Q2", home: 27, away: 30 },
    { label: "Q3", home: 29, away: 26 },
    { label: "Q4", home: 28, away: 28 },
  ],
  teamStats: {
    home: { fgPct: 0.487, fg3Pct: 0.362, ftPct: 0.812, reb: 44, ast: 24, stl: 8, blk: 5, to: 12 },
    away: { fgPct: 0.461, fg3Pct: 0.338, ftPct: 0.778, reb: 41, ast: 22, stl: 7, blk: 3, to: 14 },
  },
};
