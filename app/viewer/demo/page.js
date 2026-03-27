'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ViewerDemo() {
  const [demoMatch, setDemoMatch] = useState({
    id: 'DEMO123',
    teamA: { name: 'Team Alpha', score: 7, serving: true },
    teamB: { name: 'Team Beta', score: 5, serving: false },
    matchType: 'singles',
    gameFormat: '3',
    currentGame: 1,
    games: [],
    status: 'active'
  });

  const simulateScore = (team) => {
    const newMatch = { ...demoMatch };
    if (team === 'A') {
      newMatch.teamA.score = Math.min(11, newMatch.teamA.score + 1);
    } else {
      newMatch.teamB.score = Math.min(11, newMatch.teamB.score + 1);
    }
    
    // Simulate serving switch
    if (team === 'A') {
      newMatch.teamA.serving = false;
      newMatch.teamB.serving = true;
    } else {
      newMatch.teamB.serving = false;
      newMatch.teamA.serving = true;
    }
    
    setDemoMatch(newMatch);
  };

  const resetDemo = () => {
    setDemoMatch({
      id: 'DEMO123',
      teamA: { name: 'Team Alpha', score: 0, serving: true },
      teamB: { name: 'Team Beta', score: 0, serving: false },
      matchType: 'singles',
      gameFormat: '3',
      currentGame: 1,
      games: [],
      status: 'active'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">🎥 OBS Scoreboard Viewer</h1>
              <p className="text-gray-400 mt-2">Live scoreboard designed for streaming and broadcast</p>
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

      <div className="max-w-7xl mx-auto p-6">
        {/* Demo Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Demo Controls</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => simulateScore('A')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Team A Scores
            </button>
            <button
              onClick={() => simulateScore('B')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Team B Scores
            </button>
            <button
              onClick={resetDemo}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reset Demo
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Match ID: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{demoMatch.id}</span>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Live Preview</h2>
          <div className="bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <iframe
              src={`/viewer/${demoMatch.id}`}
              className="w-full h-full"
              style={{ border: 'none' }}
              title="OBS Scoreboard Preview"
            />
          </div>
        </div>

        {/* OBS Setup Instructions */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🎬 OBS Setup Instructions</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Add Browser Source</h3>
              <p>In OBS: Right-click Sources → Add → Browser</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Configure Settings</h3>
              <div className="bg-gray-700 p-4 rounded font-mono text-sm">
                URL: http://localhost:3001/viewer/DEMO123<br/>
                Width: 1920<br/>
                Height: 1080<br/>
                Custom CSS: body {`{`} background: transparent; {`}`}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Enable Transparency</h3>
              <p>Check "Shutdown source when not visible" for better performance</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">4. Customize Appearance</h3>
              <p>Click the ⚙️ button in the viewer to access color and font settings</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">✨ Key Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Real-time score synchronization</li>
              <li>• Serving team indicators</li>
              <li>• Customizable colors and fonts</li>
              <li>• Compact mode for PiP displays</li>
              <li>• Mobile-friendly responsive design</li>
              <li>• No audio (clean for broadcasting)</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">🎯 Use Cases</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Live tournament streaming</li>
              <li>• Sports commentary overlays</li>
              <li>• Multi-camera productions</li>
              <li>• Digital scoreboard displays</li>
              <li>• Mobile streaming setups</li>
              <li>• Recording and VODs</li>
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold mb-4">🔗 Quick Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href={`/viewer/${demoMatch.id}`}
              target="_blank"
              className="block p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              <div className="font-semibold">Open Viewer in New Tab</div>
              <div className="text-sm text-gray-400">Test the viewer interface</div>
            </a>
            <a
              href="/OBS_SETUP_GUIDE.md"
              target="_blank"
              className="block p-4 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            >
              <div className="font-semibold">Full Setup Guide</div>
              <div className="text-sm text-gray-400">Complete OBS configuration</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
