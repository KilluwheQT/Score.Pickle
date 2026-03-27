'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Scoreboard from '../../../components/Scoreboard.js';
import { subscribeToMatch } from '../../../lib/realtime.js';
import QRCode from 'qrcode';

export default function MatchPage() {
  const params = useParams();
  const matchId = params.id.toUpperCase();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    if (!matchId) return;

    setLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToMatch(matchId, (data) => {
      setMatch(data);
      setLoading(false);
    });

    // Generate QR code for sharing
    const generateQRCode = async () => {
      try {
        const url = `${window.location.origin}/match/${matchId}`;
        const qr = await QRCode.toDataURL(url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qr);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQRCode();

    // Check if user is admin (first visitor or specific parameter)
    const urlParams = new URLSearchParams(window.location.search);
    setIsAdmin(urlParams.get('mode') !== 'viewer');

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [matchId]);

  const shareMatch = async () => {
    const url = `${window.location.origin}/match/${matchId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pickleball Match',
          text: `Join my pickleball match: ${match?.teamA?.name} vs ${match?.teamB?.name}`,
          url: url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Match link copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading match...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Match Not Found</h1>
          <p className="text-gray-600 mb-6">
            The match ID "{matchId}" doesn't exist or has been completed.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create New Match
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin/Viewer Toggle */}
      <div className="fixed top-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
          <button
            onClick={() => setIsAdmin(true)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isAdmin 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              !isAdmin 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Viewer
          </button>
        </div>
      </div>

      {/* Share Button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={shareMatch}
          className="bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
          title="Share match"
        >
          📤
        </button>
      </div>

      {/* QR Code Modal */}
      {qrCodeUrl && (
        <div className="fixed bottom-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-600 mb-2 text-center">Scan to join</p>
            <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
            <p className="text-xs text-gray-500 mt-2 text-center">Match ID: {matchId}</p>
          </div>
        </div>
      )}

      <Scoreboard match={match} isAdmin={isAdmin} />
    </div>
  );
}
