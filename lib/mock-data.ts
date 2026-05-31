import type { NormalizedGame, StandingsEntry, Team, Player, SeasonAverages } from "@/types/nba";

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

// ─── Mock Teams ───────────────────────────────────────────────────────────────

export const MOCK_TEAMS: Team[] = [
  { id: 1,  abbreviation: "ATL", city: "Atlanta",       conference: "East", division: "Southeast", full_name: "Atlanta Hawks",          name: "Hawks"    },
  { id: 2,  abbreviation: "BOS", city: "Boston",        conference: "East", division: "Atlantic",   full_name: "Boston Celtics",         name: "Celtics"  },
  { id: 3,  abbreviation: "BKN", city: "Brooklyn",      conference: "East", division: "Atlantic",   full_name: "Brooklyn Nets",          name: "Nets"     },
  { id: 4,  abbreviation: "CHA", city: "Charlotte",     conference: "East", division: "Southeast", full_name: "Charlotte Hornets",      name: "Hornets"  },
  { id: 5,  abbreviation: "CHI", city: "Chicago",       conference: "East", division: "Central",   full_name: "Chicago Bulls",          name: "Bulls"    },
  { id: 6,  abbreviation: "CLE", city: "Cleveland",     conference: "East", division: "Central",   full_name: "Cleveland Cavaliers",    name: "Cavaliers"},
  { id: 7,  abbreviation: "DAL", city: "Dallas",        conference: "West", division: "Southwest",  full_name: "Dallas Mavericks",       name: "Mavericks"},
  { id: 8,  abbreviation: "DEN", city: "Denver",        conference: "West", division: "Northwest",  full_name: "Denver Nuggets",         name: "Nuggets"  },
  { id: 9,  abbreviation: "DET", city: "Detroit",       conference: "East", division: "Central",   full_name: "Detroit Pistons",        name: "Pistons"  },
  { id: 10, abbreviation: "GSW", city: "Golden State",  conference: "West", division: "Pacific",    full_name: "Golden State Warriors",  name: "Warriors" },
  { id: 11, abbreviation: "HOU", city: "Houston",       conference: "West", division: "Southwest",  full_name: "Houston Rockets",        name: "Rockets"  },
  { id: 12, abbreviation: "IND", city: "Indiana",       conference: "East", division: "Central",   full_name: "Indiana Pacers",         name: "Pacers"   },
  { id: 13, abbreviation: "LAC", city: "Los Angeles",   conference: "West", division: "Pacific",    full_name: "Los Angeles Clippers",   name: "Clippers" },
  { id: 14, abbreviation: "LAL", city: "Los Angeles",   conference: "West", division: "Pacific",    full_name: "Los Angeles Lakers",     name: "Lakers"   },
  { id: 15, abbreviation: "MEM", city: "Memphis",       conference: "West", division: "Southwest",  full_name: "Memphis Grizzlies",      name: "Grizzlies"},
  { id: 16, abbreviation: "MIA", city: "Miami",         conference: "East", division: "Southeast", full_name: "Miami Heat",             name: "Heat"     },
  { id: 17, abbreviation: "MIL", city: "Milwaukee",     conference: "East", division: "Central",   full_name: "Milwaukee Bucks",        name: "Bucks"    },
  { id: 18, abbreviation: "MIN", city: "Minnesota",     conference: "West", division: "Northwest",  full_name: "Minnesota Timberwolves", name: "Timberwolves"},
  { id: 19, abbreviation: "NOP", city: "New Orleans",   conference: "West", division: "Southwest",  full_name: "New Orleans Pelicans",   name: "Pelicans" },
  { id: 20, abbreviation: "NYK", city: "New York",      conference: "East", division: "Atlantic",   full_name: "New York Knicks",        name: "Knicks"   },
  { id: 21, abbreviation: "OKC", city: "Oklahoma City", conference: "West", division: "Northwest",  full_name: "Oklahoma City Thunder",  name: "Thunder"  },
  { id: 22, abbreviation: "ORL", city: "Orlando",       conference: "East", division: "Southeast", full_name: "Orlando Magic",          name: "Magic"    },
  { id: 23, abbreviation: "PHI", city: "Philadelphia",  conference: "East", division: "Atlantic",   full_name: "Philadelphia 76ers",     name: "76ers"    },
  { id: 24, abbreviation: "PHX", city: "Phoenix",       conference: "West", division: "Pacific",    full_name: "Phoenix Suns",           name: "Suns"     },
  { id: 25, abbreviation: "POR", city: "Portland",      conference: "West", division: "Northwest",  full_name: "Portland Trail Blazers", name: "Trail Blazers"},
  { id: 26, abbreviation: "SAC", city: "Sacramento",    conference: "West", division: "Pacific",    full_name: "Sacramento Kings",       name: "Kings"    },
  { id: 27, abbreviation: "SAS", city: "San Antonio",   conference: "West", division: "Southwest",  full_name: "San Antonio Spurs",      name: "Spurs"    },
  { id: 28, abbreviation: "TOR", city: "Toronto",       conference: "East", division: "Atlantic",   full_name: "Toronto Raptors",        name: "Raptors"  },
  { id: 29, abbreviation: "UTA", city: "Utah",          conference: "West", division: "Northwest",  full_name: "Utah Jazz",              name: "Jazz"     },
  { id: 30, abbreviation: "WAS", city: "Washington",    conference: "East", division: "Southeast", full_name: "Washington Wizards",     name: "Wizards"  },
];

