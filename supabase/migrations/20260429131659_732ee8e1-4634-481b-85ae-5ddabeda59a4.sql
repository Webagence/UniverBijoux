
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count INT;
  current_uid UUID;
BEGIN
  current_uid := auth.uid();
  IF current_uid IS NULL THEN
    RETURN false;
  END IF;
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count > 0 THEN
    RETURN false;
  END IF;
  -- Devient admin et auto-approuvé
  INSERT INTO public.user_roles (user_id, role) VALUES (current_uid, 'admin')
  ON CONFLICT DO NOTHING;
  UPDATE public.profiles SET approved = true WHERE id = current_uid;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;
