import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  type: z.enum(['CHECKING', 'SAVINGS', 'INVESTMENT', 'CASH'], {
    message: "Tipo de conta é obrigatório"
  }),
  bank_name: z.string().max(100, "Nome do banco muito longo").optional(),
  bank_code: z.string()
    .regex(/^\d{3,4}$/, "Código do banco deve ter 3 ou 4 dígitos")
    .optional()
    .or(z.literal("")),
  agency_number: z.string()
    .regex(/^\d{4,5}(-?\d)?$/, "Número da agência deve ter formato válido (ex: 1234-5)")
    .optional()
    .or(z.literal("")),
  account_number: z.string()
    .regex(/^[\d-]+$/, "Número da conta deve conter apenas dígitos e hífens")
    .max(20, "Número da conta muito longo")
    .optional()
    .or(z.literal("")),
  initial_balance: z.number().default(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida").default("#2196F3"),
  icon: z.string().optional(),
  is_default: z.boolean().default(false),
  include_in_total: z.boolean().default(true),
  is_active: z.boolean().default(true),
});

export const accountUpdateSchema = accountSchema.partial().extend({
  id: z.string().uuid(),
});

export type AccountFormData = z.infer<typeof accountSchema>;
export type AccountUpdateData = z.infer<typeof accountUpdateSchema>;

// Account type options for forms
export const accountTypeOptions = [
  { value: 'CHECKING', label: 'Conta Corrente', icon: 'CreditCard' },
  { value: 'SAVINGS', label: 'Poupança', icon: 'PiggyBank' },
  { value: 'INVESTMENT', label: 'Investimento', icon: 'TrendingUp' },
  { value: 'CASH', label: 'Dinheiro', icon: 'Banknote' },
] as const;

// Predefined color options
export const accountColorOptions = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#E91E63', // Pink
  '#FFEB3B', // Yellow
] as const;