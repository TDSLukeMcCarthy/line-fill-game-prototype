import { GameState, Tile, Coord } from '../../types/game';

const COLORS = ['#00BFFF', '#FF69B4', '#FFD700', '#32CD32', '#FF8C00'];

export function isAdjacent(a: Coord, b: Coord): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

export function generateLevel(pathLength: number, maxGridSize: number = 10): GameState {
  // Start from an empty maxGridSize x maxGridSize virtual grid
  const virtualGrid: boolean[][] = Array(maxGridSize).fill(null).map(() => Array(maxGridSize).fill(false));
  
  // Generate a solvable path using a proper algorithm
  const path: Coord[] = [];
  
  // Start from a random position
  const startX = Math.floor(Math.random() * maxGridSize);
  const startY = Math.floor(Math.random() * maxGridSize);
  
  // Add starting position
  path.push({ x: startX, y: startY });
  virtualGrid[startY][startX] = true;
  
  // Use a depth-first search approach to ensure the path is always solvable
  const stack: Coord[] = [{ x: startX, y: startY }];
  const visited = new Set<string>();
  visited.add(`${startX},${startY}`);
  
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 },  // down
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }   // right
  ];
  
  while (path.length < pathLength && stack.length > 0) {
    const current = stack[stack.length - 1];
    
    // Find available unvisited adjacent cells
    const availableDirections = directions
      .map(dir => ({ x: current.x + dir.dx, y: current.y + dir.dy }))
      .filter(pos => 
        pos.x >= 0 && pos.x < maxGridSize && 
        pos.y >= 0 && pos.y < maxGridSize && 
        !visited.has(`${pos.x},${pos.y}`)
      );
    
    if (availableDirections.length > 0) {
      // Choose a random available direction
      const nextPos = availableDirections[Math.floor(Math.random() * availableDirections.length)];
      
      // Add to path and mark as visited
      path.push(nextPos);
      virtualGrid[nextPos.y][nextPos.x] = true;
      visited.add(`${nextPos.x},${nextPos.y}`);
      stack.push(nextPos);
    } else {
      // Backtrack if no available directions
      stack.pop();
    }
  }
  
  // If we couldn't reach the desired path length, try to extend from existing points
  if (path.length < pathLength) {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (path.length < pathLength && attempts < maxAttempts) {
      attempts++;
      
      // Find a random point in the path that has available adjacent cells
      const pathPoints = [...path];
      const shuffledPoints = pathPoints.sort(() => Math.random() - 0.5);
      
      for (const point of shuffledPoints) {
        const availableDirections = directions
          .map(dir => ({ x: point.x + dir.dx, y: point.y + dir.dy }))
          .filter(pos => 
            pos.x >= 0 && pos.x < maxGridSize && 
            pos.y >= 0 && pos.y < maxGridSize && 
            !visited.has(`${pos.x},${pos.y}`)
          );
        
        if (availableDirections.length > 0) {
          const nextPos = availableDirections[Math.floor(Math.random() * availableDirections.length)];
          path.push(nextPos);
          virtualGrid[nextPos.y][nextPos.x] = true;
          visited.add(`${nextPos.x},${nextPos.y}`);
          break;
        }
      }
      
      if (attempts > maxAttempts / 2) {
        // If we're having trouble, reduce the target path length
        pathLength = Math.min(pathLength, path.length + 2);
      }
    }
  }
  
  // Calculate bounding box of the path
  const minX = Math.min(...path.map(p => p.x));
  const maxX = Math.max(...path.map(p => p.x));
  const minY = Math.min(...path.map(p => p.y));
  const maxY = Math.max(...path.map(p => p.y));
  
  // Normalize coordinates so shape starts from (0, 0)
  const normalizedPath = path.map(p => ({
    x: p.x - minX,
    y: p.y - minY
  }));
  
  // Build the actual grid with only the path tiles
  const gridWidth = maxX - minX + 1;
  const gridHeight = maxY - minY + 1;
  
  const grid: Tile[][] = Array(gridHeight).fill(null).map(() => 
    Array(gridWidth).fill(null).map(() => ({
      x: 0,
      y: 0,
      isActive: false,
      isStart: false,
      visited: false
    }))
  );
  
  // Mark path tiles as active
  normalizedPath.forEach((p) => {
    grid[p.y][p.x] = {
      x: p.x,
      y: p.y,
      isActive: true,
      isStart: false,
      visited: false
    };
  });
  
  // Mark the first tile as start (guaranteed to be solvable from here)
  const startTile = normalizedPath[0];
  grid[startTile.y][startTile.x].isStart = true;
  grid[startTile.y][startTile.x].visited = true;
  
  // Choose a random color
  const currentColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  return {
    grid,
    path: [],
    isComplete: false,
    currentColor,
    level: 1,
    isDragging: false
  };
}
