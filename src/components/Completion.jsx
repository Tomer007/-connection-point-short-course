import { completion, lessons } from '../data/course.js'

// מסך סיום הקורס.
export default function Completion({ completed, onNavigate, onRestart }) {
  const doneCount = lessons.filter((l) => completed.includes(l.id)).length
  const allDone = doneCount === lessons.length

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
