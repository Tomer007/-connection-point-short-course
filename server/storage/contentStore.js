// Content store — delegates to courseStatusStore since content lives in course.json.

import { addContent, listUserContent, getContent, generateContentId } from './courseStatusStore.js'

export { generateContentId }

export function saveContent(userId, contentId, contentData, metadata = {}) {
  return addContent(userId, contentData, metadata)
}

export function saveRawContent() { return null }

export { listUserContent, getContent }

export function updateContentMetadata() { return null }
export function deleteContent() { return false }
