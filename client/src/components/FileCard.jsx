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
    <div className="glass-panel-interactive rounded-2xl p-4 sm:p-5 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-900/15 shadow-sm">
      {/* Left side: Icon & File info */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {/* Preview Thumbnail or PDF Icon */}
        <div className="relative w-12 h-12 rounded-xl bg-[#efece2] border border-stone-300 overflow-hidden flex items-center justify-center shrink-0">
          {previewUrl && !isPdf ? (
            <img src={previewUrl} alt={originalName} className="w-full h-full object-cover" />
          ) : isPdf ? (
            <FileText className="w-6 h-6 text-rose-600" />
          ) : (
            <FileImage className="w-6 h-6 text-teal-700" />
          )}
        </div>

        {/* File Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-stone-900 truncate max-w-[200px] sm:max-w-[300px]" title={originalName}>
              {originalName}
            </h4>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
              {isPdf ? 'PDF' : originalName.split('.').pop()}
            </span>
          </div>

          {/* Size Comparison or Error message */}
          {status === 'completed' ? (
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="text-stone-500 line-through">{formatFileSize(originalSize)}</span>
              <ArrowRight className="w-3 h-3 text-stone-400" />
              <span className="font-extrabold text-emerald-700">{formatFileSize(compressedSize)}</span>

              {wasReduced ? (
                <span className="inline-flex items-center gap-1 font-extrabold text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800">
                  ↓ {formatPercentage(percentageReduced)} ({formatFileSize(savedBytes)} saved)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800" title={note}>
                  <Info className="w-3 h-3" />
                  Original Preserved
                </span>
              )}
            </div>
          ) : status === 'failed' ? (
            <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error || 'Compression failed.'}</span>
            </p>
          ) : (
            <p className="text-xs text-stone-600 mt-1">
              Original: <span className="text-stone-900 font-semibold">{formatFileSize(originalSize)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Right side: Status indicator & Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-emerald-900/10">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {status === 'waiting' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-stone-200 text-stone-700 font-semibold">
              Waiting
            </span>
          )}
          {status === 'uploading' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-seablue-100 border border-seablue-300 text-seablue-800 font-semibold flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Uploading...
            </span>
          )}
          {status === 'compressing' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-800 font-semibold flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
              Compressing...
            </span>
          )}
          {status === 'completed' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              Done
            </span>
          )}
          {status === 'failed' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 font-semibold flex items-center gap-1">
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
              className="btn-interactive px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-800 to-seablue-900 hover:from-teal-900 hover:to-seablue-950 text-white font-extrabold text-xs shadow-md shadow-teal-900/20 flex items-center gap-1.5 transition-all active:scale-95 border border-teal-600/30"
            >
              <Download className="w-3.5 h-3.5 text-teal-200" />
              <span className="text-white font-extrabold">Download</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(id)}
            className="btn-interactive p-1.5 rounded-xl bg-stone-300/80 border border-stone-400 hover:bg-rose-100 hover:text-rose-800 text-stone-900 transition-colors active:bg-rose-600 active:text-white active:scale-95"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
