export interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height?: string;
  weight?: string;
  jersey_number?: string;
  college?: string;
  country?: string;
  draft_year?: number;
  draft_round?: number;
  draft_number?: number;
  team?: Team;
}

export interface GameScore {
  team: Team;
  pts?: number | null;
}

export interface Game {
  id: number;
  date: string;
  home_team: Team;
  home_team_score: number;
  period: number;
  postseason: boolean;
  season: number;
  status: string;
  time: string | null;
  visitor_team: Team;
  visitor_team_score: number;
}

export interface PlayerStats {
  id: number;
  ast: number;
  blk: number;
  dreb: number;
  fg3_pct: number | null;
  fg3a: number;
  fg3m: number;
  fg_pct: number | null;
  fga: number;
  fgm: number;
  ft_pct: number | null;
  fta: number;
  ftm: number;
  game?: Game;
  min: string;
  oreb: number;
  pf: number;
  player?: Player;
  pts: number;
  reb: number;
  stl: number;
  team?: Team;
  turnover: number;
}

export interface SeasonAverages {
  games_played: number;
  player_id: number;
  season: number;
  min: string;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  pf: number;
  pts: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
}

export interface StandingsEntry {
  team: Team;
  wins: number;
  losses: number;
  winPct: number;
  conference: string;
  rank: number;
  gamesBack?: number | string;
  homeRecord?: string;
  awayRecord?: string;
  last10?: string;
  streak?: string;
}

export interface NormalizedGame {
  id: number;
  date: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    fullName: string;
    abbreviation: string;
    score: number;
    conference: string;
  };
  awayTeam: {
    id: number;
    name: string;
    fullName: string;
    abbreviation: string;
    score: number;
    conference: string;
  };
  isLive: boolean;
  isFinished: boolean;
  isUpcoming: boolean;
  period: number;
  time: string | null;
  season: number;
  postseason: boolean;
}
