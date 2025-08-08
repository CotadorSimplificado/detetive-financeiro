# Plano de Implementação do Backend Real com PostgreSQL

## Visão Geral
Este documento detalha o plano para migrar o sistema de dados mock para um backend real com PostgreSQL, mantendo a arquitetura atual e aproveitando os pacotes já instalados.

## Status Atual

### Tecnologias Disponíveis
- **Backend**: Express.js com TypeScript
- **ORM**: Drizzle ORM (já configurado)
- **Banco de Dados**: PostgreSQL (já provisionado)
- **Validação**: Zod com drizzle-zod
- **Sessões**: express-session com connect-pg-simple
- **Frontend**: React com TanStack Query

### Pacotes Já Instalados
- `drizzle-orm` e `drizzle-kit` - ORM e migrações
- `@neondatabase/serverless` - Driver PostgreSQL
- `express-session` - Gerenciamento de sessões
- `connect-pg-simple` - Store PostgreSQL para sessões
- `passport` e `passport-local` - Autenticação
- `@tanstack/react-query` - Cache e sincronização de dados

### Estrutura Atual
```
/
├── client/           # Frontend React
├── server/          # Backend Express
│   ├── index.ts     # Entry point
│   ├── routes.ts    # Rotas API
│   ├── storage.ts   # Interface de storage (atualmente mock)
│   └── db.ts        # Configuração do banco (pronto mas não usado)
├── shared/          # Código compartilhado
│   └── schema.ts    # Schemas Drizzle (a criar)
└── package.json     # Dependências
```

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

## Cronograma Total: 10-14 dias

### Semana 1
- **Dias 1-2**: Schema do banco de dados
- **Dias 3-5**: Camada de storage e rotas API

### Semana 2
- **Dias 6-8**: Migração do frontend
- **Dias 9-11**: Autenticação com Replit Auth
- **Dias 12-14**: Migrações, testes e deploy

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

## Próximos Passos Após Implementação

1. **Monitoramento**
   - Configurar logs estruturados
   - Implementar métricas de performance
   - Alertas para erros

2. **Features Avançadas**
   - Importação de extratos bancários
   - Exportação de relatórios
   - Notificações push
   - Dashboard analytics avançado

3. **Otimizações**
   - Cache Redis para sessões
   - Workers para tarefas pesadas
   - CDN para assets estáticos

---

**Documento criado em**: 10 de Janeiro de 2025  
**Autor**: Sistema Detetive Financeiro  
**Status**: Pronto para implementação