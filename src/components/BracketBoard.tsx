import React, { useState } from 'react';
import { Match, Team, TournamentConfig } from '../types/tournament';
import { MatchCard } from './MatchCard';
import { BroadcastBracketTree } from './BroadcastBracketTree';
import { 
  Trophy, 
  Swords, 
  ShieldAlert, 
  Crown, 
  Search, 
  Star, 
  Sparkles, 
  Flame, 
  Activity, 
  Radio, 
  Clock, 
  CheckCircle2,
  Tv,
  ChevronRight,
  Eye,
  GitBranch,
  ArrowRight,
  Workflow,
  Layers,
  RotateCcw
} from 'lucide-react';

interface BracketBoardProps {
  matches: Record<string, Match>;
  teams: Team[];
  config: TournamentConfig;
  onSelectMatch: (matchId: string) => void;
  onQuickWinner: (matchId: string, winnerId: string) => void;
  onQuickWalkover: (matchId: string, winnerId: string) => void;
  championTeam: Team | null;
  isAdmin?: boolean;
  onReset?: () => void;
}

export const BracketBoard: React.FC<BracketBoardProps> = ({
  matches,
  teams,
  config,
  onSelectMatch,
  onQuickWinner,
  onQuickWalkover,
  championTeam,
  isAdmin = false,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tree' | 'upper' | 'lower' | 'finals'>('all');
  const [treeViewMode, setTreeViewMode] = useState<'mpl' | 'columns'>('mpl');
  const [searchQuery, setSearchQuery] = useState('');
  const [spotlightId, setSpotlightId] = useState<string | null>(null);

  const totalMatches = Object.keys(matches).length;
  const completedMatches = Object.values(matches).filter(m => m.status === 'completed' || m.status === 'walkover').length;
  const liveMatches = Object.values(matches).filter(m => m.status === 'live');
  const readyPlayableMatches = Object.values(matches).filter(m => m.team1 && m.team2 && m.status !== 'completed' && m.status !== 'walkover');
  const progressPercent = Math.round((completedMatches / Math.max(1, totalMatches)) * 100);
  
  // If there are live matches, show all live matches. 
  // Otherwise, show ready matches from the active stage (e.g. Upper R1 has 5 parallel matches)
  const parallelMatches = liveMatches.length > 0 ? liveMatches : readyPlayableMatches.slice(0, 6);

  const isMatchHighlighted = (match?: Match) => {
    if (!match || !searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    const t1Match = match.team1?.name.toLowerCase().includes(query) || match.team1?.tag.toLowerCase().includes(query);
    const t2Match = match.team2?.name.toLowerCase().includes(query) || match.team2?.tag.toLowerCase().includes(query);
    return Boolean(t1Match || t2Match);
  };

  return (
    <div className="max-w-[1750px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* ======================================================== */}
      {/* 🔴 PARALLEL LIVE BATTLES: MULTI-ARENA BROADCAST HUB       */}
      {/* ======================================================== */}
      {parallelMatches.length > 0 && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-obsidian-950 via-zinc-900/90 to-obsidian-950 border border-white/[0.12] p-6 sm:p-8 shadow-[0_15px_60px_rgba(0,0,0,0.85)]">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mt-40" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mb-40" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white font-display flex items-center gap-2">
                    <span>PARALLEL LIVE BATTLES</span>
                    <span className="text-zinc-600 font-normal">•</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">SIMULTANEOUS ARENAS</span>
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real-time concurrent match monitoring across all live tournament tables & phones
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                {parallelMatches.length} Concurrent Battle{parallelMatches.length > 1 ? 's' : ''}
              </span>
              <span className="px-3 py-1 rounded-xl bg-zinc-950 border border-white/[0.08] text-xs font-mono text-zinc-400">
                {isAdmin ? 'Admin Live Scoring' : 'Spectator Sync Active'}
              </span>
            </div>
          </div>

          {/* Parallel Matches Responsive Grid */}
          <div className={`relative z-10 grid gap-5 ${
            parallelMatches.length === 1 
              ? 'grid-cols-1' 
              : parallelMatches.length === 2 
              ? 'grid-cols-1 lg:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {parallelMatches.map((m, idx) => {
              const isMatchLive = m.status === 'live';
              const isMatchFinished = m.status === 'completed' || m.status === 'walkover';
              const t1Won = m.winnerId === m.team1?.id;
              const t2Won = m.winnerId === m.team2?.id;

              return (
                <div 
                  key={m.id}
                  onClick={() => onSelectMatch(m.id)}
                  className={`group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer overflow-hidden border backdrop-blur-md ring-1 ring-inset ring-white/[0.05] ${
                    isMatchLive 
                      ? 'bg-zinc-950/80 border-cyan-500/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] ring-1 ring-cyan-500/30 hover:border-cyan-400' 
                      : isMatchFinished
                      ? 'bg-zinc-950/60 border-white/[0.06] hover:border-white/[0.15]'
                      : 'bg-zinc-950/70 border-white/[0.08] hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/[0.05]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] font-mono text-[10px] font-extrabold text-zinc-300">
                        ARENA {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-zinc-300 truncate">
                        {m.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                        BO{m.bestOf}
                      </span>
                      {isMatchLive ? (
                        <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-cyan-400">
                          🔴 LIVE
                        </span>
                      ) : isMatchFinished ? (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> DONE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-medium uppercase tracking-[0.15em] text-zinc-500">
                          READY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Teams Faceoff Grid */}
                  <div className="space-y-2.5">
                    
                    {/* Team 1 Row */}
                    <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      t1Won 
                        ? 'bg-amber-500/15 border border-amber-500/40 shadow-sm' 
                        : 'bg-zinc-900/70 border border-white/[0.04]'
                    }`}>
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                          style={{ backgroundColor: m.team1?.color || '#00F0FF' }}
                        />
                        <span 
                          className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 tracking-wider"
                          style={{ 
                            backgroundColor: `${m.team1?.color || '#00F0FF'}15`, 
                            color: m.team1?.color || '#00F0FF',
                            border: `1px solid ${m.team1?.color || '#00F0FF'}30` 
                          }}
                        >
                          {m.team1?.tag || 'T1'}
                        </span>
                        <div className="min-w-0">
                          <span className={`text-xs font-bold truncate block ${t1Won ? 'text-amber-200' : 'text-white'}`}>
                            {m.team1?.name || 'Awaiting Team'}
                          </span>
                          <span className="text-[10px] text-zinc-500 block truncate">
                            Cap: {m.team1?.captain || 'Lead'}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <span className={`font-mono text-lg font-black px-2.5 py-0.5 rounded-lg shrink-0 ${
                        t1Won 
                          ? 'bg-amber-500 text-zinc-950 shadow-glow-amber' 
                          : isMatchLive 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-zinc-950 border border-white/[0.06] text-white'
                      }`}>
                        {m.score1}
                      </span>
                    </div>

                    {/* Team 2 Row */}
                    <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      t2Won 
                        ? 'bg-amber-500/15 border border-amber-500/40 shadow-sm' 
                        : 'bg-zinc-900/70 border border-white/[0.04]'
                    }`}>
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                          style={{ backgroundColor: m.team2?.color || '#FFB800' }}
                        />
                        <span 
                          className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 tracking-wider"
                          style={{ 
                            backgroundColor: `${m.team2?.color || '#FFB800'}15`, 
                            color: m.team2?.color || '#FFB800',
                            border: `1px solid ${m.team2?.color || '#FFB800'}30` 
                          }}
                        >
                          {m.team2?.tag || 'T2'}
                        </span>
                        <div className="min-w-0">
                          <span className={`text-xs font-bold truncate block ${t2Won ? 'text-amber-200' : 'text-white'}`}>
                            {m.team2?.name || 'Awaiting Team'}
                          </span>
                          <span className="text-[10px] text-zinc-500 block truncate">
                            Cap: {m.team2?.captain || 'Lead'}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <span className={`font-mono text-lg font-black px-2.5 py-0.5 rounded-lg shrink-0 ${
                        t2Won 
                          ? 'bg-amber-500 text-zinc-950 shadow-glow-amber' 
                          : isMatchLive 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-zinc-950 border border-white/[0.06] text-white'
                      }`}>
                        {m.score2}
                      </span>
                    </div>

                  </div>

                  {/* Card Action Footer */}
                  <div className="mt-3.5 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    {isAdmin && m.team1 && m.team2 && !isMatchFinished ? (
                      <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onQuickWinner(m.id, m.team1!.id)}
                          className="flex-1 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold transition-all truncate"
                        >
                          Win: {m.team1.tag}
                        </button>
                        <button
                          onClick={() => onQuickWinner(m.id, m.team2!.id)}
                          className="flex-1 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-all truncate"
                        >
                          Win: {m.team2.tag}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300">
                        <span>{isAdmin ? 'Manage Live Scores' : 'Spectate Live Arena'}</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* TOURNAMENT STATS & VIEW FILTER BAR                       */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-obsidian-900 border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
        
        {/* Left Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-white/[0.08]">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">Tournament Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-white">{completedMatches} / {totalMatches} Matches</span>
                <span className="text-xs font-mono font-bold text-amber-400">({progressPercent}%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-white/[0.08] text-zinc-300 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAdmin ? 'Admin Mode (Click match to score)' : 'Live Viewer Mode (Realtime Sync Active)'}</span>
          </div>

          {isAdmin && onReset && (
            <button
              onClick={onReset}
              title="Reset all match scores and raffle draw"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/35 hover:bg-rose-500/25 hover:border-rose-500/60 text-rose-300 text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)] transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Reset Draw & Matches</span>
            </button>
          )}

          {championTeam && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-glow-amber">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Champions: {championTeam.name}</span>
            </div>
          )}
        </div>

        {/* Right Search & Stage Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter Team Path..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-zinc-950/80 border border-white/[0.08] rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 w-48 transition-all"
            />
          </div>

          <div className="flex items-center bg-zinc-950/80 p-1 rounded-xl border border-white/[0.06] overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Stages
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === 'tree' ? 'bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-purple-500/20 text-white border border-amber-500/40 shadow-glow-amber' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              <span>Panoramic Tree Map</span>
            </button>
            <button
              onClick={() => setActiveTab('upper')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'upper' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Upper Bracket
            </button>
            <button
              onClick={() => setActiveTab('lower')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'lower' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Lower Bracket
            </button>
            <button
              onClick={() => setActiveTab('finals')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'finals' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Finals Stage
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 🌐 FULL PANORAMIC BRACKET TREE MAP (VISUAL FLOW)          */}
      {/* ======================================================== */}
      {activeTab === 'tree' && (
        <section className="space-y-10 animate-in fade-in duration-300">
          
          {/* Panoramic Tree Guide Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-zinc-900/80 to-amber-950/40 border border-white/[0.1] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-glow-amber">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <span>PANORAMIC 11-TEAM TOURNAMENT TREE MAP</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Complete horizontal visual progression: Upper Winners Path $\rightarrow$ Lower Elimination Path $\rightarrow$ Semi-Finals $\rightarrow$ 🏆 Championship
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-zinc-950/90 p-1 rounded-xl border border-white/[0.1]">
                <button
                  onClick={() => setTreeViewMode('mpl')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    treeViewMode === 'mpl' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                  <span>MPL Broadcast Flow</span>
                </button>
                <button
                  onClick={() => setTreeViewMode('columns')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    treeViewMode === 'columns' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Stage Columns</span>
                </button>
              </div>

              <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                19 Matches Total
              </span>
            </div>
          </div>

          {/* MPL Flowchart Tree View */}
          {treeViewMode === 'mpl' ? (
            <div className="rounded-3xl bg-zinc-950/80 border border-white/[0.08] backdrop-blur-xl shadow-2xl p-4 sm:p-6 overflow-hidden">
              <BroadcastBracketTree
                matches={matches}
                teams={teams}
                config={config}
                onSelectMatch={onSelectMatch}
                championTeam={championTeam}
                isAdmin={isAdmin}
              />
            </div>
          ) : (
            <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan" />
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-cyan-300 font-display">
                  1. Upper Bracket Stream (Winners Path)
                </h4>
              </div>
              <span className="text-xs text-zinc-500 font-mono">3 Direct Qualifiers into Semi-Finals</span>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="flex items-start gap-6 min-w-[1100px]">
                
                {/* Col 1: Upper Round 1 */}
                <div className="w-[340px] shrink-0 space-y-3">
                  <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold font-mono text-center">
                    Upper Round 1 (5 Matches • BO1)
                  </div>
                  <MatchCard match={matches['UR1_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M1'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['UR1_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M2'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['UR1_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M3'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['UR1_M4']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M4'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['UR1_M5']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M5'])} isAdmin={isAdmin} />
                </div>

                {/* Col 2: Upper Round 2 & Slot 11 Bye */}
                <div className="w-[340px] shrink-0 space-y-3 pt-6">
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold font-mono text-center">
                    Upper Round 2 (Quarterfinals • BO3)
                  </div>
                  <MatchCard match={matches['UR2_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR2_M1'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['UR2_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR2_M2'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['UR2_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR2_M3'])} isAdmin={isAdmin} />
                  
                  {/* Slot 11 Bye Indicator */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                    <span>Slot 11 Bye seeded directly into Upper Round 2 Match 8!</span>
                  </div>
                </div>

                {/* Col 3: Direct Semi Qualifiers */}
                <div className="w-[320px] shrink-0 space-y-3 pt-12">
                  <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold font-mono text-center">
                    Direct Semi-Final Qualifiers (3/4)
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-purple-500/30 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
                      <span className="text-zinc-400">Winner UR2-M1:</span>
                      <strong className="text-cyan-300 font-mono">{matches['UR2_M1'].winnerId ? teams.find(t => t.id === matches['UR2_M1'].winnerId)?.name : 'TBD (Qual 1)'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
                      <span className="text-zinc-400">Winner UR2-M2:</span>
                      <strong className="text-cyan-300 font-mono">{matches['UR2_M2'].winnerId ? teams.find(t => t.id === matches['UR2_M2'].winnerId)?.name : 'TBD (Qual 2)'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Winner UR2-M3:</span>
                      <strong className="text-cyan-300 font-mono">{matches['UR2_M3'].winnerId ? teams.find(t => t.id === matches['UR2_M3'].winnerId)?.name : 'TBD (Qual 3)'}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* 2. LOWER BRACKET HORIZONTAL STREAM */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-glow-amber" />
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300 font-display">
                  2. Lower Bracket Stream (Elimination Path)
                </h4>
              </div>
              <span className="text-xs text-zinc-500 font-mono">1 Final Qualifier into Semi-Final Spot 4</span>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="flex items-start gap-6 min-w-[1400px]">
                
                {/* Col 1: Lower Round 1 */}
                <div className="w-[340px] shrink-0 space-y-3">
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold font-mono text-center">
                    Lower Round 1 (4 Matches • BO1)
                  </div>
                  <MatchCard match={matches['LR1_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR1_M1'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['LR1_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR1_M2'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['LR1_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR1_M3'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['LR1_M4']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR1_M4'])} isAdmin={isAdmin} />
                </div>

                {/* Col 2: Lower Round 2 */}
                <div className="w-[340px] shrink-0 space-y-3 pt-6">
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold font-mono text-center">
                    Lower Round 2 (2 Matches • BO1)
                  </div>
                  <MatchCard match={matches['LR2_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR2_M1'])} isAdmin={isAdmin} />
                  <MatchCard match={matches['LR2_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR2_M2'])} isAdmin={isAdmin} />
                </div>

                {/* Col 3: Lower Final */}
                <div className="w-[340px] shrink-0 space-y-3 pt-12">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono text-center">
                    Lower Final Decider (BO3)
                  </div>
                  <MatchCard match={matches['LRF_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LRF_M1'])} isAdmin={isAdmin} />
                </div>

                {/* Col 4: Lower Qualifier Ticket */}
                <div className="w-[300px] shrink-0 space-y-3 pt-16">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-zinc-950 to-zinc-950 border border-emerald-500/40 text-center space-y-2 shadow-lg">
                    <Crown className="w-6 h-6 text-emerald-400 mx-auto" />
                    <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300 block">
                      Semi-Final Ticket 4/4
                    </span>
                    <h5 className="text-sm font-bold text-white font-mono truncate">
                      {matches['LRF_M1'].winnerId ? teams.find(t => t.id === matches['LRF_M1'].winnerId)?.name : 'Awaiting Lower Winner'}
                    </h5>
                    <p className="text-[11px] text-zinc-400">
                      Advances to Semi-Final 2 to challenge Upper Qualifier 3!
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* 3. FINALS ARENA STREAM */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-glow-purple" />
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-purple-300 font-display">
                  3. Championship Arena (Semi-Finals & Grand Final)
                </h4>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Grand Final BO5 Championship</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Semi-Finals */}
              <div className="space-y-3">
                <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold font-mono text-center">
                  Semi-Finals (2 Matches • BO3)
                </div>
                <MatchCard match={matches['SF_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['SF_M1'])} isAdmin={isAdmin} />
                <MatchCard match={matches['SF_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['SF_M2'])} isAdmin={isAdmin} />
              </div>

              {/* Finals (Grand Final & 3rd Place) */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono text-center">
                    Grand Final (Match 19 • BO5)
                  </div>
                  <div className="p-1 rounded-2xl bg-gradient-to-br from-amber-500/40 via-purple-500/30 to-amber-500/40 shadow-glow-gold">
                    <MatchCard match={matches['GF_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['GF_M1'])} isAdmin={isAdmin} />
                  </div>
                </div>

                {matches['TP_M1'] && (
                  <div className="space-y-2">
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5">
                      <span>3rd Place Match (Match 18 • BO3)</span>
                    </div>
                    <MatchCard match={matches['TP_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['TP_M1'])} isAdmin={isAdmin} />
                  </div>
                )}
              </div>

              {/* Champion Podium */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-zinc-950 to-amber-500/10 border border-amber-500/40 text-center space-y-3 shadow-2xl">
                <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                <div>
                  <span className="text-xs uppercase tracking-widest font-extrabold text-amber-300 block">
                    🏆 2026 MLBB CHAMPIONS
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

        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: UPPER BRACKET (WINNERS PATH)                  */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'upper') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan">
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <span>UPPER BRACKET (WINNERS PATH)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Round 1 (5 Matches + 1 Bye) $\rightarrow$ Round 2 (3 Matches) $\rightarrow$ <span className="text-amber-400 font-semibold">3 Winners advance directly to Semi-Finals (Spots 1, 2, 3/4)!</span>
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold">
              3 Semi-Final Spots (3/4)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Upper Round 1 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Upper Round 1 (10 Teams + 1 Bye)
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">5 Matches • BO1</span>
              </div>

              <div className="space-y-3.5">
                <MatchCard match={matches['UR1_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M1'])} isAdmin={isAdmin} />
                <MatchCard match={matches['UR1_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M2'])} isAdmin={isAdmin} />
                <MatchCard match={matches['UR1_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M3'])} isAdmin={isAdmin} />
                <MatchCard match={matches['UR1_M4']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M4'])} isAdmin={isAdmin} />
                <MatchCard match={matches['UR1_M5']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR1_M5'])} isAdmin={isAdmin} />

                {/* Slot 11 Bye Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900/60 to-zinc-950 border border-amber-500/30 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-300 font-mono">[SLOT 11]</span>
                        <span className="text-xs font-bold text-white">
                          {matches['UR2_M3'].team2?.name || 'Raffle Slot 11 Team'}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400">Awarded Round 1 BYE → Directly seeded into Upper Round 2 (Match 8)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    BYE ADVANCE
                  </span>
                </div>
              </div>
            </div>

            {/* Upper Round 2 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Upper Round 2 (Quarterfinals - 6 Teams)
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">3 Matches • BO3</span>
              </div>

              <div className="space-y-4 pt-4">
                <MatchCard match={matches['UR2_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR2_M1'])} isAdmin={isAdmin} />
                <MatchCard match={matches['UR2_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR2_M2'])} isAdmin={isAdmin} />
                <MatchCard match={matches['UR2_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['UR2_M3'])} isAdmin={isAdmin} />
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: LOWER BRACKET (REDEMPTION PATH)               */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'lower') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-glow-amber">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <span>LOWER BRACKET (REDEMPTION PATH)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  8 Teams (5 Upper R1 Losers + 3 Upper R2 Losers) $\rightarrow$ 4 Matches $\rightarrow$ 2 Matches $\rightarrow$ <span className="text-emerald-400 font-semibold">Lower Final Winner takes Semi-Final Spot 4 (4/4)!</span>
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold">
              1 Semi-Final Spot (Spot 4/4)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Lower Round 1 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Lower Round 1 (8 Teams)
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">4 Matches • BO1</span>
              </div>

              <div className="space-y-3">
                <MatchCard match={matches['LR1_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR1_M1'])} isAdmin={isAdmin} />
                <MatchCard match={matches['LR1_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR1_M2'])} isAdmin={isAdmin} />
                <MatchCard match={matches['LR1_M3']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR1_M3'])} isAdmin={isAdmin} />
                <MatchCard match={matches['LR1_M4']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR1_M4'])} isAdmin={isAdmin} />
              </div>
            </div>

            {/* Lower Round 2 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Lower Round 2 (4 Teams)
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">2 Matches • BO1</span>
              </div>

              <div className="space-y-4 pt-6">
                <MatchCard match={matches['LR2_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR2_M1'])} isAdmin={isAdmin} />
                <MatchCard match={matches['LR2_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LR2_M2'])} isAdmin={isAdmin} />
              </div>
            </div>

            {/* Lower Final */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Lower Final (Decider)</span>
                </h4>
                <span className="text-[11px] font-mono font-bold text-emerald-400">BO3</span>
              </div>

              <div className="space-y-4 pt-14">
                <div className="p-1 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-amber-500/20 to-emerald-500/30">
                  <MatchCard match={matches['LRF_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['LRF_M1'])} isAdmin={isAdmin} />
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/[0.06] text-xs text-zinc-400">
                  <span className="text-emerald-400 font-bold block mb-1">🌟 Semi-Final Ticket:</span>
                  Winner of Lower Final qualifies directly for <strong className="text-white">Semi-Final 2</strong> as the 4th Semi-Finalist!
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: SEMI-FINALS & GRAND FINAL                     */}
      {/* ======================================================== */}
      {(activeTab === 'all' || activeTab === 'finals') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-glow-purple">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <span>SEMI-FINALS & GRAND FINAL</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  4 Teams (3 Upper Winners + 1 Lower Finalist) $\rightarrow$ 2 Semi-Finals $\rightarrow$ <span className="text-amber-400 font-semibold">Grand Final Championship Showdown!</span>
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-mono font-bold">
              Grand Final BO5
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Semi-Finals */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Semi-Finals (4 Teams)
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">2 Matches • BO3</span>
              </div>

              <div className="space-y-4">
                <MatchCard match={matches['SF_M1']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['SF_M1'])} isAdmin={isAdmin} />
                <MatchCard match={matches['SF_M2']} onSelectMatch={onSelectMatch} onQuickWinner={onQuickWinner} onQuickWalkover={onQuickWalkover} isHighlighted={isMatchHighlighted(matches['SF_M2'])} isAdmin={isAdmin} />
              </div>
            </div>

            {/* Grand Final & 3rd Place Playoff */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Grand Final Championship (Match 19)</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-amber-400">BO5 CHAMPIONSHIP</span>
                </div>

                <div className="relative p-1 rounded-3xl bg-gradient-to-br from-amber-500/40 via-purple-500/30 to-amber-500/40 shadow-glow-gold">
                  <div className="rounded-[22px] bg-zinc-950 p-6">
                    <MatchCard 
                      match={matches['GF_M1']} 
                      onSelectMatch={onSelectMatch} 
                      onQuickWinner={onQuickWinner} 
                      onQuickWalkover={onQuickWalkover} 
                      isHighlighted={isMatchHighlighted(matches['GF_M1'])} 
                      isAdmin={isAdmin}
                    />

                    {championTeam && (
                      <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-amber-500/20 border border-amber-500/40 text-center animate-pulse-subtle">
                        <Crown className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                        <span className="text-xs uppercase tracking-widest font-extrabold text-amber-300 block">
                          TOURNAMENT CHAMPIONS
                        </span>
                        <h3 className="text-3xl font-black text-white font-display mt-1">
                          {championTeam.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 font-mono">
                          TAG: [{championTeam.tag}] • CAPTAIN: {championTeam.captain || 'LEAD'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3rd Place Match */}
              {matches['TP_M1'] && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-500/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <span>3rd Place Match (Match 18)</span>
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-amber-400">BO3</span>
                  </div>
                  <MatchCard 
                    match={matches['TP_M1']} 
                    onSelectMatch={onSelectMatch} 
                    onQuickWinner={onQuickWinner} 
                    onQuickWalkover={onQuickWalkover} 
                    isHighlighted={isMatchHighlighted(matches['TP_M1'])} 
                    isAdmin={isAdmin}
                  />
                </div>
              )}
            </div>

          </div>
        </section>
      )}

    </div>
  );
};
