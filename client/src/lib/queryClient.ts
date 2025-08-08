import { QueryClient } from '@tanstack/react-query';

// Configuração do QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error: any) => {
        // Não repetir se for erro 4xx (cliente)
        if (error?.status >= 400 && error?.status < 500) return false;
        if (error?.message?.includes('401')) return false;
        if (error?.message?.includes('4')) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      // Fetcher padrão: assume primeira posição da queryKey como URL
      queryFn: ({ queryKey }) => apiRequest(queryKey[0] as string),
    },
    mutations: {
      retry: false,
    },
  },
});

// Função personalizada para fazer requests API
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Se há body e não é FormData ou string, serializar como JSON
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  // Debug logging for credit card API requests
  if (endpoint.includes('/credit-cards/')) {
    console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`, {
      body: config.body ? JSON.parse(config.body as string) : null,
      headers: config.headers
    });
  }

  try {
    const response = await fetch(url, config);
    
    // Se resposta não for JSON (ex: 204 No Content), retornar sem parsear
    if (response.status === 204) {
      return null;
    }
    
    // Tratamento especial para 401 - não lançar erro, retornar null
    if (response.status === 401 && endpoint.includes('/api/auth/user')) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.error || data.message || `${response.status}: ${response.statusText}`
      );
      (error as any).status = response.status;
      (error as any).details = data.details;
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error');
  }
}

// Hook personalizado para fazer requests GET com React Query
export function useApiQuery<T = any>(
  queryKey: (string | number | boolean | null | undefined)[],
  endpoint?: string,
  options: any = {}
) {
  const finalEndpoint = endpoint || (typeof queryKey[0] === 'string' ? queryKey[0] : '');
  
  return {
    queryKey,
    queryFn: () => apiRequest(finalEndpoint),
    ...options,
  };
}

// Default fetcher para React Query
export const defaultQueryFn = async ({ queryKey }: { queryKey: any[] }) => {
  const [url] = queryKey;
  return apiRequest(url);
};

// Mantido por compatibilidade com chamadas antigas específicas
queryClient.setQueryDefaults([''], { queryFn: defaultQueryFn });