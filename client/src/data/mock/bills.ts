import { CreditCardBill } from '../types';

// Dados mock para faturas de cartão de crédito
export const mockCreditCardBills: CreditCardBill[] = [
  // Faturas do Nubank
  {
    id: '1',
    card_id: '1',
    reference_month: '2024-01',
    closing_date: '2024-01-15',
    due_date: '2024-01-25',
    total_amount: 1250.00,
    is_paid: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    card_id: '1',
    reference_month: '2023-12',
    closing_date: '2023-12-15',
    due_date: '2023-12-25',
    total_amount: 980.50,
    is_paid: true,
    paid_at: '2023-12-20T00:00:00Z',
    payment_transaction_id: 'payment-1',
    created_at: '2023-12-15T00:00:00Z',
    updated_at: '2023-12-20T00:00:00Z'
  },
  {
    id: '3',
    card_id: '1',
    reference_month: '2023-11',
    closing_date: '2023-11-15',
    due_date: '2023-11-25',
    total_amount: 750.00,
    is_paid: true,
    paid_at: '2023-11-22T00:00:00Z',
    payment_transaction_id: 'payment-2',
    created_at: '2023-11-15T00:00:00Z',
    updated_at: '2023-11-22T00:00:00Z'
  },

  // Faturas do Itaú
  {
    id: '4',
    card_id: '2',
    reference_month: '2024-01',
    closing_date: '2024-01-20',
    due_date: '2024-01-30',
    total_amount: 2100.00,
    is_paid: false,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '5',
    card_id: '2',
    reference_month: '2023-12',
    closing_date: '2023-12-20',
    due_date: '2023-12-30',
    total_amount: 1850.00,
    is_paid: true,
    paid_at: '2023-12-28T00:00:00Z',
    payment_transaction_id: 'payment-3',
    created_at: '2023-12-20T00:00:00Z',
    updated_at: '2023-12-28T00:00:00Z'
  },

  // Faturas do Nubank Virtual
  {
    id: '6',
    card_id: '3',
    reference_month: '2024-01',
    closing_date: '2024-01-15',
    due_date: '2024-01-25',
    total_amount: 450.00,
    is_paid: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '7',
    card_id: '3',
    reference_month: '2023-12',
    closing_date: '2023-12-15',
    due_date: '2023-12-25',
    total_amount: 320.00,
    is_paid: true,
    paid_at: '2023-12-23T00:00:00Z',
    payment_transaction_id: 'payment-4',
    created_at: '2023-12-15T00:00:00Z',
    updated_at: '2023-12-23T00:00:00Z'
  },

  // Faturas do Santander
  {
    id: '8',
    card_id: '4',
    reference_month: '2024-01',
    closing_date: '2024-01-10',
    due_date: '2024-01-20',
    total_amount: 850.00,
    is_paid: false,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '9',
    card_id: '4',
    reference_month: '2023-12',
    closing_date: '2023-12-10',
    due_date: '2023-12-20',
    total_amount: 720.00,
    is_paid: true,
    paid_at: '2023-12-18T00:00:00Z',
    payment_transaction_id: 'payment-5',
    created_at: '2023-12-10T00:00:00Z',
    updated_at: '2023-12-18T00:00:00Z'
  }
];

// Função para gerar ID único
export const generateBillId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Função para buscar faturas por cartão
export const findBillsByCardId = (cardId: string): CreditCardBill[] => {
  return mockCreditCardBills.filter(bill => bill.card_id === cardId);
};

// Função para buscar fatura por ID
export const findBillById = (id: string): CreditCardBill | undefined => {
  return mockCreditCardBills.find(bill => bill.id === id);
};

// Função para buscar faturas por usuário (através dos cartões)
export const findBillsByUserId = (userId: string, userCards: string[]): CreditCardBill[] => {
  return mockCreditCardBills.filter(bill => userCards.includes(bill.card_id));
};

// Função para buscar faturas em aberto
export const findOpenBills = (cardIds: string[]): CreditCardBill[] => {
  return mockCreditCardBills.filter(bill => 
    cardIds.includes(bill.card_id) && 
    !bill.is_paid
  );
};

// Função para buscar faturas pagas
export const findPaidBills = (cardIds: string[]): CreditCardBill[] => {
  return mockCreditCardBills.filter(bill => 
    cardIds.includes(bill.card_id) && 
    bill.is_paid
  );
};

// Função para buscar faturas por período
export const findBillsByPeriod = (cardIds: string[], startDate: string, endDate: string): CreditCardBill[] => {
  return mockCreditCardBills.filter(bill => 
    cardIds.includes(bill.card_id) &&
    bill.closing_date >= startDate &&
    bill.closing_date <= endDate
  );
};

