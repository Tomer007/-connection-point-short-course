import { useState, useEffect } from 'react'
import { getCourseMetricsAsync, getPhaseMetricsAsync, getLatestParticipantsAsync } from '../../services/adminMetrics.js'

export default function AdminDashboard({ onMetricClick }) {
  const [metrics, setMetrics] = useState({ total: 0, active: 0, completed: 0, startedNotFinished: 0, avgProgress: 0, completionRate: 0 })
  const [phases, setPhases] = useState([])
  const [latest, setLatest] = useState([])

  useEffect(() => {
    getCourseMetricsAsync().then(setMetrics)
    getPhaseMetricsAsync().then(setPhases)
    getLatestParticipantsAsync(5).then(setLatest)
  }, [])

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Overview</h2>

      {/* Metrics Cards */}
      <div className="admin-metrics-grid">
        <MetricCard label="Total Participants" value={metrics.total} onClick={() => onMetricClick('all')} />
        <MetricCard label="Active" value={metrics.active} onClick={() => onMetricClick('active')} />
        <MetricCard label="Completed" value={metrics.completed} onClick={() => onMetricClick('completed')} />
        <MetricCard label="Started, Not Finished" value={metrics.startedNotFinished} onClick={() => onMetricClick('not-finished')} />
        <MetricCard label="Average Progress" value={`${metrics.avgProgress}%`} onClick={() => onMetricClick('all')} />
        <MetricCard label="Completion Rate" value={`${metrics.completionRate}%`} onClick={() => onMetricClick('completed')} />
      </div>

      {/* Phase Breakdown */}
      <section className="admin-section">
        <h3>Course Phases</h3>
        <div className="admin-phases-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Phase</th>
                <th>In Phase</th>
                <th>% of Total</th>
                <th>Completed</th>
                <th>Drop-off</th>
                <th>Drop-off Rate</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase) => (
                <tr key={phase.id}>
                  <td>
                    <span className="phase-eyebrow">{phase.eyebrow}</span>
                    <br />
                    <span className="phase-title">{phase.title}</span>
                  </td>
                  <td>{phase.participantsInPhase}</td>
                  <td>
                    <div className="progress-bar-mini">
                      <div className="progress-bar-fill" style={{ width: `${phase.percentage}%` }} />
                    </div>
                    <span>{phase.percentage}%</span>
                  </td>
                  <td>{phase.completedPhase}</td>
                  <td>{phase.dropOff}</td>
                  <td>{phase.dropOffRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Latest Participants */}
      <section className="admin-section">
        <h3>Latest Participants</h3>
        {latest.length === 0 ? (
          <p className="admin-empty">No participants yet.</p>
        ) : (
          <div className="admin-latest-list">
            {latest.map((p) => (
              <div className="admin-latest-card" key={p.hash}>
                <div className="admin-latest-info">
                  <span className="admin-latest-name">{p.name || p.email}</span>
                  <span className="admin-latest-date">
                    {p.startedAt ? new Date(p.startedAt).toLocaleDateString('he-IL') : 'N/A'}
                  </span>
                </div>
                <div className="admin-latest-progress">
                  <div className="progress-bar-mini">
                    <div className="progress-bar-fill" style={{ width: `${p.progressPercent}%` }} />
                  </div>
                  <span>{p.progressPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function MetricCard({ label, value, onClick }) {
  return (
    <button className="admin-metric-card" onClick={onClick} type="button">
      <img className="admin-metric-icon" src="/brand/icon-brown.png" alt="" width="28" height="28" />
      <div className="admin-metric-value">{value}</div>
      <div className="admin-metric-label">{label}</div>
    </button>
  )
}
