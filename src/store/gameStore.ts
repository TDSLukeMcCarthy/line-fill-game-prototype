import { create } from 'zustand';
import { GameState } from '../types/game';
import { generateLevel, isAdjacent } from '../lib/levels/generator';

const COLORS = ['#00BFFF', '#FF69B4', '#FFD700', '#32CD32', '#FF8C00'];

interface GameStore extends GameState {
  // Debug state
  showDebug: boolean;
  
  // Actions
  initializeLevel: (levelNumber: number) => void;
  startDrag: (x: number, y: number) => void;
  continuePath: (x: number, y: number) => void;
  endDrag: () => void;
  resetPath: () => void;
  nextLevel: () => void;
  checkVictory: () => boolean;
  toggleDebug: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  grid: [],
  path: [],
  isComplete: false,
  currentColor: COLORS[0],
  level: 1,
  isDragging: false,
  showDebug: false,

  // Actions
  initializeLevel: (levelNumber: number) => {
    // Generate level with increasing path length based on level number
    const pathLength = Math.min(5 + levelNumber * 2, 20); // Start with 7 tiles, max 20
    const levelData = generateLevel(pathLength);
    
    // The new generateLevel returns a complete GameState, so we can use it directly
    // Just update the level number and ensure proper initialization
    set({
      ...levelData,
      level: levelNumber,
      path: [], // Reset path for new level
      showDebug: false, // Reset debug state for new level
    });
  },

  startDrag: (x: number, y: number) => {
    const { grid, path } = get();
    const tile = grid[y]?.[x];
    
    if (tile?.isStart) {
      // Only allow starting from start tile if there's no path, or if clicking the start tile to reset
      if (path.length === 0) {
        // Start new path from start tile
        set({
          isDragging: true,
          path: [{ x, y }],
        });
      } else {
        // Reset path when clicking start tile again
        get().resetPath();
      }
    } else if (tile?.isActive && !tile.visited && path.length > 0) {
      // Only allow continuing from end of existing path
      const lastPathPoint = path[path.length - 1];
      if (lastPathPoint && isAdjacent(lastPathPoint, { x, y })) {
        set({
          isDragging: true,
        });
        // Continue the path
        get().continuePath(x, y);
      }
    }
  },

  continuePath: (x: number, y: number) => {
    const { grid, path, isDragging } = get();
    if (!isDragging) return;

    const tile = grid[y]?.[x];
    if (!tile?.isActive) return;
    
    // Don't allow revisiting the start tile
    if (tile.isStart) return;
    
    // Don't allow revisiting already visited tiles
    if (tile.visited) return;
    
    const lastPathPoint = path[path.length - 1];
    if (!lastPathPoint || !isAdjacent(lastPathPoint, { x, y })) {
      console.log('Path blocked:', { lastPathPoint, current: { x, y }, isAdjacent: lastPathPoint ? isAdjacent(lastPathPoint, { x, y }) : 'no last point' });
      return;
    }

    // Add to path and mark as visited
    const newPath = [...path, { x, y }];
    const newGrid = grid.map(row => [...row]);
    newGrid[y][x].visited = true;

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

  toggleDebug: () => {
    set(state => ({ showDebug: !state.showDebug }));
  },
}));
