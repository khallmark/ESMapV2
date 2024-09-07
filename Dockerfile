# Use the latest Node.js LTS version as the base image
FROM node:18-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build packages
RUN pnpm run build:packages

# Build stage for backend
FROM base AS backend-builder
WORKDIR /app/apps/backend
RUN pnpm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy built backend and packages
COPY --from=backend-builder /app/apps/backend/dist ./dist
COPY --from=backend-builder /app/packages ./packages

# Copy package.json and install production dependencies
COPY package.json ./ 
RUN pnpm install --prod

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]