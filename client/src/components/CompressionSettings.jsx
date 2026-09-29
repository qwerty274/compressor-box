import React, { useState } from 'react';
import { Sliders, HelpCircle, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

export default function CompressionSettings({ settings, onSettingsChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const levelDescriptions = {
    low: 'Higher Quality • Larger File (Quality 90)',
    medium: 'Balanced Quality & Size (Quality 75)',
    high: 'Maximum Compression • Smaller File (Quality 50)'
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div className="glass-panel rounded-2xl overflow-hidden border border-emerald-900/15 transition-all shadow-sm">
        {/* Header Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn-interactive w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-teal-500/5 transition-colors active:bg-teal-500/10"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Compression Settings</h3>
              <p className="text-xs text-stone-600">
                Level: <span className="capitalize text-teal-800 font-semibold">{settings.compressionLevel}</span> • Format: <span className="capitalize text-emerald-800 font-semibold">{settings.outputFormat}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-900">
            <span>{isOpen ? 'Hide Options' : 'Customize Options'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-teal-700" /> : <ChevronDown className="w-4 h-4 text-teal-700" />}
          </div>
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="px-5 pb-5 pt-2 border-t border-emerald-900/10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#faf8f3]/60">
            {/* Compression Level Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>Compression Level</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'Low', sub: '90' },
                  { id: 'medium', label: 'Medium', sub: '75' },
                  { id: 'high', label: 'High', sub: '50' }
                ].map((item) => {
                  const isSelected = settings.compressionLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSettingsChange({ ...settings, compressionLevel: item.id })}
                      className={`btn-interactive px-3 py-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-teal-800 to-seablue-900 border-teal-600/40 text-white font-extrabold shadow-md shadow-teal-900/20 active:scale-95'
                          : 'bg-[#efece2] border-stone-400 text-stone-900 font-bold hover:border-teal-600 hover:text-teal-950 active:bg-emeraldgreen-800 active:text-white active:scale-95'
                      }`}
                    >
                      <div className="font-extrabold text-xs">{item.label}</div>
                      <div className="text-[10px] opacity-90 mt-0.5">Quality {item.sub}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-stone-600 italic">
                {levelDescriptions[settings.compressionLevel]}
              </p>
            </div>

            {/* Output Format Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>Image Output Format</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'original', label: 'Original', desc: 'JPG→JPG, PNG→PNG' },
                  { id: 'webp', label: 'WebP', desc: 'Convert to WebP' }
                ].map((item) => {
                  const isSelected = settings.outputFormat === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSettingsChange({ ...settings, outputFormat: item.id })}
                      className={`btn-interactive px-3 py-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-teal-800 to-seablue-900 border-teal-600/40 text-white font-extrabold shadow-md shadow-teal-900/20 active:scale-95'
                          : 'bg-[#efece2] border-stone-400 text-stone-900 font-bold hover:border-teal-600 hover:text-teal-950 active:bg-emeraldgreen-800 active:text-white active:scale-95'
                      }`}
                    >
                      <div className="font-extrabold text-xs">{item.label}</div>
                      <div className="text-[10px] opacity-90 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-stone-600">
                WebP achieves significantly smaller sizes while retaining alpha transparency.
              </p>
            </div>

            {/* Max Dimensions */}
            <div className="md:col-span-2 pt-3 border-t border-emerald-900/10">
              <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider block mb-2">
                Maximum Image Dimensions (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-stone-600 font-medium block mb-1">Max Width (px)</span>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={settings.maxWidth || ''}
                    onChange={(e) => onSettingsChange({ ...settings, maxWidth: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-600 font-medium block mb-1">Max Height (px)</span>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={settings.maxHeight || ''}
                    onChange={(e) => onSettingsChange({ ...settings, maxHeight: e.target.value })}
                    className="w-full bg-[#fdfbf7] border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2">
                Images larger than these bounds will be downscaled proportionally. Smaller images will remain untouched.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
