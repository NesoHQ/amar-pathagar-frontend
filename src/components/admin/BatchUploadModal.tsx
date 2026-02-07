"use client";

import { useState } from "react";
import { X, Upload, FileJson, AlertCircle, Info, Copy } from "lucide-react";

interface BatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any[]) => Promise<void>;
}

export default function BatchUploadModal({
  isOpen,
  onClose,
  onUpload,
}: BatchUploadModalProps) {
  const [jsonText, setJsonText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  if (!isOpen) return null;

  const handleValidate = () => {
    try {
      if (!jsonText.trim()) {
        setValidationError("Please paste some JSON data first.");
        return null;
      }
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setValidationError("Data must be an array of book objects.");
        return null;
      }

      // Deep validation of required fields and duplicates within array
      const codes = new Set();
      for (let i = 0; i < parsed.length; i++) {
        const book = parsed[i];
        if (!book.title || !book.author || !book.physical_code) {
          setValidationError(`Book #${i + 1} is missing required fields (title, author, or physical_code).`);
          return null;
        }
        
        if (codes.has(book.physical_code)) {
          setValidationError(`Duplicate Error: Physical Code "${book.physical_code}" is repeated in your list (see Book #${i + 1}). Each book must have a unique identifier.`);
          return null;
        }
        codes.add(book.physical_code);
      }

      setValidationError(null);
      return parsed;
    } catch (e) {
      setValidationError("Invalid JSON format. Please check for syntax errors.");
      return null;
    }
  };

  const handleUpload = async () => {
    const data = handleValidate();
    if (!data) return;

    setIsUploading(true);
    setValidationError(null);
    try {
      await onUpload(data);
      setJsonText("");
      onClose();
    } catch (err: any) {
      const serverError = err.response?.data?.error || err.message;
      if (serverError.includes("resource already exists")) {
        // Try to extract the physical code from the detail string
        // Key (physical_code)=(P001) already exists.
        const match = serverError.match(/\(physical_code\)=\((.*?)\)/);
        const duplicateCode = match ? match[1] : null;
        
        if (duplicateCode) {
          setValidationError(`Error: The Physical Code "${duplicateCode}" already exists in the system. Each book must have a unique identifier.`);
        } else {
          setValidationError("Error: One or more books have a Physical Code that already exists. Each book must have a unique identifier.");
        }
      } else if (err.response?.status === 400) {
        setValidationError(`Input Error: ${serverError}`);
      } else {
        setValidationError("Failed to upload books. Please check your data and try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const sampleJSON = `[
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "physical_code": "P001",
    "category": "Programming",
    "description": "A Handbook of Agile Software Craftsmanship",
    "max_reading_days": 14
  },
  {
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt, David Thomas",
    "isbn": "9780135957059",
    "physical_code": "P002",
    "category": "Programming",
    "description": "Your Journey To Mastery",
    "max_reading_days": 21
  }
]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-old-paper w-full max-w-4xl border-4 border-old-ink shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="border-b-4 border-old-ink p-4 flex justify-between items-center bg-old-ink text-old-paper text-sm">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-widest text-base">Batch Book Upload</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className={`flex items-center gap-1.5 px-3 py-1 border-2 border-old-paper/20 hover:border-old-paper transition-all uppercase font-bold text-xs ${showHelp ? 'bg-old-paper/20' : ''}`}
            >
              <Info className="w-4 h-4" />
              {showHelp ? 'Hide Format' : 'View Format'}
            </button>
            <button onClick={onClose} className="hover:rotate-90 transition-transform">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-full overflow-hidden">
          {/* Main Editor */}
          <div className="p-6 flex-1 flex flex-col min-w-0 border-r-4 border-old-ink/10">
            <div className="mb-4">
              <p className="text-old-ink font-bold uppercase text-xs mb-1">JSON Input Area</p>
              <p className="text-[10px] text-old-grey uppercase">Array of book objects expected</p>
            </div>

            <div className="relative flex-1 group min-h-[400px]">
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                className="w-full h-full p-6 border-4 border-old-border bg-white font-mono text-sm focus:border-old-ink outline-none transition-colors resize-none shadow-inner"
                placeholder={`[\n  {\n    "title": "Book Title",\n    "author": "Author Name",\n    "physical_code": "CODE123",\n    ...\n  }\n]`}
              />
            </div>

            {validationError && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border-2 border-red-200 text-red-700 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{validationError}</p>
              </div>
            )}
          </div>

          {/* Help Panel (Collapsible) */}
          {showHelp && (
            <div className="w-80 bg-gray-50 p-6 flex flex-col gap-6 overflow-y-auto animate-in slide-in-from-right duration-300 border-l-4 border-old-ink/5">
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold uppercase text-xs text-old-ink">Example Structure</h3>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(sampleJSON);
                      // Visual feedback could be added here
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy Example"
                  >
                    <Copy className="w-3.5 h-3.5 text-old-grey" />
                  </button>
                </div>
                <pre className="p-4 bg-old-paper border-2 border-old-border font-mono text-[10px] leading-relaxed text-old-ink shadow-sm overflow-x-auto whitespace-pre-wrap">
                  {sampleJSON}
                </pre>
              </section>

              <div className="space-y-4">
                <section>
                  <h4 className="font-bold uppercase text-[10px] text-old-ink mb-2 border-b border-old-ink/10 pb-1">Required</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-[10px] text-old-grey font-medium">
                    <li>title <span className="text-red-500 font-black">*</span></li>
                    <li>author <span className="text-red-500 font-black">*</span></li>
                    <li>physical_code <span className="text-red-500 font-black">*</span> <span className="text-[9px] text-blue-600 font-bold">(Unique Identifier)</span></li>
                  </ul>
                </section>
                <section>
                  <h4 className="font-bold uppercase text-[10px] text-old-ink mb-2 border-b border-old-ink/10 pb-1">Optional</h4>
                  <ul className="grid grid-cols-1 gap-1.5 text-[10px] text-old-grey font-medium">
                    <li>• isbn (string)</li>
                    <li>• category (string)</li>
                    <li>• description (text)</li>
                    <li>• max_reading_days (number)</li>
                  </ul>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-old-ink p-4 flex justify-between items-center bg-gray-100">
          <div className="hidden md:block text-[10px] uppercase text-old-grey font-bold tracking-tight">
            Valid JSON array containing objects with at least title and author.
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border-2 border-old-ink font-bold uppercase hover:bg-white transition-all text-xs"
            >
              Close
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-10 py-2 bg-old-ink text-old-paper border-2 border-old-ink font-bold uppercase hover:bg-white hover:text-old-ink transition-all disabled:opacity-50 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-old-paper border-t-transparent animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploading ? "Uploading..." : "Finish Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
