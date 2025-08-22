import React from 'react';
import { Tile as TileType } from '../types/game';
import Tile from './Tile';
import PathLine from './PathLine';

interface GridProps {
  grid: TileType[][];
  path: { x: number; y: number }[];
  currentColor: string;
  onMouseDown: (x: number, y: number) => void;
  onMouseEnter: (x: number, y: number) => void;
  onTouchStart: (x: number, y: number) => void;
  onTouchMove: (x: number, y: number) => void;
}

export default function Grid({ 
  grid, 
  path,
  currentColor, 
  onMouseDown, 
  onMouseEnter, 
  onTouchStart, 
  onTouchMove 
}: GridProps) {
  if (!grid.length) return null;

  const cols = grid[0].length;
  const rows = grid.length;
  
  // Calculate tile size based on screen size (matching Tile component)
  const tileSize = typeof window !== 'undefined' && window.innerWidth >= 768 ? 80 : 48; // w-20 = 80px, w-12 = 48px

  return (
    <div className="relative">
      <div 
        className="inline-grid gap-1 p-4 bg-none rounded-lg  no-select"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {grid.map((row, y) =>
          row.map((tile, x) => (
            <Tile
              key={`${x}-${y}`}
              tile={tile}
              currentColor={currentColor}
              onMouseDown={onMouseDown}
              onMouseEnter={onMouseEnter}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
            />
          ))
        )}
      </div>
      
      <PathLine
        path={path}
        currentColor={currentColor}
        tileSize={tileSize}
        gap={4} // gap-1 = 4px
      />
    </div>
  );
}
