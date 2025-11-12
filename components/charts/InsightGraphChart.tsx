import React from 'react';
import type { InsightGraph } from '../../types';

interface InsightGraphChartProps {
  data: InsightGraph;
}

export const InsightGraphChart: React.FC<InsightGraphChartProps> = ({ data }) => {
  const { themes, connections } = data;
  const width = 500;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  // Reduce radius to give more space for text labels
  const radius = Math.min(centerX, centerY) * 0.7;
  const nodeRadius = 8;
  const fontSize = 11; // Slightly reduce font size for better fit

  if (!themes || themes.length === 0) {
    return <div className="text-brand-text-medium text-center">No graph data to display.</div>;
  }
  
  const angleStep = (2 * Math.PI) / themes.length;

  const nodes = themes.map((theme, i) => ({
    id: theme,
    x: centerX + radius * Math.cos(i * angleStep - Math.PI / 2),
    y: centerY + radius * Math.sin(i * angleStep - Math.PI / 2),
  }));

  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  const edges = connections.map(conn => ({
    source: nodeMap.get(conn.from),
    target: nodeMap.get(conn.to),
  })).filter(edge => edge.source && edge.target);

  const calculateTextAnchor = (angle: number) => {
    const degrees = (angle * 180 / Math.PI + 360) % 360;
    if (degrees > 10 && degrees < 170) return 'start';
    if (degrees > 190 && degrees < 350) return 'end';
    return 'middle';
  }
  
  const calculateTextOffset = (angle: number) => {
    const degrees = (angle * 180 / Math.PI + 360) % 360;
    const offset = nodeRadius + 5;
    if (degrees > 10 && degrees < 170) return { x: offset, y: fontSize / 3 };
    if (degrees > 190 && degrees < 350) return { x: -offset, y: fontSize / 3 };
    if (degrees <= 10 || degrees >= 350) return { x: 0, y: -offset }; // top
    return {x: 0, y: offset + 5 }; // bottom
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{maxWidth: '500px', margin: '0 auto'}}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8.5" refY="1.75" orient="auto">
          <polygon points="0 0, 2.5 1.75, 0 3.5" fill="#818CF8" />
        </marker>
      </defs>
      {edges.map((edge, i) => {
          if(!edge.source || !edge.target) return null;
          const dx = edge.target.x - edge.source.x;
          const dy = edge.target.y - edge.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / dist;
          const ny = dy / dist;
          const targetX = edge.target.x - nx * (nodeRadius + 2);
          const targetY = edge.target.y - ny * (nodeRadius + 2);

          return (
            <line
                key={i}
                x1={edge.source.x}
                y1={edge.source.y}
                x2={targetX}
                y2={targetY}
                stroke="#4F46E5"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
            />
          );
      })}
      {nodes.map((node, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const textOffset = calculateTextOffset(angle);
          const textAnchor = calculateTextAnchor(angle);

          // Word wrapping logic
          const words = node.id.split(' ');
          const lines: string[] = [];
          if (words.length > 0) {
            let currentLine = words[0];
            const maxLineLength = 20; // Max characters per line
    
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                if ((currentLine + ' ' + word).length > maxLineLength) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine += ' ' + word;
                }
            }
            lines.push(currentLine);
          }

          const lineSpacing = fontSize + 2;
          const verticalAdjust = -((lines.length - 1) * lineSpacing) / 2;

          return (
            <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={nodeRadius} fill="#38BDF8" />
                <text
                    x={node.x + textOffset.x}
                    y={node.y + textOffset.y + verticalAdjust}
                    textAnchor={textAnchor}
                    fill="#F9FAFB"
                    fontSize={fontSize}
                    style={{ pointerEvents: 'none' }}
                >
                    {lines.map((line, index) => (
                        <tspan
                            key={index}
                            x={node.x + textOffset.x}
                            dy={index === 0 ? 0 : lineSpacing}
                        >
                            {line}
                        </tspan>
                    ))}
                </text>
            </g>
          );
      })}
    </svg>
  );
};
