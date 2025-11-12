import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Archetype } from '../../types';

interface ArchetypePieChartProps {
  data: Archetype[];
}

const COLORS = ['#38BDF8', '#818CF8', '#F472B6', '#FBBF24', '#4ADE80', '#A78BFA'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-surface p-2 border border-brand-border rounded-md shadow-lg">
          <p className="font-bold text-brand-text-light">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
  
    return null;
  };

export const ArchetypePieChart: React.FC<ArchetypePieChartProps> = ({ data }) => {
  const chartData = data.map(item => ({ name: item.name, value: item.percentage }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
            wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} 
            iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};