import { MockUser } from '../types';

// Dados mock para usuários
export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'usuario@exemplo.com',
    full_name: 'Usuário Exemplo',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    email: 'maria@exemplo.com',
    full_name: 'Maria Silva',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    email: 'joao@exemplo.com',
    full_name: 'João Santos',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

// Usuário padrão para desenvolvimento
export const defaultUser: MockUser = mockUsers[0];

// Função para gerar ID único
export const generateUserId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Função para buscar usuário por ID
export const findUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Função para buscar usuário por email
export const findUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(user => user.email === email);
};

// Função para criar novo usuário
export const createMockUser = (email: string, fullName: string, avatarUrl?: string): MockUser => {
  const newUser: MockUser = {
    id: generateUserId(),
    email,
    full_name: fullName,
    avatar_url: avatarUrl
  };
  
  mockUsers.push(newUser);
  return newUser;
};
