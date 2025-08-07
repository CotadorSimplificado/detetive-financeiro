import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                  Visão geral das suas finanças pessoais
                </p>
              </div>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </div>
            
            <DashboardCards />
          </div>
        );
      
      case "new-expense":
      case "new-income":
      case "transfer":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab === "new-expense" && "Nova Despesa"}
                {activeTab === "new-income" && "Nova Receita"}
                {activeTab === "transfer" && "Nova Transferência"}
              </h1>
              <p className="text-muted-foreground">
                Registre uma nova movimentação financeira
              </p>
            </div>
            
            <div className="max-w-md mx-auto mt-20 text-center">
              <h3 className="text-lg font-semibold mb-2">Em desenvolvimento</h3>
              <p className="text-muted-foreground">
                Formulário de {activeTab === "new-expense" ? "despesa" : activeTab === "new-income" ? "receita" : "transferência"} será implementado aqui
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab("dashboard")}
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-muted-foreground">
                Esta seção será implementada em breve
              </p>
            </div>
            
            <div className="max-w-md mx-auto mt-20 text-center">
              <h3 className="text-lg font-semibold mb-2">Em desenvolvimento</h3>
              <p className="text-muted-foreground">
                A seção {activeTab} será implementada nas próximas versões
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab("dashboard")}
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  );
};

export default Index;
