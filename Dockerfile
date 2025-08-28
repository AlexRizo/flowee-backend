# FROM node:22.16-alpine3.21 AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci

# FROM node:22.16-alpine3.21 AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npm run build

# FROM node:22.16-alpine3.21 AS runner
# WORKDIR /usr/src/app
# COPY package.json package-lock.json ./
# RUN npm install --prod
# COPY --from=builder /app/dist ./dist

# CMD ["node", "dist/main"]

# syntax=docker/dockerfile:1.6

########################
# Base
########################
FROM node:22-alpine AS base
WORKDIR /app
ENV npm_config_fund=false npm_config_audit=false

########################
# Dependencias (cachable)
########################
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package*.json ./
# Usa caché de npm del builder para no descargar todo en cada build
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

########################
# Build (transpila TS/Nest)
########################
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
# Copia solo lo necesario para compilar, así no rompes caché por cambios triviales
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

########################
# Runtime (mínimo)
########################
FROM base AS prod
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
# Quita devDependencies; evita reinstalar todo
RUN npm prune --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]