'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { subscribeToMatch } from '../../../lib/realtime.js';

export default function MultiCourtOBSPage() {
  const params = useParams();
  const courtIds = params.id.split(',').map(id => id.trim().toUpperCase());
  
  const [courts, setCourts] = useState(
    courtIds.map((courtId, index) => ({
      id: courtId,
      name: `Court ${index + 1}`,
      match: null,
      loading: true
    }))
  );

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

  const getScoreDisplay = (match) => {
    if (!match) return { teamA: 0, teamB: 0, servingA: false, servingB: false };
    
    return {
      teamA: match.teamA?.score || 0,
      teamB: match.teamB?.score || 0,
      servingA: match.teamA?.serving || false,
      servingB: match.teamB?.serving || false
    };
  };

  const getMatchStatus = (match) => {
    if (!match) return 'WAITING';
    if (match.status === 'completed') return 'COMPLETED';
    if (match.status === 'active') return 'IN PROGRESS';
    return 'WAITING';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN PROGRESS': return 'bg-green-600';
      case 'COMPLETED': return 'bg-gray-600';
      case 'WAITING': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="bg-gray-800 p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-center">🏓 Multi-Court Monitor</h1>
        <p className="text-center text-sm text-gray-400">
          Courts: {courtIds.join(' • ')}
        </p>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {courts.map((court, index) => {
          const score = getScoreDisplay(court.match);
          const status = getMatchStatus(court.match);
          
          return (
            <div key={court.id} className="bg-gray-900 rounded-lg p-4">
              {/* Court Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{court.name}</h2>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                  {status}
                </div>
              </div>

              {/* Match ID */}
              <div className="text-center text-xs text-gray-400 mb-3">
                Match: {court.id}
              </div>

              {/* Score Display */}
              {court.match ? (
                <div className="space-y-3">
                  {/* Team Names */}
                  <div className="space-y-2">
                    <div className={`p-2 rounded text-sm ${
                      score.servingA 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="truncate">{court.match.teamA?.name || 'Team A'}</span>
                        {score.servingA && <span className="text-xs animate-pulse">🏓</span>}
                      </div>
                    </div>
                    
                    <div className={`p-2 rounded text-sm ${
                      score.servingB 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="truncate">{court.match.teamB?.name || 'Team B'}</span>
                        {score.servingB && <span className="text-xs animate-pulse">🏓</span>}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-center py-3">
                    <div className="text-3xl font-bold">
                      {score.teamA} - {score.teamB}
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="text-center text-xs text-gray-400">
                    Game {court.match.currentGame || 1} • {court.match.matchType || 'Singles'}
                  </div>

                  {/* Progress Indicator */}
                  {court.match.games && court.match.games.length > 0 && (
                    <div className="mt-3 text-center">
                      <div className="text-xs text-gray-400">
                        Games: {court.match.teamA?.name} {court.match.games.filter(g => g.winner === 'A').length} - {court.match.games.filter(g => g.winner === 'B').length} {court.match.teamB?.name}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    <div className="text-4xl mb-2">🏓</div>
                    <p className="text-sm">Waiting for match</p>
                    <p className="text-xs mt-1">ID: {court.id}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 p-2 rounded-b-lg">
        <div className="text-center text-xs text-gray-400">
          Live Multi-Court Monitor • Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
