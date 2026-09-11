import React, { useState, useEffect } from 'react';
import { Match, Team } from '../types/tournament';
import { 
  X, 
  Crown, 
  RotateCcw, 
  Swords, 
  CheckCircle2, 
  AlertTriangle,
  Plus, 
  Minus,
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface MatchScoreModalProps {
  match: Match | null;
  onClose: () => void;
  onUpdateMatchResult: (
    matchId: string, 
    score1: number, 
    score2: number, 
    winnerId?: string | null,
    isWalkover?: boolean
  ) => void;
  onSetBestOf: (matchId: string, bestOf: number) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const MatchScoreModal: React.FC<MatchScoreModalProps> = ({
  match,
  onClose,
  onUpdateMatchResult,
  onSetBestOf,
  isAdmin = false,
  onOpenAdminLogin,
}) => {
  if (!match) return null;

  const [score1, setScore1] = useState(match.score1);
  const [score2, setScore2] = useState(match.score2);
  const [bestOf, setBestOf] = useState(match.bestOf);

  useEffect(() => {
    setScore1(match.score1);
    setScore2(match.score2);
    setBestOf(match.bestOf);
  }, [match]);

  const handleScoreChange = (isTeam1: boolean, delta: number) => {
    soundFx.playClick();
    if (isTeam1) {
      setScore1(prev => Math.max(0, prev + delta));
    } else {
      setScore2(prev => Math.max(0, prev + delta));
    }
  };

  const handleBestOfChange = (bo: number) => {
    soundFx.playClick();
    setBestOf(bo);
    onSetBestOf(match.id, bo);
  };

  const handleDeclareWinner = (winnerTeam: Team | null, isWalkover = false) => {
    if (!winnerTeam) return;
    soundFx.playClick();
    
    // Auto adjust scores if 0
    let finalS1 = score1;
    let finalS2 = score2;
    const winsNeeded = Math.ceil(bestOf / 2);

    if (winnerTeam.id === match.team1?.id) {
      if (finalS1 < winsNeeded && !isWalkover) finalS1 = winsNeeded;
    } else {
      if (finalS2 < winsNeeded && !isWalkover) finalS2 = winsNeeded;
    }

    onUpdateMatchResult(match.id, finalS1, finalS2, winnerTeam.id, isWalkover);
    onClose();
  };

  const handleSaveLiveScores = () => {
    soundFx.playClick();
    onUpdateMatchResult(match.id, score1, score2, null, false);
    onClose();
  };

  const handleResetMatch = () => {
    soundFx.playClick();
    onUpdateMatchResult(match.id, 0, 0, null, false);
    setScore1(0);
    setScore2(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-zinc-900 border border-white/[0.1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-zinc-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-amber-400">
                {match.roundName}
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-[10px] font-medium text-zinc-400 uppercase">
                Match #{match.matchNumber}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              {match.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Format Settings / Badge */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/50 border border-white/[0.05]">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Series Format:</span>
            </span>

            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                {[1, 3, 5].map((bo) => (
                  <button
                    key={bo}
                    onClick={() => handleBestOfChange(bo)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      bestOf === bo
                        ? 'bg-amber-500 text-zinc-950 shadow-glow-amber'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    BO{bo}
                  </button>
                ))}
              </div>
            ) : (
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                BEST OF {match.bestOf} ({Math.ceil(match.bestOf / 2)} WINS NEEDED)
              </span>
            )}
          </div>

          {/* Teams Faceoff & Scoring HUD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Team 1 Box */}
            <div className={`p-5 rounded-2xl border transition-all ${
              match.winnerId === match.team1?.id
                ? 'bg-amber-500/15 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                : 'bg-zinc-950/70 border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3.5 h-3.5 rounded-full shadow-sm" 
                    style={{ backgroundColor: match.team1?.color || '#00F0FF' }} 
                  />
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    [{match.team1?.tag || 'TBD'}]
                  </span>
                </div>
                {match.winnerId === match.team1?.id && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                    <Crown className="w-3 h-3" /> Winner
                  </span>
                )}
              </div>

              <h4 className="text-lg font-black text-white mb-1 truncate">
                {match.team1?.name || 'Awaiting Team'}
              </h4>
              <p className="text-xs text-zinc-400 mb-4">
                Captain: <strong className="text-zinc-200">{match.team1?.captain || 'Unassigned'}</strong>
              </p>

              {isAdmin ? (
                <>
                  {/* Score Control */}
                  <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-xl border border-white/[0.06] mb-4">
                    <button
                      onClick={() => handleScoreChange(true, -1)}
                      disabled={!match.team1}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-2xl font-bold font-mono text-white">{score1}</span>
                    <button
                      onClick={() => handleScoreChange(true, 1)}
                      disabled={!match.team1}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Declare Win */}
                  <button
                    onClick={() => handleDeclareWinner(match.team1)}
                    disabled={!match.team1}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-amber disabled:opacity-30 transition-all"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Declare Winner</span>
                  </button>

                  {/* Walkover */}
                  <button
                    onClick={() => handleDeclareWinner(match.team1, true)}
                    disabled={!match.team1}
                    className="w-full mt-2 py-1.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 text-zinc-400 hover:text-amber-300 border border-white/[0.04] text-[11px] font-semibold disabled:opacity-30 transition-all"
                  >
                    Award Walkover (W/O)
                  </button>
                </>
              ) : (
                /* Spectator Score HUD */
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Score</span>
                  <span className={`text-3xl font-black font-mono px-3 py-1 rounded-lg ${
                    match.score1 > match.score2 
                      ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40' 
                      : 'text-white'
                  }`}>
                    {match.score1}
                  </span>
                </div>
              )}
            </div>

            {/* Team 2 Box */}
            <div className={`p-5 rounded-2xl border transition-all ${
              match.winnerId === match.team2?.id
                ? 'bg-amber-500/15 border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
                : 'bg-zinc-950/70 border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3.5 h-3.5 rounded-full shadow-sm" 
                    style={{ backgroundColor: match.team2?.color || '#FFB800' }} 
                  />
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    [{match.team2?.tag || 'TBD'}]
                  </span>
                </div>
                {match.winnerId === match.team2?.id && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                    <Crown className="w-3 h-3" /> Winner
                  </span>
                )}
              </div>

              <h4 className="text-lg font-black text-white mb-1 truncate">
                {match.team2?.name || 'Awaiting Team'}
              </h4>
              <p className="text-xs text-zinc-400 mb-4">
                Captain: <strong className="text-zinc-200">{match.team2?.captain || 'Unassigned'}</strong>
              </p>

              {isAdmin ? (
                <>
                  {/* Score Control */}
                  <div className="flex items-center justify-between bg-zinc-900 p-2 rounded-xl border border-white/[0.06] mb-4">
                    <button
                      onClick={() => handleScoreChange(false, -1)}
                      disabled={!match.team2}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-2xl font-bold font-mono text-white">{score2}</span>
                    <button
                      onClick={() => handleScoreChange(false, 1)}
                      disabled={!match.team2}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Declare Win */}
                  <button
                    onClick={() => handleDeclareWinner(match.team2)}
                    disabled={!match.team2}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-amber disabled:opacity-30 transition-all"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Declare Winner</span>
                  </button>

                  {/* Walkover */}
                  <button
                    onClick={() => handleDeclareWinner(match.team2, true)}
                    disabled={!match.team2}
                    className="w-full mt-2 py-1.5 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 text-zinc-400 hover:text-amber-300 border border-white/[0.04] text-[11px] font-semibold disabled:opacity-30 transition-all"
                  >
                    Award Walkover (W/O)
                  </button>
                </>
              ) : (
                /* Spectator Score HUD */
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Score</span>
                  <span className={`text-3xl font-black font-mono px-3 py-1 rounded-lg ${
                    match.score2 > match.score1 
                      ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40' 
                      : 'text-white'
                  }`}>
                    {match.score2}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Spectator Match Progression & Routing Details */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/[0.05] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Match Status:</span>
              <span className="font-bold">
                {match.status === 'completed' && <span className="text-emerald-400">Concluded</span>}
                {match.status === 'live' && <span className="text-cyan-400 animate-pulse">🔴 Live In Progress</span>}
                {match.status === 'upcoming' && <span className="text-zinc-300">Upcoming Battle</span>}
                {match.status === 'walkover' && <span className="text-amber-400">Walkover (W/O)</span>}
              </span>
            </div>

            {match.nextMatchId && (
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.04]">
                <span className="text-zinc-500">Winner Advances To:</span>
                <span className="text-cyan-300 font-mono font-semibold">Match #{match.nextMatchId}</span>
              </div>
            )}

            {match.loserMatchId && (
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.04]">
                <span className="text-zinc-500">Loser Drops To:</span>
                <span className="text-amber-300/80 font-mono font-semibold">Lower Bracket #{match.loserMatchId}</span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/[0.08] bg-zinc-950/80">
          {isAdmin ? (
            <>
              <button
                onClick={handleResetMatch}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Match Result</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveLiveScores}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs shadow-glow-cyan transition-all"
                >
                  Save Live Scores
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Spectator Mode (Realtime Live Sync)</span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenAdminLogin && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminLogin();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
                  >
                    Admin Login
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-all"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
