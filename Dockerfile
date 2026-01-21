# ----------- BUILD STAGE -----------
FROM node:20-alpine AS builder
 
WORKDIR /app
 
# Install dependencies
COPY package*.json ./
RUN npm ci
 
# Copy source code
COPY . .
 
# Build Next.js
RUN npm run build
 
# ----------- RUNTIME STAGE -----------
FROM node:20-alpine
 
WORKDIR /app
ENV NODE_ENV=production
 
# Copy only what we need
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
 
EXPOSE 3000
 
CMD ["npx", "next", "start", "-p", "3000"]