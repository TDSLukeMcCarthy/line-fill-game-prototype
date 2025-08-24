'use client';

import { useState } from 'react';
import { gameFeatures } from '../config/gameConfig';

export default function Home() {
  const [portalsEnabled, setPortalsEnabled] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const handleTogglePortals = () => {
    setPortalsEnabled(!portalsEnabled);
  };

  const handleToggleDebug = () => {
    setShowDebug(!showDebug);
  };

  const handleStartGame = () => {
    // Store preferences in localStorage for the game to use
    localStorage.setItem('portalsEnabled', portalsEnabled.toString());
    localStorage.setItem('showDebug', showDebug.toString());
    window.location.href = '/game';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center w-full max-w-md">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 md:mb-8">
          🧩 Path Fill Puzzle
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto">
          Draw a path to light up all the tiles
        </p>
        
        {/* Game Settings */}
        <div className="mb-8 space-y-4">
          {/* Portal Toggle */}
          {gameFeatures.portalsEnabled && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Game Settings</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleTogglePortals}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors shadow-lg ${
                    portalsEnabled 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {portalsEnabled ? '🌀 Portals: ON' : '🌀 Portals: OFF'}
                </button>
                
                <button
                  onClick={handleToggleDebug}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors shadow-lg ${
                    showDebug 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {showDebug ? '🐛 Debug: ON' : '🐛 Debug: OFF'}
                </button>
              </div>
              
              {portalsEnabled && (
                <p className="text-sm text-blue-400 mt-3">
                  Portals will add teleportation mechanics to your puzzles!
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          className="w-full px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl md:text-2xl font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 mb-8"
        >
          Start Game
        </button>
        
        {/* Game Info */}
        <div className="text-sm text-gray-500 space-y-2">
          <p>Fill every tile with a continuous path</p>
          <p>Perfect for brain training and spatial reasoning</p>
          {portalsEnabled && (
            <p className="text-blue-400 mt-2">🌀 Portal mode enabled</p>
          )}
        </div>
      </div>
    </div>
  );
}
