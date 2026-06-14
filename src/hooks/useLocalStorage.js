import { useCallback, useEffect, useState } from 'react'

// Data version — increment this to force a reset of stored data for all users.
const DATA_VERSION = 2

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const versionKey = `${key}__v`
      const storedVersion = window.localStorage.getItem(versionKey)

      // If version mismatch, clear old data and use new defaults
      if (storedVersion !== String(DATA_VERSION)) {
        window.localStorage.removeItem(key)
        window.localStorage.setItem(versionKey, String(DATA_VERSION))
        return initialValue
      }

      const raw = window.localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      window.localStorage.setItem(`${key}__v`, String(DATA_VERSION))
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
