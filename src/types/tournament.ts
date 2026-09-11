export type TeamStatus = 'active' | 'eliminated' | 'champion';

export interface Team {
  id: string;
  name: string;
  tag: string;
  seed: number;
  logo?: string;
  color?: string;
  captain?: string;
  contact?: string;
  checkedIn: boolean;
  status: TeamStatus;
  heroName?: string;
  heroAvatar?: string;
}

export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'walkover';

export type MatchStage = 
  | 'upper_r1' 
  | 'upper_r2' 
  | 'lower_r1' 
  | 'lower_r2' 
  | 'lower_final' 
  | 'semi_final' 
  | 'grand_final'
  | 'third_place';

export interface GameDetail {
  gameNumber: number;
  score1: number;
  score2: number;
  winnerId?: string;
  duration?: string;
  mvp?: string;
  bans1?: string[];
  bans2?: string[];
  picks1?: string[];
  picks2?: string[];
}

export interface Match {
  id: string;
  matchNumber: number;
  title: string;
  stage: MatchStage;
  roundName: string;
  team1: Team | null;
  team2: Team | null;
  score1: number;
  score2: number;
  bestOf: number; // 1, 3, 5
  winnerId: string | null;
  loserId: string | null;
  status: MatchStatus;
  isByeMatch?: boolean;
  
  // Downstream routing
  nextMatchId?: string;
  nextSlot?: 'team1' | 'team2';
  loserMatchId?: string;
  loserSlot?: 'team1' | 'team2';

  // Details
  scheduledTime?: string;
  liveMap?: string;
  games: GameDetail[];
  notes?: string;
}

export interface TournamentConfig {
  title: string;
  subtitle: string;
  game: string; // 'Mobile Legends: Bang Bang'
  format: string; // '11-Team Modified Double Elimination'
  organizer: string;
  date: string;
  venue: string;
  prizePool: string;
}

export interface TournamentState {
  config: TournamentConfig;
  teams: Team[];
  matches: Record<string, Match>;
  currentStage: 'checkin' | 'raffle' | 'tournament' | 'champion';
  championTeamId: string | null;
  runnerUpTeamId: string | null;
  thirdPlaceTeamId: string | null;
  selectedMatchId: string | null;
  history: { timestamp: string; action: string }[];
}
