import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ChartContainer from './ChartContainer';

interface DataPoint {
  [key: string]: any;
}

interface BarChartProps {
  data: DataPoint[];
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
  isLoading?: boolean;
  height?: string | number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  color = '#3182ce',
  isLoading = false,
  height = '300px',
}) => {
  return (
    <ChartContainer title={title} isLoading={isLoading} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey={xKey}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar
            dataKey={yKey}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BarChart;
