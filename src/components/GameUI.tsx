import React from 'react';
import Link from 'next/link';

interface GameUIProps {
  level: number;
  isComplete: boolean;
  onRestart: () => void;
  onNextLevel: () => void;
  showInstructions: boolean;
}

export default function GameUI({ 
  level, 
  isComplete, 
  onRestart, 
  onNextLevel, 
  showInstructions 
}: GameUIProps) {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top UI */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-2xl">
          <h1 className="text-2xl font-bold">Level {level}</h1>
        </div>
      </div>

      {/* Instructions overlay - shown only on first level */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <div className="space-y-3 text-left">
              <p>• <span className="text-yellow-400">Tap the start tile</span> to begin</p>
              <p>• <span className="text-blue-400">Drag through adjacent tiles</span> to fill them</p>
              <p>• <span className="text-green-400">Cover all tiles</span> to complete the level</p>
              <p>• <span className="text-orange-400">Tap start tile again</span> to reset</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Victory overlay */}
      {isComplete && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Level Complete!</h2>
            <p className="text-gray-300 mb-6">Great job! You&apos;ve filled all the tiles.</p>
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
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
