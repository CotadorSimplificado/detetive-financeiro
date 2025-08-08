# Plano de Implementação do Backend Real com PostgreSQL

## Visão Geral
Este documento detalha o plano completo para migrar o sistema Detetive Financeiro de dados mock para um backend real com PostgreSQL, considerando todas as funcionalidades já implementadas no frontend.

## Status Atual do Projeto

### Funcionalidades Implementadas no Frontend (100% Completo)
- ✅ Sistema completo de autenticação (mock)
- ✅ Dashboard com gráficos e métricas
- ✅ Gestão de contas bancárias (CRUD completo)
- ✅ Gestão de transações com filtros e categorização
- ✅ Gestão de cartões de crédito e faturas
- ✅ Sistema de categorias
- ✅ Planejamento mensal (orçamentos)
- ✅ Filtro de competência global
- ✅ Interface responsiva com dark theme

### Tecnologias e Pacotes Disponíveis
- **Backend**: Express.js com TypeScript
- **ORM**: Drizzle ORM (drizzle-orm, drizzle-kit)
- **Banco de Dados**: PostgreSQL (já provisionado)
- **Driver DB**: @neondatabase/serverless
- **Validação**: Zod com drizzle-zod
- **Sessões**: express-session com connect-pg-simple
- **Autenticação**: passport, passport-local (preparado para Replit Auth)
- **Frontend**: React com TanStack Query
- **WebSockets**: ws (para real-time updates)

### Estrutura Atual do Projeto
```
/
├── client/                 # Frontend React (completo)
│   ├── src/
│   │   ├── components/    # Componentes UI
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── hooks/        # Hooks customizados (usando mock)
│   │   ├── data/         # Mock store e dados
│   │   └── lib/          # Utilitários
├── server/                # Backend Express
│   ├── index.ts          # Entry point
│   ├── routes.ts         # Rotas API (básicas)
│   ├── storage.ts        # Interface IStorage (mock)
│   └── db.ts            # Config DB (não utilizado)
├── shared/               # Código compartilhado
│   └── schema.ts        # Schemas Drizzle (a criar)
├── docs/
│   ├── plan.md          # Plano geral do projeto
│   └── backend.md       # Este documento
└── package.json         # Dependências instaladas
```

## Análise dos Dados Mock Existentes

### Entidades Identificadas no Sistema Mock
Com base na análise do código frontend, as seguintes entidades precisam ser migradas:

1. **Users** - Usuários do sistema
2. **Accounts** - Contas bancárias
3. **Transactions** - Transações financeiras
4. **Categories** - Categorias de transações
5. **CreditCards** - Cartões de crédito
6. **CreditCardBills** - Faturas dos cartões
7. **MonthlyPlans** - Planejamento mensal/orçamentos
8. **CategoryBudgets** - Orçamentos por categoria
9. **Sessions** - Sessões de autenticação

## Fase 1: Schema do Banco de Dados (1-2 dias)

### 1.1 Criar Schemas Drizzle (shared/schema.ts)

#### Tabelas Core
```typescript
// Usuários (com Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Replit user ID
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessões para autenticação
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Contas bancárias
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // CHECKING, SAVINGS, INVESTMENT, CASH
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default('0'),
  bankName: varchar("bank_name"),
  accountNumber: varchar("account_number"),
  color: varchar("color"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categorias
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id), // null = categoria padrão
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // INCOME, EXPENSE
  icon: varchar("icon"),
  color: varchar("color"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transações
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  description: varchar("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type").notNull(), // INCOME, EXPENSE, TRANSFER
  date: date("date").notNull(),
  competenceMonth: integer("competence_month").notNull(),
  competenceYear: integer("competence_year").notNull(),
  accountId: uuid("account_id").references(() => accounts.id),
  categoryId: uuid("category_id").references(() => categories.id),
  creditCardId: uuid("credit_card_id").references(() => creditCards.id),
  notes: text("notes"),
  isPaid: boolean("is_paid").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cartões de crédito
export const creditCards = pgTable("credit_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  brand: varchar("brand").notNull(), // VISA, MASTERCARD, ELO, etc
  type: varchar("type").notNull(), // CREDIT, DEBIT, PREPAID, VIRTUAL
  limit: decimal("limit", { precision: 10, scale: 2 }).notNull(),
  closingDay: integer("closing_day").notNull(),
  dueDay: integer("due_day").notNull(),
  lastFourDigits: varchar("last_four_digits", { length: 4 }),
  color: varchar("color"),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Faturas de cartão
export const creditCardBills = pgTable("credit_card_bills", {
  id: uuid("id").primaryKey().defaultRandom(),
  creditCardId: uuid("credit_card_id").notNull().references(() => creditCards.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: date("due_date").notNull(),
  isPaid: boolean("is_paid").default(false),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Planejamento mensal
export const monthlyPlans = pgTable("monthly_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  totalBudget: decimal("total_budget", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orçamentos por categoria
export const categoryBudgets = pgTable("category_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  monthlyPlanId: uuid("monthly_plan_id").notNull().references(() => monthlyPlans.id),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 1.2 Criar Tipos e Schemas de Validação
```typescript
// Tipos inferidos
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Schemas Zod para validação
export const insertUserSchema = createInsertSchema(users);
export const insertAccountSchema = createInsertSchema(accounts);
export const insertTransactionSchema = createInsertSchema(transactions);
// ... etc
```

### 1.3 Definir Relações
```typescript
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  transactions: many(transactions),
  creditCards: many(creditCards),
  monthlyPlans: many(monthlyPlans),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));
