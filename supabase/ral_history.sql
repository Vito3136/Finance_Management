-- Tabella per lo storico degli aumenti di RAL Lorda
-- Esegui questo script nell'SQL Editor della dashboard di Supabase

CREATE TABLE IF NOT EXISTS public.ral_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    effective_date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Abilita Row Level Security (RLS)
ALTER TABLE public.ral_history ENABLE ROW LEVEL SECURITY;

-- Policy: Gli utenti possono visualizzare e gestire esclusivamente il proprio storico RAL
CREATE POLICY "Users can manage own ral history"
ON public.ral_history
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

