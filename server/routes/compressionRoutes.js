import express from 'express';
import { uploadMiddleware } from '../middleware/upload.js';
import { validateUploadedFiles } from '../middleware/validation.js';
import {
  compressFiles,
  downloadFile,
  downloadZip,
  removeFile
} from '../controllers/compressionController.js';

const router = express.Router();

// Compression API endpoint
router.post('/compress', uploadMiddleware.array('files', 20), validateUploadedFiles, compressFiles);

// Download endpoints
router.get('/download/:fileId', downloadFile);
router.post('/download-zip', downloadZip);
router.delete('/file/:fileId', removeFile);

export default router;
