import React, { useState, useRef } from 'react';
import { generateTextQA } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { Loader2, Copy, Check, Bug, Paperclip, X, Image as ImageIcon, Download } from 'lucide-react';

const BugReportGen: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [severity, setSeverity] = useState('High');
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
    if (!notes.trim() && images.length === 0) return;
    setLoading(true);
    setResult('');
    
    const prompt = `
      You are a Senior QA Lead. Transform these rough notes into a FLAWLESS, INDUSTRY-STANDARD BUG REPORT (IEEE-829).
      
      Target Severity: ${severity}
      
      Rough Notes / User Observation:
      ${notes}

      ${images.length > 0 ? 'Note: Evidence screenshots are attached. Analyze them for error codes, UI distortions, or console logs.' : ''}

      MANDATORY SECTIONS (Markdown Format):
      1. **Bug ID**: Generate a unique format (e.g., BUG-2024-XXX).
      2. **Title**: Concise, technically accurate, following format: [Module] - [Error] - [Condition].
      3. **Environment**: Infer OS, Browser, App Version if not provided.
      4. **Preconditions**: What must be true before starting?
      5. **Test Data**: Specific accounts or inputs used.
      6. **Steps to Reproduce**: Numbered, highly granular steps.
      7. **Expected Result**: What exactly should have happened?
      8. **Actual Result**: Detailed description of the failure.
      9. **Severity & Priority**: With justification.
      10. **Root Cause Analysis (Hypothesis)**: Technical guess.
      11. **Impact Analysis**: Business/User impact.
      12. **Suggested Fix**: Technical recommendation.

      ***CRITICAL***: 
      At the very end of your response, strictly output the bug report data as a single JSON object inside a \`\`\`json code block. 
      The JSON keys must be: "BugID", "Title", "Environment", "Preconditions", "TestData", "Steps", "ExpectedResult", "ActualResult", "Severity", "RootCause", "Impact", "Fix".
      Do not include any text after the JSON block.
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

    try {
      // Extract JSON block
      const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/);
      let csvContent = "";

      if (jsonMatch && jsonMatch[1]) {
        const jsonData = JSON.parse(jsonMatch[1]);
        const headers = Object.keys(jsonData);
        const values = Object.values(jsonData).map(v => {
          // Escape quotes and handle newlines
          const str = String(v).replace(/"/g, '""');
          return `"${str}"`;
        });

        // Create Header Row and Value Row
        csvContent = "\uFEFF" + headers.map(h => `"${h}"`).join(',') + "\n" + values.join(',');
      } else {
        // Fallback if JSON is missing
        const lines = result.split('\n');
        const rows: string[] = [];
        lines.forEach(line => {
             const clean = line.replace(/"/g, '""');
             rows.push(`"${clean}"`);
        });
        csvContent = "\uFEFF" + rows.join('\n');
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `bug_report_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Could not parse data for Excel. Please copy text manually.");
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      {/* Input Section */}
      <div className="bg-slate-800 rounded-xl p-6 flex flex-col border border-slate-700 shadow-xl overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <Bug className="w-5 h-5 text-red-400" />
          Bug Details
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-400 mb-2">Severity Assessment</label>
          <select 
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option>Critical (Blocker)</option>
            <option>High (Major Functionality)</option>
            <option>Medium (Workaround Available)</option>
            <option>Low (Cosmetic/Minor)</option>
          </select>
        </div>

        <div className="flex-1 mb-4 flex flex-col min-h-[200px]">
          <label className="block text-sm font-medium text-slate-400 mb-2">Issue Description / Rough Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe what happened. Include environment, actions taken, and what went wrong. Paste error logs if available..."
            className="flex-1 w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-4 resize-none focus:ring-2 focus:ring-red-500 focus:outline-none font-mono text-sm mb-2"
          />
        </div>

        {/* Image Attachments */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-400">Screenshots (Evidence)</label>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 font-medium transition-colors"
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
                  <img src={img} alt={`Evidence ${idx}`} className="w-full h-full object-cover" />
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
                className="w-16 h-16 bg-slate-900 border border-dashed border-slate-600 rounded-lg flex items-center justify-center hover:border-red-500 hover:bg-slate-800 transition-all"
              >
                <ImageIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-slate-700 bg-slate-900/50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-slate-800/50 transition-all text-slate-500 hover:text-red-400"
            >
              <Paperclip className="w-5 h-5 mb-1" />
              <span className="text-xs">Click to attach evidence/screenshots</span>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || (!notes.trim() && images.length === 0)}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Standardizing Report...
            </>
          ) : (
            <>
              Generate Professional Report
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Formatted Report</h2>
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
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              <p className="animate-pulse">Thinking like a Senior QA Lead...</p>
            </div>
          ) : result ? (
            // Remove the JSON block from display to keep it clean for the user
            <MarkdownRenderer content={result.replace(/```json[\s\S]*?```/, '')} />
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

export default BugReportGen;