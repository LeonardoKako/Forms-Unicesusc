# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Instala dependências
COPY package*.json ./
RUN npm ci

# Copia código e gera o Prisma Client
COPY prisma ./prisma/
COPY prisma.config.js ./
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.js ./

EXPOSE 3000

# Script para rodar as migrações antes de iniciar o app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
