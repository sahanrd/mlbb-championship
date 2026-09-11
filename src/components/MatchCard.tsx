import React from 'react';
import { Match, Team } from '../types/tournament';
import { Crown, Check, Clock, ChevronRight, Zap, Swords } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface MatchCardProps {
  match: Match;
  onSelectMatch: (matchId: string) => void;
  onQuickWinner: (matchId: string, winnerId: string) => void;
  onQuickWalkover: (matchId: string, winnerId: string) => void;
  isHighlighted?: boolean;
  isAdmin?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onSelectMatch,
  onQuickWinner,
  isHighlighted = false,
  isAdmin = false,
}) => {
  const isCompleted = match.status === 'completed' || match.status === 'walkover';
  const isLive = match.status === 'live';
  const hasBothTeams = match.team1 !== null && match.team2 !== null;

  const renderTeamRow = (team: Team | null, isTeam1: boolean) => {
    const score = isTeam1 ? match.score1 : match.score2;
    const isWinner = match.winnerId !== null && match.winnerId === team?.id;
    const isLoser = match.loserId !== null && match.loserId === team?.id;

    if (!team) {
      return (
        <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-zinc-950/40 border border-white/[0.03] text-zinc-600 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-800" />
            <span className="font-mono text-[11px] tracking-wide text-zinc-500">TBD (Awaiting Match)</span>
          </div>
          <span className="font-mono text-zinc-700">-</span>
        </div>
      );
    }

    return (
      <div
        onClick={(e) => {
          if (isAdmin && hasBothTeams && !isCompleted) {
            e.stopPropagation();
            soundFx.playClick();
            onQuickWinner(match.id, team.id);
          }
        }}
        className={`group/team relative flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-200 ${
          isWinner
            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-100 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]'
            : isLoser
            ? 'bg-zinc-950/40 border border-white/[0.02] text-zinc-500 opacity-60'
            : 'bg-zinc-950/70 border border-white/[0.05] text-zinc-200 hover:bg-white/[0.06] hover:border-white/[0.1]'
        } ${isAdmin && !isCompleted && hasBothTeams ? 'cursor-pointer hover:border-amber-500/30' : ''}`}
      >
        {/* Left Team Info */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {/* Team Seed Color Swatch */}
          <span 
            className="w-2 h-2 rounded-full shrink-0 shadow-sm" 
            style={{ backgroundColor: team.color || '#F59E0B' }}
          />

          {/* Team Tag Badge */}
          <span 
            className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 tracking-wider"
            style={{ 
              backgroundColor: `${team.color || '#F59E0B'}15`, 
              color: team.color || '#F59E0B',
              border: `1px solid ${team.color || '#F59E0B'}30` 
            }}
          >
            {team.tag}
          </span>

          <div className="min-w-0">
            <span className={`text-xs font-bold truncate block ${isWinner ? 'text-amber-200 font-bold' : 'text-zinc-100'}`}>
              {team.name}
            </span>
          </div>
        </div>

        {/* Right: Winner Crown & Score Box */}
        <div className="flex items-center gap-2 shrink-0">
          {isWinner && (
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          )}

          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg transition-all ${
            isWinner 
              ? 'bg-amber-500 text-zinc-950 shadow-glow-amber' 
              : isLive 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'bg-zinc-900 border border-white/[0.06] text-zinc-300'
          }`}>
            {score}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={() => onSelectMatch(match.id)}
      className={`relative group rounded-2xl p-3.5 transition-all duration-300 cursor-pointer ring-1 ring-inset ring-white/[0.05] ${
        isHighlighted
          ? 'ring-2 ring-cyan-400 bg-zinc-900/95 border border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.25)]'
          : isLive
          ? 'bg-gradient-to-b from-zinc-900/95 to-obsidian-950 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.15)]'
          : isCompleted
          ? 'bg-zinc-900/50 border border-white/[0.06] hover:border-white/[0.15] hover:bg-zinc-900/70'
          : 'bg-zinc-900/70 border border-white/[0.08] hover:border-amber-500/40 hover:bg-zinc-900/90 shadow-xl hover:-translate-y-0.5'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 truncate">
            {match.title}
          </span>
          <span className="text-[9px] font-mono font-bold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
            BO{match.bestOf}
          </span>
        </div>

        {/* Clean borderless status typography */}
        <div className="shrink-0">
          {match.status === 'live' && (
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-cyan-400">
              🔴 LIVE
            </span>
          )}
          {match.status === 'completed' && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> DONE
            </span>
          )}
          {match.status === 'walkover' && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-amber-400">
              WALKOVER
            </span>
          )}
          {match.status === 'upcoming' && (
            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-zinc-500">
              READY
            </span>
          )}
        </div>
      </div>

      {/* Teams Stack */}
      <div className="space-y-1.5">
        {renderTeamRow(match.team1, true)}
        {renderTeamRow(match.team2, false)}
      </div>

      {/* Match Footer */}
      <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span className="truncate">
          {match.stage === 'upper_r1' && 'Winner → R2 • Loser → Lower R1'}
          {match.stage === 'upper_r2' && 'Winner → Semi-Finals • Loser → Lower R1'}
          {match.stage === 'lower_r1' && 'Winner → Lower R2 • Loser → OUT'}
          {match.stage === 'lower_r2' && 'Winner → Lower Final • Loser → OUT'}
          {match.stage === 'lower_final' && 'Winner → Semi-Final Spot 4'}
          {match.stage === 'semi_final' && 'Winner → Grand Final 👑'}
          {match.stage === 'grand_final' && '👑 TOURNAMENT CHAMPIONSHIP'}
        </span>

        <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
          <span>{isAdmin ? 'Edit' : 'View'}</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>

    </div>
  );
};
