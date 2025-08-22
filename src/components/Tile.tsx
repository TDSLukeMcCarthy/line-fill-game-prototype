import React, { useState, useEffect } from 'react';
import { Tile as TileType } from '../types/game';

interface TileProps {
  tile: TileType;
  currentColor: string;
  onMouseDown: (x: number, y: number) => void;
  onMouseEnter: (x: number, y: number) => void;
  onTouchStart: (x: number, y: number) => void;
  onTouchMove: (x: number, y: number) => void;
}

export default function Tile({ 
  tile, 
  currentColor, 
  onMouseDown, 
  onMouseEnter, 
  onTouchStart, 
  onTouchMove 
}: TileProps) {
  const { x, y, isActive, isStart, visited } = tile;
  const [isPulsing, setIsPulsing] = useState(false);

  // Trigger neon pulse effect when tile becomes visited (but not on start tile)
  useEffect(() => {
    // Only trigger pulse if tile is newly visited, not on start tile, and is active
    if (visited && !isStart && isActive && !isPulsing) {
      setIsPulsing(true);
      
      // Stop pulsing after animation completes
      const pulseTimer = setTimeout(() => setIsPulsing(false), 2000);
      return () => clearTimeout(pulseTimer);
    }
  }, [visited, isStart, isActive, isPulsing]);
  
  // Reset pulsing state when tile becomes unvisited
  useEffect(() => {
    if (!visited && isPulsing) {
      setIsPulsing(false);
    }
  }, [visited, isPulsing]);
  
  if (!isActive) {
    return (
      <div 
        className="w-12 h-12 md:w-16 md:h-16 border border-gray-800 bg-gray-900"
        style={{ gridColumn: x + 1, gridRow: y + 1 }}
      />
    );
  }

  const getTileStyle = () => {
    const baseEmboss = 'inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(255,255,255,0.1)';
    
    if (isStart) {
      return {
        backgroundColor: currentColor, // Start tile is always colored
        border: '2px solid #F59E0B',
        boxShadow: `${baseEmboss}, 0 0 20px rgba(59, 130, 246, 0.8)`, // Embossed + glowing
      };
    }
    
    if (visited) {
      const pulseScale = isPulsing ? 1.1 : 1;
      const pulseGlow = isPulsing ? '0 0 25px rgba(59, 130, 246, 0.8)' : '0 0 10px rgba(59, 130, 246, 0.4)';
      
      return {
        backgroundColor: currentColor,
        border: '2px solid #1F2937',
        boxShadow: `${baseEmboss}, ${pulseGlow}`,
        transform: `scale(${pulseScale})`,
        transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
      };
    }
    
    return {
      backgroundColor: '#6B7280',
      border: '2px solid #374151',
      boxShadow: baseEmboss, // Just embossed effect
    };
  };

  const handleMouseDown = () => onMouseDown(x, y);
  const handleMouseEnter = () => onMouseEnter(x, y);
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onTouchStart(x, y);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    // Check if touch is within tile bounds
    if (touchX >= 0 && touchX <= rect.width && touchY >= 0 && touchY <= rect.height) {
      onTouchMove(x, y);
    }
  };

  return (
    <div
      className="w-12 h-12 md:w-16 md:h-16 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 no-select"
      style={{
        ...getTileStyle(),
        gridColumn: x + 1,
        gridRow: y + 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={(e) => e.preventDefault()}
    >
      {isPulsing && isActive && visited && (
        <>
          <div className="absolute inset-0 border-2 rounded-xl animate-pulse-out opacity-0" 
               style={{ 
                 borderColor: currentColor,
                 boxShadow: `0 0 10px ${currentColor}40`
               }} />
          <div className="absolute inset-0 border-2 rounded-xl animate-pulse-out opacity-0" 
               style={{ 
                 borderColor: currentColor,
                 boxShadow: `0 0 10px ${currentColor}40`,
                 animationDelay: '1s'
               }} />
        </>
      )}
    </div>
  );
}
