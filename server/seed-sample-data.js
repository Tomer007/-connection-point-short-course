// Seed script — creates sample user data on disk for testing the admin dashboard.
// Run with: node server/seed-sample-data.js

import dotenv from 'dotenv'
dotenv.config()

import { initDataDir } from './storage/dataDir.js'
import { userStore } from './storage/index.js'
import { courseStatusStore } from './storage/index.js'
import { contentStore } from './storage/index.js'
import { activityLogStore } from './storage/index.js'

initDataDir()

// ─────────────────────────────────────────────────────────────
// Sample Users
// ─────────────────────────────────────────────────────────────

const users = [
  {
    userId: 'anna_gmail_com',
    email: 'anna@gmail.com',
    name: 'אנה',
    completedPhases: [1, 2, 3, 4, 5, 6],
    currentPhase: 6,
    status: 'completed',
    startedAt: '2025-01-10T09:00:00.000Z',
    completedAt: '2025-02-14T18:30:00.000Z',
    answers: {
      'layer-rating': { body: 8, emotion: 7, thought: 6, energy: 9 },
      'reflection-pause-2': 'זיהיתי שאני נכנסת לאוטומט כשיש לחץ בעבודה',
      'reflection-pause-3': 'הרגשתי את הסנכרון בין הלב לראש בנשימה הקוהרנטית',
      'signs-checklist': { chest: true, breath: true, pulse: false, restless: true },
      'heart-writing': 'אני מרגישה שקט פנימי עמוק. הלב שלי פתוח ונושם. אני בוחרת לחיות מתוך חיבור ולא מתוך פחד.',
    },
    goals: ['לתרגל נשימה קוהרנטית כל בוקר', 'לזהות אוטומט לפחות פעם ביום', 'לכתוב ביומן הלב 3 פעמים בשבוע'],
    notes: [
      { text: 'השיעור הראשון פתח לי את העיניים לגבי ארבעת הרבדים', createdAt: '2025-01-10T10:30:00.000Z' },
      { text: 'הנשימה הקוהרנטית עובדת מדהים!', createdAt: '2025-01-25T14:00:00.000Z' },
    ],
    journal: [
      { date: '2025-01-12T08:00:00.000Z', text: 'התחלתי את הבוקר עם נשימה קוהרנטית. הרגשתי שקט מיד.' },
      { date: '2025-01-20T21:00:00.000Z', text: 'זיהיתי כיווץ בחזה בזמן שיחה קשה. עצרתי, נשמתי, וחזרתי לציר.' },
      { date: '2025-02-01T07:30:00.000Z', text: 'המדיטציה של תדר האהבה נתנה לי תחושת התרחבות שלא הכרתי.' },
    ],
  },
  {
    userId: 'yael_gmail_com',
    email: 'yael@gmail.com',
    name: 'יעל',
    completedPhases: [1, 2, 3, 4],
    currentPhase: 5,
    status: 'active',
    startedAt: '2025-02-05T10:00:00.000Z',
    completedAt: null,
    answers: {
      'layer-rating': { body: 6, emotion: 8, thought: 5, energy: 7 },
      'reflection-pause-2': 'אני קופאת במקום כשאני מרגישה מאוימת',
      'reflection-pause-3': 'הבנתי שהלב שלי יודע דברים שהראש לא מבין',
      'signs-checklist': { chest: false, breath: true, pulse: true, restless: false },
    },
    goals: ['להקשיב יותר לגוף', 'לעצור לפני שאני מגיבה מתוך פחד'],
    notes: [
      { text: 'פרוטוקול הלב עוזר לי להירגע בזמן לחץ', createdAt: '2025-03-01T09:00:00.000Z' },
    ],
    journal: [
      { date: '2025-02-06T09:00:00.000Z', text: 'הדירוג העצמי הפתיע אותי - לא ידעתי שהרגש כל כך חזק אצלי.' },
      { date: '2025-02-15T20:00:00.000Z', text: 'שמתי לב שהנשימה שלי נעצרת כשאני בלחץ. צעד ראשון.' },
      { date: '2025-03-01T08:00:00.000Z', text: 'ניסיתי את הפרוטוקול בפעם הראשונה. הרגשתי חמלה כלפי עצמי.' },
    ],
  },
  {
    userId: 'einav_connection_co_il',
    email: 'einav@connection.co.il',
    name: 'עינב',
    completedPhases: [1, 2, 3],
    currentPhase: 4,
    status: 'active',
    startedAt: '2025-03-01T11:00:00.000Z',
    completedAt: null,
    answers: {
      'layer-rating': { body: 5, emotion: 4, thought: 6, energy: 3 },
      'reflection-pause-2': 'אני מבינה שאני בורחת כשאני מרגישה חוסר שליטה',
      'reflection-pause-3': 'עדיין לא מרגישה את הסנכרון אבל מבינה את הרעיון',
    },
    goals: ['להפסיק לברוח מרגשות קשים', 'לבנות שגרת תרגול קבועה'],
    notes: [
      { text: 'קשה לי לשבת עם הדממה אבל אני מנסה', createdAt: '2025-03-05T16:00:00.000Z' },
    ],
    journal: [
      { date: '2025-03-02T09:00:00.000Z', text: 'התחלתי את הקורס. מרגישה סקרנית ומעט חששנית.' },
      { date: '2025-03-10T20:00:00.000Z', text: 'השיעור על מפת הדרכים גרם לי להבין כמה אני חיה על אוטומט.' },
    ],
  },
  {
    userId: 'tomer_gur_gmail_com',
    email: 'tomer.gur@gmail.com',
    name: 'תומר',
    completedPhases: [1],
    currentPhase: 2,
    status: 'active',
    startedAt: '2025-05-20T14:00:00.000Z',
    completedAt: null,
    answers: {
      'layer-rating': { body: 6, emotion: 5, thought: 7, energy: 4 },
    },
    goals: ['להבין את ההבדל בין תגובה לבחירה'],
    notes: [],
    journal: [
      { date: '2025-05-20T15:00:00.000Z', text: 'השיעור הראשון מעניין. הדירוג העצמי עזר לי לראות איפה אני.' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────
// Seed each user
// ─────────────────────────────────────────────────────────────

for (const user of users) {
  console.log(`Seeding user: ${user.name} (${user.userId})`)

  // Profile
  userStore.createProfile(user.userId, {
    email: user.email,
    name: user.name,
    role: 'participant',
    source: 'seed',
  })

  // Course status
  courseStatusStore.updateCourseStatus(user.userId, {
    completedPhases: user.completedPhases,
    currentPhase: user.currentPhase,
    startedAt: user.startedAt,
    completedAt: user.completedAt,
    answers: user.answers,
    goals: user.goals,
    notes: user.notes,
    phaseHistory: user.completedPhases.map((p) => ({
      phaseId: p,
      action: 'completed',
      timestamp: user.startedAt,
    })),
  })

  // Activity log
  activityLogStore.logEvent(user.userId, 'user_created', {
    metadata: { source: 'seed_script' },
  })
  activityLogStore.logEvent(user.userId, 'course_started', {
    metadata: { startedAt: user.startedAt },
  })

  for (const phaseId of user.completedPhases) {
    activityLogStore.logEvent(user.userId, 'phase_completed', { phase: phaseId })
  }

  // Save journal entries as content
  if (user.journal && user.journal.length > 0) {
    for (const entry of user.journal) {
      const contentId = contentStore.generateContentId()
      contentStore.saveContent(user.userId, contentId, {
        text: entry.text,
        type: 'journal_entry',
      }, {
        contentType: 'journal',
        title: `יומן - ${new Date(entry.date).toLocaleDateString('he-IL')}`,
        createdAt: entry.date,
        source: 'user_input',
        relatedPhase: null,
        tags: ['journal'],
      })
      contentStore.saveRawContent(user.userId, contentId, entry.text, 'raw.txt')
      activityLogStore.logEvent(user.userId, 'content_added', { contentId })
    }
  }

  // Save heart writing as content if exists
  if (user.answers['heart-writing']) {
    const contentId = contentStore.generateContentId()
    contentStore.saveContent(user.userId, contentId, {
      text: user.answers['heart-writing'],
      type: 'heart_writing',
    }, {
      contentType: 'writing',
      title: 'כתיבה אינטואיטיבית - שיעור 5',
      source: 'user_input',
      relatedPhase: 5,
      relatedExercise: 'heart-protocol',
      tags: ['heart-writing', 'exercise'],
    })
    contentStore.saveRawContent(user.userId, contentId, user.answers['heart-writing'], 'raw.txt')
  }
}

console.log('\nSample data seeded successfully!')
console.log(`Users created: ${users.length}`)
console.log('Run "npm run dev" and navigate to /admin to see the data.')
