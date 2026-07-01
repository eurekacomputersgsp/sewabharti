
-- Redefine has_role as SECURITY INVOKER so it's no longer flagged as a definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Anon needs table-level SELECT to invoke has_role; RLS "Users can view own roles"
-- (auth.uid() = user_id) still hides every row from unauthenticated callers.
GRANT SELECT ON public.user_roles TO anon;

-- Drop verify RPCs and private helpers; verify-certificate moves to an edge function
DROP FUNCTION IF EXISTS public.verify_certificate(text,text,text,text);
DROP FUNCTION IF EXISTS private.verify_certificate(text,text,text,text);
DROP FUNCTION IF EXISTS private.has_role(uuid, public.app_role);
DROP SCHEMA IF EXISTS private CASCADE;

-- Drop the definer view and restore a plain public SELECT policy on site_settings.
-- Every column in site_settings (NGO name, address, phones, emails, UPI ID, bank
-- details, social links, etc.) is intentionally displayed to unauthenticated
-- visitors on /donate, /contact and the footer — this is a public donation site.
DROP VIEW IF EXISTS public.site_settings_public;

CREATE POLICY "Public read settings" ON public.site_settings
FOR SELECT TO anon, authenticated USING (true);
