# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies first (cache layer)
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
RUN npm install --legacy-peer-deps

# Copy the entire project files
COPY . .

# Reset Nx project graph (optional but recommended if you had issues)
RUN npx nx reset

# Build the backend
RUN npm run build:backend

# Expose port 8080 (Cloud Run expects this)
EXPOSE 8080

# Run the backend from the correct path
CMD ["node", "dist/apps/backend/src/main.js"]
