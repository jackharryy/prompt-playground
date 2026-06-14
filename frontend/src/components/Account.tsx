import { useEffect, useState } from 'react'
import { getMe, loginUser, registerUser, verifyEmail, logout, saveKey } from '../api/auth'

type AuthState = {
  authenticated: boolean
  email?: string
  name?: string
}

type Mode = 'login' | 'register' | 'verify'

export const Account = () => {
  const [me, setMe] = useState<AuthState | null>(null)
  const [mode, setMode] = useState<Mode>('login')
  const [form, setForm] = useState({ email: '', password: '', confirm: '', name: '', token: '' })
  const [key, setKey] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    getMe()
      .then((data) => {
        if (mounted) setMe(data)
      })
      .catch(() => {
        if (mounted) setMe({ authenticated: false })
      })
    return () => { mounted = false }
  }, [])

  const resetMessages = () => {
    setError('')
    setMessage('')
    setStatus('idle')
  }

  const handleField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()
    if (!form.email || !form.password) {
      setError('Email and password are required.')
      setStatus('error')
      return
    }

    setStatus('loading')
    const result = await loginUser(form.email, form.password)
    if (result.ok) {
      const refreshed = await getMe()
      setMe(refreshed)
      setMessage('Logged in successfully.')
      setStatus('success')
      setForm({ email: '', password: '', confirm: '', name: '', token: '' })
    } else {
      setError(result.error || 'Login failed. Please try again.')
      setStatus('error')
      if (result.error === 'Email not verified') {
        setMode('verify')
      }
    }
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.')
      setStatus('error')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      setStatus('error')
      return
    }

    setStatus('loading')
    const result = await registerUser(form.email, form.password, form.name)
    if (result.ok) {
      setMessage('Account created. Enter the verification token below to finish registration.')
      setStatus('success')
      setMode('verify')
      setForm((prev) => ({ ...prev, token: result.verifyToken || '' }))
    } else {
      setError(result.error || 'Registration failed. Please try again.')
      setStatus('error')
    }
  }

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()
    if (!form.email || !form.token) {
      setError('Email and verification token are required.')
      setStatus('error')
      return
    }

    setStatus('loading')
    const result = await verifyEmail(form.email, form.token)
    if (result.ok) {
      setMessage('Email verified. You can now log in.')
      setStatus('success')
      setMode('login')
      setForm((prev) => ({ ...prev, password: '', confirm: '', token: '' }))
    } else {
      setError(result.error || 'Verification failed. Please try again.')
      setStatus('error')
    }
  }

  const handleLogout = async () => {
    await logout()
    setMe({ authenticated: false })
    setMode('login')
    setForm({ email: '', password: '', confirm: '', name: '', token: '' })
    setStatus('idle')
    setMessage('Logged out.')
  }

  const handleSaveKey = async () => {
    resetMessages()
    if (!key) {
      setError('Enter your OpenRouter key before saving.')
      setStatus('error')
      return
    }
    setStatus('loading')
    const result = await saveKey(key)
    if (result.ok) {
      setMessage('Key saved to your account.')
      setStatus('success')
    } else {
      setError(result.error || 'Error saving key.')
      setStatus('error')
    }
  }

  if (!me) return null

  if (!me.authenticated) {
    return (
      <div className="p-4 rounded-2xl bg-gray-800 border-2 border-gray-700 text-left space-y-4">
        {(message || error) && (
          <div className={`rounded-md px-3 py-2 text-sm ${status === 'error' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
            {error || message}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <h2 className="text-lg font-semibold">Login</h2>
            <input value={form.email} onChange={(e) => handleField('email', e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
            <input type="password" value={form.password} onChange={(e) => handleField('password', e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
            <button type="submit" className="w-full px-4 py-2 rounded-2xl bg-orange-300 text-black">Sign in</button>
            <p className="text-sm text-gray-400">No account? <button type="button" onClick={() => { resetMessages(); setMode('register') }} className="text-orange-300">Create one</button></p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <h2 className="text-lg font-semibold">Register</h2>
            <input value={form.name} onChange={(e) => handleField('name', e.target.value)} placeholder="Name" className="w-full px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
            <input value={form.email} onChange={(e) => handleField('email', e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
            <input type="password" value={form.password} onChange={(e) => handleField('password', e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
            <input type="password" value={form.confirm} onChange={(e) => handleField('confirm', e.target.value)} placeholder="Confirm password" className="w-full px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
            <button type="submit" className="w-full px-4 py-2 rounded-2xl bg-orange-300 text-black">Create account</button>
            <p className="text-sm text-gray-400">Already have one? <button type="button" onClick={() => { resetMessages(); setMode('login') }} className="text-orange-300">Sign in</button></p>
          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-3">
            <h2 className="text-lg font-semibold">Verify your email</h2>
            <input value={form.email} onChange={(e) => handleField('email', e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
            <input value={form.token} onChange={(e) => handleField('token', e.target.value)} placeholder="Verification token" className="w-full px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
            <button type="submit" className="w-full px-4 py-2 rounded-2xl bg-orange-300 text-black">Verify email</button>
            <p className="text-sm text-gray-400">Already verified? <button type="button" onClick={() => { resetMessages(); setMode('login') }} className="text-orange-300">Sign in</button></p>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl bg-gray-800 border-2 border-gray-700 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-300">Signed in as</p>
          <p className="font-semibold">{me.email}</p>
        </div>
        <button onClick={handleLogout} className="px-3 py-2 rounded-2xl bg-gray-700 text-gray-100">Logout</button>
      </div>
      <div className="space-y-3">
        <label className="text-sm text-gray-400">OpenRouter key</label>
        <div className="flex gap-2">
          <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Paste your OpenRouter key" className="flex-1 px-3 py-2 rounded-md bg-gray-900 border-2 border-gray-700" />
          <button onClick={handleSaveKey} className="px-4 py-2 rounded-2xl bg-orange-300 text-black">Save</button>
        </div>
        {message && <p className="text-xs text-green-300">{message}</p>}
        {error && <p className="text-xs text-red-300">{error}</p>}
      </div>
    </div>
  )
}

export default Account
