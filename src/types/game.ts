export interface Tile {
  x: number;
  y: number;
  isActive: boolean;
  isStart: boolean;
  visited: boolean;
  portalId?: number;  // shared ID between entrance and exit
  isPortalEntrance?: boolean;
  isPortalExit?: boolean;
}

export interface Portal {
  id: number;
  entrance: Coord;
  exit: Coord;
}

export interface GameState {
  grid: Tile[][];
  path: { x: number; y: number }[];
  isComplete: boolean;
  currentColor: string;
  level: number;
  isDragging: boolean;
  winningPath?: Coord[]; // Optional winning path for debug purposes
  portals?: Portal[]; // Array of portal pairs
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
  portals?: Portal[]; // Add portals to level definition
}
