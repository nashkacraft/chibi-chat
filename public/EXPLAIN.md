Project explanation notes - what to show your teacher

- Purpose: Small browser game where the player chats with a chibi character. The player's choices affect `friendship` and the character's `emotion`, producing one of five endings (4 main + 1 secret).

- Files to open and points to explain:

  - `index.html`: main structure (background, character image, dialogue box, choices).
  - `styles.css`: responsive layout and the `.character` emotion classes. Note the character is centered bottom for better presentation.
  - `data/conversations.json`: the conversation graph. It contains `nodes` and a `secretSequence` entry. Each node has `id`, `text`, `choices` (with `id`, `text`, `friendshipDelta`, `emotion`, `nextId`). One choice is marked `secret` and contributes to the secret path.
  - `script.js`: the game engine. Key functions:
    - `init()` loads data and preloads images.
    - `startNewGame()` initialises `gameState` (current node, `friendship`, `choicesTaken`).
    - `renderCurrentNode()` shows text and choices.
    - `applyChoice()` applies choice effects, tracks `choicesTaken`, and advances nodes.
    - `showEnding()` evaluates endings: four main tiers (`bad`, `neutral`, `good`, `best`) using friendship thresholds and a `secret` ending that requires BOTH a high `friendship` (>=90) and matching the configured `secretSequence` in `choicesTaken` (option C - both conditions).

- How to run: run `npm run prepare` to copy `task/assets` into `public/assets`, then serve the `public/` folder.

Tips for presentation:

- Show `data/conversations.json` and point out the `secretSequence` value (e.g. ["c2","c7","c12"]). Explain how `script.js` checks for that sequence and a high friendship value before showing the secret ending.
- Explain the `gameState.choicesTaken` array and how it records choice ids; this makes the secret-check logic easy to explain.
