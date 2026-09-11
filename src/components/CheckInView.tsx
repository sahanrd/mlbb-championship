import React, { useState } from 'react';
import { Team, TournamentConfig } from '../types/tournament';
import { 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Sparkles,
  Gamepad2,
  Lock,
  Star,
  RotateCcw
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface CheckInViewProps {
  teams: Team[];
  config: TournamentConfig;
  onToggleCheckIn: (teamId: string) => void;
  onAddTeam: (name: string, tag: string, captain?: string) => void;
  onUpdateTeam: (team: Team) => void;
  onRemoveTeam: (teamId: string) => void;
  onProceedToRaffle: () => void;
  onResetToDefaultTeams?: () => void;
  isAdmin?: boolean;
}

export const CheckInView: React.FC<CheckInViewProps> = ({
  teams,
  config,
  onToggleCheckIn,
  onAddTeam,
  onUpdateTeam,
  onRemoveTeam,
  onProceedToRaffle,
  onResetToDefaultTeams,
  isAdmin = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTag, setNewTeamTag] = useState('');
  const [newCaptain, setNewCaptain] = useState('');

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const checkedInCount = teams.filter(t => t.checkedIn).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    onAddTeam(newTeamName, newTeamTag, newCaptain);
    setNewTeamName('');
    setNewTeamTag('');
    setNewCaptain('');
    setIsAdding(false);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    onUpdateTeam(editingTeam);
    setEditingTeam(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-obsidian-950 via-zinc-900/90 to-obsidian-950 border border-white/[0.1] p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="uppercase tracking-[0.25em] text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4" /> Phase 1: Team Check-In & Roll Call
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight">
              Match-Day Attendance
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl leading-relaxed">
              Verify registered teams present at the arena. Once confirmed, proceed to the live Raffle Draw to assign bracket seeds 1 to 11.
            </p>
          </div>

          {/* Counter Card */}
          <div className="flex items-center gap-4 bg-zinc-950/80 backdrop-blur-xl border border-white/[0.1] p-4 rounded-2xl shadow-xl">
            <div className="text-center px-4 border-r border-white/[0.08]">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Total Teams</span>
              <span className="text-2xl font-bold font-mono text-zinc-100">{teams.length}</span>
            </div>
            <div className="text-center px-4">
              <span className="text-[10px] uppercase tracking-wider text-amber-400/90 font-semibold block">Checked-In</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{checkedInCount} / {teams.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules & Navigation Bar */}
      <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Tournament Structure Rules</h4>
            <p className="text-xs text-zinc-300 mt-0.5">
              11 Teams Format: Teams will draw bracket slots 1 to 11 in <strong className="text-amber-300 font-semibold">Phase 2: Raffle Draw</strong>. The lucky team that draws <strong className="text-amber-300 font-semibold">Slot 11</strong> receives the Round 1 Bye!
            </p>
          </div>
        </div>

        {isAdmin ? (
          <button
            onClick={onProceedToRaffle}
            disabled={checkedInCount < 2}
            className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs tracking-wider shadow-glow-amber transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>Proceed to Raffle Draw</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium px-4 py-2 rounded-xl bg-zinc-950 border border-white/[0.06]">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Viewer Mode • Attendance verified by Admins</span>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Registered Team Rosters ({teams.length})</span>
        </h3>

        <div className="flex items-center gap-2">
          {onResetToDefaultTeams && isAdmin && (
            <button
              onClick={() => {
                if (window.confirm('Reset all teams to official roster (A5CE, Pol Bottu, Vortex, etc.)?')) {
                  onResetToDefaultTeams();
                }
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-bold text-amber-300 transition-all duration-200 shadow-sm"
              title="Reload the official 11 tournament teams"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Official 11 Teams</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-semibold text-zinc-200 hover:text-cyan-300 transition-all duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Custom Team</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Team Modal */}
      {isAdding && isAdmin && (
        <form onSubmit={handleAddSubmit} className="p-5 rounded-2xl bg-zinc-900 border border-cyan-500/30 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Add New Registered Team
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Team Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Aura Fire"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Team Tag *</label>
              <input 
                type="text" 
                required
                maxLength={5}
                placeholder="e.g. AURA"
                value={newTeamTag}
                onChange={e => setNewTeamTag(e.target.value)}
                className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 uppercase"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Captain / In-Game Leader</label>
              <input 
                type="text" 
                placeholder="e.g. KABUKI"
                value={newCaptain}
                onChange={e => setNewCaptain(e.target.value)}
                className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold shadow-glow-cyan"
            >
              Save Team
            </button>
          </div>
        </form>
      )}

      {/* Edit Team Modal */}
      {editingTeam && isAdmin && (
        <form onSubmit={handleEditSave} className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-400" /> Edit Team: {editingTeam.name}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Team Name</label>
              <input 
                type="text" 
                required
                value={editingTeam.name}
                onChange={e => setEditingTeam({ ...editingTeam, name: e.target.value })}
                className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Team Tag</label>
              <input 
                type="text" 
                required
                maxLength={5}
                value={editingTeam.tag}
                onChange={e => setEditingTeam({ ...editingTeam, tag: e.target.value.toUpperCase() })}
                className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 uppercase"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Captain Name</label>
              <input 
                type="text" 
                value={editingTeam.captain || ''}
                onChange={e => setEditingTeam({ ...editingTeam, captain: e.target.value })}
                className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingTeam(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-glow-amber"
            >
              Update Team
            </button>
          </div>
        </form>
      )}

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team, index) => (
          <div
            key={team.id}
            className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 border ${
              team.checkedIn
                ? 'bg-zinc-900/60 border-white/[0.08] hover:border-amber-500/40 shadow-md'
                : 'bg-zinc-950/40 border-rose-500/20 opacity-70 hover:opacity-100'
            }`}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: team.color || '#00F0FF' }}
                />
                <span 
                  className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold tracking-wider"
                  style={{ backgroundColor: `${team.color || '#F59E0B'}20`, color: team.color || '#F59E0B' }}
                >
                  [{team.tag}]
                </span>
              </div>

              {/* Check-In Toggle */}
              {isAdmin ? (
                <button
                  onClick={() => onToggleCheckIn(team.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    team.checkedIn
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {team.checkedIn ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </>
                  )}
                </button>
              ) : (
                <span className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                  team.checkedIn ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}>
                  {team.checkedIn ? 'Present' : 'Absent'}
                </span>
              )}
            </div>

            {/* Team Info */}
            <div className="mb-2">
              <h4 className="text-base font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                {team.name}
              </h4>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-500">
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                <span>✦ Awaiting Raffle Draw</span>
              </span>

              {isAdmin && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingTeam(team)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white"
                    title="Edit team details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {teams.length > 2 && (
                    <button
                      onClick={() => onRemoveTeam(team.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400"
                      title="Remove team"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
