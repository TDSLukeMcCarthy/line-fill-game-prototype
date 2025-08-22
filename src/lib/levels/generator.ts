import { GameState, Tile, Coord, Portal } from '../../types/game';
import { gameFeatures, defaultUserPreferences } from '../../config/gameConfig';

const COLORS = ['#00BFFF', '#FF69B4', '#FFD700', '#32CD32', '#FF8C00'];

export function isAdjacent(a: Coord, b: Coord): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

export function generateLevel(pathLength: number, userPortalsEnabled: boolean = false): GameState {
  const gridSize = Math.max(6, Math.ceil(Math.sqrt(pathLength * 1.5)));
  
  // Start from center
  const startX = Math.floor(gridSize / 2);
  const startY = Math.floor(gridSize / 2);
  
  const path: Coord[] = [];
  const visited = new Set<string>();
  const portals: Portal[] = [];
  
  // Add start position
  path.push({ x: startX, y: startY });
  visited.add(`${startX},${startY}`);
  
  let currentPos = { x: startX, y: startY };
  let portalCreated = false;
  
  // Decide when to create a portal (if enabled)
  const shouldCreatePortal = gameFeatures.portalsEnabled && userPortalsEnabled && pathLength >= 10;
  const portalTriggerPoint = shouldCreatePortal ? Math.floor(pathLength * 0.3) + Math.floor(Math.random() * Math.floor(pathLength * 0.3)) : -1;
  
  // Random walk with portal creation
  while (path.length < pathLength) {
    // Check if we should create a portal at this point
    if (shouldCreatePortal && !portalCreated && path.length >= portalTriggerPoint) {
      const portalResult = createPortalDuringWalk(currentPos, path, visited, gridSize, portals.length + 1);
      
      if (portalResult) {
        // Add portal entrance to path
        path.push(portalResult.entrance);
        visited.add(`${portalResult.entrance.x},${portalResult.entrance.y}`);
        
        // Add portal exit to path
        path.push(portalResult.exit);
        visited.add(`${portalResult.exit.x},${portalResult.exit.y}`);
        
        // Add portal to list
        portals.push({
          id: portals.length + 1,
          entrance: portalResult.entrance,
          exit: portalResult.exit
        });
        
        // Continue from the exit
        currentPos = portalResult.exit;
        portalCreated = true;
        
        console.log('Portal created:', portalResult);
        continue;
      }
    }
    
    // Normal random walk step
    const nextPos = findNextPosition(currentPos, visited, gridSize);
    
    if (!nextPos) {
      // Can't extend further, stop
      break;
    }
    
    path.push(nextPos);
    visited.add(`${nextPos.x},${nextPos.y}`);
    currentPos = nextPos;
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
  
  // Apply portal properties to grid tiles
  portals.forEach(portal => {
    // Portal entrance
    grid[portal.entrance.y][portal.entrance.x].isPortalEntrance = true;
    grid[portal.entrance.y][portal.entrance.x].portalId = portal.id;
    
    // Portal exit
    grid[portal.exit.y][portal.exit.x].isPortalExit = true;
    grid[portal.exit.y][portal.exit.x].portalId = portal.id;
  });
  
  // Choose random color
  const currentColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  return {
    grid,
    path: [],
    isComplete: false,
    currentColor,
    level: 1,
    isDragging: false,
    winningPath: path,
    portals
  };
}

function findNextPosition(current: Coord, visited: Set<string>, gridSize: number): Coord | null {
  const directions = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 },  // down
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 }   // right
  ];
  
  // Shuffle directions for randomness
  const shuffledDirections = directions.sort(() => Math.random() - 0.5);
  
  // Try each direction
  for (const dir of shuffledDirections) {
    const nextPos = { x: current.x + dir.dx, y: current.y + dir.dy };
    
    if (nextPos.x >= 0 && nextPos.x < gridSize && 
        nextPos.y >= 0 && nextPos.y < gridSize && 
        !visited.has(`${nextPos.x},${nextPos.y}`)) {
      return nextPos;
    }
  }
  
  return null; // No valid position found
}

