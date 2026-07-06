import { useState, useEffect } from 'react'
import { lessons } from '../../data/course.js'

export default function AdminReport() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/metrics', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/admin/users', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
      fetch('/api/admin/coupons', { credentials: 'include' }).then(r => r.ok ? r.json() : null),
    ]).then(([metrics, users, coupons]) => {
      setData({ metrics, users: users?.users || [], coupons: coupons?.coupons || [] })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="admin-loading"><p>Loading report...</p></div>
  }

  if (!data || !data.metrics) {
    return <div className="admin-empty"><p>No data available.</p></div>
  }

  const { metrics, users, coupons } = data
  const totalLessons = lessons.length

  // Calculate per-lesson completion
  const lessonStats = lessons.map(lesson => {
    const completed = users.filter(u => {
      const phases = u.courseStatus?.completedPhases || []
      return phases.includes(lesson.id)
    }).length
    return {
      id: lesson.id,
      title: lesson.title,
      eyebrow: lesson.eyebrow,
      completed,
      percentage: users.length > 0 ? Math.round((completed / users.length) * 100) : 0,
    }
  })

  // Funnel drop-off
  const funnelData = lessonStats.map((ls, i) => {
    const prev = i > 0 ? lessonStats[i - 1].completed : users.length
    const dropOff = prev - ls.completed
    return { ...ls, dropOff: Math.max(0, dropOff) }
  })

  // Active users (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const activeThisWeek = users.filter(u => {
    const lastActivity = u.courseStatus?.updatedAt || u.profile?.lastLoginAt
    return lastActivity && lastActivity > weekAgo
  }).length

  // Coupon stats
  const couponsUsed = coupons.filter(c => c.status === 'used').length
  const couponsActive = coupons.filter(c => c.status === 'active').length

  // Generate text report
  function generateReport() {
    const now = new Date().toLocaleDateString('he-IL')
    let report = `📊 דוח סטטוס קורס — נקודת חיבור\n`
    report += `תאריך: ${now}\n`
    report += `─────────────────────\n\n`

    report += `👥 משתתפים\n`
    report += `• סה"כ רשומים: ${metrics.total}\n`
    report += `• פעילים: ${metrics.active}\n`
    report += `• סיימו את הקורס: ${metrics.completed}\n`
    report += `• התחילו ולא סיימו: ${metrics.startedNotFinished}\n`
    report += `• פעילים השבוע: ${activeThisWeek}\n`
    report += `• אחוז השלמה: ${metrics.completionRate}%\n`
    report += `• התקדמות ממוצעת: ${metrics.avgProgress}%\n\n`

    report += `📈 פירוט לפי שיעור\n`
    funnelData.forEach(ls => {
      const bar = '█'.repeat(Math.round(ls.percentage / 10)) + '░'.repeat(10 - Math.round(ls.percentage / 10))
      report += `• ${ls.eyebrow}: ${ls.completed}/${users.length} (${ls.percentage}%) ${bar}`
      if (ls.dropOff > 0) report += ` ↓${ls.dropOff} נשרו`
      report += `\n`
    })

    report += `\n💳 קופונים\n`
    report += `• סה"כ הונפקו: ${coupons.length}\n`
    report += `• נוצלו: ${couponsUsed}\n`
    report += `• פעילים (טרם נוצלו): ${couponsActive}\n\n`

    if (coupons.length > 0) {
      report += `רוכשים אחרונים:\n`
      const recent = [...coupons].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
      recent.forEach(c => {
        const date = new Date(c.createdAt).toLocaleDateString('he-IL')
        report += `• ${c.name} (${date}) — ${c.status === 'used' ? '✅ נכנס' : '🟡 טרם נכנס'}\n`
      })
    }

    report += `\n─────────────────────\n`
    report += `💡 תובנות\n`

    // Auto-generate insights
    if (metrics.completionRate > 70) {
      report += `• אחוז השלמה גבוה (${metrics.completionRate}%) — הקורס עובד!\n`
    } else if (metrics.completionRate < 30 && metrics.total > 5) {
      report += `• אחוז השלמה נמוך (${metrics.completionRate}%) — כדאי לבדוק איפה אנשים נתקעים\n`
    }

    const biggestDrop = funnelData.reduce((max, ls) => ls.dropOff > max.dropOff ? ls : max, funnelData[0])
    if (biggestDrop.dropOff > 0) {
      report += `• הנשירה הגדולה ביותר: ${biggestDrop.eyebrow} (${biggestDrop.dropOff} נשרו)\n`
    }

    if (activeThisWeek === 0 && metrics.total > 0) {
      report += `• אין פעילות השבוע — כדאי לשלוח תזכורת למשתתפים\n`
    }

    return report
  }

  const reportText = generateReport()

  function copyReport() {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function sendWhatsApp() {
    const encoded = encodeURIComponent(reportText)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
  }

  function sendEmail() {
    const subject = encodeURIComponent('דוח סטטוס קורס — נקודת חיבור')
    const body = encodeURIComponent(reportText)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="admin-dashboard">
      <h2>Status Report</h2>
      <p className="admin-report-subtitle">דוח אנליטיקס מלא — ניתן להעתיק או לשלוח</p>

      {/* Visual Summary */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-value">{metrics.total}</div>
          <div className="admin-metric-label">Total Registered</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-value">{metrics.completed}</div>
          <div className="admin-metric-label">Completed</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-value">{metrics.completionRate}%</div>
          <div className="admin-metric-label">Completion Rate</div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-value">{activeThisWeek}</div>
          <div className="admin-metric-label">Active This Week</div>
        </div>
      </div>

      {/* Funnel */}
      <section className="admin-section">
        <h3>Course Funnel</h3>
        <div className="admin-funnel">
          {funnelData.map(ls => (
            <div className="funnel-row" key={ls.id}>
              <span className="funnel-label">{ls.eyebrow}</span>
              <div className="funnel-bar-wrap">
                <div className="funnel-bar" style={{ width: `${ls.percentage}%` }} />
              </div>
              <span className="funnel-value">{ls.percentage}%</span>
              {ls.dropOff > 0 && <span className="funnel-drop">↓{ls.dropOff}</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Text Report */}
      <section className="admin-section">
        <h3>Text Report</h3>
        <pre className="admin-report-text">{reportText}</pre>
        <div className="admin-report-actions">
          <button className="btn btn-primary" onClick={copyReport}>
            {copied ? '✓ הועתק!' : '📋 העתקה ללוח'}
          </button>
          <button className="btn btn-sage" onClick={sendWhatsApp}>
            💬 שליחה ב-WhatsApp
          </button>
          <button className="btn btn-ghost" onClick={sendEmail}>
            ✉️ שליחה באימייל
          </button>
        </div>
      </section>
    </div>
  )
}
