import { AiAdapter, AiMessage } from './types'

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions'

function formatMessages(systemPrompt: string, messages: AiMessage[]) {
  const out = []
  out.push({ role: 'system', content: systemPrompt })
  for (const m of messages) {
    out.push({ role: m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : 'user', content: m.content })
  }
  return out
}

export const OpenRouterAdapter: AiAdapter = {
  id: 'openrouter',
  name: 'OpenRouter',
  sendMessage: async (systemPrompt: string, messages: AiMessage[]) => {
    const model = (import.meta.env.VITE_OPENROUTER_MODEL as string) || 'openai/gpt-4o-mini'
    const proxy = import.meta.env.VITE_OPENROUTER_PROXY as string | undefined
    const key = import.meta.env.VITE_OPENROUTER_KEY as string | undefined

    const payload = {
      model,
      messages: formatMessages(systemPrompt, messages),
      temperature: 0.7,
    }

    const fetchUrl = proxy || OPENROUTER_API
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (!proxy) {
      if (!key) throw new Error('No OpenRouter key or proxy configured')
      headers['Authorization'] = `Bearer ${key}`
    }

    const res = await fetch(fetchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`OpenRouter error: ${res.status} ${text}`)
    }

    const data = await res.json()
    // support standard OpenAI chat completions shape
    const choices = data.choices || []
    const out: AiMessage[] = []
    for (const c of choices) {
      const msg = c.message || c
      out.push({ id: String(Date.now()), role: 'assistant', content: msg.content || String(msg) })
    }
    return out
  },
}