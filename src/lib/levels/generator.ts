import { GameState, Tile, Coord } from '../../types/game';

const COLORS = ['#00BFFF', '#FF69B4', '#FFD700', '#32CD32', '#FF8C00'];

export function isAdjacent(a: Coord, b: Coord): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

export function generateLevel(pathLength: number): GameState {
  // Simple approach: just walk randomly to create a path
  const path: Coord[] = [];
  const gridSize = Math.max(6, Math.ceil(Math.sqrt(pathLength * 1.2)));
  
  // Start from center
  const startX = Math.floor(gridSize / 2);
  const startY = Math.floor(gridSize / 2);
  
  path.push({ x: startX, y: startY });
  const visited = new Set<string>();
  visited.add(`${startX},${startY}`);
  
  // Simple random walk algorithm - ONLY extend from current endpoint
  while (path.length < pathLength) {
    const current = path[path.length - 1]; // Always work from the END of the path
    
    // Try to find any adjacent unvisited tile from current position
    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }   // right
    ];
    
    // Shuffle directions for randomness
    const shuffledDirections = directions.sort(() => Math.random() - 0.5);
    
    let found = false;
    
    // Try each direction from current position
    for (const dir of shuffledDirections) {
      const nextPos = { x: current.x + dir.dx, y: current.y + dir.dy };
      
      if (nextPos.x >= 0 && nextPos.x < gridSize && 
          nextPos.y >= 0 && nextPos.y < gridSize && 
          !visited.has(`${nextPos.x},${nextPos.y}`)) {
        
        path.push(nextPos);
        visited.add(`${nextPos.x},${nextPos.y}`);
        found = true;
        break;
      }
    }
    
    // If we can't extend from current position, we're done
    // NO branching, NO connecting from other points - just stop
    if (!found) {
      break;
    }
  }
  
  // Build the grid
  const grid: Tile[][] = Array(gridSize).fill(null).map(() => 
    Array(gridSize).fill(null).map(() => ({
      x: 0,
      y: 0,
      isActive: false,
      isStart: false,
      visited: false
    }))
  );
  
  // Mark path tiles as active
  path.forEach((p) => {
    grid[p.y][p.x] = {
      x: p.x,
      y: p.y,
      isActive: true,
      isStart: false,
      visited: false
    };
  });
  
  // Mark start tile
  const startTile = path[0];
  grid[startTile.y][startTile.x].isStart = true;
  grid[startTile.y][startTile.x].visited = true;
  
  // Choose random color
  const currentColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  return {
    grid,
    path: [],
    isComplete: false,
    currentColor,
    level: 1,
    isDragging: false,
    winningPath: path
  };
}
