
-- Allow Supabase PostgREST to join orders/tickets with profiles
ALTER TABLE public.orders
  ADD CONSTRAINT orders_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.tickets
  ADD CONSTRAINT tickets_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
