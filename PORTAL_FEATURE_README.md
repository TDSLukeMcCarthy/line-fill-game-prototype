# 🌀 Portal Tile Mechanic - Feature Documentation

## Overview
The Path Fill Puzzle game now includes a **portal tile mechanic** that allows players to teleport between different locations on the game board, adding strategic depth and puzzle complexity.

## ✨ Features

### Portal Tiles
- **Portal Entrances** (🌀): Blue-bordered tiles that players can enter
- **Portal Exits** (✨): Green-bordered tiles where players emerge after teleporting
- **Portal IDs**: Each portal pair shares a unique ID for proper matching
- **Visual Effects**: Glowing borders and rotating portal icons

### Gameplay Mechanics
- **Instant Teleportation**: When dragging onto a portal entrance, instantly teleport to the matching exit
- **Path Continuity**: The path continues from the exit tile, not the entrance
- **Skip Intermediate**: Teleportation skips all tiles between entrance and exit
- **One-time Use**: Each portal can only be used once per attempt

### Level Editor
- **Portal Placement**: Designers can place portal entrances and exits
- **Validation**: Automatic validation of portal placement rules
- **Visual Feedback**: Real-time preview of portal positions
- **Portal Management**: Add, remove, and reset portals

## 🎮 How to Use

### For Players
1. **Start normally** from the colored start tile
2. **Drag through tiles** to create your path
3. **Enter portal entrances** (blue tiles with 🌀) to teleport
4. **Continue from exits** (green tiles with ✨) 
5. **Complete the level** by filling all tiles

### For Level Designers
1. **Click "Level Editor"** button in the top-right
2. **Click "Place Entrance"** to start portal creation
3. **Click a tile** to place the portal entrance
4. **Click another tile** to place the portal exit
5. **Manage portals** using the editor interface

## ⚙️ Configuration

### Global Settings
```typescript
// src/config/gameConfig.ts
export const gameFeatures = {
  portalsEnabled: true  // Master toggle for portal features
};

export const defaultPortalConfig = {
  enabled: true,        // Per-level portal toggle
  maxPortals: 3,        // Maximum portals per level
  allowSelfPortals: false // Prevent portals to same position
};
```

### Level-specific Settings
```typescript
// Each level can have its own portal configuration
interface Level {
  id: number;
  grid: boolean[][];
  startPosition: Coord;
  portals?: Portal[];  // Array of portal pairs
}
```

## 🔧 Technical Implementation

### Core Components
- **`types/game.ts`**: Portal interfaces and type definitions
- **`lib/pathUtils.ts`**: Portal teleportation logic and validation
- **`store/gameStore.ts`**: Portal state management and game logic
- **`components/Tile.tsx`**: Portal tile rendering and animations
- **`components/LevelEditor.tsx`**: Portal placement interface
- **`lib/levels/validator.ts`**: Portal validation rules

### Portal Logic Flow
1. **Detection**: Check if current tile is a portal entrance
2. **Validation**: Ensure portal is valid and not already used
3. **Teleportation**: Find matching exit and update position
4. **Path Update**: Add both entrance and exit to path array
5. **State Update**: Mark both tiles as visited

### Validation Rules
- ✅ Portal entrances and exits must be on active tiles
- ✅ Cannot place portals on start tiles
- ✅ Portal pairs must have matching IDs
- ✅ Entrances and exits cannot be adjacent
- ✅ No overlapping portal positions
- ✅ Maximum portal count per level

## 🎨 Visual Design

### Portal Styling
- **Entrance**: Blue border (`#3B82F6`) with 🌀 icon
- **Exit**: Green border (`#10B981`) with ✨ icon
- **Animations**: Glowing borders and rotating icons
- **Hover Effects**: Enhanced visual feedback

### CSS Classes
```css
.portal-entrance { animation: portalEntranceGlow 2s ease-in-out infinite; }
.portal-exit { animation: portalExitGlow 2s ease-in-out infinite; }
.portal-icon { animation: portalIconRotate 3s linear infinite; }
```

## 🧪 Testing

### Manual Testing
1. **Start dev server**: `npm run dev`
2. **Navigate to game**: Click "Play Game →"
3. **Test portal placement**: Use Level Editor
4. **Test gameplay**: Complete levels with portals
5. **Test validation**: Try invalid portal placements

### Build Testing
```bash
npm run build    # Check for compilation errors
npm run dev      # Test development server
```

## 🚀 Future Enhancements

### Potential Features
- **Multiple Portal Types**: Different teleportation behaviors
- **Portal Chains**: Sequential portal sequences
- **Portal Costs**: Energy or movement point costs
- **Portal Timers**: Time-delayed teleportation
- **Portal Effects**: Special visual or audio effects

### Technical Improvements
- **Portal History**: Track portal usage patterns
- **Portal Analytics**: Performance metrics for level design
- **Portal Templates**: Pre-built portal configurations
- **Portal Import/Export**: Share portal layouts between levels

## 📝 Usage Examples

### Simple Portal Level
```typescript
const levelWithPortal = {
  id: 1,
  grid: [[true, true, true], [true, true, true], [true, true, true]],
  startPosition: { x: 0, y: 0 },
  portals: [{
    id: 1,
    entrance: { x: 1, y: 0 },
    exit: { x: 1, y: 2 }
  }]
};
```

### Portal in Game Logic
```typescript
// Check if tile is a portal entrance
if (tile.isPortalEntrance && portals) {
  const destination = getPortalDestination({ x, y }, grid, portals);
  if (destination) {
    // Handle teleportation
    teleportPlayer(destination);
  }
}
```

## 🐛 Troubleshooting

### Common Issues
- **Portals not working**: Check `gameFeatures.portalsEnabled` setting
- **Validation errors**: Ensure portal placement follows rules
- **Visual glitches**: Check CSS animations and z-index values
- **Build errors**: Verify TypeScript types and imports

### Debug Mode
- **Enable debug**: Click "Show Debug" button
- **Check console**: Look for portal-related log messages
- **Inspect state**: Use browser dev tools to examine game state

---

**Portal Feature Status**: ✅ **FULLY IMPLEMENTED**
**Last Updated**: December 2024
**Version**: 1.0.0
