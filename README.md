# 🕵️ Detetive Financeiro

Sistema de Gestão Financeira Pessoal Inteligente com dados mock para desenvolvimento e demonstração.

## 📋 Sobre o Projeto

O **Detetive Financeiro** é uma aplicação web responsiva para controle financeiro pessoal que utiliza dados mock para desenvolvimento offline e demonstrações. O sistema oferece funcionalidades completas de gestão financeira sem dependência de banco de dados externo.

## 🚀 Funcionalidades Principais

- ✅ **Autenticação Mock**: Sistema de login/logout simulado
- ✅ **Dashboard Inteligente**: Visão geral das finanças com cards personalizáveis
- ✅ **Gestão de Contas**: Múltiplas contas bancárias e carteiras
- ✅ **Transações**: CRUD completo com categorização automática
- ✅ **Cartões de Crédito**: Controle de faturas e limites
- ✅ **Transferências**: Entre contas com validação de saldo
- ✅ **Relatórios**: Gráficos e análises visuais
- ✅ **Dados Mock**: Sistema completo funcionando offline

## 🛠️ Como executar o projeto

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Navegue para o diretório
cd detetive-financeiro

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080` (ou outra porta disponível).

## 🔑 Credenciais de Teste

Para acessar o sistema, use qualquer uma das credenciais abaixo:

```
Email: usuario@exemplo.com
Senha: qualquer_senha

Email: maria@exemplo.com  
Senha: qualquer_senha

Email: joao@exemplo.com
Senha: qualquer_senha
```

> **Nota**: O sistema de autenticação é mock, então qualquer senha funcionará.

## 🗂️ Estrutura dos Dados Mock

### Usuários
- 3 usuários de exemplo com perfis diferentes
- Dados pessoais e avatars realistas

### Contas Bancárias
- Conta corrente, poupança e carteira
- Saldos realistas e histórico
- Múltiplas instituições financeiras

### Transações
- 6 meses de histórico financeiro
- Categorias diversificadas (alimentação, transporte, lazer, etc.)
- Receitas e despesas equilibradas

### Cartões de Crédito
- Múltiplos cartões com limites
- Faturas abertas e pagas
- Transações parceladas

## 🏗️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Estado**: Context API + Zustand
- **Ícones**: Lucide React
- **Formulários**: React Hook Form + Zod
- **Gráficos**: Recharts
- **Persistência**: localStorage (dados mock)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboard
│   ├── accounts/       # Gestão de contas
│   ├── transactions/   # Transações
│   ├── cards/          # Cartões de crédito
│   └── ui/             # Componentes base
├── data/               # Sistema de dados mock
│   ├── mock/          # Dados de exemplo
│   ├── hooks/         # Hooks customizados
│   ├── store/         # Store centralizado
│   └── types/         # Tipos TypeScript
├── hooks/             # Hooks de compatibilidade
├── lib/               # Utilitários
└── pages/             # Páginas da aplicação
```

## 🎯 Próximos Passos

- [ ] Adicionar mais dados mock realistas
- [ ] Implementar modo escuro completo
- [ ] Adicionar testes automatizados
- [ ] Melhorar responsividade mobile
- [ ] Adicionar PWA (Progressive Web App)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

---

**Desenvolvido com ❤️ para demonstração de sistema financeiro completo**
