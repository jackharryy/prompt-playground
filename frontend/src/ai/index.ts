import { AiAdapter } from './types'
import { MockAdapter } from './mockAdapter'
import { OpenRouterAdapter } from './openrouterAdapter';

export const adapters: Record<string, AiAdapter> = {
  [MockAdapter.id]: MockAdapter,
  [OpenRouterAdapter.id]: OpenRouterAdapter,
}

export const defaultAdapterId = MockAdapter.id
