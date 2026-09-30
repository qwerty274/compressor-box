import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

/**
 * Rapid PDF compression:
 * Executes structural object stream consolidation and metadata stripping in a single fast pass (< 0.5s).
 * 
 * @param {string} inputPath - Path to original PDF
 * @param {string} outputPath - Path to output compressed PDF
 * @param {Object} options - Compression level options
 * @returns {Promise<Object>} Metadata and file size info
 */
export async function compressPdf(inputPath, outputPath, options = {}) {
  const { compressionLevel = 'medium' } = options;
  const originalBuffer = fs.readFileSync(inputPath);

  try {
    // Load original PDF document
    const pdfDoc = await PDFDocument.load(originalBuffer, {
      ignoreEncryption: true,
      updateMetadata: false
    });

    // Strip metadata streams
    try {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('CompressBox Engine');
      pdfDoc.setCreator('CompressBox Engine');
    } catch (metaErr) {
      // Ignore metadata modification errors
    }

    // High-speed object stream compression pass
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 1000
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
    // If pdf-lib parsing fails, copy original file
    fs.copyFileSync(inputPath, outputPath);
    const stats = fs.statSync(outputPath);
    return {
      size: stats.size,
      error: error.message
    };
  }
}
