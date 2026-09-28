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
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 transition-all">
        {/* Header Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Compression Settings</h3>
              <p className="text-xs text-slate-400">
                Level: <span className="capitalize text-indigo-300 font-medium">{settings.compressionLevel}</span> • Format: <span className="capitalize text-indigo-300 font-medium">{settings.outputFormat}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>{isOpen ? 'Hide Options' : 'Customize Options'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Compression Level Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
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
                      className={`px-3 py-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-xs">{item.label}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">Quality {item.sub}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 italic">
                {levelDescriptions[settings.compressionLevel]}
              </p>
            </div>

            {/* Output Format Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
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
                      className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-xs">{item.label}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400">
                WebP achieves significantly smaller sizes while retaining alpha transparency.
              </p>
            </div>

            {/* Max Dimensions */}
            <div className="md:col-span-2 pt-3 border-t border-slate-800/40">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Maximum Image Dimensions (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Max Width (px)</span>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={settings.maxWidth || ''}
                    onChange={(e) => onSettingsChange({ ...settings, maxWidth: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Max Height (px)</span>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={settings.maxHeight || ''}
                    onChange={(e) => onSettingsChange({ ...settings, maxHeight: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Images larger than these bounds will be downscaled proportionally. Smaller images will remain untouched.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
