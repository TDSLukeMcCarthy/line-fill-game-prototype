export interface Tile {
  x: number;
  y: number;
  isActive: boolean;
  isStart: boolean;
  visited: boolean;
}

export interface GameState {
  grid: Tile[][];
  path: { x: number; y: number }[];
  isComplete: boolean;
  currentColor: string;
  level: number;
  isDragging: boolean;
  winningPath?: Coord[]; // Optional winning path for debug purposes
}

export interface Coord {
  x: number;
  y: number;
}

export interface Level {
  id: number;
  grid: boolean[][];
  startPosition: Coord;
  description?: string;
}
