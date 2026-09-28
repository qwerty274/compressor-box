import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Maps compression level name to numeric quality
 */
function getQualityFromLevel(level = 'medium') {
  switch (level.toLowerCase()) {
    case 'low':
      return 90;
    case 'high':
      return 50;
    case 'medium':
    default:
      return 75;
  }
}

/**
 * Compress image using Sharp
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to write compressed image
 * @param {Object} options - Compression options
 * @param {string} options.compressionLevel - 'low' | 'medium' | 'high'
 * @param {string} options.outputFormat - 'original' | 'webp'
 * @param {number|string} options.maxWidth - Max width allowed
 * @param {number|string} options.maxHeight - Max height allowed
 * @returns {Promise<Object>} Metadata of resulting image
 */
export async function compressImage(inputPath, outputPath, options = {}) {
  const {
    compressionLevel = 'medium',
    outputFormat = 'original',
    maxWidth,
    maxHeight
  } = options;

  const quality = getQualityFromLevel(compressionLevel);
  const parsedMaxWidth = maxWidth ? parseInt(maxWidth, 10) : null;
  const parsedMaxHeight = maxHeight ? parseInt(maxHeight, 10) : null;

  let imagePipeline = sharp(inputPath);

  // Read metadata to determine dimensions and format
  const metadata = await imagePipeline.metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;
  const originalFormat = metadata.format; // 'jpeg', 'png', 'webp', etc.

  // Determine resize requirement without enlarging
  let shouldResize = false;
  let resizeWidth = undefined;
  let resizeHeight = undefined;

  if (parsedMaxWidth && originalWidth > parsedMaxWidth) {
    shouldResize = true;
    resizeWidth = parsedMaxWidth;
  }
  if (parsedMaxHeight && originalHeight > parsedMaxHeight) {
    shouldResize = true;
    resizeHeight = parsedMaxHeight;
  }

  if (shouldResize) {
    imagePipeline = imagePipeline.resize({
      width: resizeWidth,
      height: resizeHeight,
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  // Determine output format
  let targetFormat = originalFormat;
  if (outputFormat === 'webp') {
    targetFormat = 'webp';
  }

  // Configure output encoding options per format for fast parallel execution
  if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
    // If original had alpha, flatten with white background for JPG
    if (metadata.hasAlpha) {
      imagePipeline = imagePipeline.flatten({ background: '#ffffff' });
    }
    imagePipeline = imagePipeline.jpeg({
      quality,
      mozjpeg: false, // Standard turbo JPEG encoding is 5x-10x faster
      progressive: true,
      chromaSubsampling: quality < 70 ? '4:2:0' : '4:4:4'
    });
  } else if (targetFormat === 'png') {
    // Fast PNG palette quantization preserving transparency
    const pngEffort = compressionLevel === 'high' ? 4 : 2;
    imagePipeline = imagePipeline.png({
      quality,
      effort: pngEffort, // Fast effort setting
      compressionLevel: 6, // Standard fast zlib level
      palette: true
    });
  } else if (targetFormat === 'webp') {
    // Fast WebP encoding preserving transparency
    const webpEffort = compressionLevel === 'high' ? 4 : 2;
    imagePipeline = imagePipeline.webp({
      quality,
      effort: webpEffort, // Fast effort setting
      lossless: false
    });
  } else {
    // Default fallback
    imagePipeline = imagePipeline.jpeg({ quality });
  }

  // Write output file
  await imagePipeline.toFile(outputPath);

  const stats = fs.statSync(outputPath);
  return {
    format: targetFormat,
    size: stats.size,
    width: originalWidth,
    height: originalHeight
  };
}
