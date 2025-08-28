FROM node:22.16-alpine3.21 AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:22.16-alpine3.21 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:22.16-alpine3.21 AS runner
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --prod
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]