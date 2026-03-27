'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LeagueSetupPage() {
  const [matchId, setMatchId] = useState('');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const obsUrl = matchId ? `http://localhost:3001/league/${matchId.toUpperCase()}` : '';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">🏓 League Scoreboard</h1>
              <p className="text-gray-400 mt-2">Professional tournament scoreboard for OBS</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Design Preview */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">🎨 Scoreboard Design</h2>
          
          {/* Mini preview of the scoreboard design */}
          <div className="bg-black rounded-lg overflow-hidden max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-purple-600 text-white text-center py-2 px-4">
              <div className="text-sm font-bold">PICKLEBALL BUDDIES WOMEN'S MONTH LEAGUE</div>
            </div>
            
            {/* Player sections */}
            <div className="bg-white">
              <div className="bg-black text-white p-2">
                <div className="text-sm font-bold">TEAM A NAME</div>
              </div>
              <div className="h-1 bg-purple-600"></div>
              
              <div className="bg-white text-black p-2">
                <div className="text-sm font-bold">TEAM B NAME</div>
              </div>
              <div className="h-1 bg-purple-600"></div>
              
              {/* Score boxes */}
              <div className="bg-gray-100 p-3 flex justify-center gap-4">
                <div className="text-center">
                  <div className="bg-gray-800 text-white px-3 py-1 rounded mb-1">
                    <div className="text-xs">SET 1</div>
                    <div className="text-sm font-bold">0-0</div>
                  </div>
                  <div className="text-xs text-gray-600">SET 1 SCORE</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gray-300 text-black px-3 py-1 rounded mb-1">
                    <div className="text-xs">SET 2</div>
                    <div className="text-sm font-bold">0-0</div>
                  </div>
                  <div className="text-xs text-gray-600">SET 2 SCORE</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-600 text-white px-3 py-1 rounded mb-1">
                    <div className="text-xs">CURRENT</div>
                    <div className="text-sm font-bold">0-0</div>
                  </div>
                  <div className="text-xs text-gray-600">SET 3 SCORE</div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-800 text-white text-center py-1 px-4">
              <div className="text-xs opacity-75">Game 1 • Singles • Match ID: DEMO123</div>
            </div>
          </div>
        </div>

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
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={() => copyToClipboard(obsUrl)}
                  disabled={!matchId}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Step 1: Add Browser Source</h3>
              <p className="text-gray-400">In OBS: Right-click Sources → Add → Browser</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Step 2: Configure Settings</h3>
              <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                URL: {matchId ? obsUrl : 'http://localhost:3001/league/YOUR_MATCH_ID'}<br/>
                Width: 800<br/>
                Height: 400<br/>
                Custom CSS: body {'{'} background: transparent; {'}'}
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">Step 3: Troubleshooting</h3>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• If you see black: Try Width: 800, Height: 400</li>
                <li>• If still black: Use test URL below first</li>
                <li>• Refresh browser source in OBS</li>
                <li>• Make sure your dev server is running</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">✨ Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Professional tournament design</li>
              <li>• Set-based scoring (best of 3)</li>
              <li>• Purple league branding</li>
              <li>• Clean white/black contrast</li>
              <li>• Serving indicators</li>
              <li>• Real-time updates</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Perfect For</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Tournament broadcasting</li>
              <li>• League play streaming</li>
              <li>• Professional events</li>
              <li>• Multi-game matches</li>
              <li>• Commentary overlays</li>
              <li>• Digital displays</li>
            </ul>
          </div>
        </div>

        {/* Quick Test */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">🧪 Quick Test</h2>
          <p className="text-gray-400 mb-4">
            Test the scoreboard design with static data to verify it works in OBS:
          </p>
          <div className="bg-gray-700 p-4 rounded">
            <div className="text-sm text-gray-400 mb-2">Test URL (always works):</div>
            <div className="font-mono text-sm break-all mb-3">
              http://localhost:3001/league/test/DEMO123
            </div>
            <a
              href="/league/test/DEMO123"
              target="_blank"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Open Test in Browser
            </a>
          </div>
        </div>

        {/* Preview */}
        {matchId && (
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">👁️ Live Preview</h2>
            <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '2/1' }}>
              <iframe
                src={`/league/${matchId.toUpperCase()}`}
                className="w-full h-full"
                style={{ border: 'none' }}
                title="League Scoreboard Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
