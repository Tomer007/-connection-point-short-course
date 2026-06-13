import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'

import { initDataDir, getUsersDir, getUserDir, sanitizeId } from './storage/dataDir.js'
import { readJson, listSubdirs } from './storage/jsonStore.js'
import { userStore, courseStatusStore, contentStore, activityLogStore } from './storage/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-me'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'tomer'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'tomer'
const COURSE_COUPON = process.env.COURSE_COUPON || 'annayael'

// Hash the password at startup for secure comparison
const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10)

// Initialize data directory
initDataDir()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://connection-point-course.onrender.com',
    'https://connection-point-short-course.onrender.com',
  ],
  credentials: true,
}))
app.use(express.json({ limit: '5mb' }))
app.use(cookieParser())

// ─────────────────────────────────────────────────────────────
// Middleware: verify admin JWT token
// ─────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' })
    }
    req.admin = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ─────────────────────────────────────────────────────────────
// Admin Auth Routes
// ─────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }

  if (username !== ADMIN_USERNAME || !bcrypt.compareSync(password, passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' })

  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  })

  res.json({ success: true, username })
})

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token')
  res.json({ success: true })
})

app.get('/api/admin/verify', requireAdmin, (req, res) => {
  res.json({ authenticated: true, username: req.admin.username })
})

// ─────────────────────────────────────────────────────────────
// Course Access (coupon validation)
// ─────────────────────────────────────────────────────────────
app.post('/api/coupon/validate', (req, res) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'Code is required' })
  if (code.trim().toLowerCase() !== COURSE_COUPON.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid coupon code' })
  }
  res.json({ valid: true })
})

// ─────────────────────────────────────────────────────────────
// User Data API (called by frontend to sync user data to disk)
// ─────────────────────────────────────────────────────────────

