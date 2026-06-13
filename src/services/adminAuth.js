// Admin authentication service - communicates with server-side API
// Credentials are validated server-side only, never exposed to frontend.

const API_BASE = window.location.hostname === 'localhost'
  ? '/api/admin'
  : 'https://connection-point-api.onrender.com/api/admin'

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Login failed')
  }
  return data
}

export async function adminLogout() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error('Logout failed')
  }
  return true
}

export async function verifyAdmin() {
  try {
    const res = await fetch(`${API_BASE}/verify`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
