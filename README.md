Prompt Playground
=================

This repository contains two services:

- `frontend/` — the React + Vite app (Tailwind + PWA)
- `proxy/` — a small Express proxy for forwarding OpenRouter requests securely

Quick start
-----------

1. Install dependencies at the repo root to get helper tools:

```bash
npm install
```

2. Copy proxy env and add your OpenRouter key:

```bash
cp proxy/.env.example proxy/.env
# edit proxy/.env and set OPENROUTER_KEY
```

3. Start both services (this script will auto-create `proxy/.env` from the example if missing):

```bash
npm run dev
```

Alternative commands
--------------------
- Start proxy only: `npm run proxy:dev`
- Start frontend only: `npm run frontend:dev`
- Start both in parallel without the pre-check: `npm run dev:all`

Environment variables
---------------------
- `proxy/.env` — contains `OPENROUTER_KEY` for the proxy.
- Frontend may use `VITE_OPENROUTER_PROXY` to point to the proxy (e.g. `http://localhost:8787/openrouter`).

Security
--------
Do not commit `proxy/.env` or any secret keys.

Files of interest
-----------------
- `frontend/src/ai` — adapter abstraction and example adapters
- `frontend/src/components/AiConsole.tsx` — UI for interacting with adapters
- `proxy/index.js` — the express proxy

Next steps
----------
- Add rate limiting / logging middleware to the proxy before public deployment.
- Add CI steps for building the frontend and deploying the proxy.
