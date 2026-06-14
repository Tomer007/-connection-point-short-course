import { courseMeta, lessons } from '../data/course.js'

const team = [
  {
    name: 'אנה בן יהודה',
    photo: '/team/anna.jpg',
    bio: 'מטפלת רגשית, מייסדת גישת ״נקודת-חיבור״ לחיבור בין רגש, גוף, תודעה ואנרגיה.',
  },
  {
    name: 'יעל רפפורט',
    photo: '/team/yael.jpg',
    bio: 'פיזיותרפיסטית מומחית לחיבור גוף-רגש-נשמה, מייסדת גישת ״נקודת חיבור״ לריפוי ושחרור.',
  },
]

function ProgressRing({ completed }) {
  const total = lessons.length
  const done = completed.length
  const size = 100
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - done / total)

  return (
    <div className="progress-ring" aria-label={`השלמת ${done} מתוך ${total} שיעורים`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="progress-ring-bg" cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={strokeWidth} />
        <circle className="progress-ring-fill" cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--plum)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-ring-count">{done}/{total}</span>
      </div>
    </div>
  )
}

export default function Home({ onStart, hasProgress, completed = [] }) {
  return (
    <main className="home" id="main">
      <div className="home-card">
        {/* Hero */}
        <header className="home-hero">
          <img className="home-icon" src="/brand/icon-brown.png" alt="סמל נקודת חיבור" />
          <p className="home-brand">{courseMeta.brand}</p>
          <h1 className="home-title">{courseMeta.title}</h1>
          <p className="home-subtitle">{courseMeta.subtitle}</p>
        </header>

        {/* Progress or intro */}
        {hasProgress ? (
          <div className="home-progress-section">
            <p className="home-progress-label">{completed.length === lessons.length ? 'סיימת את כל השיעורים' : 'בואו נמשיך מאיפה שעצרנו'}</p>
          </div>
        ) : (
          <p className="home-intro">{courseMeta.intro}</p>
        )}

        {/* CTA */}
        <button className="btn btn-primary home-cta" onClick={onStart}>
          {hasProgress ? 'המשך מהמקום שעצרת' : 'התחלת הקורס'}
        </button>

        {/* Course info pills */}
        <div className="home-pills">
          <span className="home-pill">6 שיעורים</span>
          <span className="home-pill">~45 דקות</span>
          <span className="home-pill">תרגולים מעשיים</span>
        </div>

        {/* Team */}
        <section className="team" aria-label="מי אנחנו">
          <div className="team-row">
            {team.map((person) => (
              <div className="team-member" key={person.name}>
                <img className="team-photo" src={person.photo} alt={person.name} />
                <h3 className="team-name">{person.name}</h3>
                <p className="team-bio">{person.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
