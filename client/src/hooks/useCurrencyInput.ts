import { useState, useCallback, useRef, useEffect } from 'react';
import { applyCurrencyMask, parseCurrency, formatCurrencyInput } from '@/lib/currency-utils';

interface UseCurrencyInputOptions {
  initialValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
}

interface UseCurrencyInputReturn {
  displayValue: string;
  numericValue: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleFocus: () => void;
  setValue: (value: number) => void;
  setDisplayValue: (value: string) => void;
  isValid: boolean;
}

export function useCurrencyInput({
  initialValue = 0,
  maxValue = 999999999.99,
  onChange,
}: UseCurrencyInputOptions = {}): UseCurrencyInputReturn {
  const [displayValue, setDisplayValue] = useState(() => 
    formatCurrencyInput(initialValue)
  );
  const [numericValue, setNumericValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastCursorPosition = useRef<number>(0);

  // Atualiza o valor numérico quando o valor de exibição muda
  useEffect(() => {
    const parsed = parseCurrency(displayValue);
    const limited = Math.min(Math.max(0, parsed), maxValue);
    
    if (limited !== numericValue) {
      setNumericValue(limited);
      onChange?.(limited);
    }
  }, [displayValue, maxValue, onChange, numericValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    const cursorPosition = input.selectionStart || 0;
    
    // Salva a posição do cursor
    lastCursorPosition.current = cursorPosition;
    
    // Aplica a máscara
    const masked = applyCurrencyMask(newValue, displayValue);
    setDisplayValue(masked);
    
    // Restaura a posição do cursor após a máscara
    requestAnimationFrame(() => {
      if (input && document.activeElement === input) {
        const lengthDiff = masked.length - newValue.length;
        const newPosition = Math.max(0, cursorPosition + lengthDiff);
        input.setSelectionRange(newPosition, newPosition);
      }
    });
  }, [displayValue]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Reformata o valor ao perder o foco
    if (numericValue > 0) {
      setDisplayValue(formatCurrencyInput(numericValue));
    }
  }, [numericValue]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const setValue = useCallback((value: number) => {
    const limited = Math.min(Math.max(0, value), maxValue);
    setNumericValue(limited);
    setDisplayValue(formatCurrencyInput(limited));
    onChange?.(limited);
  }, [maxValue, onChange]);

  const setDisplayValueDirect = useCallback((value: string) => {
    setDisplayValue(value);
  }, []);

  const isValid = numericValue >= 0 && numericValue <= maxValue && !isNaN(numericValue);

  return {
    displayValue,
    numericValue,
    handleChange,
    handleBlur,
    handleFocus,
    setValue,
    setDisplayValue: setDisplayValueDirect,
    isValid,
  };
}