function createPortalDuringWalk(
  currentPos: Coord, 
  currentPath: Coord[], 
  visited: Set<string>, 
  gridSize: number, 
  portalId: number
): { entrance: Coord; exit: Coord } | null {
  
  // The entrance is adjacent to the current position
  const entrance = findNextPosition(currentPos, visited, gridSize);
  if (!entrance) return null;
  
  // Find a random unvisited position for the exit
  const availableExits: Coord[] = [];
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const pos = { x, y };
      const posKey = `${x},${y}`;
      
      // Skip if already visited or is the entrance we just created
      if (visited.has(posKey) || (x === entrance.x && y === entrance.y)) {
        continue;
      }
      
      // Skip if this is the start position
      if (x === currentPath[0].x && y === currentPath[0].y) {
        continue;
      }
      
      // Skip if too close to entrance (at least 2 tiles away)
      const distance = Math.abs(x - entrance.x) + Math.abs(y - entrance.y);
      if (distance < 3) {
        continue;
      }
      
      availableExits.push(pos);
    }
  }
  
  if (availableExits.length === 0) {
    return null; // No suitable exit position
  }
  
  // Pick a random exit
  const exitIndex = Math.floor(Math.random() * availableExits.length);
  const exit = availableExits[exitIndex];
  
  return { entrance, exit };
}

function generatePortalsDuringWalk(path: Coord[], gridSize: number): Portal[] {
  const portals: Portal[] = [];
  const portalCount = Math.min(2, Math.floor(path.length / 8)); // 1-2 portals based on path length
  
  for (let i = 0; i < portalCount; i++) {
    // Find a good position for portal entrance (not start, not too early in path)
    const minEntranceIndex = Math.max(2, Math.floor(path.length * 0.2)); // At least 20% into the path
    const maxEntranceIndex = Math.floor(path.length * 0.7); // No more than 70% into the path
    
    if (maxEntranceIndex <= minEntranceIndex) break;
    
    // Choose entrance position along the path
    const entranceIndex = minEntranceIndex + Math.floor(Math.random() * (maxEntranceIndex - minEntranceIndex));
    const entrance = path[entranceIndex];
    
    // Find a good exit position that is NOT already on the path
    // We need to find an unvisited tile that's still reachable
    const visitedTiles = new Set<string>();
    
    // Mark all tiles up to the entrance as visited
    for (let j = 0; j <= entranceIndex; j++) {
      visitedTiles.add(`${path[j].x},${path[j].y}`);
    }
    
    // Find available positions for the exit (not visited, not start, not entrance)
    const availableExitPositions: Coord[] = [];
    
    // Check all possible positions in the grid
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const pos = { x, y };
        const posKey = `${x},${y}`;
        
        // Skip if already visited, is start, or is entrance
        if (visitedTiles.has(posKey) || 
            (x === path[0].x && y === path[0].y) || // Start tile
            (x === entrance.x && y === entrance.y)) { // Entrance tile
          continue;
        }
        
        // Check if this position is reachable from the current path
        // A position is reachable if it's adjacent to any tile in the path
        let isReachable = false;
        for (let j = 0; j < path.length; j++) {
          if (isAdjacent(path[j], pos)) {
            isReachable = true;
            break;
          }
        }
        
        if (isReachable) {
          availableExitPositions.push(pos);
        }
      }
    }
    
    // If no suitable exit position found, skip this portal
    if (availableExitPositions.length === 0) {
      continue;
    }
    
    // Choose a random exit position from available ones
    const exitIndex = Math.floor(Math.random() * availableExitPositions.length);
    const exit = availableExitPositions[exitIndex];
    
    // Ensure entrance and exit are not adjacent
    if (isAdjacent(entrance, exit)) {
      continue; // Skip this portal if they're adjacent
    }
    
    // Add the exit to the path after the entrance
    // This ensures the path continues logically
    const newPath = [...path];
    newPath.splice(entranceIndex + 1, 0, exit);
    
    // Update the path array to include the exit
    path.splice(entranceIndex + 1, 0, exit);
    
    portals.push({
      id: i + 1,
      entrance,
      exit
    });
  }
  
  return portals;
}

function generatePortals(path: Coord[], gridSize: number): Portal[] {
  const portals: Portal[] = [];
  const portalCount = Math.min(2, Math.floor(path.length / 8)); // 1-2 portals based on path length
  
  for (let i = 0; i < portalCount; i++) {
    // Find suitable portal positions (not start tile, not adjacent)
    const availablePositions = path.filter(p => 
      !(p.x === path[0].x && p.y === path[0].y) && // Not start position
      !portals.some(portal => 
        portal.entrance.x === p.x && portal.entrance.y === p.y ||
        portal.exit.x === p.x && portal.exit.y === p.y
      )
    );
    
    if (availablePositions.length < 2) break;
    
    // Randomly select entrance and exit positions
    const entranceIndex = Math.floor(Math.random() * availablePositions.length);
    const entrance = availablePositions[entranceIndex];
    availablePositions.splice(entranceIndex, 1);
    
    const exitIndex = Math.floor(Math.random() * availablePositions.length);
    const exit = availablePositions[exitIndex];
    availablePositions.splice(exitIndex, 1);
    
    portals.push({
      id: i + 1,
      entrance,
      exit
    });
  }
  
  return portals;
}
