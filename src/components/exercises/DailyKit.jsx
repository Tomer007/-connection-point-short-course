import { useState } from 'react'
import { dailyKit, gratitudePrompt } from '../../data/course.js'
import MediaPlayer from '../MediaPlayer.jsx'

// שיעור 6: כרטיסי התרגול היומי, כל כרטיס עם המדיה שלו (או placeholder).
export default function DailyKit({ getMedia }) {
  const [gratitudes, setGratitudes] = useState(['', '', '', '', ''])

  function updateGratitude(index, value) {
    setGratitudes((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  return (
    <div className="exercise">
      <h3>אזור התרגול היומי</h3>
      <p className="hint">כלים קצרים להטענת הגוף והתודעה בתדר החדש. אפשר לחזור אליהם כל יום.</p>
      <div className="kit-grid">
        {dailyKit.map((card) => {
          const media = getMedia(card.sectionId, card.mediaKey)
          const isAudio = media?.type === 'audio'
          return (
            <div className="kit-card" key={card.mediaKey}>
              <span className={`kit-tag ${isAudio ? 'audio' : 'video'}`}>
                {isAudio ? 'אודיו' : 'וידאו'}
              </span>
              {card.gender && <span className="kit-gender-tag">{card.gender}</span>}
              <MediaPlayer media={media} />
              <div className="media-title">{card.title}</div>
              <p className="kit-card-text">{card.text}</p>
            </div>
          )
        })}
      </div>

      {/* הודיות */}
      <div className="gratitude-section">
        <h3>{gratitudePrompt.title}</h3>
        <p className="hint">{gratitudePrompt.text}</p>
        <ol className="gratitude-list">
          {gratitudes.map((val, i) => (
            <li key={i}>
              <input
                type="text"
                className="gratitude-input"
                placeholder={`הודיה ${i + 1}...`}
                value={val}
                onChange={(e) => updateGratitude(i, e.target.value)}
              />
            </li>
          ))}
        </ol>
      </div>

      {/* מתנה: חיבור לפודקסט */}
      <div className="gift-section">
        <h3>🎁 מתנה עבורכם</h3>
        <p>חיבור לפודקסט שלנו עם מדיטציה מודרכת מיוחדת:</p>
        <a
          href="https://open.spotify.com/episode/0KTc2iuuHiAh7AxzVN2and?si=87ea92819e4d4a66"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sage gift-link"
        >
          להאזנה לפודקסט נקודת חיבור →
        </a>
      </div>
    </div>
  )
}
