import { useState } from 'react'
import { completion, lessons } from '../data/course.js'

const SHARE_TEXT = 'סיימתי את הקורס ״מפחד לאהבה בארבעה רבדים״ של נקודת חיבור! 🌿 https://annayael.com/'

// מסך סיום הקורס עם תעודת סיום, כפתור שיתוף וכפתור WhatsApp.
export default function Completion({ completed, onNavigate, onRestart }) {
  const [copied, setCopied] = useState(false)
  const doneCount = lessons.filter((l) => completed.includes(l.id)).length
  const allDone = doneCount === lessons.length

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text: SHARE_TEXT })
      } catch {
        // משתמש ביטל את השיתוף - לא צריך לעשות כלום
      }
    } else {
      try {
        await navigator.clipboard.writeText(SHARE_TEXT)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
        // fallback: prompt
        window.prompt('העתיקי את הטקסט:', SHARE_TEXT)
      }
    }
  }

  function handleWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="content completion" id="main">
      <img className="seal" src="/brand/icon-brown.png" alt="סמל נקודת חיבור" />
      <h1>{completion.title}</h1>
      <p className="msg">{completion.text}</p>

      {!allDone && (
        <p className="lesson-summary">
          השלמת {doneCount} מתוך {lessons.length} שיעורים. אפשר לחזור ולסמן את מה שנותר בכל עת.
        </p>
      )}

      {/* תעודת סיום */}
      {allDone && (
        <section className="certificate" aria-label="תעודת סיום">
          <img className="certificate-logo" src="/brand/icon-brown.png" alt="סמל נקודת חיבור" />
          <p className="certificate-brand">נקודת חיבור</p>
          <h2 className="certificate-title">סיימת את הקורס</h2>
          <p className="certificate-course">מפחד לאהבה בארבעה רבדים</p>
          <div className="certificate-divider" aria-hidden="true" />
          <p className="certificate-congrats">כל הכבוד! השלמת את כל ששת השיעורים</p>

          <div className="certificate-actions">
            <button className="btn btn-primary" onClick={handleShare}>
              {copied ? '✓ הועתק!' : '🔗 שיתוף'}
            </button>
            <button className="btn btn-whatsapp" onClick={handleWhatsApp}>
              💬 שיתוף בוואטסאפ
            </button>
          </div>
        </section>
      )}

      <div className="save-row" style={{ justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => onNavigate({ name: 'practice' })}>
          למרחב התרגול שלי
        </button>
        <button className="btn btn-ghost" onClick={() => onNavigate({ name: 'lesson', id: 1 })}>
          חזרה לשיעורים
        </button>
      </div>

      <p className="home-meta" style={{ marginTop: 28 }}>
        רוצה להתחיל מסע חדש?{' '}
        <button className="entry-del" onClick={onRestart}>
          איפוס ההתקדמות והתרגולים
        </button>
      </p>
    </main>
  )
}
