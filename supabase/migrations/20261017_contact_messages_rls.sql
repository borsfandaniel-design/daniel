-- ==============================================================================
-- OBS-02: Migrare SQL pentru Activare Row Level Security (RLS) pe contact_messages
-- Executați această migrare în Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Asigură existența tabelei contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Activare Row Level Security (RLS) - Obligatoriu
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 3. Curățare politici existente potențial permisive
DROP POLICY IF EXISTS "Allow anon insert" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow anonymous insert only" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read and manage" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contact_messages;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.contact_messages;

-- 4. Politică strictă de INSERT pentru rolul 'anon' (Publicul poate DOAR trimite mesaje)
CREATE POLICY "Allow anonymous insert only"
ON public.contact_messages
FOR INSERT
TO anon
WITH CHECK (
  char_length(name) <= 100 AND
  char_length(email) <= 150 AND
  char_length(message) <= 4000
);

-- 5. Interzicere explicită a citirii, modificării sau ștergerii publice
-- (Politica RLS implicită blochează SELECT, UPDATE, DELETE pentru 'anon' deoarece nu există politici acordate).

-- 6. Politică completă de citire și gestiune pentru utilizatorii autentificați (Admin)
CREATE POLICY "Allow authenticated read and manage"
ON public.contact_messages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Revocare permisiuni inutile acordate rolului public
REVOKE SELECT, UPDATE, DELETE ON public.contact_messages FROM anon;
REVOKE SELECT, UPDATE, DELETE ON public.contact_messages FROM public;
GRANT INSERT ON public.contact_messages TO anon;
GRANT ALL ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

