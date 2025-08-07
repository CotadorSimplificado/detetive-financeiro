-- Criar categoria padrão para pagamentos de cartão
INSERT INTO categories (id, name, slug, type, icon, color, is_system, user_id)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Pagamento de Cartão',
  'pagamento-cartao',
  'EXPENSE',
  '💳',
  '#FF9800',
  true,
  null
) ON CONFLICT (id) DO NOTHING;

-- Função para associar transações de cartão às faturas automaticamente
CREATE OR REPLACE FUNCTION associate_card_transaction_to_bill()
RETURNS TRIGGER AS $$
DECLARE
  bill_record RECORD;
  reference_month TEXT;
BEGIN
  -- Só processa se é uma transação de cartão
  IF NEW.card_id IS NOT NULL AND NEW.type = 'EXPENSE' THEN
    -- Calcular o mês de referência baseado na data da transação
    reference_month := TO_CHAR(NEW.date, 'YYYY-MM');
    
    -- Buscar ou criar fatura para esse cartão e mês
    SELECT * INTO bill_record 
    FROM credit_card_bills 
    WHERE card_id = NEW.card_id 
    AND reference_month = reference_month;
    
    -- Se não existe fatura, criar uma
    IF NOT FOUND THEN
      INSERT INTO credit_card_bills (
        card_id,
        reference_month,
        closing_date,
        due_date,
        total_amount
      ) VALUES (
        NEW.card_id,
        reference_month,
        (NEW.date + INTERVAL '1 month' - INTERVAL '1 day')::date, -- último dia do mês
        (NEW.date + INTERVAL '1 month' + INTERVAL '10 days')::date, -- 10 dias depois do fechamento
        NEW.amount
      );
      
      -- Buscar a fatura recém-criada
      SELECT * INTO bill_record 
      FROM credit_card_bills 
      WHERE card_id = NEW.card_id 
      AND reference_month = reference_month;
    ELSE
      -- Atualizar o valor total da fatura existente
      UPDATE credit_card_bills 
      SET total_amount = total_amount + NEW.amount
      WHERE id = bill_record.id;
    END IF;
    
    -- Associar a transação à fatura
    NEW.bill_id := bill_record.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para associar transações de cartão às faturas
CREATE TRIGGER trigger_associate_card_transaction_to_bill
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION associate_card_transaction_to_bill();