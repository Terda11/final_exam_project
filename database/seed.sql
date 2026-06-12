-- ══════════════════════════════════════════════════════════════════
--  TechShop Rwanda — Demo seed data
--  Products priced in RWF (Rwandan Francs), inspired by
--  rootsrwanda.rw electronics catalogue.
--
--  PRE-REQUISITES:
--    1. Run database/schema.sql first.
--    2. Create an admin account in Supabase Auth and get its UUID.
--    3. Replace ADMIN_UUID below.
-- ══════════════════════════════════════════════════════════════════

\set ADMIN_UUID 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'

-- ══════════════════════════════════════════════════════════════════
--  1. CATEGORIES
-- ══════════════════════════════════════════════════════════════════
INSERT INTO public.categories (id, name, slug, description) VALUES
  (
    'c1000000-0000-0000-0000-000000000001',
    'Mobiles & Tablets',
    'mobiles-tablets',
    'Smartphones, iPhones, Android phones, tablets and mobile accessories.'
  ),
  (
    'c1000000-0000-0000-0000-000000000002',
    'Laptops & Computers',
    'laptops-computers',
    'Laptops, desktops, chromebooks and computing peripherals for work and study.'
  ),
  (
    'c1000000-0000-0000-0000-000000000003',
    'Projectors',
    'projectors',
    'Business and home cinema projectors, screens, and mounting accessories.'
  ),
  (
    'c1000000-0000-0000-0000-000000000004',
    'Audio & Sound',
    'audio-sound',
    'Headphones, earbuds, speakers, soundbars and home theatre systems.'
  ),
  (
    'c1000000-0000-0000-0000-000000000005',
    'Accessories',
    'accessories',
    'Cables, chargers, power banks, cases, keyboards, mice and more.'
  )
ON CONFLICT (slug) DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
--  2. PRODUCTS — all prices in RWF
-- ══════════════════════════════════════════════════════════════════

-- ── Mobiles & Tablets (4 products) ───────────────────────────────
INSERT INTO public.products
  (id, name, description, price, stock, category_id, artisan_id, is_featured, is_active, image_url)
VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'Samsung Galaxy A55 5G',
    'Samsung Galaxy A55 5G with 6.6" Super AMOLED display, 50MP triple camera, Exynos 1480 processor, 5000mAh battery and 25W fast charging. Available in Awesome Iceblue. 8GB RAM / 256GB storage.',
    520000,
    18,
    'c1000000-0000-0000-0000-000000000001',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'iPhone 15 128GB',
    'Apple iPhone 15 with 6.1" Super Retina XDR display, A16 Bionic chip, 48MP main camera with 2x Telephoto, Dynamic Island, and USB-C connector. iOS 17. Available in Black, Blue, Green, Yellow, Pink.',
    1250000,
    10,
    'c1000000-0000-0000-0000-000000000001',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'Samsung Galaxy Tab A9+ (Wi-Fi)',
    'Samsung Galaxy Tab A9+ with 11" LCD display at 90Hz, Snapdragon 695 processor, 8GB RAM, 128GB storage, quad speakers tuned by Dolby Atmos, and 7040mAh battery. Perfect for work, study and entertainment.',
    430000,
    14,
    'c1000000-0000-0000-0000-000000000001',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'Tecno Camon 30 Pro 5G',
    'Tecno Camon 30 Pro 5G with 6.67" AMOLED curved display, 50MP AI triple camera with optical zoom, Dimensity 7020 processor, 5000mAh battery and 45W flash charging. 8GB+8GB RAM / 256GB.',
    320000,
    22,
    'c1000000-0000-0000-0000-000000000001',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
  ),

-- ── Laptops & Computers (4 products) ─────────────────────────────
  (
    'p1000000-0000-0000-0000-000000000005',
    'HP 250 G10 Laptop 15.6"',
    'HP 250 G10 business laptop with Intel Core i5-1335U processor, 8GB DDR4 RAM, 512GB NVMe SSD, 15.6" Full HD IPS display, Intel Iris Xe graphics, Windows 11 Home, and 10.5-hour battery life.',
    890000,
    8,
    'c1000000-0000-0000-0000-000000000002',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    'Lenovo IdeaPad Slim 3 i3',
    'Lenovo IdeaPad Slim 3 with Intel Core i3-1215U, 8GB RAM, 256GB SSD, 15.6" FHD display, HD camera with privacy shutter, and Wi-Fi 6. Lightweight at 1.62kg. Windows 11 Home S included.',
    650000,
    12,
    'c1000000-0000-0000-0000-000000000002',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000007',
    'MacBook Air M2 13"',
    'Apple MacBook Air with M2 chip, 8-core CPU, 8-core GPU, 8GB unified memory, 256GB SSD, 13.6" Liquid Retina display. Up to 18 hours battery. MagSafe charging, two Thunderbolt ports. Space Grey.',
    1850000,
    5,
    'c1000000-0000-0000-0000-000000000002',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    'Dell Inspiron 15 Core i7',
    'Dell Inspiron 15 3530 with Intel Core i7-1355U, 16GB DDR4, 512GB SSD, NVIDIA GeForce MX550 2GB, 15.6" FHD Anti-glare display, backlit keyboard, Windows 11 Home. Great for productivity and light gaming.',
    1150000,
    7,
    'c1000000-0000-0000-0000-000000000002',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80'
  ),

