import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
export const PROCESSED_DIR = path.join(__dirname, '..', 'processed');

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

// Memory map to track temporary files and scheduled cleanup
const fileRegistry = new Map();

/**
 * Register processed files for tracking
 */
export function registerFile(fileId, metadata) {
  fileRegistry.set(fileId, {
    ...metadata,
    createdAt: Date.now()
  });

  // Schedule auto cleanup after 30 minutes if not downloaded
  setTimeout(() => {
    deleteFileById(fileId);
  }, 30 * 60 * 1000);
}

/**
 * Get registered file info
 */
export function getFileById(fileId) {
  return fileRegistry.get(fileId);
}

/**
 * Delete specific file paths safely
 */
export function safelyDeleteFiles(...filePaths) {
  for (const filePath of filePaths) {
    if (!filePath) continue;
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Failed to delete temporary file ${filePath}:`, err.message);
    }
  }
}

/**
 * Delete a registered file and its original/compressed artifacts
 */
export function deleteFileById(fileId) {
  const fileInfo = fileRegistry.get(fileId);
  if (fileInfo) {
    safelyDeleteFiles(fileInfo.originalPath, fileInfo.compressedPath);
    fileRegistry.delete(fileId);
  }
}

/**
 * Clean up old temporary files in uploads and processed directories
 * (runs periodically)
 */
export function startPeriodicCleanup(intervalMs = 15 * 60 * 1000, maxAgeMs = 30 * 60 * 1000) {
  setInterval(() => {
    const now = Date.now();
    
    // Clean directory files
    const cleanDir = (dir) => {
      fs.readdir(dir, (err, files) => {
        if (err) return;
        for (const file of files) {
          if (file === '.gitkeep') continue;
          const filePath = path.join(dir, file);
          fs.stat(filePath, (statErr, stats) => {
            if (statErr) return;
            if (now - stats.mtimeMs > maxAgeMs) {
              safelyDeleteFiles(filePath);
            }
          });
        }
      });
    };

    cleanDir(UPLOADS_DIR);
    cleanDir(PROCESSED_DIR);

    // Clean registry entries
    for (const [fileId, info] of fileRegistry.entries()) {
      if (now - info.createdAt > maxAgeMs) {
        deleteFileById(fileId);
      }
    }
  }, intervalMs);
}
