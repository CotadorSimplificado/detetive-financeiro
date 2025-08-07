// Arquivo de teste para demonstrar o uso do sistema de autenticação mock
// Este arquivo pode ser executado no console do navegador para testar a funcionalidade

import { mockStore, MockAuth, mockUsers } from './index.js';

// Função para testar o sistema de autenticação
export const testMockAuth = async () => {
  console.log('🧪 Iniciando testes do sistema de autenticação mock...\n');

  // 1. Verificar estado inicial
  console.log('1️⃣ Estado inicial:');
  console.log('   - Autenticado:', MockAuth.isAuthenticated());
  console.log('   - Usuário atual:', MockAuth.getCurrentUser());
  console.log('   - Sessão atual:', MockAuth.getCurrentSession());
  console.log('');

  // 2. Testar login com usuário pré-cadastrado
  console.log('2️⃣ Testando login com usuário pré-cadastrado...');
  const loginResult = await mockStore.signIn('usuario@exemplo.com', 'senha123');
  console.log('   - Resultado do login:', loginResult);
  console.log('   - Autenticado após login:', MockAuth.isAuthenticated());
  console.log('   - Usuário após login:', MockAuth.getCurrentUser());
  console.log('');

  // 3. Verificar localStorage
  console.log('3️⃣ Verificando localStorage:');
  const sessionData = localStorage.getItem('detetive_financeiro_mock_session');
  console.log('   - Dados da sessão no localStorage:', sessionData ? 'Presente' : 'Ausente');
  if (sessionData) {
    const session = JSON.parse(sessionData);
    console.log('   - Sessão expira em:', new Date(session.expires_at).toLocaleString());
  }
  console.log('');

  // 4. Testar renovação de sessão
  console.log('4️⃣ Testando renovação de sessão...');
  const refreshResult = await MockAuth.refreshSession();
  console.log('   - Renovação bem-sucedida:', refreshResult);
  console.log('   - Nova sessão:', MockAuth.getCurrentSession());
  console.log('');

  // 5. Testar verificação de expiração
  console.log('5️⃣ Verificando expiração da sessão:');
  console.log('   - Sessão expirando em breve:', MockAuth.isSessionExpiringSoon());
  console.log('');

  // 6. Testar logout
  console.log('6️⃣ Testando logout...');
  await mockStore.signOut();
  console.log('   - Autenticado após logout:', MockAuth.isAuthenticated());
  console.log('   - Usuário após logout:', MockAuth.getCurrentUser());
  console.log('   - localStorage após logout:', localStorage.getItem('detetive_financeiro_mock_session') ? 'Presente' : 'Limpo');
  console.log('');

  // 7. Testar cadastro de novo usuário
  console.log('7️⃣ Testando cadastro de novo usuário...');
  const signupResult = await mockStore.signUp('novo@teste.com', 'senha123', 'Novo Usuário');
  console.log('   - Resultado do cadastro:', signupResult);
  console.log('   - Autenticado após cadastro:', MockAuth.isAuthenticated());
  console.log('');

  // 8. Testar login com email inexistente
  console.log('8️⃣ Testando login com email inexistente...');
  const invalidLoginResult = await mockStore.signIn('inexistente@teste.com', 'senha123');
  console.log('   - Resultado do login inválido:', invalidLoginResult);
  console.log('');

  // 9. Testar cadastro com email já existente
  console.log('9️⃣ Testando cadastro com email já existente...');
  const duplicateSignupResult = await mockStore.signUp('usuario@exemplo.com', 'senha123', 'Usuário Duplicado');
  console.log('   - Resultado do cadastro duplicado:', duplicateSignupResult);
  console.log('');

  // 10. Listar usuários disponíveis
  console.log('🔟 Usuários pré-cadastrados disponíveis:');
  mockUsers.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.full_name} (${user.email})`);
  });
  console.log('');

  console.log('✅ Testes concluídos!');
  console.log('💡 Dica: Use "MockAuth.reset()" para limpar completamente a sessão.');
};

// Função para testar persistência entre recarregamentos
export const testPersistence = async () => {
  console.log('🔄 Testando persistência entre recarregamentos...\n');

  // Fazer login
  await mockStore.signIn('maria@exemplo.com', 'senha123');
  console.log('1️⃣ Login realizado com Maria Silva');
  console.log('   - Usuário:', MockAuth.getCurrentUser()?.full_name);
  console.log('   - localStorage:', localStorage.getItem('detetive_financeiro_mock_session') ? 'Presente' : 'Ausente');
  console.log('');

  console.log('2️⃣ Agora recarregue a página e execute:');
  console.log('   testPersistenceAfterReload()');
  console.log('');
};

// Função para verificar persistência após recarregamento
export const testPersistenceAfterReload = () => {
  console.log('🔄 Verificando persistência após recarregamento...\n');

  console.log('1️⃣ Estado após recarregamento:');
  console.log('   - Autenticado:', MockAuth.isAuthenticated());
  console.log('   - Usuário atual:', MockAuth.getCurrentUser()?.full_name);
  console.log('   - localStorage:', localStorage.getItem('detetive_financeiro_mock_session') ? 'Presente' : 'Ausente');
  console.log('');

  if (MockAuth.isAuthenticated()) {
    console.log('✅ Persistência funcionando! A sessão foi mantida.');
  } else {
    console.log('❌ Persistência falhou! A sessão não foi mantida.');
  }
  console.log('');
};

// Função para testar expiração de sessão
export const testSessionExpiration = async () => {
  console.log('⏰ Testando expiração de sessão...\n');

  // Fazer login
  await mockStore.signIn('joao@exemplo.com', 'senha123');
  console.log('1️⃣ Login realizado');
  console.log('   - Sessão expira em:', new Date(MockAuth.getCurrentSession()?.expires_at || 0).toLocaleString());
  console.log('');

  // Simular expiração (modificar a sessão para expirar em 1 segundo)
  const session = MockAuth.getCurrentSession();
  if (session) {
    session.expires_at = Date.now() + 1000; // 1 segundo
    localStorage.setItem('detetive_financeiro_mock_session', JSON.stringify(session));
    console.log('2️⃣ Sessão modificada para expirar em 1 segundo');
    console.log('');

    // Aguardar 2 segundos
    console.log('3️⃣ Aguardando 2 segundos...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('');

    // Verificar se a sessão foi limpa
    console.log('4️⃣ Verificando se a sessão foi limpa automaticamente:');
    console.log('   - Autenticado:', MockAuth.isAuthenticated());
    console.log('   - Usuário atual:', MockAuth.getCurrentUser());
    console.log('   - localStorage:', localStorage.getItem('detetive_financeiro_mock_session') ? 'Presente' : 'Limpo');
    console.log('');
  }
};

// Função para limpar tudo
export const cleanup = () => {
  console.log('🧹 Limpando todos os dados...\n');
  
  MockAuth.reset();
  console.log('✅ Dados limpos!');
  console.log('   - Autenticado:', MockAuth.isAuthenticated());
  console.log('   - localStorage:', localStorage.getItem('detetive_financeiro_mock_session') ? 'Presente' : 'Limpo');
  console.log('');
};

// Exportar funções para uso no console
if (typeof window !== 'undefined') {
  (window as any).testMockAuth = testMockAuth;
  (window as any).testPersistence = testPersistence;
  (window as any).testPersistenceAfterReload = testPersistenceAfterReload;
  (window as any).testSessionExpiration = testSessionExpiration;
  (window as any).cleanup = cleanup;
  (window as any).MockAuth = MockAuth;
  (window as any).mockStore = mockStore;
}