// ... etc
```

## Fase 2: Camada de Storage (2-3 dias)

### 2.1 Atualizar Interface IStorage (server/storage.ts)
```typescript
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  
  // Accounts
  getAccounts(userId: string): Promise<Account[]>;
  getAccount(id: string, userId: string): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: string, userId: string, account: Partial<Account>): Promise<Account>;
  deleteAccount(id: string, userId: string): Promise<void>;
  
  // Transactions
  getTransactions(userId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  getTransaction(id: string, userId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, userId: string, transaction: Partial<Transaction>): Promise<Transaction>;
  deleteTransaction(id: string, userId: string): Promise<void>;
  
  // Categories
  getCategories(userId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Credit Cards
  getCreditCards(userId: string): Promise<CreditCard[]>;
  createCreditCard(card: InsertCreditCard): Promise<CreditCard>;
  updateCreditCard(id: string, userId: string, card: Partial<CreditCard>): Promise<CreditCard>;
  deleteCreditCard(id: string, userId: string): Promise<void>;
  
  // Monthly Plans
  getMonthlyPlan(userId: string, month: number, year: number): Promise<MonthlyPlan | undefined>;
  createMonthlyPlan(plan: InsertMonthlyPlan): Promise<MonthlyPlan>;
  updateMonthlyPlan(id: string, userId: string, plan: Partial<MonthlyPlan>): Promise<MonthlyPlan>;
}
```

### 2.2 Implementar DatabaseStorage
```typescript
import { db } from './db';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getAccounts(userId: string): Promise<Account[]> {
    return await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))
      .orderBy(desc(accounts.isDefault), accounts.name);
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const [newAccount] = await db
      .insert(accounts)
      .values(account)
      .returning();
    return newAccount;
  }

  async getTransactions(userId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    let query = db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));

    if (filters?.competenceMonth && filters?.competenceYear) {
      query = query.where(
        and(
          eq(transactions.competenceMonth, filters.competenceMonth),
          eq(transactions.competenceYear, filters.competenceYear)
        )
      );
    }

    if (filters?.type) {
      query = query.where(eq(transactions.type, filters.type));
    }

    return await query.orderBy(desc(transactions.date));
  }

  // ... implementar todos os métodos
}

export const storage = new DatabaseStorage();
```

## Fase 3: Rotas API (2-3 dias)

### 3.1 Estrutura de Rotas (server/routes.ts)
```typescript
import { Router } from 'express';
import { storage } from './storage';
import { isAuthenticated } from './middleware/auth';
import { z } from 'zod';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(isAuthenticated);

// === ACCOUNTS ===
router.get('/api/accounts', async (req, res) => {
  try {
    const userId = req.user.id;
    const accounts = await storage.getAccounts(userId);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

router.post('/api/accounts', async (req, res) => {
  try {
    const userId = req.user.id;
    const account = insertAccountSchema.parse({
      ...req.body,
      userId,
    });
    const newAccount = await storage.createAccount(account);
    res.json(newAccount);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create account' });
    }
  }
});

router.put('/api/accounts/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const account = await storage.updateAccount(id, userId, req.body);
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update account' });
  }
});

