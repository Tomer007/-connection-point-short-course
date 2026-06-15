import { useState } from 'react'

// Info tooltip explaining where user data goes and that privacy is maintained.
export default function PrivacyNote() {
  const [open, setOpen] = useState(false)

  return (
    <div className="privacy-note">
      <button
        type="button"
        className="privacy-note-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="מידע על שמירת הנתונים"
      >
        <svg className="privacy-note-icon" viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
          <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
        </svg>
        <span>איך הנתונים שלי נשמרים?</span>
      </button>
      {open && (
        <div className="privacy-note-content" role="tooltip">
          <p><strong>הפרטיות שלך חשובה לנו.</strong></p>
          <p>מה שאת/ה כותב/ת כאן נשמר באופן מאובטח ולא משותף עם אף גורם חיצוני. התכנים שלך גלויים רק לך ולצוות נקודת חיבור למטרת ליווי אישי בלבד.</p>
          <p>ניתן למחוק את הנתונים בכל עת. לפרטים נוספים — <a href="/legal/privacy">מדיניות הפרטיות</a>.</p>
        </div>
      )}
    </div>
  )
}
