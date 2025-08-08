import { useCallback, useEffect } from "react";

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
  // This hook can be extended with more functionality as needed
  // For now, it's a placeholder for future enhancements
  return {};
}