# Build stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with increased Node memory and specific npm config
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm install --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build:all

# Production stage
FROM node:18-alpine

# Install production dependencies only
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies with increased Node memory and specific npm config
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm ci --only=production --no-audit --no-fund --prefer-offline

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