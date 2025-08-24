'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Grid from '../../components/Grid';
import GameUI from '../../components/GameUI';

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
          showInstructions={showInstructions}
          onCloseInstructions={handleCloseInstructions}
          portalsEnabled={userPreferences.portalsEnabled}
        />


      </div>
    </div>
  );
}
