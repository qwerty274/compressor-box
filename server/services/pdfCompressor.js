import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

/**
 * Optimizes and compresses a PDF document using pdf-lib object stream compression
 * and structural optimizations.
 * 
 * @param {string} inputPath - Path to original PDF
 * @param {string} outputPath - Path to output compressed PDF
 * @param {Object} options - Compression level options
 * @returns {Promise<Object>} Metadata and file size info
 */
export async function compressPdf(inputPath, outputPath, options = {}) {
  const { compressionLevel = 'medium' } = options;
  const originalBuffer = fs.readFileSync(inputPath);
  const originalSize = originalBuffer.length;

  try {
    // Load original PDF document
    const pdfDoc = await PDFDocument.load(originalBuffer, {
      ignoreEncryption: true,
      updateMetadata: false
    });

    // Strip optional unnecessary metadata streams if requested or on high compression
    if (compressionLevel === 'high' || compressionLevel === 'medium') {
      try {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('CompressBox Optimizer');
        pdfDoc.setCreator('CompressBox Engine');
      } catch (metaErr) {
        // Ignore metadata modification errors
      }
    }

    // Save with object streams enabled (combines indirect objects into compressed object streams)
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 500
    });

    // Write to output file
    fs.writeFileSync(outputPath, compressedBytes);

    const stats = fs.statSync(outputPath);
    return {
      size: stats.size,
      pageCount: pdfDoc.getPageCount()
    };
  } catch (error) {
    console.error('PDF optimization error:', error.message);
    // If pdf-lib parsing fails (e.g. strict PDF syntax issue), copy original file
    fs.copyFileSync(inputPath, outputPath);
    const stats = fs.statSync(outputPath);
    return {
      size: stats.size,
      error: error.message
    };
  }
}
