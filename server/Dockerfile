# Stage 1: deps
FROM node:22-alpine AS deps
WORKDIR /app
# Install runtime libs for Prisma and update base packages
RUN apk upgrade --no-cache && apk add --no-cache openssl libstdc++ libc6-compat
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    else npm i; fi

# Stage 2: build
FROM node:22-alpine AS build
WORKDIR /app
RUN apk upgrade --no-cache && apk add --no-cache openssl libstdc++ libc6-compat
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# Stage 3: runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Only needed runtime libs
RUN apk upgrade --no-cache && apk add --no-cache openssl libstdc++ libc6-compat
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
# Use JSON-form CMD so signals are handled correctly
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
