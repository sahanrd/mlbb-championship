import React from 'react';
import { TournamentConfig, TournamentState } from '../types/tournament';
import { 
  Trophy, 
  Shield, 
  Cloud, 
  Radio, 
  Tv, 
  Camera, 
  FileJson, 
  Settings, 
  Lock, 
  Unlock, 
  Users, 
  Dices,
  Shuffle, 
  GitBranch, 
  Flame, 
  Sparkles,
  CheckCircle2,
  Activity,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { firebaseSync } from '../utils/firebaseSync';

interface FooterProps {
  config: TournamentConfig;
  currentStage: TournamentState['currentStage'];
  onStageChange: (stage: TournamentState['currentStage']) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onOpenConfig: () => void;
  onOpenCloudConfig: () => void;
  onExportPng: () => void;
  onExportJson: () => void;
  onToggleStreamMode: () => void;
  onReset?: () => void;
  totalTeams: number;
  completedMatches: number;
  totalMatches: number;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  currentStage,
  onStageChange,
  isAdmin,
  onOpenAdminLogin,
  onOpenConfig,
  onOpenCloudConfig,
  onExportPng,
  onExportJson,
  onToggleStreamMode,
  onReset,
  totalTeams,
  completedMatches,
  totalMatches,
}) => {
  const isCloudConnected = firebaseSync.isConnected;
  const progressPercent = Math.round((completedMatches / Math.max(1, totalMatches)) * 100);

  return (
    <footer className="relative mt-20 border-t border-white/[0.08] bg-gradient-to-b from-[#060913] via-[#04060c] to-[#020307] text-zinc-400 overflow-hidden select-none">
      
      {/* Ambient Top Glow Orbs */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[200px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -mt-24" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[200px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -mt-24" />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        
        {/* ======================================================== */}
        {/* TOP GRID: 4-COLUMN HIGH-TECH TOURNAMENT TELEMETRY        */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-8 sm:pb-12 border-b border-white/[0.06]">
          
          {/* Column 1: Brand & Live Engine Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-zinc-900 to-cyan-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-amber-400 block uppercase">
                  RESPAWN ESPORTS
                </span>
                <h3 className="text-base font-black text-white font-display tracking-tight">
                  {config.title || 'Mobile Legends Bang Bang'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Official M-World double-elimination esports broadcast engine. Real-time bracket synchronization, live match tracking, and studio visual graphics.
            </p>

            {/* Cloud Realtime Engine Telemetry Card */}
            {isAdmin ? (
              <div 
                onClick={onOpenCloudConfig}
                className="p-3 rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-cyan-500/40 transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <span className="text-[11px] font-bold text-white block group-hover:text-cyan-300 transition-colors">
                      {isCloudConnected ? 'Cloud Realtime Active' : 'Offline Local Storage'}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {isCloudConnected ? 'Firebase WebSocket Sync • 12ms' : 'Click to configure cloud database'}
                    </span>
                  </div>
                </div>
                <Cloud className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-zinc-950/80 border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  <div>
                    <span className="text-[11px] font-bold text-white block">
                      Live Broadcast Sync
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      Official Tournament Feed Active
                    </span>
                  </div>
                </div>
                <Cloud className="w-4 h-4 text-cyan-400/80" />
              </div>
            )}
          </div>

          {/* Column 2: Stage Navigation */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-cyan-400 block uppercase">
              TOURNAMENT STAGES
            </span>
            
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onStageChange('checkin')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    currentStage === 'checkin'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold'
                      : 'hover:bg-white/[0.04] text-zinc-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>01. Team Check-In & Roster</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{totalTeams} Teams</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onStageChange('raffle')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    currentStage === 'raffle'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold'
                      : 'hover:bg-white/[0.04] text-zinc-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>02. Live Draw Machine</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Randomized</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onStageChange('tournament')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    currentStage === 'tournament' || currentStage === 'champion'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold'
                      : 'hover:bg-white/[0.04] text-zinc-300 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span>03. Live Bracket Arena</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{totalMatches} Matches</span>
                </button>
              </li>

              <li>
                <button
                  onClick={onToggleStreamMode}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-300 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Tv className="w-3.5 h-3.5 text-rose-400" />
                    <span>04. Studio Stream Overlay</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    LIVE
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tournament Progress & Format */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-purple-400 block uppercase">
              TOURNAMENT TELEMETRY
            </span>

            {/* Progress Bar Card */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Championship Progress</span>
                <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden p-0.5 border border-white/[0.05]">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-400 transition-all duration-500 shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{completedMatches} Completed</span>
                <span>{totalMatches - completedMatches} Remaining</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-white/[0.05]">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Format</span>
                <span className="font-bold text-zinc-200">Double Elim</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-white/[0.05]">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Grand Final</span>
                <span className="font-bold text-amber-300">Best of 5</span>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Actions & Admin Hub */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-emerald-400 block uppercase">
              TOOLS & CONTROL
            </span>

            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenAdminLogin}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isAdmin 
                    ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-zinc-950/80 border-white/[0.08] hover:border-amber-400/40 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isAdmin ? <Unlock className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-zinc-500" />}
                  <span className="font-bold">{isAdmin ? 'Admin Console Active' : 'Enter Admin PIN'}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{isAdmin ? 'AUTHORIZED' : 'LOCKED'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onExportPng}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-zinc-950/80 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-zinc-300 transition-all text-xs font-semibold"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PNG Image</span>
                </button>

                <button
                  onClick={onExportJson}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-zinc-950/80 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-zinc-300 transition-all text-xs font-semibold"
                >
                  <FileJson className="w-3.5 h-3.5 text-amber-400" />
                  <span>JSON Data</span>
                </button>
              </div>

              <button
                onClick={onOpenConfig}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-zinc-950/80 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-zinc-300 transition-all text-xs font-semibold"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>Tournament Configuration</span>
              </button>

              {isAdmin && onReset && (
                <button
                  onClick={onReset}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 transition-all text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reset Tournament & Draw</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM SUB-FOOTER BAR                                    */}
        {/* ======================================================== */}
        <div className="pt-8 mt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          
          {/* Left: Tournament & Organizer Brand */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 text-center md:text-left text-zinc-400">
            <span className="text-zinc-200 font-bold uppercase tracking-wider">RESPAWN ESPORTS</span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="text-zinc-500">MLBB CHAMPIONSHIP 2026</span>
          </div>

          {/* Right: Developer Credit & Official Engine Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 text-center md:text-right">
            <a
              href="https://www.linkedin.com/in/sahan-rd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-cyan-500/10 text-zinc-400 hover:text-cyan-300 transition-all group"
            >
              <span className="text-[11px]">Designed & Developed by</span>
              <span className="text-zinc-100 font-bold group-hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/50">
                Sahan Dissanayake
              </span>
              <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </a>

            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Official Bracket Engine</span>
            </div>
          </div>

        </div>

      </div>

    </footer>
  );
};
