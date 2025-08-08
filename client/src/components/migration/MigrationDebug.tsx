import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFeatureFlags, enableDebugMode, enableAllRealFeatures } from "@/lib/featureFlags";
import { useCategories } from "@/hooks/useCategories";

/**
 * Componente para debug e controle da migração do backend
 * Permite habilitar/desabilitar features e ver o estado atual
 */
export const MigrationDebug = () => {
  const { flags, isEnabled, toggle, resetToDefaults } = useFeatureFlags();
  const { data: categories, loading, error } = useCategories();

  const handleEnableAllReal = () => {
    enableAllRealFeatures();
    window.location.reload(); // Força reload para aplicar mudanças
  };

  const handleEnableDebug = () => {
    enableDebugMode();
    window.location.reload();
  };

  const handleToggleFlag = (flagName: keyof typeof flags) => {
    toggle(flagName);
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🚀 Migração Backend - Debug Panel
        </CardTitle>
        <CardDescription>
          Controle da migração gradual do mock para backend real
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status das Categorias */}
        <div>
          <h3 className="text-sm font-medium mb-2">Status Categorias</h3>
          <div className="flex items-center gap-4">
            <Badge variant={isEnabled('useRealCategories') ? 'default' : 'secondary'}>
              {isEnabled('useRealCategories') ? '🔄 API Real' : '🎭 Mock'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {loading ? 'Carregando...' : `${categories.length} categorias`}
            </span>
            {error && (
              <Badge variant="destructive">Erro: {error}</Badge>
            )}
          </div>
        </div>

        {/* Feature Flags */}
        <div>
          <h3 className="text-sm font-medium mb-3">Feature Flags</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(flags).map(([key, value]) => (
              <Button
                key={key}
                variant={value ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleFlag(key as keyof typeof flags)}
                className="justify-start text-xs"
              >
                {value ? "✅" : "❌"} {key}
              </Button>
            ))}
          </div>
        </div>

        {/* Debug Info */}
        {isEnabled('debugMode') && (
          <div>
            <h3 className="text-sm font-medium mb-2">Debug Info</h3>
            <div className="bg-muted p-3 rounded text-xs font-mono">
              <div>Categories API: {isEnabled('useRealCategories') ? 'REAL' : 'MOCK'}</div>
              <div>Categories count: {categories.length}</div>
              <div>Loading: {loading.toString()}</div>
              <div>Error: {error || 'none'}</div>
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleEnableDebug} variant="outline" size="sm">
            🐛 Habilitar Debug
          </Button>
          <Button onClick={handleEnableAllReal} variant="outline" size="sm">
            🚀 Habilitar Tudo Real
          </Button>
          <Button onClick={() => { resetToDefaults(); window.location.reload(); }} variant="outline" size="sm">
            🔄 Reset Padrão
          </Button>
        </div>

        {/* Status da API */}
        <div>
          <h3 className="text-sm font-medium mb-2">Status da API</h3>
          <div className="text-xs text-muted-foreground">
            Backend URL: http://localhost:5000/api
          </div>
        </div>
      </CardContent>
    </Card>
  );
};