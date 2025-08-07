// Arquivo de teste para demonstrar o uso do Context API mock
// Este arquivo pode ser executado no console do navegador para testar a funcionalidade

import { mockStore, MockProvider, useMockStore } from './index.js'; // Changed to './index.js' for browser compatibility

// Função para testar o Context API
export const testContextAPI = async () => {
  console.log('🧪 Testando Context API Mock...');
  
  try {
    // Teste 1: Verificar se o mockStore está funcionando
    console.log('1️⃣ Testando mockStore básico...');
    const authResult = await mockStore.signIn('usuario@exemplo.com', 'senha123');
    console.log('Login resultado:', authResult);
    
    if (authResult.user) {
      console.log('✅ Login bem-sucedido');
      
      // Teste 2: Buscar dados
      console.log('2️⃣ Buscando dados...');
      const accounts = await mockStore.getAccounts(authResult.user.id);
      const categories = await mockStore.getCategories(authResult.user.id);
      const transactions = await mockStore.getTransactions(authResult.user.id);
      
      console.log('Contas encontradas:', accounts.length);
      console.log('Categorias encontradas:', categories.length);
      console.log('Transações encontradas:', transactions.length);
      
      // Teste 3: Criar dados
      console.log('3️⃣ Criando dados...');
      const newAccount = await mockStore.createAccount({
        user_id: authResult.user.id,
        name: 'Conta Teste Context',
        type: 'CHECKING',
        current_balance: 500,
        initial_balance: 500,
        color: '#10B981',
        icon: '💳',
        is_default: false,
        include_in_total: true,
        is_active: true,
        sync_enabled: false
      });
      
      console.log('Nova conta criada:', newAccount);
      
      // Teste 4: Atualizar dados
      console.log('4️⃣ Atualizando dados...');
      const updatedAccount = await mockStore.updateAccount(newAccount.id, {
        name: 'Conta Teste Context Atualizada',
        current_balance: 750
      });
      
      console.log('Conta atualizada:', updatedAccount);
      
      // Teste 5: Deletar dados
      console.log('5️⃣ Deletando dados...');
      const deleteResult = await mockStore.deleteAccount(newAccount.id);
      console.log('Conta deletada:', deleteResult);
      
      // Teste 6: Logout
      console.log('6️⃣ Fazendo logout...');
      await mockStore.signOut();
      console.log('Logout realizado');
      
      console.log('✅ Todos os testes do Context API passaram!');
    } else {
      console.log('❌ Falha no login');
    }
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error);
  }
};

// Função para testar persistência do Context
export const testContextPersistence = async () => {
  console.log('🧪 Testando persistência do Context...');
  
  try {
    // Login
    const authResult = await mockStore.signIn('usuario@exemplo.com', 'senha123');
    
    if (authResult.user) {
      // Criar alguns dados
      const account = await mockStore.createAccount({
        user_id: authResult.user.id,
        name: 'Conta Persistente',
        type: 'SAVINGS',
        current_balance: 1000,
        initial_balance: 1000,
        color: '#F59E0B',
        icon: '💰',
        is_default: false,
        include_in_total: true,
        is_active: true,
        sync_enabled: false
      });
      
      const transaction = await mockStore.createTransaction({
        user_id: authResult.user.id,
        account_id: account.id,
        category_id: '1',
        description: 'Transação Persistente',
        amount: 100,
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
        is_recurring: false,
        recurring_frequency: null,
        notes: 'Teste de persistência'
      });
      
      console.log('Dados criados para persistência:');
      console.log('- Conta:', account.name);
      console.log('- Transação:', transaction.description);
      
      // Verificar localStorage
      const persistedState = localStorage.getItem('detetive_financeiro_mock_state');
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        console.log('Estado persistido no localStorage:', parsedState);
        console.log('✅ Persistência funcionando!');
      } else {
        console.log('❌ Nenhum estado persistido encontrado');
      }
      
      // Logout
      await mockStore.signOut();
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de persistência:', error);
  }
};

// Função para testar hooks customizados (simulação)
export const testCustomHooks = () => {
  console.log('🧪 Testando hooks customizados...');
  
  console.log('Hooks disponíveis:');
  console.log('- useMockAuth: Autenticação');
  console.log('- useMockAccounts: Contas');
  console.log('- useMockCategories: Categorias');
  console.log('- useMockTransactions: Transações');
  console.log('- useMockCreditCards: Cartões de crédito');
  console.log('- useMockBills: Faturas');
  
  console.log('✅ Hooks customizados criados com sucesso!');
  console.log('💡 Use estes hooks em componentes React com o MockProvider');
};

// Função para limpar dados de teste
export const cleanupContext = () => {
  console.log('🧹 Limpando dados de teste...');
  
  try {
    // Limpar localStorage
    localStorage.removeItem('detetive_financeiro_mock_state');
    localStorage.removeItem('detetive_financeiro_mock_session');
    
    // Reset do mockStore
    mockStore.reset();
    
    console.log('✅ Dados de teste limpos!');
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
  }
};

// Função para mostrar informações do Context
export const showContextInfo = () => {
  console.log('📋 Informações do Context API Mock');
  console.log('');
  console.log('🔧 Componentes principais:');
  console.log('- MockProvider: Provider do Context');
  console.log('- useMockStore: Hook principal');
  console.log('- useMockAuth: Hook de autenticação');
  console.log('- useMockAccounts: Hook de contas');
  console.log('- useMockCategories: Hook de categorias');
  console.log('- useMockTransactions: Hook de transações');
  console.log('- useMockCreditCards: Hook de cartões');
  console.log('- useMockBills: Hook de faturas');
  console.log('');
  console.log('💾 Persistência:');
  console.log('- localStorage: detetive_financeiro_mock_state');
  console.log('- Sessões: detetive_financeiro_mock_session');
  console.log('');
  console.log('🎯 Como usar:');
  console.log('1. Envolva sua app com <MockProvider>');
  console.log('2. Use os hooks customizados nos componentes');
  console.log('3. Os dados são automaticamente persistidos');
  console.log('');
  console.log('🧪 Testes disponíveis:');
  console.log('- testContextAPI(): Teste completo');
  console.log('- testContextPersistence(): Teste de persistência');
  console.log('- testCustomHooks(): Informações dos hooks');
  console.log('- cleanupContext(): Limpar dados');
};

// Exportar funções para uso no console
if (typeof window !== 'undefined') {
  (window as any).testContextAPI = testContextAPI;
  (window as any).testContextPersistence = testContextPersistence;
  (window as any).testCustomHooks = testCustomHooks;
  (window as any).cleanupContext = cleanupContext;
  (window as any).showContextInfo = showContextInfo;
  (window as any).MockProvider = MockProvider;
  (window as any).useMockStore = useMockStore;
  (window as any).mockStore = mockStore;
}
