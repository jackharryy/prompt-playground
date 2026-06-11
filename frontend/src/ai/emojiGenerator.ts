import { AiMessage } from './types'
import { OpenRouterAdapter } from './openrouterAdapter'

const buildPrompt = (options: string[]) => {
  return `You are a helper that chooses short, child-friendly emoji symbols to match a list of simple option phrases for kids aged 5 to 8.
Return a JSON array of emoji strings that correspond 1:1 to the input list.

Examples:
["Brave astronaut", "Magic unicorn"] -> ["🚀", "🦄"]

Now match these options exactly as emojis: ${JSON.stringify(options)}\nOutput only a JSON array.`
}

const parseEmojis = (text: string): string[] => {
  const cleaned = text.trim()
  const jsonMatch = cleaned.match(/\[.*\]/s)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) return parsed.map((i) => String(i).trim())
    } catch {}
  }

  // fallback: extract emoji-like chars per line
  return cleaned
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l[0])
}

export const generateEmojisForOptions = async (options: string[]): Promise<string[]> => {
  if (!options || options.length === 0) return []
  const prompt = buildPrompt(options)
  const systemPrompt = `You are a playful emoji chooser for kids ages 5-8. Pick emoji that match each phrase.`
  const messages: AiMessage[] = [{ role: 'user', content: prompt }]

  try {
    const replies = await OpenRouterAdapter.sendMessage(systemPrompt, messages)
    const text = replies[0]?.content || ''
    const emojis = parseEmojis(text).slice(0, options.length)
    if (emojis.length === options.length) return emojis
  } catch (err) {
    // ignore and fallback
  }

  // sensible defaults: return simple bullets when we can't generate
  return options.map(() => '⭐')
}
