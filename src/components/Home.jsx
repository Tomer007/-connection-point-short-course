import { courseMeta, lessons } from '../data/course.js'

const team = [
  {
    name: 'אנה בן יהודה',
    photo: '/team/anna.jpg',
    bio: 'מטפלת רגשית בעלת תואר שני, מייסדת ומטפלת בגישת ״נקודת-חיבור״ לחיבור בין רגש, גוף, תודעה ואנרגיה ולבריאת מציאות בחיי היום יום.',
  },
  {
    name: 'יעל רפפורט',
    photo: '/team/yael.jpg',
    bio: 'פיזיותרפיסטית מומחית לחיבור גוף-רגש-נשמה, מייסדת ומטפלת בגישת ״נקודת חיבור״ לריפוי ושחרור מכאבים ודפוסים כרוניים, פיזיים ונפשיים.',
  },
]

// עיגול התקדמות SVG
function ProgressRing({ completed }) {
  const total = lessons.length
  const done = completed.length
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = done / total
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="progress-ring" aria-label={`השלמת ${done} מתוך ${total} שיעורים`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--plum)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-ring-count">{done}/{total}</span>
        <span className="progress-ring-label">שיעורים</span>
      </div>
    </div>
  )
}

// מסך פתיחה: שם הקורס, תיאור קצר, צוות וכפתור התחלה.
export default function Home({ onStart, hasProgress, completed = [] }) {
  return (
    <main className="home" id="main">
      <div className="home-card">
        <img className="home-icon" src="/brand/icon-brown.png" alt="סמל נקודת חיבור" />
        <p className="eyebrow">{courseMeta.brand}</p>
        <h1>{courseMeta.title}</h1>
        <p className="subtitle">{courseMeta.subtitle}</p>
        <p className="intro">{courseMeta.intro}</p>

        {hasProgress && <ProgressRing completed={completed} />}

        <section className="team" aria-label="מי אנחנו">
          {team.map((person) => (
            <div className="team-member" key={person.name}>
              <img className="team-photo" src={person.photo} alt={person.name} />
              <h3 className="team-name">{person.name}</h3>
              <p className="team-bio">{person.bio}</p>
            </div>
          ))}
        </section>

        <button className="btn btn-primary" onClick={onStart}>
          {hasProgress ? 'המשך מהמקום שעצרת' : 'התחלת הקורס'}
        </button>
        <p className="home-meta">שישה שיעורים קצרים. ההתקדמות והתרגולים נשמרים רק במכשיר שלך.</p>
      </div>
    </main>
  )
}
