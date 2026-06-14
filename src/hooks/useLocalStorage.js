import { useCallback, useEffect, useState } from 'react'

// Data version — increment this to force a reset of stored data for all users.
const DATA_VERSION = 2
const VERSION_KEY = 'cp_data_version'

// One-time global version check on load
;(function checkVersion() {
  try {
    const stored = window.localStorage.getItem(VERSION_KEY)
    if (stored !== String(DATA_VERSION)) {
      // Clear all course-related keys
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && (k.startsWith('cp_') || k.includes('__v'))) {
          keysToRemove.push(k)
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k))
      window.localStorage.setItem(VERSION_KEY, String(DATA_VERSION))
    }
  } catch { /* ignore */ }
})()

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage blocked (private browsing) — continue without breaking UX
    }
  }, [key, value])

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch { /* ignore */ }
    setValue(initialValue)
  }, [key, initialValue])

  return [value, setValue, reset]
}
