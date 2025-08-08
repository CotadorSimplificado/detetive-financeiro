Documento de Requisitos do Produto (PRD) - Detetive Financeiro
Informações do Documento

Produto: Detetive Financeiro - Sistema de Gestão Financeira Pessoal
Versão: 2.2 (Simplificado)
Data: 07 de Agosto de 2025
Status: MVP - Desenvolvimento Lovable

Histórico de Versões

v1.1: Versão inicial com a definição das principais funcionalidades
v1.2: Versão enriquecida com base na análise visual de telas de referência
v2.0: Versão completa incluindo todos os requisitos
v2.1: Alinhamento com desenvolvimento Lovable
v2.2: Versão simplificada focada no MVP essencial

Índice

Visão Executiva
Arquitetura de Módulos
Requisitos Funcionais
Requisitos Não-Funcionais
Experiência do Usuário (UX/UI)
Roadmap e Priorização
Critérios de Aceitação
Glossário
Anexos


1. Visão Executiva
1.1 Missão do Produto
O Detetive Financeiro é uma plataforma web responsiva de gestão financeira pessoal que capacita usuários a tomar controle de suas finanças através de uma interface intuitiva e recursos práticos de organização financeira.
1.2 Proposta de Valor

Para usuários individuais: Controle simples e eficaz de receitas e despesas
Para famílias: Gestão colaborativa com compartilhamento de despesas
Para profissionais liberais: Separação clara entre finanças pessoais e profissionais

1.3 Diferenciais Competitivos

Interface limpa e intuitiva
Categorização eficiente de transações
Sistema de compartilhamento familiar prático
Dashboard personalizável
Relatórios visuais claros

1.4 Estratégia de Desenvolvimento

Fase 1: Frontend completo no Lovable com dados mock
Fase 2: Integração com Supabase para persistência
Fase 3: Features avançadas e otimizações


2. Arquitetura de Módulos
2.1 Módulos Principais

Dashboard - Centro de comando personalizado
Contas - Gestão de contas bancárias e carteiras
Cartões de Crédito - Controle de cartões e faturas
Transações - Registro e categorização de movimentações
Orçamentos - Planejamento e controle de gastos
Relatórios - Análises visuais
Metas Financeiras - Objetivos e acompanhamento
Configurações - Personalização e preferências

2.2 Módulos de Suporte

Autenticação
Importação de Dados
Exportação e Relatórios
Compartilhamento Familiar


3. Requisitos Funcionais
3.1 Dashboard
3.1.1 Estrutura e Personalização

Cards modulares com drag-and-drop para reorganização
Modo de edição para adicionar/remover widgets
Layouts predefinidos (Básico, Completo, Minimalista)
Salvamento automático de preferências

3.1.2 Cards Essenciais

Saldo Consolidado

Valor total agregado
Toggle para mostrar/ocultar valores
Indicador de tendência (↑↓)


Fluxo de Caixa

Receitas vs Despesas do mês
Balanço atual
Mini-gráfico de tendência


Despesas por Categoria

Gráfico donut interativo
Top 5 categorias com valores e percentuais
Comparativo com mês anterior


Status dos Cartões

Faturas abertas
Limite disponível
Próximos vencimentos


Metas do Mês

Progresso das metas ativas
Indicadores visuais de performance



3.2 Gestão de Transações
3.2.1 Criação de Lançamentos

Botão de ação rápida (+) para adicionar
Tipos de lançamento:

Receita (única, fixa, parcelada)
Despesa (única, fixa, parcelada)
Transferência entre contas



3.2.2 Formulário de Transação

Campos essenciais:

Valor
Descrição
Data
Categoria
Conta/Cartão
Tags opcionais



3.2.3 Funcionalidades

Busca e filtros avançados
Edição em lote de transações
Duplicação de lançamentos
Anexos (comprovantes)

3.2.4 Recorrência e Parcelamento

Configuração de recorrência (diária, semanal, mensal, anual)
Parcelamentos com visualização de parcelas
Edição de recorrentes:

Apenas esta ocorrência
Esta e futuras
Todas as ocorrências



3.3 Módulo de Contas
3.3.1 Tipos de Conta Suportados

Conta Corrente
Poupança
Carteira física
Caixinhas/Reservas

