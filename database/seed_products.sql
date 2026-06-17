-- ══════════════════════════════════════════════════════════════════
--  RwandaShop — Seed : 18 produits electronics
--
--  PRÉ-REQUIS :
--    1. Avoir exécuté database/reset.sql
--    2. Avoir créé un compte admin dans Supabase Auth → Users → Add user
--    3. Copier l'UUID du compte admin et REMPLACER les deux occurrences
--       de  YOUR-ADMIN-UUID-HERE  ci-dessous
--
--  Ensuite : coller dans SQL Editor → New query → Run
-- ══════════════════════════════════════════════════════════════════

-- ── Étape obligatoire : définir l'UUID admin ─────────────────────
-- Remplace les deux lignes suivantes avec le vrai UUID de ton admin :
DO $$
DECLARE
  admin_id UUID := '3127aa93-3a7f-4ff0-9f34-336aa54b28ca';
  cat_mobiles   UUID := 'c1000000-0000-0000-0000-000000000001';
  cat_laptops   UUID := 'c1000000-0000-0000-0000-000000000002';
  cat_projectors UUID := 'c1000000-0000-0000-0000-000000000003';
  cat_audio     UUID := 'c1000000-0000-0000-0000-000000000004';
  cat_accessories UUID := 'c1000000-0000-0000-0000-000000000005';
BEGIN

-- ── Recréer les catégories avec IDs fixes (pour les FK produits) ──
INSERT INTO public.categories (id, name, slug, description) VALUES
  (cat_mobiles,    'Mobiles & Tablets',   'mobiles-tablets',   'Smartphones, iPhones, Android phones, tablets and mobile accessories.'),
  (cat_laptops,    'Laptops & Computers', 'laptops-computers', 'Laptops, desktops, chromebooks and computing peripherals for work and study.'),
  (cat_projectors, 'Projectors',          'projectors',        'Business and home cinema projectors, screens, and mounting accessories.'),
  (cat_audio,      'Audio & Sound',       'audio-sound',       'Headphones, earbuds, speakers, soundbars and home theatre systems.'),
  (cat_accessories,'Accessories',         'accessories',       'Cables, chargers, power banks, cases, keyboards, mice and more.')
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;

-- Mettre à jour le rôle du compte admin
UPDATE public.users SET role = 'admin' WHERE id = admin_id;

-- ── Mobiles & Tablets ─────────────────────────────────────────────
INSERT INTO public.products (id, name, description, price, stock, category_id, artisan_id, is_featured, is_active, image_url) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Samsung Galaxy A55 5G',
    'Samsung Galaxy A55 5G with 6.6" Super AMOLED display, 50MP triple camera, Exynos 1480 processor, 5000mAh battery and 25W fast charging. 8GB RAM / 256GB storage.',
    520000, 18, cat_mobiles, admin_id, true, true,
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'iPhone 15 128GB',
    'Apple iPhone 15 with 6.1" Super Retina XDR display, A16 Bionic chip, 48MP main camera, Dynamic Island, and USB-C connector. iOS 17.',
    1250000, 10, cat_mobiles, admin_id, true, true,
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Samsung Galaxy Tab A9+ (Wi-Fi)',
    'Samsung Galaxy Tab A9+ with 11" LCD display at 90Hz, Snapdragon 695, 8GB RAM, 128GB storage, quad Dolby Atmos speakers, 7040mAh battery.',
    430000, 14, cat_mobiles, admin_id, false, true,
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Tecno Camon 30 Pro 5G',
    'Tecno Camon 30 Pro 5G with 6.67" AMOLED curved display, 50MP AI triple camera, Dimensity 7020, 5000mAh battery and 45W flash charging.',
    320000, 22, cat_mobiles, admin_id, false, true,
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
  ),

