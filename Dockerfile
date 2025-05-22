# Use official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Use standalone output
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]