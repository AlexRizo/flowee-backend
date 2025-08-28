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
# Base común
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
# Cachea npm para que no descargue deps cada vez
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

########################
# Build (compila TS/Nest)
########################
FROM base AS build
# Traemos node_modules ya instalados
COPY --from=deps /app/node_modules ./node_modules
# Necesitamos package.json para que exista el script "build"
COPY package*.json ./
# Archivos de configuración
COPY tsconfig*.json nest-cli.json ./
# Código fuente
COPY src ./src
# Ejecuta build definido en package.json (ej: "nest build")
RUN npm run build

########################
# Runtime (imagen mínima)
########################
FROM base AS prod
ENV NODE_ENV=production
# Copiamos manifests para que queden en la imagen final
COPY package*.json ./
# Reutilizamos dependencias de deps
COPY --from=deps /app/node_modules ./node_modules
# Eliminamos devDependencies
RUN npm prune --omit=dev
# Copiamos los artefactos compilados
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]