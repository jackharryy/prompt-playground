import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import crypto from 'crypto'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'

const rootEnvPath = path.join(process.cwd(), 'proxy', '.env')
const localEnvPath = path.join(process.cwd(), '.env')
dotenv.config({ path: fs.existsSync(rootEnvPath) ? rootEnvPath : localEnvPath })

const app = express()
app.use(cors({ origin: true, credentials: true, allowedHeaders: ['Content-Type', 'X-Session-Id'] }))
app.use(express.json())

const PORT = process.env.PORT || 8787
const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions'
const GLOBAL_OPENROUTER_KEY = process.env.OPENROUTER_KEY
const USERS_FILE = path.join(process.cwd(), 'proxy', 'users.txt')
const SESSIONS_FILE = path.join(process.cwd(), 'proxy', 'sessions.json')

if (!GLOBAL_OPENROUTER_KEY) console.warn('Note: no GLOBAL OPENROUTER_KEY set. Users can save per-account keys after login.')

const loadUsers = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) return {}
    const raw = fs.readFileSync(USERS_FILE, 'utf8').trim()
    if (!raw) return {}
    return raw.split(/\r?\n/).reduce((acc, line) => {
      try {
        const user = JSON.parse(line)
        if (user && user.email) acc[user.email] = user
      } catch (err) {
        console.warn('Failed to parse user line:', err)
      }
      return acc
    }, {})
  } catch (err) {
    console.warn('Failed to load users:', err)
    return {}
  }
}

const saveUsers = (users) => {
  try {
    const data = Object.values(users)
      .map((user) => JSON.stringify(user))
      .join('\n')
    fs.writeFileSync(USERS_FILE, data + '\n', 'utf8')
  } catch (err) {
    console.warn('Failed to save users:', err)
  }
}

const loadSessions = () => {
  try {
    if (!fs.existsSync(SESSIONS_FILE)) return {}
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf8')
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.warn('Failed to load sessions:', err)
    return {}
  }
}

const saveSessions = (sessions) => {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8')
  } catch (err) {
    console.warn('Failed to save sessions:', err)
  }
}

const users = loadUsers()
const sessions = loadSessions()

const getSessionEmail = (req) => {
  const headerToken = req.headers['x-session-id']
  if (typeof headerToken === 'string' && headerToken.trim()) {
    return sessions[headerToken.trim()]
  }
  const raw = req.headers.cookie || ''
  const match = raw.match(/sessionId=([^;]+)/)
  if (!match) return null
  const id = match[1]
  return sessions[id]
}

const getUserFromRequest = (req) => {
  const email = getSessionEmail(req)
  return email && users[email] ? users[email] : null
}

const createSession = (email) => {
  const sessionId = crypto.randomBytes(16).toString('hex')
  sessions[sessionId] = email
  saveSessions(sessions)
  return sessionId
}

app.post('/openrouter', async (req, res) => {
  try {
    const body = req.body || {}

    let key = GLOBAL_OPENROUTER_KEY
    if (!key) {
      const user = getUserFromRequest(req)
      if (user && user.key) key = user.key
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

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

    const normalizedEmail = String(email).trim().toLowerCase()
    if (users[normalizedEmail]) return res.status(400).json({ error: 'User already exists' })

    const passwordHash = await bcrypt.hash(password, 10)
    const verifyToken = crypto.randomBytes(16).toString('hex')
    users[normalizedEmail] = {
      email: normalizedEmail,
      name: name ? String(name).trim() : normalizedEmail,
      passwordHash,
      verified: false,
      verificationToken: verifyToken,
      key: null,
    }
    saveUsers(users)

    res.json({ ok: true, message: 'User created. Verify email to continue.', verifyToken })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.post('/auth/verify', (req, res) => {
  try {
    const { email, token } = req.body || {}
    if (!email || !token) return res.status(400).json({ error: 'Email and token are required' })

    const normalizedEmail = String(email).trim().toLowerCase()
    const user = users[normalizedEmail]
    if (!user) return res.status(400).json({ error: 'User not found' })
    if (user.verified) return res.json({ ok: true, message: 'Email already verified' })
    if (user.verificationToken !== token) return res.status(400).json({ error: 'Invalid verification token' })

    user.verified = true
    user.verificationToken = null
    saveUsers(users)
    res.json({ ok: true, message: 'Email verified successfully' })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.get('/auth/verify', (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase()
  const token = String(req.query.token || '').trim()
  if (!email || !token) return res.status(400).json({ error: 'Missing email or token' })
  const user = users[email]
  if (!user) return res.status(400).json({ error: 'User not found' })
  if (user.verified) return res.json({ ok: true, message: 'Email already verified' })
  if (user.verificationToken !== token) return res.status(400).json({ error: 'Invalid verification token' })
  user.verified = true
  user.verificationToken = null
  saveUsers(users)
  res.json({ ok: true, message: 'Email verified successfully' })
})

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

    const normalizedEmail = String(email).trim().toLowerCase()
    const user = users[normalizedEmail]
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })
    if (!user.verified) return res.status(403).json({ error: 'Email not verified' })

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' })

    const sessionId = createSession(user.email)
    res.json({ ok: true, sessionId, email: user.email, name: user.name })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.post('/auth/logout', (req, res) => {
  const headerToken = req.headers['x-session-id']
  if (typeof headerToken === 'string' && headerToken.trim() && sessions[headerToken.trim()]) {
    delete sessions[headerToken.trim()]
    saveSessions(sessions)
  }
  res.json({ ok: true })
})

app.get('/api/me', (req, res) => {
  const user = getUserFromRequest(req)
  if (!user) return res.json({ authenticated: false })
  res.json({ authenticated: true, email: user.email, name: user.name })
})

app.post('/api/key', (req, res) => {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Not authenticated' })
  const { key } = req.body || {}
  if (!key) return res.status(400).json({ error: 'Missing key' })
  user.key = String(key).trim()
  saveUsers(users)
  res.json({ ok: true })
})

app.get('/', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`AI proxy listening on http://localhost:${PORT}`)
})
