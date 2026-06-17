# ══════════════════════════════════════════════════════════════════════════════
#  RwandaShop — optimized multi-stage Dockerfile for Next.js 14 (standalone)
#
#  3-stage architecture:
#    deps    → installs only npm dependencies (cacheable layer)
#    builder → builds the Next.js app (code + assets)
#    runner  → final lightweight image, without source or devDeps (~150 MB vs 1+ GB)
#
#  Applied security principles:
#    - Minimal base image (Alpine Linux)
#    - Non-root user (nextjs:1001) — container cannot write to the host
#    - No secrets in the image: NEXT_PUBLIC_* vars are injected via ARG at build,
#      private keys are injected at runtime via ENV
#    - OCI labels (image traceability)
#
#  Usage:
#    docker build \
#      --build-arg NEXT_PUBLIC_SUPABASE_URL=https://... \
#      --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \
#      -t ghcr.io/your-org/rwandashop:latest .
# ══════════════════════════════════════════════════════════════════════════════

# ── Shared base image ─────────────────────────────────────────────────────────
# node:20-alpine = Node.js LTS on Alpine Linux (image ~50 MB vs ~900 MB Debian)
FROM node:20-alpine AS base

# ── Stage 1: deps ─────────────────────────────────────────────────────────────
# Goal: install ALL dependencies (dev + prod) in an isolated layer.
# Separated from the builder so Docker can reuse this layer from cache as long as
# package-lock.json does not change → rebuilds are much faster.
FROM base AS deps

# libc6-compat: glibc compatibility for some native modules (e.g. sharp)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only manifest files — not the source code.
# Docker will only invalidate this layer cache if these files change.
COPY package.json package-lock.json* ./

# npm ci = deterministic install from lockfile (not npm install)
# --frozen-lockfile ensures reproducibility across environments
RUN npm ci --frozen-lockfile

# ── Stage 2: builder ──────────────────────────────────────────────────────────
# Goal: build the Next.js application in production mode.
# The standalone output contains only the minimum needed to run the server
# (no unnecessary node_modules).
FROM base AS builder

WORKDIR /app

# Reuse node_modules from the deps stage (no need to reinstall them)
COPY --from=deps /app/node_modules ./node_modules

# Copy the full source code
COPY . .

# ── Public vars injected at BUILD time ────────────────────────────────────────
# These vars are embedded into client-side JS bundles by Next.js.
# They must be known at build time, not runtime.
# ⚠ NEVER put private keys here (SUPABASE_SERVICE_ROLE_KEY, etc.)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL=https://rwandashop.rw
ARG NEXT_PUBLIC_APP_NAME=RwandaShop
ARG NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=20000
ARG NEXT_PUBLIC_SHIPPING_FEE=2000
ARG NEXT_PUBLIC_STORAGE_BUCKET_PRODUCTS=products
ARG NEXT_PUBLIC_STORAGE_BUCKET_AVATARS=avatars
ARG NEXT_PUBLIC_AUTH_REDIRECT_URL

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=$NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD
ENV NEXT_PUBLIC_SHIPPING_FEE=$NEXT_PUBLIC_SHIPPING_FEE
ENV NEXT_PUBLIC_STORAGE_BUCKET_PRODUCTS=$NEXT_PUBLIC_STORAGE_BUCKET_PRODUCTS
ENV NEXT_PUBLIC_STORAGE_BUCKET_AVATARS=$NEXT_PUBLIC_STORAGE_BUCKET_AVATARS
ENV NEXT_PUBLIC_AUTH_REDIRECT_URL=$NEXT_PUBLIC_AUTH_REDIRECT_URL

# Disable Next.js telemetry (data sent to Vercel)
ENV NEXT_TELEMETRY_DISABLED=1

# Run the Next.js build.
# next.config.ts has `output: "standalone"` → generates .next/standalone/
# which is a self-contained Node.js server without unnecessary node_modules.
RUN npm run build

# ── Stage 3: runner ──────────────────────────────────────────────────────────
# Final image: contains only the files required to run the app.
# No source code, no devDependencies, no build tools.
FROM base AS runner

# OCI metadata — best practice for image traceability in production
LABEL org.opencontainers.image.title="RwandaShop"
LABEL org.opencontainers.image.description="Rwandan handicraft marketplace — UNILAK"
LABEL org.opencontainers.image.source="https://github.com/your-org/rwandashop"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Switch Node.js to production mode (disables dev warnings, improves performance)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ── Private vars: injected at RUNTIME (not in the image) ──────────────────────
# These vars have no default values here — they MUST be provided via
# `docker run -e` or the docker-compose .env file.
# Examples: SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET
# Declaring ENV without values allows introspection tools to know which vars
# the container expects.
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ── Create non-root user ─────────────────────────────────────────────────────
# Security principle: run the Node.js process with minimal privileges.
# GID 1001 / UID 1001 are standard for official Next.js images.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy public static assets (images, fonts, manifest…)
COPY --from=builder /app/public ./public

# Copy the standalone server generated by Next.js
# --chown assigns ownership to the nextjs user during copy
# (faster than RUN chown because it avoids an extra layer)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the port — documentation only (no network mapping)
EXPOSE 3000

# Built-in health check for the image.
# Docker (and docker-compose) probes this endpoint every 30s.
# After 3 consecutive failures → container is marked "unhealthy".
# The /api/health endpoint is defined in app/api/health/route.ts
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Startup command: server.js is generated by `output: "standalone"`
CMD ["node", "server.js"]
