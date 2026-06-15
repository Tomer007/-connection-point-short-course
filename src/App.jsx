import { useCallback, useEffect, useMemo, useState } from 'react'
import { lessons } from './data/course.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { syncUserData, syncProgress, syncPhaseComplete } from './services/dataSyncService.js'
import Login from './components/Login.jsx'
import Sidebar from './components/Sidebar.jsx'
import Home from './components/Home.jsx'
import Lesson from './components/Lesson.jsx'
import Practice from './components/Practice.jsx'
import Completion from './components/Completion.jsx'
import BottomNav from './components/BottomNav.jsx'

const DEFAULT_PRACTICE = {
  layers: { body: null, emotion: null, thought: null, energy: null },
  signs: { chest: false, breath: false, pulse: false, restless: false },
  heartWriting: '',
  reflections: {},
  journal: [],
}

export default function App() {
  const [auth, setAuth] = useState(() => {
    // In development, skip login for faster testing
    if (import.meta.env.DEV) {
      return { email: 'dev@test.com', code: 'dev' }
    }
    return null
  })

  function handleLogin({ email, code }) {
    setAuth({ email, code })
  }

  function handleLogout() {
    setAuth(null)
  }

  // אם המשתמש לא מחובר, מציגים מסך כניסה.
  if (!auth) {
    return (
      <>
        <a href="#main" className="skip-link">
          דילוג לתוכן
        </a>
        <Login onLogin={handleLogin} />
      </>
    )
  }

  return <CourseApp onLogout={handleLogout} email={auth.email} />
}

