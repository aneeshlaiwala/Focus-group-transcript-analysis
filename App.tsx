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
    if (!reportElement || !report) {
      console.error('Report content or data not found');
      return;
    }

    const reportHtml = reportElement.innerHTML;
    const reportDataString = JSON.stringify(report);

    const hydrationScript = `
      try {
        const React = await import('react');
        const { createRoot } = await import('react-dom/client');
        const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend: RechartsLegend, LineChart, Line, XAxis, YAxis, CartesianGrid } = await import('recharts');

        const reportData = JSON.parse(document.getElementById('report-data').textContent);

        // --- ArchetypePieChart Component ---
        const ArchetypePieChart = ({ data }) => {
          const COLORS = ['#38BDF8', '#818CF8', '#F472B6', '#FBBF24', '#4ADE80', '#A78BFA'];
          const CustomTooltip = ({ active, payload }) => {
              if (active && payload && payload.length) {
                return React.createElement('div', { className: "bg-brand-surface p-2 border border-brand-border rounded-md shadow-lg" }, 
                  React.createElement('p', { className: "font-bold text-brand-text-light" }, \`\${payload[0].name}: \${payload[0].value}%\` )
                );
              }
              return null;
          };
          const chartData = data.map(item => ({ name: item.name, value: item.percentage }));
          
          return React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(PieChart, null,
              React.createElement(Pie, {
                data: chartData,
                cx: "50%",
                cy: "50%",
                labelLine: false,
                outerRadius: "80%",
                fill: "#8884d8",
                dataKey: "value",
                nameKey: "name",
                stroke: "none"
              }, ...chartData.map((entry, index) => React.createElement(Cell, { key: \`cell-\${index}\`, fill: COLORS[index % COLORS.length] }))),
              React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
              React.createElement(RechartsLegend, { wrapperStyle: { fontSize: '12px', color: '#9CA3AF' }, iconType: "circle" })
            )
          );
        };

        // --- EmotionTimelineChart Component ---
        const EmotionTimelineChart = ({ data }) => {
          const emotionToValue = (emotion) => {
              const emotionMap = { 'hopeful': 5, 'curiosity': 5, 'trust': 4, 'positive': 4, 'confident': 4, 'neutral': 3, 'cautious': 3, 'skepticism': 3, 'anxiety': 2, 'frustrated': 2, 'negative': 2, 'resigned': 1, 'angry': 1 };
              return emotionMap[emotion.toLowerCase()] || 3;
          };
          const CustomTooltip = ({ active, payload, label }) => {
              if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return React.createElement('div', { className: "bg-brand-surface p-3 border border-brand-border rounded-md shadow-lg max-w-xs" },
                    React.createElement('p', { className: "font-bold text-brand-text-light" }, \`Phase \${label}: \${dataPoint.emotion}\`),
                    React.createElement('p', { className: "text-sm text-brand-text-medium italic mt-1" }, \`"\${dataPoint.quote}"\`)
                  );
              }
              return null;
          };
          const chartData = data.map(point => ({ ...point, value: emotionToValue(point.emotion) }));

          return React.createElement(ResponsiveContainer, { width: "100%", height: "100%" },
            React.createElement(LineChart, { data: chartData, margin: { top: 5, right: 30, left: 0, bottom: 5 } },
              React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
              React.createElement(XAxis, { 
                  dataKey: "segment", 
                  tick: { fill: '#9CA3AF', fontSize: 12 }, 
                  stroke: "#6B7280",
                  label: { value: 'Conversation Phase', position: 'insideBottom', offset: -5, fill: '#9CA3AF', fontSize: 12 }
              }),
              React.createElement(YAxis, { 
                  tick: { fill: '#9CA3AF', fontSize: 12 }, 
                  stroke: "#6B7280", 
                  domain: [0, 6], 
                  ticks: [1, 2, 3, 4, 5],
                  tickFormatter: (value) => ['','Negative', '', 'Neutral', '', 'Positive'][value]
              }),
              React.createElement(Tooltip, { content: React.createElement(CustomTooltip) }),
              React.createElement(RechartsLegend, { wrapperStyle: { fontSize: '12px' } }),
              React.createElement(Line, { 
                  type: "monotone", 
                  dataKey: "value", 
                  name: "Emotional Tone", 
                  stroke: "#38BDF8", 
                  strokeWidth: 2, 
                  activeDot: { r: 8 }, 
                  dot: { r: 4, fill: '#38BDF8' }
              })
            )
          );
        };
        
        // --- Hydration Logic ---
        const pieContainer = document.getElementById('archetype-chart-container');
        if (pieContainer && reportData.archetypeMapping) {
          const pieRoot = createRoot(pieContainer);
          pieRoot.render(React.createElement(ArchetypePieChart, { data: reportData.archetypeMapping.data }));
        }

        const emotionContainer = document.getElementById('emotion-chart-container');
        if (emotionContainer && reportData.emotionTrajectory) {
          const emotionRoot = createRoot(emotionContainer);
          emotionRoot.render(React.createElement(EmotionTimelineChart, { data: reportData.emotionTrajectory.data }));
        }
      } catch (e) {
        console.error("Failed to hydrate report charts:", e);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Could not load interactive charts.';
        errorDiv.style.color = 'red';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.padding = '1rem';
        document.body.appendChild(errorDiv);
      }
    `;

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
            "react": "https://aistudiocdn.com/react@^19.2.0",
            "react-dom/client": "https://aistudiocdn.com/react-dom@^19.2.0/client",
            "recharts": "https://aistudiocdn.com/recharts@^3.4.1"
          }
        }
        </script>
      </head>
      <body class="bg-brand-bg text-brand-text-light font-sans">
        <main class="container mx-auto p-4 md:p-6 lg:p-8">
          <h1 class="text-3xl font-bold text-brand-text-light mb-6">Q-Lens AI Report</h1>
          <div id="report-content-wrapper">${reportHtml}</div>
        </main>
        <script type="application/json" id="report-data">${reportDataString}</script>
        <script type="module">${hydrationScript}</script>
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