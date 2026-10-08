import path from 'path';

/**
 * Sanitize a filename to prevent path traversal and ensure safe storage keys
 * @param {string} originalName 
 * @returns {string} Safe filename
 */
export function sanitizeFilename(originalName) {
  if (!originalName) return 'unnamed_file';
  
  // Extract base filename without directories
  const base = path.basename(originalName);
  
  // Replace dangerous characters with underscores, preserve letters, digits, dots, dashes, underscores
  const clean = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Prevent double dots or starting dot
  return clean.replace(/\.{2,}/g, '.').replace(/^\./, 'file.');
}

/**
 * Determine modality from MIME type and filename extension
 * @param {string} mimeType 
 * @param {string} filename 
 * @returns {'image' | 'pdf' | 'document' | 'audio' | 'video' | 'text'}
 */
export function detectModality(mimeType, filename) {
  const mime = (mimeType || '').toLowerCase();
  const ext = path.extname(filename || '').toLowerCase();

  if (mime === 'application/pdf' || ext === '.pdf') {
    return 'pdf';
  }
  if (mime.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
    return 'image';
  }
  if (mime.startsWith('audio/') || ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'].includes(ext)) {
    return 'audio';
  }
  if (mime.startsWith('video/') || ['.mp4', '.mov', '.webm', '.mkv', '.avi'].includes(ext)) {
    return 'video';
  }
  if (mime.startsWith('text/') || ['.txt', '.md', '.csv', '.json', '.log'].includes(ext)) {
    return 'text';
  }
  if (
    mime.includes('word') || 
    mime.includes('officedocument') || 
    ['.doc', '.docx', '.rtf'].includes(ext)
  ) {
    return 'document';
  }

  return 'text';
}

