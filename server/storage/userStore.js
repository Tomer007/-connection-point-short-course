// User profile storage — manages data/users/{userId}/profile.json
// Only identity and account-level info. No course data here.

import path from 'path'
import { getUserDir, ensureDir, sanitizeId } from './dataDir.js'
import { readJson, writeJson } from './jsonStore.js'

function profilePath(userId) {
  return path.join(getUserDir(userId), 'profile.json')
}

export function getProfile(userId) {
  return readJson(profilePath(userId))
}

export function createProfile(userId, data = {}) {
  const safeId = sanitizeId(userId)
  ensureDir(getUserDir(userId))

  const now = new Date().toISOString()
  const profile = { id: safeId }
  if (data.name) profile.name = data.name
  if (data.email) profile.email = data.email
  profile.createdAt = now
  profile.lastLoginAt = now
  if (data.role && data.role !== 'participant') profile.role = data.role
  if (data.source && data.source !== 'web') profile.source = data.source

  writeJson(profilePath(userId), profile)
  return profile
}

export function updateProfile(userId, updates) {
  const filePath = profilePath(userId)
  const existing = readJson(filePath)
  if (!existing) return createProfile(userId, updates)
  const merged = { ...existing, ...updates, id: existing.id }
  if (merged.role === 'participant') delete merged.role
  if (merged.source === 'web') delete merged.source
  writeJson(filePath, merged)
  return merged
}

export function recordLogin(userId) {
  return updateProfile(userId, { lastLoginAt: new Date().toISOString() })
}

export function ensureProfile(userId, data = {}) {
  const existing = getProfile(userId)
  if (existing) return updateProfile(userId, { lastLoginAt: new Date().toISOString() })
  return createProfile(userId, data)
}