3.3.2 Funcionalidades

Cadastro manual de contas
Saldo atual editável
Histórico de saldos com gráfico
Agrupamento de contas (pessoal, família)
Cores e ícones personalizáveis

3.4 Módulo de Cartões de Crédito
3.4.1 Gestão de Cartões

Múltiplos cartões com limites
Melhor dia de compra calculado
Faturas mensais organizadas

3.4.2 Gestão de Faturas

Timeline visual de faturas
Detalhamento por fatura:

Lista de compras
Parcelamentos em andamento
Total da fatura
Status de pagamento



3.5 Módulo de Orçamentos
3.5.1 Criação de Orçamentos

Orçamento por categoria
Orçamento mensal geral
Templates pré-configurados

3.5.2 Monitoramento

Barra de progresso visual
Alertas quando próximo do limite
Comparativo com meses anteriores

3.6 Módulo de Relatórios
3.6.1 Tipos de Visualização

Gráficos de Pizza: Distribuição de gastos
Gráficos de Linha: Evolução temporal
Gráficos de Barra: Comparativos
Tabelas: Detalhamento completo

3.6.2 Relatórios Disponíveis

Resumo Mensal
Gastos por Categoria
Evolução de Saldo
Comparativo de Períodos

3.6.3 Funcionalidades

Filtros por período e categoria
Exportação (PDF, Excel, CSV)
Impressão otimizada

3.7 Metas Financeiras
3.7.1 Tipos de Meta

Economizar valor específico
Reduzir gastos em categoria
Quitar dívida
Formar reserva

3.7.2 Funcionalidades

Progresso visual com percentual
Prazo definido
Contribuições manuais ou automáticas
Histórico de progresso

3.8 Compartilhamento Familiar
3.8.1 Grupos Familiares

Criar grupos com nome e membros
Convidar membros por email/link
Gerenciar participantes

3.8.2 Compartilhamento de Despesas

Marcar transações para compartilhar
Sugerir divisão de valores
Notificar membros do grupo
Importar para conta pessoal com valor ajustado

3.9 Estratégia de Dados Mock
3.9.1 Estrutura de Dados Mock

Localização: /src/mocks/
Formato: JSON estruturado
Dados realistas para demonstração

3.9.2 Serviços Mock
javascript// Exemplo de estrutura
export const mockAPI = {
  getTransactions: async (filters) => {
    // Retorna transações mock filtradas
  },
  getAccounts: async () => {
    // Retorna contas mock
  },
  getDashboardData: async () => {
    // Retorna dados do dashboard
  }
};
3.9.3 Hooks Preparados para Migração
javascript// Hook reutilizável
export const useTransactions = () => {
  // Por enquanto: dados mock
  // Futuro: integração com Supabase
};
3.10 Gerenciamento de Estado
3.10.1 Estrutura de Estado Global

Autenticação: Usuário logado e sessão
Dados: Transações, contas, categorias
UI: Tema, sidebar, filtros ativos
Configurações: Preferências do usuário

3.10.2 Context Providers Organizados

AuthProvider - Autenticação
DataProvider - Dados da aplicação
UIProvider - Estado da interface
NotificationProvider - Sistema de notificações


4. Requisitos Não-Funcionais
4.1 Compatibilidade

Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
Dispositivos: Responsivo de 320px a 4K
PWA: Instalável em iOS e Android

4.2 Capacidade e Limites (Versão Free)
RecursoLimiteContas5Cartões3Transações/mês200Categorias customizadas10Metas simultâneas3Membros família4

5. Experiência do Usuário (UX/UI)
5.1 Design System
5.1.1 Stack Tecnológica Frontend (Lovable)

Framework: React 18+ com hooks
Build Tool: Vite
Estilização: Tailwind CSS
Componentes: shadcn/ui
Estado: Context API
Roteamento: React Router v6
Dados: Mock JSON

5.1.2 Sistema Visual

Tema claro/escuro com toggle
Cores consistentes em toda aplicação
Tipografia: Sistema legível e hierárquico
Feedback visual para todas as ações
Componentes reutilizáveis

5.2 Acessibilidade

Navegação por teclado
Textos alternativos em imagens
Contraste adequado (WCAG AA)
Tamanhos de toque mínimos (44x44px)
Indicadores visuais claros

