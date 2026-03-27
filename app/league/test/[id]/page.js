'use client';

import { use } from 'react';

export default function TestLeaguePage({ params }) {
  const matchId = use(params).id.toUpperCase();
  
  // Static test data to verify display works
  const testMatch = {
    id: matchId,
    teamA: { name: 'Team Alpha', score: 7, serving: true },
    teamB: { name: 'Team Beta', score: 5, serving: false },
    matchType: 'singles',
    gameFormat: '3',
    currentGame: 1,
    games: [
      { gameNumber: 1, winner: 'A', teamAScore: 11, teamBScore: 9 }
    ],
    status: 'active'
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-4xl p-4">
        {/* Header Banner */}
        <div className="bg-purple-600 text-white text-center py-3 px-4 rounded-t-lg">
          <div className="text-xl font-bold">
            PICKLEBALL BUDDIES WOMEN'S MONTH LEAGUE
          </div>
        </div>

        {/* Main Scoreboard */}
        <div className="bg-white">
          {/* Player A Section */}
          <div className="relative">
            <div className="bg-black text-white p-3">
              <div className="text-lg font-bold flex items-center justify-between">
                <span>{testMatch.teamA.name}</span>
                {testMatch.teamA.serving && (
                  <span className="text-purple-400 animate-pulse text-sm">🏓 SERVING</span>
                )}
              </div>
            </div>
            {/* Purple highlight bar */}
            <div className="h-1 bg-purple-600"></div>
          </div>

          {/* Player B Section */}
          <div className="relative">
            <div className="bg-white text-black p-3">
              <div className="text-lg font-bold flex items-center justify-between">
                <span>{testMatch.teamB.name}</span>
                {testMatch.teamB.serving && (
                  <span className="text-purple-600 animate-pulse text-sm">🏓 SERVING</span>
                )}
              </div>
            </div>
            {/* Purple highlight bar */}
            <div className="h-1 bg-purple-600"></div>
          </div>

          {/* Score Boxes */}
          <div className="bg-gray-100 p-4 flex justify-center gap-6">
            {/* Set 1 */}
            <div className="text-center">
              <div className="bg-gray-800 text-white px-4 py-2 rounded mb-1">
                <div className="text-xs font-medium">SET 1</div>
                <div className="text-lg font-bold">
                  {testMatch.games && testMatch.games.length >= 1 
                    ? `${testMatch.games[0].teamAScore} - ${testMatch.games[0].teamBScore}`
                    : '0 - 0'
                  }
                </div>
              </div>
              <div className="text-xs text-gray-600">SET 1 SCORE</div>
            </div>

            {/* Set 2 */}
            <div className="text-center">
              <div className="bg-gray-300 text-black px-4 py-2 rounded mb-1">
                <div className="text-xs font-medium">SET 2</div>
                <div className="text-lg font-bold">
                  {testMatch.games && testMatch.games.length >= 2 
                    ? `${testMatch.games[1].teamAScore} - ${testMatch.games[1].teamBScore}`
                    : testMatch.games && testMatch.games.length === 1
                    ? '0 - 0'
                    : '0 - 0'
                  }
                </div>
              </div>
              <div className="text-xs text-gray-600">SET 2 SCORE</div>
            </div>

            {/* Set 3 / Current Game */}
            <div className="text-center">
              <div className="bg-purple-600 text-white px-4 py-2 rounded mb-1">
                <div className="text-xs font-medium">
                  {testMatch.games && testMatch.games.length >= 2 ? 'SET 3' : 'CURRENT'}
                </div>
                <div className="text-lg font-bold">
                  {testMatch.teamA.score} - {testMatch.teamB.score}
                </div>
              </div>
              <div className="text-xs text-gray-600">
                {testMatch.games && testMatch.games.length >= 2 ? 'SET 3 SCORE' : 'SET 3 SCORE'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-800 text-white text-center py-1 px-4 rounded-b-lg">
          <div className="text-xs opacity-75">
            Game {testMatch.currentGame} • {testMatch.matchType === 'singles' ? 'Singles' : 'Doubles'} • Match ID: {matchId}
          </div>
        </div>
      </div>
    </div>
  );
}
