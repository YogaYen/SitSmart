# Lightweight Node.js Alpine base
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Ensure data directory exists
RUN mkdir -p /app/data

EXPOSE 5000

ENV PORT=5000 \
    NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/healthz || exit 1

CMD ["node", "server.js"]
