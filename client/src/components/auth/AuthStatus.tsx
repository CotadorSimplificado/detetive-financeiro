import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function AuthStatus() {
  const auth = useAuth();
  const isLoading = 'isLoading' in auth ? auth.isLoading : auth.loading;
  const { isAuthenticated } = auth;
  const user = 'user' in auth ? auth.user : null;

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
              <strong>Usuário:</strong> {(user as any)?.firstName || 'Usuário'} {(user as any)?.lastName || ''}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {(user as any)?.email || 'N/A'}
            </p>
            <p className="text-sm">
              <strong>ID:</strong> <code className="text-xs">{(user as any)?.id || 'N/A'}</code>
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
                window.open('/api/login', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
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