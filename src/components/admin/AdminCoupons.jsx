import { useState, useEffect } from 'react'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/coupons', { credentials: 'include' })
      .then((r) => r.ok ? r.json() : { coupons: [] })
      .then((data) => setCoupons(data.coupons || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="admin-loading"><p>Loading coupons...</p></div>
  }

  const active = coupons.filter(c => c.status === 'active')
  const used = coupons.filter(c => c.status === 'used')

  return (
    <div className="admin-dashboard">
      <h2>Coupons</h2>

      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-value">{coupons.length}</div>
          <div className="admin-metric-label">Total Generated</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-value">{active.length}</div>
          <div className="admin-metric-label">Active (unused)</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-value">{used.length}</div>
          <div className="admin-metric-label">Used</div>
        </div>
      </div>

      <section className="admin-section">
        <h3>All Coupons</h3>
        {coupons.length === 0 ? (
          <p className="admin-empty">No coupons generated yet.</p>
        ) : (
          <div className="admin-phases-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Used At</th>
                </tr>
              </thead>
              <tbody>
                {coupons.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((c) => (
                  <tr key={c.code}>
                    <td><code style={{ fontWeight: 600 }}>{c.code}</code></td>
                    <td>{c.name}</td>
                    <td dir="ltr">{c.phone}</td>
                    <td dir="ltr">{c.email || '—'}</td>
                    <td>
                      <span className={`coupon-status coupon-status-${c.status}`}>
                        {c.status === 'active' ? '🟢 Active' : '✅ Used'}
                      </span>
                    </td>
                    <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('he-IL') : '—'}</td>
                    <td>{c.usedAt ? new Date(c.usedAt).toLocaleDateString('he-IL') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
