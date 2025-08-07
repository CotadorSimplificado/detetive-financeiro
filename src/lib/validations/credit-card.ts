import { z } from "zod";

export const creditCardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  type: z.enum(['CREDIT', 'DEBIT', 'CREDIT_DEBIT', 'PREPAID', 'VIRTUAL']),
  brand: z.enum(['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OTHER']),
  last_digits: z.string().length(4, "Últimos 4 dígitos devem ter 4 caracteres").optional().or(z.literal("")),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor deve ser um hexadecimal válido"),
  credit_limit: z.number().min(0, "Limite deve ser positivo").optional().nullable(),
  available_limit: z.number().min(0, "Limite disponível deve ser positivo").optional().nullable(),
  closing_day: z.number().min(1, "Dia deve ser entre 1 e 31").max(31, "Dia deve ser entre 1 e 31").optional().nullable(),
  due_day: z.number().min(1, "Dia deve ser entre 1 e 31").max(31, "Dia deve ser entre 1 e 31").optional().nullable(),
  is_default: z.boolean().default(false),
  is_virtual: z.boolean().default(false),
  parent_card_id: z.string().uuid().optional().nullable(),
}).refine((data) => {
  // Se for cartão virtual, deve ter um cartão pai
  if (data.is_virtual && !data.parent_card_id) {
    return false;
  }
  return true;
}, {
  message: "Cartão virtual deve ter um cartão pai definido",
  path: ["parent_card_id"]
}).refine((data) => {
  // Se não for cartão de crédito, não deve ter limite
  if (data.type !== 'CREDIT' && data.type !== 'CREDIT_DEBIT' && (data.credit_limit || data.available_limit)) {
    return false;
  }
  return true;
}, {
  message: "Apenas cartões de crédito podem ter limite definido",
  path: ["credit_limit"]
}).refine((data) => {
  // Se não for cartão de crédito, não deve ter dias de fechamento/vencimento
  if (data.type !== 'CREDIT' && data.type !== 'CREDIT_DEBIT' && (data.closing_day || data.due_day)) {
    return false;
  }
  return true;
}, {
  message: "Apenas cartões de crédito podem ter dias de fechamento e vencimento",
  path: ["closing_day"]
});

export type CreditCardFormData = z.infer<typeof creditCardSchema>;