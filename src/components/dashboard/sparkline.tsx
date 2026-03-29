"use client";

import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  isPositive: boolean;
}

export function Sparkline({ data, isPositive }: SparklineProps) {
  // Format data strictly into Recharts coordinate structure: { value: 150 }
  const chartData = data.map((val) => ({ value: val }));

  // Tailwind equivalent raw Hex values
  const strokeColor = isPositive ? "#10b981" : "#f43f5e"; // emerald-500 vs rose-500

  if (!data || data.length === 0) return null;

  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={strokeColor} 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
