'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { subscribeToMatch } from '../../../lib/realtime.js';

export default function ViewerPage() {
  const params = useParams();
  const matchId = params.id.toUpperCase();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    teamAColor: '#3B82F6',
    teamBColor: '#10B981',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    showMatchId: false,
    showGameNumber: true,
    compactMode: false,
    fontSize: 'large'
  });

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('obs-viewer-settings');
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('obs-viewer-settings', JSON.stringify(newSettings));
    }
  };

  useEffect(() => {
    if (!matchId) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToMatch(matchId, (data) => {
      setMatch(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [matchId]);

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-4xl';
      case 'medium': return 'text-6xl';
      case 'large': return 'text-8xl';
      case 'xlarge': return 'text-9xl';
      default: return 'text-8xl';
    }
  };

  const getScoreFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-6xl';
      case 'medium': return 'text-8xl';
      case 'large': return 'text-9xl';
      case 'xlarge': return 'text-[10rem]';
      default: return 'text-9xl';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${settings.backgroundColor}`}>
        <div className="text-center">
          <div className="animate-pulse">
            <div className={`text-4xl font-bold ${settings.textColor}`}>Loading Match...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${settings.backgroundColor}`}>
        <div className="text-center">
          <div className={`text-4xl font-bold ${settings.textColor}`}>Match Not Found</div>
          <div className={`text-xl mt-4 ${settings.textColor} opacity-75`}>ID: {matchId}</div>
        </div>
      </div>
    );
  }

  if (match.status === 'completed') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${settings.backgroundColor}`}>
        <div className="text-center">
          <div className={`text-6xl font-bold mb-8 ${settings.textColor}`}>🏓 MATCH COMPLETE 🏓</div>
          <div className={`text-4xl font-bold mb-4 ${settings.textColor}`}>
            {match.winner === 'A' ? match.teamA.name : match.teamB.name} WINS!
          </div>
          <div className={`text-2xl ${settings.textColor} opacity-75`}>
            {match.teamA.name} {match.games?.filter(g => g.winner === 'A').length || 0} - {match.games?.filter(g => g.winner === 'B').length || 0} {match.teamB.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${settings.backgroundColor}`}>
      {/* Settings Panel (only shown when toggled) */}
      {showSettings && (
        <div className="absolute top-4 right-4 z-50 bg-black bg-opacity-90 text-white p-6 rounded-lg shadow-2xl max-w-sm">
          <h3 className="text-lg font-bold mb-4">OBS Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Team A Color</label>
              <input
                type="color"
                value={settings.teamAColor}
                onChange={(e) => saveSettings({ ...settings, teamAColor: e.target.value })}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2">Team B Color</label>
              <input
                type="color"
                value={settings.teamBColor}
                onChange={(e) => saveSettings({ ...settings, teamBColor: e.target.value })}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2">Background Color</label>
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => saveSettings({ ...settings, backgroundColor: e.target.value })}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2">Text Color</label>
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => saveSettings({ ...settings, textColor: e.target.value })}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2">Font Size</label>
              <select
                value={settings.fontSize}
                onChange={(e) => saveSettings({ ...settings, fontSize: e.target.value })}
                className="w-full p-2 rounded bg-gray-800 text-white"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showMatchId}
                  onChange={(e) => saveSettings({ ...settings, showMatchId: e.target.checked })}
                  className="mr-2"
                />
                Show Match ID
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showGameNumber}
                  onChange={(e) => saveSettings({ ...settings, showGameNumber: e.target.checked })}
                  className="mr-2"
                />
                Show Game Number
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={(e) => saveSettings({ ...settings, compactMode: e.target.checked })}
                  className="mr-2"
                />
                Compact Mode
              </label>
            </div>
            
            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
            >
              Close Settings
            </button>
          </div>
        </div>
      )}

      {/* Settings Toggle Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 right-4 z-40 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-75 transition-all"
      >
        ⚙️
      </button>

      {/* Main Scoreboard */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-6xl">
          {/* Match Info Header */}
          {settings.showMatchId && (
            <div className="text-center mb-4">
              <div className={`text-lg font-mono ${settings.textColor} opacity-75`}>
                Match ID: {matchId}
              </div>
            </div>
          )}

          {/* Game Number */}
          {settings.showGameNumber && !settings.compactMode && (
            <div className="text-center mb-6">
              <div className={`text-2xl font-bold ${settings.textColor} opacity-75`}>
                Game {match.currentGame} • {match.matchType === 'singles' ? 'Singles' : 'Doubles'} • Best of {match.gameFormat}
              </div>
            </div>
          )}

          {/* Score Display */}
          <div className={`${settings.compactMode ? 'flex-row' : 'flex-col'} flex justify-center items-center gap-8`}>
            {/* Team A */}
            <div 
              className={`text-center p-8 rounded-2xl transition-all duration-300 ${
                match.teamA.serving 
                  ? 'ring-4 ring-white ring-opacity-50 transform scale-105' 
                  : ''
              }`}
              style={{ 
                backgroundColor: match.teamA.serving ? settings.teamAColor : 'transparent',
                color: match.teamA.serving ? '#FFFFFF' : settings.textColor
              }}
            >
              <div className={`${getFontSize()} font-bold mb-4 ${settings.compactMode ? 'mb-2' : ''}`}>
                {match.teamA.name}
              </div>
              <div className={`${getScoreFontSize()} font-black`}>
                {match.teamA.score}
              </div>
              {match.teamA.serving && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="animate-pulse text-2xl">🏓</span>
                  <span className="text-sm font-medium">SERVING</span>
                </div>
              )}
            </div>

            {/* VS Separator */}
            <div className={`text-4xl font-bold ${settings.textColor} opacity-50 ${settings.compactMode ? 'text-2xl' : ''}`}>
              VS
            </div>

            {/* Team B */}
            <div 
              className={`text-center p-8 rounded-2xl transition-all duration-300 ${
                match.teamB.serving 
                  ? 'ring-4 ring-white ring-opacity-50 transform scale-105' 
                  : ''
              }`}
              style={{ 
                backgroundColor: match.teamB.serving ? settings.teamBColor : 'transparent',
                color: match.teamB.serving ? '#FFFFFF' : settings.textColor
              }}
            >
              <div className={`${getFontSize()} font-bold mb-4 ${settings.compactMode ? 'mb-2' : ''}`}>
                {match.teamB.name}
              </div>
              <div className={`${getScoreFontSize()} font-black`}>
                {match.teamB.score}
              </div>
              {match.teamB.serving && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="animate-pulse text-2xl">🏓</span>
                  <span className="text-sm font-medium">SERVING</span>
                </div>
              )}
            </div>
          </div>

          {/* Games Won Display */}
          {match.games && match.games.length > 0 && !settings.compactMode && (
            <div className="text-center mt-8">
              <div className={`text-xl ${settings.textColor} opacity-75`}>
                Games Won: {match.teamA.name} {match.games.filter(g => g.winner === 'A').length} - {match.games.filter(g => g.winner === 'B').length} {match.teamB.name}
              </div>
            </div>
          )}

          {/* Serving Indicator (Bottom) */}
          <div className="text-center mt-8">
            <div className={`text-lg ${settings.textColor} opacity-75`}>
              {match.teamA.serving ? `${match.teamA.name} serving` : `${match.teamB.name} serving`}
            </div>
          </div>
        </div>
      </div>

      {/* OBS Instructions Overlay (shown on hover) */}
      <div className="absolute bottom-4 left-4 opacity-25 hover:opacity-100 transition-opacity">
        <div className={`text-xs ${settings.textColor} font-mono`}>
          OBS: Use Browser Source • Transparency: Yes • Width: 1920 • Height: 1080
        </div>
      </div>
    </div>
  );
}
