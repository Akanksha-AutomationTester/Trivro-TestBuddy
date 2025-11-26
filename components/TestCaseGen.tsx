import React, { useState, useRef } from 'react';
import { generateTextQA } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { Loader2, Copy, Check, Sparkles, Paperclip, X, Image as ImageIcon, Download } from 'lucide-react';

const TestCaseGen: React.FC = () => {
  const [requirements, setRequirements] = useState('');
  const [type, setType] = useState('Functional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!requirements.trim() && images.length === 0) return;
    setLoading(true);
    setResult('');
    
    const prompt = `
      Create an EXHAUSTIVE and PROFESSIONAL Test Suite for the following requirements.
      Focus Area: ${type} Testing.
      
      Requirements Context:
      ${requirements}

      ${images.length > 0 ? 'Note: Screenshots have been attached. Use them to infer exact UI element names, layout, and validation messages for the steps.' : ''}

      MANDATORY OUTPUT STRUCTURE:
      1. **Overview**: Brief summary of scope.
      2. **Test Scenarios**:
         - **Positive Flow**: Happy path, valid data.
         - **Negative Flow**: Invalid data, error messages, empty fields, formatting errors.
         - **Boundary/Edge Cases**: Max/min limits, special characters, timeouts, concurrency.
         - **Security**: XSS inputs, SQL injection attempts, URL manipulation (if applicable).
         - **UI/UX**: Alignment, mobile responsiveness, tab order.

      FORMAT: Markdown Table ONLY for the test cases.
      Columns Required: 
      | ID | Module | Title | Type | Preconditions | Test Data | Detailed Execution Steps | Expected Result | Priority |

      IMPORTANT:
      - The "Detailed Execution Steps" must be numbered and granular.
      - "Expected Result" must be specific (e.g., "Error toast 'Invalid Email' appears in red").
      - Do not group test cases vaguely. List every single permutation as a separate row.
    `;

    const response = await generateTextQA(prompt, images);
    setResult(response);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadExcel = () => {
    if (!result) return;

    // Parse Markdown Table to CSV
    const lines = result.split('\n');
    const csvRows: string[] = [];
    
    // Add BOM for Excel UTF-8 compatibility
    // Logic: Find lines with '|', strip outer pipes, split by '|', escape quotes
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
        // Skip markdown separator lines (e.g. ---|---)
        if (cells.some(c => c.match(/^[-:]+$/))) continue;

        const csvCells = cells.map(cell => {
          // Escape double quotes by doubling them
          const escaped = cell.replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(csvCells.join(','));
      }
    }

    if (csvRows.length === 0) {
      alert("No table data found to export.");
      return;
    }

    const blob = new Blob(["\uFEFF" + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "test_cases.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      {/* Input Section */}
      <div className="bg-slate-800 rounded-xl p-6 flex flex-col border border-slate-700 shadow-xl overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Input Requirements
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Test Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option>Functional (End-to-End)</option>
            <option>Regression Suite</option>
            <option>Security (OWASP Top 10)</option>
            <option>API & Backend Integration</option>
            <option>Performance & Load</option>
            <option>UI/UX & Accessibility</option>
          </select>
        </div>

        <div className="flex-1 mb-4 flex flex-col min-h-[200px]">
          <label className="block text-sm font-medium text-slate-400 mb-2">Requirements / User Stories</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Paste requirements, user stories, API docs, or describe the feature in detail..."
            className="flex-1 w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-4 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-sm mb-2"
          />
        </div>

        {/* Image Attachments */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-400">Screenshots (Optional)</label>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1 font-medium transition-colors"
            >
              <Paperclip className="w-3 h-3" />
              Attach Images
            </button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            multiple 
            accept="image/*" 
          />

          {images.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group w-16 h-16 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 bg-slate-900 border border-dashed border-slate-600 rounded-lg flex items-center justify-center hover:border-indigo-500 hover:bg-slate-800 transition-all"
              >
                <ImageIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-slate-700 bg-slate-900/50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800/50 transition-all text-slate-500 hover:text-indigo-400"
            >
              <Paperclip className="w-5 h-5 mb-1" />
              <span className="text-xs">Click to attach screenshots for better context</span>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || (!requirements.trim() && images.length === 0)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Detailed Suite...
            </>
          ) : (
            <>
              Generate Test Cases
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Generated Suite</h2>
          {result && (
            <div className="flex gap-2">
              <button
                onClick={handleDownloadExcel}
                className="text-slate-400 hover:text-white transition flex items-center gap-1 text-sm bg-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-600"
                title="Download as CSV"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white transition flex items-center gap-1 text-sm bg-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-600"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden bg-slate-900/50 rounded-lg border border-slate-700 p-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="animate-pulse">Analyzing requirements & generating scenarios...</p>
            </div>
          ) : result ? (
            <MarkdownRenderer content={result} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
              <p>Output will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCaseGen;