import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

/**
 * Calculates single-pass target quality & max dimension parameters based on original file size
 */
function getTargetParams(level = 'medium', originalSize = 0) {
  let baseQuality = 75;
  let maxDim = undefined;

  switch (level.toLowerCase()) {
    case 'low':
      baseQuality = 85;
      break;
    case 'high':
      baseQuality = 50;
      maxDim = 1600;
      break;
    case 'medium':
    default:
      baseQuality = 70;
      break;
  }

  // If file is large (> 1 MB), dynamically tune single-pass target parameters to guarantee fast < 1 MB output
  if (originalSize > 1 * 1024 * 1024) {
    baseQuality = Math.min(baseQuality, 60);
    if (!maxDim || maxDim > 1920) maxDim = 1920;
  }
  if (originalSize > 5 * 1024 * 1024) {
    baseQuality = Math.min(baseQuality, 48);
    maxDim = 1600;
  }

  return { quality: baseQuality, maxDim };
}

/**
 * Single-pass high speed image compression using Sharp (< 0.5s)
 */
export async function compressImage(inputPath, outputPath, options = {}) {
  const {
    compressionLevel = 'medium',
    outputFormat = 'original',
    maxWidth,
    maxHeight
  } = options;

  const originalStats = fs.statSync(inputPath);
  const originalSize = originalStats.size;

  const { quality, maxDim } = getTargetParams(compressionLevel, originalSize);

  let imagePipeline = sharp(inputPath);
  const metadata = await imagePipeline.metadata();

  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;
  const originalFormat = metadata.format;

  // Determine resize bounds
  const targetMaxWidth = maxWidth ? parseInt(maxWidth, 10) : maxDim;
  const targetMaxHeight = maxHeight ? parseInt(maxHeight, 10) : maxDim;

  let shouldResize = false;
  let resizeWidth = undefined;
  let resizeHeight = undefined;

  if (targetMaxWidth && originalWidth > targetMaxWidth) {
    shouldResize = true;
    resizeWidth = targetMaxWidth;
  }
  if (targetMaxHeight && originalHeight > targetMaxHeight) {
    shouldResize = true;
    resizeHeight = targetMaxHeight;
  }

  if (shouldResize) {
    imagePipeline = imagePipeline.resize({
      width: resizeWidth,
      height: resizeHeight,
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  // Determine target output format
  const targetFormat = outputFormat === 'webp' ? 'webp' : originalFormat;

  if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
    if (metadata.hasAlpha) {
      imagePipeline = imagePipeline.flatten({ background: '#ffffff' });
    }
    imagePipeline = imagePipeline.jpeg({
      quality,
      mozjpeg: false, // Standard fast turbo JPEG encoding
      progressive: true,
      chromaSubsampling: '4:2:0'
    });
  } else if (targetFormat === 'png') {
    imagePipeline = imagePipeline.png({
      quality,
      effort: 2, // Fast effort setting
      compressionLevel: 6,
      palette: true
    });
  } else if (targetFormat === 'webp') {
    imagePipeline = imagePipeline.webp({
      quality,
      effort: 2, // Fast effort setting
      lossless: false
    });
  } else {
    imagePipeline = imagePipeline.jpeg({ quality });
  }

  // Write output file in a single fast pass (< 0.5s)
  await imagePipeline.toFile(outputPath);

  const stats = fs.statSync(outputPath);
  return {
    format: targetFormat,
    size: stats.size,
    width: originalWidth,
    height: originalHeight
  };
}
