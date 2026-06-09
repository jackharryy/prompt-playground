AI Scratch Proxy
=================

Small Node/Express proxy for forwarding OpenAI ChatCompletions requests from the browser without exposing your secret key.

Usage
-----

1. Copy `.env.example` to `.env` and set your `OPENAI_KEY`.

2. Install dependencies and run:

```bash
cd proxy
npm install
npm start
```

3. In your frontend, set `VITE_OPENAI_PROXY` to `http://localhost:8787/openai`.

Request format
--------------
The proxy forwards the request body to OpenAI as-is. Example body:

```json
{
  "model": "gpt-4o-mini",
  "messages": [ {"role":"system","content":"..."}, {"role":"user","content":"..."} ]
}
```

Security
--------
- Keep `OPENAI_KEY` on the server only. Do not commit `.env`.