-- ── Projectors (4 products) ───────────────────────────────────────
  (
    'p1000000-0000-0000-0000-000000000009',
    'Epson EB-X49 3LCD Projector',
    'Epson EB-X49 XGA 3LCD projector with 3600 lumens colour brightness, XGA (1024x768) resolution, HDMI and VGA connectivity, USB plug-and-play, and 6000-hour lamp life (eco mode). Ideal for classrooms and meetings.',
    780000,
    6,
    'c1000000-0000-0000-0000-000000000003',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000010',
    'Sony VPL-DX221 2800 Lumens Projector',
    'Sony VPL-DX221 XGA desktop projector with 2800 ANSI lumens, XGA resolution, HDMI port, S-Video, USB display, and Reality Creation technology for sharp, natural images. Compact and quiet for office use.',
    728000,
    4,
    'c1000000-0000-0000-0000-000000000003',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000011',
    'Acer DLP Projector X1128H 4800 Lumens',
    'Acer X1128H DLP projector with 4800 ANSI lumens high brightness, SVGA (800x600) resolution, 20,000:1 contrast ratio, HDMI 1.4a, 3D Ready, and EcoProjection energy saving. Keystone correction included.',
    770000,
    5,
    'c1000000-0000-0000-0000-000000000003',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1619416280870-8a0a1ffe2e53?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000012',
    'Office Point Wallmount Projection Screen 96"',
    'Office Point electronic wall-mount projection screen, 96" diagonal (240cm x 240cm), matte white surface, aluminium casing, remote-controlled motor, and easy ceiling or wall installation. 4:3 aspect ratio.',
    309000,
    9,
    'c1000000-0000-0000-0000-000000000003',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'
  ),

-- ── Audio & Sound (3 products) ────────────────────────────────────
  (
    'p1000000-0000-0000-0000-000000000013',
    'Sony WH-1000XM5 Wireless Headphones',
    'Sony WH-1000XM5 industry-leading noise cancelling over-ear headphones. 30 hours battery, multipoint Bluetooth 5.2, speak-to-chat, crystal-clear hands-free calling, and lightweight foldable design.',
    380000,
    15,
    'c1000000-0000-0000-0000-000000000004',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000014',
    'JBL Charge 5 Portable Bluetooth Speaker',
    'JBL Charge 5 waterproof (IP67) portable speaker with JBL Pro Sound, 20 hours playtime, built-in power bank, USB-C charging, and PartyBoost to link multiple JBL speakers. Available in Black, Teal, Blue.',
    185000,
    20,
    'c1000000-0000-0000-0000-000000000004',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000015',
    'Samsung Soundbar HW-B450 2.1ch',
    'Samsung HW-B450 2.1 channel soundbar with 300W total power, built-in subwoofer, Bluetooth, HDMI ARC, and DTS Virtual:X surround sound. Wall mountable. Perfect for TV and home cinema setups.',
    270000,
    8,
    'c1000000-0000-0000-0000-000000000004',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'
  ),

-- ── Accessories (3 products) ──────────────────────────────────────
  (
    'p1000000-0000-0000-0000-000000000016',
    'Logitech Wireless Presenter Remote R400',
    'Logitech R400 wireless presentation remote with 15m range, laser pointer, easy-glide presentation controls, and plug-and-play USB receiver. Compatible with Windows, Mac, and Linux. Battery included.',
    50000,
    35,
    'c1000000-0000-0000-0000-000000000005',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000017',
    'Anker 65W USB-C GaN Charger (3-Port)',
    'Anker Nano II 65W GaN charger with 2x USB-C and 1x USB-A ports. Charges a MacBook, iPad, and phone simultaneously. Foldable plug, compact design. Compatible with all USB-C devices and MagSafe.',
    65000,
    40,
    'c1000000-0000-0000-0000-000000000005',
    :'ADMIN_UUID',
    false,
    true,
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'
  ),
  (
    'p1000000-0000-0000-0000-000000000018',
    'Samsung T7 Portable SSD 1TB',
    'Samsung T7 1TB portable SSD with 1050MB/s read speeds, USB 3.2 Gen 2 interface, AES 256-bit encryption, shock-resistant metal body, and USB-C cable included. Compatible with PC, Mac, Android, and gaming consoles.',
    135000,
    25,
    'c1000000-0000-0000-0000-000000000005',
    :'ADMIN_UUID',
    true,
    true,
    'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80'
  )
ON CONFLICT (id) DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
--  SUMMARY
-- ══════════════════════════════════════════════════════════════════
--  Categories: 5
--    • mobiles-tablets     → 4 products (320,000 – 1,250,000 RWF)
--    • laptops-computers   → 4 products (650,000 – 1,850,000 RWF)
--    • projectors          → 4 products (309,000 – 780,000 RWF)
--    • audio-sound         → 3 products (185,000 – 380,000 RWF)
--    • accessories         → 3 products (50,000 – 135,000 RWF)
--  Total products: 18
--  Featured: 9
-- ══════════════════════════════════════════════════════════════════
