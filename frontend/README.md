AI Scratch frontend
====================

Quick notes for running the `frontend` and the optional OpenRouter proxy.

Frontend scripts (run inside `frontend/`):

- `npm install` — install frontend deps
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build

Proxy scripts (from frontend directory):

- `npm run proxy:dev` — start the local proxy in `../proxy` in dev mode
- `npm run proxy:start` — start the local proxy in production mode
- `npm run dev:all` — convenience command that starts the proxy (dev) in background and then the frontend dev server

Environment variables

- Frontend (in `.env` or your shell):
  - `VITE_OPENROUTER_PROXY` — set to the proxy URL, e.g. `http://localhost:8787/openrouter`
  - `VITE_OPENROUTER_KEY` — (client-side use only) OpenRouter API key if you choose to call OpenRouter directly from the browser (not recommended)
  - `VITE_OPENROUTER_MODEL` — optional default model name used by the OpenRouter adapter

- Proxy (copy `proxy/.env.example` → `proxy/.env`):
  - `OPENROUTER_KEY` — your server-side OpenRouter key (keep this secret)
  - `PORT` — port to run the proxy (default `8787`)

Security notes

- Do NOT commit your secret keys. Keep `proxy/.env` out of git.
- Prefer using the server-side proxy (`proxy/`) so the OpenRouter key is never exposed to clients.

How the AI integration works

- The app includes a decoupled adapter system in `src/ai/`.
- Only `OpenRouterAdapter` is enabled by default.
- Set `VITE_OPENROUTER_PROXY` to point at the proxy to use it safely.

PWA

- The frontend is configured with `vite-plugin-pwa`; manifest is at `public/manifest.json`.

Questions or next steps

- I can add a simple Express logging/rate-limit middleware to the proxy.
- I can add a deploy-ready serverless function example (Vercel/Netlify) if you plan to host the proxy.
