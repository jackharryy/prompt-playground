AI Scratch Builder (Prompt Playground)
=====================================

This repository contains a small React + Vite frontend and an Express proxy used to safely forward OpenRouter requests.

Repository layout
-----------------
- [frontend/](frontend/README.md) — React + Vite app (TypeScript, Tailwind, PWA)
- [proxy/](proxy/README.md) — Node/Express proxy that handles OAuth and forwards OpenRouter calls

Quick start (development)
-------------------------
1. Install repo-level helpers (optional):

```bash
npm install
```

2. Start both services (recommended):

```bash
npm run dev
```

3. Or start services individually:

- Start the proxy only:

```bash
npm run proxy:dev
```

- Start the frontend only:

```bash
npm run frontend:dev
```

Important files and locations
-----------------------------
- Adapter code: [frontend/src/ai](frontend/src/ai)
- Account and auth UI: [frontend/src/components/Account.tsx](frontend/src/components/Account.tsx)
- Proxy server: [proxy/index.js](proxy/index.js)
- Proxy persisted store: `proxy/store.json` (created on first login or you can create it manually)

Environment / secrets
---------------------
- See [proxy/.env.example](proxy/.env.example) for proxy environment variables. Key variables include:
  - `OPENROUTER_KEY` — optional global OpenRouter key (server-side)
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — for Google OAuth (optional, used for login)
  - `OAUTH_REDIRECT` — OAuth redirect URL (default `http://localhost:8787/auth/google/callback`)
- Frontend uses `VITE_OPENROUTER_PROXY` to point to the proxy, e.g. `http://localhost:8787/openrouter`.

Notes on `proxy/store.json`
---------------------------
- The proxy writes `proxy/store.json` when a user signs in or saves an OpenRouter key. It does not exist until the first interaction.
- You can pre-create it with:

```bash
echo '{"users":{},"sessions":{}}' > proxy/store.json
```

Security
--------
- Do not commit `.env` files containing secrets.
- Stored API keys are saved in plaintext in `proxy/store.json` for the prototype — rotate keys and migrate to an encrypted store or database for production.

Next steps / recommendations
----------------------------
- Provide Google OAuth credentials and test sign-in flows.
- Migrate the file-backed store to SQLite (recommended) and add session expiry + cookie security.
- Add rate-limiting and request logging to the proxy before public deployment.

If you want, I can update the README files in `frontend/` and `proxy/` now — confirm and I'll proceed.