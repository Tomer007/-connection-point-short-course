import { bodySigns } from '../../data/course.js'

// שיעור 4: checklist לזיהוי הסימנים הגופניים של יציאה מאיזון.
export default function SignsChecklist({ data, setData }) {
  const signs = data.signs

  function toggle(key) {
    setData((prev) => ({
      ...prev,
      signs: { ...prev.signs, [key]: !prev.signs[key] },
    }))
  }

  return (
    <div className="exercise">
      <h3>תרגול: מה הגוף שלך מסמן עכשיו?</h3>
      <p className="hint">סמני את הסימנים שאת מזהה בגוף ברגע זה. זו דרך להתאמן בלהקשיב למצפן הגופני.</p>
      <ul className="check-list">
        {bodySigns.map((sign) => (
          <li key={sign.key}>
            <label className={`check-item ${signs[sign.key] ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={!!signs[sign.key]}
                onChange={() => toggle(sign.key)}
              />
              <span>{sign.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
