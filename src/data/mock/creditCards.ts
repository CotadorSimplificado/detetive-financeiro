import { CreditCard, CardBrand, CardType } from '../types';

// Dados mock para cartões de crédito
export const mockCreditCards: CreditCard[] = [
  {
    id: '1',
    user_id: '1',
    name: 'Nubank',
    brand: 'MASTERCARD',
    type: 'CREDIT',
    last_digits: '1234',
    credit_limit: 5000.00,
    available_limit: 3500.00,
    closing_day: 15,
    due_day: 25,
    color: '#8B5CF6',
    is_active: true,
    is_default: true,
    is_virtual: false,
    last_sync_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: '1',
    name: 'Itaú',
    brand: 'VISA',
    type: 'CREDIT',
    last_digits: '5678',
    credit_limit: 8000.00,
    available_limit: 6000.00,
    closing_day: 20,
    due_day: 30,
    color: '#EF4444',
    is_active: true,
    is_default: false,
    is_virtual: false,
    last_sync_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: '1',
    name: 'Nubank Virtual',
    brand: 'MASTERCARD',
    type: 'VIRTUAL',
    last_digits: '9999',
    credit_limit: 2000.00,
    available_limit: 1800.00,
    closing_day: 15,
    due_day: 25,
    color: '#8B5CF6',
    is_active: true,
    is_default: false,
    is_virtual: true,
    parent_card_id: '1',
    last_sync_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    user_id: '1',
    name: 'Santander',
    brand: 'ELO',
    type: 'CREDIT_DEBIT',
    last_digits: '4321',
    credit_limit: 3000.00,
    available_limit: 2500.00,
    closing_day: 10,
    due_day: 20,
    color: '#F59E0B',
    is_active: true,
    is_default: false,
    is_virtual: false,
    last_sync_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    user_id: '1',
    name: 'Cartão Inativo',
    brand: 'VISA',
    type: 'CREDIT',
    last_digits: '1111',
    credit_limit: 1000.00,
    available_limit: 1000.00,
    closing_day: 5,
    due_day: 15,
    color: '#6B7280',
    is_active: false,
    is_default: false,
    is_virtual: false,
    last_sync_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Função para gerar ID único
export const generateCreditCardId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Função para buscar cartões por usuário
export const findCreditCardsByUserId = (userId: string): CreditCard[] => {
  return mockCreditCards.filter(card => 
    card.user_id === userId && 
    card.is_active && 
    !card.deleted_at
  );
};

// Função para buscar cartão por ID
export const findCreditCardById = (id: string): CreditCard | undefined => {
  return mockCreditCards.find(card => 
    card.id === id && 
    card.is_active && 
    !card.deleted_at
  );
};

// Função para buscar cartão padrão do usuário
export const findDefaultCreditCardByUserId = (userId: string): CreditCard | undefined => {
  return mockCreditCards.find(card => 
    card.user_id === userId && 
    card.is_default && 
    card.is_active && 
    !card.deleted_at
  );
};

// Função para buscar cartões virtuais
export const findVirtualCreditCards = (userId: string): CreditCard[] => {
  return mockCreditCards.filter(card => 
    card.user_id === userId && 
    card.is_virtual && 
    card.is_active && 
    !card.deleted_at
  );
};

// Função para buscar cartões por marca
export const findCreditCardsByBrand = (userId: string, brand: CardBrand): CreditCard[] => {
  return mockCreditCards.filter(card => 
    card.user_id === userId && 
    card.brand === brand && 
    card.is_active && 
    !card.deleted_at
  );
};

// Função para buscar cartões por tipo
export const findCreditCardsByType = (userId: string, type: CardType): CreditCard[] => {
  return mockCreditCards.filter(card => 
    card.user_id === userId && 
    card.type === type && 
    card.is_active && 
    !card.deleted_at
  );
};

// Função para criar novo cartão
export const createMockCreditCard = (cardData: Omit<CreditCard, 'id' | 'created_at' | 'updated_at'>): CreditCard => {
  const now = new Date().toISOString();
  const newCard: CreditCard = {
    ...cardData,
    id: generateCreditCardId(),
    created_at: now,
    updated_at: now
  };
  
  mockCreditCards.push(newCard);
  return newCard;
};

// Função para atualizar cartão
export const updateMockCreditCard = (id: string, updates: Partial<Omit<CreditCard, 'id' | 'created_at' | 'user_id'>>): CreditCard | null => {
  const index = mockCreditCards.findIndex(card => card.id === id);
  if (index === -1) return null;
  
  mockCreditCards[index] = {
    ...mockCreditCards[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return mockCreditCards[index];
};

// Função para deletar cartão (soft delete)
export const deleteMockCreditCard = (id: string): boolean => {
  const index = mockCreditCards.findIndex(card => card.id === id);
  if (index === -1) return false;
  
  mockCreditCards[index].deleted_at = new Date().toISOString();
  mockCreditCards[index].updated_at = new Date().toISOString();
  
  return true;
};

// Função para definir cartão como padrão
export const setDefaultCreditCard = (userId: string, cardId: string): boolean => {
  // Remove padrão de todos os cartões do usuário
  mockCreditCards.forEach(card => {
    if (card.user_id === userId && card.is_active && !card.deleted_at) {
      card.is_default = false;
      card.updated_at = new Date().toISOString();
    }
  });
  
  // Define o novo cartão como padrão
  const index = mockCreditCards.findIndex(card => card.id === cardId);
  if (index === -1) return false;
  
  mockCreditCards[index].is_default = true;
  mockCreditCards[index].updated_at = new Date().toISOString();
  
  return true;
};

// Função para calcular limite total disponível
export const calculateTotalAvailableLimit = (userId: string): number => {
  return mockCreditCards
    .filter(card => 
      card.user_id === userId && 
      card.is_active && 
      !card.deleted_at
    )
    .reduce((total, card) => total + (card.available_limit || 0), 0);
};

// Função para calcular limite total
export const calculateTotalCreditLimit = (userId: string): number => {
  return mockCreditCards
    .filter(card => 
      card.user_id === userId && 
      card.is_active && 
      !card.deleted_at
    )
    .reduce((total, card) => total + (card.credit_limit || 0), 0);
};
