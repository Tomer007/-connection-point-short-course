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
        <Home onStart={startCourse} hasProgress={completed.length > 0} completed={completed} />
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
          {view.name === 'practice' && <Practice data={safePractice} setData={setPractice} />}
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
