// מד התקדמות: כמה שיעורים הושלמו מתוך הסך הכל.
export default function ProgressBar({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="progress">
      <div className="progress-label">
        <span>ההתקדמות שלך</span>
        <span>{pct}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`הושלמו ${done} מתוך ${total} שיעורים`}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
