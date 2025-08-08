import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { usePageTransition } from "@/hooks/usePageTransition";
import { LoadingOverlay } from "@/components/ui/loading";
import { 
  Home, 
  ArrowLeftRight, 
  CreditCard, 
  PieChart, 
  Target, 
  TrendingUp,
  Settings,
  Plus,
  Wallet,
  Receipt,
  BarChart3
} from "lucide-react";

interface SidebarProps {
  className?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNewTransaction?: () => void;
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    id: "transactions",
    label: "Transações",
    icon: ArrowLeftRight,
    href: "/transactions",
  },
  {
    id: "accounts",
    label: "Contas",
    icon: Wallet,
    href: "/accounts",
  },
  {
    id: "cards",
    label: "Cartões",
    icon: CreditCard,
    href: "/cards",
  },
  {
    id: "budgets",
    label: "Orçamentos",
    icon: PieChart,
    href: "/budgets",
  },
  {
    id: "goals",
    label: "Metas",
    icon: Target,
    href: "/goals",
  },
  {
    id: "reports",
    label: "Relatórios",
    icon: BarChart3,
    href: "/reports",
  },
  {
    id: "investments",
    label: "Investimentos",
    icon: TrendingUp,
    href: "/investments",
  }
];

export const Sidebar = ({ className, activeTab = "dashboard", onTabChange, onNewTransaction }: SidebarProps) => {
  const { isTransitioning, navigateWithTransition } = usePageTransition();

  return (
    <>
      <LoadingOverlay isVisible={isTransitioning} message="Navegando..." />

      <div className={cn("pb-12 w-64", className)}>
        <div className="space-y-4 py-4">
          {/* Logo Section */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 px-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Detetive Financeiro
              </h2>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-3">
            <div className="space-y-1">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Ações Rápidas
              </h3>
              <Button
                className="w-full justify-start h-10 bg-gradient-primary hover:opacity-90 text-white"
                onClick={() => onNewTransaction?.()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Lançamento
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-3">
            <div className="space-y-1">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Navegação
              </h3>
              <ScrollArea className="h-[300px]">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10 text-sm mb-1",
                        isActive && "bg-primary/10 text-primary border-r-2 border-r-primary"
                      )}
                      asChild
                    >
                      <Link 
                        to={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateWithTransition(item.href);
                        }}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </ScrollArea>
            </div>
          </div>

          {/* Settings */}
          <div className="px-3">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-sm"
                onClick={() => onTabChange?.("settings")}
              >
                <Settings className="mr-3 h-4 w-4" />
                Configurações
              </Button>
            </div>
          </div>

          {/* Summary Card */}
          <div className="mx-3 p-4 rounded-lg bg-gradient-card border border-border/50">
            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground">Saldo Total</div>
              <div className="text-lg font-bold text-primary">
                R$ 6.790,42
              </div>
              <div className="text-xs text-income">+R$ 1.511,37 este mês</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};