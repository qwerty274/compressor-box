import React from 'react';
import { Sparkles, FileImage, FileText, ArrowDownRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative py-8 md:py-12 text-center max-w-3xl mx-auto px-4">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#efece2] border border-teal-600/20 mb-6 text-xs text-teal-900 font-semibold shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
        <span>Real Server-Side Compression • No Fake Progress</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 mb-4 leading-[1.15]">
        Make your files smaller.{' '}
        <span className="text-gradient block sm:inline">Keep what matters.</span>
      </h1>

      {/* Hero Body */}
      <p className="text-base sm:text-lg text-stone-700 font-normal max-w-2xl mx-auto leading-relaxed mb-6">
        Compress images & PDFs without the hassle. Reduce file size while keeping your files usable and downloadable.
      </p>

      {/* Features Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-stone-800">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf8f3] border border-emerald-900/15 shadow-sm">
          <FileImage className="w-4 h-4 text-teal-600" />
          <span>JPG • PNG • WebP</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf8f3] border border-emerald-900/15 shadow-sm">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>PDF Documents</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf8f3] border border-emerald-900/15 shadow-sm">
          <ArrowDownRight className="w-4 h-4 text-seablue-600" />
          <span className="font-semibold text-emerald-900">Up to 80% Reduction</span>
        </div>
      </div>
    </div>
  );
}
