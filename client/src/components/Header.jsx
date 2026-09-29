import React from 'react';
import { Package, Zap, ShieldCheck, Cpu } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-emerald-900/10 bg-[#faf8f3]/85 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glow-gradient p-0.5 shadow-lg shadow-teal-600/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#f6f3eb] rounded-[10px] flex items-center justify-center">
              <Package className="w-5 h-5 text-teal-700" />
            </div>
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-stone-900">
              Compress<span className="text-gradient">Box</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-teal-100 border border-teal-300 text-teal-800 font-medium">
              v1.0 Engine
            </span>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center gap-4 text-xs font-medium text-stone-700">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efece2] border border-stone-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>100% Private & Temp Files</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efece2] border border-stone-300">
            <Cpu className="w-3.5 h-3.5 text-teal-700" />
            <span>Sharp & pdf-lib Core</span>
          </div>
          <a
            href="#how-it-works"
            className="btn-interactive flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-800 to-seablue-900 hover:from-teal-900 hover:to-seablue-950 text-white font-extrabold text-xs shadow-md shadow-teal-900/20 border border-teal-600/30 transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-white font-extrabold">How it Works</span>
          </a>
        </div>
      </div>
    </header>
  );
}
