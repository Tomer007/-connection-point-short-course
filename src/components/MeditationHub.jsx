import { useEffect, useState } from 'react'
import MediaPlayer from './MediaPlayer.jsx'

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

  if (videos.length === 0) return null

  return (
    <div className="meditation-hub">
      <header className="hub-header">
        <h2 className="hub-title">כל המדיטציות והתרגולים</h2>
        <p className="hub-subtitle">כל התכנים במקום אחד — לתרגול יומי ולחזרה מתי שתרצו.</p>
      </header>

      {practiceMedia.length > 0 && (
        <section className="hub-section">
          <h3 className="hub-section-title">תרגול יומי</h3>
          <div className="hub-grid">
            {practiceMedia.map((media, i) => (
              <div className="hub-card" key={`practice-${i}`}>
                <h4 className="hub-card-title">{media.title}</h4>
                <p className="hub-card-desc">{media.description}</p>
                <MediaPlayer media={media} />
              </div>
            ))}
          </div>
        </section>
      )}

      {lessonMedia.length > 0 && (
        <section className="hub-section">
          <h3 className="hub-section-title">הקלטות השיעורים</h3>
          <div className="hub-grid">
            {lessonMedia.map((media, i) => (
              <div className="hub-card" key={`lesson-${i}`}>
                <h4 className="hub-card-title">{media.title}</h4>
                <p className="hub-card-desc">{media.description}</p>
                <MediaPlayer media={media} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
