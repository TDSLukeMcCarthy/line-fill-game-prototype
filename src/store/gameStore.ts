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
        visited: false,
      }))
    );

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
      // Reset path if starting from start tile
      get().resetPath();
    } else if (tile?.isActive && !tile.visited) {
      // Start new path
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
    if (!tile?.isActive || tile.visited) return;

    const lastPathPoint = path[path.length - 1];
    if (!lastPathPoint || !isAdjacent(lastPathPoint, { x, y })) return;

    // Add to path and mark as visited
    const newPath = [...path, { x, y }];
    const newGrid = grid.map(row => [...row]);
    newGrid[y][x].visited = true;

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
      row.map(tile => ({ ...tile, visited: false }))
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
    get().initializeLevel(level + 1);
  },

  checkVictory: () => {
    const { grid } = get();
    return grid.every(row => 
      row.every(tile => !tile.isActive || tile.visited)
    );
  },
}));
