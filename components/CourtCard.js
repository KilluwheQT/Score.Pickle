'use client';

import Link from 'next/link';

export default function CourtCard({ court, user }) {
  const hasActiveMatch = court.currentMatch;
  const isActive = court.status === 'active';

  const getStatusColor = () => {
    if (!isActive) return 'border-gray-600';
    if (hasActiveMatch) return 'border-green-500 shadow-green-500/30';
    return 'border-yellow-500 shadow-yellow-500/30';
  };

  const getStatusText = () => {
    if (!isActive) return 'Inactive';
    if (hasActiveMatch) return 'Live Match';
    return 'Available';
  };

  const getStatusBg = () => {
    if (!isActive) return 'bg-gray-600';
    if (hasActiveMatch) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  return (
    <div className={`bg-gray-900 border-2 ${getStatusColor()} rounded-xl p-6 shadow-lg transition-all hover:scale-105 ${hasActiveMatch ? 'shadow-2xl' : ''}`}>
      {/* Court Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{court.name}</h3>
          <p className="text-sm text-gray-400">ID: {court.id}</p>
        </div>
        <div className={`${getStatusBg()} px-3 py-1 rounded-full text-xs font-bold text-black`}>
          {getStatusText()}
        </div>
      </div>

      {/* Match Content */}
      {hasActiveMatch ? (
        <div className="space-y-4">
          {/* Teams and Score */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Team A</p>
                <p className="text-lg font-bold text-white">{court.currentMatch.teamA.name}</p>
                <div className={`text-3xl font-bold mt-2 ${court.currentMatch.teamA.serving ? 'text-green-400' : 'text-gray-500'}`}>
                  {court.currentMatch.teamA.score}
                  {court.currentMatch.teamA.serving && (
                    <div className="text-xs text-green-400 mt-1">🏓 Serving</div>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Team B</p>
                <p className="text-lg font-bold text-white">{court.currentMatch.teamB.name}</p>
                <div className={`text-3xl font-bold mt-2 ${court.currentMatch.teamB.serving ? 'text-green-400' : 'text-gray-500'}`}>
                  {court.currentMatch.teamB.score}
                  {court.currentMatch.teamB.serving && (
                    <div className="text-xs text-green-400 mt-1">🏓 Serving</div>
                  )}
                </div>
              </div>
            </div>

            {/* Match Status */}
            {court.currentMatch.winner && (
              <div className="mt-4 text-center">
                <div className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold inline-block">
                  🏆 Winner: Team {court.currentMatch.winner}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Link href={`/court/${court.id}`}>
            <button className="w-full bg-green-500 text-black py-3 rounded-lg font-bold hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30">
              {court.currentMatch.winner ? 'View Match' : 'Join Match'}
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* No Match State */}
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-2">🏓</div>
            <p className="text-gray-400">
              {isActive ? 'No match in progress' : 'Court not active'}
            </p>
          </div>

          {/* Action Button */}
          {isActive && (
            <Link href={`/court/${court.id}`}>
              <button className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-400 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30">
                Start Match
              </button>
            </Link>
          )}
        </div>
      )}

      {/* Court Footer */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Created: {new Date(court.createdAt).toLocaleDateString()}</span>
          {hasActiveMatch && (
            <span>Started: {new Date(court.currentMatch.startTime).toLocaleTimeString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
