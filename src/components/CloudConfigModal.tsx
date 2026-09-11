import React, { useState } from 'react';
import { Database, Cloud, CloudOff, Check, X, Sparkles, Key, Globe, Copy, RefreshCw } from 'lucide-react';
import { firebaseSync, FirebaseConfigType } from '../utils/firebaseSync';
import { soundFx } from '../utils/soundFx';

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const CloudConfigModal: React.FC<CloudConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  if (!isOpen) return null;

  const currentConfig = firebaseSync.getSavedConfig();
  const [jsonText, setJsonText] = useState(currentConfig ? JSON.stringify(currentConfig, null, 2) : '');
  const [roomId, setRoomId] = useState(firebaseSync.currentRoomId);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(firebaseSync.isConnected);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    try {
      if (!jsonText.trim()) {
        firebaseSync.removeConfig();
        firebaseSync.setRoomId(roomId);
        setStatusMsg('Switched to Local Storage Mode');
        setIsSuccess(false);
        onConfigSaved();
        return;
      }

      const parsed: FirebaseConfigType = JSON.parse(jsonText);
      firebaseSync.setRoomId(roomId);
      const success = firebaseSync.initFirebase(parsed);

      if (success) {
        soundFx.playRaffleReveal();
        setIsSuccess(true);
        setStatusMsg('🟢 Successfully connected to Firebase Realtime Cloud Database!');
        onConfigSaved();
        setTimeout(() => onClose(), 1200);
      } else {
        setIsSuccess(false);
        setStatusMsg('❌ Could not connect. Check your databaseURL or apiKey.');
      }
    } catch (err) {
      setIsSuccess(false);
      setStatusMsg('❌ Invalid JSON format. Please paste valid Firebase config.');
    }
  };

  const handleDisconnect = () => {
    soundFx.playClick();
    firebaseSync.removeConfig();
    setJsonText('');
    setIsSuccess(false);
    setStatusMsg('Cloud database disconnected. Operating in Local Mode.');
    onConfigSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-zinc-900 border border-white/[0.1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isSuccess 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow-emerald' 
                : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Cloud Realtime Database (Firebase / Vercel)
              </h3>
              <p className="text-xs text-zinc-400">
                Sync live scores instantly across all phones, screens, and devices
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

        {/* Form Body */}
        <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
          
          {/* Status Indicator Bar */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isSuccess 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {isSuccess ? <Cloud className="w-5 h-5 text-emerald-400" /> : <CloudOff className="w-5 h-5 text-amber-400" />}
              <div>
                <span className="text-xs font-bold block">
                  {isSuccess ? 'Live Cloud Sync Connected' : 'Local Storage Mode (Offline Ready)'}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {isSuccess ? `Syncing room: ${roomId}` : 'Connect Firebase to sync live to all devices on Vercel'}
                </span>
              </div>
            </div>

            {isSuccess && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                REALTIME
              </span>
            )}
          </div>

          {/* Tournament Room Key */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              Tournament Room ID (Database Channel)
            </label>
            <input
              type="text"
              required
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Firebase Config JSON */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-zinc-300">
                Paste Firebase Web Config (JSON)
              </label>
              <a 
                href="https://console.firebase.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Free Firebase Console</span>
                <Globe className="w-3 h-3" />
              </a>
            </div>

            <textarea
              rows={6}
              placeholder={`{\n  "apiKey": "AIzaSy...",\n  "databaseURL": "https://your-app-default-rtdb.firebaseio.com",\n  "projectId": "your-app"\n}`}
              value={jsonText}
              onChange={e => { setJsonText(e.target.value); setStatusMsg(''); }}
              className="w-full bg-zinc-950 border border-white/[0.1] rounded-2xl p-3 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 placeholder:text-zinc-700"
            />
          </div>

          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              isSuccess ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}>
              {statusMsg}
            </div>
          )}

          {/* Guide Steps */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/[0.04] text-[11px] text-zinc-400 space-y-1">
            <span className="font-bold text-zinc-300 block mb-1">3 Simple Steps to Free Firebase Setup:</span>
            <p>1. Go to <span className="text-amber-300 font-semibold">console.firebase.google.com</span> & click "Create Project".</p>
            <p>2. In left menu, click <span className="text-amber-300 font-semibold">Realtime Database</span> $\rightarrow$ Create Database (Choose Test Mode).</p>
            <p>3. In Project Settings (⚙️), click Web (&lt;/&gt;) $\rightarrow$ Copy the config snippet & paste above!</p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
            {isSuccess ? (
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-xs text-rose-400 hover:underline font-semibold"
              >
                Disconnect Cloud
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold shadow-glow-cyan transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save & Connect Cloud</span>
              </button>
            </div>
          </div>

        </form>

      </div>

    </div>
  );
};
