'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext.js';
import { subscribeToMatch, createMatch, updateMatchScore, undoLastScore, resetMatch } from '../../../lib/courts.js';

export default function CourtPage() {
  const { user } = useAuth();
  const params = useParams();
  const courtId = params.id;
  const router = useRouter();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [refereeCode, setRefereeCode] = useState('');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showRefCodeInput, setShowRefCodeInput] = useState(false);
  const [inputRefCode, setInputRefCode] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/landing');
      return;
    }

    if (!courtId) {
      router.push('/dashboard');
      return;
    }

    // Subscribe to match updates
    const unsubscribe = subscribeToMatch(courtId, (data) => {
      setMatch(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, courtId, router]);

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!teamA.trim() || !teamB.trim() || !refereeCode.trim()) return;

    setCreating(true);
    const result = await createMatch(courtId, teamA.trim(), teamB.trim(), refereeCode.trim());
    
    if (result.success) {
      setTeamA('');
      setTeamB('');
      setRefereeCode('');
      setShowCreateMatch(false);
    } else {
      alert('Failed to create match: ' + result.message);
    }
    
    setCreating(false);
  };

  const handleScoreUpdate = async (team) => {
    if (!inputRefCode.trim()) {
      alert('Please enter your referee code');
      return;
    }

    setUpdating(true);
    const result = await updateMatchScore(courtId, inputRefCode.trim(), team);
    
    if (!result.success) {
      alert('Failed to update score: ' + result.message);
    }
    
    setUpdating(false);
  };

  const handleUndo = async () => {
    if (!inputRefCode.trim()) {
      alert('Please enter your referee code');
      return;
    }

    setUpdating(true);
    const result = await undoLastScore(courtId, inputRefCode.trim());
    
    if (!result.success) {
      alert('Failed to undo: ' + result.message);
    }
    
    setUpdating(false);
  };

  const handleReset = async () => {
    if (!inputRefCode.trim()) {
      alert('Please enter your referee code');
      return;
    }

    if (!confirm('Are you sure you want to reset this match?')) return;

    setUpdating(true);
    const result = await resetMatch(courtId, inputRefCode.trim());
    
    if (!result.success) {
      alert('Failed to reset: ' + result.message);
    }
    
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400 text-lg">Loading court...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-green-400">🏓 Pickleball Pro</h1>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:pt-1">
                <Link
                  href="/dashboard"
                  className="text-green-400 hover:text-green-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <span className="text-gray-400 px-3 py-2 rounded-md text-sm font-medium">
                  Court {courtId}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
              <Link
                href="/dashboard"
                className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!match ? (
            /* No Match State */
            <div className="text-center">
              <div className="text-6xl mb-4">🏓</div>
              <h2 className="text-3xl font-bold text-white mb-4">No Active Match</h2>
              <p className="text-gray-400 mb-8">Start a new match on this court</p>
              
              <button
                onClick={() => setShowCreateMatch(true)}
                className="bg-green-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
              >
                Start New Match
              </button>
            </div>
          ) : (
            /* Match Active */
            <div className="space-y-8">
              {/* Match Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Court {courtId}</h2>
                <div className="flex justify-center items-center space-x-4">
                  <div className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                    LIVE MATCH
                  </div>
                  {match.winner && (
                    <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                      🏆 Team {match.winner} Wins!
                    </div>
                  )}
                </div>
              </div>

              {/* Scoreboard */}
              <div className="bg-gray-900 border-2 border-green-500 rounded-2xl p-8 shadow-2xl shadow-green-500/20">
                <div className="grid grid-cols-3 gap-8 items-center">
                  {/* Team A */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-green-400 mb-4">Team A</h3>
                    <p className="text-2xl font-bold text-white mb-6">{match.teamA.name}</p>
                    <div className={`text-6xl font-bold ${match.teamA.serving ? 'text-green-400' : 'text-gray-600'} mb-4`}>
                      {match.teamA.score}
                    </div>
                    {match.teamA.serving && (
                      <div className="text-green-400 text-sm font-bold">🏓 SERVING</div>
                    )}
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-500">VS</div>
                  </div>

                  {/* Team B */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Team B</h3>
                    <p className="text-2xl font-bold text-white mb-6">{match.teamB.name}</p>
                    <div className={`text-6xl font-bold ${match.teamB.serving ? 'text-purple-400' : 'text-gray-600'} mb-4`}>
                      {match.teamB.score}
                    </div>
                    {match.teamB.serving && (
                      <div className="text-purple-400 text-sm font-bold">🏓 SERVING</div>
                    )}
                  </div>
                </div>

                {/* Score Controls */}
                {!match.winner && (
                  <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Referee Code (Required to update scores)
                      </label>
                      <input
                        type="text"
                        value={inputRefCode}
                        onChange={(e) => setInputRefCode(e.target.value)}
                        placeholder="Enter your referee code"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button
                        onClick={() => handleScoreUpdate('teamA')}
                        disabled={updating || !match.teamA.serving}
                        className="bg-green-500 text-black py-4 rounded-lg font-bold text-lg hover:bg-green-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
                      >
                        +1 Team A
                      </button>
                      
                      <button
                        onClick={() => handleScoreUpdate('teamB')}
                        disabled={updating || !match.teamB.serving}
                        className="bg-purple-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
                      >
                        +1 Team B
                      </button>
                      
                      <button
                        onClick={handleUndo}
                        disabled={updating}
                        className="bg-yellow-500 text-black py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↶ Undo
                      </button>
                      
                      <button
                        onClick={handleReset}
                        disabled={updating}
                        className="bg-red-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reset
                      </button>
                    </div>

                    {match.teamA.serving && (
                      <div className="mt-4 text-center text-green-400 text-sm">
                        Only Team A can score (serving team)
                      </div>
                    )}
                    {match.teamB.serving && (
                      <div className="mt-4 text-center text-purple-400 text-sm">
                        Only Team B can score (serving team)
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Match Info */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Match Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Referee Code:</span>
                    <span className="text-white ml-2 font-mono">{match.refereeCode}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Started:</span>
                    <span className="text-white ml-2">
                      {new Date(match.startTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white ml-2 capitalize">{match.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Points Played:</span>
                    <span className="text-white ml-2">{match.gameHistory.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Match Modal */}
          {showCreateMatch && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-green-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Start New Match</h3>
                
                <form onSubmit={handleCreateMatch} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team A Name
                    </label>
                    <input
                      type="text"
                      value={teamA}
                      onChange={(e) => setTeamA(e.target.value)}
                      placeholder="Enter Team A name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team B Name
                    </label>
                    <input
                      type="text"
                      value={teamB}
                      onChange={(e) => setTeamB(e.target.value)}
                      placeholder="Enter Team B name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Referee Code
                    </label>
                    <input
                      type="text"
                      value={refereeCode}
                      onChange={(e) => setRefereeCode(e.target.value)}
                      placeholder="Enter your referee code"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateMatch(false)}
                      className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 bg-green-500 text-black py-3 rounded-lg font-bold hover:bg-green-400 transition-all disabled:opacity-50"
                    >
                      {creating ? 'Creating...' : 'Start Match'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
