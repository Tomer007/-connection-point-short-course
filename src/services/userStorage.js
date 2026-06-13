// שירות אחסון משתמשים - שומר נתונים בתיקיה ייעודית לכל משתמש ב-localStorage.
// מבנה: users/{email-hash}/progress.json + users/{email-hash}/data.json
// כל שמירה כוללת metadata: timestamp, action, version.

const STORAGE_VERSION = '1.0'

function hashEmail(email) {
  // יצירת מזהה בטוח מהאימייל (ללא תווים מיוחדים)
  return email.toLowerCase().replace(/[^a-z0-9]/g, '_')
}

function getUserKey(email, file) {
  return `cp_users/${hashEmail(email)}/${file}`
}

function createMetadata(action) {
  return {
    timestamp: new Date().toISOString(),
    action,
    version: STORAGE_VERSION,
  }
}

// קריאת קובץ מתיקיית המשתמש
export function readUserFile(email, file) {
  try {
    const key = getUserKey(email, file)
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// כתיבה לקובץ בתיקיית המשתמש עם metadata
export function writeUserFile(email, file, data, action = 'update') {
  const key = getUserKey(email, file)
  const entry = {
    ...data,
    _meta: createMetadata(action),
  }
  localStorage.setItem(key, JSON.stringify(entry))
  return entry
}

// --- Progress (התקדמות בקורס) ---

export function getUserProgress(email) {
  const saved = readUserFile(email, 'progress.json')
  if (saved) {
    const { _meta, ...rest } = saved
    return rest
  }
  return { completed: [], lastLesson: null, startedAt: null }
}

export function saveUserProgress(email, progress, action = 'progress_update') {
  return writeUserFile(email, 'progress.json', progress, action)
}

// --- User Data (נתוני תרגול) ---

export function getUserData(email) {
  const saved = readUserFile(email, 'data.json')
  if (saved) {
    const { _meta, ...rest } = saved
    return rest
  }
  return null
}

export function saveUserData(email, data, action = 'data_update') {
  return writeUserFile(email, 'data.json', data, action)
}

// --- History log (לוג שינויים) ---

export function appendUserLog(email, entry) {
  const key = getUserKey(email, 'log.json')
  let log = []
  try {
    const raw = localStorage.getItem(key)
    if (raw) log = JSON.parse(raw)
  } catch {
    log = []
  }
  log.push({
    ...entry,
    _meta: createMetadata(entry.action || 'log_entry'),
  })
  localStorage.setItem(key, JSON.stringify(log))
}

// --- ניהול ---

export function listUserFiles(email) {
  const prefix = `cp_users/${hashEmail(email)}/`
  const files = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith(prefix)) {
      files.push(key.replace(prefix, ''))
    }
  }
  return files
}

export function deleteUserData(email) {
  const prefix = `cp_users/${hashEmail(email)}/`
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith(prefix)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k))
}
