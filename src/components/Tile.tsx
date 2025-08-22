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
      const pulseTimer = setTimeout(() => setIsPulsing(false), 600);
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
    const baseEmboss = 'inset 0 4px 6px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(255,255,255,0.1), 0 4px 8px rgba(0, 0, 0, 0.3)';
    
    if (isStart) {
      return {
        backgroundColor: currentColor, // Start tile is always colored
        border: '0px solid #F59E0B',
        boxShadow: `${baseEmboss}, 0 0 20px ${currentColor}40`, // Embossed + glowing with current color
      };
    }
    
    if (visited) {
      return {
        backgroundColor: currentColor,
        border: '0px solid #1F2937',
        boxShadow: baseEmboss,
        transition: 'box-shadow 0.15s ease-out',
      };
    }
    
    return {
      backgroundColor: '#6B7280',
      border: '0px solid #374151',
      boxShadow: baseEmboss, // Just embossed effect
    };
  };

  // Determine if this tile can be interacted with
  const canInteract = isStart || (isActive && !visited);
  const cursorClass = canInteract ? 'cursor-pointer' : 'cursor-default';
  const hoverClass = canInteract ? 'hover:scale-105' : '';

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

  const getLineColor = (currentColor: string) => {
    // Handle hex colors (with or without #)
    const hex = currentColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Create a darker but still vibrant version by reducing brightness while maintaining saturation
    const darkenFactor = 0.85; // Make it darker but not too dark
    const newR = Math.max(0, Math.min(255, Math.round(r * darkenFactor)));
    const newG = Math.max(0, Math.min(255, Math.round(g * darkenFactor)));
    const newB = Math.max(0, Math.min(255, Math.round(b * darkenFactor)));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  return (
    <div
      className={`w-12 h-12 md:w-20 md:h-20 border-2 rounded-xl transition-all duration-200 ${hoverClass} no-select ${cursorClass} ${isPulsing ? 'animate-tile-pulse' : ''} ${visited ? 'tile-visited' : ''} relative`}
      style={{
        ...getTileStyle(),
        gridColumn: x + 1,
        gridRow: y + 1,
        ...(visited && { '--tile-glow-color': `${currentColor}40` }),
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={(e) => e.preventDefault()}
    >
      {isStart && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: 20 }}
        >
          <div 
            className="w-3 h-3 md:w-10 md:h-10 bg-white border-4 rounded-full"
            style={{ borderColor: getLineColor(currentColor) }}
          ></div>
        </div>
      )}
    </div>
  );
}