5.3 Padrões de Interface
5.3.1 Modais e Formulários

Modais: Dialog do shadcn/ui
Validação: Em tempo real com feedback
Toast notifications: Para ações do usuário
Loading states: Skeleton screens

5.3.2 Listas e Tabelas

Paginação: Para listas grandes
Ordenação: Colunas clicáveis
Busca: Campo sempre visível
Empty states: Mensagens e ilustrações

5.3.3 Mobile First

Breakpoints Tailwind:

Mobile: default
Tablet: md (768px)
Desktop: lg (1024px)


Menu hambúrguer no mobile
Swipe gestures onde aplicável

5.4 Onboarding

Wizard inicial simples:

Criar conta
Adicionar primeira conta bancária
Criar primeira transação
Explorar dashboard



5.5 PWA Features

Instalável como app
Ícone e splash screen
Funcionamento básico sem internet
Atualização automática


6. Roadmap e Priorização
6.1 MVP - Fase 1: Estrutura Base
Componentes Fundamentais

✅ Layout principal responsivo
✅ Sistema de rotas
✅ Autenticação visual (mock)
✅ Dashboard básico
✅ CRUD de transações
✅ CRUD de contas
✅ Categorias pré-definidas

Componentes Reutilizáveis Prioritários

<TransactionModal /> - Criar/editar transações
<DashboardCard /> - Cards do dashboard
<CategoryPicker /> - Seletor de categorias
<DateRangePicker /> - Filtro de datas
<AmountInput /> - Input monetário
<AccountSelector /> - Seletor de contas
<EmptyState /> - Estados vazios
<LoadingState /> - Estados de carregamento

6.2 Fase 2: Funcionalidades Core
Features Principais

📋 Cartões de crédito e faturas
📋 Sistema de orçamentos
📋 Metas financeiras
📋 Relatórios básicos
📋 Filtros avançados
📋 Drag-and-drop no dashboard
📋 Gráficos interativos

6.3 Fase 3: Experiência Aprimorada
Melhorias UX

📋 Compartilhamento familiar
📋 Importação de dados (CSV/OFX)
📋 Exportação de relatórios
📋 Transações recorrentes
📋 Dark mode
📋 PWA completo
📋 Tour guiado

6.4 Fase 4: Backend e Persistência
Integração Supabase

📅 Autenticação real
📅 Banco de dados PostgreSQL
📅 Row Level Security (RLS)
📅 Sincronização em tempo real
📅 Backup e recuperação

6.5 Backlog Futuro

Multi-moeda
Anexos em cloud
Notificações push
Integração bancária (quando disponível)
API pública
Aplicativo mobile nativo


7. Critérios de Aceitação
7.1 Definition of Done (DoD)
Para Features no Lovable

Componente funcional com dados mock
Responsivo em todas as telas
Acessível (navegação por teclado)
Estados de loading e erro tratados
Integrado ao fluxo da aplicação

7.2 Casos de Teste Principais
Dashboard

Exibe cards com dados corretos
Permite reorganização de layout
Salva preferências do usuário
Responsivo em mobile

Transações

Cria nova transação com sucesso
Edita transação existente
Filtra por período e categoria
Busca por texto funciona

Contas

Adiciona nova conta
Atualiza saldo
Exibe histórico de transações
Calcula saldo total correto

7.3 Tratamento de Erros
Validações

Campos obrigatórios validados
Formatos de data e valor corretos
Limites respeitados
Feedback claro ao usuário

Estados da Aplicação

Loading states em todas as operações
Empty states com CTAs
Error boundaries para erros críticos
Mensagens de erro amigáveis


8. Glossário
TermoDefiniçãoDashboardPainel principal com resumo financeiroTransactionMovimentação financeira (receita/despesa)Mock DataDados simulados para desenvolvimentoPWAProgressive Web App - App web instalávelLovablePlataforma de desenvolvimento visualshadcn/uiBiblioteca de componentes ReactRLSRow Level Security - Segurança em nível de linhaCRUDCreate, Read, Update, Delete - Operações básicasCTACall to Action - Chamada para açãoToastNotificação temporária na tela

9. Anexos
9.1 Documentação Técnica

[Schema do Banco de Dados (Prisma)]
[Guia de Componentes]
[Padrões de Código]

