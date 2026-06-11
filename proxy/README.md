AI Scratch Proxy
=================

Small Node/Express proxy for forwarding OpenRouter chat requests from the browser without exposing your secret key.

Usage
-----

1. Copy `.env.example` to `.env` and set your `OPENROUTER_KEY`.

2. Install dependencies and run:

```bash
cd proxy
npm install
npm start
```

3. In your frontend, set `VITE_OPENROUTER_PROXY` to `http://localhost:8787/openrouter`.

Request format
--------------
The proxy forwards the request body to OpenRouter as-is. Example body:

```json
{
  "model": "gpt-4o-mini",
  "messages": [ {"role":"system","content":"..."}, {"role":"user","content":"..."} ]
}
```

Security
--------
- Keep `OPENROUTER_KEY` on the server only. Do not commit `.env`.
