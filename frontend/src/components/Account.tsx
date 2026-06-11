import { useEffect, useState } from 'react'
import { getMe, saveKey } from '../api/auth'

export const Account = () => {
  const [me, setMe] = useState<{ authenticated: boolean; email?: string; name?: string } | null>(null)
  const [key, setKey] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    let mounted = true
    getMe().then((d) => { if (mounted) setMe(d) })
    return () => { mounted = false }
  }, [])

  if (!me) return null

  if (!me.authenticated) {
    return (
      <div className="p-4 rounded-2xl bg-gray-800 border-2 border-gray-700 text-center">
        <p className="mb-2">Please sign in to save your AI Hero key.</p>
        <a href="/auth/google" className="px-4 py-2 rounded-2xl bg-orange-300 text-black">Sign in with Google</a>
      </div>
    )
  }

  const handleSave = async () => {
    setStatus('saving')
    const res = await saveKey(key)
    if (res && res.ok) setStatus('saved')
    else setStatus('error')
  }

  return (
    <div className="p-4 rounded-2xl bg-gray-800 border-2 border-gray-700">
      <p className="text-sm text-gray-300">Signed in as <strong>{me.email}</strong></p>
      <div className="mt-3 flex gap-2">
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Paste your OpenRouter key" className="flex-1 px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
        <button onClick={handleSave} className="px-3 py-2 rounded-md bg-orange-300 text-black">Save</button>
      </div>
      {status === 'saved' && <p className="text-xs text-green-300 mt-2">Key saved to your account.</p>}
      {status === 'error' && <p className="text-xs text-red-300 mt-2">Error saving key.</p>}
    </div>
  )
}

export default Account
