import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisReport } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const commentarySchema = {
    type: Type.OBJECT,
    properties: {
        objective: { type: Type.STRING, description: "A concise, one-sentence explanation of what this analysis section aims to achieve for a business leader." },
        keyInsights: { type: Type.STRING, description: "A bulleted or paragraph summary of the most critical, actionable insights derived from this section's data, written for an executive audience." },
    },
    required: ["objective", "keyInsights"]
};

const chartCommentarySchema = {
    type: Type.OBJECT,
    properties: {
        objective: { type: Type.STRING, description: "A concise, one-sentence explanation of what this analysis section aims to achieve for a business leader." },
        howToRead: { type: Type.STRING, description: "A brief, simple explanation of how to interpret the chart or graph (e.g., 'The x-axis represents time...')." },
        keyInsights: { type: Type.STRING, description: "A bulleted or paragraph summary of the most critical, actionable insights derived from the chart's data, written for an executive audience." },
    },
    required: ["objective", "howToRead", "keyInsights"]
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: {
            type: Type.OBJECT,
            description: "A high-level summary for C-suite executives, synthesizing all findings into strategic insights.",
            properties: {
                summary: { type: Type.STRING, description: "A 3-4 sentence paragraph summarizing the most critical findings and overall sentiment of the focus group." },
                swot: {
                    type: Type.OBJECT,
                    description: "A SWOT analysis based on the transcript.",
                    properties: {
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 key strengths or positive sentiments identified." },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 key weaknesses, risks, or negative sentiments identified." },
                        opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 potential market or product opportunities suggested by the participants." },
                        threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 potential competitive or market threats highlighted." },
                    },
                    required: ["strengths", "weaknesses", "opportunities", "threats"]
                },
                strategicRecommendations: { type: Type.STRING, description: "A final, high-level strategic recommendation based on the entire analysis." }
            },
            required: ["summary", "swot", "strategicRecommendations"]
        },
        narrativeSummary: { type: Type.STRING, description: "A 'Group Narrative Summary' from the Synthesizer Agent, weaving together all findings into a cohesive story about the focus group's collective mindset." },
        agenticAnalysis: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING, description: "A brief summary of the key findings from the agentic analysis, highlighting the most impactful biases, metaphors, and stuck moments." },
                stuckMoments: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { quote: {type: Type.STRING}, suggestion: {type: Type.STRING, description: "A follow-up question the moderator could have asked."} } }, description: "Identifies moments where probing failed." },
                cognitiveBiases: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { bias: {type: Type.STRING}, quote: {type: Type.STRING}, explanation: {type: Type.STRING}} }, description: "Detects cognitive biases like anchoring, social proof, etc." },
                keyMetaphors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { metaphor: {type: Type.STRING}, quote: {type: Type.STRING}, meaning: {type: Type.STRING}} }, description: "Flags recurring symbols and metaphors." },
                commentary: commentarySchema,
            },
            required: ["summary", "stuckMoments", "cognitiveBiases", "keyMetaphors", "commentary"]
        },
        emotionTrajectory: {
            type: Type.OBJECT,
            properties: {
                data: {
                    type: Type.ARRAY,
                    description: "Charts the emotional journey of the group through 5-7 key sequential phases. Each phase must have a representative quote.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            segment: { type: Type.INTEGER, description: "Sequential order of the emotional phase (1, 2, 3...)." },
                            emotion: { type: Type.STRING, description: "The dominant emotion for this segment. Must be one of: 'Hopeful', 'Curiosity', 'Trust', 'Positive', 'Confident', 'Neutral', 'Cautious', 'Skepticism', 'Anxiety', 'Frustrated', 'Negative', 'Resigned', 'Angry'." },
                            quote: { type: Type.STRING, description: "A verbatim quote that best represents this emotion." }
                        },
                        required: ["segment", "emotion", "quote"]
                    }
                },
                commentary: chartCommentarySchema,
            },
            required: ["data", "commentary"]
        },
        archetypeMapping: {
            type: Type.OBJECT,
            properties: {
                data: {
                    type: Type.ARRAY,
                    description: "Maps participant statements to Jungian archetypes. The sum of percentages should be 100.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "Name of the archetype (e.g., Explorer, Caregiver, Skeptic)." },
                            percentage: { type: Type.NUMBER, description: "Percentage of the group embodying this archetype." },
                            description: { type: Type.STRING, description: "A brief description of the archetype in the context of the discussion."},
                            quotes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key quotes that map to this archetype."}
                        },
                        required: ["name", "percentage", "description", "quotes"]
                    }
                },
                commentary: chartCommentarySchema,
            },
            required: ["data", "commentary"]
        },
        topThemes: {
            type: Type.OBJECT,
            properties: {
                data: {
                    type: Type.ARRAY,
                    description: "The top 5 most salient themes discussed.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            theme: { type: Type.STRING },
                            supportingQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                            sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral', 'Mixed']}
                        },
                        required: ["theme", "supportingQuotes", "sentiment"]
                    }
                },
                commentary: commentarySchema,
            },
            required: ["data", "commentary"]
        },
        insightGraph: {
            type: Type.OBJECT,
            properties: {
                data: {
                    type: Type.OBJECT,
                    description: "A linguistic knowledge graph linking themes, emotions, and rationales.",
                    properties: {
                        themes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        connections: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    from: { type: Type.STRING },
                                    to: { type: Type.STRING },
                                    relationship: { type: Type.STRING, description: "Describes the link (e.g., 'leads to', 'causes', 'is associated with')." }
                                },
                                required: ["from", "to", "relationship"]
                            }
                        },
                        summary: { type: Type.STRING, description: "A summary of the causal or correlational paths discovered."}
                    },
                    required: ["themes", "connections", "summary"]
                },
                commentary: chartCommentarySchema,
            },
            required: ["data", "commentary"]
        },
        contradictionFinder: {
            type: Type.OBJECT,
            properties: {
                data: {
                    type: Type.ARRAY,
                    description: "Identifies key contradictions in participant statements.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            topic: {type: Type.STRING},
                            contradictoryQuotes: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 2, maxItems: 2 },
                            analysis: { type: Type.STRING, description: "An analysis of why this contradiction is significant." }
                        },
                        required: ["topic", "contradictoryQuotes", "analysis"]
                    }
                },
                commentary: commentarySchema,
            },
            required: ["data", "commentary"]
        },
        actionableRecommendations: {
            type: Type.OBJECT,
            properties: {
                data: {
                    type: Type.ARRAY,
                    description: "Provides strategic, actionable recommendations based on the analysis.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            area: { type: Type.STRING, description: "Business area for the recommendation (e.g., 'Marketing', 'Product Development')." },
                            recommendation: { type: Type.STRING },
                            reasoning: { type: Type.STRING, description: "The 'why' behind the recommendation, linked to specific findings." }
                        },
                        required: ["area", "recommendation", "reasoning"]
                    }
                },
                commentary: commentarySchema,
            },
            required: ["data", "commentary"]
        },
        participantPersonas: {
            type: Type.OBJECT,
            properties: {
                data: {
                    type: Type.ARRAY,
                    description: "Synthesizes 2-4 distinct participant 'personas' or 'cluster profiles' based on recurring attitudes, beliefs, and emotional responses. These are AI-generated archetypes representing key segments within the group.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            personaName: { type: Type.STRING, description: "A descriptive name for the persona (e.g., 'The Pragmatic Planner', 'The Anxious Adopter')." },
                            description: { type: Type.STRING, description: "A detailed profile of this persona, including their core motivations, fears, and role in the group dynamic." },
                            keyCharacteristics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 bullet points summarizing the persona's key traits." },
                            representativeQuotes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Two or three verbatim quotes that strongly represent this persona's viewpoint." }
                        },
                        required: ["personaName", "description", "keyCharacteristics", "representativeQuotes"]
                    }
                },
                commentary: commentarySchema,
            },
            required: ["data", "commentary"]
        }
    },
    required: ["executiveSummary", "narrativeSummary", "agenticAnalysis", "emotionTrajectory", "archetypeMapping", "topThemes", "insightGraph", "contradictionFinder", "actionableRecommendations", "participantPersonas"]
};


