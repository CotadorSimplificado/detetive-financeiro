/**
 * Sistema de Feature Flags para migração gradual do mock para backend real
 * Permite habilitar/desabilitar funcionalidades durante a transição
 */

interface FeatureFlags {
  // Migração por componente
  useRealCategories: boolean;
  useRealAccounts: boolean;
  useRealTransactions: boolean;
  useRealCreditCards: boolean;
  useRealAuth: boolean;
  
  // Funcionalidades específicas
  useRealBudgets: boolean;
  useRealReports: boolean;
  
  // Debug e desenvolvimento
  debugMode: boolean;
  parallelMode: boolean; // Executar mock e real em paralelo para comparação
}

// Configuração padrão das feature flags
const defaultFlags: FeatureFlags = {
  // Começar com categorias ativas
  useRealCategories: true,
  
  // Outras funcionalidades ainda em mock
  useRealAccounts: false,
  useRealTransactions: false,
  useRealCreditCards: false,
  useRealAuth: false,
  useRealBudgets: false,
  useRealReports: false,
  
  // Debug desabilitado por padrão
  debugMode: false,
  parallelMode: false,
};

// Storage key para localStorage
const FEATURE_FLAGS_KEY = 'detetive_financeiro_feature_flags';

/**
 * Classe para gerenciar feature flags
 */
class FeatureFlagsManager {
  private flags: FeatureFlags;

  constructor() {
    this.flags = this.loadFlags();
  }

  /**
   * Carrega flags do localStorage ou usa padrão
   */
  private loadFlags(): FeatureFlags {
    try {
      const stored = localStorage.getItem(FEATURE_FLAGS_KEY);
      if (stored) {
        const parsedFlags = JSON.parse(stored);
        return { ...defaultFlags, ...parsedFlags };
      }
    } catch (error) {
      console.warn('Erro ao carregar feature flags:', error);
    }
    return { ...defaultFlags };
  }

  /**
   * Salva flags no localStorage
   */
  private saveFlags(): void {
    try {
      localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(this.flags));
    } catch (error) {
      console.warn('Erro ao salvar feature flags:', error);
    }
  }

  /**
   * Verifica se uma feature está habilitada
   */
  isEnabled(flagName: keyof FeatureFlags): boolean {
    return this.flags[flagName];
  }

  /**
   * Habilita uma feature
   */
  enable(flagName: keyof FeatureFlags): void {
    this.flags[flagName] = true;
    this.saveFlags();
  }

  /**
   * Desabilita uma feature
   */
  disable(flagName: keyof FeatureFlags): void {
    this.flags[flagName] = false;
    this.saveFlags();
  }

  /**
   * Toggle de uma feature
   */
  toggle(flagName: keyof FeatureFlags): boolean {
    this.flags[flagName] = !this.flags[flagName];
    this.saveFlags();
    return this.flags[flagName];
  }

  /**
   * Retorna todas as flags
   */
  getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  /**
   * Atualiza múltiplas flags de uma vez
   */
  updateFlags(updates: Partial<FeatureFlags>): void {
    this.flags = { ...this.flags, ...updates };
    this.saveFlags();
  }

  /**
   * Reset para configuração padrão
   */
  resetToDefaults(): void {
    this.flags = { ...defaultFlags };
    this.saveFlags();
  }

  /**
   * Logs para debug
   */
  logCurrentState(): void {
    if (this.flags.debugMode) {
      console.log('Feature Flags State:', this.flags);
    }
  }
}

// Instância singleton
export const featureFlags = new FeatureFlagsManager();

// Hook para usar feature flags em componentes React
export const useFeatureFlags = () => {
  const getAllFlags = () => featureFlags.getAllFlags();
  const isEnabled = (flagName: keyof FeatureFlags) => featureFlags.isEnabled(flagName);
  const enable = (flagName: keyof FeatureFlags) => featureFlags.enable(flagName);
  const disable = (flagName: keyof FeatureFlags) => featureFlags.disable(flagName);
  const toggle = (flagName: keyof FeatureFlags) => featureFlags.toggle(flagName);

  return {
    flags: getAllFlags(),
    isEnabled,
    enable,
    disable,
    toggle,
    updateFlags: (updates: Partial<FeatureFlags>) => featureFlags.updateFlags(updates),
    resetToDefaults: () => featureFlags.resetToDefaults(),
  };
};

// Utilitários para debug
export const enableAllRealFeatures = () => {
  featureFlags.updateFlags({
    useRealCategories: true,
    useRealAccounts: true,
    useRealTransactions: true,
    useRealCreditCards: true,
    useRealAuth: true,
    useRealBudgets: true,
    useRealReports: true,
    debugMode: true,
    parallelMode: true,
  });
};

export const enableDebugMode = () => {
  featureFlags.enable('debugMode');
  featureFlags.enable('parallelMode');
};

export type { FeatureFlags };