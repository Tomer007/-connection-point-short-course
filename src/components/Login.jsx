import { useState } from 'react'
import { courseMeta } from '../data/course.js'

const COUPON_API = window.location.hostname === 'localhost'
  ? '/api/coupon/validate'
  : 'https://connection-point-api.onrender.com/api/coupon/validate'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !code.trim()) {
      setError('נא למלא את כל השדות')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(COUPON_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      })
      if (!res.ok) {
        setError('קוד הגישה שגוי')
        return
      }
      onLogin({ email: email.trim(), code: code.trim() })
    } catch {
      setError('שגיאה בבדיקת הקוד, נסו שוב')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login" id="main">
      <div className="login-card">
        <img className="login-icon" src="/brand/icon-brown.png" alt="סמל נקודת חיבור" />
        <p className="login-brand">{courseMeta.brand}</p>
        <h1 className="login-title">כניסה לקורס</h1>
        <p className="login-subtitle">הזינו את האימייל וקוד הגישה שקיבלתם</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              dir="ltr"
            />
          </div>

          <div className="form-field">
            <label htmlFor="code">קוד גישה</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="הקוד שקיבלת"
              autoComplete="off"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'בודק...' : 'כניסה'}
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
