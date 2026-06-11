AI Scratch Proxy
=================

The proxy is a small Express server that forwards OpenRouter requests and provides optional Google OAuth for per-user API key storage.

Quick start
-----------
1. Copy the example env and edit as needed:

```bash
cp .env.example .env
# edit .env and add values
```

2. Install dependencies and run:

```bash
cd proxy
npm install
npm start
```

3. Point the frontend to the proxy by setting `VITE_OPENROUTER_PROXY` to the proxy base URL (default):

```
http://localhost:8787/openrouter
```

Environment variables
---------------------
See `.env.example` for full details. Key variables:

- `PORT` — port to run the proxy (default `8787`)
- `OPENROUTER_KEY` — optional global OpenRouter key stored server-side (keep secret)
- `GOOGLE_CLIENT_ID` — Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret (optional)
- `OAUTH_REDIRECT` — OAuth redirect URL (default `http://localhost:8787/auth/google/callback`)

Auth and per-user keys
----------------------
- When Google OAuth is configured, users can sign in from the frontend. The server creates a session cookie (`sessionId`) and records the user in `proxy/store.json`.
- Users may save a personal OpenRouter key via the Account UI; the key is stored in `proxy/store.json` under the user's entry.

Store file
----------
- The file `proxy/store.json` is created automatically when the first user signs in or when a key is saved.
- For development you can create it manually:

```bash
echo '{"users":{},"sessions":{}}' > proxy/store.json
```

Request proxying
----------------
- The proxy forwards the incoming JSON body to OpenRouter, using the per-user key if present, otherwise falling back to `OPENROUTER_KEY` from `.env`.
- Example request body forwarded to OpenRouter:

```json
{
  "model": "gpt-4o-mini",
  "messages": [ {"role":"system","content":"..."}, {"role":"user","content":"..."} ]
}
```

Security & production notes
---------------------------
- This is a prototype: stored API keys are kept in plaintext in `proxy/store.json`. For production, migrate to a secure DB and encrypt secrets at rest.
- Add secure cookie flags, session expiry, CSRF protections, and rate-limiting before public deployment.

Troubleshooting
---------------
- If the proxy fails to start, ensure dependencies are installed (`npm install`) and that Node.js is a supported version.
- If OAuth doesn't complete, verify `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and that `OAUTH_REDIRECT` matches the Google Console redirect URI.
