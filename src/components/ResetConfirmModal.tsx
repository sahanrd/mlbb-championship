import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    soundFx.playClick();
    onConfirmReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-rose-500/40 p-6 md:p-8 shadow-[0_0_50px_rgba(244,63,94,0.25)] space-y-6 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <span className="uppercase tracking-[0.2em] text-[11px] font-bold text-rose-400 block font-mono">
                ORGANIZER ACTION
              </span>
              <h3 className="text-xl font-extrabold text-white font-display tracking-tight">
                Reset Tournament & Draw
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Are you sure you want to reset the tournament to fresh state?</span>
          </div>
          
          <ul className="space-y-2 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>All <strong>18 match scores</strong>, live statuses, and champion results will be wiped.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>The <strong>raffle draw slots</strong> will be cleared so you can perform a new live draw.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>The <strong>official 11 teams</strong> will be preserved and reset to Stage 01 (Check-In).</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.08] transition-all"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 border border-rose-400/50 shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yes, Reset Everything</span>
          </button>
        </div>

      </div>
    </div>
  );
};
