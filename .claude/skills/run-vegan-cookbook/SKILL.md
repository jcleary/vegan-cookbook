---
name: run-vegan-cookbook
description: Run, start, launch, screenshot, or verify the vegan cookbook app. Use when asked to run the app, take a screenshot, confirm a feature works, or test a change in the browser.
---

A Vite + React SPA. The driver is Chrome headless (`--screenshot`) — no separate driver file needed. Hash-based routing means all deep links use `#route/id` fragments.

## Prerequisites

None beyond the repo's own deps. Run `npm install` if `node_modules` is missing.

Chrome is at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` — verified on this machine.

## Build & start dev server

```bash
npm run dev -- --port 4321
```

Vite will fall back to the next free port if 4321 is taken — check the terminal output for the actual port. The command runs `node build.js` first (rebuilds `public/recipes.json` from `recipes/*.json`) then starts Vite.

## Screenshot (agent path)

Replace `$PORT` with the actual port from the dev server output.

**Homepage:**
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu \
  --screenshot=/tmp/cookbook-home.png \
  --window-size=1280,900 \
  "http://localhost:$PORT/"
```

**Recipe detail page** (hash routing — `#recipe/<id>`):
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu \
  --screenshot=/tmp/cookbook-recipe.png \
  --window-size=1280,1600 \
  "http://localhost:$PORT/#recipe/thai-green-noodle-soup"
```

**Planner:**
```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu \
  --screenshot=/tmp/cookbook-planner.png \
  --window-size=1280,900 \
  "http://localhost:$PORT/#planner"
```

Read the screenshot file immediately after taking it to verify the page rendered correctly — a blank or error state is a failure.

## Run (human path)

```bash
npm run dev
```

Opens at `http://localhost:5173` (or next free port). Ctrl-C to stop.

## Routing

All navigation is hash-based. Deep link patterns:
- `/#` or `/` → home / recipe list
- `/#recipe/<id>` → single recipe (e.g. `/#recipe/sesame-peanut-noodles`)
- `/#planner` → weekly meal planner

## Gotchas

- **`chromium-cli` is not installed** — use the full Chrome path above. `chromium-cli` is a separate tool that is not present here.
- **Port fallback** — `npm run dev -- --port 4321` may land on 4322 or higher if the port is taken. Always read the Vite output for the real port before screenshotting.
- **Hash routing + headless** — passing `http://localhost:$PORT/recipe/foo` (no `#`) will render the homepage, not the recipe. The `#` is required: `http://localhost:$PORT/#recipe/foo`.
- **recipes.json rebuild** — `npm run dev` runs `node build.js` first, which reads all `recipes/*.json` and writes `public/recipes.json`. If you add or edit a recipe file, restarting the dev server picks it up automatically (Vite HMR handles subsequent changes to the JSON via a custom plugin in `build.js`).
