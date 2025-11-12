export interface StuckMoment {
  quote: string;
  suggestion: string;
}

export interface CognitiveBias {
  bias: string;
  quote: string;
  explanation: string;
}

export interface KeyMetaphor {
  metaphor: string;
  quote: string;
  meaning: string;
}

export interface AgenticAnalysis {
  summary: string;
  stuckMoments: StuckMoment[];
  cognitiveBiases: CognitiveBias[];
  keyMetaphors: KeyMetaphor[];
  commentary: {
    objective: string;
    keyInsights: string;
  };
}

export interface EmotionPoint {
  segment: number;
  emotion: string;
  quote: string;
}

export interface Archetype {
  name: string;
  percentage: number;
  description: string;
  quotes: string[];
}

export interface InsightTheme {
  theme: string;
  supportingQuotes: string[];
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
}

export interface InsightConnection {
  from: string;
  to: string;
  relationship: string;
}

export interface InsightGraph {
  themes: string[];
  connections: InsightConnection[];
  summary: string;
}

export interface Contradiction {
  topic: string;
  contradictoryQuotes: [string, string];
  analysis: string;
}

export interface ActionableRecommendation {
  area: string;
  recommendation: string;
  reasoning: string;
}

export interface ParticipantPersona {
  personaName: string;
  description: string;
  keyCharacteristics: string[];
  representativeQuotes: string[];
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ExecutiveSummary {
  summary: string;
  swot: SWOTAnalysis;
  strategicRecommendations: string;
}

export interface AnalysisReport {
  executiveSummary: ExecutiveSummary;
  narrativeSummary: string;
  agenticAnalysis: AgenticAnalysis;
  emotionTrajectory: {
    data: EmotionPoint[];
    commentary: {
      objective: string;
      howToRead: string;
      keyInsights: string;
    };
  };
  archetypeMapping: {
    data: Archetype[];
    commentary: {
      objective: string;
      howToRead: string;
      keyInsights: string;
    };
  };
  topThemes: {
    data: InsightTheme[];
    commentary: {
      objective: string;
      keyInsights: string;
    };
  };
  insightGraph: {
    data: InsightGraph;
    commentary: {
      objective: string;
      howToRead: string;
      keyInsights: string;
    };
  };
  contradictionFinder: {
    data: Contradiction[];
    commentary: {
      objective: string;
      keyInsights: string;
    };
  };
  actionableRecommendations: {
    data: ActionableRecommendation[];
    commentary: {
      objective: string;
      keyInsights: string;
    };
  };
  participantPersonas: {
    data: ParticipantPersona[];
    commentary: {
      objective: string;
      keyInsights: string;
    };
  };
}