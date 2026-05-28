Project explanation notes

- Purpose: Small browser game where the player chats with a chibi character. The player's choices affect `friendship` and the character's `emotion`, producing one of five endings (4 main + 1 secret).

- Highlights:

  - `index.html`: main structure (background, character image, dialogue box, choices).
  - `styles.css`: responsive layout and the `.character` emotion classes. Note the character is centered bottom for better presentation.
  - `data/conversations.json`: the conversation graph. It contains `nodes` and a `secretSequence` entry. Each node has `id`, `text`, `choices` (with `id`, `text`, `friendshipDelta`, `emotion`, `nextId`). One choice is marked `secret` and contributes to the secret path.
  - `script.js`: the game engine. Key functions:
    - `init()` loads data and preloads images.
    - `startNewGame()` initialises `gameState` (current node, `friendship`, `choicesTaken`).
    - `renderCurrentNode()` shows text and choices.
    - `applyChoice()` applies choice effects, tracks `choicesTaken`, and advances nodes.
    - `showEnding()` evaluates endings: four main tiers (`bad`, `neutral`, `good`, `best`) using friendship thresholds and a `secret` ending that requires BOTH a high `friendship` (>=90) and matching the configured `secretSequence` in `choicesTaken` (option C - both conditions).

 - How to run: serve the `public/` folder (for example `npm run start` or
   `python3 -m http.server 8000 --directory public`).
