-- Inserir categorias padrão do sistema
INSERT INTO public.categories (name, type, icon, color, is_system, slug) 
VALUES 
  -- Receitas
  ('Salário', 'INCOME', '💼', '#22c55e', true, 'salario'),
  ('Freelance', 'INCOME', '💻', '#22c55e', true, 'freelance'),
  ('Investimentos', 'INCOME', '📈', '#22c55e', true, 'investimentos'),
  ('Vendas', 'INCOME', '🛒', '#22c55e', true, 'vendas'),
  ('Outros', 'INCOME', '💰', '#22c55e', true, 'outros-receita'),
  
  -- Despesas
  ('Alimentação', 'EXPENSE', '🍽️', '#ef4444', true, 'alimentacao'),
  ('Transporte', 'EXPENSE', '🚗', '#ef4444', true, 'transporte'),
  ('Moradia', 'EXPENSE', '🏠', '#ef4444', true, 'moradia'),
  ('Saúde', 'EXPENSE', '⚕️', '#ef4444', true, 'saude'),
  ('Educação', 'EXPENSE', '📚', '#ef4444', true, 'educacao'),
  ('Lazer', 'EXPENSE', '🎉', '#ef4444', true, 'lazer'),
  ('Compras', 'EXPENSE', '🛍️', '#ef4444', true, 'compras'),
  ('Contas', 'EXPENSE', '📋', '#ef4444', true, 'contas'),
  ('Outros', 'EXPENSE', '💸', '#ef4444', true, 'outros-despesa')
ON CONFLICT (slug) DO NOTHING;

-- Função para atualizar saldo das contas
CREATE OR REPLACE FUNCTION public.update_account_balance(
  account_id UUID,
  amount_change DECIMAL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.accounts 
  SET current_balance = current_balance + amount_change,
      updated_at = NOW()
  WHERE id = account_id;
END;
$$;