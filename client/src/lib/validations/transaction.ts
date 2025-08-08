import { z } from "zod";

export const baseTransactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  date: z.date(),
  notes: z.string().optional(),
  category_id: z.string().uuid("Categoria é obrigatória"),
});

export const incomeSchema = baseTransactionSchema.extend({
  account_id: z.string().uuid("Conta é obrigatória"),
});

export const expenseSchema = baseTransactionSchema.extend({
  account_id: z.string().uuid().optional(),
  card_id: z.string().uuid().optional(),
}).refine(
  (data) => data.account_id || data.card_id,
  {
    message: "Conta ou cartão é obrigatório",
    path: ["account_id"],
  }
);

export const transferSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  date: z.date(),
  notes: z.string().optional(),
  transfer_from_id: z.string().min(1, "Conta de origem é obrigatória"),
  transfer_to_id: z.string().min(1, "Conta de destino é obrigatória"),
}).refine(
  (data) => data.transfer_from_id !== data.transfer_to_id,
  {
    message: "Conta de origem deve ser diferente da conta de destino",
    path: ["transfer_to_id"],
  }
);

export type IncomeFormData = z.infer<typeof incomeSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;