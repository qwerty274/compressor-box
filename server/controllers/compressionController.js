import path from 'path';
import fs from 'fs';
import { compressImage } from '../services/imageCompressor.js';
import { compressPdf } from '../services/pdfCompressor.js';
import { createZipArchive } from '../services/zipService.js';
import {
  PROCESSED_DIR,
  registerFile,
  getFileById,
  deleteFileById,
  safelyDeleteFiles
} from '../utils/cleanup.js';
import {
  generateUniqueId,
  sanitizeFilename,
  calculateCompressionStats,
  formatBytes
} from '../utils/fileUtils.js';

/**
 * Handle batch file compression request
 */
export async function compressFiles(req, res) {
  const files = req.files || [];
  const {
    compressionLevel = 'medium',
    outputFormat = 'original',
    maxWidth,
    maxHeight
  } = req.body;

  const results = await Promise.all(
    files.map(async (file) => {
      const originalPath = file.path;
      const originalName = sanitizeFilename(file.originalname);
      const originalSize = file.size;
      const fileId = generateUniqueId();
      const isPdf = file.detectedMime === 'application/pdf';

      // Determine target output extension
      let ext = path.extname(originalName).toLowerCase();
      if (!isPdf && outputFormat === 'webp') {
        ext = '.webp';
      }

      // Output target path
      const targetFilename = `${fileId}${ext}`;
      const compressedPath = path.join(PROCESSED_DIR, targetFilename);

      try {
        if (isPdf) {
          await compressPdf(originalPath, compressedPath, { compressionLevel });
        } else {
          await compressImage(originalPath, compressedPath, {
            compressionLevel,
            outputFormat,
            maxWidth,
            maxHeight
          });
        }

        // Check resulting size
        const compressedStats = fs.statSync(compressedPath);
        let compressedSize = compressedStats.size;

        // Calculate savings & stats
        const stats = calculateCompressionStats(originalSize, compressedSize);

        // If the compressed file is larger or not reduced, preserve the original file
        let finalFilePath = compressedPath;
        if (!stats.wasReduced) {
          fs.copyFileSync(originalPath, compressedPath);
          compressedSize = originalSize;
        }

        // Determine final download filename
        const baseNameWithoutExt = path.basename(originalName, path.extname(originalName));
        const downloadName = `${baseNameWithoutExt}_compressed${ext}`;

        // Register file for download & cleanup
        registerFile(fileId, {
          originalPath,
          compressedPath: finalFilePath,
          filename: downloadName,
          mimeType: isPdf ? 'application/pdf' : (ext === '.webp' ? 'image/webp' : file.detectedMime)
        });

        return {
          fileId,
          originalName,
          downloadName,
          originalSize,
          compressedSize: stats.compressedSize,
          savedBytes: stats.savedBytes,
          percentageReduced: stats.percentageReduced,
          wasReduced: stats.wasReduced,
          note: stats.note,
          mimeType: file.detectedMime,
          downloadUrl: `/api/download/${fileId}`
        };
      } catch (err) {
        console.error(`Error compressing file ${originalName}:`, err);
        safelyDeleteFiles(originalPath, compressedPath);
        return {
          fileId,
          originalName,
          error: err.message || 'Failed to compress file'
        };
      }
    })
  );

  return res.status(200).json({
    success: true,
    files: results
  });
}

/**
 * Handle single file download
 */
export function downloadFile(req, res) {
  const { fileId } = req.params;
  const fileInfo = getFileById(fileId);

  if (!fileInfo || !fs.existsSync(fileInfo.compressedPath)) {
    return res.status(404).json({
      success: false,
      error: 'File not found or link expired.'
    });
  }

  res.setHeader('Content-Type', fileInfo.mimeType || 'application/octet-stream');
  res.download(fileInfo.compressedPath, fileInfo.filename, (err) => {
    if (err) {
      console.error(`Download error for fileId ${fileId}:`, err.message);
    }
  });
}

/**
 * Handle multiple files ZIP download
 */
export async function downloadZip(req, res) {
  const { fileIds } = req.body;

  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No files provided for ZIP download.'
    });
  }

  const filesToZip = [];
  for (const fileId of fileIds) {
    const info = getFileById(fileId);
    if (info && fs.existsSync(info.compressedPath)) {
      filesToZip.push({
        filePath: info.compressedPath,
        downloadName: info.filename
      });
    }
  }

  if (filesToZip.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Requested files are no longer available for ZIP creation.'
    });
  }

  const zipId = generateUniqueId();
  const zipPath = path.join(PROCESSED_DIR, `compressbox_${zipId}.zip`);

  try {
    await createZipArchive(filesToZip, zipPath);

    res.download(zipPath, 'CompressBox_Files.zip', (err) => {
      // Clean up temporary ZIP file after sending
      safelyDeleteFiles(zipPath);
      if (err) {
        console.error('ZIP download error:', err.message);
      }
    });
  } catch (err) {
    console.error('Failed to create ZIP archive:', err);
    safelyDeleteFiles(zipPath);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate ZIP archive.'
    });
  }
}

/**
 * Delete single file from queue/registry
 */
export function removeFile(req, res) {
  const { fileId } = req.params;
  deleteFileById(fileId);
  return res.status(200).json({ success: true, message: 'File removed successfully.' });
}
