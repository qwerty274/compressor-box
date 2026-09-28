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
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
        {/* Background ambient light */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>Compression Complete</span>
              <span className="text-xl">🎉</span>
            </h2>
            <p className="text-xs text-slate-400">
              Successfully processed <span className="font-semibold text-slate-200">{completedFiles.length} file{completedFiles.length > 1 ? 's' : ''}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Original Size
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-200">
              {formatFileSize(totalOriginal)}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Compressed Size
            </span>
            <span className="text-base sm:text-lg font-extrabold text-indigo-400">
              {formatFileSize(totalCompressed)}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Total Saved
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-400">
              {formatFileSize(totalSaved)}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Overall Reduction
            </span>
            <span className="text-base sm:text-lg font-extrabold text-emerald-300">
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl glow-gradient hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download All (ZIP)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => completedFiles[0] && window.open(completedFiles[0].downloadUrl, '_blank')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl glow-gradient hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Compressed File</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Compress More Files</span>
          </button>
        </div>
      </div>
    </div>
  );
}
