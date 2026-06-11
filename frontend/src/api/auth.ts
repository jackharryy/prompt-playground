export const getMe = async () => {
  const res = await fetch('/api/me', { credentials: 'include' })
  return res.json()
}

export const saveKey = async (key: string) => {
  const res = await fetch('/api/key', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  })
  return res.json()
}
