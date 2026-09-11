import { useState, useEffect, useCallback, useRef } from 'react';
import { TournamentState, Team } from '../types/tournament';
import { DEFAULT_CONFIG, DEFAULT_MLBB_TEAMS, generate11TeamBracket, applyMatchResult } from '../utils/bracketEngine';
import { soundFx } from '../utils/soundFx';
import { firebaseSync } from '../utils/firebaseSync';

const STORAGE_KEY = 'mlbb_respawn_championship_v2';
const ADMIN_PIN_KEY = 'mlbb_admin_pin_v1';
const ADMIN_AUTH_KEY = 'mlbb_admin_session_v1';
const DEFAULT_PIN = '7788';

const isOldRoster = (teamsList?: Team[]) => {
  if (!teamsList || teamsList.length === 0) return true;
  const hasA5CE = teamsList.some(t => t.name.toLowerCase().includes('a5ce'));
  const hasNexus = teamsList.some(t => t.name.toLowerCase().includes('nexus'));
  return !hasA5CE || !hasNexus;
};

const getInitialState = (): TournamentState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('mlbb_championship_state_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.config) {
          parsed.config.title = 'Mobile Legends Bang Bang';
          parsed.config.subtitle = '';
        } else {
          parsed.config = DEFAULT_CONFIG;
        }

        // Migrate teams to official tournament roster
        if (isOldRoster(parsed.teams)) {
          parsed.teams = [...DEFAULT_MLBB_TEAMS];
          parsed.matches = generate11TeamBracket(parsed.teams);
        }

        return parsed;
      } catch (e) {
        console.error('Failed to parse saved tournament:', e);
      }
    }
  }

  const initialTeams = [...DEFAULT_MLBB_TEAMS];
  const initialMatches = generate11TeamBracket(initialTeams);

  return {
    config: DEFAULT_CONFIG,
    teams: initialTeams,
    matches: initialMatches,
    currentStage: 'checkin',
    championTeamId: null,
    runnerUpTeamId: null,
    thirdPlaceTeamId: null,
    selectedMatchId: null,
    history: [{ timestamp: new Date().toISOString(), action: 'Tournament Initialized' }]
  };
};

