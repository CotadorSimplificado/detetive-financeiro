// Compatibilidade: Re-exporta o hook mock de autenticação
import { useMockAuth } from '@/data/hooks/useMockAuth';

export const useAuth = useMockAuth;

// Para compatibilidade com componentes que ainda esperam AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
