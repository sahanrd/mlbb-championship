import { Match, Team, TournamentConfig } from '../types/tournament';

export const DEFAULT_MLBB_TEAMS: Team[] = [
  { id: 'team-1', name: 'A5CE', tag: 'A5CE', seed: 1, color: '#00F0FF', captain: 'LEAD', heroName: 'Gusion', checkedIn: true, status: 'active' },
  { id: 'team-2', name: 'පොල් බොට්ටු', tag: 'PB', seed: 2, color: '#FFB800', captain: 'LEAD', heroName: 'Fanny', checkedIn: true, status: 'active' },
  { id: 'team-3', name: 'Vortex E-sports', tag: 'VTX', seed: 3, color: '#8B5CF6', captain: 'LEAD', heroName: 'Chou', checkedIn: true, status: 'active' },
  { id: 'team-4', name: 'Low Cortisol', tag: 'LC', seed: 4, color: '#FF2E54', captain: 'LEAD', heroName: 'Beatrix', checkedIn: true, status: 'active' },
  { id: 'team-5', name: 'SYNTHEX6', tag: 'STX6', seed: 5, color: '#10B981', captain: 'LEAD', heroName: 'Paquito', checkedIn: true, status: 'active' },
  { id: 'team-6', name: 'Team H∆LØ', tag: 'HALO', seed: 6, color: '#F97316', captain: 'LEAD', heroName: 'Ling', checkedIn: true, status: 'active' },
  { id: 'team-7', name: 'AKATSUKI', tag: 'AKT', seed: 7, color: '#38BDF8', captain: 'LEAD', heroName: 'Lancelot', checkedIn: true, status: 'active' },
  { id: 'team-8', name: 'Shear Force', tag: 'SF', seed: 8, color: '#EF4444', captain: 'LEAD', heroName: 'Hayabusa', checkedIn: true, status: 'active' },
  { id: 'team-9', name: 'Hune Akai', tag: 'HA', seed: 9, color: '#EC4899', captain: 'LEAD', heroName: 'Fredrinn', checkedIn: true, status: 'active' },
  { id: 'team-10', name: 'AEGIS', tag: 'AGS', seed: 10, color: '#E11D48', captain: 'LEAD', heroName: 'Claude', checkedIn: true, status: 'active' },
  { id: 'team-11', name: 'Nexus', tag: 'NXS', seed: 11, color: '#A855F7', captain: 'LEAD', heroName: 'Benedetta', checkedIn: true, status: 'active' },
];

export const DEFAULT_CONFIG: TournamentConfig = {
  title: 'Mobile Legends Bang Bang',
  subtitle: '',
  game: 'Mobile Legends Bang Bang',
  format: '11-Team Custom Double Elimination (Upper R1/R2 -> Lower R1/R2/Final -> Semis -> Grand Final)',
  organizer: 'Respawn Esports',
  date: 'September 2026',
  venue: 'Main Stage Arena / Stream Studio',
  prizePool: 'Championship Trophy',
};

/**
 * EXACT 11-TEAM DEDICATED TOURNAMENT TREE (18 Matches):
 * 
 * 1. UPPER ROUND 1 (5 Matches: Team 1 to 10):
 *    - UR1_M1 (T1 vs T2) -> Win: UR2_M1(team1), Lose: LR1_M1(team1)
 *    - UR1_M2 (T3 vs T4) -> Win: UR2_M1(team2), Lose: LR1_M1(team2)
 *    - UR1_M3 (T5 vs T6) -> Win: UR2_M2(team1), Lose: LR1_M2(team1)
 *    - UR1_M4 (T7 vs T8) -> Win: UR2_M2(team2), Lose: LR1_M2(team2)
 *    - UR1_M5 (T9 vs T10) -> Win: UR2_M3(team1), Lose: LR1_M3(team1)
 *    - Slot 11 (Team 11) gets Round 1 BYE -> Enters UR2_M3(team2) directly!
 * 
 * 2. UPPER ROUND 2 (3 Matches: 6 Teams = 5 Winners + 1 Bye):
 *    - UR2_M1 (Win M1 vs Win M2) -> Win: SF_M1(team1) [Semi Spot 1], Lose: LR1_M3(team2)
 *    - UR2_M2 (Win M3 vs Win M4) -> Win: SF_M2(team1) [Semi Spot 2], Lose: LR1_M4(team1)
 *    - UR2_M3 (Win M5 vs Slot 11 Bye) -> Win: SF_M2(team2) [Semi Spot 3], Lose: LR1_M4(team2)
 * 
 * 3. LOWER ROUND 1 (4 Matches: 8 Teams = 5 from UR1 + 3 from UR2):
 *    - LR1_M1 (Lose M1 vs Lose M2) -> Win: LR2_M1(team1), Lose: OUT
 *    - LR1_M2 (Lose M3 vs Lose M4) -> Win: LR2_M1(team2), Lose: OUT
 *    - LR1_M3 (Lose M5 vs Lose UR2_M1) -> Win: LR2_M2(team1), Lose: OUT
 *    - LR1_M4 (Lose UR2_M2 vs Lose UR2_M3) -> Win: LR2_M2(team2), Lose: OUT
 * 
 * 4. LOWER ROUND 2 (2 Matches: 4 Teams):
 *    - LR2_M1 (Win LR1_M1 vs Win LR1_M2) -> Win: LRF_M1(team1), Lose: OUT
 *    - LR2_M2 (Win LR1_M3 vs Win LR1_M4) -> Win: LRF_M1(team2), Lose: OUT
 * 
 * 5. LOWER FINAL (1 Match: 2 Teams):
 *    - LRF_M1 (Win LR2_M1 vs Win LR2_M2) -> Win: SF_M1(team2) [Semi Spot 4!], Lose: OUT
 * 
 * 6. SEMI-FINALS (2 Matches: 4 Teams = 3 Upper + 1 Lower Finalist):
 *    - SF_M1 (Upper Winner 1 vs Lower Finalist) -> Win: GF_M1(team1), Lose: OUT
 *    - SF_M2 (Upper Winner 2 vs Upper Winner 3) -> Win: GF_M1(team2), Lose: OUT
 * 
 * 7. GRAND FINAL (1 Match: 2 Finalists):
 *    - GF_M1 (Winner SF1 vs Winner SF2) -> 👑 CHAMPION!
 */
