import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { EmotionPoint } from '../../types';

interface EmotionTimelineChartProps {
  data: EmotionPoint[];
}

const emotionToValue = (emotion: string): number => {
    const emotionMap: { [key: string]: number } = {
        'hopeful': 5, 'curiosity': 5, 'trust': 4, 'positive': 4, 'confident': 4,
        'neutral': 3, 'cautious': 3, 'skepticism': 3,
        'anxiety': 2, 'frustrated': 2, 'negative': 2,
        'resigned': 1, 'angry': 1,
    };
    const lowerEmotion = emotion.toLowerCase();
    return emotionMap[lowerEmotion] || 3; // Default to neutral
};


const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0].payload;
        return (
          <div className="bg-brand-surface p-3 border border-brand-border rounded-md shadow-lg max-w-xs">
            <p className="font-bold text-brand-text-light">{`Phase ${label}: ${dataPoint.emotion}`}</p>
            <p className="text-sm text-brand-text-medium italic mt-1">"{dataPoint.quote}"</p>
          </div>
        );
      }
    
      return null;
};


export const EmotionTimelineChart: React.FC<EmotionTimelineChartProps> = ({ data }) => {

  const chartData = data.map(point => ({
    ...point,
    value: emotionToValue(point.emotion)
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
            dataKey="segment" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            stroke="#6B7280"
            label={{ value: 'Conversation Phase', position: 'insideBottom', offset: -5, fill: '#9CA3AF', fontSize: 12 }}
        />
        <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            stroke="#6B7280" 
            domain={[0, 6]} 
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value) => ['','Negative', '', 'Neutral', '', 'Positive'][value]}
        />
        <Tooltip content={<CustomTooltip />}/>
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line 
            type="monotone" 
            dataKey="value" 
            name="Emotional Tone" 
            stroke="#38BDF8" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
            dot={{ r: 4, fill: '#38BDF8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};