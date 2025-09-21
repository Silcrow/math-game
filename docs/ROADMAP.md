# Math Game Development Roadmap

## Project Overview
A math-based survival game where players solve arithmetic problems to move around a 3x3 grid, managing health while collecting cards and aiming for high scores or gold card victories.

## Development Phases

### Phase 1: Core Game Foundation (MVP)
**Timeline: 2-3 weeks**

#### 1.0 Bootstrap Runnable Game Shell
- [ ] Initialize repo with Vite (React + TypeScript)
- [ ] Add Phaser 3 and mount a blank `GameScene` to a canvas
- [ ] Render placeholder HUD text (e.g., `Health: 100 | Score: 0`)
- [ ] Display title "Math Game" and app version in the corner
- [ ] Ensure dev server runs with hot reload

Acceptance Criteria:
- [ ] `npm run dev` starts without errors
- [ ] A Phaser canvas is visible with a solid background color
- [ ] Placeholder HUD text is visible over the canvas
- [ ] Running instructions exist at `docs/RUNNING.md`

#### 1.1 Basic Game Engine Setup
- [ ] Initialize project structure
- [ ] Set up game loop and rendering system
- [ ] Implement 3x3 grid system
- [ ] Create player character and movement mechanics

#### 1.2 Core Gameplay Mechanics
- [ ] Health bar system (decreases over time)
- [ ] Basic math problem generation (addition/subtraction)
- [ ] Answer input system (keyboard typing)
- [ ] Tile-based movement triggered by correct answers
- [ ] Fixed healing system (2 HP per tile)

#### 1.3 Basic UI/UX
- [ ] Game grid visualization
- [ ] Health bar display
- [ ] Math problem display
- [ ] Input field for answers
- [ ] Basic game over screen
- [ ] Simple score tracking

### Phase 2: Enhanced Mechanics
**Timeline: 2-3 weeks**

#### 2.1 Advanced Problem System
- [ ] Unique tile problems (no repeats)
- [ ] Problem difficulty scaling
- [ ] Answer validation and feedback
- [ ] Problem history tracking

#### 2.2 Variable Healing System
- [ ] Random healing amounts (1-3 HP)
- [ ] Healing animation and feedback
- [ ] Balance testing for healing rates

#### 2.3 Victory Conditions
- [ ] Survival scoring system
- [ ] Gold card system (20% random chance)
- [ ] Gold card collection tracking (3x to win)
- [ ] Victory screen and celebration

### Phase 3: Card Deck System
**Timeline: 3-4 weeks**

#### 3.1 Card Data Structure
- [ ] Card model (problem, answer, healing points)
- [ ] Card database/storage system
- [ ] Card validation system

#### 3.2 Deck Management
- [ ] Deck creation and editing
- [ ] Card grouping into decks
- [ ] Duplicate card handling
- [ ] Deck selection for games

#### 3.3 Built-in Decks
- [ ] Educational deck categories (basic math, fractions, etc.)
- [ ] Balanced gameplay decks
- [ ] Difficulty-based deck organization
- [ ] Default deck recommendations

### Phase 4: Inventory/Menu System
**Timeline: 2-3 weeks**

#### 4.1 RPG-Style Inventory UI
- [ ] Card deck manager interface
- [ ] Card browsing and preview
- [ ] Deck switching functionality
- [ ] Visual card representations

#### 4.2 Card Management Features
- [ ] Add/remove cards from decks
- [ ] Import/export custom cards
- [ ] Card statistics and performance tracking
- [ ] Search and filter functionality

### Phase 5: Game Settings & Balancing
**Timeline: 1-2 weeks**

#### 5.1 Configurable Game Parameters
- [ ] Gold card spawn rate adjustment
- [ ] Health drop rate settings
- [ ] Healing amount ranges
- [ ] Time-based difficulty scaling
- [ ] Problem complexity settings

#### 5.2 Game Modes
- [ ] "Classic" mode implementation
- [ ] Practice mode (no health loss)
- [ ] Challenge modes with specific constraints
- [ ] Custom game rule sets

### Phase 6: Polish & Advanced Features
**Timeline: 2-3 weeks**

#### 6.1 Visual Polish
- [ ] Enhanced graphics and animations
- [ ] Particle effects for actions
- [ ] Improved UI/UX design
- [ ] Sound effects and music

#### 6.2 Data & Analytics
- [ ] Player performance tracking
- [ ] Learning analytics (weakness identification)
- [ ] Progress visualization
- [ ] Achievement system

#### 6.3 Adaptive Learning (Future)
- [ ] Weakness detection algorithms
- [ ] Adaptive problem selection
- [ ] Personalized difficulty adjustment
- [ ] Learning reward mechanisms

## Technical Milestones

### Milestone 1: Playable Prototype
- Basic 3x3 grid game with math problems
- Health system and game over conditions
- Simple scoring mechanism

### Milestone 2: Core Feature Complete
- Full card system implementation
- Deck management functionality
- Gold card victory condition

### Milestone 3: Polish & Balance
- Complete UI/UX implementation
- Game balancing and testing
- Performance optimization

### Milestone 4: Release Candidate
- All features implemented and tested
- Documentation complete
- Ready for user testing

## Risk Assessment

### High Risk
- **Card System Complexity**: The deck management system is complex and may require significant refactoring
- **Game Balance**: Finding the right balance between challenge and learning

### Medium Risk
- **UI/UX Complexity**: RPG-style inventory system requires careful design
- **Performance**: Ensuring smooth gameplay with complex card systems

### Low Risk
- **Basic Gameplay**: Core mechanics are straightforward
- **Math Problem Generation**: Well-understood algorithms

## Success Metrics

### Technical Metrics
- [ ] Game runs at 60 FPS consistently
- [ ] Load times under 3 seconds
- [ ] Zero critical bugs in core gameplay

### Gameplay Metrics
- [ ] Average session length > 5 minutes
- [ ] Player retention through multiple games
- [ ] Positive feedback on learning effectiveness

## Next Steps
1. Finalize tech stack selection
2. Set up development environment
3. Begin Phase 1 implementation
4. Establish testing and feedback loops