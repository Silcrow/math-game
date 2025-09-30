
score should not increase per second, but only when the player moved to a card

Game mode: Collect 3 gold cards to win (beta tester mode, no deck, but random +/-). 
- change victory condition = you still lose if your health bar zeroes, but there's a random chance a card is gold, and if you solved/collected/walked on the gold card 3x you win
	- in the future, this randomizer might be more sophisticated, but for now just pure random, like 20% (allow changing this in settings?)
- Optionally scale the heal by tile/card value later. Healing is now unequal = earlier, each tile heals 2 units as a placeholder, but now construct a mechanism so that it heals either 1, 2, 3 units. Later, healing amount will be baed on a the card.
- when moving to a gold card, score incre 1. Victory condition when score = 3.
- can adjust health drop rate and gold draw rate.

- deck settings (like a character inventory, but a card deck manager) = like a flash card manager, but designed like an RPG game character's inventory menu
	- Each card is 1 puzzle to solve (displayed), paired with an answer, and healing points (card has 3 stats).
	- Cards can be grouped into decks. Each deck can have duplicate cards (this determines chance of being drawn and ensures drawn cards don't appear while undrawn cards appear, rather than a dice-like random appearance)
	- a deck can be chosen for a game.
	- all the above are "custom decks", but game already has built-in decks to choose from (the balanced or educational stacks of flash card / problems)

things to add later
- when score and health incre, I want a +1 animation on the HUD.
- settings theme: halloween
- deck builder = originally, each card's rank which gives a score, the score is basically "damage" per spell (how quickly you solve is the cast time). But in a deck, you can mod each card with "effects" instead of damage. The more powerful the card rank, the more powerful effects you can mod. (ask GPT about fun effects. Don't add generic effects, only add really fun ones unique to this game.)

question
- how would the player know which card they're strong (it works like flash cards) and which they need to work on (to increase probability of being drawn)
- how to make it multiplayer, and the game tracks and adapt which card is which level, so to assign it a color (difficulty ranking, with corresponding score).