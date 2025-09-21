# Math Game Architecture & Codebase Structure

## Architecture Overview

The math game follows a **Component-Based Architecture** with clear separation of concerns between the React UI layer and the Phaser game engine layer.

```
┌─────────────────────────────────────────────────────────────┐
│                     React UI Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Game HUD      │  │  Inventory UI   │  │  Settings   │ │
│  │  (Health, Score)│  │ (Card Manager)  │  │    Menu     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Management                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Game Store    │  │   Card Store    │  │ Settings    │ │
│  │ (Health, Score, │  │ (Decks, Cards,  │  │   Store     │ │
│  │  Game State)    │  │  Current Deck)  │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Phaser Game Engine                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Game Scene    │  │  Menu Scene     │  │ Game Over   │ │
│  │ (Grid, Player,  │  │                 │  │   Scene     │ │
│  │  Math Problems) │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   IndexedDB     │  │  Local Storage  │  │   JSON      │ │
│  │ (Cards, Decks,  │  │   (Settings,    │  │ (Built-in   │ │
│  │  Game History)  │  │   High Scores)  │  │   Decks)    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Codebase Structure

```
math-game/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── assets/
│       ├── sprites/
│       │   ├── player.png
│       │   ├── tiles/
│       │   └── ui/
│       ├── audio/
│       │   ├── sfx/
│       │   └── music/
│       └── fonts/
│
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Main App component
│   │
│   ├── components/                 # React Components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Main app layout
│   │   │   ├── GameLayout.tsx      # Game-specific layout
│   │   │   └── MenuLayout.tsx      # Menu layout
│   │   │
│   │   ├── ui/                     # Reusable UI Components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   │
│   │   ├── game/                   # Game-specific Components
│   │   │   ├── GameHUD.tsx         # Health bar, score, timer
│   │   │   ├── ProblemDisplay.tsx  # Math problem display
│   │   │   ├── AnswerInput.tsx     # Answer input field
│   │   │   └── GameCanvas.tsx      # Phaser game container
│   │   │
│   │   ├── inventory/              # Card/Deck Management
│   │   │   ├── InventoryPanel.tsx  # Main inventory interface
│   │   │   ├── DeckManager.tsx     # Deck creation/editing
│   │   │   ├── CardBrowser.tsx     # Browse and select cards
│   │   │   ├── CardEditor.tsx      # Create/edit individual cards
│   │   │   └── DeckSelector.tsx    # Choose deck for game
│   │   │
│   │   ├── menu/                   # Menu Components
│   │   │   ├── MainMenu.tsx        # Main menu screen
│   │   │   ├── SettingsMenu.tsx    # Game settings
│   │   │   ├── HighScores.tsx      # Score leaderboard
│   │   │   └── GameModeSelector.tsx
│   │   │
│   │   └── screens/                # Full Screen Components
│   │       ├── GameScreen.tsx      # Main game screen
│   │       ├── MenuScreen.tsx      # Menu screen
│   │       ├── InventoryScreen.tsx # Inventory management
│   │       └── SettingsScreen.tsx  # Settings screen
│   │
│   ├── game/                       # Phaser Game Engine Code
│   │   ├── GameManager.ts          # Main game manager class
│   │   ├── config.ts               # Phaser configuration
│   │   │
│   │   ├── scenes/                 # Phaser Scenes
│   │   │   ├── BaseScene.ts        # Base scene class
│   │   │   ├── GameScene.ts        # Main gameplay scene
│   │   │   ├── MenuScene.ts        # Menu scene
│   │   │   ├── GameOverScene.ts    # Game over scene
│   │   │   └── LoadingScene.ts     # Asset loading scene
│   │   │
│   │   ├── entities/               # Game Objects
│   │   │   ├── Player.ts           # Player character
│   │   │   ├── Tile.ts             # Grid tile
│   │   │   ├── Grid.ts             # Game grid manager
│   │   │   ├── HealthBar.ts        # Health visualization
│   │   │   └── ProblemCard.ts      # Problem display object
│   │   │
│   │   ├── systems/                # Game Systems
│   │   │   ├── InputSystem.ts      # Handle user input
│   │   │   ├── MovementSystem.ts   # Player movement logic
│   │   │   ├── HealthSystem.ts     # Health management
│   │   │   ├── ScoringSystem.ts    # Score calculation
│   │   │   ├── ProblemSystem.ts    # Math problem generation
│   │   │   └── CardSystem.ts       # Card/deck management
│   │   │
│   │   ├── utils/                  # Game Utilities
│   │   │   ├── AssetLoader.ts      # Asset loading helper
│   │   │   ├── AudioManager.ts     # Sound management
│   │   │   ├── AnimationHelper.ts  # Animation utilities
│   │   │   └── CollisionDetection.ts
│   │   │
│   │   └── events/                 # Game Events
│   │       ├── GameEvents.ts       # Game event definitions
│   │       └── EventBus.ts         # Event communication
│   │
│   ├── stores/                     # State Management (Zustand)
│   │   ├── gameStore.ts            # Game state (health, score, etc.)
│   │   ├── cardStore.ts            # Card and deck management
│   │   ├── settingsStore.ts        # Game settings
│   │   ├── uiStore.ts              # UI state (modals, screens)
│   │   └── index.ts                # Store exports
│   │
│   ├── types/                      # TypeScript Type Definitions
│   │   ├── game.ts                 # Game-related types
│   │   ├── cards.ts                # Card and deck types
│   │   ├── ui.ts                   # UI component types
│   │   ├── settings.ts             # Settings types
│   │   └── index.ts                # Type exports
│   │
│   ├── data/                       # Static Data
│   │   ├── defaultDecks.ts         # Built-in card decks
│   │   ├── gameConstants.ts        # Game configuration constants
│   │   ├── problemTemplates.ts     # Math problem templates
│   │   └── achievements.ts         # Achievement definitions
│   │
│   ├── services/                   # External Services
│   │   ├── DatabaseService.ts      # IndexedDB operations
│   │   ├── StorageService.ts       # Local storage operations
│   │   ├── ExportService.ts        # Import/export functionality
│   │   └── AnalyticsService.ts     # Game analytics (future)
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useGame.ts              # Game state hook
│   │   ├── useCards.ts             # Card management hook
│   │   ├── useSettings.ts          # Settings hook
│   │   ├── useLocalStorage.ts      # Local storage hook
│   │   └── useKeyboard.ts          # Keyboard input hook
│   │
│   ├── utils/                      # General Utilities
│   │   ├── mathUtils.ts            # Math problem generation
│   │   ├── randomUtils.ts          # Random number utilities
│   │   ├── validationUtils.ts      # Input validation
│   │   ├── formatUtils.ts          # Data formatting
│   │   └── debugUtils.ts           # Development debugging
│   │
│   └── styles/                     # Styling
│       ├── globals.css             # Global styles
│       ├── components.css          # Component-specific styles
│       ├── game.css                # Game-specific styles
│       └── tailwind.css            # Tailwind imports
│
├── tests/                          # Test Files
│   ├── components/                 # Component tests
│   ├── game/                       # Game logic tests
│   ├── stores/                     # Store tests
│   ├── utils/                      # Utility tests
│   └── __mocks__/                  # Test mocks
│
├── docs/                           # Documentation
│   ├── PROMPT.md                   # Original game concept
│   ├── ROADMAP.md                  # Development roadmap
│   ├── TECH_STACK.md              # Technology choices
│   ├── ARCHITECTURE.md            # This file
│   ├── API.md                      # Internal API documentation
│   └── DEPLOYMENT.md              # Deployment guide
│
├── config/                         # Configuration Files
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── tsconfig.json              # TypeScript configuration
│   └── eslint.config.js           # ESLint configuration
│
├── package.json                    # Dependencies and scripts
├── package-lock.json              # Dependency lock file
├── README.md                      # Project README
└── .gitignore                     # Git ignore rules
```

## Core Architecture Patterns

### 1. Component-Based Architecture
- **React Components**: Handle UI rendering and user interactions
- **Phaser Scenes**: Manage game logic and rendering
- **Clear Separation**: UI components don't directly manipulate game objects

### 2. State Management Pattern
```typescript
// Centralized state with Zustand
interface GameState {
  health: number;
  score: number;
  currentProblem: Problem | null;
  gameStatus: 'playing' | 'paused' | 'gameOver';
  // ... other game state
}

