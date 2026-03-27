'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { subscribeToMatch, updateMatchScore } from '../../../lib/realtime.js';

export default function MultiCourtScorePage() {
  const params = useParams();
  const courtIds = params.id.split(',').map(id => id.trim().toUpperCase());
  
  const [courts, setCourts] = useState(
    courtIds.map((courtId, index) => ({
      id: courtId,
      name: `Court ${index + 1}`,
      match: null,
      loading: true,
      activeCourt: index === 0 // First court is active by default
    }))
  );

  const [activeCourtIndex, setActiveCourtIndex] = useState(0);

  // Subscribe to matches for each court
  useEffect(() => {
    const unsubscribers = courtIds.map((courtId, index) => {
      return subscribeToMatch(courtId, (data) => {
        setCourts(prev => {
          const newCourts = [...prev];
          newCourts[index].match = data;
          newCourts[index].loading = false;
          return newCourts;
        });
      });
    });

    return () => {
      unsubscribers.forEach(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [courtIds.join(',')]);

  const handleScore = async (courtIndex, team) => {
    const court = courts[courtIndex];
    if (!court.match) return;

    const newMatchData = { ...court.match };
    const currentTeam = team === 'A' ? 'teamA' : 'teamB';
    
    // Only serving team can score
    if (!newMatchData[currentTeam].serving) {
      alert(`Only the serving team can score in ${court.name}!`);
      return;
    }

    // Increment score
    newMatchData[currentTeam].score++;

    // Check for game winner (first to 11, win by 2)
    const targetScore = 11;
    const minLead = 2;
    let gameWinner = null;
    
    if (newMatchData.teamA.score >= targetScore && newMatchData.teamA.score - newMatchData.teamB.score >= minLead) {
      gameWinner = 'A';
    } else if (newMatchData.teamB.score >= targetScore && newMatchData.teamB.score - newMatchData.teamA.score >= minLead) {
      gameWinner = 'B';
    }

    if (gameWinner) {
      // Game complete - add to games array
      const completedGame = {
        gameNumber: newMatchData.currentGame || 1,
        winner: gameWinner,
        teamAScore: newMatchData.teamA.score,
        teamBScore: newMatchData.teamB.score,
        completedAt: Date.now()
      };

      newMatchData.games = [...(newMatchData.games || []), completedGame];
      
      // Reset for next game
      newMatchData.currentGame = (newMatchData.currentGame || 1) + 1;
      newMatchData.teamA.score = 0;
      newMatchData.teamB.score = 0;
      
      // Switch serving team for next game
      newMatchData.teamA.serving = gameWinner === 'A';
      newMatchData.teamB.serving = gameWinner === 'B';
    } else {
      // Continue game - switch serve
      if (team === 'A') {
        newMatchData.teamA.serving = false;
        newMatchData.teamB.serving = true;
      } else {
        newMatchData.teamA.serving = true;
        newMatchData.teamB.serving = false;
      }
    }

    try {
      await updateMatchScore(court.id, newMatchData);
    } catch (error) {
      console.error('Error updating score:', error);
      alert(`Failed to update score for ${court.name}`);
    }
  };

  const handleServeSwitch = async (courtIndex) => {
    const court = courts[courtIndex];
    if (!court.match) return;

    const newMatchData = { ...court.match };
    newMatchData.teamA.serving = !newMatchData.teamA.serving;
    newMatchData.teamB.serving = !newMatchData.teamB.serving;

    try {
      await updateMatchScore(court.id, newMatchData);
    } catch (error) {
      console.error('Error switching serve:', error);
      alert(`Failed to switch serve for ${court.name}`);
    }
  };

  const activeCourt = courts[activeCourtIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="bg-gray-800 p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-center">🏓 Multi-Court Scoring</h1>
        <p className="text-center text-sm text-gray-400">
          Currently scoring: {activeCourt?.name} (Match: {activeCourt?.id})
        </p>
      </div>

      {/* Court Selector */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          {courts.map((court, index) => (
            <button
              key={court.id}
              onClick={() => setActiveCourtIndex(index)}
              className={`p-3 rounded-lg font-medium transition-colors ${
                index === activeCourtIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div>{court.name}</div>
              <div className="text-xs opacity-75">{court.id}</div>
              {court.match && (
                <div className="text-xs mt-1">
                  {court.match.teamA?.name} vs {court.match.teamB?.name}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Court Scoring */}
      <div className="bg-gray-900 p-6">
        {activeCourt?.match ? (
          <div className="max-w-md mx-auto">
            {/* Team Names */}
            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-lg text-center ${
                activeCourt.match.teamA.serving 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}>
                <div className="text-xl font-bold mb-2">{activeCourt.match.teamA?.name || 'Team A'}</div>
                {activeCourt.match.teamA.serving && (
                  <div className="animate-pulse">🏓 SERVING</div>
                )}
              </div>
              
              <div className={`p-4 rounded-lg text-center ${
                activeCourt.match.teamB.serving 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}>
                <div className="text-xl font-bold mb-2">{activeCourt.match.teamB?.name || 'Team B'}</div>
                {activeCourt.match.teamB.serving && (
                  <div className="animate-pulse">🏓 SERVING</div>
                )}
              </div>
            </div>

            {/* Score Display */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold">
                {activeCourt.match.teamA.score} - {activeCourt.match.teamB.score}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Game {activeCourt.match.currentGame || 1} • {activeCourt.match.matchType || 'Singles'}
              </div>
            </div>

            {/* Scoring Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => handleScore(activeCourtIndex, 'A')}
                disabled={!activeCourt.match.teamA.serving}
                className="p-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {activeCourt.match.teamA?.name || 'Team A'} +1
              </button>
              <button
                onClick={() => handleScore(activeCourtIndex, 'B')}
                disabled={!activeCourt.match.teamB.serving}
                className="p-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {activeCourt.match.teamB?.name || 'Team B'} +1
              </button>
            </div>

            {/* Serve Switch */}
            <button
              onClick={() => handleServeSwitch(activeCourtIndex)}
              className="w-full p-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              Switch Serve
            </button>

            {/* Games Progress */}
            {activeCourt.match.games && activeCourt.match.games.length > 0 && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-sm font-bold mb-2">Games Progress</h3>
                <div className="space-y-1 text-sm">
                  {activeCourt.match.games.map((game, index) => (
                    <div key={index} className="flex justify-between">
                      <span>Game {game.gameNumber}:</span>
                      <span>
                        {activeCourt.match.teamA?.name} {game.teamAScore} - {game.teamBScore} {activeCourt.match.teamB?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-6xl mb-4">🏓</div>
              <p className="text-xl mb-2">No match assigned to {activeCourt?.name}</p>
              <p className="text-sm">Match ID: {activeCourt?.id}</p>
            </div>
          </div>
        )}
      </div>

      {/* Other Courts Overview */}
      <div className="bg-gray-800 p-4 rounded-b-lg">
        <h3 className="text-sm font-bold mb-3">Other Courts</h3>
        <div className="grid grid-cols-2 gap-4">
          {courts.filter((_, index) => index !== activeCourtIndex).map((court) => (
            <div key={court.id} className="bg-gray-700 p-3 rounded">
              <div className="flex justify-between items-center">
                <span className="font-medium">{court.name}</span>
                <span className="text-xs text-gray-400">{court.id}</span>
              </div>
              {court.match && (
                <div className="mt-2 text-sm">
                  <div>{court.match.teamA?.name} vs {court.match.teamB?.name}</div>
                  <div className="text-gray-400">
                    Score: {court.match.teamA.score} - {court.match.teamB.score}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
