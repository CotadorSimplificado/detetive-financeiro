import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";

export default function ReplitLogin() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se já está autenticado, redireciona para home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    // Redireciona para a rota de login do Replit
    window.location.href = '/api/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Detetive Financeiro</h1>
          </div>
          <p className="text-muted-foreground">
            Gerencie suas finanças com inteligência
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Acesse sua conta</CardTitle>
            <CardDescription className="text-center">
              Faça login com sua conta Replit para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleLogin}
              data-testid="button-replit-login"
            >
              Fazer Login com Replit
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              Ao fazer login, você concorda em compartilhar suas informações básicas
              do Replit (nome, email e foto de perfil) com este aplicativo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}