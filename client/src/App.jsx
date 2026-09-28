import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadZone from './components/UploadZone';
import CompressionSettings from './components/CompressionSettings';
import FileList from './components/FileList';
import ResultsSummary from './components/ResultsSummary';
import CompressionExplanation from './components/CompressionExplanation';
import { compressFilesApi, downloadZipApi, removeFileApi, getDownloadUrl } from './services/api';

export default function App() {
  const [fileItems, setFileItems] = useState([]);
  const [settings, setSettings] = useState({
    compressionLevel: 'medium',
    outputFormat: 'original',
    maxWidth: '',
    maxHeight: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Add files to queue
  const handleFilesSelected = (selectedFiles) => {
    const newItems = selectedFiles.map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        status: 'waiting',
        originalName: file.name,
        originalSize: file.size,
        compressedSize: null,
        savedBytes: null,
        percentageReduced: null,
        wasReduced: true,
        note: null,
        downloadUrl: null,
        error: null,
        previewUrl: isImage ? URL.createObjectURL(file) : null
      };
    });

    setFileItems((prev) => [...prev, ...newItems]);
  };

  // Remove a file from queue
  const handleRemoveFile = (id) => {
    const item = fileItems.find((f) => f.id === id);
    if (item && item.serverFileId) {
      removeFileApi(item.serverFileId);
    }
    if (item && item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
    setFileItems((prev) => prev.filter((f) => f.id !== id));
  };

  // Clear entire queue
  const handleClearAll = () => {
    fileItems.forEach((item) => {
      if (item.serverFileId) removeFileApi(item.serverFileId);
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    });
    setFileItems([]);
  };

  // Process compression batch
  const handleCompressAll = async () => {
    const uncompressed = fileItems.filter((f) => f.status === 'waiting' || f.status === 'failed');
    if (uncompressed.length === 0) return;

    setIsProcessing(true);

    // Update status to uploading / compressing
    setFileItems((prev) =>
      prev.map((item) =>
        uncompressed.some((u) => u.id === item.id)
          ? { ...item, status: 'compressing', error: null }
          : item
      )
    );

    try {
      const filesToUpload = uncompressed.map((item) => item.file);
      const responseData = await compressFilesApi(filesToUpload, settings);

      if (responseData.success && Array.isArray(responseData.files)) {
        const resultsMap = new Map();
        responseData.files.forEach((res) => {
          resultsMap.set(res.originalName, res);
        });

        setFileItems((prev) =>
          prev.map((item) => {
            const res = resultsMap.get(item.originalName);
            if (res) {
              if (res.error) {
                return {
                  ...item,
                  status: 'failed',
                  error: res.error
                };
              } else {
                return {
                  ...item,
                  status: 'completed',
                  serverFileId: res.fileId,
                  compressedSize: res.compressedSize,
                  savedBytes: res.savedBytes,
                  percentageReduced: res.percentageReduced,
                  wasReduced: res.wasReduced,
                  note: res.note,
                  downloadUrl: getDownloadUrl(res.fileId)
                };
              }
            }
            return item;
          })
        );
      }
    } catch (err) {
      console.error('Batch compression error:', err);
      setFileItems((prev) =>
        prev.map((item) =>
          uncompressed.some((u) => u.id === item.id)
            ? { ...item, status: 'failed', error: err.message || 'Compression failed' }
            : item
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger individual file download
  const handleDownloadFile = (id) => {
    const item = fileItems.find((f) => f.id === id);
    if (item && item.downloadUrl) {
      const a = document.createElement('a');
      a.href = item.downloadUrl;
      a.download = item.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Download all completed files in ZIP
  const handleDownloadZip = async () => {
    const completedServerIds = fileItems
      .filter((f) => f.status === 'completed' && f.serverFileId)
      .map((f) => f.serverFileId);

    if (completedServerIds.length === 0) return;

    try {
      await downloadZipApi(completedServerIds);
    } catch (err) {
      alert(`ZIP download error: ${err.message}`);
    }
  };

  const completedFiles = fileItems.filter((f) => f.status === 'completed');
  const allCompleted = fileItems.length > 0 && fileItems.every((f) => f.status === 'completed');

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <Hero />

        {/* Compression Settings Panel */}
        <CompressionSettings
          settings={settings}
          onSettingsChange={setSettings}
        />

        {/* File Dropzone */}
        <UploadZone
          onFilesSelected={handleFilesSelected}
          isDisabled={isProcessing}
        />

        {/* File Queue & Status Cards */}
        <FileList
          fileList={fileItems}
          onRemoveFile={handleRemoveFile}
          onDownloadFile={handleDownloadFile}
          onCompressAll={handleCompressAll}
          onClearAll={handleClearAll}
          isProcessing={isProcessing}
        />

        {/* Results Summary Dashboard */}
        {allCompleted && (
          <ResultsSummary
            completedFiles={completedFiles}
            onDownloadZip={handleDownloadZip}
            onReset={handleClearAll}
          />
        )}

        {/* Technical & Educational Explanation */}
        <CompressionExplanation />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CompressBox. Real Image & PDF File Compression.</p>
          <p className="flex items-center gap-2">
            <span>Powered by Sharp & pdf-lib</span>
            <span>•</span>
            <span>Zero Persistent DB</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