// ─── Mock Players ─────────────────────────────────────────────────────────────
// Two representative players per team (60 total). IDs are 1000-range to avoid
// collisions with real API IDs when mixing data.

const t = (id: number): Team => MOCK_TEAMS.find((x) => x.id === id)!;

export const MOCK_PLAYERS: Player[] = [
  // ATL
  { id: 1001, first_name: "Trae",      last_name: "Young",      position: "G",   height: "6-1",  weight: "180", jersey_number: "11", college: "Oklahoma",       country: "USA",      draft_year: 2018, draft_round: 1, draft_number: 5,  team: t(1)  },
  { id: 1002, first_name: "Dejounte",  last_name: "Murray",     position: "G",   height: "6-5",  weight: "215", jersey_number: "5",  college: "Washington",     country: "USA",      draft_year: 2016, draft_round: 1, draft_number: 29, team: t(1)  },
  // BOS
  { id: 1003, first_name: "Jayson",    last_name: "Tatum",      position: "F",   height: "6-8",  weight: "210", jersey_number: "0",  college: "Duke",           country: "USA",      draft_year: 2017, draft_round: 1, draft_number: 3,  team: t(2)  },
  { id: 1004, first_name: "Jaylen",    last_name: "Brown",      position: "G-F", height: "6-6",  weight: "223", jersey_number: "7",  college: "California",     country: "USA",      draft_year: 2016, draft_round: 1, draft_number: 3,  team: t(2)  },
  // BKN
  { id: 1005, first_name: "Mikal",     last_name: "Bridges",    position: "F",   height: "6-7",  weight: "209", jersey_number: "1",  college: "Villanova",      country: "USA",      draft_year: 2018, draft_round: 1, draft_number: 10, team: t(3)  },
  { id: 1006, first_name: "Cam",       last_name: "Thomas",     position: "G",   height: "6-4",  weight: "210", jersey_number: "24", college: "LSU",            country: "USA",      draft_year: 2021, draft_round: 1, draft_number: 27, team: t(3)  },
  // CHA
  { id: 1007, first_name: "LaMelo",    last_name: "Ball",       position: "G",   height: "6-7",  weight: "180", jersey_number: "2",  college: undefined,        country: "USA",      draft_year: 2020, draft_round: 1, draft_number: 3,  team: t(4)  },
  { id: 1008, first_name: "Brandon",   last_name: "Miller",     position: "F",   height: "6-9",  weight: "200", jersey_number: "24", college: "Alabama",        country: "USA",      draft_year: 2023, draft_round: 1, draft_number: 2,  team: t(4)  },
  // CHI
  { id: 1009, first_name: "DeMar",     last_name: "DeRozan",    position: "F",   height: "6-6",  weight: "220", jersey_number: "11", college: "USC",            country: "USA",      draft_year: 2009, draft_round: 1, draft_number: 9,  team: t(5)  },
  { id: 1010, first_name: "Zach",      last_name: "LaVine",     position: "G",   height: "6-5",  weight: "200", jersey_number: "8",  college: "UCLA",           country: "USA",      draft_year: 2014, draft_round: 1, draft_number: 13, team: t(5)  },
  // CLE
  { id: 1011, first_name: "Donovan",   last_name: "Mitchell",   position: "G",   height: "6-1",  weight: "215", jersey_number: "45", college: "Louisville",     country: "USA",      draft_year: 2017, draft_round: 1, draft_number: 13, team: t(6)  },
  { id: 1012, first_name: "Evan",      last_name: "Mobley",     position: "C",   height: "7-0",  weight: "215", jersey_number: "4",  college: "USC",            country: "USA",      draft_year: 2021, draft_round: 1, draft_number: 3,  team: t(6)  },
  // DAL
  { id: 1013, first_name: "Luka",      last_name: "Doncic",     position: "G-F", height: "6-7",  weight: "230", jersey_number: "77", college: undefined,        country: "Slovenia", draft_year: 2018, draft_round: 1, draft_number: 3,  team: t(7)  },
  { id: 1014, first_name: "Kyrie",     last_name: "Irving",     position: "G",   height: "6-2",  weight: "193", jersey_number: "11", college: "Duke",           country: "USA",      draft_year: 2011, draft_round: 1, draft_number: 1,  team: t(7)  },
  // DEN
  { id: 1015, first_name: "Nikola",    last_name: "Jokic",      position: "C",   height: "6-11", weight: "284", jersey_number: "15", college: undefined,        country: "Serbia",   draft_year: 2014, draft_round: 2, draft_number: 41, team: t(8)  },
  { id: 1016, first_name: "Jamal",     last_name: "Murray",     position: "G",   height: "6-4",  weight: "215", jersey_number: "27", college: "Kentucky",       country: "Canada",   draft_year: 2016, draft_round: 1, draft_number: 7,  team: t(8)  },
  // DET
  { id: 1017, first_name: "Cade",      last_name: "Cunningham", position: "G",   height: "6-6",  weight: "220", jersey_number: "2",  college: "Oklahoma State", country: "USA",      draft_year: 2021, draft_round: 1, draft_number: 1,  team: t(9)  },
  { id: 1018, first_name: "Jaden",     last_name: "Ivey",       position: "G",   height: "6-4",  weight: "195", jersey_number: "23", college: "Purdue",         country: "USA",      draft_year: 2022, draft_round: 1, draft_number: 5,  team: t(9)  },
  // GSW
  { id: 1019, first_name: "Stephen",   last_name: "Curry",      position: "G",   height: "6-2",  weight: "185", jersey_number: "30", college: "Davidson",       country: "USA",      draft_year: 2009, draft_round: 1, draft_number: 7,  team: t(10) },
  { id: 1020, first_name: "Draymond",  last_name: "Green",      position: "F",   height: "6-6",  weight: "230", jersey_number: "23", college: "Michigan State", country: "USA",      draft_year: 2012, draft_round: 2, draft_number: 35, team: t(10) },
  // HOU
  { id: 1021, first_name: "Alperen",   last_name: "Sengun",     position: "C",   height: "6-10", weight: "240", jersey_number: "28", college: undefined,        country: "Turkey",   draft_year: 2021, draft_round: 1, draft_number: 16, team: t(11) },
  { id: 1022, first_name: "Jalen",     last_name: "Green",      position: "G",   height: "6-5",  weight: "185", jersey_number: "4",  college: undefined,        country: "USA",      draft_year: 2021, draft_round: 1, draft_number: 2,  team: t(11) },
  // IND
  { id: 1023, first_name: "Tyrese",    last_name: "Haliburton",  position: "G",  height: "6-5",  weight: "185", jersey_number: "0",  college: "Iowa State",     country: "USA",      draft_year: 2020, draft_round: 1, draft_number: 12, team: t(12) },
  { id: 1024, first_name: "Pascal",    last_name: "Siakam",     position: "F",   height: "6-9",  weight: "240", jersey_number: "43", college: undefined,        country: "Cameroon", draft_year: 2016, draft_round: 1, draft_number: 27, team: t(12) },
  // LAC
  { id: 1025, first_name: "Kawhi",     last_name: "Leonard",    position: "F",   height: "6-7",  weight: "225", jersey_number: "2",  college: "San Diego State",country: "USA",      draft_year: 2011, draft_round: 1, draft_number: 15, team: t(13) },
  { id: 1026, first_name: "Paul",      last_name: "George",     position: "F",   height: "6-8",  weight: "220", jersey_number: "13", college: "Fresno State",   country: "USA",      draft_year: 2010, draft_round: 1, draft_number: 10, team: t(13) },
  // LAL
  { id: 1027, first_name: "LeBron",    last_name: "James",      position: "F",   height: "6-9",  weight: "250", jersey_number: "23", college: undefined,        country: "USA",      draft_year: 2003, draft_round: 1, draft_number: 1,  team: t(14) },
  { id: 1028, first_name: "Anthony",   last_name: "Davis",      position: "C",   height: "6-10", weight: "253", jersey_number: "3",  college: "Kentucky",       country: "USA",      draft_year: 2012, draft_round: 1, draft_number: 1,  team: t(14) },
  // MEM
  { id: 1029, first_name: "Ja",        last_name: "Morant",     position: "G",   height: "6-2",  weight: "174", jersey_number: "12", college: "Murray State",   country: "USA",      draft_year: 2019, draft_round: 1, draft_number: 2,  team: t(15) },
  { id: 1030, first_name: "Jaren",     last_name: "Jackson Jr.", position: "C",  height: "6-11", weight: "242", jersey_number: "13", college: "Michigan State", country: "USA",      draft_year: 2018, draft_round: 1, draft_number: 4,  team: t(15) },
  // MIA
  { id: 1031, first_name: "Jimmy",     last_name: "Butler",     position: "F",   height: "6-7",  weight: "232", jersey_number: "22", college: "Marquette",      country: "USA",      draft_year: 2011, draft_round: 1, draft_number: 30, team: t(16) },
  { id: 1032, first_name: "Bam",       last_name: "Adebayo",    position: "C",   height: "6-9",  weight: "255", jersey_number: "13", college: "Kentucky",       country: "USA",      draft_year: 2017, draft_round: 1, draft_number: 14, team: t(16) },
  // MIL
  { id: 1033, first_name: "Giannis",   last_name: "Antetokounmpo", position: "F", height: "6-11", weight: "242", jersey_number: "34", college: undefined,       country: "Greece",   draft_year: 2013, draft_round: 1, draft_number: 15, team: t(17) },
  { id: 1034, first_name: "Damian",    last_name: "Lillard",    position: "G",   height: "6-2",  weight: "195", jersey_number: "0",  college: "Weber State",    country: "USA",      draft_year: 2012, draft_round: 1, draft_number: 6,  team: t(17) },
  // MIN
  { id: 1035, first_name: "Karl-Anthony", last_name: "Towns",   position: "C",   height: "7-0",  weight: "248", jersey_number: "32", college: "Kentucky",       country: "Dominican Republic", draft_year: 2015, draft_round: 1, draft_number: 1, team: t(18) },
  { id: 1036, first_name: "Anthony",   last_name: "Edwards",    position: "G",   height: "6-4",  weight: "225", jersey_number: "5",  college: "Georgia",        country: "USA",      draft_year: 2020, draft_round: 1, draft_number: 1,  team: t(18) },
  // NOP
  { id: 1037, first_name: "Zion",      last_name: "Williamson", position: "F",   height: "6-6",  weight: "284", jersey_number: "1",  college: "Duke",           country: "USA",      draft_year: 2019, draft_round: 1, draft_number: 1,  team: t(19) },
  { id: 1038, first_name: "Brandon",   last_name: "Ingram",     position: "F",   height: "6-8",  weight: "190", jersey_number: "14", college: "Duke",           country: "USA",      draft_year: 2016, draft_round: 1, draft_number: 2,  team: t(19) },
  // NYK
  { id: 1039, first_name: "Jalen",     last_name: "Brunson",    position: "G",   height: "6-1",  weight: "190", jersey_number: "11", college: "Villanova",      country: "USA",      draft_year: 2018, draft_round: 2, draft_number: 33, team: t(20) },
  { id: 1040, first_name: "Julius",    last_name: "Randle",     position: "F",   height: "6-8",  weight: "250", jersey_number: "30", college: "Kentucky",       country: "USA",      draft_year: 2014, draft_round: 1, draft_number: 7,  team: t(20) },
  // OKC
  { id: 1041, first_name: "Shai",      last_name: "Gilgeous-Alexander", position: "G", height: "6-6", weight: "195", jersey_number: "2", college: "Kentucky", country: "Canada",  draft_year: 2018, draft_round: 1, draft_number: 11, team: t(21) },
  { id: 1042, first_name: "Chet",      last_name: "Holmgren",   position: "C",   height: "7-0",  weight: "195", jersey_number: "7",  college: "Gonzaga",        country: "USA",      draft_year: 2022, draft_round: 1, draft_number: 2,  team: t(21) },
  // ORL
  { id: 1043, first_name: "Paolo",     last_name: "Banchero",   position: "F",   height: "6-10", weight: "250", jersey_number: "5",  college: "Duke",           country: "USA",      draft_year: 2022, draft_round: 1, draft_number: 1,  team: t(22) },
  { id: 1044, first_name: "Franz",     last_name: "Wagner",     position: "F",   height: "6-9",  weight: "220", jersey_number: "21", college: "Michigan",       country: "Germany",  draft_year: 2021, draft_round: 1, draft_number: 8,  team: t(22) },
  // PHI
  { id: 1045, first_name: "Joel",      last_name: "Embiid",     position: "C",   height: "7-0",  weight: "280", jersey_number: "21", college: "Kansas",         country: "Cameroon", draft_year: 2014, draft_round: 1, draft_number: 3,  team: t(23) },
  { id: 1046, first_name: "Tyrese",    last_name: "Maxey",      position: "G",   height: "6-2",  weight: "200", jersey_number: "0",  college: "Kentucky",       country: "USA",      draft_year: 2020, draft_round: 1, draft_number: 21, team: t(23) },
  // PHX
  { id: 1047, first_name: "Kevin",     last_name: "Durant",     position: "F",   height: "6-10", weight: "240", jersey_number: "35", college: "Texas",          country: "USA",      draft_year: 2007, draft_round: 1, draft_number: 2,  team: t(24) },
  { id: 1048, first_name: "Devin",     last_name: "Booker",     position: "G",   height: "6-5",  weight: "206", jersey_number: "1",  college: "Kentucky",       country: "USA",      draft_year: 2015, draft_round: 1, draft_number: 13, team: t(24) },
  // POR
  { id: 1049, first_name: "Anfernee",  last_name: "Simons",     position: "G",   height: "6-3",  weight: "181", jersey_number: "1",  college: undefined,        country: "USA",      draft_year: 2018, draft_round: 1, draft_number: 24, team: t(25) },
  { id: 1050, first_name: "Scoot",     last_name: "Henderson",  position: "G",   height: "6-2",  weight: "195", jersey_number: "00", college: undefined,        country: "USA",      draft_year: 2023, draft_round: 1, draft_number: 3,  team: t(25) },
  // SAC
  { id: 1051, first_name: "De'Aaron",  last_name: "Fox",        position: "G",   height: "6-3",  weight: "185", jersey_number: "5",  college: "Kentucky",       country: "USA",      draft_year: 2017, draft_round: 1, draft_number: 5,  team: t(26) },
  { id: 1052, first_name: "Domantas",  last_name: "Sabonis",    position: "C",   height: "6-11", weight: "240", jersey_number: "11", college: "Gonzaga",        country: "Lithuania", draft_year: 2016, draft_round: 1, draft_number: 11, team: t(26) },
  // SAS
  { id: 1053, first_name: "Victor",    last_name: "Wembanyama", position: "C",   height: "7-4",  weight: "210", jersey_number: "1",  college: undefined,        country: "France",   draft_year: 2023, draft_round: 1, draft_number: 1,  team: t(27) },
  { id: 1054, first_name: "Devin",     last_name: "Vassell",    position: "G",   height: "6-5",  weight: "193", jersey_number: "24", college: "Florida State",  country: "USA",      draft_year: 2020, draft_round: 1, draft_number: 11, team: t(27) },
  // TOR
  { id: 1055, first_name: "Scottie",   last_name: "Barnes",     position: "F",   height: "6-8",  weight: "225", jersey_number: "4",  college: "Florida State",  country: "Canada",   draft_year: 2021, draft_round: 1, draft_number: 4,  team: t(28) },
  { id: 1056, first_name: "RJ",        last_name: "Barrett",    position: "F",   height: "6-7",  weight: "214", jersey_number: "9",  college: "Duke",           country: "Canada",   draft_year: 2019, draft_round: 1, draft_number: 3,  team: t(28) },
  // UTA
  { id: 1057, first_name: "Lauri",     last_name: "Markkanen",  position: "F",   height: "7-0",  weight: "240", jersey_number: "23", college: "Arizona",        country: "Finland",  draft_year: 2017, draft_round: 1, draft_number: 7,  team: t(29) },
  { id: 1058, first_name: "Jordan",    last_name: "Clarkson",   position: "G",   height: "6-5",  weight: "194", jersey_number: "00", college: "Missouri",       country: "Philippines", draft_year: 2014, draft_round: 2, draft_number: 46, team: t(29) },
  // WAS
  { id: 1059, first_name: "Bradley",   last_name: "Beal",       position: "G",   height: "6-4",  weight: "207", jersey_number: "3",  college: "Florida",        country: "USA",      draft_year: 2012, draft_round: 1, draft_number: 3,  team: t(30) },
  { id: 1060, first_name: "Kyle",      last_name: "Kuzma",      position: "F",   height: "6-9",  weight: "221", jersey_number: "33", college: "Utah",           country: "USA",      draft_year: 2017, draft_round: 1, draft_number: 27, team: t(30) },
];

