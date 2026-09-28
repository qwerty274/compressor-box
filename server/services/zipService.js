import fs from 'fs';
import archiver from 'archiver';

/**
 * Creates a ZIP archive containing multiple compressed files
 * @param {Array<{filePath: string, downloadName: string}>} filesList 
 * @param {string} zipOutputPath 
 * @returns {Promise<void>}
 */
export function createZipArchive(filesList, zipOutputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipOutputPath);
    const archive = archiver('zip', {
      zlib: { level: 0 } // Files are ALREADY compressed, so store with minimal zip overhead
    });

    output.on('close', () => {
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Track filenames to prevent collisions inside zip
    const nameCountMap = new Map();

    for (const item of filesList) {
      if (!fs.existsSync(item.filePath)) continue;

      let name = item.downloadName || 'file';
      if (nameCountMap.has(name)) {
        const count = nameCountMap.get(name) + 1;
        nameCountMap.set(name, count);
        const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
        const base = name.includes('.') ? name.substring(0, name.lastIndexOf('.')) : name;
        name = `${base}_${count}${ext}`;
      } else {
        nameCountMap.set(name, 1);
      }

      archive.file(item.filePath, { name });
    }

    archive.finalize();
  });
}
