import { lessons } from '../data/course.js'

// סרגל ניווט תחתון למובייל עם 4 כפתורים: בית, שיעור נוכחי, תרגול, תפריט.
export default function BottomNav({ view, onNavigate, onMenuToggle, completed }) {
  // מחשב את השיעור הנוכחי או הבא שלא הושלם
  const currentLessonId =
    view.name === 'lesson'
      ? view.id
      : (lessons.find((l) => !completed.includes(l.id)) || lessons[0]).id

  return (
    <nav className="bottom-nav" aria-label="ניווט מהיר">
      <button
        className={`bottom-nav-btn ${view.name === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate({ name: 'home' })}
        aria-label="מסך הבית"
      >
        <span className="bottom-nav-icon" aria-hidden="true">🏠</span>
        <span className="bottom-nav-label">בית</span>
      </button>

      <button
        className={`bottom-nav-btn ${view.name === 'lesson' ? 'active' : ''}`}
        onClick={() => onNavigate({ name: 'lesson', id: currentLessonId })}
        aria-label={`שיעור ${currentLessonId}`}
      >
        <span className="bottom-nav-icon" aria-hidden="true">📖</span>
        <span className="bottom-nav-label">שיעור {currentLessonId}</span>
      </button>

      <button
        className={`bottom-nav-btn ${view.name === 'practice' ? 'active' : ''}`}
        onClick={() => onNavigate({ name: 'practice' })}
        aria-label="התרגול שלי"
      >
        <span className="bottom-nav-icon" aria-hidden="true">✎</span>
        <span className="bottom-nav-label">תרגול</span>
      </button>

      <button
        className="bottom-nav-btn"
        onClick={onMenuToggle}
        aria-label="תפריט"
      >
        <span className="bottom-nav-icon" aria-hidden="true">☰</span>
        <span className="bottom-nav-label">תפריט</span>
      </button>
    </nav>
  )
}
