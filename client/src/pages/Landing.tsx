import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard, PieChart } from "lucide-react";
import { AuthStatus } from "@/components/auth/AuthStatus";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Detetive Financeiro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Descubra os segredos das suas finanças. Gerencie contas, transações, cartões de crédito e planejamento orçamentário de forma inteligente.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => {
              // Abrir em nova aba para melhor experiência de auth
              window.open('/api/login', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
            }}
            data-testid="button-login"
          >
            Entrar com Replit
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Controle Total</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gerencie todas suas contas bancárias em um só lugar
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Análise Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Relatórios detalhados com insights sobre seus gastos
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Cartões de Crédito</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Controle total das faturas e gastos do cartão
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <PieChart className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <CardTitle>Planejamento</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Orçamentos mensais e metas financeiras personalizadas
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Auth Status Section */}
        <div className="mb-16">
          <AuthStatus />
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pronto para descobrir seus padrões financeiros?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Comece agora mesmo a investigar suas finanças de forma profissional
          </p>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => {
              // Abrir em nova aba para melhor experiência de auth
              window.open('/api/login', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
            }}
            data-testid="button-cta-login"
          >
            Começar Investigação
          </Button>
        </div>
      </div>
    </div>
  );
}