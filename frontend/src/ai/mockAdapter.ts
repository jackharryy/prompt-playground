import { AiAdapter, AiMessage } from './types'

export const MockAdapter: AiAdapter = {
  id: 'mock',
  name: 'Mock AI',
  sendMessage: async (systemPrompt: string, messages: AiMessage[]) => {
    // Simple echo-style mock reply that demonstrates use of system prompt
    const lastUser = messages.slice().reverse().find((m) => m.role === 'user')
    const userText = lastUser ? lastUser.content : ''
    const reply: AiMessage = {
      id: String(Date.now()),
      role: 'assistant',
      content: `System prompt:\n${systemPrompt}\n\nUser said:\n${userText}\n\n(This is a mock response.)`,
    }
    return [reply]
  },
}
