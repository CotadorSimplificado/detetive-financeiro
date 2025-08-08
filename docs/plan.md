# Plano de Desenvolvimento - Detetive Financeiro

## Visão Geral
Aplicação de gestão financeira pessoal com interface moderna e intuitiva, desenvolvida como protótipo frontend para posterior integração com backend real.

## Status do Projeto
- **Fase**: Protótipo Frontend Completo
- **Stack**: React + TypeScript + Vite + TailwindCSS + shadcn/ui
- **Sistema de Dados**: Mock Store (Context API) preparado para migração para backend real
- **Ambiente**: Replit

## Funcionalidades Implementadas ✅

### 1. Autenticação e Autorização ✅
- [x] Tela de login/cadastro
- [x] Proteção de rotas autenticadas
- [x] Context de usuário global
- [x] Simulação de autenticação com mock data
- [x] Persistência de sessão

### 2. Dashboard Principal ✅
- [x] Visão geral financeira
- [x] Cards de resumo (saldo, receitas, despesas)
- [x] Gráficos interativos (Donut, Line, Bar charts)
- [x] Metas de economia com progress bars
- [x] Navegação principal via sidebar
- [x] Layout responsivo mobile/desktop

### 3. Gestão de Contas ✅
- [x] Listagem de contas bancárias
- [x] Criação de novas contas
- [x] Edição de contas existentes
- [x] Exclusão de contas
- [x] Tipos de conta (Corrente, Poupança, Investimento, Dinheiro)
- [x] Saldos e balanços
- [x] Filtros por tipo e busca por nome
- [x] Indicador de conta padrão
- [x] Cores personalizadas por conta

### 4. Gestão de Transações ✅
- [x] Listagem de transações
- [x] Modal para criar transações (receita/despesa/transferência)
- [x] Formulários específicos por tipo de transação
- [x] Filtro por competência (mês/ano)
- [x] Filtro por tipo de transação
- [x] Busca por descrição
- [x] Integração com contas
- [x] Categorização de transações
- [x] Suporte a transações de cartão de crédito
- [x] Cards de resumo (receitas, despesas, saldo)

### 5. Gestão de Cartões de Crédito ✅
- [x] Listagem de cartões
- [x] Criação de novos cartões
- [x] Edição de cartões existentes
- [x] Exclusão de cartões
- [x] Tipos de cartão (Crédito, Débito, Pré-pago, Virtual)
- [x] Bandeiras (Visa, Mastercard, Elo, etc.)
- [x] Limites e disponível
- [x] Dias de fechamento e vencimento
- [x] Faturas de cartão de crédito
- [x] Indicador de cartão padrão
- [x] Cards de resumo (total de cartões, limite total, uso)

### 6. Categorias ✅
- [x] Sistema de categorias pré-definidas
- [x] Hook useCategories para gestão
- [x] Categorias por tipo (receita/despesa)
- [x] Ícones e cores personalizadas

### 7. Interface de Usuário ✅
- [x] Dark theme completo
- [x] Componentes reutilizáveis (shadcn/ui)
- [x] Toasts de notificação (sonner)
- [x] Skeleton loaders
- [x] Estados de loading
- [x] Formulários com validação (React Hook Form + Zod)
- [x] Modais e diálogos
- [x] Tooltips informativos
- [x] Responsividade mobile-first

### 8. Sistema de Mock Data ✅
- [x] Context API para gerenciamento de estado
- [x] Hooks customizados para cada entidade
- [x] CRUD completo para todas entidades
- [x] Relacionamentos entre entidades
- [x] Validação de dados com Zod
- [x] Simulação de delays de rede
- [x] Tratamento de erros

### 9. Utilitários ✅
- [x] Formatação de moeda (BRL)
- [x] Formatação de datas em português
- [x] Input de moeda com máscara
- [x] Navegação por teclado (competência)
- [x] Hooks de transição de página

### 10. Planejamento Mensal (Orçamentos) ✅
- [x] Criação de planejamento mensal por categoria
- [x] Hook useMonthlyPlan para gestão
- [x] Comparação de gastos reais vs planejado
- [x] Indicadores de status (Safe, Warning, Danger, Exceeded)
- [x] Cópia de planejamento do mês anterior
- [x] Edição de orçamento existente
- [x] Cards de resumo do planejamento

### 11. Filtro de Competência Global ✅
- [x] Hook useCompetenceFilter centralizado
- [x] Navegação por mês/ano
- [x] Navegação por teclado (Cmd+Setas)
- [x] Sincronização entre páginas
- [x] Estado persistente de competência

## Funcionalidades Parcialmente Implementadas 🚧

### 1. Faturas de Cartão de Crédito 🚧
- [x] Componente CreditCardBillItem
- [x] Hook useCreditCardBills
- [ ] Tela de detalhes da fatura
- [ ] Pagamento de fatura
- [ ] Parcelamento de compras

