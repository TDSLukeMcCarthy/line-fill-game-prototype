import React from 'react';
import { Tile as TileType } from '../types/game';
import Tile from './Tile';

interface GridProps {
  grid: TileType[][];
  currentColor: string;
  onMouseDown: (x: number, y: number) => void;
  onMouseEnter: (x: number, y: number) => void;
  onTouchStart: (x: number, y: number) => void;
  onTouchMove: (x: number, y: number) => void;
}

export default function Grid({ 
  grid, 
  currentColor, 
  onMouseDown, 
  onMouseEnter, 
  onTouchStart, 
  onTouchMove 
}: GridProps) {
  if (!grid.length) return null;

  const cols = grid[0].length;
  const rows = grid.length;

  return (
    <div 
      className="inline-grid gap-1 p-4 bg-gray-800 rounded-lg shadow-2xl"
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
  );
}
