import React from 'react';
import { Package, Zap, ShieldCheck, Cpu } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glow-gradient p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Package className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white">
              Compress<span className="text-gradient">Box</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
              v1.0 Engine
            </span>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Private & Temp Files</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sharp & pdf-lib Core</span>
          </div>
          <a
            href="#how-it-works"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>How it Works</span>
          </a>
        </div>
      </div>
    </header>
  );
}
