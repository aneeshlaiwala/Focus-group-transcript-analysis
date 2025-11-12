import React from 'react';
import type { AnalysisReport, ExecutiveSummary, SWOTAnalysis } from '../types';
import { ReportSection } from './ReportSection';
import { ArchetypePieChart } from './charts/ArchetypePieChart';
import { EmotionTimelineChart } from './charts/EmotionTimelineChart';
import { BotIcon, CheckCircleIcon, AlertTriangleIcon, UsersIcon, InfoIcon, LightbulbIcon, ThumbsUpIcon, ThumbsDownIcon, TargetIcon, ShieldIcon } from './icons';
import { InsightGraphChart } from './charts/InsightGraphChart';

interface ReportDisplayProps {
  report: AnalysisReport | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8 bg-brand-surface border border-brand-border rounded-lg">
    <div className="relative mb-4">
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full blur opacity-50 animate-pulse"></div>
      <BotIcon className="relative h-16 w-16 text-brand-primary" />
    </div>
    <h3 className="text-xl font-semibold text-brand-text-light mb-2">Q-Lens AI is thinking...</h3>
    <p className="text-brand-text-medium max-w-md">Analyzing transcript, identifying patterns, and synthesizing insights for your executive report. This may take a moment.</p>
  </div>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8 bg-brand-surface border border-brand-border rounded-lg">
        <BotIcon className="h-16 w-16 text-brand-text-dark mb-4" />
        <h3 className="text-xl font-semibold text-brand-text-light mb-2">Awaiting Analysis</h3>
        <p className="text-brand-text-medium max-w-md">Upload a transcript and provide context to generate your advanced focus group report.</p>
    </div>
);


const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg">
        <AlertTriangleIcon className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-xl font-semibold text-red-300 mb-2">Analysis Failed</h3>
        <p className="text-red-300/80 max-w-md">{message}</p>
    </div>
);

const Commentary: React.FC<{ objective: string; insights: string; howToRead?: string; }> = ({ objective, insights, howToRead }) => (
    <div className="space-y-4 mb-6">
        <div className="bg-brand-bg/50 p-4 rounded-lg border border-brand-border">
            <h4 className="flex items-center gap-2 font-semibold text-brand-text-light text-sm mb-2"><InfoIcon className="h-5 w-5 text-brand-secondary"/>Objective</h4>
            <p className="text-brand-text-medium text-sm">{objective}</p>
        </div>
        {howToRead && (
             <div className="bg-brand-bg/50 p-4 rounded-lg border border-brand-border">
                <h4 className="flex items-center gap-2 font-semibold text-brand-text-light text-sm mb-2"><InfoIcon className="h-5 w-5 text-brand-secondary"/>How to Read This Chart</h4>
                <p className="text-brand-text-medium text-sm">{howToRead}</p>
            </div>
        )}
        <div className="bg-brand-bg/50 p-4 rounded-lg border border-brand-primary/50">
            <h4 className="flex items-center gap-2 font-semibold text-brand-text-light text-sm mb-2"><LightbulbIcon className="h-5 w-5 text-brand-primary"/>Key Insights</h4>
            <p className="text-brand-text-medium text-sm whitespace-pre-line">{insights}</p>
        </div>
    </div>
);

const SwotCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string; }> = ({ title, items, icon, color }) => (
    <div className="bg-brand-bg p-4 rounded-lg">
        <div className={`flex items-center gap-3 mb-3 text-lg font-bold ${color}`}>
            {icon}
            <h3>{title}</h3>
        </div>
        <ul className="space-y-2 list-disc list-inside text-sm text-brand-text-medium">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);

