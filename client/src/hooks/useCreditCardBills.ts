// Compatibilidade: Re-exporta o hook mock de faturas
import { useMockBills } from '@/data/hooks/useMockBills';

export const useCreditCardBills = () => {
  const mockResult = useMockBills();
  return {
    data: mockResult.creditCardBills || [],
    loading: mockResult.loading,
    error: mockResult.error,
    ...mockResult
  };
};

// Hook individual para pagamento de fatura
export const usePayCreditCardBill = () => {
  const { markBillAsPaid } = useMockBills();
  return markBillAsPaid;
};

export type { CreditCardBill } from '@/data/types';
