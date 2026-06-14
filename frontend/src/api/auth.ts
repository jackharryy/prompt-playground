const SESSION_STORAGE_KEY = 'ai-hero-session'

type AuthResponse = { ok?: boolean; error?: string; sessionId?: string; [key: string]: any }

type MeResponse = { authenticated: boolean; email?: string; name?: string }

const getSessionId = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_STORAGE_KEY)
}

const setSessionId = (sessionId: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId)
}

export const clearSessionId = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

const buildHeaders = (json = true) => {
  const headers: Record<string, string> = {}
  const sessionId = getSessionId()
  if (sessionId) headers['x-session-id'] = sessionId
  if (json) headers['Content-Type'] = 'application/json'
  return headers
}

export const getMe = async (): Promise<MeResponse> => {
  try {
    const res = await fetch('/api/me', {
      method: 'GET',
      headers: buildHeaders(false),
    })
    if (!res.ok) return { authenticated: false }
    return res.json()
  } catch {
    return { authenticated: false }
  }
}

const safeFetchJson = async (input: RequestInfo, init: RequestInit): Promise<AuthResponse> => {
  try {
    const res = await fetch(input, init)
    const data = await res.json()
    return data
  } catch {
    return { ok: false, error: 'Network error' }
  }
}

export const loginUser = async (email: string, password: string) => {
  const data = await safeFetchJson('/auth/login', {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, password }),
  })
  if (data.ok && data.sessionId) {
    setSessionId(data.sessionId)
  }
  return data
}

export const registerUser = async (email: string, password: string, name: string) => {
  return safeFetchJson('/auth/register', {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, password, name }),
  })
}

export const verifyEmail = async (email: string, token: string) => {
  return safeFetchJson('/auth/verify', {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ email, token }),
  })
}

export const logout = async () => {
  const data = await safeFetchJson('/auth/logout', {
    method: 'POST',
    headers: buildHeaders(false),
  })
  clearSessionId()
  return data
}

export const saveKey = async (key: string) => {
  return safeFetchJson('/api/key', {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ key }),
  })
}