export function generate11TeamBracket(seededTeams: Team[]): Record<string, Match> {
  const getTeam = (index: number) => seededTeams[index] || null;

  return {
    // UPPER ROUND 1 (5 Matches)
    'UR1_M1': {
      id: 'UR1_M1',
      matchNumber: 1,
      title: 'Upper Round 1 • Match 1',
      stage: 'upper_r1',
      roundName: 'Upper Bracket Round 1',
      team1: getTeam(0),
      team2: getTeam(1),
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'UR2_M1',
      nextSlot: 'team1',
      loserMatchId: 'LR1_M1',
      loserSlot: 'team1',
      games: [],
    },
    'UR1_M2': {
      id: 'UR1_M2',
      matchNumber: 2,
      title: 'Upper Round 1 • Match 2',
      stage: 'upper_r1',
      roundName: 'Upper Bracket Round 1',
      team1: getTeam(2),
      team2: getTeam(3),
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'UR2_M1',
      nextSlot: 'team2',
      loserMatchId: 'LR1_M1',
      loserSlot: 'team2',
      games: [],
    },
    'UR1_M3': {
      id: 'UR1_M3',
      matchNumber: 3,
      title: 'Upper Round 1 • Match 3',
      stage: 'upper_r1',
      roundName: 'Upper Bracket Round 1',
      team1: getTeam(4),
      team2: getTeam(5),
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'UR2_M2',
      nextSlot: 'team1',
      loserMatchId: 'LR1_M2',
      loserSlot: 'team1',
      games: [],
    },
    'UR1_M4': {
      id: 'UR1_M4',
      matchNumber: 4,
      title: 'Upper Round 1 • Match 4',
      stage: 'upper_r1',
      roundName: 'Upper Bracket Round 1',
      team1: getTeam(6),
      team2: getTeam(7),
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'UR2_M2',
      nextSlot: 'team2',
      loserMatchId: 'LR1_M2',
      loserSlot: 'team2',
      games: [],
    },
    'UR1_M5': {
      id: 'UR1_M5',
      matchNumber: 5,
      title: 'Upper Round 1 • Match 5',
      stage: 'upper_r1',
      roundName: 'Upper Bracket Round 1',
      team1: getTeam(8),
      team2: getTeam(9),
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'UR2_M3',
      nextSlot: 'team1',
      loserMatchId: 'LR1_M3',
      loserSlot: 'team1',
      games: [],
    },

    // UPPER ROUND 2 (3 Matches - 6 Teams)
    'UR2_M1': {
      id: 'UR2_M1',
      matchNumber: 6,
      title: 'Upper Round 2 • Match 1 (Quarterfinal)',
      stage: 'upper_r2',
      roundName: 'Upper Bracket Round 2',
      team1: null,
      team2: null,
      score1: 0,
      score2: 0,
      bestOf: 3,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'SF_M1',
      nextSlot: 'team1', // Land in Semi 1 Team 1
      loserMatchId: 'LR1_M3',
      loserSlot: 'team2', // Drops to Lower R1 Match 3
      games: [],
      notes: 'Winner qualifies for Semi-Finals (Spot 1/4). Loser to Lower R1.',
    },
    'UR2_M2': {
      id: 'UR2_M2',
      matchNumber: 7,
      title: 'Upper Round 2 • Match 2 (Quarterfinal)',
      stage: 'upper_r2',
      roundName: 'Upper Bracket Round 2',
      team1: null,
      team2: null,
      score1: 0,
      score2: 0,
      bestOf: 3,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'SF_M2',
      nextSlot: 'team1', // Land in Semi 2 Team 1
      loserMatchId: 'LR1_M4',
      loserSlot: 'team1', // Drops to Lower R1 Match 4
      games: [],
      notes: 'Winner qualifies for Semi-Finals (Spot 2/4). Loser to Lower R1.',
    },
    'UR2_M3': {
      id: 'UR2_M3',
      matchNumber: 8,
      title: 'Upper Round 2 • Match 3 (Slot 11 Matchup)',
      stage: 'upper_r2',
      roundName: 'Upper Bracket Round 2',
      team1: null,
      team2: getTeam(10), // Slot 11 Bye Team directly placed here!
      score1: 0,
      score2: 0,
      bestOf: 3,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'SF_M2',
      nextSlot: 'team2', // Land in Semi 2 Team 2
      loserMatchId: 'LR1_M4',
      loserSlot: 'team2', // Drops to Lower R1 Match 4
      games: [],
      notes: 'Winner qualifies for Semi-Finals (Spot 3/4). Loser to Lower R1.',
    },

    // LOWER ROUND 1 (4 Matches - 8 Teams)
    'LR1_M1': {
      id: 'LR1_M1',
      matchNumber: 9,
      title: 'Lower Round 1 • Match 1 (Elimination)',
      stage: 'lower_r1',
      roundName: 'Lower Bracket Round 1',
      team1: null, // Loser from UR1_M1
      team2: null, // Loser from UR1_M2
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'LR2_M1',
      nextSlot: 'team1',
      games: [],
    },
    'LR1_M2': {
      id: 'LR1_M2',
      matchNumber: 10,
      title: 'Lower Round 1 • Match 2 (Elimination)',
      stage: 'lower_r1',
      roundName: 'Lower Bracket Round 1',
      team1: null, // Loser from UR1_M3
      team2: null, // Loser from UR1_M4
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'LR2_M1',
      nextSlot: 'team2',
      games: [],
    },
    'LR1_M3': {
      id: 'LR1_M3',
      matchNumber: 11,
      title: 'Lower Round 1 • Match 3 (Elimination)',
      stage: 'lower_r1',
      roundName: 'Lower Bracket Round 1',
      team1: null, // Loser from UR1_M5
      team2: null, // Loser from UR2_M1
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'LR2_M2',
      nextSlot: 'team1',
      games: [],
    },
    'LR1_M4': {
      id: 'LR1_M4',
      matchNumber: 12,
      title: 'Lower Round 1 • Match 4 (Elimination)',
      stage: 'lower_r1',
      roundName: 'Lower Bracket Round 1',
      team1: null, // Loser from UR2_M2
      team2: null, // Loser from UR2_M3
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'LR2_M2',
      nextSlot: 'team2',
      games: [],
    },

    // LOWER ROUND 2 (2 Matches - 4 Teams)
    'LR2_M1': {
      id: 'LR2_M1',
      matchNumber: 13,
      title: 'Lower Round 2 • Match 1 (Elimination)',
      stage: 'lower_r2',
      roundName: 'Lower Bracket Round 2',
      team1: null,
      team2: null,
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'LRF_M1',
      nextSlot: 'team1',
      games: [],
    },
    'LR2_M2': {
      id: 'LR2_M2',
      matchNumber: 14,
      title: 'Lower Round 2 • Match 2 (Elimination)',
      stage: 'lower_r2',
      roundName: 'Lower Bracket Round 2',
      team1: null,
      team2: null,
      score1: 0,
      score2: 0,
      bestOf: 1,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'LRF_M1',
      nextSlot: 'team2',
      games: [],
    },

    // LOWER FINAL (1 Match - 2 Teams)
    'LRF_M1': {
      id: 'LRF_M1',
      matchNumber: 15,
      title: 'Lower Bracket Final • Decider',
      stage: 'lower_final',
      roundName: 'Lower Bracket Final',
      team1: null, // Winner LR2_M1
      team2: null, // Winner LR2_M2
      score1: 0,
      score2: 0,
      bestOf: 3,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'SF_M1',
      nextSlot: 'team2', // Land in Semi 1 Team 2 (Semi Spot 4/4!)
      games: [],
      notes: 'Winner takes Semi-Final Spot 4! Loser is eliminated.',
    },

    // SEMI-FINALS (2 Matches - 4 Teams)
    'SF_M1': {
      id: 'SF_M1',
      matchNumber: 16,
      title: 'Semi-Final 1 (Upper #1 vs Lower Finalist)',
      stage: 'semi_final',
      roundName: 'Semi-Finals',
      team1: null, // Winner from UR2_M1
      team2: null, // Winner from Lower Final (LRF_M1)
      score1: 0,
      score2: 0,
      bestOf: 3,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'GF_M1',
      nextSlot: 'team1', // Winner to Grand Final
      games: [],
    },
    'SF_M2': {
      id: 'SF_M2',
      matchNumber: 17,
      title: 'Semi-Final 2 (Upper #2 vs Upper #3)',
      stage: 'semi_final',
      roundName: 'Semi-Finals',
      team1: null, // Winner from UR2_M2
      team2: null, // Winner from UR2_M3
      score1: 0,
      score2: 0,
      bestOf: 3,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      nextMatchId: 'GF_M1',
      nextSlot: 'team2', // Winner to Grand Final
      games: [],
    },

    // GRAND FINAL (1 Match - 2 Finalists)
    'GF_M1': {
      id: 'GF_M1',
      matchNumber: 18,
      title: '🏆 GRAND FINAL SHOWDOWN',
      stage: 'grand_final',
      roundName: 'Grand Final',
      team1: null, // Winner Semi 1
      team2: null, // Winner Semi 2
      score1: 0,
      score2: 0,
      bestOf: 5,
      winnerId: null,
      loserId: null,
      status: 'upcoming',
      games: [],
      notes: 'Best of 5 Championship Match: Semi 1 Winner vs Semi 2 Winner',
    },
  };
}

