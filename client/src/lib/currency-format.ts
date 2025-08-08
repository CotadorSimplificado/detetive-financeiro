/**
 * Utility functions for Brazilian currency formatting and conversion
 */

/**
 * Formats a number to Brazilian currency string (e.g., "1.234,56")
 */
export function formatCurrencyInput(value: number | string): string {
  if (!value && value !== 0) return '';
  
  let numValue: number;
  
  if (typeof value === 'string') {
    // Handle decimal strings from database (e.g., "5000.00")
    numValue = parseFloat(value);
  } else {
    numValue = value;
  }
  
  if (isNaN(numValue)) return '';
  
  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Parses Brazilian currency string to number for database (e.g., "1.234,56" -> "1234.56")
 */
export function parseCurrencyInput(value: string): string {
  if (!value) return '0';
  
  // Remove todos os caracteres exceto dígitos, vírgula e ponto
  let cleanValue = value.replace(/[^\d,.]/g, '');
  
  // Se contém vírgula, assumimos formato brasileiro (1.234,56)
  if (cleanValue.includes(',')) {
    // Remove pontos (separadores de milhares) e substitui vírgula por ponto
    cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
  }
  
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? '0' : numValue.toFixed(2);
}

/**
 * Formats currency value for display with currency symbol
 */
export function formatCurrencyDisplay(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return 'R$ 0,00';
  
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}