import { useCallback, useState } from 'react'

type TtsState = 'ready' | 'speaking'

export const useSpeech = () => {
  const [ttsState, setTtsState] = useState<TtsState>('ready')

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 1.1

    setTtsState('speaking')
    utterance.onend = () => setTtsState('ready')

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [])

  return {
    ttsState,
    speak,
  }
}
