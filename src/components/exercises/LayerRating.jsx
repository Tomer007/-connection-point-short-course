import { layers } from '../../data/course.js'

const options = [
  { value: 1, label: 'לא באיזון' },
  { value: 2, label: 'קצת מחוץ לציר' },
  { value: 3, label: 'באמצע' },
  { value: 4, label: 'די מאוזן' },
  { value: 5, label: 'מסונכרן לגמרי' },
]

const ratingColors = {
  1: 'var(--rose)',
  2: '#c97a3a',
  3: 'var(--gold-deep)',
  4: '#8bab96',
  5: 'var(--sage-deep)',
}

export default function LayerRating({ data, setData }) {
  const values = data.layers

  function setLayer(key, val) {
    setData((prev) => ({
      ...prev,
      layers: { ...prev.layers, [key]: Number(val) },
    }))
  }

  return (
    <div className="exercise">
      <h3>תרגול: איפה כל רובד נמצא עכשיו?</h3>
      <p className="hint">
        בחרי בעדינות, ללא שיפוט, איך כל רובד מרגיש לך ברגע הזה.
      </p>
      {layers.map((layer) => (
        <div className="rating-row" key={layer.key}>
          <span className="rating-label">{layer.label}</span>
          <div className="rating-buttons" role="radiogroup" aria-label={`דירוג ${layer.label}`}>
            {options.map((opt) => {
              const isActive = values[layer.key] === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`rating-btn ${isActive ? 'active' : ''}`}
                  style={isActive ? { background: ratingColors[opt.value], borderColor: ratingColors[opt.value] } : undefined}
                  onClick={() => setLayer(layer.key, opt.value)}
                  aria-pressed={isActive}
                  aria-label={opt.label}
                  title={opt.label}
                >
                  {opt.value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
