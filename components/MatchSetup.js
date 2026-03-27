'use client';

import { useState } from 'react';
import { createMatch } from '../lib/realtime.js';
import { useRouter } from 'next/navigation';

export default function MatchSetup({ darkMode = false }) {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [matchType, setMatchType] = useState('singles');
  const [gameFormat, setGameFormat] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartMatch = async (e) => {
    e.preventDefault();
    
    if (!teamA.trim() || !teamB.trim()) {
      alert('Please enter both team names');
      return;
    }

    setIsLoading(true);

    try {
      const matchData = {
        teamA: {
          name: teamA.trim(),
          score: 0,
          serving: true
        },
        teamB: {
          name: teamB.trim(),
          score: 0,
          serving: false
        },
        matchType,
        gameFormat,
        currentGame: 1,
        games: [], // Store completed games
        server: { team: 'A', player: 1 }, // For doubles rotation
        sideSwitchNeeded: false // Track when sides need to switch
      };

      const matchId = await createMatch(matchData);
      router.push(`/match/${matchId}`);
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Failed to create match. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-green-50'} flex items-center justify-center p-4`}>
      <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl shadow-xl p-8 w-full max-w-md`}>
        <h1 className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🏓 Pickleball Match Setup
        </h1>
        
        <form onSubmit={handleStartMatch} className="space-y-6">
          {/* Team Names */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Team A Name
              </label>
              <input
                type="text"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Enter Team A name"
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Team B Name
              </label>
              <input
                type="text"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Enter Team B name"
                required
              />
            </div>
          </div>

          {/* Match Type */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Match Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMatchType('singles')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  matchType === 'singles'
                    ? 'bg-blue-500 text-white'
                    : darkMode 
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Singles
              </button>
              <button
                type="button"
                onClick={() => setMatchType('doubles')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  matchType === 'doubles'
                    ? 'bg-green-500 text-white'
                    : darkMode 
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Doubles
              </button>
            </div>
          </div>

          {/* Game Format */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Game Format
            </label>
            <select
              value={gameFormat}
              onChange={(e) => setGameFormat(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-600 border-gray-500 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="1">Best of 1</option>
              <option value="3">Best of 3</option>
              <option value="5">Best of 5</option>
            </select>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Match...' : 'Start Match'}
          </button>
        </form>

        {/* Quick Join */}
        <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            Have a match ID?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Match ID"
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300'
              }`}
              id="quickJoinInput"
            />
            <button
              onClick={() => {
                const input = document.getElementById('quickJoinInput');
                if (input.value.trim()) {
                  router.push(`/match/${input.value.trim().toUpperCase()}`);
                }
              }}
              className="bg-purple-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
