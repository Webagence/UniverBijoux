
-- Fix mutable search path
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Restrict SECURITY DEFINER functions from anon
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
