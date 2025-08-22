# 🧩 Path Fill Puzzle

A satisfying, brain-training puzzle game where you draw continuous paths to fill all tiles on a grid. Built with Next.js 15, TypeScript, Zustand, and Tailwind CSS.

## 🎯 Game Overview

**Path Fill Puzzle** is a spatial reasoning game that challenges players to create paths through adjacent tiles. The goal is simple: start at the designated tile and draw a continuous path that visits every active tile exactly once.

### 🎮 Core Gameplay
- **Draw paths** by dragging through adjacent tiles
- **Fill all tiles** to complete each level
- **Progressive difficulty** with increasingly complex grids
- **Touch and mouse support** for all devices

## ✨ Features

### 🎯 Game Mechanics
- **Grid-based puzzles** with customizable sizes (5x5 to 10x10)
- **Smart path validation** - only adjacent moves allowed
- **Dynamic level generation** with spiral-like patterns
- **Color progression** - each level uses a different neon color
- **Win detection** - automatic completion checking

### 🖥️ User Experience
- **Dark neon aesthetic** with glowing visual effects
- **Responsive design** optimized for mobile and desktop
- **Touch-friendly controls** with proper event handling
- **Instructions overlay** for first-time players
- **Victory celebration** with next level progression

### 🏗️ Technical Features
- **Zustand state management** for clean game state
- **TypeScript** for type safety and better development
- **Tailwind CSS** for responsive, modern styling
- **Next.js 15** with App Router for optimal performance
- **Mobile-first design** with touch and mouse support

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/TDSLukeMcCarthy/line-fill-game-prototype.git
   cd line-fill-game-prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Play the game**
   - Navigate to `http://localhost:3000`
   - Click "Start Game" to begin
   - Follow the instructions to learn how to play

## 🎮 How to Play

### Basic Rules
1. **Start from the colored tile** (automatically lit up in the level's color)
2. **Drag through adjacent tiles** to fill them with color
3. **Cover all active tiles** to complete the level
4. **Tap the start tile again** to reset if you make a mistake
5. **Progress through levels** with increasing complexity

### Controls
- **Mouse**: Click and drag to draw paths
- **Touch**: Tap and drag on mobile devices
- **Reset**: Tap the start tile to clear the current path
- **Navigation**: Use the Home and Restart buttons

### Game Elements
- **Start Tile**: Automatically colored in the level's color with glowing yellow ring
- **Active Tiles**: Gray tiles that can be filled
- **Inactive Tiles**: Dark tiles that are part of the grid but not playable
- **Filled Tiles**: Colored tiles showing your completed path
- **Level Indicator**: Shows current level number at the top

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── game/              # Game page
│   │   └── page.tsx       # Main game interface
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage with game title
│   ├── globals.css        # Global styles and Tailwind
│   └── favicon.ico        # Favicon
├── components/             # React components
│   ├── Grid.tsx           # Game grid layout
│   ├── Tile.tsx           # Individual tile component
│   └── GameUI.tsx         # Game overlay and controls
├── lib/                    # Game utilities
│   └── pathUtils.ts       # Path validation and level generation
├── store/                  # State management
│   └── gameStore.ts       # Zustand game state store
└── types/                  # TypeScript definitions
    └── game.ts            # Game types and interfaces
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Game Logic**: Custom path-finding algorithms
- **Deployment**: Vercel-ready

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### Adding New Features
1. **New game mechanics**: Extend the game store and utilities
2. **Additional levels**: Modify the level generation in `pathUtils.ts`
3. **Visual effects**: Add animations and particles
4. **Sound effects**: Integrate audio for better feedback
5. **Level editor**: Create tools for custom puzzle creation

### Game State Management
The game uses Zustand for state management with these key states:
- **Grid**: 2D array of tiles with position and state
- **Path**: Array of coordinates representing the current path
- **Level**: Current level number and progression
- **Game State**: Dragging status, completion status, colors

## 📱 Responsive Design

The game is built with mobile-first responsive design:
- **Mobile**: 40x40px tiles, touch-optimized controls
- **Desktop**: 60x60px tiles, mouse and touch support
- **Grid scaling**: Automatically adjusts to screen size
- **Touch events**: Proper handling for mobile devices

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Static export: Configure in `next.config.ts`

## 🎯 Game Design Philosophy

### Core Principles
- **Simple to learn, challenging to master**
- **Satisfying visual feedback** for all actions
- **Progressive difficulty** that scales naturally
- **Accessible controls** for all device types
- **Clean, focused gameplay** without distractions

### Future Enhancements
- **Level editor** for custom puzzle creation
- **Difficulty tiers** (Easy, Medium, Hard, Expert)
- **Daily challenges** with unique puzzles
- **Achievement system** for completed levels
- **Undo/redo functionality** for better user experience
- **Visual path trails** showing connections between tiles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with `npm run build`
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own game prototypes!

## 🎮 Game Development Insights

### What Makes This Game Work
- **Clear win condition**: Fill all tiles - simple to understand
- **Immediate feedback**: Visual changes on every action
- **Progressive challenge**: Levels get harder but remain solvable
- **Touch-friendly**: Works great on mobile devices
- **Performance optimized**: Smooth 60fps gameplay

### Technical Highlights
- **Efficient path validation** using adjacent tile checking
- **Smart level generation** that creates solvable puzzles
- **Responsive grid system** that adapts to any screen size
- **Clean state management** with Zustand
- **Type-safe development** with TypeScript

## 🔍 Testing

### Development Testing
- **Hot reload**: Changes appear instantly during development
- **Type checking**: `npm run type-check` for TypeScript validation
- **Build testing**: `npm run build` to ensure production readiness
- **Cross-device testing**: Test on mobile, tablet, and desktop

### Game Testing
- **Path drawing**: Test mouse and touch interactions
- **Level completion**: Verify win conditions work correctly
- **Reset functionality**: Ensure path clearing works properly
- **Level progression**: Test moving between levels

## 📚 Additional Resources

- **`.cursorrules`**: Detailed development guidelines and structure rules
- **`DEMO.md`**: Step-by-step testing and usage guide
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Zustand**: [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)

---

**Happy Puzzle Solving! 🧩✨**

This game demonstrates how to build engaging, interactive experiences with modern web technologies while maintaining clean, maintainable code.
