import { useEffect, useMemo, useState } from 'react'
import { getParticipantsAsync } from '../../services/adminMetrics.js'
import ParticipantDetail from './ParticipantDetail.jsx'

function mapInitialFilter(filter) {
  if (filter === 'active') return 'active'
  if (filter === 'completed') return 'completed'
  if (filter === 'not-finished') return 'not-finished'
  return 'all'
}

export default function AdminParticipants({ initialFilter = 'all' }) {
  const [allParticipants, setAllParticipants] = useState([])
  const [search, setSearch] = useState('')
  const [filterPhase, setFilterPhase] = useState('all')
  const [filterStatus, setFilterStatus] = useState(mapInitialFilter(initialFilter))
  const [selectedParticipant, setSelectedParticipant] = useState(null)

  useEffect(() => {
    getParticipantsAsync().then(setAllParticipants)
  }, [])

  const filtered = useMemo(() => {
    let list = allParticipants

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          (p.email && p.email.toLowerCase().includes(q)) ||
          (p.name && p.name.toLowerCase().includes(q)) ||
          p.hash.toLowerCase().includes(q),
      )
    }

    if (filterPhase !== 'all') {
      list = list.filter((p) => p.currentPhase === filterPhase)
    }

    if (filterStatus === 'active') {
      list = list.filter((p) => p.isActive)
    } else if (filterStatus === 'completed') {
      list = list.filter((p) => p.isCompleted)
    } else if (filterStatus === 'not-started') {
      list = list.filter((p) => p.completed === 0)
    } else if (filterStatus === 'not-finished') {
      list = list.filter((p) => p.completed > 0 && !p.isCompleted)
    }

    return list
  }, [allParticipants, search, filterPhase, filterStatus])

  const phases = [
    { value: 'all', label: 'All Phases' },
    { value: 'intro', label: 'Intro' },
    { value: 'roadmap', label: 'Roadmap' },
    { value: 'coherence', label: 'Coherence' },
    { value: 'body-compass', label: 'Body Compass' },
    { value: 'heart-protocol', label: 'Heart Protocol' },
    { value: 'love-frequency', label: 'Love Frequency' },
  ]

  if (selectedParticipant) {
    return (
      <ParticipantDetail
        participant={selectedParticipant}
        onBack={() => setSelectedParticipant(null)}
      />
    )
  }

  return (
    <div className="admin-participants">
      <h2>Participants</h2>

      {/* Filters */}
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search"
        />
        <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)} className="admin-select">
          {phases.map((ph) => (
            <option key={ph.value} value={ph.value}>
              {ph.label}
            </option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="admin-select">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="not-started">Not Started</option>
          <option value="not-finished">Started, Not Finished</option>
        </select>
      </div>

      <p className="admin-count">{filtered.length} participant{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <p className="admin-empty">No participants match the current filters.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email / Name</th>
                <th>Phase</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Started</th>
                <th>Last Activity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.hash}>
                  <td>
                    <strong>{p.name || '—'}</strong>
                    <br />
                    <span className="admin-email">{p.email}</span>
                  </td>
                  <td>
                    <span className={`admin-phase-badge phase-${p.currentPhase}`}>
                      {p.currentPhase}
                    </span>
                  </td>
                  <td>
                    <div className="progress-bar-mini">
                      <div className="progress-bar-fill" style={{ width: `${p.progressPercent}%` }} />
                    </div>
                    <span>{p.completed}/{p.totalLessons}</span>
                  </td>
                  <td>
                    <span className={`admin-status-badge ${p.isCompleted ? 'completed' : p.isActive ? 'active' : 'inactive'}`}>
                      {p.isCompleted ? 'Completed' : p.isActive ? 'Active' : 'Not Started'}
                    </span>
                  </td>
                  <td>{p.startedAt ? new Date(p.startedAt).toLocaleDateString('he-IL') : '—'}</td>
                  <td>{p.lastActivity ? new Date(p.lastActivity).toLocaleDateString('he-IL') : '—'}</td>
                  <td>
                    <button
                      className="admin-btn-sm"
                      onClick={() => setSelectedParticipant(p)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
