# Chibi Chat - School Project

Small browser game (HTML/CSS/JavaScript) where the player chats with a chibi character. Choices affect the character's emotion and a `friendship` score which produces one of multiple endings. The playable site is in `public/`; original assets are kept in `task/assets/`.

Tech: plain HTML, CSS, vanilla JavaScript. No build step required for the app itself.

Quick start (development)

1. Install dev tools (Prettier, ESLint):

```bash
cd <repo-folder>
npm install
```

2. Serve the site locally:

```bash
npm run start     # serves public/ at http://localhost:8000
```

Alternative (serve manually):

```bash
python3 -m http.server 8000 --directory public
# open http://localhost:8000
```

Dev helpers

- `npm run format` - runs Prettier across HTML/CSS/JS/JSON/MD.
- `npm run lint` - runs ESLint on the repository JS files.
  Note: `task/assets/` was used during initial implementation; current `public/assets/` contains the images used by the playable site. There is no `prepare` script anymore.

  Deploying to GitHub Pages

  This repository includes a GitHub Actions workflow that automatically publishes the `public/` folder to the `gh-pages` branch whenever you push to `main`. No extra setup is required beyond pushing your code to GitHub.

  - To deploy manually (one-off), you can use `git subtree` or `npx gh-pages`:

  ```bash
  # push public/ as the gh-pages branch (one-time)
  git subtree push --prefix public origin gh-pages

  # or with npx:
  npx gh-pages -d public
  ```

  - To use the included automatic deploy (preferred):
    1. Push your repository to GitHub (branch `main`).
    2. Wait a minute for the Actions workflow to run. It will publish `public/` to `gh-pages`.
    3. Your site will be available at `https://<username>.github.io/<repo>/` (replace with your GitHub username and repo name).

  If you want a custom domain, configure it in your repository Pages settings after the first publish.

Project layout (important files)

- `public/` — hosted files (HTML/CSS/JS/data) to serve.
- `public/index.html` — main page.
- `public/script.js` — game engine (state, renderer, choice handling). Open this to explain code flow.
- `public/data/conversations.json` — conversation graph (hand-editable JSON).
- `task/assets/` — original images used by the game.
- `package.json`, `.prettierrc`, `.eslintrc.json` — dev tooling configs.
- `public/EXPLAIN.md` — short notes you can use when presenting to your teacher.

Notes for presenting

- Explain the `conversation -> state -> render` flow: `conversations.json` defines nodes; `script.js` keeps a simple `gameState` (current node, `friendship`, `emotion`) and updates the DOM.
- Keep examples short: open `public/data/conversations.json` and show how a choice changes `friendshipDelta` and `nextId`.

If you want, I can add a tiny build task that bundles/minifies `public/` for distribution, or run `npm run format` and fix lint issues now.
