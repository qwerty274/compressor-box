import React, { useState, useRef } from 'react';
import { UploadCloud, FilePlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function UploadZone({ onFilesSelected, isDisabled }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const MAX_SINGLE_SIZE = 25 * 1024 * 1024; // 25 MB

  const validateFiles = (fileList) => {
    setErrorMsg(null);
    const files = Array.from(fileList);

    if (files.length === 0) return [];
    if (files.length > 20) {
      setErrorMsg('Maximum 20 files allowed per upload batch.');
      return [];
    }

    const validFiles = [];
    const errors = [];

    for (const file of files) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_EXTS.includes(ext)) {
        errors.push(`'${file.name}' is an unsupported file type.`);
        continue;
      }
      if (file.size > MAX_SINGLE_SIZE) {
        errors.push(`'${file.name}' exceeds the 25 MB size limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (errors.length > 0) {
      setErrorMsg(errors[0]);
    }

    return validFiles;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (isDisabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const valid = validateFiles(e.dataTransfer.files);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = validateFiles(e.target.files);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isDisabled && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/20'
            : 'border-slate-700/80 bg-slate-900/60 hover:border-indigo-500/60 hover:bg-slate-900/90'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileChange}
          disabled={isDisabled}
          className="hidden"
        />

        {/* Inner Graphic */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/20 mb-5 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
        </div>

        {/* Main Text */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Drop your files here
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          or click anywhere to browse from your device
        </p>

        {/* Action Button */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all mb-6">
          <FilePlus className="w-4 h-4" />
          <span>Choose Files</span>
        </div>

        {/* Allowed formats hint */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
          <span className="px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-800">
            JPG
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-800">
            PNG
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-800">
            WebP
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-950/60 border border-slate-800">
            PDF
          </span>
          <span className="text-slate-600">• Max 25 MB per file</span>
        </div>
      </div>

      {/* Error Toast */}
      {errorMsg && (
        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
