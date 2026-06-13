import { dailyKit } from '../../data/course.js'
import MediaPlayer from '../MediaPlayer.jsx'

// שיעור 6: שלושת כרטיסי התרגול היומי, כל כרטיס עם המדיה שלו (או placeholder).
export default function DailyKit({ getMedia }) {
  return (
    <div className="exercise">
      <h3>אזור התרגול היומי</h3>
      <p className="hint">שלושה כלים קצרים להטענת הגוף והתודעה בתדר החדש. אפשר לחזור אליהם כל יום.</p>
      <div className="kit-grid">
        {dailyKit.map((card) => {
          const media = getMedia(card.sectionId, card.mediaKey)
          const isAudio = media?.type === 'audio'
          return (
            <div className="kit-card" key={card.mediaKey}>
              <span className={`kit-tag ${isAudio ? 'audio' : 'video'}`}>
                {isAudio ? 'אודיו' : 'וידאו'}
              </span>
              <MediaPlayer media={media} />
              <div className="media-title">{card.title}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
