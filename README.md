# RwandaShop

Plateforme e-commerce pour la vente d'artisanat rwandais authentique — vannerie, sculptures, textiles, poterie et bijoux — développée dans le cadre du projet UNILAK.

## Stack technique

| Couche | Technologies |
|---|---|
| Framework | Next.js 14 (App Router) · React 18 · TypeScript 5 |
| Styles | Tailwind CSS · Palette Rwanda personnalisée |
| État client | Zustand (panier persistant) |
| Backend/DB | Supabase (PostgreSQL 15 + Auth + Storage) |
| Validation | Zod |
| Icônes | lucide-react |
| CI/CD | GitHub Actions · Docker · Vercel |

## Fonctionnalités

- Catalogue produits avec recherche, filtres par catégorie et pagination
- Panier persistant (localStorage via Zustand)
- Authentification email/OAuth (Supabase Auth)
- Checkout avec adresse de livraison et choix du mode de paiement (Cash, MTN MoMo, Airtel Money)
- Suivi des commandes pour les clients
- Dashboard admin : gestion des produits et des commandes
- Row-Level Security (RLS) PostgreSQL
- Design responsive avec thème aux couleurs du Rwanda

## Structure du projet

```
app/
├── (auth)/          # Pages login / register
├── (shop)/          # Boutique publique (accueil, produits, panier, checkout)
└── admin/           # Dashboard admin (protégé)
components/          # Composants React réutilisables
lib/
├── supabase/        # Clients navigateur, serveur et types générés
├── actions/         # Server Actions (auth)
└── hooks/           # useCart, useProducts
store/               # Store Zustand (panier)
types/               # Types domaine + schémas Zod
database/            # schema.sql + seed.sql
```

## Démarrage rapide

### Prérequis

- Node.js 18+
- Un projet Supabase (ou Docker pour le local)

### Installation

```bash
git clone https://github.com/<your-org>/RwandaShop.git
cd RwandaShop
npm install
```

### Variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplir `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=20000
NEXT_PUBLIC_SHIPPING_FEE=2000
```

### Base de données

Exécuter le script SQL dans Supabase (ou Docker) :

```bash
psql -f database/schema.sql
psql -f database/seed.sql   # données de démonstration
```

### Lancer en développement

```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Démarrage avec Docker

```bash
docker compose up --build
```

Cela lance l'application Next.js sur le port `3000` et PostgreSQL 15 sur `5432`.

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Rôles utilisateurs

| Rôle | Accès |
|---|---|
| Visiteur | Catalogue, pages produit |
| Client (`customer`) | + Panier, checkout, mes commandes |
| Admin (`admin`) | + Dashboard admin, CRUD produits, toutes les commandes |

Les routes sont protégées par `middleware.ts` et les politiques RLS Supabase.

## Modes de paiement

- **Cash on delivery** — paiement à la livraison
- **MTN MoMo** — Mobile Money MTN
- **Airtel Money** — Mobile Money Airtel

Livraison gratuite à partir de **20 000 RWF**, sinon **2 000 RWF**.

## Déploiement

Le pipeline GitHub Actions (`.github/workflows/ci-cd.yml`) effectue automatiquement le lint, le build et le déploiement sur **Vercel** à chaque push sur `main`.

L'image Docker utilise un build multi-stage (deps → builder → runner Alpine) avec un utilisateur non-root.

## Licence

Projet académique UNILAK — tous droits réservés.
