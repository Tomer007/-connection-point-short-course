import { courseMeta } from '../data/course.js'

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

// מסך פתיחה: שם הקורס, תיאור קצר, צוות וכפתור התחלה.
export default function Home({ onStart, hasProgress }) {
  return (
    <main className="home" id="main">
      <div className="home-card">
        <img className="home-icon" src="/brand/icon-brown.png" alt="סמל נקודת חיבור" />
        <p className="eyebrow">{courseMeta.brand}</p>
        <h1>{courseMeta.title}</h1>
        <p className="subtitle">{courseMeta.subtitle}</p>
        <p className="intro">{courseMeta.intro}</p>

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
