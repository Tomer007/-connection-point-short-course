// Configurable data directory — reads from DATA_DIR env var.
// Defaults to ./data in development. On Render, set DATA_DIR to the persistent disk mount path.

import path from 'path'
import fs from 'fs'

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), 'data')

export function getDataDir() {
  return DATA_DIR
}

export function getUsersDir() {
  return path.join(DATA_DIR, 'users')
}

export function getUserDir(userId) {
  const safe = sanitizeId(userId)
  return path.join(getUsersDir(), safe)
}

export function getUserContentDir(userId, contentId) {
  const safeUser = sanitizeId(userId)
  const safeContent = sanitizeId(contentId)
  return path.join(getUsersDir(), safeUser, 'content', safeContent)
}

// Sanitize IDs to prevent directory traversal and unsafe characters
export function sanitizeId(id) {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid ID: must be a non-empty string')
  }
  // Remove path separators and dangerous patterns
  const sanitized = id
    .toLowerCase()
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[^a-z0-9._@-]/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 128)

  if (!sanitized || sanitized === '.' || sanitized === '..') {
    throw new Error('Invalid ID after sanitization')
  }
  return sanitized
}

// Ensure a directory exists (recursive)
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Initialize data directory on startup
export function initDataDir() {
  ensureDir(DATA_DIR)
  ensureDir(getUsersDir())
  console.log(`Data directory initialized: ${DATA_DIR}`)
}
