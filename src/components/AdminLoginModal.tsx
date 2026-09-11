import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, X, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (pin: string) => boolean;
  isAdmin: boolean;
  onLogout: () => void;
  onChangePin: (oldPin: string, newPin: string) => boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  isAdmin,
  onLogout,
  onChangePin,
}) => {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    const success = onLogin(pin);
    if (success) {
      soundFx.playRaffleReveal();
      setPin('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Incorrect Admin PIN. Access denied.');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (newPin.length < 4) {
      setErrorMsg('New PIN must be at least 4 digits');
      return;
    }
    const success = onChangePin(oldPin, newPin);
    if (success) {
      setSuccessMsg('Admin PIN updated successfully!');
      setOldPin('');
      setNewPin('');
      setErrorMsg('');
      setTimeout(() => {
        setIsChangingPin(false);
        setSuccessMsg('');
      }, 1500);
    } else {
      setErrorMsg('Current PIN is incorrect');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-white/[0.1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isAdmin 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-glow-amber'
            }`}>
              {isAdmin ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                {isAdmin ? 'Admin Session Active' : 'Organizer PIN Login'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isAdmin ? 'You have full editing permissions' : 'Enter Admin PIN to unlock controls'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs text-zinc-300">
                  <span className="font-bold text-emerald-300 block">Organizer Privileges Unlocked</span>
                  You can edit scores, conduct raffle draws, award walkovers, and sync with cloud database.
                </div>
              </div>

              {!isChangingPin ? (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setIsChangingPin(true)}
                    className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-white/[0.06] flex items-center justify-center gap-2 transition-all"
                  >
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>Change Admin PIN</span>
                  </button>

                  <button
                    onClick={() => { onLogout(); onClose(); }}
                    className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center justify-center gap-2 transition-all"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Lock & Switch to Viewer Mode</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePinSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Current PIN</label>
                    <input
                      type="password"
                      required
                      value={oldPin}
                      onChange={e => setOldPin(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono tracking-widest text-center text-base"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 block mb-1">New PIN</label>
                    <input
                      type="password"
                      required
                      value={newPin}
                      onChange={e => setNewPin(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono tracking-widest text-center text-base"
                    />
                  </div>

                  {errorMsg && <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>}
                  {successMsg && <p className="text-xs text-emerald-400 font-semibold">{successMsg}</p>}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingPin(false)}
                      className="w-1/2 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold shadow-glow-cyan"
                    >
                      Save PIN
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2 text-center">
                  Enter 4-Digit Admin PIN
                </label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  placeholder="• • • •"
                  value={pin}
                  onChange={e => { setPin(e.target.value); setErrorMsg(''); }}
                  className="w-full bg-zinc-950 border border-white/[0.1] rounded-2xl px-4 py-3 text-2xl text-white font-mono tracking-[0.5em] text-center focus:outline-none focus:border-amber-500 placeholder:text-zinc-700 shadow-inner"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}


              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wider shadow-glow-amber transition-all duration-200"
              >
                Unlock Admin Controls
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
