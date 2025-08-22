import React from 'react';
import { Coord } from '../types/game';

interface PathLineProps {
  path: Coord[];
  currentColor: string;
  tileSize: number;
  gap: number;
  portals?: Array<{ entrance: Coord; exit: Coord }>;
}

export default function PathLine({ path, currentColor, tileSize, gap, portals = [] }: PathLineProps) {
  if (path.length < 2) return null;

  // Function to create a vibrant dark version of the color for the line
  const getLineColor = (hexColor: string) => {
    // Handle hex colors (with or without #)
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Create a darker but still vibrant version by reducing brightness while maintaining saturation
    const darkenFactor = 0.85; // Make it darker but not too dark
    const newR = Math.max(0, Math.min(255, Math.round(r * darkenFactor)));
    const newG = Math.max(0, Math.min(255, Math.round(g * darkenFactor)));
    const newB = Math.max(0, Math.min(255, Math.round(b * darkenFactor)));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  const generatePathData = () => {
    if (path.length < 2) return '';
    
    const pathData: string[] = [];
    
    // Account for grid padding (p-4 = 16px) and tile positioning
    const gridPadding = 16;
    
    // Start with the first point
    const firstPoint = path[0];
    const x1 = gridPadding + firstPoint.x * (tileSize + gap) + tileSize / 2;
    const y1 = gridPadding + firstPoint.y * (tileSize + gap) + tileSize / 2;
    pathData.push(`M ${x1} ${y1}`);
    
    // Add lines to all subsequent points, but skip lines between portal entrances and exits
    for (let i = 1; i < path.length; i++) {
      const previous = path[i - 1];
      const current = path[i];
      
      // Check if this is a portal teleport (entrance followed by exit)
      const isPortalTeleport = portals.some(portal => 
        (portal.entrance.x === previous.x && portal.entrance.y === previous.y) &&
        (portal.exit.x === current.x && portal.exit.y === current.y)
      );
      
      // If this is a portal teleport, move to the exit without drawing a line
      if (isPortalTeleport) {
        const x = gridPadding + current.x * (tileSize + gap) + tileSize / 2;
        const y = gridPadding + current.y * (tileSize + gap) + tileSize / 2;
        pathData.push(`M ${x} ${y}`); // Move to exit (no line)
      } else {
        // Normal path continuation - draw a line
        const x = gridPadding + current.x * (tileSize + gap) + tileSize / 2;
        const y = gridPadding + current.y * (tileSize + gap) + tileSize / 2;
        pathData.push(`L ${x} ${y}`);
      }
    }
    
    const result = pathData.join(' ');
    console.log('Path data:', result, 'for path:', path);
    return result;
  };

  const pathData = generatePathData();
  const lineColor = getLineColor(currentColor);
  
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
      width="100%"
      height="100%"
    >
      {pathData && (
        <>
          {/* Outer glow */}
          <path
            d={pathData}
            stroke={lineColor}
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0"
          />
          
          {/* Middle glow */}
          <path
            d={pathData}
            stroke={lineColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="1"
          />
          
          {/* Main line */}
          <path
            d={pathData}
            stroke={lineColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="1"
          />
        </>
      )}
    </svg>
  );
}
