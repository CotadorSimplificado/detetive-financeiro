import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "../navigation/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNewTransaction?: () => void;
}

export const MainLayout = ({ children, activeTab, onTabChange, onNewTransaction }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Auto-detect active tab based on current route if not explicitly provided
  const getActiveTabFromRoute = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path === "/accounts") return "accounts";
    if (path === "/transactions") return "transactions";
    if (path === "/cards") return "cards";
    if (path === "/budgets") return "budgets";
    if (path === "/goals") return "goals";
    if (path === "/reports") return "reports";
    if (path === "/investments") return "investments";
    return "dashboard";
  };

  const currentActiveTab = activeTab || getActiveTabFromRoute();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          activeTab={currentActiveTab} 
          onTabChange={(tab) => {
            onTabChange?.(tab);
            setSidebarOpen(false);
          }}
          onNewTransaction={onNewTransaction}
        />
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          user={{
            name: user?.user_metadata?.full_name || user?.email || "Usuário",
            email: user?.email || ""
          }}
        />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};