export function generateDynamicBracket(seededTeams: Team[]): Record<string, Match> {
  return generate11TeamBracket(seededTeams);
}

/**
 * Updates a match with new scores or declared winner, propagating down the tree
 */
export function applyMatchResult(
  currentMatches: Record<string, Match>,
  matchId: string,
  score1: number,
  score2: number,
  declaredWinnerId?: string | null,
  isWalkover?: boolean
): { updatedMatches: Record<string, Match>; championId: string | null } {
  const matches = JSON.parse(JSON.stringify(currentMatches)) as Record<string, Match>;
  const match = matches[matchId];
  if (!match) return { updatedMatches: matches, championId: null };

  match.score1 = score1;
  match.score2 = score2;

  let winner: Team | null = null;
  let loser: Team | null = null;

  if (declaredWinnerId) {
    if (match.team1?.id === declaredWinnerId) {
      winner = match.team1;
      loser = match.team2;
    } else if (match.team2?.id === declaredWinnerId) {
      winner = match.team2;
      loser = match.team1;
    }
  } else {
    // Determine by score
    const targetWins = Math.ceil(match.bestOf / 2);
    if (score1 >= targetWins && match.team1) {
      winner = match.team1;
      loser = match.team2;
    } else if (score2 >= targetWins && match.team2) {
      winner = match.team2;
      loser = match.team1;
    }
  }

  match.winnerId = winner ? winner.id : null;
  match.loserId = loser ? loser.id : null;
  match.status = winner ? (isWalkover ? 'walkover' : 'completed') : (score1 > 0 || score2 > 0 ? 'live' : 'upcoming');

  // Propagate Winner to Next Match
  if (match.nextMatchId && match.nextSlot) {
    const nextMatch = matches[match.nextMatchId];
    if (nextMatch) {
      nextMatch[match.nextSlot] = winner;
      // If winner cleared, clear next match downstream too
      if (!winner && nextMatch.winnerId) {
        nextMatch.score1 = 0;
        nextMatch.score2 = 0;
        nextMatch.winnerId = null;
        nextMatch.loserId = null;
        nextMatch.status = 'upcoming';
      }
    }
  }

  // Propagate Loser to Lower Bracket Match
  if (match.loserMatchId && match.loserSlot) {
    const loserMatch = matches[match.loserMatchId];
    if (loserMatch) {
      loserMatch[match.loserSlot] = loser;
      if (!loser && loserMatch.winnerId) {
        loserMatch.score1 = 0;
        loserMatch.score2 = 0;
        loserMatch.winnerId = null;
        loserMatch.loserId = null;
        loserMatch.status = 'upcoming';
      }
    }
  }

  // Check if Grand Final finished
  let championId: string | null = null;
  if (match.id === 'GF_M1' && winner) {
    championId = winner.id;
  }

  return { updatedMatches: matches, championId };
}
