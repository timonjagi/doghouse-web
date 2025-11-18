import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import ChartContainer from './ChartContainer';

interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface PieChartProps {
  data: DataPoint[];
  title?: string;
  colors?: string[];
  isLoading?: boolean;
  height?: string | number;
  showLegend?: boolean;
}

const COLORS = [
  '#3182ce', // blue
  '#38a169', // green
  '#d69e2e', // yellow
  '#e53e3e', // red
  '#805ad5', // purple
  '#dd6b20', // orange
  '#319795', // teal
  '#d53f8c', // pink
];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  colors = COLORS,
  isLoading = false,
  height = '300px',
  showLegend = true,
}) => {
  return (
    <ChartContainer title={title} isLoading={isLoading} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
