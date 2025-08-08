import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@/types/auth";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: () => apiRequest("/api/auth/user"),
    retry: false,
    staleTime: 60 * 1000, // 1 minuto
    refetchInterval: false, // Não recarregar automaticamente
    refetchOnWindowFocus: false, // Não recarregar ao focar a janela
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}

// Para compatibilidade com componentes que ainda esperam AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
