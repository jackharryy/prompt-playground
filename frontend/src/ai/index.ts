import { AiAdapter } from './types'
import { OpenRouterAdapter } from './openrouterAdapter'

export const adapters: Record<string, AiAdapter> = {
  [OpenRouterAdapter.id]: OpenRouterAdapter,
}

export const defaultAdapterId = OpenRouterAdapter.id
