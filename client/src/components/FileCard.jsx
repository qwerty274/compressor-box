import React from 'react';
import {
  FileImage,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Info
} from 'lucide-react';
import { formatFileSize, formatPercentage } from '../utils/formatters';

export default function FileCard({ fileItem, onRemove, onDownload }) {
  const {
    id,
    file,
    status,
    originalName,
    originalSize,
    compressedSize,
    savedBytes,
    percentageReduced,
    wasReduced,
    note,
    downloadUrl,
    error,
    previewUrl
  } = fileItem;

  const isPdf = file?.type === 'application/pdf' || originalName?.toLowerCase().endsWith('.pdf');

  return (
    <div className="glass-panel-interactive rounded-2xl p-4 sm:p-5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
      {/* Left side: Icon & File info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {/* Preview Thumbnail or PDF Icon */}
        <div className="relative w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0">
          {previewUrl && !isPdf ? (
            <img src={previewUrl} alt={originalName} className="w-full h-full object-cover" />
          ) : isPdf ? (
            <FileText className="w-6 h-6 text-rose-400" />
          ) : (
            <FileImage className="w-6 h-6 text-indigo-400" />
          )}
        </div>

        {/* File Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-white truncate max-w-[200px] sm:max-w-[300px]" title={originalName}>
              {originalName}
            </h4>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {isPdf ? 'PDF' : originalName.split('.').pop()}
            </span>
          </div>

          {/* Size Comparison or Error message */}
          {status === 'completed' ? (
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="text-slate-400 line-through">{formatFileSize(originalSize)}</span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="font-bold text-emerald-400">{formatFileSize(compressedSize)}</span>

              {wasReduced ? (
                <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  ↓ {formatPercentage(percentageReduced)} ({formatFileSize(savedBytes)} saved)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300" title={note}>
                  <Info className="w-3 h-3" />
                  Original Preserved
                </span>
              )}
            </div>
          ) : status === 'failed' ? (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error || 'Compression failed.'}</span>
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">
              Original: <span className="text-slate-200">{formatFileSize(originalSize)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Right side: Status indicator & Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/80">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {status === 'waiting' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-medium">
              Waiting
            </span>
          )}
          {status === 'uploading' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Uploading...
            </span>
          )}
          {status === 'compressing' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              Compressing...
            </span>
          )}
          {status === 'completed' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Done
            </span>
          )}
          {status === 'failed' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Failed
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {status === 'completed' && (
            <button
              type="button"
              onClick={() => onDownload(id)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(id)}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
