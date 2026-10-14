# Stage 1: Build the React Application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy client source files and build
COPY . .
RUN npm run build

# Stage 2: Serve with high-performance Nginx
FROM nginx:alpine

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx SPA & Proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