// Actions are pure functions
const gameStore = create<GameState>((set, get) => ({
  health: 100,
  score: 0,
  currentProblem: null,
  gameStatus: 'playing',
  
  // Actions
  decreaseHealth: (amount: number) => 
    set(state => ({ health: Math.max(0, state.health - amount) })),
  
  increaseScore: (points: number) => 
    set(state => ({ score: state.score + points })),
}));
```

### 3. Event-Driven Communication
```typescript
// Game events for React ↔ Phaser communication
enum GameEvents {
  PLAYER_MOVED = 'player:moved',
  PROBLEM_SOLVED = 'problem:solved',
  HEALTH_CHANGED = 'health:changed',
  GAME_OVER = 'game:over',
}

// Event bus for decoupled communication
class EventBus {
  private events: Map<string, Function[]> = new Map();
  
  on(event: string, callback: Function) { /* ... */ }
  emit(event: string, data?: any) { /* ... */ }
  off(event: string, callback: Function) { /* ... */ }
}
```

### 4. Entity-Component-System (ECS) Pattern for Game Objects
```typescript
// Base entity class
abstract class Entity {
  id: string;
  components: Map<string, Component> = new Map();
  
  addComponent<T extends Component>(component: T): T { /* ... */ }
  getComponent<T extends Component>(type: string): T | null { /* ... */ }
  removeComponent(type: string): void { /* ... */ }
}

