import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8787
const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_KEY = process.env.OPENROUTER_KEY

if (!OPENROUTER_KEY) console.warn('Warning: OPENROUTER_KEY not set. The proxy will reject requests without a key.')

app.post('/openrouter', async (req, res) => {
  try {
    if (!OPENROUTER_KEY) return res.status(500).json({ error: 'Server missing OPENROUTER_KEY' })

    const body = req.body || {}

    const response = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const text = await response.text()
    // proxy status and body
    res.status(response.status).type('application/json').send(text)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.get('/', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`AI proxy listening on http://localhost:${PORT}`)
})
