import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Download, RefreshCw, CheckCircle2, PieChart, Sparkles } from 'lucide-react';
import { formatFileSize, formatPercentage } from '../utils/formatters';

export default function ResultsSummary({
  completedFiles,
  onDownloadZip,
  onReset
}) {
  if (!completedFiles || completedFiles.length === 0) return null;

  // Calculate totals strictly from actual calculated server values
  const totalOriginal = completedFiles.reduce((acc, f) => acc + (f.originalSize || 0), 0);
  const totalCompressed = completedFiles.reduce((acc, f) => acc + (f.compressedSize || 0), 0);
  const totalSaved = Math.max(0, totalOriginal - totalCompressed);
  const overallReduction = totalOriginal > 0 ? (totalSaved / totalOriginal) * 100 : 0;

  useEffect(() => {
    // Fire festive confetti on results display
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 animate-fadeIn">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-teal-500/40 relative overflow-hidden shadow-2xl shadow-teal-600/10 bg-[#faf8f2]">
        {/* Background ambient light */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
              <span>Compression Complete</span>
              <span className="text-xl">🎉</span>
            </h2>
            <p className="text-xs text-stone-600">
              Successfully processed <span className="font-bold text-stone-900">{completedFiles.length} file{completedFiles.length > 1 ? 's' : ''}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#efece2] border border-stone-300 text-center">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Original Size
            </span>
            <span className="text-base sm:text-lg font-extrabold text-stone-900">
              {formatFileSize(totalOriginal)}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#efece2] border border-stone-300 text-center">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Compressed Size
            </span>
            <span className="text-base sm:text-lg font-extrabold text-seablue-700">
              {formatFileSize(totalCompressed)}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#efece2] border border-stone-300 text-center">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
              Total Saved
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-700">
              {formatFileSize(totalSaved)}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Overall Reduction
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-900">
              {formatPercentage(overallReduction)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {completedFiles.length > 1 ? (
            <button
              type="button"
              onClick={onDownloadZip}
              className="btn-interactive w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-800 via-emerald-800 to-seablue-900 hover:from-teal-900 hover:to-emerald-900 text-white font-extrabold text-sm shadow-xl shadow-teal-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 border border-teal-600/40"
            >
              <Download className="w-4 h-4 text-teal-200" />
              <span className="text-white font-extrabold">Download All (ZIP)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => completedFiles[0] && window.open(completedFiles[0].downloadUrl, '_blank')}
              className="btn-interactive w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-800 via-emerald-800 to-seablue-900 hover:from-teal-900 hover:to-emerald-900 text-white font-extrabold text-sm shadow-xl shadow-teal-900/30 flex items-center justify-center gap-2 transition-all active:scale-95 border border-teal-600/40"
            >
              <Download className="w-4 h-4 text-teal-200" />
              <span className="text-white font-extrabold">Download Compressed File</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="btn-interactive w-full sm:w-auto px-5 py-3 rounded-xl bg-[#efece2] border border-stone-400 hover:bg-stone-300 text-stone-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors active:bg-teal-900 active:text-white active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-800" />
            <span>Compress More Files</span>
          </button>
        </div>
      </div>
    </div>
  );
}
