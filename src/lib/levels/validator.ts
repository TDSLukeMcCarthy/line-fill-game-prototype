import { Level, Portal, Tile } from '../../types/game';
import { gameFeatures } from '../../config/gameConfig';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateLevel(level: Level, grid: Tile[][]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic level validation
  if (!level.grid || level.grid.length === 0) {
    errors.push('Level grid is empty or invalid');
  }
  
  if (!level.startPosition) {
    errors.push('Level is missing start position');
  }
  
  // Portal validation (only if portals are enabled)
  if (gameFeatures.portalsEnabled && level.portals && level.portals.length > 0) {
    const portalValidation = validatePortals(level.portals, grid);
    errors.push(...portalValidation.errors);
    warnings.push(...portalValidation.warnings);
  }
  
  // Grid validation
  if (grid && grid.length > 0) {
    const gridValidation = validateGrid(grid);
    errors.push(...gridValidation.errors);
    warnings.push(...gridValidation.warnings);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function validatePortals(portals: Portal[], grid: Tile[][]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for duplicate portal IDs
  const portalIds = portals.map(p => p.id);
  const duplicateIds = portalIds.filter((id, index) => portalIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate portal IDs found: ${duplicateIds.join(', ')}`);
  }
  
  // Validate each portal
  portals.forEach(portal => {
    // Check if entrance and exit are valid coordinates
    if (!isValidCoordinate(portal.entrance, grid)) {
      errors.push(`Portal ${portal.id} entrance is at invalid position: (${portal.entrance.x}, ${portal.entrance.y})`);
    }
    
    if (!isValidCoordinate(portal.exit, grid)) {
      errors.push(`Portal ${portal.id} exit is at invalid position: (${portal.exit.x}, ${portal.exit.y})`);
    }
    
    // Check if entrance and exit are active tiles
    if (grid && grid[portal.entrance.y]?.[portal.entrance.x]) {
      const entranceTile = grid[portal.entrance.y][portal.entrance.x];
      if (!entranceTile.isActive) {
        errors.push(`Portal ${portal.id} entrance is not on an active tile`);
      }
      if (entranceTile.isStart) {
        errors.push(`Portal ${portal.id} entrance cannot be on the start tile`);
      }
    }
    
    if (grid && grid[portal.exit.y]?.[portal.exit.x]) {
      const exitTile = grid[portal.exit.y][portal.exit.x];
      if (!exitTile.isActive) {
        errors.push(`Portal ${portal.id} exit is not on an active tile`);
      }
      if (exitTile.isStart) {
        errors.push(`Portal ${portal.id} exit cannot be on the start tile`);
      }
    }
    
    // Check if entrance and exit are not the same
    if (portal.entrance.x === portal.exit.x && portal.entrance.y === portal.exit.y) {
      errors.push(`Portal ${portal.id} entrance and exit cannot be the same position`);
    }
    
    // Check if entrance and exit are not adjacent
    if (isAdjacent(portal.entrance, portal.exit)) {
      errors.push(`Portal ${portal.id} entrance and exit cannot be adjacent`);
    }
  });
  
  // Check for overlapping portals
  const allPositions = portals.flatMap(p => [p.entrance, p.exit]);
  const duplicatePositions = allPositions.filter((pos, index) => 
    allPositions.findIndex(p => p.x === pos.x && p.y === pos.y) !== index
  );
  
  if (duplicatePositions.length > 0) {
    errors.push('Portal positions overlap');
  }
  
  // Check if portals create unreachable areas
  if (portals.length > 0 && grid && grid.length > 0) {
    const reachabilityCheck = checkPortalReachability(portals, grid);
    if (!reachabilityCheck.isReachable) {
      warnings.push('Portals may create unreachable areas in the level');
    }
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}

function validateGrid(grid: Tile[][]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  let startTileCount = 0;
  let activeTileCount = 0;
  
  grid.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile.isStart) startTileCount++;
      if (tile.isActive) activeTileCount++;
      
      // Check for tiles with both portal properties
      if (tile.isPortalEntrance && tile.isPortalExit) {
        errors.push(`Tile at (${x}, ${y}) cannot be both portal entrance and exit`);
      }
      
      // Check for portal tiles without portal ID
      if ((tile.isPortalEntrance || tile.isPortalExit) && tile.portalId === undefined) {
        errors.push(`Portal tile at (${x}, ${y}) is missing portal ID`);
      }
    });
  });
  
  if (startTileCount === 0) {
    errors.push('Level must have exactly one start tile');
  } else if (startTileCount > 1) {
    errors.push('Level cannot have multiple start tiles');
  }
  
  if (activeTileCount === 0) {
    errors.push('Level must have at least one active tile');
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}

function isValidCoordinate(coord: { x: number; y: number }, grid: Tile[][]): boolean {
  return coord.x >= 0 && coord.y >= 0 && 
         coord.y < grid.length && coord.x < grid[0]?.length;
}

function isAdjacent(a: { x: number; y: number }, b: { x: number; y: number }): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

function checkPortalReachability(portals: Portal[], grid: Tile[][]): { isReachable: boolean; unreachableTiles: number } {
  // Simple reachability check - count tiles that might be isolated
  let potentiallyUnreachable = 0;
  
  // This is a simplified check - in a real implementation, you might want to do a full pathfinding analysis
  portals.forEach(portal => {
    // Check if there are tiles that can only be reached through this portal
    // For now, we'll just count tiles that are far from the start
    const startDistance = Math.abs(portal.entrance.x) + Math.abs(portal.entrance.y);
    if (startDistance > 3) {
      potentiallyUnreachable++;
    }
  });
  
  return {
    isReachable: potentiallyUnreachable === 0,
    unreachableTiles: potentiallyUnreachable
  };
}
