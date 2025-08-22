'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Grid from '../../components/Grid';
import GameUI from '../../components/GameUI';
import LevelEditor from '../../components/LevelEditor';
import { Portal, Tile } from '../../types/game';
import { gameFeatures } from '../../config/gameConfig';

export default function GamePage() {
  const {
    grid,
    path,
    isComplete,
    currentColor,
    level,
    isDragging,
    winningPath,
    showDebug,
    portals,
    userPreferences,
    initializeLevel,
    startDrag,
    continuePath,
    endDrag,
    resetPath,
    nextLevel,
    toggleDebug,
    togglePortals,
  } = useGameStore();

  const [showInstructions, setShowInstructions] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showLevelEditor, setShowLevelEditor] = useState(false);

  useEffect(() => {
    initializeLevel(1);
  }, [initializeLevel]);

  useEffect(() => {
    if (hasInteracted) {
      setShowInstructions(false);
    }
  }, [hasInteracted]);

  const handleMouseDown = (x: number, y: number) => {
    setHasInteracted(true);
    startDrag(x, y);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDragging) {
      continuePath(x, y);
    }
  };

  const handleTouchStart = (x: number, y: number) => {
    setHasInteracted(true);
    startDrag(x, y);
  };

  const handleTouchMove = (x: number, y: number) => {
    if (isDragging) {
      continuePath(x, y);
    }
  };

  const handleRestart = () => {
    resetPath();
    setShowInstructions(false);
  };

  const handleNextLevel = () => {
    nextLevel();
    setShowInstructions(false);
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    setHasInteracted(true);
  };

  const handleMouseUp = () => {
    endDrag();
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  const handleToggleLevelEditor = () => {
    setShowLevelEditor(!showLevelEditor);
  };

  const handleGridChange = (newGrid: Tile[][]) => {
    // This would need to be implemented in the game store
    // For now, we'll just log the change
    console.log('Grid changed:', newGrid);
  };

  const handlePortalsChange = (newPortals: Portal[]) => {
    // This would need to be implemented in the game store
    // For now, we'll just log the change
    console.log('Portals changed:', newPortals);
  };

  return (
    <div 
      className="min-h-screen bg-black flex items-center justify-center p-4 no-select"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative">
        <Grid
          grid={grid}
          path={path}
          currentColor={currentColor}
          winningPath={winningPath}
          showDebug={showDebug}
          portals={portals}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />
        
        <GameUI
          level={level}
          isComplete={isComplete}
          showDebug={showDebug}
          portals={portals}
          onRestart={handleRestart}
          onNextLevel={handleNextLevel}
          onToggleDebug={toggleDebug}
          onToggleLevelEditor={handleToggleLevelEditor}
          onTogglePortals={togglePortals}
          showLevelEditor={showLevelEditor}
          showInstructions={showInstructions}
          onCloseInstructions={handleCloseInstructions}
          portalsEnabled={userPreferences.portalsEnabled}
        />

        {/* Level Editor Overlay */}
        {showLevelEditor && gameFeatures.portalsEnabled && userPreferences.portalsEnabled && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto" style={{ zIndex: 60 }}>
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Level Editor</h2>
                <button
                  onClick={handleToggleLevelEditor}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
              
              <LevelEditor
                grid={grid}
                onGridChange={handleGridChange}
                onPortalsChange={handlePortalsChange}
                portals={portals || []}
                portalsEnabled={userPreferences.portalsEnabled}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
