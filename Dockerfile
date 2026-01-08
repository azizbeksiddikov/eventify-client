# Stage 1: Dependencies
FROM node:24-alpine AS base
WORKDIR /app

# Install openssl if required (Alpine uses apk)
# Combine RUN commands to reduce layers and clean up in the same layer
RUN apk add --no-cache openssl && \
    rm -rf /var/cache/apk/*

# Copy only package files for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies and clean up npm cache
RUN npm ci --prefer-offline --no-audit --progress=false && \
    npm cache clean --force && \
    rm -rf /tmp/* /root/.npm

# Stage 2: Builder
FROM node:24-alpine AS builder
WORKDIR /app

# Copy only node_modules from base
COPY --from=base /app/node_modules ./node_modules

# Copy only necessary files for build
COPY package.json package-lock.json* ./
COPY next.config.ts tsconfig.json ./
COPY postcss.config.mjs ./
COPY next-i18next.config.js ./
COPY components.json ./
COPY apollo/ ./apollo/
COPY libs/ ./libs/
COPY public/ ./public/
COPY src/ ./src/

# Accept build arguments for environment variables
ARG NEXT_PUBLIC_API_GRAPHQL_URL
ARG NEXT_APP_API_URL

# Set them as environment variables so they are available during build (and run)
ENV NEXT_PUBLIC_API_GRAPHQL_URL=$NEXT_PUBLIC_API_GRAPHQL_URL
ENV NEXT_APP_API_URL=$NEXT_APP_API_URL

# Disable telemetry during build and optimize build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build and clean up
RUN npm run build && \
    rm -rf /tmp/* /root/.npm

# Stage 3: Runner (production-ready minimal image)
FROM node:24-alpine AS runner
WORKDIR /app

# Install only runtime dependencies
RUN apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir .next && \
    chown nextjs:nodejs .next

# Copy only production files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
