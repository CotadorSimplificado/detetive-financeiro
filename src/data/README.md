# Sistema de Dados Mock - Detetive Financeiro

Este diretório contém a implementação completa do sistema de dados mock que substitui o Supabase no projeto Detetive Financeiro.

## 📁 Estrutura

```
src/data/
├── mock/           # Dados mock para cada entidade
│   ├── users.ts    # Usuários pré-cadastrados
│   ├── accounts.ts # Contas bancárias
│   ├── categories.ts # Categorias de transações
│   ├── transactions.ts # Transações
│   ├── creditCards.ts # Cartões de crédito
│   └── bills.ts    # Faturas de cartão
├── types/          # Definições de tipos TypeScript
│   └── index.ts    # Todos os tipos do sistema
├── store/          # Gerenciamento centralizado
│   └── mockStore.ts # Classe principal MockStore
├── index.ts        # Exports consolidados
└── README.md       # Esta documentação
```

## 🔐 Sistema de Autenticação Mock

### Usuários Pré-cadastrados

O sistema inclui 6 usuários pré-cadastrados para testes:

| Email | Nome | ID |
|-------|------|----|
| `usuario@exemplo.com` | Usuário Exemplo | 1 |
| `maria@exemplo.com` | Maria Silva | 2 |
| `joao@exemplo.com` | João Santos | 3 |
| `ana@exemplo.com` | Ana Costa | 4 |
| `pedro@exemplo.com` | Pedro Oliveira | 5 |
| `teste@exemplo.com` | Usuário Teste | 6 |

### Como Usar

```typescript
import { mockStore } from '@/data';

// Login (qualquer senha é aceita para usuários pré-cadastrados)
const { user, error } = await mockStore.signIn('usuario@exemplo.com', 'senha123');

// Cadastro de novo usuário
const { user, error } = await mockStore.signUp('novo@email.com', 'senha123', 'Nome Completo');

// Logout
await mockStore.signOut();

// Verificar se está autenticado
const isAuth = mockStore.isAuthenticated();

// Obter usuário atual
const currentUser = mockStore.getCurrentUser();

// Obter sessão atual
const session = mockStore.getCurrentSession();
```

### Persistência de Sessão

O sistema automaticamente:

- **Salva** a sessão no `localStorage` após login/cadastro
- **Recupera** a sessão do `localStorage` na inicialização
- **Verifica** se a sessão não expirou (24 horas)
- **Limpa** a sessão expirada automaticamente
- **Remove** a sessão do `localStorage` no logout

### Métodos de Sessão

```typescript
// Renovar sessão (estender por mais 24 horas)
await mockStore.refreshSession();

// Verificar se a sessão está próxima de expirar (últimas 2 horas)
const expiringSoon = mockStore.isSessionExpiringSoon();

// Resetar completamente (limpa memória e localStorage)
mockStore.reset();
```

## 📊 Dados Disponíveis

### Contas Bancárias
- Conta Principal (Corrente)
- Conta Poupança
- Conta de Investimentos
- Carteira (Dinheiro)

### Categorias
- **Receitas**: Salário, Freelance, Investimentos, Outros
- **Despesas**: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Vestuário, Serviços

### Transações
- Transações de exemplo para cada categoria
- Diferentes valores e datas
- Transações recorrentes e únicas

### Cartões de Crédito
- Nubank (Mastercard)
- Itaú (Visa)
- Santander (Elo)

### Faturas
- Faturas abertas e pagas
- Diferentes valores e datas de vencimento

## 🔧 Configuração

### Delays Simulados

O sistema inclui delays para simular chamadas de rede:

```typescript
// Configurações de delay (em ms)
const MOCK_CONFIG = {
  AUTH_DELAY: 500,      // Login
  SIGNUP_DELAY: 800,    // Cadastro
  LOGOUT_DELAY: 300,    // Logout
  DATA_DELAY: 200,      // Consultas de dados
  CREATE_DELAY: 400,    // Criação
  UPDATE_DELAY: 300,    // Atualização
  DELETE_DELAY: 250     // Exclusão
};
```

### Utilitários de Desenvolvimento

```typescript
import { MockUtils } from '@/data';

// Gerar dados de teste
MockUtils.generateTestData();

// Limpar todos os dados
MockUtils.clearAllData();

// Resetar para estado inicial
MockUtils.resetToDefaults();
```

## 🚀 Integração com React

### Hook de Autenticação

```typescript
import { useState, useEffect } from 'react';
import { mockStore, MockUser, MockSession } from '@/data';

export const useMockAuth = () => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão na inicialização
    const currentUser = mockStore.getCurrentUser();
    const currentSession = mockStore.getCurrentSession();
    
    setUser(currentUser);
    setSession(currentSession);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user, error } = await mockStore.signIn(email, password);
    if (user) {
      setUser(user);
      setSession(mockStore.getCurrentSession());
    }
    return { user, error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { user, error } = await mockStore.signUp(email, password, fullName);
    if (user) {
      setUser(user);
      setSession(mockStore.getCurrentSession());
    }
    return { user, error };
  };

  const signOut = async () => {
    await mockStore.signOut();
    setUser(null);
    setSession(null);
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: mockStore.isAuthenticated()
  };
};
```