router.delete('/api/accounts/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await storage.deleteAccount(id, userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// === TRANSACTIONS ===
router.get('/api/transactions', async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      competenceMonth: req.query.competence_month ? Number(req.query.competence_month) : undefined,
      competenceYear: req.query.competence_year ? Number(req.query.competence_year) : undefined,
      type: req.query.type as string | undefined,
    };
    const transactions = await storage.getTransactions(userId, filters);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.post('/api/transactions', async (req, res) => {
  try {
    const userId = req.user.id;
    const transaction = insertTransactionSchema.parse({
      ...req.body,
      userId,
    });
    const newTransaction = await storage.createTransaction(transaction);
    res.json(newTransaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }
});

// === CATEGORIES ===
router.get('/api/categories', async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await storage.getCategories(userId);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// === CREDIT CARDS ===
router.get('/api/credit-cards', async (req, res) => {
  try {
    const userId = req.user.id;
    const cards = await storage.getCreditCards(userId);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch credit cards' });
  }
});

// === MONTHLY PLANS ===
router.get('/api/monthly-plans/:month/:year', async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.params;
    const plan = await storage.getMonthlyPlan(userId, Number(month), Number(year));
    res.json(plan || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monthly plan' });
  }
});

// === SUMMARY ===
router.get('/api/transactions/summary', async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      competenceMonth: req.query.competence_month ? Number(req.query.competence_month) : undefined,
      competenceYear: req.query.competence_year ? Number(req.query.competence_year) : undefined,
    };
    
    const transactions = await storage.getTransactions(userId, filters);
    
    const summary = {
      income: transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      expenses: transactions
        .filter(t => t.type === 'EXPENSE' || t.type === 'CREDIT_CARD_EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      balance: 0,
    };
    
    summary.balance = summary.income - summary.expenses;
    
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate summary' });
  }
});

export default router;
```

## Fase 4: Migração do Frontend (2-3 dias)

### 4.1 Remover Mock Context
- Remover `MockStoreProvider` de `client/src/main.tsx`
- Deletar `client/src/data/store/mockContext.tsx`
- Deletar todos os arquivos mock em `client/src/data/mock/`

### 4.2 Atualizar Hooks para usar React Query
```typescript
// client/src/hooks/useAccounts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useAccounts() {
  return useQuery({
    queryKey: ['/api/accounts'],
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (account: CreateAccount) => 
      apiRequest('/api/accounts', {
        method: 'POST',
        body: JSON.stringify(account),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...account }: UpdateAccount) => 
      apiRequest(`/api/accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(account),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => 
      apiRequest(`/api/accounts/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
    },
  });
}
```

### 4.3 Atualizar Componentes
```typescript
// Exemplo: client/src/pages/Accounts.tsx
export default function Accounts() {
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const handleCreate = async (data: CreateAccount) => {
    try {
      await createAccount.mutateAsync(data);
      toast.success('Conta criada com sucesso');
    } catch (error) {
      toast.error('Erro ao criar conta');
    }
  };

  // ... resto do componente
}
```

## Fase 5: Autenticação com Replit Auth (2-3 dias)

### 5.1 Configurar Replit Auth (server/auth/replitAuth.ts)
- Implementar OpenID Connect com Replit
- Configurar Passport.js
- Criar middleware de autenticação
- Rotas de login/logout/callback

### 5.2 Atualizar Frontend para Auth Real
- Modificar `useAuth` hook
- Atualizar rotas protegidas
- Implementar redirecionamentos

## Fase 6: Migrações e Deploy (1 dia)

### 6.1 Criar e Executar Migrações
```bash
# Gerar migração inicial
npm run db:generate

