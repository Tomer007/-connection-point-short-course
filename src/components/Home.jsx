import { useState, useEffect } from 'react'
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

export default function Home({ onStart, hasProgress, completed = [], onLogout }) {
  const [showSplash, setShowSplash] = useState(true)
  const [splashFading, setSplashFading] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 2000)
    const hideTimer = setTimeout(() => setShowSplash(false), 3000)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [])

  return (
    <main className="home" id="main">
      {onLogout && (
        <button className="home-logout" onClick={onLogout}>יציאה</button>
      )}
      {/* Splash overlay */}
      {showSplash && (
        <div className={`home-splash ${splashFading ? 'fading' : ''}`}>
          <img src="/brand/fear_to _love.png" alt="מפחד לאהבה בארבעה רבדים" className="home-splash-img" />
        </div>
      )}

      <div className={`home-card ${showSplash ? 'hidden' : 'revealed'}`}>
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
                <img
                  className="team-photo"
                  src={person.photo}
                  alt={person.name}
                  onClick={(e) => e.currentTarget.classList.add('pulse')}
                  onAnimationEnd={(e) => e.currentTarget.classList.remove('pulse')}
                />
                <h3 className="team-name">{person.name}</h3>
                <p className="team-bio">{person.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <nav className="footer-legal">
          <a href="/legal/terms">תנאי שימוש</a>
          <a href="/legal/privacy">פרטיות</a>
          <a href="/legal/accessibility">נגישות</a>
        </nav>
      </div>
    </main>
  )
}