## 🔄 Migração do Supabase

Este sistema foi projetado para ser um drop-in replacement do Supabase:

1. **Mesma API**: Os métodos têm a mesma assinatura
2. **Mesmos tipos**: Usa os mesmos tipos TypeScript
3. **Mesmo comportamento**: Simula delays e erros
4. **Persistência**: Mantém dados entre sessões

### Substituição Gradual

1. Importar `mockStore` em vez de `supabase`
2. Substituir chamadas de autenticação
3. Adaptar hooks de dados
4. Testar funcionalidades
5. Remover dependências do Supabase

## 🐛 Debugging

### Logs de Desenvolvimento

```typescript
// Habilitar logs detalhados
localStorage.setItem('mock_debug', 'true');

// Ver dados atuais
console.log('Usuários:', mockUsers);
console.log('Contas:', mockAccounts);
console.log('Transações:', mockTransactions);
```

### Verificar Sessão

```typescript
// Verificar localStorage
console.log('Sessão salva:', localStorage.getItem('detetive_financeiro_mock_session'));

// Verificar estado atual
console.log('Usuário atual:', mockStore.getCurrentUser());
console.log('Sessão atual:', mockStore.getCurrentSession());
console.log('Autenticado:', mockStore.isAuthenticated());
```

## 🎯 Context API

### Visão Geral

O sistema inclui um Context API completo que fornece:

- **Gerenciamento de estado global** para todos os dados mock
- **Persistência automática** no localStorage
- **Hooks customizados** para cada entidade
- **Reatividade** com React
- **CRUD operations** completas

### Estrutura do Context

```
MockProvider (Context Provider)
├── useMockStore (Hook principal)
├── useMockAuth (Autenticação)
├── useMockAccounts (Contas)
├── useMockCategories (Categorias)
├── useMockTransactions (Transações)
├── useMockCreditCards (Cartões)
└── useMockBills (Faturas)
```

### Persistência de Estado

O Context API automaticamente:

- **Salva** o estado no localStorage quando há mudanças
- **Recupera** o estado do localStorage na inicialização
- **Sincroniza** dados entre abas do navegador
- **Limpa** dados expirados automaticamente

### Exemplo de Uso Completo

```typescript
// App.tsx
import { MockProvider } from '@/data';

function App() {
  return (
    <MockProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </Router>
    </MockProvider>
  );
}

// Dashboard.tsx
import { useMockAuth, useMockAccounts, useMockTransactions } from '@/data';

function Dashboard() {
  const { user, isAuthenticated } = useMockAuth();
  const { accounts, totalBalance, fetchAccounts } = useMockAccounts();
  const { transactions, totalIncome, totalExpenses, fetchTransactions } = useMockTransactions();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAccounts();
      fetchTransactions();
    }
  }, [isAuthenticated, fetchAccounts, fetchTransactions]);

  if (!isAuthenticated) {
    return <div>Faça login para continuar</div>;
  }

  return (
    <div>
      <h1>Bem-vindo, {user?.full_name}!</h1>
      <div>
        <h2>Resumo Financeiro</h2>
        <p>Saldo Total: R$ {totalBalance.toFixed(2)}</p>
        <p>Receitas: R$ {totalIncome.toFixed(2)}</p>
        <p>Despesas: R$ {totalExpenses.toFixed(2)}</p>
      </div>
    </div>
  );
}
```

### Testes

Para testar o Context API:

```typescript
// No console do navegador
import('./src/data/test-context.ts').then(module => {
  module.testContextAPI();           // Teste completo
  module.testContextPersistence();   // Teste de persistência
  module.showContextInfo();          // Informações do Context
  module.cleanupContext();           // Limpar dados
});
```

## 📝 Notas Importantes

1. **Senhas**: Para usuários pré-cadastrados, qualquer senha é aceita
2. **Persistência**: Dados são mantidos apenas em memória e localStorage
3. **Expiração**: Sessões expiram em 24 horas
4. **Limpeza**: Sessões expiradas são automaticamente removidas
5. **Segurança**: Este é um sistema de desenvolvimento, não para produção
6. **Context API**: Use o MockProvider para gerenciamento de estado reativo

## 🔮 Próximos Passos

- [x] Implementar Context API com hooks customizados
- [x] Adicionar persistência de estado no localStorage
- [x] Criar hooks para cada entidade (accounts, categories, transactions, etc.)
- [ ] Implementar validação de senhas mais robusta
- [ ] Adicionar mais cenários de teste
- [ ] Implementar sincronização entre abas
- [ ] Adicionar logs de auditoria
- [ ] Implementar backup/restore de dados
