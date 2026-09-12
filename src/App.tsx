import React, { useState, useRef } from 'react';
import { useTournament } from './hooks/useTournament';
import { Header } from './components/Header';
import { CheckInView } from './components/CheckInView';
import { RaffleView } from './components/RaffleView';
import { BracketBoard } from './components/BracketBoard';
import { MatchScoreModal } from './components/MatchScoreModal';
import { ChampionModal } from './components/ChampionModal';
import { StreamOverlayView } from './components/StreamOverlayView';
import { ConfigModal } from './components/ConfigModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CloudConfigModal } from './components/CloudConfigModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { Footer } from './components/Footer';
import { toPng } from 'html-to-image';
import { soundFx } from './utils/soundFx';

export const App: React.FC = () => {
  const {
    state,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    changePin,
    updateConfig,
    toggleCheckIn,
    addTeam,
    updateTeam,
    removeTeam,
    startRaffleStage,
    applySeededRaffleTeams,
    selectMatch,
    updateMatchResult,
    setMatchBestOf,
    resetTournament,
    importTournamentData,
    setStage,
  } = useTournament();

  const [isStreamMode, setIsStreamMode] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCloudConfigOpen, setIsCloudConfigOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [showChampionModal, setShowChampionModal] = useState(true);

  const bracketRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presentTeams = state.teams.filter(t => t.checkedIn);
  const championTeam = state.teams.find(t => t.id === state.championTeamId) || null;
  const runnerUpTeam = state.teams.find(t => t.id === state.runnerUpTeamId) || null;
  const thirdPlaceTeam = state.teams.find(t => t.id === state.thirdPlaceTeamId) || null;
  const selectedMatch = state.selectedMatchId ? state.matches[state.selectedMatchId] || null : null;

  const handleTriggerReset = () => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    setIsResetConfirmOpen(true);
  };

  // Quick Winner / Walkover helper
  const handleQuickWinner = (matchId: string, winnerId: string) => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    const match = state.matches[matchId];
    if (!match) return;
    const winsNeeded = Math.ceil(match.bestOf / 2);
    const isTeam1 = match.team1?.id === winnerId;
    updateMatchResult(
      matchId,
      isTeam1 ? winsNeeded : 0,
      isTeam1 ? 0 : winsNeeded,
      winnerId,
      false
    );
  };

  const handleQuickWalkover = (matchId: string, winnerId: string) => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    updateMatchResult(matchId, 1, 0, winnerId, true);
  };

  // Export to PNG Image
  const handleExportPng = async () => {
    if (!bracketRef.current) return;
    try {
      soundFx.playClick();
      const dataUrl = await toPng(bracketRef.current, {
        quality: 0.95,
        backgroundColor: '#060709',
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `MLBB-Tournament-Bracket-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image:', err);
    }
  };

  // Export to JSON Backup
  const handleExportJson = () => {
    soundFx.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mlbb-tournament-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        importTournamentData(json);
      } catch (err) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  if (isStreamMode) {
    return (
      <StreamOverlayView
        config={state.config}
        matches={state.matches}
        teams={state.teams}
        onClose={() => setIsStreamMode(false)}
        onSelectMatch={selectMatch}
        onQuickWinner={handleQuickWinner}
        onQuickWalkover={handleQuickWalkover}
        championTeam={championTeam}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col">
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJson}
        accept=".json"
        className="hidden"
      />

      {/* Main Header */}
      <Header
        config={state.config}
        currentStage={state.currentStage}
        onStageChange={setStage}
        onReset={handleTriggerReset}
        onExportPng={handleExportPng}
        onExportJson={handleExportJson}
        isStreamMode={isStreamMode}
        onToggleStreamMode={() => setIsStreamMode(!isStreamMode)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenCloudConfig={() => setIsCloudConfigOpen(true)}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
        isAdmin={isAdmin}
        championTeamName={championTeam?.name}
      />

      {/* Main Screen Content */}
      <main className="flex-1">
        {state.currentStage === 'checkin' && (
          <CheckInView
            teams={state.teams}
            config={state.config}
            onToggleCheckIn={toggleCheckIn}
            onAddTeam={addTeam}
            onUpdateTeam={updateTeam}
            onRemoveTeam={removeTeam}
            onProceedToRaffle={startRaffleStage}
            onResetToDefaultTeams={handleTriggerReset}
            isAdmin={isAdmin}
          />
        )}

        {state.currentStage === 'raffle' && (
          <RaffleView
            presentTeams={presentTeams}
            onCompleteRaffle={applySeededRaffleTeams}
            onBackToCheckIn={() => setStage('checkin')}
            isAdmin={isAdmin}
          />
        )}

        {(state.currentStage === 'tournament' || state.currentStage === 'champion') && (
          <div ref={bracketRef}>
            <BracketBoard
              matches={state.matches}
              teams={state.teams}
              config={state.config}
              onSelectMatch={selectMatch}
              onQuickWinner={handleQuickWinner}
              onQuickWalkover={handleQuickWalkover}
              championTeam={championTeam}
              isAdmin={isAdmin}
              onReset={handleTriggerReset}
            />
          </div>
        )}
      </main>

      {/* Match Scorekeeper / Spectator Modal */}
      {selectedMatch && (
        <MatchScoreModal
          match={selectedMatch}
          onClose={() => selectMatch(null)}
          isAdmin={isAdmin}
          onOpenAdminLogin={() => setIsAdminModalOpen(true)}
          onUpdateMatchResult={(matchId, score1, score2, winnerId, isWalkover) => {
            if (!isAdmin) {
              setIsAdminModalOpen(true);
              return;
            }
            updateMatchResult(matchId, score1, score2, winnerId, isWalkover);
          }}
          onSetBestOf={(matchId, bo) => {
            if (!isAdmin) {
              setIsAdminModalOpen(true);
              return;
            }
            setMatchBestOf(matchId, bo);
          }}
        />
      )}

      {/* Champion Victory Modal */}
      {state.currentStage === 'champion' && championTeam && showChampionModal && (
        <ChampionModal
          championTeam={championTeam}
          runnerUpTeam={runnerUpTeam}
          thirdPlaceTeam={thirdPlaceTeam}
          config={state.config}
          onClose={() => setShowChampionModal(false)}
          onExportPng={handleExportPng}
          onReset={handleTriggerReset}
        />
      )}

      {/* Tournament Settings Modal */}
      <ConfigModal
        config={state.config}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={updateConfig}
      />

      {/* Admin PIN Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={loginAdmin}
        isAdmin={isAdmin}
        onLogout={logoutAdmin}
        onChangePin={changePin}
      />

      {/* Cloud Realtime Database Config Modal */}
      <CloudConfigModal
        isOpen={isCloudConfigOpen}
        onClose={() => setIsCloudConfigOpen(false)}
        onConfigSaved={() => {}}
      />

      {/* Organizer Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={resetTournament}
      />

      {/* Agency-Grade Esports Stadium Footer */}
      <Footer
        config={state.config}
        currentStage={state.currentStage}
        onStageChange={setStage}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenCloudConfig={() => setIsCloudConfigOpen(true)}
        onExportPng={handleExportPng}
        onExportJson={handleExportJson}
        onToggleStreamMode={() => setIsStreamMode(!isStreamMode)}
        onReset={handleTriggerReset}
        totalTeams={state.teams.length}
        completedMatches={Object.values(state.matches).filter(m => m.status === 'completed' || m.status === 'walkover').length}
        totalMatches={Object.keys(state.matches).length}
      />
    </div>
  );
};
