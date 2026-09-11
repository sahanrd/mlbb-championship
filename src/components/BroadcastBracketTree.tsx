import React, { useState, useEffect, useRef } from 'react';
import { Match, Team, TournamentConfig } from '../types/tournament';
import { Trophy, Crown, Flame, Swords, Shield, ChevronRight, CheckCircle2, Maximize2, Minimize2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface BroadcastBracketTreeProps {
  matches: Record<string, Match>;
  teams: Team[];
  config: TournamentConfig;
  onSelectMatch: (matchId: string) => void;
  championTeam?: Team | null;
  isAdmin?: boolean;
}

// ---------------------------------------------------------------------------
// Precision MLBB Match Node Card (Exact 200px x 64px, Center Y = top + 32px)
// ---------------------------------------------------------------------------
export const AbsoluteMatchCard: React.FC<{
  match?: Match;
  matchLabel: string;
  fallbackT1?: string;
  fallbackT2?: string;
  accent?: 'cyan' | 'purple' | 'gold' | 'emerald';
  isBye?: boolean;
  onSelectMatch: (matchId: string) => void;
  style?: React.CSSProperties;
}> = ({ match, matchLabel, fallbackT1 = 'TBD', fallbackT2 = 'TBD', accent = 'cyan', isBye = false, onSelectMatch, style }) => {
  if (isBye) {
    const isAssigned = Boolean(fallbackT1 && !fallbackT1.includes('TBD'));

    return (
      <div 
        style={style}
        className={`absolute w-[200px] h-[64px] rounded-xl bg-[#081524]/95 border p-2 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.25)] z-20 select-none box-border ${
          isAssigned ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : 'border-emerald-500/30 border-dashed opacity-85'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className={`text-[13px] font-black truncate block font-gaming tracking-wide ${
              isAssigned ? 'text-emerald-300' : 'text-zinc-400 font-mono text-[11px]'
            }`}>
              {fallbackT1}
            </span>
            <span className="text-[9px] font-mono text-zinc-400 block -mt-0.5 tracking-wider">
              {isAssigned ? 'ROUND 1 BYE' : 'AWAITING RAFFLE DRAW'}
            </span>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black ${
          isAssigned 
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' 
            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
        }`}>
          {isAssigned ? 'BYE' : 'TBD'}
        </span>
      </div>
    );
  }

  if (!match) return null;

  const t1 = match.team1;
  const t2 = match.team2;
  const t1Won = match.winnerId !== null && match.winnerId === t1?.id;
  const t2Won = match.winnerId !== null && match.winnerId === t2?.id;
  const isLive = match.status === 'live';

  const borderStyles = {
    cyan: 'border-cyan-500/40 hover:border-cyan-300 shadow-[0_4px_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]',
    purple: 'border-purple-500/40 hover:border-purple-300 shadow-[0_4px_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]',
    gold: 'border-amber-400/80 hover:border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50',
    emerald: 'border-emerald-500/40 hover:border-emerald-300 shadow-[0_4px_20px_rgba(16,185,129,0.15)]',
  }[accent];

  return (
    <div
      style={style}
      onClick={() => onSelectMatch(match.id)}
      className={`absolute w-[200px] h-[64px] rounded-xl bg-[#091122]/95 backdrop-blur-md border ${borderStyles} p-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 select-none z-20 flex flex-col justify-between box-border ${
        isLive ? 'ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.5)]' : ''
      }`}
    >
      {/* Top Title Bar */}
      <div className="flex items-center justify-between px-1 text-[9px] font-mono font-bold tracking-wider -mt-0.5">
        <span className="text-zinc-400 group-hover:text-white transition-colors uppercase truncate max-w-[130px] font-gaming">
          {matchLabel}
        </span>
        {isLive ? (
          <span className="text-cyan-400 animate-pulse font-black font-gaming">● LIVE</span>
        ) : (
          <span className="text-zinc-500">BO{match.bestOf}</span>
        )}
      </div>

      {/* Team 1 Row */}
      <div className={`flex items-center justify-between px-1.5 py-0.5 rounded-md transition-all ${
        t1Won ? 'bg-amber-500/25 text-amber-100 font-bold' : 'bg-[#050a14]/90 text-zinc-200'
      }`}>
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <span
            className="w-2 h-2 rounded-sm shrink-0 shadow-sm"
            style={{ backgroundColor: t1?.color || (t1 ? '#00F0FF' : '#475569') }}
          />
          <span className={`text-[12px] font-bold truncate font-gaming tracking-wide ${
            t1Won ? 'text-amber-300 font-black' : t1 ? 'text-white' : 'text-zinc-400 font-mono text-[10px]'
          }`}>
            {t1?.name || fallbackT1}
          </span>
        </div>
        <span className={`w-5 h-4 rounded flex items-center justify-center font-mono text-[11px] font-black shrink-0 border ${
          t1Won
            ? 'bg-amber-400 text-zinc-950 border-amber-300 font-black shadow-sm'
            : isLive
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            : 'bg-[#040810] text-zinc-400 border-cyan-500/20'
        }`}>
          {t1 ? match.score1 : '-'}
        </span>
      </div>

      {/* Team 2 Row */}
      <div className={`flex items-center justify-between px-1.5 py-0.5 rounded-md transition-all ${
        t2Won ? 'bg-amber-500/25 text-amber-100 font-bold' : 'bg-[#050a14]/90 text-zinc-200'
      }`}>
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <span
            className="w-2 h-2 rounded-sm shrink-0 shadow-sm"
            style={{ backgroundColor: t2?.color || (t2 ? '#FFB800' : '#475569') }}
          />
          <span className={`text-[12px] font-bold truncate font-gaming tracking-wide ${
            t2Won ? 'text-amber-300 font-black' : t2 ? 'text-white' : 'text-zinc-400 font-mono text-[10px]'
          }`}>
            {t2?.name || fallbackT2}
          </span>
        </div>
        <span className={`w-5 h-4 rounded flex items-center justify-center font-mono text-[11px] font-black shrink-0 border ${
          t2Won
            ? 'bg-amber-400 text-zinc-950 border-amber-300 font-black shadow-sm'
            : isLive
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            : 'bg-[#040810] text-zinc-400 border-cyan-500/20'
        }`}>
          {t2 ? match.score2 : '-'}
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Precision MLBB Qualifier Card (Shows Advancing Qualified Team to SF)
// ---------------------------------------------------------------------------
export const QualifierCard: React.FC<{
  match?: Match;
  teams: Team[];
  label: string;
  subLabel: string;
  fallbackText: string;
  accent?: 'cyan' | 'purple' | 'emerald';
  onSelectMatch?: (matchId: string) => void;
  style?: React.CSSProperties;
}> = ({ match, teams, label, subLabel, fallbackText, onSelectMatch, style }) => {
  const winnerTeam = match?.winnerId ? teams.find(t => t.id === match.winnerId) : null;
  const isQualified = Boolean(winnerTeam);

  return (
    <div
      style={style}
      onClick={() => match && onSelectMatch && onSelectMatch(match.id)}
      className={`absolute w-[200px] h-[64px] rounded-xl bg-gradient-to-b from-[#0a1628]/95 to-[#060e1c]/95 backdrop-blur-md border p-2 select-none z-20 flex flex-col justify-between box-border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
        isQualified 
          ? 'border-cyan-400/70 shadow-[0_0_25px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/40' 
          : 'border-cyan-500/30 shadow-[0_4px_15px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Top Tag */}
      <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider -mt-0.5">
        <span className="text-cyan-400 font-gaming uppercase truncate">{label}</span>
        <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded ${
          isQualified ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-zinc-500'
        }`}>
          {subLabel}
        </span>
      </div>

      {/* Team Info */}
      <div className="flex items-center justify-between px-1.5 py-1 rounded-lg bg-[#040914]/80 border border-white/[0.05]">
        <div className="flex items-center gap-2 min-w-0">
          <span 
            className="w-2.5 h-2.5 rounded-sm shrink-0 shadow-sm"
            style={{ backgroundColor: winnerTeam?.color || '#00F0FF' }}
          />
          <span className={`text-[12px] font-black truncate font-gaming tracking-wide ${
            isQualified ? 'text-white' : 'text-zinc-400'
          }`}>
            {winnerTeam?.name || fallbackText}
          </span>
        </div>
        {isQualified && (
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-in zoom-in-50" />
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Continuous Vector-Aligned Broadcast Bracket Tree with Unified Header
// ---------------------------------------------------------------------------
export const BroadcastBracketTree: React.FC<BroadcastBracketTreeProps> = ({
  matches,
  teams,
  config,
  onSelectMatch,
  championTeam,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleMode, setScaleMode] = useState<'fit' | '100%' | 'zoom'>('fit');
  const [scale, setScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Auto-calculate exact scale to fit viewport comfortably
  useEffect(() => {
    const computeScale = () => {
      if (!containerRef.current) return;
      const isDocFs = Boolean(document.fullscreenElement);
      setIsFullscreen(isDocFs);

      if (scaleMode === '100%') {
        setScale(1);
        return;
      }

      const availableWidth = isDocFs 
        ? window.innerWidth - 32 
        : (containerRef.current.parentElement?.clientWidth || window.innerWidth) - 24;

      if (isDocFs) {
        // In Fullscreen mode: Fit both width & height so entire stadium is on screen
        const availableHeight = window.innerHeight - 36;
        const scaleX = availableWidth / 1720;
        const scaleY = availableHeight / 1060;
        const idealFit = Math.min(scaleX, scaleY);
        setScale(Number(Math.max(0.5, Math.min(idealFit, 1.25)).toFixed(3)));
      } else {
        // In Normal Windowed mode: Width-based fit so cards stay large, crisp, and prominent!
        const scaleX = availableWidth / 1720;
        const normalFit = Math.max(0.85, Math.min(scaleX, 1.05));
        setScale(Number(normalFit.toFixed(2)));
      }
    };

    computeScale();
    window.addEventListener('resize', computeScale);
    document.addEventListener('fullscreenchange', computeScale);

    return () => {
      window.removeEventListener('resize', computeScale);
      document.removeEventListener('fullscreenchange', computeScale);
    };
  }, [scaleMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full relative flex flex-col items-center select-none transition-all duration-300 ${
        isFullscreen ? 'bg-[#03060f] p-4 min-h-screen justify-center overflow-hidden' : 'overflow-x-auto pb-6'
      }`}
    >
      {/* Auto-Scaled Stage Wrapper (Guarantees 0-cut off and perfect centering) */}
      <div 
        style={{
          width: `${1720 * scale}px`,
          height: `${1060 * scale}px`,
          transition: 'width 0.2s ease-out, height 0.2s ease-out',
        }}
        className="relative shrink-0 flex items-center justify-center overflow-visible"
      >
        {/* Precision 1720px Wide Scaled Cosmic Stage Container */}
        <div 
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: '1720px',
            height: '1060px',
          }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#060c1a] via-[#040812] to-[#02050b] border border-cyan-500/30 shadow-[0_25px_90px_rgba(0,0,0,0.95)] relative overflow-hidden space-y-6 box-border shrink-0"
        >
          
          {/* Background Ambient Lightning Gradients */}
          <div className="absolute -top-40 left-1/4 w-[800px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-[800px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[150px] pointer-events-none" />

          {/* ================================================================ */}
          {/* 1. TOP OFFICIAL TOURNAMENT HEADER WITH INTEGRATED CONTROLS       */}
          {/* ================================================================ */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-cyan-500/20">
            
            {/* Left: MLBB Official Logo Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-transparent border border-cyan-400/30 shadow-md">
                <span className="font-display font-black text-xs tracking-widest text-amber-300">
                  RESPAWN ESPORTS
                </span>
                <span className="text-zinc-600 font-normal">•</span>
                <span className="text-[10px] font-mono text-zinc-300 font-bold tracking-wider">CHAMPIONSHIP 2026</span>
              </div>
            </div>

            {/* Center: Hero Tournament Title */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 tracking-wider font-display drop-shadow-[0_2px_12px_rgba(0,240,255,0.4)]">
                {config.title || 'Mobile Legends Bang Bang'}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300">
                  11 TEAMS • 18 MATCHES
                </span>
              </div>
            </div>

            {/* Right: Integrated Precision Stage Controls & Phase Badges */}
            <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold">
                  ✦ UPPER: WINNERS
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-400/30 text-[10px] font-mono font-bold">
                  ✦ LOWER: ELIM
                </span>
              </div>

              {/* Unified Viewport & Fullscreen Toolbar */}
              <div className="flex items-center gap-1 bg-[#040914]/90 backdrop-blur-md p-1 rounded-xl border border-cyan-500/30 shadow-md">
                <button
                  onClick={() => {
                    setScaleMode('fit');
                    setScale(prev => prev);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                    scaleMode === 'fit' ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Auto-Fit Stage"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>FIT</span>
                </button>

                <button
                  onClick={() => {
                    setScaleMode('100%');
                    setScale(1);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    scaleMode === '100%' ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="100% Native Scale"
                >
                  100%
                </button>

                <button
                  onClick={() => {
                    setScaleMode('zoom');
                    setScale(s => Math.max(0.4, Number((s - 0.08).toFixed(2))));
                  }}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setScaleMode('zoom');
                    setScale(s => Math.min(1.4, Number((s + 0.08).toFixed(2))));
                  }}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-3.5 bg-cyan-500/30 mx-0.5" />

                <button
                  onClick={toggleFullscreen}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/25 to-cyan-500/25 text-amber-300 hover:text-white border border-amber-400/50 text-[10px] font-mono font-black transition-all shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{isFullscreen ? 'EXIT' : 'FULLSCREEN'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* ================================================================ */}
          {/* 2. ABSOLUTE COORDINATE CANVAS (PERFECT SPACING & SYMMETRY)       */}
          {/* ================================================================ */}
          <div className="relative z-10 w-[1680px] h-[920px]">
            
            {/* -------------------------------------------------------------- */}
            {/* SECTION HEADERS (UPPER & LOWER)                                */}
            {/* -------------------------------------------------------------- */}
            
            {/* Upper Bracket Header */}
            <div className="absolute left-0 top-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-r-2xl bg-gradient-to-r from-cyan-600/40 via-blue-950/80 to-transparent border-l-4 border-cyan-400 text-cyan-300 font-black text-xs uppercase tracking-[0.2em] font-display shadow-lg z-10">
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>UPPER BRACKET</span>
            </div>

            {/* Column Stage Headers (Upper) */}
            <div className="absolute left-[30px] top-[36px] text-[11px] font-gaming font-bold text-cyan-400 tracking-wider">
              ROUND 1 (5 MATCHES)
            </div>
            <div className="absolute left-[290px] top-[36px] text-[11px] font-gaming font-bold text-cyan-400 tracking-wider">
              ROUND 2 (3 MATCHES)
            </div>
            <div className="absolute left-[550px] top-[36px] text-[11px] font-gaming font-bold text-cyan-400 tracking-wider">
              UPPER QUALIFIERS (3 SPOTS)
            </div>

            {/* Semi-Finals Header */}
            <div className="absolute left-[810px] top-[140px] text-[12px] font-gaming font-bold text-purple-300 tracking-wider">
              SEMI-FINALS (4 TEAMS)
            </div>

            {/* Lower Bracket Header */}
            <div className="absolute left-0 top-[530px] inline-flex items-center gap-2 px-4 py-1.5 rounded-r-2xl bg-gradient-to-r from-purple-900/50 via-indigo-950/80 to-transparent border-l-4 border-purple-500 text-purple-300 font-black text-xs uppercase tracking-[0.2em] font-display shadow-lg z-10">
              <Flame className="w-4 h-4 text-purple-400" />
              <span>LOWER BRACKET</span>
            </div>

            {/* Column Stage Headers (Lower) */}
            <div className="absolute left-[30px] top-[565px] text-[11px] font-gaming font-bold text-purple-400 tracking-wider">
              ROUND 1 (4 MATCHES)
            </div>
            <div className="absolute left-[290px] top-[565px] text-[11px] font-gaming font-bold text-purple-400 tracking-wider">
              ROUND 2 (2 MATCHES)
            </div>
            <div className="absolute left-[550px] top-[565px] text-[11px] font-gaming font-bold text-emerald-400 tracking-wider">
              LOWER FINAL (1 MATCH)
            </div>

            {/* -------------------------------------------------------------- */}
            {/* A. UPPER BRACKET MATCH NODES                                   */}
            {/* -------------------------------------------------------------- */}
            
            {/* Column 1: Round 1 (x = 30) */}
            <AbsoluteMatchCard match={matches['UR1_M1']} matchLabel="MATCH 01" fallbackT1="SEED #01 (TBD)" fallbackT2="SEED #02 (TBD)" accent="cyan" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '64px' }} />
            <AbsoluteMatchCard match={matches['UR1_M2']} matchLabel="MATCH 02" fallbackT1="SEED #03 (TBD)" fallbackT2="SEED #04 (TBD)" accent="cyan" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '140px' }} />

            <AbsoluteMatchCard match={matches['UR1_M3']} matchLabel="MATCH 03" fallbackT1="SEED #05 (TBD)" fallbackT2="SEED #06 (TBD)" accent="cyan" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '216px' }} />
            <AbsoluteMatchCard match={matches['UR1_M4']} matchLabel="MATCH 04" fallbackT1="SEED #07 (TBD)" fallbackT2="SEED #08 (TBD)" accent="cyan" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '292px' }} />

            <AbsoluteMatchCard match={matches['UR1_M5']} matchLabel="MATCH 05" fallbackT1="SEED #09 (TBD)" fallbackT2="SEED #10 (TBD)" accent="cyan" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '368px' }} />
            <AbsoluteMatchCard matchLabel="SLOT 11" fallbackT1={matches['UR2_M3']?.team2?.name || 'SEED #11 (TBD)'} isBye={true} accent="emerald" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '444px' }} />

            {/* Column 2: Round 2 (x = 290) */}
            <AbsoluteMatchCard match={matches['UR2_M1']} matchLabel="MATCH 06" fallbackT1="UB WINNER" fallbackT2="UB WINNER" accent="cyan" onSelectMatch={onSelectMatch} style={{ left: '290px', top: '102px' }} />
            <AbsoluteMatchCard match={matches['UR2_M2']} matchLabel="MATCH 07" fallbackT1="UB WINNER" fallbackT2="UB WINNER" accent="cyan" onSelectMatch={onSelectMatch} style={{ left: '290px', top: '254px' }} />
            <AbsoluteMatchCard match={matches['UR2_M3']} matchLabel="MATCH 08" fallbackT1="UB WINNER" fallbackT2={matches['UR2_M3']?.team2?.name || 'SEED #11 BYE'} accent="cyan" onSelectMatch={onSelectMatch} style={{ left: '290px', top: '406px' }} />

            {/* Column 3: UB Qualifiers (x = 550) */}
            <QualifierCard 
              match={matches['UR2_M1']} 
              teams={teams}
              label="UB QUALIFIER 1" 
              subLabel="TO SEMI 1" 
              fallbackText="WINNER MATCH 06" 
              accent="cyan" 
              onSelectMatch={onSelectMatch} 
              style={{ left: '550px', top: '102px' }} 
            />
            <QualifierCard 
              match={matches['UR2_M2']} 
              teams={teams}
              label="UB QUALIFIER 2" 
              subLabel="TO SEMI 2" 
              fallbackText="WINNER MATCH 07" 
              accent="cyan" 
              onSelectMatch={onSelectMatch} 
              style={{ left: '550px', top: '254px' }} 
            />
            <QualifierCard 
              match={matches['UR2_M3']} 
              teams={teams}
              label="UB QUALIFIER 3" 
              subLabel="TO SEMI 2" 
              fallbackText="WINNER MATCH 08" 
              accent="cyan" 
              onSelectMatch={onSelectMatch} 
              style={{ left: '550px', top: '406px' }} 
            />

            {/* -------------------------------------------------------------- */}
            {/* B. LOWER BRACKET MATCH NODES                                   */}
            {/* -------------------------------------------------------------- */}
            
            {/* Column 1: Lower Round 1 (x = 30) */}
            <AbsoluteMatchCard match={matches['LR1_M1']} matchLabel="MATCH 09" fallbackT1="LB TEAM" fallbackT2="LB TEAM" accent="purple" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '594px' }} />
            <AbsoluteMatchCard match={matches['LR1_M2']} matchLabel="MATCH 10" fallbackT1="LB TEAM" fallbackT2="LB TEAM" accent="purple" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '670px' }} />

            <AbsoluteMatchCard match={matches['LR1_M3']} matchLabel="MATCH 11" fallbackT1="LB TEAM" fallbackT2="LB TEAM" accent="purple" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '746px' }} />
            <AbsoluteMatchCard match={matches['LR1_M4']} matchLabel="MATCH 12" fallbackT1="LB TEAM" fallbackT2="LB TEAM" accent="purple" onSelectMatch={onSelectMatch} style={{ left: '30px', top: '822px' }} />

            {/* Column 2: Lower Round 2 (x = 290) */}
            <AbsoluteMatchCard match={matches['LR2_M1']} matchLabel="MATCH 13" fallbackT1="LB TEAM" fallbackT2="LB TEAM" accent="purple" onSelectMatch={onSelectMatch} style={{ left: '290px', top: '632px' }} />
            <AbsoluteMatchCard match={matches['LR2_M2']} matchLabel="MATCH 14" fallbackT1="LB TEAM" fallbackT2="LB TEAM" accent="purple" onSelectMatch={onSelectMatch} style={{ left: '290px', top: '784px' }} />

            {/* Column 3: Lower Final (x = 550) */}
            <AbsoluteMatchCard match={matches['LRF_M1']} matchLabel="MATCH 15" fallbackT1="LB TEAM" fallbackT2="LB TEAM" accent="emerald" onSelectMatch={onSelectMatch} style={{ left: '550px', top: '708px' }} />

            {/* -------------------------------------------------------------- */}
            {/* C. SEMI-FINALS                                                 */}
            {/* Match 16: center Y = 210 (top = 178)                          */}
            {/* Match 17: center Y = 604 (top = 572)                          */}
            {/* -------------------------------------------------------------- */}
            <AbsoluteMatchCard match={matches['SF_M1']} matchLabel="MATCH 16" fallbackT1="UB QUALIFIER" fallbackT2="LB FINALIST" accent="purple" onSelectMatch={onSelectMatch} style={{ left: '810px', top: '178px' }} />
            <AbsoluteMatchCard match={matches['SF_M2']} matchLabel="MATCH 17" fallbackT1="UB QUALIFIER" fallbackT2="UB QUALIFIER" accent="purple" onSelectMatch={onSelectMatch} style={{ left: '810px', top: '572px' }} />

            {/* -------------------------------------------------------------- */}
            {/* D. GRAND FINAL (Exact Center Y = 407, top = 375)               */}
            {/* -------------------------------------------------------------- */}
            <div className="absolute left-[1070px] top-[337px] w-[200px] flex justify-center z-20 pointer-events-none">
              <div className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/30 via-amber-400/40 to-amber-500/30 border border-amber-400 text-amber-300 font-black text-[11px] uppercase tracking-[0.25em] font-display shadow-glow-amber">
                GRAND FINAL
              </div>
            </div>

            <AbsoluteMatchCard 
              match={matches['GF_M1']} 
              matchLabel="MATCH 18 (BO5)" 
              fallbackT1="WINNER SF 1" 
              fallbackT2="WINNER SF 2" 
              accent="gold" 
              onSelectMatch={onSelectMatch} 
              style={{ left: '1070px', top: '375px' }} 
            />

            {/* -------------------------------------------------------------- */}
            {/* E. 🏆 3D M-WORLD CHAMPION TROPHY SHOWCASE (Center Y = 407)      */}
            {/* -------------------------------------------------------------- */}
            <div className="absolute left-[1340px] top-[257px] w-[300px] h-[300px] flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-blue-950/40 via-zinc-950/95 to-amber-950/50 border-2 border-amber-400/60 shadow-[0_0_80px_rgba(245,158,11,0.35)] z-20 space-y-3.5 text-center box-border">
              
              {/* Ambient Background Aura */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 via-cyan-400/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-b from-amber-300/40 via-zinc-900 to-zinc-950 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.6)]">
                  <Trophy className="w-20 h-20 text-amber-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-pulse" />
                </div>

                <div className="mt-3 px-8 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-[0.3em] font-display shadow-[0_0_30px_rgba(245,158,11,0.9)]">
                  CHAMPION
                </div>
              </div>

              {championTeam ? (
                <div className="w-full p-2.5 rounded-2xl bg-gradient-to-b from-amber-500/30 via-zinc-950 to-zinc-950 border border-amber-400 text-center shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-in zoom-in-95">
                  <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-0.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-amber-300 font-gaming">
                      TOURNAMENT WINNER
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white font-gaming truncate tracking-wide">
                    {championTeam.name}
                  </h4>
                  <p className="text-[11px] text-amber-300/90 font-mono font-bold">
                    [{championTeam.tag}]
                  </p>
                </div>
              ) : (
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">
                  AWAITING GRAND FINAL
                </span>
              )}

            </div>

            {/* ============================================================== */}
            {/* F. 100% LASER-PRECISE OVERLAY SVG VECTOR CONNECTORS            */}
            {/* ============================================================== */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1680 920">
              <defs>
                <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00F0FF" floodOpacity="0.8" />
                </filter>
                <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#A855F7" floodOpacity="0.8" />
                </filter>
                <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10B981" floodOpacity="0.8" />
                </filter>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.9" />
                </filter>
              </defs>

              {/* --- UPPER BRACKET CONNECTORS --- */}
              {/* Pair 1: M1 (x=230, y=96) & M2 (x=230, y=172) -> Center y=134 -> M6 (x=290, y=134) */}
              <path d="M 230,96 H 260 V 134 H 290" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cyanGlow)" />
              <path d="M 230,172 H 260 V 134" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cyanGlow)" />

              {/* Pair 2: M3 (x=230, y=248) & M4 (x=230, y=324) -> Center y=286 -> M7 (x=290, y=286) */}
              <path d="M 230,248 H 260 V 286 H 290" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cyanGlow)" />
              <path d="M 230,324 H 260 V 286" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cyanGlow)" />

              {/* Pair 3: M5 (x=230, y=400) & Slot 11 Nexus (x=230, y=476) -> Center y=438 -> M8 (x=290, y=438) */}
              <path d="M 230,400 H 260 V 438 H 290" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cyanGlow)" />
              <path d="M 230,476 H 260 V 438" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#emeraldGlow)" />

              {/* Upper R2 to UB Qualifiers (Straight Lines) */}
              {/* M6 (x=490, y=134) -> Qualifier 1 (x=550, y=134) */}
              <path d="M 490,134 H 550" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" filter="url(#cyanGlow)" />
              {/* M7 (x=490, y=286) -> Qualifier 2 (x=550, y=286) */}
              <path d="M 490,286 H 550" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" filter="url(#cyanGlow)" />
              {/* M8 (x=490, y=438) -> Qualifier 3 (x=550, y=438) */}
              <path d="M 490,438 H 550" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" filter="url(#cyanGlow)" />

              {/* UB Qualifier 1 & UB Qualifier 2 to Semi-Final 1 (Q1 at y=134 & Q2 at y=286 -> Center y=210 -> SF 1 at y=210) */}
              <path d="M 750,134 H 780 V 210 H 810" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cyanGlow)" />
              <path d="M 750,286 H 780 V 210" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cyanGlow)" />

              {/* --- LOWER BRACKET CONNECTORS --- */}
              {/* Lower Pair 1: M09 (x=230, y=626) & M10 (x=230, y=702) -> Center y=664 -> M13 (x=290, y=664) */}
              <path d="M 230,626 H 260 V 664 H 290" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#purpleGlow)" />
              <path d="M 230,702 H 260 V 664" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#purpleGlow)" />

              {/* Lower Pair 2: M11 (x=230, y=778) & M12 (x=230, y=854) -> Center y=816 -> M14 (x=290, y=816) */}
              <path d="M 230,778 H 260 V 816 H 290" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#purpleGlow)" />
              <path d="M 230,854 H 260 V 816" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#purpleGlow)" />

              {/* Lower R2 to Lower Final: M13 (x=490, y=664) & M14 (x=490, y=816) -> Center y=740 -> M15 (x=550, y=740) */}
              <path d="M 490,664 H 520 V 740 H 550" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#purpleGlow)" />
              <path d="M 490,816 H 520 V 740" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#purpleGlow)" />

              {/* UB Qualifier 3 (Q3 at y=438) & Lower Final (M15 at y=740) TO Semi-Final 2 (SF 2 at y=572 / Center y=604) */}
              <path d="M 750,438 H 780 V 604 H 810" fill="none" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#cyanGlow)" />
              <path d="M 750,740 H 780 V 604 H 810" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#emeraldGlow)" />

              {/* --- SEMI-FINALS TO GRAND FINAL (EXACT CENTER Y = 407) --- */}
              <path d="M 1010,210 H 1040 V 407 H 1070" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#goldGlow)" />
              <path d="M 1010,604 H 1040 V 407" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#goldGlow)" />

              {/* --- GRAND FINAL TO 🏆 CHAMPION TROPHY (EXACT CENTER Y = 407) --- */}
              <path d="M 1270,407 H 1340" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" filter="url(#goldGlow)" />
              <polygon points="1334,402 1342,407 1334,412" fill="#F59E0B" filter="url(#goldGlow)" />
            </svg>

          </div>

          {/* ================================================================ */}
          {/* 3. BOTTOM OFFICIAL TOURNAMENT FOOTER TICKER                      */}
          {/* ================================================================ */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-cyan-500/20">
            
            {/* Stage Progression Breakdown Bar */}
            <div className="flex items-center bg-[#060c18] p-1.5 rounded-2xl border border-cyan-500/30 overflow-x-auto shadow-inner text-xs font-mono">
              <div className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-black rounded-xl border border-cyan-500/40 text-[10px] uppercase tracking-wider mr-2 font-gaming">
                STAGE SUMMARY
              </div>
              
              <div className="flex items-center gap-3 text-zinc-300 px-2 font-bold text-[11px] font-gaming">
                <span>UPPER ROUND 1: <strong className="text-cyan-300">5</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>ROUND 2: <strong className="text-cyan-300">3</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>UB QUALIFIERS: <strong className="text-cyan-300">3</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>LOWER BRACKET: <strong className="text-purple-300">7</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>SEMI-FINALS: <strong className="text-purple-300">2</strong></span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                <span>GRAND FINAL: <strong className="text-amber-300">1</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>REAL-TIME ENGINE ACTIVE</span>
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-amber-400/90 font-bold">MLBB CHAMPIONSHIP 2026</span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
