// Activity log storage — manages data/users/{userId}/log.json
// Compact format: short keys, no redundant userId, minimal fields per entry.

import path from 'path'
import crypto from 'crypto'
import { getUserDir, ensureDir } from './dataDir.js'
import { readJson, appendToJsonArray } from './jsonStore.js'

function logPath(userId) {
  return path.join(getUserDir(userId), 'log.json')
}

// Append a compact event entry
// Format: { e: eventType, t: timestamp, ...optional short fields }
export function logEvent(userId, eventType, eventData = {}) {
  ensureDir(getUserDir(userId))

  const entry = { e: eventType, t: new Date().toISOString() }
  if (eventData.phase) entry.p = eventData.phase
  if (eventData.exerciseId) entry.ex = eventData.exerciseId
  if (eventData.contentId) entry.c = eventData.contentId
  if (eventData.metadata) entry.m = eventData.metadata

  appendToJsonArray(logPath(userId), entry)
  return entry
}

// Get full activity log (expanded format for reading)
export function getActivityLog(userId) {
  const log = readJson(logPath(userId))
  if (!Array.isArray(log)) return []
  return log.map(expandEntry)
}

// Get recent activity
export function getRecentActivity(userId, limit = 50) {
  const log = getActivityLog(userId)
  return log.slice(-limit)
}

// Expand compact entry to full format for API responses
function expandEntry(entry) {
  return {
    eventType: entry.e,
    timestamp: entry.t,
    phase: entry.p || null,
    exerciseId: entry.ex || null,
    contentId: entry.c || null,
    metadata: entry.m || null,
  }
}

export const EVENT_TYPES = [
  'user_created', 'user_login', 'course_started',
  'phase_started', 'phase_completed', 'exercise_completed',
  'content_added', 'content_updated', 'user_answer_saved',
  'course_completed', 'practice_updated', 'note_added', 'goal_saved',
]
