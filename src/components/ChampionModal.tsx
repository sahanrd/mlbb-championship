import React, { useEffect } from 'react';
import { Team, TournamentConfig } from '../types/tournament';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  X, 
  Download, 
  RotateCcw,
  Share2,
  Medal,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChampionModalProps {
  championTeam: Team | null;
  runnerUpTeam: Team | null;
  thirdPlaceTeam?: Team | null;
  config: TournamentConfig;
  onClose: () => void;
  onExportPng: () => void;
  onReset: () => void;
}

export const ChampionModal: React.FC<ChampionModalProps> = ({
  championTeam,
  runnerUpTeam,
  thirdPlaceTeam,
  config,
  onClose,
  onExportPng,
  onReset,
}) => {
  if (!championTeam) return null;

  useEffect(() => {
    // Blast grand fireworks confetti
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [championTeam]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-zinc-900 via-obsidian-900 to-black border border-amber-500/40 shadow-glow-gold overflow-hidden p-8 text-center animate-in zoom-in-90 duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -mt-20" />

        {/* Trophy Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-glow-gold mb-6 animate-bounce">
          <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
            <Trophy className="w-12 h-12 text-amber-400" />
          </div>
        </div>

        {/* Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="uppercase tracking-[0.3em] text-xs font-bold text-amber-400">
            {config.title} • GRAND CHAMPION
          </span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>

        {/* Champion Name */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white font-display tracking-tight mb-2">
          {championTeam.name}
        </h2>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-sm font-bold mb-8">
          <span>TAG: [{championTeam.tag}]</span>
          <span>•</span>
          <span>CAPTAIN: {championTeam.captain || 'LEAD'}</span>
        </div>

        {/* Podium Winners */}
        <div className={`grid gap-3.5 mx-auto mb-8 text-left ${thirdPlaceTeam ? 'grid-cols-1 sm:grid-cols-3 max-w-2xl' : 'grid-cols-1 sm:grid-cols-2 max-w-lg'}`}>
          
          {/* 1st Place */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">1st Place • Champion</span>
              <h4 className="text-sm font-bold text-white truncate">{championTeam.name}</h4>
              <span className="text-[11px] text-zinc-400">Gold Champion</span>
            </div>
          </div>

          {/* 2nd Place */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 shrink-0">
              <Medal className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">2nd Place • Runner-Up</span>
              <h4 className="text-sm font-bold text-white truncate">{runnerUpTeam ? runnerUpTeam.name : 'Finalist'}</h4>
              <span className="text-[11px] text-zinc-500">Silver Medalist</span>
            </div>
          </div>

          {/* 3rd Place */}
          {thirdPlaceTeam && (
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 shrink-0">
                <Medal className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">3rd Place • Bronze</span>
                <h4 className="text-sm font-bold text-white truncate">{thirdPlaceTeam.name}</h4>
                <span className="text-[11px] text-zinc-500">Bronze Medalist</span>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/[0.08]">
          <button
            onClick={onExportPng}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wider shadow-glow-amber transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Championship Graphic (PNG)</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/[0.08] transition-all"
          >
            Back to Bracket
          </button>
        </div>

      </div>

    </div>
  );
};