### 2. Relatórios 🚧
- [x] Gráficos no dashboard
- [x] Página básica de relatórios
- [ ] Exportação de dados
- [ ] Filtros avançados complexos

## Funcionalidades Não Implementadas ❌

### 2. Metas Financeiras ❌
- [ ] Criação de metas
- [ ] Acompanhamento de progresso
- [ ] Planos de economia

### 3. Investimentos ❌
- [ ] Carteira de investimentos
- [ ] Rentabilidade
- [ ] Integração com corretoras

### 4. Importação/Exportação ❌
- [ ] Importar extratos bancários
- [ ] Exportar para Excel/PDF
- [ ] Backup de dados

### 5. Notificações ❌
- [ ] Lembretes de vencimento
- [ ] Alertas de gastos
- [ ] Notificações push

### 6. Configurações ❌
- [ ] Perfil do usuário
- [ ] Preferências da aplicação
- [ ] Personalização de categorias

## Estrutura de Dados

### Entidades Principais
```typescript
- User (id, email, full_name)
- Account (id, name, type, balance, bank_info)
- Transaction (id, description, amount, type, date, category)
- Category (id, name, type, icon, color)
- CreditCard (id, name, brand, limit, closing_day)
- CreditCardBill (id, card_id, due_date, amount, paid)
```

## Correções Recentes (Janeiro 2025) ✅

### Problemas Resolvidos
1. **Erro de Competência Undefined**
   - Problema: `Cannot read properties of undefined (reading 'month')`
   - Solução: Implementação completa do hook useCompetenceFilter
   - Estado global de competência sincronizado entre páginas

2. **Banco de Dados Configurado**
   - PostgreSQL já provisionado e configurado
   - Variáveis de ambiente disponíveis
   - Pronto para migração de mock para produção

## Implementação Pendente: Autenticação com Replit Auth 🔴

### Por que usar Replit Auth?
- **Segurança**: Autenticação OAuth2/OpenID Connect gerenciada pelo Replit
- **Simplicidade**: Sem necessidade de gerenciar senhas ou tokens
- **Integração nativa**: Funciona perfeitamente no ambiente Replit
- **Produção-ready**: Pronto para deploy sem configuração adicional

### Passos para Implementar Replit Auth

#### 1. Criar Schema do Banco de Dados (shared/schema.ts)
```typescript
// Tabela de usuários do Replit
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Replit user ID
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela de sessões para autenticação
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Adicionar user_id em todas as tabelas existentes
// accounts, transactions, categories, credit_cards, etc.
```

#### 2. Configurar Autenticação no Backend (server/replitAuth.ts)
- Configurar OpenID Connect com Replit
- Implementar Passport.js com estratégia Replit
- Criar middleware isAuthenticated
- Configurar rotas /api/login, /api/callback, /api/logout

#### 3. Migrar Storage para Banco de Dados (server/storage.ts)
- Substituir MemStorage por DatabaseStorage
- Implementar métodos com Drizzle ORM
- Adicionar filtros por user_id em todas as queries
- Garantir isolamento de dados entre usuários

#### 4. Atualizar Frontend
- Modificar useAuth para buscar dados reais
- Atualizar rotas de login/logout
- Implementar tratamento de erros 401
- Adicionar redirecionamentos apropriados

#### 5. Executar Migração
```bash
npm run db:push
```

### Preparação para Integração com Backend

### Estado Atual
- Sistema mock completo e funcional
- Interfaces TypeScript bem definidas
- Hooks abstraídos para fácil migração
- Validação de dados com Zod schemas
- **Banco de dados PostgreSQL configurado e pronto**

### Próximos Passos Imediatos
1. **Implementar Replit Auth** (Prioridade máxima)
   - Seguir os passos detalhados acima
   - Migrar de mock para autenticação real
   - Testar fluxo completo de login/logout

2. **Migrar Dados para PostgreSQL**
   - Criar todas as tabelas necessárias
   - Implementar relações entre entidades
   - Migrar lógica de mock para queries reais

3. **Completar Integração Backend**
   - Implementar todas as rotas API necessárias
   - Substituir Context API por React Query
   - Cache e sincronização de dados

### Benefícios da Implementação com Replit Auth

1. **Segurança Imediata**
   - Autenticação OAuth2 profissional
   - Sem necessidade de gerenciar senhas
   - Sessões seguras com PostgreSQL

2. **Experiência do Usuário**
   - Login com conta Replit existente
   - Sem necessidade de criar nova conta
   - Processo de autenticação familiar

3. **Pronto para Produção**
   - Deploy direto no Replit
   - Escalabilidade automática
   - SSL/TLS incluído

4. **Desenvolvimento Rápido**
   - Blueprints prontos do Replit
   - Documentação completa
   - Suporte integrado na plataforma

## Notas Técnicas