const ExecutiveSummaryDisplay: React.FC<{ summary: ExecutiveSummary }> = ({ summary }) => (
    <ReportSection title="Executive Summary">
        <p className="text-brand-text-medium leading-relaxed mb-6">{summary.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SwotCard title="Strengths" items={summary.swot.strengths} icon={<ThumbsUpIcon className="h-6 w-6"/>} color="text-green-400" />
            <SwotCard title="Weaknesses" items={summary.swot.weaknesses} icon={<ThumbsDownIcon className="h-6 w-6"/>} color="text-red-400" />
            <SwotCard title="Opportunities" items={summary.swot.opportunities} icon={<TargetIcon className="h-6 w-6"/>} color="text-sky-400" />
            <SwotCard title="Threats" items={summary.swot.threats} icon={<ShieldIcon className="h-6 w-6"/>} color="text-amber-400" />
        </div>
        <div className="bg-brand-bg/50 p-4 rounded-lg">
            <h4 className="font-semibold text-brand-text-light mb-2">Strategic Recommendations</h4>
            <p className="text-brand-text-medium text-sm">{summary.strategicRecommendations}</p>
        </div>
    </ReportSection>
);

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, isLoading, error }) => {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!report) return <InitialState />;

  return (
    <div className="space-y-8" id="report-content">
      <ExecutiveSummaryDisplay summary={report.executiveSummary} />

      <ReportSection title="Narrative Summary">
        <p className="text-brand-text-medium leading-relaxed">{report.narrativeSummary}</p>
      </ReportSection>

      <ReportSection title="Archetype Split">
        <Commentary objective={report.archetypeMapping.commentary.objective} insights={report.archetypeMapping.commentary.keyInsights} howToRead={report.archetypeMapping.commentary.howToRead} />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div id="archetype-chart-container" className="h-80"><ArchetypePieChart data={report.archetypeMapping.data} /></div>
            <div className="space-y-4">
                {report.archetypeMapping.data.map(archetype => (
                    <div key={archetype.name}>
                        <h4 className="font-semibold text-brand-text-light">{archetype.name} ({archetype.percentage}%)</h4>
                        <p className="text-sm text-brand-text-medium">{archetype.description}</p>
                        <blockquote className="mt-1 pl-3 border-l-2 border-brand-border text-sm italic text-brand-text-dark">"{archetype.quotes[0]}"</blockquote>
                    </div>
                ))}
            </div>
         </div>
      </ReportSection>
      
      <ReportSection title="Emotion Trajectory">
        <Commentary objective={report.emotionTrajectory.commentary.objective} insights={report.emotionTrajectory.commentary.keyInsights} howToRead={report.emotionTrajectory.commentary.howToRead} />
        <div id="emotion-chart-container" className="h-80 w-full"><EmotionTimelineChart data={report.emotionTrajectory.data} /></div>
      </ReportSection>

      <ReportSection title="Top 5 Themes">
        <Commentary objective={report.topThemes.commentary.objective} insights={report.topThemes.commentary.keyInsights} />
        <div className="space-y-4">
          {report.topThemes.data.map((theme, i) => (
            <div key={i} className="p-4 bg-brand-bg rounded-md">
                <h4 className="font-semibold text-brand-text-light">{theme.theme} - <span className="text-sm font-normal text-brand-text-medium">{theme.sentiment}</span></h4>
                <blockquote className="mt-1 pl-3 border-l-2 border-brand-border text-sm italic text-brand-text-dark">"{theme.supportingQuotes[0]}"</blockquote>
            </div>
          ))}
        </div>
      </ReportSection>
      
       <ReportSection title="Insight Graph Analysis">
            <Commentary objective={report.insightGraph.commentary.objective} insights={report.insightGraph.commentary.keyInsights} howToRead={report.insightGraph.commentary.howToRead} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="h-72 w-full">
                <InsightGraphChart data={report.insightGraph.data} />
              </div>
              <div className="p-4 bg-brand-bg rounded-md self-start">
                  <h4 className="font-semibold text-brand-text-light">Key Connections</h4>
                  <ul className="list-none mt-2 space-y-2">
                      {report.insightGraph.data.connections.map((c, i) => (
                          <li key={i} className="flex items-center text-sm text-brand-text-medium">
                              <span className="font-medium text-brand-primary">{c.from}</span>
                              <span className="mx-2 text-brand-text-dark">&rarr;</span>
                              <span className="font-medium text-brand-secondary">{c.to}</span>
                              <span className="ml-2 text-brand-text-dark italic">({c.relationship})</span>
                          </li>
                      ))}
                  </ul>
                  <h4 className="font-semibold text-brand-text-light mt-4">Summary</h4>
                  <p className="text-sm text-brand-text-medium mt-1">{report.insightGraph.data.summary}</p>
              </div>
            </div>
        </ReportSection>

        {report.participantPersonas && report.participantPersonas.data.length > 0 && (
          <ReportSection title="Participant Personas">
            <Commentary objective={report.participantPersonas.commentary.objective} insights={report.participantPersonas.commentary.keyInsights} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.participantPersonas.data.map((persona, i) => (
                <div key={i} className="p-4 bg-brand-bg rounded-md flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0 bg-brand-surface p-2 rounded-full">
                      <UsersIcon className="h-6 w-6 text-brand-secondary" />
                    </div>
                    <h4 className="text-lg font-bold text-brand-text-light">{persona.personaName}</h4>
                  </div>
                  <p className="text-sm text-brand-text-medium mb-3 flex-grow">{persona.description}</p>
                  <div>
                    <h5 className="text-sm font-semibold text-brand-text-medium mb-2">Key Characteristics:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-brand-text-medium mb-3">
                        {persona.keyCharacteristics.map((char, j) => <li key={j}>{char}</li>)}
                    </ul>
                    <h5 className="text-sm font-semibold text-brand-text-medium mb-2">Representative Quotes:</h5>
                    <div className="space-y-2">
                        {persona.representativeQuotes.map((quote, k) => (
                            <blockquote key={k} className="pl-3 border-l-2 border-brand-border text-sm italic text-brand-text-dark">"{quote}"</blockquote>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ReportSection>
        )}

        <ReportSection title="Contradiction Finder">
            <Commentary objective={report.contradictionFinder.commentary.objective} insights={report.contradictionFinder.commentary.keyInsights} />
            <div className="space-y-4">
                {report.contradictionFinder.data.map((item, i) => (
                    <div key={i} className="p-4 bg-brand-bg rounded-md">
                        <h4 className="font-semibold text-brand-text-light">{item.topic}</h4>
                        <div className="mt-2 text-sm space-y-1">
                            <p className="text-brand-text-medium">"<span className="italic">{item.contradictoryQuotes[0]}</span>"</p>
                            <p className="text-brand-text-dark font-bold text-center">vs.</p>
                            <p className="text-brand-text-medium">"<span className="italic">{item.contradictoryQuotes[1]}</span>"</p>
                        </div>
                        <p className="text-xs text-brand-text-dark mt-3">{item.analysis}</p>
                    </div>
                ))}
            </div>
        </ReportSection>

      <ReportSection title="Agentic Analysis Layer">
        <Commentary objective={report.agenticAnalysis.commentary.objective} insights={report.agenticAnalysis.commentary.keyInsights} />
        <p className="text-brand-text-medium mb-6 p-4 bg-brand-bg rounded-md border-l-4 border-brand-primary">{report.agenticAnalysis.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-brand-text-light">Cognitive Biases</h4>
            {report.agenticAnalysis.cognitiveBiases.map((bias, i) => (
                <div key={i} className="text-sm p-3 bg-brand-bg rounded-md">
                    <p className="font-bold text-brand-secondary">{bias.bias}</p>
                    <blockquote className="italic text-brand-text-medium mt-1">"{bias.quote}"</blockquote>
                </div>
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-brand-text-light">Key Metaphors</h4>
            {report.agenticAnalysis.keyMetaphors.map((m, i) => (
                <div key={i} className="text-sm p-3 bg-brand-bg rounded-md">
                    <p className="font-bold text-brand-primary">{m.metaphor}</p>
                     <blockquote className="italic text-brand-text-medium mt-1">"{m.quote}"</blockquote>
                    <p className="text-xs text-brand-text-dark mt-1">{m.meaning}</p>
                </div>
            ))}
          </div>
        </div>
      </ReportSection>

      <ReportSection title="Actionable Recommendations">
        <Commentary objective={report.actionableRecommendations.commentary.objective} insights={report.actionableRecommendations.commentary.keyInsights} />
        <ul className="space-y-4">
            {report.actionableRecommendations.data.map((rec, i) => (
                <li key={i} className="flex gap-4 items-start p-4 bg-brand-bg rounded-md">
                    <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-semibold text-brand-text-light">{rec.area}: <span className="font-normal">{rec.recommendation}</span></h4>
                        <p className="text-sm text-brand-text-medium mt-1">{rec.reasoning}</p>
                    </div>
                </li>
            ))}
        </ul>
      </ReportSection>
    </div>
  );
};