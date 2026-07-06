import { useState, useEffect } from 'react'
import { verifyAdmin, adminLogout } from '../../services/adminAuth.js'
import AdminLogin from './AdminLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminParticipants from './AdminParticipants.jsx'
import AdminCoupons from './AdminCoupons.jsx'
import AdminReport from './AdminReport.jsx'

export default function AdminLayout() {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [participantsFilter, setParticipantsFilter] = useState('all')

  useEffect(() => {
    verifyAdmin().then((data) => {
      if (data?.authenticated) {
        setAdmin(data.username)
      }
      setLoading(false)
    })
  }, [])

  function handleLoginSuccess(username) {
    setAdmin(username)
  }

  async function handleLogout() {
    await adminLogout()
    setAdmin(null)
  }

  function navigateToParticipants(filter) {
    setParticipantsFilter(filter || 'all')
    setActiveTab('participants')
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Verifying access...</p>
      </div>
    )
  }

  if (!admin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">
            <img src="/brand/icon-brown.png" alt="" width="24" height="24" />
            Course Admin
          </h1>
          <nav className="admin-nav">
            <button
              className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`admin-nav-btn ${activeTab === 'participants' ? 'active' : ''}`}
              onClick={() => { setParticipantsFilter('all'); setActiveTab('participants') }}
            >
              Participants
            </button>
            <button
              className={`admin-nav-btn ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              Coupons
            </button>
            <button
              className={`admin-nav-btn ${activeTab === 'report' ? 'active' : ''}`}
              onClick={() => setActiveTab('report')}
            >
              Report
            </button>
          </nav>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">{admin}</span>
          <button className="admin-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Admin Content */}
      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <AdminDashboard onMetricClick={navigateToParticipants} />
        )}
        {activeTab === 'participants' && (
          <AdminParticipants initialFilter={participantsFilter} />
        )}
        {activeTab === 'coupons' && (
          <AdminCoupons />
        )}
        {activeTab === 'report' && (
          <AdminReport />
        )}
      </div>
    </div>
  )
}
