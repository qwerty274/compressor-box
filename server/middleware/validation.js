import fs from 'fs';
import { detectMimeFromMagicBytes, ALLOWED_MIME_TYPES } from '../utils/fileUtils.js';
import { safelyDeleteFiles } from '../utils/cleanup.js';

export async function validateUploadedFiles(req, res, next) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files were uploaded. Please select at least one file.'
    });
  }

  if (req.files.length > 20) {
    // Delete files immediately
    safelyDeleteFiles(...req.files.map(f => f.path));
    return res.status(400).json({
      success: false,
      error: 'Maximum limit of 20 files per upload batch exceeded.'
    });
  }

  let totalSize = 0;
  const invalidFiles = [];

  for (const file of req.files) {
    totalSize += file.size;

    // Check magic bytes MIME type
    const detectedMime = await detectMimeFromMagicBytes(file.path);
    if (!detectedMime || !ALLOWED_MIME_TYPES[detectedMime]) {
      invalidFiles.push(`${file.originalname} (invalid content type)`);
    } else {
      file.detectedMime = detectedMime;
    }
  }

  // Check 100MB total limit
  if (totalSize > 100 * 1024 * 1024) {
    safelyDeleteFiles(...req.files.map(f => f.path));
    return res.status(400).json({
      success: false,
      error: 'Total size of uploaded files exceeds the 100 MB batch limit.'
    });
  }

  if (invalidFiles.length > 0) {
    safelyDeleteFiles(...req.files.map(f => f.path));
    return res.status(400).json({
      success: false,
      error: `Unsupported or invalid files detected: ${invalidFiles.join(', ')}`
    });
  }

  next();
}
