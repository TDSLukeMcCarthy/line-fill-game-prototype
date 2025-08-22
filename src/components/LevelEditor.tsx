import React, { useState } from 'react';
import { Coord, Tile, Portal } from '../types/game';
import { validatePortalPlacement } from '../lib/pathUtils';
import { gameFeatures } from '../config/gameConfig';

interface LevelEditorProps {
  grid: Tile[][];
  onGridChange: (newGrid: Tile[][]) => void;
  onPortalsChange: (portals: Portal[]) => void;
  portals: Portal[];
  portalsEnabled: boolean;
}

export default function LevelEditor({ 
  grid, 
  onGridChange, 
  onPortalsChange, 
  portals,
  portalsEnabled
}: LevelEditorProps) {
  const [editingMode, setEditingMode] = useState<'none' | 'entrance' | 'exit'>('none');
  const [currentPortalId, setCurrentPortalId] = useState(1);
  const [selectedEntrance, setSelectedEntrance] = useState<Coord | null>(null);

  if (!gameFeatures.portalsEnabled || !portalsEnabled) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Portals are disabled. Enable them using the toggle button to use the level editor.</p>
      </div>
    );
  }

  const handleTileClick = (x: number, y: number) => {
    if (editingMode === 'none') return;

    const tile = grid[y]?.[x];
    if (!tile?.isActive || tile.isStart) return;

    if (editingMode === 'entrance') {
      // Check if this tile is already a portal
      if (tile.isPortalEntrance || tile.isPortalExit) {
        alert('This tile is already a portal!');
        return;
      }

      setSelectedEntrance({ x, y });
      setEditingMode('exit');
    } else if (editingMode === 'exit' && selectedEntrance) {
      // Validate portal placement
      if (!validatePortalPlacement(selectedEntrance, { x, y }, grid, portals)) {
        alert('Invalid portal placement! Portals cannot be adjacent or overlap.');
        return;
      }

      // Create new portal
      const newPortal: Portal = {
        id: currentPortalId,
        entrance: selectedEntrance,
        exit: { x, y }
      };

      // Update grid with portal properties
      const newGrid = grid.map(row => [...row]);
      newGrid[selectedEntrance.y][selectedEntrance.x].isPortalEntrance = true;
      newGrid[selectedEntrance.y][selectedEntrance.x].portalId = currentPortalId;
      newGrid[y][x].isPortalExit = true;
      newGrid[y][x].portalId = currentPortalId;

      // Update state
      onGridChange(newGrid);
      onPortalsChange([...portals, newPortal]);
      setCurrentPortalId(prev => prev + 1);
      setSelectedEntrance(null);
      setEditingMode('none');
    }
  };

  const removePortal = (portalId: number) => {
    const portal = portals.find(p => p.id === portalId);
    if (!portal) return;

    // Remove portal properties from grid
    const newGrid = grid.map(row => [...row]);
    newGrid[portal.entrance.y][portal.entrance.x].isPortalEntrance = false;
    newGrid[portal.entrance.y][portal.entrance.x].portalId = undefined;
    newGrid[portal.exit.y][portal.exit.x].isPortalExit = false;
    newGrid[portal.exit.y][portal.exit.x].portalId = undefined;

    // Update state
    onGridChange(newGrid);
    onPortalsChange(portals.filter(p => p.id !== portalId));
  };

  const resetPortals = () => {
    // Remove all portal properties from grid
    const newGrid = grid.map(row => 
      row.map(tile => ({
        ...tile,
        isPortalEntrance: false,
        isPortalExit: false,
        portalId: undefined
      }))
    );

    onGridChange(newGrid);
    onPortalsChange([]);
    setCurrentPortalId(1);
    setSelectedEntrance(null);
    setEditingMode('none');
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-white">Portal Editor</h3>
      
      {/* Portal placement controls */}
      <div className="space-y-2">
        <p className="text-sm text-gray-300">Click tiles to place portals:</p>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setEditingMode('entrance')}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              editingMode === 'entrance' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Place Entrance
          </button>
          
          <button
            onClick={() => setEditingMode('none')}
            className="px-3 py-2 rounded text-sm font-medium bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>

        {editingMode === 'entrance' && (
          <p className="text-sm text-blue-400">Click a tile to place portal entrance...</p>
        )}
        
        {editingMode === 'exit' && selectedEntrance && (
          <p className="text-sm text-green-400">
            Click a tile to place portal exit (Portal ID: {currentPortalId})...
          </p>
        )}
      </div>

      {/* Current portals */}
      {portals.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-md font-medium text-white">Current Portals:</h4>
          <div className="space-y-2">
            {portals.map(portal => (
              <div key={portal.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span className="text-sm text-gray-300">
                  Portal {portal.id}: ({portal.entrance.x},{portal.entrance.y}) → ({portal.exit.x},{portal.exit.y})
                </span>
                <button
                  onClick={() => removePortal(portal.id)}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={resetPortals}
            className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reset All Portals
          </button>
        </div>
      )}

      {/* Grid for portal placement */}
      <div className="border border-gray-600 rounded p-2">
        <div className="text-sm text-gray-400 mb-2 text-center">Click tiles to place portals</div>
        <div 
          className="inline-grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 1fr)`,
            gridTemplateRows: `repeat(${grid.length || 0}, 1fr)`,
          }}
        >
          {grid.map((row, y) =>
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-8 h-8 md:w-12 md:h-12 border rounded cursor-pointer transition-all ${
                  tile.isActive
                    ? tile.isStart
                      ? 'bg-yellow-500 border-yellow-400'
                      : tile.isPortalEntrance
                      ? 'bg-blue-500 border-blue-400'
                      : tile.isPortalExit
                      ? 'bg-green-500 border-green-400'
                      : 'bg-gray-600 border-gray-500 hover:bg-gray-500'
                    : 'bg-gray-800 border-gray-700'
                } ${
                  editingMode !== 'none' && tile.isActive && !tile.isStart && !tile.isPortalEntrance && !tile.isPortalExit
                    ? 'ring-2 ring-white ring-opacity-50'
                    : ''
                }`}
                onClick={() => handleTileClick(x, y)}
                title={`${x}, ${y}${tile.isStart ? ' (Start)' : ''}${tile.isPortalEntrance ? ' (Portal Entrance)' : ''}${tile.isPortalExit ? ' (Portal Exit)' : ''}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