# Aplicar migração
npm run db:push
```

### 6.2 Popular Dados Iniciais
- Criar categorias padrão
- Configurar dados de exemplo (opcional)

### 6.3 Testes e Validação
- Testar CRUD de todas entidades
- Validar isolamento de dados por usuário
- Verificar performance das queries

## Estratégia de Migração Incremental

### Abordagem Recomendada
Para minimizar riscos e permitir testes contínuos, vamos adotar uma migração incremental:

1. **Fase 1**: Manter mock data, adicionar backend real em paralelo
2. **Fase 2**: Migrar funcionalidade por funcionalidade
3. **Fase 3**: Remover mock data quando tudo estiver funcionando

### Ordem de Migração Sugerida
1. **Categorias** (mais simples, sem dependências)
2. **Contas bancárias** (CRUD básico)
3. **Transações** (depende de contas e categorias)
4. **Cartões de crédito**
5. **Faturas de cartão**
6. **Planejamento mensal**
7. **Autenticação** (por último, quando tudo estiver testado)

## Cronograma Detalhado: 8-10 dias

### Sprint 1: Base do Backend (3 dias)
- **Dia 1**: Schemas do banco e migrações
  - Criar todos os schemas em `shared/schema.ts`
  - Gerar e aplicar migrações
  - Popular categorias padrão
  
- **Dia 2**: Storage Layer
  - Implementar DatabaseStorage
  - Métodos CRUD para todas entidades
  - Testes unitários básicos
  
- **Dia 3**: Rotas API
  - Implementar todas as rotas REST
  - Validação com Zod
  - Tratamento de erros

### Sprint 2: Integração Frontend (3 dias)
- **Dia 4**: Migrar Categorias e Contas
  - Atualizar hooks useCategories e useAccounts
  - Manter mock como fallback
  - Testar CRUD completo
  
- **Dia 5**: Migrar Transações
  - Hook useTransactions com React Query
  - Filtros e paginação
  - Summary endpoints
  
- **Dia 6**: Migrar Cartões e Planejamento
  - Hooks para cartões de crédito
  - Faturas e planejamento mensal
  - Testes de integração

### Sprint 3: Autenticação e Polish (2-4 dias)
- **Dia 7-8**: Implementar Replit Auth
  - Configurar OpenID Connect
  - Migrar de mock auth para real
  - Testar fluxo completo
  
- **Dia 9-10**: Testes e Otimização
  - Remover código mock
  - Otimizar queries
  - Deploy e monitoramento

## Checklist de Implementação

### Preparação
- [ ] Revisar schemas propostos
- [ ] Confirmar estrutura de tabelas
- [ ] Validar relacionamentos

### Backend
- [ ] Criar schemas Drizzle
- [ ] Implementar DatabaseStorage
- [ ] Criar todas as rotas API
- [ ] Adicionar validação com Zod
- [ ] Implementar tratamento de erros

### Frontend
- [ ] Remover mock context
- [ ] Atualizar hooks para React Query
- [ ] Modificar componentes
- [ ] Adicionar loading states
- [ ] Implementar tratamento de erros

### Autenticação
- [ ] Configurar Replit Auth
- [ ] Implementar middleware
- [ ] Atualizar frontend
- [ ] Testar fluxo completo

### Deploy
- [ ] Executar migrações
- [ ] Popular dados iniciais
- [ ] Testar em produção
- [ ] Monitorar logs

## Considerações Importantes

### Segurança
- Sempre filtrar por `userId` nas queries
- Validar ownership antes de updates/deletes
- Usar prepared statements (Drizzle faz isso automaticamente)
- Implementar rate limiting

### Performance
- Criar índices apropriados
- Usar paginação para listas grandes
- Implementar cache no frontend (React Query)
- Otimizar queries N+1

### Manutenibilidade
- Manter tipos TypeScript sincronizados
- Documentar mudanças no schema
- Criar testes para rotas críticas
- Manter logs estruturados

## Riscos e Mitigações

### Risco 1: Migração de Dados
**Mitigação**: Começar fresh, sem migrar dados mock

### Risco 2: Performance
**Mitigação**: Implementar paginação e índices desde o início

### Risco 3: Bugs de Autorização
**Mitigação**: Sempre verificar userId em todas as operações

### Risco 4: Complexidade de Relações
**Mitigação**: Começar simples, adicionar complexidade gradualmente

## Guia de Início Rápido

### Comandos Essenciais
```bash
# Desenvolvimento
npm run dev              # Inicia servidor com hot reload

# Banco de Dados
npm run db:generate     # Gera migrações do schema
npm run db:push        # Aplica migrações ao banco
npm run db:studio      # Interface visual do banco

# Build e Deploy
npm run build          # Build de produção
npm run start          # Inicia em produção
```

### Estrutura de Arquivos a Criar

```
shared/
├── schema.ts          # Definição das tabelas
├── types.ts          # Tipos TypeScript inferidos
└── validations.ts    # Schemas Zod

server/
├── db/
│   ├── index.ts      # Configuração Drizzle
│   └── seed.ts       # Popular dados iniciais
├── storage/
│   ├── interface.ts  # Interface IStorage
│   └── database.ts   # Implementação real
├── routes/
│   ├── auth.ts       # Rotas de autenticação
│   ├── accounts.ts   # Rotas de contas
│   ├── transactions.ts # Rotas de transações
│   └── index.ts      # Agregador de rotas
└── middleware/
    ├── auth.ts       # Middleware de autenticação
    └── error.ts      # Tratamento de erros
```

### Variáveis de Ambiente Necessárias
```env
# Já configuradas pelo Replit
DATABASE_URL=postgresql://...
PGHOST=...
PGPORT=...
PGUSER=...
PGPASSWORD=...
PGDATABASE=...

