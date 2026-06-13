import { layers } from '../../data/course.js'

const options = [
  { value: 1, label: 'לא באיזון' },
  { value: 2, label: 'קצת מחוץ לציר' },
  { value: 3, label: 'באמצע' },
  { value: 4, label: 'די מאוזן' },
  { value: 5, label: 'מסונכרן לגמרי' },
]

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
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`rating-btn ${values[layer.key] === opt.value ? 'active' : ''}`}
                onClick={() => setLayer(layer.key, opt.value)}
                aria-pressed={values[layer.key] === opt.value}
                aria-label={opt.label}
                title={opt.label}
              >
                {opt.value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
