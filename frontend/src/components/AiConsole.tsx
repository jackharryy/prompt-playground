import { useMemo, useState } from 'react'
import { adapters, defaultAdapterId } from '../ai'
import type { AiMessage } from '../ai/types'

type Props = {
  systemPrompt: string
}

export const AiConsole = ({ systemPrompt }: Props) => {
  const adapterList = useMemo(() => Object.values(adapters), [])
  const [adapterId, setAdapterId] = useState(defaultAdapterId)
  const [messages, setMessages] = useState<AiMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: AiMessage = { id: String(Date.now()), role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const adapter = adapters[adapterId]
      const replies = await adapter.sendMessage(systemPrompt, newMessages)
      setMessages((prev) => [...prev, ...replies])
    } catch (e) {
      setMessages((prev) => [...prev, { id: String(Date.now()), role: 'assistant', content: 'Error connecting to adapter.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border-2 border-gray-700 rounded-3xl p-5 md:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-yellow-300 tracking-widest">AI Console</p>
        <select
          value={adapterId}
          onChange={(e) => setAdapterId(e.target.value)}
          className="bg-gray-800 text-white border-2 border-gray-700 rounded-md px-2 py-1"
        >
          {adapterList.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 max-h-64 overflow-auto space-y-3">
        {messages.length === 0 && (
          <div className="text-gray-400">No messages yet. Type a prompt and send.</div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={m.role === 'user' ? 'inline-block bg-orange-300 text-black px-3 py-2 rounded-xl' : 'inline-block bg-gray-800 text-white px-3 py-2 rounded-xl'}>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI..."
          className="flex-1 px-4 py-2 rounded-2xl bg-gray-800 text-white border-2 border-gray-700"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 rounded-2xl bg-orange-300 text-black border-2 border-orange-300 disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default AiConsole
