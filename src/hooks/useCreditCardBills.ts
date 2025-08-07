// Compatibilidade: Re-exporta o hook mock de faturas
import { useMockBills } from '@/data/hooks/useMockBills';

export const useCreditCardBills = useMockBills;

// Hook individual para pagamento de fatura
export const usePayCreditCardBill = () => {
  const { markBillAsPaid } = useMockBills();
  return markBillAsPaid;
};

export type { CreditCardBill } from '@/data/types';
