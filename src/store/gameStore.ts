import { create } from 'zustand';
import { GameState, Tile } from '../types/game';
import { generateLevel, isAdjacent } from '../lib/pathUtils';

const COLORS = ['#00BFFF', '#FF69B4', '#FFD700', '#32CD32', '#FF8C00'];

interface GameStore extends GameState {
  // Actions
  initializeLevel: (levelNumber: number) => void;
  startDrag: (x: number, y: number) => void;
  continuePath: (x: number, y: number) => void;
  endDrag: () => void;
  resetPath: () => void;
  nextLevel: () => void;
  checkVictory: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  grid: [],
  path: [],
  isComplete: false,
  currentColor: COLORS[0],
  level: 1,
  isDragging: false,

  // Actions
  initializeLevel: (levelNumber: number) => {
    const levelData = generateLevel(levelNumber);
    const grid: Tile[][] = levelData.grid.map((row, y) =>
      row.map((isActive, x) => ({
        x,
        y,
        isActive,
        isStart: x === levelData.startPosition.x && y === levelData.startPosition.y,
        visited: x === levelData.startPosition.x && y === levelData.startPosition.y, // Start tile is automatically visited
      }))
    );

    // Completely reset all state for new level
    set({
      grid,
      path: [],
      isComplete: false,
      level: levelNumber,
      currentColor: COLORS[(levelNumber - 1) % COLORS.length],
      isDragging: false,
    });
  },

  startDrag: (x: number, y: number) => {
    const { grid } = get();
    const tile = grid[y]?.[x];
    
    if (tile?.isStart) {
      // Reset path and start new path from start tile
      get().resetPath();
      set({
        isDragging: true,
        path: [{ x, y }],
      });
    } else if (tile?.isActive && !tile.visited) {
      // Start new path from non-start tile
      set({
        isDragging: true,
        path: [{ x, y }],
      });
      
      // Mark tile as visited
      const newGrid = grid.map(row => [...row]);
      newGrid[y][x].visited = true;
      set({ grid: newGrid });
    }
  },

  continuePath: (x: number, y: number) => {
    const { grid, path, isDragging } = get();
    if (!isDragging) return;

    const tile = grid[y]?.[x];
    if (!tile?.isActive) return;
    
    // Allow continuing to unvisited tiles, or to the same tile (for start tile case)
    const lastPathPoint = path[path.length - 1];
    const isSameTile = lastPathPoint && lastPathPoint.x === x && lastPathPoint.y === y;
    
    if (isSameTile) return; // Don't add the same tile twice
    if (tile.visited && !tile.isStart) return; // Don't revisit non-start tiles
    if (!lastPathPoint || !isAdjacent(lastPathPoint, { x, y })) {
      console.log('Path blocked:', { lastPathPoint, current: { x, y }, isAdjacent: lastPathPoint ? isAdjacent(lastPathPoint, { x, y }) : 'no last point' });
      return;
    }

    // Add to path and mark as visited
    const newPath = [...path, { x, y }];
    const newGrid = grid.map(row => [...row]);
    if (!tile.visited) {
      newGrid[y][x].visited = true;
    }

    console.log('Path updated:', newPath);
    set({
      path: newPath,
      grid: newGrid,
    });

    // Check for victory
    if (get().checkVictory()) {
      set({ isComplete: true });
    }
  },

  endDrag: () => {
    set({ isDragging: false });
  },

  resetPath: () => {
    const { grid } = get();
    const newGrid = grid.map(row =>
      row.map(tile => ({ 
        ...tile, 
        visited: tile.isStart // Keep start tile visited, clear others
      }))
    );
    
    set({
      grid: newGrid,
      path: [],
      isComplete: false,
      isDragging: false,
    });
  },

  nextLevel: () => {
    const { level } = get();
    // Ensure complete state reset before initializing new level
    set({
      grid: [],
      path: [],
      isComplete: false,
      isDragging: false,
    });
    get().initializeLevel(level + 1);
  },

  checkVictory: () => {
    const { grid } = get();
    return grid.every(row => 
      row.every(tile => !tile.isActive || tile.visited)
    );
  },
}));
