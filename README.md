# TechShop Rwanda

Electronics e-commerce platform for Rwanda — smartphones, laptops, projectors, audio gear and accessories.

## Technology Stack

| Layer | Technologies |
|---|---|
| Framework | Next.js 14 (App Router) · React 18 · TypeScript 5 |
| Styling | Tailwind CSS · Custom Rwanda-inspired color palette |
| Client state | Zustand (persistent cart) |
| Backend/DB | Supabase (PostgreSQL 15 + Auth + Storage) |
| Validation | Zod |
| Icons | lucide-react |
| CI/CD | GitHub Actions · Docker · Vercel |

## Features

- Product catalog with search, category filters, and pagination
- Persistent cart (localStorage via Zustand)
- Email/OAuth authentication (Supabase Auth)
- Checkout form with shipping address and payment method selection (Cash on Delivery, MTN MoMo, Airtel Money)
- Customer order tracking
- Admin dashboard with product and order management
- PostgreSQL Row-Level Security (RLS)
- Responsive design with a Rwanda-inspired theme

## Project Structure

```
app/
├── (auth)/          # Login / register pages
├── (shop)/          # Public storefront (home, products, cart, checkout)
└── admin/           # Admin dashboard (protected)
components/          # Reusable React components
lib/
├── supabase/        # Browser and server Supabase clients + generated types
├── actions/         # Server Actions (auth)
└── hooks/           # useCart, useProducts
store/               # Zustand store (cart)
types/               # Domain types + Zod schemas
database/            # schema.sql + seed.sql
```

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase project (or Docker for local development)

### Installation

```bash
git clone https://github.com/Terda11/final_exam_project.git
cd final_exam_project
npm install
```

### Environment Variables

```bash
cp .env.local.example .env.local
```

Fill `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=20000
NEXT_PUBLIC_SHIPPING_FEE=2000
```

### Database Setup

Run the SQL scripts in Supabase (or Docker):

```bash
psql -f database/schema.sql
psql -f database/seed.sql   # sample data
```

### Run Locally

```bash
npm run dev
```

The application is available at [http://localhost:3000](http://localhost:3000).

## Docker Setup

```bash
docker compose up --build
```

This starts the Next.js app on port `3000` and PostgreSQL 15 on `5432`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

## User Roles

| Role | Access |
|---|---|
| Visitor | Browse catalog, view product pages |
| Customer (`customer`) | + Cart, checkout, view orders |
| Admin (`admin`) | + Admin dashboard, product CRUD, view all orders |

Routes are protected by `middleware.ts` and Supabase RLS policies.

## Payment Methods

- **Cash on Delivery** — pay when your order arrives
- **MTN MoMo** — MTN Mobile Money
- **Airtel Money** — Airtel Mobile Money

Free shipping for orders above **20,000 RWF**, otherwise **2,000 RWF**.

## Deployment

The GitHub Actions pipeline (`.github/workflows/ci-cd.yml`) automatically runs lint, build, and deployment to **Vercel** on each push to `main`.

### Required Deployment Steps

1. **Create a Vercel project** — import `https://github.com/Terda11/final_exam_project`
2. **Add Vercel environment variables** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD`, `NEXT_PUBLIC_SHIPPING_FEE`
3. **Create a deploy hook** — Vercel → Settings → Git → Deploy Hooks → copy the URL
4. **Create GitHub secret** — Settings → Secrets → `VERCEL_DEPLOY_HOOK_URL` = deploy hook URL
5. **Record production URL** — note the Vercel URL `https://rwanda-shop.vercel.app` in Section 9 of `REPORT.md`

The Docker image uses a multi-stage build (deps → builder → runner) on Alpine Linux with a non-root user.

### Docker Build & Run Verification

```bash
# Build the image
npm run docker:build

# Run with docker-compose (app + PostgreSQL)
docker compose up --build

# Verify the app responds
curl http://localhost:3000/api/health
```

The image is published to GitHub Container Registry: `ghcr.io/terda11/final_exam_project:latest`

## License

Academic project for UNILAK — all rights reserved.

## Project Requirements Checklist

| # | Requirement | Status | Key files |
|---|----------|--------|---------------|
| 1 | Responsive UI, homepage, navigation | ✅ | `app/(shop)/page.tsx`, `components/layout/Navbar.tsx` |
| 2 | Product management (list, detail, categories) | ✅ | `app/(shop)/products/`, `lib/constants/categories.ts` |
| 3 | Cart (add/remove, quantities, totals) | ✅ | `store/cartStore.ts`, `app/(shop)/cart/` |
| 4 | Checkout (client, summary, confirmation) | ✅ | `app/(shop)/checkout/`, `order-confirmation/` |
| 5 | Database (products, customers, orders) | ✅ | `database/schema.sql`, Supabase |
| 6 | GitHub (hosting + commit history) | ✅ | [github.com/Terda11/final_exam_project](https://github.com/Terda11/final_exam_project) |
| 7 | Online deployment | ⚙️ | Configure Vercel (see Deployment section) |
| 8 | CI/CD (GitHub Actions) | ✅ | `.github/workflows/ci-cd.yml` |
| 9 | Docker (Dockerfile + docker-compose) | ✅ | `Dockerfile`, `docker-compose.yml` |
