-- ══════════════════════════════════════════════════════════════════
--  RwandaShop — RESET COMPLET de la base de données
--
--  À utiliser après : DROP SCHEMA public CASCADE;
--
--  Instructions :
--    1. Coller CE FICHIER ENTIER dans Supabase → SQL Editor → New query
--    2. Cliquer Run  (les tables + catégories sont créées)
--    3. Créer un compte admin dans Supabase Auth → Users → Add user
--    4. Copier l'UUID du compte admin
--    5. Coller database/seed_products.sql dans un NOUVEAU query,
--       remplacer YOUR-ADMIN-UUID-HERE, puis Run
-- ══════════════════════════════════════════════════════════════════


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 0 : Recréer le schéma public (détruit par DROP SCHEMA CASCADE)
-- ══════════════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS public;

-- Restaurer les grants par défaut de Supabase
GRANT USAGE  ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL    ON SCHEMA public TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES    TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON FUNCTIONS TO postgres, service_role;


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 1 : Extensions
-- ══════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 2 : Fonction utilitaire updated_at
-- ══════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 3 : TABLE users  (miroir de auth.users)
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL UNIQUE,
  full_name   TEXT        NOT NULL,
  phone       TEXT,
  address     JSONB,
  role        TEXT        NOT NULL DEFAULT 'customer'
                            CHECK (role IN ('customer', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger : crée automatiquement le profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 4 : TABLE categories
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL UNIQUE
                            CHECK (slug IN ('mobiles-tablets','laptops-computers','projectors','audio-sound','accessories')),
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Données de référence
INSERT INTO public.categories (name, slug, description) VALUES
  ('Mobiles & Tablets',   'mobiles-tablets',   'Smartphones, iPhones, Android phones, tablets and mobile accessories.'),
  ('Laptops & Computers', 'laptops-computers', 'Laptops, desktops, chromebooks and computing peripherals for work and study.'),
  ('Projectors',          'projectors',        'Business and home cinema projectors, screens, and mounting accessories.'),
  ('Audio & Sound',       'audio-sound',       'Headphones, earbuds, speakers, soundbars and home theatre systems.'),
  ('Accessories',         'accessories',       'Cables, chargers, power banks, cases, keyboards, mice and more.')
ON CONFLICT (slug) DO NOTHING;


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 5 : TABLE products
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT          NOT NULL,
  description   TEXT          NOT NULL DEFAULT '',
  price         NUMERIC(10,0) NOT NULL CHECK (price >= 0),
  stock         INT           NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id   UUID          NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  image_url     TEXT,
  gallery       TEXT[]        NOT NULL DEFAULT '{}',
  artisan_id    UUID          NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  is_featured   BOOLEAN       NOT NULL DEFAULT false,
  is_active     BOOLEAN       NOT NULL DEFAULT true,
  weight_grams  INT           CHECK (weight_grams > 0),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_artisan_id_idx  ON public.products(artisan_id);
CREATE INDEX IF NOT EXISTS products_featured_idx    ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS products_active_idx      ON public.products(is_active)   WHERE is_active   = true;
CREATE INDEX IF NOT EXISTS products_name_trgm_idx   ON public.products USING GIN (name gin_trgm_ops);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 6 : TABLE orders
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID          NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  status           TEXT          NOT NULL DEFAULT 'pending'
                                   CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  total            NUMERIC(12,0) NOT NULL CHECK (total >= 0),
  shipping_fee     NUMERIC(8,0)  NOT NULL DEFAULT 2000 CHECK (shipping_fee >= 0),
  grand_total      NUMERIC(12,0) NOT NULL CHECK (grand_total >= 0),
  shipping_address JSONB         NOT NULL,
  payment_method   TEXT          NOT NULL DEFAULT 'cash_on_delivery'
                                   CHECK (payment_method IN ('credit_card','cash_on_delivery','mtn_momo','airtel_money')),
  notes            TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx  ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_created_idx ON public.orders(created_at DESC);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 7 : TABLE order_items
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID          NOT NULL REFERENCES public.orders(id)   ON DELETE CASCADE,
  product_id  UUID          NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity    INT           NOT NULL CHECK (quantity > 0),
  price       NUMERIC(10,0) NOT NULL CHECK (price >= 0),
  line_total  NUMERIC(12,0) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx   ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON public.order_items(product_id);


-- ══════════════════════════════════════════════════════════════════
--  ÉTAPE 8 : Row Level Security (RLS)
-- ══════════════════════════════════════════════════════════════════
ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Fonction helper SECURITY DEFINER : évite la récursion infinie dans les politiques RLS
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role FROM public.users WHERE id = auth.uid() $$;

-- ── users ─────────────────────────────────────────────────────────
CREATE POLICY "users_read_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_admin_read_all"
  ON public.users FOR SELECT
  USING (public.get_auth_user_role() = 'admin');

-- ── categories ───────────────────────────────────────────────────
CREATE POLICY "categories_public_read"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "categories_admin_write"
  ON public.categories FOR ALL
  USING (public.get_auth_user_role() = 'admin');

-- ── products ─────────────────────────────────────────────────────
CREATE POLICY "products_public_read"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "products_admin_read_all"
  ON public.products FOR SELECT
  USING (public.get_auth_user_role() = 'admin');

CREATE POLICY "products_admin_insert"
  ON public.products FOR INSERT
  WITH CHECK (public.get_auth_user_role() = 'admin');

CREATE POLICY "products_admin_update"
  ON public.products FOR UPDATE
  USING (public.get_auth_user_role() = 'admin');

CREATE POLICY "products_admin_delete"
  ON public.products FOR DELETE
  USING (public.get_auth_user_role() = 'admin');

-- ── orders ───────────────────────────────────────────────────────
CREATE POLICY "orders_own_read"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "orders_insert_auth"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "orders_admin_read_all"
  ON public.orders FOR SELECT
  USING (public.get_auth_user_role() = 'admin');

CREATE POLICY "orders_admin_update"
  ON public.orders FOR UPDATE
  USING (public.get_auth_user_role() = 'admin');

-- ── order_items ──────────────────────────────────────────────────
CREATE POLICY "order_items_own_read"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_auth"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_admin_read"
  ON public.order_items FOR SELECT
  USING (public.get_auth_user_role() = 'admin');
