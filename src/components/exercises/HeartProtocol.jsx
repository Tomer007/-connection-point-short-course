import { useEffect, useRef, useState } from 'react'
import { heartSteps } from '../../data/course.js'

const WRITE_SECONDS = 5 * 60 // טיימר כתיבה של 5 דקות

function format(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

// שיעור 5: ארבעת שלבי הפרוטוקול + טיימר כתיבה אינטואיטיבית של 5 דקות.
export default function HeartProtocol({ data, setData }) {
  const [remaining, setRemaining] = useState(WRITE_SECONDS)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  function start() {
    if (remaining === 0) setRemaining(WRITE_SECONDS)
    setRunning(true)
  }
  function stop() {
    setRunning(false)
  }
  function reset() {
    setRunning(false)
    setRemaining(WRITE_SECONDS)
  }

  const done = remaining === 0

  return (
    <div className="exercise">
      <h3>תרגול מודרך: עצירה וחיבור ללב</h3>
      <p className="hint">עברי בין ארבעת השלבים בקצב שלך. בשלב האיוורור אפשר להיעזר בטיימר הכתיבה.</p>

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

      <div className="timer" role="group" aria-label="טיימר כתיבה אינטואיטיבית">
        <div className={`timer-clock ${done ? 'done' : ''}`} aria-live="polite">
          {done ? 'סיימת' : format(remaining)}
        </div>
        <div className="timer-controls">
          {!running ? (
            <button className="btn btn-primary" onClick={start}>
              {remaining === WRITE_SECONDS ? 'התחלת כתיבה (5 דקות)' : 'המשך'}
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={stop}>
              עצירה
            </button>
          )}
          <button className="btn btn-ghost" onClick={reset}>
            איפוס
          </button>
        </div>
      </div>

      <label htmlFor="heart-writing" className="slider-name">
        מה עולה כשאת כותבת בלי לצנזר?
      </label>
      <textarea
        id="heart-writing"
        placeholder="שפכי כאן הכל. בלי לערוך, בלי לצנזר."
        value={data.heartWriting}
        onChange={(e) => setData((prev) => ({ ...prev, heartWriting: e.target.value }))}
      />
      <p className="privacy">
        מה שכתבת נשאר אצלך, נשמר רק במכשיר שלך.
      </p>
    </div>
  )
}
