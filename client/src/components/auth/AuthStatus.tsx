import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { User } from "@/types/auth";

export function AuthStatus() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2 justify-center">
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verificando autenticação...
            </>
          ) : isAuthenticated ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              Autenticado
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Não autenticado
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated && user && (
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Usuário:</strong> {user?.firstName || 'Usuário'} {user?.lastName || ''}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {user?.email || 'N/A'}
            </p>
            <p className="text-sm">
              <strong>ID:</strong> <code className="text-xs">{user?.id || 'N/A'}</code>
            </p>
          </div>
        )}
        
        {!isAuthenticated && !isLoading && (
          <div className="space-y-4">
            <CardDescription>
              Para acessar o sistema, você precisa fazer login com sua conta Replit.
            </CardDescription>
            <Button 
              className="w-full"
              onClick={() => {
                window.location.href = '/api/login';
              }}
            >
              Fazer Login
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              window.location.href = '/api/logout';
            }}
          >
            Fazer Logout
          </Button>
        )}
      </CardContent>
    </Card>
  );
}