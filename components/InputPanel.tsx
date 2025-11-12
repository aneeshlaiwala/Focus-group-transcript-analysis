import React, { useState, useCallback } from 'react';
import { UploadIcon, LightbulbIcon, SparklesIcon } from './icons';

interface InputPanelProps {
  onAnalyze: (transcript: string, context: string, customPrompt: string) => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onAnalyze, isLoading }) => {
  const [transcript, setTranscript] = useState('');
  const [context, setContext] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File | undefined) => {
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File is too large. Please upload a file smaller than 5MB.');
      return;
    }
    
    const allowedExtensions = ['.txt', '.md', '.rtf'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
        setError('Invalid file type. Please upload a TXT, MD, or RTF file.');
        return;
    }

    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string | null;
      if (text && text.trim().length > 0) {
        setTranscript(text);
      } else {
        setTranscript('');
        setFileName('');
        setError('File is empty or invalid. Please upload a transcript with content.');
      }
    };
    reader.onerror = () => {
        setTranscript('');
        setFileName('');
        setError('Failed to read the file.');
    };
    reader.readAsText(file);
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
    event.target.value = ''; // Allow re-uploading the same file
  }, [processFile]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!transcript) {
        setError('Please upload a transcript file.');
        return;
    }
    if (!context) {
        setError('Please provide context for the focus group.');
        return;
    }
    setError('');
    onAnalyze(transcript, context, customPrompt);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
    }
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }, [processFile]);


  return (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file-upload" className="flex items-center gap-2 text-lg font-semibold text-brand-text-light mb-2">
            <UploadIcon className="h-5 w-5" />
            <span>Upload Transcript</span>
          </label>
          <div 
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-border border-dashed rounded-md transition-colors ${isDragging ? 'border-brand-primary bg-brand-primary/10' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-brand-text-dark" />
              <div className="flex text-sm text-brand-text-medium">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-brand-surface rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-secondary">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".txt,.md,.rtf" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-brand-text-dark">TXT, MD, RTF up to 5MB</p>
            </div>
          </div>
          {fileName && <p className="mt-2 text-sm text-brand-text-medium">File: {fileName}</p>}
        </div>

        <div>
          <label htmlFor="context" className="flex items-center gap-2 text-lg font-semibold text-brand-text-light mb-2">
            <LightbulbIcon className="h-5 w-5" />
            <span>Focus Group Context</span>
          </label>
          <textarea
            id="context"
            rows={4}
            className="w-full bg-brand-bg border border-brand-border rounded-md p-3 text-sm placeholder-brand-text-dark focus:ring-brand-primary focus:border-brand-primary"
            placeholder="e.g., A 2-hour focus group on EV ownership with first-time car buyers."
            value={context}
            onChange={(e) => {
              setContext(e.target.value);
              setError('');
            }}
          />
        </div>

        <div>
          <label htmlFor="custom-prompt" className="flex items-center gap-2 text-lg font-semibold text-brand-text-light mb-2">
            <SparklesIcon className="h-5 w-5" />
            <span>Custom Prompt (Optional)</span>
          </label>
          <textarea
            id="custom-prompt"
            rows={3}
            className="w-full bg-brand-bg border border-brand-border rounded-md p-3 text-sm placeholder-brand-text-dark focus:ring-brand-primary focus:border-brand-primary"
            placeholder="e.g., Focus on identifying marketing angles for female buyers."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !transcript}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-sky-500 disabled:bg-brand-border disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Generate Insights'
          )}
        </button>
      </form>
    </div>
  );
};