-- Tabella per i suggerimenti personalizzati dei movimenti (sezione investimenti)
-- Esegui questo script nell'SQL Editor della dashboard di Supabase

CREATE TABLE IF NOT EXISTS public.movement_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Abilita Row Level Security (RLS)
ALTER TABLE public.movement_suggestions ENABLE ROW LEVEL SECURITY;

-- Policy: Gli utenti possono visualizzare e gestire esclusivamente i propri suggerimenti
CREATE POLICY "Users can manage own movement suggestions"
ON public.movement_suggestions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
