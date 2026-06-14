import { useState } from 'react'
import { adminLogin } from '../../services/adminAuth.js'

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('נא למלא את כל השדות')
      return
    }

    setLoading(true)
    try {
      const result = await adminLogin(username.trim(), password.trim())
      onLoginSuccess(result.username)
    } catch (err) {
      setError(err.message || 'שגיאה בהתחברות')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login" id="main">
      <div className="login-card">
        <img className="login-icon" src="/brand/icon-brown.png" alt="סמל נקודת חיבור" />
        <p className="login-brand">נקודת חיבור</p>
        <h1 className="login-title">כניסת מנהלים</h1>
        <p className="login-subtitle">הזינו שם משתמש וסיסמה</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="admin-username">שם משתמש</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="שם משתמש"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password">סיסמה</label>
            <div className="field-password-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="סיסמה"
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="field-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>

        <div className="login-card-footer">
          <a href="https://annayael.com/" target="_blank" rel="noopener noreferrer" className="footer-brand">
            <img src="/brand/icon-brown.png" alt="" width="20" height="20" />
            <span>annayael</span>
          </a>
        </div>
      </div>
    </main>
  )
}
