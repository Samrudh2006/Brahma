# Multi-stage Dockerfile for BRAHMA AGI Platform
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Install backend production dependencies
RUN cd backend && npm install --omit=dev

# Production Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/public ./public
COPY package*.json ./

EXPOSE 4000
CMD ["node", "backend/server.js"]
