'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext.js';
import { subscribeToCourts, createCourt } from '../../lib/courts.js';
import CourtCard from '../../components/CourtCard.js';

export default function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCourt, setShowCreateCourt] = useState(false);
  const [courtName, setCourtName] = useState('');
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/landing');
      return;
    }

    const unsubscribe = subscribeToCourts((data) => {
      setCourts(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, router]);

  const handleCreateCourt = async (e) => {
    e.preventDefault();
    if (!courtName.trim()) return;

    setCreating(true);
    const result = await createCourt(courtName.trim(), user.email);
    
    if (result.success) {
      setCourtName('');
      setShowCreateCourt(false);
    } else {
      alert('Failed to create court: ' + result.message);
    }
    
    setCreating(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/landing');
  };

  const activeMatches = courts.filter(court => court.currentMatch).length;
  const totalCourts = courts.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400 text-lg">Loading courts...</p>
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
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-purple-400 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-green-500 rounded-xl p-6 shadow-lg shadow-green-500/20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold">🏟️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Total Courts</p>
                  <p className="text-2xl font-bold text-green-400">{totalCourts}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-purple-500 rounded-xl p-6 shadow-lg shadow-purple-500/20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold">⚡</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Active Matches</p>
                  <p className="text-2xl font-bold text-purple-400">{activeMatches}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-blue-500 rounded-xl p-6 shadow-lg shadow-blue-500/20">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">Your Role</p>
                  <p className="text-2xl font-bold text-blue-400 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Live Courts</h2>
              <p className="text-gray-400">Real-time pickleball scoring across all courts</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowCreateCourt(true)}
                className="bg-green-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
              >
                + Create Court
              </button>
            )}
          </div>

          {/* Courts Grid */}
          {courts.length === 0 ? (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🏓</div>
              <h3 className="text-xl font-bold text-white mb-2">No Courts Yet</h3>
              <p className="text-gray-400 mb-6">
                {isAdmin ? 'Create your first court to get started' : 'Waiting for admin to create courts'}
              </p>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateCourt(true)}
                  className="bg-green-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition-all"
                >
                  Create First Court
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((court) => (
                <CourtCard key={court.id} court={court} user={user} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Court Modal */}
      {showCreateCourt && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-green-500/20">
            <h3 className="text-2xl font-bold text-white mb-6">Create New Court</h3>
            
            <form onSubmit={handleCreateCourt} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Court Name
                </label>
                <input
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="e.g., Court 1, Center Court"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateCourt(false)}
                  className="flex-1 bg-gray-700 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-green-500 text-black py-3 rounded-lg font-bold hover:bg-green-400 transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Court'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