export const generateInsights = async (transcript: string, context: string, customPrompt: string): Promise<AnalysisReport> => {
    const model = 'gemini-2.5-pro';
    
    const systemInstruction = `You are Q-Lens AI, a world-class strategic intelligence platform analyzing focus group transcripts for a C-level executive audience. Your analysis must be sharp, insightful, and strategically focused.
    Your entire output must be a single, valid JSON object conforming to the provided schema. For every analysis section, you must provide the requested data AND a commentary object containing a clear 'objective' and a summary of 'keyInsights'. For charts, also provide a 'howToRead' guide.
    
    INSTRUCTIONS:
    1.  Generate a high-level Executive Summary, including a SWOT analysis and strategic recommendations.
    2.  For each subsequent section, first perform the core analysis to generate the data, then generate the commentary on that data. The insights should be distilled for a busy executive.
    3.  Thoroughly analyze the provided transcript within the given context.
    4.  If a custom prompt is provided, let it guide the focus of your analysis, especially in the summaries and recommendations.
    5.  Your entire output must be a single, valid JSON object. Do not include any text outside of the JSON object.`;

    const fullPrompt = `
    **Focus Group Context:**
    ${context}

    **Focus Group Transcript:**
    \`\`\`
    ${transcript}
    \`\`\`

    **Custom Analysis Prompt:**
    ${customPrompt || "No custom prompt provided. Perform a general analysis and generate a full executive report."}
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.2,
            },
        });

        const jsonString = response.text;
        const parsedResult = JSON.parse(jsonString);
        return parsedResult as AnalysisReport;

    } catch (error) {
        console.error("Error generating insights from Gemini:", error);
        if(error instanceof Error && error.message.includes('API_KEY_INVALID')) {
             throw new Error("The API key is invalid. Please check your environment configuration.");
        }
        throw new Error("Failed to generate insights. The model may have returned an invalid response.");
    }
};