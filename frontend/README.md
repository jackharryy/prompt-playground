AI Scratch Builder — Frontend
=============================

This directory contains the React + Vite frontend for the AI Scratch Builder app.

Quick commands (run inside `frontend/`)
--------------------------------------
- Install dependencies:

```bash
npm install
```

- Start development server:

```bash
npm run dev
```

- Production build:

```bash
npm run build
npm run preview
```

Proxy helpers
-------------
From the `frontend/` directory you can use helper npm scripts that start the proxy in `../proxy`:

- `npm run proxy:dev` — start the proxy in dev mode
- `npm run proxy:start` — start the proxy in production mode
- `npm run dev:all` — convenience script that starts the proxy (dev) and then the frontend dev server

Environment variables
---------------------
Frontend:
- `VITE_OPENROUTER_PROXY` — URL of the proxy endpoint (e.g. `http://localhost:8787/openrouter`)
- `VITE_OPENROUTER_KEY` — client-side OpenRouter key (not recommended; prefer proxy)
- `VITE_OPENROUTER_MODEL` — optional default model name

Proxy (see `proxy/.env.example`):
- `OPENROUTER_KEY` — server-side OpenRouter key (keep secret)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OAUTH_REDIRECT` — only needed if using Google sign-in

How auth + keys work
--------------------
- If Google OAuth is configured, users can sign in from the frontend. The proxy manages sessions and stores per-user API keys in `proxy/store.json`.
- The frontend shows an Account UI to paste and save an OpenRouter key for the signed-in user.

Development notes
-----------------
- Adapter code lives in `src/ai/`. `OpenRouterAdapter` is used for real AI calls.
- Option and emoji generation is implemented as small AI agents under `src/ai/`.
- PWA config is in `public/manifest.json` and `dev-dist` contains service worker helpers.

Security
--------
- Do not commit secrets. Prefer the proxy for server-side calls so the OpenRouter key remains private.

Want me to run the frontend and the proxy locally and verify sign-in and `proxy/store.json` creation? Reply yes and provide Google OAuth creds (or I can guide you to create them).