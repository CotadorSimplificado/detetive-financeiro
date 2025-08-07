// Tipos baseados na estrutura do Supabase, mas simplificados para o sistema mock

export type AccountType = "CHECKING" | "SAVINGS" | "CASH" | "PREPAID" | "INVESTMENT" | "OTHER";
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type CardBrand = "VISA" | "MASTERCARD" | "ELO" | "AMEX" | "HIPERCARD" | "OTHER";
export type CardType = "CREDIT" | "DEBIT" | "CREDIT_DEBIT" | "PREPAID" | "VIRTUAL";
export type RecurrenceType = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";
export type BudgetPeriod = "MONTHLY" | "QUARTERLY" | "YEARLY";

// Tipo base para todas as entidades
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Usuário
export interface User extends BaseEntity {
  email: string;
  full_name: string;
  avatar_url?: string;
}

// Perfil do usuário
export interface Profile extends BaseEntity {
  user_id: string;
  full_name: string;
  avatar_url?: string;
}

// Conta bancária
export interface Account extends BaseEntity {
  user_id: string;
  name: string;
  type: AccountType;
  bank_name?: string;
  bank_code?: string;
  agency_number?: string;
  account_number?: string;
  current_balance: number;
  initial_balance: number;
  color?: string;
  icon?: string;
  is_active: boolean;
  is_default: boolean;
  include_in_total: boolean;
  sync_enabled: boolean;
  last_sync_at?: string;
  deleted_at?: string;
}

// Categoria
export interface Category extends BaseEntity {
  user_id?: string;
  name: string;
  slug: string;
  type: TransactionType;
  color?: string;
  icon?: string;
  is_active: boolean;
  is_system: boolean;
  parent_id?: string;
}

// Transação
export interface Transaction extends BaseEntity {
  user_id: string;
  account_id?: string;
  card_id?: string;
  category_id: string;
  bill_id?: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  notes?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  is_recurring: boolean;
  recurrence_type?: RecurrenceType;
  recurrence_interval?: number;
  recurrence_end_date?: string;
  is_installment: boolean;
  installment_number?: number;
  installment_total?: number;
  installment_group_id?: string;
  is_transfer: boolean;
  transfer_from_id?: string;
  transfer_to_id?: string;
  paid_at?: string;
  ai_categorized?: boolean;
  ai_confidence?: number;
  deleted_at?: string;
}

// Cartão de crédito
export interface CreditCard extends BaseEntity {
  user_id: string;
  name: string;
  brand: CardBrand;
  type: CardType;
  last_digits?: string;
  credit_limit?: number;
  available_limit?: number;
  closing_day?: number;
  due_day?: number;
  color?: string;
  is_active: boolean;
  is_default: boolean;
  is_virtual: boolean;
  parent_card_id?: string;
  last_sync_at?: string;
  deleted_at?: string;
}

// Fatura de cartão de crédito
export interface CreditCardBill extends BaseEntity {
  card_id: string;
  reference_month: string;
  closing_date: string;
  due_date: string;
  total_amount: number;
  is_paid: boolean;
  paid_at?: string;
  payment_transaction_id?: string;
}

// Orçamento
export interface Budget extends BaseEntity {
  user_id: string;
  name: string;
  amount: number;
  spent_amount: number;
  category_id?: string;
  period: BudgetPeriod;
  start_date: string;
  end_date: string;
  is_active: boolean;
  rollover: boolean;
  alert_at_50: boolean;
  alert_at_75: boolean;
  alert_at_90: boolean;
  alert_at_100: boolean;
}

// Grupo familiar
export interface FamilyGroup extends BaseEntity {
  name: string;
  description?: string;
  created_by_id: string;
  max_members?: number;
  invite_code?: string;
}

// Membro do grupo familiar
export interface FamilyGroupMember extends BaseEntity {
  group_id: string;
  user_id: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "BLOCKED";
  joined_at?: string;
  left_at?: string;
  auto_import: boolean;
  notifications_enabled: boolean;
}

// Tipos para operações CRUD
export type CreateAccount = Omit<Account, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAccount = Partial<Omit<Account, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

export type CreateCategory = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCategory = Partial<Omit<Category, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

export type CreateTransaction = Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTransaction = Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

export type CreateCreditCard = Omit<CreditCard, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCreditCard = Partial<Omit<CreditCard, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

export type CreateCreditCardBill = Omit<CreditCardBill, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCreditCardBill = Partial<Omit<CreditCardBill, 'id' | 'created_at' | 'updated_at'>>;

export type CreateBudget = Omit<Budget, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBudget = Partial<Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

// Tipos para autenticação mock
export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

export interface MockSession {
  user: MockUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Tipos para filtros e consultas
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  description?: string;
}

export interface AccountFilters {
  isActive?: boolean;
  includeInTotal?: boolean;
  type?: AccountType;
}

export interface CategoryFilters {
  isActive?: boolean;
  type?: TransactionType;
  parentId?: string;
}
