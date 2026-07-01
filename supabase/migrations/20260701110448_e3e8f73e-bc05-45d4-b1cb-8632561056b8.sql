
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, private
AS $$ SELECT private.has_role(_user_id, _role) $$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

DROP POLICY IF EXISTS "Anyone can submit donation" ON public.donations;
CREATE POLICY "Anyone can submit donation" ON public.donations
FOR INSERT TO anon, authenticated
WITH CHECK (
  donor_name IS NOT NULL
  AND length(btrim(donor_name)) BETWEEN 1 AND 200
  AND amount IS NOT NULL AND amount > 0 AND amount <= 10000000
  AND (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

DROP POLICY IF EXISTS "Anyone can register" ON public.volunteers;
CREATE POLICY "Anyone can register" ON public.volunteers
FOR INSERT TO anon, authenticated
WITH CHECK (
  name IS NOT NULL AND length(btrim(name)) BETWEEN 1 AND 200
  AND phone IS NOT NULL AND length(btrim(phone)) BETWEEN 6 AND 20
);

DROP POLICY IF EXISTS "Anyone can send message" ON public.contact_messages;
CREATE POLICY "Anyone can send message" ON public.contact_messages
FOR INSERT TO anon, authenticated
WITH CHECK (
  name IS NOT NULL AND length(btrim(name)) BETWEEN 1 AND 200
  AND email IS NOT NULL AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND message IS NOT NULL AND length(btrim(message)) BETWEEN 3 AND 5000
);

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
FOR INSERT TO anon, authenticated
WITH CHECK (email IS NOT NULL AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

DROP POLICY IF EXISTS "Certificates public read" ON public.certificates;

CREATE OR REPLACE FUNCTION private.verify_certificate(
  p_registration_number text,
  p_serial_number text,
  p_name text,
  p_son_of text
) RETURNS TABLE (
  registration_number text, serial_number text, name text, son_of text,
  course_name text, starting_date date, ending_date date, grade text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.registration_number, c.serial_number, c.name, c.son_of,
         c.course_name, c.starting_date, c.ending_date, c.grade
  FROM public.certificates c
  WHERE c.registration_number = btrim(p_registration_number)
    AND c.serial_number = btrim(p_serial_number)
    AND lower(btrim(c.name)) = lower(btrim(p_name))
    AND lower(btrim(c.son_of)) = lower(btrim(p_son_of))
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION private.verify_certificate(text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.verify_certificate(text,text,text,text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.verify_certificate(
  p_registration_number text,
  p_serial_number text,
  p_name text,
  p_son_of text
) RETURNS TABLE (
  registration_number text, serial_number text, name text, son_of text,
  course_name text, starting_date date, ending_date date, grade text
)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public, private
AS $$
  SELECT * FROM private.verify_certificate(p_registration_number, p_serial_number, p_name, p_son_of);
$$;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text,text,text,text) TO anon, authenticated;

DROP POLICY IF EXISTS "Public read settings" ON public.site_settings;

CREATE OR REPLACE VIEW public.site_settings_public AS
SELECT id, ngo_name, logo_url, address, phones, emails, upi_id, bank_details,
       social_links, map_embed_url, primary_color, accent_color,
       nav_links, footer_quick_links, section_visibility, updated_at
FROM public.site_settings;

GRANT SELECT ON public.site_settings_public TO anon, authenticated;
