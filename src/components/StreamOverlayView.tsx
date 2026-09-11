import React, { useState } from 'react';
import { TournamentConfig, Match, Team } from '../types/tournament';
import { Radio, X, Trophy, Swords, Crown, Star, Flame, Maximize2, GitBranch, LayoutGrid } from 'lucide-react';
import { MatchCard } from './MatchCard';
import { BroadcastBracketTree } from './BroadcastBracketTree';

interface StreamOverlayViewProps {
  config: TournamentConfig;
  matches: Record<string, Match>;
  teams?: Team[];
  onClose: () => void;
  onSelectMatch: (matchId: string) => void;
  onQuickWinner: (matchId: string, winnerId: string) => void;
  onQuickWalkover: (matchId: string, winnerId: string) => void;
  championTeam?: Team | null;
}

export const StreamOverlayView: React.FC<StreamOverlayViewProps> = ({
  config,
  matches,
  teams = [],
  onClose,
  onSelectMatch,
  onQuickWinner,
  onQuickWalkover,
  championTeam,
}) => {
  const [viewType, setViewType] = useState<'mpl-tree' | 'stage-grid'>('mpl-tree');

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const allTeams = teams.length > 0 
    ? teams 
    : Object.values(matches).flatMap(m => [m.team1, m.team2].filter(Boolean) as Team[]);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-[#060709] text-zinc-100 transition-colors duration-200">
      
      {/* ======================================================== */}
      {/* 🔴 LIVE BROADCAST CONTROL BAR                             */}
      {/* ======================================================== */}
      <div className="max-w-[1750px] mx-auto mb-6 p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-white/[0.1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400 font-mono">
                🔴 LIVE STREAM BROADCAST DISPLAY
              </span>
              <span className="text-zinc-600 text-xs">•</span>
              <span className="text-[10px] font-mono text-zinc-400">REALTIME CLOUD SYNC ACTIVE</span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight font-display">
              {config.title}
            </h2>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Format Toggle */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setViewType('mpl-tree')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewType === 'mpl-tree' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>MPL Tree</span>
            </button>
            <button
              onClick={() => setViewType('stage-grid')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewType === 'stage-grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Stage Columns</span>
            </button>
          </div>


          <button
            onClick={onClose}
            title="Exit Live Stream Mode"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all ml-1"
          >
            <X className="w-4 h-4" />
            <span>Exit Live</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🌐 PANORAMIC TOURNAMENT BRACKET DISPLAY                   */}
      {/* ======================================================== */}
      {viewType === 'mpl-tree' ? (
        <div className="max-w-[1750px] mx-auto overflow-hidden">
          <BroadcastBracketTree
            matches={matches}
            teams={allTeams}
            config={config}
            onSelectMatch={onSelectMatch}
            championTeam={championTeam}
          />
        </div>
      ) : (
        <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
        <div className="min-w-[1700px] flex items-stretch gap-6 px-2">
          
          {/* ---------------------------------------------------- */}
          {/* STAGE 1: ROUND 1 (UPPER R1 + LOWER R1)              */}
          {/* ---------------------------------------------------- */}
          <div className="w-[330px] shrink-0 flex flex-col justify-between space-y-6">
            
            {/* Upper Round 1 */}
            <div className="p-4 rounded-3xl bg-zinc-950/80 border border-cyan-500/20 backdrop-blur-md shadow-xl space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <div className="flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 font-display">
                    Upper Round 1 (BO1)
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500">5 MATCHES</span>
              </div>

              <div className="space-y-2">
                <MatchCard match={matches['UR1_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['UR1_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['UR1_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['UR1_M4']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['UR1_M5']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
              </div>

              {/* Slot 11 Bye */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[11px] text-amber-300">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  <span className="truncate">Slot 11: <strong>{matches['UR2_M3'].team2?.name || 'Slot 11 Team'}</strong></span>
                </div>
                <span className="font-mono text-[9px] font-bold shrink-0 bg-amber-500/20 px-1.5 py-0.5 rounded">BYE</span>
              </div>
            </div>

            {/* Lower Round 1 */}
            <div className="p-4 rounded-3xl bg-zinc-950/80 border border-amber-500/20 backdrop-blur-md shadow-xl space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 font-display">
                    Lower Round 1 (BO1)
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500">4 MATCHES</span>
              </div>

              <div className="space-y-2">
                <MatchCard match={matches['LR1_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['LR1_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['LR1_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['LR1_M4']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
              </div>
            </div>

          </div>

          {/* ---------------------------------------------------- */}
          {/* STAGE 2: ROUND 2 (UPPER R2 + LOWER R2)              */}
          {/* ---------------------------------------------------- */}
          <div className="w-[330px] shrink-0 flex flex-col justify-between space-y-6 pt-4">
            
            {/* Upper Round 2 */}
            <div className="p-4 rounded-3xl bg-zinc-950/80 border border-cyan-500/20 backdrop-blur-md shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 font-display">
                  Upper Round 2 (BO3)
                </span>
                <span className="text-[9px] font-mono text-cyan-400">QUARTERFINALS</span>
              </div>

              <div className="space-y-3">
                <MatchCard match={matches['UR2_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['UR2_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['UR2_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-300 font-mono">
                ⚡ 3 Winners Advance Directly to Semi-Finals!
              </div>
            </div>

            {/* Lower Round 2 */}
            <div className="p-4 rounded-3xl bg-zinc-950/80 border border-amber-500/20 backdrop-blur-md shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 font-display">
                  Lower Round 2 (BO1)
                </span>
                <span className="text-[9px] font-mono text-zinc-500">2 MATCHES</span>
              </div>

              <div className="space-y-3">
                <MatchCard match={matches['LR2_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['LR2_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
              </div>
            </div>

          </div>

          {/* ---------------------------------------------------- */}
          {/* STAGE 3: LOWER FINAL DECIDER & QUALIFIERS           */}
          {/* ---------------------------------------------------- */}
          <div className="w-[330px] shrink-0 flex flex-col justify-between space-y-6 pt-10">
            
            {/* Direct Upper Semi Qualifiers Hub */}
            <div className="p-5 rounded-3xl bg-zinc-950/80 border border-purple-500/30 backdrop-blur-md shadow-xl space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 font-display block pb-2 border-b border-purple-500/20">
                Upper Qualifiers (Spots 1, 2, 3)
              </span>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.04] flex items-center justify-between">
                  <span className="text-zinc-400">UR2-M1 Winner:</span>
                  <strong className="text-cyan-300 font-mono">{matches['UR2_M1'].winnerId ? (matches['UR2_M1'].winnerId === matches['UR2_M1'].team1?.id ? matches['UR2_M1'].team1?.name : matches['UR2_M1'].team2?.name) : 'TBD (Qual 1)'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.04] flex items-center justify-between">
                  <span className="text-zinc-400">UR2-M2 Winner:</span>
                  <strong className="text-cyan-300 font-mono">{matches['UR2_M2'].winnerId ? (matches['UR2_M2'].winnerId === matches['UR2_M2'].team1?.id ? matches['UR2_M2'].team1?.name : matches['UR2_M2'].team2?.name) : 'TBD (Qual 2)'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.04] flex items-center justify-between">
                  <span className="text-zinc-400">UR2-M3 Winner:</span>
                  <strong className="text-cyan-300 font-mono">{matches['UR2_M3'].winnerId ? (matches['UR2_M3'].winnerId === matches['UR2_M3'].team1?.id ? matches['UR2_M3'].team1?.name : matches['UR2_M3'].team2?.name) : 'TBD (Qual 3)'}</strong>
                </div>
              </div>
            </div>

            {/* Lower Final Decider */}
            <div className="p-5 rounded-3xl bg-zinc-950/80 border border-emerald-500/30 backdrop-blur-md shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-display">
                  Lower Final (BO3 Decider)
                </span>
                <span className="text-[9px] font-mono text-emerald-300">TICKET 4/4</span>
              </div>

              <div className="p-1 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-amber-500/20 to-emerald-500/30">
                <MatchCard match={matches['LRF_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
              </div>

              <p className="text-[11px] text-zinc-400 text-center">
                Winner qualifies as the <strong className="text-emerald-300">4th Semi-Finalist</strong>!
              </p>
            </div>

          </div>

          {/* ---------------------------------------------------- */}
          {/* STAGE 4: SEMI-FINALS                                */}
          {/* ---------------------------------------------------- */}
          <div className="w-[330px] shrink-0 flex flex-col justify-center space-y-4 pt-12">
            <div className="p-5 rounded-3xl bg-zinc-950/90 border border-purple-500/40 backdrop-blur-xl shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-purple-300 font-display">
                    Semi-Finals (BO3)
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-400">4 TEAMS</span>
              </div>

              <div className="space-y-3">
                <MatchCard match={matches['SF_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
                <MatchCard match={matches['SF_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center text-[10px] text-purple-300 font-mono">
                🏆 Winners Advance to Grand Final Championship
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* STAGE 5: GRAND FINAL & 🏆 CHAMPIONS PODIUM           */}
          {/* ---------------------------------------------------- */}
          <div className="w-[360px] shrink-0 flex flex-col justify-center space-y-4 pt-12">
            
            {/* Grand Final Card */}
            <div className="p-5 rounded-3xl bg-zinc-950/90 border border-amber-500/40 backdrop-blur-xl shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 font-display">
                    Grand Final (BO5)
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-amber-400">CHAMPIONSHIP</span>
              </div>

              <div className="p-1 rounded-2xl bg-gradient-to-br from-amber-500/40 via-purple-500/30 to-amber-500/40 shadow-glow-gold">
                <MatchCard match={matches['GF_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isAdmin={false} />
              </div>
            </div>

            {/* 🏆 Champion Podium Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-zinc-950 to-amber-500/10 border border-amber-500/40 text-center space-y-3 shadow-2xl backdrop-blur-md">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-300 block">
                  🏆 TOURNAMENT CHAMPIONS
                </span>
                <h3 className="text-2xl font-black text-white font-display mt-1">
                  {championTeam ? championTeam.name : 'Awaiting Grand Final'}
                </h3>
                {championTeam && (
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    TAG: [{championTeam.tag}] • CAPTAIN: {championTeam.captain || 'LEAD'}
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
      )}

    </div>
  );
};
