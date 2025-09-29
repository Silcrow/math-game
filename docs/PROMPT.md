
Construction plan of the game:
- 3x3 tile, player character, health bar, health bar decreases, walk to tile, hp increases.
	- right now health decreases over time, but with each move to a card, health should increase by 1.
	- victory condition = survive as long as possible until death, then you get a top scoreboard (classic arcade style).
	- failure condition = health bar 0. You lose (bring up the high score screen)

Optionally scale the heal by tile/card value later.

modifying each aspect:
- random addition and subtraction problems are displayed on the tile the player's not on (use randomizer first, later, it's an actual card in a deck, with more complicated randomizing rules). Player doesn't click tile to move anymore. Instead, tiles never repeat (always unique) and typing the answer immediately moves player to that tile.
- healing is now unequal = earlier, each tile heals 2 units as a placeholder, but now construct a mechanism so that it heals either 1, 2, 3 units. Later, healing amount will be baed on a the card.
- menu bar (like a character inventory, but a card deck manager) = like a flash card manager, but designed like an RPG game character's inventory menu
	- Each card is 1 puzzle to solve (displayed), paired with an answer, and healing points (card has 3 stats).
	- Cards can be grouped into decks. Each deck can have duplicate cards (this determines chance of being drawn and ensures drawn cards don't appear while undrawn cards appear, rather than a dice-like random appearance)
	- a deck can be chosen for a game.
	- all the above are "custom decks", but game already has built-in decks to choose from (the balanced or educational stacks of flash card / problems)
- change victory condition = you still lose if your health bar zeroes, but there's a random chance a card is gold, and if you solved/collected/walked on the gold card 3x you win (in the future, this randomizer might be more sophisticated, but for now just pure random, like 20%).

The above should be "game-name classic" version, with a "game settings" for adjusting pure numericals (for the sake of experimenting balancing the game), like gold random %, health drop rate, etc. Not sure yet what else should be adjustable, but I'll eventually want it to be fun but also pushes players to "learn math" by rewarding solving their weaknesses (this is complicated, coz it means reward mechanism adapts)
