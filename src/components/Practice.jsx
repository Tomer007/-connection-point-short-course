import { useState } from 'react'

// מסך "התרגול שלי": כתיבה אינטואיטיבית סביב השאלה ללב, עם שמירה מקומית בלבד.
export default function Practice({ data, setData }) {
  const [draft, setDraft] = useState('')
  const [justSaved, setJustSaved] = useState(false)
  const entries = data.journal || []

  function save() {
    const text = draft.trim()
    if (!text) return
    const entry = { id: Date.now(), ts: new Date().toISOString(), text }
    setData((prev) => ({ ...prev, journal: [entry, ...(prev.journal || [])] }))
    setDraft('')
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2500)
  }

  function remove(id) {
    setData((prev) => ({ ...prev, journal: (prev.journal || []).filter((e) => e.id !== id) }))
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString('he-IL', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return (
    <main className="content" id="main">
      <header className="lesson-head">
        <p className="eyebrow">המרחב שלך</p>
        <h1>התרגול שלי</h1>
        <p className="lesson-summary">מקום לכתיבה אינטואיטיבית, מתי שתרצי לעצור ולהקשיב ללב.</p>
      </header>

      <div className="exercise">
        <p className="heart-q">השאלה ללב: מה אתה מרגיש עכשיו?</p>
        <label htmlFor="practice-write" className="slider-name">
          כתיבה אינטואיטיבית, בלי לצנזר ובלי לערוך.
        </label>
        <textarea
          id="practice-write"
          placeholder="פשוט שפכי כאן את מה שעולה."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="save-row">
          <button className="btn btn-primary" onClick={save} disabled={!draft.trim()}>
            שמירה מקומית
          </button>
          {justSaved && <span className="saved-note" role="status">נשמר במכשיר שלך</span>}
        </div>
        <p className="privacy">
          כל מה שתכתבי נשמר רק במכשיר שלך, ואף אחד אחר לא רואה אותו.
        </p>
      </div>

      {entries.length > 0 && (
        <section aria-label="רשומות שמורות">
          <span className="section-label">מה כתבת עד עכשיו</span>
          <ul className="journal-list">
            {entries.map((e) => (
              <li className="journal-entry" key={e.id}>
                <time dateTime={e.ts}>{formatDate(e.ts)}</time>
                <p>{e.text}</p>
                <button className="entry-del" onClick={() => remove(e.id)}>
                  מחיקה
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
