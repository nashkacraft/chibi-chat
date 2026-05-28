Project explanation notes — what to show your teacher

- Purpose: Small browser game where the player chats with a chibi character. The player's choices affect `friendship` and the character's `emotion`, producing one of three endings.

- Files to open and points to explain:

  - `index.html`: main structure (background, character image, dialogue box, choices).
  - `styles.css`: simple responsive layout and emotion classes that slightly transform or filter the character image.
  - `data/conversations.json`: the conversation graph. Explain the node/choice format (id, text, choices, friendshipDelta, emotion, nextId).
  - `script.js`: the game engine. Key functions:
    - `init()` loads data and preloads images.
    - `startNewGame()` initialises `gameState` (current node, friendship, emotion).
    - `renderCurrentNode()` shows text and choices.
    - `applyChoice()` applies effects and advances the node.
    - `showEnding()` decides which ending to display based on `friendship` thresholds.

- How to run: run `npm run prepare` to copy assets, then serve the `public/` folder.