// ─── Mock Season Averages (2024-25) ──────────────────────────────────────────

function avg(player_id: number, gp: number, min: string, pts: number, reb: number, ast: number, stl: number, blk: number, to: number, fg: number, fg3: number, ft: number): SeasonAverages {
  const fga = pts > 0 ? parseFloat((pts / (2 * fg + 0.001)).toFixed(1)) : 0;
  const fgm = parseFloat((fga * fg).toFixed(1));
  const fg3a = parseFloat((pts / 6).toFixed(1));
  const fg3m = parseFloat((fg3a * fg3).toFixed(1));
  const fta = parseFloat((pts / 8).toFixed(1));
  const ftm = parseFloat((fta * ft).toFixed(1));
  return { player_id, season: 2024, games_played: gp, min, pts, reb, ast, stl, blk, turnover: to, pf: 2, fg_pct: fg, fg3_pct: fg3, ft_pct: ft, fgm, fga, fg3m, fg3a, ftm, fta, oreb: parseFloat((reb * 0.25).toFixed(1)), dreb: parseFloat((reb * 0.75).toFixed(1)) };
}

export const MOCK_SEASON_AVERAGES: SeasonAverages[] = [
  avg(1001, 72, "34:12", 25.7, 3.3, 10.8, 1.3, 0.2, 4.2, 0.429, 0.356, 0.874),
  avg(1002, 68, "32:40", 18.4, 5.1,  5.2, 1.4, 0.5, 2.8, 0.451, 0.371, 0.799),
  avg(1003, 74, "35:55", 27.1, 8.1,  4.6, 1.1, 0.6, 2.9, 0.471, 0.371, 0.833),
  avg(1004, 70, "34:10", 22.6, 5.4,  3.6, 1.2, 0.5, 2.5, 0.486, 0.359, 0.700),
  avg(1005, 82, "33:24", 19.6, 4.4,  3.6, 0.9, 0.6, 1.8, 0.484, 0.382, 0.824),
  avg(1006, 69, "31:00", 22.3, 4.2,  2.9, 1.3, 0.4, 2.4, 0.443, 0.370, 0.850),
  avg(1007, 58, "31:40", 23.1, 5.6,  8.0, 1.5, 0.4, 3.7, 0.428, 0.359, 0.793),
  avg(1008, 73, "32:00", 17.6, 4.5,  2.3, 0.9, 0.5, 1.8, 0.458, 0.374, 0.780),
  avg(1009, 73, "34:44", 21.6, 4.3,  4.9, 1.1, 0.4, 2.1, 0.477, 0.323, 0.851),
  avg(1010, 57, "31:10", 22.5, 4.7,  4.5, 0.9, 0.5, 3.1, 0.464, 0.379, 0.822),
  avg(1011, 68, "34:30", 26.6, 4.5,  6.1, 1.6, 0.4, 3.3, 0.476, 0.369, 0.866),
  avg(1012, 71, "33:20", 18.6, 9.4,  3.2, 1.4, 1.9, 2.0, 0.544, 0.286, 0.684),
  avg(1013, 66, "36:00", 28.9, 8.6,  8.0, 1.4, 0.5, 4.0, 0.480, 0.368, 0.786),
  avg(1014, 60, "32:10", 23.7, 5.1,  5.2, 1.4, 0.5, 2.8, 0.462, 0.379, 0.904),
  avg(1015, 79, "34:50", 26.4, 12.4, 9.0, 1.4, 0.9, 3.6, 0.583, 0.358, 0.816),
  avg(1016, 75, "32:30", 21.2, 4.4,  6.5, 1.4, 0.3, 2.8, 0.492, 0.428, 0.878),
  avg(1017, 62, "34:00", 22.7, 4.4,  7.5, 1.5, 0.4, 3.2, 0.464, 0.329, 0.831),
  avg(1018, 74, "30:20", 15.4, 3.7,  4.5, 1.1, 0.3, 2.2, 0.445, 0.357, 0.789),
  avg(1019, 74, "33:10", 26.4, 4.4,  5.1, 0.9, 0.2, 2.8, 0.491, 0.425, 0.912),
  avg(1020, 69, "28:50",  8.6, 7.2,  6.6, 1.3, 0.8, 2.5, 0.449, 0.310, 0.667),
  avg(1021, 71, "31:00", 21.1, 9.3,  5.0, 1.0, 1.6, 2.6, 0.556, 0.267, 0.623),
  avg(1022, 70, "32:00", 22.4, 4.1,  3.9, 1.6, 0.5, 2.9, 0.453, 0.371, 0.821),
  avg(1023, 69, "34:40", 20.1, 3.8, 10.9, 1.2, 0.3, 3.1, 0.474, 0.400, 0.879),
  avg(1024, 74, "33:50", 21.3, 5.8,  3.7, 1.1, 0.5, 2.3, 0.467, 0.370, 0.825),
  avg(1025, 68, "32:20", 23.7, 6.5,  3.6, 1.7, 0.9, 2.0, 0.509, 0.398, 0.876),
  avg(1026, 74, "33:40", 22.6, 5.4,  3.4, 1.5, 0.7, 2.4, 0.466, 0.391, 0.832),
  avg(1027, 71, "35:00", 25.7, 7.3,  8.3, 1.3, 0.6, 3.5, 0.541, 0.411, 0.750),
  avg(1028, 76, "35:30", 24.7, 12.6, 3.5, 1.2, 2.3, 2.4, 0.553, 0.272, 0.782),
  avg(1029, 62, "32:10", 25.1, 5.6,  8.1, 1.1, 0.4, 3.4, 0.463, 0.374, 0.752),
  avg(1030, 69, "31:00", 22.2, 6.9,  2.4, 0.9, 2.9, 2.3, 0.484, 0.336, 0.739),
  avg(1031, 60, "31:50", 20.8, 5.3,  4.9, 1.8, 0.5, 2.1, 0.538, 0.345, 0.823),
  avg(1032, 71, "32:40", 20.4, 10.4, 3.6, 1.2, 0.9, 2.3, 0.528, 0.200, 0.726),
  avg(1033, 73, "35:10", 30.4, 11.5, 6.5, 1.2, 1.1, 3.3, 0.611, 0.274, 0.657),
  avg(1034, 73, "32:30", 24.3, 4.4,  7.3, 0.9, 0.3, 2.9, 0.449, 0.371, 0.926),
  avg(1035, 77, "34:00", 21.4, 8.3,  3.6, 0.9, 0.6, 3.1, 0.505, 0.373, 0.774),
  avg(1036, 76, "35:50", 25.9, 5.4,  5.1, 1.5, 0.5, 3.5, 0.462, 0.362, 0.817),
  avg(1037, 70, "33:40", 22.9, 5.8,  4.6, 1.3, 0.6, 2.4, 0.574, 0.311, 0.696),
  avg(1038, 71, "33:20", 20.8, 5.3,  4.4, 1.3, 0.4, 2.5, 0.454, 0.381, 0.820),
  avg(1039, 78, "35:50", 28.7, 3.6,  6.7, 0.9, 0.2, 2.7, 0.479, 0.411, 0.843),
  avg(1040, 72, "32:40", 24.0, 9.2,  5.0, 1.0, 0.3, 3.5, 0.454, 0.348, 0.793),
  avg(1041, 75, "34:30", 30.1, 5.5,  6.4, 2.0, 1.0, 2.5, 0.535, 0.356, 0.874),
  avg(1042, 74, "33:00", 14.6, 7.9,  1.9, 0.9, 2.7, 1.3, 0.534, 0.344, 0.786),
  avg(1043, 72, "35:10", 22.6, 6.9,  5.4, 1.2, 0.9, 2.9, 0.480, 0.329, 0.761),
  avg(1044, 80, "34:20", 19.7, 5.4,  3.5, 1.1, 0.5, 2.2, 0.501, 0.365, 0.814),
  avg(1045, 39, "33:50", 34.7, 11.0, 5.6, 1.2, 1.7, 3.6, 0.528, 0.331, 0.853),
  avg(1046, 70, "36:00", 25.9, 3.7,  6.2, 1.0, 0.5, 2.7, 0.459, 0.374, 0.871),
  avg(1047, 75, "37:00", 27.1, 6.6,  4.4, 0.7, 1.1, 3.3, 0.529, 0.413, 0.857),
  avg(1048, 68, "35:20", 27.8, 4.5,  6.4, 1.1, 0.3, 3.5, 0.481, 0.374, 0.853),
  avg(1049, 74, "32:00", 21.5, 3.2,  3.9, 1.1, 0.3, 2.1, 0.473, 0.397, 0.857),
  avg(1050, 65, "29:00", 14.4, 4.1,  5.6, 1.4, 0.2, 3.3, 0.432, 0.318, 0.786),
  avg(1051, 77, "35:50", 26.6, 4.1,  6.1, 1.5, 0.3, 3.5, 0.484, 0.363, 0.798),
  avg(1052, 74, "33:30", 19.9, 13.5, 7.3, 1.0, 0.5, 2.7, 0.596, 0.280, 0.666),
  avg(1053, 71, "32:00", 21.4, 10.6, 3.9, 1.2, 3.6, 2.0, 0.496, 0.362, 0.793),
  avg(1054, 74, "30:30", 15.3, 4.1,  2.7, 1.5, 0.5, 1.5, 0.476, 0.389, 0.869),
  avg(1055, 77, "35:50", 19.9, 8.1,  6.1, 1.4, 0.8, 2.8, 0.469, 0.318, 0.760),
  avg(1056, 70, "32:20", 21.8, 5.7,  3.8, 1.3, 0.4, 2.5, 0.469, 0.374, 0.784),
  avg(1057, 76, "33:30", 26.3, 8.6,  1.9, 0.9, 0.6, 1.5, 0.487, 0.367, 0.873),
  avg(1058, 73, "26:40", 17.4, 2.4,  3.1, 0.7, 0.2, 1.8, 0.456, 0.391, 0.833),
  avg(1059, 55, "31:50", 18.2, 4.2,  4.4, 0.8, 0.4, 2.7, 0.476, 0.331, 0.786),
  avg(1060, 73, "32:20", 17.8, 7.2,  3.5, 0.9, 0.4, 2.1, 0.447, 0.356, 0.786),
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getMockTeamById(id: number): Team | undefined {
  return MOCK_TEAMS.find((t) => t.id === id);
}

export function getMockPlayersByTeam(teamId: number): Player[] {
  return MOCK_PLAYERS.filter((p) => p.team?.id === teamId);
}

export function getMockPlayerById(id: number): Player | undefined {
  return MOCK_PLAYERS.find((p) => p.id === id);
}

export function getMockAveragesForPlayer(playerId: number): SeasonAverages | undefined {
  return MOCK_SEASON_AVERAGES.find((a) => a.player_id === playerId);
}

export function searchMockPlayers(
  query: string,
  page = 1,
  perPage = 25,
): { players: Player[]; total: number; hasMore: boolean } {
  const q = query.toLowerCase().trim();
  const filtered = q
    ? MOCK_PLAYERS.filter(
        (p) =>
          p.first_name.toLowerCase().includes(q) ||
          p.last_name.toLowerCase().includes(q) ||
          `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
          (p.team?.full_name ?? "").toLowerCase().includes(q) ||
          (p.team?.abbreviation ?? "").toLowerCase().includes(q) ||
          (p.team?.city ?? "").toLowerCase().includes(q) ||
          (p.position ?? "").toLowerCase().includes(q) ||
          (p.college ?? "").toLowerCase().includes(q) ||
          (p.country ?? "").toLowerCase().includes(q) ||
          (p.jersey_number ?? "") === q
      )
    : MOCK_PLAYERS;

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const players = filtered.slice(start, start + perPage);
  return { players, total, hasMore: start + perPage < total };
}

