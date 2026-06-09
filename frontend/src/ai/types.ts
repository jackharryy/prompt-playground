export type AiRole = 'system' | 'user' | 'assistant'

export type AiMessage = {
  id?: string
  role: AiRole
  content: string
}

export interface AiAdapter {
  id: string
  name: string
  sendMessage: (systemPrompt: string, messages: AiMessage[]) => Promise<AiMessage[]>
}
