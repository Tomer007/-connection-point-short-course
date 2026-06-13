import { useState } from 'react'
import { courseMeta } from '../data/course.js'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !code.trim()) {
      setError('נא למלא את כל השדות')
      return
    }

    onLogin({ email: email.trim(), code: code.trim() })
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

          <button type="submit" className="btn btn-primary login-btn">
            כניסה
          </button>
        </form>
      </div>

      <footer className="footer login-footer">
        <a href="https://annayael.com/" target="_blank" rel="noopener noreferrer" className="footer-brand">
          <img src="/brand/icon-brown.png" alt="" width="24" height="24" />
          <span>annayael</span>
        </a>
      </footer>
    </main>
  )
}