9.2 Stack Tecnológica
Frontend (Lovable)

React 18+
Vite
Tailwind CSS
shadcn/ui
React Router v6
React Hook Form
Recharts (gráficos)

Backend (Futuro)

Supabase
PostgreSQL
Edge Functions

Ferramentas

Lovable (desenvolvimento)
GitHub (versionamento)
Vercel (deploy)


Controle de Mudanças
DataVersãoAutorMudanças01/08/20251.1Time ProdutoVersão inicial05/08/20251.2Time ProdutoAnálise de referências07/08/20252.0Time ProdutoDocumento completo07/08/20252.1Time ProdutoAlinhamento com Lovable07/08/20252.2Time ProdutoVersão simplificada para MVP

Próximos Passos Imediatos
Sprint 1 - Fundação

 Configurar projeto no Lovable
 Criar layout base responsivo
 Implementar roteamento
 Estruturar dados mock
 Componentes de formulário base

Sprint 2 - Features Core

 CRUD de transações completo
 Dashboard com cards básicos
 Sistema de categorias
 Filtros e busca
 Gestão de contas

Sprint 3 - Melhorias UX

 Gráficos no dashboard
 Drag-and-drop de cards
 Estados de loading/empty
 Validações de formulário
 Toast notifications

Sprint 4 - Polish

 Dark mode
 PWA configuração
 Animações e transições
 Revisão de acessibilidade
 Deploy no Vercel


Este documento é confidencial e proprietário do Detetive Financeiro.


// This is your Prisma schema file for Detetive Financeiro
// Learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum SubscriptionTier {
  FREE
  PREMIUM
  BUSINESS
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
  TRIALING
  EXPIRED
}

enum TransactionType {
  INCOME      // Receita
  EXPENSE     // Despesa
  TRANSFER    // Transferência
}

enum RecurrenceType {
  NONE        // Sem recorrência
  DAILY       // Diária
  WEEKLY      // Semanal
  MONTHLY     // Mensal
  YEARLY      // Anual
  CUSTOM      // Personalizada
}

enum AccountType {
  CHECKING    // Conta Corrente
  SAVINGS     // Poupança
  CASH        // Dinheiro/Carteira
  PREPAID     // Pré-pago
  INVESTMENT  // Investimento (futuro)
  OTHER       // Outros
}

enum CardType {
  CREDIT      // Crédito
  DEBIT       // Débito
  CREDIT_DEBIT // Múltiplo
  PREPAID     // Pré-pago
  VIRTUAL     // Virtual
}

enum CardBrand {
  VISA
  MASTERCARD
  ELO
  AMEX
  HIPERCARD
  OTHER
}

enum BudgetPeriod {
  MONTHLY
  QUARTERLY
  YEARLY
}

enum GoalStatus {
  ACTIVE
  COMPLETED
  CANCELLED
  PAUSED
}

enum NotificationType {
  TRANSACTION_SHARED
  TRANSACTION_IMPORTED
  BILL_REMINDER
  BUDGET_ALERT
  GOAL_UPDATE
  SYSTEM_UPDATE
  SECURITY_ALERT
}

enum FamilyMemberStatus {
  ACTIVE
  INACTIVE
  PENDING
  BLOCKED
}

enum SplitType {
  EQUAL       // Divisão igual
  PERCENTAGE  // Por percentual
  FIXED       // Valores fixos
  CUSTOM      // Personalizado
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  emailVerified     DateTime?
  name              String?
  avatarUrl         String?
  phone             String?
  phoneVerified     DateTime?
  
  // Security
  passwordHash      String?
  twoFactorEnabled  Boolean   @default(false)
  twoFactorSecret   String?
  lastLoginAt       DateTime?
  lastLoginIp       String?
  failedAttempts    Int       @default(0)
  lockedUntil       DateTime?
  
  // Subscription
  subscriptionTier   SubscriptionTier    @default(FREE)
  subscriptionStatus SubscriptionStatus  @default(ACTIVE)
  subscriptionEndAt  DateTime?
  trialEndAt         DateTime?
  
  // Preferences
  currency          String    @default("BRL")
  timezone          String    @default("America/Sao_Paulo")
  locale            String    @default("pt-BR")
  theme             String    @default("light")
  
