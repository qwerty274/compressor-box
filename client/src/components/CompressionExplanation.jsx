import React from 'react';
import { HelpCircle, Image, FileText, Cpu, Archive, Layers } from 'lucide-react';

export default function CompressionExplanation() {
  return (
    <section id="how-it-works" className="w-full max-w-3xl mx-auto mt-16 mb-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          How Compression Works
        </h2>
        <p className="text-sm text-slate-400">
          Understanding the real science behind reducing file sizes without sacrificing quality.
        </p>
      </div>

      <div className="space-y-6">
        {/* Image Compression Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Image className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Image Compression Pipeline</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              When you upload a JPEG, PNG, or WebP image, CompressBox processes it through high-performance C++ binaries powered by <strong>Sharp</strong>:
            </p>

            {/* Pipeline diagram */}
            <div className="py-3 px-4 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[500px] text-xs font-mono text-indigo-300">
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Original Image</span>
                <span>→</span>
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Decode Pixels</span>
                <span>→</span>
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Optional Resize</span>
                <span>→</span>
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Quality Tuning</span>
                <span>→</span>
                <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Re-Encode</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-bold text-xs text-white mb-1">Lossy Compression</h4>
                <p className="text-xs text-slate-400">
                  Removes subtle visual data imperceptible to the human eye. Reduces a 10 MB image to ~2 MB while maintaining visual crispness.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-bold text-xs text-white mb-1">Lossless Optimization</h4>
                <p className="text-xs text-slate-400">
                  Strips unnecessary EXIF camera metadata, color profile headers, and optimizes Huffman tables without altering a single pixel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Compression Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">PDF Optimization Engine</h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
            PDF files are compound documents containing page layouts, fonts, vector paths, and embedded images. CompressBox uses <strong>pdf-lib</strong> to optimize PDF internals:
          </p>

          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400 ml-1">
            <li>Consolidates duplicate PDF object tables into compressed object streams.</li>
            <li>Strips redundant metadata, author info, and unreferenced annotations.</li>
            <li>Re-applies FlateDecode stream compression across page content bytes.</li>
            <li>If an optimized PDF cannot be reduced further, CompressBox preserves the uncorrupted original.</li>
          </ul>
        </div>

        {/* System Roles Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Layers className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">React Frontend</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Handles drag-and-drop interaction, settings state, file validation, real request progress monitoring, file card queues, and ZIP downloads.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Cpu className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">Node.js Express Backend</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receives multipart streams, performs magic-byte validation, runs Sharp & pdf-lib compression algorithms, measures byte savings, and cleans up temp files.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
