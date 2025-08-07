import { Category, TransactionType } from '../types';

// Dados mock para categorias
export const mockCategories: Category[] = [
  // Categorias de Receita
  {
    id: '1',
    user_id: null, // Categoria do sistema
    name: 'Salário',
    slug: 'salario',
    type: 'INCOME',
    color: '#10B981',
    icon: '💰',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: null,
    name: 'Freelance',
    slug: 'freelance',
    type: 'INCOME',
    color: '#059669',
    icon: '💼',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    user_id: null,
    name: 'Investimentos',
    slug: 'investimentos',
    type: 'INCOME',
    color: '#8B5CF6',
    icon: '📈',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    user_id: null,
    name: 'Outros',
    slug: 'outros-receitas',
    type: 'INCOME',
    color: '#6B7280',
    icon: '📋',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Categorias de Despesa - Alimentação
  {
    id: '5',
    user_id: null,
    name: 'Alimentação',
    slug: 'alimentacao',
    type: 'EXPENSE',
    color: '#F59E0B',
    icon: '🍽️',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    user_id: '1',
    name: 'Supermercado',
    slug: 'supermercado',
    type: 'EXPENSE',
    color: '#D97706',
    icon: '🛒',
    is_active: true,
    is_system: false,
    parent_id: '5',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    user_id: '1',
    name: 'Restaurante',
    slug: 'restaurante',
    type: 'EXPENSE',
    color: '#B45309',
    icon: '🍕',
    is_active: true,
    is_system: false,
    parent_id: '5',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Categorias de Despesa - Transporte
  {
    id: '8',
    user_id: null,
    name: 'Transporte',
    slug: 'transporte',
    type: 'EXPENSE',
    color: '#3B82F6',
    icon: '🚗',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '9',
    user_id: '1',
    name: 'Combustível',
    slug: 'combustivel',
    type: 'EXPENSE',
    color: '#1D4ED8',
    icon: '⛽',
    is_active: true,
    is_system: false,
    parent_id: '8',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    user_id: '1',
    name: 'Uber/Táxi',
    slug: 'uber-taxi',
    type: 'EXPENSE',
    color: '#1E40AF',
    icon: '🚕',
    is_active: true,
    is_system: false,
    parent_id: '8',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Categorias de Despesa - Moradia
  {
    id: '11',
    user_id: null,
    name: 'Moradia',
    slug: 'moradia',
    type: 'EXPENSE',
    color: '#EF4444',
    icon: '🏠',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '12',
    user_id: '1',
    name: 'Aluguel',
    slug: 'aluguel',
    type: 'EXPENSE',
    color: '#DC2626',
    icon: '🏢',
    is_active: true,
    is_system: false,
    parent_id: '11',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '13',
    user_id: '1',
    name: 'Contas',
    slug: 'contas',
    type: 'EXPENSE',
    color: '#B91C1C',
    icon: '⚡',
    is_active: true,
    is_system: false,
    parent_id: '11',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Categorias de Despesa - Lazer
  {
    id: '14',
    user_id: null,
    name: 'Lazer',
    slug: 'lazer',
    type: 'EXPENSE',
    color: '#EC4899',
    icon: '🎮',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '15',
    user_id: '1',
    name: 'Cinema',
    slug: 'cinema',
    type: 'EXPENSE',
    color: '#DB2777',
    icon: '🎬',
    is_active: true,
    is_system: false,
    parent_id: '14',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '16',
    user_id: '1',
    name: 'Viagem',
    slug: 'viagem',
    type: 'EXPENSE',
    color: '#BE185D',
    icon: '✈️',
    is_active: true,
    is_system: false,
    parent_id: '14',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Categorias de Despesa - Saúde
  {
    id: '17',
    user_id: null,
    name: 'Saúde',
    slug: 'saude',
    type: 'EXPENSE',
    color: '#06B6D4',
    icon: '🏥',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '18',
    user_id: '1',
    name: 'Farmácia',
    slug: 'farmacia',
    type: 'EXPENSE',
    color: '#0891B2',
    icon: '💊',
    is_active: true,
    is_system: false,
    parent_id: '17',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },

  // Categoria de Transferência
  {
    id: '19',
    user_id: null,
    name: 'Transferência',
    slug: 'transferencia',
    type: 'TRANSFER',
    color: '#6B7280',
    icon: '🔄',
    is_active: true,
    is_system: true,
    parent_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Função para gerar ID único
export const generateCategoryId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Função para buscar categorias por usuário
export const findCategoriesByUserId = (userId: string): Category[] => {
  return mockCategories.filter(category => 
    (category.user_id === userId || category.is_system) && 
    category.is_active
  );
};

// Função para buscar categoria por ID
export const findCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(category => category.id === id && category.is_active);
};

// Função para buscar categorias por tipo
export const findCategoriesByType = (type: TransactionType, userId: string): Category[] => {
  return mockCategories.filter(category => 
    category.type === type && 
    (category.user_id === userId || category.is_system) && 
    category.is_active
  );
};

// Função para buscar categorias filhas
export const findChildCategories = (parentId: string): Category[] => {
  return mockCategories.filter(category => 
    category.parent_id === parentId && 
    category.is_active
  );
};

// Função para buscar categorias raiz (sem parent)
export const findRootCategories = (userId: string): Category[] => {
  return mockCategories.filter(category => 
    !category.parent_id && 
    (category.user_id === userId || category.is_system) && 
    category.is_active
  );
};

// Função para criar nova categoria
export const createMockCategory = (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category => {
  const now = new Date().toISOString();
  const newCategory: Category = {
    ...categoryData,
    id: generateCategoryId(),
    created_at: now,
    updated_at: now
  };
  
  mockCategories.push(newCategory);
  return newCategory;
};

// Função para atualizar categoria
export const updateMockCategory = (id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'user_id'>>): Category | null => {
  const index = mockCategories.findIndex(category => category.id === id);
  if (index === -1) return null;
  
  mockCategories[index] = {
    ...mockCategories[index],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return mockCategories[index];
};

// Função para deletar categoria (soft delete)
export const deleteMockCategory = (id: string): boolean => {
  const index = mockCategories.findIndex(category => category.id === id);
  if (index === -1) return false;
  
  // Não permitir deletar categorias do sistema
  if (mockCategories[index].is_system) return false;
  
  mockCategories[index].is_active = false;
  mockCategories[index].updated_at = new Date().toISOString();
  
  return true;
};
