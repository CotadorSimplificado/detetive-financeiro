import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from "@/lib/utils";

interface DonutChartData {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

interface DonutChartProps {
  data: DonutChartData[];
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  centerContent?: React.ReactNode;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground">{data.name}</p>
        <p className="text-sm text-primary font-bold">
          {formatCurrency(data.value)}
        </p>
        {data.payload.percentage && (
          <p className="text-xs text-muted-foreground">
            {data.payload.percentage.toFixed(1)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const DonutChart = ({
  data,
  className,
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
  showTooltip = true,
  centerContent
}: DonutChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentages if not provided
  const dataWithPercentages = data.map(item => ({
    ...item,
    percentage: item.percentage ?? (item.value / total) * 100
  }));

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dataWithPercentages}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithPercentages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend content={<CustomLegend />} />}
          </PieChart>
        </ResponsiveContainer>
        
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              {centerContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};