import { useMockStore } from '../store/mockContext';

/**
 * Hook customizado para autenticação mock
 * Fornece métodos de autenticação e estado do usuário
 */
export const useMockAuth = () => {
  const {
    user,
    session,
    isAuthenticated,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshSession,
    isSessionExpiringSoon,
  } = useMockStore();

  return {
    // Estado
    user,
    session,
    isAuthenticated,
    loading,
    error,
    
    // Métodos
    signIn,
    signUp,
    signOut,
    refreshSession,
    isSessionExpiringSoon,
    
    // Utilitários
    isLoggedIn: isAuthenticated,
    hasError: !!error,
  };
};
