// Admin metrics service — reads from disk-based API (server) with localStorage fallback.
// The admin dashboard calls these functions to get data.

import { lessons } from '../data/course.js'

const TOTAL_LESSONS = lessons.length

// ─────────────────────────────────────────────────────────────
// Server-based data fetching (disk storage)
// ─────────────────────────────────────────────────────────────

// Fetch all users from disk via admin API
export async function fetchUsersFromDisk() {
  try {
    const res = await fetch('/api/admin/users', { credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    return data.users || []
  } catch {
    return null
  }
}

// Fetch metrics from disk via admin API
export async function fetchMetricsFromDisk() {
  try {
    const res = await fetch('/api/admin/metrics', { credentials: 'include' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Fetch single user detail from disk via admin API
export async function fetchUserDetail(userId) {
  try {
    const res = await fetch(`/api/admin/users/${userId}`, { credentials: 'include' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// LocalStorage-based fallback (for when server data is empty)
// ─────────────────────────────────────────────────────────────

// Discover all users stored in localStorage
export function getAllUsersFromLocalStorage() {
  const users = new Map()
  const prefix = 'cp_users/'

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      const parts = key.replace(prefix, '').split('/')
      const hash = parts[0]
      const file = parts.slice(1).join('/')

      if (!users.has(hash)) {
        users.set(hash, { hash, files: {} })
      }
      try {
        const raw = localStorage.getItem(key)
        users.get(hash).files[file] = raw ? JSON.parse(raw) : null
      } catch {
        users.get(hash).files[file] = null
      }
    }
  }

  return Array.from(users.values())
}

// ─────────────────────────────────────────────────────────────
// Unified getParticipants — tries disk first, then localStorage
// ─────────────────────────────────────────────────────────────

export async function getParticipantsAsync() {
  // Try disk storage first
  const diskUsers = await fetchUsersFromDisk()
  if (diskUsers && diskUsers.length > 0) {
    return diskUsers.map(mapDiskUserToParticipant)
  }

  // Fallback to localStorage
  return getParticipantsFromLocalStorage()
}

function mapDiskUserToParticipant(user) {
  const profile = user.profile || {}
  const status = user.courseStatus || {}

  const completedPhases = status.completedPhases || []
  const completedCount = completedPhases.length
  const progressPercent = TOTAL_LESSONS > 0 ? Math.round((completedCount / TOTAL_LESSONS) * 100) : 0
  const isCompleted = completedCount >= TOTAL_LESSONS
  const isActive = completedCount > 0 && !isCompleted

  const currentPhaseId = status.currentPhase || (completedPhases.length > 0 ? Math.max(...completedPhases) : 0)
  const currentLesson = lessons.find((l) => l.id === currentPhaseId) || lessons[0]
  const currentPhase = currentLesson?.sectionId || 'intro'

  return {
    hash: user.userId,
    email: profile.email || user.userId.replace(/_/g, '.'),
    name: profile.name || null,
    completed: completedCount,
    totalLessons: TOTAL_LESSONS,
    progressPercent,
    isCompleted,
    isActive,
    currentPhase,
    startedAt: status.startedAt || profile.createdAt || null,
    lastActivity: status.updatedAt || profile.updatedAt || null,
    practice: status.answers || {},
    logEntries: [],
    rawProgress: { completed: completedPhases },
    rawData: status.answers || {},
    courseStatus: status,
    profile,
  }
}

// ─────────────────────────────────────────────────────────────
// Synchronous versions (for backward compatibility with existing components)
// These read from localStorage only — used when async isn't available.
// ─────────────────────────────────────────────────────────────

export function getParticipants() {
  return getParticipantsFromLocalStorage()
}

function getParticipantsFromLocalStorage() {
  const users = getAllUsersFromLocalStorage()

  return users.map((user) => {
    const progress = user.files['progress.json'] || {}
    const data = user.files['data.json'] || {}
    const log = user.files['log.json'] || []
    const { _meta: progressMeta, ...progressData } = progress
    const { _meta: dataMeta, ...userData } = data

    const completed = progressData.completed || []
    const completedCount = completed.length
    const totalLessons = TOTAL_LESSONS
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    const isCompleted = completedCount >= totalLessons
    const isActive = completedCount > 0 && !isCompleted

    const lastCompletedId = completed.length > 0 ? Math.max(...completed) : 0
    const currentLesson = lessons.find((l) => l.id === lastCompletedId) || lessons[0]
    const currentPhase = currentLesson?.sectionId || 'intro'

    const startedAt = progressData.startedAt || progressMeta?.timestamp || null
    const lastActivity = progressMeta?.timestamp || dataMeta?.timestamp || null

    const logEntries = Array.isArray(log)
      ? log.map((entry) => ({
          action: entry.action || entry._meta?.action || 'unknown',
          timestamp: entry._meta?.timestamp || null,
        }))
      : []

    return {
      hash: user.hash,
      email: userData.email || user.hash.replace(/_/g, '.'),
      name: userData.name || null,
      completed: completedCount,
      totalLessons,
      progressPercent,
      isCompleted,
      isActive,
      currentPhase,
      startedAt,
      lastActivity,
      practice: userData,
      logEntries,
      rawProgress: progressData,
      rawData: userData,
    }
  })
}

// Calculate aggregate metrics (sync version, localStorage)
export function getCourseMetrics() {
  const participants = getParticipants()
  const total = participants.length
  const active = participants.filter((p) => p.isActive).length
  const completed = participants.filter((p) => p.isCompleted).length
  const startedNotFinished = participants.filter((p) => p.completed > 0 && !p.isCompleted).length

  const avgProgress =
    total > 0 ? Math.round(participants.reduce((s, p) => s + p.progressPercent, 0) / total) : 0
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    total,
    active,
    completed,
    startedNotFinished,
    avgProgress,
    completionRate,
  }
}

// Calculate phase-level metrics (sync version, localStorage)
export function getPhaseMetrics() {
  const participants = getParticipants()
  const total = participants.length

  const phases = lessons.map((lesson) => {
    const inPhase = participants.filter((p) => p.currentPhase === lesson.sectionId).length
    const completedPhase = participants.filter((p) =>
      (p.rawProgress.completed || []).includes(lesson.id),
    ).length
    const percentage = total > 0 ? Math.round((inPhase / total) * 100) : 0

    const prevLesson = lessons.find((l) => l.id === lesson.id - 1)
    let dropOff = 0
    if (prevLesson) {
      const completedPrev = participants.filter((p) =>
        (p.rawProgress.completed || []).includes(prevLesson.id),
      ).length
      dropOff = completedPrev - completedPhase
    }

    return {
      id: lesson.id,
      sectionId: lesson.sectionId,
      title: lesson.title,
      eyebrow: lesson.eyebrow,
      participantsInPhase: inPhase,
      percentage,
      completedPhase,
      completionPercentage: total > 0 ? Math.round((completedPhase / total) * 100) : 0,
      dropOff: Math.max(0, dropOff),
      dropOffRate: total > 0 ? Math.round((Math.max(0, dropOff) / total) * 100) : 0,
    }
  })

  return phases
}

// Latest joined participants (sync version, localStorage)
export function getLatestParticipants(limit = 10) {
  const participants = getParticipants()
  return participants
    .filter((p) => p.startedAt)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, limit)
}

// ─────────────────────────────────────────────────────────────
// Async versions that prefer disk data
// ─────────────────────────────────────────────────────────────

export async function getCourseMetricsAsync() {
  const diskMetrics = await fetchMetricsFromDisk()
  if (diskMetrics && diskMetrics.total > 0) {
    return diskMetrics
  }
  return getCourseMetrics()
}

export async function getPhaseMetricsAsync() {
  // Phase metrics require per-user data; use disk users if available
  const diskUsers = await fetchUsersFromDisk()
  if (diskUsers && diskUsers.length > 0) {
    const participants = diskUsers.map(mapDiskUserToParticipant)
    const total = participants.length

    return lessons.map((lesson) => {
      const inPhase = participants.filter((p) => p.currentPhase === lesson.sectionId).length
      const completedPhase = participants.filter((p) =>
        (p.rawProgress.completed || []).includes(lesson.id),
      ).length
      const percentage = total > 0 ? Math.round((inPhase / total) * 100) : 0

      const prevLesson = lessons.find((l) => l.id === lesson.id - 1)
      let dropOff = 0
      if (prevLesson) {
        const completedPrev = participants.filter((p) =>
          (p.rawProgress.completed || []).includes(prevLesson.id),
        ).length
        dropOff = completedPrev - completedPhase
      }

      return {
        id: lesson.id,
        sectionId: lesson.sectionId,
        title: lesson.title,
        eyebrow: lesson.eyebrow,
        participantsInPhase: inPhase,
        percentage,
        completedPhase,
        completionPercentage: total > 0 ? Math.round((completedPhase / total) * 100) : 0,
        dropOff: Math.max(0, dropOff),
        dropOffRate: total > 0 ? Math.round((Math.max(0, dropOff) / total) * 100) : 0,
      }
    })
  }
  return getPhaseMetrics()
}

export async function getLatestParticipantsAsync(limit = 10) {
  const participants = await getParticipantsAsync()
  return participants
    .filter((p) => p.startedAt)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, limit)
}
