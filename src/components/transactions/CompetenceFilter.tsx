import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompetenceFilterProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  isLoading?: boolean;
}

export function CompetenceFilter({ currentDate, onDateChange, isLoading }: CompetenceFilterProps) {
  const handlePreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  const currentMonth = format(currentDate, "MMMM", { locale: ptBR });
  const currentYear = format(currentDate, "yyyy", { locale: ptBR });

  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm max-w-sm mx-auto">
      <Button 
        variant="outline" 
        size="icon"
        onClick={handlePreviousMonth}
        disabled={isLoading}
        className="h-10 w-10 rounded-full hover:bg-primary/10 hover:border-primary/20 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="text-center flex-1 px-4">
        <h3 className="font-semibold text-lg capitalize text-foreground">
          {currentMonth} {currentYear}
        </h3>
        <p className="text-sm text-muted-foreground">
          Competência
        </p>
      </div>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleNextMonth}
        disabled={isLoading}
        className="h-10 w-10 rounded-full hover:bg-primary/10 hover:border-primary/20 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}