// Example: Player entity with components
class Player extends Entity {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super();
    this.addComponent(new PositionComponent(x, y));
    this.addComponent(new SpriteComponent(scene, 'player'));
    this.addComponent(new HealthComponent(100));
    this.addComponent(new MovementComponent());
  }
}
```

## Data Flow Architecture

### 1. User Input Flow
```
User Input → React Component → Store Action → Game System → Phaser Scene → Visual Update
```

### 2. Game Logic Flow
```
Game Timer → Health System → Store Update → React Component → UI Update
```

### 3. Card System Flow
```
Deck Selection → Card Store → Problem Generation → Game Scene → Answer Validation → Score Update
```

## Key Design Principles

### 1. Single Responsibility Principle
- Each component/class has one clear purpose
- Game systems handle specific aspects (health, movement, scoring)
- UI components focus only on presentation

### 2. Dependency Inversion
- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces/types)
- Easy to swap implementations (e.g., different storage backends)

### 3. Open/Closed Principle
- Classes open for extension, closed for modification
- New card types can be added without changing existing code
- New game modes can be implemented by extending base classes

### 4. Interface Segregation
- Small, focused interfaces rather than large ones
- Components only depend on interfaces they actually use

## Performance Considerations

### 1. React Optimization
- Use `React.memo` for expensive components
- Implement proper `useMemo` and `useCallback` usage
- Lazy load screens and components
- Virtual scrolling for large card lists

### 2. Phaser Optimization
- Object pooling for frequently created/destroyed objects
- Efficient sprite atlases and texture management
- Proper cleanup of event listeners and timers
- Use Phaser's built-in performance monitoring

### 3. State Management Optimization
- Selective subscriptions to store slices
- Batch state updates where possible
- Avoid unnecessary re-renders with proper selectors

## Testing Strategy

### 1. Unit Tests
- Pure functions (math utilities, validation)
- Store actions and selectors
- Individual components in isolation

### 2. Integration Tests
- React component + store interactions
- Game system interactions
- Database operations

### 3. End-to-End Tests
- Complete user workflows
- Game session from start to finish
- Card management workflows

## Security Considerations

### 1. Input Validation
- Sanitize all user inputs (card content, answers)
- Validate math expressions before evaluation
- Prevent XSS in user-generated content

### 2. Data Integrity
- Validate card data structure
- Prevent tampering with game scores
- Secure local storage of sensitive data

## Deployment Architecture

### 1. Development
```
Local Development → Hot Reload → Browser Testing
```

### 2. Staging
```
Git Push → GitHub Actions → Build → Netlify Deploy → Testing
```

### 3. Production
```
Release Branch → Build Optimization → CDN Deploy → Monitoring
```

## Future Scalability

### 1. Multiplayer Support
- WebSocket integration layer
- Shared game state synchronization
- Real-time card trading system

### 2. Mobile App
- React Native port using shared business logic
- Platform-specific UI adaptations
- Native performance optimizations

### 3. Cloud Features
- User authentication system
- Cloud save synchronization
- Analytics and learning insights

This architecture provides a solid foundation for rapid development while maintaining code quality and future extensibility.
