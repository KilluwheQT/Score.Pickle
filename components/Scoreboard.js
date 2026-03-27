'use client';

import { useState, useEffect } from 'react';
import { updateMatchScore, updateMatchStatus, saveToHistory } from '../lib/realtime.js';

export default function Scoreboard({ match, isAdmin = true }) {
  const [matchData, setMatchData] = useState(match);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Update local state when match data changes
  useEffect(() => {
    setMatchData(match);
  }, [match]);

  // Ensure match data has required fields
  useEffect(() => {
    if (matchData && !matchData.currentGame) {
      setMatchData(prev => ({ ...prev, currentGame: 1 }));
    }
    if (matchData && !matchData.games) {
      setMatchData(prev => ({ ...prev, games: [] }));
    }
  }, [matchData]);

  // Play sound effect
  const playSound = () => {
    try {
      const audio = new Audio('/score-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if sound file doesn't exist
    } catch (error) {
      // Sound file not found, continue silently
    }
  };

  // Check if game is won (first to 11, must win by 2)
  const checkGameWinner = (teamAScore, teamBScore) => {
    const targetScore = 11;
    const minLead = 2;
    
    if (teamAScore >= targetScore && teamAScore - teamBScore >= minLead) {
      return 'A';
    }
    if (teamBScore >= targetScore && teamBScore - teamAScore >= minLead) {
      return 'B';
    }
    return null;
  };

  // Check if match is complete based on format
  const checkMatchComplete = (games, format) => {
    const gamesNeeded = Math.ceil(parseInt(format) / 2);
    const teamAWins = games.filter(game => game.winner === 'A').length;
    const teamBWins = games.filter(game => game.winner === 'B').length;
    
    if (teamAWins >= gamesNeeded) return 'A';
    if (teamBWins >= gamesNeeded) return 'B';
    return null;
  };

  // Handle scoring
  const handleScore = async (team) => {
    if (!isAdmin) return;
    
    const newMatchData = { ...matchData };
    const currentTeam = team === 'A' ? 'teamA' : 'teamB';
    const otherTeam = team === 'A' ? 'teamB' : 'teamA';
    
    // Only serving team can score (Pickleball rule)
    if (!newMatchData[currentTeam].serving) {
      alert('Only the serving team can score!');
      return;
    }

    // Add to score history for undo functionality
    setScoreHistory([...scoreHistory, {
      teamAScore: newMatchData.teamA.score,
      teamBScore: newMatchData.teamB.score,
      serving: { A: newMatchData.teamA.serving, B: newMatchData.teamB.serving },
      server: { ...newMatchData.server }
    }]);

    // Increment score
    newMatchData[currentTeam].score++;

    // Check for game winner
    const gameWinner = checkGameWinner(
      newMatchData.teamA.score,
      newMatchData.teamB.score
    );

    if (gameWinner) {
      // Game complete
      const completedGame = {
        gameNumber: newMatchData.currentGame,
        winner: gameWinner,
        teamAScore: newMatchData.teamA.score,
        teamBScore: newMatchData.teamB.score,
        completedAt: Date.now()
      };

      newMatchData.games = [...(newMatchData.games || []), completedGame];
      
      // Check for match winner
      const matchWinner = checkMatchComplete(newMatchData.games || [], newMatchData.gameFormat);
      
      if (matchWinner) {
        // Match complete
        newMatchData.status = 'completed';
        newMatchData.winner = matchWinner;
        await saveToHistory(newMatchData);
        await updateMatchStatus(matchData.id, 'completed', newMatchData);
      } else {
        // Start next game
        newMatchData.currentGame++;
        newMatchData.teamA.score = 0;
        newMatchData.teamB.score = 0;
        // Switch serving team for next game
        newMatchData.teamA.serving = gameWinner === 'A';
        newMatchData.teamB.serving = gameWinner === 'B';
      }
    } else {
      // Continue game - handle side switching for doubles
      if (newMatchData.matchType === 'doubles') {
        // Switch sides every 4 points total
        const totalPoints = newMatchData.teamA.score + newMatchData.teamB.score;
        if (totalPoints > 0 && totalPoints % 4 === 0) {
          newMatchData.sideSwitchNeeded = true;
          // Switch server positions
          newMatchData.server.player = newMatchData.server.player === 1 ? 2 : 1;
        }
      } else {
        // Singles - switch serve when other team gains serve
        if (team === 'A') {
          newMatchData.server = { team: 'A', player: 1 };
        } else {
          newMatchData.server = { team: 'B', player: 1 };
        }
      }
    }

    playSound();
    await updateMatchScore(matchData.id, newMatchData);
  };

  // Handle undo
  const handleUndo = async () => {
    if (!isAdmin || scoreHistory.length === 0) return;

    const lastState = scoreHistory[scoreHistory.length - 1];
    const newMatchData = {
      ...matchData,
      teamA: {
        ...matchData.teamA,
        score: lastState.teamAScore,
        serving: lastState.serving.A
      },
      teamB: {
        ...matchData.teamB,
        score: lastState.teamBScore,
        serving: lastState.serving.B
      },
      server: { ...lastState.server }
    };

    setScoreHistory(scoreHistory.slice(0, -1));
    await updateMatchScore(matchData.id, newMatchData);
  };

  // Handle reset
  const handleReset = async () => {
    if (!isAdmin) return;
    
    if (confirm('Are you sure you want to reset this match?')) {
      const resetData = {
        ...matchData,
        teamA: { ...matchData.teamA, score: 0, serving: true },
        teamB: { ...matchData.teamB, score: 0, serving: false },
        currentGame: 1,
        games: [],
        server: { team: 'A', player: 1 },
        status: 'active'
      };

      setScoreHistory([]);
      await updateMatchScore(matchData.id, resetData);
    }
  };

  // Handle serve switch
  const handleServeSwitch = async () => {
    if (!isAdmin) return;

    const newMatchData = {
      ...matchData,
      teamA: { ...matchData.teamA, serving: !matchData.teamA.serving },
      teamB: { ...matchData.teamB, serving: !matchData.teamB.serving },
      server: matchData.teamA.serving ? { team: 'B', player: 1 } : { team: 'A', player: 1 }
    };

    await updateMatchScore(matchData.id, newMatchData);
  };

  if (!matchData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading match...</p>
        </div>
      </div>
    );
  }

  if (matchData.status === 'completed') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-green-50'} flex items-center justify-center p-4`}>
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-2xl shadow-xl p-8 w-full max-w-md text-center`}>
          <h1 className="text-4xl font-bold mb-4">🏆 Match Complete!</h1>
          <p className="text-2xl mb-6">
            {matchData.winner === 'A' ? matchData.teamA.name : matchData.teamB.name} Wins!
          </p>
          <div className="space-y-2 mb-8">
            {(matchData.games || []).map((game, index) => (
              <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                Game {game.gameNumber}: {matchData.teamA.name} {game.teamAScore} - {game.teamBScore} {matchData.teamB.name}
              </div>
            ))}
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            New Match
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-green-50'} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🏓 Live Scoreboard</h1>
              <p className="text-sm text-gray-600">Match ID: {matchData.id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={handleUndo}
                    disabled={scoreHistory.length === 0}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ↶ Undo
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reset
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Game Info */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              {matchData.matchType === 'singles' ? 'Singles' : 'Doubles'} • Best of {matchData.gameFormat}
            </span>
            <span className="text-gray-600">
              Game {matchData.currentGame}
            </span>
          </div>
        </div>

        {/* Score Display */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-6`}>
          <div className="grid grid-cols-2 gap-8">
            {/* Team A */}
            <div className={`text-center p-6 rounded-xl transition-all ${
              matchData.teamA.serving 
                ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
                : darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <h2 className="text-xl font-bold mb-2">{matchData.teamA.name}</h2>
              <div className="text-6xl font-bold mb-4">{matchData.teamA.score}</div>
              {matchData.teamA.serving && (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">🏓</span>
                  <span className="text-sm font-medium">Serving</span>
                </div>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleScore('A')}
                  disabled={!matchData.teamA.serving}
                  className="mt-4 w-full py-3 bg-white text-blue-500 rounded-lg font-bold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +1 Point
                </button>
              )}
            </div>

            {/* Team B */}
            <div className={`text-center p-6 rounded-xl transition-all ${
              matchData.teamB.serving 
                ? 'bg-green-500 text-white shadow-lg transform scale-105' 
                : darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <h2 className="text-xl font-bold mb-2">{matchData.teamB.name}</h2>
              <div className="text-6xl font-bold mb-4">{matchData.teamB.score}</div>
              {matchData.teamB.serving && (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">🏓</span>
                  <span className="text-sm font-medium">Serving</span>
                </div>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleScore('B')}
                  disabled={!matchData.teamB.serving}
                  className="mt-4 w-full py-3 bg-white text-green-500 rounded-lg font-bold hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +1 Point
                </button>
              )}
            </div>
          </div>

          {/* Serve Switch Button */}
          {isAdmin && (
            <div className="mt-6 text-center">
              <button
                onClick={handleServeSwitch}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Switch Serve
              </button>
            </div>
          )}
        </div>

        {/* Games Won */}
        {matchData.games && matchData.games.length > 0 && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
            <h3 className="text-lg font-bold mb-4">Games Won</h3>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {(matchData.games || []).filter(g => g.winner === 'A').length}
                </div>
                <div className="text-sm text-gray-600">{matchData.teamA.name}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {(matchData.games || []).filter(g => g.winner === 'B').length}
                </div>
                <div className="text-sm text-gray-600">{matchData.teamB.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* Set Breakdown */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}>
          <h3 className="text-lg font-bold mb-4">Set Breakdown</h3>
          
          {/* Current Set Indicator */}
          <div className="text-center mb-6">
            <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
              Currently Playing: Set {matchData.currentGame}
            </div>
          </div>

          {/* Set Results */}
          <div className="space-y-3">
            {/* Set 1 */}
            <div className={`p-4 rounded-lg border-2 ${
              matchData.currentGame === 1
                ? darkMode 
                  ? 'bg-purple-900 border-purple-400' 
                  : 'bg-purple-50 border-purple-300'
                : darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <div className="font-bold">
                  Set 1
                  {matchData.currentGame === 1 && (
                    <span className="ml-2 text-sm animate-pulse">
                      (Current)
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold">
                  {matchData.games && matchData.games.length >= 1 
                    ? `${matchData.games[0].teamAScore} - ${matchData.games[0].teamBScore}`
                    : matchData.currentGame === 1
                    ? `${matchData.teamA.score} - ${matchData.teamB.score}`
                    : 'Not Started'
                  }
                </div>
                {matchData.games && matchData.games.length >= 1 && (
                  <div className={`px-3 py-1 rounded text-sm font-medium ${
                    matchData.games[0].winner === 'A'
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {matchData.games[0].winner === 'A' ? matchData.teamA.name : matchData.teamB.name} Won
                  </div>
                )}
              </div>
            </div>

            {/* Set 2 */}
            <div className={`p-4 rounded-lg border-2 ${
              matchData.currentGame === 2
                ? darkMode 
                  ? 'bg-purple-900 border-purple-400' 
                  : 'bg-purple-50 border-purple-300'
                : darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <div className="font-bold">
                  Set 2
                  {matchData.currentGame === 2 && (
                    <span className="ml-2 text-sm animate-pulse">
                      (Current)
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold">
                  {matchData.games && matchData.games.length >= 2 
                    ? `${matchData.games[1].teamAScore} - ${matchData.games[1].teamBScore}`
                    : matchData.currentGame === 2
                    ? `${matchData.teamA.score} - ${matchData.teamB.score}`
                    : 'Not Started'
                  }
                </div>
                {matchData.games && matchData.games.length >= 2 && (
                  <div className={`px-3 py-1 rounded text-sm font-medium ${
                    matchData.games[1].winner === 'A'
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {matchData.games[1].winner === 'A' ? matchData.teamA.name : matchData.teamB.name} Won
                  </div>
                )}
              </div>
            </div>

            {/* Set 3 */}
            <div className={`p-4 rounded-lg border-2 ${
              matchData.currentGame === 3
                ? darkMode 
                  ? 'bg-purple-900 border-purple-400' 
                  : 'bg-purple-50 border-purple-300'
                : darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <div className="font-bold">
                  Set 3 
                  {matchData.currentGame === 3 && (
                    <span className="ml-2 text-sm animate-pulse">
                      (Current)
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold">
                  {matchData.games && matchData.games.length >= 3 
                    ? `${matchData.games[2].teamAScore} - ${matchData.games[2].teamBScore}`
                    : matchData.currentGame === 3
                    ? `${matchData.teamA.score} - ${matchData.teamB.score}`
                    : 'Not Started'
                  }
                </div>
                {matchData.games && matchData.games.length >= 3 && (
                  <div className={`px-3 py-1 rounded text-sm font-medium ${
                    matchData.games[2].winner === 'A'
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}>
                    {matchData.games[2].winner === 'A' ? matchData.teamA.name : matchData.teamB.name} Won
                  </div>
                )}
              </div>
            </div>

            {/* Additional Sets (if needed for best of 5) */}
            {matchData.gameFormat === '5' && (
              <>
                {/* Set 4 */}
                <div className={`p-4 rounded-lg border-2 ${
                  matchData.currentGame === 4
                    ? darkMode 
                      ? 'bg-purple-900 border-purple-400' 
                      : 'bg-purple-50 border-purple-300'
                    : darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="font-bold">
                      Set 4
                      {matchData.currentGame === 4 && (
                        <span className="ml-2 text-sm animate-pulse">
                          (Current)
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold">
                      {matchData.games && matchData.games.length >= 4 
                        ? `${matchData.games[3].teamAScore} - ${matchData.games[3].teamBScore}`
                        : matchData.currentGame === 4
                        ? `${matchData.teamA.score} - ${matchData.teamB.score}`
                        : 'Not Started'
                      }
                    </div>
                    {matchData.games && matchData.games.length >= 4 && (
                      <div className={`px-3 py-1 rounded text-sm font-medium ${
                        matchData.games[3].winner === 'A'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {matchData.games[3].winner === 'A' ? matchData.teamA.name : matchData.teamB.name} Won
                      </div>
                    )}
                  </div>
                </div>

                {/* Set 5 */}
                <div className={`p-4 rounded-lg border-2 ${
                  matchData.currentGame === 5
                    ? darkMode 
                      ? 'bg-purple-900 border-purple-400' 
                      : 'bg-purple-50 border-purple-300'
                    : darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="font-bold">
                      Set 5
                      {matchData.currentGame === 5 && (
                        <span className="ml-2 text-sm animate-pulse">
                          (Current - Deciding Set)
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold">
                      {matchData.games && matchData.games.length >= 5 
                        ? `${matchData.games[4].teamAScore} - ${matchData.games[4].teamBScore}`
                        : matchData.currentGame === 5
                        ? `${matchData.teamA.score} - ${matchData.teamB.score}`
                        : 'Not Started'
                      }
                    </div>
                    {matchData.games && matchData.games.length >= 5 && (
                      <div className={`px-3 py-1 rounded text-sm font-medium ${
                        matchData.games[4].winner === 'A'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {matchData.games[4].winner === 'A' ? matchData.teamA.name : matchData.teamB.name} Won
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
