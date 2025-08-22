'use client';

import React from 'react';
import Link from 'next/link';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🍎 Physics Game
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Drop fruits and watch them collide with physics!
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <div className="w-96 h-64 bg-gray-200 border-2 border-gray-300 rounded flex items-center justify-center mb-4">
              <p className="text-gray-500">Game Canvas Here</p>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-xl font-bold">Score: 0</div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Start Game
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Reset
              </button>
            </div>
            
            <p className="text-sm text-gray-600">
              Click to spawn fruits and watch physics simulation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
