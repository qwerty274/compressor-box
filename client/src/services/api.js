const API_BASE_URL = '/api';

/**
 * Upload and compress files batch
 */
export async function compressFilesApi(files, settings) {
  const formData = new FormData();

  // Append files
  for (const file of files) {
    formData.append('files', file);
  }

  // Append settings
  formData.append('compressionLevel', settings.compressionLevel || 'medium');
  formData.append('outputFormat', settings.outputFormat || 'original');
  if (settings.maxWidth) formData.append('maxWidth', settings.maxWidth);
  if (settings.maxHeight) formData.append('maxHeight', settings.maxHeight);

  const response = await fetch(`${API_BASE_URL}/compress`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'File compression failed on the server.');
  }

  return data;
}

/**
 * Download a single compressed file
 */
export function getDownloadUrl(fileId) {
  return `${API_BASE_URL}/download/${fileId}`;
}

/**
 * Request ZIP bundle download for multiple files
 */
export async function downloadZipApi(fileIds) {
  const response = await fetch(`${API_BASE_URL}/download-zip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileIds }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate ZIP archive.');
  }

  // Create a blob and trigger browser download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'CompressBox_Files.zip';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Notify server to remove temporary file
 */
export async function removeFileApi(fileId) {
  try {
    await fetch(`${API_BASE_URL}/file/${fileId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Failed to notify server of file removal:', err);
  }
}
