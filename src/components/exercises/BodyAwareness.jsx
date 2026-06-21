import { useState } from 'react'

const questions = [
  'נסו לקחת שלוש נשימות עמוקות ושימו לב — האם יש אזור בגוף שקשה לכם לנשום אליו?',
  'האם קל לכם לנשום עמוק?',
  'כשאתם בתשומת לב — האם הדופק שלכם איטי או מהיר עכשיו?',
  'האם יש אזור כרגע בגוף שמרגיש מכווץ או כואב?',
]

export default function BodyAwareness({ data, setData }) {
  const answers = data.bodyAwareness || ['', '', '', '']

  function updateAnswer(index, value) {
    setData((prev) => {
      const updated = [...(prev.bodyAwareness || ['', '', '', ''])]
      updated[index] = value
      return { ...prev, bodyAwareness: updated }
    })
  }

  return (
    <div className="exercise">
      <h3>תרגול: תשומת לב לגוף</h3>
      <p className="hint">קחו רגע, עצרו, והקשיבו לגוף. ענו בכנות על השאלות הבאות:</p>
      <div className="body-awareness-questions">
        {questions.map((q, i) => (
          <div className="body-awareness-item" key={i}>
            <label>{q}</label>
            <textarea
              value={answers[i] || ''}
              onChange={(e) => updateAnswer(i, e.target.value)}
              placeholder="כתבו כאן..."
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
