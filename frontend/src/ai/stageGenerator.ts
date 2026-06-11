import { AiMessage } from './types'
import { OpenRouterAdapter } from './openrouterAdapter'
import type { CategoryKey, SelectedState } from '../data/story'
import { categories } from '../data/story'

const defaultOptions: Record<CategoryKey, string[]> = categories.reduce((acc, category) => {
  acc[category.key] = category.options
  return acc
}, {} as Record<CategoryKey, string[]>)

const stageFriendlyName: Record<CategoryKey, string> = {
  character: 'hero',
  action: 'action',
  topic: 'place',
  style: 'style',
}

const buildPrompt = (stage: CategoryKey, selected: SelectedState) => {
  switch (stage) {
    case 'character':
      return `You are helping a child aged 5 to 8 build a fun AI hero. Create 4 different hero ideas. Keep each one short, playful, and easy to read, like "Brave astronaut" or "Magic unicorn". Output only a valid JSON array of four strings.`

    case 'action':
      return `The hero is ${selected.character}. Give 4 different fun things that hero could do. Keep each choice short and child-friendly, like "Find a hidden treasure" or "Help a friend". Output only a valid JSON array of four strings.`

    case 'topic':
      return `The hero is ${selected.character} and they will ${selected.action}. Give 4 different child-friendly places where that story could happen. Keep each option short and playful. Output only a valid JSON array of four strings.`

    case 'style':
      return `The hero is ${selected.character}, they ${selected.action}, and the story happens in ${selected.topic}. Give 4 different simple style words or phrases that describe how the hero should feel or look, like "Sparkly" or "Brave and bold". Output only a valid JSON array of four strings.`

    default:
      return ''
  }
}

const parseOptions = (text: string): string[] => {
  const cleaned = text.trim()
  const jsonMatch = cleaned.match(/\[.*\]/s)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean)
      }
    } catch {
      // fall through
    }
  }

  return cleaned
    .split(/[\r\n]+/)
    .map((line) => line.replace(/^\s*[-*\d\.\)]+\s*/, '').trim())
    .filter(Boolean)
}

export const generateStageOptions = async (stage: CategoryKey, selected: SelectedState): Promise<string[]> => {
  const prompt = buildPrompt(stage, selected)
  const systemPrompt = `You are a friendly helper that creates simple and playful choices for children aged 5 to 8.`
  const messages: AiMessage[] = [{ role: 'user', content: prompt }]

  const replies = await OpenRouterAdapter.sendMessage(systemPrompt, messages)
  const text = replies[0]?.content || ''
  const options = parseOptions(text).slice(0, 4)

  if (options.length >= 4) {
    return options
  }

  return defaultOptions[stage]
}