  // Metadata
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?
  
  // Relations
  accounts          Account[]
  cards             Card[]
  categories        Category[]
  transactions      Transaction[]
  budgets           Budget[]
  goals             Goal[]
  familyMembers     FamilyMember[]
  createdGroups     FamilyGroup[]      @relation("GroupCreator")
  sharedTransactions SharedTransaction[] @relation("SharedBy")
  importedTransactions ImportedTransaction[]
  notifications     Notification[]
  sessions          Session[]
  auditLogs         AuditLog[]
  dashboardWidgets  DashboardWidget[]
  
  @@index([email])
  @@index([subscriptionTier])
  @@map("users")
}

model Session {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  token         String   @unique
  userAgent     String?
  ipAddress     String?
  
  expiresAt     DateTime
  createdAt     DateTime @default(now())
  lastActivity  DateTime @default(now())
  
  @@index([userId])
  @@index([token])
  @@map("sessions")
}

// ============================================
// FINANCIAL ACCOUNTS
// ============================================

model Account {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  type          AccountType
  bankName      String?
  bankCode      String?
  agencyNumber  String?
  accountNumber String?
  color         String      @default("#2196F3")
  icon          String?
  
  // Balance
  currentBalance Decimal    @default(0) @db.Decimal(15, 2)
  initialBalance Decimal    @default(0) @db.Decimal(15, 2)
  
  // Open Finance
  openFinanceId     String?
  openFinanceToken  String?
  lastSyncAt        DateTime?
  syncEnabled       Boolean   @default(false)
  
  // Settings
  isActive      Boolean     @default(true)
  isDefault     Boolean     @default(false)
  includeInTotal Boolean    @default(true)
  
  // Metadata
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  deletedAt     DateTime?
  
  // Relations
  transactions      Transaction[]
  transfersFrom     Transaction[] @relation("TransferFrom")
  transfersTo       Transaction[] @relation("TransferTo")
  recurringTransactions RecurringTransaction[]
  
  @@unique([userId, name])
  @@index([userId])
  @@map("accounts")
}

// ============================================
// CREDIT CARDS
// ============================================

model Card {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  type          CardType
  brand         CardBrand
  lastDigits    String?   @db.VarChar(4)
  color         String    @default("#FF9800")
  
  // Limits and dates
  creditLimit   Decimal?  @db.Decimal(15, 2)
  availableLimit Decimal? @db.Decimal(15, 2)
  closingDay    Int?      // Dia do fechamento
  dueDay        Int?      // Dia do vencimento
  
  // Settings
  isActive      Boolean   @default(true)
  isDefault     Boolean   @default(false)
  isVirtual     Boolean   @default(false)
  parentCardId  String?   // Para cartões virtuais
  
  // Open Finance
  openFinanceId String?
  lastSyncAt    DateTime?
  
  // Metadata
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
  
  // Relations
  parentCard    Card?     @relation("VirtualCards", fields: [parentCardId], references: [id])
  virtualCards  Card[]    @relation("VirtualCards")
  transactions  Transaction[]
  bills         CardBill[]
  
  @@unique([userId, name])
  @@index([userId])
  @@map("cards")
}

model CardBill {
  id            String    @id @default(cuid())
  cardId        String
  card          Card      @relation(fields: [cardId], references: [id], onDelete: Cascade)
  
  referenceMonth String   // YYYY-MM
  closingDate   DateTime
  dueDate       DateTime
  
  totalAmount   Decimal   @db.Decimal(15, 2)
  paidAmount    Decimal   @default(0) @db.Decimal(15, 2)
  isPaid        Boolean   @default(false)
  paidAt        DateTime?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  
  @@unique([cardId, referenceMonth])
  @@index([cardId])
  @@index([referenceMonth])
  @@map("card_bills")
}

// ============================================
// CATEGORIES
// ============================================

model Category {
  id            String    @id @default(cuid())
  userId        String?   // Null for system categories
  user          User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  slug          String
  type          TransactionType
  icon          String?
  color         String    @default("#757575")
  
  parentId      String?
  parent        Category? @relation("SubCategories", fields: [parentId], references: [id])
  subCategories Category[] @relation("SubCategories")
  
  isSystem      Boolean   @default(false)
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  budgets       Budget[]
  recurringTransactions RecurringTransaction[]
  
  @@unique([userId, slug])
  @@index([userId])
  @@index([parentId])
  @@map("categories")
}

