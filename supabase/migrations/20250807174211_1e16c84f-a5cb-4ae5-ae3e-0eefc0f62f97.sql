-- Criar tabela de faturas de cartão de crédito
CREATE TABLE public.credit_card_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
  reference_month TEXT NOT NULL, -- YYYY-MM format
  closing_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_transaction_id UUID, -- Will reference the payment transaction
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique constraint to prevent duplicate bills for same card/month
  UNIQUE(card_id, reference_month)
);

-- Enable RLS
ALTER TABLE public.credit_card_bills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credit_card_bills
CREATE POLICY "Users can view their own credit card bills"
ON public.credit_card_bills FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM credit_cards 
    WHERE credit_cards.id = credit_card_bills.card_id 
    AND credit_cards.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create bills for their own cards"
ON public.credit_card_bills FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM credit_cards 
    WHERE credit_cards.id = credit_card_bills.card_id 
    AND credit_cards.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own credit card bills"
ON public.credit_card_bills FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM credit_cards 
    WHERE credit_cards.id = credit_card_bills.card_id 
    AND credit_cards.user_id = auth.uid()
  )
);

-- Add bill_id to transactions table to link card transactions to bills
ALTER TABLE public.transactions 
ADD COLUMN bill_id UUID REFERENCES credit_card_bills(id);

-- Create index for better performance
CREATE INDEX idx_credit_card_bills_card_id ON credit_card_bills(card_id);
CREATE INDEX idx_credit_card_bills_reference_month ON credit_card_bills(reference_month);
CREATE INDEX idx_transactions_bill_id ON transactions(bill_id);

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_credit_card_bills_updated_at
BEFORE UPDATE ON public.credit_card_bills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();