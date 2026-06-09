import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8787
const OPENAI_API = 'https://api.openai.com/v1/chat/completions'
const OPENAI_KEY = process.env.OPENAI_KEY

if (!OPENAI_KEY) console.warn('Warning: OPENAI_KEY not set. The proxy will reject requests without a key.')

app.post('/openai', async (req, res) => {
  try {
    if (!OPENAI_KEY) return res.status(500).json({ error: 'Server missing OPENAI_KEY' })

    const body = req.body || {}

    const response = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
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
