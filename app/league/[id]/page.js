'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { subscribeToMatch } from '../../../lib/realtime.js';

export default function LeagueScoreboardPage() {
  const params = useParams();
  const matchId = params.id.toUpperCase();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToMatch(matchId, (data) => {
      setMatch(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [matchId]);

  // League-style scoreboard design matching the provided image
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading League Scoreboard...
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-3xl font-bold mb-4">Match Not Found</div>
          <div className="text-xl opacity-75">ID: {matchId}</div>
        </div>
      </div>
    );
  }

  if (match.status === 'completed') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl font-bold mb-6">🏓 MATCH COMPLETE 🏓</div>
          <div className="text-3xl font-bold mb-4">
            {match.winner === 'A' ? match.teamA.name : match.teamB.name} WINS!
          </div>
          <div className="text-2xl opacity-75">
            {match.teamA.name} {match.games?.filter(g => g.winner === 'A').length || 0} - {match.games?.filter(g => g.winner === 'B').length || 0} {match.teamB.name}
          </div>
        </div>
      </div>
    );
  }

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
                <span>{match.teamA.name}</span>
                {match.teamA.serving && (
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
                <span>{match.teamB.name}</span>
                {match.teamB.serving && (
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
              <div className={`px-4 py-2 rounded mb-1 ${
                match.currentGame === 1 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-white'
              }`}>
                <div className="text-xs font-medium">SET 1</div>
                <div className="text-lg font-bold">
                  {match.games && match.games.length >= 1 
                    ? `${match.games[0].teamAScore} - ${match.games[0].teamBScore}`
                    : match.currentGame === 1
                    ? `${match.teamA.score} - ${match.teamB.score}`
                    : '0 - 0'
                  }
                </div>
              </div>
              <div className="text-xs text-gray-600">SET 1 SCORE</div>
            </div>

            {/* Set 2 */}
            <div className="text-center">
              <div className={`px-4 py-2 rounded mb-1 ${
                match.currentGame === 2 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-300 text-black'
              }`}>
                <div className="text-xs font-medium">SET 2</div>
                <div className="text-lg font-bold">
                  {match.games && match.games.length >= 2 
                    ? `${match.games[1].teamAScore} - ${match.games[1].teamBScore}`
                    : match.currentGame === 2
                    ? `${match.teamA.score} - ${match.teamB.score}`
                    : '0 - 0'
                  }
                </div>
              </div>
              <div className="text-xs text-gray-600">SET 2 SCORE</div>
            </div>

            {/* Set 3 */}
            <div className="text-center">
              <div className={`px-4 py-2 rounded mb-1 ${
                match.currentGame === 3 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-600 text-white'
              }`}>
                <div className="text-xs font-medium">SET 3</div>
                <div className="text-lg font-bold">
                  {match.games && match.games.length >= 3 
                    ? `${match.games[2].teamAScore} - ${match.games[2].teamBScore}`
                    : match.currentGame === 3
                    ? `${match.teamA.score} - ${match.teamB.score}`
                    : '0 - 0'
                  }
                </div>
              </div>
              <div className="text-xs text-gray-600">SET 3 SCORE</div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-800 text-white text-center py-1 px-4 rounded-b-lg">
          <div className="text-xs opacity-75">
            Game {match.currentGame} • {match.matchType === 'singles' ? 'Singles' : 'Doubles'} • Match ID: {matchId}
          </div>
        </div>
      </div>
    </div>
  );
}
