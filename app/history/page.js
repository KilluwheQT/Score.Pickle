'use client';

import { useState, useEffect } from 'react';
import { subscribeToHistory } from '../../lib/realtime.js';
import Link from 'next/link';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToHistory((data) => {
      setHistory(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredHistory = history.filter(match => 
    match.teamA?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.teamB?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMatchDuration = (match) => {
    if (!match.createdAt || !match.completedAt) return 'Unknown';
    const duration = match.completedAt - match.createdAt;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading match history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-green-50'} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 mb-6`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">📊 Match History</h1>
              <p className="text-gray-600 mt-1">
                {filteredHistory.length} {filteredHistory.length === 1 ? 'match' : 'matches'} completed
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                New Match
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by team name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 pl-10 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-12 text-center`}>
            <div className="text-6xl mb-4">🏓</div>
            <h2 className="text-2xl font-bold mb-2">
              {searchTerm ? 'No matches found' : 'No matches completed yet'}
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start your first match to see it here!'}
            </p>
            {!searchTerm && (
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create First Match
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredHistory.map((match, index) => (
              <div
                key={`${match.id || 'no-id'}-${index}`}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        match.winner === 'A' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {match.teamA.name} won
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(match.completedAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">
                      {match.teamA.name} vs {match.teamB.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {match.matchType === 'singles' ? 'Singles' : 'Doubles'}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Best of {match.gameFormat}
                    </div>
                  </div>
                </div>

                {/* Game Results */}
                <div className="mb-4">
                  <div className="flex gap-2 flex-wrap">
                    {match.games?.map((game, gameIndex) => (
                      <div
                        key={gameIndex}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          game.winner === 'A'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        Game {game.gameNumber}: {match.teamA.name} {game.teamAScore} - {game.teamBScore} {match.teamB.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Match Stats */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Duration: {getMatchDuration(match)}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Final Score: {match.teamA.name} {match.games?.filter(g => g.winner === 'A').length} - {match.games?.filter(g => g.winner === 'B').length} {match.teamB.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