export function useTournament() {
  const [state, setState] = useState<TournamentState>(getInitialState);
  
  // Admin Authorization State (Default: false on new device / viewer view)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    }
    return false;
  });

  const isRemoteUpdate = useRef(false);

  // Sync to LocalStorage & Firebase on state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    if (!isRemoteUpdate.current && isAdmin) {
      firebaseSync.pushState(state);
    }
    isRemoteUpdate.current = false;
  }, [state, isAdmin]);

  // Realtime Cloud Subscription (Firebase)
  useEffect(() => {
    const unsubscribe = firebaseSync.subscribeToUpdates((cloudState) => {
      if (cloudState) {
        if (isOldRoster(cloudState.teams)) {
          cloudState.teams = [...DEFAULT_MLBB_TEAMS];
          cloudState.matches = generate11TeamBracket(cloudState.teams);
          if (isAdmin) {
            firebaseSync.pushState(cloudState);
          }
        }
        isRemoteUpdate.current = true;
        setState(cloudState);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isAdmin]);

  // Admin PIN Management
  const loginAdmin = useCallback((pin: string): boolean => {
    const savedPin = localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
    if (pin === savedPin) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    soundFx.playClick();
    setIsAdmin(false);
    localStorage.setItem(ADMIN_AUTH_KEY, 'false');
  }, []);

  const changePin = useCallback((oldPin: string, newPin: string): boolean => {
    const savedPin = localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
    if (oldPin === savedPin) {
      localStorage.setItem(ADMIN_PIN_KEY, newPin);
      return true;
    }
    return false;
  }, []);

  // Update Config
  const updateConfig = useCallback((newConfig: Partial<TournamentState['config']>) => {
    if (!isAdmin) return;
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }));
  }, [isAdmin]);

  // Check-In Management
  const toggleCheckIn = useCallback((teamId: string) => {
    if (!isAdmin) return;
    soundFx.playClick();
    setState(prev => {
      const updatedTeams = prev.teams.map(t => 
        t.id === teamId ? { ...t, checkedIn: !t.checkedIn } : t
      );
      return { ...prev, teams: updatedTeams };
    });
  }, [isAdmin]);

  const addTeam = useCallback((name: string, tag: string, captain?: string) => {
    if (!isAdmin) return;
    soundFx.playClick();
    setState(prev => {
      const newSeed = prev.teams.length + 1;
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: name.trim() || `Team ${newSeed}`,
        tag: tag.trim().toUpperCase() || `T${newSeed}`,
        seed: newSeed,
        captain: captain || `Player ${newSeed}`,
        color: ['#00F0FF', '#FFB800', '#8B5CF6', '#FF2E54', '#10B981', '#F97316'][newSeed % 6],
        checkedIn: true,
        status: 'active'
      };
      return {
        ...prev,
        teams: [...prev.teams, newTeam]
      };
    });
  }, [isAdmin]);

  const updateTeam = useCallback((updatedTeam: Team) => {
    if (!isAdmin) return;
    setState(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === updatedTeam.id ? updatedTeam : t),
      matches: Object.fromEntries(
        Object.entries(prev.matches).map(([k, m]) => {
          let mCopy = { ...m };
          if (mCopy.team1?.id === updatedTeam.id) mCopy.team1 = updatedTeam;
          if (mCopy.team2?.id === updatedTeam.id) mCopy.team2 = updatedTeam;
          return [k, mCopy];
        })
      )
    }));
  }, [isAdmin]);

  const removeTeam = useCallback((teamId: string) => {
    if (!isAdmin) return;
    soundFx.playClick();
    setState(prev => ({
      ...prev,
      teams: prev.teams.filter(t => t.id !== teamId)
    }));
  }, [isAdmin]);

  // Proceed to Raffle Stage
  const startRaffleStage = useCallback(() => {
    if (!isAdmin) return;
    soundFx.playClick();
    setState(prev => ({
      ...prev,
      currentStage: 'raffle'
    }));
  }, [isAdmin]);

  // Complete Raffle & Build 11-Team Bracket
  const applySeededRaffleTeams = useCallback((seededTeams: Team[]) => {
    if (!isAdmin) return;
    soundFx.playRaffleReveal();
    const newMatches = generate11TeamBracket(seededTeams);
    setState(prev => ({
      ...prev,
      teams: seededTeams,
      matches: newMatches,
      currentStage: 'tournament',
      championTeamId: null,
      runnerUpTeamId: null,
      history: [...prev.history, { timestamp: new Date().toISOString(), action: 'Raffle Draw Completed & Bracket Initialized' }]
    }));
  }, [isAdmin]);

  // Select match for details/scorekeeping
  const selectMatch = useCallback((matchId: string | null) => {
    soundFx.playClick();
    setState(prev => ({ ...prev, selectedMatchId: matchId }));
  }, []);

  // Update Match Score & Advancement
  const updateMatchResult = useCallback((
    matchId: string, 
    score1: number, 
    score2: number, 
    winnerId?: string | null,
    isWalkover?: boolean
  ) => {
    if (!isAdmin) return;
    setState(prev => {
      const { updatedMatches, championId } = applyMatchResult(
        prev.matches, 
        matchId, 
        score1, 
        score2, 
        winnerId, 
        isWalkover
      );

      let runnerUpId = prev.runnerUpTeamId;
      if (matchId === 'GF_M1' && championId) {
        soundFx.playVictoryFanfare();
        const gf = updatedMatches['GF_M1'];
        runnerUpId = gf.team1?.id === championId ? gf.team2?.id || null : gf.team1?.id || null;
      }

      return {
        ...prev,
        matches: updatedMatches,
        championTeamId: championId || prev.championTeamId,
        runnerUpTeamId: runnerUpId,
        currentStage: championId ? 'champion' : prev.currentStage,
        history: [
          ...prev.history, 
          { 
            timestamp: new Date().toISOString(), 
            action: `Match ${matchId} updated: Score ${score1}-${score2}${winnerId ? ` (Winner: ${winnerId})` : ''}` 
          }
        ]
      };
    });
  }, [isAdmin]);

  // Set Best of (BO1, BO3, BO5) for a match
  const setMatchBestOf = useCallback((matchId: string, bestOf: number) => {
    if (!isAdmin) return;
    setState(prev => {
      const match = prev.matches[matchId];
      if (!match) return prev;
      return {
        ...prev,
        matches: {
          ...prev.matches,
          [matchId]: { ...match, bestOf }
        }
      };
    });
  }, [isAdmin]);

  // Reset Tournament
  const resetTournament = useCallback(() => {
    if (!isAdmin) return;
    soundFx.playClick();
    const initialTeams = [...DEFAULT_MLBB_TEAMS];
    const initialMatches = generate11TeamBracket([]);
    const freshState: TournamentState = {
      config: DEFAULT_CONFIG,
      teams: initialTeams,
      matches: initialMatches,
      currentStage: 'checkin',
      championTeamId: null,
      runnerUpTeamId: null,
      thirdPlaceTeamId: null,
      selectedMatchId: null,
      history: [{ timestamp: new Date().toISOString(), action: 'Tournament & Draw Reset' }]
    };
    setState(freshState);
  }, [isAdmin]);

  // Import JSON
  const importTournamentData = useCallback((importedState: TournamentState) => {
    if (!isAdmin) return;
    try {
      setState(importedState);
      soundFx.playRaffleReveal();
    } catch (e) {
      console.error('Import failed:', e);
    }
  }, [isAdmin]);

  // Set Stage directly (for navigation)
  const setStage = useCallback((stage: TournamentState['currentStage']) => {
    soundFx.playClick();
    setState(prev => ({ ...prev, currentStage: stage }));
  }, []);

  return {
    state,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    changePin,
    updateConfig,
    toggleCheckIn,
    addTeam,
    updateTeam,
    removeTeam,
    startRaffleStage,
    applySeededRaffleTeams,
    selectMatch,
    updateMatchResult,
    setMatchBestOf,
    resetTournament,
    importTournamentData,
    setStage,
  };
}
