import React from 'react';
import { Sparkles, FileImage, FileText, ArrowDownRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative py-8 md:py-12 text-center max-w-3xl mx-auto px-4">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 mb-6 text-xs text-indigo-300 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span>Real Server-Side Compression • No Fake Progress</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
        Make your files smaller.{' '}
        <span className="text-gradient block sm:inline">Keep what matters.</span>
      </h1>

      {/* Hero Body */}
      <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed mb-6">
        Compress images & PDFs without the hassle. Reduce file size while keeping your files usable and downloadable.
      </p>

      {/* Features Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <FileImage className="w-4 h-4 text-pink-400" />
          <span>JPG • PNG • WebP</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <FileText className="w-4 h-4 text-rose-400" />
          <span>PDF Documents</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800">
          <ArrowDownRight className="w-4 h-4 text-emerald-400" />
          <span>Up to 80% Reduction</span>
        </div>
      </div>
    </div>
  );
}
