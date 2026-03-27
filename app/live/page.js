'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LiveSetupPage() {
  const [matchId, setMatchId] = useState('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const obsUrl = matchId ? `http://localhost:3001/live/${matchId.toUpperCase()}` : '';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">🎥 Live OBS Scoreboard</h1>
              <p className="text-gray-400 mt-2">Simple, clean scoreboard for live streaming</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Quick Setup */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">🚀 Quick Setup</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Enter Match ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={matchId}
                  onChange={(e) => setMatchId(e.target.value)}
                  placeholder="e.g., ABC123"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => copyToClipboard(obsUrl)}
                  disabled={!matchId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {copied ? '✓ Copied!' : '📋 Copy URL'}
                </button>
              </div>
            </div>

            {matchId && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">OBS Browser Source URL:</div>
                <div className="font-mono text-sm break-all">{obsUrl}</div>
              </div>
            )}
          </div>
        </div>

        {/* OBS Instructions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">🎬 OBS Setup Instructions</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold mb-2">Add Browser Source</h3>
                <p className="text-gray-400">In OBS: Right-click in Sources panel → Add → Browser</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold mb-2">Configure Source</h3>
                <div className="bg-gray-700 p-3 rounded font-mono text-sm">
                  URL: {matchId ? obsUrl : 'http://localhost:3001/live/YOUR_MATCH_ID'}<br/>
                  Width: 1920 (or your stream resolution)<br/>
                  Height: 1080 (or your stream resolution)<br/>
                  CSS: body {'{'} background: transparent; {'}'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold mb-2">Position & Size</h3>
                <p className="text-gray-400">Drag to position, resize as needed. Use full screen for main scoreboard or smaller for picture-in-picture.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        {matchId && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">👁️ Preview</h2>
            <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={`/live/${matchId.toUpperCase()}`}
                className="w-full h-full"
                style={{ border: 'none' }}
                title="Live Scoreboard Preview"
              />
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">✨ Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Clean, minimal design</li>
              <li>• Large, readable scores</li>
              <li>• Serving team indicators</li>
              <li>• Real-time updates</li>
              <li>• No controls or settings</li>
              <li>• Perfect for streaming</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Use Cases</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Live tournament streams</li>
              <li>• Sports commentary</li>
              <li>• Multi-camera setups</li>
              <li>• Recording overlays</li>
              <li>• Digital displays</li>
              <li>• Mobile streaming</li>
            </ul>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold mb-4">💡 Pro Tips</h3>
          <div className="space-y-3 text-gray-300">
            <div>
              <strong>Transparency:</strong> The scoreboard has a black background. Use chroma key in OBS if you need transparency.
            </div>
            <div>
              <strong>Performance:</strong> Set "Refresh browser when scene becomes active" for better performance.
            </div>
            <div>
              <strong>Size:</strong> The scoreboard is responsive and will adapt to any source size.
            </div>
            <div>
              <strong>Updates:</strong> Scores update in real-time as they're entered in the main scoreboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
