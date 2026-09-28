import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

/**
 * Format bytes into human-readable string
 * @param {number} bytes 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes)) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);

  return parseFloat((bytes / Math.pow(k, idx)).toFixed(dm)) + ' ' + sizes[idx];
}

/**
 * Sanitize filename to prevent path traversal and shell injection
 * @param {string} originalName 
 * @returns {string}
 */
export function sanitizeFilename(originalName) {
  if (!originalName) return 'file';
  // Remove paths
  const basename = path.basename(originalName);
  // Replace unsafe characters
  return basename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Generate a unique random ID
 * @returns {string}
 */
export function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Calculate file compression statistics
 * @param {number} originalSize 
 * @param {number} compressedSize 
 * @returns {Object}
 */
export function calculateCompressionStats(originalSize, compressedSize) {
  const isReduced = compressedSize < originalSize;
  const finalCompressedSize = isReduced ? compressedSize : originalSize;
  const savedBytes = isReduced ? originalSize - compressedSize : 0;
  
  let percentageReduced = 0;
  if (originalSize > 0 && isReduced) {
    percentageReduced = parseFloat(((savedBytes / originalSize) * 100).toFixed(1));
  }

  return {
    originalSize,
    compressedSize: finalCompressedSize,
    savedBytes,
    percentageReduced,
    wasReduced: isReduced,
    note: isReduced ? null : 'The optimized file was larger than the original. The original file has been preserved.'
  };
}

/**
 * Allowed file extensions and corresponding MIME types
 */
export const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf']
};

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

/**
 * Detect file MIME type based on magic bytes (header)
 * @param {string} filePath 
 * @returns {Promise<string|null>}
 */
export async function detectMimeFromMagicBytes(filePath) {
  const buffer = Buffer.alloc(12);
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 12, 0);
  } catch (err) {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }

  // Check magic numbers
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'image/png';
  }

  // WebP: RIFF ... WEBP
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  // PDF: %PDF- (25 50 44 46 2D)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46 && buffer[4] === 0x2D) {
    return 'application/pdf';
  }

  return null;
}