### Componentes Principais
- `MainLayout`: Layout principal com sidebar e header
- `DashboardCards`: Cards de métricas e gráficos
- `TransactionModal`: Modal unificado para transações
- `AccountCard/Modal`: Gestão de contas
- `CreditCardCard/Modal`: Gestão de cartões

### Hooks Customizados
- `useAuth`: Autenticação e usuário
- `useAccounts`: CRUD de contas
- `useTransactions`: CRUD de transações
- `useCreditCards`: CRUD de cartões
- `useCategories`: Gestão de categorias
- `useCurrencyInput`: Input formatado de moeda

### Validações
- Schemas Zod para todas as entidades
- Validação de formulários com React Hook Form
- Tipos TypeScript rigorosos

### Padrão de inputs monetários (obrigatório)

Para todo campo que represente valores em dinheiro (floats), a entrada deve ser autoformatada enquanto o usuário digita, no formato brasileiro (pt-BR) com 2 casas decimais.

- Use o hook `useCurrencyInput` para controlar o valor exibido e o valor numérico.
- Use `type="text"` com `inputMode="decimal"` para respeitar o teclado numérico e a localidade.
- Exiba `displayValue` no `Input` e consuma `numericValue` na submissão/envio ao backend.
- Evite `type="number"` para não quebrar a formatação local (vírgula vs. ponto).

Exemplo com React Hook Form (`Controller`):

```tsx
import { Controller, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { useCurrencyInput } from '@/hooks/useCurrencyInput'

type FormData = { amount: number }

export function AmountField() {
  const { control } = useForm<FormData>({ defaultValues: { amount: 0 } })

  return (
    <Controller
      name="amount"
      control={control}
      render={({ field }) => {
        const {
          displayValue,
          handleChange,
          handleBlur,
          handleFocus,
        } = useCurrencyInput({
          initialValue: Number(field.value) || 0,
          onChange: (value) => field.onChange(value), // value numérico
        })

        return (
          <Input
            type="text"
            inputMode="decimal"
            lang="pt-BR"
            placeholder="0,00"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
        )
      }}
    />
  )
}
```

Notas:
- `useCurrencyInput` mantém o cursor estável e aplica a máscara em tempo real.
- `numericValue` é sempre o valor em número (ex.: 1234.56) para salvar no banco/API.
- Para valores máximos, use `maxValue` em `useCurrencyInput`.

## Cronograma de Migração para Produção com Replit Auth

### Fase 1: Autenticação Replit (3-5 dias) 🔴 PRIORIDADE
- Implementar schema de usuários e sessões
- Configurar Replit Auth (OpenID Connect)
- Criar middleware de autenticação
- Atualizar frontend para login real

### Fase 2: Migração de Dados (1 semana)
- Criar todas as tabelas no PostgreSQL
- Migrar de MemStorage para DatabaseStorage
- Implementar filtros por user_id
- Testar isolamento de dados

### Fase 3: Integração Completa (1 semana)
- Substituir Context API por React Query
- Implementar cache e sincronização
- Tratamento de erros e loading states
- Testes de integração

### Fase 4: Features Adicionais (2 semanas)
- Importação de extratos bancários
- Exportação de relatórios
- Notificações de vencimento
- Análises avançadas

### Fase 5: Deploy e Produção (3 dias)
- Deploy no Replit
- Configurar domínio personalizado
- Monitoramento e logs
- Documentação para usuários

## Status Atual do Projeto

### ✅ Concluído
- Frontend completo e funcional
- Sistema de mock data robusto
- Interface responsiva e moderna
- Planejamento mensal (orçamentos)
- Gestão completa de finanças
- Banco de dados PostgreSQL configurado
- Correção de bugs de competência

### 🔴 Próximo Passo Crítico
**IMPLEMENTAR REPLIT AUTH** - Este é o único bloqueador para ter uma aplicação pronta para produção. Com Replit Auth implementado, o sistema estará:
- Seguro para uso real
- Pronto para múltiplos usuários
- Preparado para deploy
- Profissional e confiável

### 🎯 Meta Final
Transformar o protótipo em uma aplicação de produção completa, aproveitando toda a infraestrutura já construída e a integração nativa com Replit.

## Considerações Finais

O projeto Detetive Financeiro está 90% completo. A arquitetura está sólida, a interface está polida e funcional, e o banco de dados está configurado. O único passo restante é implementar a autenticação real com Replit Auth para tornar o sistema seguro e pronto para uso em produção.

Com a implementação do Replit Auth, você terá uma aplicação financeira pessoal completa, segura e profissional, pronta para ser usada por múltiplos usuários com dados isolados e protegidos.

---

**Última atualização**: 10 de Janeiro de 2025
**Status**: Protótipo Completo - Aguardando Implementação de Autenticação Real 🔴
**Próximo Passo**: Implementar Replit Auth seguindo o guia detalhado acima