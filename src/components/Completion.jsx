import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { completion, lessons } from '../data/course.js'

const SHARE_TEXT = 'סיימתי את הקורס ״מפחד לאהבה בארבעה רבדים״ של נקודת חיבור! https://annayael.com/'

export default function Completion({ completed, onNavigate, onRestart }) {
  const [copied, setCopied] = useState(false)
  const doneCount = lessons.filter((l) => completed.includes(l.id)).length
  const allDone = doneCount === lessons.length

  // Confetti burst on mount
  useEffect(() => {
    if (!allDone) return
    const duration = 2500
    const end = Date.now() + duration

    const colors = ['#5b3a5e', '#a34d62', '#7e9b8a', '#f4e8cf', '#ffffff']

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }

    frame()
  }, [allDone])

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ text: SHARE_TEXT })
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(SHARE_TEXT)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
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
            <button className="btn btn-whatsapp" onClick={handleWhatsApp}>
              💬 שיתוף בוואטסאפ
            </button>
          </div>

          {/* עקבו אחרינו — בתוך התעודה */}
          <div className="certificate-divider" aria-hidden="true" />
          <h3 className="certificate-follow-title">המסע ממשיך — הצטרפו אלינו</h3>
          <div className="social-links">
            <a
              href="https://open.spotify.com/show/3jiGyoa1aJCxegYlfUWbsq?si=845f66d9ef7a47d0"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link spotify"
            >
              <svg className="social-svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34a.749.749 0 01-1.029.261c-2.82-1.724-6.369-2.114-10.55-1.158a.748.748 0 01-.334-1.46c4.572-1.045 8.492-.595 11.652 1.338a.748.748 0 01.261 1.019zm1.473-3.27a.94.94 0 01-1.287.308c-3.225-1.983-8.142-2.557-11.955-1.399a.937.937 0 01-1.167-.623.937.937 0 01.624-1.167c4.358-1.322 9.776-.682 13.477 1.595a.937.937 0 01.308 1.286zm.127-3.403C15.688 8.382 9.375 8.172 5.46 9.344a1.125 1.125 0 11-.652-2.153c4.498-1.346 11.97-1.086 16.681 1.548a1.125 1.125 0 01-1.368 1.788z"/></svg>
              <div className="social-text">
                <span className="social-title">הפודקסט שלנו</span>
                <span className="social-sub">האזנה ב-Spotify →</span>
              </div>
            </a>
            <a
              href="https://www.youtube.com/playlist?list=PL0YKtIIUMNqL1nbGv8owFfZIIflaBnlyA"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link youtube"
            >
              <svg className="social-svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <div className="social-text">
                <span className="social-title">סרטונים ותרגולים</span>
                <span className="social-sub">צפייה ב-YouTube →</span>
              </div>
            </a>
            <a
              href="https://www.instagram.com/anna_and_yael/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link instagram"
            >
              <svg className="social-svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <div className="social-text">
                <span className="social-title">anna_and_yael</span>
                <span className="social-sub">עקבו באינסטגרם →</span>
              </div>
            </a>
          </div>
        </section>
      )}

      {/* 528Hz — מתנה מאנה ויעל */}
      {allDone && (
        <section className="completion-gift" aria-label="מתנת סיום">
          <div className="gift-card">
            <p className="gift-from">מתנה מאנה ויעל 🎁</p>
            <div className="gift-visual">✨🎶✨</div>
            <h3>תדר 528Hz — תדר האהבה</h3>
            <p>המשיכי לתרגל עם מוזיקה בתדר 528Hz, התדר של ריפוי, אהבה והתחדשות.</p>
            <a
              href="https://open.spotify.com/album/3M8ujVP1QVn6DT3fORDfbi?si=HOlvu6_IRumyE-1Q0w8Shg"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary gift-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{verticalAlign: 'middle', marginInlineEnd: '6px'}}><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              האזנה ב-Spotify
            </a>
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
