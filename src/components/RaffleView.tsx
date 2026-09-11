import React, { useState } from 'react';
import { Team } from '../types/tournament';
import { 
  Dices, 
  Sparkles, 
  Shuffle, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  Star, 
  Shield, 
  Zap, 
  Edit3, 
  ChevronDown,
  Lock
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';
import confetti from 'canvas-confetti';

interface RaffleViewProps {
  presentTeams: Team[];
  onCompleteRaffle: (seededTeams: Team[]) => void;
  onBackToCheckIn: () => void;
  isAdmin?: boolean;
}

export const RaffleView: React.FC<RaffleViewProps> = ({
  presentTeams,
  onCompleteRaffle,
  onBackToCheckIn,
  isAdmin = false,
}) => {
  const totalSlotsCount = Math.max(presentTeams.length, 2);

  const [drawMode, setDrawMode] = useState<'manual' | 'digital'>('manual');

  const [slots, setSlots] = useState<(Team | null)[]>(() => {
    return new Array(totalSlotsCount).fill(null);
  });

  const [unassignedTeams, setUnassignedTeams] = useState<Team[]>(() => [...presentTeams]);
  const [drawingSlotIndex, setDrawingSlotIndex] = useState<number | null>(null);
  const [drawAnimationName, setDrawAnimationName] = useState<string>('');

  // Manual Slot Selection
  const handleManualSlotSelect = (slotIndex: number, selectedTeamId: string) => {
    if (!isAdmin) return;
    soundFx.playClick();
    if (!selectedTeamId) {
      const previousTeam = slots[slotIndex];
      setSlots(prev => {
        const next = [...prev];
        next[slotIndex] = null;
        return next;
      });
      if (previousTeam) {
        setUnassignedTeams(prev => [...prev, previousTeam]);
      }
      return;
    }

    const newTeam = presentTeams.find(t => t.id === selectedTeamId);
    if (!newTeam) return;

    const previousSlotIdx = slots.findIndex(t => t?.id === selectedTeamId);

    setSlots(prev => {
      const next = [...prev];
      if (previousSlotIdx !== -1 && previousSlotIdx !== slotIndex) {
        next[previousSlotIdx] = null;
      }
      next[slotIndex] = newTeam;
      return next;
    });

    setTimeout(() => {
      setSlots(currentSlots => {
        const assignedIds = new Set(currentSlots.filter(Boolean).map(t => t!.id));
        setUnassignedTeams(presentTeams.filter(t => !assignedIds.has(t.id)));
        return currentSlots;
      });
    }, 0);
  };

  // Digital Animated Draw
  const handleDrawSlot = (slotIndex: number) => {
    if (!isAdmin || unassignedTeams.length === 0 || slots[slotIndex] !== null || drawingSlotIndex !== null) return;

    setDrawingSlotIndex(slotIndex);

    let counter = 0;
    const interval = setInterval(() => {
      soundFx.playRaffleTick();
      const randomCandidate = unassignedTeams[Math.floor(Math.random() * unassignedTeams.length)];
      setDrawAnimationName(randomCandidate.name);
      counter++;

      if (counter > 12) {
        clearInterval(interval);
        const chosenIdx = Math.floor(Math.random() * unassignedTeams.length);
        const chosenTeam = unassignedTeams[chosenIdx];

        soundFx.playRaffleReveal();

        setSlots(prev => {
          const next = [...prev];
          next[slotIndex] = chosenTeam;
          return next;
        });

        setUnassignedTeams(prev => prev.filter((_, idx) => idx !== chosenIdx));
        setDrawingSlotIndex(null);
        setDrawAnimationName('');

        if (slotIndex === 10 || unassignedTeams.length <= 1) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
    }, 90);
  };

  const handleDrawNext = () => {
    const firstEmptyIndex = slots.findIndex(s => s === null);
    if (firstEmptyIndex !== -1) {
      handleDrawSlot(firstEmptyIndex);
    }
  };

  const handleShuffleAll = () => {
    if (!isAdmin) return;
    soundFx.playRaffleReveal();
    const shuffled = [...presentTeams].sort(() => Math.random() - 0.5);
    const newSlots = new Array(totalSlotsCount).fill(null);
    shuffled.forEach((team, idx) => {
      if (idx < totalSlotsCount) newSlots[idx] = team;
    });
    setSlots(newSlots);
    setUnassignedTeams([]);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const handleResetDraw = () => {
    if (!isAdmin) return;
    soundFx.playClick();
    setSlots(new Array(totalSlotsCount).fill(null));
    setUnassignedTeams([...presentTeams]);
  };

  const allAssigned = unassignedTeams.length === 0 && slots.filter(s => s !== null).length === presentTeams.length;

  const handleConfirmAndLaunch = () => {
    if (!isAdmin) return;
    const validTeams = slots.filter((s): s is Team => s !== null);
    onCompleteRaffle(validTeams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-3xl bg-obsidian-900 border border-white/[0.08] shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="uppercase tracking-[0.25em] text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
              <Dices className="w-4 h-4" /> Phase 2: Seeding & Raffle Draw
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-display tracking-tight">
            Team Slot Allotment (Slots 1 to {totalSlotsCount})
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Assign team slots 1 to {totalSlotsCount} via <span className="text-cyan-300 font-semibold">Manual Ballot Selection</span> or <span className="text-amber-300 font-semibold">Digital Random Draw</span>.
            {totalSlotsCount === 11 && (
              <span className="text-amber-400 font-semibold ml-1.5">🌟 Slot 11 receives the Round 1 Bye!</span>
            )}
          </p>
        </div>

        {/* Mode Switcher & Quick Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-white/[0.08] shrink-0">
            <button
              onClick={() => { soundFx.playClick(); setDrawMode('manual'); }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                drawMode === 'manual'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Manual Entry</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); setDrawMode('digital'); }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                drawMode === 'digital'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Digital Draw</span>
            </button>
          </div>

          {/* Action Buttons Hub */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {isAdmin && (
              <>
                <button
                  onClick={handleShuffleAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all shadow-glow-cyan"
                  title="Randomly assign all remaining teams"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Randomize All</span>
                </button>

                <button
                  onClick={handleResetDraw}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                  title="Reset all slot assignments"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </>
            )}

            <button
              onClick={onBackToCheckIn}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs font-semibold text-zinc-400 hover:text-white transition-all"
            >
              ← Check-In
            </button>

            {allAssigned && isAdmin && (
              <button
                onClick={handleConfirmAndLaunch}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs tracking-wide shadow-lg transition-all animate-pulse"
              >
                <span>Launch Bracket</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {!isAdmin && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/[0.06] text-xs text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Viewer Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Col: Unassigned Teams Pool */}
        <div className="lg:col-span-1 p-5 rounded-3xl bg-zinc-950/60 border border-white/[0.08] flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Unassigned Teams ({unassignedTeams.length})</span>
            </h4>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-1">
            {unassignedTeams.length === 0 ? (
              <div className="text-center py-10 px-4">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-xs text-emerald-300 font-bold">All {presentTeams.length} teams assigned!</p>
                <p className="text-[11px] text-zinc-400 mt-1">Ready to launch the tournament bracket.</p>
              </div>
            ) : (
              unassignedTeams.map(team => (
                <div
                  key={team.id}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: team.color || '#F59E0B' }}
                    />
                    <span className="text-xs font-bold text-zinc-200">{team.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded">
                    [{team.tag}]
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 3 Cols: Slots Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {slots.map((team, idx) => {
              const slotNumber = idx + 1;
              const isByeSlot = totalSlotsCount === 11 && slotNumber === 11;
              const isDrawing = drawingSlotIndex === idx;

              return (
                <div
                  key={slotNumber}
                  className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 border ${
                    isByeSlot
                      ? 'bg-gradient-to-br from-amber-500/10 via-zinc-900/80 to-zinc-950 border-amber-500/40 shadow-glow-amber'
                      : team
                      ? 'bg-zinc-900/70 border-white/[0.1] shadow-md'
                      : 'bg-zinc-950/40 border-white/[0.04] border-dashed hover:border-white/[0.2]'
                  }`}
                >
                  {/* Slot Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-400">
                      <span className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center text-white">
                        #{slotNumber}
                      </span>
                      <span>Slot {slotNumber}</span>
                    </span>

                    {isByeSlot && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>Round 1 Bye</span>
                      </span>
                    )}

                    {!isByeSlot && (
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Upper R1 Match {Math.ceil(slotNumber / 2)}
                      </span>
                    )}
                  </div>

                  {/* Slot Content */}
                  {drawMode === 'manual' ? (
                    <div className="space-y-2">
                      {isAdmin ? (
                        <div className="relative">
                          <select
                            value={team?.id || ''}
                            onChange={(e) => handleManualSlotSelect(idx, e.target.value)}
                            className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-cyan-500 cursor-pointer font-semibold"
                          >
                            <option value="">-- Choose Team for Slot #{slotNumber} --</option>
                            {presentTeams.map(t => {
                              const isAssignedToOther = slots.some((s, sIdx) => s?.id === t.id && sIdx !== idx);
                              return (
                                <option 
                                  key={t.id} 
                                  value={t.id}
                                  disabled={isAssignedToOther}
                                >
                                  {t.name} [{t.tag}] {isAssignedToOther ? '(Assigned)' : ''}
                                </option>
                              );
                            })}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-zinc-950 border border-white/[0.04] text-xs">
                          {team ? (
                            <span className="font-bold text-white">{team.name} [{team.tag}]</span>
                          ) : (
                            <span className="text-zinc-600 italic">Awaiting Draw</span>
                          )}
                        </div>
                      )}

                      {team && (
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                          <span className="text-[11px] font-mono text-cyan-400 font-bold">[{team.tag}]</span>
                          {isAdmin && (
                            <button
                              onClick={() => handleManualSlotSelect(idx, '')}
                              className="text-[10px] text-rose-400 hover:underline"
                            >
                              Clear Slot
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="min-h-[70px] flex items-center justify-center">
                      {isDrawing ? (
                        <div className="text-center animate-pulse">
                          <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1 animate-spin" />
                          <span className="text-xs font-bold text-amber-300 font-mono">
                            {drawAnimationName || 'DRAWING...'}
                          </span>
                        </div>
                      ) : team ? (
                        <div className="w-full text-left">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white tracking-tight">
                              {team.name}
                            </h4>
                            <span 
                              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                              style={{ backgroundColor: `${team.color || '#F59E0B'}20`, color: team.color || '#F59E0B' }}
                            >
                              [{team.tag}]
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1">
                            Captain: <span className="text-zinc-200">{team.captain || 'Lead'}</span>
                          </p>
                        </div>
                      ) : (
                        isAdmin ? (
                          <button
                            onClick={() => handleDrawSlot(idx)}
                            disabled={unassignedTeams.length === 0}
                            className="w-full py-3 rounded-xl bg-white/[0.02] hover:bg-amber-500/10 border border-white/[0.06] hover:border-amber-500/30 text-xs font-semibold text-zinc-400 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Draw Slot #{slotNumber}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-600 italic">Awaiting Draw</span>
                        )
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
