import { useState } from 'react'
import { courseMeta } from '../data/course.js'

const COUPON_API = '/api/coupon/validate'
const GENERATE_API = '/api/coupons/generate'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Purchase flow state
  const [showPurchase, setShowPurchase] = useState(false)
  const [purchaseName, setPurchaseName] = useState('')
  const [purchasePhone, setPurchasePhone] = useState('')
  const [purchaseEmail, setPurchaseEmail] = useState('')
  const [generatedCoupon, setGeneratedCoupon] = useState('')
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')
  const [purchaseStep, setPurchaseStep] = useState(1) // 1=form, 2=pay, 3=done

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

  async function handleGenerateCoupon() {
    setPurchaseError('')
    if (!purchaseName.trim() || !purchasePhone.trim() || !purchaseEmail.trim()) {
      setPurchaseError('נא למלא שם, טלפון ואימייל')
      return
    }

    setPurchaseLoading(true)
    try {
      const res = await fetch(GENERATE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: purchaseName.trim(),
          phone: purchasePhone.trim(),
          email: purchaseEmail.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPurchaseError(data.error || 'שגיאה ביצירת הקופון')
        return
      }
      setGeneratedCoupon(data.coupon)
      setPurchaseStep(3)
    } catch {
      setPurchaseError('שגיאה, נסו שוב')
    } finally {
      setPurchaseLoading(false)
    }
  }

  function openBitPayment() {
    // Open Bit payment link
    window.open('https://www.paybit.me/p/0547784404', '_blank')
    setPurchaseStep(2)
  }

  if (showPurchase) {
    return (
      <main className="login" id="main">
        <div className="login-card">
          <img className="login-icon" src="/brand/icon-brown.png" alt="סמל נקודת חיבור" />
          <p className="login-brand">{courseMeta.brand}</p>
          <h1 className="login-title">רכישת הקורס</h1>

          {purchaseStep === 1 && (
            <>
              <p className="login-subtitle">מלאו את הפרטים ושלמו באמצעות Bit</p>
              <div className="login-form">
                <div className="form-field">
                  <label htmlFor="purchase-name">שם מלא</label>
                  <input
                    id="purchase-name"
                    type="text"
                    value={purchaseName}
                    onChange={(e) => setPurchaseName(e.target.value)}
                    placeholder="השם שלך"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="purchase-phone">טלפון</label>
                  <input
                    id="purchase-phone"
                    type="tel"
                    value={purchasePhone}
                    onChange={(e) => setPurchasePhone(e.target.value)}
                    placeholder="050-1234567"
                    dir="ltr"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="purchase-email">אימייל</label>
                  <input
                    id="purchase-email"
                    type="email"
                    value={purchaseEmail}
                    onChange={(e) => setPurchaseEmail(e.target.value)}
                    placeholder="your@email.com"
                    dir="ltr"
                  />
                </div>

                {purchaseError && <p className="login-error">{purchaseError}</p>}

                <button type="button" className="btn btn-primary login-btn" onClick={openBitPayment}>
                  💳 שליחת תשלום ב-Bit ל-0547784404
                </button>

                <p className="purchase-note">
                  לאחר התשלום, לחצו על הכפתור למטה לקבלת קוד גישה אישי
                </p>
              </div>
            </>
          )}

          {purchaseStep === 2 && (
            <>
              <p className="login-subtitle">שלחתם את התשלום? מעולה!</p>
              <p className="purchase-note">לחצו כאן לקבלת קוד הגישה האישי שלכם:</p>

              {purchaseError && <p className="login-error">{purchaseError}</p>}

              <button
                type="button"
                className="btn btn-sage login-btn"
                onClick={handleGenerateCoupon}
                disabled={purchaseLoading}
              >
                {purchaseLoading ? 'מייצר קוד...' : '✓ קיבלתי את הקוד שלי'}
              </button>
            </>
          )}

          {purchaseStep === 3 && (
            <>
              <p className="login-subtitle">הקוד האישי שלכם:</p>
              <div className="coupon-display">
                <span className="coupon-code">{generatedCoupon}</span>
              </div>
              <p className="purchase-note">שמרו את הקוד — תוכלו להשתמש בו לכניסה לקורס.</p>
              <button
                type="button"
                className="btn btn-primary login-btn"
                onClick={() => {
                  setCode(generatedCoupon)
                  setShowPurchase(false)
                }}
              >
                כניסה לקורס עם הקוד →
              </button>
            </>
          )}

          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: '16px' }}
            onClick={() => { setShowPurchase(false); setPurchaseStep(1) }}
          >
            ← חזרה למסך הכניסה
          </button>
        </div>
      </main>
    )
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
            <div className="field-password-wrap">
              <input
                id="code"
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="הקוד שקיבלת"
                autoComplete="off"
              />
              <button
                type="button"
                className="field-password-toggle"
                onClick={() => setShowCode((v) => !v)}
                aria-label={showCode ? 'הסתר קוד' : 'הצג קוד'}
              >
                {showCode ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'בודק...' : 'כניסה'}
          </button>
        </form>

        <div className="purchase-divider">
          <span>או</span>
        </div>

        <button
          type="button"
          className="btn btn-sage login-btn purchase-btn"
          onClick={() => setShowPurchase(true)}
        >
          💳 שליחת תשלום ב-Bit
        </button>

        <div className="login-card-footer">
          <a href="https://annayael.com/" target="_blank" rel="noopener noreferrer" className="footer-brand">
            <img src="/brand/icon-brown.png" alt="" width="20" height="20" />
            <span>annayael</span>
          </a>
          <nav className="footer-legal">
            <a href="/legal/terms">תנאי שימוש</a>
            <a href="/legal/privacy">פרטיות</a>
            <a href="/legal/accessibility">נגישות</a>
          </nav>
        </div>
      </div>
    </main>
  )
}
