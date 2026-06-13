// Data sync service — sends user data from localStorage to the server for disk persistence.
// This runs in the background and does not block the user experience.

const API_BASE = window.location.hostname === 'localhost'
  ? '/api/users'
  : 'https://connection-point-api.onrender.com/api/users'

// Sync user profile and current state to disk
export async function syncUserData(email, { completed, practice } = {}) {
  try {
    const userId = emailToId(email)
    const res = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        email,
        name: email.split('@')[0],
        completed: completed || [],
        practice: practice || null,
        source: 'web',
      }),
    })
    if (!res.ok) {
      console.warn('Sync failed:', res.status)
      return null
    }
    return await res.json()
  } catch (err) {
    // Sync failures should not break the user experience
    console.warn('Data sync error:', err.message)
    return null
  }
}

// Report progress change
export async function syncProgress(email, completed, currentPhase) {
  try {
    const userId = emailToId(email)
    const res = await fetch(`${API_BASE}/${userId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed, currentPhase }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Report phase completion
export async function syncPhaseComplete(email, phaseId) {
  try {
    const userId = emailToId(email)
    const res = await fetch(`${API_BASE}/${userId}/phase-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phaseId }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Report exercise completion
export async function syncExerciseComplete(email, exerciseId, answer = null) {
  try {
    const userId = emailToId(email)
    const res = await fetch(`${API_BASE}/${userId}/exercise-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, answer }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Save an answer
export async function syncAnswer(email, key, value) {
  try {
    const userId = emailToId(email)
    const res = await fetch(`${API_BASE}/${userId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Save user content
export async function syncContent(email, contentData, metadata, rawText) {
  try {
    const userId = emailToId(email)
    const res = await fetch(`${API_BASE}/${userId}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentData, metadata, rawText }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Convert email to a safe userId (matches the pattern in userStorage.js)
function emailToId(email) {
  return email.toLowerCase().replace(/[^a-z0-9]/g, '_')
}
