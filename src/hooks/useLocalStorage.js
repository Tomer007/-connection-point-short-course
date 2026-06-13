import { useCallback, useEffect, useState } from 'react'

// שמירת מצב ב-localStorage בלבד. אין backend, הכל נשאר במכשיר של הלומדת.
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
      // אם האחסון חסום (למשל גלישה פרטית) פשוט ממשיכים בלי לשבור את החוויה.
    }
  }, [key, value])

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // מתעלמים בשקט
    }
    setValue(initialValue)
  }, [key, initialValue])

  return [value, setValue, reset]
}
