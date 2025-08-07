import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompetenceFilterProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function CompetenceFilter({ currentDate, onDateChange }: CompetenceFilterProps) {
  const handlePreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousMonth}
        className="h-9 w-9 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="min-w-[140px] text-center">
        <span className="text-sm font-medium capitalize">
          {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextMonth}
        className="h-9 w-9 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}