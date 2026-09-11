import React, { useState } from 'react';
import { TournamentConfig, TournamentState } from '../types/tournament';
import { 
  Trophy, 
  Users, 
  Dices, 
  Tv, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Settings,
  Lock, 
  Unlock, 
  Cloud, 
  ChevronDown, 
  Camera, 
  FileJson, 
  Radio, 
  SlidersHorizontal,
  Sparkles,
  Layers,
  Crown
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import { firebaseSync } from '../utils/firebaseSync';

interface HeaderProps {
  config: TournamentConfig;
  currentStage: TournamentState['currentStage'];
  onStageChange: (stage: TournamentState['currentStage']) => void;
  onReset: () => void;
  onExportPng: () => void;
  onExportJson: () => void;
  isStreamMode: boolean;
  onToggleStreamMode: () => void;
  onOpenConfig: () => void;
  onOpenCloudConfig: () => void;
  onOpenAdminLogin: () => void;
  isAdmin: boolean;
  championTeamName?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  currentStage,
  onStageChange,
  onReset,
  onExportPng,
  onExportJson,
  isStreamMode,
  onToggleStreamMode,
  onOpenConfig,
  onOpenCloudConfig,
  onOpenAdminLogin,
  isAdmin,
  championTeamName,
}) => {
  const [muted, setMuted] = useState(!soundFx.enabled);
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  const toggleSound = () => {
    soundFx.enabled = !soundFx.enabled;
    setMuted(!soundFx.enabled);
    if (soundFx.enabled) soundFx.playClick();
  };

  const isCloudConnected = firebaseSync.isConnected;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060914]/90 border-b border-white/[0.08] shadow-[0_4px_35px_rgba(0,0,0,0.85)] select-none">
      
      {/* Subtle Top Border Glow Accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none" />

      <div className="max-w-[1750px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 py-2">
        
        {/* ======================================================== */}
        {/* LEFT: BRAND & TOURNAMENT BADGE                           */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 min-w-0">
          <div className="relative group flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/25 via-zinc-900 to-cyan-500/15 border border-amber-400/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 shrink-0">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 font-mono truncate">
                RESPAWN ESPORTS
              </span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-600" />
              <span className="hidden sm:inline text-[10px] font-mono text-zinc-400 font-bold">11 TEAMS</span>
            </div>
            
            <h1 className="text-xs sm:text-base lg:text-lg font-black text-white tracking-tight font-display flex items-center gap-2">
              <span className="truncate max-w-[130px] xs:max-w-[180px] sm:max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {config.title || 'Mobile Legends Bang Bang'}
              </span>
              
              {championTeamName && (
                <span className="hidden sm:flex text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)] items-center gap-1 animate-pulse font-gaming">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span className="truncate max-w-[90px]">{championTeamName}</span>
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER: HIGH-TECH SEGMENTED STAGE NAVIGATOR (DESKTOP)     */}
        {/* ======================================================== */}
        <nav className="hidden lg:flex items-center bg-zinc-950/90 p-1.5 rounded-2xl border border-white/[0.08] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] gap-1">
          
          {/* Stage 1: Check-In */}
          <button
            onClick={() => onStageChange('checkin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              currentStage === 'checkin'
                ? 'bg-gradient-to-r from-amber-500/25 to-amber-500/15 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="w-4 h-4 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-mono font-black">
              01
            </span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Check-In</span>
          </button>

          {/* Stage 2: Raffle Draw */}
          <button
            onClick={() => onStageChange('raffle')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              currentStage === 'raffle'
                ? 'bg-gradient-to-r from-cyan-500/25 to-cyan-500/15 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="w-4 h-4 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-mono font-black">
              02
            </span>
            <Dices className="w-3.5 h-3.5 text-cyan-400" />
            <span>Raffle Draw</span>
          </button>

          {/* Stage 3: Live Tournament Bracket */}
          <button
            onClick={() => onStageChange('tournament')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              currentStage === 'tournament' || currentStage === 'champion'
                ? 'bg-gradient-to-r from-purple-500/25 via-indigo-500/20 to-cyan-500/20 text-purple-200 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="w-4 h-4 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-mono font-black">
              03
            </span>
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Bracket Arena</span>
          </button>
        </nav>

        {/* ======================================================== */}
        {/* RIGHT: TACTILE CONTROLS & MASTER ACTION HUB              */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Admin Mode Badge */}
          <button
            onClick={onOpenAdminLogin}
            title={isAdmin ? "Admin Mode Active (Full Access)" : "Click to enter Organizer PIN"}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 border ${
              isAdmin 
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-400/10 text-amber-300 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:bg-amber-500/30' 
                : 'bg-zinc-950/80 text-zinc-400 border-white/[0.08] hover:text-amber-300 hover:border-amber-400/40 hover:bg-white/[0.03]'
            }`}
          >
            {isAdmin ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono text-[11px] sm:text-xs">ADMIN</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span className="font-mono text-[11px] sm:text-xs">VIEWER</span>
              </>
            )}
          </button>

          {/* Admin Reset Button (Visible on Desktop / Organizers) */}
          {isAdmin && (
            <button
              onClick={onReset}
              title="Reset all 18 matches, scores, and raffle draw"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 border border-rose-500/35 hover:bg-rose-500/25 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)] transition-all duration-200 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono">RESET DRAW</span>
            </button>
          )}

          {/* LIVE Studio Broadcast Mode (Desktop) */}
          <button
            onClick={onToggleStreamMode}
            title={isStreamMode ? "Exit Live Studio Mode" : "Open Full Screen Pure Live Broadcast Stream Overlay"}
            className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all duration-200 border ${
              isStreamMode 
                ? 'bg-rose-500/25 text-rose-200 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.35)]' 
                : 'bg-zinc-950/80 text-rose-400 border-white/[0.08] hover:bg-rose-500/15 hover:border-rose-500/40 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>LIVE ARENA</span>
          </button>

          {/* Export PNG (Desktop) */}
          <button
            onClick={onExportPng}
            title="Download Full HD Bracket PNG"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-300 bg-zinc-950/80 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white hover:border-cyan-500/40 transition-all duration-200"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>PNG</span>
          </button>

          {/* Sound FX Toggle (Desktop) */}
          <button
            onClick={toggleSound}
            title={muted ? "Unmute sound effects" : "Mute sound effects"}
            className="hidden sm:flex p-2.5 rounded-xl text-zinc-400 bg-zinc-950/80 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white hover:border-amber-400/40 transition-all duration-200"
          >
            {muted ? <VolumeX className="w-4 h-4 text-zinc-600" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Master Tools & Mobile Drawer Menu */}
          <div className="relative">
            <button
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              title="Tournament Tools & Menu"
              className="flex items-center gap-1.5 p-2 sm:p-2.5 rounded-xl text-zinc-300 bg-zinc-950/80 border border-white/[0.08] hover:border-cyan-400/40 hover:bg-white/[0.06] transition-all duration-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${showToolsMenu ? 'rotate-180' : ''}`} />
            </button>

            {showToolsMenu && (
              <div 
                className="absolute right-0 mt-3 w-72 rounded-2xl bg-zinc-950/98 backdrop-blur-2xl border border-white/[0.12] shadow-[0_15px_50px_rgba(0,0,0,0.95)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5"
                onClick={() => setShowToolsMenu(false)}
              >
                {/* Mobile Quick Action Toggles */}
                <div className="sm:hidden pb-1.5 mb-1.5 border-b border-white/[0.08] grid grid-cols-2 gap-1.5">
                  <button
                    onClick={onToggleStreamMode}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isStreamMode 
                        ? 'bg-rose-500/25 text-rose-200 border-rose-500/50' 
                        : 'bg-zinc-900 border-white/[0.06] text-rose-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span>Live Studio</span>
                  </button>

                  <button
                    onClick={toggleSound}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold bg-zinc-900 border border-white/[0.06] text-zinc-300 hover:text-white transition-all"
                  >
                    {muted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{muted ? 'Muted' : 'Sound ON'}</span>
                  </button>
                </div>

                {/* Cloud Setup */}
                <button
                  onClick={onOpenCloudConfig}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/[0.06] hover:text-white flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    <span>Cloud Sync Database</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-600'}`} />
                </button>

                {/* Export PNG */}
                <button
                  onClick={onExportPng}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Download Bracket (PNG)</span>
                </button>

                {/* JSON Backup */}
                <button
                  onClick={onExportJson}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span>Download Backup (JSON)</span>
                </button>

                {/* Tournament Config */}
                <button
                  onClick={onOpenConfig}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>Tournament Settings</span>
                </button>

                {/* Reset Tournament */}
                {isAdmin && (
                  <div className="pt-1.5 border-t border-white/[0.08]">
                    <button
                      onClick={onReset}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-black text-rose-400 hover:bg-rose-500/15 flex items-center gap-2.5 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Tournament & Draw</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile/Tablet Segmented Stage Navigator */}
      <div className="lg:hidden px-3 py-2 border-t border-white/[0.06] bg-[#050814]/95">
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-white/[0.08] shadow-inner">
          <button
            onClick={() => onStageChange('checkin')}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              currentStage === 'checkin'
                ? 'bg-gradient-to-r from-amber-500/25 to-amber-500/15 text-amber-300 border border-amber-400/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Check-In</span>
          </button>

          <button
            onClick={() => onStageChange('raffle')}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              currentStage === 'raffle'
                ? 'bg-gradient-to-r from-cyan-500/25 to-cyan-500/15 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Dices className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Raffle</span>
          </button>

          <button
            onClick={() => onStageChange('tournament')}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              currentStage === 'tournament' || currentStage === 'champion'
                ? 'bg-gradient-to-r from-purple-500/25 via-indigo-500/20 to-cyan-500/20 text-purple-200 border border-purple-400/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <span className="truncate">Bracket</span>
          </button>
        </div>
      </div>
    </header>
  );
};
