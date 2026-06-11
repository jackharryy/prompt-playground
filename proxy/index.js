import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import crypto from 'crypto'
import querystring from 'querystring'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8787
const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions'
const GLOBAL_OPENROUTER_KEY = process.env.OPENROUTER_KEY

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const OAUTH_REDIRECT = process.env.OAUTH_REDIRECT || `http://localhost:${PORT}/auth/google/callback`

if (!GLOBAL_OPENROUTER_KEY) console.warn('Note: no GLOBAL OPENROUTER_KEY set. Users can save per-account keys after SSO.')
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) console.warn('Warning: Google OAuth client not configured. SSO will not work until you set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in proxy/.env')

// Simple file-backed store for users and sessions (prototype)
const STORE_PATH = path.join(process.cwd(), 'proxy', 'store.json')

const defaultStore = { users: {}, sessions: {} }

const loadStore = () => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('Failed to load store:', err)
  }
  return JSON.parse(JSON.stringify(defaultStore))
}

const saveStore = (store) => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8')
  } catch (err) {
    console.warn('Failed to save store:', err)
  }
}

const store = loadStore()

const users = store.users
const sessions = store.sessions

const getSessionEmail = (req) => {
  const raw = req.headers.cookie || ''
  const match = raw.match(/sessionId=([^;]+)/)
  if (!match) return null
  const id = match[1]
  return sessions[id]
}

app.post('/openrouter', async (req, res) => {
  try {
    const body = req.body || {}

    // prefer global key, else per-user key
    let key = GLOBAL_OPENROUTER_KEY
    if (!key) {
      const email = getSessionEmail(req)
      if (email && users[email] && users[email].key) key = users[email].key
    }

    if (!key) return res.status(403).json({ error: 'No OpenRouter key configured on server or user account' })

    const response = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const text = await response.text()
    res.status(response.status).type('application/json').send(text)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// Google OAuth login start
app.get('/auth/google', (_req, res) => {
  if (!GOOGLE_CLIENT_ID) return res.status(500).send('Google OAuth not configured')
  const state = crypto.randomBytes(8).toString('hex')
  const params = {
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  }
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify(params)}`
  res.redirect(url)
})

// OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code
    if (!code) return res.status(400).send('Missing code')

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: OAUTH_REDIRECT,
        grant_type: 'authorization_code',
      }),
    })
    const tokenJson = await tokenRes.json()
    const accessToken = tokenJson.access_token
    if (!accessToken) return res.status(500).send('Failed to get access token')

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const userJson = await userRes.json()
    const email = userJson.email
    const name = userJson.name || email
    if (!email) return res.status(500).send('Failed to get user email')

    // create user and session
    if (!users[email]) {
      users[email] = { email, name, key: null }
      store.users = users
      saveStore(store)
    }
    const sessionId = crypto.randomBytes(16).toString('hex')
    sessions[sessionId] = email
    store.sessions = sessions
    saveStore(store)
    // set cookie
    res.cookie('sessionId', sessionId, { httpOnly: true, sameSite: 'lax' })
    res.redirect('/')
  } catch (err) {
    console.error(err)
    res.status(500).send('OAuth error')
  }
})

// API to inspect session
app.get('/api/me', (req, res) => {
  const email = getSessionEmail(req)
  if (!email || !users[email]) return res.json({ authenticated: false })
  const { name } = users[email]
  res.json({ authenticated: true, email, name })
})

// Save per-user OpenRouter key (server-only)
app.post('/api/key', (req, res) => {
  const email = getSessionEmail(req)
  if (!email || !users[email]) return res.status(401).json({ error: 'Not authenticated' })
  const { key } = req.body || {}
  if (!key) return res.status(400).json({ error: 'Missing key' })
  users[email].key = String(key).trim()
  store.users = users
  saveStore(store)
  res.json({ ok: true })
})

app.get('/', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`AI proxy listening on http://localhost:${PORT}`)
})
