import React, { useEffect } from 'react';
import { MockProvider, useMockAuth, useMockAccounts, useMockTransactions } from '../index';

/**
 * Exemplo de uso do Context API mock
 * Demonstra como usar os hooks customizados em componentes React
 */

// Componente que usa autenticação
const AuthExample: React.FC = () => {
  const { user, isAuthenticated, loading, signIn, signOut, error } = useMockAuth();

  const handleLogin = async () => {
    const result = await signIn('usuario@exemplo.com', 'senha123');
    if (result.user) {
      console.log('Login realizado com sucesso:', result.user);
    } else {
      console.error('Erro no login:', result.error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    console.log('Logout realizado');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h3>Exemplo de Autenticação</h3>
      {isAuthenticated ? (
        <div>
          <p>Usuário logado: {user?.full_name}</p>
          <p>Email: {user?.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Usuário não logado</p>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
    </div>
  );
};

// Componente que usa contas
const AccountsExample: React.FC = () => {
  const { 
    accounts, 
    loading, 
    fetchAccounts, 
    createAccount, 
    totalBalance,
    hasAccounts 
  } = useMockAccounts();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleCreateAccount = async () => {
    const newAccount = await createAccount({
      name: 'Nova Conta',
      type: 'CHECKING',
      current_balance: 1000,
      initial_balance: 1000,
      color: '#3B82F6',
      icon: '🏦',
      is_default: false,
      include_in_total: true,
      is_active: true,
      sync_enabled: false
    });

    if (newAccount) {
      console.log('Conta criada:', newAccount);
    }
  };

  if (loading) {
    return <div>Carregando contas...</div>;
  }

  return (
    <div>
      <h3>Exemplo de Contas</h3>
      <p>Saldo total: R$ {totalBalance.toFixed(2)}</p>
      <p>Número de contas: {accounts.length}</p>
      
      <button onClick={handleCreateAccount}>Criar Nova Conta</button>
      
      {hasAccounts && (
        <ul>
          {accounts.map(account => (
            <li key={account.id}>
              {account.name} - R$ {account.current_balance?.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Componente que usa transações
const TransactionsExample: React.FC = () => {
  const { 
    transactions, 
    loading, 
    fetchTransactions, 
    createTransaction,
    totalIncome,
    totalExpenses,
    netAmount
  } = useMockTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreateTransaction = async () => {
    const newTransaction = await createTransaction({
      account_id: '1', // ID da primeira conta
      category_id: '1', // ID da primeira categoria
      description: 'Nova transação',
      amount: 100,
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0],
      is_recurring: false,
      recurring_frequency: null,
      notes: 'Transação de exemplo'
    });

    if (newTransaction) {
      console.log('Transação criada:', newTransaction);
    }
  };

  if (loading) {
    return <div>Carregando transações...</div>;
  }

  return (
    <div>
      <h3>Exemplo de Transações</h3>
      <p>Receitas: R$ {totalIncome.toFixed(2)}</p>
      <p>Despesas: R$ {totalExpenses.toFixed(2)}</p>
      <p>Saldo: R$ {netAmount.toFixed(2)}</p>
      <p>Número de transações: {transactions.length}</p>
      
      <button onClick={handleCreateTransaction}>Criar Nova Transação</button>
      
      {transactions.length > 0 && (
        <ul>
          {transactions.slice(0, 5).map(transaction => (
            <li key={transaction.id}>
              {transaction.description} - R$ {transaction.amount?.toFixed(2)} ({transaction.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Componente principal que demonstra o uso completo
const ContextUsageExample: React.FC = () => {
  return (
    <MockProvider>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Exemplo de Uso do Context API Mock</h1>
        <p>Este exemplo demonstra como usar o sistema de dados mock com Context API.</p>
        
        <hr style={{ margin: '20px 0' }} />
        
        <AuthExample />
        
        <hr style={{ margin: '20px 0' }} />
        
        <AccountsExample />
        
        <hr style={{ margin: '20px 0' }} />
        
        <TransactionsExample />
        
        <hr style={{ margin: '20px 0' }} />
        
        <div>
          <h3>Como usar em seus componentes</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '5px',
            overflow: 'auto'
          }}>
{`// 1. Envolva sua aplicação com o MockProvider
import { MockProvider } from '@/data';

function App() {
  return (
    <MockProvider>
      <YourApp />
    </MockProvider>
  );
}

// 2. Use os hooks customizados em seus componentes
import { useMockAuth, useMockAccounts } from '@/data';

function MyComponent() {
  const { user, signIn, signOut } = useMockAuth();
  const { accounts, fetchAccounts } = useMockAccounts();
  
  // Seu código aqui...
}`}
          </pre>
        </div>
      </div>
    </MockProvider>
  );
};

export default ContextUsageExample;
