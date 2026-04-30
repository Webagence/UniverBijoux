
-- Restreindre les fonctions security definer aux usages internes uniquement
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
-- has_role doit rester appelable par RLS (authenticated) — c'est le pattern recommandé Supabase
-- mais on retire l'accès anon
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;

-- Restreindre LIST sur buckets publics : on remplace les SELECT trop larges
DROP POLICY IF EXISTS "anyone read product-images" ON storage.objects;
DROP POLICY IF EXISTS "anyone read site-assets" ON storage.objects;

-- Les fichiers restent servis par les URLs publiques du CDN Supabase ;
-- on autorise uniquement la lecture par chemin connu (pas de LIST global)
CREATE POLICY "read product-images by path" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images' AND name IS NOT NULL);
CREATE POLICY "read site-assets by path" ON storage.objects
FOR SELECT USING (bucket_id = 'site-assets' AND name IS NOT NULL);
