import React from 'react';
import { Coord } from '../types/game';

interface DebugPathProps {
  winningPath: Coord[];
  tileSize: number;
  gap: number;
}

export default function DebugPath({ winningPath, tileSize, gap }: DebugPathProps) {
  if (!winningPath || winningPath.length < 2) return null;

  const generatePathData = () => {
    if (winningPath.length < 2) return '';
    
    const pathData: string[] = [];
    
    // Account for grid padding (p-4 = 16px) and tile positioning
    const gridPadding = 16;
    
    // Start with the first point
    const firstPoint = winningPath[0];
    const x1 = gridPadding + firstPoint.x * (tileSize + gap) + tileSize / 2;
    const y1 = gridPadding + firstPoint.y * (tileSize + gap) + tileSize / 2;
    pathData.push(`M ${x1} ${y1}`);
    
    // Add lines to all subsequent points
    for (let i = 1; i < winningPath.length; i++) {
      const current = winningPath[i];
      const x = gridPadding + current.x * (tileSize + gap) + tileSize / 2;
      const y = gridPadding + current.y * (tileSize + gap) + tileSize / 2;
      pathData.push(`L ${x} ${y}`);
    }
    
    return pathData.join(' ');
  };

  const pathData = generatePathData();
  
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 15 }} // Above the regular path but below UI
      width="100%"
      height="100%"
    >
      {pathData && (
        <>
          {/* Debug path with dashed line and different color */}
          <path
            d={pathData}
            stroke="#FF0000"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.8"
            strokeDasharray="8,4"
          />
          
          {/* Debug path nodes */}
          {winningPath.map((point, index) => {
            const x = 16 + point.x * (tileSize + gap) + tileSize / 2;
            const y = 16 + point.y * (tileSize + gap) + tileSize / 2;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#FF0000"
                opacity="0.9"
              />
            );
          })}
        </>
      )}
    </svg>
  );
}
