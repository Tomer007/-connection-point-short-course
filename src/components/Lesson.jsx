import { useState } from 'react'
import { lessons, heartSteps } from '../data/course.js'
import MediaPlayer from './MediaPlayer.jsx'
import BreathingCircle from './BreathingCircle.jsx'
import LayerRating from './exercises/LayerRating.jsx'
import SignsChecklist from './exercises/SignsChecklist.jsx'
import HeartProtocol from './exercises/HeartProtocol.jsx'
import DailyKit from './exercises/DailyKit.jsx'
import ReflectionPause from './exercises/ReflectionPause.jsx'
import BodyAwareness from './exercises/BodyAwareness.jsx'

// בלוק תוכן בודד מתוך נתוני השיעור.
function ContentBlock({ block }) {
  if (block.type === 'paragraph') {
    return <p>{block.text}</p>
  }
  if (block.type === 'list') {
    return (
      <ul className="content-list">
        {block.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  }
  if (block.type === 'two-states') {
    return (
      <div className="two-states">
        {block.items.map((s, i) => (
          <div className={`state state-${s.tone}`} key={i}>
            <div className="state-label">{s.label}</div>
            <p style={{ margin: 0 }}>{s.text}</p>
          </div>
        ))}
      </div>
    )
  }
  if (block.type === 'note') {
    return (
      <div className="content-note">
        <p>{block.text}</p>
      </div>
    )
  }
  if (block.type === 'steps-overview') {
    return (
      <div className="steps">
        {heartSteps.map((step, i) => (
          <div className="step" key={step.key}>
            <div className="step-num" aria-hidden="true">
              {i + 1}
            </div>
            <div className="step-body">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// בחירת התרגול לפי סוג.
function Exercise({ lesson, data, setData, getMedia }) {
  switch (lesson.practice.kind) {
    case 'layer-rating':
      return <LayerRating data={data} setData={setData} />
    case 'signs-checklist':
      return <SignsChecklist data={data} setData={setData} />
    case 'heart-protocol':
      return <HeartProtocol data={data} setData={setData} />
    case 'daily-kit':
      return <DailyKit getMedia={getMedia} />
    case 'body-awareness':
      return <BodyAwareness data={data} setData={setData} />
    case 'reflection-pause':
      return <ReflectionPause lessonId={lesson.id} data={data} setData={setData} />
    default:
      return null
  }
}

export default function Lesson({
  lesson,
  getMedia,
  data,
  setData,
  completed,
  onToggleComplete,
  onNavigate,
}) {
  const [celebrating, setCelebrating] = useState(false)
  const idx = lessons.findIndex((l) => l.id === lesson.id)
  const prev = lessons[idx - 1]
  const next = lessons[idx + 1]
  const isDone = completed.includes(lesson.id)
  const media = getMedia(lesson.sectionId)

  function handleComplete() {
    if (!isDone) {
      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 1200)
    }
    onToggleComplete(lesson.id)
  }

  return (
    <main className="content" id="main">
      <header className="lesson-head">
        <p className="eyebrow">{lesson.eyebrow}</p>
        <h1>{lesson.title}</h1>
        <p className="lesson-summary">{lesson.summary}</p>
        {lesson.duration && (
          <p className="lesson-duration">
            {lesson.duration.listen > 0 && `${lesson.duration.listen} דק׳ האזנה`}
            {lesson.duration.listen > 0 && lesson.duration.practice > 0 && ' · '}
            {lesson.duration.practice > 0 && `${lesson.duration.practice} דק׳ תרגול`}
          </p>
        )}
      </header>

      <article className="card">
        <span className="section-label">מה נלמד כאן</span>
        {lesson.content.map((block, i) => (
          <ContentBlock block={block} key={i} />
        ))}
      </article>

      <section aria-label="האזנה לשיעור">
        {!lesson.noMedia && <MediaPlayer media={media} />}
      </section>

      <section aria-label="תרגול השיעור">
        <BreathingCircle />
        <Exercise lesson={lesson} data={data} setData={setData} getMedia={getMedia} />
      </section>

      <div className="complete-bar">
        {celebrating && (
          <div className="celebration" aria-live="polite">
            <span className="celebration-check">✓</span>
            <span className="celebration-particles" aria-hidden="true" />
          </div>
        )}
        {isDone ? (
          <>
            <span className="complete-flag">
              <span aria-hidden="true">✓</span> השיעור סומן כהושלם
            </span>
            <button className="btn btn-ghost" onClick={() => onToggleComplete(lesson.id)}>
              ביטול סימון
            </button>
          </>
        ) : (
          <button className="btn btn-sage" onClick={handleComplete}>
            סימון שיעור כהושלם
          </button>
        )}
      </div>

      <nav className="step-nav" aria-label="מעבר בין שיעורים">
        {prev ? (
          <button className="btn btn-ghost" onClick={() => onNavigate({ name: 'lesson', id: prev.id })}>
            → השיעור הקודם
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            className="btn btn-primary"
            onClick={() => onNavigate({ name: 'lesson', id: next.id })}
          >
            השיעור הבא ←
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => onNavigate({ name: 'completion' })}>
            לסיום הקורס ←
          </button>
        )}
      </nav>
    </main>
  )
}
