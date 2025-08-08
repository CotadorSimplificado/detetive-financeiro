/**
 * Utilitários para formatação e manipulação de valores monetários
 */

export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formata um número como moeda brasileira
 */
export function formatCurrency(
  value: number,
  options: CurrencyFormatOptions = {}
): string {
  const {
    locale = 'pt-BR',
    currency = 'BRL',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Remove formatação de moeda e retorna o número
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove tudo exceto dígitos, vírgula e ponto
  const cleaned = value.replace(/[^\d,.-]/g, '');
  
  // Se tem vírgula e ponto, assume que vírgula é separador de milhar
  if (cleaned.includes(',') && cleaned.includes('.')) {
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    
    if (lastDot > lastComma) {
      // Formato: 1.234,56 ou 1,234.56
      return parseFloat(cleaned.replace(/,/g, ''));
    } else {
      // Formato: 1.234,56
      return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
    }
  }
  
  // Se tem apenas vírgula, assume como separador decimal
  if (cleaned.includes(',') && !cleaned.includes('.')) {
    return parseFloat(cleaned.replace(',', '.'));
  }
  
  // Se tem apenas ponto, pode ser milhar ou decimal
  if (cleaned.includes('.') && !cleaned.includes(',')) {
    const parts = cleaned.split('.');
    if (parts.length === 2 && parts[1].length <= 2) {
      // Provavelmente decimal: 123.45
      return parseFloat(cleaned);
    } else {
      // Provavelmente milhar: 1.234
      return parseFloat(cleaned.replace(/\./g, ''));
    }
  }
  
  return parseFloat(cleaned) || 0;
}

/**
 * Formata valor para exibição no input (sem símbolo da moeda)
 */
export function formatCurrencyInput(value: number): string {
  if (isNaN(value) || value === 0) return '';
  
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Máscara de entrada de moeda em tempo real
 */
export function applyCurrencyMask(value: string, previousValue: string = ''): string {
  if (!value) return '';
  
  // Remove tudo exceto dígitos
  const numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Se o número é muito pequeno, trata como centavos
  if (numbers.length <= 2) {
    const amount = parseInt(numbers) / 100;
    return formatCurrencyInput(amount);
  }
  
  // Para números maiores, trata os últimos 2 dígitos como centavos
  const reais = numbers.slice(0, -2);
  const centavos = numbers.slice(-2);
  const amount = parseInt(reais || '0') + parseInt(centavos) / 100;
  
  return formatCurrencyInput(amount);
}

/**
 * Valida se um valor monetário é válido
 */
export function isValidCurrencyValue(value: string | number): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value) && value >= 0;
  }
  
  const parsed = parseCurrency(value);
  return !isNaN(parsed) && isFinite(parsed) && parsed >= 0;
}

/**
 * Limita o valor monetário a um máximo
 */
export function limitCurrencyValue(value: number, max: number = 999999999.99): number {
  return Math.min(Math.max(0, value), max);
}