function CourseApp({ onLogout, email }) {
  // מצב הניווט. ברירת מחדל: מסך פתיחה.
  const [view, setView] = useState({ name: 'home' })
  const [menuOpen, setMenuOpen] = useState(false)

  // התקדמות ונתוני תרגול נשמרים ב-localStorage בלבד.
  const [completed, setCompleted, resetCompleted] = useLocalStorage('cp_completed', [])
  const [practice, setPractice, resetPractice] = useLocalStorage('cp_practice', DEFAULT_PRACTICE)

  // Sync user data to disk on initial load
  useEffect(() => {
    syncUserData(email, { completed, practice })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // טעינת רשימת המדיה מ-/data/videos.json בעת טעינת האתר.
  const [videos, setVideos] = useState([])
  useEffect(() => {
    let alive = true
    fetch(`${import.meta.env.BASE_URL}data/videos.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (alive && Array.isArray(list)) setVideos(list)
      })
      .catch(() => {
        // אם הטעינה נכשלת, הקורס ממשיך לעבוד עם placeholders.
      })
    return () => {
      alive = false
    }
  }, [])

  // איתור פריט מדיה לפי sectionId (ואופציונלית mediaKey לכרטיסי התרגול היומי).
  const getMedia = useCallback(
    (sectionId, mediaKey = null) => {
      if (mediaKey) {
        return videos.find((v) => v.sectionId === sectionId && v.mediaKey === mediaKey) || null
      }
      return videos.find((v) => v.sectionId === sectionId && !v.mediaKey) || null
    },
    [videos],
  )

  // שמירה בטוחה של נתוני התרגול גם אם נשמר מבנה ישן.
  const safePractice = useMemo(() => ({ ...DEFAULT_PRACTICE, ...practice }), [practice])

  const navigate = useCallback((next) => {
    setView(next)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  function toggleComplete(id) {
    setCompleted((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      // Sync to disk in background
      if (!prev.includes(id)) {
        syncPhaseComplete(email, id)
      }
      syncProgress(email, next, id)
      return next
    })
  }

  function startCourse() {
    // ממשיכים מהשיעור הראשון שעוד לא הושלם, או מהראשון.
    const nextLesson = lessons.find((l) => !completed.includes(l.id)) || lessons[0]
    navigate({ name: 'lesson', id: nextLesson.id })
  }

  function restart() {
    resetCompleted()
    resetPractice()
    navigate({ name: 'home' })
  }

  // חילוץ שם המשתמש מהאימייל
  const userName = email ? email.split('@')[0] : ''

  // מסך הפתיחה הוא מסך מלא, ללא סרגל צד.
  if (view.name === 'home') {
    return (
      <>
        <a href="#main" className="skip-link">
          דילוג לתוכן
        </a>
        <Home onStart={startCourse} hasProgress={completed.length > 0} completed={completed} onLogout={onLogout} />
      </>
    )
  }

  const currentLesson =
    view.name === 'lesson' ? lessons.find((l) => l.id === view.id) : null

  return (
    <>
      <a href="#main" className="skip-link">
        דילוג לתוכן
      </a>

      <div className="topbar">
        <button className="brand" onClick={() => navigate({ name: 'home' })} aria-label="מסך פתיחה">
          <img src="/brand/icon-brown.png" alt="" width="32" height="32" />
          <span className="brand-name">נקודת חיבור</span>
        </button>
        <div className="topbar-actions">
          {userName && <span className="topbar-greeting">שלום {userName} 👋</span>}
          <button className="btn-logout" onClick={onLogout}>
            יציאה
          </button>
          <button
            className="menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="sidebar"
          >
            {menuOpen ? 'סגירה' : 'תפריט'}
          </button>
        </div>
      </div>

      <div className="app-shell">
        <main className="main">
          <div className="view-transition" key={view.name === 'lesson' ? `lesson-${view.id}` : view.name}>
          {currentLesson && (
            <Lesson
              lesson={currentLesson}
              getMedia={getMedia}
              data={safePractice}
              setData={setPractice}
              completed={completed}
              onToggleComplete={toggleComplete}
              onNavigate={navigate}
            />
          )}
          {view.name === 'practice' && (
            <Practice data={safePractice} setData={setPractice} />
          )}
          {view.name === 'completion' && (
            <Completion completed={completed} onNavigate={navigate} onRestart={restart} />
          )}
          </div>

          <footer className="footer">
            <a href="https://annayael.com/" target="_blank" rel="noopener noreferrer" className="footer-brand">
              <img src="/brand/icon-brown.png" alt="" width="24" height="24" />
              <span>annayael</span>
            </a>
            <p>אנה ויעל · מרחבי ריפוי. הקורס אינו מחליף ייעוץ או טיפול אישי.</p>
            <div className="footer-socials">
              <a href="https://open.spotify.com/show/3jiGyoa1aJCxegYlfUWbsq" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34a.749.749 0 01-1.029.261c-2.82-1.724-6.369-2.114-10.55-1.158a.748.748 0 01-.334-1.46c4.572-1.045 8.492-.595 11.652 1.338a.748.748 0 01.261 1.019zm1.473-3.27a.94.94 0 01-1.287.308c-3.225-1.983-8.142-2.557-11.955-1.399a.937.937 0 01-1.167-.623.937.937 0 01.624-1.167c4.358-1.322 9.776-.682 13.477 1.595a.937.937 0 01.308 1.286zm.127-3.403C15.688 8.382 9.375 8.172 5.46 9.344a1.125 1.125 0 11-.652-2.153c4.498-1.346 11.97-1.086 16.681 1.548a1.125 1.125 0 01-1.368 1.788z"/></svg>
              </a>
              <a href="https://www.youtube.com/playlist?list=PL0YKtIIUMNqL1nbGv8owFfZIIflaBnlyA" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://www.instagram.com/anna_and_yael/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
            <nav className="footer-legal">
              <a href="/legal/terms">תנאי שימוש</a>
              <a href="/legal/privacy">פרטיות</a>
              <a href="/legal/accessibility">נגישות</a>
            </nav>
          </footer>
        </main>

        <div
          className={`scrim ${menuOpen ? 'show' : ''}`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
        <Sidebar view={view} onNavigate={navigate} completed={completed} open={menuOpen} />
      </div>

      <BottomNav
        view={view}
        onNavigate={navigate}
        onMenuToggle={() => setMenuOpen((o) => !o)}
        completed={completed}
      />
    </>
  )
}
