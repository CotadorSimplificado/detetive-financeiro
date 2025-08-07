import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const AuthTest = () => {
  const [testResults, setTestResults] = useState<{
    login: 'idle' | 'testing' | 'success' | 'error';
    signup: 'idle' | 'testing' | 'success' | 'error';
    logout: 'idle' | 'testing' | 'success' | 'error';
  }>({
    login: 'idle',
    signup: 'idle', 
    logout: 'idle'
  });

  const { signIn, signUp, signOut, user, loading } = useAuth();

  const testLogin = async () => {
    setTestResults(prev => ({ ...prev, login: 'testing' }));
    
    try {
      const result = await signIn('usuario@exemplo.com', 'qualquer_senha');
      
      if (result.error) {
        setTestResults(prev => ({ ...prev, login: 'error' }));
      } else {
        setTestResults(prev => ({ ...prev, login: 'success' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, login: 'error' }));
    }
  };

  const testSignup = async () => {
    setTestResults(prev => ({ ...prev, signup: 'testing' }));
    
    try {
      const randomEmail = `teste${Math.random().toString(36).substr(2, 5)}@exemplo.com`;
      const result = await signUp(randomEmail, 'senha123', 'Usuário Teste');
      
      if (result.error) {
        setTestResults(prev => ({ ...prev, signup: 'error' }));
      } else {
        setTestResults(prev => ({ ...prev, signup: 'success' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, signup: 'error' }));
    }
  };

  const testLogout = async () => {
    setTestResults(prev => ({ ...prev, logout: 'testing' }));
    
    try {
      await signOut();
      setTestResults(prev => ({ ...prev, logout: 'success' }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, logout: 'error' }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">🧪 Teste de Autenticação Mock</CardTitle>
        <CardDescription>
          Validação dos métodos de autenticação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado Atual */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-medium">Estado Atual:</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Carregando...' : user ? `Logado como: ${user.full_name}` : 'Não autenticado'}
          </p>
        </div>

        {/* Testes */}
        <div className="space-y-2">
          <Button
            onClick={testLogin}
            disabled={testResults.login === 'testing'}
            variant="outline"
            className="w-full justify-between"
          >
            Testar Login
            {getStatusIcon(testResults.login)}
          </Button>

          <Button
            onClick={testSignup}
            disabled={testResults.signup === 'testing'}
            variant="outline"
            className="w-full justify-between"
          >
            Testar Cadastro
            {getStatusIcon(testResults.signup)}
          </Button>

          <Button
            onClick={testLogout}
            disabled={testResults.logout === 'testing' || !user}
            variant="outline"
            className="w-full justify-between"
          >
            Testar Logout
            {getStatusIcon(testResults.logout)}
          </Button>
        </div>

        {/* Resultados */}
        <div className="text-xs space-y-1">
          <p className="font-medium">Resultados dos Testes:</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className={`p-2 rounded ${
              testResults.login === 'success' ? 'bg-green-100 text-green-800' :
              testResults.login === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-600'
            }`}>
              Login: {testResults.login}
            </div>
            <div className={`p-2 rounded ${
              testResults.signup === 'success' ? 'bg-green-100 text-green-800' :
              testResults.signup === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-600'
            }`}>
              Cadastro: {testResults.signup}
            </div>
            <div className={`p-2 rounded ${
              testResults.logout === 'success' ? 'bg-green-100 text-green-800' :
              testResults.logout === 'error' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-600'
            }`}>
              Logout: {testResults.logout}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
