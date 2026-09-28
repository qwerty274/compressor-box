import multer from 'multer';
import path from 'path';
import { UPLOADS_DIR } from '../utils/cleanup.js';
import { generateUniqueId, ALLOWED_EXTENSIONS } from '../utils/fileUtils.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '.tmp';
    cb(null, `${generateUniqueId()}${safeExt}`);
  }
});

// Multer limits: max 25MB per file, max 20 files per batch
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB limit
    files: 20 // 20 files max
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type '${ext}' is not supported. Only JPG, JPEG, PNG, WebP, and PDF files are allowed.`));
    }
  }
});
