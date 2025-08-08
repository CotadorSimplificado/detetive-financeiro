import { z } from "zod";

export const creditCardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  type: z.enum(['CREDIT', 'DEBIT', 'CREDIT_DEBIT', 'PREPAID', 'VIRTUAL']),
  brand: z.enum(['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OTHER']),
  last_digits: z.string().length(4, "Últimos 4 dígitos devem ter 4 caracteres").optional().or(z.literal("")),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor deve ser um hexadecimal válido"),
  credit_limit: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0, "Limite deve ser positivo")),
  available_limit: z.string().transform((val) => parseFloat(val)).pipe(z.number().min(0, "Limite disponível deve ser positivo")),
  closing_day: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1, "Dia deve ser entre 1 e 31").max(31, "Dia deve ser entre 1 e 31")),
  due_day: z.string().transform((val) => parseInt(val)).pipe(z.number().min(1, "Dia deve ser entre 1 e 31").max(31, "Dia deve ser entre 1 e 31")),
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
  // Se for cartão de crédito, deve ter limite e dias de fechamento/vencimento
  if ((data.type === 'CREDIT' || data.type === 'CREDIT_DEBIT')) {
    if (data.credit_limit === undefined || data.credit_limit === null) return false;
    if (data.available_limit === undefined || data.available_limit === null) return false;
    if (!data.closing_day) return false;
    if (!data.due_day) return false;
  }
  return true;
}, {
  message: "Para cartões de crédito, limite, dia de fechamento e vencimento são obrigatórios",
  path: ["credit_limit"]
});

export type CreditCardFormData = z.infer<typeof creditCardSchema>;