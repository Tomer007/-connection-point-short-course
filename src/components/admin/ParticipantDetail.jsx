import { lessons, layers } from '../../data/course.js'

export default function ParticipantDetail({ participant, onBack }) {
  const p = participant

  return (
    <div className="admin-participant-detail">
      <button className="admin-btn-back" onClick={onBack}>
        ← Back to Participants
      </button>

      <div className="admin-detail-header">
        <h2>{p.name || p.email}</h2>
        <span className={`admin-status-badge ${p.isCompleted ? 'completed' : p.isActive ? 'active' : 'inactive'}`}>
          {p.isCompleted ? 'Completed' : p.isActive ? 'Active' : 'Not Started'}
        </span>
      </div>

      {/* Overview */}
      <section className="admin-detail-section">
        <h3>Overview</h3>
        <div className="admin-detail-grid">
          <DetailItem label="Email" value={p.email} />
          <DetailItem label="Name" value={p.name || 'Not available'} />
          <DetailItem label="Current Phase" value={p.currentPhase} />
          <DetailItem label="Progress" value={`${p.completed}/${p.totalLessons} lessons (${p.progressPercent}%)`} />
          <DetailItem label="Started" value={p.startedAt ? new Date(p.startedAt).toLocaleString('he-IL') : 'Not available'} />
          <DetailItem label="Last Activity" value={p.lastActivity ? new Date(p.lastActivity).toLocaleString('he-IL') : 'Not available'} />
        </div>
      </section>

      {/* Course Progress */}
      <section className="admin-detail-section">
        <h3>Course Progress</h3>
        <div className="admin-lessons-progress">
          {lessons.map((lesson) => {
            const isCompleted = (p.rawProgress.completed || []).includes(lesson.id)
            return (
              <div key={lesson.id} className={`admin-lesson-item ${isCompleted ? 'done' : ''}`}>
                <span className="admin-lesson-check">{isCompleted ? '✅' : '⬜'}</span>
                <span className="admin-lesson-title">{lesson.eyebrow} — {lesson.title}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Practice Data */}
      <section className="admin-detail-section">
        <h3>Practice Data</h3>
        <PracticeDataView data={p.rawData} />
      </section>

      {/* Activity Log */}
      <section className="admin-detail-section">
        <h3>Activity History</h3>
        {p.logEntries.length === 0 ? (
          <p className="admin-empty">No activity log available.</p>
        ) : (
          <div className="admin-log-list">
            {p.logEntries.slice(0, 20).map((entry, i) => (
              <div key={i} className="admin-log-entry">
                <span className="admin-log-action">{entry.action}</span>
                <span className="admin-log-time">
                  {entry.timestamp ? new Date(entry.timestamp).toLocaleString('he-IL') : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="admin-detail-item">
      <span className="admin-detail-label">{label}</span>
      <span className="admin-detail-value">{value}</span>
    </div>
  )
}

function PracticeDataView({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="admin-empty">No practice data available.</p>
  }

  return (
    <div className="admin-practice-data">
      {/* Layer Ratings */}
      {data.layers && (
        <div className="admin-practice-block">
          <h4>Layer Self-Rating</h4>
          <div className="admin-layers-grid">
            {layers.map((layer) => (
              <div key={layer.key} className="admin-layer-item">
                <span className="admin-layer-label">{layer.label}</span>
                <span className="admin-layer-value">
                  {data.layers[layer.key] !== undefined ? data.layers[layer.key] : 'N/A'}/10
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body Signs */}
      {data.signs && (
        <div className="admin-practice-block">
          <h4>Body Signs Checklist</h4>
          <div className="admin-signs-list">
            {Object.entries(data.signs).map(([key, val]) => (
              <span key={key} className={`admin-sign-badge ${val ? 'checked' : ''}`}>
                {val ? '✓' : '✗'} {key}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Heart Writing */}
      {data.heartWriting && (
        <div className="admin-practice-block">
          <h4>Heart Writing (Intuitive)</h4>
          <p className="admin-text-content">{data.heartWriting}</p>
        </div>
      )}

      {/* Reflections */}
      {data.reflections && Object.keys(data.reflections).length > 0 && (
        <div className="admin-practice-block">
          <h4>Reflections</h4>
          {Object.entries(data.reflections).map(([key, val]) => (
            <div key={key} className="admin-reflection-item">
              <span className="admin-reflection-key">{key}:</span>
              <span className="admin-reflection-val">{val || 'Not available'}</span>
            </div>
          ))}
        </div>
      )}

      {/* Journal */}
      {data.journal && data.journal.length > 0 && (
        <div className="admin-practice-block">
          <h4>Journal Entries</h4>
          {data.journal.map((entry, i) => (
            <div key={i} className="admin-journal-entry">
              <span className="admin-journal-date">
                {entry.date ? new Date(entry.date).toLocaleDateString('he-IL') : `Entry ${i + 1}`}
              </span>
              <p>{entry.text || JSON.stringify(entry)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Goals - if exists */}
      {data.goals && (
        <div className="admin-practice-block">
          <h4>Selected Goals</h4>
          {Array.isArray(data.goals) ? (
            <ul className="admin-goals-list">
              {data.goals.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          ) : (
            <p>{JSON.stringify(data.goals)}</p>
          )}
        </div>
      )}

      {/* Onboarding data - if exists */}
      {data.onboarding && (
        <div className="admin-practice-block">
          <h4>Onboarding Data</h4>
          <pre className="admin-pre">{JSON.stringify(data.onboarding, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
