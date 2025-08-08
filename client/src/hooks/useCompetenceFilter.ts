import { useCallback, useEffect, useState } from "react";

/**
 * Hook to handle keyboard navigation for competence filter
 */
export function useCompetenceNavigation(onPrevious: () => void, onNext: () => void) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only trigger if not typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (event.key === "ArrowLeft" && event.metaKey) {
      event.preventDefault();
      onPrevious();
    } else if (event.key === "ArrowRight" && event.metaKey) {
      event.preventDefault();
      onNext();
    }
  }, [onPrevious, onNext]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Hook to provide competence filter state and actions
 */
export function useCompetenceFilter() {
  const [competenceDate, setCompetenceDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Keyboard navigation for competence filter
  useCompetenceNavigation(
    () => setCompetenceDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)),
    () => setCompetenceDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  );

  const currentCompetence = {
    month: competenceDate.getMonth() + 1, // JavaScript months are 0-indexed
    year: competenceDate.getFullYear(),
    date: competenceDate
  };

  return {
    currentCompetence,
    setCompetenceDate
  };
}