import React from 'react';
import Link from 'next/link';
import { Portal } from '../types/game';
import { gameFeatures } from '../config/gameConfig';

interface GameUIProps {
  level: number;
  isComplete: boolean;
  showDebug: boolean;
  portals?: Portal[];
  onRestart: () => void;
  onNextLevel: () => void;
  showInstructions: boolean;
  onCloseInstructions: () => void;
  portalsEnabled: boolean;
}

export default function GameUI({ 
  level, 
  isComplete,
  showDebug,
  portals = [],
  onRestart, 
  onNextLevel,
  showInstructions,
  onCloseInstructions,
  portalsEnabled
}: GameUIProps) {
  return (
    <div className="fixed inset-0 pointer-events-none no-select" style={{ zIndex: 30 }}>
      {/* Top UI */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto" style={{ zIndex: 40 }}>
        <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-2xl">
          <h1 className="text-2xl font-bold">Level {level}</h1>
          {gameFeatures.portalsEnabled && portalsEnabled && portals.length > 0 && (
            <div className="text-sm text-center mt-1">
              <span className="text-blue-400">🌀</span> {portals.length} Portal{portals.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Game Status Info - Mobile Optimized */}
      <div className="absolute top-4 right-4 pointer-events-auto" style={{ zIndex: 40 }}>
        <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
          {gameFeatures.portalsEnabled && portalsEnabled && portals.length > 0 && (
            <div className="text-blue-400">
              🌀 {portals.length} Portal{portals.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Instructions overlay - shown only on first level */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto" style={{ zIndex: 50 }}>
          <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <div className="space-y-3 text-left">
              <p>• <span className="text-yellow-400">Start from the colored tile</span> (already lit up)</p>
              <p>• <span className="text-blue-400">Drag from the end of your line</span> through adjacent tiles</p>
              {gameFeatures.portalsEnabled && (
                <p>• <span className="text-blue-400">🌀 Toggle portals ON/OFF</span> from the main menu before starting</p>
              )}
              {gameFeatures.portalsEnabled && (
                <p>• <span className="text-blue-400">🌀 Blue tiles are portal entrances</span> - teleport to green exits ✨</p>
              )}
              <p>• <span className="text-red-400">You cannot click squares</span> to highlight them</p>
              <p>• <span className="text-green-400">Cover all tiles</span> to complete the level</p>
              <p>• <span className="text-orange-400">Tap the start tile again</span> to reset</p>
            </div>
            <button
              onClick={onCloseInstructions}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Victory overlay */}
      {isComplete && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto" style={{ zIndex: 50 }}>
          <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Level Complete!</h2>
            <p className="text-gray-300 mb-6">Great job! You&apos;ve filled all the tiles.</p>
            {gameFeatures.portalsEnabled && portalsEnabled && portals.length > 0 && (
              <p className="text-blue-400 mb-4">🌀 You used {portals.length} portal{portals.length !== 1 ? 's' : ''} to complete this level!</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onRestart}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
              >
                Restart
              </button>
              <button
                onClick={onNextLevel}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                Next Level
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto" style={{ zIndex: 40 }}>
        <div className="flex gap-3">
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-2xl"
          >
            ← Home
          </Link>
          <button
            onClick={onRestart}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-2xl"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
