
-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'pro');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.ticket_status AS ENUM ('open', 'pending', 'resolved', 'closed');

-- =========================================================
-- PROFILES (info société pro)
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL DEFAULT '',
  siret TEXT NOT NULL DEFAULT '',
  contact_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  postal_code TEXT DEFAULT '',
  country TEXT DEFAULT 'France',
  vat_number TEXT DEFAULT '',
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- USER ROLES (séparé du profil pour la sécurité)
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =========================================================
-- TRIGGER: création auto du profil à l'inscription
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, company_name, siret, contact_name, phone
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'siret', ''),
    COALESCE(NEW.raw_user_meta_data->>'contact_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  -- Tous les nouveaux comptes sont 'pro' par défaut
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'pro');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- TRIGGER: updated_at générique
-- =========================================================
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- SITE SETTINGS (logo, nom, navbar, footer, SEO, TVA, bandeau)
-- =========================================================
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- CONTENT BLOCKS (hero, atelier, pages éditoriales, etc.)
-- =========================================================
CREATE TABLE public.content_blocks (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER content_blocks_set_updated_at BEFORE UPDATE ON public.content_blocks
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- TESTIMONIALS
-- =========================================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  role TEXT DEFAULT '',
  quote TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- FAQ
-- =========================================================
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- UNIVERSES (catégories produits)
-- =========================================================
CREATE TABLE public.universes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.universes ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- PRODUCTS
-- =========================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  reference TEXT DEFAULT '',
  description TEXT DEFAULT '',
  universe_id UUID REFERENCES public.universes(id) ON DELETE SET NULL,
  price_ht NUMERIC(10,2) NOT NULL DEFAULT 0,
  vat_rate NUMERIC(4,2) NOT NULL DEFAULT 20.00,
  moq INT NOT NULL DEFAULT 1,
  pack_size INT NOT NULL DEFAULT 1,
  stock INT NOT NULL DEFAULT 0,
  images JSONB NOT NULL DEFAULT '[]'::JSONB,
  material TEXT DEFAULT '',
  is_new BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_products_universe ON public.products(universe_id);
CREATE INDEX idx_products_active ON public.products(active);

-- =========================================================
-- ORDERS + ORDER ITEMS
-- =========================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE DEFAULT ('ML-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((floor(random()*10000))::TEXT, 4, '0')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal_ht NUMERIC(10,2) NOT NULL DEFAULT 0,
  vat_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_ht NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_ttc NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_address JSONB NOT NULL DEFAULT '{}'::JSONB,
  tracking_number TEXT DEFAULT '',
  carrier TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_orders_user ON public.orders(user_id);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_reference TEXT DEFAULT '',
  unit_price_ht NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  line_total_ht NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- =========================================================
-- INVOICES
-- =========================================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pdf_path TEXT DEFAULT '',
  total_ht NUMERIC(10,2) NOT NULL,
  vat_amount NUMERIC(10,2) NOT NULL,
  total_ttc NUMERIC(10,2) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_invoices_user ON public.invoices(user_id);

-- =========================================================
-- TICKETS + MESSAGES
-- =========================================================
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE DEFAULT ('TK-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((floor(random()*10000))::TEXT, 4, '0')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER tickets_set_updated_at BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_ticket_messages_ticket ON public.ticket_messages(ticket_id);

-- =========================================================
-- RLS POLICIES
-- =========================================================

-- profiles
CREATE POLICY "users read own profile" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users update own profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "admins read all profiles" ON public.profiles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update all profiles" ON public.profiles
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete profiles" ON public.profiles
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "users read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins manage roles" ON public.user_roles
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings (public en lecture, admin écriture)
CREATE POLICY "anyone read settings" ON public.site_settings
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write settings" ON public.site_settings
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- content_blocks
CREATE POLICY "anyone read content" ON public.content_blocks
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write content" ON public.content_blocks
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- testimonials
CREATE POLICY "anyone read testimonials" ON public.testimonials
FOR SELECT TO anon, authenticated USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins write testimonials" ON public.testimonials
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- faq
CREATE POLICY "anyone read faq" ON public.faq_items
FOR SELECT TO anon, authenticated USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins write faq" ON public.faq_items
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- universes
CREATE POLICY "anyone read universes" ON public.universes
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write universes" ON public.universes
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- products
CREATE POLICY "anyone read active products" ON public.products
FOR SELECT TO anon, authenticated USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins write products" ON public.products
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- orders
CREATE POLICY "users read own orders" ON public.orders
FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "approved pros create orders" ON public.orders
FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND approved = true)
);
CREATE POLICY "admins update orders" ON public.orders
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete orders" ON public.orders
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- order_items
CREATE POLICY "users read own order items" ON public.order_items
FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id
          AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "users insert own order items" ON public.order_items
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "admins manage order items" ON public.order_items
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- invoices
CREATE POLICY "users read own invoices" ON public.invoices
FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage invoices" ON public.invoices
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- tickets
CREATE POLICY "users read own tickets" ON public.tickets
FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "users create own tickets" ON public.tickets
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own open tickets" ON public.tickets
FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete tickets" ON public.tickets
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ticket_messages
CREATE POLICY "participants read messages" ON public.ticket_messages
FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_messages.ticket_id
          AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "participants insert messages" ON public.ticket_messages
FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = author_id
  AND EXISTS (SELECT 1 FROM public.tickets WHERE id = ticket_messages.ticket_id
              AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);

-- =========================================================
-- STORAGE BUCKETS
-- =========================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "anyone read product-images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "admins write product-images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update product-images" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete product-images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "anyone read site-assets" ON storage.objects
FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "admins write site-assets" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update site-assets" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete site-assets" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "users read own invoices files" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'invoices' AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.pdf_path = storage.objects.name AND i.user_id = auth.uid()
    )
  )
);
CREATE POLICY "service writes invoices files" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'invoices' AND public.has_role(auth.uid(), 'admin'));