// Função para buscar fatura atual (não paga mais recente)
export const findCurrentBill = (cardId: string): CreditCardBill | undefined => {
  return mockCreditCardBills
    .filter(bill => bill.card_id === cardId && !bill.is_paid)
    .sort((a, b) => new Date(b.closing_date).getTime() - new Date(a.closing_date).getTime())[0];
};

// Função para buscar próxima fatura a vencer
export const findNextDueBill = (cardIds: string[]): CreditCardBill | undefined => {
  const today = new Date().toISOString().split('T')[0];
  
  return mockCreditCardBills
    .filter(bill => 
      cardIds.includes(bill.card_id) && 
      !bill.is_paid && 
      bill.due_date >= today
    )
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];
};

// Função para buscar faturas vencidas
export const findOverdueBills = (cardIds: string[]): CreditCardBill[] => {
  const today = new Date().toISOString().split('T')[0];
  
  return mockCreditCardBills.filter(bill => 
    cardIds.includes(bill.card_id) && 
    !bill.is_paid && 
    bill.due_date < today
  );
};

// Função para criar nova fatura
export const createMockBill = (billData: Omit<CreditCardBill, 'id' | 'created_at' | 'updated_at'>): CreditCardBill => {
  const now = new Date().toISOString();
  const newBill: CreditCardBill = {
    ...billData,
    id: generateBillId(),
    created_at: now,
    updated_at: now
  };
  
  mockCreditCardBills.push(newBill);
  return newBill;
};

// Função para atualizar fatura
export const updateMockBill = (id: string, updates: Partial<Omit<CreditCardBill, 'id' | 'created_at'>>): CreditCardBill | null => {
  const index = mockCreditCardBills.findIndex(bill => bill.id === id);
  if (index === -1) return null;
  
  mockCreditCardBills[index] = {
    ...mockCreditCardBills[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return mockCreditCardBills[index];
};

// Função para marcar fatura como paga
export const markBillAsPaid = (id: string, paymentTransactionId?: string): boolean => {
  const index = mockCreditCardBills.findIndex(bill => bill.id === id);
  if (index === -1) return false;
  
  mockCreditCardBills[index].is_paid = true;
  mockCreditCardBills[index].paid_at = new Date().toISOString();
  if (paymentTransactionId) {
    mockCreditCardBills[index].payment_transaction_id = paymentTransactionId;
  }
  mockCreditCardBills[index].updated_at = new Date().toISOString();
  
  return true;
};

// Função para calcular total de faturas em aberto
export const calculateTotalOpenBills = (cardIds: string[]): number => {
  return mockCreditCardBills
    .filter(bill => cardIds.includes(bill.card_id) && !bill.is_paid)
    .reduce((total, bill) => total + bill.total_amount, 0);
};

// Função para calcular total de faturas pagas no período
export const calculateTotalPaidBills = (cardIds: string[], startDate: string, endDate: string): number => {
  return mockCreditCardBills
    .filter(bill => 
      cardIds.includes(bill.card_id) && 
      bill.is_paid &&
      bill.paid_at &&
      bill.paid_at >= startDate &&
      bill.paid_at <= endDate
    )
    .reduce((total, bill) => total + bill.total_amount, 0);
};

// Função para gerar faturas futuras (para simulação)
export const generateFutureBills = (cardId: string, months: number = 3): CreditCardBill[] => {
  const card = mockCreditCardBills.find(bill => bill.card_id === cardId);
  if (!card) return [];
  
  const futureBills: CreditCardBill[] = [];
  const lastBill = mockCreditCardBills
    .filter(bill => bill.card_id === cardId)
    .sort((a, b) => new Date(b.closing_date).getTime() - new Date(a.closing_date).getTime())[0];
  
  if (!lastBill) return [];
  
  let lastDate = new Date(lastBill.closing_date);
  
  for (let i = 1; i <= months; i++) {
    const closingDate = new Date(lastDate);
    closingDate.setMonth(closingDate.getMonth() + i);
    
    const dueDate = new Date(closingDate);
    dueDate.setDate(dueDate.getDate() + 10); // 10 dias após o fechamento
    
    const newBill: CreditCardBill = {
      id: generateBillId(),
      card_id: cardId,
      reference_month: closingDate.toISOString().slice(0, 7), // YYYY-MM
      closing_date: closingDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      total_amount: Math.random() * 1000 + 200, // Valor aleatório entre 200 e 1200
      is_paid: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    futureBills.push(newBill);
  }
  
  return futureBills;
};
