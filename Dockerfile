# Build stage
FROM node:18-alpine AS builder

# Install build dependencies and clean up cache in the same layer
RUN apk add --no-cache python3 make g++ && \
    rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Set npm configurations for better performance and memory usage
ENV NODE_OPTIONS="--max-old-space-size=4096" \
    NPM_CONFIG_LOGLEVEL=error \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_PREFER_OFFLINE=true \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=600000

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm cache clean --force && \
    npm install && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build:all

# Production stage
FROM node:18-alpine

# Install production dependencies and clean up in the same layer
RUN apk add --no-cache python3 make g++ && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Set npm configurations for production
ENV NODE_ENV=production \
    NODE_OPTIONS="--max-old-space-size=2048" \
    NPM_CONFIG_LOGLEVEL=error \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_PREFER_OFFLINE=true

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm cache clean --force && \
    npm install --omit=dev --no-audit --no-fund && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# Expose the port the app runs on
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"] 