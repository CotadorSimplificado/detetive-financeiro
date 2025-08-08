import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UsePageTransitionReturn {
  isTransitioning: boolean;
  navigateWithTransition: (to: string) => void;
}

export function usePageTransition(): UsePageTransitionReturn {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const navigateWithTransition = (to: string) => {
    setIsTransitioning(true);
    
    // Pequeno delay para mostrar o loading
    setTimeout(() => {
      navigate(to);
      // Reset após a navegação
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 150);
  };

  return {
    isTransitioning,
    navigateWithTransition,
  };
}