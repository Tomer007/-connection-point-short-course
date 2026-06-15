import { useEffect, useState } from 'react'
import MediaPlayer from './MediaPlayer.jsx'

// דף מרוכז של כל המדיטציות והתרגולים — נגיש לאחר סיום הקורס.
export default function MeditationHub() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    fetch('/data/videos.json')
      .then((r) => r.ok ? r.json() : [])
      .then((list) => { if (Array.isArray(list)) setVideos(list) })
      .catch(() => {})
  }, [])

  const practiceMedia = videos.filter((v) => v.sectionId === 'love-frequency')
  const lessonMedia = videos.filter((v) => v.sectionId !== 'love-frequency')

  return (
    <div className="meditation-hub">
      <header className="lesson-head">
        <p className="eyebrow">ערכת הכלים שלך</p>
        <h1>כל המדיטציות והתרגולים</h1>
        <p className="lesson-summary">כל התכנים במקום אחד — לתרגול יומי ולחזרה מתי שתרצו.</p>
      </header>

      {/* Practice tools */}
      <section className="hub-section">
        <h2 className="hub-section-title">תרגול יומי</h2>
        <div className="hub-grid">
          {practiceMedia.map((media, i) => (
            <div className="hub-card" key={`practice-${i}`}>
              <div className="hub-card-type">{media.type === 'video' ? '🎬' : '🎧'}</div>
              <h3 className="hub-card-title">{media.title}</h3>
              <p className="hub-card-desc">{media.description}</p>
              <MediaPlayer media={media} />
            </div>
          ))}
        </div>
      </section>

      {/* Lesson audio */}
      <section className="hub-section">
        <h2 className="hub-section-title">הקלטות השיעורים</h2>
        <div className="hub-grid">
          {lessonMedia.map((media, i) => (
            <div className="hub-card" key={`lesson-${i}`}>
              <div className="hub-card-type">🎧</div>
              <h3 className="hub-card-title">{media.title}</h3>
              <p className="hub-card-desc">{media.description}</p>
              <MediaPlayer media={media} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
