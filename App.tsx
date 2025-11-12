import React, { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { ReportDisplay } from './components/ReportDisplay';
import { LogoIcon, DownloadIcon } from './components/icons';
import type { AnalysisReport } from './types';
import { generateInsights } from './services/geminiService';

const App: React.FC = () => {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = useCallback(async (transcript: string, context: string, customPrompt: string) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const result = await generateInsights(transcript, context, customPrompt);
      setReport(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = () => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement) {
      console.error('Report content element not found');
      return;
    }

    const reportHtml = reportElement.innerHTML;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Q-Lens AI Report</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'brand-bg': '#111827',
                  'brand-surface': '#1F2937',
                  'brand-border': '#374151',
                  'brand-primary': '#38BDF8',
                  'brand-secondary': '#818CF8',
                  'brand-text-light': '#F9FAFB',
                  'brand-text-medium': '#9CA3AF',
                  'brand-text-dark': '#6B7280',
                },
              },
            },
          }
        </script>
        <script type="importmap">
        {
          "imports": {
            "recharts": "https://aistudiocdn.com/recharts@^3.4.1"
          }
        }
        </script>
      </head>
      <body class="bg-brand-bg text-brand-text-light font-sans">
        <main class="container mx-auto p-4 md:p-6 lg:p-8">
          <h1 class="text-3xl font-bold text-brand-text-light mb-6">Q-Lens AI Report</h1>
          ${reportHtml}
        </main>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Q-Lens-AI-Report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="p-4 border-b border-brand-border sticky top-0 bg-brand-bg/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoIcon className="h-8 w-8 text-brand-primary" />
              <h1 className="text-2xl font-bold text-brand-text-light">Q-Lens AI</h1>
            </div>
            {report && !isLoading && !error && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 py-2 px-4 border border-brand-border rounded-md shadow-sm text-sm font-medium text-brand-text-light bg-brand-surface hover:bg-brand-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
              >
                <DownloadIcon className="h-5 w-5" />
                Download Report
              </button>
            )}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
            <InputPanel onAnalyze={handleAnalysis} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <ReportDisplay report={report} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
      
      <footer className="p-4 text-center text-brand-text-dark text-sm border-t border-brand-border">
          Powered by Gemini - Advanced Language Intelligence
      </footer>
    </div>
  );
};

export default App;