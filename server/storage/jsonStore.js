// Low-level JSON file read/write helpers with atomic writes and safe error handling.

import fs from 'fs'
import path from 'path'
import { ensureDir } from './dataDir.js'
import crypto from 'crypto'

// Remove null/undefined values to save space
function stripNulls(obj) {
  if (Array.isArray(obj)) return obj.map(stripNulls)
  if (obj && typeof obj === 'object') {
    const cleaned = {}
    for (const [k, v] of Object.entries(obj)) {
      if (v === null || v === undefined) continue
      cleaned[k] = stripNulls(v)
    }
    return cleaned
  }
  return obj
}

// Read a JSON file. Returns null if it doesn't exist or is corrupt.
export function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error(`Failed to read JSON: ${filePath}`, err.message)
    return null
  }
}

// Atomic write: write to temp file then rename. Strips nulls, compact format.
export function writeJson(filePath, data) {
  try {
    ensureDir(path.dirname(filePath))
    const cleaned = stripNulls(data)
    const json = JSON.stringify(cleaned, null, 1)

    const tmpPath = `${filePath}.${crypto.randomBytes(4).toString('hex')}.tmp`
    fs.writeFileSync(tmpPath, json, 'utf-8')
    fs.renameSync(tmpPath, filePath)
    return true
  } catch (err) {
    console.error(`Failed to write JSON: ${filePath}`, err.message)
    try {
      const dir = path.dirname(filePath)
      const base = path.basename(filePath)
      fs.readdirSync(dir).filter(f => f.startsWith(base) && f.endsWith('.tmp'))
        .forEach(f => fs.unlinkSync(path.join(dir, f)))
    } catch { /* ignore */ }
    return false
  }
}

// Update specific fields in a JSON file (merge). Preserves existing data.
export function updateJson(filePath, updates) {
  const existing = readJson(filePath) || {}
  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() }
  return writeJson(filePath, merged)
}

// Append an entry to a JSON array file.
export function appendToJsonArray(filePath, entry) {
  let arr = readJson(filePath)
  if (!Array.isArray(arr)) arr = []
  arr.push(entry)
  return writeJson(filePath, arr)
}

// List subdirectories in a directory
export function listSubdirs(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) return []
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
  } catch {
    return []
  }
}

// List files in a directory
export function listFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) return []
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(d => d.isFile())
      .map(d => d.name)
  } catch {
    return []
  }
}
