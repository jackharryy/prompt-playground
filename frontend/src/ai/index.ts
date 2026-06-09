import { AiAdapter } from './types'
import { MockAdapter } from './mockAdapter'
import { OpenAiAdapter } from './openaiAdapter'

export const adapters: Record<string, AiAdapter> = {
  [MockAdapter.id]: MockAdapter,
  [OpenAiAdapter.id]: OpenAiAdapter,
}

export const defaultAdapterId = MockAdapter.id