-- ── Laptops & Computers ───────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000005',
    'HP 250 G10 Laptop 15.6"',
    'HP 250 G10 with Intel Core i5-1335U, 8GB DDR4, 512GB NVMe SSD, 15.6" FHD IPS display, Intel Iris Xe graphics, Windows 11 Home.',
    890000, 8, cat_laptops, admin_id, true, true,
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000006',
    'Lenovo IdeaPad Slim 3 i3',
    'Lenovo IdeaPad Slim 3 with Intel Core i3-1215U, 8GB RAM, 256GB SSD, 15.6" FHD display, Wi-Fi 6. Lightweight at 1.62kg. Windows 11 Home S.',
    650000, 12, cat_laptops, admin_id, false, true,
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000007',
    'MacBook Air M2 13"',
    'Apple MacBook Air M2, 8-core CPU, 8-core GPU, 8GB unified memory, 256GB SSD, 13.6" Liquid Retina display, 18 hours battery. Space Grey.',
    1850000, 5, cat_laptops, admin_id, true, true,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000008',
    'Dell Inspiron 15 Core i7',
    'Dell Inspiron 15 3530 with Intel Core i7-1355U, 16GB DDR4, 512GB SSD, NVIDIA GeForce MX550 2GB, 15.6" FHD Anti-glare, Windows 11 Home.',
    1150000, 7, cat_laptops, admin_id, false, true,
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
  ),

-- ── Projectors ────────────────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000009',
    'Epson EB-X49 3LCD Projector',
    'Epson EB-X49 XGA 3LCD projector, 3600 lumens, XGA resolution, HDMI & VGA, USB plug-and-play, 6000-hour lamp life. Ideal for classrooms.',
    780000, 6, cat_projectors, admin_id, true, true,
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000010',
    'Sony VPL-DX221 2800 Lumens Projector',
    'Sony VPL-DX221 XGA projector, 2800 ANSI lumens, HDMI, Reality Creation technology for sharp natural images. Compact for office use.',
    728000, 4, cat_projectors, admin_id, true, true,
    'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000011',
    'Acer DLP Projector X1128H 4800 Lumens',
    'Acer X1128H DLP projector, 4800 ANSI lumens, SVGA resolution, 20000:1 contrast, HDMI 1.4a, 3D Ready, EcoProjection energy saving.',
    770000, 5, cat_projectors, admin_id, false, true,
    'https://images.unsplash.com/photo-1619416280870-8a0a1ffe2e53?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000012',
    'Office Point Wallmount Projection Screen 96"',
    'Electronic wall-mount projection screen, 96" diagonal (240x240cm), matte white surface, aluminium casing, remote-controlled motor.',
    309000, 9, cat_projectors, admin_id, false, true,
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'
  ),

-- ── Audio & Sound ─────────────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000013',
    'Sony WH-1000XM5 Wireless Headphones',
    'Sony WH-1000XM5 industry-leading noise cancelling headphones, 30 hours battery, multipoint Bluetooth 5.2, lightweight foldable design.',
    380000, 15, cat_audio, admin_id, true, true,
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000014',
    'JBL Charge 5 Portable Bluetooth Speaker',
    'JBL Charge 5 waterproof (IP67) portable speaker, 20 hours playtime, built-in power bank, USB-C charging, PartyBoost. Black, Teal, Blue.',
    185000, 20, cat_audio, admin_id, true, true,
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000015',
    'Samsung Soundbar HW-B450 2.1ch',
    'Samsung HW-B450 2.1ch soundbar, 300W total power, built-in subwoofer, Bluetooth, HDMI ARC, DTS Virtual:X surround sound. Wall mountable.',
    270000, 8, cat_audio, admin_id, false, true,
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'
  ),

-- ── Accessories ───────────────────────────────────────────────────
  (
    'b1000000-0000-0000-0000-000000000016',
    'Logitech Wireless Presenter Remote R400',
    'Logitech R400 wireless presenter, 15m range, laser pointer, easy-glide controls, plug-and-play USB receiver. Windows, Mac, Linux.',
    50000, 35, cat_accessories, admin_id, false, true,
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000017',
    'Anker 65W USB-C GaN Charger (3-Port)',
    'Anker Nano II 65W GaN charger, 2x USB-C and 1x USB-A, charges MacBook + iPad + phone simultaneously. Foldable plug, compact design.',
    65000, 40, cat_accessories, admin_id, false, true,
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'
  ),
  (
    'b1000000-0000-0000-0000-000000000018',
    'Samsung T7 Portable SSD 1TB',
    'Samsung T7 1TB portable SSD, 1050MB/s read, USB 3.2 Gen 2, AES 256-bit encryption, shock-resistant metal body. PC, Mac, Android, consoles.',
    135000, 25, cat_accessories, admin_id, true, true,
    'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80'
  )
ON CONFLICT (id) DO NOTHING;

END $$;
