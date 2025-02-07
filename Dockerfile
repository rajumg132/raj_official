# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Build the application
RUN npm run build:all

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 