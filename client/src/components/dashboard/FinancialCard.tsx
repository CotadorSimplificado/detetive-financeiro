import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FinancialCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  variant?: "default" | "income" | "expense" | "balance" | "goal";
}

export const FinancialCard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className,
  children,
  variant = "default"
}: FinancialCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "income":
        return "border-l-4 border-l-income bg-gradient-to-br from-income/10 to-transparent";
      case "expense":
        return "border-l-4 border-l-expense bg-gradient-to-br from-expense/10 to-transparent";
      case "balance":
        return "border-l-4 border-l-primary bg-gradient-primary/10";
      case "goal":
        return "border-l-4 border-l-warning bg-gradient-to-br from-warning/10 to-transparent";
      default:
        return "bg-gradient-card";
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";
    switch (trend) {
      case "up":
        return "text-income";
      case "down":
        return "text-expense";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 border-border/50",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {value && (
          <div className="text-2xl font-bold text-foreground mb-1">
            {value}
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mb-2">
            {subtitle}
          </p>
        )}
        {trend && trendValue && (
          <div className={cn("text-xs flex items-center gap-1", getTrendColor())}>
            <span>
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
            </span>
            {trendValue}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
};