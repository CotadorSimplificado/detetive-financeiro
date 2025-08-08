import { useQuery } from "@tanstack/react-query";
import { featureFlags } from "@/lib/featureFlags";
import { useMockAuth } from '@/data/hooks/useMockAuth';

export function useAuth() {
  const useRealAuth = featureFlags.isEnabled('useRealAuth');

  const { data: realUser, isLoading: realLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: useRealAuth,
  });

  const mockAuth = useMockAuth();

  if (useRealAuth) {
    return {
      user: realUser,
      isLoading: realLoading,
      isAuthenticated: !!realUser,
    };
  }

  // Sistema mock para desenvolvimento
  return mockAuth;
}

// Para compatibilidade com componentes que ainda esperam AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
