// Course data storage — manages data/users/{userId}/course.json
// Single file holds: progress, answers, goals, notes, and content items.
// No duplication — everything course-related lives here.

import path from 'path'
import crypto from 'crypto'
import { getUserDir, ensureDir } from './dataDir.js'
import { readJson, writeJson } from './jsonStore.js'

const TOTAL_PHASES = 6

function coursePath(userId) {
  return path.join(getUserDir(userId), 'course.json')
}

export function getCourseStatus(userId) {
  return readJson(coursePath(userId))
}

function deriveStatus(completedPhases) {
  if (!completedPhases || completedPhases.length === 0) return 'not_started'
  if (completedPhases.length >= TOTAL_PHASES) return 'completed'
  return 'active'
}

export function createCourseStatus(userId) {
  ensureDir(getUserDir(userId))
  const data = { startedAt: new Date().toISOString() }
  writeJson(coursePath(userId), data)
  return data
}

export function updateCourseStatus(userId, updates) {
  const filePath = coursePath(userId)
  let existing = readJson(filePath) || {}
  const merged = { ...existing, ...updates }

  // Clean up empty/default fields
  const completed = merged.completedPhases || []
  if (completed.length > 0) merged.completedPhases = completed
  else delete merged.completedPhases

  merged.status = deriveStatus(completed)
  if (merged.status === 'not_started') delete merged.status

  if (completed.length >= TOTAL_PHASES && !merged.completedAt) {
    merged.completedAt = new Date().toISOString()
  }

  if (merged.phaseHistory && merged.phaseHistory.length === 0) delete merged.phaseHistory
  if (merged.completedExercises && merged.completedExercises.length === 0) delete merged.completedExercises
  if (merged.answers && Object.keys(merged.answers).length === 0) delete merged.answers
  if (merged.goals && merged.goals.length === 0) delete merged.goals
  if (merged.notes && merged.notes.length === 0) delete merged.notes
  if (merged.content && merged.content.length === 0) delete merged.content
  delete merged.totalPhases
  delete merged.progressPercentage
  delete merged.userId

  writeJson(filePath, merged)
  return { ...merged, totalPhases: TOTAL_PHASES, progressPercentage: Math.round((completed.length / TOTAL_PHASES) * 100) }
}

export function startPhase(userId, phaseId) {
  const existing = getCourseStatus(userId) || createCourseStatus(userId)
  const history = [...(existing.phaseHistory || []), { p: phaseId, a: 's', t: new Date().toISOString() }]
  return updateCourseStatus(userId, { currentPhase: phaseId, phaseHistory: history, startedAt: existing.startedAt || new Date().toISOString() })
}

export function completePhase(userId, phaseId) {
  const existing = getCourseStatus(userId) || createCourseStatus(userId)
  const completedPhases = [...new Set([...(existing.completedPhases || []), phaseId])]
  const history = [...(existing.phaseHistory || []), { p: phaseId, a: 'c', t: new Date().toISOString() }]
  return updateCourseStatus(userId, { completedPhases, phaseHistory: history })
}

export function completeExercise(userId, exerciseId, answer) {
  const existing = getCourseStatus(userId) || createCourseStatus(userId)
  const completedExercises = [...new Set([...(existing.completedExercises || []), exerciseId])]
  const answers = { ...(existing.answers || {}) }
  if (answer !== undefined && answer !== null) answers[exerciseId] = answer
  return updateCourseStatus(userId, { completedExercises, answers })
}

export function saveAnswer(userId, key, value) {
  const existing = getCourseStatus(userId) || createCourseStatus(userId)
  const answers = { ...(existing.answers || {}), [key]: value }
  return updateCourseStatus(userId, { answers })
}

export function saveGoals(userId, goals) {
  return updateCourseStatus(userId, { goals })
}

export function addNote(userId, note) {
  const existing = getCourseStatus(userId) || createCourseStatus(userId)
  const notes = [...(existing.notes || []), { text: note, at: new Date().toISOString() }]
  return updateCourseStatus(userId, { notes })
}

// Content is stored inside course.json as an array
export function addContent(userId, contentData, metadata = {}) {
  const existing = getCourseStatus(userId) || createCourseStatus(userId)
  const contentList = existing.content || []

  const id = `c${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`
  const entry = { id, type: metadata.contentType || 'text' }
  if (metadata.title) entry.title = metadata.title
  if (contentData.text) entry.text = contentData.text
  if (metadata.relatedPhase) entry.phase = metadata.relatedPhase
  if (metadata.relatedExercise) entry.exercise = metadata.relatedExercise
  if (metadata.tags && metadata.tags.length > 0) entry.tags = metadata.tags
  entry.at = metadata.createdAt || new Date().toISOString()

  contentList.push(entry)
  updateCourseStatus(userId, { content: contentList })
  return entry
}

export function listUserContent(userId) {
  const existing = getCourseStatus(userId)
  return (existing?.content || []).map(c => ({ contentId: c.id, metadata: c }))
}

export function getContent(userId, contentId) {
  const existing = getCourseStatus(userId)
  const item = (existing?.content || []).find(c => c.id === contentId)
  return { content: item || null, metadata: item || null }
}

// Keep generateContentId for backward compat
export function generateContentId() {
  return `c${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`
}
