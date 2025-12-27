# Stage 1: Dependencies
FROM node:24.11.1-slim AS deps
WORKDIR /app

# Debian-based images (slim) use glibc, so libc6-compat is not needed.
# Install openssl if required by Prisma (optional, added for safety)
RUN apt-get update -y && apt-get install -y openssl

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@latest && pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:24.11.1-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build arguments for environment variables
ARG NEXT_PUBLIC_API_GRAPHQL_URL
ARG NEXT_APP_API_URL

# Set them as environment variables so they are available during build (and run)
ENV NEXT_PUBLIC_API_GRAPHQL_URL=$NEXT_PUBLIC_API_GRAPHQL_URL
ENV NEXT_APP_API_URL=$NEXT_APP_API_URL

RUN npm install -g pnpm@latest
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Stage 3: Runner
FROM node:24.11.1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
