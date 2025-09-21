# Math Game Development Guide

## Quick Start

This guide will help you set up the development environment and start building your math-based survival game.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Visual Studio Code** (recommended editor)

## Initial Project Setup

### 1. Create the Project

```bash
# Navigate to your projects directory
cd /Users/sangsan/CascadeProjects/math-game

# Create React + TypeScript project with Vite
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
```

### 2. Install Game Dependencies

```bash
# Core game dependencies
npm install phaser zustand dexie
npm install -D @types/phaser

# UI and styling dependencies
npm install tailwindcss styled-components @headlessui/react
npm install -D @types/styled-components autoprefixer postcss

# Development tools
npm install -D eslint prettier @typescript-eslint/eslint-plugin
npm install -D @typescript-eslint/parser eslint-config-prettier
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

### 3. Configure Tailwind CSS

```bash
# Initialize Tailwind
npx tailwindcss init -p
```

### 4. Set Up Development Tools

```bash
# Initialize ESLint
npx eslint --init

# Create Prettier config
echo '{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}' > .prettierrc
```

## Development Workflow

### Phase 1: Basic Setup (Week 1)

#### Day 1-2: Project Foundation
1. **Set up the basic project structure**
   ```bash
   mkdir -p src/{components,game,stores,types,utils,hooks,data,services}
   mkdir -p src/components/{layout,ui,game,inventory,menu,screens}
   mkdir -p src/game/{scenes,entities,systems,utils,events}
   mkdir -p public/assets/{sprites,audio,fonts}
   ```

2. **Create basic TypeScript types**
   - Game state types
   - Card and deck types
   - UI component types

3. **Set up Zustand stores**
   - Game store (health, score, game state)
   - Card store (decks, current deck)
   - Settings store (game configuration)

#### Day 3-4: Basic Game Engine
1. **Integrate Phaser with React**
   - Create GameCanvas component
   - Set up basic Phaser configuration
   - Create base scene structure

2. **Implement 3x3 grid**
   - Grid entity class
   - Tile entity class
   - Basic grid rendering

#### Day 5-7: Core Mechanics
1. **Player character**
   - Player entity with sprite
   - Basic movement system
   - Position tracking

2. **Health system**
   - Health bar component
   - Health decrease over time
   - Health increase on tile movement

### Phase 2: Game Logic (Week 2)

#### Day 1-3: Math Problem System
1. **Problem generation**
   - Basic addition/subtraction problems
   - Problem uniqueness tracking
   - Difficulty scaling

2. **Answer input system**
   - React input component
   - Answer validation
   - Movement trigger on correct answer

#### Day 4-7: Enhanced Mechanics
1. **Variable healing**
   - Random healing amounts (1-3 HP)
   - Healing animations
   - Balance testing

2. **Victory conditions**
   - Survival scoring
   - Gold card system (20% chance)
   - Win condition (3 gold cards)

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (when implemented)
npm run test
```

## Code Style Guidelines

### TypeScript Best Practices

```typescript
// Use interfaces for object shapes
interface Card {
  id: string;
  problem: string;
  answer: number;
  healingPoints: number;
  isGold?: boolean;
}

// Use enums for constants
enum GameState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'gameOver',
}

// Use proper typing for functions
const generateProblem = (difficulty: number): Card => {
  // Implementation
};
```

### React Component Patterns

```typescript
// Use functional components with TypeScript
interface HealthBarProps {
  currentHealth: number;
  maxHealth: number;
  className?: string;
}

const HealthBar: React.FC<HealthBarProps> = ({ 
  currentHealth, 
  maxHealth, 
  className 
}) => {
  const percentage = (currentHealth / maxHealth) * 100;
  
  return (
    <div className={`health-bar ${className}`}>
      <div 
        className="health-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
```

### Phaser Integration Pattern

```typescript
// Game scene with React communication
class GameScene extends Phaser.Scene {
  private eventBus: EventBus;
  
  constructor() {
    super({ key: 'GameScene' });
    this.eventBus = EventBus.getInstance();
  }
  
  create() {
    // Set up game objects
    this.setupGrid();
    this.setupPlayer();
    
    // Listen for React events
    this.eventBus.on('answer:submitted', this.handleAnswer.bind(this));
  }
  
  private handleAnswer(answer: number) {
    // Validate answer and move player
    if (this.validateAnswer(answer)) {
      this.movePlayer();
      this.eventBus.emit('player:moved', { newPosition: this.player.position });
    }
  }
}
```

## Testing Strategy

### Unit Testing Setup

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom
```

### Example Test Structure

```typescript
// src/utils/__tests__/mathUtils.test.ts
import { generateProblem, validateAnswer } from '../mathUtils';

describe('Math Utils', () => {
  test('generates valid addition problems', () => {
    const problem = generateProblem('addition', 1);
    expect(problem.problem).toMatch(/\d+ \+ \d+/);
    expect(typeof problem.answer).toBe('number');
  });
  
  test('validates correct answers', () => {
    const problem = { problem: '2 + 3', answer: 5 };
    expect(validateAnswer(problem, 5)).toBe(true);
    expect(validateAnswer(problem, 4)).toBe(false);
  });
});
```

## Debugging Tips

### React DevTools
- Install React Developer Tools browser extension
- Use Zustand DevTools for state debugging
- Enable React Strict Mode for development

### Phaser Debugging
```typescript
// Enable Phaser debug mode
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true // Shows collision boxes
    }
  }
};
```

### Console Logging
```typescript
// Use debug utility for conditional logging
const debug = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  }
};
```

## Performance Monitoring

### React Performance
```typescript
// Use React Profiler for performance monitoring
import { Profiler } from 'react';

const onRenderCallback = (id: string, phase: string, actualDuration: number) => {
  console.log('Render:', { id, phase, actualDuration });
};

<Profiler id="GameHUD" onRender={onRenderCallback}>
  <GameHUD />
</Profiler>
```

### Phaser Performance
```typescript
// Monitor FPS in Phaser
class GameScene extends Phaser.Scene {
  create() {
    // Show FPS counter
    this.add.text(10, 10, '', { color: '#00ff00' })
      .setScrollFactor(0)
      .setDepth(1000);
  }
  
  update() {
    // Update FPS display
    this.children.getByName('fps')?.setText(`FPS: ${this.game.loop.actualFps.toFixed(1)}`);
  }
}
```

## Deployment Preparation

### Build Optimization
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          phaser: ['phaser'],
          game: ['zustand', 'dexie']
        }
      }
    }
  }
});
```

### Environment Variables
```bash
# .env.local
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=true
VITE_ANALYTICS_ENABLED=false
```

## Next Steps

1. **Start with Phase 1, Day 1-2**: Set up the basic project structure
2. **Create a simple prototype**: Get a basic 3x3 grid working with player movement
3. **Iterate quickly**: Focus on getting core mechanics working before polishing
4. **Test frequently**: Play your game regularly to identify issues early
5. **Document as you go**: Keep notes on design decisions and lessons learned

## Getting Help

- **Phaser Documentation**: https://photonstorm.github.io/phaser3-docs/
- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Zustand Documentation**: https://github.com/pmndrs/zustand

Remember: Start simple, iterate quickly, and focus on making the core gameplay fun before adding complexity!