-- Creazione della tabella di log di sicurezza su Supabase
-- Esegui questo script nell'SQL Editor della dashboard di Supabase

CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attempted_email TEXT,
    failed_count INT DEFAULT 1,
    is_locked BOOLEAN DEFAULT false,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Abilita Row Level Security (RLS)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Permetti l'inserimento anonimo dei tentativi di accesso (usato dall'app prima del login)
CREATE POLICY "Allow anon insert for security logs"
ON public.security_logs FOR INSERT
TO anon
WITH CHECK (true);

-- Permetti solo agli utenti autenticati di leggere i log
CREATE POLICY "Allow authenticated read security logs"
ON public.security_logs FOR SELECT
TO authenticated
USING (true);
