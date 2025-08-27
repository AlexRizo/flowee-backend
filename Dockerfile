# ===== Etapa 1: build =====
FROM node:20-alpine AS build
WORKDIR /app

# Instala deps con caché eficiente
COPY package*.json ./
RUN npm ci

# Copia el resto y compila Nest a /dist
COPY . .
RUN npm run build

# Deja solo deps de prod
RUN npm prune --omit=dev

# ===== Etapa 2: runtime =====
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Trae node_modules (solo prod) y el código compilado
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]