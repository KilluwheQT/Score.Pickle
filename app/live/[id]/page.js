'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { subscribeToMatch } from '../../../lib/realtime.js';

export default function LiveViewPage() {
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

  // Minimal design for OBS - no settings, no controls, just the scoreboard
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-4xl font-bold animate-pulse">
          Loading Match...
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl font-bold mb-4">Match Not Found</div>
          <div className="text-2xl opacity-75">ID: {matchId}</div>
        </div>
      </div>
    );
  }

  if (match.status === 'completed') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl font-bold mb-6">🏓 MATCH COMPLETE 🏓</div>
          <div className="text-5xl font-bold mb-4">
            {match.winner === 'A' ? match.teamA.name : match.teamB.name} WINS!
          </div>
          <div className="text-3xl opacity-75">
            {match.teamA.name} {match.games?.filter(g => g.winner === 'A').length || 0} - {match.games?.filter(g => g.winner === 'B').length || 0} {match.teamB.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-7xl">
        {/* Clean, minimal scoreboard for OBS */}
        <div className="flex justify-center items-center gap-16">
          {/* Team A */}
          <div className="text-center">
            <div 
              className={`text-5xl font-bold mb-6 transition-all duration-300 ${
                match.teamA.serving 
                  ? 'text-blue-400 scale-110' 
                  : 'text-white'
              }`}
            >
              {match.teamA.name}
            </div>
            <div 
              className={`text-8xl font-black transition-all duration-300 ${
                match.teamA.serving 
                  ? 'text-blue-400 scale-110' 
                  : 'text-white'
              }`}
            >
              {match.teamA.score}
            </div>
            {match.teamA.serving && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="animate-pulse text-3xl text-blue-400">🏓</span>
                <span className="text-lg text-blue-400 font-medium">SERVING</span>
              </div>
            )}
          </div>

          {/* VS */}
          <div className="text-4xl font-bold text-white opacity-50">
            VS
          </div>

          {/* Team B */}
          <div className="text-center">
            <div 
              className={`text-5xl font-bold mb-6 transition-all duration-300 ${
                match.teamB.serving 
                  ? 'text-green-400 scale-110' 
                  : 'text-white'
              }`}
            >
              {match.teamB.name}
            </div>
            <div 
              className={`text-8xl font-black transition-all duration-300 ${
                match.teamB.serving 
                  ? 'text-green-400 scale-110' 
                  : 'text-white'
              }`}
            >
              {match.teamB.score}
            </div>
            {match.teamB.serving && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="animate-pulse text-3xl text-green-400">🏓</span>
                <span className="text-lg text-green-400 font-medium">SERVING</span>
              </div>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center mt-12">
          <div className="text-2xl text-white opacity-75">
            Game {match.currentGame} • {match.matchType === 'singles' ? 'Singles' : 'Doubles'}
          </div>
        </div>

        {/* Games Won */}
        {match.games && match.games.length > 0 && (
          <div className="text-center mt-8">
            <div className="text-2xl text-white opacity-75">
              Games: {match.teamA.name} {match.games.filter(g => g.winner === 'A').length} - {match.games.filter(g => g.winner === 'B').length} {match.teamB.name}
            </div>
          </div>
        )}

        {/* Match ID (small, for reference) */}
        <div className="text-center mt-8">
          <div className="text-sm text-white opacity-25 font-mono">
            {matchId}
          </div>
        </div>
      </div>
    </div>
  );
}