// ============================================
// TRANSACTIONS
// ============================================

model Transaction {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type          TransactionType
  amount        Decimal   @db.Decimal(15, 2)
  description   String
  notes         String?
  
  // Date
  date          DateTime  @db.Date
  paidAt        DateTime?
  
  // Relations
  accountId     String?
  account       Account?  @relation(fields: [accountId], references: [id])
  
  cardId        String?
  card          Card?     @relation(fields: [cardId], references: [id])
  
  cardBillId    String?
  cardBill      CardBill? @relation(fields: [cardBillId], references: [id])
  
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  
  // Transfer
  isTransfer    Boolean   @default(false)
  transferFromId String?
  transferFrom  Account?  @relation("TransferFrom", fields: [transferFromId], references: [id])
  transferToId  String?
  transferTo    Account?  @relation("TransferTo", fields: [transferToId], references: [id])
  
  // Recurrence
  isRecurring   Boolean   @default(false)
  recurringId   String?
  recurring     RecurringTransaction? @relation(fields: [recurringId], references: [id])
  
  // Installments
  isInstallment Boolean   @default(false)
  installmentNumber Int?
  installmentTotal Int?
  installmentGroupId String?
  
  // Location
  latitude      Float?
  longitude     Float?
  location      String?
  
  // AI
  aiCategorized Boolean   @default(false)
  aiConfidence  Float?    // 0-1 confidence score
  
  // Metadata
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?
  
  // Relations
  attachments   Attachment[]
  tags          Tag[]
  sharedTransaction SharedTransaction?
  importedFrom  ImportedTransaction[]
  
  @@index([userId])
  @@index([date])
  @@index([accountId])
  @@index([cardId])
  @@index([categoryId])
  @@index([recurringId])
  @@index([installmentGroupId])
  @@map("transactions")
}

model RecurringTransaction {
  id            String    @id @default(cuid())
  userId        String
  
  type          TransactionType
  amount        Decimal   @db.Decimal(15, 2)
  description   String
  
  accountId     String?
  account       Account?  @relation(fields: [accountId], references: [id])
  
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  
  // Recurrence settings
  recurrenceType RecurrenceType
  recurrenceInterval Int? // For CUSTOM type
  
  startDate     DateTime
  endDate       DateTime?
  nextDate      DateTime?
  
  isActive      Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  transactions  Transaction[]
  
  @@index([userId])
  @@index([nextDate])
  @@map("recurring_transactions")
}

// ============================================
// FAMILY SHARING
// ============================================

model FamilyGroup {
  id            String    @id @default(cuid())
  name          String
  description   String?
  inviteCode    String    @unique @default(cuid())
  
  createdById   String
  createdBy     User      @relation("GroupCreator", fields: [createdById], references: [id])
  
  maxMembers    Int       @default(10)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  members       FamilyMember[]
  sharedTransactions SharedTransaction[]
  
  @@index([inviteCode])
  @@map("family_groups")
}

model FamilyMember {
  id            String    @id @default(cuid())
  
  groupId       String
  group         FamilyGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  status        FamilyMemberStatus @default(ACTIVE)
  
  // Settings
  autoImport    Boolean   @default(false)
  notificationsEnabled Boolean @default(true)
  
  joinedAt      DateTime  @default(now())
  leftAt        DateTime?
  
  @@unique([groupId, userId])
  @@index([groupId])
  @@index([userId])
  @@map("family_members")
}

model SharedTransaction {
  id            String    @id @default(cuid())
  
  transactionId String    @unique
  transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  
  sharedById    String
  sharedBy      User      @relation("SharedBy", fields: [sharedById], references: [id])
  
  groupId       String
  group         FamilyGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  
  // Split suggestion
  splitType     SplitType @default(EQUAL)
  splitData     Json?     // Stores split configuration
  
  sharedAt      DateTime  @default(now())
  
  imports       ImportedTransaction[]
  
  @@index([groupId])
  @@index([sharedById])
  @@map("shared_transactions")
}

