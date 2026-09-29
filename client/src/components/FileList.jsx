import React from 'react';
import FileCard from './FileCard';
import { Zap, Trash2, Play } from 'lucide-react';

export default function FileList({
  fileList,
  onRemoveFile,
  onDownloadFile,
  onCompressAll,
  onClearAll,
  isProcessing
}) {
  if (!fileList || fileList.length === 0) return null;

  const hasUncompressed = fileList.some((f) => f.status === 'waiting' || f.status === 'failed');

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      {/* List Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-lg text-stone-900">
            Upload Queue <span className="text-teal-700 font-semibold text-sm">({fileList.length} files)</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {hasUncompressed && !isProcessing && (
            <button
              type="button"
              onClick={onCompressAll}
              className="btn-interactive px-4 py-2 rounded-xl bg-gradient-to-r from-teal-800 via-emerald-800 to-seablue-900 hover:from-teal-900 hover:to-emerald-900 text-white font-extrabold text-xs shadow-lg shadow-teal-900/25 flex items-center gap-1.5 transition-all active:scale-95 border border-teal-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-current text-teal-200" />
              <span className="text-white font-extrabold">Compress Files</span>
            </button>
          )}

          {!isProcessing && (
            <button
              type="button"
              onClick={onClearAll}
              className="btn-interactive px-3 py-2 rounded-xl bg-[#efece2] border border-stone-400 hover:bg-rose-100 text-stone-900 hover:text-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors active:bg-rose-600 active:text-white active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* File List Items */}
      <div className="space-y-3">
        {fileList.map((item) => (
          <FileCard
            key={item.id}
            fileItem={item}
            onRemove={onRemoveFile}
            onDownload={onDownloadFile}
          />
        ))}
      </div>
    </div>
  );
}
