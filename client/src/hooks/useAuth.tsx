import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@/types/auth";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: () => apiRequest("/api/auth/user"),
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

// Para compatibilidade com componentes que ainda esperam AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
