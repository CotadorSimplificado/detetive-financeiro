-- Enable RLS on all main tables
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_group_members ENABLE ROW LEVEL SECURITY;

-- Accounts policies
CREATE POLICY "Users can view their own accounts" 
ON public.accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own accounts" 
ON public.accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" 
ON public.accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts" 
ON public.accounts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Categories policies (allow access to system categories + user's own)
CREATE POLICY "Users can view system and own categories" 
ON public.categories 
FOR SELECT 
USING (is_system = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update their own categories" 
ON public.categories 
FOR UPDATE 
USING (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete their own categories" 
ON public.categories 
FOR DELETE 
USING (auth.uid() = user_id AND is_system = false);

-- Credit cards policies
CREATE POLICY "Users can view their own credit cards" 
ON public.credit_cards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credit cards" 
ON public.credit_cards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit cards" 
ON public.credit_cards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own credit cards" 
ON public.credit_cards 
FOR DELETE 
USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view their own budgets" 
ON public.budgets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets" 
ON public.budgets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" 
ON public.budgets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" 
ON public.budgets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Family groups policies
CREATE POLICY "Users can view groups they created or are members of" 
ON public.family_groups 
FOR SELECT 
USING (
  auth.uid() = created_by_id OR 
  EXISTS (
    SELECT 1 FROM public.family_group_members 
    WHERE group_id = id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create family groups" 
ON public.family_groups 
FOR INSERT 
WITH CHECK (auth.uid() = created_by_id);

CREATE POLICY "Users can update groups they created" 
ON public.family_groups 
FOR UPDATE 
USING (auth.uid() = created_by_id);

CREATE POLICY "Users can delete groups they created" 
ON public.family_groups 
FOR DELETE 
USING (auth.uid() = created_by_id);

-- Family group members policies
CREATE POLICY "Users can view memberships for groups they have access to" 
ON public.family_group_members 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.family_groups 
    WHERE id = group_id AND created_by_id = auth.uid()
  )
);

CREATE POLICY "Users can join groups" 
ON public.family_group_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership" 
ON public.family_group_members 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" 
ON public.family_group_members 
FOR DELETE 
USING (auth.uid() = user_id);