// POST /api/users/sync — sync user profile, course status, and practice data
app.post('/api/users/sync', (req, res) => {
  try {
    const { userId, email, name, completed, practice, source } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Sanitize
    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    // Ensure profile
    const profile = userStore.ensureProfile(safeId, { email, name, source })

    // Update course status
    const courseStatus = courseStatusStore.updateCourseStatus(safeId, {
      completedPhases: completed || [],
      currentPhase: completed && completed.length > 0 ? Math.max(...completed) : null,
    })

    // Log the sync event
    activityLogStore.logEvent(safeId, 'user_login', {
      metadata: { source: 'frontend_sync' },
    })

    res.json({ success: true, profile, courseStatus })
  } catch (err) {
    console.error('Sync error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/users/:userId/progress — update course progress
app.post('/api/users/:userId/progress', (req, res) => {
  try {
    const { userId } = req.params
    const { completed, currentPhase, practice } = req.body

    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const courseStatus = courseStatusStore.updateCourseStatus(safeId, {
      completedPhases: completed || [],
      currentPhase: currentPhase || null,
    })

    // Log progress update
    activityLogStore.logEvent(safeId, 'practice_updated', {
      phase: currentPhase,
      metadata: { completedCount: (completed || []).length },
    })

    res.json({ success: true, courseStatus })
  } catch (err) {
    console.error('Progress update error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/users/:userId/phase-complete — mark a phase as completed
app.post('/api/users/:userId/phase-complete', (req, res) => {
  try {
    const { userId } = req.params
    const { phaseId } = req.body

    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const courseStatus = courseStatusStore.completePhase(safeId, phaseId)
    activityLogStore.logEvent(safeId, 'phase_completed', { phase: phaseId })

    res.json({ success: true, courseStatus })
  } catch (err) {
    console.error('Phase complete error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/users/:userId/exercise-complete — mark an exercise as completed
app.post('/api/users/:userId/exercise-complete', (req, res) => {
  try {
    const { userId } = req.params
    const { exerciseId, answer } = req.body

    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const courseStatus = courseStatusStore.completeExercise(safeId, exerciseId, answer)
    activityLogStore.logEvent(safeId, 'exercise_completed', { exerciseId })

    res.json({ success: true, courseStatus })
  } catch (err) {
    console.error('Exercise complete error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/users/:userId/answer — save an answer
app.post('/api/users/:userId/answer', (req, res) => {
  try {
    const { userId } = req.params
    const { key, value } = req.body

    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const courseStatus = courseStatusStore.saveAnswer(safeId, key, value)
    activityLogStore.logEvent(safeId, 'user_answer_saved', {
      metadata: { key },
    })

    res.json({ success: true, courseStatus })
  } catch (err) {
    console.error('Answer save error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/users/:userId/content — save user content
app.post('/api/users/:userId/content', (req, res) => {
  try {
    const { userId } = req.params
    const { contentData, metadata, rawText } = req.body

    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const contentId = contentStore.generateContentId()
    const result = contentStore.saveContent(safeId, contentId, contentData || {}, metadata || {})

    if (rawText) {
      contentStore.saveRawContent(safeId, contentId, rawText)
    }

    activityLogStore.logEvent(safeId, 'content_added', {
      contentId,
      phase: metadata?.relatedPhase || null,
    })

    res.json({ success: true, contentId, ...result })
  } catch (err) {
    console.error('Content save error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/users/:userId/goals — save goals
app.post('/api/users/:userId/goals', (req, res) => {
  try {
    const { userId } = req.params
    const { goals } = req.body

    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const courseStatus = courseStatusStore.saveGoals(safeId, goals)
    activityLogStore.logEvent(safeId, 'goal_saved', { metadata: { goals } })

    res.json({ success: true, courseStatus })
  } catch (err) {
    console.error('Goals save error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/users/:userId/notes — add a note
app.post('/api/users/:userId/notes', (req, res) => {
  try {
    const { userId } = req.params
    const { note } = req.body

    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const courseStatus = courseStatusStore.addNote(safeId, note)
    activityLogStore.logEvent(safeId, 'note_added')

    res.json({ success: true, courseStatus })
  } catch (err) {
    console.error('Note add error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─────────────────────────────────────────────────────────────
// Admin Data Reading Routes (protected)
// ─────────────────────────────────────────────────────────────

// GET /api/admin/users — list all users
app.get('/api/admin/users', requireAdmin, (req, res) => {
  try {
    const usersDir = getUsersDir()
    const userIds = listSubdirs(usersDir)

    const users = userIds.map((id) => {
      const profile = readJson(path.join(usersDir, id, 'profile.json'))
      const courseStatus = readJson(path.join(usersDir, id, 'course.json'))
      return {
        userId: id,
        profile: profile || { userId: id },
        courseStatus: courseStatus || null,
      }
    })

    res.json({ users, total: users.length })
  } catch (err) {
    console.error('Admin users list error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/admin/users/:userId — get full user data
app.get('/api/admin/users/:userId', requireAdmin, (req, res) => {
  try {
    const { userId } = req.params
    let safeId
    try {
      safeId = sanitizeId(userId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const userDir = getUserDir(safeId)
    const profile = readJson(path.join(userDir, 'profile.json'))
    const courseStatus = readJson(path.join(userDir, 'course.json'))
    const activityLog = activityLogStore.getRecentActivity(safeId, 100)
    const contentList = contentStore.listUserContent(safeId)

    if (!profile && !courseStatus) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      userId: safeId,
      profile: profile || null,
      courseStatus: courseStatus || null,
      activityLog,
      content: contentList,
    })
  } catch (err) {
    console.error('Admin user detail error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/admin/users/:userId/content/:contentId — get specific content
app.get('/api/admin/users/:userId/content/:contentId', requireAdmin, (req, res) => {
  try {
    const { userId, contentId } = req.params
    let safeUserId, safeContentId
    try {
      safeUserId = sanitizeId(userId)
      safeContentId = sanitizeId(contentId)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }

    const result = contentStore.getContent(safeUserId, safeContentId)
    if (!result.content && !result.metadata) {
      return res.status(404).json({ error: 'Content not found' })
    }

    res.json(result)
  } catch (err) {
    console.error('Admin content detail error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/admin/metrics — aggregate metrics from disk data
app.get('/api/admin/metrics', requireAdmin, (req, res) => {
  try {
    const usersDir = getUsersDir()
    const userIds = listSubdirs(usersDir)
    const totalPhases = 6

    let total = userIds.length
    let active = 0
    let completed = 0
    let notStarted = 0
    let totalProgress = 0

    const phaseCount = {}

    userIds.forEach((id) => {
      const status = readJson(path.join(usersDir, id, 'course.json'))
      if (!status) {
        notStarted++
        return
      }

      const completedPhases = status.completedPhases || []
      const progress = Math.round((completedPhases.length / totalPhases) * 100)
      totalProgress += progress

      if (status.status === 'completed' || completedPhases.length >= totalPhases) {
        completed++
      } else if (completedPhases.length > 0) {
        active++
      } else {
        notStarted++
      }

      // Track current phase
      if (status.currentPhase) {
        phaseCount[status.currentPhase] = (phaseCount[status.currentPhase] || 0) + 1
      }
    })

    const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const startedNotFinished = active

    res.json({
      total,
      active,
      completed,
      notStarted,
      startedNotFinished,
      avgProgress,
      completionRate,
      phaseCount,
    })
  } catch (err) {
    console.error('Admin metrics error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─────────────────────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Admin API server running on http://localhost:${PORT}`)
  console.log(`Data directory: ${process.env.DATA_DIR || './data'}`)
})
