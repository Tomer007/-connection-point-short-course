// תרגול קצר לשיעורים 2 ו-3: רגע של עצירה וכתיבה חופשית.
// ההנחיה מנוסחת מתוך תוכן השיעור עצמו, ללא הוספת שיטות חדשות.
const PROMPTS = {
  2: 'עצרי לרגע ושימי לב: ברגע זה את פועלת על אוטומט, או מתוך בחירה?',
  3: 'מה הגוף שלך מסמן עכשיו: מצב של פחד וסטרס, או מצב מאוזן ומסונכרן?',
}

export default function ReflectionPause({ lessonId, data, setData }) {
  const value = data.reflections?.[lessonId] || ''
  const prompt = PROMPTS[lessonId] || 'מה עולה בך עכשיו?'

  function onChange(text) {
    setData((prev) => ({
      ...prev,
      reflections: { ...prev.reflections, [lessonId]: text },
    }))
  }

  return (
    <div className="exercise">
      <h3>רגע של עצירה</h3>
      <p className="heart-q">{prompt}</p>
      <label htmlFor={`reflect-${lessonId}`} className="slider-name">
        אפשר לכתוב כמה מילים, או רק לשים לב.
      </label>
      <textarea
        id={`reflect-${lessonId}`}
        placeholder="כתיבה חופשית, בלי לצנזר."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="privacy">
        נשמר רק במכשיר שלך.
      </p>
    </div>
  )
}
