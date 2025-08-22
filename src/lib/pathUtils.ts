import { Coord, Level, Tile, Portal } from '../types/game';
import { gameFeatures } from '../config/gameConfig';

export function isAdjacent(a: Coord, b: Coord): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

export function canTeleport(from: Coord, to: Coord, grid: Tile[][], portals: Portal[]): boolean {
  if (!gameFeatures.portalsEnabled || !portals) return false;
  
  const fromTile = grid[from.y]?.[from.x];
  const toTile = grid[to.y]?.[to.x];
  
  if (!fromTile?.isPortalEntrance || !toTile?.isPortalExit) return false;
  
  // Check if they have the same portal ID
  return fromTile.portalId === toTile.portalId;
}

export function getPortalDestination(from: Coord, grid: Tile[][], portals: Portal[]): Coord | null {
  if (!gameFeatures.portalsEnabled || !portals) return null;
  
  const fromTile = grid[from.y]?.[from.x];
  if (!fromTile?.isPortalEntrance) return null;
  
  const portal = portals.find(p => p.id === fromTile.portalId);
  return portal ? portal.exit : null;
}

export function validatePortalPlacement(entrance: Coord, exit: Coord, grid: Tile[][], portals: Portal[]): boolean {
  if (!gameFeatures.portalsEnabled) return true;
  
  // Check if positions are valid
  if (!grid[entrance.y]?.[entrance.x]?.isActive || !grid[exit.y]?.[exit.x]?.isActive) {
    return false;
  }
  
  // Check if positions are not start tiles
  if (grid[entrance.y][entrance.x].isStart || grid[exit.y][exit.x].isStart) {
    return false;
  }
  
  // Check if positions are not already portals
  if (grid[entrance.y][entrance.x].isPortalEntrance || grid[entrance.y][entrance.x].isPortalExit ||
      grid[exit.y][exit.x].isPortalEntrance || grid[exit.y][exit.x].isPortalExit) {
    return false;
  }
  
  // Check if positions are not adjacent
  if (isAdjacent(entrance, exit)) {
    return false;
  }
  
  return true;
}

export function generateLevel(levelNumber: number): Level {
  // Simple level generation - creates increasingly complex patterns
  const baseSize = Math.min(5 + Math.floor(levelNumber / 3), 10);
  const grid: boolean[][] = [];
  
  // Initialize empty grid
  for (let y = 0; y < baseSize; y++) {
    grid[y] = [];
    for (let x = 0; x < baseSize; x++) {
      grid[y][x] = false;
    }
  }
  
  // Generate a valid path pattern
  const startX = Math.floor(baseSize / 2);
  const startY = Math.floor(baseSize / 2);
  
  // Create a spiral-like pattern for variety
  let currentX = startX;
  let currentY = startY;
  let direction = 0; // 0: right, 1: down, 2: left, 3: up
  let steps = 1;
  let stepCount = 0;
  
  for (let i = 0; i < baseSize * baseSize; i++) {
    if (currentX >= 0 && currentX < baseSize && currentY >= 0 && currentY < baseSize) {
      grid[currentY][currentX] = true;
    }
    
    // Move in current direction
    switch (direction) {
      case 0: currentX++; break; // right
      case 1: currentY++; break; // down
      case 2: currentX--; break; // left
      case 3: currentY--; break; // up
    }
    
    stepCount++;
    if (stepCount >= steps) {
      direction = (direction + 1) % 4;
      stepCount = 0;
      if (direction % 2 === 0) steps++;
    }
  }
  
  // Ensure start position is active
  grid[startY][startX] = true;
  
  return {
    id: levelNumber,
    grid,
    startPosition: { x: startX, y: startY },
    description: `Level ${levelNumber} - Fill all tiles with a continuous path`
  };
}

export function createCustomLevel(grid: boolean[][], startPos: Coord): Level {
  return {
    id: 0,
    grid,
    startPosition: startPos,
    description: "Custom level"
  };
}
