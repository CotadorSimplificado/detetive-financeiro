import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cn } from "@/lib/utils";

interface LineChartData {
  name: string;
  value: number;
  date?: string;
  [key: string]: any;
}

interface CustomLineChartProps {
  data: LineChartData[];
  className?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  color?: string;
  strokeWidth?: number;
  height?: number;
  filled?: boolean;
  animate?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-sm text-primary font-bold">
          {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

export const CustomLineChart = ({
  data,
  className,
  showGrid = true,
  showTooltip = true,
  color = "hsl(var(--primary))",
  strokeWidth = 2,
  height = 300,
  filled = false,
  animate = true
}: CustomLineChartProps) => {
  const ChartComponent = filled ? AreaChart : LineChart;

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.3}
            />
          )}
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={formatCurrency}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          
          {filled ? (
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={strokeWidth}
              fill={`${color}30`}
              animationDuration={animate ? 1000 : 0}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={strokeWidth}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              animationDuration={animate ? 1000 : 0}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};