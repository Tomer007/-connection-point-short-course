import { lessons } from '../data/course.js'
import ProgressBar from './ProgressBar.jsx'

// בדיקה אם שיעור פתוח (שיעור 1 תמיד פתוח, או שהשיעור הקודם הושלם).
function isLessonUnlocked(lessonId, completed) {
  if (lessonId === 1) return true
  return completed.includes(lessonId - 1)
}

// סרגל ניווט עם ששת השיעורים, מד התקדמות, והמסכים הנוספים.
export default function Sidebar({ view, onNavigate, completed, open }) {
  const total = lessons.length
  const doneCount = lessons.filter((l) => completed.includes(l.id)).length

  function go(v) {
    onNavigate(v)
  }

  return (
    <nav className={`sidebar ${open ? 'open' : ''}`} id="sidebar" aria-label="ניווט הקורס">
      <button className="brand" onClick={() => go({ name: 'home' })} aria-label="חזרה למסך הפתיחה">
        <img src="/brand/icon-brown.png" alt="" />
        <span>
          <span className="brand-name">נקודת חיבור</span>
          <br />
          <span className="brand-tag">מפחד לאהבה בארבעה רבדים</span>
        </span>
      </button>

      <ProgressBar done={doneCount} total={total} />

      <ul className="nav">
        {lessons.map((l) => {
          const isDone = completed.includes(l.id)
          const active = view.name === 'lesson' && view.id === l.id
          const unlocked = isLessonUnlocked(l.id, completed)
          return (
            <li key={l.id}>
              <button
                className={`nav-item ${!unlocked ? 'nav-item-locked' : ''}`}
                aria-current={active ? 'page' : undefined}
                aria-disabled={!unlocked}
                onClick={() => unlocked && go({ name: 'lesson', id: l.id })}
                tabIndex={unlocked ? 0 : -1}
              >
                <span className={`nav-num ${isDone ? 'done' : ''}`} aria-hidden="true">
                  {isDone ? '✓' : !unlocked ? '🔒' : l.id}
                </span>
                <span>{l.title}</span>
              </button>
            </li>
          )
        })}

        <li>
          <hr className="nav-divider" />
        </li>
        <li>
          <button
            className="nav-item"
            aria-current={view.name === 'practice' ? 'page' : undefined}
            onClick={() => go({ name: 'practice' })}
          >
            <span className="nav-num" aria-hidden="true">
              ✎
            </span>
            <span>התרגול שלי</span>
          </button>
        </li>
        <li>
          <button
            className="nav-item"
            aria-current={view.name === 'completion' ? 'page' : undefined}
            onClick={() => go({ name: 'completion' })}
          >
            <span className="nav-num" aria-hidden="true">
              ♥
            </span>
            <span>סיום הקורס</span>
          </button>
        </li>
      </ul>

      <p className="nav-meta">השלמת {doneCount} מתוך {total} שיעורים. ההתקדמות נשמרת במכשיר שלך.</p>
    </nav>
  )
}
