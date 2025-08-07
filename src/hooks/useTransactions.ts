// Compatibilidade: Re-exporta o hook mock de transações
export { useMockTransactions as useTransactions } from '@/data/hooks/useMockTransactions';
export type { 
  Transaction, 
  TransactionWithRelations,
  TransactionFilters,
  CreateTransaction,
  UpdateTransaction 
} from '@/data/types';