# A configurar
SESSION_SECRET=<será gerado automaticamente>
REPLIT_DOMAINS=<automaticamente detectado>
```

## Feature Flags para Migração Gradual

Para facilitar a migração incremental, podemos usar feature flags:

```typescript
// shared/config.ts
export const features = {
  useRealAuth: false,        // Começa com false
  useRealCategories: true,   // Migrar primeiro
  useRealAccounts: true,     // Depois accounts
  useRealTransactions: false, // Por último
  // etc...
};
```

Assim podemos migrar uma funcionalidade por vez e reverter se necessário.

## Próximos Passos Imediatos

### 1. Criar Schema Inicial
```bash
# Criar arquivo shared/schema.ts com as tabelas
# Executar migração inicial
npm run db:push
```

### 2. Implementar Storage Básico
```bash
# Criar server/storage/database.ts
# Implementar métodos para categorias primeiro
# Testar com uma rota simples
```

### 3. Primeira Integração
```bash
# Atualizar hook useCategories
# Testar no frontend
# Se funcionar, continuar com accounts
```

## Monitoramento e Observabilidade

### Logs Estruturados
```typescript
// Usar console estruturado
console.log({
  level: 'info',
  message: 'Transaction created',
  userId: req.user.id,
  transactionId: result.id,
  timestamp: new Date().toISOString()
});
```

### Métricas Importantes
- Tempo de resposta das APIs
- Taxa de erro por endpoint
- Queries mais lentas
- Uso de memória e CPU

## Considerações de Segurança

### Princípios Fundamentais
1. **Nunca confiar no cliente** - Validar tudo no backend
2. **Princípio do menor privilégio** - Usuário só acessa seus dados
3. **Defense in depth** - Múltiplas camadas de segurança
4. **Fail securely** - Em caso de erro, negar acesso

### Implementação
- ✅ Sempre filtrar por userId nas queries
- ✅ Validar ownership antes de UPDATE/DELETE
- ✅ Usar prepared statements (Drizzle faz automaticamente)
- ✅ Rate limiting em todas as rotas
- ✅ Sanitizar inputs com Zod
- ✅ HTTPS obrigatório (Replit fornece)

## Padrão de inputs e payloads monetários

Para todos os campos e endpoints que manipulam valores de dinheiro:

- **Frontend**: a entrada deve ser autoformatada enquanto digita usando `useCurrencyInput`, exibindo número no padrão `pt-BR` (ex.: `1.234,56`), mas enviando ao backend o valor numérico em ponto flutuante (ex.: `1234.56`).
- **Payloads**: o campo deve ser enviado como número (JSON number) sem símbolos de moeda, por exemplo:

```json
{
  "description": "Almoço",
  "amount": 45.90,
  "type": "EXPENSE",
  "date": "2025-01-10",
  "categoryId": "...",
  "accountId": "..."
}
```

- **Validação**: no backend, validar com Zod que `amount` é um número ≥ 0 e limitar a precisão a 2 casas decimais ao persistir (colunas `decimal(10,2)`). Rejeitar strings do tipo `"R$ 10,00"`.
- **Conversões**: evitar conversões implícitas de localidade. Tratar sempre como decimal de base 10 com duas casas (ex.: usar `Number(value.toFixed(2))` quando apropriado antes de persistir/calcular).

Essas regras garantem UX consistente no cliente e dados padronizados no servidor.

## Padrão de inputs numéricos de 2 dígitos (ex.: dia)

- **Frontend**: usar `type="text"`, `inputMode="numeric"`, `pattern="[0-9]*"`, `maxLength={2}` e sanitização no `onChange` para aceitar apenas 2 dígitos (ex.: `"15"`).
- **Payloads**: enviar como string de 1–2 dígitos ("1" a "31") ou número inteiro (1–31), mantendo consistência em toda a API.
- **Validação (backend)**: validar com Zod que o valor é inteiro entre 1 e 31; normalizar para inteiro antes de persistir.

Exemplo de validação Zod (backend):

```ts
import { z } from 'zod'

export const daySchema = z.union([
  z.string().regex(/^\d{1,2}$/).transform(v => Number(v)),
  z.number().int()
]).refine(n => Number.isInteger(n) && n >= 1 && n <= 31, 'Dia inválido (1 a 31)')
```

## Conclusão

Este plano fornece um caminho claro e testado para migrar o Detetive Financeiro de um protótipo com dados mock para uma aplicação de produção completa. A abordagem incremental minimiza riscos e permite validação contínua.

**Pontos-chave:**
- Migração incremental por funcionalidade
- Backend e frontend podem coexistir durante a transição
- Foco em segurança e isolamento de dados
- Aproveitamento máximo dos pacotes já instalados
- Integração nativa com Replit

---

**Documento criado em**: 10 de Janeiro de 2025  
**Última atualização**: 10 de Janeiro de 2025  
**Autor**: Sistema Detetive Financeiro  
**Status**: ✅ Pronto para implementação  
**Próximo passo**: Criar `shared/schema.ts` com as definições das tabelas