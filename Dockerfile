# Multi-stage Dockerfile for BRAHMA Sovereign 24/7 Cloud Computer & AGI Platform
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
RUN cd backend && npm install --omit=dev

# Production Cloud Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=7860

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/public ./public
COPY --from=builder /app/plans ./plans
COPY package*.json ./

# Hugging Face Spaces port (7860) and standard port (4000)
EXPOSE 7860
EXPOSE 4000

CMD ["node", "backend/server.js"]