model ImportedTransaction {
  id            String    @id @default(cuid())
  
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  sharedTransactionId String
  sharedTransaction SharedTransaction @relation(fields: [sharedTransactionId], references: [id], onDelete: Cascade)
  
  importedTransactionId String
  importedTransaction Transaction @relation(fields: [importedTransactionId], references: [id], onDelete: Cascade)
  
  importedAmount Decimal  @db.Decimal(15, 2)
  
  importedAt    DateTime  @default(now())
  
  @@unique([userId, sharedTransactionId])
  @@index([userId])
  @@index([sharedTransactionId])
  @@map("imported_transactions")
}

// ============================================
// BUDGETS & GOALS
// ============================================

model Budget {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  period        BudgetPeriod
  
  categoryId    String?
  category      Category? @relation(fields: [categoryId], references: [id])
  
  amount        Decimal   @db.Decimal(15, 2)
  spentAmount   Decimal   @default(0) @db.Decimal(15, 2)
  
  startDate     DateTime
  endDate       DateTime
  
  // Alert thresholds
  alertAt50     Boolean   @default(true)
  alertAt75     Boolean   @default(true)
  alertAt90     Boolean   @default(true)
  alertAt100    Boolean   @default(true)
  
  isActive      Boolean   @default(true)
  rollover      Boolean   @default(false) // Carry over unused amount
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@unique([userId, name])
  @@index([userId])
  @@index([categoryId])
  @@map("budgets")
}

model Goal {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name          String
  description   String?
  icon          String?
  color         String    @default("#4CAF50")
  
  targetAmount  Decimal   @db.Decimal(15, 2)
  currentAmount Decimal   @default(0) @db.Decimal(15, 2)
  
  targetDate    DateTime
  
  status        GoalStatus @default(ACTIVE)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  completedAt   DateTime?
  
  @@index([userId])
  @@map("goals")
}

// ============================================
// ATTACHMENTS & TAGS
// ============================================

model Attachment {
  id            String    @id @default(cuid())
  
  transactionId String
  transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  
  fileName      String
  fileUrl       String
  fileSize      Int
  mimeType      String
  
  uploadedAt    DateTime  @default(now())
  
  @@index([transactionId])
  @@map("attachments")
}

model Tag {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  
  transactions  Transaction[]
  
  createdAt     DateTime  @default(now())
  
  @@map("tags")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type          NotificationType
  title         String
  message       String
  data          Json?
  
  isRead        Boolean   @default(false)
  readAt        DateTime?
  
  createdAt     DateTime  @default(now())
  
  @@index([userId])
  @@index([isRead])
  @@map("notifications")
}

// ============================================
// DASHBOARD
// ============================================

model DashboardWidget {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  widgetType    String    // 'balance', 'cashflow', 'expenses', 'goals', etc
  position      Int
  config        Json?     // Widget-specific configuration
  
  isVisible     Boolean   @default(true)
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@unique([userId, position])
  @@index([userId])
  @@map("dashboard_widgets")
}

// ============================================
// AUDIT & LOGS
// ============================================

model AuditLog {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  action        String    // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc
  entityType    String    // 'transaction', 'account', etc
  entityId      String?
  
  oldData       Json?
  newData       Json?
  
  ipAddress     String?
  userAgent     String?
  
  createdAt     DateTime  @default(now())
  
  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

// ============================================
// AI & INSIGHTS
// ============================================

model InsightHistory {
  id            String    @id @default(cuid())
  userId        String
  
  insightType   String    // 'spending_pattern', 'saving_opportunity', etc
  title         String
  description   String
  data          Json
  
  confidence    Float     // 0-1 confidence score
  isActionable  Boolean   @default(true)
  wasUseful     Boolean?  // User feedback
  
  createdAt     DateTime  @default(now())
  expiresAt     DateTime
  
  @@index([userId])
  @@index([createdAt])
  @@map("insight_history")
}

model CategoryRule {
  id            String    @id @default(cuid())
  userId        String?   // Null for system rules
  
  pattern       String    // Regex or keyword pattern
  categoryId    String
  
  priority      Int       @default(0)
  isActive      Boolean   @default(true)
  
  matchCount    Int       @default(0)
  accuracy      Float?    // Success rate
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([userId])
  @@index([priority])
  @@map("category_rules")
}