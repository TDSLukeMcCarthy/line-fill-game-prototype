import React from 'react';
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
  
  if (!isActive) {
    return (
      <div 
        className="w-12 h-12 md:w-16 md:h-16 border border-gray-800 bg-gray-900"
        style={{ gridColumn: x + 1, gridRow: y + 1 }}
      />
    );
  }

  const getTileStyle = () => {
    if (isStart) {
      return {
        backgroundColor: visited ? currentColor : '#4B5563',
        border: '2px solid #F59E0B',
        boxShadow: visited ? '0 0 20px rgba(59, 130, 246, 0.8)' : '0 0 15px rgba(245, 158, 11, 0.6)',
      };
    }
    
    if (visited) {
      return {
        backgroundColor: currentColor,
        border: '2px solid #1F2937',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
      };
    }
    
    return {
      backgroundColor: '#6B7280',
      border: '2px solid #374151',
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
      className="w-12 h-12 md:w-16 md:h-16 border-2 rounded-sm cursor-pointer transition-all duration-200 hover:scale-105"
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
      {isStart && !visited && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">GO!</span>
        </div>
      )}
    </div>
  );
}
