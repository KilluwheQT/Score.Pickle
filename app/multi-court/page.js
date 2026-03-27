'use client';

import { useState, useEffect } from 'react';
import { subscribeToMatch } from '../../lib/realtime.js';

export default function MultiCourtPage() {
  const [courtCount, setCourtCount] = useState(3);
  const [courts, setCourts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Initialize courts when court count changes
  useEffect(() => {
    const newCourts = Array.from({ length: courtCount }, (_, index) => ({
      id: `COURT${index + 1}`,
      name: `Court ${index + 1}`,
      matchId: '',
      match: null
    }));
    setCourts(newCourts);
  }, [courtCount]);

  // Subscribe to matches for each court
  useEffect(() => {
    const unsubscribers = courts.map((court, index) => {
      if (court.matchId) {
        return subscribeToMatch(court.matchId, (data) => {
          setCourts(prev => {
            const newCourts = [...prev];
            if (newCourts[index]) {
              newCourts[index].match = data;
            }
            return newCourts;
          });
        });
      }
      return null;
    });

    return () => {
      unsubscribers.forEach(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [courts.map(c => c.matchId).join(',')]);

  const updateCourtMatchId = (courtIndex, matchId) => {
    setCourts(prev => {
      const newCourts = [...prev];
      if (newCourts[courtIndex]) {
        newCourts[courtIndex].matchId = matchId.toUpperCase();
        newCourts[courtIndex].match = null; // Reset match data
      }
      return newCourts;
    });
  };

  const clearCourt = (courtIndex) => {
    setCourts(prev => {
      const newCourts = [...prev];
      if (newCourts[courtIndex]) {
        newCourts[courtIndex].matchId = '';
        newCourts[courtIndex].match = null;
      }
      return newCourts;
    });
  };

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
    if (!match) return 'No Match';
    if (match.status === 'completed') return 'Completed';
    if (match.status === 'active') return 'In Progress';
    return 'Waiting';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-green-500';
      case 'Completed': return 'bg-gray-500';
      case 'No Match': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  // Get grid class based on court count
  const getGridClass = () => {
    if (courtCount === 1) return 'grid-cols-1';
    if (courtCount === 2) return 'grid-cols-1 md:grid-cols-2';
    if (courtCount === 3) return 'grid-cols-1 lg:grid-cols-3';
    if (courtCount === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    if (courtCount <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>🏓 Multi-Court Monitor</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Monitor and score {courtCount} court{courtCount !== 1 ? 's' : ''} simultaneously</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              ⚙️
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg ${autoRefresh ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Number of Courts</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={courtCount}
                  onChange={(e) => setCourtCount(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className={`text-xl font-bold w-12 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>{courtCount}</span>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Choose between 1-12 courts</div>
            </div>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2"
              />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Auto-refresh matches</span>
            </label>
            
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter match IDs for each court to monitor live games
            </div>
          </div>
        </div>
      )}

      {/* Courts Grid */}
      <div className={`grid ${getGridClass()} gap-6`}>
        {courts.map((court, index) => {
          const score = getScoreDisplay(court.match);
          const status = getMatchStatus(court.match);
          
          return (
            <div key={court.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
              {/* Court Header */}
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">{court.name}</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(status)}`}>
                    {status}
                  </div>
                </div>
                
                {/* Match ID Input */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={court.matchId}
                    onChange={(e) => updateCourtMatchId(index, e.target.value)}
                    placeholder="Enter Match ID"
                    className={`flex-1 px-3 py-2 rounded border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <button
                    onClick={() => updateCourtMatchId(index, '')}
                    className={`px-3 py-2 text-sm font-medium rounded ${
                      darkMode 
                        ? 'bg-gray-600 text-white hover:bg-gray-500' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Match ID */}
            <div className={`text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
              Match: {court.matchId || 'Not Set'}
            </div>

            {/* Score Display */}
            {court.match ? (
              <div className="space-y-3">
                {/* Team Names */}
                <div className="space-y-2">
                  <div className={`p-2 rounded text-sm ${
                    score.servingA 
                      ? darkMode 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-600 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-700 text-gray-300'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="truncate">{court.match.teamA?.name || 'Team A'}</span>
                      {score.servingA && <span className="text-xs animate-pulse">🏓</span>}
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded text-sm ${
                    score.servingB 
                      ? darkMode 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-600 text-white'
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300'
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
                  <div className={`font-bold ${courts.length <= 4 ? 'text-3xl' : courts.length <= 8 ? 'text-2xl' : 'text-xl'}`}>
                    {score.teamA} - {score.teamB}
                  </div>
                </div>

                {/* Match Info */}
                <div className={`text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Game {court.match.currentGame || 1} • {court.match.matchType || 'Singles'}
                </div>

                {/* Progress Indicator */}
                {court.match.games && court.match.games.length > 0 && (
                  <div className="mt-3 text-center">
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Games: {court.match.teamA?.name} {court.match.games.filter(g => g.winner === 'A').length} - {court.match.games.filter(g => g.winner === 'B').length} {court.match.teamB?.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mt-6`}>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.open('/', '_blank')}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Match
          </button>
          <button
            onClick={() => window.open('/history', '_blank')}
            className={`px-4 py-3 ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-500' : 'bg-gray-700 text-white hover:bg-gray-600'} rounded-lg transition-colors`}
          >
            View History
          </button>
            }}
            className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            OBS View
          </button>
        </div>
      </div>
    </div>
  );
}
