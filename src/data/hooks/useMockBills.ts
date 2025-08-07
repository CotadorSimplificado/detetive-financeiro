import { useMockStore } from '../store/mockContext';
import { CreateCreditCardBill, UpdateCreditCardBill } from '../types';

/**
 * Hook customizado para gerenciamento de faturas de cartão de crédito mock
 * Fornece métodos CRUD e estado das faturas
 */
export const useMockBills = () => {
  const {
    creditCardBills,
    billsLoading,
    error,
    fetchCreditCardBills,
    createCreditCardBill,
    updateCreditCardBill,
    deleteCreditCardBill,
    getBillById,
    getBillsByCard,
    getOpenBills,
    getPaidBills,
    markBillAsPaid,
    getTotalOpenBills,
    getTotalPaidBills,
  } = useMockStore();

  return {
    // Estado
    bills: creditCardBills,
    loading: billsLoading,
    error,
    
    // Métodos CRUD
    fetchBills: fetchCreditCardBills,
    createBill: createCreditCardBill,
    updateBill: updateCreditCardBill,
    deleteBill: deleteCreditCardBill,
    
    // Métodos de busca
    getBillById,
    getBillsByCard,
    getOpenBills,
    getPaidBills,
    markBillAsPaid,
    getTotalOpenBills,
    getTotalPaidBills,
    
    // Utilitários
    hasBills: creditCardBills.length > 0,
    billCount: creditCardBills.length,
    openBills: getOpenBills(),
    paidBills: getPaidBills(),
    openBillCount: getOpenBills().length,
    paidBillCount: getPaidBills().length,
    totalOpenAmount: getTotalOpenBills(),
    totalPaidAmount: getTotalPaidBills(),
    overdueBills: creditCardBills.filter(bill => 
      !bill.is_paid && new Date(bill.due_date) < new Date()
    ),
    overdueBillCount: creditCardBills.filter(bill => 
      !bill.is_paid && new Date(bill.due_date) < new Date()
    ).length,
  };
};
