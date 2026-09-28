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
          <h3 className="font-heading font-bold text-lg text-white">
            Upload Queue <span className="text-indigo-400 font-normal text-sm">({fileList.length} files)</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {hasUncompressed && !isProcessing && (
            <button
              type="button"
              onClick={onCompressAll}
              className="px-4 py-2 rounded-xl glow-gradient hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Compress Files</span>
            </button>
          )}

          {!isProcessing && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
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
